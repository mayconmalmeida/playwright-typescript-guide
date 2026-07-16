// ❌ Problema: arquivo duplicado. Em vez de atualizar "login.spec.ts",
// alguém copiou o arquivo, ajustou uma parte e salvou como "-final".
// Agora existem dois testes de login divergentes e ninguém sabe qual é o vigente.

import { test, expect } from '@playwright/test';

test('login com sucesso (versão final)', async ({ page }) => {
  await page.goto('https://example.com/login');

  await page.locator('#user').fill('usuario@teste.com');
  await page.locator('#pass').fill('123456');
  await page.locator('button.btn-login').click();

  // Assertion diferente da versão "antiga" — qual das duas está correta?
  await expect(page).toHaveURL(/dashboard/);
});
