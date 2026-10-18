import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { after, test } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const projectRoot = resolve('.');
const tempRoot = await mkdtemp(join(tmpdir(), 'toolpilot-admin-auth-'));
const contentRoot = join(tempRoot, 'articles');
const automationRoot = join(tempRoot, 'automation');
const adminPassword = 'local-test-password-with-more-than-16-chars';
const port = await reservePort();
const child = spawn(process.execPath, ['scripts/local-content-server.mjs'], {
  cwd: projectRoot,
  windowsHide: true,
  env: {
    ...process.env,
    LOCAL_CONTENT_PORT: String(port),
    LOCAL_CONTENT_ADMIN_PASSWORD: adminPassword,
    CONTENT_ARTICLES_DIR: contentRoot,
    CONTENT_AUTOMATION_DATA_DIR: automationRoot,
    GEMINI_API_KEY: 'secret-test-gemini-key',
    OPENAI_API_KEY: 'secret-test-openai-key',
    GNEWS_API_KEY: 'secret-test-gnews-key',
    NEWSAPI_API_KEY: 'secret-test-newsapi-key',
  },
});
let childOutput = '';
child.stdout.on('data', (chunk) => { childOutput += chunk.toString(); });
child.stderr.on('data', (chunk) => { childOutput += chunk.toString(); });
const origin = 'http://127.0.0.1:5173';
const baseUrl = `http://127.0.0.1:${port}/__local-content`;

after(async () => {
  child.kill();
  await rm(tempRoot, { recursive: true, force: true });
});

test('local admin endpoints require sign-in and provider secrets stay server-side', async () => {
  await waitForServer();
  const statusResponse = await fetch(`${baseUrl}/session`);
  assert.equal(statusResponse.status, 200);
  assert.deepEqual(await statusResponse.json(), { authenticated: false, passwordConfigured: true });

  const unauthorizedArticles = await fetch(`${baseUrl}/articles`);
  assert.equal(unauthorizedArticles.status, 401);
  const unauthorizedPublish = await fetch(`${baseUrl}/automation/drafts/no-such-article/publish`, {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{}',
  });
  assert.equal(unauthorizedPublish.status, 401);

  const badLogin = await fetch(`${baseUrl}/session`, {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'incorrect' }),
  });
  assert.equal(badLogin.status, 401);

  const login = await fetch(`${baseUrl}/session`, {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ password: adminPassword }),
  });
  assert.equal(login.status, 200);
  const setCookie = login.headers.get('set-cookie');
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /SameSite=Strict/);
  const cookie = setCookie.split(';')[0];
  const dashboard = await fetch(`${baseUrl}/automation`, { headers: { Cookie: cookie } });
  assert.equal(dashboard.status, 200);
  const result = await dashboard.text();
  assert.match(result, /"configured":true/);
  assert.match(result, /"gemini":\{"configured":true,"model":"gemini-flash-latest"\}/);
  assert.equal(result.includes('secret-test-gemini-key'), false);
  assert.equal(result.includes('secret-test-openai-key'), false);
  assert.equal(result.includes('secret-test-gnews-key'), false);
  assert.equal(result.includes('secret-test-newsapi-key'), false);

  const logout = await fetch(`${baseUrl}/session/logout`, { method: 'POST', headers: { Origin: origin, Cookie: cookie } });
  assert.equal(logout.status, 200);
  const signedOut = await fetch(`${baseUrl}/articles`, { headers: { Cookie: cookie } });
  assert.equal(signedOut.status, 401);
});

async function reservePort() {
  const server = createServer();
  await new Promise((resolvePromise, rejectPromise) => server.listen(0, '127.0.0.1', (error) => error ? rejectPromise(error) : resolvePromise()));
  const address = server.address();
  await new Promise((resolvePromise, rejectPromise) => server.close((error) => error ? rejectPromise(error) : resolvePromise()));
  return address.port;
}

async function waitForServer() {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Admin API exited: ${childOutput}`);
    try {
      const response = await fetch(`${baseUrl}/session`, { signal: AbortSignal.timeout(500) });
      if (response.ok) return;
    } catch { await new Promise((resolvePromise) => setTimeout(resolvePromise, 100)); }
  }
  throw new Error(`Admin API did not start: ${childOutput}`);
}
