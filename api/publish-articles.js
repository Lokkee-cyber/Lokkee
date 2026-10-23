import { createHash, timingSafeEqual } from 'node:crypto';

const repo = process.env.GITHUB_REPO || 'Lokkee-cyber/Lokkee';
const workflow = 'publish-automated-articles.yml';
const ref = process.env.GITHUB_REF_NAME || 'main';
const failures = new Map();

function digest(value) {
  return createHash('sha256').update(String(value)).digest();
}

function authorized(req) {
  const expected = process.env.PUBLISH_ADMIN_PASSWORD;
  if (!expected || expected.length < 16) return false;
  const header = req.headers.authorization || '';
  const supplied = header.startsWith('Bearer ') ? header.slice(7) : '';
  return timingSafeEqual(digest(supplied), digest(expected));
}

function tooManyFailures(ip) {
  const entry = failures.get(ip);
  return Boolean(entry && entry.count >= 5 && Date.now() - entry.at < 15 * 60 * 1000);
}

function recordFailure(ip) {
  const entry = failures.get(ip);
  const fresh = !entry || Date.now() - entry.at >= 15 * 60 * 1000;
  failures.set(ip, { count: fresh ? 1 : entry.count + 1, at: fresh ? Date.now() : entry.at });
}

async function github(path, options = {}) {
  return fetch(`https://api.github.com/repos/${repo}${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_DISPATCH_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'lokkee-publish-admin',
      ...options.headers,
    },
  });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed.' });
  if (!process.env.GITHUB_DISPATCH_TOKEN || !process.env.PUBLISH_ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'Publishing is not configured on the server.' });
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (tooManyFailures(ip)) return res.status(429).json({ error: 'Too many attempts. Try again later.' });
  if (!authorized(req)) {
    recordFailure(ip);
    return res.status(401).json({ error: 'Incorrect password.' });
  }
  failures.delete(ip);

  try {
    if (req.method === 'GET') {
      const response = await github(`/actions/workflows/${workflow}/runs?per_page=5`);
      if (!response.ok) return res.status(502).json({ error: 'Could not read workflow runs.' });
      const data = await response.json();
      return res.status(200).json({
        runs: data.workflow_runs.map((run) => ({
          id: run.id, status: run.status, conclusion: run.conclusion, createdAt: run.created_at, url: run.html_url,
        })),
      });
    }

    const category = typeof req.body?.category === 'string' ? req.body.category.trim().slice(0, 100) : '';
    const response = await github(`/actions/workflows/${workflow}/dispatches`, {
      method: 'POST',
      body: JSON.stringify({ ref, inputs: { category } }),
    });
    if (response.status !== 204) return res.status(502).json({ error: 'GitHub rejected the request. Check the token permissions.' });
    return res.status(202).json({ message: 'Publishing started. New articles appear in a few minutes.' });
  } catch (error) {
    console.error('publish-articles failed:', error.message);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
}
