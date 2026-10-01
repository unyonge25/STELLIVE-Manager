// state.js — 전역 상수 정의 + 게임 상태의 유일한 저장소
// 이 파일은 DOM을 전혀 알지 못한다.

import { getInitialRelationship } from './members.js';
import { STOCKS, getShopTotal } from './economy-data.js';

/* ===================== 상수 ===================== */

// 화면 상태 (gamePhase 값은 이 8개만 사용한다)
// SHOP / INVEST / MARKET 은 일정표에서 여는 매니저 메뉴다.
export const GAME_PHASE = {
  TITLE: 'title',
  DAY_BOARD: 'dayBoard',
  EVENT: 'event',
  DAY_RESULT: 'dayResult',
  GAME_END: 'gameEnd',
  SHOP: 'shop',
  INVEST: 'invest',
  MARKET: 'market',
};

// 매니저 메뉴 화면 (일정표에서 오갈 수 있는 화면)
export const MANAGER_PHASES = [GAME_PHASE.DAY_BOARD, GAME_PHASE.SHOP, GAME_PHASE.INVEST, GAME_PHASE.MARKET];

// 멤버 스탯 키 (hp는 멤버의 최상위 필드)
export const STAT_KEYS = ['Bs', 'Ga', 'Vc'];

// 표시 메타: 아이콘 / 라벨의 단일 출처
export const VALUE_META = {
  money: { icon: '💰', label: '돈', currency: true },
  fans: { icon: '👥', label: '팬' },
  fame: { icon: '🌟', label: '명성' },
  hp: { icon: '❤️', label: 'HP' },
  Bs: { icon: '📺', label: 'Bs', full: '방송' },
  Ga: { icon: '🎮', label: 'Ga', full: '게임' },
  Vc: { icon: '🎤', label: 'Vc', full: '노래' },
  relationship: { icon: '🤝', label: '관계' },
};

// 값 범위 (clamp 에 사용)
export const LIMITS = {
  money: { min: -Infinity, max: Infinity },
  fans: { min: 0, max: Infinity },
  fame: { min: 0, max: Infinity },
  hp: { min: 0, max: 100 },
  stat: { min: 0, max: 100 },
  relationship: { min: 0, max: 100 },
};

// 초기값
export const INITIAL_DAY = 1;
export const INITIAL_MONEY = 1000000;
export const INITIAL_FANS = 1200;
export const INITIAL_FAME = 5;

// 날짜 구조
export const MAX_DAY = 28;
export const WEEK_LENGTH = 7;

// HP 규칙 (임시 수치)
//  - dailyRecovery: 하루가 끝날 때 회복량 (밤샘 플래그가 있으면 절반)
//  - tired / exhausted: 이 값 이하이면 피곤 / 탈진 상태
export const HP_RULES = { dailyRecovery: 5, tired: 59, exhausted: 29 };

// 하루 일정 한 칸의 종류
//  - routine: 자동 진행되는 일반 일정
//  - important: 플레이어가 선택지를 고르는 중요 이벤트
//  - collab: 플레이어가 파트너를 골라 진행하는 콜라보 이벤트
export const ENTRY_KIND = {
  ROUTINE: 'routine',
  IMPORTANT: 'important',
  COLLAB: 'collab',
};

// 로그 종류: 일정 로그(ENTRY_KIND 값) + 매니저 활동 로그
export const LOG_KIND = {
  ...ENTRY_KIND,
  SHOP: 'shop',
  INVEST_START: 'investStart',
  INVEST_RESULT: 'investResult',
  TRADE: 'trade',
  MARKET_NEWS: 'marketNews',
};

/* ===================== 상태 ===================== */

// state 는 모듈 스코프에 하나만 존재한다.
let state = null;

function snapshotTotals() {
  return {
    day: state.currentDay,
    money: state.money,
    fans: state.fans,
    fame: state.fame,
    stockValue: getStockValue(),
    realizedPnl: state.market.realizedPnl,
  };
}

function createMarket() {
  const stocks = {};
  STOCKS.forEach((stock) => {
    stocks[stock.ticker] = {
      currentPrice: stock.basePrice,
      previousPrice: stock.basePrice,
      priceHistory: [{ day: INITIAL_DAY, price: stock.basePrice }],
    };
  });
  // holdings: { [ticker]: { shares, avgCost } }
  return { stocks, holdings: {}, realizedPnl: 0, feesPaid: 0 };
}

function createRelationships(members) {
  const relationships = {};
  members.forEach((memberA, indexA) => {
    members.slice(indexA + 1).forEach((memberB) => {
      relationships[pairKey(memberA.id, memberB.id)] = getInitialRelationship(memberA, memberB);
    });
  });
  return relationships;
}

export function createInitialState(members) {
  state = {
    currentDay: INITIAL_DAY,
    money: INITIAL_MONEY,
    fans: INITIAL_FANS,
    fame: INITIAL_FAME,
    // 원본 MEMBERS 데이터를 오염시키지 않도록 복사본을 만든다.
    members: members.map((member) => ({
      ...member,
      stats: { ...member.stats },
      traits: [...(member.traits || [])],
      flags: {},
      todayCompleted: false,
    })),
    relationships: createRelationships(members),
    // 오늘의 일정: 멤버마다 한 칸 ({ memberId, activityId, kind, eventId, done, collabHostId })
    schedule: [],
    selectedMemberId: null,
    currentEvent: null,
    // 콜라보 이벤트에서 플레이어가 고른 파트너
    collabPartnerIds: [],
    logs: [],
    flags: {},
    // 이벤트별 마지막 발생일 (cooldown 조건에 사용)
    eventHistory: {},
    // 진행 중인 스토리(멀티스텝) 이벤트 (story.js). 없으면 null
    storyRun: null,
    // 끝난 스토리 이벤트의 결말 { [eventId]: 'success' | 'partial' | 'fail' | 'neutral' } — 후속 이벤트 조건(storyResult)
    storyResults: {},
    // 최근 스토리 이벤트 [{ id, day }] — 비슷한 구조의 스토리가 연달아 나오지 않게 한다
    storyRecent: [],
    // 상점 업그레이드 레벨 { [itemId]: level }
    shop: { levels: {} },
    // 장기 투자: active = 진행 중, history = 결과가 나온 투자
    investments: { active: [], history: [] },
    // 가상 주식시장
    market: createMarket(),
    // 하루 / 주간 변화량 계산용 기준값
    dayStartTotals: null,
    weekStartTotals: null,
    gamePhase: GAME_PHASE.TITLE,
  };
  state.dayStartTotals = snapshotTotals();
  state.weekStartTotals = snapshotTotals();
  return state;
}

export function getState() {
  return state;
}

// 저장 데이터를 불러올 때만 사용한다. (검증은 save.js 가 끝낸 뒤 호출)
export function replaceState(nextState) {
  state = nextState;
  return state;
}

/* ---------- 주식 평가 ---------- */

export function getStockValue(target = state) {
  const { stocks, holdings } = target.market;
  return Object.entries(holdings).reduce(
    (sum, [ticker, holding]) => sum + holding.shares * (stocks[ticker]?.currentPrice || 0),
    0,
  );
}

export function getUnrealizedPnl(target = state) {
  const { stocks, holdings } = target.market;
  return Object.entries(holdings).reduce(
    (sum, [ticker, holding]) =>
      sum + holding.shares * ((stocks[ticker]?.currentPrice || 0) - holding.avgCost),
    0,
  );
}

// 순자산 = 현금 + 주식 평가액
export function getNetWorth(target = state) {
  return target.money + getStockValue(target);
}

export function setGamePhase(phase) {
  state.gamePhase = phase;
}

export function setSelectedMember(memberId) {
  state.selectedMemberId = memberId;
}

export function setCurrentEvent(event) {
  state.currentEvent = event;
}

export function addLog(entry) {
  state.logs.push(entry);
}

export function getMember(memberId) {
  return state.members.find((member) => member.id === memberId) || null;
}

export function getSelectedMember() {
  return getMember(state.selectedMemberId);
}

/* ---------- 일정 ---------- */

export function setSchedule(schedule) {
  state.schedule = schedule;
}

export function getScheduleEntry(memberId) {
  return state.schedule.find((entry) => entry.memberId === memberId) || null;
}

export function markMemberCompleted(memberId, patch = {}) {
  const member = getMember(memberId);
  if (member) member.todayCompleted = true;

  const entry = getScheduleEntry(memberId);
  if (entry) Object.assign(entry, patch, { done: true });
}

// 플레이어가 처리해야 하는 일정(중요 / 콜라보)이 남아 있는지
export function getPendingDecisions() {
  return state.schedule.filter((entry) => !entry.done && entry.kind !== ENTRY_KIND.ROUTINE);
}

// 모든 멤버가 오늘 일정을 끝내야 하루가 종료된다.
export function isDayComplete() {
  return state.members.every((member) => member.todayCompleted);
}

export function getCompletedCount() {
  return state.members.filter((member) => member.todayCompleted).length;
}

/* ---------- 콜라보 파트너 ---------- */

export function setCollabPartners(memberIds) {
  state.collabPartnerIds = memberIds;
}

// 콜라보 파트너가 될 수 있는 멤버: 주인공이 아니고, 아직 끝나지 않은 일반 일정인 멤버
export function isSelectablePartner(memberId) {
  if (memberId === state.selectedMemberId) return false;
  const entry = getScheduleEntry(memberId);
  return Boolean(entry) && !entry.done && entry.kind === ENTRY_KIND.ROUTINE;
}

/* ---------- 관계도 ---------- */

export function pairKey(idA, idB) {
  return [idA, idB].sort().join('|');
}

export function getRelationship(idA, idB) {
  return state.relationships[pairKey(idA, idB)] ?? 0;
}

export function setRelationship(idA, idB, value) {
  state.relationships[pairKey(idA, idB)] = value;
}

/* ---------- 이벤트 기록 ---------- */

export function recordEventHistory(eventId) {
  state.eventHistory[eventId] = state.currentDay;
}

/* ---------- 로그 ---------- */

export function getTodayLogs() {
  return state.logs.filter((log) => log.day === state.currentDay);
}

export function getLastLog() {
  return state.logs.length > 0 ? state.logs[state.logs.length - 1] : null;
}

// fromDay ~ 오늘까지의 로그 (주간 결과에 사용)
export function getLogsSince(fromDay) {
  return state.logs.filter((log) => log.day >= fromDay && log.day <= state.currentDay);
}

/* ---------- 날짜 ---------- */

export function getWeekNumber(day = state.currentDay) {
  return Math.ceil(day / WEEK_LENGTH);
}

export function isWeekEnd(day = state.currentDay) {
  return day % WEEK_LENGTH === 0;
}

export function isLastDay() {
  return state.currentDay >= MAX_DAY;
}

export function getDayDelta() {
  return diffTotals(state.dayStartTotals);
}

export function getWeekDelta() {
  return diffTotals(state.weekStartTotals);
}

function diffTotals(base) {
  return {
    money: state.money - base.money,
    fans: state.fans - base.fans,
    fame: state.fame - base.fame,
    stockValue: getStockValue() - (base.stockValue || 0),
    realizedPnl: state.market.realizedPnl - (base.realizedPnl || 0),
    netWorth: getNetWorth() - (base.money + (base.stockValue || 0)),
  };
}

export function getWeekStartDay() {
  return state.weekStartTotals?.day || 1;
}

// 새 하루를 준비한다. (일정 자체는 events.js 의 planDay 가 만든다)
export function beginDay() {
  state.dayStartTotals = snapshotTotals();
  // 주의 첫날이면 주간 기준값도 갱신한다.
  if ((state.currentDay - 1) % WEEK_LENGTH === 0) {
    state.weekStartTotals = snapshotTotals();
  }
}

export function endDay() {
  // 하루 회복: 밤을 샌 멤버는 절반만 회복하고, 밤샘 플래그를 해제한다.
  // 상점(트레이닝) 레벨만큼 회복량이 늘어난다.
  const baseRecovery = HP_RULES.dailyRecovery + getShopTotal(state.shop.levels, 'hpRecovery');
  state.members.forEach((member) => {
    const recovery = member.flags.stayedUpLate ? Math.floor(baseRecovery / 2) : baseRecovery;
    member.hp = Math.min(member.hp + recovery, LIMITS.hp.max);
    member.flags.stayedUpLate = false;
    member.todayCompleted = false;
  });

  state.currentDay += 1;
  state.schedule = [];
  state.selectedMemberId = null;
  state.currentEvent = null;
  state.collabPartnerIds = [];
  state.storyRun = null;
}
