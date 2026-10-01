// story-schema.js — 멀티스텝(스토리) 이벤트의 데이터 규격 + 검증
// 게임 런타임(events.js)과 개발 도구(tools/)가 같은 검증을 쓴다.
// 다른 게임 모듈을 import 하지 않는다: 멤버 / 스탯 / 조건 키 같은 "허용 목록"은 호출하는 쪽이 context 로 넘긴다.
//
// ─ 스토리 이벤트 형식 ─────────────────────────────────────────────
// {
//   id: 'st_...', title, category, description(일정표 / 기록에 쓰는 한 줄 요약),
//   meta: { theme, setting, conflict, resolution, activity, tone },   ← 다양성 관리용
//   conditions / weight / activityWeights / traitWeights / memberId / collab / once / forced / urgent / timeSlot / stockEffect
//      ← 기존 이벤트와 같은 의미 (events.js 참고)
//   group: (선택) 같은 상황의 변형끼리 묶는 이름 (소문자 / 숫자 / _). 같은 group 은 쿨다운과 최근 등장 기록을 공유해
//          연달아 나오지 않는다. (events.js 의 STORY_GROUP_RULES)
//   start: '첫 노드 id',
//   steps: { [노드 id]: 노드 }
// }
// 노드 종류
//   story  : { type, text, effects?, next }                     — 이야기 진행 (계속 버튼)
//   choice : { type, text, choices: [{ text, story?, conditions?, effects?, next }] }
//   check  : { type, text, check: { stat, difficulty, traitBonus? },
//              outcomes: { great?, success, partial?, fail } }  — 각 결과 { text, effects?, next }
//   branch : { type, branches: [{ when, next }], next }          — 조건에 따라 자동 분기 (화면에 보이지 않음)
//   end    : { type, text, effects?, result }                   — result: success | partial | fail | neutral
// text 는 문자열 또는 [{ when: 조건, text }, ..., { text }] (상태에 따라 다른 문장, 마지막은 기본 문장)
// 텍스트 치환: {member} = 주인공 이름, {partners} = 콜라보 파트너 이름

export const NODE_TYPES = ['story', 'choice', 'check', 'branch', 'end'];
export const END_RESULTS = ['success', 'partial', 'fail', 'neutral'];
export const CHECK_OUTCOMES = ['great', 'success', 'partial', 'fail'];
export const TIME_SLOTS = ['day', 'evening', 'lateNight'];
export const PLACEHOLDERS = ['member', 'partners'];

// 콘텐츠 분류 어휘. LLM 이 새 값을 지어내지 못하도록 고정 목록만 허용한다.
// (다양성 계산이 이 값들의 조합으로 이뤄진다)
export const VOCAB = {
  category: ['game', 'broadcast', 'music', 'collaboration', 'business', 'member', 'fan', 'special'],
  theme: [
    'game_tournament', 'game_content', 'broadcast_live', 'broadcast_incident', 'music_production', 'music_live',
    'collab_content', 'sponsorship', 'merchandise', 'fan_event', 'member_growth', 'content_production',
    'investment_project', 'special_event', 'unexpected',
  ],
  conflict: [
    'early_disadvantage', 'time_pressure', 'technical_trouble', 'fatigue', 'creative_block', 'rivalry',
    'high_expectations', 'budget_limit', 'audience_reaction', 'miscommunication', 'unexpected_guest',
    'big_opportunity', 'nervousness', 'schedule_clash',
  ],
  resolution: [
    'comeback_win', 'steady_success', 'clutch_moment', 'compromise', 'teamwork', 'graceful_loss',
    'viral_moment', 'lesson_learned', 'risky_gamble', 'quiet_growth', 'audience_help',
  ],
  tone: ['hype', 'warm', 'tense', 'comedic', 'emotional', 'calm'],
};

// 효과 허용 범위. 이 범위를 넘는 수치는 "게임 규칙 변경"으로 보고 거부한다.
export const EFFECT_LIMITS = {
  money: 2000000,
  fans: 3000,
  fame: 15,
  hp: 40,
  stat: 5,
  relationship: 10,
  stockPercent: 10,
  stockFixed: 3000,
};

export const LIMITS = {
  maxSteps: 30,
  maxDepth: 14,
  maxChoices: 4,
  maxBranches: 5,
  maxTextLength: 700,
  maxChoiceTextLength: 90,
  maxTitleLength: 40,
  maxDescriptionLength: 220,
  minDifficulty: 40,
  maxDifficulty: 100,
  maxTraitBonus: 20,
};

const TOP_LEVEL_KEYS = [
  'id', 'title', 'category', 'description', 'meta', 'conditions', 'weight', 'activityWeights', 'traitWeights',
  'memberId', 'collab', 'once', 'forced', 'urgent', 'timeSlot', 'stockEffect', 'start', 'steps', 'group',
];
const GROUP_NAME = /^[a-z0-9_]{1,40}$/;
const NODE_KEYS = {
  story: ['type', 'text', 'effects', 'next'],
  choice: ['type', 'text', 'choices'],
  check: ['type', 'text', 'check', 'outcomes'],
  branch: ['type', 'branches', 'next'],
  end: ['type', 'text', 'effects', 'result'],
};
const FLAG_NAME = /^[a-zA-Z][a-zA-Z0-9_]{1,40}$/;
const EVENT_ID = /^st_[a-z0-9_]{3,60}$/;
const STEP_ID = /^[a-zA-Z][a-zA-Z0-9_]{0,40}$/;

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isInt = (value) => Number.isInteger(value);

export function isStoryEvent(event) {
  return Boolean(event) && isObject(event.steps) && typeof event.start === 'string';
}

/* ===================== 검증 ===================== */

// context: {
//   memberIds, statKeys, traitIds, activityCategories, conditionKeys, tickers, investmentIds,
//   knownEventIds (선택: afterEventId / storyResult 참조 확인용)
// }
// 결과: { errors: string[], warnings: string[] } — errors 가 하나라도 있으면 게임에 넣지 않는다.
export function validateStoryEvent(event, context) {
  const errors = [];
  const warnings = [];
  const err = (path, message) => errors.push(`${path}: ${message}`);
  const warn = (path, message) => warnings.push(`${path}: ${message}`);

  if (!isObject(event)) return { errors: ['event: 객체가 아니다'], warnings };
  const id = typeof event.id === 'string' ? event.id : '(id 없음)';

  Object.keys(event).forEach((key) => {
    if (!TOP_LEVEL_KEYS.includes(key)) err(id, `허용되지 않은 최상위 키 "${key}"`);
  });

  if (!EVENT_ID.test(event.id || '')) err(id, 'id 는 st_ 로 시작하는 소문자 / 숫자 / _ 조합이어야 한다');
  checkPlainText(event.title, `${id}.title`, LIMITS.maxTitleLength, err);
  checkPlainText(event.description, `${id}.description`, LIMITS.maxDescriptionLength, err);
  if (!VOCAB.category.includes(event.category)) err(id, `category "${event.category}" 는 허용 목록(${VOCAB.category.join(', ')})에 없다`);

  // 메타데이터 (다양성 관리)
  if (!isObject(event.meta)) err(`${id}.meta`, '메타데이터가 없다');
  else {
    ['theme', 'conflict', 'resolution', 'tone'].forEach((key) => {
      if (!VOCAB[key].includes(event.meta[key])) err(`${id}.meta.${key}`, `"${event.meta[key]}" 는 허용 목록에 없다`);
    });
    ['setting', 'activity'].forEach((key) => {
      if (typeof event.meta[key] !== 'string' || event.meta[key].length === 0 || event.meta[key].length > 40) {
        err(`${id}.meta.${key}`, '1~40자 문자열이어야 한다');
      }
    });
    Object.keys(event.meta).forEach((key) => {
      if (!['theme', 'setting', 'conflict', 'resolution', 'activity', 'tone'].includes(key)) err(`${id}.meta`, `알 수 없는 키 "${key}"`);
    });
  }

  // 기존 이벤트와 공유하는 필드
  checkConditions(event.conditions, `${id}.conditions`, context, err);
  if (event.weight !== undefined && !(typeof event.weight === 'number' && event.weight >= 0 && event.weight <= 5)) err(`${id}.weight`, '0~5 사이 숫자여야 한다');
  checkWeightMap(event.activityWeights, `${id}.activityWeights`, context.activityCategories, err);
  checkWeightMap(event.traitWeights, `${id}.traitWeights`, context.traitIds, err);
  if (event.memberId !== undefined && !context.memberIds.includes(event.memberId)) err(`${id}.memberId`, `존재하지 않는 멤버 "${event.memberId}"`);
  if (event.collab !== undefined) {
    const { min, max } = isObject(event.collab) ? event.collab : {};
    if (!isInt(min) || !isInt(max) || min < 2 || max > 3 || min > max) err(`${id}.collab`, '{ min, max } 는 2~3 사이, min ≤ max 여야 한다');
  }
  ['once', 'forced', 'urgent'].forEach((key) => {
    if (event[key] !== undefined && typeof event[key] !== 'boolean') err(`${id}.${key}`, 'true / false 여야 한다');
  });
  if (event.group !== undefined && (typeof event.group !== 'string' || !GROUP_NAME.test(event.group))) {
    err(`${id}.group`, '소문자 / 숫자 / _ 로 된 1~40자 문자열이어야 한다');
  }
  if (event.timeSlot !== undefined && !TIME_SLOTS.includes(event.timeSlot)) err(`${id}.timeSlot`, `허용 값: ${TIME_SLOTS.join(', ')}`);
  if (event.stockEffect !== undefined) checkStockEffect(event.stockEffect, `${id}.stockEffect`, context, err);

  // 노드 그래프
  if (!isObject(event.steps)) {
    err(`${id}.steps`, '노드 목록이 없다');
    return { errors, warnings };
  }
  const stepIds = Object.keys(event.steps);
  if (stepIds.length === 0) err(`${id}.steps`, '노드가 하나도 없다');
  if (stepIds.length > LIMITS.maxSteps) err(`${id}.steps`, `노드는 최대 ${LIMITS.maxSteps}개`);
  if (!event.steps[event.start]) err(`${id}.start`, `시작 노드 "${event.start}" 가 없다`);

  stepIds.forEach((stepId) => {
    const node = event.steps[stepId];
    const path = `${id}.steps.${stepId}`;
    if (!STEP_ID.test(stepId)) err(path, '노드 id 는 영문으로 시작하는 영문 / 숫자 / _ 조합이어야 한다');
    checkNode(node, path, event, context, err, warn);
  });

  checkGraph(event, id, err, warn);
  return { errors, warnings };
}

function checkNode(node, path, event, context, err, warn) {
  if (!isObject(node)) return err(path, '노드가 객체가 아니다');
  if (!NODE_TYPES.includes(node.type)) return err(path, `알 수 없는 노드 종류 "${node.type}"`);
  Object.keys(node).forEach((key) => {
    if (!NODE_KEYS[node.type].includes(key)) err(path, `${node.type} 노드에 허용되지 않은 키 "${key}"`);
  });
  const nextOk = (target, where) => {
    if (typeof target !== 'string' || !event.steps[target]) err(where, `연결된 노드 "${target}" 가 없다`);
  };

  switch (node.type) {
    case 'story':
      checkText(node.text, `${path}.text`, context, err);
      checkEffects(node.effects, `${path}.effects`, context, err);
      nextOk(node.next, `${path}.next`);
      break;
    case 'choice': {
      checkText(node.text, `${path}.text`, context, err);
      if (!Array.isArray(node.choices) || node.choices.length === 0 || node.choices.length > LIMITS.maxChoices) {
        err(`${path}.choices`, `선택지는 1~${LIMITS.maxChoices}개`);
        break;
      }
      node.choices.forEach((choice, index) => {
        const where = `${path}.choices[${index}]`;
        if (!isObject(choice)) return err(where, '선택지가 객체가 아니다');
        Object.keys(choice).forEach((key) => {
          if (!['text', 'story', 'conditions', 'effects', 'next'].includes(key)) err(where, `허용되지 않은 키 "${key}"`);
        });
        checkPlainText(choice.text, `${where}.text`, LIMITS.maxChoiceTextLength, err);
        if (typeof choice.text === 'string') checkPlaceholders(choice.text, `${where}.text`, err);
        if (choice.story !== undefined) checkText(choice.story, `${where}.story`, context, err);
        checkConditions(choice.conditions, `${where}.conditions`, context, err);
        checkEffects(choice.effects, `${where}.effects`, context, err);
        nextOk(choice.next, `${where}.next`);
      });
      // 어떤 상황에서도 고를 수 있는 선택지가 하나는 있어야 한다.
      if (!node.choices.some((choice) => isObject(choice) && !choice.conditions)) {
        err(`${path}.choices`, '조건 없는 선택지가 최소 1개 있어야 한다');
      }
      break;
    }
    case 'check': {
      checkText(node.text, `${path}.text`, context, err);
      const check = node.check;
      if (!isObject(check)) {
        err(`${path}.check`, '판정 정보가 없다');
      } else {
        Object.keys(check).forEach((key) => {
          if (!['stat', 'difficulty', 'traitBonus'].includes(key)) err(`${path}.check`, `허용되지 않은 키 "${key}"`);
        });
        if (!context.statKeys.includes(check.stat)) err(`${path}.check.stat`, `존재하지 않는 스탯 "${check.stat}"`);
        if (!isInt(check.difficulty) || check.difficulty < LIMITS.minDifficulty || check.difficulty > LIMITS.maxDifficulty) {
          err(`${path}.check.difficulty`, `${LIMITS.minDifficulty}~${LIMITS.maxDifficulty} 사이 정수여야 한다`);
        }
        if (check.traitBonus !== undefined) {
          if (!isObject(check.traitBonus)) err(`${path}.check.traitBonus`, '객체여야 한다');
          else Object.entries(check.traitBonus).forEach(([trait, bonus]) => {
            if (!context.traitIds.includes(trait)) err(`${path}.check.traitBonus`, `존재하지 않는 태그 "${trait}"`);
            if (!isInt(bonus) || bonus < 0 || bonus > LIMITS.maxTraitBonus) err(`${path}.check.traitBonus.${trait}`, `0~${LIMITS.maxTraitBonus} 사이 정수`);
          });
        }
      }
      if (!isObject(node.outcomes)) {
        err(`${path}.outcomes`, '판정 결과가 없다');
        break;
      }
      Object.keys(node.outcomes).forEach((key) => {
        if (!CHECK_OUTCOMES.includes(key)) err(`${path}.outcomes`, `알 수 없는 결과 "${key}"`);
      });
      ['success', 'fail'].forEach((key) => {
        if (!node.outcomes[key]) err(`${path}.outcomes`, `${key} 결과는 반드시 있어야 한다`);
      });
      CHECK_OUTCOMES.forEach((key) => {
        const outcome = node.outcomes[key];
        if (outcome === undefined) return;
        const where = `${path}.outcomes.${key}`;
        if (!isObject(outcome)) return err(where, '객체가 아니다');
        Object.keys(outcome).forEach((field) => {
          if (!['text', 'effects', 'next'].includes(field)) err(where, `허용되지 않은 키 "${field}"`);
        });
        checkText(outcome.text, `${where}.text`, context, err);
        checkEffects(outcome.effects, `${where}.effects`, context, err);
        nextOk(outcome.next, `${where}.next`);
      });
      if (!node.outcomes.partial) warn(path, '부분성공(partial) 결과가 없다 — 부분성공은 실패로 처리된다');
      break;
    }
    case 'branch':
      if (!Array.isArray(node.branches) || node.branches.length === 0 || node.branches.length > LIMITS.maxBranches) {
        err(`${path}.branches`, `분기는 1~${LIMITS.maxBranches}개`);
      } else {
        node.branches.forEach((branch, index) => {
          const where = `${path}.branches[${index}]`;
          if (!isObject(branch) || !isObject(branch.when)) return err(where, '{ when, next } 형식이어야 한다');
          Object.keys(branch).forEach((key) => {
            if (!['when', 'next'].includes(key)) err(where, `허용되지 않은 키 "${key}"`);
          });
          checkConditions(branch.when, `${where}.when`, context, err);
          nextOk(branch.next, `${where}.next`);
        });
      }
      nextOk(node.next, `${path}.next (기본 분기)`);
      break;
    case 'end':
      checkText(node.text, `${path}.text`, context, err);
      checkEffects(node.effects, `${path}.effects`, context, err);
      if (!END_RESULTS.includes(node.result)) err(`${path}.result`, `허용 값: ${END_RESULTS.join(', ')}`);
      break;
    default:
      break;
  }
  return undefined;
}

// 노드 그래프: 도달 불가 노드 / 순환 / 너무 긴 경로 / 끝나지 않는 경로를 찾는다.
function checkGraph(event, id, err, warn) {
  const { steps, start } = event;
  if (!steps[start]) return;
  const nextsOf = (node) => {
    if (!isObject(node)) return [];
    switch (node.type) {
      case 'story': return [node.next];
      case 'choice': return (node.choices || []).map((choice) => choice?.next);
      case 'check': return CHECK_OUTCOMES.map((key) => node.outcomes?.[key]?.next);
      case 'branch': return [...(node.branches || []).map((branch) => branch?.next), node.next];
      default: return [];
    }
  };

  const reachable = new Set();
  const stack = [start];
  while (stack.length) {
    const stepId = stack.pop();
    if (reachable.has(stepId) || !steps[stepId]) continue;
    reachable.add(stepId);
    nextsOf(steps[stepId]).forEach((next) => { if (typeof next === 'string') stack.push(next); });
  }
  Object.keys(steps).forEach((stepId) => {
    if (!reachable.has(stepId)) err(`${id}.steps.${stepId}`, '시작 노드에서 도달할 수 없는 노드');
  });
  if (![...reachable].some((stepId) => steps[stepId]?.type === 'end')) err(`${id}.steps`, 'end 노드에 도달할 수 없다');

  // 순환 검사 + 최장 경로 (순환이 없어야 이벤트가 반드시 끝난다). 노드별 결과를 기억해 한 번씩만 계산한다.
  const color = {};
  const longestFrom = {};
  const visit = (stepId) => {
    if (!steps[stepId]) return 0;
    if (color[stepId] === 'visiting') {
      err(`${id}.steps.${stepId}`, '순환 연결이 있다 (이벤트가 끝나지 않을 수 있다)');
      return 0;
    }
    if (color[stepId] === 'done') return longestFrom[stepId];
    color[stepId] = 'visiting';
    const deepest = Math.max(0, ...nextsOf(steps[stepId]).filter((next) => typeof next === 'string').map(visit));
    color[stepId] = 'done';
    longestFrom[stepId] = deepest + 1;
    return longestFrom[stepId];
  };
  const longest = visit(start);
  if (longest > LIMITS.maxDepth) warn(`${id}.steps`, `가장 긴 경로가 ${longest}단계로 길다 (권장 ${LIMITS.maxDepth} 이하)`);
}

/* ---------- 부분 검사 ---------- */

function checkPlainText(value, path, maxLength, err) {
  if (typeof value !== 'string' || value.trim().length === 0) return err(path, '비어 있지 않은 문자열이어야 한다');
  if (value.length > maxLength) err(path, `${maxLength}자 이하여야 한다`);
  if (/<[a-z/!]/i.test(value)) err(path, 'HTML 태그를 쓸 수 없다');
  return undefined;
}

function checkPlaceholders(value, path, err) {
  const found = value.match(/\{[^}]*\}/g) || [];
  found.forEach((token) => {
    if (!PLACEHOLDERS.includes(token.slice(1, -1))) err(path, `알 수 없는 치환어 ${token} (허용: {member}, {partners})`);
  });
}

function checkText(value, path, context, err) {
  if (typeof value === 'string') {
    checkPlainText(value, path, LIMITS.maxTextLength, err);
    checkPlaceholders(value, path, err);
    return;
  }
  if (!Array.isArray(value) || value.length === 0) {
    err(path, '문자열 또는 [{ when, text }] 배열이어야 한다');
    return;
  }
  value.forEach((variant, index) => {
    const where = `${path}[${index}]`;
    if (!isObject(variant)) return err(where, '객체가 아니다');
    Object.keys(variant).forEach((key) => {
      if (!['when', 'text'].includes(key)) err(where, `허용되지 않은 키 "${key}"`);
    });
    checkPlainText(variant.text, `${where}.text`, LIMITS.maxTextLength, err);
    if (typeof variant.text === 'string') checkPlaceholders(variant.text, `${where}.text`, err);
    if (variant.when !== undefined) checkConditions(variant.when, `${where}.when`, context, err);
    return undefined;
  });
  if (value[value.length - 1]?.when !== undefined) err(path, '마지막 문장은 조건(when) 없는 기본 문장이어야 한다');
}

function checkWeightMap(map, path, allowed, err) {
  if (map === undefined) return;
  if (!isObject(map)) return err(path, '객체여야 한다');
  Object.entries(map).forEach(([key, value]) => {
    if (!allowed.includes(key)) err(path, `알 수 없는 키 "${key}"`);
    if (typeof value !== 'number' || value < 0 || value > 5) err(`${path}.${key}`, '0~5 사이 숫자');
  });
  return undefined;
}

// 조건: 키가 조건 맵에 있어야 하고, 멤버 / 태그 / 카테고리 / 스탯 참조가 실제로 존재해야 한다.
function checkConditions(conditions, path, context, err) {
  if (conditions === undefined) return;
  if (!isObject(conditions)) return err(path, '객체여야 한다');
  const list = (value) => (Array.isArray(value) ? value : [value]);
  Object.entries(conditions).forEach(([key, value]) => {
    if (!context.conditionKeys.includes(key)) return err(path, `알 수 없는 조건 "${key}"`);
    const where = `${path}.${key}`;
    if (['activityCategories', 'blockedActivityCategories'].includes(key)) {
      list(value).forEach((item) => { if (!context.activityCategories.includes(item)) err(where, `알 수 없는 일정 카테고리 "${item}"`); });
    }
    if (['requiredTraits', 'anyTraits', 'blockedTraits'].includes(key)) {
      list(value).forEach((item) => { if (!context.traitIds.includes(item)) err(where, `알 수 없는 태그 "${item}"`); });
    }
    if (['requiredFlags', 'blockedFlags', 'memberFlags', 'blockedMemberFlags'].includes(key)) {
      if (!Array.isArray(value) || !value.every((flag) => FLAG_NAME.test(flag))) err(where, '플래그 이름 배열이어야 한다');
    }
    if (key === 'minStat') {
      if (!isObject(value)) err(where, '{ 스탯: 값 } 형식이어야 한다');
      else Object.keys(value).forEach((stat) => { if (!context.statKeys.includes(stat)) err(where, `존재하지 않는 스탯 "${stat}"`); });
    }
    if (key === 'activity') {
      list(value).forEach((item) => { if (context.activityIds && !context.activityIds.includes(item)) err(where, `알 수 없는 일정 "${item}"`); });
    }
    if (key === 'withMember') {
      list(value).forEach((item) => { if (!context.memberIds.includes(item)) err(where, `존재하지 않는 멤버 "${item}"`); });
    }
    if (['afterEventId', 'storyResult'].includes(key) && context.knownEventIds) {
      const refId = typeof value === 'string' ? value : value?.id;
      if (!context.knownEventIds.includes(refId)) err(where, `존재하지 않는 이벤트 "${refId}"`);
    }
    if (key === 'storyResult') {
      const results = list(value?.result);
      if (!isObject(value) || !results.every((result) => END_RESULTS.includes(result))) err(where, '{ id, result } 형식이어야 한다');
    }
    return undefined;
  });
  return undefined;
}

function checkRange(value, limit, path, err) {
  if (!isInt(value) || Math.abs(value) > limit) err(path, `-${limit}~${limit} 사이 정수여야 한다`);
}

function checkStats(value, path, context, err) {
  if (!isObject(value)) return err(path, '{ 스탯: 값 } 형식이어야 한다');
  Object.entries(value).forEach(([stat, amount]) => {
    if (!context.statKeys.includes(stat)) err(path, `존재하지 않는 스탯 "${stat}"`);
    checkRange(amount, EFFECT_LIMITS.stat, `${path}.${stat}`, err);
  });
  return undefined;
}

function checkStockEffect(value, path, context, err) {
  const items = Array.isArray(value) ? value : [value];
  if (items.length === 0 || items.length > 3) return err(path, '종목 영향은 1~3개');
  items.forEach((item, index) => {
    const where = Array.isArray(value) ? `${path}[${index}]` : path;
    if (!isObject(item)) return err(where, '객체가 아니다');
    if (!context.tickers.includes(item.ticker)) err(where, `존재하지 않는 종목 "${item.ticker}"`);
    const hasPercent = item.percentage !== undefined;
    const hasFixed = item.fixedChange !== undefined;
    if (hasPercent === hasFixed) err(where, 'percentage 또는 fixedChange 중 하나만 써야 한다');
    if (hasPercent && !(typeof item.percentage === 'number' && Math.abs(item.percentage) <= EFFECT_LIMITS.stockPercent)) {
      err(`${where}.percentage`, `-${EFFECT_LIMITS.stockPercent}~${EFFECT_LIMITS.stockPercent}`);
    }
    if (hasFixed) checkRange(item.fixedChange, EFFECT_LIMITS.stockFixed, `${where}.fixedChange`, err);
    return undefined;
  });
  return undefined;
}

// 효과: 허용된 키만, 허용된 범위 안의 값만.
export const STORY_EFFECT_KEYS = ['money', 'fans', 'fame', 'hp', 'stats', 'relationship', 'flags', 'memberFlags', 'team', 'stockEffect', 'startInvestment'];

function checkEffects(effects, path, context, err) {
  if (effects === undefined) return;
  if (!isObject(effects)) return err(path, '객체여야 한다');
  Object.entries(effects).forEach(([key, value]) => {
    const where = `${path}.${key}`;
    switch (key) {
      case 'money': return checkRange(value, EFFECT_LIMITS.money, where, err);
      case 'fans': return checkRange(value, EFFECT_LIMITS.fans, where, err);
      case 'fame': return checkRange(value, EFFECT_LIMITS.fame, where, err);
      case 'hp': return checkRange(value, EFFECT_LIMITS.hp, where, err);
      case 'relationship': return checkRange(value, EFFECT_LIMITS.relationship, where, err);
      case 'stats': return checkStats(value, where, context, err);
      case 'flags':
      case 'memberFlags':
        if (!isObject(value)) return err(where, '{ 플래그: true/false } 형식이어야 한다');
        Object.entries(value).forEach(([flag, on]) => {
          if (!FLAG_NAME.test(flag)) err(where, `플래그 이름 "${flag}" 형식이 잘못됐다`);
          if (typeof on !== 'boolean') err(`${where}.${flag}`, 'true / false 여야 한다');
        });
        return undefined;
      case 'team':
        if (!isObject(value)) return err(where, '{ hp?, stats? } 형식이어야 한다');
        Object.keys(value).forEach((field) => { if (!['hp', 'stats'].includes(field)) err(where, `허용되지 않은 키 "${field}"`); });
        if (value.hp !== undefined) checkRange(value.hp, EFFECT_LIMITS.hp, `${where}.hp`, err);
        if (value.stats !== undefined) checkStats(value.stats, `${where}.stats`, context, err);
        return undefined;
      case 'stockEffect': return checkStockEffect(value, where, context, err);
      case 'startInvestment': {
        const investmentId = typeof value === 'string' ? value : value?.id;
        if (!context.investmentIds.includes(investmentId)) err(where, `존재하지 않는 투자 "${investmentId}"`);
        if (isObject(value) && value.costMultiplier !== undefined && !(value.costMultiplier >= 0.5 && value.costMultiplier <= 1)) {
          err(`${where}.costMultiplier`, '0.5~1 사이');
        }
        return undefined;
      }
      default:
        return err(path, `허용되지 않은 효과 "${key}" (허용: ${STORY_EFFECT_KEYS.join(', ')})`);
    }
  });
  return undefined;
}

/* ===================== 여러 이벤트 묶음 검사 ===================== */

// ID 중복 + 이벤트 간 참조 + 구조 / 문장 유사도
export function validateStoryCollection(events, context, { similarityThreshold = 0.55 } = {}) {
  const results = new Map();
  const knownEventIds = [...(context.knownEventIds || []), ...events.map((event) => event?.id)];
  const seen = new Map();
  events.forEach((event) => {
    const result = validateStoryEvent(event, { ...context, knownEventIds });
    if (seen.has(event?.id)) result.errors.push(`${event?.id}: 이벤트 id 중복`);
    seen.set(event?.id, true);
    if (context.knownEventIds?.includes(event?.id)) result.errors.push(`${event?.id}: 기존 이벤트와 id 가 겹친다`);
    results.set(event, result);
  });

  const similar = findSimilarEvents(events, similarityThreshold);
  similar.forEach(({ a, b, reason }) => {
    results.get(b)?.warnings.push(`${b.id}: ${a.id} 와 비슷하다 (${reason})`);
  });
  return { results, similar };
}

/* ===================== 다양성 / 유사도 ===================== */

export function storySignature(event) {
  const meta = event?.meta || {};
  return [meta.theme, meta.conflict, meta.resolution].join('|');
}

// 이벤트의 모든 문장 (유사도 비교 / 요약용)
export function collectStoryText(event) {
  const texts = [event.title, event.description];
  const pushText = (value) => {
    if (typeof value === 'string') texts.push(value);
    else if (Array.isArray(value)) value.forEach((variant) => texts.push(variant?.text || ''));
  };
  Object.values(event.steps || {}).forEach((node) => {
    pushText(node?.text);
    (node?.choices || []).forEach((choice) => { texts.push(choice?.text || ''); pushText(choice?.story); });
    Object.values(node?.outcomes || {}).forEach((outcome) => pushText(outcome?.text));
  });
  return texts.join(' ');
}

function trigrams(text) {
  const clean = text.replace(/\{[^}]*\}/g, '').replace(/[^\p{L}\p{N}]/gu, '');
  const grams = new Set();
  for (let i = 0; i < clean.length - 2; i += 1) grams.add(clean.slice(i, i + 3));
  return grams;
}

export function textSimilarity(textA, textB) {
  const a = trigrams(textA);
  const b = trigrams(textB);
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  a.forEach((gram) => { if (b.has(gram)) shared += 1; });
  return shared / (a.size + b.size - shared);
}

// 같은 구조(theme + conflict + resolution + setting) 이거나 문장이 많이 겹치는 쌍
export function findSimilarEvents(events, threshold = 0.55) {
  const pairs = [];
  const valid = events.filter((event) => isObject(event) && isObject(event.meta));
  const texts = valid.map((event) => collectStoryText(event));
  for (let i = 0; i < valid.length; i += 1) {
    for (let j = i + 1; j < valid.length; j += 1) {
      const a = valid[i];
      const b = valid[j];
      if (storySignature(a) === storySignature(b) && a.meta.setting === b.meta.setting) {
        pairs.push({ a, b, reason: `같은 구조 ${storySignature(a)} / ${a.meta.setting}` });
        continue;
      }
      const score = textSimilarity(texts[i], texts[j]);
      if (score >= threshold) pairs.push({ a, b, reason: `문장 유사도 ${(score * 100).toFixed(0)}%` });
    }
  }
  return pairs;
}

// 메타 조합 사용 현황 (프롬프트 생성 시 덜 쓰인 조합을 추천하는 데 쓴다)
export function metaCoverage(events) {
  const count = (key) => {
    const map = Object.fromEntries(VOCAB[key].map((value) => [value, 0]));
    events.forEach((event) => { if (event?.meta?.[key] in map) map[event.meta[key]] += 1; });
    return map;
  };
  const categories = Object.fromEntries(VOCAB.category.map((value) => [value, 0]));
  events.forEach((event) => { if (event?.category in categories) categories[event.category] += 1; });
  return { category: categories, theme: count('theme'), conflict: count('conflict'), resolution: count('resolution'), tone: count('tone') };
}
