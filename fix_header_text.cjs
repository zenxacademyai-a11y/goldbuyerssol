const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(/text-neutral-900/g, 'text-neutral-900 dark:text-neutral-100');
code = code.replace(/text-neutral-800/g, 'text-neutral-800 dark:text-neutral-200');
code = code.replace(/text-neutral-700/g, 'text-neutral-700 dark:text-neutral-300');
code = code.replace(/text-neutral-600/g, 'text-neutral-600 dark:text-neutral-400');
code = code.replace(/text-neutral-500/g, 'text-neutral-500 dark:text-neutral-400');

code = code.replace(/bg-white/g, 'bg-white dark:bg-neutral-900');
code = code.replace(/border-neutral-100/g, 'border-neutral-100 dark:border-neutral-800');
code = code.replace(/border-neutral-200/g, 'border-neutral-200 dark:border-neutral-800');
code = code.replace(/hover:bg-neutral-50/g, 'hover:bg-neutral-50 dark:hover:bg-neutral-800');

fs.writeFileSync('src/components/Header.tsx', code);
console.log('Fixed Header text colors');
