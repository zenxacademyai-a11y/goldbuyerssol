/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ArrowRight, Calendar, User, ChevronRight, BookOpen } from "lucide-react";
import { Language } from "../lib/translations.js";
import { BlogPost } from "../types.js";

interface RecentPostsProps {
  currentLang: Language;
  blogs: BlogPost[];
  onSelectBlog: (slug: string) => void;
  onViewAll: () => void;
}

const localT = {
  en: {
    title: "Latest Gold Market Guides & Insights",
    subtitle: "Stay informed about live gold rates, pawn liquidations, purity standards, and how to maximize your payouts in Colombo.",
    readMore: "Read Article",
    viewAll: "View All Market Guides",
    by: "By"
  },
  si: {
    title: "නවතම රන් වෙළඳපල මාර්ගෝපදේශ සහ තොරතුරු",
    subtitle: "රන් මිල ප්‍රවණතා, උකස් රන් මුදා හැරීම, කැරට් පිරිසිදුතාවය සහ කොළඹින් රන් සඳහා ඉහළම මුදල ලබා ගන්නා ආකාරය ගැන දැනුවත් වන්න.",
    readMore: "ලිපිය කියවන්න",
    viewAll: "සියලුම ලිපි නැරඹීමට",
    by: "කර්තෘ"
  },
  ta: {
    title: "சமீபத்திய தங்கச் சந்தை வழிகாட்டிகள் & ஆலோசனைகள்",
    subtitle: "தங்க விலைகள், அடகு தங்கத்தை மீட்பது, காரட் தூய்மை மற்றும் கொழும்பில் அதிகபட்ச லாபம் பெறுவது எப்படி என்பது பற்றி தெரிந்து கொள்ளுங்கள்.",
    readMore: "கட்டுரையை வாசிக்கவும்",
    viewAll: "அனைத்து வழிகாட்டிகளையும் காண்க",
    by: "எழுதியவர்"
  }
};

export default function RecentPosts({ currentLang, blogs, onSelectBlog, onViewAll }: RecentPostsProps) {
  const t = localT[currentLang] || localT.en;

  // Filter only published blogs and take the latest 3
  const recentBlogs = blogs
    .filter((b) => b.isPublished)
    .slice(0, 3);

  if (recentBlogs.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-neutral-50 text-neutral-900 border-t border-b border-neutral-100" id="recent-insights">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-mono tracking-widest text-amber-700 block mb-3 font-bold flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>GBC Technical Desk</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-950 mb-4 tracking-tight">
              {t.title}
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="shrink-0 inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-700 hover:text-amber-900 transition-colors border-b-2 border-amber-500/20 hover:border-amber-700 pb-1 align-bottom self-start md:self-end"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentBlogs.map((post) => {
            // Strip HTML tags or markdown notations for clean preview text
            const isHtml = post.content.trim().startsWith("<") || /<[a-z][\s\S]*>/i.test(post.content);
            const cleanContent = isHtml
              ? post.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
              : post.content
                  .replace(/[#*`|[\]()\-:_]/g, " ")
                  .replace(/\s+/g, " ")
                  .trim();
            const excerpt = cleanContent.length > 150 ? cleanContent.substring(0, 150) + "..." : cleanContent;

            return (
              <article
                key={post.id}
                onClick={() => onSelectBlog(post.slug)}
                className="bg-white rounded-xl border border-neutral-200 hover:border-amber-500/30 transition-all overflow-hidden flex flex-col justify-between cursor-pointer group hover:shadow-lg hover:shadow-amber-500/5 shadow-sm"
              >
                <div className="p-6">
                  {/* Category & Date */}
                  <div className="flex justify-between items-center mb-4 text-[10px] font-mono">
                    <span className="font-bold text-amber-700 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="text-neutral-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-serif font-bold text-neutral-900 group-hover:text-amber-800 transition-colors mb-3 leading-snug">
                    {post.title}
                  </h3>

                  {/* Author metadata */}
                  <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-mono mb-4">
                    <User className="h-3.5 w-3.5 text-amber-600" />
                    <span>{t.by} <strong className="text-neutral-800">{post.author}</strong></span>
                  </div>

                  {/* Body Preview */}
                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                    {excerpt}
                  </p>
                </div>

                {/* Card footer CTA */}
                <div className="px-6 py-4 border-t border-neutral-200 flex justify-between items-center bg-neutral-50 group-hover:bg-amber-50/10 transition-colors text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold">
                  <span>{t.readMore}</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
