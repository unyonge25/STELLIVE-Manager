// ui-flow.test.mjs — 화면 흐름 테스트 (가짜 DOM + 가짜 localStorage 로 실제 main.js 를 띄운다)
// 실행: node tests/ui-flow.test.mjs
// 버튼 클릭(data-action)만으로 타이틀 → 28일 → 최종 결과 → 이어하기 / 재시작까지 진행한다.

import { createRunner, assert } from './helpers.mjs';

const { test, section, finish } = createRunner();

/* ---------- 가짜 DOM / 저장소 ---------- */

const elements = {};
let clickHandler = null;
function element(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      innerHTML: '',
      hidden: false,
      value: id.startsWith('qty-') ? '3' : undefined,
      addEventListener: (type, fn) => { if (id === 'app') clickHandler = fn; },
    };
  }
  return elements[id];
}
globalThis.document = { getElementById: element };

const store = new Map();
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};

const js = (file) => new URL(`../js/${file}`, import.meta.url);
await import(js('main.js'));
const S = await import(js('state.js'));

function click(action, data = {}) {
  const button = { dataset: { action, ...data }, disabled: false };
  button.closest = () => button;
  clickHandler({ target: button });
}
const html = () => elements.app.innerHTML;
const text = () => html().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const phase = () => S.getState().gamePhase;

/* ---------- 시나리오 ---------- */

section('[화면 흐름]');

test('타이틀: 저장이 없으면 게임 시작 버튼만 보인다', () => {
  assert(phase() === 'title' && html().includes('data-action="start"') && !html().includes('data-action="continue"'), text().slice(0, 120));
});

click('start');

test('일정표: 11명 일정 + 매니저 메뉴 탭 + 요약 바(Day / 돈 / 팬 / 명성)', () => {
  assert(phase() === 'dayBoard', phase());
  assert((html().match(/<li class="schedule__row/g) || []).length === 11, '일정 11개 아님');
  ['shop', 'invest', 'market'].forEach((target) => assert(html().includes(`data-target="${target}"`), `${target} 탭 없음`));
  const summary = elements.summary.innerHTML;
  ['Day 1 / 28', '돈', '팬', '명성'].forEach((word) => assert(summary.includes(word), `요약 바에 ${word} 없음`));
  assert(!html().includes('졸업'), '졸업 뱃지 표시됨');
  assert(store.size === 1, '자동 저장 안 됨');
});

test('상점: 탭 이동 → 구매 → 레벨 반영 + 성공 알림', () => {
  click('nav', { target: 'shop' });
  assert(phase() === 'shop' && html().includes('방송 장비 업그레이드'), phase());
  const money = S.getState().money;
  click('buyShop', { itemId: 'training' });
  assert(S.getState().shop.levels.training === 1 && S.getState().money < money, '구매 안 됨');
  assert(html().includes('notice--ok') && html().includes('Lv.1 / 3'), '화면 반영 안 됨');
});

test('투자: 탭 이동 → 투자 시작 → 진행 중 목록 표시', () => {
  click('nav', { target: 'invest' });
  click('startInvest', { investmentId: 'promotion' });
  assert(S.getState().investments.active.length === 1, '투자 안 됨');
  assert(text().includes('진행 중') && text().includes('Day 5 결과'), text().slice(0, 300));
});

test('주식: 탭 이동 → 입력 수량(3주) 매수 → 전량 매도 → 손익 표시', () => {
  click('nav', { target: 'market' });
  assert(html().includes('<svg') || html().includes('spark--empty'), '그래프 영역 없음');
  click('trade', { side: 'buy', ticker: 'NOVA' });
  assert(S.getState().market.holdings.NOVA?.shares === 3, '입력 수량 매수 실패');
  click('trade', { side: 'sell', ticker: 'NOVA', qty: 'all' });
  assert(!S.getState().market.holdings.NOVA, '전량 매도 실패');
  ['현재가', '오늘', '보유', '평가 금액', '실현 손익', '미실현 손익', '주식 평가액'].forEach((w) => assert(text().includes(w), `${w} 없음`));
});

test('돈이 부족하면 매수 버튼이 실패 알림을 보여준다', () => {
  const saved = S.getState().money;
  S.getState().money = 10;
  click('trade', { side: 'buy', ticker: 'NOVA' });
  assert(html().includes('notice--fail') && !S.getState().market.holdings.NOVA, '실패 처리 안 됨');
  S.getState().money = saved;
  click('nav', { target: 'dayBoard' });
});

let days = 0;
let sawCollab = false;
let sawWeek = false;
let sawInvestResult = false;
test('28일 진행: 중요 이벤트 / 콜라보를 버튼으로 처리하며 끝까지 간다', () => {
  for (;;) {
    for (const entry of S.getPendingDecisions()) {
      if (entry.done) continue;
      click('openEvent', { memberId: entry.memberId });
      assert(phase() === 'event', `이벤트가 열리지 않음 (${phase()})`);
      if (S.getState().currentEvent.collab) {
        sawCollab = true;
        assert(/data-action="choose"[^>]*disabled/.test(html()), '파트너 선택 전 선택지가 열려 있음');
        const partner = S.getState().members.find((m) => S.isSelectablePartner(m.id));
        click('togglePartner', { memberId: partner.id });
        assert(/성공률 \d+%/.test(html()) || !html().includes('판정'), '성공률 표시 없음');
      }
      const shown = [...html().matchAll(/data-choice-index="(\d+)"/g)].map((m) => m[1]);
      assert(shown.length > 0, '선택지 없음');
      click('choose', { choiceIndex: shown[0] });
      assert(phase() === 'dayBoard', `일정표로 돌아오지 않음 (${phase()})`);
    }
    if (text().includes('오늘 아침 투자 결과')) sawInvestResult = true;
    click('finishDay');
    assert(phase() === 'dayResult', 'finishDay 실패');
    assert(text().includes('오늘 종가'), '종가 표시 없음');
    days += 1;
    if (days % 7 === 0) {
      sawWeek = text().includes(`Week ${days / 7} 결산`) && text().includes('상점 구매') && text().includes('주식 실현 손익');
      assert(sawWeek, `Day ${days} 주간 결산 누락`);
    }
    click('nextDay');
    if (phase() === 'gameEnd') break;
    assert(days < 40, '무한 루프');
  }
  assert(days === 28, `${days}일`);
  assert(sawCollab, '콜라보를 한 번도 못 봄');
  assert(sawInvestResult, '투자 결과 알림을 못 봄');
});

test('최종 결과: 등급 / 점수 내역 / 경영 성과(상점·투자·주식)가 표시된다', () => {
  ['최종 점수', '점수 내역', '상점 업그레이드', '장기 투자', '주식', '순자산'].forEach((w) => assert(text().includes(w), `${w} 없음`));
  assert(/<p class="ending__grade">[SABCD]<\/p>/.test(html()), '등급 없음');
});

// 같은 main 모듈을 새 인스턴스로 다시 불러와 페이지 새로고침을 흉내 낸다.
const savedDay = S.getState().currentDay;
await import(`${js('main.js').href}?reload=1`);

test('이어하기: 새로 연 페이지에서 저장된 게임(최종 결과)을 불러온다', () => {
  assert(phase() === 'title' && html().includes('data-action="continue"'), '이어하기 버튼 없음');
  click('continue');
  assert(phase() === 'gameEnd' && S.getState().currentDay === savedDay, `${phase()} / Day ${S.getState().currentDay}`);
});

test('처음부터 다시: 저장이 지워지고 타이틀로 돌아간다', () => {
  click('restart');
  assert(phase() === 'title' && store.size === 0 && !html().includes('data-action="continue"'), `${phase()} / ${store.size}`);
});

// 새 게임에서 콜라보를 처리한 뒤 새로고침 → 이어하기 → 일정표에 파트너 표시가 남아 있는지
click('start');
const collabHost = S.getState().schedule.find((entry) => entry.kind === 'routine');
Object.assign(collabHost, { kind: 'collab', eventId: 'collab_001', activityId: 'chat' });
click('openEvent', { memberId: collabHost.memberId });
const collabPartner = S.getState().members.find((m) => S.isSelectablePartner(m.id));
click('togglePartner', { memberId: collabPartner.id });
click('choose', { choiceIndex: [...html().matchAll(/data-choice-index="(\d+)"/g)][0][1] });
const shortOf = (id) => S.getMember(id).name.split(' ').pop();
const hostLabel = `${shortOf(collabPartner.id)}와 콜라보 (주최)`;
const partnerLabel = `${shortOf(collabHost.memberId)}와 콜라보`;
const beforeReload = text();
await import(`${js('main.js').href}?reload=2`);
click('continue');

test('이어하기 후에도 일정표에 콜라보 주최 / 파트너 표시가 그대로 남는다', () => {
  assert(beforeReload.includes(hostLabel) && beforeReload.includes(partnerLabel), '새로고침 전 표시 없음');
  assert(phase() === 'dayBoard', phase());
  assert(text().includes(hostLabel), `주최 표시 없음: ${hostLabel}`);
  assert(text().includes(partnerLabel), `파트너 표시 없음: ${partnerLabel}`);
});

finish();
