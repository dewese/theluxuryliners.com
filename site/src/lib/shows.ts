// Pure helpers for /shows/ (tested in tests/unit/shows.test.mjs).
import { sortKey } from './dates.ts';

export interface Show { date: string; sort?: string; when: string; venue: string | null; city: string; note?: string; status: string }

/** Published shows in date order; an approximate date sorts by its 'sort' key. */
export const sortShows = <T extends Show>(shows: T[]): T[] =>
  shows.filter((s) => s.status === 'publish').sort((a, b) => sortKey(a.sort ?? a.date).localeCompare(sortKey(b.sort ?? b.date)));

/** "Venue, City", or just the city when the venue is unknown (never a leading comma). */
export const where = (s: { venue: string | null; city: string | null }): string => [s.venue, s.city].filter((x) => x && x.trim()).join(', ');
