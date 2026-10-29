// Probes known pages + deliberately fake paths on toolpillot.com to see
// whether the server returns real 404s or soft-404s (200 with error page).
const paths = [
  '/about', '/privacy-policy', '/tools/chatgpt', '/fiction/guy-next-door',
  '/this-page-does-not-exist-12345', '/articles/fake-article-xyz', '/tools/not-a-real-tool'
];

for (const p of paths) {
  try {
    const r = await fetch('https://www.toolpillot.com' + p, {
      redirect: 'manual', signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const body = r.status >= 300 && r.status < 400 ? '' : (await r.text()).slice(0, 300);
    const marker = /404|not.?found/i.test(body) ? '  <-- body mentions 404/not found' : '';
    console.log(`${r.status}${r.headers.get('location') ? ' -> ' + r.headers.get('location') : ''}  ${p}${marker}`);
  } catch (e) {
    console.log(`ERR ${e.message}  ${p}`);
  }
}
