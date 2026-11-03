import type { Locator, Page } from '@playwright/test';
import { routes } from '../test-data/routes';

export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly closeErrorButton: Locator;

  // Públicos porque representam o estado da tela que os testes verificam.
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    // Os campos não têm <label>, mas têm aria-label: getByLabel também considera esse atributo.
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    // A mensagem e o botão de fechar não têm papel ou nome acessível estável: data-test é o contrato.
    this.errorMessage = page.getByTestId('error');
    this.closeErrorButton = page.getByTestId('error-button');
  }

  async goto(): Promise<void> {
    // Fontes externas podem manter load pendente mesmo com o formulário pronto.
    // Os locators de interação aguardam os campos ficarem visíveis e editáveis.
    await this.page.goto(routes.login, { waitUntil: 'domcontentloaded' });
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.submit();
  }

  async closeError(): Promise<void> {
    await this.closeErrorButton.click();
  }
}
