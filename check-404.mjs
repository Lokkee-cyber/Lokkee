// Checks every sitemap URL from toolpillot.com (264 URLs) for 404s / error statuses.
// toolpillot.com redirects to lokkeeverse.com, whose DNS record no longer exists.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BASE = 'https://www.toolpillot.com';
const urls = fs.readFileSync(path.join(os.tmpdir(), 'toolpillot_urls.txt'), 'utf8')
  .split('\n').map(s => s.trim()).filter(Boolean);

const rel = u => u.replace('https://www.lokkeeverse.com', '');

const results = [];
const bad = [];
let done = 0;

async function check(url) {
  try {
    const r = await fetch(BASE + rel(url), { redirect: 'follow', signal: AbortSignal.timeout(20000) });
    const entry = { url, status: r.status, final: r.url };
    results.push(entry);
    if (r.status >= 400) bad.push(entry);
  } catch (e) {
    const entry = { url, status: 'ERR', error: String(e.message || e).slice(0, 120) };
    results.push(entry); bad.push(entry);
  }
  done++;
  if (done % 50 === 0) console.log(`...${done}/${urls.length}`);
}

const CONC = 10;
for (let i = 0; i < urls.length; i += CONC) {
  await Promise.all(urls.slice(i, i + CONC).map(check));
}

fs.writeFileSync(path.join(os.tmpdir(), 'toolpillot_results.json'), JSON.stringify(results, null, 2));

const counts = {};
for (const b of bad) counts[b.status] = (counts[b.status] || 0) + 1;
console.log('\n=== STATUS SUMMARY ===');
console.log(`Total checked: ${results.length}`);
console.log(`OK (200s): ${results.length - bad.length}`);
console.log('Problems by status:', JSON.stringify(counts));
console.log('\n=== PROBLEM PAGES ===');
for (const b of bad) console.log(`${b.status}  ${b.url}${b.error ? '  (' + b.error + ')' : ''}`);
