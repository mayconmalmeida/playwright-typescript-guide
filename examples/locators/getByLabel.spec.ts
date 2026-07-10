import { test, expect } from '@playwright/test';

// getByLabel é ideal para campos de formulário que possuem <label> associado.
// Use quando o label descreve claramente o campo.
// Evite em inputs que não possuem label ou quando a associação com o label não é confiável.

test('getByLabel localiza um campo de formulário pelo label', async ({ page }) => {
  await page.setContent(`
    <form>
      <label for="nome">Nome completo</label>
      <input id="nome" type="text" />
    </form>
  `);

  const nomeInput = page.getByLabel('Nome completo');

  await expect(nomeInput).toBeVisible();
  await nomeInput.fill('Maria Oliveira');
  await expect(nomeInput).toHaveValue('Maria Oliveira');
});
