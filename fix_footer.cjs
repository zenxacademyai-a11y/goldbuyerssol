const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const servicesLink = `              <a href="/services" onClick={(e) => { e.preventDefault(); setView("services"); window.scrollTo(0,0); }} className="hover:text-amber-700 transition-colors cursor-pointer block text-left">
                {t.services}
              </a>`;

code = code.replace(
  '<a href="/about" onClick={(e) => { e.preventDefault(); setView("about"); window.scrollTo(0,0); }} className="hover:text-amber-700 transition-colors cursor-pointer block text-left">',
  servicesLink + '\n              <a href="/about" onClick={(e) => { e.preventDefault(); setView("about"); window.scrollTo(0,0); }} className="hover:text-amber-700 transition-colors cursor-pointer block text-left">'
);

fs.writeFileSync('src/components/Footer.tsx', code);
console.log('Fixed Footer');
