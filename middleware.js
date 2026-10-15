import { next } from '@vercel/functions';
import { publicRoutePaths } from './src/data/generatedPublicRoutes.js';

const knownPaths = new Set(publicRoutePaths);
const notFoundHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex,nofollow" />
    <title>Page not found | LokkeeVerse</title>
    <style>
      :root { color-scheme: light; font-family: Arial, sans-serif; color: #102347; background: #f4f6fb; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; }
      main { width: min(100%, 560px); padding: 48px 32px; border: 1px solid #e1e7f0; border-radius: 20px; background: #fff; text-align: center; box-shadow: 0 16px 50px rgb(16 35 71 / 8%); }
      img { width: 48px; height: 48px; object-fit: contain; }
      .code { margin: 24px 0 4px; color: #16857f; font-size: 14px; font-weight: 800; letter-spacing: .12em; }
      h1 { margin: 0; font-size: clamp(28px, 6vw, 40px); }
      p { margin: 12px 0 28px; color: #58677f; line-height: 1.6; }
      a { display: inline-block; padding: 12px 20px; border-radius: 8px; background: #123b70; color: #fff; font-weight: 700; text-decoration: none; }
      a:focus-visible { outline: 3px solid #20aaa0; outline-offset: 3px; }
    </style>
  </head>
  <body>
    <main>
      <img src="/lokkeeverse-mark.svg" alt="LokkeeVerse" />
      <div class="code">ERROR 404</div>
      <h1>This page doesn’t exist</h1>
      <p>The link may be outdated, or the page may have moved. Explore LokkeeVerse to find current AI tools and articles.</p>
      <a href="/">Back to LokkeeVerse</a>
    </main>
  </body>
</html>`;

export default function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.length > 1 && path.endsWith('/')) {
    url.pathname = path.replace(/\/+$/, '');
    return Response.redirect(url, 308);
  }

  if (knownPaths.has(path)) return next();

  return new Response(notFoundHtml, {
    status: 404,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/html; charset=utf-8',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api(?:/|$)|admin(?:/|$)|private(?:/|$)|assets/|_vercel/|sitemap\\.xml$|robots\\.txt$|.*\\.[^/]+$).*)'],
};
