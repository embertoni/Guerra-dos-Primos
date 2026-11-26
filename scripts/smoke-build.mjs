import { spawn } from 'node:child_process';
import process from 'node:process';
import { log } from 'node:console';
import assert from 'node:assert/strict';
import { setTimeout } from 'node:timers/promises';
const child = spawn(process.execPath, ['apps/server/dist/index.js'], {
  env: { ...process.env, PORT: '3101' },
  stdio: 'pipe',
});
try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await globalThis.fetch('http://127.0.0.1:3101/health');
      assert.deepEqual(await response.json(), { status: 'ok', phase: 1 });
      ready = true;
      break;
    } catch {
      await setTimeout(100);
    }
  }
  assert.ok(ready, 'Build do servidor deve iniciar');
  const html = await globalThis.fetch('http://127.0.0.1:3101/');
  assert.equal(html.status, 200);
  assert.match(await html.text(), /Guerra dos Primos/);
  const original = await globalThis.fetch(
    'http://127.0.0.1:3101/assets/tabuleiro-original.jpeg',
  );
  assert.equal(original.status, 200);
  assert.match(original.headers.get('content-type'), /image\/jpeg/);
  log('Build servido: /health, / e imagem original — OK');
} finally {
  child.kill();
}
