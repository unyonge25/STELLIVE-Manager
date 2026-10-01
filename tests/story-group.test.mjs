// story-group.test.mjs — 스토리 group (변형 묶음) / import --replace / inbox done 재읽기 방지
// 실행: node tests/story-group.test.mjs

import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRunner, assert, MEMBERS, S, E, playGame } from './helpers.mjs';

const schema = await import(new URL('../js/story-schema.js', import.meta.url));
const { test, section, finish } = createRunner();
const ROOT = fileURLToPath(new URL('..', import.meta.url));

const clone = (value) => JSON.parse(JSON.stringify(value));
const ctx = () => E.buildStoryContext();

// 테스트 안에서만 쓰는 임시 group 이벤트 (끝나면 EVENTS 에서 뺀다)
function withTempGroup(fn, { weight = 1, cooldown = null, collab = false } = {}) {
  const base = clone(E.getEventById(collab ? 'st_collab_escape_room' : 'st_broadcast_screen_freeze'));
  const make = (suffix) => ({
    ...clone(base),
    id: `st_test_group_${suffix}`,
    title: `${base.title} (테스트 변형 ${suffix})`,
    group: 'test_group',
    weight,
    conditions: { activityCategories: ['broadcast'], ...(cooldown ? { cooldown } : {}) },
  });
  const events = [make('a'), make('b')];
  E.EVENTS.push(...events);
  try {
    return fn(...events);
  } finally {
    events.forEach((event) => E.EVENTS.splice(E.EVENTS.indexOf(event), 1));
  }
}

function freshState(day = 10) {
  const state = S.createInitialState(MEMBERS);
  state.currentDay = day;
  return state;
}
const candidateIds = (state, options = {}) =>
  E.collectCandidates(S.getMember('yuni'), state, { activity: E.getActivityById('chat'), ...options }).map((event) => event.id);

/* ===================== 1. 스키마 ===================== */
section('[1] group 필드 검사');

test('group 이 없는 이벤트 / 올바른 group 은 통과한다', () => {
  const event = clone(E.getEventById('st_music_cover_project'));
  assert(schema.validateStoryEvent(event, ctx()).errors.length === 0, '기본 이벤트 오류');
  event.group = 'growth_vocal_2';
  assert(schema.validateStoryEvent(event, ctx()).errors.length === 0, schema.validateStoryEvent(event, ctx()).errors.join(' | '));
});

[['대문자', 'Growth'], ['공백', 'growth vocal'], ['하이픈', 'growth-vocal'], ['빈 문자열', ''], ['숫자 값', 7], ['너무 김', 'a'.repeat(41)]].forEach(([name, value]) => {
  test(`거부: group ${name}`, () => {
    const event = clone(E.getEventById('st_music_cover_project'));
    event.group = value;
    assert(schema.validateStoryEvent(event, ctx()).errors.some((line) => line.includes('.group')), '오류 없음');
  });
});

/* ===================== 2. 엔진 ===================== */
section('[2] 같은 group 의 등장 제한');

test(`같은 group 이 나온 뒤 ${E.STORY_GROUP_RULES.blockDays}일 이내에는 같은 group 전체가 후보에서 빠진다`, () => {
  withTempGroup((a, b) => {
    const state = freshState(5);
    assert(candidateIds(state).includes(b.id), '처음에는 후보');
    state.eventHistory[a.id] = 5;
    for (let day = 5; day <= 5 + E.STORY_GROUP_RULES.blockDays; day += 1) {
      state.currentDay = day;
      const ids = candidateIds(state);
      assert(!ids.includes(a.id) && !ids.includes(b.id), `Day ${day} 에 후보`);
    }
    state.currentDay = 6 + E.STORY_GROUP_RULES.blockDays;
    assert(candidateIds(state).includes(b.id), '차단 기간 뒤에도 후보가 아니다');
  });
});

test(`차단이 끝난 뒤 ${E.STORY_GROUP_RULES.fadeDays}일 동안은 가중치에 ${E.STORY_GROUP_RULES.fadeFactor} 가 곱해지고, 그 뒤 원래대로`, () => {
  withTempGroup((a, b) => {
    const state = freshState(1);
    state.eventHistory[a.id] = 1;
    const { blockDays, fadeDays, fadeFactor } = E.STORY_GROUP_RULES;
    state.currentDay = 1 + blockDays + 1;
    assert(E.getStoryGroupFactor(b, state) === fadeFactor, `감쇠 시작 ${E.getStoryGroupFactor(b, state)}`);
    state.currentDay = 1 + blockDays + fadeDays;
    assert(E.getStoryGroupFactor(b, state) === fadeFactor, '감쇠 마지막 날');
    state.currentDay = 1 + blockDays + fadeDays + 1;
    assert(E.getStoryGroupFactor(b, state) === 1, '감쇠가 끝나지 않음');
  });
});

test('쿨다운도 group 단위로 공유한다 (변형 a 가 나오면 b 의 쿨다운도 시작)', () => {
  withTempGroup((a, b) => {
    const state = freshState(1);
    state.eventHistory[a.id] = 1;
    assert(E.getLastEventDay(state, b) === 1, '마지막 발생일 공유 안 됨');
    state.currentDay = 1 + E.STORY_GROUP_RULES.blockDays + 2; // 차단은 끝났지만 쿨다운(20)은 남음
    assert(!candidateIds(state).includes(b.id), '쿨다운 공유 안 됨');
    state.currentDay = 21;
    assert(candidateIds(state).includes(b.id), '쿨다운이 끝나도 후보가 아니다');
  }, { cooldown: 20 });
});

test('group 이 없는 이벤트는 영향이 없다 (마지막 발생일 / 가중치 / 차단)', () => {
  withTempGroup((a) => {
    const state = freshState(10);
    state.eventHistory[a.id] = 10;
    const plain = E.getEventById('st_music_cover_project');
    state.eventHistory[plain.id] = 9;
    assert(E.getLastEventDay(state, plain) === 9, '자기 기록이 아니다');
    assert(E.getStoryGroupFactor(plain, state) === 1 && !E.isStoryGroupBlocked(plain, state), '영향을 받음');
    assert(E.EVENTS.filter((event) => !event.group).every((event) => E.getStoryGroupFactor(event, state) === 1), '다른 이벤트가 영향을 받음');
  });
});

test('excludeGroups 로 지정한 group 은 후보에서 빠진다 (같은 날 콜라보 중복 방지용)', () => {
  withTempGroup((a, b) => {
    const state = freshState(10);
    const ids = candidateIds(state, { collab: true, excludeGroups: new Set(['test_group']) });
    assert(!ids.includes(a.id) && !ids.includes(b.id), '제외 안 됨');
    assert(candidateIds(state, { collab: true }).includes(a.id), '제외하지 않으면 후보여야 한다');
  }, { collab: true });
});

test('하루 계획: 하루 스토리 상한을 늘려도 같은 group 은 하루에 하나만 배정된다 (500일)', () => {
  const saved = E.DAY_RULES.maxStoryPerDay;
  E.DAY_RULES.maxStoryPerDay = 11;
  try {
    withTempGroup((a, b) => {
      let both = 0;
      let seen = 0;
      for (let i = 0; i < 500; i += 1) {
        const state = freshState(10);
        state.members.forEach((member) => { member.hp = 90; });
        const ids = E.planDay(state).map((entry) => entry.eventId);
        if (ids.includes(a.id) || ids.includes(b.id)) seen += 1;
        if (ids.includes(a.id) && ids.includes(b.id)) both += 1;
      }
      assert(seen > 50, `group 이벤트가 거의 안 나옴 (${seen})`);
      assert(both === 0, `같은 날 둘 다 배정 ${both}회`);
    }, { weight: 5 });
  } finally {
    E.DAY_RULES.maxStoryPerDay = saved;
  }
});

test('28일 시뮬레이션: 같은 group 이 차단 기간 안에 다시 나오지 않는다 (100게임)', () => {
  withTempGroup((a, b) => {
    let appearances = 0;
    for (let run = 0; run < 100; run += 1) {
      const state = playGame({});
      const days = state.logs.filter((log) => log.story && (log.title === a.title || log.title === b.title)).map((log) => log.day);
      appearances += days.length;
      days.forEach((day, index) => {
        if (index > 0) assert(day - days[index - 1] > E.STORY_GROUP_RULES.blockDays, `${days[index - 1]} → ${day}`);
      });
    }
    assert(appearances > 30, `group 이벤트 등장 ${appearances}회`);
  }, { weight: 5 });
});

/* ===================== 3. 도구: --replace / inbox done ===================== */
section('[3] import --replace / 처리 완료 폴더 재읽기 방지');

// 프로젝트를 임시 폴더에 복사해서 도구를 실행한다. (실제 content 는 건드리지 않는다)
const work = mkdtempSync(join(tmpdir(), 'stellive-tools-'));
['js', 'tools', 'content'].forEach((dir) => cpSync(join(ROOT, dir), join(work, dir), {
  recursive: true,
  filter: (src) => !src.includes('node_modules') && !src.includes(`content${process.platform === 'win32' ? '\\' : '/'}inbox`) && !src.includes('rejected'),
}));
writeFileSync(join(work, 'package.json'), '{"type":"module"}');
const inbox = join(work, 'content', 'inbox');
mkdirSync(join(inbox, 'done'), { recursive: true });
const tool = (...args) => spawnSync(process.execPath, [join(work, 'tools', 'events.mjs'), ...args], { cwd: work, encoding: 'utf8' });
const contentFile = (category, id) => join(work, 'content', 'events', category, `${id}.json`);
const rejectedDir = join(work, 'content', 'rejected');
const rejectedIds = () => (existsSync(rejectedDir) ? readdirSync(rejectedDir).filter((name) => name.endsWith('.errors.txt')) : []);
const clearRejected = () => rmSync(rejectedDir, { recursive: true, force: true });
const existing = () => JSON.parse(readFileSync(contentFile('broadcast', 'st_broadcast_screen_freeze'), 'utf8'));

test('처리 완료 폴더(done/)의 파일은 다시 읽지 않는다', () => {
  // done/ 에 이미 처리된(같은 id) 파일을 두고, inbox 에는 새 이벤트 하나만
  writeFileSync(join(inbox, 'done', 'old_batch.json'), JSON.stringify([existing()]));
  const fresh = existing();
  Object.assign(fresh, { id: 'st_broadcast_tool_probe', title: '도구 점검 이벤트' });
  fresh.meta = { ...fresh.meta, setting: 'tool_probe', conflict: 'time_pressure', resolution: 'steady_success' };
  Object.values(fresh.steps).forEach((node, i) => { if (typeof node.text === 'string') node.text = `점검 장면 ${i}번. {member}가 상황을 정리한다.`; });
  writeFileSync(join(inbox, 'probe.json'), JSON.stringify([fresh]));
  const result = tool('import');
  assert(result.stdout.includes('새 이벤트 1개 검사'), result.stdout.slice(0, 300));
  assert(rejectedIds().length === 0, `거절 발생: ${rejectedIds()}`);
  assert(existsSync(contentFile('broadcast', 'st_broadcast_tool_probe')), '새 이벤트가 들어가지 않음');
  assert(existsSync(join(inbox, 'done', 'old_batch.json')), 'done/ 파일이 건드려짐');
});

test('--replace 없이 같은 id 를 넣으면 거절되고, 이유에 --replace 안내가 붙는다', () => {
  clearRejected();
  const revised = existing();
  revised.title = '화면이 멈췄다 (수정본)';
  writeFileSync(join(inbox, 'revise.json'), JSON.stringify([revised]));
  tool('import');
  const reason = readFileSync(join(rejectedDir, 'st_broadcast_screen_freeze.errors.txt'), 'utf8');
  assert(reason.includes('--replace'), reason);
  assert(existing().title === '화면이 멈췄다', '원본이 바뀌었다');
});

test('--replace: 같은 id 의 수정본으로 교체되고 build 결과에도 반영된다', () => {
  clearRejected();
  const before = readdirSync(join(work, 'content', 'events', 'broadcast')).length;
  const revised = existing();
  revised.title = '화면이 멈췄다 (수정본)';
  revised.group = 'equip_trouble_test';
  writeFileSync(join(inbox, 'revise.json'), JSON.stringify([revised]));
  const result = tool('import', '--replace');
  assert(result.status === 0, result.stdout.slice(-400));
  assert(existing().title === '화면이 멈췄다 (수정본)' && existing().group === 'equip_trouble_test', '교체 안 됨');
  assert(readdirSync(join(work, 'content', 'events', 'broadcast')).length === before, '파일 수가 바뀌었다');
  assert(readFileSync(join(work, 'js', 'story-content.js'), 'utf8').includes('화면이 멈췄다 (수정본)'), 'build 에 반영 안 됨');
  assert(result.stdout.includes('플레이 테스트'), '플레이 테스트를 거치지 않음');
});

test('--replace 여도 검증에 실패한 수정본은 거절되고 원본이 남는다', () => {
  clearRejected();
  const broken = existing();
  broken.steps.react.choices[0].next = 'nowhere';
  writeFileSync(join(inbox, 'broken.json'), JSON.stringify([broken]));
  tool('import', '--replace');
  assert(rejectedIds().includes('st_broadcast_screen_freeze.errors.txt'), '거절 안 됨');
  assert(existing().steps.react.choices[0].next !== 'nowhere', '잘못된 수정본이 들어갔다');
});

test('--replace 로 카테고리를 바꾸면 옛 위치의 파일은 지워진다', () => {
  clearRejected();
  const moved = existing();
  moved.category = 'special';
  writeFileSync(join(inbox, 'move.json'), JSON.stringify([moved]));
  const result = tool('import', '--replace');
  assert(result.status === 0, result.stdout.slice(-300));
  assert(!existsSync(contentFile('broadcast', 'st_broadcast_screen_freeze')) && existsSync(contentFile('special', 'st_broadcast_screen_freeze')), '이동 안 됨');
});

test('--replace 여도 다른 기존 이벤트와 너무 비슷한 수정본은 거절된다', () => {
  clearRejected();
  const copyOfOther = JSON.parse(readFileSync(contentFile('music', 'st_music_cover_project'), 'utf8'));
  const target = JSON.parse(readFileSync(contentFile('game', 'st_game_fps_rematch'), 'utf8'));
  // 다른 이벤트의 내용을 그대로 가져온 수정본
  writeFileSync(join(inbox, 'similar.json'), JSON.stringify([{ ...copyOfOther, id: target.id, category: target.category }]));
  tool('import', '--replace');
  const reason = readFileSync(join(rejectedDir, `${target.id}.errors.txt`), 'utf8');
  assert(reason.includes('비슷하다'), reason);
});

rmSync(work, { recursive: true, force: true });

finish();
