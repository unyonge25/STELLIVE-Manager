// tools/events.mjs — 스토리 이벤트 콘텐츠 개발 도구 (게임 실행에는 쓰지 않는다)
//
//   node tools/events.mjs validate            content/events/**/*.json 전체 검사 (오류가 있으면 종료 코드 1)
//   node tools/events.mjs build               검사 통과 시 js/story-content.js 생성
//   node tools/events.mjs stats               카테고리 / 메타 조합 분포 (다양성 확인)
//   node tools/events.mjs balance [횟수]       이벤트마다 무작위로 끝까지 진행해 평균 보상을 재고, 기존 이벤트 대비 튀는 것을 알려준다
//   node tools/events.mjs prompt <category> [개수] [--member <id>]
//                                             LLM 에게 줄 생성 프롬프트를 tools/out/prompt.md 로 저장
//   node tools/events.mjs generate <category> [개수] [--member <id>]
//                                             같은 프롬프트로 Claude API 를 호출해 결과를 content/inbox/ 에 저장 (선택, cd tools && npm install 필요)
//   node tools/events.mjs playtest [id...]     모든 경로(선택지 × 판정 결과)를 실제 엔진으로 끝까지 진행 + 저장/불러오기 확인
//   node tools/events.mjs import [--allow-similar] [--replace]
//                                             content/inbox/*.json (최상위 파일만, LLM 결과) → 검사 → 통과분은 content/events/<category>/ 로,
//                                             실패분은 content/rejected/ 로 옮기고(이유 파일 포함) 다시 build
//
// 흐름: prompt → (LLM 이 JSON 작성) → content/inbox 에 저장 → import → 게임에서 확인 → 커밋

import { readdirSync, readFileSync, writeFileSync, mkdirSync, renameSync, existsSync, statSync, unlinkSync } from 'node:fs';
import { join, relative, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT_DIR = join(ROOT, 'content', 'events');
const INBOX_DIR = join(ROOT, 'content', 'inbox');
const REJECTED_DIR = join(ROOT, 'content', 'rejected');
const OUTPUT_FILE = join(ROOT, 'js', 'story-content.js');
const OUT_DIR = join(ROOT, 'tools', 'out');

const js = (file) => new URL(`../js/${file}`, import.meta.url);
const schema = await import(js('story-schema.js'));
const E = await import(js('events.js'));
const { MEMBERS, TRAITS, UNITS } = await import(js('members.js'));
const D = await import(js('economy-data.js'));

const rel = (path) => relative(ROOT, path).replaceAll('\\', '/');

/* ===================== 파일 읽기 ===================== */

// recursive: false 면 그 폴더의 파일만 (inbox 는 처리 완료 폴더 done/ 을 다시 읽지 않는다)
function listJson(dir, { recursive = true } = {}) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return recursive ? listJson(path) : [];
    return name.endsWith('.json') ? [path] : [];
  });
}

// 파일 하나에 이벤트 1개(객체) 또는 여러 개(배열)
function readEvents(files) {
  const items = [];
  const parseErrors = [];
  files.forEach((file) => {
    try {
      const data = JSON.parse(readFileSync(file, 'utf8'));
      (Array.isArray(data) ? data : [data]).forEach((event) => items.push({ file, event }));
    } catch (error) {
      parseErrors.push(`${rel(file)}: JSON 형식 오류 — ${error.message}`);
    }
  });
  return { items, parseErrors };
}

function context() {
  // 기존(1단계) 이벤트 id 는 참조 / 중복 검사에 쓴다.
  return E.buildStoryContext();
}

function validateAll(items, extraKnown = []) {
  const ctx = context();
  ctx.knownEventIds = [...ctx.knownEventIds, ...extraKnown];
  const events = items.map((item) => item.event);
  const { results, similar } = schema.validateStoryCollection(events, ctx);
  const report = items.map((item) => ({ ...item, ...results.get(item.event) }));
  return { report, similar };
}

function printReport(report, parseErrors = []) {
  let errorCount = parseErrors.length;
  parseErrors.forEach((line) => console.log(`  ✘ ${line}`));
  report.forEach(({ file, event, errors, warnings }) => {
    const name = `${rel(file)} (${event?.id || 'id 없음'})`;
    if (errors.length === 0) console.log(`  ✔ ${name}${warnings.length ? ` — 경고 ${warnings.length}` : ''}`);
    else console.log(`  ✘ ${name}`);
    errors.forEach((line) => console.log(`      오류: ${line}`));
    warnings.forEach((line) => console.log(`      경고: ${line}`));
    errorCount += errors.length;
    // 폴더와 카테고리가 다르면 알려준다 (게임 동작에는 영향 없음)
    const folder = basename(dirname(file));
    if (file.startsWith(CONTENT_DIR) && event?.category && folder !== event.category) {
      console.log(`      경고: 폴더(${folder})와 category(${event.category})가 다르다`);
    }
  });
  return errorCount;
}

/* ===================== 명령 ===================== */

function cmdValidate() {
  const { items, parseErrors } = readEvents(listJson(CONTENT_DIR));
  console.log(`\n스토리 이벤트 ${items.length}개 검사 (${rel(CONTENT_DIR)})`);
  const { report } = validateAll(items);
  const errorCount = printReport(report, parseErrors);
  console.log(errorCount ? `\n❌ 오류 ${errorCount}개` : '\n✅ 모두 통과');
  return errorCount;
}

function cmdBuild() {
  if (cmdValidate() > 0) {
    console.log('오류가 있어 js/story-content.js 를 만들지 않았다.');
    return 1;
  }
  const { items } = readEvents(listJson(CONTENT_DIR));
  const events = items
    .map((item) => item.event)
    .sort((a, b) => schema.VOCAB.category.indexOf(a.category) - schema.VOCAB.category.indexOf(b.category) || a.id.localeCompare(b.id));
  const body = [
    '// story-content.js — 자동 생성 파일. 직접 고치지 말 것.',
    '// 원본: content/events/**/*.json → node tools/events.mjs build',
    `// 이벤트 ${events.length}개`,
    `export const STORY_EVENTS = ${JSON.stringify(events, null, 2)};`,
    '',
  ].join('\n');
  writeFileSync(OUTPUT_FILE, body, 'utf8');
  console.log(`\n→ ${rel(OUTPUT_FILE)} 생성 (${events.length}개)`);
  return 0;
}

function cmdStats() {
  const { items } = readEvents(listJson(CONTENT_DIR));
  const events = items.map((item) => item.event);
  const coverage = schema.metaCoverage(events);
  console.log(`\n스토리 이벤트 ${events.length}개`);
  Object.entries(coverage).forEach(([key, map]) => {
    console.log(`\n[${key}]`);
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .forEach(([value, count]) => console.log(`  ${String(count).padStart(3)}  ${value}`));
  });
  const signatures = {};
  events.forEach((event) => { signatures[schema.storySignature(event)] = (signatures[schema.storySignature(event)] || 0) + 1; });
  const repeated = Object.entries(signatures).filter(([, count]) => count > 1);
  console.log(`\n[구조 조합 theme|conflict|resolution] 서로 다른 조합 ${Object.keys(signatures).length}개`);
  repeated.forEach(([signature, count]) => console.log(`  ${count}회: ${signature}`));
  const similar = schema.findSimilarEvents(events);
  console.log(`\n[비슷한 이벤트] ${similar.length}쌍`);
  similar.forEach(({ a, b, reason }) => console.log(`  ${a.id} ↔ ${b.id}: ${reason}`));
  return 0;
}

// 덜 쓰인 conflict × resolution 조합을 골라 LLM 에게 권한다. (다양성)
function suggestCombos(events, category, count) {
  const used = {};
  events.filter((event) => event.category === category).forEach((event) => {
    const key = `${event.meta.conflict}|${event.meta.resolution}`;
    used[key] = (used[key] || 0) + 1;
  });
  const combos = [];
  schema.VOCAB.conflict.forEach((conflict) => schema.VOCAB.resolution.forEach((resolution) => {
    combos.push({ conflict, resolution, used: used[`${conflict}|${resolution}`] || 0, roll: Math.random() });
  }));
  return combos.sort((a, b) => a.used - b.used || a.roll - b.roll).slice(0, count);
}

const CONDITION_HELP = {
  day: '정확히 이 날 (숫자)',
  minDay: '이 날 이후', maxDay: '이 날 이전', dayOfWeek: '주의 몇 번째 날 1~7 (숫자 또는 배열)',
  minFans: '팬 수 이상', minFame: '명성 이상', maxFame: '명성 이하', minMoney: '돈 이상', maxMoney: '돈 이하',
  maxHp: '주인공 HP 이하 (피곤 59 / 탈진 29)', minHp: '주인공 HP 이상',
  requiredFlags: '전역 플래그가 모두 켜져 있을 때 ["flag"]', blockedFlags: '전역 플래그가 모두 꺼져 있을 때',
  memberFlags: '주인공 개인 플래그가 모두 켜져 있을 때', blockedMemberFlags: '주인공 개인 플래그가 모두 꺼져 있을 때',
  activity: '오늘 일정 id 중 하나 (예: ["recording"])',
  activityCategories: '오늘 일정 카테고리 중 하나라도 있을 때', blockedActivityCategories: '오늘 일정 카테고리가 하나도 없을 때',
  requiredTraits: '주인공이 태그를 모두 가질 때', anyTraits: '주인공이 태그 중 하나라도 가질 때', blockedTraits: '주인공이 태그를 하나도 안 가질 때',
  cooldown: '마지막 발생 후 N일', afterEventId: '다른 이벤트 발생 후 { "id", "minDays" }',
  minRelationship: '주인공과 관계도 N 이상인 멤버가 있을 때', minStat: '주인공 스탯 { "Vc": 85 }',
  investmentStatus: '장기 투자 상태 { "id", "status": "active|success|fail|none" }',
  holdsStock: '주식 보유 (true 또는 종목 코드)', minShopLevel: '상점 레벨 { "itemId": 레벨 }',
  partyMinRelationship: '참여 멤버 평균 관계도 N 이상 (콜라보 스토리의 분기 / 문장 조건에서만 의미 있음)',
  withMember: '참여 멤버 중에 이 멤버가 있을 때 (id 또는 배열)',
  storyResult: '이전 스토리 결말 { "id", "result": "success|partial|fail|neutral" 또는 배열 }',
};

// 프롬프트 인자: <category> [개수] [--member id] → { category, count, memberId } (잘못되면 null)
function parsePromptArgs(args) {
  const category = args[0];
  const count = Number(args[1]) || 5;
  const memberIndex = args.indexOf('--member');
  const memberId = memberIndex >= 0 ? args[memberIndex + 1] : null;
  if (!schema.VOCAB.category.includes(category)) {
    console.log(`카테고리를 지정하자: ${schema.VOCAB.category.join(' | ')}`);
    return null;
  }
  if (memberId && !MEMBERS.some((member) => member.id === memberId)) {
    console.log(`존재하지 않는 멤버: ${memberId}`);
    return null;
  }
  return { category, count, memberId };
}

function cmdPrompt(args) {
  const parsed = parsePromptArgs(args);
  if (!parsed) return 1;
  const text = buildPrompt(parsed);
  mkdirSync(OUT_DIR, { recursive: true });
  const file = join(OUT_DIR, 'prompt.md');
  writeFileSync(file, text, 'utf8');
  console.log(`→ ${rel(file)} 저장. 이 내용을 LLM 에게 주고, 받은 JSON 을 content/inbox/ 에 저장한 뒤 import 하자.`);
  console.log('   (API 로 바로 만들려면: node tools/events.mjs generate <category> [개수])');
  return 0;
}

function buildPrompt({ category, count, memberId }) {

  const { items } = readEvents(listJson(CONTENT_DIR));
  const existing = items.map((item) => item.event);
  const example = existing.find((event) => event.category === category) || existing[0];
  const combos = suggestCombos(existing, category, count + 3);
  const ctx = context();
  const unitOf = (id) => Object.values(UNITS).filter((unit) => unit.members.includes(id)).map((unit) => unit.name).join(', ');

  const lines = [];
  lines.push(`# STELLIVE Manager 스토리 이벤트 생성 요청 — ${category} × ${count}개`);
  lines.push('');
  lines.push('너는 VTuber 소속사 경영 시뮬레이션 게임 "STELLIVE Manager"(비공식 팬 게임)의 이벤트 작가다.');
  lines.push('게임 규칙(판정 / 효과 적용 / 확률)은 게임 엔진이 담당한다. 너는 정해진 형식의 JSON 으로 "이야기"만 쓴다.');
  lines.push('');
  lines.push('## 출력 규칙');
  lines.push(`- JSON 배열 하나만 출력한다. 설명 문장, 마크다운 코드 블록 표시 없이 [ ... ] 만.`);
  lines.push(`- 이벤트 ${count}개. 모두 category 는 "${category}".`);
  lines.push('- id 는 "st_' + category + '_" 로 시작하는 영문 소문자 / 숫자 / _ 조합. 기존 id 와 겹치면 안 된다.');
  lines.push('- 허용된 키 외의 키를 만들지 않는다. 아래 목록에 없는 멤버 / 스탯 / 태그 / 조건 / 효과 / 종목 / 투자는 쓰지 않는다.');
  lines.push('- 실존 인물의 사생활, 비공개 정보, 실제 사건을 지어내지 않는다. 멤버 특징은 아래 태그(공개된 방송 스타일)만 참고한다.');
  lines.push('- 문장은 한국어, 3인칭 서술. 치환어는 {member}(주인공), {partners}(콜라보 파트너)만 쓴다.');
  lines.push('- 모든 이벤트는 여러 단계(최소: 상황 → 선택 → 판정 → 결과 스토리 → 결말)로 진행되어야 한다.');
  lines.push('- 선택지마다 이야기의 흐름이 실제로 달라져야 한다 (다른 노드, 다른 난이도, 다른 위험 / 보상). 선택지 결과가 숫자만 다른 것은 안 된다.');
  lines.push('- 판정(check)에는 성공(success) / 부분성공(partial) / 실패(fail) 이야기를 모두 쓴다. 대성공(great)은 선택.');
  lines.push('- 결과는 숫자가 아니라 장면으로 보여준다. 예: "마지막 순간 역전에 성공했다. 분위기를 그대로 끌어올리며 결승에 올랐다."');
  lines.push('');
  lines.push('## 이벤트 형식');
  lines.push('```');
  lines.push(`{
  "id": "st_${category}_...", "title": "40자 이하", "category": "${category}",
  "description": "220자 이하 한 줄 요약",
  "meta": { "theme": 허용값, "setting": "영문 짧은 장소/상황", "conflict": 허용값, "resolution": 허용값, "activity": "영문 짧은 활동", "tone": 허용값 },
  "conditions": { 조건 },            // 선택: 언제 등장하는지
  "weight": 1,                      // 선택: 0~5
  "activityWeights": { "game": 2 }, // 선택: 이 일정 카테고리에서 더 자주
  "traitWeights": { "fps": 2 },     // 선택: 이 태그를 가진 멤버에게 더 자주
  "memberId": "멤버 id",            // 선택: 특정 멤버 전용
  "collab": { "min": 2, "max": 3 }, // 선택: 콜라보(플레이어가 파트너 선택)
  "once": true, "urgent": true,     // 선택: 한 번만 / 후속이라 우선 등장
  "start": "첫 노드 id",
  "steps": { "노드 id": 노드, ... }
}`);
  lines.push('```');
  lines.push('노드 종류:');
  lines.push('- story  : { "type": "story", "text": 문장, "effects"?: 효과, "next": "다음 노드" }');
  lines.push('- choice : { "type": "choice", "text": 상황 문장, "choices": [ { "text": "90자 이하 선택지", "story"?: "고른 직후 이야기", "conditions"?: 조건, "effects"?: 효과, "next": "노드" } ] } — 1~4개, 조건 없는 선택지 최소 1개');
  lines.push(`- check  : { "type": "check", "text": 상황 문장, "check": { "stat": "Bs|Ga|Vc", "difficulty": ${schema.LIMITS.minDifficulty}~${schema.LIMITS.maxDifficulty}, "traitBonus"?: { "태그": 0~${schema.LIMITS.maxTraitBonus} } }, "outcomes": { "great"?, "success", "partial", "fail": { "text", "effects"?, "next" } } }`);
  lines.push('- branch : { "type": "branch", "branches": [ { "when": 조건, "next": "노드" } ], "next": "기본 노드" } — 화면에 보이지 않는 자동 분기 (HP / 관계도 / 스탯 / 플래그에 따라 다른 장면)');
  lines.push('- end    : { "type": "end", "text": 결말 문장, "result": "success|partial|fail|neutral", "effects"?: 효과 }');
  lines.push('- 문장은 문자열 또는 상황별 문장 배열 [ { "when": 조건, "text": "..." }, { "text": "기본 문장" } ] (마지막은 when 없는 기본 문장)');
  lines.push('- 노드는 순환하면 안 되고, 모든 경로가 end 로 끝나야 하며, 모든 노드는 start 에서 도달 가능해야 한다.');
  lines.push(`- 노드 수 ${schema.LIMITS.maxSteps}개 이하, 가장 긴 경로 ${schema.LIMITS.maxDepth}단계 이하 권장. 보통 8~16개.`);
  lines.push('');
  lines.push('## 판정 난이도 감각');
  lines.push('성공률 = 50 + (참여 멤버 평균 스탯 - difficulty) × 2 + 태그 보너스 - 피로 페널티 (+ 콜라보 관계도 보너스), 5~95%.');
  lines.push('멤버 스탯은 대략 66~94. 쉬운 판정 66~70, 보통 72~76, 어려운 판정 80~86. 위험한 선택일수록 어렵게, 대신 결말 보상을 크게.');
  lines.push('');
  lines.push('## 효과 (허용 키와 한도)');
  lines.push(`- money: 정수 ±${schema.EFFECT_LIMITS.money} / fans: 정수 ±${schema.EFFECT_LIMITS.fans} / fame: 정수 ±${schema.EFFECT_LIMITS.fame}`);
  lines.push(`- hp: 정수 ±${schema.EFFECT_LIMITS.hp} (참여 멤버 전원) / stats: { "Bs"|"Ga"|"Vc": ±${schema.EFFECT_LIMITS.stat} } / relationship: ±${schema.EFFECT_LIMITS.relationship} (참여 멤버끼리)`);
  lines.push('- flags: { "이름": true/false } (전역) / memberFlags: { "이름": true/false } (참여 멤버) — 후속 이벤트 조건에 쓴다');
  lines.push('- team: { "hp"?, "stats"? } (전 멤버) / stockEffect: { "ticker", "percentage": ±10 } / startInvestment: "투자 id"');
  lines.push('보상 기준 (한 이벤트에서 한 경로로 받는 합계 — 기존 이벤트와 밸런스를 맞춘 값이다):');
  lines.push('- 좋은 결말: fans 120~220, fame 1~2 / 보통 결말: fans 60~110, fame 0~1 / 나쁜 결말: fans 0~40 (마이너스도 가능)');
  lines.push('- 콜라보 이벤트는 위 값의 1.3배까지. 중간 판정 보상은 결말 보상의 1/3 이하.');
  lines.push('- hp 소모는 한 이벤트에 -3~-12. 돈 보상은 사업 / 대회 이벤트에서만 30,000~150,000, 비용은 -30,000~-150,000.');
  lines.push('- stats 상승은 한 경로에 합계 +1~2, fame 은 최대 +2. 보상이 크면 그만큼 어려운 판정이나 비용을 거쳐야 한다.');
  lines.push('');
  lines.push('## 허용 값');
  Object.entries(schema.VOCAB).forEach(([key, values]) => lines.push(`- ${key}: ${values.join(', ')}`));
  lines.push(`- 스탯: ${ctx.statKeys.join(', ')} (Bs=방송, Ga=게임, Vc=노래)`);
  lines.push(`- 일정 카테고리: ${ctx.activityCategories.join(', ')}`);
  lines.push(`- 일정 id: ${ctx.activityIds.join(', ')}`);
  lines.push(`- 종목: ${ctx.tickers.join(', ')} / 투자: ${ctx.investmentIds.join(', ')}`);
  lines.push('');
  lines.push('## 조건 키');
  ctx.conditionKeys.forEach((key) => lines.push(`- ${key}: ${CONDITION_HELP[key] || ''}`));
  lines.push('');
  lines.push('## 멤버 (이 11명만 사용)');
  MEMBERS.forEach((member) => {
    const traits = member.traits.map((trait) => `${trait}(${TRAITS[trait]?.label || trait})`).join(', ');
    lines.push(`- ${member.id}: ${member.name} — ${member.generation}기, ${unitOf(member.id) || member.unit}, 태그: ${traits}`);
  });
  lines.push(`- 전체 태그: ${Object.entries(TRAITS).map(([id, def]) => `${id}(${def.label})`).join(', ')}`);
  lines.push('멤버마다 말투 / 역할이 같아지지 않게, 주인공 태그에 맞는 장면을 문장 조건(anyTraits)이나 traitBonus 로 살린다.');
  if (memberId) lines.push(`\n이번 요청은 모두 memberId "${memberId}" 전용 이벤트로 만든다.`);
  lines.push('');
  lines.push('## 활동별 진행 구조 예시 (같은 카테고리라도 구조를 다양하게)');
  lines.push('- FPS: 초반 라운드 → 교전 → 클러치 → 최종 라운드');
  lines.push('- AOS(MOBA): 라인전 → 오브젝트 → 한타 → 역전 → 승리/패배');
  lines.push('- 배틀로얄: 파밍 → 교전 → 지역 장악 → 최종 생존');
  lines.push('- 음악: 곡 방향 → 작곡 / 편곡 → 녹음 → 수정 → 공개 → 반응');
  lines.push('- 방송: 기획 → 준비 → 방송 → 돌발 상황 → 대처 → 시청자 반응');
  lines.push('- 사업: 제안 → 협상 → 준비 → 결과물 → 평가');
  lines.push('');
  lines.push('## 다양성 — 이번에는 아래 conflict × resolution 조합을 우선 사용한다 (적게 쓰인 순)');
  combos.forEach(({ conflict, resolution, used }) => lines.push(`- ${conflict} × ${resolution} (현재 ${used}회)`));
  lines.push('');
  lines.push('## 이미 있는 이벤트 (제목 / 구조가 겹치지 않게)');
  existing.forEach((event) => lines.push(`- ${event.id}: ${event.title} [${schema.storySignature(event)} / ${event.meta.setting}]`));
  lines.push('');
  lines.push('## 완성 예시');
  lines.push(JSON.stringify(example, null, 2));
  return lines.join('\n');
}

/* ===================== LLM 으로 생성 (개발용, 선택) ===================== */

// Claude API 로 이벤트 JSON 을 만들어 content/inbox/ 에 저장한다. 게임은 이 결과를 직접 쓰지 않는다:
// 반드시 import(검증 → 유사도 검사 → build)를 거쳐야 게임에 들어간다.
// 준비: cd tools && npm install  (인증: ANTHROPIC_API_KEY 또는 `ant auth login`)
export const GENERATE_RULES = { model: 'claude-opus-5', maxTokens: 64000 };

function extractJsonArray(text) {
  const cleaned = text.replace(/```(?:json)?/g, '');
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start < 0 || end <= start) return null;
  try {
    const data = JSON.parse(cleaned.slice(start, end + 1));
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

async function cmdGenerate(args) {
  const parsed = parsePromptArgs(args);
  if (!parsed) return 1;

  let Anthropic;
  try {
    ({ default: Anthropic } = await import('@anthropic-ai/sdk'));
  } catch {
    console.log('Anthropic SDK 가 없다. 먼저 실행: cd tools && npm install');
    return 1;
  }

  const prompt = buildPrompt(parsed);
  const client = new Anthropic();
  console.log(`${GENERATE_RULES.model} 에게 ${parsed.category} 이벤트 ${parsed.count}개를 요청한다... (몇 분 걸릴 수 있다)`);

  let message;
  try {
    // 출력이 길어 스트리밍으로 받는다. 거절(refusal) 시 서버가 다른 모델로 다시 시도하도록 fallbacks 를 켠다.
    const stream = client.beta.messages.stream({
      model: GENERATE_RULES.model,
      max_tokens: GENERATE_RULES.maxTokens,
      thinking: { type: 'adaptive' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      messages: [{ role: 'user', content: prompt }],
    });
    message = await stream.finalMessage();
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) console.log('인증 실패 (401): API 키가 잘못됐거나 만료됐다. 키를 확인하자.');
    else if (error instanceof Anthropic.PermissionDeniedError) console.log(`권한 없음 (403): 이 키로 ${GENERATE_RULES.model} 을 쓸 수 없다. ${error.message}`);
    else if (error instanceof Anthropic.RateLimitError) console.log('요청 한도 초과 (429): 잠시 뒤 다시 시도하자.');
    else if (error instanceof Anthropic.APIError) console.log(`API 오류 ${error.status}: ${error.message}`);
    else if (error instanceof Anthropic.AnthropicError) {
      // 네트워크 요청 전에 SDK 가 인증 수단을 찾지 못한 경우 등 (API 호출은 일어나지 않았다)
      console.log(`요청을 보내지 못했다 (API 호출 없음): ${error.message}`);
      console.log('인증 수단이 필요하다: ANTHROPIC_API_KEY 환경 변수를 설정하거나, ant CLI 설치 후 `ant auth login`.');
    } else console.log(`요청 실패: ${error.message}`);
    return 1;
  }

  if (message.stop_reason === 'refusal') {
    console.log(`요청이 거절됐다 (${message.stop_details?.category || '분류 없음'}): ${message.stop_details?.explanation || ''}`);
    return 1;
  }
  const text = message.content.filter((block) => block.type === 'text').map((block) => block.text).join('\n');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  mkdirSync(INBOX_DIR, { recursive: true });

  const events = extractJsonArray(text);
  if (!events) {
    const file = join(OUT_DIR, `generate_failed_${stamp}.txt`);
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(file, text, 'utf8');
    console.log(`JSON 배열을 읽지 못했다${message.stop_reason === 'max_tokens' ? ' (출력이 잘렸다 — 개수를 줄이자)' : ''}. 원문: ${rel(file)}`);
    return 1;
  }
  const file = join(INBOX_DIR, `gen_${parsed.category}_${stamp}.json`);
  writeFileSync(file, `${JSON.stringify(events, null, 2)}\n`, 'utf8');
  console.log(`→ ${rel(file)} 저장 (${events.length}개, 출력 토큰 ${message.usage.output_tokens})`);
  console.log('다음: node tools/events.mjs import   (검증 / 유사도 검사 / build 를 거쳐 통과한 것만 게임에 들어간다)');
  return 0;
}

function cmdImport(args) {
  const allowSimilar = args.includes('--allow-similar');
  // --replace: 이미 있는 id 의 수정본으로 교체한다. (검증 / 유사도 검사 / build / 플레이 테스트는 그대로 거친다)
  const replace = args.includes('--replace');
  const inboxFiles = listJson(INBOX_DIR, { recursive: false });
  if (inboxFiles.length === 0) {
    console.log(`${rel(INBOX_DIR)} 에 가져올 JSON 이 없다.`);
    return 0;
  }
  const { items: existingItems } = readEvents(listJson(CONTENT_DIR));
  const existingFileOf = new Map(existingItems.map((item) => [item.event.id, item.file]));
  const { items, parseErrors } = readEvents(inboxFiles);
  const replacingIds = replace ? [...new Set(items.map((item) => item.event?.id).filter((id) => existingFileOf.has(id)))] : [];
  // 교체 대상의 옛 버전은 중복 검사 / 유사도 비교에서 뺀다.
  const existingIds = existingItems.map((item) => item.event.id).filter((id) => !replacingIds.includes(id));
  console.log(`\n새 이벤트 ${items.length}개 검사${replacingIds.length ? ` (교체 ${replacingIds.length}개: ${replacingIds.join(', ')})` : ''}`);

  // 새 이벤트끼리 + 기존 이벤트와 함께 검사 (기존 스토리 id 는 중복으로 잡는다)
  const { report } = validateAll(items, existingIds);
  const errorCount = printReport(report, parseErrors);

  // 기존 이벤트와의 유사도: 같은 구조 + 같은 setting 이거나 문장이 너무 비슷하면 거절
  const existingEvents = existingItems.map((item) => item.event).filter((event) => !replacingIds.includes(event.id));
  mkdirSync(REJECTED_DIR, { recursive: true });
  let accepted = 0;
  const acceptedIds = [];
  let rejected = 0;
  report.forEach(({ file, event, errors }) => {
    const reasons = errors.map((line) =>
      !replace && existingFileOf.has(event?.id) && line.includes('기존 이벤트와 id 가 겹친다') ? `${line} — 수정본이면 --replace` : line,
    );
    const oldFile = replacingIds.includes(event?.id) ? existingFileOf.get(event.id) : null;
    // 한 파일에 여러 이벤트가 든 경우는 교체하지 않는다. (다른 이벤트까지 지워질 수 있다)
    if (oldFile && Array.isArray(JSON.parse(readFileSync(oldFile, 'utf8')))) {
      reasons.push(`${rel(oldFile)} 에는 여러 이벤트가 들어 있어 --replace 로 바꿀 수 없다`);
    }
    if (reasons.length === 0 && !allowSimilar) {
      schema.findSimilarEvents([...existingEvents, event]).filter(({ b }) => b === event).forEach(({ a, reason }) => {
        reasons.push(`기존 이벤트 ${a.id} 와 너무 비슷하다 (${reason}) — 괜찮다면 --allow-similar`);
      });
    }
    const name = event?.id || basename(file, '.json');
    if (reasons.length > 0) {
      writeFileSync(join(REJECTED_DIR, `${name}.json`), JSON.stringify(event, null, 2), 'utf8');
      writeFileSync(join(REJECTED_DIR, `${name}.errors.txt`), reasons.join('\n'), 'utf8');
      rejected += 1;
      return;
    }
    const dir = join(CONTENT_DIR, event.category);
    const target = join(dir, `${event.id}.json`);
    mkdirSync(dir, { recursive: true });
    // 카테고리가 바뀐 교체는 옛 위치의 파일을 지운다.
    if (oldFile && oldFile !== target) unlinkSync(oldFile);
    writeFileSync(target, `${JSON.stringify(event, null, 2)}\n`, 'utf8');
    if (oldFile) console.log(`  ↻ ${event.id} 교체 (${rel(oldFile)} → ${rel(target)})`);
    existingEvents.push(event);
    acceptedIds.push(event.id);
    accepted += 1;
  });
  // 처리한 inbox 파일은 보관 폴더로 옮긴다.
  const doneDir = join(INBOX_DIR, 'done');
  mkdirSync(doneDir, { recursive: true });
  inboxFiles.forEach((file) => renameSync(file, join(doneDir, `${Date.now()}_${basename(file)}`)));

  console.log(`\n통과 ${accepted}개 → ${rel(CONTENT_DIR)}/<category>/ · 거절 ${rejected}개 → ${rel(REJECTED_DIR)}/ (이유는 .errors.txt)`);
  if (parseErrors.length) console.log(`JSON 형식 오류 파일 ${parseErrors.length}개는 ${rel(doneDir)} 에서 확인하자.`);
  if (errorCount && !accepted) return 1;
  if (accepted === 0) return 0;
  if (cmdBuild()) return 1;
  // 새 이벤트를 실제 엔진으로 모든 경로 진행 (build 된 파일을 읽어야 하므로 새 프로세스에서)
  console.log('\n새 이벤트 플레이 테스트');
  const result = spawnSync(process.execPath, [fileURLToPath(import.meta.url), 'playtest', ...acceptedIds], { encoding: 'utf8' });
  process.stdout.write(result.stdout || '');
  if (result.status !== 0) {
    console.log('플레이 테스트에서 오류가 났다. 해당 이벤트를 고치거나 content/events/ 에서 빼고 다시 build 하자.');
    return 1;
  }
  return 0;
}

/* ===================== 밸런스 점검 ===================== */

// 각 스토리 이벤트를 무작위 선택 / 판정으로 여러 번 끝까지 진행해 평균 보상을 잰다.
// 기존(1단계) 중요 이벤트 평균과 비교해 지나치게 크거나 작은 이벤트를 알려준다. (게임 데이터는 바꾸지 않는다)
export const BALANCE_RULES = { trials: 300, maxFansRatio: 1.8, maxFameRatio: 2.5, maxMoney: 150000, minFansRatio: 0.3 };

async function measureRewards(events, trials) {
  const S = await import(js('state.js'));
  const A = await import(js('actions.js'));
  const ST = await import(js('story.js'));
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const sum = (deltas, key) => deltas.filter((d) => d.key === key && !d.owners && !d.team).reduce((total, d) => total + d.delta, 0);

  const play = (event) => {
    const state = S.createInitialState(MEMBERS);
    state.currentDay = 10;
    const host = event.memberId ? MEMBERS.find((member) => member.id === event.memberId) : pick(MEMBERS);
    state.schedule = state.members.map((member) => ({
      memberId: member.id,
      activityId: 'chat',
      kind: member.id === host.id ? (event.collab ? 'collab' : 'important') : 'routine',
      eventId: member.id === host.id ? event.id : null,
      done: false,
    }));
    S.setSelectedMember(host.id);
    S.setCurrentEvent(event);
    S.setCollabPartners(event.collab ? state.members.filter((m) => m.id !== host.id).slice(0, event.collab.min - 1).map((m) => m.id) : []);
    if (ST.startStory(state, event, host.id)) {
      for (let step = 0; step < 80 && !state.storyRun.finished; step += 1) {
        const node = ST.getStoryNode(state);
        const action = node.type === 'story' ? { type: 'continue' } : node.type === 'check' ? { type: 'roll' } : { type: 'choose', index: pick(ST.getStoryChoices(state)).index };
        if (!ST.advanceStory(state, action)) break;
      }
    } else {
      A.resolveChoice(state, pick(E.getAvailableChoices(event, state, host.id)).choice);
    }
    const deltas = state.logs.flatMap((log) => log.deltas || []);
    return { fans: sum(deltas, 'fans'), fame: sum(deltas, 'fame'), money: sum(deltas, 'money') };
  };

  return events.map((event) => {
    const total = { fans: 0, fame: 0, money: 0 };
    for (let i = 0; i < trials; i += 1) {
      const result = play(event);
      Object.keys(total).forEach((key) => { total[key] += result[key]; });
    }
    return { event, fans: total.fans / trials, fame: total.fame / trials, money: total.money / trials };
  });
}

async function cmdBalance(args) {
  const trials = Number(args[0]) || BALANCE_RULES.trials;
  const stories = E.EVENTS.filter(E.isStoryEvent);
  const classic = E.EVENTS.filter((event) => !E.isStoryEvent(event) && !event.collab && !event.forced);
  const baselineRows = await measureRewards(classic, Math.ceil(trials / 10));
  const base = {
    fans: baselineRows.reduce((s, r) => s + r.fans, 0) / baselineRows.length,
    fame: baselineRows.reduce((s, r) => s + r.fame, 0) / baselineRows.length,
  };
  console.log(`\n기존 중요 이벤트 평균 (${classic.length}개): 팬 ${base.fans.toFixed(0)} · 명성 ${base.fame.toFixed(2)}`);
  console.log(`스토리 이벤트 ${stories.length}개 × ${trials}회 (콜라보는 1.3배까지 허용)\n`);
  let flagged = 0;
  (await measureRewards(stories, trials)).forEach(({ event, fans, fame, money }) => {
    const allowance = event.collab ? 1.3 : 1;
    const notes = [];
    if (fans > base.fans * BALANCE_RULES.maxFansRatio * allowance) notes.push('팬 보상이 크다');
    if (fans < base.fans * BALANCE_RULES.minFansRatio) notes.push('팬 보상이 너무 작다');
    if (fame > base.fame * BALANCE_RULES.maxFameRatio * allowance) notes.push('명성 보상이 크다');
    if (Math.abs(money) > BALANCE_RULES.maxMoney) notes.push('돈 변화가 크다');
    if (notes.length) flagged += 1;
    console.log(`  ${notes.length ? '⚠' : '✔'} ${event.id.padEnd(34)} 팬 ${fans.toFixed(0).padStart(5)} (${(fans / base.fans).toFixed(1)}배) · 명성 ${fame.toFixed(2).padStart(5)} · 돈 ${Math.round(money).toLocaleString('ko-KR').padStart(9)}${notes.length ? `  ← ${notes.join(', ')}` : ''}`);
  });
  console.log(flagged ? `\n⚠ 확인이 필요한 이벤트 ${flagged}개 (게임은 동작하지만 밸런스가 어긋날 수 있다)` : '\n✅ 모두 기준 범위 안');
  return 0;
}

/* ===================== 플레이 테스트 (모든 경로) ===================== */

// 이벤트마다 가능한 모든 경로(선택지 × 판정 결과)를 실제 엔진으로 끝까지 진행한다.
//  - 주인공: 전용 이벤트면 그 멤버, 아니면 11명 전원 (태그 조건 선택지까지 확인)
//  - HP: 정상(85) / 피곤(45) 두 경우 (HP 분기 확인)
//  - 콜라보: 관계도 낮음 / 높음 두 경우 (관계도 분기 확인)
//  - 경로마다 결말 도달 / 기록 / 일정 완료를 확인하고, 첫 행동 직후 저장 → 불러오기 → 이어서 결말까지도 확인한다.
// 한 번도 도달하지 못한 노드는 경고한다. (플래그 조건 등으로 막힌 장면일 수 있다)
export const PLAYTEST_RULES = { maxPathsPerSetup: 400 };

async function cmdPlaytest(args) {
  const S = await import(js('state.js'));
  const ST = await import(js('story.js'));
  const A = await import(js('actions.js'));
  const SAVE = await import(js('save.js'));
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };

  const ids = args.filter((arg) => !arg.startsWith('--'));
  const events = E.EVENTS.filter(E.isStoryEvent).filter((event) => ids.length === 0 || ids.includes(event.id));
  if (ids.length && events.length !== ids.length) {
    console.log(`게임에 없는(검증 실패 / build 전) 이벤트: ${ids.filter((id) => !events.some((event) => event.id === id)).join(', ')}`);
    return 1;
  }

  const OUTCOMES = ['great', 'success', 'partial', 'fail'];
  // 판정 결과를 강제로 고르는 rng (성공률 5~95% 범위에서는 네 결과 모두 가능하다)
  const rngFor = (chance, outcome) => () => ({
    great: chance * A.CHECK_RULES.greatRatio * 0.5,
    success: chance * (A.CHECK_RULES.greatRatio + 1) / 2,
    partial: chance + (100 - chance) * ST.STORY_RULES.partialRatio * 0.5,
    fail: 99.9,
  }[outcome] / 100);

  const setup = (event, hostId, hp, relationship) => {
    const state = S.createInitialState(MEMBERS);
    state.currentDay = 10;
    state.members.forEach((member) => { member.hp = hp; });
    state.schedule = state.members.map((member) => ({
      memberId: member.id,
      activityId: 'chat',
      kind: member.id === hostId ? (event.collab ? 'collab' : 'important') : 'routine',
      eventId: member.id === hostId ? event.id : null,
      done: false,
    }));
    S.setSelectedMember(hostId);
    S.setCurrentEvent(event);
    S.setGamePhase(S.GAME_PHASE.EVENT);
    const partners = event.collab ? state.members.filter((m) => m.id !== hostId).slice(0, event.collab.min - 1).map((m) => m.id) : [];
    S.setCollabPartners(partners);
    partners.forEach((id) => S.setRelationship(hostId, id, relationship));
    ST.startStory(state, event, hostId);
    return state;
  };

  // decisions 를 따라 진행하다가 새 결정 지점을 만나면 { options } 를 돌려준다.
  const runPath = (event, hostId, hp, relationship, decisions, visited, { saveCheck = false } = {}) => {
    let state = setup(event, hostId, hp, relationship);
    let index = 0;
    let saved = false;
    for (let step = 0; step < 80; step += 1) {
      if (state.storyRun.finished) break;
      visited.add(state.storyRun.stepId);
      const node = ST.getStoryNode(state);
      let action;
      let options = null;
      if (node.type === 'story') action = { type: 'continue' };
      else if (node.type === 'choice') options = ST.getStoryChoices(state).map(({ index: i }) => ({ type: 'choose', index: i }));
      else options = OUTCOMES.map((outcome) => ({ type: 'roll', outcome }));
      if (options) {
        if (index >= decisions.length) return { options };
        action = decisions[index];
        index += 1;
      }
      const rng = action.type === 'roll' ? rngFor(ST.getStoryCheckChance(state), action.outcome) : undefined;
      if (!ST.advanceStory(state, action, rng)) throw new Error(`진행 거부 @${state.storyRun.stepId} (${JSON.stringify(action)})`);
      // 첫 행동 직후 저장 → 불러오기 → 같은 상태에서 이어서 진행
      if (saveCheck && !saved && !state.storyRun.finished) {
        saved = true;
        const before = { stepId: state.storyRun.stepId, beats: state.storyRun.transcript.length, fans: state.fans };
        if (!SAVE.saveGame(state)) throw new Error('저장 실패');
        state = SAVE.loadGame();
        const after = state?.storyRun;
        if (!after || after.stepId !== before.stepId || after.transcript.length !== before.beats || state.fans !== before.fans) {
          throw new Error(`불러오기 후 상태가 다르다 (${before.stepId} → ${after?.stepId})`);
        }
      }
    }
    if (!state.storyRun.finished) throw new Error(`결말에 도달하지 못함 @${state.storyRun.stepId}`);
    visited.add([...state.storyRun.transcript].reverse().find((beat) => beat.type === 'end') ? `end:${state.storyRun.result}` : 'end:?');
    const log = state.logs.at(-1);
    if (!log?.story || log.title !== event.title) throw new Error('결과 기록이 없다');
    if (!S.getScheduleEntry(hostId).done) throw new Error('일정이 완료되지 않았다');
    return { done: true, result: state.storyRun.result };
  };

  let failures = 0;
  console.log(`\n스토리 이벤트 ${events.length}개 플레이 테스트`);
  events.forEach((event) => {
    const hosts = event.memberId ? [event.memberId] : MEMBERS.map((member) => member.id);
    const visited = new Set();
    const results = {};
    let paths = 0;
    const problems = [];
    hosts.forEach((hostId) => {
      [85, 45].forEach((hp) => {
        (event.collab ? [5, 80] : [30]).forEach((relationship) => {
          const queue = [[]];
          let count = 0;
          while (queue.length && count < PLAYTEST_RULES.maxPathsPerSetup) {
            const decisions = queue.pop();
            try {
              const outcome = runPath(event, hostId, hp, relationship, decisions, visited);
              if (outcome.options) outcome.options.forEach((option) => queue.push([...decisions, option]));
              else {
                count += 1;
                results[outcome.result] = (results[outcome.result] || 0) + 1;
              }
            } catch (error) {
              problems.push(`${hostId}/hp${hp}: ${error.message}`);
              count += 1;
            }
          }
          paths += count;
        });
      });
      // 저장 / 불러오기: 주인공마다 한 경로
      try {
        const queue = [[]];
        for (let guard = 0; guard < 50 && queue.length; guard += 1) {
          const decisions = queue.shift();
          const outcome = runPath(event, hostId, 85, 50, decisions, new Set(), { saveCheck: true });
          if (outcome.options) queue.push([...decisions, outcome.options[0]]);
          else break;
        }
      } catch (error) {
        problems.push(`${hostId} 저장/불러오기: ${error.message}`);
      }
    });

    const unreached = Object.keys(event.steps).filter((stepId) => event.steps[stepId].type !== 'end' && event.steps[stepId].type !== 'branch' && !visited.has(stepId));
    const endResults = new Set(Object.values(event.steps).filter((node) => node.type === 'end').map((node) => node.result));
    const missingResults = [...endResults].filter((result) => !results[result]);
    if (problems.length) failures += 1;
    const mark = problems.length ? '✘' : unreached.length || missingResults.length ? '⚠' : '✔';
    console.log(`  ${mark} ${event.id.padEnd(34)} 경로 ${String(paths).padStart(5)} · 결말 ${JSON.stringify(results)}`);
    problems.slice(0, 5).forEach((line) => console.log(`      오류: ${line}`));
    if (unreached.length) console.log(`      경고: 한 번도 도달하지 못한 장면 ${unreached.join(', ')} (조건 / 플래그로 막혀 있을 수 있다)`);
    if (missingResults.length) console.log(`      경고: 도달하지 못한 결말 종류 ${missingResults.join(', ')}`);
  });
  console.log(failures ? `\n❌ 실행 오류가 있는 이벤트 ${failures}개` : '\n✅ 모든 경로가 결말까지 진행되고, 저장 / 불러오기 후에도 이어진다');
  return failures ? 1 : 0;
}

/* ===================== 실행 ===================== */

const [command, ...args] = process.argv.slice(2);
const commands = { validate: cmdValidate, build: cmdBuild, stats: cmdStats, prompt: cmdPrompt, generate: cmdGenerate, import: cmdImport, balance: cmdBalance, playtest: cmdPlaytest };
if (!commands[command]) {
  console.log('사용법: node tools/events.mjs <validate | build | stats | balance [횟수] | prompt <category> [개수] [--member id] | generate <category> [개수] [--member id] | import [--allow-similar] [--replace] | playtest [id...]>');
  process.exit(1);
}
process.exit((await commands[command](args)) ? 1 : 0);
