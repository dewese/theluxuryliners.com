// exif-gps.mjs: does an image file carry GPS position data in its EXIF block? Used by
// content/check-content.mjs --repo (audit-security round 2, minor): Decap uploads go straight into
// this public repository, and a phone photo can carry the place it was taken. Reads only the head
// of the file. JPEG (APP1 "Exif"), PNG (eXIf chunk) and WebP (EXIF chunk). No dependencies.
import { openSync, readSync, closeSync } from 'node:fs';

const HEAD = 512 * 1024;

/** True when the TIFF block at buf[off..] has a GPS IFD pointer (tag 0x8825) with GPS entries. */
export function tiffHasGps(buf, off) {
  if (off + 8 > buf.length) return false;
  const le = buf.toString('latin1', off, off + 2) === 'II';
  if (!le && buf.toString('latin1', off, off + 2) !== 'MM') return false;
  const u16 = (p) => (p + 2 <= buf.length ? (le ? buf.readUInt16LE(p) : buf.readUInt16BE(p)) : 0);
  const u32 = (p) => (p + 4 <= buf.length ? (le ? buf.readUInt32LE(p) : buf.readUInt32BE(p)) : 0);
  const ifd0 = off + u32(off + 4);
  const n = u16(ifd0);
  for (let i = 0; i < n; i++) {
    const e = ifd0 + 2 + i * 12;
    if (u16(e) === 0x8825) {
      const gps = off + u32(e + 8);
      return u16(gps) > 0; // an empty GPS directory carries no position
    }
  }
  return false;
}

/** True when the image bytes carry EXIF GPS data. */
export function bufferHasGps(buf) {
  // JPEG: walk the markers up to the image data
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let p = 2;
    while (p + 4 <= buf.length && buf[p] === 0xff) {
      const marker = buf[p + 1];
      if (marker === 0xda || marker === 0xd9) break;
      const len = buf.readUInt16BE(p + 2);
      if (marker === 0xe1 && buf.toString('latin1', p + 4, p + 10) === 'Exif\0\0' && tiffHasGps(buf, p + 10)) return true;
      p += 2 + len;
    }
    return false;
  }
  // PNG: chunks; eXIf holds a TIFF block
  if (buf.toString('latin1', 1, 4) === 'PNG') {
    let p = 8;
    while (p + 8 <= buf.length) {
      const len = buf.readUInt32BE(p);
      const type = buf.toString('latin1', p + 4, p + 8);
      if (type === 'eXIf') return tiffHasGps(buf, p + 8);
      if (type === 'IDAT' || type === 'IEND') return false;
      p += 12 + len;
    }
    return false;
  }
  // WebP: RIFF chunks; EXIF holds a TIFF block (sometimes after an "Exif\0\0" prefix)
  if (buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP') {
    let p = 12;
    while (p + 8 <= buf.length) {
      const type = buf.toString('latin1', p, p + 4);
      const len = buf.readUInt32LE(p + 4);
      if (type === 'EXIF') { const q = buf.toString('latin1', p + 8, p + 14) === 'Exif\0\0' ? p + 14 : p + 8; return tiffHasGps(buf, q); }
      p += 8 + len + (len % 2);
    }
    return false;
  }
  return false;
}

export function fileHasGps(path) {
  const fd = openSync(path, 'r');
  try {
    const buf = Buffer.alloc(HEAD);
    const n = readSync(fd, buf, 0, HEAD, 0);
    return bufferHasGps(buf.subarray(0, n));
  } finally { closeSync(fd); }
}
