const fs = require('fs');
let code = fs.readFileSync('src/components/GoldCalculator.tsx', 'utf8');

code = code.replace('lg:col-span-5 ', '');
code = code.replace('lg:col-span-5 ', '');
code = code.replace('min-h-[450px]', '');

fs.writeFileSync('src/components/GoldCalculator.tsx', code);
console.log('Fixed calculator col-span');
