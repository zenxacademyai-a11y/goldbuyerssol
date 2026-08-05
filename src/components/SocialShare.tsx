/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Share2, 
  Copy, 
  Check, 
  Globe, 
  Eye, 
  ExternalLink, 
  Sparkles,
  MessageCircle,
  Send,
  Info
} from "lucide-react";
import { BlogPost } from "../types.js";
import { updateMetaTags } from "../lib/seo.js";

interface SocialShareProps {
  post: BlogPost;
  variant?: "inline" | "card" | "compact" | "floating";
  className?: string;
  showPreviewToggle?: boolean;
}

export default function SocialShare({
  post,
  variant = "inline",
  className = "",
  showPreviewToggle = true,
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showOgPreview, setShowOgPreview] = useState(false);
  const [activePlatformPreview, setActivePlatformPreview] = useState<"facebook" | "whatsapp" | "twitter" | "linkedin">("whatsapp");
  const [customNote, setCustomNote] = useState("");

  // Construct absolute URL for the blog post
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.goldlanka.lk";
  const postUrl = `${origin}/blog/${post.slug || post.id}`;
  
  // Clean plaintext title and description
  const cleanTitle = post.title.trim();
  const rawDesc = post.metaDescription || post.excerpt || post.content.replace(/<[^>]+>/g, "").substring(0, 160) + "...";
  const cleanDesc = rawDesc.replace(/\s+/g, " ").trim();
  const imageUrl = post.image || "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80";

  // Dynamically ensure Open Graph tags are live on document head when this component mounts for an article
  useEffect(() => {
    updateMetaTags({
      title: post.metaTitle || `${cleanTitle} | Gold Buyers Colombo`,
      description: cleanDesc,
      keywords: post.focusKeyword ? `${post.focusKeyword}, gold price colombo, sell gold sri lanka` : "gold price colombo, sell gold sri lanka",
      url: postUrl,
      imageUrl,
      type: "article",
      author: post.author || "Chief Appraiser Admin",
      publishedTime: post.date,
      section: post.category,
    });
  }, [post, postUrl, cleanTitle, cleanDesc, imageUrl]);

  // Share message strings
  const textMessage = customNote 
    ? `${customNote}\n\n📌 "${cleanTitle}"`
    : `📌 ${cleanTitle}\n\nRead expert Sri Lankan gold market analysis and valuation insights from Gold Buyers Colombo:`;

  // Encoded URLs for social channels
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${textMessage}\n${postUrl}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(cleanTitle)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(`" ${cleanTitle} " - Gold Buyers Colombo Insights:`)}&hashtags=GoldBuyers,Colombo,SriLanka,GoldPrice`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;

  // Handle Clipboard Copy
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(postUrl);
      } else {
        const input = document.createElement("input");
        input.value = postUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  // Handle Native Browser Web Share
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: cleanTitle,
          text: cleanDesc,
          url: postUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log("Share dismissed or error:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Custom Brand Icons (SVG)
  const WhatsAppIcon = () => (
    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const TwitterXIcon = () => (
    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const LinkedInIcon = () => (
    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 1 0 1.6 1.6 1.6 1.6 0 0 0-1.6-1.6z"/>
    </svg>
  );

  // Compact floating button bar
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on WhatsApp"
          className="p-2 rounded-lg bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all shadow-sm flex items-center justify-center cursor-pointer"
        >
          <WhatsAppIcon />
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
          className="p-2 rounded-lg bg-[#1877F2] text-white hover:bg-[#166fe5] transition-all shadow-sm flex items-center justify-center cursor-pointer"
        >
          <FacebookIcon />
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Twitter / X"
          className="p-2 rounded-lg bg-neutral-900 text-white hover:bg-black transition-all shadow-sm border border-neutral-700 flex items-center justify-center cursor-pointer"
        >
          <TwitterXIcon />
        </a>
        <button
          onClick={handleCopyLink}
          title="Copy Article Link"
          className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-amber-500 hover:text-black transition-all shadow-sm flex items-center justify-center cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 font-bold" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  // Floating Bar (Bottom / Side sticky)
  if (variant === "floating") {
    return (
      <div className={`fixed bottom-6 right-6 z-40 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce-subtle ${className}`}>
        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest pl-2 pr-1 font-bold hidden sm:inline-block">
          Share Article
        </span>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#25D366] text-white hover:scale-105 transition-all shadow-md flex items-center justify-center cursor-pointer"
          title="Share on WhatsApp"
        >
          <WhatsAppIcon />
        </a>

        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#1877F2] text-white hover:scale-105 transition-all shadow-md flex items-center justify-center cursor-pointer"
          title="Share on Facebook"
        >
          <FacebookIcon />
        </a>

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-neutral-950 text-white border border-neutral-700 hover:scale-105 transition-all shadow-md flex items-center justify-center cursor-pointer"
          title="Share on Twitter/X"
        >
          <TwitterXIcon />
        </a>

        <button
          onClick={handleCopyLink}
          className="p-2.5 rounded-xl bg-amber-500 text-neutral-950 hover:bg-amber-400 hover:scale-105 transition-all shadow-md flex items-center justify-center cursor-pointer font-bold"
          title="Copy Link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  // Primary Full-Featured Inline / Card Component
  return (
    <div className={`bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 ${className}`}>
      
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold block mb-0.5">
            Social Distribution & Amplification
          </span>
          <h4 className="text-base sm:text-lg font-serif font-black text-neutral-950 dark:text-white flex items-center gap-2 m-0">
            <Share2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span>Share Article with Traders & Clients</span>
          </h4>
        </div>

        {/* Toggle OG Live Preview */}
        {showPreviewToggle && (
          <button
            type="button"
            onClick={() => setShowOgPreview(!showOgPreview)}
            className="text-xs font-mono px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>{showOgPreview ? "Hide Social Preview" : "Preview Social Card"}</span>
          </button>
        )}
      </div>

      {/* Social Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* WhatsApp Direct */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 text-xs no-underline"
        >
          <WhatsAppIcon />
          <span>WhatsApp</span>
          <span className="absolute -top-2 -right-1 bg-white text-[#25D366] text-[9px] font-mono px-1.5 py-0.2 rounded-full font-extrabold shadow-sm">
            Popular
          </span>
        </a>

        {/* Facebook Direct */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 text-xs no-underline"
        >
          <FacebookIcon />
          <span>Facebook</span>
        </a>

        {/* Twitter/X Direct */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 bg-neutral-900 hover:bg-black text-white border border-neutral-700 font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 text-xs no-underline"
        >
          <TwitterXIcon />
          <span>Twitter / X</span>
        </a>

        {/* LinkedIn Direct */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 bg-[#0A66C2] hover:bg-[#08529c] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 text-xs no-underline"
        >
          <LinkedInIcon />
          <span>LinkedIn</span>
        </a>

      </div>

      {/* Auxiliary Action Row: Native Share & Copy Link */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          onClick={handleCopyLink}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl border text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            copied
              ? "bg-emerald-500 text-neutral-950 border-emerald-400 shadow-md"
              : "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-amber-500"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Link Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Copy Direct Article URL</span>
            </>
          )}
        </button>

        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
          <button
            onClick={handleNativeShare}
            className="py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-amber-500 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Device Share Sheet</span>
          </button>
        )}
      </div>

      {/* Optional Custom Note Input */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 mb-1.5 text-xs font-mono text-neutral-600 dark:text-neutral-400">
          <MessageCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span>Add Custom Quote / Note before sharing:</span>
        </div>
        <input
          type="text"
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          placeholder="e.g. Check out this guide on 22K gold rates before selling in Pettah!"
          className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-amber-500 font-sans"
        />
      </div>

      {/* Interactive Open Graph Live Card Preview Modal / Drawer */}
      {showOgPreview && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3 animate-fade-in">
          
          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="text-xs font-mono uppercase text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span>Open Graph & Rich Snippet Live Social Card</span>
            </span>

            {/* Platform Selector */}
            <div className="flex gap-1 bg-white dark:bg-black p-1 rounded-xl border border-neutral-300 dark:border-neutral-800 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setActivePlatformPreview("whatsapp")}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                  activePlatformPreview === "whatsapp" ? "bg-[#25D366] text-white font-bold" : "text-neutral-500"
                }`}
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setActivePlatformPreview("facebook")}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                  activePlatformPreview === "facebook" ? "bg-[#1877F2] text-white font-bold" : "text-neutral-500"
                }`}
              >
                Facebook
              </button>
              <button
                type="button"
                onClick={() => setActivePlatformPreview("twitter")}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                  activePlatformPreview === "twitter" ? "bg-black text-white font-bold" : "text-neutral-500"
                }`}
              >
                Twitter / X
              </button>
            </div>
          </div>

          {/* Social Card Preview Frame */}
          <div className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-lg max-w-lg mx-auto transition-all">
            
            {/* WhatsApp Card Style */}
            {activePlatformPreview === "whatsapp" && (
              <div className="p-3 bg-[#e5ddd5] dark:bg-neutral-900 space-y-2">
                <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-md border border-neutral-200 dark:border-neutral-700">
                  <div className="relative h-44 overflow-hidden bg-neutral-900">
                    <img src={imageUrl} alt={cleanTitle} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-mono px-2 py-0.5 rounded backdrop-blur">
                      GOLDLANKA.LK
                    </span>
                  </div>
                  <div className="p-3 space-y-1">
                    <h5 className="text-xs font-serif font-bold text-neutral-900 dark:text-white line-clamp-2 leading-snug">
                      {cleanTitle}
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                      {cleanDesc}
                    </p>
                    <span className="text-[10px] font-mono text-neutral-400 block pt-1">
                      www.goldlanka.lk
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-xl p-2.5 text-xs text-neutral-800 dark:text-neutral-200 shadow-sm font-sans flex items-end justify-between">
                  <span>{customNote || `📌 ${cleanTitle}`}</span>
                  <span className="text-[9px] text-neutral-400 font-mono">10:42 AM ✓✓</span>
                </div>
              </div>
            )}

            {/* Facebook Card Style */}
            {activePlatformPreview === "facebook" && (
              <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="p-3 flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="h-8 w-8 rounded-full bg-amber-500 text-neutral-950 font-bold flex items-center justify-center text-xs">
                    GBC
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-neutral-900 dark:text-white leading-none">Gold Buyers Colombo</h6>
                    <span className="text-[10px] text-neutral-500 font-mono">Sponsored / Market Post • 🌐</span>
                  </div>
                </div>

                <div className="px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200">
                  {customNote || `Read our latest Sri Lankan gold market insights: "${cleanTitle}"`}
                </div>

                <div className="relative h-48 bg-neutral-900">
                  <img src={imageUrl} alt={cleanTitle} className="w-full h-full object-cover" />
                </div>

                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">GOLDLANKA.LK</span>
                  <h5 className="text-xs font-serif font-bold text-neutral-900 dark:text-white line-clamp-1">{cleanTitle}</h5>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-1">{cleanDesc}</p>
                </div>
              </div>
            )}

            {/* Twitter / X Card Style */}
            {activePlatformPreview === "twitter" && (
              <div className="bg-black text-white p-3 space-y-2 border border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-amber-500 text-black font-extrabold flex items-center justify-center text-xs">
                    GB
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white">Gold Buyers Colombo</span>{" "}
                    <span className="text-neutral-500">@GoldBuyersSL</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-200 leading-normal">
                  {customNote || `Market Analysis: "${cleanTitle}" #GoldBuyers #Colombo #GoldPrice`}
                </p>

                <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
                  <img src={imageUrl} alt={cleanTitle} className="w-full h-40 object-cover" />
                  <div className="p-2.5 bg-neutral-950">
                    <span className="text-[10px] text-neutral-500 font-mono block">goldlanka.lk</span>
                    <h5 className="text-xs font-bold text-white line-clamp-1">{cleanTitle}</h5>
                    <p className="text-[10px] text-neutral-400 line-clamp-1">{cleanDesc}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="text-center">
            <span className="text-[10px] font-mono text-neutral-500 flex items-center justify-center gap-1">
              <Info className="h-3 w-3 text-amber-500" />
              <span>Dynamic Open Graph (OG) tags are active on <code>&lt;head&gt;</code> for social crawlers.</span>
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
