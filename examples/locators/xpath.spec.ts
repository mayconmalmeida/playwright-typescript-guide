import { test, expect } from '@playwright/test';

// XPath deve ser usado como último recurso, quando CSS e locators semânticos não funcionam.
// Use em casos de HTML legado ou árvores complexas sem atributos confiáveis.
// Evite XPath em código novo sempre que possível, pois costuma ser menos legível.

test('XPath localiza elementos em estrutura complexa', async ({ page }) => {
  await page.setContent(`
    <div>
      <section>
        <button>Confirmar</button>
      </section>
    </div>
  `);

  const botaoConfirmar = page.locator('//button[text()="Confirmar"]');

  await expect(botaoConfirmar).toBeVisible();
  await expect(botaoConfirmar).toHaveText('Confirmar');
});
