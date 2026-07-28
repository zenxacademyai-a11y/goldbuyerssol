const fs = require('fs');
const path = require('path');

console.log('Restoring valid image assets...');

// Restore gbc-logo
if (fs.existsSync('./gbc-logo.png')) {
  fs.copyFileSync('./gbc-logo.png', './public/gbc-logo.png');
  fs.copyFileSync('./gbc-logo.png', './public/gbc-logo-original.png');
  fs.copyFileSync('./gbc-logo.png', './public/images/gbc-logo.png');
  fs.copyFileSync('./gbc-logo.png', './public/images/gbc-logo-original.png');
  console.log('Restored gbc-logo.png');
}

// Restore img-1 to img-10
for (let i = 1; i <= 10; i++) {
  const fileName = `img-${i}.jpeg`;
  if (fs.existsSync(`./${fileName}`)) {
    fs.copyFileSync(`./${fileName}`, `./public/${fileName}`);
    fs.copyFileSync(`./${fileName}`, `./public/images/${fileName}`);
    console.log(`Restored ${fileName}`);
  }
}

// Restore whatsapp-image.jpeg
const waFile = './WhatsApp Image 2026-07-09 at 12.58.29 AM.jpeg';
if (fs.existsSync(waFile)) {
  fs.copyFileSync(waFile, './public/whatsapp-image.jpeg');
  fs.copyFileSync(waFile, './public/images/whatsapp-image.jpeg');
  console.log('Restored whatsapp-image.jpeg');
}

// Restore logo from src/assets if available
if (fs.existsSync('./src/assets/images/gbc_logo_original_1784009344540.jpg')) {
  fs.copyFileSync('./src/assets/images/gbc_logo_original_1784009344540.jpg', './public/gbc-logo-original.jpg');
  fs.copyFileSync('./src/assets/images/gbc_logo_original_1784009344540.jpg', './public/images/gbc_logo_original_1784009344540.jpg');
}
if (fs.existsSync('./src/assets/images/logo_exact_1782837165365.jpg')) {
  fs.copyFileSync('./src/assets/images/logo_exact_1782837165365.jpg', './public/images/logo_exact_1782837165365.jpg');
}

// Restore gallery images if they have corrupt jpg versions
if (fs.existsSync('./src/assets/images/gbc_logo_original_1784009344540.jpg')) {
  for (let i = 1; i <= 5; i++) {
    fs.copyFileSync('./src/assets/images/gbc_logo_original_1784009344540.jpg', `./public/images/gallery-${i}.jpg`);
  }
}

// Check magic bytes after restore
const check = ['./public/gbc-logo.png', './public/gbc-logo-original.png', './public/img-1.jpeg', './public/images/gallery-1.jpg'];
check.forEach(f => {
  if (fs.existsSync(f)) {
    const buf = fs.readFileSync(f);
    console.log(f, 'byte length:', buf.length, 'hex:', buf.slice(0, 4).toString('hex'));
  }
});
