import { test, expect } from '@playwright/test';

// Teste básico do Playwright
test('primeiro teste - verificar título da página', async ({ page }) => {
  // 1. Acessar a página do Playwright
  await page.goto('https://playwright.dev/');

  // 2. Verificar se o título da página é o esperado
  await expect(page).toHaveTitle(/Playwright/);
});

// Teste com interação
test('segundo teste - navegar para a página de docs', async ({ page }) => {
  // 1. Acessar a página inicial
  await page.goto('https://playwright.dev/');

  // 2. Encontrar o link "Get Started" usando texto
  const getStartedLink = page.getByText('Get Started');

  // 3. Verificar se o link está visível
  await expect(getStartedLink).toBeVisible();

  // 4. Clicar no link
  await getStartedLink.click();

  // 5. Verificar se a URL mudou para a página de docs
  await expect(page).toHaveURL(/.*intro/);
});
