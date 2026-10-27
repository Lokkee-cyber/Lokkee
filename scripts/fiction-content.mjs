import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { github } from './github-content.mjs';

const seriesPath = 'content/fiction/series';
const episodesPath = 'content/fiction/episodes';
const filePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\.json$/;

// Copies fiction series/episode files from GitHub into a working directory;
// returns remote name->sha maps for both folders.
export async function loadFiction(seriesDirectory, episodesDirectory) {
  await rm(seriesDirectory, { recursive: true, force: true });
  await rm(episodesDirectory, { recursive: true, force: true });
  await mkdir(seriesDirectory, { recursive: true });
  await mkdir(episodesDirectory, { recursive: true });

  const remote = { series: new Map(), episodes: new Map() };
  for (const [key, path, directory] of [
    ['series', seriesPath, seriesDirectory],
    ['episodes', episodesPath, episodesDirectory],
  ]) {
    const response = await github(`/contents/${path}?ref=${encodeURIComponent(process.env.GITHUB_BRANCH || 'main')}`, { method: 'GET' });
    if (!response.ok) continue;
    const entries = await response.json();
    await Promise.all(entries
      .filter((entry) => entry.type === 'file' && filePattern.test(entry.name))
      .map(async (entry) => {
        const blob = await github(`/git/blobs/${entry.sha}`, { method: 'GET' });
        if (!blob.ok) return;
        const data = await blob.json();
        remote[key].set(entry.name, entry.sha);
        await writeFile(join(directory, entry.name), Buffer.from(data.content, 'base64').toString('utf8'));
      }));
  }
  return remote;
}

// Makes GitHub match the working directory for one file.
export async function syncFictionFile(directory, filename, folderPath, remoteMap, message) {
  const sha = remoteMap.get(filename);
  const local = await readFile(join(directory, filename), 'utf8');
  const response = await github(`/contents/${folderPath}/${filename}`, {
    method: 'PUT',
    body: {
      message,
      branch: process.env.GITHUB_BRANCH || 'main',
      content: Buffer.from(local).toString('base64'),
      ...(sha ? { sha } : {}),
    },
  });
  if (!response.ok) {
    const detail = (await response.text().catch(() => '')).slice(0, 200);
    throw new Error(`GitHub rejected the fiction save (HTTP ${response.status}) ${detail}`);
  }
  const saved = await response.json();
  remoteMap.set(filename, saved.content.sha);
  return true;
}

export async function listFictionFiles(directory) {
  try {
    return (await readdir(directory)).filter((name) => name.endsWith('.json'));
  } catch {
    return [];
  }
}
