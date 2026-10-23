import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const repo = () => process.env.GITHUB_REPO || 'Lokkee-cyber/Lokkee';
const branch = () => process.env.GITHUB_BRANCH || 'main';
const articlesPath = 'content/articles';
const articleFilePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\.(json|draft|deleted)$/;
const blobCache = new Map();

export async function github(path, { method = 'GET', body } = {}) {
  const token = process.env.GITHUB_ADMIN_TOKEN;
  if (!token) throw new Error('GITHUB_ADMIN_TOKEN is not configured.');
  const response = await fetch(`https://api.github.com/repos/${repo()}${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'lokkee-admin',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(20000),
  });
  return response;
}

async function expectOk(response, action) {
  if (response.ok) return response;
  const detail = (await response.text().catch(() => '')).slice(0, 200);
  console.error(`GitHub ${action} failed: HTTP ${response.status} ${detail}`);
  throw new Error(`GitHub rejected the request (${action}, HTTP ${response.status}). Check the token permissions.`);
}

export async function dispatchWorkflow(inputs) {
  const response = await github('/actions/workflows/content-automation.yml/dispatches', {
    method: 'POST',
    body: { ref: branch(), inputs: Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, String(value ?? '')])) },
  });
  await expectOk(response, 'workflow dispatch');
}

async function listRemote() {
  const response = await expectOk(await github(`/contents/${articlesPath}?ref=${encodeURIComponent(branch())}`), 'list articles');
  const entries = await response.json();
  return new Map(entries.filter((entry) => entry.type === 'file' && articleFilePattern.test(entry.name)).map((entry) => [entry.name, entry.sha]));
}

async function readBlob(sha) {
  if (blobCache.has(sha)) return blobCache.get(sha);
  const response = await expectOk(await github(`/git/blobs/${sha}`), 'read article');
  const data = await response.json();
  const text = Buffer.from(data.content, 'base64').toString('utf8');
  blobCache.set(sha, text);
  return text;
}

// Copies article files from GitHub into a working directory; returns the remote name->sha map.
export async function loadArticles(directory, { only } = {}) {
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
  const remote = await listRemote();
  const names = [...remote.keys()].filter((name) => !only || name.slice(0, name.lastIndexOf('.')) === only);
  for (let index = 0; index < names.length; index += 12) {
    await Promise.all(names.slice(index, index + 12).map(async (name) => {
      await writeFile(join(directory, name), await readBlob(remote.get(name)));
    }));
  }
  return remote;
}

// Makes GitHub match the working directory for one slug (json, draft and deleted marker files).
export async function syncSlug(directory, slug, remote, message) {
  const present = new Set(await readdir(directory));
  let changed = false;
  for (const extension of ['json', 'draft', 'deleted']) {
    const name = `${slug}.${extension}`;
    const path = `${articlesPath}/${name}`;
    const sha = remote.get(name);
    if (present.has(name)) {
      const text = await readFile(join(directory, name), 'utf8');
      if (sha && blobCache.get(sha) === text) continue;
      const response = await expectOk(await github(`/contents/${path}`, {
        method: 'PUT',
        body: { message, branch: branch(), content: Buffer.from(text).toString('base64'), ...(sha ? { sha } : {}) },
      }), 'save article');
      const saved = await response.json();
      blobCache.set(saved.content.sha, text);
      remote.set(name, saved.content.sha);
      changed = true;
    } else if (sha) {
      await expectOk(await github(`/contents/${path}`, { method: 'DELETE', body: { message, branch: branch(), sha } }), 'delete article');
      remote.delete(name);
      changed = true;
    }
  }
  return changed;
}
