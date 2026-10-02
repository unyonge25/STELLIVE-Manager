// schedule.test.mjs — 일정 조건 자동 테스트
// 실행: 프로젝트 폴더에서 node tests/schedule.test.mjs
// (js/ 모듈은 DOM 을 쓰지 않는 members / state / events 만 불러온다.)

const { MEMBERS } = await import(new URL('../js/members.js', import.meta.url));
const S = await import(new URL('../js/state.js', import.meta.url));
const E = await import(new URL('../js/events.js', import.meta.url));

let passed = 0;
const failures = [];
function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  ✔ ${name}`);
  } catch (error) {
    failures.push(name);
    console.log(`  ✘ ${name}\n      ${error.message}`);
  }
}
function assert(cond, message) {
  if (!cond) throw new Error(message);
}

const hasCat = (activity, cat) => activity.categories.includes(cat);
const eventIds = (list) => list.map((event) => event.id);

// 한 멤버가 특정 일정인 상태를 만든다.
function setup(memberId, activityId, hp = 80) {
  S.createInitialState(MEMBERS);
  const st = S.getState();
  st.members.forEach((m) => { m.hp = hp; });
  st.schedule = st.members.map((m) => ({ memberId: m.id, activityId, kind: 'routine', done: false }));
  return { st, member: st.members.find((m) => m.id === memberId), activity: E.getActivityById(activityId) };
}

function choiceTexts(eventId, activityId, memberId = 'yuni') {
  const { st } = setup(memberId, activityId);
  return E.getAvailableChoices(E.getEventById(eventId), st, memberId).map(({ choice }) => choice.text);
}

/* ---------- 0. 데이터 무결성 ---------- */
console.log('\n[0] 데이터 무결성');

test('모든 이벤트 / 선택지 조건 키가 CONDITION_CHECKS 에 등록되어 있다 (오타 방지)', () => {
  const unknown = [];
  E.EVENTS.forEach((event) => {
    Object.keys(event.conditions || {}).forEach((key) => { if (!E.CONDITION_CHECKS[key]) unknown.push(`${event.id}.${key}`); });
    (event.choices || []).forEach((choice, i) =>
      Object.keys(choice.conditions || {}).forEach((key) => { if (!E.CONDITION_CHECKS[key]) unknown.push(`${event.id}.choices[${i}].${key}`); }));
  });
  assert(unknown.length === 0, `등록되지 않은 조건 키: ${unknown.join(', ')}`);
});

test('일정 / 이벤트 / 선택지에 쓰인 카테고리가 모두 ACTIVITY_CATEGORIES 에 있다', () => {
  const known = Object.keys(E.ACTIVITY_CATEGORIES);
  const bad = [];
  const checkList = (where, list = []) => list.forEach((c) => { if (!known.includes(c)) bad.push(`${where}:${c}`); });
  E.ACTIVITIES.forEach((a) => { assert(Array.isArray(a.categories) && a.categories.length > 0, `${a.id} 에 categories 가 없다`); checkList(a.id, a.categories); });
  E.EVENTS.forEach((event) => {
    checkList(event.id, event.conditions?.activityCategories);
    checkList(event.id, event.conditions?.blockedActivityCategories);
    checkList(event.id, Object.keys(event.activityWeights || {}));
    (event.choices || []).forEach((choice, i) => {
      checkList(`${event.id}[${i}]`, choice.conditions?.activityCategories);
      checkList(`${event.id}[${i}]`, choice.conditions?.blockedActivityCategories);
    });
  });
  assert(bad.length === 0, `정의되지 않은 카테고리: ${bad.join(', ')}`);
});

/* ---------- 1. 중요 이벤트의 일정 조건 ---------- */
console.log('\n[1] 중요 이벤트 일정 조건 (모든 멤버 × 모든 일정 × HP 정상/탈진)');

// 모든 조합에서 후보 목록을 모은다.
const candidateMatrix = [];
for (const m of MEMBERS) {
  for (const a of E.ACTIVITIES) {
    for (const hp of [80, 20]) {
      const { st, member, activity } = setup(m.id, a.id, hp);
      member.flags.coverReady = hp === 20; // 후속 이벤트 조건도 섞는다
      candidateMatrix.push({ memberId: m.id, activity, hp, ids: eventIds(E.collectCandidates(member, st, { activity })) });
    }
  }
}

// 같은 상황의 원본 1-step 이벤트와 스토리 변형(group)을 한 묶음으로 본다.
// 원본이 weight 0 으로 내려가고 변형이 대신 나오므로, 등장 검사는 id 하나가 아니라 묶음 단위로 한다.
// (원본만 있든 변형만 있든 묶음 중 하나가 나오면 된다. 묶음 전체가 후보에서 사라지면 실패한다)
const SITUATIONS = {
  game_tournament_offer: 'event_002',
  viewer_participation: 'event_205',
  late_stream: 'event_001',
  impromptu_sing: 'event_101',
};
const situationIds = (group) => [SITUATIONS[group], ...E.EVENTS.filter((event) => event.group === group).map((event) => event.id)];
const hasSituation = (ids, group) => situationIds(group).some((id) => ids.includes(id));
const situationOf = (eventId) => Object.keys(SITUATIONS).find((group) => situationIds(group).includes(eventId)) || null;
// "이 일정에서는 나오지 않는다" 검사가 묶음이 아예 후보에 없어서 통과하는 일이 없도록, 어딘가에서는 후보가 되는지 함께 본다.
const assertSomewhereCandidate = (group) =>
  assert(candidateMatrix.some(({ ids }) => hasSituation(ids, group)), `${group}(${situationIds(group).join(', ')}) 가 어떤 일정에서도 후보가 아니다`);

test('game_tournament_offer(event_002 또는 변형)는 노래 / 녹음 / 휴방 일정에서 후보가 되지 않는다', () => {
  assertSomewhereCandidate('game_tournament_offer');
  const bad = candidateMatrix.filter(({ activity, ids }) => hasSituation(ids, 'game_tournament_offer') && (hasCat(activity, 'music') || hasCat(activity, 'rest')));
  assert(bad.length === 0, bad.map((b) => `${b.memberId}@${b.activity.id}`).join(', '));
});

test('모든 게임 일정에서 game_tournament_offer(event_002 또는 변형)가 후보가 된다 (모든 멤버, HP 정상)', () => {
  E.ACTIVITIES.filter((a) => hasCat(a, 'game')).forEach((a) => {
    candidateMatrix.filter((r) => r.activity.id === a.id && r.hp === 80).forEach((row) => {
      assert(hasSituation(row.ids, 'game_tournament_offer'), `${row.memberId}@${a.id} 에서 후보가 아니다`);
    });
  });
});

test('viewer_participation(event_205 또는 변형)은 방송이 아닌 일정(녹음 / 휴방)에서 후보가 되지 않는다', () => {
  assertSomewhereCandidate('viewer_participation');
  const bad = candidateMatrix.filter(({ activity, ids }) => hasSituation(ids, 'viewer_participation') && !hasCat(activity, 'broadcast'));
  assert(bad.length === 0, bad.map((b) => `${b.memberId}@${b.activity.id}`).join(', '));
});

test('late_stream(event_001 또는 변형) / impromptu_sing(event_101 또는 변형)도 방송이 아닌 일정에서 후보가 되지 않는다', () => {
  assertSomewhereCandidate('late_stream');
  assertSomewhereCandidate('impromptu_sing');
  const bad = candidateMatrix.filter(({ activity, ids }) => (hasSituation(ids, 'late_stream') || hasSituation(ids, 'impromptu_sing')) && !hasCat(activity, 'broadcast'));
  assert(bad.length === 0, bad.map((b) => `${b.memberId}@${b.activity.id}`).join(', '));
});

// 음악 카테고리 콜라보: 일정 조건이 음악 카테고리를 요구하거나, 음악 일정만 허용한다.
// (특정 id 로 고정하지 않는다: 원본이 내려가고 스토리 변형이 대신 나와도 같은 규칙으로 검사한다)
const isMusicCollab = (event) => {
  const c = event.conditions || {};
  if (c.activityCategories) return c.activityCategories.includes('music');
  if (c.activity) return c.activity.every((id) => hasCat(E.getActivityById(id), 'music'));
  return false;
};

test('콜라보 이벤트는 휴방 날 후보가 되지 않고, 녹음 날에는 음악 카테고리 콜라보만 (1개 이상) 후보가 된다', () => {
  for (const m of MEMBERS) {
    for (const a of E.ACTIVITIES) {
      const { st, member, activity } = setup(m.id, a.id);
      const events = E.collectCandidates(member, st, { activity, collab: true });
      const ids = eventIds(events);
      if (a.id === 'rest') assert(ids.length === 0, `휴방 날 콜라보: ${ids}`);
      if (a.id === 'recording') {
        assert(ids.length > 0, `${m.id}: 녹음 날 콜라보 후보가 없다`);
        assert(events.every(isMusicCollab), `녹음 날 음악이 아닌 콜라보: ${eventIds(events.filter((e) => !isMusicCollab(e)))}`);
      }
    }
  }
});

/* ---------- 2. 등장 빈도 (fallback / 과소 등장 확인) ---------- */
console.log('\n[2] 등장 빈도 (planDay 20,000회)');

const N = 20000;

// planDay 를 n 번 돌려 중요 이벤트 등장 수를 센다.
function runPlanDays(n) {
  const result = { perEvent: {}, perPair: {}, perGroup: {}, perGroupPair: {}, zeroImportantDays: 0, importantTotal: 0 };
  S.createInitialState(MEMBERS);
  for (let i = 0; i < n; i += 1) {
    const st = S.getState();
    st.currentDay = 1 + (i % 28);
    st.eventHistory = {};
    st.members.forEach((m, idx) => { m.hp = (i + idx) % 9 === 0 ? 20 : 80; });
    const schedule = E.planDay(st);
    const imp = schedule.filter((e) => e.kind === 'important');
    if (imp.length === 0) result.zeroImportantDays += 1;
    result.importantTotal += imp.length;
    imp.forEach((e) => {
      result.perEvent[e.eventId] = (result.perEvent[e.eventId] || 0) + 1;
      result.perPair[`${e.eventId}@${e.activityId}`] = (result.perPair[`${e.eventId}@${e.activityId}`] || 0) + 1;
      const group = situationOf(e.eventId);
      if (group) {
        result.perGroup[group] = (result.perGroup[group] || 0) + 1;
        result.perGroupPair[`${group}@${e.activityId}`] = (result.perGroupPair[`${group}@${e.activityId}`] || 0) + 1;
      }
    });
  }
  return result;
}

// 비교 기준: 같은 이벤트 풀에서 game_tournament_offer / viewer_participation 묶음(원본 + 변형)의 일정 조건·일정 가중치만 뺀 경우
function withoutActivityConditions(ids, fn) {
  const saved = ids.map((id) => {
    const event = E.getEventById(id);
    const backup = { conditions: event.conditions, activityWeights: event.activityWeights };
    const { activityCategories, blockedActivityCategories, ...rest } = event.conditions || {};
    event.conditions = rest;
    delete event.activityWeights;
    return { event, backup };
  });
  try {
    return fn();
  } finally {
    saved.forEach(({ event, backup }) => {
      event.conditions = backup.conditions;
      if (backup.activityWeights) event.activityWeights = backup.activityWeights;
    });
  }
}

const withConditions = runPlanDays(N);
const baseline = withoutActivityConditions([...situationIds('game_tournament_offer'), ...situationIds('viewer_participation')], () => runPlanDays(N));
const { perGroup, perGroupPair, zeroImportantDays, importantTotal } = withConditions;
const groupPair = (group, act) => perGroupPair[`${group}@${act}`] || 0;

test('실제 하루 계획에서도 game_tournament_offer(event_002 또는 변형)가 노래 / 녹음 / 휴방 일정에 0회 등장한다 (다른 일정에서는 등장)', () => {
  assert((perGroup.game_tournament_offer || 0) > 0, 'game_tournament_offer 가 한 번도 등장하지 않았다');
  const n = groupPair('game_tournament_offer', 'sing') + groupPair('game_tournament_offer', 'recording') + groupPair('game_tournament_offer', 'rest');
  assert(n === 0, `${n}회 등장`);
});

test('실제 하루 계획에서도 viewer_participation(event_205 또는 변형)이 녹음 / 휴방 일정에 0회 등장한다 (다른 일정에서는 등장)', () => {
  assert((perGroup.viewer_participation || 0) > 0, 'viewer_participation 이 한 번도 등장하지 않았다');
  const n = groupPair('viewer_participation', 'recording') + groupPair('viewer_participation', 'rest');
  assert(n === 0, `${n}회 등장`);
});

test('중요 이벤트가 0개인 날이 없다 (하루 최소 1개 fallback)', () => {
  assert(zeroImportantDays === 0, `${zeroImportantDays}일`);
});

// 수정 전 기준값 (같은 조건의 planDay 20,000회): 하루 2.21개, event_002 8,930회, event_205 12,785회
test('하루 중요 이벤트 수가 수정 전(2.21개)에서 크게 줄지 않는다 (±15% 이내)', () => {
  const perDay = importantTotal / N;
  assert(perDay >= 2.21 * 0.85, `하루 ${perDay.toFixed(2)}개`);
});

// 이벤트 풀이 커지면 개별 이벤트의 절대 빈도는 자연히 줄어든다.
// 그래서 고정 숫자 대신, 같은 풀에서 일정 조건이 없을 때와 비교해 조건 때문에 과소 등장하지 않는지 확인한다.
test('game_tournament_offer(event_002 또는 변형) 등장 수가 일정 조건이 없을 때의 70% 이상 유지된다', () => {
  const base = baseline.perGroup.game_tournament_offer || 0;
  assert(base > 0, '비교 기준에서도 한 번도 등장하지 않았다');
  assert((perGroup.game_tournament_offer || 0) >= base * 0.7, `${perGroup.game_tournament_offer || 0}회 / 조건 없음 ${base}회`);
});

test('viewer_participation(event_205 또는 변형) 등장 수가 일정 조건이 없을 때의 70% 이상 유지된다', () => {
  const base = baseline.perGroup.viewer_participation || 0;
  assert(base > 0, '비교 기준에서도 한 번도 등장하지 않았다');
  assert((perGroup.viewer_participation || 0) >= base * 0.7, `${perGroup.viewer_participation || 0}회 / 조건 없음 ${base}회`);
});

test('game_tournament_offer(event_002 또는 변형)는 게임 일정에서 우선 등장한다 (게임 일정 1개당 평균 > 비게임 방송 일정 1개당 평균)', () => {
  const game = E.ACTIVITIES.filter((a) => hasCat(a, 'game')).map((a) => a.id);
  const nonGame = E.ACTIVITIES.filter((a) => hasCat(a, 'broadcast') && !hasCat(a, 'game') && !hasCat(a, 'music')).map((a) => a.id);
  const avg = (ids) => ids.reduce((s, id) => s + groupPair('game_tournament_offer', id), 0) / ids.length;
  assert(avg(game) > avg(nonGame), `게임 ${avg(game).toFixed(0)} vs 비게임 ${avg(nonGame).toFixed(0)}`);
});

/* ---------- 3. 콜라보 선택지 필터 ---------- */
console.log('\n[3] 합방 제안(collab_001) 선택지 필터');

const RELAY = '노래 릴레이 방송을 연다';
const FPS = 'FPS 스쿼드를 짜서 같이 달린다';
const FIGHT = '격투게임 대전으로 맞붙는다';
const GAME = '다 같이 게임 한 판 붙는다';
const TALK = '토크 중심 합방으로 수다를 푼다';

test('FPS 날: 노래 릴레이 숨김, FPS 합방 표시, 일반 게임 합방 숨김', () => {
  const t = choiceTexts('collab_001', 'fps');
  assert(!t.includes(RELAY) && t.includes(FPS) && !t.includes(GAME) && !t.includes(FIGHT), t.join(' / '));
});

test('격투게임 날: 노래 릴레이 숨김, 격투 합방 표시', () => {
  const t = choiceTexts('collab_001', 'fighting');
  assert(!t.includes(RELAY) && t.includes(FIGHT) && !t.includes(FPS) && !t.includes(GAME), t.join(' / '));
});

test('노래 방송 날: 노래 릴레이 표시, 게임 합방 숨김', () => {
  const t = choiceTexts('collab_001', 'sing');
  assert(t.includes(RELAY) && !t.includes(FPS) && !t.includes(FIGHT) && !t.includes(GAME), t.join(' / '));
});

test('그 외 게임 날(리듬 / 인디 / 오픈월드 / 공포): 일반 게임 합방 표시, 노래 릴레이 숨김', () => {
  ['rhythm', 'indie', 'openWorld', 'horror'].forEach((a) => {
    const t = choiceTexts('collab_001', a);
    assert(t.includes(GAME) && !t.includes(RELAY), `${a}: ${t.join(' / ')}`);
  });
});

test('방송 날에는 항상 토크 합방이 표시된다', () => {
  E.ACTIVITIES.filter((a) => hasCat(a, 'broadcast')).forEach((a) => {
    assert(choiceTexts('collab_001', a.id).includes(TALK), a.id);
  });
});

/* ---------- 4. 유효 선택지 0개 방지 ---------- */
console.log('\n[4] 유효 선택지 0개 방지');

// 스토리 이벤트는 노드마다 "조건 없는 선택지 1개 이상"을 스키마 검증이 보장한다. (story.test.mjs)
test('모든 이벤트 × 모든 일정 × 모든 멤버에서 선택지가 최소 1개 남는다 (등장하지 않는 조합 포함)', () => {
  const empty = [];
  for (const event of E.EVENTS.filter((item) => !E.isStoryEvent(item))) {
    for (const a of E.ACTIVITIES) {
      for (const m of MEMBERS) {
        const { st } = setup(m.id, a.id);
        if (E.getAvailableChoices(event, st, m.id).length === 0) empty.push(`${event.id}@${a.id}/${m.id}`);
      }
    }
  }
  assert(empty.length === 0, empty.slice(0, 10).join(', '));
});

test('조건에 맞는 선택지가 없으면 fallback 선택지를 보여준다 (휴방 날 합방 → 토크)', () => {
  const t = choiceTexts('collab_001', 'rest');
  assert(t.length === 1 && t[0] === TALK, t.join(' / '));
});

test('fallback 선택지조차 없으면 전체 선택지를 보여준다', () => {
  const { st } = setup('yuni', 'rest');
  const fake = { id: 'fake', choices: [{ text: 'A', conditions: { activityCategories: ['music'] } }, { text: 'B', conditions: { activityCategories: ['game'] } }] };
  assert(E.getAvailableChoices(fake, st, 'yuni').length === 2, 'fallback 동작 안 함');
});

test('숨겨진 선택지를 골라도 처리되지 않는다 (원래 index 로 검증)', () => {
  const { st } = setup('yuni', 'fps');
  const available = E.getAvailableChoices(E.getEventById('collab_001'), st, 'yuni');
  const relayIndex = E.getEventById('collab_001').choices.findIndex((c) => c.text === RELAY);
  assert(!available.some((item) => item.index === relayIndex), '노래 릴레이 index 가 허용됨');
});

/* ---------- 결과 ---------- */
console.log('\n[빈도 요약]');
console.log(`  하루 중요 이벤트 ${(importantTotal / N).toFixed(2)}개 (수정 전 2.21) · 중요 이벤트 없는 날 ${zeroImportantDays}`);
console.log(`  game_tournament_offer ${perGroup.game_tournament_offer || 0}회 (일정 조건 없을 때 ${baseline.perGroup.game_tournament_offer || 0}) · viewer_participation ${perGroup.viewer_participation || 0}회 (일정 조건 없을 때 ${baseline.perGroup.viewer_participation || 0})`);
console.log('  game_tournament_offer 일정별: ' + E.ACTIVITIES.map((a) => `${a.id} ${groupPair('game_tournament_offer', a.id)}`).join(', '));
console.log('  viewer_participation 일정별: ' + E.ACTIVITIES.map((a) => `${a.id} ${groupPair('viewer_participation', a.id)}`).join(', '));

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
