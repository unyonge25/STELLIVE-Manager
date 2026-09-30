// ui.js — 화면 렌더링 전용. state 를 직접 수정하지 않는다.

import { TRAITS } from './members.js';
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

const TIME_SLOT_LABEL = { day: '☀️ 낮', evening: '🌆 저녁', lateNight: '🌙 심야' };
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

// 현재 수치 표시: "💰 돈 1,000,000"
export function formatValue(key, value) {
  const meta = VALUE_META[key];
  if (!meta) return '';
  const text = meta.currency ? value.toLocaleString('ko-KR') : String(value);
  return `${meta.icon} ${meta.label} ${text}`;
}

// 변화량 표시: "💰 돈 +100" / "❤️ 유니 HP -5" / "🤝 유니·후야 관계 +4"
//              "📈 TUNE +8%" / "❤️ 전원 HP +10" / "📊 음악 제작 투자 시작 (Day 12 결과)"
export function formatDeltaValue({ key, delta, owners, team, ticker, investmentId }) {
  if (key === 'stock') {
    return `${delta > 0 ? '📈' : '📉'} ${ticker} ${delta > 0 ? '+' : ''}${delta}%`;
  }
  if (key === 'investment') {
    return `📊 ${getInvestment(investmentId)?.label || investmentId} 시작 (Day ${delta} 결과)`;
  }
  const meta = VALUE_META[key];
  if (!meta) return '';
  const sign = delta > 0 ? '+' : '-';
  const amount = Math.abs(delta);
  const text = meta.currency ? amount.toLocaleString('ko-KR') : String(amount);
  const who = team ? '전원 ' : owners ? `${owners.map(shortName).join('·')} ` : '';
  return `${meta.icon} ${who}${meta.label} ${sign}${text}`;
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
    ? `<span class="delta ${totals.netWorth >= 0 ? 'delta--plus' : 'delta--minus'}">🏦 순자산 ${signedWon(totals.netWorth)}</span>`
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

function renderHp(member) {
  return `<span class="stat hp hp--${getHpState(member)}">${VALUE_META.hp.icon} ${member.hp}</span>`;
}

function renderStats(member) {
  return STAT_KEYS.map((key) => {
    const meta = VALUE_META[key];
    return `<span class="stat">${meta.icon} ${member.stats[key]}</span>`;
  }).join('');
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
  summary.hidden = false;
  summary.innerHTML = `
    <span class="summary__day">Day ${state.currentDay} / ${MAX_DAY}</span>
    <span class="summary__item">Week ${getWeekNumber()}</span>
    <span class="summary__item">${formatValue('money', state.money)}</span>
    <span class="summary__item">${formatValue('fans', state.fans)}</span>
    <span class="summary__item">${formatValue('fame', state.fame)}</span>
    ${stockValue > 0 ? `<span class="summary__item">📈 주식 ${stockValue.toLocaleString('ko-KR')}</span>` : ''}
    ${state.investments.active.length > 0 ? `<span class="summary__item">📊 투자 ${state.investments.active.length}건 진행 중</span>` : ''}
  `;
}

/* ===================== 타이틀 ===================== */

function viewTitle(hasSave = false) {
  return `
    <section class="screen screen--title">
      <h1 class="title">STELLIVE Manager</h1>
      <p class="subtitle">
        매일 11명의 스텔라이브 멤버가 각자의 일정을 소화한다.<br />
        중요한 순간에만 매니저가 개입해 하루를 만들어 가는 경영 시뮬레이션.
      </p>
      <p class="subtitle subtitle--dim">
        일반 일정은 자동으로 진행된다. ⚠ 중요 이벤트와 🤝 콜라보만 직접 결정하자.<br />
        남는 자금은 상점·장기 투자·가상 주식에 쓸 수도, 그대로 모아 둘 수도 있다.<br />
        ${MAX_DAY}일 동안 채널을 키워 보자. 진행 상황은 자동으로 저장된다.
      </p>
      <div class="title-actions">
        ${hasSave ? '<button class="btn btn--primary" data-action="continue">이어하기</button>' : ''}
        <button class="btn ${hasSave ? '' : 'btn--primary'}" data-action="start">${hasSave ? '새 게임' : '게임 시작'}</button>
      </div>
      ${hasSave ? '<p class="subtitle subtitle--dim">새 게임을 시작하면 저장된 진행 상황이 사라진다.</p>' : ''}
    </section>
  `;
}

/* ===================== 매니저 메뉴 (일정표 / 상점 / 투자 / 주식) ===================== */

const MANAGER_TABS = [
  { phase: GAME_PHASE.DAY_BOARD, label: '📋 일정표' },
  { phase: GAME_PHASE.SHOP, label: '🛒 상점' },
  { phase: GAME_PHASE.INVEST, label: '📊 투자' },
  { phase: GAME_PHASE.MARKET, label: '📈 주식' },
];

function viewManager(state, content, notice) {
  const pending = getPendingDecisions().length;
  const tabs = MANAGER_TABS.filter((tab) => MANAGER_PHASES.includes(tab.phase))
    .map((tab) => {
      const active = tab.phase === state.gamePhase;
      const badge = tab.phase === GAME_PHASE.DAY_BOARD && pending > 0 ? ` <span class="tab__badge">${pending}</span>` : '';
      return `<button class="tab${active ? ' tab--active' : ''}" data-action="nav" data-target="${tab.phase}" ${active ? 'disabled' : ''}>${tab.label}${badge}</button>`;
    })
    .join('');
  const noticeBlock = notice ? `<p class="notice notice--${notice.type}">${notice.text}</p>` : '';
  return `<nav class="tabs">${tabs}</nav>${noticeBlock}${content}`;
}

/* ===================== 하루 일정표 ===================== */

function viewDayBoard(state) {
  const pending = getPendingDecisions();
  const rows = state.members.map((member) => viewScheduleRow(member)).join('');

  return `
    <section class="screen">
      <header class="screen__head">
        <h2 class="screen__title">Day ${state.currentDay} · 오늘의 일정</h2>
        <p class="screen__sub">
          완료 ${getCompletedCount()} / ${state.members.length}
          · 남은 결정 ${pending.length}건
        </p>
      </header>
      ${viewLastLogBanner(state)}
      <ul class="schedule">${rows}</ul>
      <div class="board-foot">
        <p class="board-foot__hint">
          ${
            pending.length > 0
              ? '⚠ 중요 이벤트와 🤝 콜라보를 모두 처리하면 하루를 마무리할 수 있다.'
              : '남은 일반 일정은 자동으로 진행된다.'
          }
        </p>
        <button class="btn btn--primary" data-action="finishDay" ${pending.length > 0 ? 'disabled' : ''}>
          하루 마무리
        </button>
      </div>
    </section>
  `;
}

function viewScheduleRow(member) {
  const entry = getScheduleEntry(member.id);
  if (!entry) return '';
  const activity = getActivityById(entry.activityId);

  let modifier = '';
  let detail = `<span class="schedule__activity">${activity.icon} ${activity.label}</span>`;
  let action = '<span class="schedule__state">자동 진행 예정</span>';

  if (entry.kind === ENTRY_KIND.IMPORTANT) {
    modifier = ' schedule__row--important';
    detail += ' <span class="mark mark--important">⚠ 중요</span>';
    action = entry.done
      ? '<span class="schedule__state">완료</span>'
      : `<button class="btn btn--small btn--warn" data-action="openEvent" data-member-id="${member.id}">처리하기</button>`;
  } else if (entry.kind === ENTRY_KIND.COLLAB) {
    modifier = ' schedule__row--collab';
    if (entry.collabHostId) {
      detail = `<span class="mark mark--collab">🤝 ${shortName(entry.collabHostId)}와 콜라보</span>`;
      action = '<span class="schedule__state">완료</span>';
    } else if (entry.done && entry.collabPartnerIds?.length) {
      detail += ` <span class="mark mark--collab">🤝 ${entry.collabPartnerIds.map(shortName).join('·')}와 콜라보 (주최)</span>`;
      action = '<span class="schedule__state">완료</span>';
    } else {
      detail += ' <span class="mark mark--collab">🤝 콜라보 제안</span>';
      action = entry.done
        ? '<span class="schedule__state">완료</span>'
        : `<button class="btn btn--small btn--collab" data-action="openEvent" data-member-id="${member.id}">구성하기</button>`;
    }
  } else if (entry.done) {
    action = '<span class="schedule__state">완료</span>';
  }

  return `
    <li class="schedule__row${modifier}${entry.done ? ' schedule__row--done' : ''}">
      <div class="schedule__member">
        <span class="schedule__name">${member.name}</span>
        <span class="schedule__tags">${renderTraits(member)}</span>
      </div>
      <div class="schedule__stats">${renderHp(member)}${renderStats(member)}</div>
      <div class="schedule__detail">${detail}</div>
      <div class="schedule__action">${action}</div>
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
        직전 결과 · ${log.memberIds.map(shortName).join('·')} · ${log.title} ${renderOutcome(log.check)}
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
    ? `<div class="banner banner--news"><p class="banner__head">📰 오늘의 시장 소식 (장 시작 때 반영)</p>
         <div class="banner__deltas">${news.map((log) => `<span class="delta">${log.title.replace('📰 ', '')}</span>${renderDeltas(log.deltas)}`).join('')}</div></div>`
    : '';
  const results = todayLogs.filter((log) => log.kind === LOG_KIND.INVEST_RESULT);
  return newsBlock + results
    .map(
      (log) => `
      <div class="banner banner--invest">
        <p class="banner__head">오늘 아침 투자 결과 · ${log.title} ${renderOutcome(log.check)}</p>
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
      <article class="shop-card">
        <header class="shop-card__head">
          <span class="shop-card__name">${item.icon} ${item.label}</span>
          <span class="shop-card__level">Lv.${offer.level} / ${item.maxLevel}</span>
        </header>
        <div class="pips">${pips}</div>
        <p class="shop-card__desc">${item.desc}</p>
        ${button}
      </article>
    `;
  }).join('');

  return `
    <section class="screen">
      <header class="screen__head">
        <h2 class="screen__title">🛒 상점</h2>
        <p class="screen__sub">
          보유 자금 ${won(state.money)} · 구매 즉시 반영된다.
          ${fanBonus > 0 ? ` · 팬 획득 +${Math.round(fanBonus * 100)}%` : ''}
          ${recoveryBonus > 0 ? ` · 하루 회복 +${recoveryBonus}` : ''}
        </p>
      </header>
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
        <li class="routine">
          <span class="routine__member">${investment.icon}</span>
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
          <span class="shop-card__name">${investment.icon} ${investment.label}</span>
          <span class="shop-card__level">${investment.duration}일 · 성공률 ${chance}%</span>
        </header>
        <p class="shop-card__desc">${investment.desc}</p>
        <p class="shop-card__desc">
          성공 시 회수 ${won(success.money || 0)}${success.fans ? ` · 팬 +${success.fans}` : ''}${success.fame ? ` · 명성 +${success.fame}` : ''}<br />
          실패 시 회수 ${won(fail.money || 0)}${fail.fans ? ` · 팬 +${fail.fans}` : ''}
        </p>
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
          <span class="routine__title">${investment.icon} ${investment.label}</span>
          ${renderOutcome({ outcome: record.outcome })}
          <span class="stat ${signClass(record.profit)}">수익 ${signedWon(record.profit)}</span>
        </li>
      `;
    })
    .join('');

  return `
    <section class="screen">
      <header class="screen__head">
        <h2 class="screen__title">📊 장기 투자</h2>
        <p class="screen__sub">
          보유 자금 ${won(state.money)} · 시작하면 비용을 먼저 내고, 기간이 끝난 날 아침에 결과가 나온다.
          성공률은 멤버 스탯과 상점 업그레이드에 따라 달라지고, 시작할 때 확정된다.
        </p>
      </header>
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
      <header class="screen__head">
        <h2 class="screen__title">📈 가상 주식시장</h2>
        <p class="screen__sub">
          게임 안에만 존재하는 가상 종목이다. 종가는 하루를 마무리할 때 정해지고,
          콘텐츠 성공·실패와 이벤트·투자 결과가 주가에 영향을 준다.
          하루 변동은 ±${Math.round(STOCK_RULES.maxDailyMove * 100)}%로 제한되며 매매 수수료는 ${STOCK_RULES.feeRate * 100}%다.
        </p>
      </header>
      <div class="market-totals">
        <span class="totals__item">💰 현금 ${won(state.money)}</span>
        <span class="totals__item">📈 주식 평가액 ${won(portfolio.totalValue)}</span>
        <span class="totals__item ${signClass(portfolio.realizedPnl)}">실현 손익 ${signedWon(portfolio.realizedPnl)}</span>
        <span class="totals__item ${signClass(portfolio.unrealizedPnl)}">미실현 손익 ${signedWon(portfolio.unrealizedPnl)}</span>
      </div>
      <p class="table-hint">↔ 표를 옆으로 밀면 주문 버튼까지 볼 수 있다.</p>
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
    .map(({ choice, index }) => {
      let check = '';
      if (choice.check) {
        const meta = VALUE_META[choice.check.stat];
        const chance = ready ? `${getSuccessChance(participants, choice.check, timeSlot)}%` : '—';
        check = `<span class="check">${meta.icon} ${meta.full} 판정 · 성공률 ${chance}</span>`;
      }
      return `
        <button class="choice" data-action="choose" data-choice-index="${index}" ${ready ? '' : 'disabled'}>
          <span class="choice__text">${fillText(choice.text, memberIds)}</span>
          ${check}
        </button>
      `;
    })
    .join('');

  const kindMark = currentEvent.collab
    ? '<span class="mark mark--collab">🤝 콜라보</span>'
    : '<span class="mark mark--important">⚠ 중요</span>';

  return `
    <section class="screen">
      <p class="screen__sub">
        Day ${state.currentDay} · ${host.name}
        ${activity ? ` · 오늘 일정 ${activity.icon} ${activity.label}` : ''}
        · ${TIME_SLOT_LABEL[timeSlot] || ''}
      </p>
      <h2 class="screen__title">${currentEvent.title} ${kindMark}</h2>
      <div class="event-card">
        <p class="event-card__desc">${fillText(currentEvent.description, memberIds)}</p>
        ${entry?.stockNews ? `<div class="event-card__news">📰 이 소식은 오늘 장 시작 때 이미 주가에 반영됐다 ${renderDeltas(entry.stockNews)}</div>` : ''}
      </div>
      ${currentEvent.collab ? viewPartnerPicker(state, host, currentEvent, available) : ''}
      ${ready ? '' : '<p class="notice">함께할 멤버를 먼저 골라야 한다.</p>'}
      <div class="choices">${choices}</div>
      <div class="screen__foot">
        <button class="btn" data-action="back">일정표로 돌아가기</button>
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
          <span class="picker__name">${member.name} ${reason}</span>
          <span class="picker__rel">🤝 ${shortName(host.id)}와 관계 ${getRelationship(host.id, member.id)}</span>
          <span class="picker__stats">${renderHp(member)}${renderStats(member)}</span>
          <span class="picker__tags">${renderTraits(member, relevant)}</span>
        </button>
      `;
    })
    .join('');

  return `
    <div class="picker">
      <p class="picker__head">
        함께할 멤버 선택 (${selected.length} / ${maxPartners}명, 최소 ${minPartners}명)
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
      ? '<span class="mark mark--collab">🤝</span>'
      : '<span class="mark mark--important">⚠</span>';
  return `
    <li class="result">
      <div class="result__head">
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
      <span class="routine__member">${shortName(log.memberIds[0])}</span>
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
      <p class="week__head">Week ${getWeekNumber()} 결산</p>
      <div class="result__deltas">${renderTotalsDelta(delta)}</div>
      <ul class="week__list">
        <li>🛒 상점 구매 ${shop.length}건${shop.length ? ` — ${shop.map((log) => log.title).join(', ')}` : ''}</li>
        <li>📊 투자 결과 ${results.length}건${results.length ? ` — 성공 ${results.filter((log) => log.check?.outcome === OUTCOME.SUCCESS).length}건, 수익 ${signedWon(investProfit)}` : ''}</li>
        <li>📈 주식 실현 손익 ${signedWon(delta.realizedPnl)} · 평가액 변화 ${signedWon(delta.stockValue)}</li>
        ${highlights.length ? `<li>🌟 이번 주 대성공: ${highlights.map((log) => log.title).join(', ')}</li>` : ''}
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
      <h2 class="screen__title">Day ${state.currentDay} 결과</h2>
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
      <button class="btn btn--primary" data-action="nextDay">
        ${isLastDay() ? '최종 결과 보기' : '다음 날'}
      </button>
    </section>
  `;
}

/* ===================== 최종 결과 ===================== */

function viewGameEnd(state) {
  const rows = state.members
    .map(
      (member) => `
      <li class="routine">
        <span class="routine__member">${member.name}</span>
        <span class="routine__deltas">${renderHp(member)}${renderStats(member)}</span>
      </li>
    `,
    )
    .join('');

  const ending = evaluateEnding(state);
  const portfolio = getPortfolio(state);
  const history = state.investments.history;
  const investProfit = history.reduce((sum, record) => sum + record.profit, 0);
  const shopLevels = SHOP_ITEMS.map((item) => `${item.icon} Lv.${state.shop.levels[item.id] || 0}`).join(' · ');

  const breakdown = ending.breakdown
    .map((item) => {
      const value = item.key === 'netWorth' ? signedWon(item.value) : item.key === 'investments' ? `${item.value}건` : Number(item.value.toFixed(1)).toLocaleString('ko-KR');
      return `<li class="routine"><span class="routine__title">${item.label}</span><span class="stat">${value}</span><span class="stat ${signClass(item.points)}">${item.points > 0 ? '+' : ''}${item.points}점</span></li>`;
    })
    .join('');
  const achievements = ending.achievements
    .map((item) => `<li class="routine"><span class="routine__title">🏅 ${item.label}</span><span class="stat num--plus">+${item.points}점</span></li>`)
    .join('');

  return `
    <section class="screen">
      <h2 class="screen__title">${MAX_DAY}일 결과</h2>
      <div class="ending">
        <p class="ending__grade">${ending.grade.grade}</p>
        <div>
          <p class="ending__title">${ending.grade.title}</p>
          <p class="ending__desc">${ending.grade.desc}</p>
          <p class="ending__score">최종 점수 ${ending.score}점</p>
        </div>
      </div>
      <div class="totals">
        <span class="totals__item">${formatValue('money', state.money)}</span>
        <span class="totals__item">${formatValue('fans', state.fans)}</span>
        <span class="totals__item">${formatValue('fame', state.fame)}</span>
        <span class="totals__item">🏦 순자산 ${won(getNetWorth())}</span>
      </div>
      <h3 class="section-title">점수 내역</h3>
      <ul class="routines">${breakdown}${achievements}</ul>
      <h3 class="section-title">경영 성과</h3>
      <ul class="routines">
        <li class="routine"><span class="routine__title">🛒 상점 업그레이드</span><span class="stat">${shopLevels}</span></li>
        <li class="routine"><span class="routine__title">📊 장기 투자</span><span class="stat">${history.length}건 (성공 ${history.filter((record) => record.outcome === 'success').length}건)</span><span class="stat ${signClass(investProfit)}">수익 ${signedWon(investProfit)}</span></li>
        <li class="routine"><span class="routine__title">📈 주식</span><span class="stat">평가액 ${won(portfolio.totalValue)}</span><span class="stat ${signClass(portfolio.realizedPnl)}">실현 ${signedWon(portfolio.realizedPnl)}</span><span class="stat ${signClass(portfolio.unrealizedPnl)}">미실현 ${signedWon(portfolio.unrealizedPnl)}</span></li>
      </ul>
      <h3 class="section-title">멤버</h3>
      <ul class="routines">${rows}</ul>
      <button class="btn btn--primary" data-action="restart">처음부터 다시</button>
    </section>
  `;
}
