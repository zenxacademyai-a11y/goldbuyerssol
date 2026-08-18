/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  MessageSquare, 
  CheckCircle2, 
  AlertOctagon, 
  Trash2, 
  Reply, 
  Search, 
  Filter, 
  Mail, 
  Globe, 
  Clock,
  Check,
  RefreshCw
} from "lucide-react";
import { CommentItem } from "../../types.js";

interface CmsCommentsTabProps {
  comments: CommentItem[];
  onRefresh: () => Promise<void>;
}

export default function CmsCommentsTab({ comments, onRefresh }: CmsCommentsTabProps) {
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending" | "spam" | "trash">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState("");

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const handleUpdateStatus = async (id: number | string, newStatus: "approved" | "pending" | "spam" | "trash") => {
    try {
      setIsProcessing(true);
      const res = await fetch(`/api/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Comment marked as ${newStatus.toUpperCase()}`);
        await onRefresh();
      }
    } catch (err: any) {
      alert("Failed to update comment status: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeletePermanent = async (id: number | string) => {
    if (!confirm("Permanently delete this comment from database?")) return;
    try {
      setIsProcessing(true);
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Comment permanently deleted.");
        await onRefresh();
      }
    } catch (err: any) {
      alert("Failed to delete comment: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendReply = async (comment: CommentItem) => {
    if (!replyText.trim()) return;
    try {
      setIsProcessing(true);
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: comment.post_id,
          author_name: "Chief Valuation Admin",
          author_email: "admin@goldlanka.lk",
          content: replyText,
        }),
      });
      if (res.ok) {
        showToast("Reply published to blog comment thread!");
        setReplyText("");
        setReplyingToId(null);
        await onRefresh();
      }
    } catch (err: any) {
      alert("Failed to submit reply: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredComments = comments.filter((c) => {
    const matchesFilter = filterStatus === "all" ? true : c.status === filterStatus;
    const matchesSearch = 
      c.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.author_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.post_title && c.post_title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-serif font-black text-white m-0">
              User Comments & Discussion Moderation
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-mono m-0 mt-0.5">
            Real-time reader discussions connected to MySQL with spam-filtering and instant reply tools.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-white placeholder-neutral-500 focus:border-purple-400 outline-none"
            />
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-xs font-mono flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        {[
          { id: "all", label: "All Comments", count: comments.length },
          { id: "approved", label: "Approved", count: comments.filter(c => c.status === "approved").length },
          { id: "pending", label: "Pending Review", count: comments.filter(c => c.status === "pending").length },
          { id: "spam", label: "Spam", count: comments.filter(c => c.status === "spam").length },
          { id: "trash", label: "Trash", count: comments.filter(c => c.status === "trash").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
              filterStatus === tab.id
                ? "bg-purple-500 text-white border-purple-400 shadow-md shadow-purple-500/20"
                : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-purple-500/40"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              filterStatus === tab.id ? "bg-white/20 text-white" : "bg-neutral-800 text-neutral-400"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-3 font-mono text-xs">
        {filteredComments.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl text-center text-neutral-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40 text-purple-400" />
            <p className="m-0">No comments found matching your current filter.</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div 
              key={comment.id} 
              className={`p-4 rounded-2xl border transition-all ${
                comment.status === "pending"
                  ? "bg-amber-950/15 border-amber-500/30"
                  : comment.status === "spam"
                  ? "bg-rose-950/15 border-rose-500/30 opacity-70"
                  : "bg-neutral-900 border-neutral-800"
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                    {comment.author_name.substring(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">{comment.author_name}</span>
                      <span className="text-neutral-400 text-[11px]">&lt;{comment.author_email}&gt;</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        comment.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : comment.status === "pending"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {comment.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      On article: <span className="text-amber-400 font-bold">{comment.post_title || "General"}</span> • {comment.created_at?.split("T")[0] || "Recently"}
                    </div>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {comment.status !== "approved" && (
                    <button
                      onClick={() => handleUpdateStatus(comment.id, "approved")}
                      disabled={isProcessing}
                      className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-400 border border-emerald-500/30 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-bold"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {comment.status !== "spam" && (
                    <button
                      onClick={() => handleUpdateStatus(comment.id, "spam")}
                      disabled={isProcessing}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-rose-500 hover:text-white text-neutral-300 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                    >
                      <AlertOctagon className="h-3.5 w-3.5" />
                      <span>Spam</span>
                    </button>
                  )}

                  <button
                    onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                    className="px-2.5 py-1 bg-neutral-800 hover:bg-purple-500 hover:text-white text-neutral-300 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Reply className="h-3.5 w-3.5" />
                    <span>Reply</span>
                  </button>

                  <button
                    onClick={() => handleDeletePermanent(comment.id)}
                    disabled={isProcessing}
                    className="p-1 bg-neutral-800 hover:bg-rose-500 hover:text-white text-rose-400 rounded-lg transition-all cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Comment Content */}
              <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-850 text-neutral-300 text-xs leading-relaxed">
                {comment.content}
              </div>

              {/* Inline Reply Form */}
              {replyingToId === comment.id && (
                <div className="mt-3 p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2">
                  <label className="text-[11px] text-purple-300 font-bold">Reply as Chief Valuation Admin:</label>
                  <textarea
                    rows={2}
                    placeholder="Type your official response..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-xs outline-none focus:border-purple-400"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setReplyingToId(null)}
                      className="px-3 py-1 bg-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(comment)}
                      disabled={isProcessing || !replyText.trim()}
                      className="px-3 py-1 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
