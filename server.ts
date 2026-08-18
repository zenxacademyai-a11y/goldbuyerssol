/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import compression from "compression";
import { readDb, writeDb, initializeDb } from "./server/db.js";
import { GoldRate, SystemSettings, Lead, BlogPost } from "./src/types.js";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  initializeDb();

  // Standard Middlewares
  app.use(compression());
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Prevent ANY HTTP caching for API endpoints
  app.use("/api", (req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
  });

  // ==========================================
  // GOLD RATES API ENDPOINTS
  // ==========================================

  // GET /api/rates - Returns current live gold rates
  app.get("/api/rates", (req: Request, res: Response) => {
    try {
      const db = readDb();
      res.json(db.rates || []);
    } catch (err: any) {
      console.error("[API] Error fetching rates:", err);
      res.status(500).json({ error: "Failed to fetch gold rates" });
    }
  });

  // POST /api/rates - Saves updated gold rates to database and updates lastUpdated timestamp
  app.post("/api/rates", (req: Request, res: Response) => {
    try {
      const updatedRates: GoldRate[] = req.body;
      if (!Array.isArray(updatedRates) || updatedRates.length === 0) {
        return res.status(400).json({ error: "Invalid rates format. Expected non-empty array." });
      }

      const db = readDb();
      db.rates = updatedRates;

      // Update settings timestamp
      const nowIso = new Date().toISOString();
      if (!db.settings) {
        db.settings = {
          lastUpdated: nowIso,
          pavanWeightGrams: 8,
          bonusPremiumRate: 2.5,
          testingFeePerGram: 150,
        };
      } else {
        db.settings.lastUpdated = nowIso;
      }

      // Update historical rates with new 22K rate if available
      const rate22 = updatedRates.find((r) => r.karat === "22K")?.ratePerGram;
      if (rate22 && Array.isArray(db.historicalRates) && db.historicalRates.length > 0) {
        const lastIdx = db.historicalRates.length - 1;
        db.historicalRates[lastIdx] = {
          ...db.historicalRates[lastIdx],
          "22K": Math.round(rate22 * (db.settings.pavanWeightGrams || 8)),
        };
      }

      writeDb(db);
      console.log(`[API] Gold rates updated successfully at ${nowIso}`);

      res.json({
        success: true,
        message: "Gold rates updated successfully",
        rates: db.rates,
        settings: db.settings,
      });
    } catch (err: any) {
      console.error("[API] Error updating rates:", err);
      res.status(500).json({ error: "Failed to save gold rates to database" });
    }
  });

  // ==========================================
  // SYSTEM SETTINGS API ENDPOINTS
  // ==========================================

  // GET /api/settings - Returns current system settings
  app.get("/api/settings", (req: Request, res: Response) => {
    try {
      const db = readDb();
      res.json(db.settings || {
        lastUpdated: new Date().toISOString(),
        pavanWeightGrams: 8,
        bonusPremiumRate: 2.5,
        testingFeePerGram: 150,
      });
    } catch (err: any) {
      console.error("[API] Error fetching settings:", err);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // POST /api/settings - Saves updated system settings
  app.post("/api/settings", (req: Request, res: Response) => {
    try {
      const updatedSettings: Partial<SystemSettings> = req.body;
      const db = readDb();

      db.settings = {
        ...(db.settings || {
          pavanWeightGrams: 8,
          bonusPremiumRate: 2.5,
          testingFeePerGram: 150,
        }),
        ...updatedSettings,
        lastUpdated: new Date().toISOString(),
      };

      writeDb(db);
      res.json({
        success: true,
        message: "Settings updated successfully",
        settings: db.settings,
      });
    } catch (err: any) {
      console.error("[API] Error updating settings:", err);
      res.status(500).json({ error: "Failed to save settings" });
    }
  });

  // ==========================================
  // LEADS API ENDPOINTS
  // ==========================================

  app.get("/api/leads", (req: Request, res: Response) => {
    try {
      const db = readDb();
      res.json(db.leads || []);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.post("/api/leads", (req: Request, res: Response) => {
    try {
      const db = readDb();
      const newLead: Lead = {
        id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
        status: "New",
        ...req.body,
      };

      db.leads = [newLead, ...(db.leads || [])];
      writeDb(db);
      res.status(201).json({ success: true, lead: newLead });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to save lead" });
    }
  });

  app.delete("/api/leads/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDb();
      db.leads = (db.leads || []).filter((l) => l.id !== id);
      writeDb(db);
      res.json({ success: true, message: `Lead ${id} deleted` });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  // ==========================================
  // BLOGS API ENDPOINTS
  // ==========================================

  app.get("/api/blogs", (req: Request, res: Response) => {
    try {
      const db = readDb();
      res.json(db.blogs || []);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  });

  app.post("/api/blogs", (req: Request, res: Response) => {
    try {
      const blogData = req.body;
      const db = readDb();

      if (!db.blogs) db.blogs = [];

      if (blogData.id) {
        // Update existing
        const index = db.blogs.findIndex((b) => b.id === blogData.id);
        if (index !== -1) {
          db.blogs[index] = { ...db.blogs[index], ...blogData, updatedAt: new Date().toISOString() };
        } else {
          db.blogs.unshift({ ...blogData, createdAt: new Date().toISOString() });
        }
      } else {
        // Create new
        const newPost: BlogPost = {
          id: `blog_${Date.now()}`,
          slug: blogData.slug || `post-${Date.now()}`,
          title: blogData.title || "Untitled Post",
          content: blogData.content || "",
          author: blogData.author || "Samantha Alwis (Chief Valuation Officer, GBC)",
          date: blogData.date || new Date().toISOString().split("T")[0],
          category: blogData.category || "Selling Gold",
          tags: Array.isArray(blogData.tags) ? blogData.tags : (blogData.tags ? blogData.tags.split(",").map((s: string) => s.trim()) : ["Gold Buyers", "Colombo"]),
          metaTitle: blogData.metaTitle || blogData.title,
          metaDescription: blogData.metaDescription || (blogData.content ? blogData.content.replace(/<[^>]*>?/gm, "").substring(0, 160) : ""),
          questions: blogData.questions || [],
          isPublished: blogData.isPublished !== undefined ? blogData.isPublished : true,
          createdAt: new Date().toISOString(),
        };
        db.blogs.unshift(newPost);
      }

      writeDb(db);
      res.json({ success: true, blogs: db.blogs });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to save blog post" });
    }
  });

  app.delete("/api/blogs/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDb();
      db.blogs = (db.blogs || []).filter((b) => b.id !== id);
      writeDb(db);
      res.json({ success: true, message: `Blog ${id} deleted` });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // ==========================================
  // HISTORICAL RATES API ENDPOINTS
  // ==========================================

  app.get("/api/historical", (req: Request, res: Response) => {
    try {
      const db = readDb();
      res.json(db.historicalRates || []);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch historical rates" });
    }
  });

  // ==========================================
  // AI WRITER GEMINI ENDPOINT
  // ==========================================

  app.post("/api/ai-writer", async (req: Request, res: Response) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback generator when key is not configured
        return res.json({
          title: "Gold Selling & Valuation Insights for Colombo (2026)",
          content: `<p class="lead">Navigating the gold market in Sri Lanka requires an understanding of metallurgical purity, certified weighing, and real-time market spot prices.</p><h2>Understanding Your Gold's Value</h2><p>At Gold Buyers Colombo (<a href="#about">GBC</a>), we provide transparent valuation utilizing advanced non-destructive XRF technology. Check our <a href="#rates">Live Gold Rates</a> and compute your instant payout with our <a href="#calculator">Gold Value Calculator</a>.</p><p>For further financial guidance, consult the <a href="https://www.cbsl.gov.lk" target="_blank" rel="noopener noreferrer">Central Bank of Sri Lanka</a> or visit our <a href="#contact">Colombo Valuation Center</a>.</p>`,
          category: "Selling Gold",
          tags: ["Gold Buyers", "Colombo Guide", "Live Rates", "GBC"],
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "";
      res.json({
        title: "Gold Valuation & Price Analysis (GBC Colombo)",
        content: text,
        category: "Selling Gold",
        tags: ["Gold Price", "Colombo", "XRF Testing", "GBC"],
      });
    } catch (err: any) {
      console.error("[API] AI Writer error:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI article" });
    }
  });

  // ==========================================
  // VITE OR STATIC FILE SERVING
  // ==========================================

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Gold Buyers Colombo full-stack app running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Server] Fatal server startup error:", err);
  process.exit(1);
});
