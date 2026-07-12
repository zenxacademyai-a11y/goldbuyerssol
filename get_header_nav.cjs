const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');
const navMatch = code.match(/<nav className="hidden md:flex items-center gap-6 lg:gap-8">([\s\S]*?)<\/nav>/);
if (navMatch) console.log(navMatch[0]);
