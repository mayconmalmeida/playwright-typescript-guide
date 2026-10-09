/// <reference types="node" />

import { defineConfig, devices } from '@playwright/test';
import { resolveTarget } from './environment';

const target = resolveTarget();
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.example.ts',
  // Explícito: o padrão é relativo ao package.json (raiz), não a este config.
  // Os workflows fazem upload de examples/cicd/test-results/.
  outputDir: './test-results',
  forbidOnly: isCI,

  // Gate de liberação: um teste que só passa na segunda tentativa é sinal
  // de instabilidade, não de sucesso. Retries ficam desligados de propósito.
  retries: 0,
  workers: isCI ? 1 : undefined,

  // Produção recebe apenas testes de leitura. Testes que criam dados
  // são marcados com @write e excluídos aqui, não por disciplina manual.
  grepInvert: target.env === 'production' ? /@write/ : undefined,

  globalSetup: './readiness.ts',
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [
    ['list'],
    ...(isCI ? [['github'] as const] : []),
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: target.baseURL,
    navigationTimeout: 15_000,
    // Sem retries, 'on-first-retry' nunca gravaria nada.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: target.startLocalServer
    ? {
        command: 'node app/server.js',
        env: { PORT: new URL(target.baseURL).port },
        url: `${target.baseURL}/api/health`,
        // Reaproveitar um servidor já aberto na porta pode testar outra aplicação
        // sem aviso. No gate, preferimos falhar com "porta em uso".
        reuseExistingServer: false,
        timeout: 30_000,
      }
    : undefined,
});
