import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import * as esbuild from "esbuild";

const BASE_URL = "https://goldbuyerscolombo.com";
const DIST_DIR = path.resolve("./dist");
const PUBLIC_DIR = path.resolve("./public");
const DB_PATH = path.resolve("./data/db.json");

// Helper to sanitize & escape HTML special chars in meta string attributes
function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Polyfill global window/document for Node SSR execution
if (typeof globalThis.window === "undefined") {
  const dummyEl = {
    style: {},
    setAttribute: () => {},
    appendChild: () => dummyEl,
    removeChild: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
  };

  const dummyDoc = {
    createElement: () => dummyEl,
    createElementNS: () => dummyEl,
    createTextNode: () => dummyEl,
    head: dummyEl,
    body: dummyEl,
    documentElement: dummyEl,
    getElementById: () => null,
    getElementsByTagName: () => [dummyEl],
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const dummyNav = {
    userAgent: "mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/120.0.0.0 safari/537.36",
    appVersion: "5.0 (windows nt 10.0; win64; x64)",
    platform: "Win32",
    languages: ["en-US", "en"],
    language: "en-US",
    deviceMemory: 8,
  };

  const dummyWin = {
    location: { pathname: "/", search: "", hash: "", href: BASE_URL, origin: BASE_URL },
    navigator: dummyNav,
    document: dummyDoc,
    screen: { deviceXDPI: 96, logicalXDPI: 96, width: 1920, height: 1080, colorDepth: 24 },
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    requestAnimationFrame: (cb) => setTimeout(cb, 16),
    cancelAnimationFrame: (id) => clearTimeout(id),
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    HTMLCanvasElement: class {},
    Image: class {},
  };

  globalThis.window = dummyWin;
  globalThis.document = dummyDoc;
  globalThis.location = dummyWin.location;
  try {
    Object.defineProperty(globalThis, "navigator", {
      value: dummyNav,
      writable: true,
      configurable: true,
    });
  } catch (e) {
    // ignore getter override restrictions
  }
}

// 1. Fetch Blog Data from PHP + MySQL CMS API (with fallback to local db.json)
async function fetchBlogsData() {
  const cmsEndpoints = [
    process.env.CMS_API_URL,
    process.env.VITE_API_BASE_URL ? `${process.env.VITE_API_BASE_URL}/blogs` : null,
    "https://goldbuyerscolombo.com/api/blogs",
    "http://localhost:8000/api/blogs",
  ].filter(Boolean);

  for (const endpoint of cmsEndpoints) {
    try {
      console.log(`[SSG] Attempting to fetch live blogs from PHP+MySQL CMS API: ${endpoint}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          console.log(`[SSG] Successfully fetched ${data.length} blogs from CMS API!`);
          return data;
        }
      }
    } catch (e) {
      // Continue to next endpoint or fallback
    }
  }

  // Fallback to data/db.json
  console.log("[SSG] CMS API offline or unreachable during build. Falling back to data/db.json...");
  if (fs.existsSync(DB_PATH)) {
    try {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      const db = JSON.parse(content);
      if (db && Array.isArray(db.blogs)) {
        console.log(`[SSG] Loaded ${db.blogs.length} blog posts from data/db.json.`);
        return db.blogs;
      }
    } catch (err) {
      console.error("[SSG] Failed to parse data/db.json:", err);
    }
  }

  return [];
}

// 2. Build and Render Static Site Pages
async function buildSSG() {
  console.log("\n===========================================");
  console.log("Starting Static Site Generation (SSG) Build");
  console.log("===========================================\n");

  if (!fs.existsSync(DIST_DIR)) {
    console.error("Error: dist directory does not exist. Run 'vite build' first.");
    process.exit(1);
  }

  const templatePath = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(templatePath)) {
    console.error("Error: dist/index.html not found.");
    process.exit(1);
  }

  const masterTemplate = fs.readFileSync(templatePath, "utf-8");

  // Clean default template OG tags to prevent duplicates
  const cleanTemplate = masterTemplate
    .replace(/<meta property="og:title".*?\/>\s*/gi, "")
    .replace(/<meta property="og:description".*?\/>\s*/gi, "")
    .replace(/<meta property="og:type".*?\/>\s*/gi, "")
    .replace(/<meta property="og:image".*?\/>\s*/gi, "")
    .replace(/<meta property="og:locale".*?\/>\s*/gi, "")
    .replace(/<meta name="twitter:card".*?\/>\s*/gi, "")
    .replace(/<meta name="twitter:image".*?\/>\s*/gi, "");

  // Fetch blogs from PHP/MySQL CMS API or db.json
  const blogs = await fetchBlogsData();

  // Compile entry-server.tsx into temporary Node ESM module
  console.log("[SSG] Bundling server entry point using esbuild...");
  const serverBuildDir = path.join(DIST_DIR, "server");
  if (!fs.existsSync(serverBuildDir)) {
    fs.mkdirSync(serverBuildDir, { recursive: true });
  }

  const serverOutFile = path.join(serverBuildDir, "entry-server.cjs");

  esbuild.buildSync({
    entryPoints: ["src/entry-server.tsx"],
    outfile: serverOutFile,
    bundle: true,
    platform: "node",
    format: "cjs",
    jsx: "automatic",
    target: "node18",
    external: ["jspdf", "html2canvas", "canvas"],
    loader: {
      ".png": "dataurl",
      ".jpg": "dataurl",
      ".jpeg": "dataurl",
      ".svg": "dataurl",
      ".css": "empty",
    },
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  });

  const serverModuleUrl = pathToFileURL(serverOutFile).href;
  const { render } = await import(serverModuleUrl);

  // Define All Static Routes to Pre-render
  const routes = [
    {
      path: "/",
      view: "home",
      title: "Gold Buyers Colombo (GBC) | Highest Cash Price for Gold in Sri Lanka",
      description: "Sell your gold jewelry, diamonds, gemstones, and luxury watches for the highest cash payout in Colombo, Sri Lanka at GBC. 100% transparent computerized XRF testing, certified digital scales, and instant cash.",
      keywords: "gold buyer in colombo, gold price today colombo, sell gold sri lanka, highest gold price colombo, 22k gold rate colombo, pawning gold colombo, gbc gold buyers, colombo gold merchants",
      canonical: `${BASE_URL}/`,
      type: "website",
      image: `${BASE_URL}/gbc-logo-original.png`,
    },
    {
      path: "/about",
      view: "about",
      title: "About Us | Gold Buyers Colombo (GBC) - Sri Lanka's Most Trusted Gold Buyers",
      description: "Learn about GBC's commitment to absolute transparency, professional XRF verification, and buying gold, diamonds, gems, and luxury watches in Colombo, Sri Lanka.",
      keywords: "about gold buyers colombo, trusted gold assayers sri lanka, computer gold testing colombo, gbc history",
      canonical: `${BASE_URL}/about`,
      type: "website",
      image: `${BASE_URL}/gbc-logo-original.png`,
    },
    {
      path: "/contact",
      view: "contact",
      title: "Contact Us | GBC (Gold Buyers Colombo) - Branch Locations & Phone Numbers",
      description: "Contact GBC for instant valuations of gold, diamonds, gemstones, and luxury watches. Get directions to our secure Colombo branches today.",
      keywords: "contact gold buyers colombo, colombo gold buyer phone number, gbc branch address, find gold buyers colombo",
      canonical: `${BASE_URL}/contact`,
      type: "website",
      image: `${BASE_URL}/gbc-logo-original.png`,
    },
    {
      path: "/branches",
      view: "branches",
      title: "16 Branches in Colombo | GBC (Gold Buyers Colombo)",
      description: "Find one of our 16 buying branches in Colombo for gold, diamonds, gems, and watches. Secure, private locations in Dehiwala, Bambalapitiya, Kohuwala, Nugegoda, and more.",
      keywords: "gold buyer branches colombo, dehiwala gold buyer, kohuwala gold shop, bambalapitiya gold buyer",
      canonical: `${BASE_URL}/branches`,
      type: "website",
      image: `${BASE_URL}/gbc-logo-original.png`,
    },
    {
      path: "/services",
      view: "services",
      title: "Our Services | Gold Buyers Colombo (GBC)",
      description: "Explore our expert valuation and purchasing services for gold jewelry, pawned gold releases, diamonds, gemstones, and luxury watches.",
      keywords: "gold buying service, diamond buyer colombo, luxury watch buyer sri lanka, release pawned gold",
      canonical: `${BASE_URL}/services`,
      type: "website",
      image: `${BASE_URL}/gbc-logo-original.png`,
    },
    {
      path: "/rates",
      view: "rates",
      title: "Today's Live Gold Rates in Colombo | GBC (Gold Buyers Colombo)",
      description: "Check live daily buying prices for 24K, 22K (916), 21K, and 18K gold per gram in Sri Lanka Rupees (LKR) at Gold Buyers Colombo.",
      keywords: "24k gold rate colombo, 22k gold price sri lanka, 916 gold rate today, gold price per gram colombo",
      canonical: `${BASE_URL}/rates`,
      type: "website",
      image: `${BASE_URL}/gbc-logo-original.png`,
    },
    {
      path: "/calculator",
      view: "calculator",
      title: "Computerized Gold Value Calculator | GBC (Gold Buyers Colombo)",
      description: "Calculate your exact cash payout for gold jewelry in Colombo based on weight in grams or sovereigns (pavan) and karat purity.",
      keywords: "gold calculator colombo, gold payout calculator sri lanka, pavan to gram gold rate",
      canonical: `${BASE_URL}/calculator`,
      type: "website",
      image: `${BASE_URL}/gbc-logo-original.png`,
    },
    {
      path: "/faq",
      view: "faq",
      title: "Frequently Asked Questions | GBC (Gold Buyers Colombo)",
      description: "Find clear answers about gold testing, required IDs, payment methods, bank transfers, and pawned gold releases at Gold Buyers Colombo.",
      keywords: "gold selling faq sri lanka, what id needed to sell gold colombo, xrf gold testing safe",
      canonical: `${BASE_URL}/faq`,
      type: "website",
      image: `${BASE_URL}/gbc-logo-original.png`,
    },
    {
      path: "/blog",
      view: "blog",
      title: "Gold Market Insights & Selling Guides | Gold Buyers Colombo",
      description: "Expert guides, gold market analysis, pawn release instructions, and tips to avoid scams when selling gold in Colombo, Sri Lanka.",
      keywords: "gold selling guide colombo, sri lanka gold news, gold market analysis colombo",
      canonical: `${BASE_URL}/blog`,
      type: "website",
      image: `${BASE_URL}/gbc-logo-original.png`,
    },
  ];

  // Add Dynamic Blog Post Routes
  blogs.forEach((blog) => {
    if (blog && blog.slug) {
      routes.push({
        path: `/blog/${blog.slug}`,
        view: "blog",
        blogSlug: blog.slug,
        title: `${blog.title} | Gold Buyers Colombo`,
        description: blog.excerpt || blog.metaDescription || "Expert guide on selling gold, evaluating karats, and maximizing your cash returns in Colombo, Sri Lanka.",
        keywords: blog.tags ? blog.tags.join(", ") : "gold buyers colombo, sell gold sri lanka",
        canonical: `${BASE_URL}/blog/${blog.slug}`,
        type: "article",
        image: blog.coverImage || `${BASE_URL}/gbc-logo-original.png`,
        articleData: blog,
      });
    }
  });

  console.log(`[SSG] Total routes to pre-render: ${routes.length}`);

  let pagesRendered = 0;

  for (const r of routes) {
    try {
      // 1. Render React App string for route
      const appHtml = render({
        initialView: r.view,
        initialBlogSlug: r.blogSlug || null,
        initialBlogsData: blogs,
      });

      // 2. Build JSON-LD Schema
      let jsonLdScripts = "";

      if (r.articleData) {
        // Article Schema
        const articleSchema = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": r.articleData.title,
          "description": r.description,
          "image": r.image,
          "datePublished": r.articleData.date || "2026-06-30",
          "dateModified": r.articleData.lastUpdated || r.articleData.date || "2026-06-30",
          "author": {
            "@type": "Organization",
            "name": r.articleData.author || "Gold Buyers Colombo Technical Team",
            "url": BASE_URL,
          },
          "publisher": {
            "@type": "Organization",
            "name": "Gold Buyers Colombo (GBC)",
            "logo": {
              "@type": "ImageObject",
              "url": `${BASE_URL}/gbc-logo-original.png`,
            },
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": r.canonical,
          },
        };
        jsonLdScripts += `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>\n`;

        // Breadcrumb Schema
        const breadcrumbSchema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
            { "@type": "ListItem", "position": 3, "name": r.articleData.title, "item": r.canonical },
          ],
        };
        jsonLdScripts += `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>\n`;

        // FAQ Schema if questions exist
        if (Array.isArray(r.articleData.questions) && r.articleData.questions.length > 0) {
          const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": r.articleData.questions.map((q) => ({
              "@type": "Question",
              "name": q.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": q.answer,
              },
            })),
          };
          jsonLdScripts += `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>\n`;
        }
      } else {
        // Organization & LocalBusiness Schema for pages
        const orgSchema = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Gold Buyers Colombo (GBC)",
          "image": `${BASE_URL}/gbc-logo-original.png`,
          "@id": BASE_URL,
          "url": BASE_URL,
          "telephone": "+94718321321",
          "email": "Goldbuyerscolombolk@gmail.com",
          "priceRange": "$$$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "68 S. De S. Jayasinghe Mawatha",
            "addressLocality": "Nugegoda",
            "postalCode": "10250",
            "addressCountry": "LK",
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 6.9271,
            "longitude": 79.8612,
          },
        };
        jsonLdScripts += `<script type="application/ld+json">${JSON.stringify(orgSchema)}</script>\n`;
      }

      // 3. Construct HTML document by replacing tags in cleanTemplate
      let html = cleanTemplate;

      // Replace Title
      html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(r.title)}</title>`);

      // Replace Meta Description
      const metaDescTag = `<meta name="description" content="${escapeHtml(r.description)}" />`;
      if (html.includes('<meta name="description"')) {
        html = html.replace(/<meta name="description".*?>/s, metaDescTag);
      } else {
        html = html.replace("</head>", `  ${metaDescTag}\n</head>`);
      }

      // Replace Keywords
      const metaKeywordsTag = `<meta name="keywords" content="${escapeHtml(r.keywords)}" />`;
      if (html.includes('<meta name="keywords"')) {
        html = html.replace(/<meta name="keywords".*?>/s, metaKeywordsTag);
      } else {
        html = html.replace("</head>", `  ${metaKeywordsTag}\n</head>`);
      }

      // Inject Canonical Link
      const canonicalTag = `<link rel="canonical" href="${r.canonical}" />`;
      if (html.includes('<link rel="canonical"')) {
        html = html.replace(/<link rel="canonical".*?>/s, canonicalTag);
      } else {
        html = html.replace("</head>", `  ${canonicalTag}\n</head>`);
      }

      // Open Graph Meta Tags
      const ogMeta = `
    <meta property="og:title" content="${escapeHtml(r.title)}" />
    <meta property="og:description" content="${escapeHtml(r.description)}" />
    <meta property="og:url" content="${r.canonical}" />
    <meta property="og:type" content="${r.type}" />
    <meta property="og:image" content="${r.image}" />
    <meta property="og:site_name" content="Gold Buyers Colombo (GBC)" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(r.title)}" />
    <meta name="twitter:description" content="${escapeHtml(r.description)}" />
    <meta name="twitter:image" content="${r.image}" />
      `;

      html = html.replace("</head>", `${ogMeta}\n${jsonLdScripts}</head>`);

      // Inject rendered app HTML into root div
      html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      // 4. Output File Path
      let targetFile;
      if (r.path === "/") {
        targetFile = path.join(DIST_DIR, "index.html");
      } else {
        const subDir = path.join(DIST_DIR, r.path.substring(1));
        if (!fs.existsSync(subDir)) {
          fs.mkdirSync(subDir, { recursive: true });
        }
        targetFile = path.join(subDir, "index.html");
      }

      fs.writeFileSync(targetFile, html, "utf-8");
      pagesRendered++;
      console.log(`  ✓ Rendered HTML [${r.path}] -> ${path.relative(process.cwd(), targetFile)}`);
    } catch (err) {
      console.error(`  ✗ Error rendering route ${r.path}:`, err);
    }
  }

  // Clean up temporary server build directory
  try {
    fs.rmSync(serverBuildDir, { recursive: true, force: true });
  } catch (e) {
    // ignore
  }

  // Copy public files (robots.txt, llms.txt, sitemap.xml) to dist/
  const publicFiles = ["robots.txt", "llms.txt", "sitemap.xml", "favicon.ico", "manifest.json"];
  for (const file of publicFiles) {
    const src = path.join(PUBLIC_DIR, file);
    const dest = path.join(DIST_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`[SSG] Copied ${file} to dist/`);
    }
  }

  console.log(`\n===========================================`);
  console.log(`SSG Build Completed: ${pagesRendered} static HTML pages generated!`);
  console.log(`===========================================\n`);
}

buildSSG().catch((err) => {
  console.error("SSG Build Failed:", err);
  process.exit(1);
});
