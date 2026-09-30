// members.js — 멤버 데이터
// hp / stats 는 밸런스 테스트용 임시 수치이며, description 은 임시 문구다.
// generation / unit / status 만 실제 정보를 반영한다.
// traits 는 공개 자료를 참고한 임시 태그이며, 최종 확정 전이다.

/* ===================== 특성 태그 ===================== */

// 태그 정의: 라벨 + (있다면) 게임 효과.
//  - hpCostRate: HP 소모 배율
//  - hpCostBySlot / checkBonusBySlot: 시간대별 HP 소모 배율 / 판정 보너스
export const TRAITS = {
  fps: { label: 'FPS' },
  rhythm: { label: '리듬게임' },
  horror: { label: '공포게임' },
  fighting: { label: '격투게임' },
  indie: { label: '인디게임' },
  openWorld: { label: '오픈월드' },
  cover: { label: '커버곡' },
  instrument: { label: '악기' },
  chatter: { label: '저챗' },
  host: { label: '진행' },
  roleplay: { label: '상황극' },
  highTension: { label: '고텐션' },
  calm: { label: '차분' },
  spontaneous: { label: '즉흥' },
  competitive: { label: '승부욕' },
  perfectionist: { label: '완벽주의' },
  brain: { label: '두뇌파' },
  introvert: { label: '낯가림' },
  diligent: { label: '성실' },
  unlucky: { label: '운 없음' }, // 효과 미정
  nightOwl: { label: '올빼미', hpCostBySlot: { lateNight: 0.7 }, checkBonusBySlot: { lateNight: 10 } },
  daytime: { label: '낮방', hpCostBySlot: { lateNight: 1.4 }, checkBonusBySlot: { day: 10 } },
  longStream: { label: '장방', hpCostRate: 0.8 },
  lowStamina: { label: '저체력', hpCostRate: 1.3 },
};

/* ===================== 유닛 ===================== */

// 유닛 소속의 단일 출처. 한 멤버가 여러 유닛에 속할 수 있다 (유니: Mystic, Everys).
// 멤버의 unit 필드는 카드 표시용이다.
export const UNITS = {
  mystic: { name: 'Mystic', members: ['kanna', 'yuni'] },
  everys: { name: 'Everys', members: ['yuni', 'huya'] },
  universe: { name: 'Universe', members: ['hina', 'mashiro', 'lize', 'tabi'] },
  cliche: { name: 'Cliché', members: ['shibuki', 'rin', 'nana', 'riko'] },
};

/* ===================== 멤버 ===================== */

export const MEMBERS = [
  {
    id: 'yuni',
    name: '아야츠노 유니',
    description: '방송을 끌고 가는 추진력이 강한 1기 멤버',
    hp: 78,
    stats: { Bs: 94, Ga: 88, Vc: 90 },
    generation: 1,
    unit: 'Everys',
    status: 'active',
    traits: ['competitive', 'fps', 'chatter'],
  },
  {
    id: 'huya',
    name: '사키하네 후야',
    description: '독보적인 음색을 가진 1기 편입 멤버',
    hp: 84,
    stats: { Bs: 74, Ga: 66, Vc: 94 },
    generation: 1,
    unit: 'Everys',
    status: 'active',
    traits: ['introvert', 'rhythm', 'indie', 'lowStamina'],
  },
  {
    id: 'hina',
    name: '시라유키 히나',
    description: '포근한 음색으로 게임 방송을 즐기는 멤버',
    hp: 88,
    stats: { Bs: 82, Ga: 90, Vc: 84 },
    generation: 2,
    unit: 'Universe',
    status: 'active',
    traits: ['longStream', 'spontaneous', 'highTension', 'instrument'],
  },
  {
    id: 'mashiro',
    name: '네네코 마시로',
    description: '노래와 방송을 두루 잘 다루는 멤버',
    hp: 82,
    stats: { Bs: 86, Ga: 78, Vc: 88 },
    generation: 2,
    unit: 'Universe',
    status: 'active',
    traits: ['horror', 'roleplay', 'instrument', 'host'],
  },
  {
    id: 'lize',
    name: '아카네 리제',
    description: '화려한 외형과 털털한 말투의 멤버',
    hp: 68,
    stats: { Bs: 90, Ga: 76, Vc: 80 },
    generation: 2,
    unit: 'Universe',
    status: 'active',
    traits: ['nightOwl', 'chatter', 'perfectionist', 'fighting', 'introvert'],
  },
  {
    id: 'tabi',
    name: '아라하시 타비',
    description: '게임 실력이 뛰어난 장난기 많은 멤버',
    hp: 80,
    stats: { Bs: 78, Ga: 94, Vc: 70 },
    generation: 2,
    unit: 'Universe',
    status: 'active',
    traits: ['diligent', 'fighting', 'brain', 'chatter'],
  },
  {
    id: 'shibuki',
    name: '텐코 시부키',
    description: '노래에 강점을 가진 3기 멤버',
    hp: 86,
    stats: { Bs: 76, Ga: 70, Vc: 88 },
    generation: 3,
    unit: 'Cliché',
    status: 'active',
    traits: ['fps', 'host', 'unlucky'],
  },
  {
    id: 'rin',
    name: '아오쿠모 린',
    description: '꼼꼼하고 성실한 성격의 멤버',
    hp: 92,
    stats: { Bs: 70, Ga: 86, Vc: 74 },
    generation: 3,
    unit: 'Cliché',
    status: 'active',
    traits: ['calm', 'chatter', 'cover', 'brain', 'nightOwl'],
  },
  {
    id: 'nana',
    name: '하나코 나나',
    description: '노래를 좋아하는 밝은 3기 멤버',
    hp: 90,
    stats: { Bs: 72, Ga: 68, Vc: 86 },
    generation: 3,
    unit: 'Cliché',
    status: 'active',
    traits: ['daytime', 'openWorld', 'horror', 'highTension'],
  },
  {
    id: 'riko',
    name: '유즈하 리코',
    description: '노래와 게임을 균형 있게 다루는 멤버',
    hp: 84,
    stats: { Bs: 74, Ga: 84, Vc: 82 },
    generation: 3,
    unit: 'Cliché',
    status: 'active',
    traits: ['highTension', 'roleplay', 'fps', 'rhythm', 'spontaneous'],
  },
  {
    // 실제로는 졸업했지만, 게임에서는 다른 멤버와 완전히 동일하게 취급한다.
    // (status 는 실제 정보로만 남기고, 게임 로직과 화면 어디에서도 사용하지 않는다.)
    id: 'kanna',
    name: '아이리 칸나',
    description: '1기 원년 멤버였던 졸업생',
    hp: 76,
    stats: { Bs: 88, Ga: 72, Vc: 92 },
    generation: 1,
    unit: 'Mystic',
    status: 'graduated',
    traits: ['highTension', 'spontaneous', 'fps', 'perfectionist'],
  },
];

export function getMemberById(id) {
  return MEMBERS.find((member) => member.id === id) || null;
}

// 관계도 초기값 (임시): 같은 유닛 30 / 같은 기수 20 / 그 외 10
export const INITIAL_RELATIONSHIP = { sameUnit: 30, sameGeneration: 20, other: 10 };

export function getInitialRelationship(memberA, memberB) {
  const sameUnit = Object.values(UNITS).some(
    (unit) => unit.members.includes(memberA.id) && unit.members.includes(memberB.id),
  );
  if (sameUnit) return INITIAL_RELATIONSHIP.sameUnit;
  if (memberA.generation === memberB.generation) return INITIAL_RELATIONSHIP.sameGeneration;
  return INITIAL_RELATIONSHIP.other;
}
