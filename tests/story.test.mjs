// story.test.mjs — 스토리(멀티스텝) 이벤트 시스템 테스트
// 실행: node tests/story.test.mjs [시뮬레이션 횟수]

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRunner, assert, MEMBERS, S, E, A, ST, playGame, playStory } from './helpers.mjs';

const schema = await import(new URL('../js/story-schema.js', import.meta.url));
const SAVE = await import(new URL('../js/save.js', import.meta.url));

const { test, section, finish } = createRunner();
const RUNS = Number(process.argv[2] || 200);

/* ---------- 준비 ---------- */

// 가짜 localStorage (저장 / 불러오기 테스트용)
const store = new Map();
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};

// hostId 에게 eventId 스토리를 배정하고 시작한 상태를 만든다.
function setupStory(eventId, hostId = 'yuni', { activityId = 'fps', hp = 80, day = 5 } = {}) {
  const state = S.createInitialState(MEMBERS);
  state.currentDay = day;
  state.members.forEach((member) => { member.hp = hp; });
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
  S.setCollabPartners([]);
  S.setGamePhase(S.GAME_PHASE.EVENT);
  ST.startStory(state, event, hostId);
  return { state, event };
}

// 현재 판정 노드의 성공률에 맞춰 원하는 결과가 나오는 rng
function rngFor(state, outcome) {
  const chance = ST.getStoryCheckChance(state);
  const value = {
    great: chance * A.CHECK_RULES.greatRatio * 0.5,
    success: chance * (A.CHECK_RULES.greatRatio + 1) / 2,
    partial: chance + (100 - chance) * ST.STORY_RULES.partialRatio * 0.5,
    fail: 99.9,
  }[outcome];
  return () => value / 100;
}

const go = (state, action, rng) => {
  assert(ST.advanceStory(state, action, rng), `진행 실패: ${JSON.stringify(action)} @ ${state.storyRun.stepId}`);
};
const cont = (state) => go(state, { type: 'continue' });
const choose = (state, index) => go(state, { type: 'choose', index });
const roll = (state, outcome) => go(state, { type: 'roll' }, rngFor(state, outcome));

const baseEvent = () => JSON.parse(JSON.stringify(E.getEventById('st_broadcast_screen_freeze')));
const ctx = () => E.buildStoryContext();
const errorsOf = (event) => schema.validateStoryEvent(event, ctx()).errors;

/* ===================== 1. 데이터 ===================== */
section('[1] 샘플 이벤트 데이터');

const storyEvents = E.EVENTS.filter(E.isStoryEvent);

test('샘플 스토리 이벤트 8개가 모두 검증을 통과해 게임에 들어왔다 (거부 0개)', () => {
  assert(storyEvents.length >= 8, `${storyEvents.length}개`);
  assert(E.REJECTED_STORY_EVENTS.length === 0, JSON.stringify(E.REJECTED_STORY_EVENTS).slice(0, 300));
});

test('샘플은 서로 다른 유형(게임 대회 / 음악 / 방송 돌발 / 콜라보 / 사업 / 팬 이벤트)을 포함한다', () => {
  const categories = new Set(storyEvents.map((event) => event.category));
  ['game', 'music', 'broadcast', 'collaboration', 'business', 'fan'].forEach((category) => assert(categories.has(category), `${category} 없음`));
  const themes = new Set(storyEvents.map((event) => event.meta.theme));
  assert(themes.size >= 6, `theme ${themes.size}종`);
});

// 판정(check) 노드 없이 만든 스토리 이벤트 허용 목록.
// 원본 1-step 이벤트에 판정이 없어(pe_hina_1, pe_tabi_1) 그 성격을 유지한 변형만 넣는다. 결말 2종류 이상 규칙은 그대로 적용된다.
const NO_CHECK_ALLOWED = ['st_member_hina_1_a', 'st_member_hina_1_b', 'st_member_tabi_1_a', 'st_member_tabi_1_b'];

test('판정이 있는 샘플은 부분성공 결과를 가진 판정을 포함하고, 판정 없는 샘플은 허용 목록에만 있으며, 모두 결말이 2종류 이상이다', () => {
  const problems = [];
  storyEvents.forEach((event) => {
    const nodes = Object.values(event.steps);
    const checks = nodes.filter((node) => node.type === 'check');
    if (checks.length === 0) {
      if (!NO_CHECK_ALLOWED.includes(event.id)) problems.push(`${event.id}: 판정 없음 (허용 목록에 없다)`);
    } else if (!checks.some((node) => node.outcomes.partial)) {
      problems.push(`${event.id}: partial 없음`);
    }
    if (new Set(nodes.filter((node) => node.type === 'end').map((node) => node.result)).size < 2) problems.push(`${event.id}: 결말 1종`);
  });
  // 허용 목록이 낡거나 의미가 없어지지 않게: 실제로 있는 이벤트여야 하고, 판정 노드가 없어야 한다.
  NO_CHECK_ALLOWED.forEach((id) => {
    const event = storyEvents.find((item) => item.id === id);
    if (!event) problems.push(`허용 목록의 ${id}: 존재하지 않는 스토리 이벤트`);
    else if (Object.values(event.steps).some((node) => node.type === 'check')) problems.push(`허용 목록의 ${id}: 판정 노드가 있다 (목록에서 빼야 한다)`);
  });
  assert(problems.length === 0, problems.join(' | '));
});

test('개발 도구 validate 가 콘텐츠 폴더 전체를 통과시킨다 (종료 코드 0)', () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const result = spawnSync(process.execPath, ['tools/events.mjs', 'validate'], { cwd: root, encoding: 'utf8' });
  assert(result.status === 0, (result.stdout + result.stderr).slice(-400));
});

/* ===================== 2. 진행 ===================== */
section('[2] 멀티스텝 진행');

test('시작: 시작 노드에 서고, 첫 행동 전에는 아무 효과도 적용되지 않는다', () => {
  const { state } = setupStory('st_game_fps_cup');
  const before = JSON.stringify({ money: state.money, fans: state.fans, hp: state.members.map((m) => m.hp) });
  assert(state.storyRun.stepId === 'intro' && !state.storyRun.committed, state.storyRun.stepId);
  assert(ST.canLeaveStory(state), '시작 전에는 나갈 수 있어야 한다');
  assert(before === JSON.stringify({ money: state.money, fans: state.fans, hp: state.members.map((m) => m.hp) }), '효과 적용됨');
});

test('노드에 맞지 않는 행동은 거부되고 시작도 확정되지 않는다', () => {
  const { state } = setupStory('st_game_fps_cup');
  assert(!ST.advanceStory(state, { type: 'roll' }), 'story 노드에서 roll 이 통과함');
  assert(!ST.advanceStory(state, { type: 'choose', index: 0 }), 'story 노드에서 choose 가 통과함');
  assert(!state.storyRun.committed, '확정됨');
});

test('choice 분기: 선택지마다 다른 노드로 이어지고, 선택 효과와 이야기가 기록된다', () => {
  const targets = [0, 1, 2].map((index) => {
    const { state } = setupStory('st_game_fps_cup');
    const hpBefore = S.getMember('yuni').hp;
    cont(state);
    choose(state, index);
    const beat = state.storyRun.transcript.at(-1);
    assert(beat.type === 'choice' && beat.choiceText && beat.story, '선택 장면 기록 없음');
    if (index === 0) assert(S.getMember('yuni').hp < hpBefore, '선택 효과(hp) 미적용');
    return state.storyRun.stepId;
  });
  assert(targets.join() === 'qual_trained,qual_light,qual_fun', targets.join());
});

test('첫 행동 뒤에는 일정표로 나갈 수 없다 (효과 적용 후 다시 열기 방지)', () => {
  const { state } = setupStory('st_game_fps_cup');
  cont(state);
  assert(state.storyRun.committed && !ST.canLeaveStory(state), '나갈 수 있음');
});

test('조건이 맞지 않는 선택지는 숨겨지고, 골라도 처리되지 않는다', () => {
  const { state } = setupStory('st_music_cover_project', 'yuni', { activityId: 'sing' });
  cont(state);
  const shown = ST.getStoryChoices(state).map(({ index }) => index);
  assert(shown.join() === '0,1', `yuni(악기 태그 없음) 선택지 ${shown}`);
  assert(!ST.advanceStory(state, { type: 'choose', index: 2 }), '숨긴 선택지가 처리됨');
  const withInstrument = setupStory('st_music_cover_project', 'hina', { activityId: 'sing' });
  cont(withInstrument.state);
  assert(ST.getStoryChoices(withInstrument.state).length === 3, 'hina(악기) 에게 악기 선택지 없음');
});

test('판정 분기: 성공 / 부분성공 / 실패가 각각 다른 이야기 노드로 이어진다', () => {
  const next = (outcome) => {
    const { state } = setupStory('st_game_fps_cup');
    cont(state);
    choose(state, 0);
    roll(state, outcome);
    return { step: state.storyRun.stepId, beat: state.storyRun.transcript.at(-1), finished: state.storyRun.finished };
  };
  const success = next('success');
  const partial = next('partial');
  const fail = next('fail');
  assert(success.step === 'final' && success.beat.outcome === 'success', JSON.stringify(success));
  assert(partial.step === 'underdog' && partial.beat.outcome === 'partial', JSON.stringify(partial));
  assert(fail.finished && fail.beat.type === 'end', '실패는 end_out 결말로');
  assert(success.beat.resultText !== partial.beat.resultText, '결과 이야기가 같다');
});

test('부분성공 결과가 없는 판정은 부분성공이 실패로 처리된다', () => {
  const outcomes = { success: { next: 'a' }, fail: { next: 'b' } };
  assert(ST.pickOutcomeBranch(outcomes, 'partial').key === 'fail', 'partial → fail 아님');
  assert(ST.pickOutcomeBranch(outcomes, 'great').key === 'success', 'great → success 아님');
});

test('판정 확률: 성공 구간은 기존 판정과 같고, 실패 구간의 일부가 부분성공이 된다', () => {
  const chance = 60;
  assert(ST.rollStoryOutcome(chance, () => 0.1) === 'great', 'great');
  assert(ST.rollStoryOutcome(chance, () => 0.5) === 'success', 'success');
  assert(ST.rollStoryOutcome(chance, () => 0.65) === 'partial', 'partial');
  assert(ST.rollStoryOutcome(chance, () => 0.9) === 'fail', 'fail');
  // 성공 이상 확률은 기존 rollOutcome 과 같다.
  for (let r = 0; r < 1; r += 0.01) {
    const oldSuccess = A.rollOutcome(chance, () => r) !== 'fail';
    const newSuccess = ['great', 'success'].includes(ST.rollStoryOutcome(chance, () => r));
    assert(oldSuccess === newSuccess, `r=${r}`);
  }
});

test('여러 단계 전체: 준비 → 예선 → 결승 선택 → 클러치 → 우승 결말 (기록 / 플래그 / 결말 저장)', () => {
  const { state } = setupStory('st_game_fps_cup');
  const fansBefore = state.fans;
  cont(state);
  choose(state, 0);
  roll(state, 'success');
  choose(state, 1);
  roll(state, 'success');
  const run = state.storyRun;
  assert(run.finished && run.result === 'success', `${run.stepId} / ${run.result}`);
  assert(run.transcript.map((beat) => beat.type).join() === 'story,choice,check,choice,check,end', run.transcript.map((b) => b.type).join());
  assert(state.flags.fpsCupWinner === true, '플래그 없음');
  assert(state.storyResults.st_game_fps_cup === 'success', '결말 저장 안 됨');
  assert(state.eventHistory.st_game_fps_cup === state.currentDay, '발생 기록 없음');
  assert(S.getScheduleEntry('yuni').done, '일정 완료 안 됨');
  assert(state.fans > fansBefore, '팬 변화 없음');
  const log = state.logs.at(-1);
  assert(log.story && log.storyText && log.choiceText.includes(' → ') && log.check.outcome === 'success', JSON.stringify(log).slice(0, 200));
  assert(log.deltas.some((delta) => delta.key === 'fans'), '로그 변화량 없음');
});

test('분기 노드: HP 가 낮으면 피로 장면을 거치고, 높으면 건너뛴다', () => {
  const tired = setupStory('st_broadcast_screen_freeze', 'yuni', { activityId: 'chat', hp: 40 });
  cont(tired.state);
  const fresh = setupStory('st_broadcast_screen_freeze', 'yuni', { activityId: 'chat', hp: 90 });
  cont(fresh.state);
  assert(tired.state.storyRun.stepId === 'tired' && fresh.state.storyRun.stepId === 'react', `${tired.state.storyRun.stepId} / ${fresh.state.storyRun.stepId}`);
});

test('상황별 문장: 같은 장면이라도 HP / 태그에 따라 다른 문장이 나온다', () => {
  const tired = setupStory('st_game_fps_cup', 'yuni', { hp: 40 });
  const tiredText = ST.resolveStoryText(ST.getStoryNode(tired.state).text, tired.state);
  const fresh = setupStory('st_game_fps_cup', 'yuni', { hp: 90 });
  const freshText = ST.resolveStoryText(ST.getStoryNode(fresh.state).text, fresh.state);
  assert(tiredText.includes('피곤') && !freshText.includes('피곤'), '문장 변화 없음');
});

test('중간 판정은 현재 상태를 반영한다: HP 가 낮으면 성공률이 떨어진다', () => {
  const at = (hp) => {
    const { state } = setupStory('st_game_fps_cup', 'yuni', { hp });
    cont(state);
    choose(state, 1);
    return ST.getStoryCheckChance(state);
  };
  assert(at(20) < at(90), `${at(20)} / ${at(90)}`);
});

/* ===================== 3. 콜라보 스토리 ===================== */
section('[3] 콜라보 스토리');

test('파트너를 고르기 전에는 진행되지 않고, 고른 뒤 첫 행동에서 참여 멤버가 확정된다', () => {
  const { state } = setupStory('st_collab_escape_room', 'yuni', { activityId: 'chat' });
  assert(!ST.canAdvanceStory(state) && !ST.advanceStory(state, { type: 'continue' }), '파트너 없이 진행됨');
  S.setCollabPartners(['huya']);
  cont(state);
  assert(state.storyRun.committed && state.storyRun.partnerIds.join() === 'huya', state.storyRun.partnerIds.join());
  S.setCollabPartners(['hina']);
  assert(ST.getStoryParticipants(state).map((m) => m.id).join() === 'yuni,huya', '확정 후 파트너가 바뀜');
});

test('관계도 분기: 관계가 좋으면 호흡이 맞는 장면, 아니면 어색한 장면', () => {
  const low = setupStory('st_collab_escape_room', 'yuni', { activityId: 'chat' });
  S.setCollabPartners(['huya']);
  S.setRelationship('yuni', 'huya', 10);
  cont(low.state);
  const high = setupStory('st_collab_escape_room', 'yuni', { activityId: 'chat' });
  S.setCollabPartners(['huya']);
  S.setRelationship('yuni', 'huya', 60);
  cont(high.state);
  assert(low.state.storyRun.stepId === 'awkward' && high.state.storyRun.stepId === 'synergy', `${low.state.storyRun.stepId} / ${high.state.storyRun.stepId}`);
});

test('콜라보 결말: 파트너 일정이 콜라보로 바뀌고 관계도가 오른다', () => {
  const { state } = setupStory('st_collab_escape_room', 'yuni', { activityId: 'chat' });
  S.setCollabPartners(['huya']);
  const before = S.getRelationship('yuni', 'huya');
  playStory(state, { rng: () => 0.3 });
  const partner = S.getScheduleEntry('huya');
  assert(partner.done && partner.kind === 'collab' && partner.collabHostId === 'yuni', JSON.stringify(partner));
  assert(S.getRelationship('yuni', 'huya') > before, '관계도 변화 없음');
  assert(state.logs.at(-1).kind === 'collab', '콜라보 로그 아님');
});

/* ===================== 4. 후속 이벤트 ===================== */
section('[4] 플래그 / 후속 이벤트');

test('대회 탈락 → 같은 멤버에게만, 3일 뒤부터 복수전 이벤트가 후보가 된다', () => {
  const { state } = setupStory('st_game_fps_cup', 'tabi', { day: 5 });
  cont(state);
  choose(state, 0);
  roll(state, 'fail');
  assert(S.getMember('tabi').flags.fpsCupRematch === true, '멤버 플래그 없음');
  const candidates = (memberId, day) => {
    state.currentDay = day;
    return E.collectCandidates(S.getMember(memberId), state, { activity: E.getActivityById('fps') }).map((event) => event.id);
  };
  assert(!candidates('tabi', 6).includes('st_game_fps_rematch'), '3일 전에 등장');
  assert(candidates('tabi', 8).includes('st_game_fps_rematch'), '3일 뒤 후보 아님');
  assert(!candidates('yuni', 8).includes('st_game_fps_rematch'), '다른 멤버에게 등장');
});

test('복수전 결말은 멤버 플래그를 정리하고, 결말 조건(storyResult)으로 다음 이야기를 이어 붙일 수 있다', () => {
  const { state } = setupStory('st_game_fps_rematch', 'tabi', { day: 9 });
  S.getMember('tabi').flags.fpsCupRematch = true;
  playStory(state, { pickChoice: (list) => list[0], rng: () => 0.2 });
  assert(S.getMember('tabi').flags.fpsCupRematch === false, '플래그 정리 안 됨');
  const result = state.storyResults.st_game_fps_rematch;
  const check = E.CONDITION_CHECKS.storyResult;
  assert(check({ state }, { id: 'st_game_fps_rematch', result }) && !check({ state }, { id: 'st_game_fps_cup', result: 'success' }), 'storyResult 조건');
});

test('once 스토리는 한 번 끝나면 다시 후보가 되지 않는다', () => {
  const { state } = setupStory('st_game_fps_cup', 'yuni', { day: 5 });
  playStory(state, { rng: () => 0.3 });
  state.currentDay = 12;
  const ids = E.collectCandidates(S.getMember('riko'), state, { activity: E.getActivityById('fps') }).map((event) => event.id);
  assert(!ids.includes('st_game_fps_cup'), '다시 등장');
});

/* ===================== 5. 검증 (LLM 데이터 방어) ===================== */
section('[5] 잘못된 이벤트 데이터 거부');

test('기준 이벤트(복사본)는 오류가 없다', () => {
  assert(errorsOf(baseEvent()).length === 0, errorsOf(baseEvent()).join('\n'));
});

const invalidCases = [
  ['존재하지 않는 멤버', (ev) => { ev.memberId = 'ghost'; }, '존재하지 않는 멤버'],
  ['조건 속 존재하지 않는 멤버', (ev) => { ev.steps.mood.branches[0].when = { withMember: ['ghost'] }; }, '존재하지 않는 멤버'],
  ['존재하지 않는 스탯', (ev) => { ev.steps.radio.check.stat = 'Dance'; }, '존재하지 않는 스탯'],
  ['효과 속 존재하지 않는 스탯', (ev) => { ev.steps.end_fixed.effects.stats = { Luck: 1 }; }, '존재하지 않는 스탯'],
  ['허용되지 않은 효과 키', (ev) => { ev.steps.end_fixed.effects.giveItem = 'sword'; }, '허용되지 않은 효과'],
  ['효과 한도 초과', (ev) => { ev.steps.end_fixed.effects.fans = 999999; }, '사이 정수'],
  ['잘못된 플래그 값', (ev) => { ev.steps.end_fixed.effects.flags = { ok: 'yes' }; }, 'true / false'],
  ['존재하지 않는 종목', (ev) => { ev.steps.end_fixed.effects.stockEffect = { ticker: 'FAKE', percentage: 3 }; }, '존재하지 않는 종목'],
  ['존재하지 않는 투자', (ev) => { ev.steps.end_fixed.effects.startInvestment = 'moonBase'; }, '존재하지 않는 투자'],
  ['알 수 없는 조건 키', (ev) => { ev.conditions.whenRaining = true; }, '알 수 없는 조건'],
  ['알 수 없는 일정 카테고리', (ev) => { ev.conditions.activityCategories = ['dance']; }, '알 수 없는 일정 카테고리'],
  ['알 수 없는 태그', (ev) => { ev.steps.radio.check.traitBonus = { flying: 10 }; }, '존재하지 않는 태그'],
  ['끊긴 연결 (없는 노드)', (ev) => { ev.steps.react.choices[0].next = 'nowhere'; }, '연결된 노드'],
  ['도달할 수 없는 노드', (ev) => { ev.steps.orphan = { type: 'end', result: 'neutral', text: '아무도 오지 않는 결말' }; }, '도달할 수 없는'],
  ['순환 연결', (ev) => { ev.steps.tired.next = 'intro'; }, '순환'],
  ['end 노드 없음', (ev) => { Object.keys(ev.steps).filter((id) => ev.steps[id].type === 'end').forEach((id) => { ev.steps[id] = { type: 'story', text: '끝나지 않는다', next: 'intro' }; }); }, 'end'],
  ['잘못된 선택지 (조건 없는 선택지 없음)', (ev) => { ev.steps.react.choices.forEach((choice) => { choice.conditions = { minFame: 999 }; }); }, '조건 없는 선택지'],
  ['선택지 0개', (ev) => { ev.steps.react.choices = []; }, '선택지는'],
  ['판정 결과 누락 (fail 없음)', (ev) => { delete ev.steps.radio.outcomes.fail; }, 'fail 결과'],
  ['알 수 없는 노드 종류', (ev) => { ev.steps.tired.type = 'minigame'; }, '알 수 없는 노드'],
  ['규칙을 바꾸려는 최상위 키', (ev) => { ev.rules = { checkBase: 99 }; }, '허용되지 않은 최상위 키'],
  ['허용 목록에 없는 메타 값', (ev) => { ev.meta.conflict = 'alien_invasion'; }, '허용 목록'],
  ['알 수 없는 치환어', (ev) => { ev.steps.intro.text = '{manager}가 방송을 켰다.'; }, '치환어'],
  ['HTML 삽입', (ev) => { ev.steps.intro.text = '<img src=x onerror=alert(1)>'; }, 'HTML'],
  ['난이도 범위 밖', (ev) => { ev.steps.radio.check.difficulty = 5; }, '사이 정수'],
  ['잘못된 id 형식', (ev) => { ev.id = 'Event 1'; }, 'id'],
];

invalidCases.forEach(([name, mutate, keyword]) => {
  test(`거부: ${name}`, () => {
    const event = baseEvent();
    mutate(event);
    const errors = errorsOf(event);
    assert(errors.length > 0, '오류가 없다');
    assert(errors.some((line) => line.includes(keyword)), `"${keyword}" 오류 없음: ${errors.join(' | ').slice(0, 200)}`);
  });
});

test('이벤트 id 중복 / 기존 이벤트와 id 충돌을 잡는다', () => {
  const a = baseEvent();
  const b = baseEvent();
  const { results } = schema.validateStoryCollection([a, b], ctx());
  assert(results.get(b).errors.some((line) => line.includes('중복')), '중복 미검출');
  const clash = baseEvent();
  clash.id = 'st_game_fps_cup';
  const c = { ...ctx(), knownEventIds: [...ctx().knownEventIds, 'st_game_fps_cup'] };
  assert(schema.validateStoryCollection([clash], c).results.get(clash).errors.some((line) => line.includes('겹친다')), '충돌 미검출');
});

test('없는 이벤트를 참조하는 후속 조건(afterEventId)을 잡는다', () => {
  const event = baseEvent();
  event.conditions.afterEventId = { id: 'st_does_not_exist', minDays: 1 };
  assert(errorsOf(event).some((line) => line.includes('존재하지 않는 이벤트')), '미검출');
});

test('런타임 로더: 잘못된 이벤트는 빼고 올바른 이벤트만 게임에 넣는다 (게임은 멈추지 않는다)', () => {
  const good = baseEvent();
  good.id = 'st_broadcast_loader_ok';
  const bad = baseEvent();
  bad.id = 'st_broadcast_loader_bad';
  bad.steps.end_fixed.effects.fans = 10 ** 9;
  const garbage = { hello: 'world' };
  const { accepted, rejected } = E.filterValidStoryEvents([good, bad, garbage, null]);
  assert(accepted.length === 1 && accepted[0] === good, `accepted ${accepted.length}`);
  assert(rejected.length === 3, `rejected ${rejected.length}`);
});

test('유사도 검사: 같은 구조 + 같은 배경이거나 문장이 거의 같은 이벤트를 찾는다', () => {
  const a = baseEvent();
  const b = baseEvent();
  b.id = 'st_broadcast_copy';
  const pairs = schema.findSimilarEvents([a, b]);
  assert(pairs.length === 1, `${pairs.length}쌍`);
  const different = JSON.parse(JSON.stringify(E.getEventById('st_music_cover_project')));
  assert(schema.findSimilarEvents([a, different]).length === 0, '다른 이벤트를 비슷하다고 판정');
});

/* ===================== 6. 저장 / 불러오기 ===================== */
section('[6] 저장 / 불러오기');

test('진행 중인 스토리는 그 단계 그대로 저장되고 이어서 진행된다', () => {
  const { state } = setupStory('st_game_fps_cup', 'yuni', { day: 6 });
  cont(state);
  choose(state, 0);
  const hp = S.getMember('yuni').hp;
  assert(SAVE.saveGame(state), '저장 실패');
  const loaded = SAVE.loadGame();
  assert(loaded.gamePhase === 'event' && loaded.storyRun?.stepId === 'qual_trained', `${loaded.gamePhase} / ${loaded.storyRun?.stepId}`);
  assert(loaded.storyRun.transcript.length === 2 && loaded.currentEvent?.id === 'st_game_fps_cup', '진행 기록 복원 안 됨');
  assert(S.getMember('yuni').hp === hp, 'hp 복원 안 됨');
  playStory(loaded, { rng: () => 0.3 });
  assert(loaded.storyRun.finished && S.getScheduleEntry('yuni').done, '이어서 끝내지 못함');
});

test('시작 전(첫 행동 전) 스토리는 저장되지 않고 일정표로 돌아가 다시 열 수 있다', () => {
  const { state } = setupStory('st_game_fps_cup', 'yuni', { day: 6 });
  SAVE.saveGame(state);
  const loaded = SAVE.loadGame();
  assert(loaded.gamePhase === 'dayBoard' && loaded.storyRun === null && !S.getScheduleEntry('yuni').done, `${loaded.gamePhase}`);
});

test('이어갈 수 없는 진행 기록(없는 노드)은 버리고, 같은 이벤트를 다시 받지 않도록 일정을 끝낸다', () => {
  const { state } = setupStory('st_game_fps_cup', 'yuni', { day: 6 });
  cont(state);
  SAVE.saveGame(state);
  const raw = JSON.parse(store.get(SAVE.SAVE_KEY));
  raw.state.storyRun.stepId = 'deleted_node';
  store.set(SAVE.SAVE_KEY, JSON.stringify(raw));
  const loaded = SAVE.loadGame();
  assert(loaded.gamePhase === 'dayBoard' && loaded.storyRun === null, loaded.gamePhase);
  assert(S.getScheduleEntry('yuni').done, '일정이 다시 열림');
});

test('결말 기록 / 최근 스토리 목록이 저장되고, 잘못된 값은 걸러진다', () => {
  const { state } = setupStory('st_game_fps_cup', 'yuni', { day: 6 });
  playStory(state, { rng: () => 0.3 });
  S.setGamePhase(S.GAME_PHASE.DAY_BOARD);
  state.storyResults.st_unknown = 'success';
  state.storyResults.st_music_cover_project = 'exploded';
  SAVE.saveGame(state);
  const loaded = SAVE.loadGame();
  assert(loaded.storyResults.st_game_fps_cup === state.storyResults.st_game_fps_cup, '결말 복원 안 됨');
  assert(!('st_unknown' in loaded.storyResults) && !('st_music_cover_project' in loaded.storyResults), '잘못된 결말이 남음');
  assert(loaded.storyRecent.length === 1 && loaded.storyRecent[0].id === 'st_game_fps_cup', JSON.stringify(loaded.storyRecent));
});

test('스토리 기능 이전의 저장 데이터도 그대로 불러온다', () => {
  const { state } = setupStory('st_game_fps_cup', 'yuni', { day: 6 });
  S.setGamePhase(S.GAME_PHASE.DAY_BOARD);
  SAVE.saveGame(state);
  const raw = JSON.parse(store.get(SAVE.SAVE_KEY));
  delete raw.state.storyRun;
  delete raw.state.storyResults;
  delete raw.state.storyRecent;
  store.set(SAVE.SAVE_KEY, JSON.stringify(raw));
  const loaded = SAVE.loadGame();
  assert(loaded && loaded.storyRun === null && Object.keys(loaded.storyResults).length === 0 && loaded.storyRecent.length === 0, '기본값 아님');
});

/* ===================== 7. 기존 시스템과의 호환 / 다양성 ===================== */
section('[7] 기존 이벤트 호환 / 하루 계획 / 다양성');

test('기존(1단계) 이벤트는 그대로 resolveChoice 로 처리된다', () => {
  const state = S.createInitialState(MEMBERS);
  state.schedule = state.members.map((m) => ({ memberId: m.id, activityId: 'longStream', kind: m.id === 'yuni' ? 'important' : 'routine', eventId: m.id === 'yuni' ? 'event_201' : null, done: false }));
  S.setSelectedMember('yuni');
  S.setCurrentEvent(E.getEventById('event_201'));
  const log = A.resolveChoice(state, E.getAvailableChoices(E.getEventById('event_201'), state, 'yuni')[1].choice);
  assert(log && !log.story && S.getScheduleEntry('yuni').done, '기존 이벤트 처리 실패');
});

test('하루 계획: 스토리 이벤트는 하루 최대 1개 (500일)', () => {
  let max = 0;
  let days = 0;
  for (let i = 0; i < 500; i += 1) {
    const state = S.createInitialState(MEMBERS);
    state.currentDay = 3 + (i % 20);
    state.fame = 30;
    state.fans = 5000;
    const schedule = E.planDay(state);
    const stories = schedule.filter((entry) => entry.eventId && E.isStoryEvent(E.getEventById(entry.eventId))).length;
    max = Math.max(max, stories);
    if (stories > 0) days += 1;
  }
  assert(max <= E.DAY_RULES.maxStoryPerDay, `하루 최대 ${max}개`);
  assert(days > 50, `스토리가 등장한 날이 너무 적다 (${days}/500)`);
});

test('다양성: 최근 스토리와 구조가 겹칠수록 등장 가중치가 낮아진다', () => {
  const state = S.createInitialState(MEMBERS);
  const factor = (id) => E.getStoryDiversityFactor(E.getEventById(id), state);
  assert(factor('st_game_aos_league') === 1, '기록 없을 때 1 아님');
  state.storyRecent = [{ id: 'st_game_fps_cup', day: 1 }];
  const sameTheme = factor('st_game_aos_league');
  const otherTheme = factor('st_music_cover_project');
  assert(sameTheme < 1 && otherTheme === 1, `${sameTheme} / ${otherTheme}`);
  const copy = JSON.parse(JSON.stringify(E.getEventById('st_game_fps_cup')));
  copy.id = 'st_game_copy';
  E.EVENTS.push(copy);
  const same = E.getStoryDiversityFactor(copy, state);
  E.EVENTS.pop();
  assert(same < sameTheme, `같은 구조 ${same} ≥ 같은 테마 ${sameTheme}`);
});

/* ===================== 8. 문장 치환 ===================== */
section('[8] 문장 치환 (조사)');

const UI = await import(new URL('../js/ui.js', import.meta.url));

test('이름 받침에 맞게 조사가 바뀐다 (린 / 유니)', () => {
  S.createInitialState(MEMBERS);
  const fill = (text, ids) => UI.fillText(text, ids);
  assert(fill('{member}가 웃었다.', ['rin']) === '아오쿠모 린이 웃었다.', fill('{member}가 웃었다.', ['rin']));
  assert(fill('{member}가 웃었다.', ['yuni']) === '아야츠노 유니가 웃었다.', '유니가');
  assert(fill('{member}는 {partners}와 함께', ['yuni', 'rin']) === '아야츠노 유니는 린과 함께', fill('{member}는 {partners}와 함께', ['yuni', 'rin']));
  assert(fill('{member}를 불렀다', ['rin']) === '아오쿠모 린을 불렀다', '을/를');
  assert(fill('주인공은 {member}였다', ['rin']) === '주인공은 아오쿠모 린이었다', '였다/이었다');
  assert(fill('{member}로 정했다', ['rin']) === '아오쿠모 린으로 정했다', '으로/로');
  assert(fill('{member}의 방송', ['rin']) === '아오쿠모 린의 방송', '의는 그대로');
});

test('모든 이벤트 문장에서 받침 있는 이름에 잘못된 조사가 붙지 않는다', () => {
  S.createInitialState(MEMBERS);
  const texts = [];
  const push = (value) => {
    if (typeof value === 'string') texts.push(value);
    else if (Array.isArray(value)) value.forEach((item) => texts.push(item.text));
  };
  E.EVENTS.forEach((event) => {
    push(event.description);
    (event.choices || []).forEach((choice) => push(choice.text));
    Object.values(event.steps || {}).forEach((node) => {
      push(node.text);
      (node.choices || []).forEach((choice) => { push(choice.text); push(choice.story); });
      Object.values(node.outcomes || {}).forEach((outcome) => push(outcome.text));
    });
  });
  const bad = texts.map((text) => UI.fillText(text, ['rin', 'rin'])).filter((text) => /린(가|는|를|와|였|로)(?![가-힣])/.test(text));
  assert(bad.length === 0, bad.slice(0, 3).join(' | '));
});

/* ===================== 9. 28일 시뮬레이션 ===================== */
section(`[9] 28일 시뮬레이션 × ${RUNS}회 (스토리 포함)`);

const sim = { errors: [], stories: 0, results: {}, appeared: new Map(), maxPerDay: 0, unfinished: 0, perGame: [] };
for (let run = 0; run < RUNS; run += 1) {
  try {
    const state = playGame({
      onDayEnd: (st) => {
        if (st.storyRun) sim.unfinished += 1;
        const today = st.logs.filter((log) => log.day === st.currentDay && log.story).length;
        sim.maxPerDay = Math.max(sim.maxPerDay, today);
      },
    });
    const storyLogs = state.logs.filter((log) => log.story);
    sim.perGame.push(storyLogs.length);
    storyLogs.forEach((log) => {
      sim.stories += 1;
      const result = log.check?.outcome || 'neutral';
      sim.results[result] = (sim.results[result] || 0) + 1;
    });
    Object.keys(state.storyResults).forEach((id) => sim.appeared.set(id, (sim.appeared.get(id) || 0) + 1));
  } catch (error) {
    sim.errors.push(`run ${run}: ${error.message}`);
  }
}

test(`${RUNS}회 모두 스토리를 포함해 Day 28 까지 오류 없이 진행된다`, () => {
  assert(sim.errors.length === 0, sim.errors.slice(0, 3).join('\n      '));
});

test('모든 스토리는 하루 안에 결말까지 가고, 하루에 1개를 넘지 않는다', () => {
  assert(sim.unfinished === 0, `하루가 끝났는데 진행 중인 스토리 ${sim.unfinished}건`);
  assert(sim.maxPerDay <= E.DAY_RULES.maxStoryPerDay, `하루 최대 ${sim.maxPerDay}개`);
});

test('스토리 이벤트가 무작위로 고르게 등장한다 (샘플 전부 등장, 게임마다 구성이 다르다)', () => {
  const missing = storyEvents.filter((event) => !sim.appeared.has(event.id)).map((event) => event.id);
  assert(missing.length === 0, `한 번도 안 나온 스토리: ${missing.join(', ')}`);
  const distinctCounts = new Set(sim.perGame).size;
  assert(distinctCounts >= 3, `게임당 스토리 수가 거의 같다 (${[...new Set(sim.perGame)].join(',')})`);
});

test('결말이 성공 / 부분성공 / 실패로 고루 나온다', () => {
  ['success', 'partial', 'fail'].forEach((result) => assert((sim.results[result] || 0) > 0, `${result} 0회`));
});

const avg = sim.perGame.reduce((a, b) => a + b, 0) / Math.max(sim.perGame.length, 1);
console.log(`\n  게임당 스토리 ${avg.toFixed(1)}개 · 결말 ${JSON.stringify(sim.results)}`);
console.log(`  등장 횟수: ${[...sim.appeared.entries()].map(([id, n]) => `${id.replace('st_', '')} ${n}`).join(' · ')}`);

finish();
