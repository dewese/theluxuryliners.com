// private-literals.mjs: the hashed matcher for private literals, shared by
// content/check-content.mjs, site/scripts/check-dist.mjs and the site's dist tests.
// No side effects, no dependencies (Node 18+).
//
// Private literals (the contact address, the family page's file name, the publication that
// profiled a member's later life, the founding-story town, a college name) are matched by the
// SHA-256 of a lower-cased token, never written in this public repository: naming them in a
// rule would show what is being protected. Tokens tried: every word or dotted/at-sign token, its
// parts split on . @ / - _, and adjacent word pairs (joined with and without a space).
// To add one: printf '%s' 'token' | sha256sum, then add the hash here with a generic label.
import { createHash } from 'node:crypto';

export const PRIVATE_HASHES = new Map([
  ['bd69e39fea034e7dab1702391ba0af52d8bb4cfddeefef293bf9ae1577a013ea', 'the contact address (LL-31: Worker config only)'],
  ['81963d441096beff3a2867e7fbffe88e81a21e90fb6684a4c239b68e9d2b937a', 'the private family page'],
  ['7b8bd6c0abf53d22888beafc48830e1156907dd4ec7e6ea31e55a0dd6dc5a969', 'a private family name (old family page and images)'],
  ['f6a761f669dfeafd8086a367b336cbee496a1b13ac5128c8cb9346ca7891ccf3', 'a private family name (old family image)'],
  ['270e826aaea2ede6497f2383a2e0c2fe418a737a8224fc8888e4821158342f5d', 'the profile of a member\'s later life (plan §2 item 3)'],
  ['921329720029ded97c7725d6a6508f110e9488d3bbf614a33babec8f3ea383a6', 'the profile of a member\'s later life (plan §2 item 3)'],
  ['0c6193e11c89c15a1715161c094efa47adfc6585cd66021968336d5b4d4fc321', 'a town from the founding story (LL-4, LL-5)'],
  ['2c96398674dbc4e58b556e6fbf53f85b80be112a3c9113851f431d3a67275208', 'a college name (plan §2 item 3, RD5)'],
]);

export const sha256 = (s) => createHash('sha256').update(s).digest('hex');

/** Labels of every private literal found in the text (empty when clean). */
export function privateHits(text, hashes = PRIVATE_HASHES) {
  const toks = String(text).toLowerCase().match(/[a-z0-9][a-z0-9@._-]*[a-z0-9]|[a-z0-9]/g) || [];
  const cands = new Set();
  toks.forEach((t, k) => {
    cands.add(t);
    for (const part of t.split(/[.@\/_-]+/)) if (part) cands.add(part);
    const nx = toks[k + 1];
    if (nx) { cands.add(`${t} ${nx}`); cands.add(t + nx); }
  });
  const out = [];
  for (const c of cands) { const label = hashes.get(sha256(c)); if (label) out.push(label); }
  return [...new Set(out)];
}

/** The 1-based line numbers of the lines that hold a private literal, with their labels. */
export function privateLines(text, hashes = PRIVATE_HASHES) {
  const out = [];
  String(text).split('\n').forEach((line, i) => { const h = privateHits(line, hashes); if (h.length) out.push({ line: i + 1, labels: h }); });
  return out;
}
