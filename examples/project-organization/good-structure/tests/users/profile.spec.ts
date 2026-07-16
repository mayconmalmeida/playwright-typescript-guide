// ✅ Testes de usuário/perfil também têm seu próprio espaço, facilitando
// encontrar o que pertence a cada área da aplicação.

import { test, expect } from '@playwright/test';

test('atualizar nome do usuário', async ({ page }) => {
  await page.goto('https://example.com/profile');

  await page.getByLabel('Nome').fill('Novo Nome');
  await page.getByRole('button', { name: 'Salvar' }).click();

  await expect(page.getByText('Perfil atualizado')).toBeVisible();
});
