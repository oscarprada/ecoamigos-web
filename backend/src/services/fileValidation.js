import { Worker } from 'node:worker_threads';
export function detectFile(filename) {
  return new Promise(resolve => {
    const worker = new Worker(new URL('./fileValidationWorker.js', import.meta.url), { workerData: filename, resourceLimits: { maxOldGenerationSizeMb: 64 } });
    const finish = value => { clearTimeout(timer); worker.terminate(); resolve(value); };
    const timer = setTimeout(() => finish(null), 10000);
    worker.once('message', finish);worker.once('error', () => finish(null));worker.once('exit', () => { clearTimeout(timer);resolve(null); });
  });
}
