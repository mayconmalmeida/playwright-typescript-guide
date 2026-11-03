import { expect, test } from '../../fixtures/test.fixture';
import { authMessages } from '../../test-data/auth-messages';
import { routes } from '../../test-data/routes';

test('AUTH-05 logout encerra a sessão', { tag: '@smoke' }, async ({ authenticatedPage: page, loginPage, sideMenu }) => {
  await test.step('abrir o menu lateral', async () => {
    await sideMenu.open();

    await expect(sideMenu.logoutButton).toBeVisible();
  });

  await test.step('sair', async () => {
    await sideMenu.logout();

    await expect(page).toHaveURL(routes.login);
    await expect(loginPage.loginButton).toBeVisible();
  });

  await test.step('a rota protegida deixa de ser acessível', async () => {
    await page.goto(routes.inventory);

    await expect(page).toHaveURL(routes.login);
    await expect(loginPage.errorMessage).toHaveText(authMessages.protectedRoute(routes.inventory));
  });
});
