// story.js — 스토리(멀티스텝) 이벤트 진행 엔진
// 이벤트 "내용"은 데이터(js/story-content.js)에만 있고, 이 파일은 규칙만 담당한다:
//   노드 이동 / 선택지 조건 / 판정 / 효과 적용 / 기록 / 결말 저장.
// 효과 적용과 판정은 기존 이벤트와 같은 함수(actions.js)를 쓴다. → 밸런스 규칙이 한 곳에만 있다.
//
// 진행 상태(state.storyRun)
// {
//   eventId, hostId, partnerIds, stepId,
//   committed: 첫 행동을 했는지 (그 전에는 일정표로 돌아갈 수 있다),
//   finished: 결말에 도달했는지, result: 결말,
//   transcript: [지나온 장면], path: [고른 선택지 문장], deltas: [누적 변화량], lastCheck
// }

import { getMember, getScheduleEntry, getState, addLog } from './state.js';
import { getActivityById, getEventById, isStoryEvent, meetsConditions } from './events.js';
import {
  CHECK_RULES,
  COLLAB_RULES,
  applyEffects,
  getSuccessChance,
  getEventTimeSlot,
  canChoose,
  mergeDeltas,
  scaleEffects,
  eventLogBase,
  completeEvent,
} from './actions.js';

/* ===================== 규칙 ===================== */

// 판정 결과: 대성공 / 성공 / 부분성공 / 실패
//  - 대성공·성공 구간은 기존 판정(rollOutcome)과 같다.
//  - 실패 구간의 앞쪽 partialRatio 만큼이 부분성공이다. (노드에 partial 결과가 없으면 실패로 처리)
export const STORY_RULES = {
  partialRatio: 0.4,
  // 저장 데이터가 커지지 않게 기억하는 장면 수 상한
  maxTranscript: 40,
  // 다양성 계산용으로 기억하는 최근 스토리 수
  maxRecent: 20,
};

export const STORY_OUTCOME = { GREAT: 'great', SUCCESS: 'success', PARTIAL: 'partial', FAIL: 'fail' };

export function rollStoryOutcome(chance, rng = Math.random) {
  const roll = rng() * 100;
  if (roll < chance * CHECK_RULES.greatRatio) return STORY_OUTCOME.GREAT;
  if (roll < chance) return STORY_OUTCOME.SUCCESS;
  if (roll < chance + (100 - chance) * STORY_RULES.partialRatio) return STORY_OUTCOME.PARTIAL;
  return STORY_OUTCOME.FAIL;
}

// 판정 결과 → 실제로 쓸 결과 노드 (없는 결과는 가까운 결과로 대체)
export function pickOutcomeBranch(outcomes, outcome) {
  if (outcome === STORY_OUTCOME.GREAT) return { key: outcomes.great ? 'great' : 'success', branch: outcomes.great || outcomes.success };
  if (outcome === STORY_OUTCOME.PARTIAL) return { key: outcomes.partial ? 'partial' : 'fail', branch: outcomes.partial || outcomes.fail };
  return { key: outcome, branch: outcomes[outcome] };
}

/* ===================== 조회 ===================== */

export function getStoryRun(state = getState()) {
  return state?.storyRun || null;
}

export function getStoryEvent(state = getState()) {
  const run = getStoryRun(state);
  return run ? getEventById(run.eventId) : null;
}

export function getStoryNode(state = getState()) {
  const run = getStoryRun(state);
  const event = run ? getEventById(run.eventId) : null;
  return event && !run.finished ? event.steps[run.stepId] || null : null;
}

// 참여 멤버: 시작 전(파트너 고르는 중)에는 현재 고른 파트너, 시작 후에는 확정된 파트너
export function getStoryParticipants(state = getState()) {
  const run = getStoryRun(state);
  if (!run) return [];
  const partnerIds = run.committed ? run.partnerIds : state.collabPartnerIds;
  return [run.hostId, ...partnerIds].map((id) => getMember(id)).filter(Boolean);
}

function conditionContext(state, run) {
  const members = getStoryParticipants(state);
  const entry = getScheduleEntry(run.hostId);
  return {
    state,
    member: members[0],
    members,
    activity: entry ? getActivityById(entry.activityId) : null,
    event: getEventById(run.eventId),
  };
}

// 상태에 따라 다른 문장: 문자열이면 그대로, 배열이면 조건이 맞는 첫 문장
export function resolveStoryText(value, state = getState()) {
  if (typeof value === 'string') return value;
  if (!Array.isArray(value)) return '';
  const run = getStoryRun(state);
  const ctx = run ? conditionContext(state, run) : null;
  const variant = value.find((item) => !item.when || (ctx && meetsConditions(item.when, ctx)));
  return variant?.text || '';
}

// 지금 고를 수 있는 선택지 ({ choice, index } — index 는 원래 순서)
export function getStoryChoices(state = getState()) {
  const node = getStoryNode(state);
  const run = getStoryRun(state);
  if (!node || node.type !== 'choice') return [];
  const ctx = conditionContext(state, run);
  const indexed = node.choices.map((choice, index) => ({ choice, index }));
  const valid = indexed.filter(({ choice }) => meetsConditions(choice.conditions, ctx));
  return valid.length > 0 ? valid : indexed.filter(({ choice }) => !choice.conditions);
}

// 현재 판정 노드의 성공률 (%)
export function getStoryCheckChance(state = getState()) {
  const node = getStoryNode(state);
  const run = getStoryRun(state);
  if (!node || node.type !== 'check') return null;
  const event = getEventById(run.eventId);
  return getSuccessChance(getStoryParticipants(state), node.check, getEventTimeSlot(event, run.hostId));
}

// 진행 가능한 상태인지: 콜라보는 파트너 최소 인원을 채워야 시작할 수 있다.
export function canAdvanceStory(state = getState()) {
  const run = getStoryRun(state);
  if (!run || run.finished) return false;
  return run.committed || canChoose(state);
}

/* ===================== 진행 ===================== */

// 이벤트 화면을 열 때 호출한다. (아직 아무 효과도 적용하지 않는다)
export function startStory(state, event, hostId) {
  if (!isStoryEvent(event)) return null;
  state.storyRun = {
    eventId: event.id,
    hostId,
    partnerIds: [],
    stepId: event.start,
    committed: false,
    finished: false,
    result: null,
    transcript: [],
    path: [],
    deltas: [],
    lastCheck: null,
  };
  // 시작 노드가 분기면 바로 풀어 둔다. (분기는 효과가 없어 되돌릴 필요가 없다)
  settleAutoNodes(state);
  return state.storyRun;
}

// 첫 행동 전이면 이벤트를 버리고 일정표로 돌아갈 수 있다.
export function canLeaveStory(state = getState()) {
  const run = getStoryRun(state);
  return !run || !run.committed || run.finished;
}

export function clearStory(state) {
  state.storyRun = null;
}

// action: { type: 'continue' } | { type: 'choose', index } | { type: 'roll' }
// 성공하면 true. 잘못된 행동(다른 노드용 행동, 숨겨진 선택지 등)은 아무것도 바꾸지 않고 false.
export function advanceStory(state, action, rng = Math.random) {
  const run = getStoryRun(state);
  const event = getStoryEvent(state);
  const node = getStoryNode(state);
  if (!run || !event || !node || !canAdvanceStory(state)) return false;

  // 행동이 노드와 맞는지 먼저 확인한다. (맞지 않으면 시작 확정도 하지 않는다)
  let choice = null;
  if (node.type === 'story' && action.type !== 'continue') return false;
  if (node.type === 'check' && action.type !== 'roll') return false;
  if (node.type === 'choice') {
    if (action.type !== 'choose') return false;
    choice = getStoryChoices(state).find((item) => item.index === action.index)?.choice;
    if (!choice) return false;
  }

  if (!run.committed) {
    // 첫 행동: 참여 멤버를 확정한다. 이후로는 되돌릴 수 없다.
    run.committed = true;
    run.partnerIds = event.collab ? [...state.collabPartnerIds] : [];
  }

  const members = getStoryParticipants(state);
  const timeSlot = getEventTimeSlot(event, run.hostId);
  const apply = (effects) => {
    const deltas = applyEffects(state, members, effects, { timeSlot });
    run.deltas.push(...deltas);
    return mergeDeltas(deltas);
  };

  if (node.type === 'story') {
    const text = resolveStoryText(node.text, state);
    record(run, { type: 'story', text, deltas: apply(node.effects) });
    goTo(state, node.next);
  } else if (node.type === 'choice') {
    const prompt = resolveStoryText(node.text, state);
    const deltas = apply(choice.effects);
    const story = choice.story ? resolveStoryText(choice.story, state) : '';
    record(run, { type: 'choice', text: prompt, choiceText: choice.text, story, deltas });
    run.path.push(choice.text);
    goTo(state, choice.next);
  } else if (node.type === 'check') {
    const text = resolveStoryText(node.text, state);
    const chance = getSuccessChance(members, node.check, timeSlot);
    const outcome = rollStoryOutcome(chance, rng);
    const { key, branch } = pickOutcomeBranch(node.outcomes, outcome);
    // 콜라보는 기존 규칙처럼 인원이 많을수록 판정 결과의 팬 증가량이 커진다.
    const factor = event.collab ? 1 + (members.length - 2) * COLLAB_RULES.fanBonusPerExtraMember : 1;
    const deltas = apply(scaleEffects(branch.effects, ['fans'], factor));
    const resultText = resolveStoryText(branch.text, state);
    // 기록에는 실제로 굴린 결과(부분성공 포함)를, 이야기는 사용된 결과 노드를 따른다.
    const shown = key === 'fail' && outcome === STORY_OUTCOME.PARTIAL ? STORY_OUTCOME.FAIL : outcome;
    run.lastCheck = { stat: node.check.stat, chance, outcome: shown };
    record(run, { type: 'check', text, stat: node.check.stat, chance, outcome: shown, resultText, deltas });
    goTo(state, branch.next);
  }
  return true;
}

function record(run, entry) {
  run.transcript.push(entry);
  if (run.transcript.length > STORY_RULES.maxTranscript) run.transcript.shift();
}

function goTo(state, stepId) {
  state.storyRun.stepId = stepId;
  settleAutoNodes(state);
}

// 분기 노드는 조건에 따라 바로 넘어가고, 결말 노드에 닿으면 이벤트를 끝낸다.
function settleAutoNodes(state) {
  const run = state.storyRun;
  const event = getEventById(run.eventId);
  // 검증에서 순환을 막지만, 데이터가 잘못돼도 무한 반복하지 않도록 상한을 둔다.
  for (let guard = 0; guard < 50; guard += 1) {
    const node = event.steps[run.stepId];
    if (!node) return finishStory(state, null);
    if (node.type === 'branch') {
      const ctx = conditionContext(state, run);
      const branch = node.branches.find((item) => meetsConditions(item.when, ctx));
      run.stepId = branch ? branch.next : node.next;
      continue;
    }
    if (node.type === 'end') return finishStory(state, node);
    return undefined;
  }
  return finishStory(state, null);
}

// 결말: 효과 적용 → 기록 1건 → 일정 완료 → 결말 저장
function finishStory(state, endNode) {
  const run = state.storyRun;
  const event = getEventById(run.eventId);
  // 시작도 하기 전에 결말에 닿는 데이터(분기만 있는 이벤트)도 참여자를 확정하고 끝낸다.
  if (!run.committed) {
    run.committed = true;
    run.partnerIds = event.collab ? [...state.collabPartnerIds] : [];
  }
  const members = getStoryParticipants(state);
  const result = endNode?.result || 'neutral';
  const text = endNode ? resolveStoryText(endNode.text, state) : '';
  const deltas = endNode
    ? applyEffects(state, members, endNode.effects, { timeSlot: getEventTimeSlot(event, run.hostId) })
    : [];
  run.deltas.push(...deltas);
  record(run, { type: 'end', text, result, deltas: mergeDeltas(deltas) });
  run.finished = true;
  run.result = result;

  // 결과 배지: 결말이 성공인데 마지막 판정이 대성공이면 대성공으로 보여준다.
  let outcome = null;
  if (result === 'success') outcome = run.lastCheck?.outcome === STORY_OUTCOME.GREAT ? STORY_OUTCOME.GREAT : STORY_OUTCOME.SUCCESS;
  else if (result === 'partial') outcome = STORY_OUTCOME.PARTIAL;
  else if (result === 'fail') outcome = STORY_OUTCOME.FAIL;

  addLog({
    ...eventLogBase(event, members),
    story: true,
    choiceText: run.path.length > 0 ? run.path.join(' → ') : null,
    storyText: text,
    check: outcome ? { stat: run.lastCheck?.stat || null, chance: run.lastCheck?.chance ?? null, outcome } : null,
    deltas: mergeDeltas(run.deltas),
  });
  completeEvent(event, members);

  state.storyResults[event.id] = result;
  state.storyRecent.push({ id: event.id, day: state.currentDay });
  if (state.storyRecent.length > STORY_RULES.maxRecent) state.storyRecent.shift();
  return undefined;
}
