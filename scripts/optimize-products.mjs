/**
 * Compress product catalogue images to WebP for faster loads / deploys.
 * Usage: node scripts/optimize-products.mjs
 *
 * Reads PNGs/JPGs from src/assets/Products, backs them up to _originals/,
 * writes max-960px WebP (~78 quality), then removes the source files.
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const dir = "src/assets/Products";
const originals = path.join(dir, "_originals");
const MAX = 960;
const QUALITY = 78;

fs.mkdirSync(originals, { recursive: true });

const files = fs
  .readdirSync(dir)
  .filter((f) => /\.(png|jpe?g)$/i.test(f));

if (!files.length) {
  console.log("No PNG/JPEG files to optimize in", dir);
  process.exit(0);
}

let before = 0;
let after = 0;

for (const file of files) {
  const src = path.join(dir, file);
  const backup = path.join(originals, file);
  const dest = path.join(dir, file.replace(/\.(png|jpe?g)$/i, ".webp"));
  const srcSize = fs.statSync(src).size;
  before += srcSize;

  if (!fs.existsSync(backup)) fs.copyFileSync(src, backup);

  await sharp(src)
    .rotate()
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY, alphaQuality: 90, effort: 6 })
    .toFile(dest);

  const destSize = fs.statSync(dest).size;
  after += destSize;
  fs.unlinkSync(src);

  console.log(
    `${file}: ${(srcSize / 1024 / 1024).toFixed(2)}MB → ${(destSize / 1024).toFixed(0)}KB`,
  );
}

console.log("---");
console.log(`Before: ${(before / 1024 / 1024).toFixed(1)} MB`);
console.log(`After:  ${(after / 1024 / 1024).toFixed(1)} MB`);
console.log(`Saved:  ${((1 - after / before) * 100).toFixed(1)}%`);
