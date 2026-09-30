// helpers.mjs — 테스트 공용 도우미
// DOM 없이 실제 게임 모듈로 하루를 진행한다. (진행 순서는 js/main.js 와 같다)

const js = (file) => new URL(`../js/${file}`, import.meta.url);

export const { MEMBERS } = await import(js('members.js'));
export const S = await import(js('state.js'));
export const E = await import(js('events.js'));
export const A = await import(js('actions.js'));
export const X = await import(js('economy.js'));
export const D = await import(js('economy-data.js'));
export const END = await import(js('ending.js'));

/* ---------- 작은 테스트 러너 ---------- */

export function createRunner() {
  let passed = 0;
  const failures = [];
  return {
    test(name, fn) {
      try {
        fn();
        passed += 1;
        console.log(`  ✔ ${name}`);
      } catch (error) {
        failures.push(name);
        console.log(`  ✘ ${name}\n      ${error.message}`);
      }
    },
    section(title) {
      console.log(`\n${title}`);
    },
    finish() {
      console.log(`\n${passed} passed, ${failures.length} failed`);
      if (failures.length) process.exit(1);
    },
  };
}

export function assert(cond, message) {
  if (!cond) throw new Error(message);
}

// 고정 값을 돌려주는 rng (판정 / 투자 / 주가를 결정적으로 만들 때)
export const fixedRng = (value) => () => value;

/* ---------- 하루 진행 (main.js 와 같은 순서) ---------- */

export function startDay(state) {
  S.beginDay();
  X.openMarket(state);
  A.resolveInvestments(state);
  S.setSchedule(E.planDay(state));
  A.applyScheduledStockEffects(state);
  S.setGamePhase(S.GAME_PHASE.DAY_BOARD);
}

const randomPick = (list) => list[Math.floor(Math.random() * list.length)];

// 오늘의 중요 이벤트 / 콜라보를 모두 처리한다.
export function resolveDecisions(state, { pickChoice = randomPick, pickPartnerCount = () => 1 + Math.floor(Math.random() * 2) } = {}) {
  let resolved = 0;
  for (const entry of S.getPendingDecisions()) {
    if (entry.done) continue;
    const event = E.getEventById(entry.eventId);
    S.setSelectedMember(entry.memberId);
    S.setCurrentEvent(event);
    S.setCollabPartners([]);
    if (event.collab) {
      const candidates = state.members.filter((member) => S.isSelectablePartner(member.id)).map((member) => member.id);
      const count = Math.min(pickPartnerCount(), event.collab.max - 1, candidates.length);
      S.setCollabPartners(candidates.slice(0, Math.max(count, event.collab.min - 1)));
    }
    const available = E.getAvailableChoices(event, state, entry.memberId);
    if (available.length === 0) throw new Error(`선택지 0개: ${event.id}`);
    const log = A.resolveChoice(state, pickChoice(available).choice);
    if (!log) throw new Error(`처리 실패: ${event.id}`);
    S.setCurrentEvent(null);
    S.setSelectedMember(null);
    S.setCollabPartners([]);
    resolved += 1;
  }
  if (S.getPendingDecisions().length > 0) throw new Error('처리하지 못한 결정이 남았다');
  return resolved;
}

export function finishDay(state) {
  A.resolveRoutines(state);
  X.closeMarket(state, S.getTodayLogs());
  if (!S.isDayComplete()) throw new Error('하루가 완료되지 않았다');
}

// 28일 전체를 진행한다. manager(state) 는 매일 아침 매니저 행동(상점 / 투자 / 주식)을 한다.
export function playGame({ manager = () => {}, pickChoice, pickPartnerCount, onDayEnd = () => {} } = {}) {
  const state = S.createInitialState(MEMBERS);
  for (;;) {
    startDay(state);
    manager(state);
    resolveDecisions(state, { pickChoice, pickPartnerCount });
    finishDay(state);
    onDayEnd(state);
    if (S.isLastDay()) break;
    S.endDay();
  }
  S.setGamePhase(S.GAME_PHASE.GAME_END);
  return state;
}
