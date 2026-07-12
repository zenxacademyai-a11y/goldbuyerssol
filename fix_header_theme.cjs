const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Add import
if (!code.includes('ThemeToggle')) {
  code = code.replace(
    'import InstallWebAppButton from "./InstallWebAppButton.js";',
    'import InstallWebAppButton from "./InstallWebAppButton.js";\nimport { ThemeToggle } from "./ThemeToggle.js";'
  );
}

// Desktop Right Buttons
const desktopRightBtns = `{/* Desktop Right Buttons (Language + Call CTAs) */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />`;

code = code.replace(
  '{/* Desktop Right Buttons (Language + Call CTAs) */}\n          <div className="hidden md:flex items-center gap-4">',
  desktopRightBtns
);

// Mobile
code = code.replace(
  '<div className="flex items-center gap-3">',
  '<div className="flex items-center gap-3">\n              <ThemeToggle />'
);

fs.writeFileSync('src/components/Header.tsx', code);
console.log('Fixed Header theme');
