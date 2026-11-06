/**
 * JSON for a <script> block (JSON-LD, the contact rules). set:html writes it raw, so '<' and '>' are
 * escaped (a '</script>' in an editable title can never end the block early) and so are U+2028
 * and U+2029, which some parsers treat as line ends (security audit round 3, S1). The result
 * parses to the same value.
 */
export const safeJson = (v: unknown): string =>
  JSON.stringify(v).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
