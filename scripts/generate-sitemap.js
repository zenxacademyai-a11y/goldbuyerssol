import fs from "fs";
import path from "path";

const BASE_URL = "https://goldbuyerscolombo.com";
const PUBLIC_DIR = path.resolve("./public");
const DIST_DIR = path.resolve("./dist");

function generateSitemap() {
  console.log("Generating sitemap.xml dynamically...");

  const staticPages = [
    { loc: "", changefreq: "daily", priority: "1.0" },
    { loc: "/about", changefreq: "monthly", priority: "0.8" },
    { loc: "/contact", changefreq: "monthly", priority: "0.8" },
    { loc: "/branches", changefreq: "monthly", priority: "0.8" },
    { loc: "/rates", changefreq: "daily", priority: "0.9" },
    { loc: "/calculator", changefreq: "daily", priority: "0.9" },
    { loc: "/faq", changefreq: "monthly", priority: "0.7" },
    { loc: "/services", changefreq: "monthly", priority: "0.9" },
    { loc: "/blog", changefreq: "daily", priority: "0.9" },
  ];

  let blogUrls = [];

  // Try to read dynamic blogs from data/db.json
  const dbPath = path.resolve("./data/db.json");
  if (fs.existsSync(dbPath)) {
    try {
      const dbContent = fs.readFileSync(dbPath, "utf-8");
      const db = JSON.parse(dbContent);
      if (db && Array.isArray(db.blogs)) {
        console.log(`Found ${db.blogs.length} dynamic blog posts in db.json.`);
        blogUrls = db.blogs
          .filter(blog => blog && blog.slug)
          .map(blog => ({
            loc: `/blog/${blog.slug}`,
            lastmod: blog.date || new Date().toISOString().split("T")[0],
            changefreq: "weekly",
            priority: "0.8"
          }));
      }
    } catch (error) {
      console.error("Error reading db.json for sitemap generation:", error);
    }
  }

  // Fallback if no dynamic blogs found (just in case)
  if (blogUrls.length === 0) {
    const fallbackSlugs = [
      "10-best-gold-buyers-in-colombo-2026-guide",
      "8-top-places-to-sell-gold-in-colombo-for-the-best-price",
      "gold-buyer-vs-pawn-shop-in-sri-lanka-which-pays-more",
      "where-can-you-sell-gold-in-colombo-complete-local-guide",
      "gold-price-in-colombo-today-how-it-affects-selling-your-gold",
      "12-common-mistakes-to-avoid-when-selling-gold-in-sri-lanka",
      "cash-for-gold-in-colombo-everything-you-need-to-know",
      "used-jewellery-buyers-in-colombo-how-to-get-maximum-value",
      "how-to-choose-a-trusted-gold-buyer-in-colombo-2026-checklist",
      "gold-buyers-colombo-vs-jewellery-shops-which-offers-better-value"
    ];
    blogUrls = fallbackSlugs.map(slug => ({
      loc: `/blog/${slug}`,
      lastmod: "2026-06-30",
      changefreq: "weekly",
      priority: "0.8"
    }));
  }

  const currentDate = new Date().toISOString().split("T")[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static pages
  staticPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${page.loc}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  // Add dynamic blog pages
  blogUrls.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${page.loc}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  // Ensure public directory exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // Write to public/sitemap.xml
  const publicSitemapPath = path.join(PUBLIC_DIR, "sitemap.xml");
  fs.writeFileSync(publicSitemapPath, xml, "utf-8");
  console.log(`Successfully wrote to ${publicSitemapPath}`);

  // Write to dist/sitemap.xml (if dist exists)
  if (fs.existsSync(DIST_DIR)) {
    const distSitemapPath = path.join(DIST_DIR, "sitemap.xml");
    fs.writeFileSync(distSitemapPath, xml, "utf-8");
    console.log(`Successfully wrote to ${distSitemapPath}`);
  }
}

generateSitemap();
