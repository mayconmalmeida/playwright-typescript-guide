import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel('E-mail');
    this.passwordInput = page.getByLabel('Senha');
    this.loginButton = page.getByRole('button', { name: 'Entrar' });
  }

  async goto(): Promise<void> {
    await this.page.setContent(`
      <!doctype html>
      <html lang="pt-BR">
        <body>
          <main id="login">
            <h1>Entrar</h1>
            <label>E-mail <input name="email" type="email"></label>
            <label>Senha <input name="password" type="password"></label>
            <button id="login-button" type="button">Entrar</button>
          </main>
          <main id="dashboard" hidden>
            <h1>Dashboard</h1>
            <p id="welcome"></p>
            <button id="profile-button" type="button">Perfil</button>
            <section id="profile" hidden>
              <h2>Meu perfil</h2>
              <p>E-mail: <span id="profile-email"></span></p>
            </section>
          </main>
          <script>
            const byId = (id) => document.getElementById(id);
            byId('login-button').addEventListener('click', () => {
              const email = document.querySelector('[name="email"]').value;
              const password = document.querySelector('[name="password"]').value;
              if (email === 'qa@example.com' && password === 'valid-password') {
                byId('login').hidden = true;
                byId('dashboard').hidden = false;
                byId('welcome').textContent = 'Olá, Pessoa QA';
                byId('profile-email').textContent = email;
              }
            });
            byId('profile-button').addEventListener('click', () => {
              byId('profile').hidden = false;
            });
          </script>
        </body>
      </html>
    `);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

