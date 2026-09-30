// balance.report.mjs — 전략별 밸런스 리포트 (테스트가 아니라 수치 확인용)
// 실행: node tests/balance.report.mjs [전략당 횟수]
// 이벤트 선택은 모든 전략이 같은 방식(무작위)으로 하고, 매니저 행동만 다르게 해서 최종 점수를 비교한다.

import { S, D, X, END, playGame } from './helpers.mjs';

const RUNS = Number(process.argv[2] || 300);
const RESERVE = 250000;

function buyCheapestShop(state, reserve = RESERVE, filter = () => true) {
  for (;;) {
    const offers = D.SHOP_ITEMS.filter(filter)
      .map((item) => X.getShopOffer(state, item.id))
      .filter((offer) => !offer.maxed && state.money - offer.price >= reserve)
      .sort((a, b) => a.price - b.price);
    if (offers.length === 0 || !X.buyShopItem(state, offers[0].item.id).ok) return;
  }
}

function startAffordableInvestments(state, reserve = RESERVE, ids = D.INVESTMENTS.map((i) => i.id)) {
  ids.forEach((id) => {
    const investment = D.getInvestment(id);
    if (state.money - investment.cost >= reserve) X.startInvestment(state, id);
  });
}

function buyStockBasket(state, ratio) {
  const budget = state.money * ratio;
  const per = budget / D.STOCKS.length;
  D.STOCKS.forEach((stock) => {
    const qty = Math.floor(per / (state.market.stocks[stock.ticker].currentPrice * (1 + D.STOCK_RULES.feeRate)));
    if (qty > 0) X.buyStock(state, stock.ticker, Math.min(qty, D.STOCK_RULES.maxShares));
  });
}

const STRATEGIES = {
  '돈 보유': () => {},
  '상점만': (state) => buyCheapestShop(state),
  '투자만': (state) => startAffordableInvestments(state),
  '주식만 (분산 보유)': (state) => { if (state.currentDay === 1) buyStockBasket(state, 0.8); },
  '주식만 (매일 추세 매매)': (state) => {
    // 전날 오른 종목을 사고 내린 종목을 판다.
    D.STOCKS.forEach((stock) => {
      const quote = state.market.stocks[stock.ticker];
      const history = quote.priceHistory;
      if (history.length < 2) return;
      const up = history.at(-1).price > history.at(-2).price;
      const held = state.market.holdings[stock.ticker]?.shares || 0;
      if (up) X.buyStock(state, stock.ticker, Math.floor(Math.max(state.money - RESERVE, 0) / 6 / quote.currentPrice));
      else if (held) X.sellStock(state, stock.ticker, held);
    });
  },
  // 초반에 상점을 2레벨까지 올려 멤버와 투자 성공률을 강화하고, 이후 투자를 돌리며 일부는 주식으로 보유한다.
  '혼합': (state) => {
    if (state.currentDay <= 4) buyCheapestShop(state, 300000, (item) => (state.shop.levels[item.id] || 0) < 2);
    startAffordableInvestments(state);
    if (state.currentDay === 10) buyStockBasket(state, 0.15);
  },
};

console.log(`전략별 ${RUNS}회 · 이벤트 선택은 무작위\n`);
const rows = [];
for (const [name, manager] of Object.entries(STRATEGIES)) {
  const scores = [];
  const grades = {};
  let fans = 0;
  let netWorth = 0;
  let growth = 0;
  for (let i = 0; i < RUNS; i += 1) {
    const state = playGame({ manager });
    const ending = END.evaluateEnding(state);
    scores.push(ending.score);
    grades[ending.grade.grade] = (grades[ending.grade.grade] || 0) + 1;
    fans += state.fans;
    netWorth += S.getNetWorth(state);
    growth += ending.breakdown.find((b) => b.key === 'statGrowth').value;
  }
  const mean = scores.reduce((a, b) => a + b, 0) / RUNS;
  const sd = Math.sqrt(scores.reduce((a, b) => a + (b - mean) ** 2, 0) / RUNS);
  rows.push({ name, mean, sd, fans: fans / RUNS, netWorth: netWorth / RUNS, growth: growth / RUNS, grades });
}

rows.sort((a, b) => b.mean - a.mean);
rows.forEach((r) => {
  const grades = ['S', 'A', 'B', 'C', 'D'].map((g) => `${g}${r.grades[g] || 0}`).join(' ');
  console.log(
    `${r.name.padEnd(16)} 평균 ${r.mean.toFixed(0).padStart(4)} (±${r.sd.toFixed(0)})  팬 ${Math.round(r.fans).toLocaleString('ko-KR').padStart(7)}  순자산 ${Math.round(r.netWorth / 10000).toLocaleString('ko-KR').padStart(5)}만  스탯 +${r.growth.toFixed(1)}  ${grades}`,
  );
});
const best = rows[0].mean;
const worst = rows.at(-1).mean;
console.log(`\n최고-최저 차이 ${(best - worst).toFixed(0)}점 (${((best / worst - 1) * 100).toFixed(1)}%)`);
