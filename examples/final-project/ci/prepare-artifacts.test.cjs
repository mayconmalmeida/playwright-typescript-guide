const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { redact, sanitizeHtml, prepareArtifacts } = require('./prepare-artifacts.cjs');
const { yauzl, yazl } = require(path.join(
  path.dirname(require.resolve('playwright-core/package.json')), 'lib/utilsBundle.js',
));

function zipEntry(name, content) {
  return new Promise((resolve, reject) => {
    const zip = new yazl.ZipFile();
    const chunks = [];
    zip.outputStream.on('data', (chunk) => chunks.push(chunk));
    zip.outputStream.on('error', reject);
    zip.outputStream.on('end', () => resolve(Buffer.concat(chunks)));
    zip.addBuffer(Buffer.from(content), name);
    zip.end();
  });
}

function readJson(buffer) {
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(buffer, { lazyEntries: true }, (error, zip) => {
      if (error) return reject(error);
      zip.on('error', reject);
      zip.on('entry', (entry) => zip.openReadStream(entry, (error, stream) => {
        if (error) return reject(error);
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => { zip.close(); resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); });
      }));
      zip.readEntry();
    });
  });
}

test('remove valor bruto, escape JSON e escape de URL sem revelar a entrada', () => {
  const secret = 'credencial-sintetica"/';
  const input = [secret, JSON.stringify(secret).slice(1, -1), encodeURIComponent(secret)].join('\n');
  assert.equal(redact(input, secret), '[REDACTED]\n[REDACTED]\n[REDACTED]');
});

test('sanitiza o ZIP embutido e mantém JSON válido e contagens do relatório', async () => {
  const secret = 'credencial-sintetica';
  const zip = await zipEntry('report.json', JSON.stringify({ step: `Fill ${secret}`, count: 41 }));
  const html = `<script>data:application/zip;base64,${zip.toString('base64')}</script>`;
  const sanitized = await sanitizeHtml(html, secret);
  const encoded = sanitized.match(/base64,([A-Za-z0-9+/=]+)/)[1];
  assert.deepEqual(await readJson(Buffer.from(encoded, 'base64')), { step: 'Fill [REDACTED]', count: 41 });
});

test('bloqueia HTML sem ZIP e ZIP com formato não autorizado', async () => {
  await assert.rejects(sanitizeHtml('<html>sem relatório</html>', 'sintetica'), /upload bloqueado/);
  const zip = await zipEntry('trace.zip', 'não compartilhar');
  await assert.rejects(sanitizeHtml(`data:application/zip;base64,${zip.toString('base64')}`, 'sintetica'), /upload bloqueado/);
});

test('prepara apenas evidências permitidas, sanitiza anexos e exige credencial', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'chapter-10-artifacts-'));
  try {
    await assert.rejects(prepareArtifacts(directory, ''), /upload bloqueado/);
    await fs.mkdir(path.join(directory, 'playwright-report/data'), { recursive: true });
    await fs.mkdir(path.join(directory, 'test-results/case'), { recursive: true });
    await fs.writeFile(path.join(directory, 'playwright-report/data/context.md'), 'credencial-sintetica');
    await fs.writeFile(path.join(directory, 'test-results/case/failure.png'), 'synthetic PNG fixture');
    await fs.writeFile(path.join(directory, 'test-results/case/trace.zip'), 'never upload');
    const destination = await prepareArtifacts(directory, 'credencial-sintetica');
    assert.equal(await fs.readFile(path.join(destination, 'playwright-report/data/context.md'), 'utf8'), '[REDACTED]');
    assert.deepEqual(await fs.readdir(path.join(destination, 'screenshots/case')), ['failure.png']);
    await fs.writeFile(path.join(directory, 'playwright-report/data/trace.zip'), 'never upload');
    await assert.rejects(prepareArtifacts(directory, 'credencial-sintetica'), /upload bloqueado/);
  } finally {
    assert.equal(path.dirname(directory), os.tmpdir());
    assert.ok(path.basename(directory).startsWith('chapter-10-artifacts-'));
    await fs.rm(directory, { recursive: true, force: true });
  }
});
