const fs = require('fs');
const path = require('path');

console.log('Restoring valid image and video assets across all public and src asset directories...');

const dirs = ['./public', './public/images', './public/assets', './src/assets', './src/assets/images'];
dirs.forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

function copyToAll(srcFile, destName) {
  if (!fs.existsSync(srcFile)) return;
  dirs.forEach(d => {
    try {
      fs.copyFileSync(srcFile, path.join(d, destName));
    } catch (e) {
      console.error(`Failed to copy ${srcFile} to ${d}/${destName}:`, e.message);
    }
  });
}

// 1. Restore gbc-logo
if (fs.existsSync('./gbc-logo.png')) {
  copyToAll('./gbc-logo.png', 'gbc-logo.png');
  copyToAll('./gbc-logo.png', 'gbc-logo-original.png');
  copyToAll('./gbc-logo.png', 'gbc-logo-original.jpg');
  console.log('Restored gbc-logo.png / gbc-logo-original.png');
}

// 2. Restore video
if (fs.existsSync('./gbc-hero-bg-video.mp4')) {
  copyToAll('./gbc-hero-bg-video.mp4', 'gbc-hero-bg-video.mp4');
  console.log('Restored gbc-hero-bg-video.mp4');
}

// 3. Restore img-1 to img-10
for (let i = 1; i <= 10; i++) {
  const fileName = `img-${i}.jpeg`;
  if (fs.existsSync(`./${fileName}`)) {
    copyToAll(`./${fileName}`, fileName);
    console.log(`Restored ${fileName}`);
  }
}

// 4. Restore gallery-1 to gallery-5
for (let i = 1; i <= 5; i++) {
  const srcFile = `./img-${i}.jpeg`;
  if (fs.existsSync(srcFile)) {
    copyToAll(srcFile, `gallery-${i}.jpg`);
    copyToAll(srcFile, `gallery-${i}.jpeg`);
  }
}

// 5. Restore whatsapp-image.jpeg
const waFile = './WhatsApp Image 2026-07-09 at 12.58.29 AM.jpeg';
if (fs.existsSync(waFile)) {
  copyToAll(waFile, 'whatsapp-image.jpeg');
  console.log('Restored whatsapp-image.jpeg');
}

// Verify output
const check = ['./public/gbc-logo.png', './public/gbc-logo-original.png', './public/img-1.jpeg', './public/gbc-hero-bg-video.mp4'];
check.forEach(f => {
  if (fs.existsSync(f)) {
    const buf = fs.readFileSync(f);
    console.log(`Verified ${f}: ${buf.length} bytes, magic: ${buf.slice(0, 4).toString('hex')}`);
  }
});
