/// <reference types="node" />

import { expect, test } from '@playwright/test';

// Smoke tests: poucos, rápidos e somente de leitura.
// Respondem "a versão publicada está de pé e o caminho crítico funciona?",
// não "todas as regras de negócio estão corretas?".

const CRITICAL_ROUTES = ['/', '/cursos', '/contato'];

test.describe('smoke', { tag: '@smoke' }, () => {
  test('health check responde com status ok', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.status(), 'GET /api/health deve responder 200').toBe(200);
    expect(await response.json()).toMatchObject({ status: 'ok' });
  });

  test('versão publicada corresponde ao commit esperado', async ({ request }) => {
    const expected = process.env.PLAYWRIGHT_EXPECTED_VERSION;
    test.skip(!expected, 'PLAYWRIGHT_EXPECTED_VERSION não definida: verificação de versão desativada.');

    const { version } = await (await request.get('/api/health')).json();

    // Deploy "verde" servindo a versão anterior é um erro silencioso comum.
    expect(version, 'o ambiente ainda serve outra versão').toBe(expected);
  });

  for (const route of CRITICAL_ROUTES) {
    test(`rota crítica ${route} responde sem erro HTTP`, async ({ request }) => {
      const response = await request.get(route);

      expect(response.status(), `GET ${route} retornou ${response.status()}`).toBe(200);
    });
  }

  test('página inicial carrega o conteúdo essencial', async ({ page, baseURL }) => {
    const failedResponses: string[] = [];
    page.on('response', (response) => {
      if (response.url().startsWith(baseURL!) && response.status() >= 400) {
        failedResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    const response = await page.goto('/');

    expect(response?.status(), 'documento principal').toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: 'Catálogo de Cursos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver cursos' })).toBeVisible();
    expect(failedResponses, 'recursos da própria aplicação falharam ao carregar').toEqual([]);
  });

  test('navegação crítica leva ao catálogo', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Ver cursos' }).click();

    await expect(page).toHaveURL(/\/cursos$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Cursos disponíveis' })).toBeVisible();
    // Em produção o conteúdo muda; o smoke verifica presença, não a lista exata.
    await expect(page.getByRole('list', { name: 'Cursos' }).getByRole('listitem')).not.toHaveCount(0);
  });
});
