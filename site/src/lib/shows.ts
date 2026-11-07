// Pure helpers for /shows/ (tested in tests/unit/shows.test.mjs).
import { sortKey } from './dates.ts';

export interface Show { date: string; sort?: string; when: string; venue: string | null; city: string; note?: string; status: string }

/** Published shows in date order; an approximate date sorts by its 'sort' key. */
export const sortShows = <T extends Show>(shows: T[]): T[] =>
  shows.filter((s) => s.status === 'publish').sort((a, b) => sortKey(a.sort ?? a.date).localeCompare(sortKey(b.sort ?? b.date)));

/** "Venue, City", or just the city when the venue is unknown (never a leading comma). The place is
 *  left out when the venue already says it ("Shows in Ohio and Michigan" + "Ohio and Michigan"), or
 *  when the venue ends with one of its parts ("…then a gig in Canada" + "Michigan and Canada"). */
export const where = (s: { venue: string | null; city: string | null }): string => {
  const venue = s.venue?.trim() || '';
  const city = s.city?.trim() || '';
  if (!venue || !city) return venue || city;
  const lc = venue.toLowerCase();
  const parts = city.toLowerCase().split(/,\s*|\s+and\s+/).filter(Boolean);
  if (lc.includes(city.toLowerCase()) || parts.some((p) => lc.endsWith(p))) return venue;
  return `${venue}, ${city}`;
};
