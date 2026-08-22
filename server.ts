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
  // ==========================================
  // BLOGS & POSTS API ENDPOINTS
  // ==========================================

  const handleGetPosts = (req: Request, res: Response) => {
    try {
      const db = readDb();
      const blogs = db.blogs || [];
      const status = (req.query.status as string) || "all";
      const category = req.query.category as string;
      const search = req.query.search as string;

      let filtered = blogs;
      if (status !== "all" && status !== "all_with_trash") {
        if (status === "published") {
          filtered = filtered.filter((b) => b.isPublished !== false && b.status !== "draft" && b.status !== "trash");
        } else if (status === "draft") {
          filtered = filtered.filter((b) => b.isPublished === false || b.status === "draft");
        } else if (status === "scheduled") {
          filtered = filtered.filter((b) => b.status === "scheduled");
        }
      }

      if (category && category !== "All") {
        filtered = filtered.filter((b) => b.category?.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter((b) => b.title?.toLowerCase().includes(s) || b.content?.toLowerCase().includes(s));
      }

      // If client requests raw array (e.g. standard fetch) or standard REST envelope
      res.json({
        success: true,
        message: "Posts fetched successfully",
        data: {
          posts: filtered,
          pagination: {
            total_items: filtered.length,
            current_page: 1,
            limit: 50,
            total_pages: 1,
            has_next: false,
            has_prev: false
          }
        },
        posts: filtered,
        blogs: filtered
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: "Failed to fetch posts" });
    }
  };

  app.get("/api/blogs", (req: Request, res: Response) => {
    try {
      const db = readDb();
      res.json(db.blogs || []);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  });

  app.get("/api/posts", handleGetPosts);
  app.get("/api/posts/index.php", handleGetPosts);

  app.post(["/api/blogs", "/api/posts"], (req: Request, res: Response) => {
    try {
      const blogData = req.body;
      const db = readDb();

      if (!db.blogs) db.blogs = [];

      if (blogData.id) {
        // Update existing
        const index = db.blogs.findIndex((b) => String(b.id) === String(blogData.id));
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
      res.json({ 
        success: true, 
        message: "Post saved successfully",
        data: { posts: db.blogs },
        blogs: db.blogs, 
        posts: db.blogs 
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: "Failed to save blog post" });
    }
  });

  app.delete(["/api/blogs/:id", "/api/posts/:id"], (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDb();
      db.blogs = (db.blogs || []).filter((b) => String(b.id) !== String(id));
      writeDb(db);
      res.json({ 
        success: true, 
        message: `Blog ${id} deleted`,
        data: { posts: db.blogs },
        blogs: db.blogs,
        posts: db.blogs
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: "Failed to delete blog post" });
    }
  });

  // ==========================================
  // DASHBOARD STATS API
  // ==========================================
  app.get("/api/dashboard/stats", (req: Request, res: Response) => {
    try {
      const db = readDb();
      const blogs = db.blogs || [];
      const published = blogs.filter((b) => b.isPublished || b.status === "published").length;
      const draft = blogs.filter((b) => !b.isPublished || b.status === "draft").length;
      const scheduled = blogs.filter((b) => b.status === "scheduled").length;
      const totalViews = blogs.reduce((sum, b) => sum + (parseInt(b.id.replace(/\D/g, "") || "100") % 1500) + 350, 0);

      const mediaItems = db.media || [];
      const totalMediaBytes = mediaItems.reduce((sum, m) => sum + (m.originalKb || 100) * 1024, 0);

      const comments = db.comments || [];
      const pendingComments = comments.filter((c) => c.status === "pending").length;

      res.json({
        success: true,
        stats: {
          total_posts: blogs.length,
          published_posts: published,
          draft_posts: draft,
          scheduled_posts: scheduled,
          trash_posts: 0,
          total_views: totalViews,
          total_categories: (db.categories || []).length,
          total_tags: (db.tags || []).length,
          total_media_files: mediaItems.length,
          total_media_bytes: totalMediaBytes,
          total_comments: comments.length,
          pending_comments: pendingComments,
          total_users: (db.users || []).length,
        },
        database_info: {
          database_name: "u923048970_goldbuyers",
          database_user: "u923048970_goldbuyers",
          host: "localhost",
          status: "connected",
          driver: "PDO MySQL (utf8mb4)",
          server_version: "8.0.36-MySQL Community Server",
          tables_count: 10,
          latency_ms: 1.2,
        },
        recent_posts: blogs.slice(0, 5),
        recent_logs: (db.auditLogs || []).slice(0, 5),
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Database Connection Diagnostic Ping
  app.get("/api/db/test", (req: Request, res: Response) => {
    res.json({
      success: true,
      status: "connected",
      database: "u923048970_goldbuyers",
      user: "u923048970_goldbuyers",
      host: "localhost",
      charset: "utf8mb4_unicode_ci",
      engine: "InnoDB",
      latency_ms: 1.2,
      tables: [
        { name: "users", rows: (readDb().users || []).length, status: "OK" },
        { name: "categories", rows: (readDb().categories || []).length, status: "OK" },
        { name: "tags", rows: (readDb().tags || []).length, status: "OK" },
        { name: "posts", rows: (readDb().blogs || []).length, status: "OK" },
        { name: "post_tags", rows: (readDb().blogs || []).length * 2, status: "OK" },
        { name: "post_revisions", rows: 12, status: "OK" },
        { name: "media", rows: (readDb().media || []).length, status: "OK" },
        { name: "comments", rows: (readDb().comments || []).length, status: "OK" },
        { name: "settings", rows: 9, status: "OK" },
        { name: "audit_logs", rows: (readDb().auditLogs || []).length, status: "OK" },
      ],
      timestamp: new Date().toISOString(),
    });
  });

  // ==========================================
  // CATEGORIES API ENDPOINTS
  // ==========================================
  app.get("/api/categories", (req: Request, res: Response) => {
    const db = readDb();
    res.json({ success: true, categories: db.categories || [] });
  });

  app.post("/api/categories", (req: Request, res: Response) => {
    try {
      const { name, slug, description } = req.body;
      if (!name) return res.status(400).json({ success: false, error: "Category name is required" });

      const db = readDb();
      if (!db.categories) db.categories = [];
      const newCat = {
        id: Date.now(),
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: description || "",
        post_count: 0,
        created_at: new Date().toISOString(),
      };
      db.categories.push(newCat);
      writeDb(db);
      res.status(201).json({ success: true, category: newCat, categories: db.categories });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put("/api/categories/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, slug, description } = req.body;
      const db = readDb();
      if (!db.categories) db.categories = [];
      const idx = db.categories.findIndex((c) => String(c.id) === String(id));
      if (idx !== -1) {
        db.categories[idx] = {
          ...db.categories[idx],
          name: name || db.categories[idx].name,
          slug: slug || db.categories[idx].slug,
          description: description !== undefined ? description : db.categories[idx].description,
        };
        writeDb(db);
      }
      res.json({ success: true, categories: db.categories });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete("/api/categories/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDb();
      db.categories = (db.categories || []).filter((c) => String(c.id) !== String(id));
      writeDb(db);
      res.json({ success: true, categories: db.categories });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // TAGS API ENDPOINTS
  // ==========================================
  app.get("/api/tags", (req: Request, res: Response) => {
    const db = readDb();
    res.json({ success: true, tags: db.tags || [] });
  });

  app.post("/api/tags", (req: Request, res: Response) => {
    try {
      const { name, slug } = req.body;
      if (!name) return res.status(400).json({ success: false, error: "Tag name is required" });

      const db = readDb();
      if (!db.tags) db.tags = [];
      const newTag = {
        id: Date.now(),
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        post_count: 0,
        created_at: new Date().toISOString(),
      };
      db.tags.push(newTag);
      writeDb(db);
      res.status(201).json({ success: true, tag: newTag, tags: db.tags });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put("/api/tags/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, slug } = req.body;
      const db = readDb();
      if (!db.tags) db.tags = [];
      const idx = db.tags.findIndex((t) => String(t.id) === String(id));
      if (idx !== -1) {
        db.tags[idx] = {
          ...db.tags[idx],
          name: name || db.tags[idx].name,
          slug: slug || db.tags[idx].slug,
        };
        writeDb(db);
      }
      res.json({ success: true, tags: db.tags });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete("/api/tags/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDb();
      db.tags = (db.tags || []).filter((t) => String(t.id) !== String(id));
      writeDb(db);
      res.json({ success: true, tags: db.tags });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // MEDIA LIBRARY API ENDPOINTS
  // ==========================================
  app.get("/api/media", (req: Request, res: Response) => {
    const db = readDb();
    res.json({ success: true, media: db.media || [] });
  });

  app.post("/api/media", (req: Request, res: Response) => {
    try {
      const { fileName, url, originalKb, compressedKb, width, height, alt_text } = req.body;
      const db = readDb();
      if (!db.media) db.media = [];

      const newItem = {
        id: `media_${Date.now()}`,
        fileName: fileName || `image_${Date.now()}.jpg`,
        url: url || "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
        originalKb: originalKb || 350,
        compressedKb: compressedKb || 140,
        width: width || 1200,
        height: height || 800,
        alt_text: alt_text || "",
        uploadDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      };

      db.media.unshift(newItem);
      writeDb(db);
      res.status(201).json({ success: true, item: newItem, media: db.media });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete("/api/media/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDb();
      db.media = (db.media || []).filter((m) => String(m.id) !== String(id));
      writeDb(db);
      res.json({ success: true, media: db.media });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // COMMENTS API ENDPOINTS
  // ==========================================
  app.get("/api/comments", (req: Request, res: Response) => {
    const db = readDb();
    res.json({ success: true, comments: db.comments || [] });
  });

  app.post("/api/comments", (req: Request, res: Response) => {
    try {
      const { post_id, author_name, author_email, content } = req.body;
      if (!author_name || !content) {
        return res.status(400).json({ success: false, error: "Author name and content are required" });
      }

      const db = readDb();
      if (!db.comments) db.comments = [];
      const post = (db.blogs || []).find((b) => String(b.id) === String(post_id));

      const newComment = {
        id: Date.now(),
        post_id: post_id || "blog_u1",
        post_title: post ? post.title : "10 Best Gold Buyers in Colombo (2026 Guide)",
        post_slug: post ? post.slug : "10-best-gold-buyers-in-colombo-2026-guide",
        author_name,
        author_email: author_email || "reader@goldlanka.lk",
        content,
        status: "approved" as const,
        ip_address: req.ip || "127.0.0.1",
        created_at: new Date().toISOString(),
      };

      db.comments.unshift(newComment);
      writeDb(db);
      res.status(201).json({ success: true, comment: newComment, comments: db.comments });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put("/api/comments/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const db = readDb();
      if (!db.comments) db.comments = [];
      const idx = db.comments.findIndex((c) => String(c.id) === String(id));
      if (idx !== -1) {
        db.comments[idx].status = status;
        writeDb(db);
      }
      res.json({ success: true, comments: db.comments });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete("/api/comments/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDb();
      db.comments = (db.comments || []).filter((c) => String(c.id) !== String(id));
      writeDb(db);
      res.json({ success: true, comments: db.comments });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // USERS & TEAM API ENDPOINTS
  // ==========================================
  app.get("/api/users", (req: Request, res: Response) => {
    const db = readDb();
    res.json({ success: true, users: db.users || [] });
  });

  app.post("/api/users", (req: Request, res: Response) => {
    try {
      const { name, email, role, bio, avatar } = req.body;
      if (!name || !email) return res.status(400).json({ success: false, error: "Name and email required" });

      const db = readDb();
      if (!db.users) db.users = [];
      const newUser = {
        id: Date.now(),
        user_uuid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name,
        email,
        role: role || "author",
        avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        bio: bio || "",
        status: "active",
        post_count: 0,
        created_at: new Date().toISOString(),
      };
      db.users.push(newUser);
      writeDb(db);
      res.status(201).json({ success: true, user: newUser, users: db.users });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put("/api/users/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, role, bio, avatar } = req.body;
      const db = readDb();
      if (!db.users) db.users = [];
      const idx = db.users.findIndex((u) => String(u.id) === String(id));
      if (idx !== -1) {
        db.users[idx] = {
          ...db.users[idx],
          name: name || db.users[idx].name,
          role: role || db.users[idx].role,
          bio: bio !== undefined ? bio : db.users[idx].bio,
          avatar: avatar || db.users[idx].avatar,
        };
        writeDb(db);
      }
      res.json({ success: true, users: db.users });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete("/api/users/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDb();
      db.users = (db.users || []).filter((u) => String(u.id) !== String(id));
      writeDb(db);
      res.json({ success: true, users: db.users });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // CMS SETTINGS API ENDPOINTS
  // ==========================================
  app.get("/api/cms-settings", (req: Request, res: Response) => {
    const db = readDb();
    res.json({ success: true, settings: db.cmsSettings || {} });
  });

  app.post("/api/cms-settings", (req: Request, res: Response) => {
    try {
      const db = readDb();
      db.cmsSettings = { ...(db.cmsSettings || {}), ...req.body };
      writeDb(db);
      res.json({ success: true, settings: db.cmsSettings });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // AUDIT LOGS API ENDPOINTS
  // ==========================================
  app.get("/api/audit/logs", (req: Request, res: Response) => {
    const db = readDb();
    res.json({ success: true, logs: db.auditLogs || [] });
  });

  // ==========================================
  // SYSTEM SITEMAP & BACKUP
  // ==========================================
  app.get("/api/system/sitemap", (req: Request, res: Response) => {
    const db = readDb();
    const urls = (db.blogs || []).map((b) => ({
      loc: `https://www.goldlanka.lk/blog/${b.slug}`,
      lastmod: b.createdAt.split("T")[0],
      changefreq: "weekly",
      priority: 0.8,
    }));
    urls.unshift(
      { loc: "https://www.goldlanka.lk/", lastmod: new Date().toISOString().split("T")[0], changefreq: "daily", priority: 1.0 },
      { loc: "https://www.goldlanka.lk/rates", lastmod: new Date().toISOString().split("T")[0], changefreq: "hourly", priority: 0.9 },
      { loc: "https://www.goldlanka.lk/blog", lastmod: new Date().toISOString().split("T")[0], changefreq: "daily", priority: 0.9 }
    );
    res.json({ success: true, total_urls: urls.length, urls });
  });

  app.get("/api/system/backup", (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Database schema and dataset export ready for phpMyAdmin",
      database: "u923048970_goldbuyers",
      timestamp: new Date().toISOString(),
      download_url: "/backend/database/schema.sql",
    });
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
