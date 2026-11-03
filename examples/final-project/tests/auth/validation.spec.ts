import { expect, test } from '../../fixtures/test.fixture';
import { authMessages } from '../../test-data/auth-messages';
import { routes } from '../../test-data/routes';
import { invalidCredentials, usernames } from '../../test-data/users';

// Cada caso deixa exatamente um campo vazio, para que a mensagem verificada
// corresponda a uma única regra de validação.
const requiredFieldCases = [
  {
    field: 'username',
    username: '',
    password: invalidCredentials.password,
    message: authMessages.usernameRequired,
  },
  {
    field: 'password',
    username: usernames.standard,
    password: '',
    message: authMessages.passwordRequired,
  },
];

test.describe('validação do formulário de login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  for (const { field, username, password, message } of requiredFieldCases) {
    test(`AUTH-03 ${field} vazio exibe mensagem de campo obrigatório`, { tag: '@regression' }, async ({
      page,
      loginPage,
    }) => {
      await loginPage.login(username, password);

      await expect(loginPage.errorMessage).toHaveText(message);
      await expect(page).toHaveURL(routes.login);
    });
  }

  test('AUTH-07 mensagem de erro pode ser fechada', { tag: '@regression' }, async ({ loginPage }) => {
    await test.step('provocar um erro enviando o formulário vazio', async () => {
      await loginPage.submit();

      await expect(loginPage.errorMessage).toBeVisible();
    });

    await test.step('fechar a mensagem', async () => {
      await loginPage.closeError();

      await expect(loginPage.errorMessage).toBeHidden();
    });
  });
});
