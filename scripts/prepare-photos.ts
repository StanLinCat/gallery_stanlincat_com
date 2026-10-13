#!/usr/bin/env tsx
// Resize photos and strip all metadata (GPS location, camera info, ...)
// before they go into the repo or get uploaded to Flickr/Unsplash.
//
//   yarn photos                      photos-inbox/ -> src/assets/photos/
//   yarn photos --out photos-ready   photos-inbox/ -> photos-ready/ (for uploading)
//   yarn photos --force              overwrite files that already exist

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const INBOX = 'photos-inbox';
const MAX_EDGE = 2400;
const QUALITY = 85;
const INPUT_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff']);

const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
const outDir = outIndex >= 0 ? args[outIndex + 1] : 'src/assets/photos';
const force = args.includes('--force');

function outputName(file: string): string {
  const base = path
    .parse(file)
    .name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-一-鿿]+/g, '');
  return `${base}.jpg`;
}

async function main() {
  if (!fs.existsSync(INBOX)) {
    fs.mkdirSync(INBOX);
    console.log(`Created ${INBOX}/ — put your photos there and run again.`);
    return;
  }
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(INBOX).filter((f) => !f.startsWith('.'));
  if (files.length === 0) {
    console.log(`${INBOX}/ is empty — put your photos there and run again.`);
    return;
  }

  let done = 0;
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.heic' || ext === '.heif') {
      console.log(`⚠️  ${file}: HEIC is not supported — export it as JPG first`);
      continue;
    }
    if (!INPUT_EXT.has(ext)) {
      console.log(`⏭️  ${file}: not an image, skipped`);
      continue;
    }

    const target = path.join(outDir, outputName(file));
    if (fs.existsSync(target) && !force) {
      console.log(`⏭️  ${file}: ${target} already exists (use --force to overwrite)`);
      continue;
    }

    try {
      const input = path.join(INBOX, file);
      const before = await sharp(input).metadata();
      const info = await sharp(input)
        .rotate() // apply EXIF orientation before the metadata is dropped
        .resize({
          width: MAX_EDGE,
          height: MAX_EDGE,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(target); // sharp writes no EXIF/GPS unless asked to

      const sizeKb = Math.round(info.size / 1024);
      const stripped = before.exif ? ', metadata removed' : '';
      console.log(`✅ ${file} -> ${target} (${info.width}x${info.height}, ${sizeKb} KB${stripped})`);
      done++;
    } catch (err) {
      console.log(`❌ ${file}: ${(err as Error).message}`);
    }
  }

  console.log(`\nDone: ${done} photo(s) written to ${outDir}/`);
  console.log(`Originals are still in ${INBOX}/ (not committed to git).`);
}

main();
