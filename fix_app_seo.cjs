const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'updateMetaTags("Our Services | Gold Buyers Colombo", "Explore our gold, diamond, and watch buying services.");',
  'updateMetaTags("Our Services | Gold Buyers Colombo", "Explore our gold, diamond, and watch buying services.", "gold buying service, diamond buyer, colombo, sri lanka");'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed App.tsx SEO');
