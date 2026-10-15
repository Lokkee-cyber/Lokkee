# ToolPillot / LokkeeVerse

## Local admin and publishing workflow

The admin editor and Content Automation dashboard run only in the local Vite development app. The published website is a static Vercel build. Article files under `content/articles/` remain the publishing source of truth:

- `*.draft` files are not included in public article pages or the sitemap.
- A reviewed `*.json` article with `status: "published"` is included by the next build and sitemap generation.
- Publishing in the editor writes to this checkout. It does not deploy the site; review and deploy the resulting build through the existing Vercel workflow.

### First-time setup

```sh
npm ci
```

Copy `.env.example` to `.env`, then set a private `LOCAL_CONTENT_ADMIN_PASSWORD` with at least 16 characters. Add provider credentials only on this backend file. `.env` is ignored by Git. Restart the admin API after changing it.

PowerShell:

```powershell
Copy-Item .env.example .env
notepad .env
```

Use two terminals from the project root:

```sh
npm run dev
npm run dev:admin-api
```

Open `http://127.0.0.1:5173/admin`. The API listens only on `127.0.0.1:4179`, accepts admin-page requests only from the local Vite origins, and requires the password configured above. The session cookie is HttpOnly, SameSite Strict, and expires after eight hours. The admin route is omitted from production builds.

### Content Automation

The dashboard can discover stories from configured RSS/Atom feeds, GNews, and NewsAPI.org; apply freshness, source-information, canonical-URL, provider-ID, and headline-similarity checks; request an original structured draft from Gemini; and save it as an unpublished `.draft` file. It records job and story state in the ignored `content/automation/` directory. API key presence is shown as status only; secret values are never returned to the browser. “AI Tools and Tutorials” maps to the existing public “AI Tools” category to avoid a duplicate.

The provider feeds supply discovery metadata and short descriptions. The AI prompt treats feed data as untrusted, disallows unsupported facts and quotations, and asks for an ineligible result when the source detail is insufficient. No publisher page is scraped and no publisher image is downloaded, hotlinked, or generated. Each automation draft retains the source URL, publisher, source publication timestamp, and retrieval timestamp. Manual review is the default. Optional automatic local publication requires both a selected non-sensitive category and a source explicitly marked trusted. Politics, personal finance, cryptocurrency, and health can never use automatic publication and require an additional fact-check confirmation. Automatic publication writes a published JSON file locally; it does not commit or deploy the site.

Feed URLs must use HTTPS. Source setup and every feed redirect reject loopback, private, link-local, metadata, and reserved IP addresses. Feed responses are bounded to 1 MB, use a 12-second default timeout, and are fetched sequentially. Configure source terms and required attribution yourself; adding a source requires an explicit permission confirmation.

To review a draft, open **Content Automation → Preview and Review Drafts**. **Edit draft** opens the existing editor. After review, use **Approve and publish locally** or **Reject draft**. The article page and pre-rendered article output show source links when the approved article is built. A published article enters the sitemap only after the existing sitemap generation/build step processes its published JSON file.

### Provider environment variables

All variables below are server-side in `.env`; never prefix secrets with `VITE_`.

| Variable | Required for | Notes |
| --- | --- | --- |
| `LOCAL_CONTENT_ADMIN_PASSWORD` | Admin sign-in | Required; at least 16 characters. |
| `GEMINI_API_KEY` | AI draft generation | Optional; without it, discovery remains available and drafts are not generated. Create a key in [Google AI Studio](https://aistudio.google.com/apikey). |
| `GEMINI_MODEL` | Gemini model selection | Optional; default is `gemini-flash-latest`. |
| `GNEWS_API_KEY` | GNews provider | Optional; only needed when a GNews source is enabled. |
| `NEWSAPI_API_KEY` | NewsAPI.org provider | Optional; only needed when a NewsAPI source is enabled. |
| `LOCAL_CONTENT_PORT` | Local editor API | Optional; default `4179`. |
| `LOCAL_CONTENT_TIMEZONE` | Initial scheduler timezone | Optional; default `Africa/Lagos`; may also be set in the dashboard. |
| `CONTENT_AUTOMATION_MAX_STORIES` | Provider calls/output cap | Optional backend ceiling; default `50`. Dashboard per-run limit is lower by default. |
| `CONTENT_AUTOMATION_MAX_PER_DAY` | Backend AI cap | Optional backend ceiling; default `100`. Dashboard daily AI limit is lower by default. |

Example safe placeholders are in `.env.example`. Never put real keys in source control or browser build variables. Gemini token usage is shown when returned by the API; the dashboard does not estimate cost. Check your provider account for current model pricing, quotas, commercial-use terms, attribution requirements, and data policies before enabling a source. A free/development plan may not permit commercial publication.

Pricing/plan check made on 14 October 2026 (provider prices can change): GNews lists its Free plan as non-commercial and its Essential plan at €49.99/month for commercial production; its terms say commercial-use permission ends when a paid plan lapses, including for stored data. NewsAPI's Developer plan is limited to development/testing, and its listed Business plan is $449/month. Check [Gemini model pricing](https://ai.google.dev/gemini-api/docs/pricing) and your Google AI project quota before generation. See [GNews plans](https://gnews.io/pricing), [GNews terms](https://gnews.io/legal/terms-of-service), [NewsAPI pricing](https://newsapi.org/pricing), [Gemini structured output documentation](https://ai.google.dev/gemini-api/docs/structured-output), and [Gemini model list](https://ai.google.dev/gemini-api/docs/models).

### Daily schedule

The setting persists the chosen time and timezone. Since this project is a static Vercel deployment, its serverless functions cannot write approved articles into the source checkout. The included scheduler entry point must run on a machine with this checkout and its `.env` file. Schedule it every 15 minutes; it checks the persisted time and starts at most one daily job. If the machine is off or asleep, the next check after the configured time can run the missed update.

Windows PowerShell, run from the project root:

```powershell
$projectPath = (Resolve-Path .).Path
$nodePath = (Get-Command node).Source
$taskAction = "`"$nodePath`" `"$projectPath\scripts\run-scheduled-content-update.mjs`""
schtasks /Create /TN "ToolPillot Content Automation" /SC MINUTE /MO 15 /TR $taskAction /F
```

In Task Scheduler, enable **Run task as soon as possible after a scheduled start is missed** if desired. The scheduled task runs as your Windows account, reads the project `.env`, and uses the repository checkout. Remove it with:

```powershell
schtasks /Delete /TN "ToolPillot Content Automation" /F
```

Linux/macOS cron (replace the path with the absolute project path and use the absolute `node` path if needed):

```cron
*/15 * * * * cd /absolute/path/to/Lokkee-main && /usr/bin/node scripts/run-scheduled-content-update.mjs
```

To publish reviewed content, run the existing production build, inspect the output, then commit and deploy the content changes through Vercel. Automatic commit/push/deployment are not enabled. Optional unattended publication only writes an eligible local JSON article and never deploys it.

## Deployment boundaries

For the frontend, use the existing Vercel project and repository connection: keep the project root at this Vite app, use `npm run build` as the build command and `dist` as the output directory, then deploy the reviewed commit. If you use the Vercel CLI and the project is already linked, the deployment command is `vercel --prod`.

There is no production automation backend in this project. Do not deploy or expose `scripts/local-content-server.mjs`: it is intentionally loopback-only and writes files into the local checkout. The separate `npm run server` Express/MongoDB API is not wired to public article rendering, content generation, or file publishing. [Vercel Cron invokes Vercel Functions](https://vercel.com/docs/cron-jobs), so it cannot run this file-writing workflow as currently deployed. A production admin/automation service would need a persistent writable CMS or a controlled Git/build deployment workflow; neither is configured here.

## Existing article editor features

The article editor lists code-defined content from `src/data/siteData.js` and local article files. Saving a code-defined article writes a same-slug override under `content/articles/`. Deleting a code-defined article writes a `.deleted` marker so it is excluded from the public article list and sitemap. Comparison articles use the existing table editor. These content changes take effect in a production build and must be reviewed and deployed like other changes.

## Commands

```sh
npm run dev                 # Vite local site
npm run dev:admin-api       # loopback local admin API
npm run automation:scheduler # check and run a due daily job once
npm test                    # existing routing checks and automation service tests
npm run build               # sitemap generation, production build, and article prerender
```

The independent Express/MongoDB article API under `server/` remains separate and is not used by the public static article pages or this file-based automation workflow.
