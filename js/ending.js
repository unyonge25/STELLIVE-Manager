// ending.js — Day 28 최종 평가 (점수 + 등급 + 업적)
// 점수 항목과 가중치, 등급 기준은 모두 데이터로 관리한다. (임시 수치)

import { MEMBERS, getInitialRelationship } from './members.js';
import { STAT_KEYS, INITIAL_MONEY, getNetWorth, pairKey } from './state.js';

export const ENDING_RULES = {
  // 점수 = Σ (값 / per) — 값이 음수면 감점
  score: {
    fans: { label: '팬', per: 150 },
    fame: { label: '명성', per: 2 },
    // 순자산 증감 (초기 자금 대비)
    netWorth: { label: '순자산 증감', per: 40000 },
    statGrowth: { label: '멤버 성장 (평균 스탯 증가)', per: 0.4 },
    relationship: { label: '멤버 관계 (평균 관계도 증가)', per: 0.5 },
    investments: { label: '투자 성공', perSuccess: 1 },
  },
  // 체인 / 특수 결과 업적 (전역 flags 기준)
  achievements: [
    { flag: 'concertSuccess', label: '합동 콘서트 성공', points: 15 },
    { flag: 'kannaLiveSuccess', label: '칸나 3D 라이브 성공', points: 8 },
    { flag: 'sponsorRenewed', label: '장기 스폰서 계약', points: 8 },
    { flag: 'lizeCoverHit', label: '리제 커버곡 흥행', points: 6 },
    { flag: 'bigProjectHit', label: '대형 프로젝트 성공', points: 5 },
  ],
  // 높은 기준부터 검사한다.
  grades: [
    { min: 330, grade: 'S', title: '전설의 매니저', desc: '스텔라이브의 한 달이 업계의 화제가 됐다. 모두가 다음 달을 기대하고 있다.' },
    { min: 250, grade: 'A', title: '믿음직한 매니저', desc: '멤버들도 팬들도 만족한 한 달. 채널이 눈에 띄게 성장했다.' },
    { min: 180, grade: 'B', title: '성실한 매니저', desc: '큰 사고 없이 착실하게 성장했다. 다음 달에는 더 과감한 도전도 해 보자.' },
    { min: 110, grade: 'C', title: '견습 매니저', desc: '아쉬운 부분도 있었지만 멤버들과 함께 한 달을 버텨냈다.' },
    { min: -Infinity, grade: 'D', title: '험난한 한 달', desc: '쉽지 않은 한 달이었다. 다음에는 멤버들의 컨디션과 자금을 더 챙겨 보자.' },
  ],
};

function averageStatGrowth(state) {
  const total = state.members.reduce((sum, member) => {
    const origin = MEMBERS.find((item) => item.id === member.id);
    if (!origin) return sum;
    return sum + STAT_KEYS.reduce((acc, key) => acc + (member.stats[key] - origin.stats[key]), 0);
  }, 0);
  return total / state.members.length;
}

function averageRelationshipGrowth(state) {
  let total = 0;
  let count = 0;
  MEMBERS.forEach((memberA, index) => {
    MEMBERS.slice(index + 1).forEach((memberB) => {
      total += (state.relationships[pairKey(memberA.id, memberB.id)] ?? 0) - getInitialRelationship(memberA, memberB);
      count += 1;
    });
  });
  return count > 0 ? total / count : 0;
}

// 최종 평가: { score, breakdown: [{ label, value, points }], achievements, grade }
export function evaluateEnding(state) {
  const rules = ENDING_RULES.score;
  const successes = state.investments.history.filter((item) => item.outcome === 'success').length;
  const values = {
    fans: state.fans,
    fame: state.fame,
    netWorth: getNetWorth(state) - INITIAL_MONEY,
    statGrowth: averageStatGrowth(state),
    relationship: averageRelationshipGrowth(state),
  };

  const breakdown = Object.entries(values).map(([key, value]) => ({
    key,
    label: rules[key].label,
    value,
    points: Math.round(value / rules[key].per),
  }));
  breakdown.push({
    key: 'investments',
    label: rules.investments.label,
    value: successes,
    points: successes * rules.investments.perSuccess,
  });

  const achievements = ENDING_RULES.achievements.filter((item) => state.flags[item.flag]);
  const score =
    breakdown.reduce((sum, item) => sum + item.points, 0) +
    achievements.reduce((sum, item) => sum + item.points, 0);
  const grade = ENDING_RULES.grades.find((item) => score >= item.min);

  return { score, breakdown, achievements, grade };
}
