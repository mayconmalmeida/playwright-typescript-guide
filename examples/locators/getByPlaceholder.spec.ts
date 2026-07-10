import { test, expect } from '@playwright/test';

// getByPlaceholder serve para localizar campos quando o placeholder é o identificador mais confiável.
// Use quando não há label claro e o placeholder descreve bem o campo.
// Evite como primeira opção em aplicações maduras, pois placeholders tendem a mudar.

test('getByPlaceholder localiza um campo pelo placeholder', async ({ page }) => {
  await page.setContent(`
    <form>
      <input type="email" placeholder="Digite seu e-mail" />
    </form>
  `);

  const emailInput = page.getByPlaceholder('Digite seu e-mail');

  await expect(emailInput).toBeVisible();
  await emailInput.fill('teste@exemplo.com');
  await expect(emailInput).toHaveValue('teste@exemplo.com');
});
