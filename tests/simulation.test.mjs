// simulation.test.mjs — 28일 전체 시뮬레이션 (기본 200회)
// 실행: node tests/simulation.test.mjs [횟수]
// 무작위 선택 + 무작위 매니저 행동(상점 / 투자 / 주식)으로 끝까지 진행하며, 매일 상태가 유효한지 검사한다.

import { S, E, D, X, END, createRunner, assert, playGame } from './helpers.mjs';

const RUNS = Number(process.argv[2] || 200);
const { test, section, finish } = createRunner();

const stats = { days: 0, decisions: 0, great: 0, success: 0, fail: 0, shop: 0, invest: 0, trades: 0, scores: [], grades: {}, events: new Set(), chains: {} };
const errors = [];

function randomManager(state) {
  const roll = Math.random();
  if (roll < 0.25) {
    const item = D.SHOP_ITEMS[Math.floor(Math.random() * D.SHOP_ITEMS.length)];
    if (X.buyShopItem(state, item.id).ok) stats.shop += 1;
  } else if (roll < 0.45) {
    const investment = D.INVESTMENTS[Math.floor(Math.random() * D.INVESTMENTS.length)];
    if (X.startInvestment(state, investment.id).ok) stats.invest += 1;
  } else if (roll < 0.7) {
    const stock = D.STOCKS[Math.floor(Math.random() * D.STOCKS.length)];
    const held = state.market.holdings[stock.ticker]?.shares || 0;
    const result = held > 0 && Math.random() < 0.5
      ? X.sellStock(state, stock.ticker, 1 + Math.floor(Math.random() * held))
      : X.buyStock(state, stock.ticker, 1 + Math.floor(Math.random() * 20));
    if (result.ok) stats.trades += 1;
  }
}

// 매일 끝에 검사하는 불변 조건
function checkInvariants(state) {
  const problems = [];
  if (!Number.isFinite(state.money) || !Number.isFinite(state.fans) || !Number.isFinite(state.fame)) problems.push('수치가 유한하지 않음');
  if (state.fans < 0 || state.fame < 0) problems.push('팬 / 명성 음수');
  state.members.forEach((m) => {
    if (m.hp < 0 || m.hp > 100) problems.push(`${m.id} HP ${m.hp}`);
    Object.values(m.stats).forEach((v) => { if (v < 0 || v > 100) problems.push(`${m.id} stat ${v}`); });
    if (!m.todayCompleted) problems.push(`${m.id} 미완료`);
  });
  Object.entries(state.market.stocks).forEach(([ticker, q]) => {
    if (!Number.isFinite(q.currentPrice) || q.currentPrice < D.STOCK_RULES.minPrice) problems.push(`${ticker} 가격 ${q.currentPrice}`);
    const last = q.priceHistory.at(-1);
    if (last.day !== state.currentDay || last.price !== q.currentPrice) problems.push(`${ticker} 종가 이력 불일치`);
  });
  Object.entries(state.market.holdings).forEach(([ticker, h]) => {
    if (h.shares <= 0 || h.shares > D.STOCK_RULES.maxShares) problems.push(`${ticker} 보유 ${h.shares}`);
  });
  if (state.investments.active.length > D.INVESTMENT_RULES.maxActive) problems.push('투자 한도 초과');
  if (state.investments.active.some((r) => r.resultDay > S.MAX_DAY)) problems.push('기간 초과 투자');
  if (Object.values(state.relationships).some((v) => v < 0 || v > 100)) problems.push('관계도 범위');
  return problems;
}

section(`[시뮬레이션] 28일 × ${RUNS}회 (무작위 선택 + 무작위 매니저 행동)`);

for (let run = 0; run < RUNS; run += 1) {
  try {
    const state = playGame({
      manager: randomManager,
      onDayEnd: (st) => {
        stats.days += 1;
        const problems = checkInvariants(st);
        if (problems.length) throw new Error(`Day ${st.currentDay}: ${problems.slice(0, 3).join(', ')}`);
      },
    });
    state.logs.forEach((log) => {
      if (log.kind === 'important' || log.kind === 'collab') {
        stats.decisions += 1;
        if (log.check) stats[log.check.outcome] += 1;
      }
    });
    Object.keys(state.eventHistory).forEach((id) => stats.events.add(id));
    ['concertSuccess', 'sponsorRenewed', 'lizeCoverHit', 'kannaLiveSuccess'].forEach((flag) => {
      if (state.flags[flag]) stats.chains[flag] = (stats.chains[flag] || 0) + 1;
    });
    if (state.currentDay !== S.MAX_DAY) throw new Error(`Day ${state.currentDay} 에서 종료`);
    const ending = END.evaluateEnding(state);
    stats.scores.push(ending.score);
    stats.grades[ending.grade.grade] = (stats.grades[ending.grade.grade] || 0) + 1;
  } catch (error) {
    errors.push(`run ${run}: ${error.message}`);
  }
}

test(`${RUNS}회 모두 오류 없이 Day ${S.MAX_DAY}까지 진행된다`, () => {
  assert(errors.length === 0, errors.slice(0, 5).join('\n      '));
});

test('매일 상태 불변 조건(범위 / 종가 이력 / 보유 한도 / 투자 기간)이 지켜진다', () => {
  assert(stats.days === RUNS * S.MAX_DAY, `${stats.days}일`);
});

test('등장한 이벤트 종류가 충분히 다양하다 (전체의 70% 이상 등장)', () => {
  const total = E.EVENTS.length;
  assert(stats.events.size >= total * 0.7, `${stats.events.size} / ${total}`);
});

const avg = stats.scores.reduce((a, b) => a + b, 0) / Math.max(stats.scores.length, 1);
console.log('\n[요약]');
console.log(`  중요 이벤트/콜라보 ${(stats.decisions / RUNS).toFixed(1)}건/게임 · 판정 대성공 ${stats.great} / 성공 ${stats.success} / 실패 ${stats.fail}`);
console.log(`  매니저 행동: 상점 ${stats.shop} · 투자 ${stats.invest} · 매매 ${stats.trades}`);
console.log(`  등장한 이벤트 ${stats.events.size}종 · 체인 완주: ${JSON.stringify(stats.chains)}`);
console.log(`  평균 점수 ${avg.toFixed(0)} · 등급 분포 ${JSON.stringify(stats.grades)}`);

finish();
