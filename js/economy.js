// economy.js — 상점 / 장기 투자(시작) / 가상 주식시장 로직
// 데이터는 economy-data.js, 투자 "결과" 적용은 효과 시스템을 쓰는 actions.js 가 담당한다.

import {
  getShopItem,
  getShopPrice,
  getInvestment,
  getShopInvestmentBonus,
  INVESTMENT_RULES,
  STOCKS,
  STOCK_RULES,
  getStock,
} from './economy-data.js';
import { LIMITS, LOG_KIND, MAX_DAY, STAT_KEYS, addLog } from './state.js';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundPrice(value) {
  return Math.max(STOCK_RULES.minPrice, Math.round(value / 10) * 10);
}

/* ===================== 상점 ===================== */

export function getShopLevel(state, itemId) {
  return state.shop.levels[itemId] || 0;
}

// 화면 / 판정용 상품 정보
export function getShopOffer(state, itemId) {
  const item = getShopItem(itemId);
  if (!item) return null;
  const level = getShopLevel(state, itemId);
  const maxed = level >= item.maxLevel;
  const price = maxed ? null : getShopPrice(item, level);
  return { item, level, maxed, price, affordable: !maxed && state.money >= price };
}

// 구매: 성공하면 즉시 상태에 반영한다. { ok, reason?, price?, level? }
export function buyShopItem(state, itemId) {
  const offer = getShopOffer(state, itemId);
  if (!offer) return { ok: false, reason: 'unknown' };
  if (offer.maxed) return { ok: false, reason: 'maxLevel' };
  if (!offer.affordable) return { ok: false, reason: 'money' };

  const { item, price } = offer;
  state.money -= price;
  state.shop.levels[item.id] = offer.level + 1;

  // 즉시 효과: 전 멤버 스탯 / HP
  const { stats, hp } = item.perLevel;
  state.members.forEach((member) => {
    STAT_KEYS.forEach((key) => {
      if (stats?.[key]) member.stats[key] = clamp(member.stats[key] + stats[key], LIMITS.stat.min, LIMITS.stat.max);
    });
    if (hp) member.hp = clamp(member.hp + hp, LIMITS.hp.min, LIMITS.hp.max);
  });

  // 장비 회사 주가 소폭 상승
  STOCKS.filter((stock) => stock.shopLinked).forEach((stock) =>
    applyPriceChange(state, stock.ticker, STOCK_RULES.shopImpact),
  );

  addLog({
    day: state.currentDay,
    kind: LOG_KIND.SHOP,
    memberIds: [],
    title: `${item.icon} ${item.label} Lv.${offer.level + 1}`,
    deltas: [{ key: 'money', delta: -price }],
  });

  return { ok: true, price, level: offer.level + 1 };
}

/* ===================== 장기 투자 ===================== */

function getAverageStat(state, stat) {
  if (!stat) return null;
  const keys = stat === 'all' ? STAT_KEYS : [stat];
  const total = state.members.reduce(
    (sum, member) => sum + keys.reduce((acc, key) => acc + member.stats[key], 0) / keys.length,
    0,
  );
  return total / state.members.length;
}

// 성공률 (0~1): 기본 + 관련 스탯 평균 보정 + 상점 보너스
export function getInvestmentChance(state, investmentId) {
  const investment = getInvestment(investmentId);
  if (!investment) return 0;
  const average = getAverageStat(state, investment.stat);
  const statBonus = average === null ? 0 : (average - INVESTMENT_RULES.statPivot) * INVESTMENT_RULES.statFactor;
  const shopBonus = getShopInvestmentBonus(state.shop.levels, investmentId);
  return clamp(
    investment.baseChance + statBonus + shopBonus,
    INVESTMENT_RULES.minChance,
    INVESTMENT_RULES.maxChance,
  );
}

// 시작 가능 여부: null 이면 가능, 아니면 이유 문자열
export function getInvestmentBlocker(state, investmentId, { costMultiplier = 1 } = {}) {
  const investment = getInvestment(investmentId);
  if (!investment) return 'unknown';
  if (state.investments.active.some((item) => item.id === investmentId)) return 'active';
  if (state.investments.active.length >= INVESTMENT_RULES.maxActive) return 'maxActive';
  if (state.currentDay + investment.duration > MAX_DAY) return 'tooLate';
  if (state.money < Math.round(investment.cost * costMultiplier)) return 'money';
  return null;
}

// 투자 시작. 성공률은 시작 시점에 확정한다. (이벤트에서 할인된 비용으로 시작할 수도 있다)
export function startInvestment(state, investmentId, { costMultiplier = 1, source = 'manager', log = true } = {}) {
  const blocker = getInvestmentBlocker(state, investmentId, { costMultiplier });
  if (blocker) return { ok: false, reason: blocker };

  const investment = getInvestment(investmentId);
  const cost = Math.round(investment.cost * costMultiplier);
  const record = {
    id: investment.id,
    startDay: state.currentDay,
    resultDay: state.currentDay + investment.duration,
    cost,
    chance: getInvestmentChance(state, investment.id),
    source,
  };
  state.money -= cost;
  state.investments.active.push(record);

  // 이벤트에서 시작한 투자는 이벤트 로그에 비용이 이미 기록되므로 따로 남기지 않는다.
  if (log) addLog({
    day: state.currentDay,
    kind: LOG_KIND.INVEST_START,
    memberIds: [],
    title: `${investment.icon} ${investment.label} 시작 (Day ${record.resultDay} 결과)`,
    deltas: [{ key: 'money', delta: -cost }],
  });

  return { ok: true, record };
}

export function getDueInvestments(state) {
  return state.investments.active.filter((item) => item.resultDay <= state.currentDay);
}

/* ===================== 가상 주식 ===================== */

// 가격을 비율만큼 움직인다. cap 으로 1회 변동을 제한하고, 실제 적용된 비율을 돌려준다.
export function applyPriceChange(state, ticker, ratio, cap = STOCK_RULES.maxEventMove) {
  const quote = state.market.stocks[ticker];
  if (!quote || !Number.isFinite(ratio)) return 0;
  const limited = clamp(ratio, -cap, cap);
  const before = quote.currentPrice;
  quote.currentPrice = roundPrice(before * (1 + limited));
  return (quote.currentPrice - before) / before;
}

// 이벤트 / 투자의 stockEffect 적용 (즉시 반영)
//  - { ticker, percentage: 8 } → +8%
//  - { ticker, fixedChange: 1500 } → +1,500원 (비율로 환산해 같은 제한을 받는다)
//  - 배열이면 여러 종목
// 반환: [{ ticker, percent }] (실제 적용된 % — 소수 첫째 자리)
export function applyStockEffect(state, effect) {
  const effects = Array.isArray(effect) ? effect : [effect];
  return effects
    .filter((item) => item && getStock(item.ticker))
    .map((item) => {
      const quote = state.market.stocks[item.ticker];
      let ratio = 0;
      if (typeof item.percentage === 'number') ratio = item.percentage / 100;
      else if (typeof item.fixedChange === 'number') ratio = item.fixedChange / quote.currentPrice;
      const applied = applyPriceChange(state, item.ticker, ratio);
      return { ticker: item.ticker, percent: Math.round(applied * 1000) / 10 };
    })
    .filter((item) => item.percent !== 0);
}

// 하루 시작: 오늘 변동률의 기준을 어제 종가로 맞춘다.
export function openMarket(state) {
  Object.values(state.market.stocks).forEach((quote) => {
    quote.previousPrice = quote.currentPrice;
  });
}

// 오늘 콘텐츠 결과 → 종목별 영향 (logs 의 categories + check.outcome)
export function getContentImpact(state, logs) {
  const impact = {};
  STOCKS.forEach((stock) => {
    const score = logs.reduce((sum, log) => {
      if (!log.check || !log.categories) return sum;
      const related = log.categories.some((category) => stock.sectors.includes(category));
      return related ? sum + (STOCK_RULES.outcomeScore[log.check.outcome] || 0) : sum;
    }, 0);
    impact[stock.ticker] = clamp(
      score * STOCK_RULES.contentSensitivity,
      -STOCK_RULES.contentCap,
      STOCK_RULES.contentCap,
    );
  });
  return impact;
}

// 장 마감: 랜덤 + 기대 변동 + 오늘 콘텐츠 결과를 합쳐 종가를 정한다. (하루 변동 제한)
export function closeMarket(state, todayLogs, rng = Math.random) {
  const impact = getContentImpact(state, todayLogs);
  STOCKS.forEach((stock) => {
    const quote = state.market.stocks[stock.ticker];
    const noise = (rng() + rng() - 1) * stock.volatility * 2;
    const move = stock.drift + noise + impact[stock.ticker];
    applyPriceChange(state, stock.ticker, move, STOCK_RULES.maxDailyMove);
    quote.priceHistory.push({ day: state.currentDay, price: quote.currentPrice });
  });
}

export function getChangeRate(quote) {
  if (!quote || !quote.previousPrice) return 0;
  return (quote.currentPrice - quote.previousPrice) / quote.previousPrice;
}

function tradeLog(state, title, moneyDelta, extra = {}) {
  addLog({
    day: state.currentDay,
    kind: LOG_KIND.TRADE,
    memberIds: [],
    title,
    deltas: [{ key: 'money', delta: moneyDelta }],
    ...extra,
  });
}

function normalizeQuantity(quantity) {
  const value = Math.floor(Number(quantity));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

// 매수 가능 최대 수량 (돈 / 보유 한도 고려)
export function getMaxBuyable(state, ticker) {
  const quote = state.market.stocks[ticker];
  if (!quote) return 0;
  const unit = quote.currentPrice * (1 + STOCK_RULES.feeRate);
  const byMoney = Math.floor(Math.max(state.money, 0) / unit);
  const held = state.market.holdings[ticker]?.shares || 0;
  return Math.max(0, Math.min(byMoney, STOCK_RULES.maxShares - held));
}

// 매수: 수수료는 평균 단가(원가)에 포함한다.
export function buyStock(state, ticker, quantity) {
  const stock = getStock(ticker);
  const quote = state.market.stocks[ticker];
  const qty = normalizeQuantity(quantity);
  if (!stock || !quote) return { ok: false, reason: 'unknown' };
  if (qty === 0) return { ok: false, reason: 'quantity' };

  const holding = state.market.holdings[ticker] || { shares: 0, avgCost: 0 };
  if (holding.shares + qty > STOCK_RULES.maxShares) return { ok: false, reason: 'maxShares' };

  const gross = quote.currentPrice * qty;
  const fee = Math.round(gross * STOCK_RULES.feeRate);
  const total = gross + fee;
  if (state.money < total) return { ok: false, reason: 'money' };

  state.money -= total;
  state.market.feesPaid += fee;
  holding.avgCost = (holding.avgCost * holding.shares + total) / (holding.shares + qty);
  holding.shares += qty;
  state.market.holdings[ticker] = holding;

  tradeLog(state, `📈 ${stock.name}(${ticker}) ${qty}주 매수`, -total);
  return { ok: true, qty, total, fee };
}

// 매도: 실현 손익 = (매도 금액 - 수수료) - 평균 단가 × 수량
export function sellStock(state, ticker, quantity) {
  const stock = getStock(ticker);
  const quote = state.market.stocks[ticker];
  const holding = state.market.holdings[ticker];
  const qty = normalizeQuantity(quantity);
  if (!stock || !quote) return { ok: false, reason: 'unknown' };
  if (qty === 0) return { ok: false, reason: 'quantity' };
  if (!holding || holding.shares < qty) return { ok: false, reason: 'shares' };

  const gross = quote.currentPrice * qty;
  const fee = Math.round(gross * STOCK_RULES.feeRate);
  const proceeds = gross - fee;
  const pnl = Math.round(proceeds - holding.avgCost * qty);

  state.money += proceeds;
  state.market.feesPaid += fee;
  state.market.realizedPnl += pnl;
  holding.shares -= qty;
  if (holding.shares === 0) delete state.market.holdings[ticker];

  tradeLog(state, `📉 ${stock.name}(${ticker}) ${qty}주 매도`, proceeds, { pnl });
  return { ok: true, qty, proceeds, fee, pnl };
}

// 화면 / 결과용 요약
export function getPortfolio(state) {
  const rows = STOCKS.map((stock) => {
    const quote = state.market.stocks[stock.ticker];
    const holding = state.market.holdings[stock.ticker];
    const shares = holding?.shares || 0;
    const value = shares * quote.currentPrice;
    return {
      stock,
      quote,
      changeRate: getChangeRate(quote),
      shares,
      avgCost: holding?.avgCost || 0,
      value,
      unrealized: shares > 0 ? Math.round(value - holding.avgCost * shares) : 0,
    };
  });
  return {
    rows,
    totalValue: rows.reduce((sum, row) => sum + row.value, 0),
    unrealizedPnl: rows.reduce((sum, row) => sum + row.unrealized, 0),
    realizedPnl: state.market.realizedPnl,
    feesPaid: state.market.feesPaid,
  };
}
