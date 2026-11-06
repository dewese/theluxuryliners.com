// The contact form's rules, shared by the page and the Worker (worker/api/contact.ts), ported from
// daviddewese.com. Pure: no DOM, no Astro, no Workers APIs. The address messages go to exists
// only as the Worker secret CONTACT_TO (LL-31); it is never in this repository or a page.

export const TOPICS = [
  { value: 'booking', label: 'Booking' },
  { value: 'press', label: 'Press' },
  { value: 'licensing', label: 'Licensing / sync' },
  { value: 'fan-mail', label: 'Fan mail' },
  { value: 'accessibility', label: 'Accessibility problem' },
  { value: 'other', label: 'Something else' },
] as const;

export const NAME_FORBIDDEN = /["<>`]/;
export const LIMITS = { nameMax: 100, messageMin: 10, messageMax: 5000, maxLinks: 3, minSeconds: 3 } as const;

export interface ContactInput { name: string; email: string; topic: string; message: string; website?: string; elapsed?: string }
export type FieldErrors = Partial<Record<'name' | 'email' | 'topic' | 'message' | 'form', string>>;

export const MESSAGES = {
  name: 'Enter your name.',
  nameLong: `Enter a name of ${LIMITS.nameMax} characters or fewer.`,
  nameChars: 'Enter your name without the characters " < > or `.',
  email: 'Enter an email address like name@example.com.',
  topic: 'Choose a topic.',
  messageShort: `Enter a message of at least ${LIMITS.messageMin} characters.`,
  messageLong: `Enter a message of ${LIMITS.messageMax.toLocaleString('en-US')} characters or fewer.`,
  messageLinks: `Include no more than ${LIMITS.maxLinks} links in your message.`,
  tooFast: 'That was very quick. Please wait a moment and send it again.',
  busy: 'Too many messages have been sent from here recently. Please wait a little while and try again.',
  turnstile: 'The spam check couldn’t confirm you’re human. Please go back and try again.',
  noToken: 'This message couldn’t be checked for spam. Please turn on JavaScript and send it again.',
  unavailable: 'The contact form isn’t working just now. Please try again later.',
} as const;

export const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/** Strip characters that could inject e-mail headers or control codes. */
export function clean(s: unknown, max = 10000): string {
  return String(s ?? '').replace(/[\r\n\u0000-\u001f\u007f\u0085\u2028\u2029]+/g, ' ').trim().slice(0, max);
}
export function cleanMessage(s: unknown): string {
  return String(s ?? '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();
}

export function validate(input: ContactInput, opts: { checkTiming?: boolean } = {}): FieldErrors {
  const e: FieldErrors = {};
  const name = clean(input.name, 1000);
  if (!name) e.name = MESSAGES.name;
  else if (name.length > LIMITS.nameMax) e.name = MESSAGES.nameLong;
  else if (NAME_FORBIDDEN.test(name)) e.name = MESSAGES.nameChars;
  if (!EMAIL_RE.test(clean(input.email, 320))) e.email = MESSAGES.email;
  if (!TOPICS.some((t) => t.value === input.topic)) e.topic = MESSAGES.topic;
  const msg = cleanMessage(input.message);
  if (msg.length < LIMITS.messageMin) e.message = MESSAGES.messageShort;
  else if (msg.length > LIMITS.messageMax) e.message = MESSAGES.messageLong;
  else if ((msg.match(/https?:\/\/|www\./gi) ?? []).length > LIMITS.maxLinks) e.message = MESSAGES.messageLinks;
  if (opts.checkTiming && !Object.keys(e).length && input.elapsed !== undefined && Number(input.elapsed) < LIMITS.minSeconds) e.form = MESSAGES.tooFast;
  return e;
}

/** The honeypot: a filled "Leave this empty" field means a bot; the Worker answers as if sent. */
export const isTrapped = (input: ContactInput) => clean(input.website).length > 0;
