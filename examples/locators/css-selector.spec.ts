import { test, expect } from '@playwright/test';

// CSS selectors são úteis para selecionar elementos com classes, IDs e estruturas específicas.
// Use quando não há alternativa mais semântica e você precisa de precisão.
// Evite seletores frágeis que dependem de estruturas de DOM voláteis.

test('CSS selector encontra elementos por classe e hierarquia', async ({ page }) => {
  await page.setContent(`
    <section>
      <div class="item destacado">
        <p>Conteúdo importante</p>
      </div>
    </section>
  `);

  const destaque = page.locator('section > div.item.destacado');

  await expect(destaque).toBeVisible();
  await expect(destaque.locator('p')).toHaveText('Conteúdo importante');
});
