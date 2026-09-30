// events.js — 일정/이벤트 데이터 + 조건 판정 + 후보 선정 + 하루 일정 계획
// effects 는 "정의"만 하고, 실제 적용은 actions.js 가 담당한다.

import { ENTRY_KIND, HP_RULES, WEEK_LENGTH } from './state.js';
import { EXTRA_EVENTS } from './events-content.js';

/* ===================== 일반 일정 (자동 진행) ===================== */

// 일정 카테고리: 이벤트 / 선택지가 "어떤 날에 어울리는지"를 판단하는 단위.
// 이벤트와 선택지는 일정 id 대신 카테고리로 조건을 건다. (activityCategories / blockedActivityCategories)
// 새 일정을 추가할 때는 알맞은 카테고리만 붙이면 기존 이벤트 조건이 그대로 적용된다.
export const ACTIVITY_CATEGORIES = {
  broadcast: '방송 (시청자 앞에서 진행)',
  talk: '토크',
  game: '게임',
  fps: 'FPS',
  fighting: '격투게임',
  rhythm: '리듬게임',
  horror: '공포게임',
  music: '노래 / 음악',
  rest: '휴식',
};

// stat: 자동 판정에 쓰는 스탯 / traits: 이 태그를 가진 멤버에게 잘 배정되고 판정 보너스를 받는다.
// categories: 일정 카테고리 (ACTIVITY_CATEGORIES)
// eventChance: 이 일정이 중요 이벤트로 번질 추가 확률.
// 수치는 모두 임시값이다.
export const ACTIVITIES = [
  { id: 'chat', label: '저챗 방송', icon: '💬', stat: 'Bs', timeSlot: 'evening', categories: ['broadcast', 'talk'], traits: ['chatter', 'host', 'calm'], hp: -4, fans: 30, money: 10000 },
  { id: 'fps', label: 'FPS 방송', icon: '🔫', stat: 'Ga', timeSlot: 'evening', categories: ['broadcast', 'game', 'fps'], traits: ['fps', 'competitive'], hp: -6, fans: 40, money: 10000 },
  { id: 'rhythm', label: '리듬게임', icon: '🎵', stat: 'Ga', timeSlot: 'evening', categories: ['broadcast', 'game', 'rhythm'], traits: ['rhythm'], hp: -5, fans: 30, money: 10000 },
  { id: 'horror', label: '공포게임', icon: '👻', stat: 'Bs', timeSlot: 'lateNight', categories: ['broadcast', 'game', 'horror'], traits: ['horror', 'roleplay'], hp: -6, fans: 45, money: 10000 },
  { id: 'indie', label: '인디게임 찍먹', icon: '🕹️', stat: 'Ga', timeSlot: 'evening', categories: ['broadcast', 'game'], traits: ['indie', 'spontaneous'], hp: -4, fans: 30, money: 10000 },
  { id: 'openWorld', label: '오픈월드 탐방', icon: '🗺️', stat: 'Ga', timeSlot: 'day', categories: ['broadcast', 'game'], traits: ['openWorld', 'daytime'], hp: -5, fans: 35, money: 10000 },
  { id: 'fighting', label: '격투게임', icon: '🥊', stat: 'Ga', timeSlot: 'evening', categories: ['broadcast', 'game', 'fighting'], traits: ['fighting', 'competitive', 'brain'], hp: -6, fans: 35, money: 10000 },
  { id: 'sing', label: '노래 방송', icon: '🎤', stat: 'Vc', timeSlot: 'evening', categories: ['broadcast', 'music'], traits: ['instrument', 'cover'], hp: -5, fans: 40, money: 15000 },
  // 녹음은 시청자 앞에서 하는 방송이 아니다. (broadcast 없음)
  { id: 'recording', label: '노래 녹음', icon: '🎙️', stat: 'Vc', timeSlot: 'lateNight', categories: ['music'], traits: ['cover', 'perfectionist'], hp: -5, fans: 10, money: 0, eventChance: 0.25 },
  { id: 'longStream', label: '장시간 방송', icon: '⏳', stat: 'Bs', timeSlot: 'lateNight', categories: ['broadcast', 'talk'], traits: ['longStream', 'highTension'], hp: -12, fans: 70, money: 20000, eventChance: 0.25 },
  // 휴방: 판정 없이 회복만 한다. HP 가 탈진 구간이면 자동 배정된다.
  { id: 'rest', label: '휴방', icon: '🛌', rest: true, timeSlot: 'evening', categories: ['rest'], traits: [], hp: 12, fans: -10, money: 0 },
];

export function getActivityById(id) {
  return ACTIVITIES.find((activity) => activity.id === id) || null;
}

/* ===================== 이벤트 ===================== */

// 이벤트 형식 (일정 관련)
//  - conditions.activityCategories: 오늘 일정이 이 카테고리 중 하나여야 등장
//  - conditions.blockedActivityCategories: 오늘 일정이 이 카테고리 중 하나라도 있으면 등장하지 않음
//  - activityWeights: { 카테고리: 배수 } — 어울리는 일정에서 더 자주 등장 (우선 등장)
// 선택지 형식
//  - effects: 항상 적용되는 효과 (기존 형식 그대로)
//  - check: { stat, difficulty, traitBonus } — 있으면 성공 판정을 한다.
//  - outcomes: { great, success, fail } — 판정 결과에 따라 추가로 적용되는 효과
//  - conditions: 이벤트와 같은 조건 키. 맞지 않는 선택지는 목록에서 숨긴다.
//  - fallback: true — 조건에 맞는 선택지가 하나도 없을 때 대신 보여줄 선택지
// 텍스트의 {member} 는 이벤트 주인공, {partners} 는 콜라보 파트너 이름으로 바뀐다.
export const EVENTS = [
  {
    id: 'event_001',
    title: '자정을 넘긴 방송',
    description:
      '예정된 시간을 한참 넘겼는데도 채팅창은 뜨겁다. 쉬는 타이밍을 놓친 채 "한 판만 더"라는 말이 계속 올라온다. 내일 일정도 있지만, 지금 분위기를 끊기도 아깝다.',
    timeSlot: 'lateNight',
    // 시청자 앞에서 방송하는 날에만 (녹음 / 휴방 제외)
    conditions: { activityCategories: ['broadcast'] },
    weight: 1,
    choices: [
      {
        text: '시청자가 원하는 만큼 끝까지 달린다',
        effects: { fans: 150, fame: 1, hp: -12, stats: { Bs: 2 }, flags: { stayedUpLate: true } },
      },
      {
        text: '30분만 더 하고 깔끔하게 마무리한다',
        effects: { fans: 45, hp: -3 },
      },
      {
        text: '오늘은 여기서 끊고 컨디션을 챙긴다',
        effects: { hp: 10, fans: -35 },
      },
    ],
  },
  {
    id: 'event_002',
    title: '게임 대회 참가 제안',
    description:
      '게임단에서 온라인 대회 참가 제안이 들어왔다. 준비에 시간과 비용이 꽤 들지만, 잘 풀리면 채널에 큰 자극이 될 수 있다. 무리하면 다른 일정이 밀린다는 점도 감안해야 한다.',
    // 노래 / 휴방 날에는 등장하지 않고, 게임 일정에서 우선 등장한다.
    conditions: { blockedActivityCategories: ['music', 'rest'] },
    activityWeights: { game: 3 },
    weight: 1,
    choices: [
      {
        text: '본선을 노리고 진지하게 준비한다',
        effects: { money: -120000, fans: 90, fame: 2, stats: { Ga: 3 }, hp: -6 },
      },
      {
        text: '재미로 가볍게 참가한다',
        effects: { fans: 35, stats: { Ga: 1 }, hp: -3 },
      },
      {
        text: '이번엔 쉬어가고 다음 기회를 노린다',
        effects: { hp: 8, fans: -25, fame: -1 },
      },
    ],
  },
  {
    // 멤버 전용 이벤트: 아야츠노 유니에게만 후보로 들어간다.
    id: 'event_101',
    title: '즉석 노래 방송 제안',
    description:
      '방송 중에 목청을 뽑아 부른 한 소절이 채팅을 뒤집어 놓았다. 팬들이 커버 프로젝트를 하자고 성화다. 지금 달려도 되고, 목을 아끼며 준비하는 방법도 있다.',
    memberId: 'yuni',
    // "방송 중에" 일어나는 일이므로 방송 날에만, 노래 방송이면 더 자주
    conditions: { activityCategories: ['broadcast'] },
    activityWeights: { music: 2 },
    weight: 1,
    choices: [
      {
        text: '정식 커버 프로젝트를 바로 시작한다',
        effects: { money: -300000, fans: 160, fame: 2, stats: { Vc: 3 }, hp: -7 },
      },
      {
        text: '팬 요청곡으로 가볍게 즉석 방송을 한다',
        effects: { fans: 110, stats: { Vc: 1 }, hp: -9 },
      },
      {
        text: '오늘은 목을 아끼고 다음 방송을 준비한다',
        effects: { hp: 8, fans: -20 },
      },
    ],
  },

  /* ---------- 일정 연동 이벤트 (프로토타입용 임시 이벤트) ---------- */

  {
    id: 'event_201',
    title: '멈출 수 없는 장시간 방송',
    description:
      '{member}의 방송이 벌써 여덟 시간째다. 채팅은 여전히 뜨겁고 시청자 수는 오히려 늘고 있다. 다만 목소리에 피로가 조금씩 묻어나기 시작했다.',
    timeSlot: 'lateNight',
    conditions: { activity: ['longStream'], cooldown: 3 },
    weight: 2,
    choices: [
      {
        text: '분위기를 살려 기록 방송으로 밀어붙인다',
        check: { stat: 'Bs', difficulty: 80, traitBonus: { longStream: 15, highTension: 5 } },
        effects: { hp: -14, memberFlags: { stayedUpLate: true } },
        outcomes: {
          great: { fans: 260, fame: 2, money: 60000 },
          success: { fans: 150, fame: 1, money: 40000 },
          fail: { fans: 40 },
        },
      },
      {
        text: '목표 하나만 달성하고 마무리한다',
        effects: { fans: 70, money: 20000, hp: -6 },
      },
      {
        text: '무리하지 않고 지금 끝낸다',
        effects: { fans: 10, hp: 4 },
      },
    ],
  },
  {
    id: 'event_202',
    title: '끝나지 않는 녹음',
    description:
      '{member}의 커버곡 녹음이 벌써 몇 시간째 이어지고 있다. 방금 테이크도 나쁘지 않았지만, 본인은 아직 마음에 들지 않는 눈치다.',
    timeSlot: 'lateNight',
    conditions: { activity: ['recording'], blockedMemberFlags: ['coverReady'], cooldown: 2 },
    weight: 2,
    choices: [
      {
        text: '마음에 들 때까지 다시 녹음한다',
        check: { stat: 'Vc', difficulty: 85, traitBonus: { perfectionist: 10, cover: 5 } },
        effects: { hp: -10 },
        outcomes: {
          great: { fame: 1, stats: { Vc: 2 }, memberFlags: { coverReady: true } },
          success: { stats: { Vc: 1 }, memberFlags: { coverReady: true } },
          fail: { stats: { Vc: 1 } },
        },
      },
      {
        text: '지금 테이크로 마무리한다',
        effects: { hp: -3, memberFlags: { coverReady: true } },
      },
      {
        text: '오늘은 쉬고 다음에 이어간다',
        effects: { hp: 5 },
      },
    ],
  },
  {
    // event_202 의 선택 결과(coverReady)가 있어야 등장하는 후속 이벤트
    id: 'event_203',
    title: '커버곡 공개 준비 완료',
    description:
      '{member}의 커버곡 믹싱이 끝났다. 어떻게 공개하느냐에 따라 반응이 크게 달라질 수 있다.',
    conditions: { memberFlags: ['coverReady'] },
    weight: 4,
    urgent: true,
    choices: [
      {
        text: '프리미어 공개로 팬들과 함께 감상한다',
        check: { stat: 'Bs', difficulty: 70, traitBonus: { host: 5, chatter: 5 } },
        effects: { hp: -4, memberFlags: { coverReady: false } },
        outcomes: {
          great: { fans: 320, fame: 3 },
          success: { fans: 200, fame: 2 },
          fail: { fans: 90, fame: 1 },
        },
      },
      {
        text: '조용히 업로드만 한다',
        effects: { fans: 110, fame: 1, memberFlags: { coverReady: false } },
      },
    ],
  },
  {
    id: 'event_204',
    title: '컨디션 난조',
    description:
      '{member}의 목소리가 평소보다 가라앉아 있다. 본인은 괜찮다고 하지만, 누가 봐도 지쳐 보인다.',
    conditions: { maxHp: HP_RULES.exhausted },
    weight: 4,
    urgent: true,
    choices: [
      {
        text: '하루 푹 쉬게 한다',
        effects: { hp: 20, fans: -30 },
      },
      {
        text: '짧게 인사 방송만 한다',
        effects: { hp: 8, fans: 10 },
      },
      {
        text: '괜찮다는 말을 믿고 평소대로 방송한다',
        check: { stat: 'Bs', difficulty: 75 },
        effects: { hp: -8 },
        outcomes: {
          great: { fans: 120, fame: 1 },
          success: { fans: 60 },
          fail: { fans: -40, fame: -1 },
        },
      },
    ],
  },
  {
    id: 'event_205',
    title: '시청자 참여 콘텐츠',
    description:
      '{member}의 방송에서 시청자 참여 콘텐츠를 해 보자는 의견이 모였다. 준비는 번거롭지만 채팅 참여가 확 늘어날 기회다.',
    // 시청자와 함께하는 방송 날에만 (녹음 / 휴방 제외), 토크 일정에서 우선 등장
    conditions: { activityCategories: ['broadcast'], cooldown: 2 },
    activityWeights: { talk: 2 },
    weight: 1,
    traitWeights: { host: 2, chatter: 2 },
    choices: [
      {
        text: '제대로 준비해서 크게 연다',
        check: { stat: 'Bs', difficulty: 78, traitBonus: { host: 10, chatter: 5, roleplay: 5 } },
        effects: { money: -50000, hp: -6 },
        outcomes: {
          great: { fans: 220, fame: 2 },
          success: { fans: 130, fame: 1 },
          fail: { fans: 30 },
        },
      },
      {
        text: '가벼운 투표 정도로만 진행한다',
        effects: { fans: 50, hp: -2 },
      },
    ],
  },

  /* ---------- 콜라보 이벤트: 주인공 + 플레이어가 고른 파트너 1~2명 ---------- */
  // 콜라보는 주인공의 오늘 일정 카테고리에 어울리는 것만 등장한다.
  // 선택지도 conditions 로 그날 일정에 맞는 것만 보여준다.

  {
    // 방송 날의 범용 합방. 선택지 목록이 그날 일정에 따라 달라진다.
    id: 'collab_001',
    title: '합방 제안',
    description:
      '{member}에게 오늘 같이 방송하자는 이야기가 나왔다. 누구와 함께할지, 어떤 방송으로 꾸릴지 정해야 한다.',
    collab: { min: 2, max: 3 },
    conditions: { activityCategories: ['broadcast'] },
    weight: 1,
    choices: [
      {
        // 어느 방송 날에나 어울리는 기본 선택지 (조건에 맞는 선택지가 없을 때의 대체 선택지)
        text: '토크 중심 합방으로 수다를 푼다',
        conditions: { activityCategories: ['broadcast'] },
        fallback: true,
        check: { stat: 'Bs', difficulty: 75, traitBonus: { chatter: 10, host: 10, roleplay: 5 } },
        effects: { hp: -5, relationship: 4 },
        outcomes: {
          great: { fans: 240, fame: 2, relationship: 4 },
          success: { fans: 140, fame: 1 },
          fail: { fans: 40 },
        },
      },
      {
        text: 'FPS 스쿼드를 짜서 같이 달린다',
        conditions: { activityCategories: ['fps'] },
        check: { stat: 'Ga', difficulty: 78, traitBonus: { fps: 15, competitive: 5 } },
        effects: { hp: -7, relationship: 3 },
        outcomes: {
          great: { fans: 280, fame: 2, relationship: 3 },
          success: { fans: 160, fame: 1 },
          fail: { fans: 50, relationship: -2 },
        },
      },
      {
        text: '격투게임 대전으로 맞붙는다',
        conditions: { activityCategories: ['fighting'] },
        check: { stat: 'Ga', difficulty: 78, traitBonus: { fighting: 15, competitive: 5, brain: 5 } },
        effects: { hp: -6, relationship: 3 },
        outcomes: {
          great: { fans: 270, fame: 2, relationship: 3 },
          success: { fans: 150, fame: 1 },
          fail: { fans: 50, relationship: -2 },
        },
      },
      {
        // FPS / 격투 날에는 위의 전용 선택지가 대신 나온다.
        text: '다 같이 게임 한 판 붙는다',
        conditions: { activityCategories: ['game'], blockedActivityCategories: ['fps', 'fighting'] },
        check: { stat: 'Ga', difficulty: 75, traitBonus: { fps: 10, competitive: 5, fighting: 5 } },
        effects: { hp: -7, relationship: 3 },
        outcomes: {
          great: { fans: 260, fame: 2, relationship: 3 },
          success: { fans: 150, fame: 1 },
          fail: { fans: 50, relationship: -2 },
        },
      },
      {
        text: '노래 릴레이 방송을 연다',
        conditions: { activityCategories: ['music'] },
        check: { stat: 'Vc', difficulty: 80, traitBonus: { cover: 10, instrument: 10 } },
        effects: { hp: -6, relationship: 3 },
        outcomes: {
          great: { fans: 280, fame: 3, relationship: 3 },
          success: { fans: 160, fame: 1 },
          fail: { fans: 50 },
        },
      },
    ],
  },
  {
    id: 'collab_002',
    title: '공포게임 동반 입장',
    description:
      '{member}가 무서운 신작 공포게임을 켜려다 혼자서는 도저히 못 하겠다며 같이 할 사람을 찾는다.',
    collab: { min: 2, max: 3 },
    timeSlot: 'lateNight',
    conditions: { activityCategories: ['horror'], cooldown: 3 },
    weight: 1,
    choices: [
      {
        text: '불 끄고 끝까지 클리어한다',
        check: { stat: 'Ga', difficulty: 78, traitBonus: { horror: 15, highTension: 5, calm: 5 } },
        effects: { hp: -8, relationship: 5 },
        outcomes: {
          great: { fans: 280, fame: 2, relationship: 3 },
          success: { fans: 170, fame: 1 },
          fail: { fans: 60, relationship: -2 },
        },
      },
      {
        text: '리액션 위주로 초반만 즐긴다',
        check: { stat: 'Bs', difficulty: 70, traitBonus: { roleplay: 10, highTension: 10 } },
        effects: { hp: -4, relationship: 3 },
        outcomes: {
          great: { fans: 200, fame: 1 },
          success: { fans: 120 },
          fail: { fans: 40 },
        },
      },
    ],
  },
  {
    id: 'collab_003',
    title: '듀엣 제안',
    description:
      '{member}가 노래 작업을 하던 중, 이 곡은 혼자보다 여럿이 부르면 더 좋겠다는 생각이 들었다. 누구와 함께 부를지 정해야 한다.',
    collab: { min: 2, max: 3 },
    conditions: { activityCategories: ['music'], cooldown: 2 },
    weight: 1,
    choices: [
      {
        text: '정식 듀엣 커버로 함께 녹음한다',
        check: { stat: 'Vc', difficulty: 82, traitBonus: { cover: 10, perfectionist: 5, instrument: 5 } },
        effects: { money: -100000, hp: -7, relationship: 4 },
        outcomes: {
          great: { fans: 300, fame: 3, stats: { Vc: 2 }, relationship: 3 },
          success: { fans: 180, fame: 2, stats: { Vc: 1 } },
          fail: { fans: 60, stats: { Vc: 1 } },
        },
      },
      {
        text: '화음과 코러스만 가볍게 맞춰 본다',
        check: { stat: 'Vc', difficulty: 72, traitBonus: { cover: 5, instrument: 10 } },
        effects: { hp: -4, relationship: 3 },
        outcomes: {
          great: { fans: 170, fame: 1, stats: { Vc: 1 } },
          success: { fans: 100, stats: { Vc: 1 } },
          fail: { fans: 30 },
        },
      },
      {
        text: '연습 과정을 노래 방송으로 공개한다',
        check: { stat: 'Bs', difficulty: 75, traitBonus: { chatter: 5, host: 10, highTension: 5 } },
        effects: { hp: -5, relationship: 3 },
        outcomes: {
          great: { fans: 220, fame: 2 },
          success: { fans: 130, fame: 1 },
          fail: { fans: 40 },
        },
      },
    ],
  },
];

// 확장 이벤트 (멤버 개인 / 공통 / 콜라보 / 체인 / 주간 / 경제 이벤트)는 events-content.js 에 있다.
EVENTS.push(...EXTRA_EVENTS);

export function getEventById(id) {
  return EVENTS.find((event) => event.id === id) || null;
}

/* ===================== 조건 판정 ===================== */

function hasTrait(member, trait) {
  return (member.traits || []).includes(trait);
}

function hasActivityCategory(activity, category) {
  return Boolean(activity) && (activity.categories || []).includes(category);
}

// 조건 판정 맵: ctx = { state, member, activity, event }
// 나중에 조건을 늘릴 때는 이 맵에 항목 하나만 추가하면 된다.
export const CONDITION_CHECKS = {
  day: ({ state }, value) => state.currentDay === value,
  minFans: ({ state }, value) => state.fans >= value,
  minFame: ({ state }, value) => state.fame >= value,
  maxHp: ({ member }, value) => member.hp <= value,
  requiredFlags: ({ state }, flags) => flags.every((flag) => Boolean(state.flags[flag])),
  blockedFlags: ({ state }, flags) => flags.every((flag) => !state.flags[flag]),

  // 오늘 배정된 일정이 목록 중 하나일 때 (특정 일정 전용 이벤트)
  activity: ({ activity }, ids) => Boolean(activity) && ids.includes(activity.id),
  // 오늘 일정의 카테고리가 목록 중 하나라도 있을 때 / 하나도 없을 때
  activityCategories: ({ activity }, categories) =>
    categories.some((category) => hasActivityCategory(activity, category)),
  blockedActivityCategories: ({ activity }, categories) =>
    categories.every((category) => !hasActivityCategory(activity, category)),
  // 멤버 태그
  requiredTraits: ({ member }, traits) => traits.every((trait) => hasTrait(member, trait)),
  anyTraits: ({ member }, traits) => traits.some((trait) => hasTrait(member, trait)),
  blockedTraits: ({ member }, traits) => traits.every((trait) => !hasTrait(member, trait)),
  // 멤버별 플래그 (선택 결과가 그 멤버의 이후 이벤트에 영향을 준다)
  memberFlags: ({ member }, flags) => flags.every((flag) => Boolean(member.flags[flag])),
  blockedMemberFlags: ({ member }, flags) => flags.every((flag) => !member.flags[flag]),
  // 마지막 발생 후 N일이 지나야 다시 등장
  cooldown: ({ state, event }, days) => {
    const lastDay = state.eventHistory[event.id];
    return lastDay === undefined || state.currentDay - lastDay >= days;
  },

  // 이전 이벤트가 발생한 뒤에만: 'eventId' 또는 { id, minDays } (발생 후 minDays 일 이상 지난 뒤)
  afterEventId: ({ state }, value) => {
    const { id, minDays = 1 } = typeof value === 'string' ? { id: value } : value;
    const lastDay = state.eventHistory[id];
    return lastDay !== undefined && state.currentDay - lastDay >= minDays;
  },
  // 날짜: 이 날 이후 / 이전, 주의 몇 번째 날 (1~7, 배열 가능)
  minDay: ({ state }, value) => state.currentDay >= value,
  maxDay: ({ state }, value) => state.currentDay <= value,
  dayOfWeek: ({ state }, value) => {
    const today = ((state.currentDay - 1) % WEEK_LENGTH) + 1;
    return Array.isArray(value) ? value.includes(today) : today === value;
  },
  // 이 멤버와 관계도가 value 이상인 다른 멤버가 한 명이라도 있을 때
  minRelationship: ({ state, member }, value) =>
    Object.entries(state.relationships).some(
      ([key, rel]) => rel >= value && key.split('|').includes(member.id),
    ),
  // 멤버 스탯: { Vc: 85 } — 모두 만족해야 한다
  minStat: ({ member }, stats) => Object.entries(stats).every(([key, value]) => member.stats[key] >= value),
  // 돈
  minMoney: ({ state }, value) => state.money >= value,
  maxMoney: ({ state }, value) => state.money <= value,
  // 명성 상한 (초반 전용 이벤트 등)
  maxFame: ({ state }, value) => state.fame <= value,
  // 장기 투자 상태: { id, status: 'active' | 'success' | 'fail' | 'none' }
  investmentStatus: ({ state }, { id, status }) => {
    const active = state.investments.active.some((item) => item.id === id);
    const done = state.investments.history.filter((item) => item.id === id);
    if (status === 'active') return active;
    if (status === 'none') return !active && done.length === 0;
    return done.some((item) => item.outcome === status);
  },
  // 주식을 한 종목이라도 보유 중일 때 (true) / 특정 종목 보유 중일 때 ('TICKER')
  holdsStock: ({ state }, value) => {
    const holdings = state.market.holdings;
    return value === true ? Object.keys(holdings).length > 0 : (holdings[value]?.shares || 0) > 0;
  },
  // 상점 레벨: { itemId: level } — 모두 만족해야 한다
  minShopLevel: ({ state }, levels) =>
    Object.entries(levels).every(([id, level]) => (state.shop.levels[id] || 0) >= level),
};

// 이벤트와 선택지가 같은 조건 맵을 쓴다. ctx.event 는 cooldown 등에서 쓰는 소속 이벤트.
function meetsConditions(conditions, ctx) {
  return Object.entries(conditions || {}).every(([key, value]) => {
    const check = CONDITION_CHECKS[key];
    // 맵에 등록되지 않은 조건 키는 통과(무시)시킨다.
    if (!check) return true;
    return check(ctx, value);
  });
}

/* ===================== 후보 선정 ===================== */

// 가중치:
//  - traitWeights: 멤버가 가진 태그마다 배수를 곱한다.
//  - activityWeights: 오늘 일정이 가진 카테고리마다 배수를 곱한다. (우선 등장)
// weight 가 0 이면 후보에서 빠진다.
function getEventWeight(event, member, activity = null) {
  let weight = event.weight ?? 1;
  Object.entries(event.traitWeights || {}).forEach(([trait, multiplier]) => {
    if (hasTrait(member, trait)) weight *= multiplier;
  });
  Object.entries(event.activityWeights || {}).forEach(([category, multiplier]) => {
    if (hasActivityCategory(activity, category)) weight *= multiplier;
  });
  return weight;
}

// 후보 수집:
//  - memberId 가 있으면 그 멤버일 때만 후보가 된다.
//  - collab 이벤트는 콜라보 자리에서만, 일반 이벤트는 중요 이벤트 자리에서만 후보가 된다.
//  - conditions 를 통과해야 후보에 포함된다.
export function collectCandidates(member, state, { activity = null, collab = false } = {}) {
  return EVENTS.filter((event) => {
    if (event.memberId && event.memberId !== member.id) return false;
    if (Boolean(event.collab) !== collab) return false;
    // once: 게임 전체에서 한 번만 등장
    if (event.once && state.eventHistory[event.id] !== undefined) return false;
    if (getEventWeight(event, member, activity) <= 0) return false;
    return meetsConditions(event.conditions, { state, member, activity, event });
  });
}

// weight 기반 가중 랜덤 1개 선택
function pickWeighted(items, getWeight) {
  const total = items.reduce((sum, item) => sum + getWeight(item), 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= getWeight(item);
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

// 후보가 없으면 null 을 돌려준다.
export function pickEventForMember(member, state, options = {}) {
  const candidates = collectCandidates(member, state, options);
  if (candidates.length === 0) return null;
  return pickWeighted(candidates, (event) => getEventWeight(event, member, options.activity));
}

/* ===================== 선택지 필터 ===================== */

// 이벤트 주인공의 오늘 일정에 맞는 선택지만 돌려준다. ({ choice, index } — index 는 원래 순서)
// 맞는 선택지가 하나도 없으면 fallback 선택지를, 그것도 없으면 전체를 돌려준다.
// → 어떤 경우에도 최소 1개의 선택지가 남는다.
export function getAvailableChoices(event, state, memberId) {
  const member = state.members.find((item) => item.id === memberId) || null;
  const entry = state.schedule.find((item) => item.memberId === memberId);
  const activity = entry ? getActivityById(entry.activityId) : null;
  const ctx = { state, member, activity, event };

  const indexed = event.choices.map((choice, index) => ({ choice, index }));
  const valid = indexed.filter(({ choice }) => meetsConditions(choice.conditions, ctx));
  if (valid.length > 0) return valid;

  const fallback = indexed.filter(({ choice }) => choice.fallback);
  return fallback.length > 0 ? fallback : indexed;
}

/* ===================== 하루 일정 계획 ===================== */

// 하루 계획 규칙 (임시 수치)
//  - baseEventChance: 일반 일정이 중요 이벤트로 바뀔 기본 확률
//  - memberEventBonus: 멤버 전용 이벤트 후보가 있을 때 추가 확률
//  - urgentEventBonus: urgent 이벤트(후속 / 컨디션 난조 등)가 후보일 때 추가 확률
//  - minImportant / maxImportant: 하루 중요 이벤트 수 (콜라보 제외)
//  - collabChance: 하루에 콜라보 제안이 생길 확률
export const DAY_RULES = {
  baseEventChance: 0.15,
  memberEventBonus: 0.15,
  urgentEventBonus: 0.5,
  minImportant: 1,
  maxImportant: 3,
  collabChance: 0.6,
  traitActivityWeight: 3,
  restActivityWeight: 0.3,
};

// 멤버 태그와 겹치는 일정일수록 잘 배정된다. 탈진 상태면 휴방이 배정된다.
function pickActivity(member) {
  const rest = getActivityById('rest');
  if (member.hp <= HP_RULES.exhausted) return rest;

  return pickWeighted(ACTIVITIES, (activity) => {
    if (activity.rest) return DAY_RULES.restActivityWeight;
    const matches = activity.traits.filter((trait) => hasTrait(member, trait)).length;
    return 1 + matches * DAY_RULES.traitActivityWeight;
  });
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 오늘의 일정을 만든다: 11명 모두 일정 1개 + 일부는 중요 이벤트 / 콜라보로 승격.
export function planDay(state) {
  const schedule = state.members.map((member) => ({
    memberId: member.id,
    activityId: pickActivity(member).id,
    kind: ENTRY_KIND.ROUTINE,
    eventId: null,
    done: false,
  }));

  const memberOf = (entry) => state.members.find((item) => item.id === entry.memberId);
  const promote = (entry, event) => {
    entry.kind = ENTRY_KIND.IMPORTANT;
    entry.eventId = event.id;
  };

  // 0) 반드시 등장하는 이벤트(forced: 주간 이벤트 / 체인 진행): 조건에 맞는 멤버 한 명에게 배정한다.
  let forcedCount = 0;
  EVENTS.filter((event) => event.forced && !event.collab).forEach((event) => {
    const entry = shuffle(schedule.filter((item) => item.kind === ENTRY_KIND.ROUTINE)).find((item) =>
      collectCandidates(memberOf(item), state, { activity: getActivityById(item.activityId) }).includes(event),
    );
    if (entry) {
      promote(entry, event);
      forcedCount += 1;
    }
  });

  // 1) 중요 이벤트 후보: 멤버마다 이벤트 후보를 하나 뽑아 두고, 확률에 따라 승격한다.
  //    같은 날 같은 이벤트는 한 번만 등장한다.
  const options = schedule
    .filter((entry) => entry.kind === ENTRY_KIND.ROUTINE)
    .map((entry) => {
      const activity = getActivityById(entry.activityId);
      const event = pickEventForMember(memberOf(entry), state, { activity });
      if (!event || event.forced) return null;
      const chance =
        DAY_RULES.baseEventChance +
        (activity.eventChance || 0) +
        (event.memberId ? DAY_RULES.memberEventBonus : 0) +
        (event.urgent ? DAY_RULES.urgentEventBonus : 0);
      return { entry, event, chance };
    })
    .filter(Boolean);

  const uniqueOptions = (list) =>
    list.filter((option, index) => list.findIndex((item) => item.event.id === option.event.id) === index);

  const slots = Math.max(0, DAY_RULES.maxImportant - forcedCount);
  let promoted = uniqueOptions(shuffle(options.filter((option) => Math.random() < option.chance))).slice(0, slots);
  if (forcedCount + promoted.length < DAY_RULES.minImportant && options.length > 0) {
    promoted = uniqueOptions(shuffle(options)).slice(0, DAY_RULES.minImportant - forcedCount);
  }
  promoted.forEach(({ entry, event }) => promote(entry, event));

  // 2) 콜라보 제안: 남은 일반 일정 멤버 중 한 명을 주인공으로 정한다.
  //    파트너는 자동으로 정하지 않고, 이벤트 화면에서 플레이어가 고른다.
  if (Math.random() < DAY_RULES.collabChance) {
    const hosts = shuffle(schedule.filter((entry) => entry.kind === ENTRY_KIND.ROUTINE));
    for (const entry of hosts) {
      const member = state.members.find((item) => item.id === entry.memberId);
      // 주인공의 오늘 일정에 어울리는 콜라보만 후보가 된다. (휴방이면 후보 없음)
      const activity = getActivityById(entry.activityId);
      const event = pickEventForMember(member, state, { activity, collab: true });
      if (event) {
        entry.kind = ENTRY_KIND.COLLAB;
        entry.eventId = event.id;
        break;
      }
    }
  }

  return schedule;
}
