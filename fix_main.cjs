const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

if (!code.includes('ErrorBoundary')) {
  code = code.replace(
    "import { ThemeProvider } from './components/ThemeProvider.js';",
    "import { ThemeProvider } from './components/ThemeProvider.js';\nimport { ErrorBoundary } from './components/ErrorBoundary.js';"
  );
  
  code = code.replace(
    '<ThemeProvider defaultTheme="light">',
    '<ThemeProvider defaultTheme="light">\n      <ErrorBoundary>'
  );
  
  code = code.replace(
    '</ThemeProvider>',
    '</ErrorBoundary>\n    </ThemeProvider>'
  );
  
  fs.writeFileSync('src/main.tsx', code);
  console.log('Fixed main.tsx');
}
