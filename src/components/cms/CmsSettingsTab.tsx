/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  Save, 
  Check, 
  HardDrive, 
  Server, 
  Globe, 
  Database, 
  Download, 
  RefreshCw,
  Sliders,
  ShieldAlert
} from "lucide-react";
import { CmsSettings } from "../../types.js";

interface CmsSettingsTabProps {
  settings: CmsSettings;
  onRefresh: () => Promise<void>;
  onOpenDbModal: () => void;
}

export default function CmsSettingsTab({ settings, onRefresh, onOpenDbModal }: CmsSettingsTabProps) {
  const [formData, setFormData] = useState<CmsSettings>({
    site_name: "Gold Buyers Colombo Blog & Valuation CMS",
    site_tagline: "Premier Gold & Precious Asset Purchasing Authority in Sri Lanka",
    admin_email: "admin@goldlanka.lk",
    default_author: "Samantha Alwis (Chief Valuation Officer)",
    posts_per_page: "10",
    enable_comments: "1",
    auto_approve_comments: "1",
    google_analytics_id: "G-GBCCOLOMBO2026",
    default_meta_description: "Official Blog of Gold Buyers Colombo. Daily gold rates, XRF testing guides, and market analysis in Sri Lanka.",
    ...settings
  });

  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData(prev => ({ ...prev, ...settings }));
    }
  }, [settings]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch("/api/cms-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        showToast("System settings saved to MySQL database successfully!");
        await onRefresh();
      }
    } catch (err: any) {
      alert("Failed to save settings: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadBackup = () => {
    const link = document.createElement("a");
    link.href = "/backend/database/schema.sql";
    link.download = `u923048970_goldbuyers_backup_${new Date().toISOString().split("T")[0]}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("MySQL schema backup file downloaded!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-sky-400" />
            <h2 className="text-lg font-serif font-black text-white m-0">
              CMS System, SEO & Database Settings
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-mono m-0 mt-0.5">
            Configure global blog metadata, Google Analytics tracking, comment moderation, and database exports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDbModal}
            className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Server className="h-4 w-4" />
            <span>Test MySQL Connection</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-xs font-mono flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
        
        {/* General Site Config */}
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 m-0 border-b border-neutral-800 pb-3">
            <Globe className="h-4 w-4 text-amber-400" />
            <span>General Site & SEO Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1 font-bold">Site Name</label>
              <input
                type="text"
                value={formData.site_name || ""}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-bold">Site Tagline</label>
              <input
                type="text"
                value={formData.site_tagline || ""}
                onChange={(e) => setFormData({ ...formData, site_tagline: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-bold">Admin Email</label>
              <input
                type="email"
                value={formData.admin_email || ""}
                onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-bold">Default Author Signature</label>
              <input
                type="text"
                value={formData.default_author || ""}
                onChange={(e) => setFormData({ ...formData, default_author: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-400 mb-1 font-bold">Default Meta Description (for Fallback SEO)</label>
              <textarea
                rows={2}
                value={formData.default_meta_description || ""}
                onChange={(e) => setFormData({ ...formData, default_meta_description: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-bold">Google Analytics GA4 Measurement ID</label>
              <input
                type="text"
                value={formData.google_analytics_id || ""}
                placeholder="G-XXXXXXXXXX"
                onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-bold">Posts Per Page</label>
              <select
                value={formData.posts_per_page || "10"}
                onChange={(e) => setFormData({ ...formData, posts_per_page: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-400"
              >
                <option value="5">5 posts per page</option>
                <option value="10">10 posts per page</option>
                <option value="20">20 posts per page</option>
                <option value="50">50 posts per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Comment Discussion Rules */}
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 m-0 border-b border-neutral-800 pb-3">
            <Sliders className="h-4 w-4 text-purple-400" />
            <span>Discussion & Comment Moderation Rules</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-neutral-950 border border-neutral-850 rounded-xl cursor-pointer hover:border-neutral-700">
              <input
                type="checkbox"
                checked={formData.enable_comments === "1"}
                onChange={(e) => setFormData({ ...formData, enable_comments: e.target.checked ? "1" : "0" })}
                className="h-4 w-4 text-amber-500 rounded border-neutral-700"
              />
              <div>
                <div className="text-white font-bold">Allow People to Submit Comments on Articles</div>
                <div className="text-neutral-500 text-[11px]">Enables the public discussion form below blog posts</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-neutral-950 border border-neutral-850 rounded-xl cursor-pointer hover:border-neutral-700">
              <input
                type="checkbox"
                checked={formData.auto_approve_comments === "1"}
                onChange={(e) => setFormData({ ...formData, auto_approve_comments: e.target.checked ? "1" : "0" })}
                className="h-4 w-4 text-amber-500 rounded border-neutral-700"
              />
              <div>
                <div className="text-white font-bold">Auto-Approve Comments from Verified Authors</div>
                <div className="text-neutral-500 text-[11px]">Automatically publish comments without manual review queue</div>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving Settings..." : "Save Settings to Database"}</span>
          </button>
        </div>
      </form>

      {/* SQL Backup Dump Card */}
      <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">
              MySQL phpMyAdmin Backup & Migration
            </h3>
          </div>
        </div>

        <p className="text-neutral-400 leading-relaxed m-0">
          The full SQL schema including tables for <code className="text-amber-300">posts</code>, <code className="text-amber-300">categories</code>, <code className="text-amber-300">tags</code>, <code className="text-amber-300">comments</code>, <code className="text-amber-300">media</code>, <code className="text-amber-300">users</code>, <code className="text-amber-300">settings</code>, and <code className="text-amber-300">audit_logs</code> is ready for import into Hostinger phpMyAdmin under database <code className="text-amber-300 font-bold">u923048970_goldbuyers</code>.
        </p>

        <div className="pt-2">
          <button
            onClick={handleDownloadBackup}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download schema.sql Dump File</span>
          </button>
        </div>
      </div>
    </div>
  );
}
