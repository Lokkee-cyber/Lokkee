import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getJob, runScheduledUpdateIfDue } from './content-automation.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: resolve(projectRoot, '.env') });

const result = await runScheduledUpdateIfDue();
if (!result.started) {
  console.log(result.reason);
  process.exit(0);
}

console.log(`Started scheduled content update ${result.jobId}.`);
const timeoutAt = Date.now() + 30 * 60 * 1000;
let job;
while (Date.now() < timeoutAt) {
  job = await getJob(result.jobId);
  if (job && !['queued', 'running'].includes(job.status)) break;
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

if (!job || ['queued', 'running'].includes(job.status)) {
  console.error('Scheduled update did not finish within 30 minutes. Its job remains persisted for review.');
  process.exitCode = 1;
} else {
  console.log(`Scheduled update finished with status ${job.status}.`);
  if (job.status === 'failed') process.exitCode = 1;
}
