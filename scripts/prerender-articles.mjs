
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = resolve(root, 'content/articles');
const distDir = resolve(root, 'dist');
const siteUrl = 'https://www.toolpillot.com';

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);

function markdownToHtml(markdown = '') {
  const lines = markdown.split(/\r?\n/);
  const output = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      output.push(`<p>${paragraph.map(escapeHtml).join(' ')}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list.length) {
      output.push(
        `<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      );
      list = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+)$/);

    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      output.push(`<h${level}>${escapeHtml(heading[2])}</h${level}>`);
    } else if (line.startsWith('- ')) {
      flushParagraph();
      list.push(line.slice(2));
    } else {
      flushList();
      paragraph.push(line);
    }
  }

  flushParagraph();
  flushList();

  return output.join('\n');
}

const files = await readdir(contentDir);

const deleted = new Set(
  files
    .filter((file) => file.endsWith('.deleted'))
    .map((file) => file.slice(0, -'.deleted'.length))
);

const drafts = new Set(
  files
    .filter((file) => file.endsWith('.draft'))
    .map((file) => file.slice(0, -'.draft'.length))
);

let count = 0;

for (const filename of files.filter((file) => file.endsWith('.json'))) {
  const article = JSON.parse(
    await readFile(resolve(contentDir, filename), 'utf8')
  );

  const { slug, title, content, excerpt, image, author, readTime } = article;

  if (
    article.status !== 'published' ||
    !slug ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    deleted.has(slug) ||
    drafts.has(slug)
  ) {
    continue;
  }

  const pageTitle = article.seoTitle || `${title} | LokkeeVerse`;
  const description = article.metaDescription || excerpt || '';
  const canonical = `${siteUrl}/articles/${slug}`;

  const articleHtml = `
    <article>
      <nav aria-label="Breadcrumb">
        <a href="/">Home</a> /
        <a href="/ai-tools">AI Tools</a> /
        <span>${escapeHtml(title)}</span>
      </nav>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(excerpt || '')}</p>
      <p>By ${escapeHtml(!author || author === 'LokkeeVerse Editorial' ? 'LokkeeVerse' : author)}
        ${readTime ? ` · ${escapeHtml(readTime)}` : ''}
      </p>
      ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" style="max-width:100%;height:auto">` : ''}
      <div class="article-content">
        ${markdownToHtml(content || '')}
      </div>
    </article>
  `;

  const outputDir = resolve(distDir, 'articles', slug);
  await mkdir(outputDir, { recursive: true });

  const template = await readFile(resolve(distDir, 'index.html'), 'utf8');

  const html = template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`)
    .replace(
      /<meta\s+name="description"[^>]*>/i,
      `<meta name="description" content="${escapeHtml(description)}">`
    )
    .replace(
      /<link\s+rel="canonical"[^>]*>/i,
      ''
    )
    .replace(
      '</head>',
      `<link rel="canonical" href="${escapeHtml(canonical)}">
       <style>
         body{font-family:Arial,sans-serif;line-height:1.8;margin:0;color:#222}
         article{max-width:850px;margin:40px auto;padding:0 20px}
         h1{line-height:1.2;font-size:2.5rem}
         h2{margin-top:2rem}
         .article-content p{margin:1.2rem 0}
         img{border-radius:12px}
       </style>
       </head>`
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root">${articleHtml}</div>`
    );

  await writeFile(resolve(outputDir, 'index.html'), html, 'utf8');
  count++;
}

console.log(`Pre-rendered ${count} published JSON articles.`);
