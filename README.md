# ToolPilot AI

## Local article publishing

The article editor is available only in the Vite development build. Run these commands in two terminals from the project root:

```sh
npm run dev
npm run dev:admin-api
```

Open `http://127.0.0.1:5173/admin`. The editor writes one file per article under `content/articles/`: drafts use the `.draft` suffix, and published articles use `.json`. Only published JSON files are imported into the public bundle and sitemap. Publishing locally makes an article available in local previews and includes it in the next production build.

The editor lists the code-defined articles in `src/data/siteData.js` as well as local article files. Select an article from the dropdown or list to edit it. Saving a code-defined article writes a same-slug JSON override under `content/articles/`; publishing that override takes precedence over the original preview. Deleting a locally authored article removes its file. Deleting a code-defined article removes any local override and writes a `.deleted` marker so it is excluded from the public article list and sitemap. These content changes take effect in a production build and must be reviewed, committed, pushed, and deployed like other changes.

Enable “This is a comparison article” in the editor to build a comparison table with two to four objects and as many feature rows as needed. Published comparison articles appear in the Comparisons menu and the `/comparisons` index; other published articles appear in Explore, grouped into Featured and Latest. Route changes return the page to the top.

The editor API listens only on `127.0.0.1:4179`, accepts writes only from `http://127.0.0.1:5173` or `http://localhost:5173`, and is proxied by Vite. Use one of those exact local URLs to open the editor. Do not expose that API or the Vite development server to a public network. It has no user login because it is intended only for local use.

Before deploying a published article:

1. Review its content, sources, image rights, title, excerpt, category, and SEO description.
2. Run `npm run build` and inspect the resulting site.
3. Review and commit the article JSON file with any intended code changes, then push and deploy.

Production builds do not include the `/admin` route or the local write API. Code-defined article metadata remains in `src/data/siteData.js`; local overrides and deletion markers live under `content/articles/`.
