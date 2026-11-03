import { defineConfig, devices } from '@playwright/test';
import { resolveEnvironment } from './config/environment';

const { baseURL } = resolveEnvironment();
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  // Explícito: relatórios e evidências ficam dentro de examples/final-project/,
  // separados da raiz e dos outros capítulos.
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: isCI,

  // Smoke é critério de liberação: um teste que só passa na segunda tentativa
  // é sinal de instabilidade, não de sucesso. O Quality Gate também rejeita retries.
  retries: 0,
  // A SauceDemo é um serviço público de terceiros: paralelismo limitado de propósito.
  workers: isCI ? 2 : 4,

  // Falha antes de qualquer teste quando a aplicação externa está indisponível.
  globalSetup: './readiness.ts',
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [
    ['list'],
    ...(isCI ? [['github'] as const] : []),
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ...(process.env.SAUCEDEMO_EXPECTED_TESTS ? [['./config/quality-gate.reporter.ts'] as const] : []),
  ],

  use: {
    baseURL,
    // A SauceDemo expõe data-test, não data-testid: getByTestId passa a usar esse atributo.
    testIdAttribute: 'data-test',
    navigationTimeout: 15_000,
    actionTimeout: 10_000,
    // Traces podem conter senhas digitadas e não são gerados nem enviados pelo CI.
    // Localmente, a evidência fica disponível para revisão manual antes de compartilhar.
    trace: isCI ? 'off' : 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  // Firefox e WebKit entram como novos itens desta lista, sem mudar o restante.
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
