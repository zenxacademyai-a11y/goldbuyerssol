/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Gold Buyers Colombo (GBC) - Static Site Generator (SSG) Pre-render Engine
 * Generates crawlable, static HTML files for every route, service, and branch hub
 * with full section text content, tailored meta tags, and Schema.org structured data.
 */

import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App.js';
import { branchesData } from '../src/components/BranchesPage.js';
import { servicesData } from '../src/components/ServicesPage.js';

interface PageRouteConfig {
  path: string;
  view: "home" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "services" | "sitemap";
  serviceId?: string;
  branchId?: string;
  title: string;
  description: string;
  keywords: string;
  schemaType?: string;
  breadcrumbs: { name: string; item: string }[];
}

const DOMAIN = "https://goldbuyerscolombo.com";

// Base organization & physical headquarters schema
const BASE_LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["FinancialService", "LocalBusiness"],
  "name": "Gold Buyers Colombo (GBC)",
  "alternateName": "GBC Precious Metals Sri Lanka",
  "url": DOMAIN,
  "logo": `${DOMAIN}/assest/gbc-logo.png`,
  "image": `${DOMAIN}/assest/gbc-logo.png`,
  "telephone": "+94718321321",
  "email": "Goldbuyerscolombolk@gmail.com",
  "priceRange": "$$$$",
  "currenciesAccepted": "LKR",
  "paymentAccepted": "Cash, Instant Bank Transfer",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "68 S. De S. Jayasinghe Mawatha",
    "addressLocality": "Nugegoda",
    "addressRegion": "Western Province",
    "postalCode": "10250",
    "addressCountry": "LK"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 6.8649,
    "longitude": 79.8997
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "3542",
    "bestRating": "5",
    "worstRating": "1"
  }
};

// 1. Core Primary Routes Configuration
const coreRoutes: PageRouteConfig[] = [
  {
    path: "/",
    view: "home",
    title: "Gold Buyers Colombo (GBC) | Highest Cash Price for Gold in Sri Lanka",
    description: "Sell your gold jewelry for the highest cash payout in Colombo, Sri Lanka at GBC. 100% transparent computerized XRF testing, certified digital scales, and instant cash.",
    keywords: "gold buyer in colombo, gold price today colombo, sell gold sri lanka, highest gold price colombo, 22k gold rate colombo, pawning gold colombo, gbc gold buyers, colombo gold merchants",
    schemaType: "FinancialService",
    breadcrumbs: [{ name: "Home", item: DOMAIN }]
  },
  {
    path: "/about",
    view: "about",
    title: "About Us | Gold Buyers Colombo (GBC) Certified Precious Metal Assayers",
    description: "Learn about GBC, Sri Lanka's leading modern gold buyer. Established corporate security, Thermo Fisher Scientific XRF technology, zero melting deductions, and fair valuation.",
    keywords: "about gold buyers colombo, certified gold assayers sri lanka, xrf gold testing colombo, legitimate gold merchant sri lanka, gold testing laboratory colombo",
    schemaType: "AboutPage",
    breadcrumbs: [
      { name: "Home", item: DOMAIN },
      { name: "About Us", item: `${DOMAIN}/about` }
    ]
  },
  {
    path: "/contact",
    view: "contact",
    title: "Contact & Head Office VIP Lounge | Gold Buyers Colombo (GBC)",
    description: "Contact GBC or visit our secure corporate headquarters in Nugegoda. Hotline: 0718 321 321. Private VIP appraisal lounges, doorstep valuations, and commercial bank transfers.",
    keywords: "contact gold buyers colombo, gold valuation appointment colombo, nugegoda gold buyer address, gbc hotline, sell gold contact sri lanka",
    schemaType: "ContactPage",
    breadcrumbs: [
      { name: "Home", item: DOMAIN },
      { name: "Contact", item: `${DOMAIN}/contact` }
    ]
  },
  {
    path: "/branches",
    view: "branches",
    title: "16 Colombo Branch Appraisal Lounges | Gold Buyers Colombo (GBC)",
    description: "Explore 16 physical GBC branch offices across Colombo: Nugegoda, Wellawatte, Bambalapitiya, Kollupitiya, Dehiwala, Pettah, Negombo, Kandy, and more. Certified computerized testing.",
    keywords: "gold buyer branches colombo, sell gold wellawatte, gold appraisal bambalapitiya, sell gold negombo, gold merchant kandy, gbc branch locations",
    schemaType: "CollectionPage",
    breadcrumbs: [
      { name: "Home", item: DOMAIN },
      { name: "Branches", item: `${DOMAIN}/branches` }
    ]
  },
  {
    path: "/rates",
    view: "rates",
    title: "Live Gold Rates Today Sri Lanka (24K, 22K, 21K, 18K) | GBC",
    description: "Live daily gold buying rates in Sri Lanka per gram and sovereign. Verified pricing for 24K pure gold, 22K sovereign (916), 21K, and 18K jewelry with zero hidden deductions.",
    keywords: "gold price today sri lanka, 22k gold rate colombo today, 24k gold price per gram sri lanka, sovereign price colombo, live gold rate lkr, gold price chart sri lanka",
    schemaType: "FinancialProduct",
    breadcrumbs: [
      { name: "Home", item: DOMAIN },
      { name: "Live Gold Rates", item: `${DOMAIN}/rates` }
    ]
  },
  {
    path: "/calculator",
    view: "calculator",
    title: "Computerized Gold Cash Payout Calculator Sri Lanka | GBC",
    description: "Calculate your instant cash payout for gold jewelry, sovereigns (pavan), and bullion bars in Colombo. Transparent calculations with zero weight rounding and live market bonuses.",
    keywords: "gold calculator sri lanka, gold sovereign value calculator lkr, calculate gold selling price colombo, 22k gold calculator, pavan price calculator sri lanka",
    schemaType: "WebApplication",
    breadcrumbs: [
      { name: "Home", item: DOMAIN },
      { name: "Gold Calculator", item: `${DOMAIN}/calculator` }
    ]
  },
  {
    path: "/services",
    view: "services",
    title: "Certified Gold & Luxury Asset Appraisal Services | GBC",
    description: "Comprehensive appraisal and liquidation services for gold jewelry (22K, 24K, 18K), investment sovereigns, hallmark bullion bars, luxury solid gold watches, and scrap gold.",
    keywords: "gold buying services colombo, sell gold jewelry sri lanka, cash for gold sovereigns colombo, luxury watch buyers colombo, sell scrap gold sri lanka",
    schemaType: "Service",
    breadcrumbs: [
      { name: "Home", item: DOMAIN },
      { name: "Services", item: `${DOMAIN}/services` }
    ]
  },
  {
    path: "/sitemap",
    view: "sitemap",
    title: "HTML Sitemap & Architecture | Gold Buyers Colombo (GBC)",
    description: "Complete directory of gold appraisal services, 16 Colombo branch appraisal centers, all Sri Lanka serviced locations, calculators, and customer resources.",
    keywords: "gold buyers colombo sitemap, gbc site architecture, sri lanka gold branches directory, precious metal appraisal index",
    schemaType: "WebPage",
    breadcrumbs: [
      { name: "Home", item: DOMAIN },
      { name: "Sitemap", item: `${DOMAIN}/sitemap` }
    ]
  },
  {
    path: "/faq",
    view: "services",
    title: "Frequently Asked Questions (FAQ) | Gold Buyers Colombo (GBC)",
    description: "Got questions about selling gold in Colombo? Find expert answers on computerized XRF spectrometry, karat pricing formulas, instant payouts, and private lounges.",
    keywords: "gold buyer faq colombo, how to sell gold colombo questions, gold purity testing questions sri lanka, gold selling process faq",
    schemaType: "FAQPage",
    breadcrumbs: [
      { name: "Home", item: DOMAIN },
      { name: "FAQ", item: `${DOMAIN}/faq` }
    ]
  }
];

// 2. Build Service Detail Routes Configuration
const serviceRoutes: PageRouteConfig[] = servicesData.map(service => ({
  path: `/services/${service.id}`,
  view: "services" as const,
  serviceId: service.id,
  title: `${service.title} in Colombo, Sri Lanka | GBC`,
  description: `Get the highest payout for ${service.title.toLowerCase()} in Colombo. ${service.subtitle.slice(0, 120)}... Instant computerized testing and cash settlement.`,
  keywords: `${service.title.toLowerCase()}, sell ${service.title.toLowerCase()} colombo, cash for ${service.title.toLowerCase()} sri lanka, highest price ${service.id}`,
  schemaType: "Service",
  breadcrumbs: [
    { name: "Home", item: DOMAIN },
    { name: "Services", item: `${DOMAIN}/services` },
    { name: service.title, item: `${DOMAIN}/services/${service.id}` }
  ]
}));

// 3. Build Branch Detail Routes Configuration (16 Physical Appraisal Lounges)
const branchRoutes: PageRouteConfig[] = branchesData.map(branch => ({
  path: `/branches/${branch.id}`,
  view: "branches" as const,
  branchId: branch.id,
  title: `${branch.name.en} Gold Buyer Office | Gold Buyers Colombo (GBC)`,
  description: `Visit our ${branch.name.en} branch at ${branch.address.en}. Phone: ${branch.phone}. Non-destructive XRF testing, private VIP valuation lounges, and instant bank transfers.`,
  keywords: `gold buyer ${branch.name.en.toLowerCase()}, sell gold ${branch.name.en.toLowerCase()}, gold appraisal ${branch.landmark || branch.name.en}, gbc ${branch.id}`,
  schemaType: "LocalBusiness",
  breadcrumbs: [
    { name: "Home", item: DOMAIN },
    { name: "Branches", item: `${DOMAIN}/branches` },
    { name: branch.name.en, item: `${DOMAIN}/branches/${branch.id}` }
  ]
}));

const allRoutes: PageRouteConfig[] = [
  ...coreRoutes,
  ...serviceRoutes,
  ...branchRoutes
];

/**
 * Generate Schema.org JSON-LD for a route
 */
function generateStructuredData(route: PageRouteConfig) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": route.breadcrumbs.map((b, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": b.name,
      "item": b.item
    }))
  };

  const schemas: any[] = [breadcrumbSchema];

  if (route.branchId) {
    const branch = branchesData.find(b => b.id === route.branchId);
    if (branch) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": `Gold Buyers Colombo - ${branch.name.en}`,
        "url": `${DOMAIN}/branches/${branch.id}`,
        "telephone": branch.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": branch.address.en,
          "addressLocality": "Colombo",
          "addressCountry": "LK"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": branch.lat,
          "longitude": branch.lng
        },
        "openingHours": branch.hours || "Mo-Sa 09:00-18:00",
        "priceRange": "$$$$"
      });
    }
  } else if (route.serviceId) {
    const service = servicesData.find(s => s.id === route.serviceId);
    if (service) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.title,
        "serviceType": "Precious Metal Appraisal & Liquidation",
        "provider": {
          "@type": "FinancialService",
          "name": "Gold Buyers Colombo (GBC)"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Sri Lanka"
        },
        "description": service.subtitle || service.desc
      });
    }
  } else if (route.schemaType === "FAQPage" || route.view === "home") {
    const homeFaqEntities = [
      {
        "@type": "Question",
        "name": "Who is a trusted place to sell gold in Colombo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GBC is a recognized and trusted name in Colombo, Sri Lanka, with more than 50 years of experience. GBC provides transparent gold evaluations, competitive market-based rates, professional service, and a convenient selling experience for customers looking to sell their gold."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I get a good price for my gold?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GBC provides competitive gold-buying rates in Colombo, Sri Lanka, based on factors such as purity, weight, and current market conditions. With decades of experience, GBC focuses on transparent assessments and professional service when customers choose to sell their gold."
        }
      },
      {
        "@type": "Question",
        "name": "Why do customers choose GBC for selling gold?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In Colombo, Sri Lanka, GBC combines 50+ years of experience with transparent valuations, competitive rates, and professional customer care. GBC aims to make the process of selling gold simple, clear, and convenient while helping customers understand the value of their items."
        }
      },
      {
        "@type": "Question",
        "name": "How can I check today's gold price before selling?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Customers in Colombo, Sri Lanka can contact GBC to check the latest applicable gold-buying rate before selling. Gold prices can change with market conditions, while GBC considers purity, weight, and other relevant factors when professionally assessing each gold item."
        }
      },
      {
        "@type": "Question",
        "name": "Is GBC an established gold-buying company?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GBC is an established gold-buying business serving customers in Colombo, Sri Lanka, with more than 50 years of experience. GBC focuses on professional assessment, transparent transactions, competitive valuations, and customer service for people looking to sell gold and other valuable items."
        }
      },
      {
        "@type": "Question",
        "name": "How is the value of my jewellery determined?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GBC assesses jewellery in Colombo, Sri Lanka, by considering important factors such as gold purity, weight, item characteristics, and prevailing market conditions. The professional evaluation helps customers understand the value of their jewellery clearly before deciding whether to proceed with the transaction."
        }
      },
      {
        "@type": "Question",
        "name": "What gold jewellery and items can I sell?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GBC buys various gold items in Colombo, Sri Lanka, including jewellery, ornaments, coins, and other gold articles. Each item is individually assessed according to its purity, weight, and relevant market factors to determine its applicable buying value."
        }
      },
      {
        "@type": "Question",
        "name": "How quickly can I receive payment after selling gold?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GBC provides a convenient gold-selling service in Colombo, Sri Lanka. After the item has been assessed and the transaction terms are agreed, payment can be made promptly, helping customers complete their gold-selling process efficiently and with greater convenience."
        }
      },
      {
        "@type": "Question",
        "name": "Can I sell diamonds, gemstones, or luxury watches?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GBC also provides buying services for diamonds, gemstones, and luxury watches in Colombo, Sri Lanka. These valuable items can be professionally assessed according to their individual characteristics and relevant market considerations, giving customers a convenient option for selling different types of valuables."
        }
      },
      {
        "@type": "Question",
        "name": "Why is GBC recognized among established gold-buying businesses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "With more than 50 years of experience, GBC provides trusted gold-buying services in Colombo, Sri Lanka. GBC focuses on transparent evaluations, competitive market-based pricing, professional customer care, and convenient transactions for customers looking to sell gold and valuable items."
        }
      }
    ];

    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": homeFaqEntities
    });
    schemas.push(BASE_LOCAL_BUSINESS_SCHEMA);
  } else {
    schemas.push(BASE_LOCAL_BUSINESS_SCHEMA);
  }

  return JSON.stringify(schemas);
}

/**
 * Main SSG Build Function
 */
export async function runPrerender() {
  console.log("==========================================================");
  console.log("  Gold Buyers Colombo (GBC) - SSG Pre-render Generator    ");
  console.log("==========================================================");

  const distDir = path.resolve(process.cwd(), "dist");
  const templatePath = path.join(distDir, "index.html");

  if (!fs.existsSync(templatePath)) {
    console.error(`[ERROR] Template file not found: ${templatePath}`);
    console.error("Please run 'vite build' first before executing SSG pre-render.");
    process.exit(1);
  }

  const rawTemplate = fs.readFileSync(templatePath, "utf-8");
  console.log(`[OK] Loaded master HTML template: ${templatePath} (${rawTemplate.length} bytes)`);
  console.log(`[INFO] Preparing to pre-render ${allRoutes.length} static HTML pages...\n`);

  const manifest: Array<{ route: string; file: string; bytes: number; title: string }> = [];

  for (const route of allRoutes) {
    const canonicalUrl = `${DOMAIN}${route.path === "/" ? "" : route.path}`;

    // 1. Render App component to full HTML string
    let appHtml = "";
    try {
      appHtml = renderToString(
        React.createElement(App, {
          initialView: route.view,
          initialServiceId: route.serviceId || null,
          initialBranchId: route.branchId || null
        })
      );
    } catch (renderError) {
      console.error(`[FAIL] Render failed for ${route.path}:`, renderError);
      continue;
    }

    // 2. Prepare tailored SEO head elements
    const structuredDataJson = generateStructuredData(route);

    let html = rawTemplate;

    // Replace Title
    html = html.replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title>${route.title}</title>`
    );

    // Replace Meta Description
    html = html.replace(
      /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta name="description" content="${route.description}" />`
    );

    // Replace Meta Keywords
    html = html.replace(
      /<meta\s+name="keywords"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta name="keywords" content="${route.keywords}" />`
    );

    // Replace or Inject Canonical URL
    if (html.includes('<link rel="canonical"')) {
      html = html.replace(
        /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i,
        `<link rel="canonical" href="${canonicalUrl}" />`
      );
    } else {
      html = html.replace(
        "</head>",
        `  <link rel="canonical" href="${canonicalUrl}" />\n  </head>`
      );
    }

    // Replace OpenGraph Title & Description
    html = html.replace(
      /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta property="og:title" content="${route.title}" />`
    );
    html = html.replace(
      /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta property="og:description" content="${route.description}" />`
    );

    // Inject og:url if not present
    if (!html.includes('property="og:url"')) {
      html = html.replace(
        "</head>",
        `  <meta property="og:url" content="${canonicalUrl}" />\n  </head>`
      );
    } else {
      html = html.replace(
        /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta property="og:url" content="${canonicalUrl}" />`
      );
    }

    // Replace Twitter Title & Description
    if (html.includes('name="twitter:title"')) {
      html = html.replace(
        /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta name="twitter:title" content="${route.title}" />`
      );
    } else {
      html = html.replace(
        "</head>",
        `  <meta name="twitter:title" content="${route.title}" />\n  </head>`
      );
    }

    if (html.includes('name="twitter:description"')) {
      html = html.replace(
        /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta name="twitter:description" content="${route.description}" />`
      );
    } else {
      html = html.replace(
        "</head>",
        `  <meta name="twitter:description" content="${route.description}" />\n  </head>`
      );
    }

    // Inject Schema.org JSON-LD
    const schemaScriptTag = `\n    <script type="application/ld+json">\n    ${structuredDataJson}\n    </script>\n  `;
    html = html.replace("</head>", `${schemaScriptTag}</head>`);

    // Inject pre-rendered application HTML into <div id="root">
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    // 3. Write file to destination directory
    let targetFilePath = "";
    if (route.path === "/") {
      targetFilePath = path.join(distDir, "index.html");
    } else {
      const cleanSubDir = route.path.replace(/^\//, "");
      const outputDir = path.join(distDir, cleanSubDir);
      fs.mkdirSync(outputDir, { recursive: true });
      targetFilePath = path.join(outputDir, "index.html");
    }

    fs.writeFileSync(targetFilePath, html, "utf-8");
    const stat = fs.statSync(targetFilePath);

    manifest.push({
      route: route.path,
      file: path.relative(distDir, targetFilePath),
      bytes: stat.size,
      title: route.title
    });

    console.log(`[SSG GENERATED] ${route.path.padEnd(35)} -> ${path.relative(distDir, targetFilePath).padEnd(30)} (${Math.round(stat.size / 1024)} KB)`);
  }

  // Ensure 404.html, sitemap.xml, and robots.txt are placed in dist
  const publicDir = path.resolve(process.cwd(), "public");
  const staticFilesToSync = ["404.html", "sitemap.xml", "robots.txt"];
  for (const staticFile of staticFilesToSync) {
    const srcFile = path.join(publicDir, staticFile);
    const destFile = path.join(distDir, staticFile);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`[SYNCED] public/${staticFile} -> dist/${staticFile}`);
    }
  }

  // Write SSG manifest for verification & audits
  const manifestPath = path.join(distDir, "ssg-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    domain: DOMAIN,
    totalPages: manifest.length,
    pages: manifest
  }, null, 2), "utf-8");

  console.log("\n==========================================================");
  console.log(`  SSG Build Complete: Successfully pre-rendered ${manifest.length} pages!`);
  console.log(`  Manifest saved to: ${manifestPath}`);
  console.log("==========================================================");
}

// Execute when called directly
runPrerender().catch((err) => {
  console.error("[FATAL SSG ERROR]", err);
  process.exit(1);
});
