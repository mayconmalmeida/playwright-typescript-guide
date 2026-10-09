// Aplicação de demonstração do Capítulo 9.
// Servidor HTTP sem dependências: existe apenas para que os smoke tests
// tenham um alvo local, determinístico e sem conta em plataforma de deploy.

const http = require('node:http');

const PORT = Number(process.env.PORT ?? 4317);
const HOST = process.env.HOST ?? '127.0.0.1';

// Versão publicada. Em uma plataforma real, viria do SHA do commit implantado.
const APP_VERSION = process.env.APP_VERSION ?? 'dev';

// Injeção de falha didática, usada para provar que o gate retorna exit code != 0.
// Valores aceitos: courses-500 | health-503. Nunca use em um ambiente real.
const DEMO_FAILURE = process.env.DEMO_FAILURE ?? '';

// Estado em memória: some quando o processo termina.
const feedbacks = [];

const courses = ['Locators resilientes', 'Page Objects', 'Fixtures', 'CI com GitHub Actions'];

function layout(title, body) {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>${title} · Catálogo Demo</title>
  </head>
  <body>
    <header>
      <nav aria-label="Principal">
        <a href="/">Início</a>
        <a href="/cursos">Cursos</a>
        <a href="/contato">Contato</a>
      </nav>
    </header>
    <main>${body}</main>
    <footer><small>Versão ${APP_VERSION}</small></footer>
  </body>
</html>`;
}

const pages = {
  '/': () =>
    layout(
      'Início',
      `<h1>Catálogo de Cursos</h1>
      <p>Aprenda automação com Playwright e TypeScript.</p>
      <a href="/cursos">Ver cursos</a>`,
    ),
  '/cursos': () =>
    layout(
      'Cursos',
      `<h1>Cursos disponíveis</h1>
      <ul aria-label="Cursos">${courses.map((course) => `<li>${course}</li>`).join('')}</ul>`,
    ),
  '/contato': () =>
    layout(
      'Contato',
      `<h1>Fale conosco</h1>
      <form id="feedback">
        <label for="message">Mensagem</label>
        <textarea id="message" name="message" required></textarea>
        <button type="submit">Enviar</button>
      </form>
      <p role="status" id="feedback-status"></p>
      <script>
        document.getElementById('feedback').addEventListener('submit', async (event) => {
          event.preventDefault();
          const message = document.getElementById('message').value;
          const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ message }),
          });
          document.getElementById('feedback-status').textContent =
            response.status === 201 ? 'Mensagem recebida' : 'Falha ao enviar';
        });
      </script>`,
    ),
};

function send(res, status, contentType, body) {
  res.writeHead(status, { 'content-type': `${contentType}; charset=utf-8` });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch (error) {
        reject(error);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === '/api/health') {
    if (DEMO_FAILURE === 'health-503') {
      return send(res, 503, 'application/json', JSON.stringify({ status: 'unavailable' }));
    }
    return send(res, 200, 'application/json', JSON.stringify({ status: 'ok', version: APP_VERSION }));
  }

  if (pathname === '/api/feedback' && req.method === 'POST') {
    try {
      const { message } = await readJson(req);
      if (typeof message !== 'string' || message.trim() === '') {
        return send(res, 400, 'application/json', JSON.stringify({ error: 'message is required' }));
      }
      feedbacks.push(message);
      return send(res, 201, 'application/json', JSON.stringify({ id: feedbacks.length }));
    } catch {
      return send(res, 400, 'application/json', JSON.stringify({ error: 'invalid json' }));
    }
  }

  if (pathname === '/cursos' && DEMO_FAILURE === 'courses-500') {
    return send(res, 500, 'text/html', layout('Erro', '<h1>Erro interno</h1>'));
  }

  const page = pages[pathname];
  if (page) {
    return send(res, 200, 'text/html', page());
  }

  return send(res, 404, 'text/html', layout('Não encontrado', '<h1>Página não encontrada</h1>'));
});

server.listen(PORT, HOST, () => {
  const failure = DEMO_FAILURE ? ` (falha simulada: ${DEMO_FAILURE})` : '';
  console.log(`Catálogo Demo em http://${HOST}:${PORT} — versão ${APP_VERSION}${failure}`);
});
