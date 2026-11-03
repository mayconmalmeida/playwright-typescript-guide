import type { FullConfig, FullResult, Reporter, Suite } from '@playwright/test/reporter';

// Ativado somente quando a execução declara a quantidade obrigatória de testes.
// Um exit code verde do runner sozinho não rejeita skips ou falhas esperadas.
export default class QualityGateReporter implements Reporter {
  private suite?: Suite;
  private retriesEnabled = false;
  private readonly expectedCount = Number(process.env.SAUCEDEMO_EXPECTED_TESTS);

  constructor() {
    if (!Number.isSafeInteger(this.expectedCount) || this.expectedCount <= 0) {
      throw new Error('[quality-gate] SAUCEDEMO_EXPECTED_TESTS deve ser um inteiro positivo.');
    }
  }

  onBegin(config: FullConfig, suite: Suite): void {
    this.suite = suite;
    this.retriesEnabled = config.projects.some((project) => project.retries !== 0);
  }

  async onEnd(result: FullResult): Promise<{ status: FullResult['status'] }> {
    const tests = this.suite?.allTests() ?? [];
    const passed = tests.filter((test) =>
      test.expectedStatus === 'passed' &&
      test.outcome() === 'expected' &&
      test.results.length === 1 &&
      test.results[0].retry === 0 &&
      test.results[0].status === 'passed',
    ).length;
    const approved = result.status === 'passed' &&
      !this.retriesEnabled &&
      tests.length === this.expectedCount &&
      passed === this.expectedCount;

    // Somente contagens: não reproduz dados dos testes ou credenciais nos logs.
    console.log(
      `[quality-gate] ${approved ? 'PASS' : 'FAIL'}: ` +
      `esperados=${this.expectedCount} descobertos=${tests.length} aprovados-sem-retry=${passed} ` +
      `retries-configurados=${this.retriesEnabled} runner=${result.status}`,
    );
    return { status: approved ? 'passed' : 'failed' };
  }
}
