import { test, expect } from '@playwright/test';

// Template oficial para novos exemplos da série.
// Copie este arquivo, renomeie e substitua os comentários pelo cenário real do capítulo.

test.describe('[Nome do conceito]', () => {
  test('[descrição do cenário]', async ({ page }) => {
    // 1. Arrange: prepare o estado inicial (navegação, dados, mocks)
    await page.goto('https://example.com/');

    // 2. Act: execute a ação que está sendo demonstrada
    // const elemento = page.getByRole('button', { name: 'Nome do botão' });
    // await elemento.click();

    // 3. Assert: valide o resultado esperado
    // await expect(page).toHaveURL(/esperado/);
  });
});
