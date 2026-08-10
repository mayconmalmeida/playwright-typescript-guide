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
        <head><meta charset="utf-8"><title>Área do cliente</title></head>
        <body>
          <main id="login">
            <h1>Entrar</h1>
            <label>E-mail <input name="email" type="email"></label>
            <label>Senha <input name="password" type="password"></label>
            <button type="button" id="login-button">Entrar</button>
            <p role="alert" id="login-error" hidden></p>
          </main>

          <section id="dashboard" hidden>
            <nav aria-label="Navegação principal">
              <button type="button" id="profile-button">Perfil</button>
              <button type="button" id="logout-button">Sair</button>
            </nav>
            <h1>Dashboard</h1>
            <section id="profile" hidden><h2>Meu perfil</h2></section>
          </section>

          <div role="status" id="success-toast" hidden></div>
          <div role="alert" id="error-toast" hidden></div>

          <dialog id="confirmation-modal">
            <p>Deseja realmente sair?</p>
            <button type="button" id="confirm-button">Confirmar</button>
            <button type="button" id="cancel-button">Cancelar</button>
            <button type="button" id="close-button" aria-label="Fechar">×</button>
          </dialog>

          <script>
            const byId = (id) => document.getElementById(id);
            byId('login-button').addEventListener('click', () => {
              const email = document.querySelector('[name="email"]').value;
              const password = document.querySelector('[name="password"]').value;
              if (email === 'qa@example.com' && password === 'valid-password') {
                byId('login').hidden = true;
                byId('dashboard').hidden = false;
                byId('success-toast').textContent = 'Login realizado com sucesso';
                byId('success-toast').hidden = false;
              } else {
                byId('login-error').textContent = 'Credenciais inválidas';
                byId('login-error').hidden = false;
                byId('error-toast').textContent = 'Não foi possível entrar';
                byId('error-toast').hidden = false;
              }
            });
            byId('profile-button').addEventListener('click', () => { byId('profile').hidden = false; });
            byId('logout-button').addEventListener('click', () => { byId('confirmation-modal').showModal(); });
            byId('confirm-button').addEventListener('click', () => {
              byId('confirmation-modal').close();
              byId('dashboard').hidden = true;
              byId('login').hidden = false;
            });
            byId('cancel-button').addEventListener('click', () => { byId('confirmation-modal').close(); });
            byId('close-button').addEventListener('click', () => { byId('confirmation-modal').close(); });
          </script>
        </body>
      </html>
    `);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }
}
