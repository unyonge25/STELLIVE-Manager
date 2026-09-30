// ui.js — 화면 렌더링 전용. state 를 직접 수정하지 않는다.

import { TRAITS, MEMBERS } from './members.js';
import {
  GAME_PHASE,
  MANAGER_PHASES,
  VALUE_META,
  STAT_KEYS,
  ENTRY_KIND,
  LOG_KIND,
  MAX_DAY,
  getMember,
  getScheduleEntry,
  getCompletedCount,
  getPendingDecisions,
  getTodayLogs,
  getLogsSince,
  getRelationship,
  getWeekNumber,
  getWeekStartDay,
  isWeekEnd,
  isLastDay,
  isSelectablePartner,
  getDayDelta,
  getWeekDelta,
  getStockValue,
  getNetWorth,
} from './state.js';
import { getActivityById, getAvailableChoices } from './events.js';
import {
  OUTCOME,
  getHpState,
  getSuccessChance,
  getEventParticipants,
  getEventTimeSlot,
  canChoose,
} from './actions.js';
import {
  SHOP_ITEMS,
  INVESTMENTS,
  INVESTMENT_RULES,
  STOCK_RULES,
  getInvestment,
  getShopTotal,
} from './economy-data.js';
import {
  getShopOffer,
  getInvestmentChance,
  getInvestmentBlocker,
  getPortfolio,
  getMaxBuyable,
} from './economy.js';
import { evaluateEnding } from './ending.js';

let boundHandlers = null;
let delegationBound = false;
let currentState = null;

/* ===================== 아이콘 / 멤버 컬러 ===================== */

// 24×24 선 아이콘. UI 크롬에는 이모지 대신 이것만 쓴다.
const ICON_PATHS = {
  money: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
  fans: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14c2.8.3 5 2.8 5 6"/>',
  fame: '<path d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z"/>',
  hp: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20z"/>',
  Bs: '<rect x="3" y="4.5" width="18" height="12.5" rx="1.5"/><path d="M8 21h8M12 17v4"/>',
  Ga: '<path d="M7 7.5h10a5 5 0 0 1 5 5v1.8a2.9 2.9 0 0 1-5.2 1.8L15.2 14H8.8l-1.6 2.1A2.9 2.9 0 0 1 2 14.3v-1.8a5 5 0 0 1 5-5z"/><path d="M7.5 10v3.5M5.8 11.8h3.4"/>',
  Vc: '<rect x="9" y="2.5" width="6" height="11.5" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5"/>',
  relationship: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  stock: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  stockDown: '<path d="M3 7l6 6 4-4 8 8"/><path d="M15 17h6v-6"/>',
  bank: '<path d="M3 9.5L12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/>',
  shop: '<path d="M5 8h14l-1.2 12.5H6.2z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
  invest: '<path d="M21 12.5A9 9 0 1 1 11.5 3v9.5z"/><path d="M15 3.3A9 9 0 0 1 20.7 9H15z"/>',
  schedule: '<rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  alert: '<path d="M12 3.5l9.5 17h-19z"/><path d="M12 10v4.5M12 17.5v.5"/>',
  day: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  evening: '<path d="M3 17h18M6 21h12"/><path d="M7 17a5 5 0 0 1 10 0"/><path d="M12 4v4M4.9 8.9l2 2M19.1 8.9l-2 2"/>',
  lateNight: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  news: '<rect x="3" y="4" width="15" height="16" rx="1.5"/><path d="M18 8h3v10a2 2 0 0 1-2 2M7 8h7M7 12h7M7 16h4"/>',
  check: '<path d="M4.5 12.5l5 5 10-11"/>',
};

function icon(name, extraClass = '') {
  const paths = ICON_PATHS[name];
  if (!paths) return '';
  return `<svg class="ic${extraClass ? ` ${extraClass}` : ''}" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
}

// 화면 표시용 멤버 테마 (게임 로직과 무관)
// hi → lo: stellive.me 탤런트 카드 하단 그라데이션의 위 / 아래 색. roman: 카드에 적힌 영문 표기.
const MEMBER_THEME = {
  yuni: { hi: '#aa93e9', lo: '#5d51bb', roman: 'AYATSUNO YUNI' },
  huya: { hi: '#5a3d59', lo: '#141028', roman: 'SAKIHANE HUYA' },
  hina: { hi: '#d3ae8c', lo: '#ae8961', roman: 'SHIRAYUKI HINA' },
  mashiro: { hi: '#3c2122', lo: '#130d0d', roman: 'NENEKO MASHIRO' },
  lize: { hi: '#5c2c23', lo: '#1c0505', roman: 'AKANE LIZE' },
  tabi: { hi: '#67cdf4', lo: '#089cdf', roman: 'ARAHASHI TABI' },
  shibuki: { hi: '#b49cdb', lo: '#7a5baf', roman: 'TENKO SHIBUKI' },
  rin: { hi: '#283262', lo: '#020e36', roman: 'AOKUMO RIN' },
  nana: { hi: '#d97f92', lo: '#b23e56', roman: 'HANAKO NANA' },
  riko: { hi: '#a4dec5', lo: '#37b093', roman: 'YUZUHA RIKO' },
  kanna: { hi: '#3b3367', lo: '#141129', roman: 'AIRI KANNA' },
};
const FALLBACK_THEME = { hi: '#949fe6', lo: '#616cb3', roman: '' };

function memberTheme(memberId) {
  return MEMBER_THEME[memberId] || FALLBACK_THEME;
}

// 요소에 멤버 컬러 변수(--mc-hi / --mc-lo)를 넘긴다.
function memberStyle(memberId) {
  const theme = memberTheme(memberId);
  return `--mc-hi:${theme.hi};--mc-lo:${theme.lo}`;
}

function avatar(memberId, size = '') {
  return `<span class="avatar${size ? ` avatar--${size}` : ''}" style="${memberStyle(memberId)}" aria-hidden="true">${shortName(memberId).slice(0, 2)}</span>`;
}

// 스텔라이브 사이트의 궤도 별 장식 (네 갈래 별 + 궤도 링)
function sparkle(extraClass = '') {
  return `<svg class="sparkle${extraClass ? ` ${extraClass}` : ''}" viewBox="0 0 64 40" aria-hidden="true">
    <ellipse cx="32" cy="22" rx="27" ry="7" transform="rotate(-16 32 22)" fill="none" stroke="currentColor" stroke-width="1.3" opacity=".7"/>
    <path d="M32 2c1.4 9.6 5.4 13.6 15 15-9.6 1.4-13.6 5.4-15 15-1.4-9.6-5.4-13.6-15-15 9.6-1.4 13.6-5.4 15-15z" fill="currentColor"/>
    <circle cx="55" cy="14.5" r="2" fill="currentColor"/>
  </svg>`;
}

// 공식 사이트식 섹션 제목: 궤도 별 + 그라데이션 영문 + 한글 부제
function heading(en, ko, sub = '') {
  return `
    <header class="heading">
      ${sparkle()}
      <p class="heading__en" aria-hidden="true">${en}</p>
      <h2 class="screen__title">${ko}</h2>
      ${sub ? `<p class="screen__sub">${sub}</p>` : ''}
    </header>`;
}

// 공식 사이트의 "more" 버튼처럼 테두리를 따라 별빛 점이 도는 알약 버튼
function pillButton(label, attrs, modifier = '') {
  return `
    <button class="pill${modifier ? ` ${modifier}` : ''}" ${attrs}>
      <span class="pill__label">${label}</span>
      <span class="pill__orbit" aria-hidden="true"></span>
    </button>`;
}

const TIME_SLOT_LABEL = { day: '낮', evening: '저녁', lateNight: '심야' };
const OUTCOME_LABEL = {
  [OUTCOME.GREAT]: '대성공',
  [OUTCOME.SUCCESS]: '성공',
  [OUTCOME.FAIL]: '실패',
};

// options: { notice: { type, text } | null, hasSave: boolean }
export function render(state, handlers, options = {}) {
  boundHandlers = handlers;
  currentState = state;
  bindDelegation();
  renderSummary(state);

  const app = document.getElementById('app');
  switch (state.gamePhase) {
    case GAME_PHASE.TITLE:
      app.innerHTML = viewTitle(options.hasSave);
      break;
    case GAME_PHASE.DAY_BOARD:
      app.innerHTML = viewManager(state, viewDayBoard(state), options.notice);
      break;
    case GAME_PHASE.SHOP:
      app.innerHTML = viewManager(state, viewShop(state), options.notice);
      break;
    case GAME_PHASE.INVEST:
      app.innerHTML = viewManager(state, viewInvest(state), options.notice);
      break;
    case GAME_PHASE.MARKET:
      app.innerHTML = viewManager(state, viewMarket(state), options.notice);
      break;
    case GAME_PHASE.EVENT:
      app.innerHTML = viewEvent(state);
      break;
    case GAME_PHASE.DAY_RESULT:
      app.innerHTML = viewDayResult(state);
      break;
    case GAME_PHASE.GAME_END:
      app.innerHTML = viewGameEnd(state);
      break;
    default:
      app.innerHTML = '';
  }
}

// 이벤트 위임은 최초 1회만 등록한다.
function bindDelegation() {
  if (delegationBound) return;

  document.getElementById('app').addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled || !boundHandlers) return;

    switch (button.dataset.action) {
      case 'start':
        boundHandlers.onStart();
        break;
      case 'openEvent':
        boundHandlers.onOpenEvent(button.dataset.memberId);
        break;
      case 'togglePartner':
        boundHandlers.onTogglePartner(button.dataset.memberId);
        break;
      case 'choose':
        boundHandlers.onChoose(Number(button.dataset.choiceIndex));
        break;
      case 'back':
        boundHandlers.onBack();
        break;
      case 'finishDay':
        boundHandlers.onFinishDay();
        break;
      case 'nextDay':
        boundHandlers.onNextDay();
        break;
      case 'restart':
        boundHandlers.onRestart();
        break;
      case 'continue':
        boundHandlers.onContinue();
        break;
      case 'nav':
        boundHandlers.onNav(button.dataset.target);
        break;
      case 'buyShop':
        boundHandlers.onBuyShop(button.dataset.itemId);
        break;
      case 'startInvest':
        boundHandlers.onStartInvestment(button.dataset.investmentId);
        break;
      case 'trade': {
        const { side, ticker } = button.dataset;
        const quantity =
          button.dataset.qty === 'max'
            ? getMaxBuyable(currentState, ticker)
            : button.dataset.qty === 'all'
              ? currentState.market.holdings[ticker]?.shares || 0
              : Number(document.getElementById(`qty-${ticker}`)?.value || 1);
        boundHandlers.onTrade(side, ticker, quantity);
        break;
      }
      default:
        break;
    }
  });

  delegationBound = true;
}

/* ===================== 표시 포맷 ===================== */

// 성을 뺀 짧은 이름: "아야츠노 유니" → "유니"
function shortName(memberId) {
  const member = getMember(memberId);
  return member ? member.name.split(' ').pop() : memberId;
}

// {member} → 주인공 이름, {partners} → 파트너 이름
function fillText(text, memberIds) {
  const [hostId, ...partnerIds] = memberIds;
  const host = getMember(hostId);
  return text
    .replaceAll('{member}', host ? host.name : '')
    .replaceAll('{partners}', partnerIds.map(shortName).join('·'));
}

// 스탯은 짧은 라벨(방송/게임/노래)로, 나머지는 기본 라벨로 보여준다.
function valueLabel(key) {
  const meta = VALUE_META[key];
  return meta?.full || meta?.label || key;
}

// 현재 수치 표시: [아이콘] 돈 1,000,000
export function formatValue(key, value) {
  const meta = VALUE_META[key];
  if (!meta) return '';
  const text = meta.currency ? value.toLocaleString('ko-KR') : String(value);
  return `${icon(key)}<span class="val__label">${meta.label}</span> <b class="val__num">${text}</b>`;
}

// 변화량 표시: [아이콘] 돈 +100 / 유니 HP -5 / 유니·후야 관계 +4
//              TUNE +8% / 전원 HP +10 / 음악 제작 투자 시작 (Day 12 결과)
export function formatDeltaValue({ key, delta, owners, team, ticker, investmentId }) {
  if (key === 'stock') {
    return `${icon(delta > 0 ? 'stock' : 'stockDown')}${ticker} ${delta > 0 ? '+' : ''}${delta}%`;
  }
  if (key === 'investment') {
    return `${icon('invest')}${getInvestment(investmentId)?.label || investmentId} 시작 (Day ${delta} 결과)`;
  }
  const meta = VALUE_META[key];
  if (!meta) return '';
  const sign = delta > 0 ? '+' : '-';
  const amount = Math.abs(delta);
  const text = meta.currency ? amount.toLocaleString('ko-KR') : String(amount);
  const who = team ? '전원 ' : owners ? `${owners.map(shortName).join('·')} ` : '';
  return `${icon(key)}${who}${valueLabel(key)} ${sign}${text}`;
}

function won(value) {
  return `${Math.round(value).toLocaleString('ko-KR')}원`;
}

function signedWon(value) {
  const rounded = Math.round(value);
  return `${rounded > 0 ? '+' : rounded < 0 ? '-' : ''}${Math.abs(rounded).toLocaleString('ko-KR')}원`;
}

function percent(ratio, digits = 1) {
  const value = (ratio * 100).toFixed(digits);
  return `${ratio > 0 ? '+' : ''}${value}%`;
}

function signClass(value) {
  if (value > 0) return 'num--plus';
  if (value < 0) return 'num--minus';
  return '';
}

function renderDeltas(deltas) {
  if (!deltas || deltas.length === 0) {
    return '<span class="delta delta--none">변화 없음</span>';
  }
  return deltas
    .map((delta) => {
      const modifier = delta.delta > 0 ? 'delta--plus' : 'delta--minus';
      return `<span class="delta ${modifier}">${formatDeltaValue(delta)}</span>`;
    })
    .join('');
}

function renderTotalsDelta(totals) {
  const deltas = ['money', 'fans', 'fame'].map((key) => ({ key, delta: totals[key] }));
  const chips = renderDeltas(deltas.filter((delta) => delta.delta !== 0));
  // 주식을 한 번이라도 거래했다면 순자산 변화도 함께 보여준다.
  const netWorth = Number.isFinite(totals.netWorth) && totals.netWorth !== totals.money
    ? `<span class="delta ${totals.netWorth >= 0 ? 'delta--plus' : 'delta--minus'}">${icon('bank')}순자산 ${signedWon(totals.netWorth)}</span>`
    : '';
  return chips + netWorth;
}

function renderOutcome(check) {
  if (!check) return '';
  return `<span class="outcome outcome--${check.outcome}">${OUTCOME_LABEL[check.outcome]}</span>`;
}

function renderTraits(member, highlight = []) {
  return member.traits
    .map((trait) => {
      const on = highlight.includes(trait) ? ' tag--on' : '';
      return `<span class="tag${on}">${TRAITS[trait]?.label || trait}</span>`;
    })
    .join('');
}

// HP 게이지: 라벨 + 막대 + 수치
function renderHp(member) {
  const width = Math.max(0, Math.min(100, member.hp));
  return `
    <span class="hp hp--${getHpState(member)}" title="HP ${member.hp}">
      <span class="hp__label">HP</span>
      <span class="hp__bar"><span class="hp__fill" style="width:${width}%"></span></span>
      <b class="hp__num">${member.hp}</b>
    </span>`;
}

function renderStats(member) {
  const cells = STAT_KEYS.map((key) => {
    const meta = VALUE_META[key];
    return `<span class="st st--${key}" title="${meta.full}"><span class="st__label">${meta.full}</span><b class="st__num">${member.stats[key]}</b></span>`;
  }).join('');
  return `<span class="sts">${cells}</span>`;
}

/* ===================== 요약 바 ===================== */

function renderSummary(state) {
  const summary = document.getElementById('summary');

  if (state.gamePhase === GAME_PHASE.TITLE) {
    summary.hidden = true;
    summary.innerHTML = '';
    return;
  }

  const stockValue = getStockValue();
  const progress = Math.round((state.currentDay / MAX_DAY) * 100);

  summary.hidden = false;
  summary.innerHTML = `
    <div class="hud__inner">
      <div class="brand" aria-hidden="true">${sparkle('brand__mark')}<span class="brand__name">STELLIVE<small>MANAGER</small></span></div>
      <div class="cal">
        <span class="sr-only">Day ${state.currentDay} / ${MAX_DAY}</span>
        <div class="cal__day" aria-hidden="true">
          <span class="cal__label">DAY</span>
          <span class="cal__num">${String(state.currentDay).padStart(2, '0')}</span>
          <span class="cal__max">/ ${MAX_DAY}</span>
        </div>
        <div class="cal__side" aria-hidden="true">
          <span class="cal__week">WEEK ${getWeekNumber()}</span>
          <span class="cal__track"><span class="cal__fill" style="width:${progress}%"></span></span>
        </div>
      </div>
      <div class="res">
        <span class="res__item res__item--money">${formatValue('money', state.money)}</span>
        <span class="res__item res__item--fans">${formatValue('fans', state.fans)}</span>
        <span class="res__item res__item--fame">${formatValue('fame', state.fame)}</span>
        ${stockValue > 0 ? `<span class="res__item res__item--sub">${icon('stock')}<span class="val__label">주식</span> <b class="val__num">${stockValue.toLocaleString('ko-KR')}</b></span>` : ''}
        ${state.investments.active.length > 0 ? `<span class="res__item res__item--sub">${icon('invest')}<span class="val__label">투자</span> <b class="val__num">${state.investments.active.length}건</b></span>` : ''}
      </div>
    </div>
  `;
}

/* ===================== 타이틀 ===================== */

function viewTitle(hasSave = false) {
  return `
    <section class="screen screen--title">
      <div class="backdrop" aria-hidden="true"><span class="backdrop__moon"></span><span class="backdrop__star"></span></div>
      <div class="logo">
        ${sparkle('logo__sparkle')}
        <h1 class="logo__title"><span class="logo__stel">STELLIVE</span><span class="logo__mgr">MANAGER</span></h1>
        <span class="logo__days">${MAX_DAY} DAYS SCHEDULE</span>
      </div>
      <ul class="lineup" aria-hidden="true">
        ${MEMBERS.map((member) => `<li class="lineup__card" style="${memberStyle(member.id)}"><span class="lineup__name">${shortName(member.id)}</span></li>`).join('')}
      </ul>
      <p class="title__lead">
        ${MEMBERS.length}명의 멤버, ${MAX_DAY}일의 스케줄.<br />
        중요한 순간은 매니저인 당신이 결정한다.
      </p>
      <nav class="menu">
        ${hasSave ? pillButton('이어하기', 'data-action="continue"', 'pill--big') : ''}
        ${pillButton(hasSave ? '새 게임' : '게임 시작', 'data-action="start"', hasSave ? 'pill--big pill--line' : 'pill--big')}
      </nav>
      ${hasSave ? '<p class="title__warn">새 게임을 시작하면 저장된 진행 상황이 사라진다.</p>' : ''}
      <details class="howto">
        <summary>게임 방법</summary>
        <ul>
          <li>일반 일정은 자동으로 진행된다. <em class="k k--important">중요</em> 이벤트와 <em class="k k--collab">콜라보</em>만 직접 결정하자.</li>
          <li>남는 자금은 상점·장기 투자·가상 주식에 쓸 수도, 그대로 모아 둘 수도 있다.</li>
          <li>${MAX_DAY}일 동안 채널을 키워 보자. 진행 상황은 자동으로 저장된다.</li>
        </ul>
      </details>
      <footer class="title__foot">비공식 팬메이드 게임 · 자동 저장</footer>
    </section>
  `;
}

/* ===================== 매니저 메뉴 (일정표 / 상점 / 투자 / 주식) ===================== */

const MANAGER_TABS = [
  { phase: GAME_PHASE.DAY_BOARD, label: '일정표', icon: 'schedule' },
  { phase: GAME_PHASE.SHOP, label: '상점', icon: 'shop' },
  { phase: GAME_PHASE.INVEST, label: '투자', icon: 'invest' },
  { phase: GAME_PHASE.MARKET, label: '주식', icon: 'stock' },
];

function viewManager(state, content, notice) {
  const pending = getPendingDecisions().length;
  const tabs = MANAGER_TABS.filter((tab) => MANAGER_PHASES.includes(tab.phase))
    .map((tab) => {
      const active = tab.phase === state.gamePhase;
      const badge = tab.phase === GAME_PHASE.DAY_BOARD && pending > 0 ? ` <span class="tab__badge">${pending}</span>` : '';
      return `<button class="tab${active ? ' tab--active' : ''}" data-action="nav" data-target="${tab.phase}" ${active ? 'disabled' : ''}>${icon(tab.icon)}<span>${tab.label}</span>${badge}</button>`;
    })
    .join('');
  const noticeBlock = notice ? `<p class="notice notice--${notice.type}">${notice.text}</p>` : '';
  return `<nav class="tabs">${tabs}</nav>${noticeBlock}${content}`;
}

/* ===================== 하루 일정표 ===================== */

// 공식 탤런트 페이지처럼 기수별로 묶는다. 묶음 이름은 멤버 데이터의 unit 에서 만든다.
function groupByGeneration(members) {
  const groups = new Map();
  members.forEach((member) => {
    if (!groups.has(member.generation)) groups.set(member.generation, []);
    groups.get(member.generation).push(member);
  });
  return [...groups.entries()].map(([generation, list]) => ({
    generation,
    label: [...new Set(list.map((member) => member.unit))].join(' · ').toUpperCase(),
    members: list,
  }));
}

function viewDayBoard(state) {
  const pending = getPendingDecisions();
  const groups = groupByGeneration(state.members)
    .map(
      (group) => `
      <section class="unit">
        <header class="unit__head">
          <span class="unit__num" aria-hidden="true">${String(group.generation).padStart(2, '0')}</span>
          <span class="unit__pill">${group.label}</span>
        </header>
        <ul class="schedule">${group.members.map((member) => viewScheduleRow(member)).join('')}</ul>
      </section>`,
    )
    .join('');

  return `
    <section class="screen">
      ${heading('SCHEDULE', `Day ${state.currentDay} · 오늘의 스케줄`)}
      <div class="counters">
        <span class="counter"><span class="counter__label">완료</span><b>${getCompletedCount()}</b><span class="counter__of">/ ${state.members.length}</span></span>
        <span class="counter${pending.length > 0 ? ' counter--hot' : ''}"><span class="counter__label">남은 결정</span><b>${pending.length}</b><span class="counter__of">건</span></span>
      </div>
      ${viewLastLogBanner(state)}
      ${groups}
      <div class="board-foot">
        <p class="board-foot__hint">
          ${
            pending.length > 0
              ? '<em class="k k--important">중요</em> 이벤트와 <em class="k k--collab">콜라보</em>를 모두 처리하면 하루를 마무리할 수 있다.'
              : '남은 일반 일정은 자동으로 진행된다.'
          }
        </p>
        ${pillButton('하루 마무리', `data-action="finishDay" ${pending.length > 0 ? 'disabled' : ''}`, 'pill--big')}
      </div>
    </section>
  `;
}

function viewScheduleRow(member) {
  const entry = getScheduleEntry(member.id);
  if (!entry) return '';
  const activity = getActivityById(entry.activityId);

  const doneState = `<span class="schedule__state schedule__state--done">${icon('check')}완료</span>`;
  let modifier = '';
  let badge = '';
  let detail = `<span class="schedule__activity"><span class="slot" aria-hidden="true">${activity.icon}</span>${activity.label}</span>`;
  let action = '<span class="schedule__state">자동 진행</span>';

  if (entry.kind === ENTRY_KIND.IMPORTANT) {
    modifier = ' schedule__row--important';
    badge = '<span class="ribbon ribbon--important">중요</span>';
    action = entry.done
      ? doneState
      : pillButton('처리하기', `data-action="openEvent" data-member-id="${member.id}"`, 'pill--small pill--important');
  } else if (entry.kind === ENTRY_KIND.COLLAB) {
    modifier = ' schedule__row--collab';
    badge = '<span class="ribbon ribbon--collab">콜라보</span>';
    if (entry.collabHostId) {
      detail = `<span class="mark mark--collab">${shortName(entry.collabHostId)}와 콜라보</span>`;
      action = doneState;
    } else if (entry.done && entry.collabPartnerIds?.length) {
      detail += ` <span class="mark mark--collab">${entry.collabPartnerIds.map(shortName).join('·')}와 콜라보 (주최)</span>`;
      action = doneState;
    } else {
      detail += ' <span class="mark mark--collab">콜라보 제안</span>';
      action = entry.done
        ? doneState
        : pillButton('구성하기', `data-action="openEvent" data-member-id="${member.id}"`, 'pill--small');
    }
  } else if (entry.done) {
    action = doneState;
  }

  return `
    <li class="schedule__row${modifier}${entry.done ? ' schedule__row--done' : ''}" style="${memberStyle(member.id)}">
      <div class="card__arch">
        ${sparkle('card__star')}
        ${badge}
        <div class="card__plate">
          <span class="schedule__name">${member.name}</span>
          <span class="card__roman">${memberTheme(member.id).roman}</span>
        </div>
      </div>
      <div class="card__body">
        <div class="schedule__detail">${detail}</div>
        <div class="schedule__stats">${renderHp(member)}${renderStats(member)}</div>
        <div class="schedule__tags">${renderTraits(member)}</div>
        <div class="schedule__action">${action}</div>
      </div>
    </li>
  `;
}

function viewLastLogBanner(state) {
  // 오늘 아침 투자 결과는 하루 내내 보여주고, 그 아래에 직전 결정 결과를 보여준다.
  const investBanner = viewInvestmentResultsBanner(state);
  const log = [...getTodayLogs()].reverse().find((item) => [ENTRY_KIND.IMPORTANT, ENTRY_KIND.COLLAB].includes(item.kind));
  if (!log) return investBanner;

  return `${investBanner}
    <div class="banner">
      <p class="banner__head">
        <span class="banner__tag">직전 결과</span>
        <span class="banner__who">${log.memberIds.map((id) => avatar(id, 'xs')).join('')}${log.memberIds.map(shortName).join('·')}</span>
        <span class="banner__title">${log.title}</span> ${renderOutcome(log.check)}
      </p>
      <p class="banner__choice">${fillText(log.choiceText, log.memberIds)}</p>
      <div class="banner__deltas">${renderDeltas(log.deltas)}</div>
    </div>
  `;
}

// 오늘 아침 결과가 나온 장기 투자 + 장 시작 때 반영된 시장 소식
function viewInvestmentResultsBanner(state) {
  const todayLogs = getTodayLogs();
  const news = todayLogs.filter((log) => log.kind === LOG_KIND.MARKET_NEWS);
  const newsBlock = news.length
    ? `<div class="banner banner--news"><p class="banner__head"><span class="banner__tag">${icon('news')}시장 소식</span> 장 시작 때 주가에 반영됐다</p>
         <div class="banner__deltas">${news.map((log) => `<span class="delta">${log.title.replace('📰 ', '')}</span>${renderDeltas(log.deltas)}`).join('')}</div></div>`
    : '';
  const results = todayLogs.filter((log) => log.kind === LOG_KIND.INVEST_RESULT);
  return newsBlock + results
    .map(
      (log) => `
      <div class="banner banner--invest">
        <p class="banner__head"><span class="banner__tag">${icon('invest')}오늘 아침 투자 결과</span> <span class="banner__title">${log.title}</span> ${renderOutcome(log.check)}</p>
        <div class="banner__deltas">${renderDeltas(log.deltas)}</div>
      </div>
    `,
    )
    .join('');
}

/* ===================== 상점 ===================== */

function viewShop(state) {
  const fanBonus = getShopTotal(state.shop.levels, 'fanBonus');
  const recoveryBonus = getShopTotal(state.shop.levels, 'hpRecovery');
  const cards = SHOP_ITEMS.map((item) => {
    const offer = getShopOffer(state, item.id);
    const pips = Array.from({ length: item.maxLevel }, (_, i) => `<span class="pip${i < offer.level ? ' pip--on' : ''}"></span>`).join('');
    const button = offer.maxed
      ? '<button class="btn btn--small" disabled>최대 레벨</button>'
      : `<button class="btn btn--small btn--primary" data-action="buyShop" data-item-id="${item.id}" ${offer.affordable ? '' : 'disabled'}>
           ${offer.affordable ? '구매' : '돈 부족'} · ${won(offer.price)}
         </button>`;
    return `
      <article class="shop-card${offer.maxed ? ' shop-card--maxed' : ''}">
        <header class="shop-card__head">
          <span class="slot slot--lg" aria-hidden="true">${item.icon}</span>
          <div class="shop-card__titles">
            <span class="shop-card__name">${item.label}</span>
            <span class="shop-card__level">Lv.${offer.level} / ${item.maxLevel}</span>
          </div>
        </header>
        <div class="pips">${pips}</div>
        <p class="shop-card__desc">${item.desc}</p>
        ${button}
      </article>
    `;
  }).join('');

  return `
    <section class="screen">
      ${heading(
        'SHOP',
        '상점',
        `보유 자금 <b class="em">${won(state.money)}</b> · 구매 즉시 반영된다.
         ${fanBonus > 0 ? ` · 팬 획득 +${Math.round(fanBonus * 100)}%` : ''}
         ${recoveryBonus > 0 ? ` · 하루 회복 +${recoveryBonus}` : ''}`,
      )}
      <div class="shop-grid">${cards}</div>
    </section>
  `;
}

/* ===================== 장기 투자 ===================== */

const BLOCKER_LABEL = {
  active: '진행 중',
  maxActive: `동시 ${INVESTMENT_RULES.maxActive}건까지`,
  tooLate: '기간 부족',
  money: '돈 부족',
};

function viewInvest(state) {
  const active = state.investments.active
    .map((record) => {
      const investment = getInvestment(record.id);
      const left = record.resultDay - state.currentDay;
      return `
        <li class="routine routine--active">
          <span class="slot" aria-hidden="true">${investment.icon}</span>
          <span class="routine__title">${investment.label}</span>
          <span class="stat">투자 ${won(record.cost)} · 예상 성공률 ${Math.round(record.chance * 100)}%</span>
          <span class="stat">Day ${record.resultDay} 결과 (${left > 0 ? `${left}일 남음` : '오늘'})</span>
        </li>
      `;
    })
    .join('');

  const offers = INVESTMENTS.map((investment) => {
    const blocker = getInvestmentBlocker(state, investment.id);
    const chance = Math.round(getInvestmentChance(state, investment.id) * 100);
    const success = investment.success;
    const fail = investment.fail;
    return `
      <article class="shop-card">
        <header class="shop-card__head">
          <span class="slot slot--lg" aria-hidden="true">${investment.icon}</span>
          <div class="shop-card__titles">
            <span class="shop-card__name">${investment.label}</span>
            <span class="shop-card__level">${investment.duration}일 · 성공률 ${chance}%</span>
          </div>
        </header>
        <div class="meter" aria-hidden="true"><span class="meter__fill" style="width:${chance}%"></span></div>
        <p class="shop-card__desc">${investment.desc}</p>
        <dl class="payout">
          <div class="payout__row payout__row--win"><dt>성공 시 회수</dt><dd>${won(success.money || 0)}${success.fans ? ` · 팬 +${success.fans}` : ''}${success.fame ? ` · 명성 +${success.fame}` : ''}</dd></div>
          <div class="payout__row payout__row--lose"><dt>실패 시 회수</dt><dd>${won(fail.money || 0)}${fail.fans ? ` · 팬 +${fail.fans}` : ''}</dd></div>
        </dl>
        <button class="btn btn--small btn--primary" data-action="startInvest" data-investment-id="${investment.id}" ${blocker ? 'disabled' : ''}>
          ${blocker ? BLOCKER_LABEL[blocker] || '불가' : '투자'} · ${won(investment.cost)}
        </button>
      </article>
    `;
  }).join('');

  const history = state.investments.history
    .slice()
    .reverse()
    .map((record) => {
      const investment = getInvestment(record.id);
      return `
        <li class="routine">
          <span class="routine__member">Day ${record.day}</span>
          <span class="routine__title">${investment.label}</span>
          ${renderOutcome({ outcome: record.outcome })}
          <span class="stat ${signClass(record.profit)}">수익 ${signedWon(record.profit)}</span>
        </li>
      `;
    })
    .join('');

  return `
    <section class="screen">
      ${heading(
        'PROJECT',
        '장기 투자',
        `보유 자금 <b class="em">${won(state.money)}</b> · 시작하면 비용을 먼저 내고, 기간이 끝난 날 아침에 결과가 나온다.
         성공률은 멤버 스탯과 상점 업그레이드에 따라 달라지고, 시작할 때 확정된다.`,
      )}
      ${active ? `<h3 class="section-title">진행 중</h3><ul class="routines">${active}</ul>` : ''}
      <div class="shop-grid">${offers}</div>
      ${history ? `<h3 class="section-title">지난 투자</h3><ul class="routines">${history}</ul>` : ''}
    </section>
  `;
}

/* ===================== 주식시장 ===================== */

// 종가 이력으로 그리는 작은 선 그래프 (SVG)
function sparkline(history) {
  const points = history.slice(-15);
  if (points.length < 2) return '<span class="spark spark--empty">—</span>';
  const prices = points.map((point) => point.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const width = 96;
  const height = 28;
  const coords = prices
    .map((price, i) => `${((i / (prices.length - 1)) * width).toFixed(1)},${(height - 2 - ((price - min) / range) * (height - 4)).toFixed(1)}`)
    .join(' ');
  const up = prices[prices.length - 1] >= prices[0];
  return `<svg class="spark ${up ? 'spark--up' : 'spark--down'}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true"><polyline points="${coords}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" /></svg>`;
}

function viewMarket(state) {
  const portfolio = getPortfolio(state);
  const rows = portfolio.rows
    .map((row) => {
      const { stock, quote } = row;
      const canSell = row.shares > 0;
      const maxBuy = getMaxBuyable(state, stock.ticker);
      return `
        <tr>
          <td>
            <span class="ticker">${stock.ticker}</span>
            <span class="ticker__name">${stock.name}</span>
            <span class="ticker__sector">${stock.sector}</span>
          </td>
          <td class="num">${quote.currentPrice.toLocaleString('ko-KR')}</td>
          <td class="num ${signClass(row.changeRate)}">${percent(row.changeRate)}</td>
          <td>${sparkline(quote.priceHistory)}</td>
          <td class="num">${row.shares}</td>
          <td class="num">${row.value.toLocaleString('ko-KR')}</td>
          <td class="num ${signClass(row.unrealized)}">${row.shares > 0 ? signedWon(row.unrealized) : '—'}</td>
          <td class="trade">
            <input class="trade__qty" id="qty-${stock.ticker}" type="number" min="1" max="${STOCK_RULES.maxShares}" value="10" aria-label="${stock.ticker} 수량" />
            <button class="btn btn--small btn--primary" data-action="trade" data-side="buy" data-ticker="${stock.ticker}" ${maxBuy > 0 ? '' : 'disabled'}>매수</button>
            <button class="btn btn--small" data-action="trade" data-side="sell" data-ticker="${stock.ticker}" ${canSell ? '' : 'disabled'}>매도</button>
            <button class="btn btn--small" data-action="trade" data-side="buy" data-qty="max" data-ticker="${stock.ticker}" ${maxBuy > 0 ? '' : 'disabled'}>최대</button>
            <button class="btn btn--small" data-action="trade" data-side="sell" data-qty="all" data-ticker="${stock.ticker}" ${canSell ? '' : 'disabled'}>전량</button>
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <section class="screen">
      ${heading(
        'MARKET',
        '가상 주식시장',
        `게임 안에만 존재하는 가상 종목이다. 종가는 하루를 마무리할 때 정해지고,
         콘텐츠 성공·실패와 이벤트·투자 결과가 주가에 영향을 준다.
         하루 변동은 ±${Math.round(STOCK_RULES.maxDailyMove * 100)}%로 제한되며 매매 수수료는 ${STOCK_RULES.feeRate * 100}%다.`,
      )}
      <div class="market-totals">
        <span class="totals__item"><span class="totals__label">현금</span><b>${won(state.money)}</b></span>
        <span class="totals__item"><span class="totals__label">주식 평가액</span><b>${won(portfolio.totalValue)}</b></span>
        <span class="totals__item"><span class="totals__label">실현 손익</span><b class="${signClass(portfolio.realizedPnl)}">${signedWon(portfolio.realizedPnl)}</b></span>
        <span class="totals__item"><span class="totals__label">미실현 손익</span><b class="${signClass(portfolio.unrealizedPnl)}">${signedWon(portfolio.unrealizedPnl)}</b></span>
      </div>
      <p class="table-hint">표를 옆으로 밀면 주문 버튼까지 볼 수 있다 →</p>
      <div class="table-wrap">
        <table class="market">
          <thead>
            <tr>
              <th>종목</th><th class="num">현재가</th><th class="num">오늘</th><th>추이</th>
              <th class="num">보유</th><th class="num">평가 금액</th><th class="num">평가 손익</th><th>주문 (한도 ${STOCK_RULES.maxShares}주)</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

/* ===================== 이벤트 / 콜라보 ===================== */

function viewEvent(state) {
  const host = getMember(state.selectedMemberId);
  const currentEvent = state.currentEvent;

  if (!host || !currentEvent) {
    return '<section class="screen"><p class="empty">이벤트 정보를 불러오지 못했습니다.</p></section>';
  }

  const entry = getScheduleEntry(host.id);
  const activity = entry ? getActivityById(entry.activityId) : null;
  const timeSlot = getEventTimeSlot(currentEvent, host.id);
  const participants = getEventParticipants(state);
  const memberIds = participants.map((member) => member.id);
  const ready = canChoose(state);

  // 오늘 일정에 맞지 않는 선택지는 목록에서 숨긴다. (index 는 원래 순서 그대로)
  const available = getAvailableChoices(currentEvent, state, host.id);

  const choices = available
    .map(({ choice, index }, order) => {
      let check = '';
      if (choice.check) {
        const meta = VALUE_META[choice.check.stat];
        const value = ready ? getSuccessChance(participants, choice.check, timeSlot) : null;
        const chance = value === null ? '—' : `${value}%`;
        const tone = value === null ? '' : value >= 70 ? ' check--high' : value >= 40 ? ' check--mid' : ' check--low';
        check = `
          <span class="check${tone}">
            ${icon(choice.check.stat)}<span class="check__text">${meta.full} 판정 · 성공률 ${chance}</span>
            <span class="check__bar" aria-hidden="true"><span style="width:${value ?? 0}%"></span></span>
          </span>`;
      }
      return `
        <button class="choice" data-action="choose" data-choice-index="${index}" ${ready ? '' : 'disabled'}>
          <span class="choice__num" aria-hidden="true">${order + 1}</span>
          <span class="choice__text">${fillText(choice.text, memberIds)}</span>
          ${check}
        </button>
      `;
    })
    .join('');

  const kindMark = currentEvent.collab
    ? '<span class="mark mark--collab">콜라보</span>'
    : '<span class="mark mark--important">중요 이벤트</span>';

  return `
    <section class="screen screen--event${currentEvent.collab ? ' screen--collab' : ''}" style="${memberStyle(host.id)}">
      <div class="scene">
        <div class="host-card" aria-hidden="true">
          <div class="card__arch">
            ${sparkle('card__star')}
            <div class="card__plate">
              <span class="schedule__name">${host.name}</span>
              <span class="card__roman">${memberTheme(host.id).roman}</span>
            </div>
          </div>
        </div>
        <article class="sheet">
          <span class="tab-label">DAY ${String(state.currentDay).padStart(2, '0')} · ${TIME_SLOT_LABEL[timeSlot] || ''}</span>
          <div class="sheet__meta">
            ${kindMark}
            ${activity ? `<span class="sheet__activity">오늘 일정 · ${activity.label}</span>` : ''}
          </div>
          <h2 class="screen__title">${currentEvent.title}</h2>
          <p class="sheet__speaker">${avatar(host.id, 'xs')}${host.name}</p>
          <p class="dialog__text">${fillText(currentEvent.description, memberIds)}</p>
          ${entry?.stockNews ? `<div class="event-card__news">${icon('news')}이 소식은 오늘 장 시작 때 이미 주가에 반영됐다 ${renderDeltas(entry.stockNews)}</div>` : ''}
        </article>
      </div>
      ${currentEvent.collab ? viewPartnerPicker(state, host, currentEvent, available) : ''}
      ${ready ? '' : `<p class="notice">${icon('alert')}함께할 멤버를 먼저 골라야 한다.</p>`}
      <h3 class="section-title">선택</h3>
      <div class="choices">${choices}</div>
      <div class="screen__foot">
        <button class="btn btn--ghost" data-action="back">← 일정표로 돌아가기</button>
      </div>
    </section>
  `;
}

// 지금 보이는 선택지의 판정에 걸린 태그 (파트너 카드에서 강조 표시)
function getRelevantTraits(available) {
  const traits = new Set();
  available.forEach(({ choice }) => {
    Object.keys(choice.check?.traitBonus || {}).forEach((trait) => traits.add(trait));
  });
  return [...traits];
}

function viewPartnerPicker(state, host, event, available) {
  const selected = state.collabPartnerIds;
  const maxPartners = event.collab.max - 1;
  const minPartners = event.collab.min - 1;
  const relevant = getRelevantTraits(available);

  const cards = state.members
    .filter((member) => member.id !== host.id)
    .map((member) => {
      const isSelected = selected.includes(member.id);
      const selectable = isSelectablePartner(member.id);
      const full = !isSelected && selected.length >= maxPartners;
      const disabled = !selectable || full;
      const reason = selectable ? '' : '<span class="picker__reason">오늘 일정 있음</span>';

      return `
        <button
          class="picker__item${isSelected ? ' picker__item--selected' : ''}"
          data-action="togglePartner"
          data-member-id="${member.id}"
          ${disabled && !isSelected ? 'disabled' : ''}
        >
          <span class="picker__top">
            ${avatar(member.id, 'sm')}
            <span class="picker__name">${member.name} ${reason}</span>
            ${isSelected ? `<span class="picker__check">${icon('check')}</span>` : ''}
          </span>
          <span class="picker__rel">${icon('relationship')}${shortName(host.id)}와 관계 <b>${getRelationship(host.id, member.id)}</b></span>
          <span class="picker__stats">${renderHp(member)}${renderStats(member)}</span>
          <span class="picker__tags">${renderTraits(member, relevant)}</span>
        </button>
      `;
    })
    .join('');

  return `
    <div class="picker">
      <p class="picker__head">
        <b>함께할 멤버</b> <span class="picker__count">${selected.length} / ${maxPartners}명</span> 최소 ${minPartners}명
        · 관계도·태그·스탯·HP가 성공률에 반영된다.
      </p>
      <div class="picker__grid">${cards}</div>
    </div>
  `;
}

/* ===================== 하루 결과 ===================== */

function viewLogItem(log) {
  const kindMark =
    log.kind === ENTRY_KIND.COLLAB
      ? '<span class="mark mark--collab">콜라보</span>'
      : '<span class="mark mark--important">중요</span>';
  return `
    <li class="result result--${log.check?.outcome || 'none'}">
      <div class="result__head">
        <span class="result__avatars">${log.memberIds.map((id) => avatar(id, 'sm')).join('')}</span>
        ${kindMark}
        <span class="result__member">${log.memberIds.map(shortName).join('·')}</span>
        <span class="result__event">${log.title}</span>
        ${renderOutcome(log.check)}
      </div>
      <p class="result__choice">${fillText(log.choiceText, log.memberIds)}</p>
      <div class="result__deltas">${renderDeltas(log.deltas)}</div>
    </li>
  `;
}

function viewRoutineItem(log) {
  return `
    <li class="routine">
      <span class="routine__member">${avatar(log.memberIds[0], 'xs')}${shortName(log.memberIds[0])}</span>
      <span class="routine__title">${log.title}</span>
      ${renderOutcome(log.check)}
      <span class="routine__deltas">${renderDeltas(log.deltas)}</span>
    </li>
  `;
}

const MANAGER_LOG_KINDS = [LOG_KIND.MARKET_NEWS, LOG_KIND.SHOP, LOG_KIND.INVEST_START, LOG_KIND.INVEST_RESULT, LOG_KIND.TRADE];

// 매니저 활동 (상점 / 투자 / 매매) 한 줄
function viewManagerLogItem(log) {
  const pnl = typeof log.pnl === 'number' ? `<span class="stat ${signClass(log.pnl)}">실현 ${signedWon(log.pnl)}</span>` : '';
  return `
    <li class="routine">
      <span class="routine__title">${log.title}</span>
      ${log.kind === LOG_KIND.INVEST_RESULT ? renderOutcome(log.check) : ''}
      ${pnl}
      <span class="routine__deltas">${renderDeltas(log.deltas)}</span>
    </li>
  `;
}

// 오늘 종가 기준 종목별 등락
function viewMarketClose(state) {
  const rows = getPortfolio(state).rows
    .map((row) => `<span class="delta ${row.changeRate >= 0 ? 'delta--plus' : 'delta--minus'}">${row.stock.ticker} ${percent(row.changeRate)}</span>`)
    .join('');
  return `<div class="day-delta"><span class="day-delta__label">오늘 종가</span>${rows}</div>`;
}

// 주간 결산: 수치 변화 + 상점 / 투자 / 주식 요약
function viewWeekSummary() {
  const logs = getLogsSince(getWeekStartDay());
  const shop = logs.filter((log) => log.kind === LOG_KIND.SHOP);
  const results = logs.filter((log) => log.kind === LOG_KIND.INVEST_RESULT);
  const investProfit = results.reduce((sum, log) => sum + (log.profit || 0), 0);
  const delta = getWeekDelta();
  const highlights = logs.filter(
    (log) => [ENTRY_KIND.IMPORTANT, ENTRY_KIND.COLLAB].includes(log.kind) && log.check?.outcome === OUTCOME.GREAT,
  );

  return `
    <div class="week">
      <span class="tab-label">WEEKLY REPORT</span>
      <p class="week__head">Week ${getWeekNumber()} 결산</p>
      <div class="result__deltas">${renderTotalsDelta(delta)}</div>
      <ul class="week__list">
        <li>${icon('shop')}상점 구매 ${shop.length}건${shop.length ? ` — ${shop.map((log) => log.title).join(', ')}` : ''}</li>
        <li>${icon('invest')}투자 결과 ${results.length}건${results.length ? ` — 성공 ${results.filter((log) => log.check?.outcome === OUTCOME.SUCCESS).length}건, 수익 ${signedWon(investProfit)}` : ''}</li>
        <li>${icon('stock')}주식 실현 손익 ${signedWon(delta.realizedPnl)} · 평가액 변화 ${signedWon(delta.stockValue)}</li>
        ${highlights.length ? `<li>${icon('fame')}이번 주 대성공: ${highlights.map((log) => log.title).join(', ')}</li>` : ''}
      </ul>
    </div>
  `;
}

function viewDayResult(state) {
  const logs = getTodayLogs();
  const decisions = logs.filter((log) => [ENTRY_KIND.IMPORTANT, ENTRY_KIND.COLLAB].includes(log.kind));
  const routines = logs.filter((log) => log.kind === ENTRY_KIND.ROUTINE);
  const managerLogs = logs.filter((log) => MANAGER_LOG_KINDS.includes(log.kind));

  const weekBlock = isWeekEnd() ? viewWeekSummary() : '';

  return `
    <section class="screen">
      ${heading('REPORT', `Day ${state.currentDay} 결과`)}
      <div class="totals">
        <span class="totals__item">${formatValue('money', state.money)}</span>
        <span class="totals__item">${formatValue('fans', state.fans)}</span>
        <span class="totals__item">${formatValue('fame', state.fame)}</span>
      </div>
      <div class="day-delta">
        <span class="day-delta__label">오늘 변화</span>
        ${renderTotalsDelta(getDayDelta())}
      </div>
      ${viewMarketClose(state)}
      ${weekBlock}
      <h3 class="section-title">주요 결과</h3>
      <ul class="results">${decisions.map(viewLogItem).join('') || '<li class="empty">없음</li>'}</ul>
      ${managerLogs.length ? `<h3 class="section-title">매니저 활동</h3><ul class="routines">${managerLogs.map(viewManagerLogItem).join('')}</ul>` : ''}
      <h3 class="section-title">일반 일정</h3>
      <ul class="routines">${routines.map(viewRoutineItem).join('')}</ul>
      <div class="screen__foot screen__foot--center">
        ${pillButton(isLastDay() ? '최종 결과 보기' : '다음 날', 'data-action="nextDay"', 'pill--big')}
      </div>
    </section>
  `;
}

/* ===================== 최종 결과 ===================== */

function viewGameEnd(state) {
  const rows = state.members
    .map(
      (member) => `
      <li class="talent" style="${memberStyle(member.id)}">
        <div class="card__arch">
          ${sparkle('card__star')}
          <div class="card__plate">
            <span class="schedule__name">${member.name}</span>
            <span class="card__roman">${memberTheme(member.id).roman}</span>
          </div>
        </div>
        <div class="card__body">${renderHp(member)}${renderStats(member)}</div>
      </li>
    `,
    )
    .join('');

  const ending = evaluateEnding(state);
  const portfolio = getPortfolio(state);
  const history = state.investments.history;
  const investProfit = history.reduce((sum, record) => sum + record.profit, 0);
  const shopLevels = SHOP_ITEMS.map((item) => `${item.label.split(' ')[0]} Lv.${state.shop.levels[item.id] || 0}`).join(' · ');

  const breakdown = ending.breakdown
    .map((item) => {
      const value = item.key === 'netWorth' ? signedWon(item.value) : item.key === 'investments' ? `${item.value}건` : Number(item.value.toFixed(1)).toLocaleString('ko-KR');
      return `<li class="routine"><span class="routine__title">${item.label}</span><span class="stat">${value}</span><span class="stat ${signClass(item.points)}">${item.points > 0 ? '+' : ''}${item.points}점</span></li>`;
    })
    .join('');
  const achievements = ending.achievements
    .map((item) => `<li class="routine routine--medal"><span class="medal" aria-hidden="true">${icon('fame')}</span><span class="routine__title">${item.label}</span><span class="stat num--plus">+${item.points}점</span></li>`)
    .join('');

  return `
    <section class="screen screen--ending">
      ${heading('FINAL', `${MAX_DAY}일 결과`)}
      <div class="ending ending--${ending.grade.grade}">
        <div class="ending__rank">
          <span class="ending__rank-label">RANK</span>
          <p class="ending__grade">${ending.grade.grade}</p>
        </div>
        <div class="ending__body">
          <p class="ending__title">${ending.grade.title}</p>
          <p class="ending__desc">${ending.grade.desc}</p>
          <p class="ending__score">최종 점수 <b>${ending.score}</b>점</p>
        </div>
      </div>
      <div class="totals">
        <span class="totals__item">${formatValue('money', state.money)}</span>
        <span class="totals__item">${formatValue('fans', state.fans)}</span>
        <span class="totals__item">${formatValue('fame', state.fame)}</span>
        <span class="totals__item">${icon('bank')}<span class="val__label">순자산</span> <b class="val__num">${won(getNetWorth())}</b></span>
      </div>
      <h3 class="section-title">점수 내역</h3>
      <ul class="routines">${breakdown}${achievements}</ul>
      <h3 class="section-title">경영 성과</h3>
      <ul class="routines">
        <li class="routine"><span class="routine__title">${icon('shop')}상점 업그레이드</span><span class="stat">${shopLevels}</span></li>
        <li class="routine"><span class="routine__title">${icon('invest')}장기 투자</span><span class="stat">${history.length}건 (성공 ${history.filter((record) => record.outcome === 'success').length}건)</span><span class="stat ${signClass(investProfit)}">수익 ${signedWon(investProfit)}</span></li>
        <li class="routine"><span class="routine__title">${icon('stock')}주식</span><span class="stat">평가액 ${won(portfolio.totalValue)}</span><span class="stat ${signClass(portfolio.realizedPnl)}">실현 ${signedWon(portfolio.realizedPnl)}</span><span class="stat ${signClass(portfolio.unrealizedPnl)}">미실현 ${signedWon(portfolio.unrealizedPnl)}</span></li>
      </ul>
      <h3 class="section-title">멤버</h3>
      <ul class="talents">${rows}</ul>
      <div class="screen__foot screen__foot--center">
        ${pillButton('처음부터 다시', 'data-action="restart"', 'pill--big')}
      </div>
    </section>
  `;
}
