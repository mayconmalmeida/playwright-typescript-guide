// ✅ Testes de carteira ficam em seu próprio domínio, sem se misturar com login.

import { test, expect } from '@playwright/test';

test('exibir saldo da carteira', async ({ page }) => {
  await page.goto('https://example.com/wallet');

  await expect(page.getByTestId('wallet-balance')).toBeVisible();
});
