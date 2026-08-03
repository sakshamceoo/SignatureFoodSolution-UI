import fs from "fs";
import zlib from "zlib";
import path from "path";

const ROOT = path.resolve("src/assets");

function readChunks(buf) {
  const chunks = [];
  let offset = 8;
  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.slice(offset + 4, offset + 8).toString("ascii");
    const data = buf.slice(offset + 8, offset + 8 + length);
    chunks.push({ type, data });
    offset += 12 + length;
  }
  return chunks;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function unfilter(data, width, height, bpp) {
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  let src = 0;
  let dst = 0;
  for (let y = 0; y < height; y++) {
    const filter = data[src++];
    for (let x = 0; x < stride; x++) {
      const raw = data[src++];
      const left = x >= bpp ? out[dst + x - bpp] : 0;
      const up = y > 0 ? out[dst + x - stride] : 0;
      const upLeft = y > 0 && x >= bpp ? out[dst + x - stride - bpp] : 0;
      let val = raw;
      if (filter === 1) val = (raw + left) & 255;
      else if (filter === 2) val = (raw + up) & 255;
      else if (filter === 3) val = (raw + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) val = (raw + paeth(left, up, upLeft)) & 255;
      out[dst + x] = val;
    }
    dst += stride;
  }
  return out;
}

function filterNone(pixels, width, height, bpp) {
  const stride = width * bpp;
  const out = Buffer.alloc(height * (1 + stride));
  let src = 0;
  let dst = 0;
  for (let y = 0; y < height; y++) {
    out[dst++] = 0;
    pixels.copy(out, dst, src, src + stride);
    src += stride;
    dst += stride;
  }
  return out;
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function decode(file) {
  const buf = fs.readFileSync(path.join(ROOT, file));
  const chunks = readChunks(buf);
  const ihdr = chunks.find((c) => c.type === "IHDR").data;
  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const bitDepth = ihdr[8];
  const colorType = ihdr[9];
  if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) {
    throw new Error(`Unsupported ${file}`);
  }
  const idat = zlib.inflateSync(
    Buffer.concat(chunks.filter((c) => c.type === "IDAT").map((c) => c.data)),
  );
  const bpp = colorType === 6 ? 4 : 3;
  const pixels = unfilter(idat, width, height, bpp);
  return { width, height, bpp, pixels, ihdr };
}

function writeRgba(file, width, height, rgba, ihdr) {
  const newIhdr = Buffer.from(ihdr);
  newIhdr[9] = 6;
  const compressed = zlib.deflateSync(filterNone(rgba, width, height, 4), {
    level: 9,
  });
  const out = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", newIhdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  fs.writeFileSync(path.join(ROOT, file), out);
  console.log(`wrote ${file} (${out.length} bytes)`);
}

function isBg(r, g, b, threshold = 36) {
  return Math.max(r, g, b) <= threshold;
}

function floodKnockout(file, threshold = 36) {
  const { width, height, bpp, pixels, ihdr } = decode(file);
  console.log(`${file}: ${width}x${height}`);
  const visited = new Uint8Array(width * height);
  const stack = [];

  const pushIfBg = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * bpp;
    if (!isBg(pixels[i], pixels[i + 1], pixels[i + 2], threshold)) return;
    visited[idx] = 1;
    stack.push(idx);
  };

  for (let x = 0; x < width; x++) {
    pushIfBg(x, 0);
    pushIfBg(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIfBg(0, y);
    pushIfBg(width - 1, y);
  }

  while (stack.length) {
    const idx = stack.pop();
    const x = idx % width;
    const y = (idx / width) | 0;
    pushIfBg(x + 1, y);
    pushIfBg(x - 1, y);
    pushIfBg(x, y + 1);
    pushIfBg(x, y - 1);
  }

  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const i = idx * bpp;
      const o = idx * 4;
      rgba[o] = pixels[i];
      rgba[o + 1] = pixels[i + 1];
      rgba[o + 2] = pixels[i + 2];
      const aIn = bpp === 4 ? pixels[i + 3] : 255;
      rgba[o + 3] = visited[idx] ? 0 : aIn;
    }
  }

  // Soft fringe: fade near-black fringe pixels adjacent to knocked-out area
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const o = idx * 4;
      if (rgba[o + 3] === 0) continue;
      const max = Math.max(rgba[o], rgba[o + 1], rgba[o + 2]);
      if (max > 55) continue;
      let nearHole = false;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        if (rgba[((y + dy) * width + (x + dx)) * 4 + 3] === 0) nearHole = true;
      }
      if (nearHole) rgba[o + 3] = Math.round((max / 55) * 255);
    }
  }

  writeRgba(file, width, height, rgba, ihdr);
}

floodKnockout("logo.png", 40);
floodKnockout("hero-img.png", 32);
