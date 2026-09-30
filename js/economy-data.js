// economy-data.js — 상점 / 장기 투자 / 가상 주식 데이터 (순수 데이터 + 작은 계산 함수)
// 다른 모듈을 import 하지 않는다. 수치는 모두 임시값이며 여기서만 조정한다.

/* ===================== 상점 ===================== */

// 레벨 n → n+1 구매 가격 = baseCost × costGrowth^n (1,000원 단위 반올림)
// perLevel: 레벨 1 당 효과
//  - stats: 전 멤버 스탯 즉시 증가
//  - hp: 전 멤버 HP 즉시 회복
//  - hpRecovery: 하루 HP 회복량 증가 (지속)
//  - fanBonus: 팬 획득량 배율 증가 (지속, 0.05 = +5%)
//  - investmentChance: 관련 투자 성공률 증가 (지속)
export const SHOP_ITEMS = [
  {
    id: 'broadcastGear',
    label: '방송 장비 업그레이드',
    icon: '📺',
    desc: '전 멤버 방송(Bs) +2. 방송 환경 투자 성공률 +3%.',
    maxLevel: 4,
    baseCost: 90000,
    costGrowth: 1.5,
    perLevel: { stats: { Bs: 2 }, investmentChance: { broadcastEnv: 0.03 } },
  },
  {
    id: 'gameGear',
    label: '게임 장비 업그레이드',
    icon: '🎮',
    desc: '전 멤버 게임(Ga) +2. 게임 콘텐츠 투자 성공률 +3%.',
    maxLevel: 4,
    baseCost: 90000,
    costGrowth: 1.5,
    perLevel: { stats: { Ga: 2 }, investmentChance: { gameContent: 0.03 } },
  },
  {
    id: 'recordingStudio',
    label: '녹음 환경 업그레이드',
    icon: '🎤',
    desc: '전 멤버 노래(Vc) +2. 음악 제작 투자 성공률 +3%.',
    maxLevel: 4,
    baseCost: 90000,
    costGrowth: 1.5,
    perLevel: { stats: { Vc: 2 }, investmentChance: { musicProduction: 0.03 } },
  },
  {
    id: 'training',
    label: '체력 관리 / 트레이닝',
    icon: '💪',
    desc: '즉시 전 멤버 HP +8, 하루 HP 회복 +2.',
    maxLevel: 3,
    baseCost: 120000,
    costGrowth: 1.7,
    perLevel: { hp: 8, hpRecovery: 2 },
  },
  {
    id: 'contentBudget',
    label: '콘텐츠 제작 투자',
    icon: '🎬',
    desc: '모든 팬 획득량 +5%. 홍보·대형 프로젝트 투자 성공률 +3%.',
    maxLevel: 4,
    baseCost: 140000,
    costGrowth: 1.6,
    perLevel: { fanBonus: 0.05, investmentChance: { promotion: 0.03, bigProject: 0.03 } },
  },
];

export function getShopItem(id) {
  return SHOP_ITEMS.find((item) => item.id === id) || null;
}

export function getShopPrice(item, level) {
  return Math.round((item.baseCost * item.costGrowth ** level) / 1000) * 1000;
}

// 구매한 레벨 전체의 지속 효과 합계. key: 'hpRecovery' | 'fanBonus'
export function getShopTotal(levels, key) {
  return SHOP_ITEMS.reduce((sum, item) => sum + (levels?.[item.id] || 0) * (item.perLevel[key] || 0), 0);
}

// 특정 투자에 대한 상점 보너스 성공률
export function getShopInvestmentBonus(levels, investmentId) {
  return SHOP_ITEMS.reduce(
    (sum, item) => sum + (levels?.[item.id] || 0) * (item.perLevel.investmentChance?.[investmentId] || 0),
    0,
  );
}

/* ===================== 장기 투자 ===================== */

// 투자 시작 시 cost 지불 → duration 일 뒤 아침에 결과.
// 성공률 = baseChance + (관련 스탯 전 멤버 평균 - statPivot) × statFactor + 상점 보너스 (min~max 로 제한)
// success / fail: 결과 효과 (actions.js 의 effects 형식 그대로. team = 전 멤버, stockEffect = 주가)
export const INVESTMENTS = [
  {
    id: 'broadcastEnv',
    label: '방송 환경 투자',
    icon: '📡',
    desc: '스튜디오 조명·송출 환경을 정비한다. 안정적이지만 수익은 크지 않다.',
    cost: 250000,
    duration: 5,
    baseChance: 0.7,
    stat: 'Bs',
    success: { money: 290000, fans: 200, fame: 2, team: { stats: { Bs: 1 } }, stockEffect: { ticker: 'STRM', percentage: 4 } },
    fail: { money: 120000, stockEffect: { ticker: 'STRM', percentage: -3 } },
  },
  {
    id: 'musicProduction',
    label: '음악 제작 투자',
    icon: '🎼',
    desc: '오리지널 곡 제작을 지원한다. 성공하면 발매 관련 이벤트가 열린다.',
    cost: 320000,
    duration: 6,
    baseChance: 0.65,
    stat: 'Vc',
    success: { money: 380000, fans: 280, fame: 2, team: { stats: { Vc: 1 } }, flags: { musicReleaseReady: true }, stockEffect: { ticker: 'TUNE', percentage: 6 } },
    fail: { money: 110000, stockEffect: { ticker: 'TUNE', percentage: -4 } },
  },
  {
    id: 'gameContent',
    label: '게임 콘텐츠 투자',
    icon: '🕹️',
    desc: '게임 기획 콘텐츠와 대회 운영을 지원한다.',
    cost: 250000,
    duration: 5,
    baseChance: 0.68,
    stat: 'Ga',
    success: { money: 290000, fans: 240, fame: 2, team: { stats: { Ga: 1 } }, stockEffect: { ticker: 'PXLG', percentage: 5 } },
    fail: { money: 100000, stockEffect: { ticker: 'PXLG', percentage: -3 } },
  },
  {
    id: 'promotion',
    label: '홍보 투자',
    icon: '📣',
    desc: '광고와 SNS 홍보에 집중한다. 돈보다 팬을 늘린다.',
    cost: 200000,
    duration: 4,
    baseChance: 0.8,
    stat: null,
    success: { money: 80000, fans: 650, fame: 3, stockEffect: { ticker: 'CLIP', percentage: 3 } },
    fail: { money: 40000, fans: 150 },
  },
  {
    id: 'bigProject',
    label: '대형 프로젝트 투자',
    icon: '🌠',
    desc: '전 멤버가 참여하는 대형 기획. 오래 걸리고 위험하지만 성공하면 크게 남는다.',
    cost: 700000,
    duration: 9,
    baseChance: 0.55,
    stat: 'all',
    success: { money: 1000000, fans: 1100, fame: 8, flags: { bigProjectHit: true }, stockEffect: { ticker: 'NOVA', percentage: 10 } },
    fail: { money: 250000, fame: -2, flags: { bigProjectFlop: true }, stockEffect: { ticker: 'NOVA', percentage: -8 } },
  },
];

export const INVESTMENT_RULES = {
  maxActive: 3,
  statPivot: 82,
  statFactor: 0.01,
  minChance: 0.2,
  maxChance: 0.9,
};

export function getInvestment(id) {
  return INVESTMENTS.find((investment) => investment.id === id) || null;
}

/* ===================== 가상 주식 ===================== */

// 게임 안에만 존재하는 가상 종목. 실존 회사와 무관하다.
// sectors: 일정 카테고리 — 그날 해당 카테고리 콘텐츠의 성공 / 실패가 주가에 반영된다.
// volatility: 하루 랜덤 변동 폭 / drift: 하루 평균 기대 변동
// shopLinked: 상점 구매 시 소폭 상승 (장비 회사)
export const STOCKS = [
  { ticker: 'STRM', name: '스트림나래', sector: '방송 플랫폼', basePrice: 42000, volatility: 0.022, drift: 0.001, sectors: ['broadcast', 'talk'] },
  { ticker: 'TUNE', name: '하모니웍스', sector: '음악 제작', basePrice: 28000, volatility: 0.028, drift: 0.0012, sectors: ['music'] },
  { ticker: 'PXLG', name: '픽셀게이트', sector: '게임 퍼블리싱', basePrice: 35000, volatility: 0.032, drift: 0.001, sectors: ['game'] },
  { ticker: 'CLIP', name: '클립트리', sector: '숏폼 콘텐츠 플랫폼', basePrice: 18000, volatility: 0.038, drift: 0.0015, sectors: ['talk', 'game', 'music'] },
  { ticker: 'NOVA', name: '노바라이트 엔터', sector: '엔터테인먼트', basePrice: 55000, volatility: 0.018, drift: 0.0008, sectors: ['music', 'broadcast'] },
  { ticker: 'GEAR', name: '기어포지', sector: '방송·게이밍 장비', basePrice: 24000, volatility: 0.02, drift: 0.001, sectors: [], shopLinked: true },
];

export const STOCK_RULES = {
  // 하루 종가 변동 제한 (랜덤 + 콘텐츠 반영분)
  maxDailyMove: 0.07,
  // 이벤트 / 투자 stockEffect 1회 제한
  maxEventMove: 0.12,
  // 매수·매도 수수료
  feeRate: 0.005,
  // 콘텐츠 결과 → 주가: 결과 점수 × sensitivity (종목당 하루 contentCap 까지)
  outcomeScore: { great: 1, success: 0.3, fail: -0.8 },
  contentSensitivity: 0.003,
  contentCap: 0.025,
  // 상점 구매 1회당 shopLinked 종목 상승률
  shopImpact: 0.01,
  minPrice: 1000,
  // 한 종목 최대 보유 수량 (과도한 몰빵 방지)
  maxShares: 300,
};

export function getStock(ticker) {
  return STOCKS.find((stock) => stock.ticker === ticker) || null;
}
