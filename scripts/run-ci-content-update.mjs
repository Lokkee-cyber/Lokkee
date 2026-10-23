import { getJob, startContentJob } from './content-automation.mjs';

const categoryFilter = process.env.CONTENT_CATEGORY ? [process.env.CONTENT_CATEGORY] : undefined;
const job = await startContentJob({ trigger: 'github-actions', categoryFilter });
console.log(`Started content update ${job.id}.`);

const timeoutAt = Date.now() + 30 * 60 * 1000;
let current;
while (Date.now() < timeoutAt) {
  current = await getJob(job.id);
  if (current && !['queued', 'running'].includes(current.status)) break;
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

if (!current || ['queued', 'running'].includes(current.status)) {
  console.error('Content update did not finish within 30 minutes.');
  process.exit(1);
}
console.log(`Finished with status ${current.status}.`, JSON.stringify(current.counts));
for (const error of current.errors || []) console.warn(`Warning: ${error.message}`);
process.exit(current.status === 'failed' ? 1 : 0);
