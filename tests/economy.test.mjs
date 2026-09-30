// economy.test.mjs — 상점 / 장기 투자 / 가상 주식 / stockEffect / 손익 / 저장 / 이벤트 체인 / Day 28 테스트
// 실행: node tests/economy.test.mjs

import { MEMBERS, S, E, A, X, D, END, createRunner, assert, fixedRng, playGame, startDay } from './helpers.mjs';

const { test, section, finish } = createRunner();
const SAVE = await import(new URL('../js/save.js', import.meta.url));

const fresh = () => S.createInitialState(MEMBERS);
const price = (state, ticker) => state.market.stocks[ticker].currentPrice;

// 가짜 localStorage
function installStorage() {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
  return store;
}

/* ===================== 상점 ===================== */
section('[1] 상점');

test('구매하면 돈이 가격만큼 줄고 레벨이 오르며, 전 멤버 스탯이 즉시 오른다', () => {
  const state = fresh();
  const offer = X.getShopOffer(state, 'broadcastGear');
  const before = state.members.map((m) => m.stats.Bs);
  const result = X.buyShopItem(state, 'broadcastGear');
  assert(result.ok && result.level === 1, JSON.stringify(result));
  assert(state.money === S.INITIAL_MONEY - offer.price, `money ${state.money}`);
  state.members.forEach((m, i) => assert(m.stats.Bs === Math.min(100, before[i] + 2), `${m.id} Bs ${m.stats.Bs}`));
  assert(state.logs.at(-1).kind === S.LOG_KIND.SHOP, '상점 로그 없음');
});

test('레벨이 오를수록 가격이 오르고, 최대 레벨에서는 구매할 수 없다', () => {
  const state = fresh();
  state.money = 1e9;
  const item = D.getShopItem('gameGear');
  const prices = [];
  for (let level = 0; level < item.maxLevel; level += 1) {
    prices.push(X.getShopOffer(state, 'gameGear').price);
    assert(X.buyShopItem(state, 'gameGear').ok, `Lv.${level} 구매 실패`);
  }
  prices.slice(1).forEach((p, i) => assert(p > prices[i], `가격 증가 안 함 ${prices}`));
  const money = state.money;
  const result = X.buyShopItem(state, 'gameGear');
  assert(!result.ok && result.reason === 'maxLevel', JSON.stringify(result));
  assert(state.money === money && S.getState().shop.levels.gameGear === item.maxLevel, '최대 레벨에서 상태가 바뀜');
});

test('돈이 부족하면 구매되지 않고 상태도 바뀌지 않는다', () => {
  const state = fresh();
  const offer = X.getShopOffer(state, 'recordingStudio');
  state.money = offer.price - 1;
  const vc = state.members.map((m) => m.stats.Vc);
  const result = X.buyShopItem(state, 'recordingStudio');
  assert(!result.ok && result.reason === 'money', JSON.stringify(result));
  assert(state.money === offer.price - 1 && !state.shop.levels.recordingStudio, '상태가 바뀜');
  assert(state.members.every((m, i) => m.stats.Vc === vc[i]), '스탯이 바뀜');
});

test('트레이닝: 즉시 HP 회복 + 하루 회복량 증가', () => {
  const state = fresh();
  state.members.forEach((m) => { m.hp = 50; });
  X.buyShopItem(state, 'training');
  assert(state.members.every((m) => m.hp === 58), '즉시 회복 안 됨');
  S.endDay();
  const expected = 58 + S.HP_RULES.dailyRecovery + 2;
  assert(state.members.every((m) => m.hp === expected), `하루 회복 ${state.members[0].hp} ≠ ${expected}`);
});

test('콘텐츠 제작 투자: 팬 획득량이 레벨당 +5% 늘어난다 (감소에는 적용 안 함)', () => {
  const state = fresh();
  X.buyShopItem(state, 'contentBudget');
  const fans = state.fans;
  A.applyEffects(state, [], { fans: 100 });
  assert(state.fans - fans === 105, `+${state.fans - fans}`);
  A.applyEffects(state, [], { fans: -100 });
  assert(state.fans - fans === 5, '감소에도 보너스가 붙음');
});

test('장비 구매 시 장비 회사(GEAR) 주가가 오른다', () => {
  const state = fresh();
  const before = price(state, 'GEAR');
  X.buyShopItem(state, 'broadcastGear');
  assert(price(state, 'GEAR') > before, `${before} → ${price(state, 'GEAR')}`);
});

/* ===================== 장기 투자 ===================== */
section('[2] 장기 투자');

test('투자 시작: 비용 지불, 결과일 = 시작일 + 기간, 성공률 범위 내', () => {
  const state = fresh();
  state.currentDay = 5;
  const inv = D.getInvestment('broadcastEnv');
  const result = X.startInvestment(state, 'broadcastEnv');
  assert(result.ok, JSON.stringify(result));
  assert(state.money === S.INITIAL_MONEY - inv.cost, `money ${state.money}`);
  assert(result.record.resultDay === 5 + inv.duration, `resultDay ${result.record.resultDay}`);
  assert(result.record.chance >= D.INVESTMENT_RULES.minChance && result.record.chance <= D.INVESTMENT_RULES.maxChance, '성공률 범위');
});

test('중복 / 동시 한도 / 기간 부족 / 돈 부족이면 시작할 수 없다', () => {
  const state = fresh();
  state.money = 1e9;
  X.startInvestment(state, 'broadcastEnv');
  assert(X.startInvestment(state, 'broadcastEnv').reason === 'active', '중복 허용됨');
  X.startInvestment(state, 'gameContent');
  X.startInvestment(state, 'promotion');
  assert(X.startInvestment(state, 'musicProduction').reason === 'maxActive', '한도 초과 허용됨');
  const late = fresh();
  late.currentDay = 25;
  assert(X.startInvestment(late, 'bigProject').reason === 'tooLate', '기간 부족 허용됨');
  const poor = fresh();
  poor.money = 1000;
  assert(X.startInvestment(poor, 'promotion').reason === 'money', '돈 부족 허용됨');
  assert(poor.money === 1000 && poor.investments.active.length === 0, '실패했는데 상태가 바뀜');
});

test('진행 중: 결과일 전에는 정산되지 않는다', () => {
  const state = fresh();
  X.startInvestment(state, 'promotion');
  for (let day = 1; day < 1 + D.getInvestment('promotion').duration; day += 1) {
    state.currentDay = day;
    assert(A.resolveInvestments(state, fixedRng(0)).length === 0, `Day ${day}에 정산됨`);
  }
  assert(state.investments.active.length === 1, '진행 중 목록에서 사라짐');
});

test('완료 (성공): 결과일에 성공 효과 적용 + 기록 + 플래그 + 주가 영향', () => {
  const state = fresh();
  const inv = D.getInvestment('musicProduction');
  X.startInvestment(state, 'musicProduction');
  const money = state.money;
  const fans = state.fans;
  const tune = price(state, 'TUNE');
  state.currentDay = 1 + inv.duration;
  const [result] = A.resolveInvestments(state, fixedRng(0));
  assert(result.outcome === 'success', result.outcome);
  assert(state.money === money + inv.success.money, `money ${state.money - money}`);
  assert(state.fans > fans && state.flags.musicReleaseReady === true, '팬 / 플래그');
  assert(price(state, 'TUNE') > tune, 'TUNE 상승 안 함');
  assert(result.profit === inv.success.money - inv.cost, `profit ${result.profit}`);
  assert(state.investments.active.length === 0 && state.investments.history.length === 1, '기록');
  assert(state.logs.at(-1).kind === S.LOG_KIND.INVEST_RESULT, '결과 로그');
});

test('완료 (실패): 실패 효과만 적용된다', () => {
  const state = fresh();
  const inv = D.getInvestment('bigProject');
  X.startInvestment(state, 'bigProject');
  const money = state.money;
  state.currentDay = 1 + inv.duration;
  const [result] = A.resolveInvestments(state, fixedRng(0.9999));
  assert(result.outcome === 'fail', result.outcome);
  assert(state.money === money + inv.fail.money, `money ${state.money - money}`);
  assert(state.flags.bigProjectFlop === true && !state.flags.bigProjectHit, '플래그');
});

test('상점 업그레이드와 멤버 스탯이 투자 성공률을 올린다', () => {
  const state = fresh();
  const base = X.getInvestmentChance(state, 'musicProduction');
  state.money = 1e9;
  X.buyShopItem(state, 'recordingStudio');
  assert(X.getInvestmentChance(state, 'musicProduction') > base, '상승 안 함');
});

test('이벤트 효과 startInvestment: 할인된 비용으로 투자가 시작된다', () => {
  const state = fresh();
  const deltas = A.applyEffects(state, [], { startInvestment: { id: 'gameContent', costMultiplier: 0.8 } });
  const cost = Math.round(D.getInvestment('gameContent').cost * 0.8);
  assert(state.money === S.INITIAL_MONEY - cost, `money ${state.money}`);
  assert(state.investments.active[0]?.source === 'event', 'source');
  assert(deltas.some((d) => d.key === 'investment'), '표시용 변화량 없음');
});

/* ===================== 주식 매매 / 손익 ===================== */
section('[3] 주식 매수 / 매도 / 손익');

test('매수: 돈 = 가격 × 수량 + 수수료 만큼 감소, 평균 단가에 수수료 포함', () => {
  const state = fresh();
  const p = price(state, 'TUNE');
  const result = X.buyStock(state, 'TUNE', 10);
  const fee = Math.round(p * 10 * D.STOCK_RULES.feeRate);
  assert(result.ok && state.money === S.INITIAL_MONEY - p * 10 - fee, `money ${state.money}`);
  const holding = state.market.holdings.TUNE;
  assert(holding.shares === 10 && Math.abs(holding.avgCost - (p * 10 + fee) / 10) < 1e-9, JSON.stringify(holding));
});

test('매수 실패: 돈 부족 / 수량 0 / 보유 한도 초과 — 상태 변화 없음', () => {
  const state = fresh();
  state.money = 100;
  assert(X.buyStock(state, 'NOVA', 1).reason === 'money', '돈 부족');
  state.money = 1e12;
  assert(X.buyStock(state, 'NOVA', 0).reason === 'quantity', '수량 0');
  assert(X.buyStock(state, 'NOVA', 'abc').reason === 'quantity', '잘못된 수량');
  assert(X.buyStock(state, 'NOVA', D.STOCK_RULES.maxShares + 1).reason === 'maxShares', '한도');
  assert(!state.market.holdings.NOVA, '보유가 생김');
  assert(X.getMaxBuyable(state, 'NOVA') === D.STOCK_RULES.maxShares, '최대 매수 수량');
});

test('매도: 실현 손익 = (매도금액 - 수수료) - 평균단가 × 수량', () => {
  const state = fresh();
  X.buyStock(state, 'PXLG', 20);
  const avg = state.market.holdings.PXLG.avgCost;
  state.market.stocks.PXLG.currentPrice = 40000;
  const money = state.money;
  const result = X.sellStock(state, 'PXLG', 5);
  const gross = 40000 * 5;
  const fee = Math.round(gross * D.STOCK_RULES.feeRate);
  const expectedPnl = Math.round(gross - fee - avg * 5);
  assert(result.ok && result.pnl === expectedPnl, `pnl ${result.pnl} ≠ ${expectedPnl}`);
  assert(state.money === money + gross - fee, 'money');
  assert(state.market.realizedPnl === expectedPnl, 'realizedPnl');
  assert(state.market.holdings.PXLG.shares === 15 && state.market.holdings.PXLG.avgCost === avg, '부분 매도 후 평균 단가 유지');
});

test('매도 실패: 보유 수량 초과 / 미보유 — 전량 매도 시 보유 목록에서 제거', () => {
  const state = fresh();
  assert(X.sellStock(state, 'CLIP', 1).reason === 'shares', '미보유 매도');
  X.buyStock(state, 'CLIP', 3);
  assert(X.sellStock(state, 'CLIP', 4).reason === 'shares', '초과 매도');
  assert(X.sellStock(state, 'CLIP', 3).ok && !state.market.holdings.CLIP, '전량 매도');
});

test('미실현 손익 / 평가액 / 순자산 계산', () => {
  const state = fresh();
  X.buyStock(state, 'STRM', 10);
  const avg = state.market.holdings.STRM.avgCost;
  state.market.stocks.STRM.currentPrice = 50000;
  const portfolio = X.getPortfolio(state);
  assert(portfolio.totalValue === 500000, `value ${portfolio.totalValue}`);
  assert(portfolio.unrealizedPnl === Math.round(500000 - avg * 10), `unrealized ${portfolio.unrealizedPnl}`);
  assert(Math.abs(S.getUnrealizedPnl() - (500000 - avg * 10)) < 1, 'state.getUnrealizedPnl');
  assert(S.getNetWorth() === state.money + 500000, 'netWorth');
});

/* ===================== 주가 변동 / stockEffect ===================== */
section('[4] 주가 변동 / stockEffect');

test('장 마감: 종가 이력이 하루 1개씩 쌓이고, 개장 시 전일 종가가 기준이 된다', () => {
  const state = fresh();
  const len = state.market.stocks.TUNE.priceHistory.length;
  X.closeMarket(state, [], fixedRng(0.5));
  assert(state.market.stocks.TUNE.priceHistory.length === len + 1, '이력');
  X.openMarket(state);
  assert(state.market.stocks.TUNE.previousPrice === state.market.stocks.TUNE.currentPrice, '개장 기준');
});

test('랜덤 변동은 하루 제한(±maxDailyMove) 안에 있다', () => {
  const state = fresh();
  for (const r of [0, 0.9999]) {
    const before = Object.fromEntries(D.STOCKS.map((s) => [s.ticker, price(state, s.ticker)]));
    X.closeMarket(state, [], fixedRng(r));
    D.STOCKS.forEach((s) => {
      const move = price(state, s.ticker) / before[s.ticker] - 1;
      assert(Math.abs(move) <= D.STOCK_RULES.maxDailyMove + 0.001, `${s.ticker} ${move}`);
    });
  }
});

test('rng 중앙값이면 기대 변동(drift)만큼 움직인다', () => {
  const state = fresh();
  const stock = D.getStock('NOVA');
  X.closeMarket(state, [], fixedRng(0.5));
  const expected = Math.round((stock.basePrice * (1 + stock.drift)) / 10) * 10;
  assert(price(state, 'NOVA') === expected, `${price(state, 'NOVA')} ≠ ${expected}`);
});

test('콘텐츠 성공은 관련 종목을 올리고 실패는 내린다 (종목당 제한)', () => {
  const state = fresh();
  const great = Array.from({ length: 30 }, () => ({ categories: ['music'], check: { outcome: 'great' } }));
  const fail = [{ categories: ['game'], check: { outcome: 'fail' } }];
  const impact = X.getContentImpact(state, [...great, ...fail]);
  assert(impact.TUNE === D.STOCK_RULES.contentCap, `TUNE ${impact.TUNE}`);
  assert(impact.PXLG < 0 && impact.GEAR === 0, `PXLG ${impact.PXLG} GEAR ${impact.GEAR}`);
});

test('stockEffect percentage: +8% 적용', () => {
  const state = fresh();
  const before = price(state, 'TUNE');
  const [applied] = X.applyStockEffect(state, { ticker: 'TUNE', percentage: 8 });
  assert(Math.abs(price(state, 'TUNE') / before - 1.08) < 0.001 && applied.percent === 8, `${applied.percent}`);
});

test('stockEffect 는 1회 변동 제한(maxEventMove)을 넘지 않는다', () => {
  const state = fresh();
  const before = price(state, 'CLIP');
  X.applyStockEffect(state, { ticker: 'CLIP', percentage: 80 });
  assert(price(state, 'CLIP') / before - 1 <= D.STOCK_RULES.maxEventMove + 0.001, '상한 초과');
  X.applyStockEffect(state, { ticker: 'CLIP', percentage: -99 });
  assert(price(state, 'CLIP') >= D.STOCK_RULES.minPrice, '최저가 미만');
});

test('stockEffect fixedChange / 배열 / 모르는 종목 무시', () => {
  const state = fresh();
  const gear = price(state, 'GEAR');
  const applied = X.applyStockEffect(state, [{ ticker: 'GEAR', fixedChange: 1200 }, { ticker: 'NOPE', percentage: 5 }, { ticker: 'STRM', percentage: -3 }]);
  assert(price(state, 'GEAR') === gear + 1200, `GEAR ${price(state, 'GEAR')}`);
  assert(applied.length === 2 && applied.every((a) => a.ticker !== 'NOPE'), JSON.stringify(applied));
});

test('이벤트 데이터의 stockEffect 는 장 시작 때 반영되고(시장 소식 로그), 선택 시 다시 적용되지 않는다', () => {
  const state = fresh();
  const event = E.getEventById('ev_m02'); // TUNE -6%, CLIP +2%
  state.schedule = state.members.map((m) => ({ memberId: m.id, activityId: 'sing', kind: 'routine', eventId: null, done: false }));
  const entry = state.schedule[0];
  entry.kind = S.ENTRY_KIND.IMPORTANT;
  entry.eventId = event.id;
  const tune = price(state, 'TUNE');
  const clip = price(state, 'CLIP');
  A.applyScheduledStockEffects(state);
  assert(Math.abs(price(state, 'TUNE') / tune - 0.94) < 0.001 && price(state, 'CLIP') > clip, '장 시작 반영 안 됨');
  assert(state.logs.at(-1).kind === S.LOG_KIND.MARKET_NEWS && entry.stockNews.length === 2, '시장 소식 로그');

  // 이벤트를 본 뒤 선택해도 주가는 더 움직이지 않는다 → 선행매매로 이득을 볼 수 없다.
  const afterOpen = price(state, 'TUNE');
  S.setSelectedMember(entry.memberId);
  S.setCurrentEvent(event);
  const log = A.resolveChoice(state, E.getAvailableChoices(event, state, entry.memberId)[0].choice);
  assert(price(state, 'TUNE') === afterOpen, '선택 시 다시 적용됨');
  assert(!log.deltas.some((d) => d.key === 'stock'), JSON.stringify(log.deltas));
});

test('선택지 효과의 stockEffect 는 선택할 때 적용된다', () => {
  const state = fresh();
  const clip = price(state, 'CLIP');
  const deltas = A.applyEffects(state, [], { money: -120000, stockEffect: { ticker: 'CLIP', percentage: 2 } });
  assert(price(state, 'CLIP') > clip && deltas.some((d) => d.key === 'stock' && d.ticker === 'CLIP'), JSON.stringify(deltas));
});

/* ===================== 이벤트 조건 / 체인 ===================== */
section('[5] 이벤트 조건 / 체인');

test('afterEventId: 발생 후 minDays 가 지나야 통과', () => {
  const state = fresh();
  const check = E.CONDITION_CHECKS.afterEventId;
  state.currentDay = 10;
  assert(!check({ state }, { id: 'ch_concert_1', minDays: 4 }), '미발생인데 통과');
  state.eventHistory.ch_concert_1 = 8;
  assert(!check({ state }, { id: 'ch_concert_1', minDays: 4 }), '2일 경과인데 통과');
  state.eventHistory.ch_concert_1 = 6;
  assert(check({ state }, { id: 'ch_concert_1', minDays: 4 }), '4일 경과인데 불통과');
});

test('once: 한 번 발생한 이벤트는 다시 후보가 되지 않는다', () => {
  const state = fresh();
  const member = state.members.find((m) => m.id === 'lize');
  const activity = E.getActivityById('recording');
  assert(E.collectCandidates(member, state, { activity }).some((e) => e.id === 'ch_lize_1'), '처음에는 후보');
  state.eventHistory.ch_lize_1 = 1;
  assert(!E.collectCandidates(member, state, { activity }).some((e) => e.id === 'ch_lize_1'), '두 번째도 후보');
});

test('forced: Day 1 방향 회의와 주간 회의(Day 7)는 반드시 배정된다', () => {
  for (let i = 0; i < 50; i += 1) {
    const state = fresh();
    assert(E.planDay(state).some((e) => e.eventId === 'ev_w01'), 'Day 1 누락');
    state.currentDay = 7;
    assert(E.planDay(state).some((e) => e.eventId === 'ev_w02'), 'Day 7 누락');
  }
});

test('체인: 콘서트 제안 → (4일 후) 리허설이 반드시 배정 → 리허설 결과에 따라 당일 선택지가 달라진다', () => {
  const state = fresh();
  state.flags.concertPlanned = true;
  state.eventHistory.ch_concert_1 = 3;
  state.currentDay = 7;
  assert(E.planDay(state).some((e) => e.eventId === 'ch_concert_2'), '리허설 미배정');

  const day = E.getEventById('ch_concert_3');
  const texts = (flags) => {
    const st = fresh();
    Object.assign(st.flags, flags);
    st.schedule = st.members.map((m) => ({ memberId: m.id, activityId: 'sing', kind: 'routine', done: false }));
    return E.getAvailableChoices(day, st, 'yuni').map(({ choice }) => choice.text);
  };
  const good = texts({ concertPlanned: true, rehearsalGood: true });
  const rough = texts({ concertPlanned: true, rehearsalRough: true });
  assert(good.includes('리허설대로 완벽한 무대를 선보인다') && !good.includes('부족한 부분은 토크와 이벤트로 채운다'), good.join(' / '));
  assert(rough.includes('부족한 부분은 토크와 이벤트로 채운다') && !rough.includes('리허설대로 완벽한 무대를 선보인다'), rough.join(' / '));
});

test('체인 (멤버): 리제 편곡 선택이 공개 이벤트 선택지를 바꾼다', () => {
  const event = E.getEventById('ch_lize_3');
  const texts = (flag) => {
    const st = fresh();
    st.members.find((m) => m.id === 'lize').flags = { lizeAlbumWork: true, [flag]: true };
    st.schedule = st.members.map((m) => ({ memberId: m.id, activityId: 'chat', kind: 'routine', done: false }));
    return E.getAvailableChoices(event, st, 'lize').map(({ choice }) => choice.text);
  };
  assert(texts('lizeBold').includes('파격 편곡 버전을 프리미어로 공개한다'), 'bold');
  assert(texts('lizeClassic').includes('정통 편곡 버전을 공개한다') && !texts('lizeClassic').includes('파격 편곡 버전을 프리미어로 공개한다'), 'classic');
});

test('멤버 11명 모두 개인 이벤트를 2개 이상 가진다', () => {
  MEMBERS.forEach((m) => {
    const count = E.EVENTS.filter((e) => e.memberId === m.id).length;
    assert(count >= 2, `${m.id}: ${count}개`);
  });
});

/* ===================== 저장 / 불러오기 ===================== */
section('[6] 저장 / 불러오기');

test('저장 후 불러오면 상점·투자·주식·가격 이력·손익이 모두 복원된다', () => {
  installStorage();
  const state = fresh();
  startDay(state);
  state.money = 5_000_000;
  X.buyShopItem(state, 'gameGear');
  X.startInvestment(state, 'promotion');
  X.buyStock(state, 'TUNE', 12);
  X.closeMarket(state, [], fixedRng(0.8));
  X.sellStock(state, 'TUNE', 2);
  const snapshot = JSON.parse(JSON.stringify(state));
  assert(SAVE.saveGame(state) && SAVE.hasSave(), '저장 실패');

  fresh(); // 다른 상태로 덮어쓴 뒤
  const loaded = SAVE.loadGame();
  assert(loaded, '불러오기 실패');
  assert(loaded.money === snapshot.money && loaded.currentDay === snapshot.currentDay, 'money / day');
  assert(loaded.shop.levels.gameGear === 1, 'shop');
  assert(loaded.investments.active[0]?.id === 'promotion', 'investment');
  assert(loaded.market.holdings.TUNE.shares === 10, 'holdings');
  assert(loaded.market.realizedPnl === snapshot.market.realizedPnl, 'realizedPnl');
  assert(loaded.market.stocks.TUNE.priceHistory.length === snapshot.market.stocks.TUNE.priceHistory.length, 'history');
  assert(loaded.market.stocks.TUNE.currentPrice === snapshot.market.stocks.TUNE.currentPrice, 'price');
  assert(Math.round(S.getUnrealizedPnl()) === Math.round(S.getUnrealizedPnl(snapshot)), '미실현 손익');
  assert(loaded.schedule.length === 11, 'schedule');
  assert(loaded === S.getState(), '현재 상태로 설정되지 않음');
});

// 콜라보 하나를 처리한 상태를 만든다: { state, hostId, partnerIds }
function playOneCollab(partnerCount = 2) {
  const state = fresh();
  startDay(state);
  const host = state.schedule.find((entry) => entry.kind === 'routine');
  Object.assign(host, { kind: 'collab', eventId: 'collab_001', activityId: 'chat' });
  S.setSelectedMember(host.memberId);
  S.setCurrentEvent(E.getEventById('collab_001'));
  const partnerIds = state.members.filter((m) => S.isSelectablePartner(m.id)).slice(0, partnerCount).map((m) => m.id);
  S.setCollabPartners(partnerIds);
  A.resolveChoice(state, E.getAvailableChoices(E.getEventById('collab_001'), state, host.memberId)[0].choice);
  S.setCurrentEvent(null);
  S.setSelectedMember(null);
  S.setCollabPartners([]);
  return { state, hostId: host.memberId, partnerIds };
}

test('콜라보 파트너 기록(주최 → 파트너 목록, 파트너 → 주최)이 저장 / 복원된다', () => {
  installStorage();
  const { state, hostId, partnerIds } = playOneCollab(2);
  assert(JSON.stringify(S.getScheduleEntry(hostId).collabPartnerIds) === JSON.stringify(partnerIds), '처리 직후 주최 기록 없음');
  SAVE.saveGame(state);
  fresh();
  const loaded = SAVE.loadGame();
  const host = loaded.schedule.find((e) => e.memberId === hostId);
  assert(JSON.stringify(host.collabPartnerIds) === JSON.stringify(partnerIds), `주최: ${JSON.stringify(host)}`);
  partnerIds.forEach((id) => {
    const partner = loaded.schedule.find((e) => e.memberId === id);
    assert(partner.collabHostId === hostId && partner.kind === 'collab' && partner.done, `파트너: ${JSON.stringify(partner)}`);
  });
});

test('예전 세이브(파트너 기록 없음)는 오늘의 콜라보 로그로 파트너 기록을 채운다', () => {
  const store = installStorage();
  const { state, hostId, partnerIds } = playOneCollab(2);
  const data = JSON.parse(JSON.stringify(state));
  // 예전 형식: 주최 쪽 목록 없음, 파트너 쪽 기록도 한 명은 없음
  data.schedule.forEach((entry) => {
    delete entry.collabPartnerIds;
    if (entry.memberId === partnerIds[1]) {
      delete entry.collabHostId;
      entry.kind = 'routine';
    }
  });
  store.set(SAVE.SAVE_KEY, JSON.stringify({ version: 1, state: data }));
  const loaded = SAVE.loadGame();
  const host = loaded.schedule.find((e) => e.memberId === hostId);
  assert(JSON.stringify(host.collabPartnerIds) === JSON.stringify(partnerIds), `주최: ${JSON.stringify(host)}`);
  const second = loaded.schedule.find((e) => e.memberId === partnerIds[1]);
  assert(second.collabHostId === hostId && second.kind === 'collab', `파트너: ${JSON.stringify(second)}`);
});

test('잘못된 파트너 기록(없는 멤버 / 자기 자신)은 걸러진다', () => {
  const store = installStorage();
  const { state, hostId, partnerIds } = playOneCollab(1);
  const data = JSON.parse(JSON.stringify(state));
  data.schedule.find((e) => e.memberId === hostId).collabPartnerIds = [partnerIds[0], 'ghost', hostId, 7];
  data.schedule.find((e) => e.memberId === partnerIds[0]).collabHostId = partnerIds[0];
  store.set(SAVE.SAVE_KEY, JSON.stringify({ version: 1, state: data }));
  const loaded = SAVE.loadGame();
  assert(JSON.stringify(loaded.schedule.find((e) => e.memberId === hostId).collabPartnerIds) === JSON.stringify(partnerIds), '주최 목록 정리 안 됨');
  // 자기 자신을 주최로 가리키던 파트너 기록은 버려지고, 로그로 다시 채워진다.
  assert(loaded.schedule.find((e) => e.memberId === partnerIds[0]).collabHostId === hostId, '파트너 기록 복구 안 됨');
});

test('이벤트 화면에서 저장되면 일정표 상태로 복원된다', () => {
  installStorage();
  const state = fresh();
  startDay(state);
  S.setGamePhase(S.GAME_PHASE.EVENT);
  S.setCurrentEvent(E.getEventById('event_001'));
  SAVE.saveGame(state);
  const loaded = SAVE.loadGame();
  assert(loaded.gamePhase === S.GAME_PHASE.DAY_BOARD && loaded.currentEvent === null, loaded.gamePhase);
});

test('깨진 JSON / 형식이 다른 데이터: null 을 돌려주고 새 게임 상태가 된다 (예외 없음)', () => {
  const store = installStorage();
  for (const raw of ['{broken', '"text"', '[]', '{"state": 5}', 'null']) {
    store.set(SAVE.SAVE_KEY, raw);
    const result = SAVE.loadGame();
    assert(result === null, `${raw} → ${result}`);
    assert(S.getState().money === S.INITIAL_MONEY && S.getState().currentDay === 1, '새 게임 아님');
  }
});

test('일부 값이 잘못된 저장: 잘못된 값만 기본값으로 대체된다', () => {
  const store = installStorage();
  const state = fresh();
  startDay(state);
  const data = JSON.parse(JSON.stringify(state));
  data.money = 'lots';
  data.currentDay = 999;
  data.members[0].stats.Bs = 999;
  data.members[1].hp = -50;
  data.shop = { levels: { gameGear: 99, fake: 3 } };
  data.investments = { active: [{ id: 'nope' }, { id: 'promotion', startDay: 1, resultDay: 5, cost: 200000, chance: 0.8 }], history: 'x' };
  data.market.holdings = { TUNE: { shares: -5, avgCost: 100 }, FAKE: { shares: 3, avgCost: 1 }, PXLG: { shares: 4, avgCost: 30000 } };
  data.market.stocks.TUNE.currentPrice = Number.NaN;
  data.eventHistory = { event_001: 1, not_real: 3 };
  data.schedule = [{ memberId: 'x' }];
  data.gamePhase = 'weird';
  store.set(SAVE.SAVE_KEY, JSON.stringify({ version: 1, state: data }));
  const loaded = SAVE.loadGame();
  assert(loaded, '불러오기 실패');
  assert(loaded.money === S.INITIAL_MONEY && loaded.currentDay === S.MAX_DAY, `money ${loaded.money} day ${loaded.currentDay}`);
  assert(loaded.members[0].stats.Bs === 100 && loaded.members[1].hp === 0, 'clamp');
  assert(loaded.shop.levels.gameGear === D.getShopItem('gameGear').maxLevel && !('fake' in loaded.shop.levels), 'shop');
  assert(loaded.investments.active.length === 1 && Array.isArray(loaded.investments.history), 'investments');
  assert(!loaded.market.holdings.TUNE && !loaded.market.holdings.FAKE && loaded.market.holdings.PXLG.shares === 4, 'holdings');
  assert(loaded.market.stocks.TUNE.currentPrice === D.getStock('TUNE').basePrice, 'NaN 가격');
  assert(!('not_real' in loaded.eventHistory) && loaded.eventHistory.event_001 === 1, 'eventHistory');
  assert(loaded.schedule.length === 0 && loaded.gamePhase === S.GAME_PHASE.DAY_BOARD, '손상된 일정은 비워지고 일정표로');
});

test('localStorage 가 없는 환경에서도 저장 / 불러오기가 예외 없이 동작한다', () => {
  delete globalThis.localStorage;
  const state = fresh();
  startDay(state);
  assert(SAVE.saveGame(state) === false && SAVE.hasSave() === false && SAVE.loadGame() === null, '예상과 다름');
});

/* ===================== Day 28 ===================== */
section('[7] Day 28 정상 종료');

test('28일을 끝까지 진행하면 Day 28 에서 멈추고 최종 평가가 나온다', () => {
  const state = playGame({
    manager: (st) => {
      if (st.currentDay === 2) X.buyShopItem(st, 'training');
      if (st.currentDay === 3) X.startInvestment(st, 'promotion');
      if (st.currentDay === 4) X.buyStock(st, 'NOVA', 5);
    },
  });
  assert(state.currentDay === S.MAX_DAY && S.isLastDay(), `day ${state.currentDay}`);
  assert(state.gamePhase === S.GAME_PHASE.GAME_END, state.gamePhase);
  assert(state.investments.active.length === 0, '끝나지 않은 투자가 남음');
  assert(state.market.stocks.NOVA.priceHistory.length === S.MAX_DAY + 1, `이력 ${state.market.stocks.NOVA.priceHistory.length}`);
  const ending = END.evaluateEnding(state);
  assert(Number.isFinite(ending.score) && ending.grade?.grade, JSON.stringify(ending.grade));
  assert(state.logs.some((log) => log.day === 28 && log.title === '마지막 날 특별 방송'), 'Day 28 특별 이벤트 누락');
});

finish();
