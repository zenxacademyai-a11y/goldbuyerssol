/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import compression from "compression";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

import { readDb, writeDb, initializeDb } from "./server/db.js";
import { GoldKarat, GoldRate, Lead, BlogPost, SystemSettings } from "./src/types.js";

// Load environment variables
dotenv.config();

// Initialize Database
initializeDb();

// Initialize Google Gemini Client (Securely server-side)
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("Warning: GEMINI_API_KEY is not defined in the environment. AI Writing Assistant will be unavailable.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded body parsers
  // Compress all routes for faster loading
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // --- API ROUTES ---

  // 1. Health & Configuration Check
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      aiAvailable: ai !== null,
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Fetch Gold Rates (returns array)
  app.get("/api/rates", (req: Request, res: Response) => {
    try {
      const db = readDb();
      res.json(db.rates);
    } catch (error) {
      console.error("Error reading gold rates:", error);
      res.status(500).json({ error: "Failed to read rates database" });
    }
  });

  // 2a. Fetch System Settings (returns object)
  app.get("/api/settings", (req: Request, res: Response) => {
    try {
      const db = readDb();
      res.json(db.settings);
    } catch (error) {
      console.error("Error reading settings:", error);
      res.status(500).json({ error: "Failed to read settings database" });
    }
  });

  // 2b. Fetch Historical Rates (returns array)
  app.get("/api/historical", (req: Request, res: Response) => {
    try {
      const db = readDb();
      res.json(db.historicalRates);
    } catch (error) {
      console.error("Error reading historical rates:", error);
      res.status(500).json({ error: "Failed to read historical rates database" });
    }
  });

  // 3. Update Gold Rates
  app.post("/api/rates", (req: Request, res: Response) => {
    try {
      const body = req.body;
      const db = readDb();

      let newRates: any[] = [];
      if (Array.isArray(body)) {
        newRates = body;
      } else if (body && Array.isArray(body.rates)) {
        newRates = body.rates;
      } else {
        return res.status(400).json({ error: "Invalid rates format. Expected array." });
      }

      db.rates = newRates;
      writeDb(db);

      res.json({
        success: true,
        rates: db.rates,
      });
    } catch (error) {
      console.error("Error updating rates:", error);
      res.status(500).json({ error: "Failed to update rates" });
    }
  });

  // 3a. Update System Settings
  app.post("/api/settings", (req: Request, res: Response) => {
    try {
      const updatedSettings = req.body;
      if (!updatedSettings) {
        return res.status(400).json({ error: "Settings object required" });
      }
      const db = readDb();
      db.settings = {
        ...db.settings,
        ...updatedSettings,
        lastUpdated: new Date().toISOString(),
      };
      writeDb(db);
      res.json(db.settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // 4. Submit a Lead (Calculator / Contact Forms)
  app.post("/api/leads", (req: Request, res: Response) => {
    try {
      const { name, phone, email, goldKarat, weightGrams, estimatedValue, message } = req.body;

      if (!name || !phone) {
        return res.status(400).json({ error: "Name and Phone number are required" });
      }

      const db = readDb();
      const newLead: Lead = {
        id: "lead_" + Math.random().toString(36).substr(2, 9),
        name,
        phone,
        email,
        goldKarat: goldKarat || GoldKarat.K22,
        weightGrams: Number(weightGrams) || 0,
        estimatedValue: Number(estimatedValue) || 0,
        status: "New",
        message,
        createdAt: new Date().toISOString(),
      };

      db.leads.unshift(newLead);
      writeDb(db);

      res.status(201).json({ success: true, lead: newLead });
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ error: "Failed to submit lead" });
    }
  });

  // 5. Get Leads (Admin Only)
  app.get("/api/leads", (req: Request, res: Response) => {
    try {
      const db = readDb();
      res.json(db.leads);
    } catch (error) {
      console.error("Error reading leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // 6. Update Lead Status (Admin Only)
  app.post("/api/leads/:id/status", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const db = readDb();
      const leadIndex = db.leads.findIndex((l) => l.id === id);

      if (leadIndex === -1) {
        return res.status(404).json({ error: "Lead not found" });
      }

      db.leads[leadIndex].status = status;
      writeDb(db);

      res.json({ success: true, lead: db.leads[leadIndex] });
    } catch (error) {
      console.error("Error updating lead status:", error);
      res.status(500).json({ error: "Failed to update lead status" });
    }
  });

  // 7. Delete Lead (Admin Only)
  app.delete("/api/leads/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDb();
      const filteredLeads = db.leads.filter((l) => l.id !== id);

      if (db.leads.length === filteredLeads.length) {
        return res.status(404).json({ error: "Lead not found" });
      }

      db.leads = filteredLeads;
      writeDb(db);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  // 8. Fetch Blog Posts
  app.get("/api/blogs", (req: Request, res: Response) => {
    try {
      const db = readDb();
      // Regular users only see published blogs
      const publishedOnly = req.query.all !== "true";
      const blogs = publishedOnly ? db.blogs.filter((b) => b.isPublished) : db.blogs;
      res.json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  });

  // 9. Save / Edit Blog Post (Admin Only)
  app.post("/api/blogs", (req: Request, res: Response) => {
    try {
      const blogData: Partial<BlogPost> = req.body;
      const db = readDb();

      if (!blogData.title || !blogData.content) {
        return res.status(400).json({ error: "Title and Content are required" });
      }

      let savedBlog: BlogPost;

      if (blogData.id) {
        // Edit existing
        const blogIndex = db.blogs.findIndex((b) => b.id === blogData.id);
        if (blogIndex === -1) {
          return res.status(404).json({ error: "Blog post not found" });
        }
        savedBlog = {
          ...db.blogs[blogIndex],
          ...blogData,
          date: new Date().toISOString().split("T")[0], // Update to today
        } as BlogPost;
        db.blogs[blogIndex] = savedBlog;
      } else {
        // Create new
        const slug = blogData.slug || blogData.title.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        savedBlog = {
          id: "blog_" + Math.random().toString(36).substr(2, 9),
          slug,
          title: blogData.title,
          content: blogData.content,
          author: blogData.author || "GBC Editorial Board",
          date: new Date().toISOString().split("T")[0],
          category: blogData.category || "Selling Gold",
          tags: blogData.tags || [],
          metaTitle: blogData.metaTitle || `${blogData.title} | Gold Buyers Colombo`,
          metaDescription: blogData.metaDescription || blogData.title,
          isPublished: blogData.isPublished !== undefined ? blogData.isPublished : true,
          createdAt: new Date().toISOString(),
        };
        db.blogs.unshift(savedBlog);
      }

      writeDb(db);
      res.json({ success: true, blog: savedBlog });
    } catch (error) {
      console.error("Error saving blog post:", error);
      res.status(500).json({ error: "Failed to save blog post" });
    }
  });

  // 10. Delete Blog Post (Admin Only)
  app.delete("/api/blogs/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDb();
      const filteredBlogs = db.blogs.filter((b) => b.id !== id);

      if (db.blogs.length === filteredBlogs.length) {
        return res.status(404).json({ error: "Blog not found" });
      }

      db.blogs = filteredBlogs;
      writeDb(db);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ error: "Failed to delete blog" });
    }
  });

  // 11. AI Writing Assistant (Server-Side Secure Gemini)
  app.post("/api/ai/write", async (req: Request, res: Response) => {
    try {
      const { topic, category, tone } = req.body;

      if (!topic) {
        return res.status(400).json({ error: "Topic prompt is required" });
      }

      if (!ai) {
        return res.status(503).json({
          error: "Gemini AI is not configured. Please set GEMINI_API_KEY in secrets.",
        });
      }

      const prompt = `Write a professional, premium, high-converting SEO-friendly blog article in English for GBC (Gold Buyers Colombo), Sri Lanka.
Topic: ${topic}
Category: ${category || "Selling Gold"}
Tone: ${tone || "informative and premium, reflecting luxury and financial trust"}

The article must target the primary Colombo search market. Focus on positioning GBC as a Rolex/Cartier-level premium financial exchange offering complete transparency, computerized testing, and highest payout rates.

You must return your output ONLY as a JSON object of type Type.OBJECT with the exact structure:
- title: A compelling, clickable, SEO-friendly headline.
- content: Full article body in Markdown format with subheadings (H3/H4), bullet points, and high-quality details (approx 500-800 words). Do not include the title inside the body.
- metaTitle: A premium SEO title tag (under 60 characters).
- metaDescription: A compelling SEO meta description with CTAs (under 160 characters).
- tags: A JSON array of 4-5 relevant SEO tags.
- slug: A URL-safe slug generated from the title.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              metaTitle: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              slug: { type: Type.STRING },
            },
            required: ["title", "content", "metaTitle", "metaDescription", "tags", "slug"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No text content returned from Gemini");
      }

      const blogResult = JSON.parse(responseText.trim());
      res.json(blogResult);
    } catch (error) {
      console.error("Error in AI Writing Assistant:", error);
      res.status(500).json({
        error: "AI Generation failed. This could be due to invalid response parsing or Gemini quota limits.",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // 12. AI Writer endpoint directly used by Admin Dashboard
  app.post("/api/ai-writer", async (req: Request, res: Response) => {
    try {
      const { prompt: reqPrompt } = req.body;
      if (!reqPrompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (!ai) {
        return res.status(503).json({
          error: "Gemini AI is not configured. Please set GEMINI_API_KEY in secrets.",
        });
      }

      const prompt = `Write a professional, premium, high-converting SEO-friendly blog article in English for GBC (Gold Buyers Colombo), Sri Lanka.
Topic: ${reqPrompt}
Category: Selling Gold
Tone: informative and premium, reflecting luxury and financial trust

The article must target the primary Colombo search market. Focus on positioning GBC as a Rolex/Cartier-level premium financial exchange offering complete transparency, computerized testing, and highest payout rates.

You must return your output ONLY as a JSON object of type Type.OBJECT with the exact structure:
- title: A compelling, clickable, SEO-friendly headline.
- content: Full article body in semantic HTML format with subheadings (H2/H3/H4), bullet points/numbered lists, styled italic/bold/underlined text, and blockquotes for high-quality details (approx 500-800 words). Do not include the title inside the body. Do not use Markdown, return pure HTML tags.
- metaTitle: A premium SEO title tag (under 60 characters).
- metaDescription: A compelling SEO meta description with CTAs (under 160 characters).
- tags: A JSON array of 4-5 relevant SEO tags.
- slug: A URL-safe slug generated from the title.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              metaTitle: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              slug: { type: Type.STRING },
            },
            required: ["title", "content", "metaTitle", "metaDescription", "tags", "slug"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No text content returned from Gemini");
      }

      const blogResult = JSON.parse(responseText.trim());
      res.json(blogResult);
    } catch (error) {
      console.error("Error in /api/ai-writer endpoint:", error);
      res.status(500).json({
        error: "AI Generation failed.",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // --- DYNAMIC SITEMAP XML ENDPOINT ---
  app.get("/sitemap.xml", (req: Request, res: Response) => {
    try {
      const db = readDb();
      const host = req.headers.host || "goldbuyerscolombo.com";
      const protocol = req.secure || (req.headers["x-forwarded-proto"] === "https") ? "https" : "http";
      const baseUrl = `${protocol}://${host}`;
      const todayStr = new Date().toISOString().split("T")[0];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      // Main static pages
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/</loc>\n`;
      xml += `    <lastmod>${todayStr}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>1.0</priority>\n`;
      xml += `  </url>\n`;

      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/about</loc>\n`;
      xml += `    <lastmod>${todayStr}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;

      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/contact</loc>\n`;
      xml += `    <lastmod>${todayStr}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;

      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/branches</loc>\n`;
      xml += `    <lastmod>${todayStr}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;

      // Dynamic blog articles
      if (db.blogs && Array.isArray(db.blogs)) {
        db.blogs.forEach((blog: BlogPost) => {
          const lastModDate = blog.date || todayStr;
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}/blog/${blog.slug}</loc>\n`;
          xml += `    <lastmod>${lastModDate}</lastmod>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `    <priority>0.6</priority>\n`;
          xml += `  </url>\n`;
        });
      }

      xml += `</urlset>`;

      res.header("Content-Type", "application/xml");
      res.status(200).send(xml);
    } catch (e) {
      console.error("Error generating sitemap:", e);
      res.status(550).send("Error generating sitemap XML");
    }
  });

  // --- VITE MIDDLEWARE SETUP ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite Development Middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production Static files served from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[GBC FULL-STACK SERVER] Running at http://localhost:${PORT}`);
    console.log(`Targeting SEO keywords like 'Gold Buyer in Colombo' for Sri Lankan audience.`);
  });
}

startServer();
