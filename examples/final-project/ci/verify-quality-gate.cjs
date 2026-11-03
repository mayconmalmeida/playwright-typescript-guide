// Exercita o reporter com o runner real e casos sintéticos, sem navegador ou rede.
// Não adiciona cenários de infraestrutura à contagem dos 41 testes do produto.
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');

const directory = mkdtempSync(path.join(tmpdir(), 'chapter-10-gate-'));
const reporter = path.resolve(__dirname, '../config/quality-gate.reporter.ts');
const cli = require.resolve('@playwright/test/cli');
const testModule = require.resolve('@playwright/test');
const scenarios = [
  { name: 'pass', code: "test('case', () => {});", expectedExit: 0 },
  { name: 'skip', code: "test.skip('case', () => {});", expectedExit: 1 },
  { name: 'fixme', code: "test.fixme('case', () => {});", expectedExit: 1 },
  { name: 'runtime-skip', code: "test('case', () => { test.skip(); });", expectedExit: 1 },
  { name: 'expected-failure', code: "test('case', () => { test.fail(); expect(false).toBe(true); });", expectedExit: 1 },
  { name: 'failure', code: "test('case', () => { expect(false).toBe(true); });", expectedExit: 1 },
  { name: 'wrong-count', code: "test('case', () => {});", count: '2', expectedExit: 1 },
  { name: 'invalid-count', code: "test('case', () => {});", count: 'invalid', expectedExit: 1 },
  { name: 'empty-suite', code: '', expectedExit: 1 },
  { name: 'retries-enabled', code: "test('case', () => {});", retries: 1, expectedExit: 1 },
  { name: 'flaky', code: "test('case', ({}, info) => { expect(info.retry).toBe(1); });", retries: 1, expectedExit: 1 },
];

try {
  for (const scenario of scenarios) {
    writeFileSync(path.join(directory, 'case.spec.cjs'),
      `const { test, expect } = require(${JSON.stringify(testModule)});\n${scenario.code}\n`);
    writeFileSync(path.join(directory, 'playwright.config.cjs'), `module.exports = ${JSON.stringify({
      testDir: directory,
      testMatch: 'case.spec.cjs',
      outputDir: path.join(directory, 'results'),
      workers: 1,
      retries: scenario.retries ?? 0,
      reporter: [[reporter]],
    })};`);
    const env = { ...process.env, SAUCEDEMO_EXPECTED_TESTS: scenario.count ?? '1' };
    delete env.SAUCEDEMO_PASSWORD;
    const result = spawnSync(process.execPath, [cli, 'test', '--config', path.join(directory, 'playwright.config.cjs')], {
      env, encoding: 'utf8', timeout: 30_000,
    });
    assert.ifError(result.error);
    assert.equal(result.status, scenario.expectedExit, `${scenario.name}: exit code inesperado`);
    if (scenario.name === 'pass') assert.match(result.stdout, /\[quality-gate\] PASS/);
    if (scenario.name === 'flaky') assert.match(result.stdout, /aprovados-sem-retry=0/);
    console.log(`[quality-gate-contract] ${scenario.name}: PASS (exit ${result.status})`);
  }
} finally {
  // mkdtemp criou este diretório específico; nunca remove a raiz temporária.
  assert.equal(path.dirname(directory), tmpdir());
  assert.ok(path.basename(directory).startsWith('chapter-10-gate-'));
  rmSync(directory, { recursive: true, force: true });
}
