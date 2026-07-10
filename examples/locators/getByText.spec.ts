import { test, expect } from '@playwright/test';

// getByText é indicado para localizar elementos por texto visível.
// Use em textos curtos e únicos, como links, mensagens e botões simples.
// Evite quando o mesmo texto aparece em vários elementos ou quando o conteúdo é muito longo.

test('getByText localiza um link pelo texto visível', async ({ page }) => {
  await page.setContent(`
    <nav>
      <a href="/docs">Leia mais</a>
    </nav>
  `);

  const linkLeiaMais = page.getByText('Leia mais');

  await expect(linkLeiaMais).toBeVisible();
  await expect(linkLeiaMais).toHaveAttribute('href', '/docs');
});
