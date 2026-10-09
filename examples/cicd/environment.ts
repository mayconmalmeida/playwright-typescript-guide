/// <reference types="node" />

// Resolve para qual ambiente a suíte aponta.
// Regra central: nenhum valor ausente pode levar os testes para um ambiente remoto.
// Só "local" tem URL padrão; preview e produção exigem PLAYWRIGHT_BASE_URL explícita.

export type TargetEnv = 'local' | 'preview' | 'production';

export interface Target {
  env: TargetEnv;
  baseURL: string;
  // true quando o Playwright deve iniciar a aplicação de demonstração.
  startLocalServer: boolean;
}

export const LOCAL_URL = 'http://127.0.0.1:4317';

const TARGET_ENVS: TargetEnv[] = ['local', 'preview', 'production'];
const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]'];

function parseUrl(value: string): URL {
  try {
    return new URL(value);
  } catch {
    throw new Error(`PLAYWRIGHT_BASE_URL inválida: "${value}". Informe uma URL absoluta, como https://exemplo.com.`);
  }
}

export function resolveTarget(env: NodeJS.ProcessEnv = process.env): Target {
  const rawEnv = env.PLAYWRIGHT_TARGET_ENV?.trim() || 'local';
  const rawUrl = env.PLAYWRIGHT_BASE_URL?.trim() || '';

  if (!TARGET_ENVS.includes(rawEnv as TargetEnv)) {
    throw new Error(`PLAYWRIGHT_TARGET_ENV="${rawEnv}" não é suportado. Use: ${TARGET_ENVS.join(', ')}.`);
  }
  const targetEnv = rawEnv as TargetEnv;

  if (targetEnv === 'local') {
    if (!rawUrl) {
      return { env: 'local', baseURL: LOCAL_URL, startLocalServer: true };
    }
    // Uma URL remota com ambiente "local" (ou sem ambiente) é quase sempre engano.
    // Sem esta trava, testes que escrevem dados poderiam rodar contra produção.
    if (!LOOPBACK_HOSTS.includes(parseUrl(rawUrl).hostname)) {
      throw new Error(
        `PLAYWRIGHT_BASE_URL aponta para "${rawUrl}", mas PLAYWRIGHT_TARGET_ENV é "local". ` +
          'Declare explicitamente PLAYWRIGHT_TARGET_ENV=preview ou production.',
      );
    }
    return { env: 'local', baseURL: rawUrl, startLocalServer: false };
  }

  if (!rawUrl) {
    throw new Error(
      `PLAYWRIGHT_TARGET_ENV="${targetEnv}" exige PLAYWRIGHT_BASE_URL. ` +
        'Não existe URL padrão para ambientes remotos.',
    );
  }

  const url = parseUrl(rawUrl);
  if (url.protocol !== 'https:') {
    throw new Error(`Ambientes remotos devem usar https. Recebido: "${rawUrl}".`);
  }

  return { env: targetEnv, baseURL: url.origin, startLocalServer: false };
}
