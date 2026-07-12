const fs = require('fs');
let code = fs.readFileSync('src/components/SEOSchemas.tsx', 'utf8');

const target = `        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "18K Gold Buying Price (Per Gram)",
            "description": "Daily live buying price for 18K (750) white or yellow gold per gram in Colombo, Sri Lanka by Gold Buyers Colombo."
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": rate18k,
            "priceCurrency": "LKR",
            "valueAddedTaxIncluded": false,
            "validFrom": todayStr
          }
        }`;

code = code.replace(target, '');
fs.writeFileSync('src/components/SEOSchemas.tsx', code);
console.log('Fixed SEO');
