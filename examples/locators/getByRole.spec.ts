import { test, expect } from '@playwright/test';

// getByRole é a forma mais robusta de localizar elementos interativos.
// Ela usa a semântica do HTML e a acessibilidade, o que deixa os testes mais estáveis.
// Use para botões, links, campos de formulário, cabeçalhos e outros papéis.
// Evite quando o elemento não tem um role definido ou quando o role é genérico demais.

test('getByRole localiza um botão acessível pelo nome', async ({ page }) => {
  await page.setContent(`
    <main>
      <button type="button">Enviar</button>
    </main>
  `);

  const botaoEnviar = page.getByRole('button', { name: 'Enviar' });

  await expect(botaoEnviar).toBeVisible();
  await expect(botaoEnviar).toHaveText('Enviar');
});
