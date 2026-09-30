// save.js — localStorage 저장 / 불러오기
// 저장 데이터는 항목별로 검증해서, 잘못된 값은 새 게임의 기본값으로 대체한다.
// (저장 데이터가 깨져 있어도 게임 전체가 멈추지 않는다.)

import { MEMBERS } from './members.js';
import {
  GAME_PHASE,
  ENTRY_KIND,
  LOG_KIND,
  MAX_DAY,
  LIMITS,
  STAT_KEYS,
  createInitialState,
} from './state.js';
import { getActivityById, getEventById } from './events.js';
import { SHOP_ITEMS, getInvestment, STOCKS, STOCK_RULES } from './economy-data.js';

export const SAVE_KEY = 'stellive-manager-save';
export const SAVE_VERSION = 1;

/* ===================== 저장소 접근 (없거나 막혀 있어도 안전하게) ===================== */

function getStorage() {
  try {
    const storage = globalThis.localStorage;
    return storage && typeof storage.getItem === 'function' ? storage : null;
  } catch {
    return null;
  }
}

export function hasSave() {
  try {
    return Boolean(getStorage()?.getItem(SAVE_KEY));
  } catch {
    return false;
  }
}

export function clearSave() {
  try {
    getStorage()?.removeItem(SAVE_KEY);
  } catch {
    // 저장소를 쓸 수 없는 환경이면 무시한다.
  }
}

// 이벤트 화면 도중에 저장되면 일정표로 돌아간 상태로 저장한다. (진행 중 이벤트는 다시 열 수 있다)
export function saveGame(state) {
  const storage = getStorage();
  if (!storage || !state || state.gamePhase === GAME_PHASE.TITLE) return false;
  try {
    const snapshot = {
      ...state,
      gamePhase: state.gamePhase === GAME_PHASE.EVENT ? GAME_PHASE.DAY_BOARD : state.gamePhase,
      selectedMemberId: null,
      currentEvent: null,
      collabPartnerIds: [],
    };
    storage.setItem(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, savedAt: Date.now(), state: snapshot }));
    return true;
  } catch {
    return false;
  }
}

/* ===================== 검증 도우미 ===================== */

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function num(value, fallback, min = -Infinity, max = Infinity, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  const clamped = Math.min(Math.max(value, min), max);
  return integer ? Math.round(clamped) : clamped;
}

function boolMap(value) {
  if (!isObject(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([, flag]) => typeof flag === 'boolean'));
}

function totals(value, fallback) {
  if (!isObject(value)) return fallback;
  return {
    day: num(value.day, fallback.day, 1, MAX_DAY, true),
    money: num(value.money, fallback.money),
    fans: num(value.fans, fallback.fans, 0),
    fame: num(value.fame, fallback.fame, 0),
    stockValue: num(value.stockValue, 0, 0),
    realizedPnl: num(value.realizedPnl, 0),
  };
}

function validSchedule(saved, members) {
  if (!Array.isArray(saved) || saved.length !== members.length) return null;
  const kinds = Object.values(ENTRY_KIND);
  const entries = saved.map((entry) => {
    if (!isObject(entry)) return null;
    if (!members.some((member) => member.id === entry.memberId)) return null;
    if (!getActivityById(entry.activityId) || !kinds.includes(entry.kind)) return null;
    if (entry.eventId !== null && !getEventById(entry.eventId)) return null;
    if (entry.kind !== ENTRY_KIND.ROUTINE && !entry.eventId) return null;
    const isMember = (id) => members.some((member) => member.id === id && id !== entry.memberId);
    const partnerIds = Array.isArray(entry.collabPartnerIds) ? entry.collabPartnerIds.filter(isMember) : [];
    return {
      memberId: entry.memberId,
      activityId: entry.activityId,
      kind: entry.kind,
      eventId: entry.eventId ?? null,
      done: entry.done === true,
      // 콜라보 파트너 기록: 파트너 쪽은 주최 멤버, 주최 쪽은 파트너 목록
      ...(isMember(entry.collabHostId) ? { collabHostId: entry.collabHostId } : {}),
      ...(partnerIds.length > 0 ? { collabPartnerIds: [...new Set(partnerIds)] } : {}),
    };
  });
  const unique = new Set(entries.map((entry) => entry?.memberId));
  return entries.every(Boolean) && unique.size === members.length ? entries : null;
}

function validMarket(saved, fresh) {
  if (!isObject(saved)) return fresh;
  const market = { ...fresh, stocks: {}, holdings: {} };
  STOCKS.forEach(({ ticker }) => {
    const base = fresh.stocks[ticker];
    const quote = saved.stocks?.[ticker];
    if (!isObject(quote)) {
      market.stocks[ticker] = base;
      return;
    }
    const history = Array.isArray(quote.priceHistory)
      ? quote.priceHistory
          .filter((point) => isObject(point) && Number.isFinite(point.day) && Number.isFinite(point.price) && point.price > 0)
          .map((point) => ({ day: point.day, price: point.price }))
      : [];
    market.stocks[ticker] = {
      currentPrice: num(quote.currentPrice, base.currentPrice, STOCK_RULES.minPrice),
      previousPrice: num(quote.previousPrice, base.previousPrice, STOCK_RULES.minPrice),
      priceHistory: history.length > 0 ? history : base.priceHistory,
    };
  });
  if (isObject(saved.holdings)) {
    Object.entries(saved.holdings).forEach(([ticker, holding]) => {
      if (!market.stocks[ticker] || !isObject(holding)) return;
      const shares = num(holding.shares, 0, 0, STOCK_RULES.maxShares, true);
      const avgCost = num(holding.avgCost, 0, 0);
      if (shares > 0 && avgCost > 0) market.holdings[ticker] = { shares, avgCost };
    });
  }
  market.realizedPnl = num(saved.realizedPnl, 0);
  market.feesPaid = num(saved.feesPaid, 0, 0);
  return market;
}

function validInvestment(record, withOutcome) {
  if (!isObject(record) || !getInvestment(record.id)) return null;
  const clean = {
    id: record.id,
    startDay: num(record.startDay, 1, 1, MAX_DAY, true),
    resultDay: num(record.resultDay, MAX_DAY, 1, MAX_DAY, true),
    cost: num(record.cost, 0, 0),
    chance: num(record.chance, 0.5, 0, 1),
    source: typeof record.source === 'string' ? record.source : 'manager',
  };
  if (!withOutcome) return clean;
  if (record.outcome !== 'success' && record.outcome !== 'fail') return null;
  return {
    ...clean,
    outcome: record.outcome,
    returnMoney: num(record.returnMoney, 0),
    profit: num(record.profit, 0),
    day: num(record.day, clean.resultDay, 1, MAX_DAY, true),
  };
}

// 예전 세이브 호환: 콜라보 파트너 기록이 없거나 한쪽만 있으면 오늘의 콜라보 로그(memberIds = [주최, ...파트너])로 채운다.
function restoreCollabLinks(state) {
  const entryOf = (id) => state.schedule.find((entry) => entry.memberId === id);
  state.logs
    .filter((log) => log.day === state.currentDay && log.kind === ENTRY_KIND.COLLAB && log.memberIds.length > 1)
    .forEach((log) => {
      const [hostId, ...partnerIds] = log.memberIds;
      const host = entryOf(hostId);
      if (!host || host.kind !== ENTRY_KIND.COLLAB || !host.done) return;
      if (!host.collabPartnerIds) host.collabPartnerIds = partnerIds.filter((id) => entryOf(id));
      partnerIds.forEach((id) => {
        const partner = entryOf(id);
        if (partner && partner.done && !partner.collabHostId) {
          partner.kind = ENTRY_KIND.COLLAB;
          partner.collabHostId = hostId;
          partner.eventId = partner.eventId || host.eventId;
        }
      });
    });
}

/* ===================== 불러오기 ===================== */

// 성공하면 검증된 상태(현재 게임 상태로 설정됨)를, 저장이 없거나 읽을 수 없으면 null 을 돌려준다.
// null 이 돌아와도 게임 상태는 새 게임으로 초기화되어 있다.
export function loadGame() {
  let raw = null;
  try {
    raw = getStorage()?.getItem(SAVE_KEY) ?? null;
  } catch {
    raw = null;
  }
  const fresh = createInitialState(MEMBERS);
  if (!raw) return null;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const saved = isObject(parsed) && isObject(parsed.state) ? parsed.state : null;
  if (!saved) return null;

  try {
    return restoreInto(fresh, saved);
  } catch {
    // 예상하지 못한 형식이면 새 게임으로 되돌린다.
    return createInitialState(MEMBERS) && null;
  }
}

function restoreInto(state, saved) {
  state.currentDay = num(saved.currentDay, state.currentDay, 1, MAX_DAY, true);
  state.money = num(saved.money, state.money, LIMITS.money.min, LIMITS.money.max, true);
  state.fans = num(saved.fans, state.fans, 0, Infinity, true);
  state.fame = num(saved.fame, state.fame, 0, Infinity, true);

  if (Array.isArray(saved.members)) {
    state.members.forEach((member) => {
      const data = saved.members.find((item) => isObject(item) && item.id === member.id);
      if (!data) return;
      member.hp = num(data.hp, member.hp, LIMITS.hp.min, LIMITS.hp.max, true);
      STAT_KEYS.forEach((key) => {
        member.stats[key] = num(data.stats?.[key], member.stats[key], LIMITS.stat.min, LIMITS.stat.max, true);
      });
      member.flags = boolMap(data.flags);
      member.todayCompleted = data.todayCompleted === true;
    });
  }

  if (isObject(saved.relationships)) {
    Object.keys(state.relationships).forEach((key) => {
      state.relationships[key] = num(saved.relationships[key], state.relationships[key], 0, 100, true);
    });
  }

  const schedule = validSchedule(saved.schedule, state.members);
  state.schedule = schedule || [];
  // 일정이 깨졌으면 완료 표시도 초기화한다. (main 에서 오늘 일정을 다시 만든다)
  if (!schedule) state.members.forEach((member) => { member.todayCompleted = false; });
  else state.members.forEach((member) => {
    member.todayCompleted = schedule.find((entry) => entry.memberId === member.id).done;
  });

  const logKinds = Object.values(LOG_KIND);
  state.logs = Array.isArray(saved.logs)
    ? saved.logs
        .filter((log) => isObject(log) && Number.isFinite(log.day) && logKinds.includes(log.kind))
        .map((log) => ({
          ...log,
          memberIds: Array.isArray(log.memberIds) ? log.memberIds.filter((id) => typeof id === 'string') : [],
          deltas: Array.isArray(log.deltas) ? log.deltas.filter((delta) => isObject(delta) && Number.isFinite(delta.delta)) : [],
          title: typeof log.title === 'string' ? log.title : '',
          choiceText: typeof log.choiceText === 'string' ? log.choiceText : null,
        }))
        .slice(-3000)
    : [];

  if (schedule) restoreCollabLinks(state);

  state.flags = boolMap(saved.flags);
  state.eventHistory = isObject(saved.eventHistory)
    ? Object.fromEntries(
        Object.entries(saved.eventHistory).filter(([id, day]) => getEventById(id) && Number.isFinite(day)),
      )
    : {};

  SHOP_ITEMS.forEach((item) => {
    const level = num(saved.shop?.levels?.[item.id], 0, 0, item.maxLevel, true);
    if (level > 0) state.shop.levels[item.id] = level;
  });

  state.investments.active = Array.isArray(saved.investments?.active)
    ? saved.investments.active.map((record) => validInvestment(record, false)).filter(Boolean)
    : [];
  state.investments.history = Array.isArray(saved.investments?.history)
    ? saved.investments.history.map((record) => validInvestment(record, true)).filter(Boolean)
    : [];

  state.market = validMarket(saved.market, state.market);

  state.dayStartTotals = totals(saved.dayStartTotals, state.dayStartTotals);
  state.weekStartTotals = totals(saved.weekStartTotals, state.weekStartTotals);

  const phases = Object.values(GAME_PHASE);
  const phase = phases.includes(saved.gamePhase) ? saved.gamePhase : GAME_PHASE.DAY_BOARD;
  state.gamePhase = phase === GAME_PHASE.TITLE || phase === GAME_PHASE.EVENT ? GAME_PHASE.DAY_BOARD : phase;
  // 일정이 없는데 하루 결과 화면이면 일정표로 되돌린다.
  if (!schedule && state.gamePhase === GAME_PHASE.DAY_RESULT) state.gamePhase = GAME_PHASE.DAY_BOARD;

  return state;
}
