const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');
const mobileNavMatch = code.match(/\{!\!moreMenuOpen && \([\s\S]*?<\/div>\s*\)\}/);
// wait, the state is probably `mobileMenuOpen`. Let's just grep mobileMenuOpen
const mobileMenuMatch = code.match(/mobileMenuOpen && \([\s\S]*?<\/div>\s*<\/div>\s*\)/);
if (mobileMenuMatch) console.log(mobileMenuMatch[0].substring(0, 500) + '...');
