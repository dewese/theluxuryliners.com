// Dates on the site: month and year for releases (the day-level dates of the older records are
// distributor placeholders, so the site never prints them); any precision for shows.
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "May 2000" from "2000-05-01"; "1998" from "1998". */
export function monthYear(iso: string): string {
  const [y, m] = iso.split('-');
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
}

/** A sortable key for an ISO date of any precision: missing parts sort first within their period. */
export function sortKey(iso: string): string {
  const [y, m = '00', d = '00'] = iso.split('-');
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

/** "3:13" -> "PT3M13S" (schema.org Duration). */
export function isoDuration(mmss: string | null | undefined): string | undefined {
  if (!mmss) return undefined;
  const [m, s] = mmss.split(':').map(Number);
  return `PT${m}M${s}S`;
}
