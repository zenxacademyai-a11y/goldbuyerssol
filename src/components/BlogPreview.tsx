/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Search, Calendar, User, ArrowLeft, Share2, FileText, ChevronRight, Award, MapPin, Cpu, BookOpen, ShieldCheck, CheckCircle2, ChevronDown } from "lucide-react";
import { Language, translations } from "../lib/translations.js";
import { BlogPost } from "../types.js";
import { updateMetaTags } from "../lib/seo.js";

interface BlogPreviewProps {
  currentLang: Language;
  blogs: BlogPost[];
  onRefresh?: () => void;
  initialActiveBlogSlug?: string | null;
  onBackToCatalog?: () => void;
  onNavigateHomeSection?: (sectionId: string) => void;
}

export default function BlogPreview({ 
  currentLang, 
  blogs, 
  onRefresh, 
  initialActiveBlogSlug, 
  onBackToCatalog,
  onNavigateHomeSection
}: BlogPreviewProps) {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Extract all headings in the article for TOC
  const getArticleHeadings = (content: string) => {
    if (!content) return [];
    const isHtml = content.trim().startsWith("<") || /<[a-z][\s\S]*>/i.test(content);
    if (isHtml) {
      const headings: { id: string; title: string }[] = [];
      const regex = /<(h[1-4])[^>]*>(.*?)<\/h[1-4]>/gi;
      let match;
      let index = 0;
      while ((match = regex.exec(content)) !== null) {
        const headingText = match[2].replace(/<[^>]*>/g, "").trim();
        if (headingText) {
          headings.push({ id: `html-heading-${index++}`, title: headingText });
        }
      }
      return headings;
    } else {
      return content
        .split("\n")
        .filter(l => l.startsWith("### "))
        .map((h, i) => ({
          id: `heading-${i}`,
          title: h.replace("### ", "").trim()
        }));
    }
  };

  // Auto-activate article if slug is passed
  useEffect(() => {
    if (initialActiveBlogSlug) {
      const found = blogs.find(b => b.slug === initialActiveBlogSlug);
      if (found) {
        setActiveArticle(found);
      }
    }
  }, [initialActiveBlogSlug, blogs]);

  // Dynamic FAQ Schema injection for AEO / GEO SEO optimization
  useEffect(() => {
    if (!activeArticle || !activeArticle.questions || activeArticle.questions.length === 0) {
      const existingScript = document.getElementById("faq-jsonld-schema");
      if (existingScript) existingScript.remove();
      return;
    }

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": activeArticle.questions.map((q) => ({
        "@type": "Question",
        "name": q.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.a,
        },
      })),
    };

    const existingScript = document.getElementById("faq-jsonld-schema");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.id = "faq-jsonld-schema";
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("faq-jsonld-schema");
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [activeArticle]);

  // Dynamic SEO Page Title, Meta description & keywords update for Blog catalog & specific articles
  useEffect(() => {
    if (activeArticle) {
      const metaTitle = activeArticle.metaTitle || `${activeArticle.title} | GBC Colombo`;
      const metaDesc = activeArticle.metaDescription || `Read "${activeArticle.title}" by ${activeArticle.author} on Gold Buyers Colombo (GBC) - expert guidance for selling gold in Sri Lanka.`;
      const metaKeywords = activeArticle.focusKeyword 
        ? `${activeArticle.focusKeyword}, gold price colombo, sell gold sri lanka, ${activeArticle.category.toLowerCase()}`
        : `gold price colombo, sell gold sri lanka, ${activeArticle.category.toLowerCase()}`;
      
      updateMetaTags(metaTitle, metaDesc, metaKeywords);
    } else {
      const title = currentLang === "si"
        ? "රන් මාර්ගෝපදේශ බ්ලොග් අඩවිය | ගෝල්ඩ් බයර්ස් කොළඹ"
        : currentLang === "ta"
        ? "தங்க வழிகாட்டி வலைப்பதிவு | கோல்ட் பையர்ஸ் கொழும்பு"
        : "Colombo Gold Selling Guides & Market Insights Blog | GBC";

      const desc = currentLang === "si"
        ? "ශ්‍රී ලංකාවේ රන් විකිණීම, පෙට්ටා රන් වංචාවලින් බේරීම, උකස් අනුපාත සංසන්දනය සහ 916 මුද්‍රා පිළිබඳ ගැඹුරු විශ්ලේෂණාත්මක මාර්ගෝපදේශ."
        : currentLang === "ta"
        ? "இலங்கையில் தங்கம் விற்பது, பெட்டா தங்க மோசடிகளில் இருந்து தப்பிப்பது, அடகு விகிதங்களை ஒப்பிடுவது பற்றிய விரிவான வழிகாட்டிகள்."
        : "Read comprehensive analysis and expert guidance on gold prices, pawn-liquidation, genuine jewelry valuations, and avoiding local market pitfalls in Colombo, Sri Lanka.";

      const keywords = "colombo gold blog, sri lanka gold news, gold price analysis, sell gold tips colombo, pawn gold liquidation sri lanka, gbc articles";

      updateMetaTags(title, desc, keywords);
    }
  }, [activeArticle, currentLang]);

  // Available categories
  const categories = ["All", "Gold Price", "Gold Investment", "Selling Gold", "Jewelry", "Sri Lanka News"];

  // Filter blog list
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShare = (slug: string, title: string) => {
    const shareUrl = `${window.location.origin}/blog/${slug}`;
    if (navigator.share) {
      navigator.share({
        title,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Article link copied to clipboard!");
    }
  };

  // Helper to resolve highly descriptive, SEO-friendly anchor texts targeting 'Gold Buyer in Colombo'
  // for all outgoing internal links referencing Service, Contact, and About pages or sections.
  const getSeoAnchorText = (url: string, originalText: string): string => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("calculator") || lowerUrl.includes("#calculator")) {
      return "GBC Gold Buyer in Colombo Valuation Calculator";
    }
    if (lowerUrl.includes("rates") || lowerUrl.includes("#rates")) {
      return "Live Gold Payout Rates at GBC - Top Gold Buyer in Colombo";
    }
    if (lowerUrl.includes("contact") || lowerUrl.includes("#contact")) {
      return "Schedule a Free Valuation at GBC - Trusted Gold Buyer in Colombo";
    }
    if (lowerUrl.includes("about") || lowerUrl.includes("#about")) {
      return "About GBC - Leading Gold Buyer in Colombo";
    }
    return originalText;
  };

  // Parsers for bold formatting and hyperlinks inside text strings
  const renderTextWithFormatting = (text: string): React.ReactNode => {
    if (!text) return "";
    
    // Split by bold (**text**) and markdown links ([text](url))
    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-extrabold text-neutral-950">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          const [, anchor, url] = match;
          const seoAnchor = getSeoAnchorText(url, anchor);
          return (
            <a 
              key={i} 
              href={url} 
              className="text-amber-700 hover:text-amber-900 underline font-semibold transition-colors"
              target={url.startsWith("http") ? "_blank" : undefined}
              rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {seoAnchor}
            </a>
          );
        }
      }
      return part;
    });
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href) return;

    // Handle internal blog links (e.g. /blog/some-slug)
    if (href.startsWith("/blog/")) {
      e.preventDefault();
      const slug = href.replace("/blog/", "");
      const found = blogs.find(b => b.slug === slug);
      if (found) {
        setActiveArticle(found);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (href.startsWith("#")) {
      e.preventDefault();
      const sectionId = href.substring(1);
      
      // If the element exists on this page, scroll to it
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else if (onNavigateHomeSection) {
        // Otherwise, ask parent to switch to home and scroll
        onNavigateHomeSection(sectionId);
      }
    }
  };

  // Main markdown body parser that structuralizes headers, paragraphs, lists, and tables
  const renderMarkdownContent = (content: string) => {
    if (!content) return "";

    const isHtml = content.trim().startsWith("<") || /<[a-z][\s\S]*>/i.test(content);
    if (isHtml) {
      // Inject IDs for dynamic scrolling TOC links matching HTML headings
      let headingIndex = 0;
      const htmlWithIds = content.replace(/<(h[1-4])([^>]*)>(.*?)<\/h[1-4]>/gi, (match, tag, attrs, text) => {
        if (attrs.includes("id=")) {
          return match;
        }
        const id = `html-heading-${headingIndex++}`;
        return `<${tag}${attrs} id="${id}">${text}</${tag}>`;
      });

      // Post-process HTML anchor tags to automatically use descriptive SEO-friendly anchor text
      const htmlWithSeoLinks = htmlWithIds.replace(/<a\s+([^>]*href=["']([^"']+)["']?[^>]*)>(.*?)<\/a>/gi, (match, attrs, href, innerText) => {
        const seoAnchor = getSeoAnchorText(href, innerText);
        return `<a ${attrs}>${seoAnchor}</a>`;
      });

      return (
        <div 
          className="rich-text-content prose prose-amber max-w-none text-neutral-800 leading-relaxed text-sm sm:text-base space-y-4"
          dangerouslySetInnerHTML={{ __html: htmlWithSeoLinks }}
          onClick={handleContentClick}
        />
      );
    }

    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let headingCounter = 0;
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      
      // 1. Skip empty lines
      if (line.trim() === "") {
        elements.push(<div key={`space-${i}`} className="h-4"></div>);
        i++;
        continue;
      }
      
      // 2. Handle Headings
      if (line.startsWith("### ")) {
        const headingText = line.replace("### ", "").trim();
        const headingId = `heading-${headingCounter++}`;
        elements.push(
          <h3 
            key={`h3-${i}`} 
            id={headingId}
            className="text-2xl font-serif font-black text-neutral-950 mt-10 mb-4 scroll-mt-24 border-b border-neutral-100 pb-2"
          >
            {renderTextWithFormatting(headingText)}
          </h3>
        );
        i++;
        continue;
      }
      
      if (line.startsWith("#### ")) {
        const headingText = line.replace("#### ", "").trim();
        elements.push(
          <h4 key={`h4-${i}`} className="text-xl font-serif font-extrabold text-amber-800 mt-6 mb-3">
            {renderTextWithFormatting(headingText)}
          </h4>
        );
        i++;
        continue;
      }
      
      // 3. Handle Tables (consecutive lines starting with |)
      if (line.startsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].startsWith("|")) {
          tableLines.push(lines[i]);
          i++;
        }
        
        const rows = tableLines.map(tl => {
          const cells = tl.split("|").map(cell => cell.trim());
          if (cells[0] === "") cells.shift();
          if (cells[cells.length - 1] === "") cells.pop();
          return cells;
        });
        
        if (rows.length > 0) {
          const headerRow = rows[0];
          let bodyRows = rows.slice(1);
          
          if (bodyRows.length > 0 && bodyRows[0].every(cell => cell.includes("-") || cell.includes(":"))) {
            bodyRows = bodyRows.slice(1);
          }
          
          elements.push(
            <div key={`table-${i}`} className="my-8 overflow-x-auto rounded-xl border border-neutral-200 shadow-sm">
              <table className="w-full text-left border-collapse bg-white text-xs sm:text-sm">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    {headerRow.map((cell, idx) => (
                      <th key={idx} className="p-3 sm:p-4 font-mono font-bold text-neutral-800 uppercase tracking-wider">
                        {renderTextWithFormatting(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {bodyRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-neutral-50/50 transition-colors">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="p-3 sm:p-4 text-neutral-700 leading-relaxed">
                          {renderTextWithFormatting(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }
      
      // 4. Handle Lists (consecutive lines starting with * )
      if (line.startsWith("* ")) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].startsWith("* ")) {
          listItems.push(lines[i].replace("* ", "").trim());
          i++;
        }
        
        elements.push(
          <ul key={`list-${i}`} className="my-4 space-y-2.5 pl-5 list-disc text-sm sm:text-base text-neutral-800 leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} className="pl-1">
                {renderTextWithFormatting(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }
      
      // 5. Standard paragraph
      elements.push(
        <p key={`p-${i}`} className="text-sm sm:text-base text-neutral-800 leading-relaxed mb-4">
          {renderTextWithFormatting(line)}
        </p>
      );
      i++;
    }
    
    return elements;
  };

  if (activeArticle) {
    // Single Article Reader View
    return (
      <article className="py-20 px-4 bg-white text-neutral-900 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              setActiveArticle(null);
              setExpandedFaqIndex(null);
              onBackToCatalog?.();
              window.scrollTo({ top: 0 });
            }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-amber-750 hover:text-amber-600 transition-colors mb-8 focus:outline-none font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Articles</span>
          </button>

          {/* Article Header */}
          <header className="mb-10 border-b border-neutral-200 pb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full">
                {activeArticle.category}
              </span>
              {activeArticle.theme && (
                <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-widest bg-neutral-100 px-3 py-1 rounded-full">
                  Theme: {activeArticle.theme}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-neutral-950 tracking-tight mb-6 leading-tight">
              {activeArticle.title}
            </h1>
            
            {/* Meta details */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-500 font-mono">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-amber-700" />
                <span>Author: <strong className="text-neutral-900">{activeArticle.author}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-amber-700" />
                <span>Last Updated: {activeArticle.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                <span className="text-amber-700">Verified EEAT Authority</span>
              </div>
            </div>
          </header>

          {/* Grid Layout: Sidebar TOC + Article Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Table of Contents & SEO target parameters sidebar (lg:col-span-4) */}
            <aside className="lg:col-span-4 space-y-6 sticky top-28 hidden lg:block text-xs">
              
              {/* Dynamic TOC */}
              <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-xl shadow-sm">
                <h4 className="font-mono font-bold text-amber-700 uppercase tracking-wider border-b border-neutral-200 pb-2.5 mb-3.5 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Table of Contents</span>
                </h4>
                <ul className="space-y-3 text-neutral-600 font-sans">
                  <li className="flex items-center gap-1 text-neutral-950 font-bold border-l-2 border-amber-700 pl-2">
                    <a href="#overview" className="hover:text-amber-700 transition-colors">Article Overview</a>
                  </li>
                  {getArticleHeadings(activeArticle.content).map((h, i) => (
                    <li key={i} className="hover:text-amber-700 transition-colors flex items-center gap-1.5 pl-2">
                      <ChevronRight className="h-3 w-3 text-neutral-400" />
                      <a href={`#${h.id}`} className="hover:underline">{h.title}</a>
                    </li>
                  ))}
                  {activeArticle.questions && activeArticle.questions.length > 0 && (
                    <li key="faq-toc" className="hover:text-amber-700 transition-colors flex items-center gap-1.5 pl-2 font-semibold text-neutral-800">
                      <ChevronRight className="h-3 w-3 text-neutral-500" />
                      <a href="#faq-section">Frequently Asked Questions</a>
                    </li>
                  )}
                </ul>
              </div>

              {/* SEO & Search Grounding Sidebar Widget */}
              <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-xl shadow-sm space-y-4">
                <h4 className="font-mono font-bold text-amber-800 uppercase tracking-wider border-b border-amber-500/10 pb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>SEO Grounding Data</span>
                </h4>

                {activeArticle.focusKeyword && (
                  <div>
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">Focus Search Intent</span>
                    <p className="font-mono font-bold text-neutral-900 bg-white border border-amber-500/10 px-2 py-1 rounded text-[11px]">
                      "{activeArticle.focusKeyword}"
                    </p>
                  </div>
                )}

                {activeArticle.technicalContext && (
                  <div>
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1">Scientific Verification</span>
                    <p className="text-neutral-700 leading-relaxed font-sans text-[11px] bg-white border border-neutral-200 p-2 rounded">
                      {activeArticle.technicalContext}
                    </p>
                  </div>
                )}

                {activeArticle.localizedPointers && activeArticle.localizedPointers.length > 0 && (
                  <div>
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-1.5">GEO Location Context</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeArticle.localizedPointers.map((p, i) => (
                        <span key={i} className="bg-white border border-neutral-200 px-2 py-0.5 rounded text-[10px] text-neutral-600 font-mono inline-flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5 text-amber-700" />
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Share block */}
              <div className="pt-2">
                <button
                  onClick={() => handleShare(activeArticle.slug, activeArticle.title)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-50 border border-neutral-200 hover:border-amber-500 text-xs text-amber-800 font-mono uppercase tracking-wider rounded-lg font-bold shadow-sm hover:bg-white transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share Article Context</span>
                </button>
              </div>
            </aside>

            {/* Content Body (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-6">
              <div id="overview" className="border-l-4 border-amber-600 pl-4 py-2 italic text-neutral-700 text-sm sm:text-base leading-relaxed mb-6 bg-amber-500/5 rounded-r">
                <strong>Colombo Market Notice:</strong> This comprehensive guide contains verified analytical parameters and strict regulatory compliance guidelines compiled directly by Gold Buyers Colombo’s principal metallurgical desk to assist Sri Lankan gold owners.
              </div>

              {/* Enhanced markdown renderer with headings mapped to anchor IDs */}
              <div className="prose prose-amber max-w-none">
                {renderMarkdownContent(activeArticle.content)}
              </div>

              {/* Tags Display */}
              {activeArticle.tags.length > 0 && (
                <div className="pt-6 border-t border-neutral-200 flex flex-wrap gap-2 text-xs font-mono">
                  {activeArticle.tags.map((t) => (
                    <span key={t} className="bg-neutral-50 border border-neutral-200 px-3 py-1 rounded-full text-neutral-600 hover:text-neutral-950 hover:bg-amber-500/5 transition-colors">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Dynamic Interactive FAQ Accordion */}
              {activeArticle.questions && activeArticle.questions.length > 0 && (
                <div id="faq-section" className="mt-16 pt-10 border-t border-neutral-200 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-800">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-black text-neutral-950">
                        Frequently Asked Questions
                      </h3>
                      <p className="text-xs text-neutral-500 font-mono">Fully Indexed in JSON-LD FAQ Schema for Search Engines</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {activeArticle.questions.map((faq, i) => {
                      const isExpanded = expandedFaqIndex === i;
                      return (
                        <div 
                          key={i} 
                          className={`border rounded-xl transition-all duration-300 ${
                            isExpanded 
                              ? "border-amber-500/30 bg-amber-500/[0.01] shadow-sm" 
                              : "border-neutral-200 bg-white hover:border-neutral-350"
                          }`}
                        >
                          <button
                            onClick={() => setExpandedFaqIndex(isExpanded ? null : i)}
                            className="w-full flex justify-between items-center p-4 sm:p-5 text-left font-serif font-black text-sm sm:text-base text-neutral-900 hover:text-amber-700 transition-colors focus:outline-none"
                          >
                            <span className="pr-4">{faq.q}</span>
                            <ChevronDown 
                              className={`h-4 w-4 text-amber-700 shrink-0 transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                              }`} 
                            />
                          </button>
                          <div 
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              isExpanded ? "max-h-[500px] border-t border-neutral-100" : "max-h-0"
                            }`}
                          >
                            <div className="p-4 sm:p-5 text-xs sm:text-sm text-neutral-700 leading-relaxed bg-neutral-50/50">
                              {faq.a}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* EEAT Author Credential Card */}
              <div className="mt-16 bg-neutral-50 border border-neutral-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-600 to-yellow-500 flex items-center justify-center text-black font-serif font-black text-2xl shrink-0 shadow-inner border-2 border-white">
                  SA
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h4 className="text-lg font-serif font-black text-neutral-950">{activeArticle.author}</h4>
                    <span className="text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Senior Assayer & CFO
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Samantha Alwis brings more than 18 years of technical metallurgy and gold valuation expertise in Colombo, Sri Lanka. Having specialized in XRF spectroscopy calibration and local banking pawning liquidations, Samantha's articles provide honest, scientifically precise, and regulatory-sound guidance for all Sri Lankan gold sellers.
                  </p>
                  <div className="flex flex-wrap gap-y-1 gap-x-4 text-[10px] font-mono text-neutral-500">
                    <span className="flex items-center gap-1"><Cpu className="h-3.5 w-3.5 text-amber-700" /> Bruker XRF Certified Appraiser</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5 text-amber-700" /> Sri Lanka Gold Council Advisor</span>
                  </div>
                </div>
              </div>

              {/* Premium Direct CTA Box */}
              <div className="bg-neutral-900 text-white rounded-2xl p-8 mt-12 relative overflow-hidden shadow-xl">
                <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
                
                <h4 className="text-xl sm:text-2xl font-serif font-black text-amber-500 mb-3">
                  Secure Colombo's Ultimate Gold Payout Value
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 max-w-2xl">
                  Bypass traditional Pettah scrap gold deductions, "Kapaaha" wastage charges, and stressful negotiation. Visit our highly secure, digitalized gold buying branch for a free XRF spectroscopy scan and instant cash.
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <a 
                    href="tel:0718321321" 
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-6 py-3 text-xs font-black uppercase rounded-lg shadow-lg hover:brightness-110 transition-all font-mono tracking-wider"
                  >
                    Call Appraisal Desk: 0718 321 321
                  </a>
                  <a 
                    href="#calculator" 
                    onClick={() => {
                      setActiveArticle(null);
                      setExpandedFaqIndex(null);
                    }} 
                    className="border border-neutral-700 hover:border-amber-500 text-white hover:text-amber-400 px-6 py-3 text-xs font-bold uppercase rounded-lg transition-colors font-mono tracking-wider bg-neutral-950/40"
                  >
                    Open Live Rate Calculator
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </article>
    );
  }

  return (
    <section className="py-20 px-4 bg-white text-neutral-900 scroll-mt-20 border-t border-neutral-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-700 block mb-3 font-semibold">
            Knowledge Base
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-950 mb-4">
            Gold Price Insights & Guides Colombo
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base">
            Expert articles optimized for "Gold Buyer in Colombo" search trends, giving you maximum value and knowledge before trading.
          </p>
        </div>

        {/* Search & Category Filter bar */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 sm:p-6 mb-12 shadow-sm space-y-4">
          
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search guides, price trends, pawning analysis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-neutral-250 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-800 focus:outline-none focus:border-amber-500 font-sans shadow-sm"
            />
          </div>

          {/* Category Tabs list */}
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-neutral-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all ${
                  selectedCategory === cat
                    ? "bg-amber-600 text-black font-extrabold"
                    : "text-neutral-600 hover:text-amber-700 hover:bg-neutral-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts list grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm">
            <Search className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-600 text-xs font-mono uppercase tracking-widest">
              No matching articles found. Try another search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post) => (
              <article
                key={post.id}
                onClick={() => {
                  setActiveArticle(post);
                  window.scrollTo({ top: 0 });
                }}
                className="bg-neutral-50 rounded-xl border border-neutral-200 hover:border-amber-500/30 transition-all overflow-hidden flex flex-col justify-between cursor-pointer group hover:shadow-md hover:shadow-amber-500/5 shadow-sm"
              >
                <div className="p-6">
                  {/* Category */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">{post.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-serif font-bold text-neutral-900 group-hover:text-amber-700 transition-colors mb-3 leading-snug">
                    {post.title}
                  </h3>

                  {/* Body preview */}
                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                    {(() => {
                      const isHtml = post.content.trim().startsWith("<") || /<[a-z][\s\S]*>/i.test(post.content);
                      const cleanText = isHtml
                        ? post.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
                        : post.content.replace(/[#*`]/g, "");
                      return cleanText.substring(0, 160) + "...";
                    })()}
                  </p>
                </div>

                {/* Footer read action */}
                <div className="px-6 py-4 border-t border-neutral-200 flex justify-between items-center bg-neutral-100/30 group-hover:bg-amber-50/10 transition-colors text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold">
                  <span>Read Article</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
