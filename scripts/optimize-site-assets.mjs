/**
 * Optimize non-product site assets (images + videos) for faster deploys.
 * Usage: node scripts/optimize-site-assets.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const assets = "src/assets";
const ffmpeg = ffmpegInstaller.path;

const IMAGE_JOBS = [
  // Keep full canvas size; WebP at high quality preserves the look.
  { file: "bulk.png", quality: 84 },
  { file: "hero-clear.png", quality: 84 },
  { file: "map.png", quality: 82 },
  { file: "graphic-tl-clear.png", quality: 80 },
  { file: "graphic-br-clear.png", quality: 80 },
  // Logo is shown ~320px; 720 keeps retina sharpness without 1MB+ PNG.
  { file: "logo-clear.png", quality: 88, max: 720 },
];

const VIDEO_FILES = ["hero-video.mp4", "video1.mp4", "video2.mp4"];

function fmt(bytes) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)}MB`
    : `${(bytes / 1024).toFixed(0)}KB`;
}

async function optimizeImages() {
  let before = 0;
  let after = 0;

  for (const job of IMAGE_JOBS) {
    const src = path.join(assets, job.file);
    if (!fs.existsSync(src)) {
      console.log(`skip missing ${job.file}`);
      continue;
    }
    const dest = path.join(assets, job.file.replace(/\.png$/i, ".webp"));
    const srcSize = fs.statSync(src).size;
    before += srcSize;

    let pipeline = sharp(src).rotate();
    if (job.max) {
      pipeline = pipeline.resize({
        width: job.max,
        height: job.max,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    await pipeline
      .webp({ quality: job.quality, alphaQuality: 92, effort: 6 })
      .toFile(dest);

    const destSize = fs.statSync(dest).size;
    after += destSize;
    fs.unlinkSync(src);
    console.log(`IMG  ${job.file}: ${fmt(srcSize)} → ${fmt(destSize)}`);
  }

  // Unused duplicate masters (not imported anywhere)
  for (const unused of ["graphic.png", "graphic2.png"]) {
    const p = path.join(assets, unused);
    if (fs.existsSync(p)) {
      const size = fs.statSync(p).size;
      before += size;
      fs.unlinkSync(p);
      console.log(`DEL  ${unused}: ${fmt(size)} (unused)`);
    }
  }

  // Favicon: shrink public copy (referenced as /favicon.png)
  const favSrc = path.join(assets, "favicon.png");
  const favPublic = "public/favicon.png";
  if (fs.existsSync(favSrc) || fs.existsSync(favPublic)) {
    const source = fs.existsSync(favSrc) ? favSrc : favPublic;
    const srcSize = fs.statSync(source).size;
    before += srcSize;

    // 192 for apple-touch / OG-ish icon; still tiny vs 1024 PNG
    await sharp(source)
      .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toFile(favPublic + ".tmp");

    fs.renameSync(favPublic + ".tmp", favPublic);
    const destSize = fs.statSync(favPublic).size;
    after += destSize;
    if (fs.existsSync(favSrc)) fs.unlinkSync(favSrc);
    console.log(`ICO  favicon.png: ${fmt(srcSize)} → ${fmt(destSize)}`);
  }

  return { before, after };
}

function optimizeVideos() {
  let before = 0;
  let after = 0;

  for (const file of VIDEO_FILES) {
    const src = path.join(assets, file);
    if (!fs.existsSync(src)) {
      console.log(`skip missing ${file}`);
      continue;
    }
    const srcSize = fs.statSync(src).size;
    before += srcSize;
    const tmp = path.join(assets, file.replace(/\.mp4$/i, ".opt.mp4"));

    // Keep native resolution; CRF 28 + slow preset shrinks well with little visual loss.
    // Scale down only if wider than 1920 (true 4K sources).
    const result = spawnSync(
      ffmpeg,
      [
        "-y",
        "-i",
        src,
        "-vf",
        "scale='min(1920,iw)':-2",
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "28",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        "-an",
        tmp,
      ],
      { encoding: "utf8" },
    );

    if (result.status !== 0 || !fs.existsSync(tmp)) {
      console.error(`VID FAIL ${file}:`, result.stderr?.slice(-400));
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
      continue;
    }

    const destSize = fs.statSync(tmp).size;
    // Keep original if optimized file is somehow larger
    if (destSize >= srcSize * 0.95) {
      fs.unlinkSync(tmp);
      after += srcSize;
      console.log(`VID  ${file}: kept original ${fmt(srcSize)} (no gain)`);
      continue;
    }

    fs.unlinkSync(src);
    fs.renameSync(tmp, src);
    after += destSize;
    console.log(`VID  ${file}: ${fmt(srcSize)} → ${fmt(destSize)}`);
  }

  return { before, after };
}

const img = await optimizeImages();
const vid = optimizeVideos();
const before = img.before + vid.before;
const after = img.after + vid.after;

console.log("---");
console.log(`Before: ${fmt(before)}`);
console.log(`After:  ${fmt(after)}`);
if (before > 0) {
  console.log(`Saved:  ${((1 - after / before) * 100).toFixed(1)}%`);
}
