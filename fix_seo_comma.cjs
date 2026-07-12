const fs = require('fs');
let code = fs.readFileSync('src/components/SEOSchemas.tsx', 'utf8');

const target = `            "validFrom": todayStr
          }
        },
        
      ]`;
      
const replacement = `            "validFrom": todayStr
          }
        }
      ]`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/SEOSchemas.tsx', code);
  console.log('Fixed comma');
}
