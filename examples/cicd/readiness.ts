/// <reference types="node" />

// Global setup: aguarda o ambiente responder antes de executar qualquer teste.
// Separa "o ambiente ainda não está pronto" de "a funcionalidade quebrou":
// se o health check não responder dentro do prazo, nenhum teste é executado
// e a mensagem descreve a última resposta observada.

import { resolveTarget } from './environment';

const HEALTH_PATH = process.env.PLAYWRIGHT_HEALTH_PATH ?? '/api/health';
const READY_TIMEOUT_MS = Number(process.env.PLAYWRIGHT_READY_TIMEOUT_MS ?? 60_000);
const POLL_INTERVAL_MS = 2_000;
const REQUEST_TIMEOUT_MS = 5_000;

function explain(status: number): string {
  if (status === 401 || status === 403) {
    return 'acesso negado: o preview pode estar protegido (ex.: Deployment Protection da plataforma).';
  }
  if (status === 404) {
    return 'rota não encontrada: verifique PLAYWRIGHT_BASE_URL e PLAYWRIGHT_HEALTH_PATH.';
  }
  if (status >= 500) {
    return 'a aplicação respondeu com erro de servidor.';
  }
  return 'resposta inesperada.';
}

export default async function waitForEnvironment(): Promise<void> {
  const target = resolveTarget();
  const healthUrl = new URL(HEALTH_PATH, target.baseURL).toString();
  const deadline = Date.now() + READY_TIMEOUT_MS;
  let lastObservation = 'nenhuma tentativa concluída';

  console.log(`[readiness] ambiente=${target.env} url=${healthUrl} prazo=${READY_TIMEOUT_MS}ms`);

  while (Date.now() < deadline) {
    try {
      const response = await fetch(healthUrl, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
      if (response.ok) {
        console.log(`[readiness] ambiente pronto (HTTP ${response.status})`);
        return;
      }
      lastObservation = `HTTP ${response.status} — ${explain(response.status)}`;
      // 4xx não melhora esperando: é configuração, não aquecimento.
      if (response.status >= 400 && response.status < 500) break;
    } catch (error) {
      // fetch encapsula o motivo real (ECONNREFUSED, ENOTFOUND, timeout...) em error.cause.
      const cause = (error as { cause?: { code?: string; message?: string } }).cause;
      const reason = cause?.code ?? cause?.message ?? (error as Error).name;
      lastObservation = `sem resposta (${reason}) — ambiente indisponível ou ainda subindo.`;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error(
    `[readiness] ${healthUrl} não ficou pronto. Última observação: ${lastObservation} ` +
      'Nenhum teste funcional foi executado: investigue o ambiente antes da aplicação.',
  );
}
