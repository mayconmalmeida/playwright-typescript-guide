// Global setup: confirma que a SauceDemo está respondendo antes de qualquer teste.
// Separa "a aplicação externa está fora do ar" de "a funcionalidade quebrou":
// se esta verificação falhar, nenhum teste é executado e a mensagem descreve a última resposta observada.
//
// Somente leitura: um GET na página inicial. Sem login, sem credenciais, sem alterar estado.
// Usa o APIRequestContext do Playwright em vez de fetch: no Windows (Node 24), fetch para HTTPS
// dentro do global setup derrubava o processo ao encerrar (assertion do libuv, exit code 127).

import { request } from '@playwright/test';
import { resolveEnvironment } from './config/environment';

const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 10_000;
const RETRY_DELAY_MS = 3_000;
// Presente no HTML estático da SauceDemo: confirma que a URL serve a aplicação esperada,
// e não uma página de erro do provedor ou de um proxy respondendo 200.
const EXPECTED_MARKER = '<title>Swag Labs</title>';

function describeNetworkError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/ENOTFOUND|EAI_AGAIN/.test(message)) {
    return 'falha de DNS: verifique a URL e a conexão de rede';
  }
  const connectionCode = message.match(/ECONNREFUSED|ECONNRESET|ETIMEDOUT/)?.[0];
  if (connectionCode) {
    return `falha de conexão (${connectionCode})`;
  }
  if (/Timeout \d+ms exceeded/.test(message)) {
    return `sem resposta em ${REQUEST_TIMEOUT_MS}ms (timeout)`;
  }
  return `erro de rede (${message.split('\n')[0]})`;
}

export default async function waitForSauceDemo(): Promise<void> {
  const { baseURL } = resolveEnvironment();
  const context = await request.newContext();
  let lastObservation = 'nenhuma tentativa concluída';
  // Resposta que não melhora esperando (4xx, conteúdo errado): aponta para configuração, não para indisponibilidade.
  let isConfigurationProblem = false;

  console.log(`[readiness] url=${baseURL} tentativas=${MAX_ATTEMPTS} timeout=${REQUEST_TIMEOUT_MS}ms`);

  try {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const response = await context.get(baseURL, { timeout: REQUEST_TIMEOUT_MS });

        if (response.ok()) {
          if ((await response.text()).includes(EXPECTED_MARKER)) {
            console.log(`[readiness] SauceDemo disponível (HTTP ${response.status()}, tentativa ${attempt})`);
            return;
          }
          lastObservation = `HTTP ${response.status()}, mas o conteúdo não é a SauceDemo (marcador ${EXPECTED_MARKER} ausente)`;
          isConfigurationProblem = true;
          break;
        }

        lastObservation = `HTTP ${response.status()}`;
        // 4xx é configuração ou bloqueio, não instabilidade passageira.
        if (response.status() < 500) {
          isConfigurationProblem = true;
          break;
        }
      } catch (error) {
        lastObservation = describeNetworkError(error);
      }

      console.log(`[readiness] tentativa ${attempt}/${MAX_ATTEMPTS}: ${lastObservation}`);
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  } finally {
    await context.dispose();
  }

  const diagnosis = isConfigurationProblem
    ? 'verifique SAUCEDEMO_BASE_URL e o acesso à aplicação (provável problema de configuração ou bloqueio)'
    : 'trate como indisponibilidade da aplicação externa, não como regressão';
  throw new Error(
    `[readiness] ${baseURL} não está disponível. Última observação: ${lastObservation}. ` +
      `Nenhum teste funcional foi executado: ${diagnosis}.`,
  );
}
