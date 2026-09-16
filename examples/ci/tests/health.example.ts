import { expect, test } from '@playwright/test';

test('renders a deterministic health message', async ({ page }) => {
  await page.setContent(`
    <!doctype html>
    <html lang="pt-BR">
      <body>
        <main>
          <h1>Ambiente pronto</h1>
          <p role="status">Playwright executado com sucesso</p>
        </main>
      </body>
    </html>
  `);

  await expect(page.getByRole('heading', { name: 'Ambiente pronto' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Playwright executado com sucesso');
});
