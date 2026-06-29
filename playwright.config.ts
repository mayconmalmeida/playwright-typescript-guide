import { defineConfig, devices } from '@playwright/test';

/**
 * Leia variáveis de ambiente de arquivo.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Veja https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Pasta onde estão localizados os nossos testes
  testDir: './tests',
  
  // Executa testes dentro do mesmo arquivo em paralelo
  fullyParallel: true,
  
  // Falha o build no CI se você deixar test.only no código
  forbidOnly: !!process.env.CI,
  
  // Número de tentativas em caso de falha (apenas no CI)
  retries: process.env.CI ? 2 : 0,
  
  // Número de workers paralelos (1 no CI para evitar problemas)
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter: formato do relatório de testes (HTML é ótimo para visualização)
  reporter: 'html',
  
  // Configurações compartilhadas para todos os projetos
  use: {
    // URL base para ações como await page.goto('/')
    // baseURL: 'http://localhost:3000',

    // Trace: grava um vídeo da execução para debug
    // 'on-first-retry' = grava apenas na primeira tentativa de retry
    trace: 'on-first-retry',
  },

  // Projetos: diferentes configurações (browsers, dispositivos, etc.)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Testar em viewports mobile */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Testar em browsers com marca */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Executa o servidor de desenvolvimento local antes dos testes */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
