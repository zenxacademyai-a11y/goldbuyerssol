/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  FolderPlus, 
  Tag as TagIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  RefreshCw,
  FolderTree
} from "lucide-react";
import { CategoryItem, TagItem } from "../../types.js";

interface CmsTaxonomiesTabProps {
  categories: CategoryItem[];
  tags: TagItem[];
  onRefresh: () => Promise<void>;
}

export default function CmsTaxonomiesTab({ categories, tags, onRefresh }: CmsTaxonomiesTabProps) {
  // Category Form State
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [editingCatId, setEditingCatId] = useState<number | string | null>(null);

  // Tag Form State
  const [tagName, setTagName] = useState("");
  const [tagSlug, setTagSlug] = useState("");
  const [editingTagId, setEditingTagId] = useState<number | string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState("");

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  // Category Handlers
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      setIsProcessing(true);
      const payload = {
        name: catName,
        slug: catSlug || catName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: catDesc,
      };

      if (editingCatId) {
        const res = await fetch(`/api/categories/${editingCatId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast("Category updated successfully in MySQL!");
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast("New category created successfully in MySQL!");
        }
      }

      setCatName("");
      setCatSlug("");
      setCatDesc("");
      setEditingCatId(null);
      await onRefresh();
    } catch (err: any) {
      alert("Failed to save category: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCategory = async (id: number | string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      setIsProcessing(true);
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Category removed from database.");
        await onRefresh();
      }
    } catch (err: any) {
      alert("Failed to delete category: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditCategory = (cat: CategoryItem) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description || "");
  };

  // Tag Handlers
  const handleSaveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    try {
      setIsProcessing(true);
      const payload = {
        name: tagName,
        slug: tagSlug || tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      };

      if (editingTagId) {
        const res = await fetch(`/api/tags/${editingTagId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast("Tag updated successfully in MySQL!");
        }
      } else {
        const res = await fetch("/api/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast("New tag created successfully in MySQL!");
        }
      }

      setTagName("");
      setTagSlug("");
      setEditingTagId(null);
      await onRefresh();
    } catch (err: any) {
      alert("Failed to save tag: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTag = async (id: number | string, name: string) => {
    if (!confirm(`Are you sure you want to delete tag "${name}"?`)) return;
    try {
      setIsProcessing(true);
      const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Tag removed from database.");
        await onRefresh();
      }
    } catch (err: any) {
      alert("Failed to delete tag: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditTag = (tag: TagItem) => {
    setEditingTagId(tag.id);
    setTagName(tag.name);
    setTagSlug(tag.slug);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTags = tags.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-serif font-black text-white m-0">
              Taxonomies (Categories & SEO Tags)
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-mono m-0 mt-0.5">
            Structured relational tables linked in MySQL database with foreign key support.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search categories or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-white placeholder-neutral-500 focus:border-amber-400 outline-none"
          />
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-xs font-mono flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Two Column Grid: Categories (Left) vs Tags (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ================= CATEGORIES SECTION ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderPlus className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono m-0">
                Categories ({categories.length})
              </h3>
            </div>
            {editingCatId && (
              <button
                onClick={() => {
                  setEditingCatId(null);
                  setCatName("");
                  setCatSlug("");
                  setCatDesc("");
                }}
                className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <X className="h-3 w-3" /> Cancel Edit
              </button>
            )}
          </div>

          {/* Category Input Form */}
          <form onSubmit={handleSaveCategory} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-3 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1 font-bold">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Gold Market Rates"
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCatId) {
                      setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Slug (URL Segment)</label>
                <input
                  type="text"
                  placeholder="e.g., gold-market-rates"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Description</label>
              <input
                type="text"
                placeholder="Optional description for SEO archive pages"
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:border-amber-400 outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{editingCatId ? "Update Category" : "Add Category"}</span>
              </button>
            </div>
          </form>

          {/* Categories List */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-800/60 font-mono text-xs">
            {filteredCategories.map((cat) => (
              <div key={cat.id} className="p-3.5 hover:bg-neutral-850/50 transition-colors flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm truncate">{cat.name}</span>
                    <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-full text-[10px]">
                      {cat.slug}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-neutral-400 text-[11px] truncate m-0 mt-0.5">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleEditCategory(cat)}
                    className="p-1.5 bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 rounded-lg transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1.5 bg-neutral-800 hover:bg-rose-500 hover:text-white text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= TAGS SECTION ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono m-0">
                SEO Tags ({tags.length})
              </h3>
            </div>
            {editingTagId && (
              <button
                onClick={() => {
                  setEditingTagId(null);
                  setTagName("");
                  setTagSlug("");
                }}
                className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <X className="h-3 w-3" /> Cancel Edit
              </button>
            )}
          </div>

          {/* Tag Input Form */}
          <form onSubmit={handleSaveTag} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-3 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1 font-bold">Tag Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Colombo Gold Buyers"
                  value={tagName}
                  onChange={(e) => {
                    setTagName(e.target.value);
                    if (!editingTagId) {
                      setTagSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Tag Slug</label>
                <input
                  type="text"
                  placeholder="e.g., colombo-gold-buyers"
                  value={tagSlug}
                  onChange={(e) => setTagSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:border-emerald-400 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{editingTagId ? "Update Tag" : "Add Tag"}</span>
              </button>
            </div>
          </form>

          {/* Tags List */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-800/60 font-mono text-xs">
            {filteredTags.map((tag) => (
              <div key={tag.id} className="p-3.5 hover:bg-neutral-850/50 transition-colors flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm truncate">#{tag.name}</span>
                    <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-full text-[10px]">
                      {tag.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleEditTag(tag)}
                    className="p-1.5 bg-neutral-800 hover:bg-emerald-500 hover:text-neutral-950 text-neutral-300 rounded-lg transition-colors cursor-pointer"
                    title="Edit Tag"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTag(tag.id, tag.name)}
                    className="p-1.5 bg-neutral-800 hover:bg-rose-500 hover:text-white text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title="Delete Tag"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
