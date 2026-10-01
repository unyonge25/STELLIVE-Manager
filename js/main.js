// main.js — 게임 시작, 각 모듈 연결, 초기화
//
// 하루 흐름:
//   하루 시작(장 개장 → 결과일이 된 장기 투자 정산 → planDay: 11명 일정 배정 + 중요/콜라보 승격
//            → 오늘 이벤트의 시장 소식을 주가에 반영)
//   → 일정표에서 중요 이벤트 / 콜라보를 하나씩 처리 (매니저 메뉴: 상점 / 투자 / 주식은 언제든)
//   → '하루 마무리'로 남은 일반 일정 자동 진행 → 장 마감(주가 갱신)
//   → 하루 결과 → 다음 날 (MAX_DAY 이후 최종 결과)
// 상태가 바뀔 때마다 자동 저장한다.

import { MEMBERS } from './members.js';
import {
  GAME_PHASE,
  MANAGER_PHASES,
  ENTRY_KIND,
  createInitialState,
  getState,
  setGamePhase,
  setSelectedMember,
  setCurrentEvent,
  setCollabPartners,
  setSchedule,
  getMember,
  getScheduleEntry,
  getPendingDecisions,
  getTodayLogs,
  isSelectablePartner,
  beginDay,
  endDay,
  isLastDay,
} from './state.js';
import { getEventById, getAvailableChoices, planDay, isStoryEvent } from './events.js';
import { startStory, advanceStory, clearStory, canLeaveStory, getStoryRun } from './story.js';
import { resolveChoice, resolveRoutines, resolveInvestments, applyScheduledStockEffects } from './actions.js';
import { buyShopItem, startInvestment, buyStock, sellStock, openMarket, closeMarket } from './economy.js';
import { saveGame, loadGame, hasSave, clearSave } from './save.js';
import { render } from './ui.js';

createInitialState(MEMBERS);

// 매니저 메뉴에서 마지막으로 한 일의 결과 메시지 (화면 상단 알림용, 저장하지 않음)
let notice = null;

function startDay() {
  const state = getState();
  beginDay();
  openMarket(state);
  resolveInvestments(state);
  setSchedule(planDay(state));
  // 오늘 이벤트에 걸린 시장 소식은 장 시작과 함께 주가에 반영된다.
  applyScheduledStockEffects(state);
  setGamePhase(GAME_PHASE.DAY_BOARD);
}

function closeEvent() {
  clearStory(getState());
  setCurrentEvent(null);
  setSelectedMember(null);
  setCollabPartners([]);
  setGamePhase(GAME_PHASE.DAY_BOARD);
}

function isManagerPhase() {
  return MANAGER_PHASES.includes(getState().gamePhase);
}

const FAIL_MESSAGE = {
  money: '돈이 부족하다.',
  maxLevel: '이미 최대 레벨이다.',
  active: '이미 진행 중인 투자다.',
  maxActive: '동시에 진행할 수 있는 투자 수를 넘었다.',
  tooLate: '마지막 날 전에 결과가 나오지 않는다.',
  quantity: '수량을 확인하자.',
  shares: '보유 수량이 부족하다.',
  maxShares: '한 종목 보유 한도를 넘는다.',
  unknown: '처리할 수 없는 요청이다.',
};

function setNotice(result, successText) {
  notice = result.ok ? { type: 'ok', text: successText } : { type: 'fail', text: FAIL_MESSAGE[result.reason] || '실패했다.' };
}

const handlers = {
  onStart() {
    clearSave();
    createInitialState(MEMBERS);
    startDay();
    refresh();
  },

  onContinue() {
    const loaded = loadGame();
    if (!loaded) {
      // 저장 데이터를 읽을 수 없으면 새 게임으로 시작한다.
      clearSave();
      startDay();
    } else if (loaded.gamePhase !== GAME_PHASE.GAME_END && loaded.schedule.length === 0) {
      // 일정이 손상된 저장이면 오늘 일정만 다시 만든다.
      setSchedule(planDay(loaded));
      setGamePhase(GAME_PHASE.DAY_BOARD);
    }
    refresh();
  },

  // 매니저 메뉴 이동: 일정표 / 상점 / 투자 / 주식
  onNav(target) {
    if (!isManagerPhase() || !MANAGER_PHASES.includes(target)) return;
    notice = null;
    setGamePhase(target);
    refresh();
  },

  // 중요 이벤트 / 콜라보 일정만 열 수 있다.
  onOpenEvent(memberId) {
    const member = getMember(memberId);
    const entry = getScheduleEntry(memberId);
    if (!member || !entry || entry.done || entry.kind === ENTRY_KIND.ROUTINE) return;

    const event = getEventById(entry.eventId);
    setSelectedMember(memberId);
    setCurrentEvent(event);
    setCollabPartners([]);
    // 스토리 이벤트: 진행 상태를 만든다. (첫 행동 전까지는 아무 효과도 없다)
    if (isStoryEvent(event)) startStory(getState(), event, memberId);
    setGamePhase(GAME_PHASE.EVENT);
    refresh();
  },

  // 스토리 이벤트 진행: { type: 'continue' } | { type: 'choose', index } | { type: 'roll' }
  onStory(action) {
    if (getState().gamePhase !== GAME_PHASE.EVENT || !getStoryRun()) return;
    if (!advanceStory(getState(), action)) return;
    refresh();
  },

  // 스토리 결말을 보고 일정표로 돌아간다.
  onStoryClose() {
    if (!getStoryRun()?.finished) return;
    closeEvent();
    refresh();
  },

  onTogglePartner(memberId) {
    const state = getState();
    const event = state.currentEvent;
    if (!event?.collab || !isSelectablePartner(memberId)) return;
    // 스토리가 시작된 뒤에는 파트너를 바꿀 수 없다.
    if (getStoryRun()?.committed) return;

    const selected = state.collabPartnerIds;
    if (selected.includes(memberId)) {
      setCollabPartners(selected.filter((id) => id !== memberId));
    } else if (selected.length + 1 < event.collab.max) {
      setCollabPartners([...selected, memberId]);
    }
    refresh();
  },

  onChoose(choiceIndex) {
    const state = getState();
    const currentEvent = state.currentEvent;
    if (!currentEvent) return;

    // 오늘 일정에 맞아 화면에 보이는 선택지만 고를 수 있다.
    const available = getAvailableChoices(currentEvent, state, state.selectedMemberId);
    const choice = available.find((item) => item.index === choiceIndex)?.choice;
    if (!choice) return;

    const log = resolveChoice(getState(), choice);
    if (!log) return;

    closeEvent();
    refresh();
  },

  onBack() {
    // 스토리를 이미 진행했다면 결말까지 가야 한다. (효과가 적용된 뒤 빠져나가 다시 여는 것을 막는다)
    if (!canLeaveStory()) return;
    closeEvent();
    refresh();
  },

  onBuyShop(itemId) {
    if (!isManagerPhase()) return;
    const result = buyShopItem(getState(), itemId);
    setNotice(result, `구매 완료 (Lv.${result.level})`);
    refresh();
  },

  onStartInvestment(investmentId) {
    if (!isManagerPhase()) return;
    const result = startInvestment(getState(), investmentId);
    setNotice(result, result.ok ? `투자 시작 — Day ${result.record.resultDay}에 결과가 나온다.` : '');
    refresh();
  },

  onTrade(side, ticker, quantity) {
    if (!isManagerPhase()) return;
    const state = getState();
    const result = side === 'buy' ? buyStock(state, ticker, quantity) : sellStock(state, ticker, quantity);
    setNotice(result, result.ok ? `${ticker} ${result.qty}주 ${side === 'buy' ? '매수' : '매도'} 완료` : '');
    refresh();
  },

  // 중요 이벤트를 모두 처리해야 하루를 마무리할 수 있다.
  onFinishDay() {
    if (!isManagerPhase() || getPendingDecisions().length > 0) return;
    const state = getState();
    resolveRoutines(state);
    closeMarket(state, getTodayLogs());
    notice = null;
    setGamePhase(GAME_PHASE.DAY_RESULT);
    refresh();
  },

  onNextDay() {
    if (getState().gamePhase !== GAME_PHASE.DAY_RESULT) return;
    if (isLastDay()) {
      setGamePhase(GAME_PHASE.GAME_END);
      refresh();
      return;
    }
    endDay();
    startDay();
    refresh();
  },

  onRestart() {
    clearSave();
    createInitialState(MEMBERS);
    refresh();
  },
};

function refresh() {
  const state = getState();
  saveGame(state);
  render(state, handlers, { notice, hasSave: hasSave() });
}

refresh();
