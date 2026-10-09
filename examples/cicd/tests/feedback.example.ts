import { expect, test } from '@playwright/test';

// Este teste cria dados (envia uma mensagem). Por isso é marcado com @write:
// roda em local e preview, e o playwright.config.ts o exclui em produção.

test('formulário de contato aceita uma mensagem', { tag: ['@smoke', '@write'] }, async ({ page }) => {
  await page.goto('/contato');

  await page.getByLabel('Mensagem').fill('Mensagem enviada pelo smoke test de preview');
  await page.getByRole('button', { name: 'Enviar' }).click();

  await expect(page.getByRole('status')).toHaveText('Mensagem recebida');
});
