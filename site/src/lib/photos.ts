// One photo record, one caption, one credit, everywhere (home collage, Story, /photos/, /people/,
// EPK). Pending photos never render.
import data from '../../data/photos.json';
import sizes from '../../data/image-sizes.json';

export type Photo = (typeof data.photos)[number] & { width: number; height: number; widths: number[]; webp?: boolean };

export const PHOTOS: Photo[] = data.photos
  .filter((p) => p.status === 'publish')
  .map((p) => {
    const s = (sizes as Record<string, { width: number; height: number; widths: number[]; webp?: boolean }>)[`photos/${p.id}`];
    if (!s) throw new Error(`photo ${p.id}: no web copy; run npm run prepare:images`);
    return { ...p, ...s };
  });

export const photo = (id: string | null | undefined): Photo | undefined => (id ? PHOTOS.find((p) => p.id === id) : undefined);

/** "Photo: Name" or null (P17: uncredited photos carry no credit line). */
export const creditLine = (p: Pick<Photo, 'credit'>): string | null => (p.credit ? `Photo: ${p.credit}` : null);

/** The photographers credited on photos the site actually shows, with the photos they took and
 *  the years of those photos ("2000–2002"), so a photographer's years always match the dated
 *  photos (critique build-skeleton round 2, item 7). */
export function photographers(): { name: string; photos: Photo[]; years: string }[] {
  const m = new Map<string, Photo[]>();
  for (const p of sortPhotos(PHOTOS)) if (p.credit) m.set(p.credit, [...(m.get(p.credit) ?? []), p]);
  return [...m].map(([name, photos]) => {
    const ys = photos.map((p) => Number(p.year)).sort();
    return { name, photos, years: ys[0] === ys.at(-1) ? String(ys[0]) : `${ys[0]}–${ys.at(-1)}` };
  });
}

/** Photos in date order (year, then the order they are listed in data/photos.json), for /photos/
 *  and the photographer lists (critique build-skeleton round 2, item 3). */
export const sortPhotos = (ps: Photo[]): Photo[] => ps.map((p, i) => [p, i] as const).sort((a, b) => String(a[0].year).localeCompare(String(b[0].year)) || a[1] - b[1]).map(([p]) => p);

export const COLLAGE: Photo[] = PHOTOS.filter((p) => typeof (p as any).collage === 'number').sort((a, b) => (a as any).collage - (b as any).collage);

export const ERAS = [
  { id: '1998-2000', label: '1998–2000' },
  { id: '2001-2004', label: '2001–2004' },
  { id: '2005-2007', label: '2005–2007' },
  { id: '2008-', label: '2008 on' },
];

export const coverSizes = (slug: string) => (sizes as Record<string, { width: number; height: number; widths: number[]; webp?: boolean }>)[`covers/${slug}`];
