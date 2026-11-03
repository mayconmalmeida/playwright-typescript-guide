// Resolve para onde a suíte aponta e com quais credenciais.
// Regra central: a senha nunca tem valor padrão no código e nunca é impressa.
// A URL e o username são públicos; a senha é lida do ambiente somente quando um teste precisa dela.

export const DEFAULT_BASE_URL = 'https://www.saucedemo.com/';
// Usuário público exibido na própria tela de login da SauceDemo.
export const DEFAULT_USERNAME = 'standard_user';

const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]'];

export interface Environment {
  baseURL: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export function resolveEnvironment(env: NodeJS.ProcessEnv = process.env): Environment {
  const rawUrl = env.SAUCEDEMO_BASE_URL?.trim() || DEFAULT_BASE_URL;

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`SAUCEDEMO_BASE_URL inválida: "${rawUrl}". Informe uma URL absoluta, como ${DEFAULT_BASE_URL}.`);
  }

  // http só faz sentido para uma cópia local da aplicação.
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && LOOPBACK_HOSTS.includes(url.hostname))) {
    throw new Error(`SAUCEDEMO_BASE_URL deve usar https (http apenas em localhost). Recebido: "${rawUrl}".`);
  }

  // As rotas da SauceDemo ficam na raiz (/inventory.html, /cart.html...): apenas a origem é usada.
  return { baseURL: url.origin };
}

// Chamada pelas fixtures, não pelo config: comandos estruturais como --list
// e o readiness check funcionam sem senha configurada.
export function resolveCredentials(env: NodeJS.ProcessEnv = process.env): Credentials {
  const username = env.SAUCEDEMO_USERNAME?.trim() || DEFAULT_USERNAME;
  const password = env.SAUCEDEMO_PASSWORD;

  if (!password) {
    throw new Error(
      'SAUCEDEMO_PASSWORD não definida. Copie a senha exibida na tela de login de ' +
        `${DEFAULT_BASE_URL} e exporte a variável antes de executar os testes ` +
        '(veja examples/final-project/README.md, seção "Credenciais").',
    );
  }

  return { username, password };
}
