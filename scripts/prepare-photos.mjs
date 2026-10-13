// Resize photos and strip all metadata (GPS location, camera info, ...)
// before they go into the repo or get uploaded to Flickr/Unsplash.
// Double-click photos-for-site.bat / photos-for-upload.bat, or run:
//
//   yarn photos                      photos-inbox/ -> src/assets/photos/
//   yarn photos --out photos-ready   photos-inbox/ -> photos-ready/ (for uploading)
//   yarn photos --force              overwrite files that already exist
//   --open                           open the result folder in Explorer afterwards
//
// Plain JS (no tsx) so the .bat files only need Node itself.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const INBOX = 'photos-inbox';
const MAX_EDGE = 2400;
const QUALITY = 85;
const INPUT_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff']);

const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
const outDir = outIndex >= 0 ? args[outIndex + 1] : 'src/assets/photos';
const force = args.includes('--force');
const open = args.includes('--open');

function openFolder(folder) {
  if (open && process.platform === 'win32') {
    spawnSync('explorer', [path.resolve(folder)]);
  }
}

// ASCII-only names: letters, digits, - and _. A name with nothing left
// (e.g. all Chinese) becomes photo-<hash of the file>.
function outputName(file) {
  const base = path
    .parse(file)
    .name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (base) return `${base}.jpg`;
  const hash = createHash('md5')
    .update(fs.readFileSync(path.join(INBOX, file)))
    .digest('hex')
    .slice(0, 8);
  return `photo-${hash}.jpg`;
}

async function loadSharp() {
  if (!fs.existsSync('node_modules/sharp')) {
    console.log('第一次使用，正在安裝需要的套件，請稍候...\n');
    const r = spawnSync('npx', ['--yes', 'yarn@1', 'install', '--frozen-lockfile'], {
      stdio: 'inherit',
      shell: true,
    });
    if (r.status !== 0) {
      console.log('\n套件安裝失敗，請確認網路連線後再試一次。');
      process.exit(1);
    }
  }
  return (await import('sharp')).default;
}

async function main() {
  fs.mkdirSync(INBOX, { recursive: true });
  const files = fs.readdirSync(INBOX).filter((f) => !f.startsWith('.'));
  if (files.length === 0) {
    console.log(`${INBOX} 資料夾是空的：請把照片放進去，再執行一次。`);
    openFolder(INBOX);
    return;
  }

  const sharp = await loadSharp();
  fs.mkdirSync(outDir, { recursive: true });

  let done = 0;
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.heic' || ext === '.heif') {
      console.log(`[略過] ${file}：不支援 HEIC，請先轉成 JPG`);
      continue;
    }
    if (!INPUT_EXT.has(ext)) {
      console.log(`[略過] ${file}：不是照片`);
      continue;
    }

    const name = outputName(file);
    const target = path.join(outDir, name);
    if (fs.existsSync(target) && !force) {
      console.log(`[略過] ${file}：${name} 已經存在`);
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
      const stripped = before.exif ? '，已移除 GPS 等資訊' : '';
      console.log(`[完成] ${file} -> ${name}（${info.width}x${info.height}，${sizeKb} KB${stripped}）`);
      done++;
    } catch (err) {
      console.log(`[失敗] ${file}：${err.message}`);
    }
  }

  console.log(`\n共處理 ${done} 張，結果在 ${outDir}`);
  console.log(`原始照片還留在 ${INBOX}（不會被 commit）。`);
  openFolder(outDir);
}

main();
