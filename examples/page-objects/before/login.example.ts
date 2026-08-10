import { expect, test } from '@playwright/test';

// Exemplo intencionalmente acoplado para fins didáticos.
test('should log in successfully', async ({ page }) => {
  await page.setContent(`
    <main id="login">
      <h1>Entrar</h1>
      <label>E-mail <input name="email" type="email"></label>
      <label>Senha <input name="password" type="password"></label>
      <button type="button" id="login-button">Entrar</button>
    </main>
    <section id="dashboard" hidden>
      <nav aria-label="Navegação principal">
        <button type="button">Perfil</button><button type="button">Sair</button>
      </nav>
      <h1>Dashboard</h1>
    </section>
    <div role="status" id="success-toast" hidden></div>
    <dialog id="confirmation-modal">
      <p>Deseja realmente sair?</p>
      <button type="button">Confirmar</button><button type="button">Cancelar</button>
      <button type="button" aria-label="Fechar">×</button>
    </dialog>
    <script>
      document.querySelector('#login-button').addEventListener('click', () => {
        const email = document.querySelector('[name="email"]').value;
        const password = document.querySelector('[name="password"]').value;
        if (email === 'qa@example.com' && password === 'valid-password') {
          document.querySelector('#login').hidden = true;
          document.querySelector('#dashboard').hidden = false;
          document.querySelector('#success-toast').textContent = 'Login realizado com sucesso';
          document.querySelector('#success-toast').hidden = false;
        }
      });
    </script>
  `);

  const emailInput = page.getByLabel('E-mail');
  const passwordInput = page.getByLabel('Senha');
  const loginButton = page.getByRole('button', { name: 'Entrar' });

  await emailInput.fill('qa@example.com');
  await passwordInput.fill('valid-password');
  await loginButton.click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toHaveText('Dashboard');
  await expect(page.getByRole('status')).toHaveText('Login realizado com sucesso');
});
