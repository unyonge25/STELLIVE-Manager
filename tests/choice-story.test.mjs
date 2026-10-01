// choice-story.test.mjs — 기존(1단계) 이벤트 선택지의 결과 이야기 (story / outcomeStories)
// 실행: node tests/choice-story.test.mjs

import { createRunner, assert, MEMBERS, S, E, A } from './helpers.mjs';

const { test, section, finish } = createRunner();

/* ---------- 가짜 DOM / 저장소 (화면 / 저장 확인용) ---------- */

const elements = {};
globalThis.document = {
  getElementById: (id) => {
    if (!elements[id]) elements[id] = { id, innerHTML: '', hidden: false, addEventListener: () => {} };
    return elements[id];
  },
};
const store = new Map();
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};

const UI = await import(new URL('../js/ui.js', import.meta.url));
const SAVE = await import(new URL('../js/save.js', import.meta.url));

/* ---------- 준비 ---------- */

// hostId 에게 eventId 를 배정하고 이벤트 화면을 연 상태 (콜라보면 파트너 1명)
function setupClassic(eventId, hostId = 'yuni', activityId = 'chat') {
  const state = S.createInitialState(MEMBERS);
  const event = E.getEventById(eventId);
  state.schedule = state.members.map((member) => ({
    memberId: member.id,
    activityId,
    kind: member.id === hostId ? (event.collab ? 'collab' : 'important') : 'routine',
    eventId: member.id === hostId ? eventId : null,
    done: false,
  }));
  S.setSelectedMember(hostId);
  S.setCurrentEvent(event);
  S.setCollabPartners(event.collab ? [state.members.find((m) => m.id !== hostId).id] : []);
  S.setGamePhase(S.GAME_PHASE.EVENT);
  return state;
}

// 판정 결과를 정해 두고 선택한다. (rollOutcome 은 Math.random 을 쓴다)
function resolveWith(state, choice, outcome) {
  const original = Math.random;
  if (choice.check && outcome) {
    const members = A.getEventParticipants(state);
    const chance = A.getSuccessChance(members, choice.check, A.getEventTimeSlot(state.currentEvent, members[0].id));
    const roll = { great: 0, success: (chance * 0.6) / 100, fail: 0.999 }[outcome];
    Math.random = () => roll;
  }
  try {
    return A.resolveChoice(state, choice);
  } finally {
    Math.random = original;
  }
}

const classicEvents = E.EVENTS.filter((event) => !E.isStoryEvent(event));
const evC01 = E.getEventById('ev_c01');
const OLD_LOG_KEYS = ['day', 'kind', 'memberIds', 'title', 'categories', 'choiceText', 'check', 'deltas'].sort().join();

/* ===================== 1. 기존 동작 유지 ===================== */
section('[1] 필드가 없는 기존 이벤트는 그대로');

test('story / outcomeStories 가 없는 모든 선택지: 기록에 storyText 가 없고 기록 항목도 이전과 같다', () => {
  let checked = 0;
  classicEvents.forEach((event) => {
    event.choices.forEach((choice) => {
      if (choice.story !== undefined || choice.outcomeStories !== undefined) return;
      ['great', 'success', 'fail'].slice(0, choice.check ? 3 : 1).forEach((outcome) => {
        const state = setupClassic(event.id);
        const log = resolveWith(state, choice, choice.check ? outcome : null);
        assert(log, `${event.id}: 처리 실패`);
        assert(!('storyText' in log), `${event.id}: storyText 가 생겼다`);
        assert(Object.keys(log).sort().join() === OLD_LOG_KEYS, `${event.id}: 기록 항목 ${Object.keys(log).join()}`);
        checked += 1;
      });
    });
  });
  assert(checked > 200, `확인한 경우 ${checked}개`);
});

test('이야기 필드는 효과 / 판정에 영향이 없다 (같은 판정 결과면 변화량이 같다)', () => {
  const choice = evC01.choices[1];
  const plain = { ...choice };
  delete plain.story;
  delete plain.outcomeStories;
  ['great', 'success', 'fail'].forEach((outcome) => {
    const withStory = resolveWith(setupClassic('ev_c01'), choice, outcome);
    const without = resolveWith(setupClassic('ev_c01'), plain, outcome);
    assert(JSON.stringify(withStory.deltas) === JSON.stringify(without.deltas), `${outcome}: 변화량이 다르다`);
    assert(JSON.stringify(withStory.check) === JSON.stringify(without.check), `${outcome}: 판정이 다르다`);
    assert(withStory.storyText && !('storyText' in without), `${outcome}: storyText`);
  });
});

/* ===================== 2. 이야기 조합 ===================== */
section('[2] story + outcomeStories 조합');

test('판정 없는 선택지: story 가 그대로 기록된다 (ev_c01 1번 / 3번)', () => {
  [0, 2].forEach((index) => {
    const log = resolveWith(setupClassic('ev_c01'), evC01.choices[index], null);
    assert(log.storyText === evC01.choices[index].story, `${index}번: ${log.storyText}`);
  });
});

test('판정 있는 선택지: story 다음에 결과별 이야기가 이어진다 (ev_c01 2번)', () => {
  const choice = evC01.choices[1];
  ['great', 'success', 'fail'].forEach((outcome) => {
    const log = resolveWith(setupClassic('ev_c01'), choice, outcome);
    assert(log.check.outcome === outcome, `판정 ${log.check.outcome}`);
    assert(log.storyText === `${choice.story} ${choice.outcomeStories[outcome]}`, `${outcome}: ${log.storyText}`);
  });
});

test('대체 규칙: great 이 없으면 success 이야기, success / fail 은 없으면 결과 이야기 없음', () => {
  const base = { text: '테스트', check: { stat: 'Bs', difficulty: 70 }, story: '앞 이야기.' };
  const only = (outcomeStories, outcome) => A.getChoiceStoryText({ ...base, outcomeStories }, outcome);
  assert(only({ success: '성공 이야기.' }, 'great') === '앞 이야기. 성공 이야기.', 'great → success');
  assert(only({ great: '대성공 이야기.', success: '성공 이야기.' }, 'great') === '앞 이야기. 대성공 이야기.', 'great 우선');
  assert(only({ great: '대성공 이야기.', fail: '실패 이야기.' }, 'success') === '앞 이야기.', 'success 없음 → 대체 안 함');
  assert(only({ success: '성공 이야기.' }, 'fail') === '앞 이야기.', 'fail 없음 → 대체 안 함');
  assert(A.getChoiceStoryText({ text: 'x', check: base.check, outcomeStories: { fail: '실패.' } }, 'fail') === '실패.', 'story 없이 결과만');
  assert(A.getChoiceStoryText({ text: 'x' }, null) === '', '둘 다 없으면 빈 문자열');
});

test('판정 없는 선택지의 outcomeStories 는 쓰이지 않는다 (판정 결과가 없으므로)', () => {
  assert(A.getChoiceStoryText({ text: 'x', story: '이야기.', outcomeStories: { success: '무시.' } }, null) === '이야기.', '판정 없이 결과 이야기가 붙음');
});

/* ===================== 3. 검증 ===================== */
section('[3] 형식 / 길이 / HTML 검사');

test('모든 기존 이벤트의 story / outcomeStories 가 형식 검사를 통과한다', () => {
  const problems = [];
  classicEvents.forEach((event) => event.choices.forEach((choice, index) => {
    E.validateChoiceStories(choice).forEach((error) => problems.push(`${event.id}.choices[${index}] ${error}`));
  }));
  assert(problems.length === 0, problems.slice(0, 5).join(' | '));
});

const badCases = [
  ['HTML 태그', { story: '<img src=x onerror=alert(1)>' }, 'HTML'],
  ['닫는 태그', { story: '이야기</p><script>' }, 'HTML'],
  ['결과 이야기 속 HTML', { check: { stat: 'Bs', difficulty: 70 }, outcomeStories: { success: '<b>굵게</b>' } }, 'HTML'],
  ['너무 긴 문장', { story: '가'.repeat(E.CHOICE_STORY_RULES.maxLength + 1) }, '자 이하'],
  ['빈 문장', { story: '   ' }, '비어 있지 않은'],
  ['문자열이 아님', { story: 42 }, '비어 있지 않은'],
  ['알 수 없는 치환어', { story: '{manager}가 웃었다.' }, '치환어'],
  ['알 수 없는 결과 키', { check: { stat: 'Bs', difficulty: 70 }, outcomeStories: { partial: '부분.' } }, '알 수 없는 결과'],
  ['판정 없는 선택지의 outcomeStories', { outcomeStories: { success: '성공.' } }, '판정(check)이 없는'],
  ['outcomeStories 가 배열', { check: { stat: 'Bs', difficulty: 70 }, outcomeStories: ['성공.'] }, '객체여야'],
];
badCases.forEach(([name, fields, keyword]) => {
  test(`거부: ${name}`, () => {
    const errors = E.validateChoiceStories({ text: '선택지', ...fields });
    assert(errors.some((line) => line.includes(keyword)), errors.join(' | ') || '오류 없음');
  });
});

test('정상 예: 치환어 / 최대 길이 문장은 통과한다', () => {
  const ok = { text: 'x', check: { stat: 'Bs', difficulty: 70 }, story: '{member}와 {partners}가 웃었다.', outcomeStories: { great: '가'.repeat(E.CHOICE_STORY_RULES.maxLength), fail: '실패.' } };
  assert(E.validateChoiceStories(ok).length === 0, E.validateChoiceStories(ok).join(' | '));
});

test('실행 중 방어: 형식이 잘못된 문장은 기록에 넣지 않고, 올바른 문장만 남긴다', () => {
  const state = setupClassic('ev_c01');
  const choice = { ...evC01.choices[1], story: '<img src=x onerror=alert(1)>', outcomeStories: { success: '무사히 끝났다.' } };
  const log = resolveWith(state, choice, 'success');
  assert(log.storyText === '무사히 끝났다.', log.storyText);
  const allBad = resolveWith(setupClassic('ev_c01'), { text: 'x', story: '<script>' }, null);
  assert(!('storyText' in allBad), '잘못된 문장만 있을 때 storyText 가 생겼다');
});

/* ===================== 4. 화면 / 저장 ===================== */
section('[4] 결과 배너 / 결과 목록 / 저장 후 불러오기');

const handlers = new Proxy({}, { get: () => () => {} });
const app = () => elements.app.innerHTML;

function renderPhase(state, phase) {
  S.setGamePhase(phase);
  UI.render(state, handlers, {});
  return app();
}

test('직전 결과 배너: 고른 선택지 + 이야기가 함께 나오고, 치환어 / 조사가 바뀐다', () => {
  const state = setupClassic('ev_c01', 'rin');
  resolveWith(state, evC01.choices[1], 'success');
  S.setCurrentEvent(null);
  S.setSelectedMember(null);
  const page = renderPhase(state, S.GAME_PHASE.DAY_BOARD);
  assert(page.includes(evC01.choices[1].text), '선택지 문장이 없다');
  assert(page.includes('아오쿠모 린은 끊기는 소리를') && page.includes(evC01.choices[1].outcomeStories.success), '이야기가 없다 / 치환 안 됨');
  assert(!page.includes('{member}'), '치환어가 그대로 남았다');
});

test('하루 결과 목록: 결과 이야기(result__story)가 나온다', () => {
  const state = setupClassic('ev_c01', 'yuni');
  resolveWith(state, evC01.choices[0], null);
  const page = renderPhase(state, S.GAME_PHASE.DAY_RESULT);
  assert(/class="result__story">아야츠노 유니가 방송을 잠시 멈추고/.test(page), '결과 목록에 이야기가 없다');
});

test('필드가 없는 기존 이벤트의 배너는 이전처럼 선택지 문장만 나온다', () => {
  const state = setupClassic('event_201', 'yuni', 'longStream');
  resolveWith(state, E.getEventById('event_201').choices[1], null);
  const page = renderPhase(state, S.GAME_PHASE.DAY_BOARD);
  assert(page.includes('목표 하나만 달성하고 마무리한다') && !page.includes('result__story'), '이전과 다르다');
});

test('결과가 나온 뒤 저장 → 불러오기: 배너와 결과 목록에 이야기가 그대로 나온다', () => {
  const state = setupClassic('ev_c01', 'rin');
  const log = resolveWith(state, evC01.choices[1], 'fail');
  S.setCurrentEvent(null);
  S.setSelectedMember(null);
  S.setGamePhase(S.GAME_PHASE.DAY_BOARD);
  assert(SAVE.saveGame(state), '저장 실패');
  const loaded = SAVE.loadGame();
  const restored = loaded.logs.find((item) => item.title === evC01.title);
  assert(restored?.storyText === log.storyText, `복원된 storyText: ${restored?.storyText}`);
  const board = renderPhase(loaded, S.GAME_PHASE.DAY_BOARD);
  assert(board.includes(evC01.choices[1].outcomeStories.fail), '불러온 뒤 배너에 이야기가 없다');
  const result = renderPhase(loaded, S.GAME_PHASE.DAY_RESULT);
  assert(result.includes('result__story') && result.includes(evC01.choices[1].outcomeStories.fail), '불러온 뒤 결과 목록에 이야기가 없다');
});

finish();
