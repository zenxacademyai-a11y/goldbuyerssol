/**
 * Script to generate responsive WebP images and tiny blur-up placeholders
 * using the system's ImageMagick 'convert' tool.
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const IMAGES_DIR = path.resolve("./src/assets/images");
const PUBLIC_DIR = path.resolve("./public");

function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch (error) {
    console.error(`Failed to execute command: ${cmd}`, error);
  }
}

function processImage(inputPath, outputBaseName, outDir) {
  console.log(`Processing: ${path.basename(inputPath)} -> ${outputBaseName}`);

  // 1. Small WebP (480px width)
  const smPath = path.join(outDir, `${outputBaseName}-sm.webp`);
  runCommand(`convert "${inputPath}" -resize 480x -quality 85 "${smPath}"`);

  // 2. Medium WebP (800px width)
  const mdPath = path.join(outDir, `${outputBaseName}-md.webp`);
  runCommand(`convert "${inputPath}" -resize 800x -quality 82 "${mdPath}"`);

  // 3. Large WebP (1200px width)
  const lgPath = path.join(outDir, `${outputBaseName}-lg.webp`);
  runCommand(`convert "${inputPath}" -resize 1200x -quality 80 "${lgPath}"`);

  // 4. Blur placeholder WebP (20px width, highly blurred, tiny file size)
  const blurPath = path.join(outDir, `${outputBaseName}-blur.webp`);
  runCommand(`convert "${inputPath}" -resize 20x -quality 20 -blur 0x2 "${blurPath}"`);
}

function main() {
  // Ensure output directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log("Images directory not found, creating:", IMAGES_DIR);
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // Find gallery images
  const files = fs.readdirSync(IMAGES_DIR);
  const galleryFiles = files.filter(f => f.startsWith("gallery-") && f.endsWith(".jpg"));

  console.log(`Found ${galleryFiles.length} gallery images in ${IMAGES_DIR}.`);

  for (const file of galleryFiles) {
    const inputPath = path.join(IMAGES_DIR, file);
    const baseName = path.basename(file, ".jpg"); // e.g. gallery-1
    processImage(inputPath, baseName, IMAGES_DIR);
  }

  // Also process the logo
  const logoPath = path.join(PUBLIC_DIR, "gbc-logo-original.png");
  if (fs.existsSync(logoPath)) {
    console.log("Processing logo image...");
    // Create optimized WebP logos too
    runCommand(`convert "${logoPath}" -resize 120x -quality 90 "${path.join(PUBLIC_DIR, "gbc-logo-original-120.webp")}"`);
    runCommand(`convert "${logoPath}" -resize 20x -quality 20 -blur 0x1 "${path.join(PUBLIC_DIR, "gbc-logo-original-blur.webp")}"`);
  }

  console.log("Image generation completed!");
}

main();
