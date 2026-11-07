// A build/test lock for one checkout (copy audit round 3, S9). Parallel runs in the same working
// tree (an audit running `npm ci` or `npm run build` while another runs `npm test`) used to fail
// unrelated checks. `npm run build` and `npm test` take site/.build.lock; a second run waits for
// the first and says so, instead of failing. A lock left by a process that has died is taken over.
// A child of the holder (LL_LOCK_HELD=1 in its environment) runs without taking it again.
//   node scripts/lock.mjs <command> [args...]   run a command under the lock
import { openSync, writeSync, closeSync, readFileSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
export const LOCK = join(site, '.build.lock');
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

/** Take the lock (waiting up to `waitMs`); returns a release function. No-op for a child of the holder. */
export function acquire(what, waitMs = 15 * 60 * 1000) {
  if (process.env.LL_LOCK_HELD === '1') return () => {};
  const t0 = Date.now();
  let told = false;
  for (;;) {
    try {
      const fd = openSync(LOCK, 'wx');
      writeSync(fd, JSON.stringify({ pid: process.pid, what, started: new Date().toISOString() }));
      closeSync(fd);
      process.env.LL_LOCK_HELD = '1';
      let released = false;
      const release = () => { if (released) return; released = true; try { if (JSON.parse(readFileSync(LOCK, 'utf8')).pid === process.pid) unlinkSync(LOCK); } catch {} delete process.env.LL_LOCK_HELD; };
      process.on('exit', release);
      for (const sig of ['SIGINT', 'SIGTERM']) process.once(sig, () => { release(); process.exit(130); });
      return release;
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      let holder = null;
      try { holder = JSON.parse(readFileSync(LOCK, 'utf8')); } catch {}
      if (!holder || !alive(holder.pid)) { try { unlinkSync(LOCK); } catch {} continue; }
      if (!told) { console.log(`another build or test run is in progress in this checkout (pid ${holder.pid}: ${holder.what}, since ${holder.started}); waiting for it to finish`); told = true; }
      if (Date.now() - t0 > waitMs) { console.error(`lock: still held by pid ${holder.pid} after ${Math.round(waitMs / 60000)} min; remove ${LOCK} if that process is gone`); process.exit(1); }
      sleep(2000);
    }
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [cmd, ...args] = process.argv.slice(2);
  if (!cmd) { console.error('usage: node scripts/lock.mjs <command> [args...]'); process.exit(2); }
  const release = acquire([cmd, ...args].join(' '));
  const r = spawnSync(cmd, args, { cwd: site, stdio: 'inherit', env: process.env });
  release();
  process.exit(r.status ?? 1);
}
