import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const tempRoot = await mkdtemp(join(tmpdir(), 'toolpilot-content-automation-'));
process.env.CONTENT_AUTOMATION_DATA_DIR = join(tempRoot, 'automation');
process.env.CONTENT_ARTICLES_DIR = join(tempRoot, 'articles');
delete process.env.GEMINI_API_KEY;
delete process.env.OPENAI_API_KEY;
delete process.env.GNEWS_API_KEY;
delete process.env.NEWSAPI_API_KEY;
const service = await import(pathToFileURL(resolve('scripts/content-automation.mjs')).href);

after(async () => rm(tempRoot, { recursive: true, force: true }));

const fakeResponse = (payload, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: { get: () => null },
  text: async () => JSON.stringify(payload),
  json: async () => payload,
});
const geminiResponse = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: { 'content-type': 'application/json' },
});

test('supports the complete requested automation category set', async () => {
  const { automationCategories } = await import('../src/data/automationCategories.js');
  const { articleCategoryForAutomationCategory } = await import('../src/data/automationCategories.js');
  assert.equal(automationCategories.length, 38);
  assert.equal(new Set(automationCategories.map(({ title }) => title)).size, 38);
  assert.ok(automationCategories.some(({ title }) => title === 'Nigeria News'));
  assert.ok(automationCategories.some(({ title }) => title === 'Internet Trends and Viral Stories'));
  assert.equal(articleCategoryForAutomationCategory('AI Tools and Tutorials'), 'AI Tools');
});

test('rejects unsafe feed schemes, private addresses, and private DNS answers', async () => {
  await assert.rejects(service.validatePublicHttpsUrl('http://example.com/feed'), /HTTPS/);
  await assert.rejects(service.validatePublicHttpsUrl('https://127.0.0.1/feed'), /private/);
  await assert.rejects(service.validatePublicHttpsUrl('https://metadata.google.internal/feed'), /not allowed/);
  await assert.rejects(
    service.validatePublicHttpsUrl('https://feed.example.test/rss', async () => [{ address: '10.0.0.7', family: 4 }]),
    /private/,
  );
  const result = await service.validatePublicHttpsUrl('https://feed.example.test/rss', async () => [{ address: '93.184.216.34', family: 4 }]);
  assert.equal(result.address.address, '93.184.216.34');
});

test('parses RSS/Atom metadata and keeps source URLs and attribution', () => {
  const xml = `<rss><channel><item><title>Example news update</title><link>https://publisher.example/story/1</link><description><![CDATA[${'A useful factual summary. '.repeat(5)}]]></description><pubDate>Tue, 14 Oct 2026 08:00:00 GMT</pubDate><guid>story-1</guid></item></channel></rss>`;
  const [story] = service.parseFeed(xml, { id: 'rss-source', name: 'Publisher', attribution: 'Credit Publisher' });
  assert.equal(story.publisher, 'Publisher');
  assert.equal(story.attribution, 'Credit Publisher');
  assert.equal(story.url, 'https://publisher.example/story/1');
  assert.match(story.description, /useful factual summary/);
  assert.equal(story.publishedAt, '2026-10-14T08:00:00.000Z');
});

test('NewsAPI adapter sends its secret in a backend header and normalizes provider results', async () => {
  let requestOptions;
  const stories = await service.discoverFromSource(
    { id: 'news-source', name: 'NewsAPI', type: 'newsapi', attribution: 'NewsAPI attribution' },
    'World News', 5, 3000, { NEWSAPI_API_KEY: 'server-only-test-key' },
    { fetcher: async (_url, options) => { requestOptions = options; return fakeResponse({
      status: 'ok', articles: [{ title: 'A verified news headline', description: 'A source description long enough for review and an attributed summary.', url: 'https://publisher.example/story', publishedAt: '2026-10-14T07:00:00Z', source: { name: 'Publisher' } }],
    }); } },
  );
  assert.equal(requestOptions.headers['X-Api-Key'], 'server-only-test-key');
  assert.equal(stories[0].publisher, 'Publisher');
  assert.equal(stories[0].category, 'World News');
  assert.equal(stories[0].attribution, 'NewsAPI attribution');
});

test('provider errors and missing provider credentials are reported without network calls', async () => {
  let called = false;
  await assert.rejects(service.discoverFromSource(
    { id: 'news-source', name: 'NewsAPI', type: 'newsapi' }, 'World News', 5, 3000, {},
    { fetcher: async () => { called = true; return fakeResponse({}); } },
  ), /NEWSAPI_API_KEY is missing/);
  assert.equal(called, false);
  await assert.rejects(service.discoverFromSource(
    { id: 'gnews-source', name: 'GNews', type: 'gnews' }, 'World News', 5, 3000, { GNEWS_API_KEY: 'test-only' },
    { fetcher: async () => fakeResponse({}, 429) },
  ), /rate limit or quota/);
  await assert.rejects(service.discoverFromSource(
    { id: 'gnews-source', name: 'GNews', type: 'gnews' }, 'World News', 5, 3000, { GNEWS_API_KEY: 'test-only' },
    { fetcher: async () => fakeResponse({}, 403) },
  ), /daily request quota is exhausted/);
});

test('duplicate detection catches near-identical headlines', () => {
  assert.ok(service.headlineSimilarity('Nigeria government announces new education funding plan', 'Nigeria government announces new education funding plan today') > 0.8);
  assert.ok(service.headlineSimilarity('Nigeria government announces new education funding plan', 'A new smartphone launches in Europe') < 0.2);
});

test('AI generation rejects missing keys and invalid structured responses', async () => {
  let called = false;
  assert.deepEqual(service.providerStatus({ GEMINI_API_KEY: 'server-only-key' }).gemini, {
    configured: true, model: 'gemini-flash-latest',
  });
  await assert.rejects(service.generateArticle({}, { env: {}, fetcher: async () => { called = true; return fakeResponse({}); } }), /not configured.*GEMINI_API_KEY/);
  assert.equal(called, false);
  await assert.rejects(service.generateArticle({}, {
    env: { GEMINI_API_KEY: 'backend-test-key' }, timeoutMs: 3000,
    fetcher: async () => geminiResponse({ candidates: [{ content: { parts: [{ text: 'not-json' }] } }] }),
  }), /invalid structured article data/);
  await assert.rejects(service.generateArticle({}, {
    env: { GEMINI_API_KEY: 'backend-test-key' }, timeoutMs: 3000,
    fetcher: async () => geminiResponse({ error: { status: 'RESOURCE_EXHAUSTED', message: 'quota exceeded' } }, 429),
  }), /Gemini rate limit or quota reached/);
});

test('Gemini generation requests schema-constrained JSON and records actual token usage', async () => {
  const content = `## What the source reports\n\n${'The source description confirms a limited set of facts and the draft explains what remains unverified. '.repeat(5)}`;
  let requestBody;
  let requestUrl;
  let requestOptions;
  let requestCount = 0;
  const generated = await service.generateArticle({ category: 'Technology', title: 'A reported update', description: 'A source description', publisher: 'Publisher', url: 'https://publisher.example/story' }, {
    env: { GEMINI_API_KEY: 'backend-test-key', GEMINI_MODEL: 'test-model' },
    fetcher: async (url, options) => {
      requestCount += 1;
      requestUrl = String(url);
      requestOptions = options;
      requestBody = JSON.parse(options.body);
      return geminiResponse({ candidates: [{ content: { parts: [{ text: JSON.stringify({
        eligible: true, reason: 'Source summary provides enough detail.', title: 'A verified technology update',
        excerpt: 'A short attributed summary of the reported update.', content,
        seoTitle: 'Verified technology update', metaDescription: 'A concise description of the reported update.', eventDate: '', tags: ['Technology'],
      }) }] } }], usageMetadata: { promptTokenCount: 321, candidatesTokenCount: 184 } });
    },
  });
  assert.equal(requestUrl, 'https://generativelanguage.googleapis.com/v1beta/models/test-model:generateContent');
  assert.equal(new Headers(requestOptions.headers).get('x-goog-api-key'), 'backend-test-key');
  assert.equal(requestBody.generationConfig.responseMimeType, 'application/json');
  assert.equal(requestBody.generationConfig.responseJsonSchema.type, 'object');
  assert.match(requestBody.systemInstruction.parts[0].text, /untrusted/);
  assert.equal(requestCount, 1);
  assert.equal(generated.usage.inputTokens, 321);
  assert.equal(generated.usage.outputTokens, 184);
  assert.equal(generated.eligible, true);
});

test('settings and sources persist on disk and reject unpermitted source configuration', async () => {
  const defaults = await service.getSettings();
  assert.equal(defaults.dailySchedule.enabled, false);
  const updated = await service.updateSettings({
    ...defaults, enabledCategories: ['World News', 'Nigeria News'], maxStoriesPerRun: 7,
    dailySchedule: { enabled: true, time: '08:30', timezone: 'Africa/Lagos' },
  });
  assert.equal(updated.maxStoriesPerRun, 7);
  assert.equal((await service.getSettings()).dailySchedule.time, '08:30');
  await assert.rejects(service.saveSource({ name: 'Unpermitted', type: 'gnews', categories: ['World News'], attribution: 'Attribution', permitted: false }), /Confirm that this source permits/);
  const source = await service.saveSource({ name: 'GNews test', type: 'gnews', categories: ['World News'], attribution: 'Credit GNews', permitted: true });
  assert.equal((await service.getSources())[0].id, source.id);
  const saved = JSON.parse(await readFile(join(process.env.CONTENT_AUTOMATION_DATA_DIR, 'settings.json'), 'utf8'));
  assert.equal(saved.maxStoriesPerRun, 7);
});

test('job state persists, blocks overlapping work, and allows a failed-job retry', async () => {
  const oldSchedule = (await service.getSettings()).dailySchedule;
  await service.updateSettings({ dailySchedule: { ...oldSchedule, enabled: false } });
  const first = await service.startContentJob({ categoryFilter: ['World News'] });
  await assert.rejects(service.startContentJob({ categoryFilter: ['World News'] }), /already running/);
  const completed = await waitForJob(first.id);
  assert.equal(completed.status, 'completed_with_errors');
  assert.match(completed.errors[0].message, /GNEWS_API_KEY is missing/);
  const retry = await service.retryJob(first.id);
  const retried = await waitForJob(retry.id);
  assert.equal(retried.retryOf, first.id);
  assert.equal(retried.status, 'completed_with_errors');
  assert.ok((await service.getDashboard()).jobs.length >= 2);
});

test('daily schedule runs once in its configured timezone', async () => {
  await service.updateSettings({ dailySchedule: { enabled: true, time: '08:00', timezone: 'UTC' } });
  const beforeTime = await service.runScheduledUpdateIfDue(new Date('2026-10-14T07:59:00.000Z'));
  assert.equal(beforeTime.started, false);
  const due = await service.runScheduledUpdateIfDue(new Date('2026-10-14T08:01:00.000Z'));
  assert.equal(due.started, true);
  const scheduledJob = await waitForJob(due.jobId);
  assert.equal(scheduledJob.trigger, 'daily-schedule');
  const secondCheck = await service.runScheduledUpdateIfDue(new Date('2026-10-14T10:00:00.000Z'));
  assert.equal(secondCheck.started, false);
});

test('draft publication retains provenance, is idempotent, and only creates a published JSON file', async () => {
  const storyId = 'rss:test-publisher-story';
  const article = await service.writeDraft({
    id: storyId, title: 'Original reported title', category: 'World News',
    url: 'https://publisher.example/story/1', publisher: 'Publisher', attribution: 'Credit Publisher',
    publishedAt: '2026-10-14T08:00:00.000Z',
  }, {
    title: 'Reviewed article title', excerpt: 'A useful attributed summary that meets the article editor limits.',
    content: `## Reported information\n\n${'This paragraph contains only details attributed to the source and retains a clear review note. '.repeat(5)}`,
    seoTitle: 'Reviewed article title', metaDescription: 'A concise search description.', tags: ['World News'], usage: null,
  }, '11111111-1111-4111-8111-111111111111', storyId);
  assert.equal(article.status, 'draft');
  assert.equal(article.image, '');
  const published = await service.publishDraft(article.slug);
  assert.equal(published.article.status, 'published');
  assert.equal(published.article.automation.reviewStatus, 'approved');
  assert.equal(published.article.sourceReferences[0].publisher, 'Publisher');
  assert.equal((await service.publishDraft(article.slug)).alreadyPublished, true);
  await assert.rejects(readFile(join(process.env.CONTENT_ARTICLES_DIR, `${article.slug}.draft`)));
  assert.equal(JSON.parse(await readFile(join(process.env.CONTENT_ARTICLES_DIR, `${article.slug}.json`), 'utf8')).status, 'published');
});

test('high-impact drafts require explicit fact-check confirmation before publication', async () => {
  const article = await service.writeDraft({
    id: 'rss:health-story', sourceId: 'health-source', title: 'Health policy reported update', category: 'Health and Wellness',
    url: 'https://publisher.example/health', publisher: 'Publisher', attribution: 'Credit Publisher', publishedAt: '2026-10-14T08:00:00Z',
  }, {
    title: 'A reported health policy update', excerpt: 'A short source-attributed description of the reported policy.',
    content: `## Reported information\n\n${'The source supports this careful summary, but the reader should verify health claims with the cited source. '.repeat(5)}`,
    seoTitle: 'A reported health policy update', metaDescription: 'A factual description of a reported health policy.', tags: ['Health'], usage: null,
  }, '22222222-2222-4222-8222-222222222222', 'rss:health-story');
  await assert.rejects(service.publishDraft(article.slug), /additional fact-check/);
  const published = await service.publishDraft(article.slug, { highImpactReviewed: true });
  assert.equal(published.article.automation.factCheckStatus, 'human-reviewed');
});

test('automatic publication requires an enabled, trusted source and selected non-sensitive category', async () => {
  const [source] = await service.getSources();
  await assert.rejects(service.updateSettings({ autoPublish: true, autoPublishCategories: ['Health and Wellness'] }), /non-sensitive/);
  await service.updateSettings({ autoPublish: true, autoPublishCategories: ['World News'] });
  const draft = await service.writeDraft({
    id: 'gnews:auto-story', sourceId: source.id, title: 'A reported world update', category: 'World News',
    url: 'https://publisher.example/world', publisher: 'Publisher', attribution: 'Credit Publisher', publishedAt: '2026-10-14T08:00:00Z',
  }, {
    title: 'A verified world update', excerpt: 'A concise attributed description of the reported update.',
    content: `## Reported information\n\n${'The source confirms a limited set of facts and this draft retains its attribution. '.repeat(6)}`,
    seoTitle: 'A verified world update', metaDescription: 'A concise description of the reported update.', tags: ['World News'], usage: null,
  }, '33333333-3333-4333-8333-333333333333', 'gnews:auto-story');
  await assert.rejects(service.publishDraft(draft.slug, { automated: true }), /not enabled for this source and category/);
  await service.saveSource({ ...source, trustedForAutoPublish: true });
  const published = await service.publishDraft(draft.slug, { automated: true });
  assert.equal(published.article.automation.reviewStatus, 'auto-approved');
  assert.equal(published.article.automation.publishMode, 'trusted-source-auto');
});

async function waitForJob(jobId) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const job = await service.getJob(jobId);
    if (job && !['queued', 'running'].includes(job.status)) return job;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 50));
  }
  throw new Error(`Job ${jobId} did not finish in time.`);
}
