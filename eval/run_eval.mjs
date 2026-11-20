// node eval/run_eval.mjs
// Scores the normaliser on spoken-style inputs. The number that matters most is "wrong value accepted":
// a rejection only costs a repeat, a wrong accepted value goes into the form.
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const B = require('../speech.js'), U = require('./utterances.js');
const by = {}, misses = [];
for (const u of U) {
  const f = B.FIELDS.find(x => x.type === u.type), r = B.parse(f, u.text), got = r.ok ? r.value : null;
  for (const key of ['type:' + u.type, 'lang:' + u.lang, 'ALL']) { const b = (by[key] = by[key] || { n: 0, right: 0, wrongAccepted: 0, wronglyRejected: 0 }); b.n++;
    if (got === u.expected) b.right++; else if (got !== null) b.wrongAccepted++; else b.wronglyRejected++; }
  if (got !== u.expected) misses.push(`  [${u.type}/${u.lang}] "${u.text}" -> ${got === null ? 'rejected (' + r.why + ')' : got}   expected ${u.expected}`);
}
console.log('group             n   right   wrong value accepted   wrongly rejected');
for (const [k, b] of Object.entries(by)) console.log(`${k.padEnd(16)} ${String(b.n).padStart(2)}   ${(b.right / b.n * 100).toFixed(0).padStart(4)}%   ${String(b.wrongAccepted).padStart(8)}               ${String(b.wronglyRejected).padStart(6)}`);
console.log('\nMisses:'); console.log(misses.join('\n') || '  none');
