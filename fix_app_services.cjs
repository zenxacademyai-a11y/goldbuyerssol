const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
if (!code.includes('ServicesPage')) {
  code = code.replace(
    'const ContactPage = lazy(() => import("./components/ContactPage.js"));',
    'const ContactPage = lazy(() => import("./components/ContactPage.js"));\nconst ServicesPage = lazy(() => import("./components/ServicesPage.js"));'
  );
}

// Update type
code = code.replace(
  'const [activeView, setActiveView] = useState<"home" | "blog" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "faq">',
  'const [activeView, setActiveView] = useState<"home" | "blog" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "faq" | "services">'
);

// Update route path logic
code = code.replace(
  '} else if (activeView === "about") {',
  '} else if (activeView === "services") {\n      document.title = "Our Services | Gold Buyers Colombo";\n      updateMetaTags("Our Services | Gold Buyers Colombo", "Explore our gold, diamond, and watch buying services.");\n    } else if (activeView === "about") {'
);

// Update App view switch
code = code.replace(
  ') : activeView === "about" ? (',
  ') : activeView === "services" ? (\n          <ServicesPage currentLang={currentLang} />\n        ) : activeView === "about" ? ('
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed App.tsx services page');
