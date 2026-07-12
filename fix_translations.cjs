const fs = require('fs');
let code = fs.readFileSync('src/lib/translations.ts', 'utf8');

// Add to Translations type
code = code.replace(
  'home: string;',
  'home: string;\n  services: string;'
);

// EN
code = code.replace(
  'home: "Home",',
  'home: "Home",\n    services: "Services",'
);

// SI
code = code.replace(
  'home: "මුල් පිටුව",',
  'home: "මුල් පිටුව",\n    services: "සේවාවන්",'
);

// TA
code = code.replace(
  'home: "முகப்பு",',
  'home: "முகப்பு",\n    services: "சேவைகள்",'
);

fs.writeFileSync('src/lib/translations.ts', code);
console.log('Fixed translations');
