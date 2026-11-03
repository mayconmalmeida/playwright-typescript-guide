import { expect, test } from '@playwright/test';
import { DEFAULT_BASE_URL, DEFAULT_USERNAME, resolveCredentials, resolveEnvironment } from '../../config/environment';

test('ENV usa a origem padrão e descarta caminho, query e credenciais da URL', () => {
  expect(resolveEnvironment({}).baseURL).toBe(new URL(DEFAULT_BASE_URL).origin);
  expect(resolveEnvironment({
    SAUCEDEMO_BASE_URL: ' https://usuario:segredo-sintetico@example.com/cart.html?token=sintetico ',
  }).baseURL).toBe('https://example.com');
});

test('ENV aceita HTTP somente nos endereços de loopback', () => {
  for (const host of ['localhost', '127.0.0.1', '[::1]']) {
    expect(resolveEnvironment({ SAUCEDEMO_BASE_URL: `http://${host}:4317/` }).baseURL).toBe(`http://${host}:4317`);
  }
  expect(() => resolveEnvironment({ SAUCEDEMO_BASE_URL: 'http://example.com' })).toThrow(/deve usar https/);
});

test('ENV rejeita URLs inválidas ou protocolos inseguros sem expor a entrada', () => {
  const marker = 'marcador-confidencial-sintetico';
  for (const input of [`url-invalida?token=${marker}`, `ftp://usuario:${marker}@example.com`]) {
    let message = '';
    try {
      resolveEnvironment({ SAUCEDEMO_BASE_URL: input });
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      message = error.message;
    }
    expect(message).toContain('SAUCEDEMO_BASE_URL');
    expect(message).not.toContain(marker);
    expect(message).not.toContain(input);
  }
});

test('ENV exige senha somente ao resolver credenciais e preserva seu conteúdo', () => {
  expect(() => resolveEnvironment({})).not.toThrow();
  expect(() => resolveCredentials({})).toThrow(/SAUCEDEMO_PASSWORD não definida/);
  expect(() => resolveCredentials({ SAUCEDEMO_PASSWORD: '' })).toThrow(/SAUCEDEMO_PASSWORD não definida/);
  expect(resolveCredentials({ SAUCEDEMO_PASSWORD: ' senha-sintetica ' })).toEqual({
    username: DEFAULT_USERNAME,
    password: ' senha-sintetica ',
  });
  expect(resolveCredentials({ SAUCEDEMO_USERNAME: ' usuario-sintetico ', SAUCEDEMO_PASSWORD: 'sintetica' }).username)
    .toBe('usuario-sintetico');
});
