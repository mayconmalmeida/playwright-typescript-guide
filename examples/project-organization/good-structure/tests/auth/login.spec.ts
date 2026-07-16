// ✅ Testes de autenticação ficam isolados em "auth/", junto com outros
// testes do mesmo domínio (ex: cadastro, recuperação de senha).

import { test, expect } from '@playwright/test';

test('login com sucesso', async ({ page }) => {
  await page.goto('https://example.com/login');

  await page.getByLabel('E-mail').fill('usuario@teste.com');
  await page.getByLabel('Senha').fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL(/dashboard/);
});
