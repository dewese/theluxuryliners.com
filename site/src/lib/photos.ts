// One photo record, one caption, one credit, everywhere (home collage, Story, /photos/, /people/,
// EPK). Pending photos never render.
import data from '../../data/photos.json';
import sizes from '../../data/image-sizes.json';

export type Photo = (typeof data.photos)[number] & { width: number; height: number; widths: number[] };

export const PHOTOS: Photo[] = data.photos
  .filter((p) => p.status === 'publish')
  .map((p) => {
    const s = (sizes as Record<string, { width: number; height: number; widths: number[] }>)[`photos/${p.id}`];
    if (!s) throw new Error(`photo ${p.id}: no web copy; run npm run prepare:images`);
    return { ...p, ...s };
  });

export const photo = (id: string | null | undefined): Photo | undefined => (id ? PHOTOS.find((p) => p.id === id) : undefined);

/** "Photo: Name" or null (P17: uncredited photos carry no credit line). */
export const creditLine = (p: Pick<Photo, 'credit'>): string | null => (p.credit ? `Photo: ${p.credit}` : null);

/** The photographers credited on photos the site actually shows, with the photos they took. */
export function photographers(): { name: string; photos: Photo[] }[] {
  const m = new Map<string, Photo[]>();
  for (const p of PHOTOS) if (p.credit) m.set(p.credit, [...(m.get(p.credit) ?? []), p]);
  return [...m].map(([name, photos]) => ({ name, photos }));
}

export const COLLAGE: Photo[] = PHOTOS.filter((p) => typeof (p as any).collage === 'number').sort((a, b) => (a as any).collage - (b as any).collage);

export const ERAS = [
  { id: '1997-2000', label: '1997–2000' },
  { id: '2001-2004', label: '2001–2004' },
  { id: '2005-2007', label: '2005–2007' },
  { id: '2008-', label: '2008 on' },
];

export const coverSizes = (slug: string) => (sizes as Record<string, { width: number; height: number; widths: number[] }>)[`covers/${slug}`];
