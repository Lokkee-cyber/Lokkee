import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Card, CardContent,
  Checkbox, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, LinearProgress, MenuItem,
  Pagination, Select, Stack, Switch, Tab, Tabs, TextField, Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import { automationCategories } from '../data/automationCategories.js';

const basePath = '/__local-content/automation';
const emptySource = {
  name: '', type: 'rss', feedUrl: '', categories: ['World News'], attribution: '', permitted: false, enabled: true, trustedForAutoPublish: false,
};
const highImpactCategories = new Set(['Politics and Government', 'Personal Finance', 'Cryptocurrency and Markets', 'Health and Wellness']);
const dateLabel = (value) => value ? new Date(value).toLocaleString() : 'Not run yet';

async function api(path, options = {}) {
  const response = await fetch(`${basePath}${path}`, {
    ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`);
  return result;
}

function categorySelect(label, value, onChange, id) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        multiple
        value={value}
        label={label}
        onChange={(event) => onChange(typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value)}
        renderValue={(selected) => `${selected.length} selected`}
      >
        {automationCategories.map(({ title }) => (
          <MenuItem key={title} value={title}>
            <Checkbox checked={value.includes(title)} />
            {title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function ContentAutomation({ onReviewDraft }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [tab, setTab] = useState('overview');
  const [runCategories, setRunCategories] = useState([]);
  const [sourceDialog, setSourceDialog] = useState(false);
  const [sourceForm, setSourceForm] = useState(emptySource);
  const [confirmAction, setConfirmAction] = useState(null);
  const [highImpactReviewed, setHighImpactReviewed] = useState(false);
  const [editSettings, setEditSettings] = useState(null);
  const [draftPage, setDraftPage] = useState(1);
  const draftPageSize = 10;

  const loadDashboard = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);
    try {
      const result = await api('');
      setDashboard(result);
      setEditSettings(result.settings);
      setRunCategories(result.settings.enabledCategories);
      setError('');
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  useEffect(() => {
    if (!dashboard?.activeJob) return undefined;
    const timer = window.setInterval(() => loadDashboard(true), 2500);
    return () => window.clearInterval(timer);
  }, [dashboard?.activeJob?.id, loadDashboard]);
  useEffect(() => {
    if (!dashboard) return;
    setDraftPage((page) => Math.min(page, Math.max(1, Math.ceil(dashboard.drafts.length / draftPageSize))));
  }, [dashboard?.drafts.length]);

  const runUpdate = async () => {
    setBusy('run'); setError(''); setNotice('');
    try {
      const result = await api('/jobs', { method: 'POST', body: JSON.stringify({ categories: runCategories }) });
      setNotice(`Update started. Job ${result.job.id.slice(0, 8)} is checking enabled sources.`);
      await loadDashboard(true);
    } catch (actionError) { setError(actionError.message); }
    finally { setBusy(''); }
  };

  const performConfirmAction = async () => {
    if (!confirmAction) return;
    const current = confirmAction;
    setBusy(current.key); setError(''); setNotice('');
    try {
      const result = await api(`/drafts/${encodeURIComponent(current.slug)}/${current.action}`, {
        method: 'POST', body: JSON.stringify({ highImpactReviewed }),
      });
      setNotice(current.action === 'publish'
        ? result.alreadyPublished ? 'This draft was already published.' : 'Approved and published locally. Build and deploy to update the public site.'
        : 'Unpublished automation draft rejected and removed.');
      await loadDashboard(true);
    } catch (actionError) { setError(actionError.message); }
    finally { setBusy(''); setConfirmAction(null); }
  };

  const retryJob = async (jobId) => {
    setBusy(jobId); setError(''); setNotice('');
    try {
      await api(`/jobs/${jobId}/retry`, { method: 'POST', body: '{}' });
      setNotice('A retry job was queued.');
      await loadDashboard(true);
    } catch (actionError) { setError(actionError.message); }
    finally { setBusy(''); }
  };

  const retryStory = async (story) => {
    setBusy(story.id); setError(''); setNotice('');
    try {
      await api(`/stories/${encodeURIComponent(story.id)}/retry`, { method: 'POST', body: '{}' });
      setNotice(story.status === 'duplicate' ? 'Draft generation started.' : 'A generation retry was started.');
      await loadDashboard(true);
    } catch (actionError) { setError(actionError.message); }
    finally { setBusy(''); }
  };

  const saveSettings = async () => {
    if (!editSettings) return;
    setBusy('settings'); setError(''); setNotice('');
    try {
      const settings = {
        ...editSettings,
        maxStoriesPerRun: Number(editSettings.maxStoriesPerRun),
        maxAiGenerationsPerRun: Number(editSettings.maxAiGenerationsPerRun),
        maxAiGenerationsPerDay: Number(editSettings.maxAiGenerationsPerDay),
        maxGenerationRetries: Number(editSettings.maxGenerationRetries),
        requestTimeoutMs: Number(editSettings.requestTimeoutMs),
        freshnessHours: Number(editSettings.freshnessHours),
        duplicateThreshold: Number(editSettings.duplicateThreshold),
      };
      await api('/settings', { method: 'PUT', body: JSON.stringify(settings) });
      setNotice('Automation settings saved.');
      await loadDashboard(true);
    } catch (actionError) { setError(actionError.message); }
    finally { setBusy(''); }
  };

  const saveSource = async (event) => {
    event.preventDefault(); setBusy('source'); setError(''); setNotice('');
    try {
      await api('/sources', { method: 'POST', body: JSON.stringify(sourceForm) });
      const wasUpdate = Boolean(sourceForm.id);
      setSourceDialog(false); setSourceForm(emptySource);
      setNotice(wasUpdate ? 'Source updated.' : 'Source saved. The source will be checked on the next update.');
      await loadDashboard(true);
    } catch (actionError) { setError(actionError.message); }
    finally { setBusy(''); }
  };

  const updateSource = async (source, patch) => {
    setBusy(source.id); setError('');
    try {
      await api('/sources', { method: 'POST', body: JSON.stringify({ ...source, ...patch, permitted: true }) });
      await loadDashboard(true);
    } catch (actionError) { setError(actionError.message); }
    finally { setBusy(''); }
  };

  const deleteSource = async (source) => {
    setBusy(source.id); setError('');
    try {
      await api(`/sources/${source.id}`, { method: 'DELETE' });
      setNotice(`${source.name} removed from enabled sources.`);
      await loadDashboard(true);
    } catch (actionError) { setError(actionError.message); }
    finally { setBusy(''); }
  };

  const enabledCount = useMemo(() => dashboard?.sources.filter((source) => source.enabled).length || 0, [dashboard]);
  const visibleDrafts = dashboard?.drafts.slice((draftPage - 1) * draftPageSize, draftPage * draftPageSize) || [];

  if (loading) return <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress /><Typography sx={{ mt: 2 }}>Loading automation settings…</Typography></Box>;

  if (!dashboard) return <Alert severity="error">{error || 'Automation status is unavailable.'}</Alert>;

  const activeJob = dashboard.activeJob;
  const activeProgress = activeJob?.progress?.total
    ? Math.min(100, Math.round(100 * activeJob.progress.current / activeJob.progress.total)) : 0;
  const settingsField = (field, value) => setEditSettings((current) => ({ ...current, [field]: value }));

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
      {notice && <Alert severity="success" onClose={() => setNotice('')}>{notice}</Alert>}

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h4" fontWeight={800}>Content Automation</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Discover permitted sources, prepare attributed drafts, and review every article before it enters the local build.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="stretch">
              <Button startIcon={<RefreshIcon />} onClick={() => loadDashboard(true)} disabled={refreshing}>
                {refreshing ? 'Refreshing…' : 'Refresh'}
              </Button>
              <Button variant="contained" onClick={runUpdate} disabled={Boolean(activeJob) || busy === 'run' || enabledCount === 0 || runCategories.length === 0}>
                {activeJob ? 'Update in progress…' : busy === 'run' ? 'Starting…' : 'Update Content Now'}
              </Button>
            </Stack>
          </Stack>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>{categorySelect('Categories for this update', runCategories, setRunCategories, 'run-categories')}</Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={`${enabledCount} enabled source${enabledCount === 1 ? '' : 's'}`} />
                <Chip color={dashboard.providerStatus.gemini.configured ? 'success' : 'warning'} label={dashboard.providerStatus.gemini.configured ? 'Gemini configured' : 'Gemini key missing'} />
              </Stack>
            </Grid>
          </Grid>
          {activeJob && (
            <Box sx={{ mt: 3 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography fontWeight={700}>{activeJob.progress?.message || 'Processing…'}</Typography>
                <Typography variant="body2" color="text.secondary">{activeProgress}%</Typography>
              </Stack>
              <LinearProgress variant={activeJob.progress?.total ? 'determinate' : 'indeterminate'} value={activeProgress} />
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Last successful update: {dateLabel(dashboard.lastSuccessfulUpdate)}
            {dashboard.nextScheduledRun ? ` · Next check: ${dashboard.nextScheduledRun}` : ' · Daily schedule is off'}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {[
          ['Stories discovered', dashboard.counts.storiesDiscovered],
          ['Duplicates skipped', dashboard.counts.duplicatesSkipped],
          ['Drafts awaiting review', dashboard.counts.draftsAwaitingReview],
          ['Published locally', dashboard.counts.articlesPublished],
          ['Processing errors', dashboard.counts.errors],
        ].map(([label, count]) => (
          <Grid item xs={6} md={2.4} key={label}>
            <Card variant="outlined" sx={{ height: '100%', minWidth: 0 }}><CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography color="text.secondary" variant="body2">{label}</Typography>
              <Typography variant="h4" fontWeight={800}>{count}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Tabs value={tab} onChange={(_event, value) => setTab(value)} variant="scrollable" scrollButtons="auto" aria-label="Content automation sections">
        <Tab value="overview" label="Overview & jobs" />
        <Tab value="drafts" label={`Drafts (${dashboard.drafts.length})`} />
        <Tab value="stories" label="Discovered stories" />
        <Tab value="sources" label="Sources" />
        <Tab value="settings" label="Categories & schedule" />
      </Tabs>

      {tab === 'overview' && (
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={800}>Provider setup</Typography>
          <Alert severity={dashboard.providerStatus.gemini.configured ? 'success' : 'warning'}>
            Gemini article generation: {dashboard.providerStatus.gemini.configured ? `configured (${dashboard.providerStatus.gemini.model})` : 'not configured'}. Add GEMINI_API_KEY to the ignored backend .env file. The key is never sent to this page.
          </Alert>
          <Grid container spacing={2}>
            {[
              ['GNews', dashboard.providerStatus.gnews.configured, 'GNEWS_API_KEY'],
              ['NewsAPI', dashboard.providerStatus.newsapi.configured, 'NEWSAPI_API_KEY'],
            ].map(([name, configured, variable]) => (
              <Grid item xs={12} md={6} key={name}>
                <Card variant="outlined"><CardContent>
                  <Typography variant="h6" fontWeight={700}>{name}</Typography>
                  <Typography color="text.secondary">{configured ? 'Provider key is configured on the backend.' : `Optional. Add ${variable} to .env to enable this provider.`}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>{name === 'GNews' ? 'Its Free plan is non-commercial; published commercial use needs an active paid plan.' : 'Its Developer plan is restricted to development and testing; production use needs a paid plan.'}</Typography>
                  <Typography component="a" href={name === 'GNews' ? 'https://gnews.io/pricing' : 'https://newsapi.org/pricing'} target="_blank" rel="noopener noreferrer">Check current plans and terms</Typography>
                </CardContent></Card>
              </Grid>
            ))}
          </Grid>
          <Typography variant="h5" fontWeight={800} sx={{ mt: 2 }}>Recent processing jobs</Typography>
          {dashboard.jobs.length === 0 ? <Alert severity="info">No update jobs yet. Configure an enabled source, then select Update Content Now.</Alert> : dashboard.jobs.slice(0, 20).map((job) => (
            <Card variant="outlined" key={job.id}><CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} sx={{ minWidth: 0 }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography fontWeight={700}>{job.trigger.replaceAll('-', ' ')} · {dateLabel(job.createdAt)}</Typography>
                    <Chip size="small" color={job.status === 'completed' ? 'success' : job.status === 'failed' || job.status === 'completed_with_errors' ? 'warning' : 'info'} label={job.status} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {job.counts?.discovered || 0} discovered · {job.counts?.duplicatesSkipped || 0} duplicates · {job.counts?.draftsGenerated || 0} drafts · {job.counts?.errors || 0} errors
                    {(job.counts?.inputTokens || job.counts?.outputTokens) ? ` · ${job.counts.inputTokens} input / ${job.counts.outputTokens} output tokens` : ''}
                  </Typography>
                  {job.errors?.slice(0, 2).map((item, index) => <Typography key={`${job.id}-error-${index}`} variant="body2" color="error.main" sx={{ overflowWrap: 'anywhere' }}>{item.message}</Typography>)}
                </Box>
                {['failed', 'completed_with_errors'].includes(job.status) && <Button onClick={() => retryJob(job.id)} disabled={busy === job.id} sx={{ alignSelf: { xs: 'stretch', sm: 'center' }, flexShrink: 0 }}>{busy === job.id ? 'Retrying…' : 'Retry job'}</Button>}
              </Stack>
            </CardContent></Card>
          ))}
          <Alert severity="info">Token counts appear when Gemini returns usage data. The dashboard does not estimate API cost. All articles require review and a local production build before deployment.</Alert>
        </Stack>
      )}

      {tab === 'drafts' && (
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={800}>Preview and Review Drafts</Typography>
          {dashboard.drafts.length === 0 ? <Alert severity="info">No generated drafts are waiting for review.</Alert> : visibleDrafts.map((draft) => (
            <Accordion key={draft.slug} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight={800}>{draft.title}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip size="small" label={draft.automation?.automationCategory || draft.category} />
                    {draft.automation?.highImpactReviewRequired && <Chip size="small" color="warning" label="Extra fact-check required" />}
                    <Typography variant="caption" color="text.secondary">Updated {dateLabel(draft.updatedAt)}</Typography>
                  </Stack>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Typography color="text.secondary">{draft.excerpt}</Typography>
                  <Box sx={{ p: 2, maxHeight: 420, overflow: 'auto', borderRadius: 2, bgcolor: 'action.hover', whiteSpace: 'pre-wrap' }}>
                    <Typography component="div" sx={{ lineHeight: 1.8 }}>{draft.content}</Typography>
                  </Box>
                  <Stack spacing={0.5}>
                    <Typography fontWeight={700}>Original sources</Typography>
                    {(draft.sourceReferences || []).map((source) => (
                      <Typography key={source.url} component="a" href={source.url} target="_blank" rel="noopener noreferrer" sx={{ overflowWrap: 'anywhere' }}>
                        {source.publisher || 'Open source'} · {source.url}
                      </Typography>
                    ))}
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button variant="outlined" onClick={() => onReviewDraft(draft)}>Edit draft</Button>
                    <Button variant="contained" onClick={() => { setHighImpactReviewed(false); setConfirmAction({ slug: draft.slug, action: 'publish', key: `publish-${draft.slug}`, highImpact: draft.automation?.highImpactReviewRequired }); }}>Approve and publish locally</Button>
                    <Button color="error" onClick={() => setConfirmAction({ slug: draft.slug, action: 'reject', key: `reject-${draft.slug}` })}>Reject draft</Button>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
          {dashboard.drafts.length > draftPageSize && <Stack alignItems="center"><Pagination count={Math.ceil(dashboard.drafts.length / draftPageSize)} page={draftPage} onChange={(_event, page) => setDraftPage(page)} color="primary" /></Stack>}
        </Stack>
      )}

      {tab === 'stories' && (
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={800}>Discovered stories</Typography>
          <Alert severity="info">Duplicates are skipped during automatic updates. Use Generate draft on an individual duplicate to create a review draft.</Alert>
          {dashboard.stories.length === 0 ? <Alert severity="info">No stories have been discovered yet.</Alert> : dashboard.stories.map((story, index) => (
            <Accordion key={`${story.id}-${index}`} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" sx={{ width: '100%', pr: 1 }} spacing={1}>
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Typography fontWeight={700} sx={{ overflowWrap: 'anywhere' }}>{story.title}</Typography>
                      {story.imageUrl && (
                        <Stack component="span" role="img" aria-label="Image available" title="A source image URL was found for this story" direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
                          <Box component="span" aria-hidden="true" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                          <Typography component="span" variant="caption" color="success.main" fontWeight={700}>Image available</Typography>
                        </Stack>
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">{story.publisher} · {story.category} · {dateLabel(story.publishedAt)}</Typography>
                  </Box>
                  <Chip size="small" label={story.status} color={story.status === 'failed' ? 'error' : story.status === 'needs-review' ? 'success' : 'default'} />
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <Typography>{story.description || 'No source description was supplied.'}</Typography>
                  <Typography variant="body2" color="text.secondary">{story.skipReason || story.reason || ''}</Typography>
                  <Typography component="a" href={story.url} target="_blank" rel="noopener noreferrer" sx={{ overflowWrap: 'anywhere' }}>{story.url}</Typography>
                  {story.status === 'duplicate' && story.draftSlug && <Typography variant="body2" color="text.secondary">Existing draft: {story.draftSlug}</Typography>}
                  {story.status === 'duplicate' && !story.draftSlug && <Button sx={{ alignSelf: 'flex-start' }} onClick={() => retryStory(story)} disabled={busy === story.id}>{busy === story.id ? 'Generating…' : 'Generate draft'}</Button>}
                  {['failed', 'awaiting-ai'].includes(story.status) && <Button sx={{ alignSelf: 'flex-start' }} onClick={() => retryStory(story)} disabled={busy === story.id}>{busy === story.id ? 'Retrying…' : 'Retry generation'}</Button>}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}

      {tab === 'sources' && (
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
            <Box><Typography variant="h5" fontWeight={800}>Sources</Typography><Typography color="text.secondary">Use feeds and providers whose terms permit your intended use. Only article metadata and short descriptions are sent to AI.</Typography></Box>
            <Button variant="contained" onClick={() => { setSourceForm(emptySource); setSourceDialog(true); }}>Add source</Button>
          </Stack>
          {!dashboard.sources.length ? <Alert severity="info">No sources configured. Add a permitted RSS/Atom feed, GNews, or NewsAPI source.</Alert> : dashboard.sources.map((source) => (
            <Card key={source.id} variant="outlined"><CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center"><Typography variant="h6" fontWeight={700}>{source.name}</Typography><Chip size="small" label={source.type.toUpperCase()} /></Stack>
                  {source.feedUrl && <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{source.feedUrl}</Typography>}
                  <Typography variant="body2" color="text.secondary">{source.categories.join(', ')}</Typography>
                  <Typography variant="caption" color="text.secondary">Attribution: {source.attribution}</Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Stack>
                    <FormControlLabel control={<Switch checked={source.enabled} onChange={(event) => updateSource(source, { enabled: event.target.checked })} />} label={source.enabled ? 'Enabled' : 'Disabled'} />
                    <FormControlLabel control={<Switch checked={source.trustedForAutoPublish} onChange={(event) => updateSource(source, { trustedForAutoPublish: event.target.checked })} />} label="Trusted for auto-publish" />
                  </Stack>
                    <Button onClick={() => { setSourceForm({ ...source, permitted: true }); setSourceDialog(true); }}>Edit</Button>
                  <Button color="error" onClick={() => deleteSource(source)} disabled={busy === source.id}>Remove</Button>
                </Stack>
              </Stack>
            </CardContent></Card>
          ))}
        </Stack>
      )}

      {tab === 'settings' && editSettings && (
        <Stack spacing={3}>
          <Box><Typography variant="h5" fontWeight={800}>Categories and schedule</Typography><Typography color="text.secondary">Disabled categories are not queried. Updates remain drafts for human review.</Typography></Box>
          <Card variant="outlined"><CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Enable categories</Typography>
            <Grid container>
              {automationCategories.map(({ title }) => (
                <Grid item xs={12} sm={6} md={4} key={title}>
                  <FormControlLabel control={<Checkbox checked={editSettings.enabledCategories.includes(title)} onChange={(event) => setEditSettings((current) => {
                    const enabledCategories = event.target.checked ? [...current.enabledCategories, title] : current.enabledCategories.filter((item) => item !== title);
                    return { ...current, enabledCategories, autoPublishCategories: current.autoPublishCategories.filter((item) => enabledCategories.includes(item)) };
                  })} />} label={title} />
                </Grid>
              ))}
            </Grid>
          </CardContent></Card>
          <Card variant="outlined"><CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Daily update schedule</Typography>
            <Stack spacing={2}>
              <FormControlLabel control={<Switch checked={editSettings.dailySchedule.enabled} onChange={(event) => setEditSettings((current) => ({ ...current, dailySchedule: { ...current.dailySchedule, enabled: event.target.checked } }))} />} label="Enable daily updates" />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}><TextField fullWidth type="time" label="Update time" value={editSettings.dailySchedule.time} onChange={(event) => setEditSettings((current) => ({ ...current, dailySchedule: { ...current.dailySchedule, time: event.target.value } }))} InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={8}><TextField fullWidth label="Timezone" value={editSettings.dailySchedule.timezone} onChange={(event) => setEditSettings((current) => ({ ...current, dailySchedule: { ...current.dailySchedule, timezone: event.target.value } }))} helperText="For example: Africa/Lagos. Configure the OS scheduler to run scripts/run-scheduled-content-update.mjs every 15 minutes." /></Grid>
              </Grid>
              <Alert severity="warning">The Vercel site is static. Daily execution needs this backend and repository checkout on an always-on machine, or a scheduler that can access a separately hosted persistent backend. A sleeping computer can delay the update.</Alert>
            </Stack>
          </CardContent></Card>
          <Card variant="outlined"><CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Cost and resource limits</Typography>
            <Grid container spacing={2}>
              {[
                ['maxStoriesPerRun', 'Maximum stories per run'], ['maxAiGenerationsPerRun', 'AI generations per run'],
                ['maxAiGenerationsPerDay', 'AI generations per day'], ['maxGenerationRetries', 'Generation retries'],
                ['requestTimeoutMs', 'Request timeout (ms)'], ['freshnessHours', 'Maximum story age (hours)'],
              ].map(([field, label]) => <Grid item xs={12} sm={6} md={4} key={field}><TextField fullWidth type="number" label={label} value={editSettings[field]} onChange={(event) => settingsField(field, event.target.value)} /></Grid>)}
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" inputProps={{ min: 0.55, max: 1, step: 0.01 }} label="Headline duplicate threshold" value={editSettings.duplicateThreshold} onChange={(event) => settingsField('duplicateThreshold', event.target.value)} /></Grid>
              <Grid item xs={12}><FormControlLabel control={<Switch checked={editSettings.aiEnabled} onChange={(event) => settingsField('aiEnabled', event.target.checked)} />} label="Allow AI draft generation" /></Grid>
              <Grid item xs={12}>
                <FormControlLabel control={<Switch checked={editSettings.autoPublish} onChange={(event) => settingsField('autoPublish', event.target.checked)} />} label="Allow automatic local publication" />
                <Alert severity="warning" sx={{ my: 1 }}>
                  Off by default. If enabled, only selected non-sensitive categories from sources marked trusted above can be written as published JSON files. This project still requires the normal local build and Vercel deployment to make them public.
                </Alert>
              </Grid>
              {editSettings.autoPublish && automationCategories.filter(({ title }) => !highImpactCategories.has(title) && editSettings.enabledCategories.includes(title)).map(({ title }) => (
                <Grid item xs={12} sm={6} md={4} key={`auto-${title}`}>
                  <FormControlLabel control={<Checkbox checked={editSettings.autoPublishCategories.includes(title)} onChange={(event) => setEditSettings((current) => ({
                    ...current,
                    autoPublishCategories: event.target.checked ? [...current.autoPublishCategories, title] : current.autoPublishCategories.filter((item) => item !== title),
                  }))} />} label={`Auto-publish: ${title}`} />
                </Grid>
              ))}
            </Grid>
            <Button variant="contained" sx={{ mt: 2 }} onClick={saveSettings} disabled={busy === 'settings'}>{busy === 'settings' ? 'Saving…' : 'Save settings'}</Button>
          </CardContent></Card>
        </Stack>
      )}

      <Dialog open={sourceDialog} onClose={() => !busy && setSourceDialog(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={saveSource}>
          <DialogTitle>{sourceForm.id ? 'Edit source' : 'Add a permitted source'}</DialogTitle>
          <DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
            <TextField autoFocus required label="Publisher or provider name" value={sourceForm.name} onChange={(event) => setSourceForm((current) => ({ ...current, name: event.target.value }))} />
            <FormControl fullWidth><InputLabel id="source-type-label">Provider</InputLabel><Select labelId="source-type-label" label="Provider" value={sourceForm.type} onChange={(event) => setSourceForm((current) => ({ ...current, type: event.target.value, name: event.target.value === 'gnews' ? 'GNews' : event.target.value === 'newsapi' ? 'NewsAPI' : current.name }))}><MenuItem value="rss">RSS / Atom feed</MenuItem><MenuItem value="gnews">GNews API</MenuItem><MenuItem value="newsapi">NewsAPI.org</MenuItem></Select></FormControl>
            {sourceForm.type === 'rss' && <TextField required label="HTTPS feed URL" value={sourceForm.feedUrl} onChange={(event) => setSourceForm((current) => ({ ...current, feedUrl: event.target.value }))} helperText="Public HTTPS feeds only. Private, local, metadata, and unsafe redirect destinations are blocked." />}
            {categorySelect('Categories', sourceForm.categories, (categories) => setSourceForm((current) => ({ ...current, categories })), 'source-categories')}
            <TextField required multiline minRows={2} label="Required attribution details" value={sourceForm.attribution} onChange={(event) => setSourceForm((current) => ({ ...current, attribution: event.target.value }))} helperText="Enter publisher/provider name or the exact credit required by its terms." />
            <FormControlLabel control={<Checkbox checked={sourceForm.permitted} onChange={(event) => setSourceForm((current) => ({ ...current, permitted: event.target.checked }))} />} label="I checked the source terms and permit this discovery and attributed-summary use." />
            <FormControlLabel control={<Checkbox checked={sourceForm.trustedForAutoPublish} onChange={(event) => setSourceForm((current) => ({ ...current, trustedForAutoPublish: event.target.checked }))} />} label="Mark this provider as trusted for automatic local publication (optional)." />
          </Stack></DialogContent>
          <DialogActions><Button onClick={() => setSourceDialog(false)}>Cancel</Button><Button type="submit" variant="contained" disabled={busy === 'source' || !sourceForm.permitted}>{busy === 'source' ? 'Checking…' : sourceForm.id ? 'Save source' : 'Add source'}</Button></DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(confirmAction)} onClose={() => !busy && setConfirmAction(null)}>
        <DialogTitle>{confirmAction?.action === 'publish' ? 'Approve and publish this draft?' : 'Reject this draft?'}</DialogTitle>
          <DialogContent><DialogContentText>
          {confirmAction?.action === 'publish'
            ? 'This marks the draft as reviewed and writes a published article file into this checkout. It will appear publicly only after the next build is deployed.'
            : 'This removes the unpublished automation draft file. Published content is not affected.'}
        </DialogContentText>
          {confirmAction?.highImpact && <Alert severity="warning" sx={{ mt: 2 }}>Politics, finance, cryptocurrency, and health content needs an additional human fact-check against its source.</Alert>}
          {confirmAction?.highImpact && <FormControlLabel sx={{ mt: 1 }} control={<Checkbox checked={highImpactReviewed} onChange={(event) => setHighImpactReviewed(event.target.checked)} />} label="I checked the factual claims against the original source." />}
        </DialogContent>
        <DialogActions><Button onClick={() => setConfirmAction(null)} disabled={Boolean(busy)}>Cancel</Button><Button color={confirmAction?.action === 'reject' ? 'error' : 'primary'} variant="contained" onClick={performConfirmAction} disabled={Boolean(busy) || Boolean(confirmAction?.highImpact && !highImpactReviewed)}>{confirmAction?.action === 'publish' ? 'Approve and publish' : 'Reject draft'}</Button></DialogActions>
      </Dialog>
    </Stack>
  );
}
