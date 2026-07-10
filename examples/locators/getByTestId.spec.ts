import { test, expect } from '@playwright/test';

// getByTestId é um locator de segurança para seletores de teste específicos.
// Use quando não há alternativa semântica confiável.
// Evite usar test IDs como primeira opção em interfaces bem estruturadas.

test('getByTestId localiza elementos por data-testid', async ({ page }) => {
  await page.setContent(`
    <button data-testid="botao-enviar">Enviar</button>
  `);

  const botaoEnviar = page.getByTestId('botao-enviar');

  await expect(botaoEnviar).toBeVisible();
  await expect(botaoEnviar).toHaveText('Enviar');
});
