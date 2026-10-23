import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openStateStore } from './remote-state.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: resolve(root, '.env') });

const force = process.argv.includes('--force');
const directory = resolve(process.env.CONTENT_AUTOMATION_DATA_DIR || join(root, 'content', 'automation'));
const store = await openStateStore();

try {
  for (const key of ['settings', 'sources', 'stories', 'jobs']) {
    let value;
    try { value = JSON.parse(await readFile(join(directory, `${key}.json`), 'utf8')); }
    catch (error) {
      if (error.code === 'ENOENT') { console.log(`${key}: no local file, skipped.`); continue; }
      throw error;
    }
    const existing = await store.collection.findOne({ _id: key });
    if (existing && !force) { console.log(`${key}: already in MongoDB, skipped (use --force to overwrite).`); continue; }
    await store.collection.replaceOne({ _id: key }, { _id: key, value, updatedAt: new Date() }, { upsert: true });
    console.log(`${key}: imported${Array.isArray(value) ? ` (${value.length} items)` : ''}.`);
  }
} finally {
  await store.close();
}
