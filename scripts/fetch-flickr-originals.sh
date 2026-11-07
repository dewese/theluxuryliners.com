#!/usr/bin/env bash
# Download the Flickr originals listed in data/assets.json that are still "url-only".
# Flickr rate-limits bursts (HTTP 429), so this goes one file at a time with pauses.
# Usage: bash scripts/fetch-flickr-originals.sh   (run from the repo root; needs python3 + curl)
set -u
cd "$(dirname "$0")/.."
mkdir -p assets/source/photos/flickr
python3 -c '
import json
for a in json.load(open("data/assets.json"))["assets"]:
    if a.get("flickr_id") and ("original blocked" in str(a.get("status","")) or str(a.get("status","")).startswith("url-only")):
        print(a["original_url"])
' | while read -r url; do
  f="assets/source/photos/flickr/$(basename "$url")"
  [ -s "$f" ] && continue
  code=$(curl -sS -o "$f.part" -w "%{http_code}" "$url")
  if [ "$code" = "200" ]; then mv "$f.part" "$f"; echo "ok   $f"; sleep 2
  else rm -f "$f.part"; echo "skip $url (HTTP $code)"; sleep 10; fi
done
echo "Done. Re-run to retry skipped files, then update each record's status/file in data/assets.json."
