// ❌ Problema: teste de um domínio totalmente diferente (carteira/wallet)
// vive lado a lado com os testes de login, sem nenhuma pasta separando os domínios.

import { test, expect } from '@playwright/test';

test('exibir saldo da carteira', async ({ page }) => {
  await page.goto('https://example.com/wallet');

  await expect(page.locator('.wallet-balance')).toBeVisible();
});
