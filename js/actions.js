// actions.js — 선택지 / 일정의 effects 를 실제 state 에 적용하는 유일한 지점
// 성공 판정(성공률 계산, 결과 굴림)도 이곳에서 한다.

import { TRAITS } from './members.js';
import {
  LIMITS,
  STAT_KEYS,
  HP_RULES,
  ENTRY_KIND,
  LOG_KIND,
  getMember,
  addLog,
  markMemberCompleted,
  getScheduleEntry,
  getRelationship,
  setRelationship,
  recordEventHistory,
} from './state.js';
import { getActivityById, getEventById } from './events.js';
import { getInvestment, getShopTotal } from './economy-data.js';
import { applyStockEffect, getDueInvestments, startInvestment } from './economy.js';

/* ===================== 규칙 (임시 수치) ===================== */

// 성공률 = clamp(base + (스탯 - 난이도) × perPoint + 태그 보너스 - HP 페널티 + 관계 보너스, min, max)
// 대성공은 성공 구간 중 greatRatio 비율. 플레이어에게는 '성공률'만 보여준다.
export const CHECK_RULES = {
  base: 50,
  perPoint: 2,
  min: 5,
  max: 95,
  greatRatio: 0.25,
  tiredPenalty: 10,
  exhaustedPenalty: 25,
  // 콜라보: (평균 관계도 - baseline) / divisor 만큼 보너스
  relationshipBaseline: 20,
  relationshipDivisor: 4,
};

// 일반 일정 자동 판정
export const ROUTINE_RULES = {
  difficulty: 70,
  traitBonus: 10,
  multipliers: { great: 1.6, success: 1, fail: 0.4 },
};

// 콜라보: 참여 인원이 2명보다 많으면 팬 증가량에 배율을 더한다.
export const COLLAB_RULES = { fanBonusPerExtraMember: 0.3 };

export const OUTCOME = { GREAT: 'great', SUCCESS: 'success', FAIL: 'fail' };

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function average(items, getValue) {
  if (items.length === 0) return 0;
  return items.reduce((sum, item) => sum + getValue(item), 0) / items.length;
}

function forEachPair(members, callback) {
  members.forEach((memberA, index) => {
    members.slice(index + 1).forEach((memberB) => callback(memberA, memberB));
  });
}

/* ===================== 판정 ===================== */

export function getHpState(member) {
  if (member.hp <= HP_RULES.exhausted) return 'exhausted';
  if (member.hp <= HP_RULES.tired) return 'tired';
  return 'normal';
}

function getHpPenalty(member) {
  const hpState = getHpState(member);
  if (hpState === 'exhausted') return CHECK_RULES.exhaustedPenalty;
  if (hpState === 'tired') return CHECK_RULES.tiredPenalty;
  return 0;
}

// 선택지의 traitBonus + 태그 정의의 시간대 보너스
function getTraitBonus(member, check, timeSlot) {
  return member.traits.reduce((bonus, trait) => {
    const fromCheck = check.traitBonus?.[trait] || 0;
    const fromSlot = TRAITS[trait]?.checkBonusBySlot?.[timeSlot] || 0;
    return bonus + fromCheck + fromSlot;
  }, 0);
}

export function getAverageRelationship(members) {
  const values = [];
  forEachPair(members, (memberA, memberB) => values.push(getRelationship(memberA.id, memberB.id)));
  return average(values, (value) => value);
}

// 성공률(%) — 대성공을 포함한 '성공 이상'의 확률. 콜라보면 참여자 평균으로 계산한다.
export function getSuccessChance(members, check, timeSlot) {
  let chance =
    CHECK_RULES.base +
    (average(members, (member) => member.stats[check.stat]) - check.difficulty) * CHECK_RULES.perPoint;

  chance += average(members, (member) => getTraitBonus(member, check, timeSlot));
  chance -= average(members, getHpPenalty);

  if (members.length > 1) {
    chance +=
      (getAverageRelationship(members) - CHECK_RULES.relationshipBaseline) /
      CHECK_RULES.relationshipDivisor;
  }

  return Math.round(clamp(chance, CHECK_RULES.min, CHECK_RULES.max));
}

export function rollOutcome(chance, rng = Math.random) {
  const roll = rng() * 100;
  if (roll < chance * CHECK_RULES.greatRatio) return OUTCOME.GREAT;
  if (roll < chance) return OUTCOME.SUCCESS;
  return OUTCOME.FAIL;
}

/* ===================== 효과 적용 ===================== */

// HP 소모 배율: 태그의 hpCostRate × 시간대별 hpCostBySlot (소모에만 적용)
function getHpCostRate(member, timeSlot) {
  return member.traits.reduce((rate, trait) => {
    const def = TRAITS[trait];
    if (!def) return rate;
    return rate * (def.hpCostRate ?? 1) * (def.hpCostBySlot?.[timeSlot] ?? 1);
  }, 1);
}

// 변화량은 실제로 적용된 차이(after - before)만 기록하고, 0 은 기록하지 않는다.
// owners: 여러 멤버가 참여할 때 누구의 변화인지 (멤버 id 배열)
function pushDelta(deltas, key, delta, owners = null) {
  if (delta !== 0) deltas.push(owners ? { key, delta, owners } : { key, delta });
}

function applyScalar({ state }, key, value, deltas) {
  const before = state[key];
  state[key] = clamp(before + value, LIMITS[key].min, LIMITS[key].max);
  pushDelta(deltas, key, state[key] - before);
}

// 멤버 단위 효과는 참여 멤버 전원에게 적용한다. 멤버가 여럿이면 owners 를 붙인다.
function ownersOf(ctx, member) {
  return ctx.members.length > 1 ? [member.id] : null;
}

// 효과 처리 맵: ctx = { state, members, timeSlot }
// 나중에 효과를 늘릴 때는 이 맵에 항목 하나만 추가하면 된다.
export const EFFECT_HANDLERS = {
  money: (ctx, value, deltas) => applyScalar(ctx, 'money', value, deltas),
  // 팬 증가에는 상점(콘텐츠 제작 투자) 보너스가 붙는다.
  fans: (ctx, value, deltas) => {
    const bonus = value > 0 ? 1 + getShopTotal(ctx.state.shop.levels, 'fanBonus') : 1;
    applyScalar(ctx, 'fans', Math.round(value * bonus), deltas);
  },
  fame: (ctx, value, deltas) => applyScalar(ctx, 'fame', value, deltas),

  hp: (ctx, value, deltas) => {
    ctx.members.forEach((member) => {
      const amount = value < 0 ? Math.round(value * getHpCostRate(member, ctx.timeSlot)) : value;
      const before = member.hp;
      member.hp = clamp(before + amount, LIMITS.hp.min, LIMITS.hp.max);
      pushDelta(deltas, 'hp', member.hp - before, ownersOf(ctx, member));
    });
  },

  stats: (ctx, value, deltas) => {
    ctx.members.forEach((member) => {
      STAT_KEYS.forEach((key) => {
        if (!(key in value)) return;
        const before = member.stats[key];
        member.stats[key] = clamp(before + value[key], LIMITS.stat.min, LIMITS.stat.max);
        pushDelta(deltas, key, member.stats[key] - before, ownersOf(ctx, member));
      });
    });
  },

  flags: ({ state }, value) => {
    Object.assign(state.flags, value);
  },

  memberFlags: ({ members }, value) => {
    members.forEach((member) => Object.assign(member.flags, value));
  },

  // 참여 멤버들 사이의 모든 쌍에 관계도를 더한다.
  relationship: ({ members }, value, deltas) => {
    forEachPair(members, (memberA, memberB) => {
      const before = getRelationship(memberA.id, memberB.id);
      const after = clamp(before + value, LIMITS.relationship.min, LIMITS.relationship.max);
      setRelationship(memberA.id, memberB.id, after);
      pushDelta(deltas, 'relationship', after - before, [memberA.id, memberB.id]);
    });
  },

  // 전 멤버에게 적용: { hp, stats } — 변화량은 '전원' 한 줄로 기록한다.
  team: ({ state, timeSlot }, value, deltas) => {
    const teamCtx = { state, members: state.members, timeSlot };
    const memberDeltas = [];
    if (value.hp) EFFECT_HANDLERS.hp(teamCtx, value.hp, memberDeltas);
    if (value.stats) EFFECT_HANDLERS.stats(teamCtx, value.stats, memberDeltas);
    ['hp', ...STAT_KEYS].forEach((key) => {
      const changed = memberDeltas.filter((delta) => delta.key === key);
      if (changed.length === 0) return;
      const average = Math.round(changed.reduce((sum, delta) => sum + delta.delta, 0) / changed.length);
      if (average !== 0) deltas.push({ key, delta: average, team: true });
    });
  },

  // 가상 주가 변동: { ticker, percentage } | { ticker, fixedChange } | 배열
  stockEffect: ({ state }, value, deltas) => {
    applyStockEffect(state, value).forEach(({ ticker, percent }) =>
      deltas.push({ key: 'stock', ticker, delta: percent }),
    );
  },

  // 이벤트에서 장기 투자 시작: 'investmentId' | { id, costMultiplier }
  startInvestment: ({ state }, value, deltas) => {
    const { id, costMultiplier = 1 } = typeof value === 'string' ? { id: value } : value;
    const result = startInvestment(state, id, { costMultiplier, source: 'event', log: false });
    if (result.ok) {
      pushDelta(deltas, 'money', -result.record.cost);
      deltas.push({ key: 'investment', investmentId: id, delta: result.record.resultDay });
    }
  },
};

export function applyEffects(state, members, effects, { timeSlot = 'evening' } = {}) {
  const deltas = [];
  const ctx = { state, members, timeSlot };

  Object.entries(effects || {}).forEach(([key, value]) => {
    const handler = EFFECT_HANDLERS[key];
    // 모르는 효과 키는 건너뛴다.
    if (!handler) return;
    handler(ctx, value, deltas);
  });

  return deltas;
}

// 같은 항목 + 같은 대상의 변화량을 하나로 합친다. (기본 효과 + 판정 결과 효과)
// 대상 식별: 멤버 / 종목 / 전원 / 투자가 다르면 합치지 않는다.
function deltaIdentity(delta) {
  return [delta.key, (delta.owners || []).join('|'), delta.ticker || '', delta.team ? 'team' : '', delta.investmentId || ''].join('/');
}

function mergeDeltas(deltas) {
  const merged = [];
  deltas.forEach((delta) => {
    const identity = deltaIdentity(delta);
    const found = merged.find((item) => deltaIdentity(item) === identity);
    if (found && delta.key !== 'investment') found.delta = Math.round((found.delta + delta.delta) * 10) / 10;
    else merged.push({ ...delta });
  });
  return merged.filter((delta) => delta.delta !== 0);
}

function scaleEffects(effects, keys, factor) {
  if (!effects) return effects;
  const scaled = { ...effects };
  keys.forEach((key) => {
    if (typeof scaled[key] === 'number') scaled[key] = Math.round(scaled[key] * factor);
  });
  return scaled;
}

/* ===================== 일반 일정 (자동 진행) ===================== */

function resolveRoutine(state, entry) {
  const member = getMember(entry.memberId);
  const activity = getActivityById(entry.activityId);
  if (!member || !activity) return;

  let check = null;
  let factor = 1;

  if (!activity.rest) {
    const routineCheck = {
      stat: activity.stat,
      difficulty: ROUTINE_RULES.difficulty,
      traitBonus: Object.fromEntries(activity.traits.map((trait) => [trait, ROUTINE_RULES.traitBonus])),
    };
    const chance = getSuccessChance([member], routineCheck, activity.timeSlot);
    const outcome = rollOutcome(chance);
    factor = ROUTINE_RULES.multipliers[outcome];
    check = { stat: activity.stat, chance, outcome };
  }

  const effects = {
    money: Math.round(activity.money * factor),
    fans: Math.round(activity.fans * factor),
    hp: activity.hp,
  };
  const deltas = applyEffects(state, [member], effects, { timeSlot: activity.timeSlot });

  addLog({
    day: state.currentDay,
    kind: ENTRY_KIND.ROUTINE,
    memberIds: [member.id],
    title: `${activity.icon} ${activity.label}`,
    choiceText: null,
    // 주가에 콘텐츠 결과를 반영할 때 쓰는 일정 카테고리
    categories: activity.categories || [],
    check,
    deltas,
  });

  markMemberCompleted(member.id);
}

// 아직 끝나지 않은 일반 일정을 모두 자동 진행한다.
export function resolveRoutines(state) {
  state.schedule
    .filter((entry) => !entry.done && entry.kind === ENTRY_KIND.ROUTINE)
    .forEach((entry) => resolveRoutine(state, entry));
}

/* ===================== 중요 이벤트 / 콜라보 ===================== */

// 이벤트가 벌어지는 시간대: 이벤트 → 오늘 일정 → 기본값 순서
export function getEventTimeSlot(event, memberId) {
  const entry = getScheduleEntry(memberId);
  const activity = entry ? getActivityById(entry.activityId) : null;
  return event.timeSlot || activity?.timeSlot || 'evening';
}

// 선택지를 고를 수 있는 상태인지 (콜라보는 최소 인원을 채워야 한다)
export function canChoose(state) {
  const event = state.currentEvent;
  if (!event) return false;
  if (!event.collab) return true;
  return state.collabPartnerIds.length + 1 >= event.collab.min;
}

export function getEventParticipants(state) {
  const host = getMember(state.selectedMemberId);
  if (!host) return [];
  const partners = state.currentEvent?.collab
    ? state.collabPartnerIds.map(getMember).filter(Boolean)
    : [];
  return [host, ...partners];
}

export function resolveChoice(state, choice) {
  const event = state.currentEvent;
  const members = getEventParticipants(state);
  if (!event || members.length === 0 || !canChoose(state)) return null;

  const [host, ...partners] = members;
  const timeSlot = getEventTimeSlot(event, host.id);
  const deltas = applyEffects(state, members, choice.effects, { timeSlot });

  let check = null;
  if (choice.check) {
    const chance = getSuccessChance(members, choice.check, timeSlot);
    const outcome = rollOutcome(chance);
    let outcomeEffects = choice.outcomes?.[outcome];
    if (event.collab) {
      const factor = 1 + (members.length - 2) * COLLAB_RULES.fanBonusPerExtraMember;
      outcomeEffects = scaleEffects(outcomeEffects, ['fans'], factor);
    }
    deltas.push(...applyEffects(state, members, outcomeEffects, { timeSlot }));
    check = { stat: choice.check.stat, chance, outcome };
  }

  // 이벤트 자체의 stockEffect 는 선택과 무관한 '소식'이라 아침 장 시작 때 이미 반영됐다.
  // (applyScheduledStockEffects — 이벤트를 미리 보고 주식을 사는 선행매매를 막는다)

  const hostEntry = getScheduleEntry(host.id);
  const log = {
    day: state.currentDay,
    kind: event.collab ? ENTRY_KIND.COLLAB : ENTRY_KIND.IMPORTANT,
    memberIds: members.map((member) => member.id),
    title: event.title,
    choiceText: choice.text,
    categories: getActivityById(hostEntry?.activityId)?.categories || [],
    check,
    deltas: mergeDeltas(deltas),
  };
  addLog(log);

  // 콜라보 주최 멤버는 누구와 함께했는지 기록한다. (일정표 표시 / 저장용)
  markMemberCompleted(host.id, event.collab ? { collabPartnerIds: partners.map((partner) => partner.id) } : {});
  // 콜라보 파트너는 원래 일정 대신 콜라보에 참여한 것으로 처리한다.
  partners.forEach((partner) =>
    markMemberCompleted(partner.id, { kind: ENTRY_KIND.COLLAB, collabHostId: host.id, eventId: event.id }),
  );
  recordEventHistory(event.id);

  return log;
}

/* ===================== 시장 소식 (이벤트 stockEffect) ===================== */

// 오늘 배정된 중요 이벤트 / 콜라보 중 이벤트 자체에 stockEffect 가 있는 것을 장 시작 때 반영한다.
// 플레이어가 이벤트 내용을 보기 전에 가격이 움직이므로, 미리 알고 사는 선행매매가 불가능하다.
export function applyScheduledStockEffects(state) {
  const applied = [];
  state.schedule.forEach((entry) => {
    const event = entry.eventId ? getEventById(entry.eventId) : null;
    if (!event?.stockEffect) return;
    const deltas = applyEffects(state, [], { stockEffect: event.stockEffect });
    if (deltas.length === 0) return;
    entry.stockNews = deltas;
    addLog({
      day: state.currentDay,
      kind: LOG_KIND.MARKET_NEWS,
      memberIds: [],
      title: `📰 ${event.title}`,
      deltas,
    });
    applied.push({ eventId: event.id, deltas });
  });
  return applied;
}

/* ===================== 장기 투자 결과 ===================== */

// 결과일이 된 투자를 정산한다. (하루 시작 시 호출)
// 결과 효과는 이벤트와 같은 효과 시스템으로 적용한다. (team / flags / stockEffect 포함)
export function resolveInvestments(state, rng = Math.random) {
  const results = [];
  getDueInvestments(state).forEach((record) => {
    const investment = getInvestment(record.id);
    state.investments.active = state.investments.active.filter((item) => item !== record);
    if (!investment) return;

    const outcome = rng() < record.chance ? OUTCOME.SUCCESS : OUTCOME.FAIL;
    const deltas = mergeDeltas(applyEffects(state, [], investment[outcome]));
    const money = investment[outcome].money || 0;
    const result = { ...record, outcome, returnMoney: money, profit: money - record.cost, day: state.currentDay };
    state.investments.history.push(result);

    addLog({
      day: state.currentDay,
      kind: LOG_KIND.INVEST_RESULT,
      memberIds: [],
      title: `${investment.icon} ${investment.label} ${outcome === OUTCOME.SUCCESS ? '성공' : '실패'}`,
      check: { outcome, chance: Math.round(record.chance * 100) },
      deltas,
      profit: result.profit,
    });
    results.push(result);
  });
  return results;
}
