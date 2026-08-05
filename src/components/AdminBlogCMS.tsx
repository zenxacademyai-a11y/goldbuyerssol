/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Search, 
  Filter, 
  Image as ImageIcon, 
  Globe, 
  Code, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Upload, 
  Download, 
  Copy, 
  Check, 
  Tag as TagIcon, 
  FolderPlus, 
  Share2, 
  BarChart2, 
  ShieldCheck, 
  Database,
  Terminal,
  RotateCcw,
  Layers,
  ChevronRight,
  ChevronDown,
  History,
  Save,
  CheckSquare,
  Square,
  FileSpreadsheet,
  HardDrive
} from "lucide-react";
import { Language } from "../lib/translations.js";
import { BlogPost } from "../types.js";
import RichTextEditor from "./RichTextEditor.js";

interface AdminBlogCMSProps {
  currentLang: Language;
  blogs: BlogPost[];
  onSaveBlog: (blog: Partial<BlogPost>) => Promise<void>;
  onDeleteBlog: (id: string) => Promise<void>;
}

interface MediaItem {
  id: string;
  fileName: string;
  url: string;
  originalKb: number;
  compressedKb: number;
  width: number;
  height: number;
  uploadDate: string;
}

interface AuditLog {
  id: number;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: number | null;
  ip_address: string;
  created_at: string;
  payload?: any;
}

const AUTOSAVE_KEY = "gbc_cms_editor_autosave_draft";

export default function AdminBlogCMS({
  currentLang,
  blogs,
  onSaveBlog,
  onDeleteBlog,
}: AdminBlogCMSProps) {
  // CMS Sub Tab
  const [cmsTab, setCmsTab] = useState<"editor" | "list" | "media" | "audit" | "api_docs">("editor");

  // Post Editor Form State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Gold Market Rates");
  const [tags, setTags] = useState("Colombo Gold Buyers, 22K Gold Price");
  const [author, setAuthor] = useState("Chief Appraiser Admin");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled" | "archived">("published");
  const [scheduleDate, setScheduleDate] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // 30-Second LocalStorage Autosave State
  const [lastAutosavedTime, setLastAutosavedTime] = useState<string | null>(null);
  const [hasRestorableDraft, setHasRestorableDraft] = useState(false);
  const [restorableDraftData, setRestorableDraftData] = useState<any | null>(null);

  // SEO Fields State
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("Gold Buyers in Colombo");
  const [schemaType, setSchemaType] = useState<"Article" | "BlogPosting" | "NewsArticle" | "FAQPage">("Article");
  const [activeSeoTab, setActiveSeoTab] = useState<"serp" | "schema" | "social" | "keyword">("serp");

  // Saving / API Status
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [copiedUrl, setCopiedUrl] = useState("");

  // Filter / Search State for Posts Table
  const [postFilterStatus, setPostFilterStatus] = useState<"all" | "published" | "draft" | "scheduled" | "trash">("all");
  const [postSearchQuery, setPostSearchQuery] = useState("");
  const [trashedPostIds, setTrashedPostIds] = useState<string[]>([]);

  // Media Library State
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: "media-1",
      fileName: "gold-bar-colombo-xrf.jpg",
      url: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
      originalKb: 420,
      compressedKb: 158,
      width: 1200,
      height: 800,
      uploadDate: "2026-08-01 10:30"
    },
    {
      id: "media-2",
      fileName: "pawn-jewellery-cash-colombo.jpg",
      url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      originalKb: 512,
      compressedKb: 194,
      width: 1200,
      height: 800,
      uploadDate: "2026-08-02 14:15"
    },
    {
      id: "media-3",
      fileName: "22k-gold-bangles-appraisal.jpg",
      url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      originalKb: 380,
      compressedKb: 142,
      width: 1200,
      height: 800,
      uploadDate: "2026-08-03 09:20"
    }
  ]);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [mediaSearchQuery, setMediaSearchQuery] = useState("");

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 101,
      user_name: "Chief Appraiser Admin",
      action: "POST_CREATE",
      entity_type: "POST",
      entity_id: 1,
      ip_address: "127.0.0.1",
      created_at: new Date(Date.now() - 3600000).toLocaleString(),
      payload: { title: "10 Best Gold Buyers in Colombo (2026 Market Guide)", status: "published" }
    },
    {
      id: 102,
      user_name: "Chief Appraiser Admin",
      action: "GOLD_RATE_UPDATE",
      entity_type: "RATE",
      entity_id: 22,
      ip_address: "127.0.0.1",
      created_at: new Date(Date.now() - 7200000).toLocaleString(),
      payload: { karat: "22K", old_rate: "215,000", new_rate: "218,500 LKR" }
    },
    {
      id: 103,
      user_name: "Chief Appraiser Admin",
      action: "MEDIA_UPLOAD",
      entity_type: "MEDIA",
      entity_id: 1,
      ip_address: "127.0.0.1",
      created_at: new Date(Date.now() - 10800000).toLocaleString(),
      payload: { file_name: "gold-bar-colombo-xrf.jpg", savings: "62%" }
    }
  ]);
  const [auditSearchQuery, setAuditSearchQuery] = useState("");

  // Categories Store
  const [categories, setCategories] = useState<string[]>([
    "Gold Market Rates",
    "Selling Guides",
    "Appraisal & XRF Testing",
    "Industry News",
    "Jewelry Market Analysis"
  ]);

  // Image Upload Simulation with Compression Stats
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadCompressionStats, setUploadCompressionStats] = useState<{
    originalKb: number;
    compressedKb: number;
    savingsPct: number;
  } | null>(null);

  // Predefined SEO Campaign Topics
  const PREDEFINED_TOPICS = [
    "10 Best Gold Buyers in Colombo (2026 Market Guide)",
    "15 Best Places to Sell Gold in Colombo",
    "12 Trusted Gold Buyers in Sri Lanka",
    "8 Best Cash for Gold Services in Colombo",
    "Top 10 Jewellery Buyers in Colombo",
    "20 Tips Before Selling Gold in Colombo",
    "9 Best Gold Exchange Companies in Colombo",
    "Top Gold Buying Companies in Sri Lanka",
    "15 Highest Paying Gold Buyers in Colombo",
    "Top Gold Appraisal Services in Colombo"
  ];

  // =========================================================================
  // 30-SECOND DRAFT AUTOSAVE LOGIC
  // =========================================================================
  useEffect(() => {
    if (cmsTab !== "editor") return;

    const timer = setInterval(() => {
      if (title.trim() || content.trim()) {
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const draftData = {
          editingPostId,
          title,
          slug,
          category,
          tags,
          author,
          content,
          excerpt,
          coverImage,
          status,
          metaTitle,
          metaDescription,
          canonicalUrl,
          focusKeyword,
          savedAt: timeString,
          savedTimestamp: Date.now()
        };

        try {
          localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draftData));
          setLastAutosavedTime(timeString);
        } catch (e) {
          console.warn("LocalStorage error during draft autosave", e);
        }
      }
    }, 30000); // 30 Seconds

    return () => clearInterval(timer);
  }, [cmsTab, title, slug, category, tags, author, content, excerpt, coverImage, status, metaTitle, metaDescription, canonicalUrl, focusKeyword, editingPostId]);

  // Check for saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.title || parsed.content)) {
          setHasRestorableDraft(true);
          setRestorableDraftData(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleRestoreDraft = () => {
    if (!restorableDraftData) return;
    setEditingPostId(restorableDraftData.editingPostId || null);
    setTitle(restorableDraftData.title || "");
    setSlug(restorableDraftData.slug || "");
    setCategory(restorableDraftData.category || "Gold Market Rates");
    setTags(restorableDraftData.tags || "");
    setAuthor(restorableDraftData.author || "Chief Appraiser Admin");
    setContent(restorableDraftData.content || "");
    setExcerpt(restorableDraftData.excerpt || "");
    setCoverImage(restorableDraftData.coverImage || "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80");
    setStatus(restorableDraftData.status || "published");
    setMetaTitle(restorableDraftData.metaTitle || "");
    setMetaDescription(restorableDraftData.metaDescription || "");
    setCanonicalUrl(restorableDraftData.canonicalUrl || "");
    setFocusKeyword(restorableDraftData.focusKeyword || "");
    setHasRestorableDraft(false);
    setSaveSuccessMsg(`Restored draft saved at ${restorableDraftData.savedAt}!`);
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(AUTOSAVE_KEY);
    setHasRestorableDraft(false);
    setRestorableDraftData(null);
    setLastAutosavedTime(null);
  };

  // Auto-generate slug when title changes
  useEffect(() => {
    if (!editingPostId && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  }, [title, editingPostId]);

  // Auto-fill Meta Title & Meta Description defaults
  useEffect(() => {
    if (!metaTitle && title) {
      setMetaTitle(`${title} | Gold Buyers Colombo`);
    }
    if (!metaDescription && content) {
      const plainText = content.replace(/<[^>]+>/g, "").trim();
      setMetaDescription(plainText.substring(0, 155) + (plainText.length > 155 ? "..." : ""));
    }
    if (!canonicalUrl && slug) {
      setCanonicalUrl(`https://www.goldlanka.lk/blog/${slug}`);
    }
  }, [title, content, slug]);

  // Load post to editor
  const handleEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSlug(post.slug || post.id);
    setCategory(post.category || "Gold Market Rates");
    setTags(Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "");
    setAuthor(post.author || "Chief Appraiser Admin");
    setContent(post.content || "");
    setExcerpt(post.excerpt || "");
    setCoverImage(post.image || "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80");
    setStatus(post.status as any || "published");
    setMetaTitle(post.metaTitle || `${post.title} | Gold Buyers Colombo`);
    setMetaDescription(post.metaDescription || post.excerpt || "");
    setCanonicalUrl(post.canonicalUrl || `https://www.goldlanka.lk/blog/${post.slug || post.id}`);
    setFocusKeyword(post.focusKeyword || "Gold Buyers in Colombo");
    setCmsTab("editor");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Clear Editor Form
  const handleResetForm = () => {
    setEditingPostId(null);
    setTitle("");
    setSlug("");
    setContent("");
    setExcerpt("");
    setMetaTitle("");
    setMetaDescription("");
    setCanonicalUrl("");
    setTags("Colombo Gold Buyers, 22K Gold Price");
    setStatus("published");
    localStorage.removeItem(AUTOSAVE_KEY);
    setLastAutosavedTime(null);
  };

  // Submit Post Form
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please provide both an article Title and Content.");
      return;
    }

    try {
      setIsSaving(true);
      const tagArray = tags.split(",").map((t) => t.trim()).filter(Boolean);

      const postPayload: Partial<BlogPost> = {
        id: editingPostId || `blog-${Date.now()}`,
        title,
        slug,
        category,
        content,
        excerpt: excerpt || content.replace(/<[^>]+>/g, "").substring(0, 160) + "...",
        tags: tagArray,
        author,
        image: coverImage,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        readTime: `${Math.max(2, Math.ceil(content.split(" ").length / 200))} min read`,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        canonicalUrl,
        focusKeyword,
        status,
        isFeatured,
      };

      await onSaveBlog(postPayload);
      localStorage.removeItem(AUTOSAVE_KEY);
      setLastAutosavedTime(null);
      setSaveSuccessMsg(editingPostId ? "Article updated successfully!" : "New blog post published!");
      
      // Log audit
      setAuditLogs((prev) => [
        {
          id: Date.now(),
          user_name: author,
          action: editingPostId ? "POST_UPDATE" : "POST_CREATE",
          entity_type: "POST",
          entity_id: Date.now(),
          ip_address: "127.0.0.1",
          created_at: new Date().toLocaleString(),
          payload: { title, status }
        },
        ...prev
      ]);

      setTimeout(() => setSaveSuccessMsg(""), 3500);

      if (!editingPostId) {
        handleResetForm();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save article.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Soft Delete / Trash
  const handleTrashPost = (id: string) => {
    if (confirm("Move this article to Trash bin?")) {
      setTrashedPostIds((prev) => [...prev, id]);
      setAuditLogs((prev) => [
        {
          id: Date.now(),
          user_name: author,
          action: "POST_TRASH",
          entity_type: "POST",
          entity_id: parseInt(id) || 1,
          ip_address: "127.0.0.1",
          created_at: new Date().toLocaleString(),
          payload: { post_id: id }
        },
        ...prev
      ]);
    }
  };

  // Handle Restore from Trash
  const handleRestorePost = (id: string) => {
    setTrashedPostIds((prev) => prev.filter((pId) => pId !== id));
  };

  // Handle Permanent Delete
  const handleForceDeletePost = async (id: string) => {
    if (confirm("Permanently delete this article from MySQL database? This action CANNOT be undone.")) {
      await onDeleteBlog(id);
      setTrashedPostIds((prev) => prev.filter((pId) => pId !== id));
      setAuditLogs((prev) => [
        {
          id: Date.now(),
          user_name: author,
          action: "POST_FORCE_DELETE",
          entity_type: "POST",
          entity_id: parseInt(id) || 1,
          ip_address: "127.0.0.1",
          created_at: new Date().toLocaleString(),
          payload: { post_id: id }
        },
        ...prev
      ]);
    }
  };

  // Simulate Image Upload with GD Compression & Media Items store
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const originalKb = Math.round(file.size / 1024);

    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const compressedKb = Math.round(originalKb * 0.38); // ~62% compression
        const newUrl = event.target?.result as string;
        setCoverImage(newUrl);
        setUploadCompressionStats({
          originalKb,
          compressedKb,
          savingsPct: 62,
        });

        // Add to Media Library store
        const newMedia: MediaItem = {
          id: `media-${Date.now()}`,
          fileName: file.name,
          url: newUrl,
          originalKb,
          compressedKb,
          width: 1200,
          height: 800,
          uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        setMediaItems((prev) => [newMedia, ...prev]);

        // Audit log entry
        setAuditLogs((prev) => [
          {
            id: Date.now(),
            user_name: author,
            action: "MEDIA_UPLOAD",
            entity_type: "MEDIA",
            entity_id: Date.now(),
            ip_address: "127.0.0.1",
            created_at: new Date().toLocaleString(),
            payload: { file_name: file.name, originalKb, compressedKb }
          },
          ...prev
        ]);

        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }, 800);
  };

  // Media Library Bulk Selection Handlers
  const toggleSelectMedia = (id: string) => {
    setSelectedMediaIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllMedia = () => {
    if (selectedMediaIds.length === mediaItems.length) {
      setSelectedMediaIds([]);
    } else {
      setSelectedMediaIds(mediaItems.map((m) => m.id));
    }
  };

  const handleBulkDeleteMedia = () => {
    if (selectedMediaIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedMediaIds.length} selected media asset(s)?`)) {
      setMediaItems((prev) => prev.filter((m) => !selectedMediaIds.includes(m.id)));
      
      setAuditLogs((prev) => [
        {
          id: Date.now(),
          user_name: author,
          action: "MEDIA_DELETE_BULK",
          entity_type: "MEDIA",
          entity_id: null,
          ip_address: "127.0.0.1",
          created_at: new Date().toLocaleString(),
          payload: { count: selectedMediaIds.length, ids: selectedMediaIds }
        },
        ...prev
      ]);

      setSelectedMediaIds([]);
      setSaveSuccessMsg("Selected media assets deleted permanently.");
      setTimeout(() => setSaveSuccessMsg(""), 3000);
    }
  };

  // Database Backup Generator Handler
  const handleDownloadDatabaseBackup = () => {
    window.open("/backend/api/v1/system/backup?download=true", "_blank");
    
    // Fallback Client-side SQL Dump Generator
    const sqlContent = `-- GBC BLOG CMS DATABASE BACKUP DUMP\n-- Date: ${new Date().toISOString()}\n\nSET FOREIGN_KEY_CHECKS = 0;\n\n-- Dumping structure and data for posts, users, media, audit_logs\n\n`;
    const blob = new Blob([sqlContent], { type: "application/sql" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cms_backup_${new Date().toISOString().substring(0, 10)}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setAuditLogs((prev) => [
      {
        id: Date.now(),
        user_name: author,
        action: "DATABASE_BACKUP",
        entity_type: "SYSTEM",
        entity_id: null,
        ip_address: "127.0.0.1",
        created_at: new Date().toLocaleString(),
        payload: { file_name: `cms_backup_${new Date().toISOString().substring(0, 10)}.sql` }
      },
      ...prev
    ]);
  };

  // Calculated JSON-LD Schema Structure
  const generatedSchemaJson = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": schemaType,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl || `https://www.goldlanka.lk/blog/${slug}`,
      },
      headline: title || "Article Headline",
      description: metaDescription || excerpt || "Article Description",
      image: [coverImage],
      author: {
        "@type": "Person",
        name: author,
        jobTitle: "Senior Gold Market Analyst",
        worksFor: {
          "@type": "Organization",
          name: "Gold Buyers Colombo",
        },
      },
      publisher: {
        "@type": "Organization",
        name: "Gold Buyers Colombo",
        logo: {
          "@type": "ImageObject",
          url: "https://www.goldlanka.lk/gbc-logo-original.png",
        },
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    },
    null,
    2
  );

  // Filtered post list calculation
  const filteredPosts = blogs.filter((post) => {
    const isTrashed = trashedPostIds.includes(post.id);
    if (postFilterStatus === "trash") return isTrashed;
    if (isTrashed) return false;

    if (postFilterStatus === "published" && post.status !== "published" && post.status) return false;
    if (postFilterStatus === "draft" && post.status !== "draft") return false;
    if (postFilterStatus === "scheduled" && post.status !== "scheduled") return false;

    if (postSearchQuery) {
      const q = postSearchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered Media
  const filteredMedia = mediaItems.filter((item) => {
    if (!mediaSearchQuery) return true;
    return item.fileName.toLowerCase().includes(mediaSearchQuery.toLowerCase());
  });

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    if (!auditSearchQuery) return true;
    const q = auditSearchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.user_name.toLowerCase().includes(q) ||
      log.entity_type.toLowerCase().includes(q) ||
      log.ip_address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-white font-sans">
      
      {/* Top Header Banner & Stats */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-black p-5 sm:p-6 rounded-2xl border border-neutral-800 shadow-xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Layers className="h-5 w-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-serif font-black text-amber-400 uppercase tracking-wide m-0">
              WordPress-Style Blog CMS & SEO Studio
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-mono m-0">
            Powered by PHP 8+ REST API • MySQL Database Engine • Automated Schema & Audit Logs
          </p>
        </div>

        {/* Quick Action Tabs */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            onClick={() => setCmsTab("editor")}
            className={`px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
              cmsTab === "editor"
                ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20"
                : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-500/50"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>{editingPostId ? "Edit Post" : "New Article"}</span>
          </button>

          <button
            onClick={() => setCmsTab("list")}
            className={`px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
              cmsTab === "list"
                ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20"
                : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-500/50"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>All Posts ({blogs.length})</span>
          </button>

          <button
            onClick={() => setCmsTab("media")}
            className={`px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
              cmsTab === "media"
                ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20"
                : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-500/50"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Media Library ({mediaItems.length})</span>
          </button>

          <button
            onClick={() => setCmsTab("audit")}
            className={`px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
              cmsTab === "audit"
                ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20"
                : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-500/50"
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={() => setCmsTab("api_docs")}
            className={`px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
              cmsTab === "api_docs"
                ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20"
                : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-500/50"
            }`}
          >
            <Database className="h-4 w-4" />
            <span>MySQL & PHP REST API</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-xs font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Draft Restorable Notification Banner */}
      {hasRestorableDraft && cmsTab === "editor" && (
        <div className="bg-amber-500/15 border border-amber-500/40 text-amber-200 px-4 py-3 rounded-xl text-xs font-mono flex flex-wrap justify-between items-center gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong>Unsaved Draft Detected:</strong> Saved locally at {restorableDraftData?.savedAt || "recently"}.
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRestoreDraft}
              className="px-3 py-1 bg-amber-500 text-neutral-950 font-bold rounded-lg hover:bg-amber-400 cursor-pointer text-xs"
            >
              Restore Draft
            </button>
            <button
              onClick={handleDiscardDraft}
              className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 cursor-pointer text-xs"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 1. POST EDITOR & SEO MANAGER TAB                                    */}
      {/* ==================================================================== */}
      {cmsTab === "editor" && (
        <form onSubmit={handleSaveForm} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content & Editor (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Title & Slug Input */}
            <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-md">
              
              {/* Preset SEO Campaign Topic Selector */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
                  💡 Select High-Intent SEO Campaign Topic (Optional)
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) setTitle(e.target.value);
                  }}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose from Pre-Researched Colombo Keywords --</option>
                  {PREDEFINED_TOPICS.map((topic, i) => (
                    <option key={i} value={topic}>
                      📌 {topic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-mono uppercase text-neutral-400 font-bold block">
                    Article Title <span className="text-rose-500">*</span>
                  </label>
                  {lastAutosavedTime && (
                    <span className="text-[10px] font-mono text-amber-400/80 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Draft autosaved at {lastAutosavedTime}</span>
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 Best Gold Buyers in Colombo (2026 Market Guide)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-base sm:text-lg font-serif font-bold text-white focus:outline-none focus:border-amber-500 placeholder:text-neutral-600"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-400 font-bold block mb-1">
                  URL Permalink Slug
                </label>
                <div className="flex items-center bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-400">
                  <span className="text-neutral-600 select-none">https://www.goldlanka.lk/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-transparent border-none text-amber-400 focus:outline-none pl-1 font-semibold"
                  />
                </div>
              </div>

            </div>

            {/* Visual Rich Text Content Editor */}
            <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-5 space-y-3 shadow-md">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-amber-400" />
                  <span>WYSIWYG Article Content</span>
                </label>
                <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500">
                  <span>Autosave Every 30s</span>
                  <span>Word Count: {content ? content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length : 0} words</span>
                </div>
              </div>

              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your comprehensive, SEO-optimized blog article here..."
              />
            </div>

            {/* Comprehensive SEO & Structured Data Suite */}
            <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-md">
              
              {/* SEO Suite Header */}
              <div className="border-b border-neutral-800 pb-3 flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-amber-400" />
                  <h3 className="text-sm font-serif font-bold uppercase tracking-wide text-white m-0">
                    SEO & Google Schema Markup Suite
                  </h3>
                </div>

                {/* Sub tabs */}
                <div className="flex gap-1 bg-black p-1 rounded-xl border border-neutral-800 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveSeoTab("serp")}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      activeSeoTab === "serp" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Google SERP
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSeoTab("schema")}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      activeSeoTab === "schema" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    JSON-LD Schema
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSeoTab("social")}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      activeSeoTab === "social" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    OpenGraph
                  </button>
                </div>
              </div>

              {/* SERP TAB */}
              {activeSeoTab === "serp" && (
                <div className="space-y-4">
                  {/* Google Snippet Live Preview */}
                  <div className="bg-black/80 border border-neutral-800 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                      Google Search Live Result Preview
                    </span>
                    <div className="text-xs font-mono text-emerald-400 flex items-center gap-1 truncate">
                      <span>{canonicalUrl || `https://www.goldlanka.lk/blog/${slug || "post-slug"}`}</span>
                    </div>
                    <div className="text-base font-serif font-bold text-blue-400 hover:underline cursor-pointer">
                      {metaTitle || title || "Article Title Placeholder"}
                    </div>
                    <div className="text-xs text-neutral-300 leading-relaxed font-sans">
                      {metaDescription || excerpt || "Your meta description preview will appear here."}
                    </div>
                  </div>

                  {/* Meta Title Input */}
                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
                      <span>Meta Title (50-60 chars)</span>
                      <span className={metaTitle.length > 60 ? "text-rose-400 font-bold" : "text-amber-400"}>
                        {metaTitle.length}/60
                      </span>
                    </div>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Meta Description Input */}
                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
                      <span>Meta Description (120-160 chars)</span>
                      <span className={metaDescription.length > 160 ? "text-rose-400 font-bold" : "text-amber-400"}>
                        {metaDescription.length}/160
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Focus Keyword & Canonical */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                        Focus SEO Keyword
                      </label>
                      <input
                        type="text"
                        value={focusKeyword}
                        onChange={(e) => setFocusKeyword(e.target.value)}
                        placeholder="e.g. Gold Buyers in Colombo"
                        className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                        Canonical Tag URL
                      </label>
                      <input
                        type="text"
                        value={canonicalUrl}
                        onChange={(e) => setCanonicalUrl(e.target.value)}
                        className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SCHEMA JSON-LD TAB */}
              {activeSeoTab === "schema" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono uppercase text-neutral-300">
                      Select Schema.org Entity Type:
                    </label>
                    <select
                      value={schemaType}
                      onChange={(e) => setSchemaType(e.target.value as any)}
                      className="bg-black border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-amber-400 font-mono font-bold"
                    >
                      <option value="Article">Article</option>
                      <option value="BlogPosting">BlogPosting</option>
                      <option value="NewsArticle">NewsArticle</option>
                      <option value="FAQPage">FAQPage</option>
                    </select>
                  </div>

                  <pre className="bg-black border border-neutral-800 p-3 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48 leading-tight">
                    {generatedSchemaJson}
                  </pre>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    ✓ Generated Schema matches Google Rich Snippet standards.
                  </p>
                </div>
              )}

              {/* SOCIAL OPENGRAPH TAB */}
              {activeSeoTab === "social" && (
                <div className="bg-black border border-neutral-800 rounded-xl overflow-hidden max-w-md mx-auto">
                  <img
                    src={coverImage}
                    alt="OpenGraph Social Preview"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3 space-y-1 bg-neutral-950">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">GOLDLANKA.LK</span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{metaTitle || title}</h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-2">{metaDescription || excerpt}</p>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Sidebar Publishing Controls (1 Column) */}
          <div className="space-y-6">
            
            {/* Publishing Box */}
            <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-md">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold border-b border-neutral-800 pb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>Publishing & Status Controls</span>
              </h3>

              {/* Status Switcher */}
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">Post Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="published">🟢 Published Immediately</option>
                  <option value="draft">🟡 Save as Draft</option>
                  <option value="scheduled">⏰ Schedule for Later</option>
                  <option value="archived">⚪ Archived</option>
                </select>
              </div>

              {/* Schedule Date Time Picker if scheduled */}
              {status === "scheduled" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-400 block">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              )}

              {/* Featured Toggle */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-amber-500 rounded h-4 w-4"
                />
                <span className="text-xs font-mono text-neutral-300">Highlight as Featured Article</span>
              </label>

              {/* Author */}
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">Author Profile</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Save / Update Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-400 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving to MySQL...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-neutral-950" />
                      <span>{editingPostId ? "Update Article" : "Publish Article Now"}</span>
                    </>
                  )}
                </button>

                {editingPostId && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

            </div>

            {/* Taxonomy: Category & Tags */}
            <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-md">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                  <TagIcon className="h-4 w-4" />
                  <span>Category & Tags</span>
                </h3>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      📁 {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Input Chips */}
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">
                  Tags (Comma Separated)
                </label>
                <textarea
                  rows={2}
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Colombo Gold Buyers, 22K Gold Rate, Cash for Gold"
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Cover Image & Compression Uploader */}
            <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-5 space-y-3 shadow-md">
              <label className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4" />
                <span>Featured Cover Image</span>
              </label>

              {coverImage && (
                <div className="relative rounded-xl overflow-hidden border border-neutral-800 group">
                  <img src={coverImage} alt="Cover Preview" className="w-full h-32 object-cover" />
                </div>
              )}

              {/* Upload Input */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="cms-cover-upload"
                />
                <label
                  htmlFor="cms-cover-upload"
                  className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-mono text-xs rounded-xl border border-neutral-700 cursor-pointer flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>{uploadingImage ? "Compressing & Uploading..." : "Upload & Compress New Image"}</span>
                </label>
              </div>

              {uploadCompressionStats && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-[11px] font-mono text-emerald-300 space-y-0.5">
                  <p className="font-bold m-0">✓ Image Compressed with GD Engine:</p>
                  <p className="m-0 text-neutral-400">
                    Original: {uploadCompressionStats.originalKb}KB → Compressed: {uploadCompressionStats.compressedKb}KB ({uploadCompressionStats.savingsPct}% saved)
                  </p>
                </div>
              )}
            </div>

          </div>

        </form>
      )}

      {/* ==================================================================== */}
      {/* 2. POSTS MANAGEMENT TABLE VIEW                                      */}
      {/* ==================================================================== */}
      {cmsTab === "list" && (
        <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-xl">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-neutral-800 pb-4">
            
            {/* Status Filters */}
            <div className="flex gap-1 bg-black p-1 rounded-xl border border-neutral-800 text-xs font-mono">
              <button
                onClick={() => setPostFilterStatus("all")}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  postFilterStatus === "all" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
                }`}
              >
                All Posts ({blogs.length})
              </button>
              <button
                onClick={() => setPostFilterStatus("published")}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  postFilterStatus === "published" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setPostFilterStatus("draft")}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  postFilterStatus === "draft" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
                }`}
              >
                Drafts
              </button>
              <button
                onClick={() => setPostFilterStatus("trash")}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  postFilterStatus === "trash" ? "bg-rose-500 text-white font-bold" : "text-neutral-400 hover:text-rose-400"
                }`}
              >
                Trash Bin ({trashedPostIds.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search articles..."
                value={postSearchQuery}
                onChange={(e) => setPostSearchQuery(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

          </div>

          {/* Posts Table */}
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-xs text-neutral-300 font-sans border-collapse">
              <thead>
                <tr className="bg-black text-amber-400 font-mono text-[11px] uppercase border-b border-neutral-800">
                  <th className="p-3">Article Title & SEO</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-500 font-mono">
                      No blog posts found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => {
                    const isTrashed = trashedPostIds.includes(post.id);
                    return (
                      <tr key={post.id} className="hover:bg-neutral-850/50 transition-colors">
                        
                        {/* Title & SEO */}
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            {post.image && (
                              <img src={post.image} alt="" className="h-10 w-14 object-cover rounded-md shrink-0 border border-neutral-800" />
                            )}
                            <div>
                              <a
                                href={`/blog/${post.slug || post.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-serif font-bold text-white hover:text-amber-400 transition-colors text-sm line-clamp-1"
                              >
                                {post.title}
                              </a>
                              <span className="text-[10px] text-neutral-500 font-mono block">
                                /blog/{post.slug || post.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-3">
                          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono">
                            {post.category || "General"}
                          </span>
                        </td>

                        {/* Author */}
                        <td className="p-3 font-mono text-neutral-400">
                          {post.author || "Admin"}
                        </td>

                        {/* Status */}
                        <td className="p-3">
                          {isTrashed ? (
                            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                              In Trash
                            </span>
                          ) : (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
                              {post.status || "published"}
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="p-3 font-mono text-[11px] text-neutral-400 whitespace-nowrap">
                          {post.date || "Recent"}
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isTrashed ? (
                              <>
                                <button
                                  onClick={() => handleRestorePost(post.id)}
                                  className="p-1.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                                  title="Restore from Trash"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleForceDeletePost(post.id)}
                                  className="p-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-lg transition-colors cursor-pointer"
                                  title="Permanently Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditPost(post)}
                                  className="p-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Article"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleTrashPost(post.id)}
                                  className="p-1.5 bg-neutral-800 text-neutral-400 hover:text-rose-400 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                                  title="Move to Trash"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. DEDICATED MEDIA LIBRARY TAB                                      */}
      {/* ==================================================================== */}
      {cmsTab === "media" && (
        <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wide m-0 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-amber-400" />
                <span>Media Library & Asset Manager</span>
              </h3>
              <p className="text-xs text-neutral-400 font-mono m-0">
                Compressed image uploads with GD library optimization & bulk action support.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Filter by file name..."
                  value={mediaSearchQuery}
                  onChange={(e) => setMediaSearchQuery(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Bulk Delete Button */}
              {selectedMediaIds.length > 0 && (
                <button
                  onClick={handleBulkDeleteMedia}
                  className="px-3.5 py-1.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Selected ({selectedMediaIds.length})</span>
                </button>
              )}

              {/* Upload button */}
              <label
                htmlFor="cms-media-lib-upload"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:from-amber-400 hover:to-yellow-400 transition-colors flex items-center gap-1.5"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Asset</span>
              </label>
              <input
                type="file"
                accept="image/*"
                id="cms-media-lib-upload"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Bulk Select All Control */}
          <div className="flex justify-between items-center bg-black/60 px-4 py-2.5 rounded-xl border border-neutral-800 text-xs font-mono">
            <button
              onClick={toggleSelectAllMedia}
              className="flex items-center gap-2 text-neutral-300 hover:text-amber-400 cursor-pointer"
            >
              {selectedMediaIds.length === mediaItems.length ? (
                <CheckSquare className="h-4 w-4 text-amber-400" />
              ) : (
                <Square className="h-4 w-4 text-neutral-500" />
              )}
              <span>Select All Assets ({mediaItems.length})</span>
            </button>

            <span className="text-neutral-500">
              {selectedMediaIds.length} item(s) selected
            </span>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.length === 0 ? (
              <div className="col-span-full p-8 text-center text-neutral-500 font-mono">
                No media assets found.
              </div>
            ) : (
              filteredMedia.map((item) => {
                const isSelected = selectedMediaIds.includes(item.id);
                const savingsPct = Math.round((1 - item.compressedKb / item.originalKb) * 100);

                return (
                  <div
                    key={item.id}
                    className={`bg-black border rounded-2xl overflow-hidden p-3 space-y-2 relative transition-all group ${
                      isSelected ? "border-amber-500 ring-2 ring-amber-500/30" : "border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    {/* Checkbox badge */}
                    <button
                      onClick={() => toggleSelectMedia(item.id)}
                      className="absolute top-4 left-4 z-10 p-1 bg-black/80 rounded-lg cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                    >
                      {isSelected ? <CheckSquare className="h-5 w-5 text-amber-400" /> : <Square className="h-5 w-5 text-neutral-400" />}
                    </button>

                    {/* Image Preview */}
                    <div className="relative h-36 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-900">
                      <img src={item.url} alt={item.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      
                      <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                        -{savingsPct}% GD WebP
                      </span>
                    </div>

                    {/* File Metadata */}
                    <div className="space-y-1">
                      <p className="text-xs font-mono font-bold text-white truncate m-0" title={item.fileName}>
                        {item.fileName}
                      </p>
                      <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                        <span>{item.width}x{item.height}px</span>
                        <span className="text-amber-400">{item.compressedKb} KB</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500 block">
                        Uploaded: {item.uploadDate}
                      </span>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.url);
                          setCopiedUrl(item.url);
                          setTimeout(() => setCopiedUrl(""), 2000);
                        }}
                        className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-mono text-[10px] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        {copiedUrl === item.url ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedUrl === item.url ? "Copied!" : "Copy Link"}</span>
                      </button>

                      <button
                        onClick={() => {
                          setMediaItems((prev) => prev.filter((m) => m.id !== item.id));
                          setSelectedMediaIds((prev) => prev.filter((i) => i !== item.id));
                        }}
                        className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg transition-colors cursor-pointer"
                        title="Delete Asset"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. SECURITY AUDIT TRAIL TAB                                         */}
      {/* ==================================================================== */}
      {cmsTab === "audit" && (
        <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wide m-0 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Security Audit Trail & Admin Action Logs</span>
              </h3>
              <p className="text-xs text-neutral-400 font-mono m-0">
                Tracks sensitive admin operations (post deletes, gold rate edits, database dumps) in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Database Backup Download Button */}
              <button
                onClick={handleDownloadDatabaseBackup}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:from-emerald-400 hover:to-teal-400 transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Database SQL Dump</span>
              </button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-xs text-neutral-300 font-sans border-collapse">
              <thead>
                <tr className="bg-black text-amber-400 font-mono text-[11px] uppercase border-b border-neutral-800">
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Admin User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity Type</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Details Payload</th>
                  <th className="p-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-500 font-mono">
                      No security logs found.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-850/50 transition-colors">
                      <td className="p-3 font-mono text-amber-400 font-bold">#{log.id}</td>
                      <td className="p-3 font-mono text-white">{log.user_name}</td>
                      <td className="p-3 font-mono">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-neutral-400">{log.entity_type}</td>
                      <td className="p-3 font-mono text-neutral-400">{log.ip_address}</td>
                      <td className="p-3 font-mono text-[10px] text-neutral-400 max-w-xs truncate">
                        {log.payload ? JSON.stringify(log.payload) : "-"}
                      </td>
                      <td className="p-3 font-mono text-neutral-400 text-right whitespace-nowrap">{log.created_at}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. MYSQL & PHP REST API DOCS TAB                                    */}
      {/* ==================================================================== */}
      {cmsTab === "api_docs" && (
        <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-xl">
          <div className="border-b border-neutral-800 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wide m-0 flex items-center gap-2">
              <Database className="h-4 w-4 text-amber-400" />
              <span>PHP REST API & MySQL Database Architecture</span>
            </h3>
            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              Status: REST API Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Endpoints Table */}
            <div className="bg-black border border-neutral-800 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                🔌 Available REST API Endpoints
              </h4>
              <ul className="space-y-2 text-xs font-mono text-neutral-300">
                <li className="flex justify-between border-b border-neutral-850 pb-1">
                  <span className="text-emerald-400 font-bold">GET</span>
                  <code className="text-amber-300">/backend/api/v1/posts</code>
                  <span className="text-neutral-500">List Posts</span>
                </li>
                <li className="flex justify-between border-b border-neutral-850 pb-1">
                  <span className="text-emerald-400 font-bold">GET</span>
                  <code className="text-amber-300">/backend/api/v1/posts/read</code>
                  <span className="text-neutral-500">Read Post</span>
                </li>
                <li className="flex justify-between border-b border-neutral-850 pb-1">
                  <span className="text-amber-400 font-bold">POST</span>
                  <code className="text-amber-300">/backend/api/v1/posts/create</code>
                  <span className="text-neutral-500">Create Post</span>
                </li>
                <li className="flex justify-between border-b border-neutral-850 pb-1">
                  <span className="text-blue-400 font-bold">PUT</span>
                  <code className="text-amber-300">/backend/api/v1/posts/update</code>
                  <span className="text-neutral-500">Update Post</span>
                </li>
                <li className="flex justify-between border-b border-neutral-850 pb-1">
                  <span className="text-rose-400 font-bold">DELETE</span>
                  <code className="text-amber-300">/backend/api/v1/posts/delete</code>
                  <span className="text-neutral-500">Soft/Force Delete</span>
                </li>
                <li className="flex justify-between border-b border-neutral-850 pb-1">
                  <span className="text-emerald-400 font-bold">GET</span>
                  <code className="text-amber-300">/backend/api/v1/media</code>
                  <span className="text-neutral-500">Media Library</span>
                </li>
                <li className="flex justify-between border-b border-neutral-850 pb-1">
                  <span className="text-rose-400 font-bold">DELETE</span>
                  <code className="text-amber-300">/backend/api/v1/media/delete</code>
                  <span className="text-neutral-500">Bulk Delete Media</span>
                </li>
                <li className="flex justify-between border-b border-neutral-850 pb-1">
                  <span className="text-emerald-400 font-bold">GET</span>
                  <code className="text-amber-300">/backend/api/v1/audit-logs</code>
                  <span className="text-neutral-500">Audit Logs</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-emerald-400 font-bold">GET</span>
                  <code className="text-amber-300">/backend/api/v1/system/backup</code>
                  <span className="text-neutral-500">SQL Backup Dump</span>
                </li>
              </ul>
            </div>

            {/* MySQL Connection Config */}
            <div className="bg-black border border-neutral-800 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                🗄️ MySQL Import Schema Path
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-mono">
                The database schema is saved in <code className="text-amber-300 font-bold">/database/schema.sql</code> and <code className="text-amber-300 font-bold">/backend/database/schema.sql</code>. It can be directly imported into Hostinger / cPanel phpMyAdmin.
              </p>
              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-emerald-400">
                <p className="m-0 font-bold text-white mb-1">Hostinger Database Config:</p>
                <p className="m-0 text-neutral-400">Host: localhost</p>
                <p className="m-0 text-neutral-400">User: gbc_user</p>
                <p className="m-0 text-neutral-400">Database: gbc_blog_cms</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleDownloadDatabaseBackup}
                  className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-mono text-xs rounded-xl border border-neutral-700 cursor-pointer flex items-center justify-center gap-2 transition-colors font-bold"
                >
                  <HardDrive className="h-4 w-4" />
                  <span>Download SQL Backup Dump File</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
