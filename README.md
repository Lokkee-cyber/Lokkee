# ToolPilot AI

## Local article publishing

The article editor is available only in the Vite development build. Run these commands in two terminals from the project root:

```sh
npm run dev
npm run dev:admin-api
```

Open `http://127.0.0.1:5173/admin`. The editor writes one file per article under `content/articles/`: drafts use the `.draft` suffix, and published articles use `.json`. Only published JSON files are imported into the public bundle and sitemap. Publishing locally makes an article available in local previews and includes it in the next production build.

The editor API listens only on `127.0.0.1:4179`, accepts writes only from the local editor origin, and is proxied by Vite. Do not expose that API or the Vite development server to a public network. It has no user login because it is intended only for local use.

Before deploying a published article:

1. Review its content, sources, image rights, title, excerpt, category, and SEO description.
2. Run `npm run build` and inspect the resulting site.
3. Review and commit the article JSON file with any intended code changes, then push and deploy.

Production builds do not include the `/admin` route or the local write API. Existing hard-coded articles remain in `src/data/siteData.js`; this editor manages new articles stored under `content/articles/`.
