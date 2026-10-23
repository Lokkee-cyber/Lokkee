import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { MongoClient } from 'mongodb';

const databaseName = 'toolpilot';
const collectionName = 'lokkee_admin_state';
const keys = ['settings', 'sources', 'jobs', 'stories', 'meta'];
const staleJobMs = 60 * 60 * 1000;

const hash = (text) => createHash('sha256').update(text).digest('hex');
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;

export async function openStateStore() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured.');
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  const collection = client.db(databaseName).collection(collectionName);
  const loaded = new Map();

  return {
    collection,
    client,

    // Replaces the working directory with the persisted automation state.
    async load(directory) {
      await rm(directory, { recursive: true, force: true });
      await mkdir(directory, { recursive: true });
      loaded.clear();
      for (const key of keys) {
        const document = await collection.findOne({ _id: key });
        if (!document) continue;
        const text = serialize(document.value);
        loaded.set(key, hash(text));
        await writeFile(join(directory, `${key}.json`), text);
      }
    },

    // Writes back only the documents that changed, so concurrent edits to other documents survive.
    async save(directory) {
      for (const key of keys) {
        let text;
        try { text = await readFile(join(directory, `${key}.json`), 'utf8'); }
        catch (error) { if (error.code === 'ENOENT') continue; throw error; }
        const normalized = serialize(JSON.parse(text));
        if (loaded.get(key) === hash(normalized)) continue;
        await collection.replaceOne({ _id: key }, { _id: key, value: JSON.parse(text), updatedAt: new Date() }, { upsert: true });
        loaded.set(key, hash(normalized));
      }
    },

    async getMeta() {
      return (await collection.findOne({ _id: 'meta' }))?.value || {};
    },

    async close() { await client.close().catch(() => {}); },
  };
}

// Jobs left queued or running by a crashed or cancelled worker would block new updates forever.
export async function expireStaleJobs(directory, now = Date.now()) {
  const file = join(directory, 'jobs.json');
  let jobs;
  try { jobs = JSON.parse(await readFile(file, 'utf8')); }
  catch { return false; }
  let changed = false;
  const stamp = new Date(now).toISOString();
  for (const job of jobs) {
    if (!['queued', 'running'].includes(job.status)) continue;
    if (now - Date.parse(job.updatedAt || job.createdAt) < staleJobMs) continue;
    changed = true;
    job.status = 'failed';
    job.finishedAt = stamp;
    job.updatedAt = stamp;
    job.progress = { ...job.progress, message: 'The worker stopped before this update finished. Retry it to continue.' };
    job.errors = [...(job.errors || []), { message: 'The worker did not report progress for an hour.', at: stamp }];
  }
  if (changed) await writeFile(file, serialize(jobs));
  return changed;
}
