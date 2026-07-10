import { test, expect } from '@playwright/test';

// page.locator() é a abordagem mais flexível e poderosa do Playwright.
// Use quando precisar de seletores CSS complexos ou para combinar múltiplas condições.
// Evite quando um locator semântico como getByRole ou getByLabel já resolve o caso.

test('locator localiza elementos com CSS avançado', async ({ page }) => {
  await page.setContent(`
    <div class="card status-ativo">
      <span>Produto ativo</span>
    </div>
  `);

  const cardAtivo = page.locator('div.card.status-ativo');

  await expect(cardAtivo).toBeVisible();
  await expect(cardAtivo.locator('span')).toHaveText('Produto ativo');
});
