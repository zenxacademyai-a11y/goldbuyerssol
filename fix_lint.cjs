const fs = require('fs');
let code = fs.readFileSync('src/components/GoldCalculator.tsx', 'utf8');
code = code.replace(/import \{.*\} from "lucide-react";/, 'import { Calculator, Scale, FileText, Share2, Printer, Check, Info } from "lucide-react";');
fs.writeFileSync('src/components/GoldCalculator.tsx', code);
console.log('Fixed linting errors in GoldCalculator (potentially)');
