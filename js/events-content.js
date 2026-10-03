// events-content.js — 확장 이벤트 데이터 (events.js 의 EVENTS 에 합쳐진다)
// 형식은 events.js 상단 주석과 같다. 다른 모듈을 import 하지 않는다.
// 멤버 개인 이벤트는 공개된 방송 스타일만 소재로 하며, 사생활·비공개 정보는 다루지 않는다.
//
// 이벤트 추가 필드
//  - once: 게임 전체에서 한 번만 등장
//  - forced: 조건이 맞으면 그날 반드시 등장 (주간 이벤트 / 체인 진행)
//  - stockEffect: 어떤 선택지를 골라도 적용되는 주가 영향 ({ ticker, percentage } | { ticker, fixedChange } | 배열)
// 효과 추가 키: team(전 멤버), stockEffect(주가), startInvestment(장기 투자 시작)

const BROADCAST = { activityCategories: ['broadcast'] };

export const EXTRA_EVENTS = [
  /* ===================== 주간 / 특수 이벤트 ===================== */

  {
    id: 'ev_w01',
    title: '첫 주 방향 회의',
    description: '매니저로서 맞는 첫날. {member}가 대표로 이번 달 방송 방향에 대한 의견을 모아 왔다. 어디에 힘을 줄지 정해야 한다.',
    conditions: { day: 1 },
    forced: true,
    once: true,
    choices: [
      { text: '방송 진행력부터 다진다', effects: { team: { stats: { Bs: 1 } }, fans: 50 } },
      { text: '게임 콘텐츠를 강화한다', effects: { team: { stats: { Ga: 1 } }, fans: 50 } },
      { text: '노래 콘텐츠에 집중한다', effects: { team: { stats: { Vc: 1 } }, fans: 50 } },
    ],
  },
  {
    id: 'ev_w02',
    title: '주간 정리 회의',
    description: '한 주를 마무리하는 회의 시간. {member}가 멤버들의 컨디션과 다음 주 계획을 정리해 왔다.',
    conditions: { dayOfWeek: 7, maxDay: 21 },
    forced: true,
    choices: [
      { text: '다 같이 하루 푹 쉬는 날을 만든다', effects: { team: { hp: 10 }, fans: -60 } },
      { text: '다음 주 목표를 세우고 연습 시간을 늘린다', effects: { money: -60000, team: { stats: { Bs: 1, Ga: 1, Vc: 1 }, hp: -4 } } },
      { text: '팬 감사 공지와 주간 하이라이트를 올린다', effects: { fans: 180, fame: 1, team: { hp: -2 } } },
    ],
  },
  {
    id: 'ev_w03',
    title: '중간 결산 인터뷰',
    description: '방송 전문 매체에서 한 달 활동의 절반을 돌아보는 인터뷰 요청이 왔다. {member}가 대표로 나서기로 했다.',
    conditions: { day: 14 },
    forced: true,
    once: true,
    choices: [
      {
        text: '성과와 앞으로의 계획을 자신 있게 말한다',
        check: { stat: 'Bs', difficulty: 76, traitBonus: { host: 10, chatter: 5 } },
        effects: { hp: -3 },
        outcomes: { great: { fans: 400, fame: 5 }, success: { fans: 220, fame: 3 }, fail: { fans: 60, fame: 1 } },
      },
      { text: '담백하게 멤버들 이야기를 전한다', effects: { fans: 150, fame: 2 } },
    ],
  },
  {
    id: 'ev_w04',
    title: '마지막 날 특별 방송',
    description: '28일간의 여정 마지막 날. {member}가 오늘은 모두 함께 특별 방송을 하자고 제안했다.',
    conditions: { day: 28 },
    forced: true,
    once: true,
    stockEffect: { ticker: 'NOVA', percentage: 3 },
    choices: [
      {
        text: '전원이 참여하는 대형 합동 방송을 연다',
        check: { stat: 'Bs', difficulty: 78, traitBonus: { host: 10, highTension: 5 } },
        effects: { team: { hp: -8 }, money: -100000 },
        outcomes: { great: { fans: 1000, fame: 8 }, success: { fans: 650, fame: 5 }, fail: { fans: 250, fame: 2 } },
      },
      { text: '한 달을 돌아보는 감사 방송을 한다', effects: { fans: 350, fame: 3 } },
    ],
  },

  /* ===================== 공통 이벤트 ===================== */

  {
    id: 'ev_c01',
    title: '방송 중 장비 트러블',
    // 스토리 변형(group: equip_trouble)으로 전환됨. 정의는 저장 호환 / 테스트용으로 남기고 등장만 막는다.
    weight: 0,
    description: '{member}의 방송 도중 마이크 소리가 끊기기 시작했다. 채팅창에 물음표가 쏟아진다.',
    conditions: { ...BROADCAST, cooldown: 4 },
    choices: [
      {
        text: '바로 새 장비를 주문하고 양해를 구한다',
        story: '{member}가 방송을 잠시 멈추고 상황을 솔직하게 설명했다. 새 마이크 주문 화면을 그대로 보여 주자 채팅창이 "빠른 처리 좋다"는 반응으로 바뀌었다.',
        effects: { money: -80000, fans: 30 },
      },
      {
        text: '임기응변으로 방송을 이어간다',
        story: '{member}는 끊기는 소리를 아예 콘텐츠로 삼기로 했다. 채팅으로 "들리면 1, 안 들리면 2"를 받으며 방송을 이어 간다.',
        check: { stat: 'Bs', difficulty: 72, traitBonus: { host: 10, calm: 10 } },
        effects: { hp: -3 },
        outcomes: { great: { fans: 150, fame: 1 }, success: { fans: 60 }, fail: { fans: -50 } },
        outcomeStories: {
          great: '끊기는 순간마다 받아친 한마디가 전부 웃음 포인트가 됐다. "장비 트러블이 오늘의 콘텐츠"라는 클립이 따로 올라왔다.',
          success: '몇 번 말이 끊겼지만 시청자들이 채팅으로 빈칸을 채워 주며 방송이 무사히 끝났다.',
          fail: '소리가 점점 더 자주 끊겼다. 결국 채팅창에는 "다음에 다시 봐요"라는 인사만 남았다.',
        },
      },
      {
        text: '오늘은 짧게 마무리한다',
        story: '{member}가 짧게 사과하고 방송을 일찍 끝냈다. 아쉬워하는 시청자도 있었지만 덕분에 오랜만에 푹 쉬었다.',
        effects: { fans: -20, hp: 5 },
      },
    ],
  },
  {
    id: 'ev_c02',
    title: '팬아트 모음 방송 제안',
    // 스토리 변형(group: fanart_stream)으로 전환됨. 정의는 저장 호환 / 테스트용으로 남기고 등장만 막는다.
    weight: 0,
    description: '{member}에게 그동안 쌓인 팬아트를 모아 감상하자는 요청이 쏟아졌다.',
    conditions: { activityCategories: ['talk'], cooldown: 5 },
    choices: [
      {
        text: '팬아트 감상 방송을 크게 연다',
        check: { stat: 'Bs', difficulty: 70, traitBonus: { chatter: 10, highTension: 5 } },
        effects: { hp: -3 },
        outcomes: { great: { fans: 260, fame: 2 }, success: { fans: 150, fame: 1 }, fail: { fans: 60 } },
      },
      { text: '팬아트 공모전을 열고 상품을 준비한다', effects: { money: -120000, fans: 280, fame: 2, stockEffect: { ticker: 'CLIP', percentage: 2 } } },
    ],
  },
  {
    id: 'ev_c03',
    title: '광고 협찬 제안',
    description: '{member}의 방송에 광고를 넣고 싶다는 제안이 들어왔다. 조건은 나쁘지 않지만 시청자 반응이 걱정된다.',
    conditions: { ...BROADCAST, minFame: 15, cooldown: 6 },
    choices: [
      { text: '그대로 수락한다', effects: { money: 220000, fans: -40, stockEffect: { ticker: 'STRM', percentage: 2 } } },
      {
        text: '방송 흐름에 맞게 조건을 협상한다',
        check: { stat: 'Bs', difficulty: 80, traitBonus: { host: 10, brain: 10 } },
        effects: {},
        outcomes: { great: { money: 320000, fans: 40 }, success: { money: 240000 }, fail: { money: 90000, fans: -30 } },
      },
      { text: '이번엔 정중히 거절한다', effects: { fame: 1 } },
    ],
  },
  {
    id: 'ev_c04',
    title: '클립 역주행',
    description: '몇 주 전 {member}의 방송 클립이 갑자기 숏폼 플랫폼에서 역주행하기 시작했다.',
    conditions: { ...BROADCAST, minDay: 3, cooldown: 7 },
    weight: 0,
    stockEffect: { ticker: 'CLIP', percentage: 4 },
    choices: [
      { text: '역주행 기념 방송을 연다', effects: { fans: 240, fame: 1, hp: -5 } },
      { text: '관련 클립을 정리해 올린다', effects: { fans: 150 } },
    ],
  },
  {
    id: 'ev_c05',
    title: '신작 게임 얼리 액세스 초대',
    description: '게임사에서 {member}에게 출시 전 신작을 먼저 플레이해 달라는 초대를 보냈다.',
    conditions: { activityCategories: ['game'], cooldown: 5 },
    choices: [
      {
        text: '엔딩까지 달리는 풀플레이 방송',
        check: { stat: 'Ga', difficulty: 78, traitBonus: { competitive: 5, brain: 5, indie: 10 } },
        effects: { hp: -8, stockEffect: { ticker: 'PXLG', percentage: 3 } },
        outcomes: { great: { fans: 300, fame: 2, money: 80000 }, success: { fans: 180, money: 50000 }, fail: { fans: 50 } },
      },
      { text: '첫인상만 가볍게 소개한다', effects: { fans: 90, money: 30000, hp: -3 } },
    ],
  },
  {
    id: 'ev_c06',
    title: '신청곡 폭주',
    description: '{member}의 노래 방송에 신청곡이 끝도 없이 올라온다. 목 상태를 생각하면 고민된다.',
    conditions: { activityCategories: ['music'], cooldown: 3 },
    choices: [
      {
        text: '신청곡을 최대한 받아 부른다',
        check: { stat: 'Vc', difficulty: 78, traitBonus: { cover: 10, instrument: 5 } },
        effects: { hp: -8 },
        outcomes: { great: { fans: 260, fame: 2, stats: { Vc: 1 } }, success: { fans: 160, stats: { Vc: 1 } }, fail: { fans: 40 } },
      },
      { text: '대표곡 몇 곡만 정성껏 부른다', effects: { fans: 90, hp: -3 } },
    ],
  },
  {
    id: 'ev_c07',
    title: '굿즈 제작 제안',
    description: '팬들 사이에서 {member}의 굿즈를 원한다는 목소리가 커졌다. 제작 업체에서 견적이 도착했다.',
    conditions: { minDay: 3, minMoney: 150000, blockedFlags: ['goodsMade'], cooldown: 6 },
    choices: [
      { text: '정식 굿즈 라인을 제작한다', conditions: { minMoney: 260000 }, effects: { money: -260000, fans: 200, fame: 2, flags: { goodsMade: true, goodsBig: true } } },
      { text: '소량 한정판만 만든다', effects: { money: -110000, fans: 90, flags: { goodsMade: true } } },
      { text: '아직은 이르다', fallback: true, effects: { fame: 0 } },
    ],
  },
  {
    // ev_c07 → 며칠 뒤 판매 결과 (선택에 따라 결과가 달라진다)
    id: 'ev_c08',
    title: '굿즈 판매 결과',
    description: '제작한 굿즈의 판매 집계가 나왔다. {member}가 결과를 들고 왔다.',
    conditions: { requiredFlags: ['goodsMade'], afterEventId: { id: 'ev_c07', minDays: 4 } },
    forced: true,
    once: true,
    choices: [
      { text: '대량 재판매를 진행한다', conditions: { requiredFlags: ['goodsBig'] }, effects: { money: 520000, fans: 150, stockEffect: { ticker: 'NOVA', percentage: 2 } } },
      { text: '추가 생산해 판매한다', conditions: { blockedFlags: ['goodsBig'] }, effects: { money: 230000, fans: 80 } },
      { text: '수익 일부로 팬 감사 이벤트를 연다', effects: { money: 120000, fans: 320, fame: 2 } },
    ],
  },
  {
    id: 'ev_c09',
    title: '시청자 수 급증',
    description: '{member}의 방송이 추천 목록에 올라 처음 보는 시청자들이 몰려들었다.',
    conditions: { ...BROADCAST, minFans: 4000, cooldown: 5 },
    choices: [
      {
        text: '처음 온 시청자에게 맞춘 소개 방송으로 전환한다',
        check: { stat: 'Bs', difficulty: 75, traitBonus: { host: 10, chatter: 5 } },
        effects: { hp: -4 },
        outcomes: { great: { fans: 450, fame: 3 }, success: { fans: 280, fame: 2 }, fail: { fans: 100 } },
      },
      { text: '평소 분위기를 그대로 유지한다', effects: { fans: 160, fame: 1 } },
    ],
  },
  {
    id: 'ev_c10',
    title: '다른 방송인의 초대',
    description: '외부 방송인이 {member}를 자신의 방송에 게스트로 초대했다.',
    conditions: { ...BROADCAST, minFame: 20, cooldown: 6 },
    choices: [
      {
        text: '게스트로 출연해 존재감을 보여준다',
        check: { stat: 'Bs', difficulty: 80, traitBonus: { highTension: 10, host: 5 }, },
        effects: { hp: -5 },
        outcomes: { great: { fans: 380, fame: 4 }, success: { fans: 220, fame: 2 }, fail: { fans: 70, fame: -1 } },
      },
      { text: '일정이 맞지 않아 다음 기회로 미룬다', effects: {} , fallback: true },
    ],
  },

  /* ===================== 스탯 / HP 이벤트 ===================== */

  {
    id: 'ev_s01',
    title: '보컬 트레이닝 제안',
    // 스토리 변형(group: growth_vocal)으로 전환됨. 정의는 저장 호환 / 테스트용으로 남기고 등장만 막는다.
    weight: 0,
    description: '보컬 트레이너가 {member}에게 단기 레슨을 제안했다.',
    conditions: { activityCategories: ['music'], cooldown: 6 },
    choices: [
      { text: '정식 레슨을 받는다', conditions: { minMoney: 70000 }, effects: { money: -70000, stats: { Vc: 3 }, hp: -3 } },
      {
        text: '영상 자료로 독학한다',
        check: { stat: 'Vc', difficulty: 75, traitBonus: { diligent: 10, perfectionist: 5 } },
        effects: { hp: -2 },
        outcomes: { great: { stats: { Vc: 2 } }, success: { stats: { Vc: 1 } }, fail: {} },
      },
    ],
  },
  {
    id: 'ev_s02',
    title: '에임 연습 루틴',
    // 스토리 변형(group: growth_aim)으로 전환됨. 정의는 저장 호환 / 테스트용으로 남기고 등장만 막는다.
    weight: 0,
    description: '{member}가 요즘 에임이 흔들린다며 연습 루틴을 새로 짜 보고 싶다고 한다.',
    conditions: { activityCategories: ['fps'], cooldown: 5 },
    choices: [
      { text: '매일 연습 시간을 따로 잡는다', effects: { stats: { Ga: 2 }, hp: -6 } },
      { text: '방송에서 연습 과정을 공개한다', effects: { stats: { Ga: 1 }, fans: 90, hp: -4 } },
    ],
  },
  {
    id: 'ev_s03',
    title: '토크 워크숍',
    // 스토리 변형(group: growth_talk)으로 전환됨. 정의는 저장 호환 / 테스트용으로 남기고 등장만 막는다.
    weight: 0,
    description: '방송 진행 워크숍에 {member}를 보내 보자는 의견이 나왔다.',
    conditions: { activityCategories: ['talk'], cooldown: 6 },
    choices: [
      { text: '워크숍에 참가한다', conditions: { minMoney: 50000 }, effects: { money: -50000, stats: { Bs: 3 }, hp: -2 } },
      { text: '선배 방송을 보며 스스로 연구한다', effects: { stats: { Bs: 1 } } },
    ],
  },
  {
    id: 'ev_h01',
    title: '과로 경보',
    // 스토리 변형(group: overwork_alert)으로 전환됨. 정의는 저장 호환 / 테스트용으로 남기고 등장만 막는다.
    weight: 0,
    description: '{member}의 방송 시간이 계속 늘고 있다. 본인은 즐겁다지만 피로가 눈에 띈다.',
    conditions: { maxHp: 45, cooldown: 3 },
    urgent: true,
    choices: [
      { text: '반강제로 이틀 치 휴식을 준다', effects: { hp: 18, fans: -40 } },
      { text: '방송 시간을 절반으로 줄인다', effects: { hp: 8, fans: 20 } },
      { text: '본인 의지를 존중한다', effects: { hp: -5, fans: 80 } },
    ],
  },

  /* ===================== 투자 / 주식 이벤트 ===================== */

  {
    id: 'ev_i01',
    title: '투자사 미팅',
    description: '콘텐츠 투자사에서 공동 투자를 제안했다. 조건이 좋은 대신 결정은 오늘 해야 한다.',
    conditions: { minDay: 3, maxDay: 20, minMoney: 200000, cooldown: 7 },
    choices: [
      { text: '게임 콘텐츠 공동 투자 (비용 20% 할인)', conditions: { investmentStatus: { id: 'gameContent', status: 'none' }, minMoney: 200000 }, effects: { startInvestment: { id: 'gameContent', costMultiplier: 0.8 } } },
      { text: '음악 제작 공동 투자 (비용 20% 할인)', conditions: { investmentStatus: { id: 'musicProduction', status: 'none' }, minMoney: 256000 }, effects: { startInvestment: { id: 'musicProduction', costMultiplier: 0.8 } } },
      { text: '지금은 제안만 들어 둔다', fallback: true, effects: { fame: 1 } },
    ],
  },
  {
    // 음악 제작 투자 성공 → 발매 쇼케이스
    id: 'ev_i02',
    title: '신곡 발매 쇼케이스',
    description: '음악 제작 투자로 만든 신곡이 완성됐다. {member}가 쇼케이스 무대를 맡게 됐다.',
    conditions: { requiredFlags: ['musicReleaseReady'], blockedActivityCategories: ['rest'] },
    forced: true,
    once: true,
    choices: [
      {
        text: '라이브 쇼케이스로 공개한다',
        check: { stat: 'Vc', difficulty: 78, traitBonus: { cover: 5, instrument: 5, perfectionist: 5 } },
        effects: { hp: -6 },
        outcomes: {
          great: { fans: 700, fame: 6, stockEffect: { ticker: 'TUNE', percentage: 6 } },
          success: { fans: 450, fame: 4, stockEffect: { ticker: 'TUNE', percentage: 3 } },
          fail: { fans: 150, fame: 1, stockEffect: { ticker: 'TUNE', percentage: -2 } },
        },
      },
      { text: '뮤직비디오만 먼저 공개한다', effects: { fans: 300, fame: 2 } },
    ],
  },
  {
    id: 'ev_i03',
    title: '대형 프로젝트 후속 제안',
    description: '대형 프로젝트가 성공하자 여러 곳에서 후속 협업 제안이 몰려들었다. {member}가 대표로 회의에 들어간다.',
    conditions: { requiredFlags: ['bigProjectHit'] },
    forced: true,
    once: true,
    choices: [
      { text: '수익성 높은 협업을 고른다', effects: { money: 400000, fame: 2, stockEffect: { ticker: 'NOVA', percentage: 3 } } },
      { text: '팬 참여형 후속 기획을 고른다', effects: { fans: 800, fame: 4 } },
    ],
  },
  {
    id: 'ev_i04',
    title: '프로젝트 수습 회의',
    description: '대형 프로젝트가 기대에 못 미쳤다. {member}가 팬들에게 어떻게 설명할지 고민하고 있다.',
    conditions: { requiredFlags: ['bigProjectFlop'] },
    forced: true,
    once: true,
    choices: [
      {
        text: '솔직하게 설명하는 방송을 한다',
        check: { stat: 'Bs', difficulty: 74, traitBonus: { calm: 10, host: 5, diligent: 5 } },
        effects: { hp: -4 },
        outcomes: { great: { fans: 300, fame: 3 }, success: { fans: 150, fame: 2 }, fail: { fame: -1 } },
      },
      { text: '남은 결과물을 무료로 공개한다', effects: { fans: 250, money: -50000 } },
    ],
  },
  {
    id: 'ev_m01',
    title: '게임 업계 호재 뉴스',
    description: '대형 게임 행사 소식에 업계가 들썩인다. {member}의 게임 방송에도 관련 질문이 쏟아진다.',
    conditions: { activityCategories: ['game'], minDay: 2, cooldown: 7 },
    weight: 0,
    stockEffect: { ticker: 'PXLG', percentage: 6 },
    choices: [
      { text: '행사 소식을 정리해 방송에서 소개한다', effects: { fans: 120, hp: -2 } },
      { text: '평소처럼 게임에 집중한다', effects: { fans: 50 } },
    ],
  },
  {
    id: 'ev_m02',
    title: '음원 플랫폼 정산 정책 변경',
    description: '음원 플랫폼이 정산 정책을 바꾼다는 발표에 업계 분위기가 어수선하다. {member}도 커버곡 일정을 고민한다.',
    conditions: { activityCategories: ['music'], minDay: 4, cooldown: 8 },
    weight: 0,
    stockEffect: [{ ticker: 'TUNE', percentage: -6 }, { ticker: 'CLIP', percentage: 2 }],
    choices: [
      { text: '커버곡을 숏폼용으로 편집해 올린다', effects: { fans: 140 } },
      { text: '일정대로 정식 음원 작업을 계속한다', effects: { stats: { Vc: 1 }, hp: -3 } },
    ],
  },
  {
    id: 'ev_m03',
    title: '장비 회사 신제품 리뷰 요청',
    description: '장비 회사에서 새 마이크와 컨트롤러 리뷰를 {member}에게 요청했다.',
    conditions: { ...BROADCAST, minDay: 3, cooldown: 7 },
    weight: 0,
    stockEffect: { fixedChange: 800, ticker: 'GEAR' },
    choices: [
      { text: '꼼꼼한 리뷰 방송을 한다', effects: { money: 90000, fans: 60, hp: -3 } },
      { text: '제품만 받고 짧게 언급한다', effects: { money: 40000 } },
    ],
  },
  {
    id: 'ev_m04',
    title: '방송 플랫폼 서버 장애',
    description: '방송 플랫폼에 대규모 장애가 발생했다. {member}의 방송도 한동안 끊겼다.',
    conditions: { ...BROADCAST, minDay: 5, cooldown: 9 },
    weight: 0,
    stockEffect: { ticker: 'STRM', percentage: -7 },
    choices: [
      { text: '다른 채널로 임시 방송을 연다', effects: { fans: 100, hp: -4 } },
      { text: '복구될 때까지 공지만 올리고 쉰다', effects: { hp: 6, fans: -30 } },
    ],
  },
  {
    // 주식을 보유 중일 때만 등장
    id: 'ev_m05',
    title: '매니저의 주식 이야기',
    description: '{member}가 매니저가 요즘 주식 창을 자주 본다며 방송에서 궁금해한다.',
    conditions: { ...BROADCAST, holdsStock: true, cooldown: 8 },
    choices: [
      { text: '방송에서는 조용히 넘어간다', effects: { fame: 1 } },
      {
        text: '재미있는 경제 토크 코너로 만든다',
        check: { stat: 'Bs', difficulty: 76, traitBonus: { brain: 10, chatter: 5 } },
        effects: {},
        outcomes: { great: { fans: 200, fame: 1 }, success: { fans: 110 }, fail: { fans: -20, fame: -1 } },
      },
    ],
  },

  /* ===================== 체인: 합동 콘서트 (A → 리허설 → 당일) ===================== */

  {
    id: 'ch_concert_1',
    title: '합동 콘서트 제안',
    description: '공연 기획사에서 스텔라이브 합동 온라인 콘서트를 제안했다. {member}가 기획안을 받아 왔다.',
    conditions: { minDay: 4, maxDay: 15, minFame: 12, blockedActivityCategories: ['rest'] },
    once: true,
    urgent: true,
    choices: [
      { text: '대규모 콘서트로 준비한다', conditions: { minMoney: 300000 }, effects: { money: -300000, flags: { concertPlanned: true }, stockEffect: { ticker: 'NOVA', percentage: 3 } } },
      { text: '규모를 줄여 온라인 공연으로 준비한다', effects: { money: -120000, flags: { concertPlanned: true, concertSmall: true } } },
      { text: '이번에는 보류한다', effects: { fame: -1 } },
    ],
  },
  {
    id: 'ch_concert_2',
    title: '콘서트 리허설',
    description: '콘서트를 앞두고 첫 합동 리허설 날. {member}가 리허설 진행을 맡았다.',
    conditions: { requiredFlags: ['concertPlanned'], afterEventId: { id: 'ch_concert_1', minDays: 4 }, blockedActivityCategories: ['rest'] },
    forced: true,
    once: true,
    choices: [
      {
        text: '실전처럼 강도 높은 리허설을 한다',
        check: { stat: 'Vc', difficulty: 80, traitBonus: { perfectionist: 10, host: 5, diligent: 5 } },
        effects: { team: { hp: -6 } },
        outcomes: {
          great: { flags: { rehearsalGood: true }, team: { stats: { Vc: 1 } } },
          success: { flags: { rehearsalGood: true } },
          fail: { flags: { rehearsalRough: true } },
        },
      },
      { text: '컨디션을 지키며 동선만 맞춘다', effects: { team: { hp: -2 }, flags: { rehearsalSteady: true } } },
    ],
  },
  {
    id: 'ch_concert_3',
    title: '합동 콘서트 당일',
    description: '드디어 콘서트 당일. 대기실의 {member}와 멤버들 모두 긴장한 얼굴이다.',
    conditions: { requiredFlags: ['concertPlanned'], afterEventId: { id: 'ch_concert_2', minDays: 3 }, blockedActivityCategories: ['rest'] },
    forced: true,
    once: true,
    stockEffect: [{ ticker: 'NOVA', percentage: 5 }, { ticker: 'TUNE', percentage: 2 }],
    choices: [
      {
        text: '리허설대로 완벽한 무대를 선보인다',
        conditions: { requiredFlags: ['rehearsalGood'] },
        check: { stat: 'Vc', difficulty: 70, traitBonus: { perfectionist: 5, highTension: 5 } },
        effects: { team: { hp: -8 } },
        outcomes: {
          great: { fans: 1500, fame: 12, money: 500000, flags: { concertSuccess: true } },
          success: { fans: 1000, fame: 8, money: 350000, flags: { concertSuccess: true } },
          fail: { fans: 400, fame: 3, money: 150000 },
        },
      },
      {
        text: '관객과 함께 즐기는 무대로 간다',
        check: { stat: 'Vc', difficulty: 78, traitBonus: { highTension: 10, chatter: 5 } },
        effects: { team: { hp: -6 } },
        outcomes: {
          great: { fans: 1100, fame: 8, money: 300000, flags: { concertSuccess: true } },
          success: { fans: 700, fame: 5, money: 200000, flags: { concertSuccess: true } },
          fail: { fans: 300, fame: 2, money: 100000 },
        },
      },
      {
        text: '부족한 부분은 토크와 이벤트로 채운다',
        conditions: { requiredFlags: ['rehearsalRough'] },
        check: { stat: 'Bs', difficulty: 76, traitBonus: { host: 10, roleplay: 5 } },
        effects: { team: { hp: -4 } },
        outcomes: {
          great: { fans: 800, fame: 5, money: 200000, flags: { concertSuccess: true } },
          success: { fans: 500, fame: 3, money: 150000 },
          fail: { fans: 200, fame: 1 },
        },
      },
    ],
  },

  /* ===================== 체인: 장비 스폰서 (A → 리뷰 → 계약) ===================== */

  {
    id: 'ch_sponsor_1',
    title: '장비 브랜드 체험 제안',
    description: '장비 브랜드에서 한 달간 제품을 써 보고 리뷰해 달라는 제안이 왔다. {member}가 관심을 보인다.',
    // 거절해도 7일 뒤 다시 제안이 온다 (체험을 시작하면 더 이상 등장하지 않음)
    conditions: { ...BROADCAST, minFame: 10, minDay: 3, maxDay: 18, blockedFlags: ['sponsorTrial'], cooldown: 7 },
    urgent: true,
    choices: [
      { text: '체험단으로 참여한다', effects: { money: 50000, flags: { sponsorTrial: true }, stockEffect: { ticker: 'GEAR', percentage: 2 } } },
      { text: '지금 장비로 충분하다고 거절한다', effects: { fame: 1 } },
    ],
  },
  {
    id: 'ch_sponsor_2',
    title: '스폰서 리뷰 방송',
    description: '체험 기간이 끝나 리뷰 방송을 할 차례다. {member}가 장비를 들고 카메라 앞에 앉았다.',
    conditions: { ...BROADCAST, requiredFlags: ['sponsorTrial'], afterEventId: { id: 'ch_sponsor_1', minDays: 4 } },
    forced: true,
    once: true,
    choices: [
      {
        text: '장단점을 솔직하게 리뷰한다',
        check: { stat: 'Bs', difficulty: 68, traitBonus: { brain: 10, calm: 5, diligent: 5 } },
        effects: { hp: -3 },
        outcomes: {
          great: { fans: 200, fame: 2, flags: { sponsorReviewGood: true } },
          success: { fans: 120, flags: { sponsorReviewGood: true } },
          fail: { fans: 30, flags: { sponsorReviewBad: true } },
        },
      },
      { text: '광고 문구대로 무난하게 소개한다', effects: { fans: 40, flags: { sponsorReviewBad: true } } },
    ],
  },
  {
    id: 'ch_sponsor_3',
    title: '장기 스폰서 계약 협상',
    description: '리뷰 방송 결과를 본 장비 브랜드가 다시 연락해 왔다.',
    conditions: { requiredFlags: ['sponsorTrial'], afterEventId: { id: 'ch_sponsor_2', minDays: 3 } },
    forced: true,
    once: true,
    choices: [
      { text: '장기 계약을 체결한다', conditions: { requiredFlags: ['sponsorReviewGood'] }, effects: { money: 480000, fame: 2, flags: { sponsorRenewed: true }, stockEffect: { ticker: 'GEAR', percentage: 6 } } },
      { text: '단기 계약으로 마무리한다', conditions: { requiredFlags: ['sponsorReviewBad'] }, effects: { money: 150000 } },
      // 리뷰 결과가 없을 때만 보이는 대체 선택지 (결과가 있으면 그에 맞는 계약 선택지만 보인다)
      { text: '계약 없이 관계만 유지한다', conditions: { blockedFlags: ['sponsorReviewGood', 'sponsorReviewBad'] }, fallback: true, effects: { fame: 1 } },
    ],
  },

  /* ===================== 멤버 개인 이벤트 ===================== */

  // 아야츠노 유니
  {
    id: 'pe_yuni_1',
    title: '일요일 아침 뉴스 방송',
    description: '주말 아침, {member}가 한 주의 소식을 전하는 뉴스 형식 방송을 준비하고 있다.',
    memberId: 'yuni',
    conditions: { ...BROADCAST, dayOfWeek: 7, cooldown: 6 },
    weight: 0,
    choices: [
      {
        text: '멤버들 소식까지 꼼꼼히 준비한다',
        check: { stat: 'Bs', difficulty: 75, traitBonus: { chatter: 10 } },
        effects: { hp: -4 },
        outcomes: { great: { fans: 280, fame: 2 }, success: { fans: 170, fame: 1 }, fail: { fans: 50 } },
      },
      { text: '가볍게 근황 위주로 진행한다', effects: { fans: 90 } },
    ],
  },
  {
    id: 'pe_yuni_2',
    title: '승부욕 발동',
    description: '패배가 분했던 {member}가 오늘은 이길 때까지 연습하겠다고 선언했다.',
    memberId: 'yuni',
    conditions: { activityCategories: ['game'], cooldown: 5 },
    weight: 0,
    choices: [
      {
        text: '밤새 특훈 방송을 한다',
        check: { stat: 'Ga', difficulty: 82, traitBonus: { competitive: 10, fps: 5 } },
        effects: { hp: -10, memberFlags: { stayedUpLate: true } },
        outcomes: { great: { fans: 300, fame: 2, stats: { Ga: 2 } }, success: { fans: 170, stats: { Ga: 1 } }, fail: { fans: 60, stats: { Ga: 1 } } },
      },
      { text: '정해진 시간만 집중해서 연습한다', effects: { stats: { Ga: 1 }, fans: 70, hp: -4 } },
    ],
  },

  // 사키하네 후야
  {
    id: 'pe_huya_1',
    title: '숨은 인디게임 발굴',
    description: '{member}가 아무도 모르는 인디게임을 찾아냈다며 눈을 반짝인다.',
    memberId: 'huya',
    conditions: { activityCategories: ['game'], cooldown: 4 },
    weight: 0,
    choices: [
      {
        text: '끝까지 파고드는 방송을 한다',
        check: { stat: 'Ga', difficulty: 72, traitBonus: { indie: 15 } },
        effects: { hp: -5 },
        outcomes: { great: { fans: 250, fame: 2, stockEffect: { ticker: 'PXLG', percentage: 2 } }, success: { fans: 150, fame: 1 }, fail: { fans: 50 } },
      },
      { text: '여러 게임을 짧게 맛만 본다', effects: { fans: 100, hp: -3 } },
    ],
  },
  {
    id: 'pe_huya_2',
    title: '리듬게임 기록 도전',
    description: '{member}가 오늘은 최고 난이도 곡에 도전해 보겠다고 한다.',
    memberId: 'huya',
    conditions: { activityCategories: ['rhythm', 'music'], cooldown: 5 },
    weight: 0,
    choices: [
      {
        text: '풀콤보가 나올 때까지 도전한다',
        check: { stat: 'Ga', difficulty: 76, traitBonus: { rhythm: 15 } },
        effects: { hp: -7 },
        outcomes: { great: { fans: 300, fame: 2, stats: { Ga: 1 } }, success: { fans: 170, stats: { Ga: 1 } }, fail: { fans: 60 } },
      },
      { text: '연습 모드로 차근차근 올린다', effects: { stats: { Ga: 1 }, fans: 60 } },
    ],
  },
  {
    id: 'pe_huya_3',
    title: '처음 보는 시청자들',
    description: '처음 온 시청자가 많은 날, 사람이 많아지면 긴장하는 {member}의 목소리가 작아진다.',
    memberId: 'huya',
    conditions: { activityCategories: ['talk', 'broadcast'], minFans: 3000, cooldown: 6 },
    weight: 0,
    choices: [
      {
        text: '긴장을 솔직하게 말하고 천천히 대화한다',
        check: { stat: 'Bs', difficulty: 72, traitBonus: { calm: 10 } },
        effects: { hp: -3 },
        outcomes: { great: { fans: 260, fame: 2, stats: { Bs: 1 } }, success: { fans: 160, stats: { Bs: 1 } }, fail: { fans: 60 } },
      },
      { text: '게임 화면 위주로 진행한다', effects: { fans: 80 } },
    ],
  },

  // 시라유키 히나
  {
    id: 'pe_hina_1',
    title: '예고 없는 게릴라 방송',
    description: '{member}가 공지도 없이 방송을 켰다. 알림을 본 팬들이 빠르게 모여든다.',
    memberId: 'hina',
    conditions: { ...BROADCAST, cooldown: 4 },
    weight: 0,
    choices: [
      { text: '기세를 몰아 장시간 방송으로 간다', effects: { fans: 220, fame: 1, hp: -12, memberFlags: { stayedUpLate: true } } },
      { text: '짧고 굵게 즐기고 마무리한다', effects: { fans: 110, hp: -4 } },
    ],
  },
  {
    id: 'pe_hina_2',
    title: '피아노 라이브',
    description: '{member}가 오늘은 피아노를 치며 노래하고 싶다고 한다.',
    memberId: 'hina',
    conditions: { activityCategories: ['music'], cooldown: 5 },
    weight: 0,
    choices: [
      {
        text: '연주와 노래를 함께 하는 라이브',
        check: { stat: 'Vc', difficulty: 78, traitBonus: { instrument: 15 } },
        effects: { hp: -5 },
        outcomes: { great: { fans: 320, fame: 3, stats: { Vc: 1 } }, success: { fans: 190, fame: 1 }, fail: { fans: 70 } },
      },
      { text: '연주 위주의 잔잔한 방송', effects: { fans: 110, hp: -2 } },
    ],
  },

  // 네네코 마시로
  {
    id: 'pe_mashiro_1',
    title: '즉흥 상황극 폭주',
    description: '{member}가 게임 도중 갑자기 상황극을 시작했다. 채팅창이 들썩인다.',
    memberId: 'mashiro',
    conditions: { activityCategories: ['horror', 'talk'], cooldown: 4 },
    weight: 0,
    choices: [
      {
        text: '상황극을 방송의 메인으로 키운다',
        check: { stat: 'Bs', difficulty: 74, traitBonus: { roleplay: 15, horror: 5 } },
        effects: { hp: -5 },
        outcomes: { great: { fans: 300, fame: 2 }, success: { fans: 180, fame: 1 }, fail: { fans: 60 } },
      },
      { text: '적당히 받아주고 원래 콘텐츠로 돌아간다', effects: { fans: 90 } },
    ],
  },
  {
    id: 'pe_mashiro_2',
    title: '우쿨렐레 신청곡',
    description: '{member}가 우쿨렐레를 꺼내 들자 신청곡이 줄을 잇는다.',
    memberId: 'mashiro',
    conditions: { activityCategories: ['music'], cooldown: 5 },
    weight: 0,
    choices: [
      {
        text: '장르를 가리지 않고 받아 연주한다',
        check: { stat: 'Vc', difficulty: 76, traitBonus: { instrument: 15 } },
        effects: { hp: -5 },
        outcomes: { great: { fans: 280, fame: 2 }, success: { fans: 170, fame: 1 }, fail: { fans: 60 } },
      },
      { text: '편안한 곡 위주로 조용히 부른다', effects: { fans: 100, hp: 2 } },
    ],
  },

  // 아카네 리제 (개인 + 체인: 끝없는 테이크 → 편곡 결정 → 공개)
  {
    id: 'pe_lize_1',
    title: '심야 잡담의 종착역',
    description: '다른 멤버들의 방송이 끝난 새벽, 레이드가 하나둘 {member}의 방송으로 모여든다.',
    memberId: 'lize',
    conditions: { activityCategories: ['talk', 'broadcast'], cooldown: 4 },
    weight: 0,
    choices: [
      {
        text: '모인 시청자들과 길게 이야기를 나눈다',
        check: { stat: 'Bs', difficulty: 74, traitBonus: { chatter: 10, nightOwl: 5 } },
        effects: { hp: -6 },
        outcomes: { great: { fans: 300, fame: 2 }, success: { fans: 180, fame: 1 }, fail: { fans: 70 } },
      },
      { text: '적당한 시간에 인사하고 마무리한다', effects: { fans: 90 } },
    ],
  },
  {
    id: 'ch_lize_1',
    title: '끝없는 테이크',
    description: '{member}가 커버곡 녹음을 몇백 번째 다시 하고 있다. 스태프들도 이제 몇 번째 테이크인지 모른다.',
    memberId: 'lize',
    conditions: { activityCategories: ['music'] },
    once: true,
    weight: 4,
    choices: [
      {
        text: '완벽해질 때까지 기다린다',
        check: { stat: 'Vc', difficulty: 84, traitBonus: { perfectionist: 15 } },
        effects: { hp: -12, memberFlags: { lizeAlbumWork: true } },
        outcomes: { great: { stats: { Vc: 2 }, memberFlags: { lizeTakePerfect: true } }, success: { stats: { Vc: 1 }, memberFlags: { lizeTakePerfect: true } }, fail: { stats: { Vc: 1 } } },
      },
      { text: '좋았던 테이크를 골라 마무리하자고 설득한다', effects: { hp: -4, memberFlags: { lizeAlbumWork: true } } },
    ],
  },
  {
    id: 'ch_lize_2',
    title: '편곡 방향 회의',
    description: '녹음을 마친 {member}의 커버곡. 어떤 느낌으로 마무리할지 정해야 한다.',
    memberId: 'lize',
    conditions: { memberFlags: ['lizeAlbumWork'], afterEventId: { id: 'ch_lize_1', minDays: 3 } },
    forced: true,
    once: true,
    choices: [
      { text: '과감한 편곡으로 새로운 모습을 보여준다', effects: { memberFlags: { lizeBold: true }, money: -60000 } },
      { text: '원곡의 느낌을 살려 정통으로 간다', effects: { memberFlags: { lizeClassic: true } } },
    ],
  },
  {
    id: 'ch_lize_3',
    title: '리제 커버곡 공개',
    description: '드디어 {member}의 커버곡이 공개되는 날이다.',
    memberId: 'lize',
    conditions: { memberFlags: ['lizeAlbumWork'], afterEventId: { id: 'ch_lize_2', minDays: 2 } },
    forced: true,
    once: true,
    stockEffect: { ticker: 'TUNE', percentage: 2 },
    choices: [
      {
        text: '파격 편곡 버전을 프리미어로 공개한다',
        conditions: { memberFlags: ['lizeBold'] },
        check: { stat: 'Vc', difficulty: 80, traitBonus: { perfectionist: 10 } },
        effects: { hp: -3 },
        outcomes: { great: { fans: 900, fame: 6, flags: { lizeCoverHit: true } }, success: { fans: 500, fame: 3, flags: { lizeCoverHit: true } }, fail: { fans: 120 } },
      },
      {
        text: '정통 편곡 버전을 공개한다',
        conditions: { memberFlags: ['lizeClassic'] },
        check: { stat: 'Vc', difficulty: 74 },
        effects: { hp: -3 },
        outcomes: { great: { fans: 550, fame: 4, flags: { lizeCoverHit: true } }, success: { fans: 380, fame: 2 }, fail: { fans: 200, fame: 1 } },
      },
      // 편곡 결정이 없을 때만 보이는 대체 선택지
      { text: '조용히 업로드만 한다', conditions: { blockedMemberFlags: ['lizeBold', 'lizeClassic'] }, fallback: true, effects: { fans: 200, fame: 1 } },
    ],
  },

  // 아라하시 타비
  {
    id: 'pe_tabi_1',
    title: '방송 후기 장문 공지',
    description: '방송을 마친 {member}가 오늘 방송 후기를 길게 적어 올릴지 고민하고 있다.',
    memberId: 'tabi',
    conditions: { ...BROADCAST, cooldown: 4 },
    weight: 0,
    choices: [
      { text: '정성 들여 장문 후기를 쓴다', effects: { fans: 150, fame: 1, hp: -3 } },
      { text: '짧은 감사 인사만 남긴다', effects: { fans: 60 } },
    ],
  },
  {
    id: 'pe_tabi_2',
    title: '격투게임 대회 출전',
    description: '{member}가 격투게임 커뮤니티 대회에 출전하고 싶다고 한다. 연습량으로 부족한 피지컬을 메워 왔다.',
    memberId: 'tabi',
    conditions: { activityCategories: ['fighting', 'game'], cooldown: 6 },
    weight: 0,
    choices: [
      {
        text: '대회 준비에 집중한다',
        check: { stat: 'Ga', difficulty: 82, traitBonus: { fighting: 10, diligent: 10, brain: 5 } },
        effects: { hp: -8, money: -30000 },
        outcomes: { great: { fans: 400, fame: 4, money: 150000 }, success: { fans: 220, fame: 2 }, fail: { fans: 80 } },
      },
      { text: '재미로 출전하고 과정을 방송한다', effects: { fans: 130, hp: -4 } },
    ],
  },

  // 텐코 시부키
  {
    id: 'pe_shibuki_1',
    title: '배틀로얄 치킨 도전',
    description: '{member}가 오늘은 무조건 1등을 하겠다며 배틀로얄을 켰다. 실력은 충분한데 운이 문제다.',
    memberId: 'shibuki',
    conditions: { activityCategories: ['fps', 'game'], cooldown: 4 },
    weight: 0,
    choices: [
      {
        text: '1등 할 때까지 계속한다',
        check: { stat: 'Ga', difficulty: 78, traitBonus: { fps: 10, competitive: 5 } },
        effects: { hp: -8 },
        outcomes: { great: { fans: 320, fame: 2, stats: { Ga: 1 } }, success: { fans: 180, stats: { Ga: 1 } }, fail: { fans: 90 } },
      },
      { text: '세 판만 하고 다른 게임으로 넘어간다', effects: { fans: 90, hp: -3 } },
    ],
  },
  {
    id: 'pe_shibuki_2',
    title: '3기 합방 진행 맡기',
    description: '오늘 합방의 진행을 {member}가 맡았다. 채팅을 챙기며 흐름을 이끌어야 한다.',
    memberId: 'shibuki',
    collab: { min: 2, max: 3 },
    conditions: { ...BROADCAST, cooldown: 5 },
    weight: 0,
    choices: [
      {
        text: '코너를 짜서 체계적으로 진행한다',
        check: { stat: 'Bs', difficulty: 76, traitBonus: { host: 15, calm: 5 } },
        effects: { hp: -5, relationship: 4 },
        outcomes: { great: { fans: 300, fame: 2, relationship: 3 }, success: { fans: 180, fame: 1 }, fail: { fans: 60 } },
      },
      {
        text: '자유롭게 수다를 떨게 둔다',
        check: { stat: 'Bs', difficulty: 70, traitBonus: { chatter: 10, highTension: 5 } },
        effects: { hp: -3, relationship: 3 },
        outcomes: { great: { fans: 220, fame: 1 }, success: { fans: 130 }, fail: { fans: 40 } },
      },
    ],
  },

  // 아오쿠모 린
  {
    id: 'pe_rin_1',
    title: '커버곡 연속 공개 제안',
    description: '작업 속도가 빠른 {member}에게 커버곡을 연속으로 공개해 보자는 의견이 나왔다.',
    memberId: 'rin',
    conditions: { activityCategories: ['music'], cooldown: 5 },
    weight: 0,
    choices: [
      {
        text: '일주일 연속 공개에 도전한다',
        check: { stat: 'Vc', difficulty: 78, traitBonus: { cover: 15, diligent: 5 } },
        effects: { hp: -9 },
        outcomes: { great: { fans: 380, fame: 3, stockEffect: { ticker: 'TUNE', percentage: 2 } }, success: { fans: 230, fame: 2 }, fail: { fans: 80 } },
      },
      { text: '한 곡씩 여유 있게 올린다', effects: { fans: 120, hp: -3 } },
    ],
  },
  {
    id: 'pe_rin_2',
    title: '퍼즐게임 공략 방송',
    description: '{member}가 어렵기로 유명한 퍼즐게임을 논리적으로 풀어 보겠다고 나섰다.',
    memberId: 'rin',
    conditions: { activityCategories: ['game'], cooldown: 5 },
    weight: 0,
    choices: [
      {
        text: '힌트 없이 끝까지 푼다',
        check: { stat: 'Ga', difficulty: 76, traitBonus: { brain: 15, calm: 5 } },
        effects: { hp: -5 },
        outcomes: { great: { fans: 260, fame: 2, stats: { Ga: 1 } }, success: { fans: 160, stats: { Ga: 1 } }, fail: { fans: 60 } },
      },
      { text: '시청자와 함께 풀이를 토론한다', effects: { fans: 120 } },
    ],
  },

  // 하나코 나나
  {
    id: 'pe_nana_1',
    title: '한낮의 오픈월드 탐방',
    description: '다른 멤버들이 잠든 낮 시간, {member}가 넓은 오픈월드를 설명하며 탐험한다.',
    memberId: 'nana',
    conditions: { activityCategories: ['game'], cooldown: 4 },
    weight: 0,
    choices: [
      {
        text: '숨은 명소를 찾아 해설 방송을 한다',
        check: { stat: 'Bs', difficulty: 74, traitBonus: { openWorld: 15, daytime: 5 } },
        effects: { hp: -4 },
        outcomes: { great: { fans: 280, fame: 2 }, success: { fans: 170, fame: 1 }, fail: { fans: 60 } },
      },
      { text: '편하게 돌아다니며 수다를 떤다', effects: { fans: 100 } },
    ],
  },
  {
    id: 'pe_nana_2',
    title: '장르 넘나드는 노래방',
    description: '{member}가 오늘은 힙합부터 시티팝까지 장르를 가리지 않고 불러 보겠다고 한다.',
    memberId: 'nana',
    conditions: { activityCategories: ['music'], cooldown: 5 },
    weight: 0,
    choices: [
      {
        text: '장르 릴레이로 한계에 도전한다',
        check: { stat: 'Vc', difficulty: 78, traitBonus: { highTension: 10 } },
        effects: { hp: -6 },
        outcomes: { great: { fans: 330, fame: 3, stats: { Vc: 1 } }, success: { fans: 190, fame: 1 }, fail: { fans: 70 } },
      },
      { text: '자신 있는 장르만 부른다', effects: { fans: 110, hp: -2 } },
    ],
  },

  // 유즈하 리코
  {
    id: 'pe_riko_1',
    title: '랭크 게임 과몰입',
    description: '{member}가 랭크 게임에 푹 빠져 방송 종료 시간을 계속 미루고 있다.',
    memberId: 'riko',
    conditions: { activityCategories: ['fps', 'game'], cooldown: 4 },
    weight: 0,
    choices: [
      {
        text: '목표 랭크까지 달리게 둔다',
        check: { stat: 'Ga', difficulty: 80, traitBonus: { fps: 10, highTension: 5 } },
        effects: { hp: -10, memberFlags: { stayedUpLate: true } },
        outcomes: { great: { fans: 320, fame: 2, stats: { Ga: 2 } }, success: { fans: 180, stats: { Ga: 1 } }, fail: { fans: 70 } },
      },
      { text: '약속한 시간에 끝내도록 한다', effects: { fans: 80, hp: 3 } },
    ],
  },
  {
    id: 'pe_riko_2',
    title: '방송 종료곡 한 곡만 더',
    description: '{member}의 방송이 끝날 무렵, 종료곡을 한 곡 더 불러 달라는 요청이 쏟아진다.',
    memberId: 'riko',
    conditions: { ...BROADCAST, cooldown: 4 },
    weight: 0,
    choices: [
      {
        text: '고음 가득한 곡으로 마무리한다',
        check: { stat: 'Vc', difficulty: 76, traitBonus: { highTension: 10, roleplay: 5 } },
        effects: { hp: -4 },
        outcomes: { great: { fans: 250, fame: 2 }, success: { fans: 150, fame: 1 }, fail: { fans: 50 } },
      },
      { text: '다음 방송을 기약하며 인사한다', effects: { fans: 60, hp: 2 } },
    ],
  },

  // 아이리 칸나 (개인 + 체인: 데모 → 3D 무대 준비 → 라이브)
  {
    id: 'pe_kanna_1',
    title: '잔잔한 ASMR 방송',
    description: '{member}가 오늘은 조용한 ASMR 방송을 해 보고 싶다고 한다.',
    memberId: 'kanna',
    conditions: { activityCategories: ['talk', 'broadcast'], cooldown: 5 },
    weight: 0,
    choices: [
      {
        text: '장비를 제대로 갖추고 진행한다',
        conditions: { minMoney: 60000 },
        check: { stat: 'Bs', difficulty: 72, traitBonus: { calm: 10 } },
        effects: { money: -60000, hp: 2 },
        outcomes: { great: { fans: 300, fame: 2 }, success: { fans: 190, fame: 1 }, fail: { fans: 70 } },
      },
      { text: '있는 장비로 편안하게 진행한다', effects: { fans: 110, hp: 3 } },
    ],
  },
  {
    id: 'ch_kanna_1',
    title: '오리지널곡 데모',
    description: '{member}가 오리지널곡 데모를 들려주며 언젠가 3D 무대에서 부르고 싶다고 말했다.',
    memberId: 'kanna',
    conditions: { activityCategories: ['music'], minDay: 3 },
    once: true,
    weight: 7,
    choices: [
      { text: '정식 제작을 지원한다', conditions: { minMoney: 200000 }, effects: { money: -200000, memberFlags: { kannaOriginal: true }, stats: { Vc: 1 } } },
      { text: '데모를 먼저 팬들에게 들려준다', effects: { fans: 150, memberFlags: { kannaOriginal: true, kannaDemoOnly: true } } },
      { text: '지금은 마음속에 담아 둔다', effects: { fame: 0 } },
    ],
  },
  {
    id: 'ch_kanna_2',
    title: '3D 무대 준비',
    description: '오리지널곡을 3D 무대에서 선보이기 위한 준비가 시작됐다. {member}의 연습 강도를 정해야 한다.',
    memberId: 'kanna',
    conditions: { memberFlags: ['kannaOriginal'], afterEventId: { id: 'ch_kanna_1', minDays: 3 } },
    forced: true,
    once: true,
    choices: [
      {
        text: '안무와 라이브를 함께 맹연습한다',
        check: { stat: 'Vc', difficulty: 80, traitBonus: { perfectionist: 10, highTension: 5 } },
        effects: { hp: -10 },
        outcomes: { great: { memberFlags: { kanna3dReady: true }, stats: { Vc: 2 } }, success: { memberFlags: { kanna3dReady: true }, stats: { Vc: 1 } }, fail: { stats: { Vc: 1 } } },
      },
      { text: '라이브 위주로 안정적으로 준비한다', effects: { hp: -4, memberFlags: { kanna3dReady: true, kannaSafeStage: true } } },
    ],
  },
  {
    id: 'ch_kanna_3',
    title: '칸나 3D 라이브',
    description: '{member}의 3D 라이브 당일. 오리지널곡 무대를 기다리는 팬들로 채팅창이 가득하다.',
    memberId: 'kanna',
    conditions: { memberFlags: ['kanna3dReady'], afterEventId: { id: 'ch_kanna_2', minDays: 3 } },
    forced: true,
    once: true,
    stockEffect: { ticker: 'NOVA', percentage: 3 },
    choices: [
      {
        text: '준비한 모든 것을 보여준다',
        check: { stat: 'Vc', difficulty: 76, traitBonus: { perfectionist: 5, highTension: 5 } },
        effects: { hp: -8 },
        outcomes: { great: { fans: 1000, fame: 8, money: 250000, flags: { kannaLiveSuccess: true } }, success: { fans: 650, fame: 5, money: 150000, flags: { kannaLiveSuccess: true } }, fail: { fans: 250, fame: 2 } },
      },
      { text: '무리하지 않고 편안한 무대로 꾸민다', conditions: { memberFlags: ['kannaSafeStage'] }, effects: { fans: 450, fame: 3, money: 100000 } },
    ],
  },

  /* ===================== 추가 콜라보 이벤트 ===================== */

  {
    id: 'collab_004',
    title: '듀오 라디오 방송',
    description: '{member}가 라디오 형식으로 사연을 읽는 합방을 해 보고 싶다고 한다.',
    collab: { min: 2, max: 2 },
    conditions: { activityCategories: ['talk'], cooldown: 3 },
    weight: 0,
    choices: [
      {
        text: '사연 코너를 정성껏 준비한다',
        check: { stat: 'Bs', difficulty: 74, traitBonus: { chatter: 10, calm: 5, host: 5 } },
        effects: { hp: -4, relationship: 5 },
        outcomes: { great: { fans: 240, fame: 2, relationship: 3 }, success: { fans: 150, fame: 1 }, fail: { fans: 50 } },
      },
      { text: '편하게 수다 위주로 흘러가게 둔다', effects: { fans: 90, relationship: 4, hp: -2 } },
    ],
  },
  {
    id: 'collab_005',
    title: '리듬게임 대결',
    description: '{member}가 리듬게임으로 정면 승부를 하자며 상대를 찾는다.',
    collab: { min: 2, max: 3 },
    conditions: { activityCategories: ['rhythm'], cooldown: 3 },
    weight: 0,
    choices: [
      {
        text: '최고 난이도 곡으로 맞붙는다',
        check: { stat: 'Ga', difficulty: 78, traitBonus: { rhythm: 15, competitive: 5 } },
        effects: { hp: -6, relationship: 3 },
        outcomes: { great: { fans: 280, fame: 2 }, success: { fans: 170, fame: 1 }, fail: { fans: 60, relationship: -1 } },
      },
      { text: '서로 추천곡을 번갈아 플레이한다', effects: { fans: 110, relationship: 4, hp: -3 } },
    ],
  },
  {
    id: 'collab_006',
    title: '유닛 합방',
    description: '{member}가 친한 멤버들과 오랜만에 유닛 합방을 하고 싶다고 한다. 함께할수록 호흡이 좋아진다.',
    collab: { min: 2, max: 3 },
    conditions: { ...BROADCAST, minRelationship: 35, cooldown: 4 },
    weight: 0,
    choices: [
      {
        text: '서로의 매력을 살리는 코너를 준비한다',
        check: { stat: 'Bs', difficulty: 80, traitBonus: { host: 10, roleplay: 5, chatter: 5 } },
        effects: { hp: -6, relationship: 5 },
        outcomes: { great: { fans: 360, fame: 3, relationship: 3 }, success: { fans: 220, fame: 2 }, fail: { fans: 80 } },
      },
      { text: '편하게 근황 토크를 한다', effects: { fans: 130, relationship: 5, hp: -2 } },
    ],
  },
];
