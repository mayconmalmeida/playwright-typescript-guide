// ❌ Problema: teste de login sem nenhuma separação de responsabilidades.
// Seletores, dados e lógica de verificação estão todos misturados no mesmo arquivo.

import { test, expect } from '@playwright/test';

test('login com sucesso', async ({ page }) => {
  await page.goto('https://example.com/login');

  // Seletor escrito direto no teste: se o campo mudar, é preciso caçar
  // essa string em todos os arquivos que a repetem.
  await page.locator('#user').fill('usuario@teste.com');
  await page.locator('#pass').fill('123456');
  await page.locator('button.btn-login').click();

  await expect(page.locator('.welcome-message')).toBeVisible();
});
