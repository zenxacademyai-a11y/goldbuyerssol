const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(
  'bg-white/95 backdrop-blur-md border-b border-neutral-200',
  'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800'
);

code = code.replace(
  'bg-white border border-neutral-200 px-3 py-1.5',
  'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5'
);

code = code.replace(
  'bg-white border border-neutral-200 px-2 py-1',
  'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-2 py-1'
);

code = code.replace(
  'bg-white/98 border-b border-neutral-200 absolute',
  'bg-white/98 dark:bg-neutral-950/98 border-b border-neutral-200 dark:border-neutral-800 absolute'
);

fs.writeFileSync('src/components/Header.tsx', code);
console.log('Fixed Header dark');
