/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldCheck, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Mail, 
  User, 
  Lock, 
  Sparkles,
  Shield,
  Key
} from "lucide-react";
import { UserItem } from "../../types.js";

interface CmsUsersTabProps {
  users: UserItem[];
  onRefresh: () => Promise<void>;
}

export default function CmsUsersTab({ users, onRefresh }: CmsUsersTabProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"super_admin" | "editor" | "author" | "contributor">("author");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");
  const [editingUserId, setEditingUserId] = useState<number | string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState("");

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      setIsProcessing(true);
      const payload = { name, email, role, bio, avatar };

      if (editingUserId) {
        const res = await fetch(`/api/users/${editingUserId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast("User profile and role updated in MySQL!");
        }
      } else {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast("New CMS user created successfully in MySQL!");
        }
      }

      setName("");
      setEmail("");
      setBio("");
      setEditingUserId(null);
      await onRefresh();
    } catch (err: any) {
      alert("Failed to save user: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = async (id: number | string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    try {
      setIsProcessing(true);
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("User deleted from database.");
        await onRefresh();
      }
    } catch (err: any) {
      alert("Failed to delete user: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditUser = (user: UserItem) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setBio(user.bio || "");
    setAvatar(user.avatar || "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-serif font-black text-white m-0">
              Team & Role-Based Access Control (RBAC)
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-mono m-0 mt-0.5">
            Manage authors, editors, and super admins with password hashing (bcrypt) and token sessions.
          </p>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-xs font-mono flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Grid: Form (Left) & User Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create/Edit Form */}
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider m-0">
              {editingUserId ? "Edit User Account" : "Add Team Member"}
            </h3>
            {editingUserId && (
              <button
                onClick={() => {
                  setEditingUserId(null);
                  setName("");
                  setEmail("");
                  setBio("");
                }}
                className="text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSaveUser} className="space-y-3">
            <div>
              <label className="block text-neutral-400 mb-1 font-bold">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., Samantha Alwis"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-bold">Email Address *</label>
              <input
                type="email"
                required
                placeholder="samantha@goldlanka.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-bold">Role & Permissions</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-400"
              >
                <option value="super_admin">Super Admin (Full Access + DB)</option>
                <option value="editor">Editor (Publish & Moderate)</option>
                <option value="author">Author (Create & Edit Own Posts)</option>
                <option value="contributor">Contributor (Submit Drafts)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Author Bio</label>
              <textarea
                rows={2}
                placeholder="Brief professional background for E-E-A-T author box..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <UserPlus className="h-4 w-4" />
              <span>{editingUserId ? "Update User" : "Save Team Member"}</span>
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2 space-y-3 font-mono text-xs">
          {users.map((u) => (
            <div key={u.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4 hover:border-neutral-700 transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt={u.name}
                  className="h-12 w-12 rounded-xl object-cover border border-neutral-700 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm truncate m-0">{u.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.role === "super_admin"
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        : u.role === "editor"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                    }`}>
                      {u.role.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-[11px] truncate m-0 mt-0.5">
                    {u.email}
                  </p>
                  {u.bio && (
                    <p className="text-neutral-500 text-[10px] truncate m-0 mt-0.5">
                      {u.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleEditUser(u)}
                  className="p-2 bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 rounded-lg transition-colors cursor-pointer"
                  title="Edit user"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                {u.role !== "super_admin" && (
                  <button
                    onClick={() => handleDeleteUser(u.id, u.name)}
                    className="p-2 bg-neutral-800 hover:bg-rose-500 hover:text-white text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
