#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

const ROOT_DIR = process.cwd();
const IMAGE_ROOT = path.join(ROOT_DIR, "public", "images");
const CACHE_DIR = path.join(ROOT_DIR, ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "image-optimize-cache.json");

const CONFIG = {
  version: "v1",
  maxDimension: 2200,
  minSavingsBytes: 1024,
  minSavingsRatio: 0.02,
  includeExtensions: new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tiff"]),
};

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function loadCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      return {};
    }

    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch (error) {
    console.warn("[image-optimize] Cache read failed, rebuilding cache.");
    return {};
  }
}

function saveCache(cache) {
  ensureDirectory(CACHE_DIR);
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function walkFiles(dirPath, result = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walkFiles(fullPath, result);
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();

    if (CONFIG.includeExtensions.has(extension)) {
      result.push(fullPath);
    }
  }

  return result;
}

function createHash(buffer) {
  return crypto.createHash("sha1").update(buffer).digest("hex");
}

function getPipeline(fileBuffer, metadata, extension) {
  const shouldResize =
    (metadata.width && metadata.width > CONFIG.maxDimension) ||
    (metadata.height && metadata.height > CONFIG.maxDimension);

  let pipeline = sharp(fileBuffer, { animated: false, failOn: "none" }).rotate();

  if (shouldResize) {
    pipeline = pipeline.resize({
      width: CONFIG.maxDimension,
      height: CONFIG.maxDimension,
      fit: "inside",
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    });
  }

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true, progressive: true });
      break;
    case ".png":
      pipeline = pipeline.png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true,
        quality: 82,
        effort: 10,
      });
      break;
    case ".webp":
      pipeline = pipeline.webp({ quality: 82, effort: 6 });
      break;
    case ".avif":
      pipeline = pipeline.avif({ quality: 52, effort: 7 });
      break;
    case ".tiff":
      pipeline = pipeline.tiff({ quality: 80, compression: "jpeg" });
      break;
    default:
      break;
  }

  return { pipeline, shouldResize };
}

async function optimizeFile(filePath, cache) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  const extension = path.extname(filePath).toLowerCase();
  const originalBuffer = fs.readFileSync(filePath);
  const fileHash = createHash(originalBuffer);
  const cacheKey = `${CONFIG.version}:${relativePath}`;

  if (cache[cacheKey] === fileHash) {
    return { optimized: false, skipped: true, bytesSaved: 0 };
  }

  let metadata;
  try {
    metadata = await sharp(originalBuffer, { animated: false, failOn: "none" }).metadata();
  } catch (error) {
    console.warn(`[image-optimize] Skip unreadable file: ${relativePath}`);
    return { optimized: false, skipped: true, bytesSaved: 0 };
  }

  const { pipeline, shouldResize } = getPipeline(originalBuffer, metadata, extension);
  const optimizedBuffer = await pipeline.toBuffer();

  const bytesSaved = originalBuffer.length - optimizedBuffer.length;
  const savingsRatio = bytesSaved / Math.max(originalBuffer.length, 1);

  const shouldWrite =
    shouldResize ||
    (bytesSaved > CONFIG.minSavingsBytes && savingsRatio >= CONFIG.minSavingsRatio);

  if (!shouldWrite) {
    cache[cacheKey] = fileHash;
    return { optimized: false, skipped: true, bytesSaved: 0 };
  }

  fs.writeFileSync(filePath, optimizedBuffer);

  const newHash = createHash(optimizedBuffer);
  cache[cacheKey] = newHash;

  return { optimized: true, skipped: false, bytesSaved: Math.max(bytesSaved, 0) };
}

async function main() {
  if (!fs.existsSync(IMAGE_ROOT)) {
    console.log("[image-optimize] No public/images directory found. Skipping.");
    return;
  }

  const files = walkFiles(IMAGE_ROOT);

  if (!files.length) {
    console.log("[image-optimize] No target images found. Skipping.");
    return;
  }

  const cache = loadCache();

  let optimizedCount = 0;
  let skippedCount = 0;
  let totalSavedBytes = 0;

  for (const filePath of files) {
    const result = await optimizeFile(filePath, cache);

    if (result.optimized) {
      optimizedCount += 1;
      totalSavedBytes += result.bytesSaved;
    } else if (result.skipped) {
      skippedCount += 1;
    }
  }

  saveCache(cache);

  const totalSavedMb = (totalSavedBytes / (1024 * 1024)).toFixed(2);
  console.log(
    `[image-optimize] Done. optimized=${optimizedCount}, skipped=${skippedCount}, saved=${totalSavedMb} MB`
  );
}

main().catch((error) => {
  console.error("[image-optimize] Failed:", error);
  process.exit(1);
});
