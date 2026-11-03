import { expect, test } from '../../fixtures/test.fixture';
import { authMessages } from '../../test-data/auth-messages';
import { routes } from '../../test-data/routes';
import { invalidCredentials, usernames } from '../../test-data/users';

test.describe('login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('AUTH-01 login válido leva ao catálogo de produtos', { tag: '@smoke' }, async ({
    page,
    loginPage,
    header,
    credentials,
  }) => {
    await loginPage.login(credentials.username, credentials.password);

    await expect(page).toHaveURL(routes.inventory);
    await expect(header.title).toHaveText('Products');

    await test.step('a sessão permanece ativa após recarregar a página', async () => {
      await page.reload();

      await expect(page).toHaveURL(routes.inventory);
      await expect(header.title).toHaveText('Products');
    });
  });

  test('AUTH-02 usuário bloqueado não consegue entrar', { tag: '@regression' }, async ({
    page,
    loginPage,
    credentials,
  }) => {
    await loginPage.login(usernames.lockedOut, credentials.password);

    await expect(loginPage.errorMessage).toHaveText(authMessages.lockedOut);
    await expect(page).toHaveURL(routes.login);
  });

  test('AUTH-04 credenciais inválidas são rejeitadas', { tag: '@regression' }, async ({ page, loginPage }) => {
    await loginPage.login(invalidCredentials.username, invalidCredentials.password);

    await expect(loginPage.errorMessage).toHaveText(authMessages.invalidCredentials);
    await expect(page).toHaveURL(routes.login);
  });
});
