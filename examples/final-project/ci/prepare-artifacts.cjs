// Somente este diretório sanitizado pode ser enviado pelo workflow.
// O HTML embute um ZIP com passos e erros: trocar texto apenas no HTML não basta.
const fs = require('node:fs/promises');
const path = require('node:path');
const { yauzl, yazl } = require(path.join(
  path.dirname(require.resolve('playwright-core/package.json')), 'lib/utilsBundle.js',
));

function redact(text, secret) {
  const variants = [secret, JSON.stringify(secret).slice(1, -1), encodeURIComponent(secret)]
    .filter(Boolean).sort((a, b) => b.length - a.length);
  for (const value of variants) text = text.split(value).join('[REDACTED]');
  return text;
}

function sanitizeZip(buffer, secret) {
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(buffer, { lazyEntries: true }, (error, input) => {
      if (error) return reject(error);
      const output = new yazl.ZipFile();
      const chunks = [];
      output.outputStream.on('data', (chunk) => chunks.push(chunk));
      output.outputStream.on('error', reject);
      output.outputStream.on('end', () => resolve(Buffer.concat(chunks)));
      input.on('error', reject);
      input.on('end', () => output.end());
      input.on('entry', (entry) => {
        // O relatório desta versão contém apenas JSON. Formato novo exige revisão.
        if (!entry.fileName.endsWith('.json')) {
          input.close();
          return reject(new Error('Formato inesperado no ZIP do relatório; upload bloqueado.'));
        }
        input.openReadStream(entry, (error, stream) => {
          if (error) return reject(error);
          const data = [];
          stream.on('error', reject);
          stream.on('data', (chunk) => data.push(chunk));
          stream.on('end', () => {
            output.addBuffer(Buffer.from(redact(Buffer.concat(data).toString('utf8'), secret)), entry.fileName);
            input.readEntry();
          });
        });
      });
      input.readEntry();
    });
  });
}

async function sanitizeHtml(html, secret) {
  const pattern = /data:application\/zip;base64,([A-Za-z0-9+/=]+)/;
  const match = html.match(pattern);
  if (!match) throw new Error('ZIP do relatório HTML não encontrado; upload bloqueado.');
  const sanitized = await sanitizeZip(Buffer.from(match[1], 'base64'), secret);
  return redact(html.replace(match[0], `data:application/zip;base64,${sanitized.toString('base64')}`), secret);
}

async function prepareArtifacts(root, secret) {
  if (!secret) throw new Error('Credencial ausente para sanitização; upload bloqueado.');
  const report = path.join(root, 'playwright-report');
  const results = path.join(root, 'test-results');
  const destination = path.join(results, 'ci-artifacts');
  await fs.mkdir(destination, { recursive: true });

  async function copyReport(directory, relative = '') {
    const entries = await fs.readdir(directory, { withFileTypes: true }).catch((error) => {
      if (error.code === 'ENOENT') return [];
      throw error;
    });
    for (const entry of entries) {
      const name = path.join(relative, entry.name);
      const source = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Symlink em evidências; upload bloqueado.');
      if (entry.isDirectory()) { await copyReport(source, name); continue; }
      const target = path.join(destination, 'playwright-report', name);
      await fs.mkdir(path.dirname(target), { recursive: true });
      if (name === 'index.html') {
        await fs.writeFile(target, await sanitizeHtml(await fs.readFile(source, 'utf8'), secret));
      } else if (/\.(json|md|txt)$/.test(name)) {
        await fs.writeFile(target, redact(await fs.readFile(source, 'utf8'), secret));
      } else if (name.endsWith('.png')) {
        // No CI, o bloco de senha pública fica oculto; o input usa type=password.
        await fs.copyFile(source, target);
      } else {
        throw new Error('Anexo não autorizado no relatório; upload bloqueado.');
      }
    }
  }

  async function copyScreenshots(directory, relative = '') {
    const entries = await fs.readdir(directory, { withFileTypes: true }).catch((error) => {
      if (error.code === 'ENOENT') return [];
      throw error;
    });
    for (const entry of entries) {
      if (!relative && entry.name === 'ci-artifacts') continue;
      if (entry.isSymbolicLink()) throw new Error('Symlink em evidências; upload bloqueado.');
      const name = path.join(relative, entry.name);
      const source = path.join(directory, entry.name);
      if (entry.isDirectory()) { await copyScreenshots(source, name); continue; }
      if (!entry.name.endsWith('.png')) continue;
      const target = path.join(destination, 'screenshots', name);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.copyFile(source, target);
    }
  }

  await copyReport(report);
  await copyScreenshots(results);
  return destination;
}

if (require.main === module) {
  prepareArtifacts(path.resolve(__dirname, '..'), process.env.SAUCEDEMO_PASSWORD)
    .then(() => console.log('[artifacts] Evidências sanitizadas; traces excluídos.'))
    .catch(() => { console.error('[artifacts] Sanitização falhou; upload bloqueado.'); process.exitCode = 1; });
}

module.exports = { redact, sanitizeHtml, prepareArtifacts };
