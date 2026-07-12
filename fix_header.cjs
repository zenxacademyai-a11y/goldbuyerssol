const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const desktopServices = `            <a
              href="/services"
              onClick={(e) => { e.preventDefault(); handleNav("services"); }}
              className={\`text-sm font-semibold tracking-wide transition-colors \${activeView === "services" ? "text-amber-600 font-bold" : "text-neutral-600 hover:text-amber-600"}\`}
            >
              {t.services}
            </a>`;

const mobileServices = `          <a
            href="/services"
            onClick={(e) => { e.preventDefault(); handleNav("services"); }}
            className={\`text-left text-base py-2 border-b border-neutral-100 \${
              activeView === "services" ? "text-amber-600 font-bold" : "text-neutral-700"
            }\`}
          >
            {t.services}
          </a>`;

code = code.replace(
  '            <a\n              href="/rates"',
  desktopServices + '\n            <a\n              href="/rates"'
);

code = code.replace(
  '            <a\n              href="/rates"\n              onClick={(e) => { e.preventDefault(); handleNav("rates"); }}\n              className={`text-left text-base py-2 border-b border-neutral-100',
  mobileServices + '\n          <a\n              href="/rates"\n              onClick={(e) => { e.preventDefault(); handleNav("rates"); }}\n              className={`text-left text-base py-2 border-b border-neutral-100'
);

fs.writeFileSync('src/components/Header.tsx', code);
console.log('Fixed Header');
