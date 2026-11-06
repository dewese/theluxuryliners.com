// Pure helpers: dates, Markdown subset, shows sorting, contact rules.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthYear, sortKey, isoDuration } from '../../src/lib/dates.ts';
import { mdToHtml, mdInline } from '../../src/lib/markdown.ts';
import { sortShows, where } from '../../src/lib/shows.ts';
import { validate, isTrapped, clean, MESSAGES } from '../../src/lib/contact.ts';

test('dates: month and year, sort keys, durations', () => {
  assert.equal(monthYear('2000-05-01'), 'May 2000');
  assert.equal(monthYear('1998'), '1998');
  assert.equal(sortKey('2001'), '2001-00-00');
  assert.equal(sortKey('2001-3'), '2001-03-00');
  assert.equal(isoDuration('3:13'), 'PT3M13S');
  assert.equal(isoDuration(null), undefined);
});

test('markdown: paragraphs, emphasis, links, quotations; HTML escaped', () => {
  assert.equal(mdInline('*Overbored*, *Nonetheless*'), '<em>Overbored</em>, <em>Nonetheless</em>');
  assert.equal(mdToHtml('## Head\n\nA [link](/story/).'), '<h3>Head</h3>\n<p>A <a href="/story/">link</a>.</p>');
  assert.match(mdToHtml('> quoted'), /^<blockquote>/);
  assert.equal(mdInline('<script>'), '&lt;script&gt;');
  assert.equal(mdInline('[x](javascript:alert(1))'), '[x](javascript:alert(1))');
});

test('shows: partial dates sort correctly; a null venue leaves no comma', () => {
  const rows = [
    { date: '2001-08-12', when: 'Aug 12', venue: 'A', city: 'Nashville', status: 'publish' },
    { date: '2001', when: '2001', venue: null, city: 'X', status: 'publish' },
    { date: '2001-08', when: 'Aug', venue: 'B', city: 'Y', status: 'publish' },
    { date: '1998', sort: '1998-10', when: 'Autumn 1998', venue: 'C', city: 'Waco', status: 'publish' },
    { date: '1998-07-04', when: 'July 4', venue: 'D', city: 'Z', status: 'publish' },
    { date: '1999', when: 'never', venue: 'E', city: 'Z', status: 'pending' },
  ];
  assert.deepEqual(sortShows(rows).map((r) => r.when), ['July 4', 'Autumn 1998', '2001', 'Aug', 'Aug 12']);
  assert.equal(where({ venue: null, city: 'Nashville' }), 'Nashville');
  assert.equal(where({ venue: 'The End', city: 'Nashville' }), 'The End, Nashville');
  assert.equal(where({ venue: '', city: null }), '');
});

test('contact rules: fields, honeypot, header-safe cleaning', () => {
  const ok = { name: 'Fan', email: 'fan@example.com', topic: 'fan-mail', message: 'Love the records!' };
  assert.deepEqual(validate(ok), {});
  assert.equal(validate({ ...ok, email: 'nope' }).email, MESSAGES.email);
  assert.equal(validate({ ...ok, topic: 'x' }).topic, MESSAGES.topic);
  assert.equal(validate({ ...ok, name: 'a<b' }).name, MESSAGES.nameChars);
  assert.equal(validate({ ...ok, message: 'hi' }).message, MESSAGES.messageShort);
  assert.equal(validate({ ...ok, message: 'see http://a http://b http://c http://d' }).message, MESSAGES.messageLinks);
  assert.equal(validate({ ...ok, elapsed: '1' }, { checkTiming: true }).form, MESSAGES.tooFast);
  assert.equal(isTrapped({ ...ok, website: 'spam' }), true);
  assert.equal(clean('a\r\nBcc: x y'), 'a Bcc: x y');
});
