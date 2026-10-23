import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { openStateStore } from './remote-state.mjs';

const action = process.env.CI_ACTION || 'run-job';
const jobId = process.env.CI_JOB_ID || '';
const storyId = process.env.CI_STORY_ID || '';
const category = process.env.CI_CATEGORY || '';

// Automation state lives in MongoDB; articles are the checked-out repository files.
const stateDirectory = join(process.env.RUNNER_TEMP || tmpdir(), 'lokkee-automation');
process.env.CONTENT_AUTOMATION_DATA_DIR = stateDirectory;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const automation = await import('./content-automation.mjs');
const store = await openStateStore();
await store.load(stateDirectory);

// Persist progress regularly so the phone dashboard shows live status and a cancelled run loses little.
const ticker = setInterval(() => store.save(stateDirectory).catch((error) => console.error('State save failed:', error.message)), 15000);

let exitCode = 0;
try {
  if (action === 'run-job') {
    if (!jobId) {
      const started = await automation.startContentJob({ trigger: 'github-actions', categoryFilter: category ? [category] : undefined });
      await automation.runContentJob(started.id);
    } else {
      // The job record is saved just after the dispatch, so it may take a moment to appear.
      let job = await automation.getJob(jobId);
      for (let attempt = 0; attempt < 6 && !job; attempt += 1) {
        await sleep(10000);
        await store.load(stateDirectory);
        job = await automation.getJob(jobId);
      }
      if (!job) throw new Error('The queued job was not found.');
      await automation.runContentJob(jobId);
    }
  } else if (action === 'retry-story') {
    try {
      await automation.retryStory(storyId, { existingJobId: jobId });
    } catch (error) {
      if (jobId) await automation.failJob(jobId, error.message).catch(() => {});
      throw error;
    }
  } else if (action === 'scheduled') {
    const result = await automation.runScheduledUpdateIfDue();
    console.log(result.started ? `Started scheduled update ${result.jobId}.` : result.reason);
    if (result.started) {
      const deadline = Date.now() + 30 * 60 * 1000;
      let job;
      while (Date.now() < deadline) {
        job = await automation.getJob(result.jobId);
        if (job && !['queued', 'running'].includes(job.status)) break;
        await sleep(2000);
      }
      if (job?.status === 'failed') exitCode = 1;
    }
  } else {
    throw new Error(`Unknown action: ${action}`);
  }
} catch (error) {
  console.error('Content automation failed:', error.message);
  exitCode = 1;
} finally {
  clearInterval(ticker);
  await store.collection.updateOne({ _id: 'meta' }, {
    $set: { 'value.providerStatus': automation.providerStatus(), updatedAt: new Date() },
  }, { upsert: true }).catch(() => {});
  await store.save(stateDirectory).catch((error) => console.error('Final state save failed:', error.message));
  await store.close();
}
process.exit(exitCode);
