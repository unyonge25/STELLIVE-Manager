// run-all.mjs — 모든 테스트를 차례로 실행한다.
// 실행: node tests/run-all.mjs
// (밸런스 리포트는 시간이 오래 걸려 포함하지 않는다: node tests/balance.report.mjs)

import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const testsDir = fileURLToPath(new URL('.', import.meta.url));
const jsDir = fileURLToPath(new URL('../js/', import.meta.url));

let failed = 0;

// 1) 모든 JS 문법 검사
const jsFiles = readdirSync(jsDir).filter((file) => file.endsWith('.js'));
const syntaxErrors = jsFiles.filter((file) => spawnSync(process.execPath, ['--check', `${jsDir}${file}`]).status !== 0);
console.log(`\n=== syntax check: ${jsFiles.length - syntaxErrors.length}/${jsFiles.length} OK ${syntaxErrors.length ? `(실패: ${syntaxErrors.join(', ')})` : ''}`);
if (syntaxErrors.length) failed += 1;

// 2) 테스트 파일
const suites = ['schedule.test.mjs', 'economy.test.mjs', 'simulation.test.mjs', 'ui-flow.test.mjs'];
for (const suite of suites) {
  console.log(`\n=== ${suite}`);
  const result = spawnSync(process.execPath, [`${testsDir}${suite}`], { cwd: root, encoding: 'utf8' });
  const lines = (result.stdout || '').trim().split('\n');
  lines.filter((line) => line.includes('✘') || /^\s{6}\S/.test(line)).forEach((line) => console.log(line));
  console.log(lines.at(-1));
  if (result.status !== 0) {
    failed += 1;
    if (result.stderr) console.log(result.stderr.trim().split('\n').slice(0, 5).join('\n'));
  }
}

console.log(failed ? `\n❌ ${failed}개 항목 실패` : '\n✅ 전체 통과');
process.exit(failed ? 1 : 0);
