/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link2,
  Unlink2,
  Image,
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  Code2,
  Palette,
  Highlighter,
  Code,
  Eye,
  Type,
  Maximize2,
  Minimize2,
  Sparkles,
  Upload
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const FONTS = [
  { name: "Default (Inter)", value: "Inter, sans-serif" },
  { name: "Serif (Playfair)", value: "'Playfair Display', serif" },
  { name: "Tech (Space Grotesk)", value: "'Space Grotesk', sans-serif" },
  { name: "Mono (JetBrains)", value: "'JetBrains Mono', monospace" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Times New Roman", value: "'Times New Roman', serif" }
];

const FONT_SIZES = [
  { label: "12px (Small)", value: "12px" },
  { label: "14px (Normal)", value: "14px" },
  { label: "16px (Medium)", value: "16px" },
  { label: "18px (Large)", value: "18px" },
  { label: "20px (XL)", value: "20px" },
  { label: "24px (2XL)", value: "24px" },
  { label: "32px (3XL)", value: "32px" }
];

const COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Amber Gold", value: "#d97706" },
  { name: "Yellow", value: "#fbbf24" },
  { name: "Deep Amber", value: "#b45309" },
  { name: "Neutral Black", value: "#171717" },
  { name: "Gray 400", value: "#a3a3a3" },
  { name: "Gray 600", value: "#525252" },
  { name: "Emerald Green", value: "#10b981" },
  { name: "Rose Red", value: "#f43f5e" },
  { name: "Teal Blue", value: "#06b6d4" }
];

const HIGHLIGHTS = [
  { name: "None", value: "transparent" },
  { name: "Amber Light", value: "rgba(217, 119, 6, 0.15)" },
  { name: "Yellow Light", value: "rgba(251, 191, 36, 0.25)" },
  { name: "Emerald Light", value: "rgba(16, 185, 129, 0.15)" },
  { name: "Rose Light", value: "rgba(244, 63, 94, 0.15)" },
  { name: "Teal Light", value: "rgba(6, 182, 212, 0.15)" },
  { name: "Dark Overlay", value: "rgba(0, 0, 0, 0.05)" }
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Popovers and dropdown states
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [activeFont, setActiveFont] = useState(FONTS[0].value);
  const [activeSize, setActiveSize] = useState(FONT_SIZES[1].value);

  // Sync state from parent to editor once (to prevent cursor jumps while typing)
  useEffect(() => {
    if (editorRef.current) {
      // Force "styleWithCSS" to true for premium clean styling attributes
      document.execCommand("styleWithCSS", false, "true");
      
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCmd = (command: string, arg: string = "") => {
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(command, false, arg);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Google Docs Paste Handler to preserve formatting beautifully
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");

    if (html) {
      // Google Docs has massive CSS block in head. We want to clean or paste the main HTML elements.
      // Simply executing standard paste might bring in complex styles. 
      // But browsers' native rendering of standard text/html handles this quite well if injected.
      // For absolute security & cleanliness we can sanitise or directly insert standard parsed nodes.
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      
      // Select the main body or the outer google doc elements if matching
      const contentBody = doc.body;
      
      // Let's strip script and style blocks that might crash page
      const styles = contentBody.querySelectorAll("style, script, meta");
      styles.forEach(s => s.remove());

      // Insert clean HTML
      const cleanedHtml = contentBody.innerHTML;
      document.execCommand("insertHTML", false, cleanedHtml);
    } else {
      // Fallback to text insertion
      document.execCommand("insertText", false, text);
    }
    handleInput();
  };

  // Custom Selection Range Styling for Font Sizes & Font Families
  const applyCustomStyle = (styleName: string, styleValue: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      // If no text is highlighted, just apply native execCommand if available or return
      if (styleName === "font-size") {
        // Native size command mapped to fallback
        executeCmd("fontSize", "4");
      }
      return;
    }
    
    // Create wrapper span
    const span = document.createElement("span");
    span.style.setProperty(styleName, styleValue);
    
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      
      // Select the newly styled node
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.addRange(newRange);
    } catch (e) {
      console.warn("Could not apply selection style cleanly:", e);
    }
    
    handleInput();
  };

  const [showAltModal, setShowAltModal] = useState(false);
  const [pendingImgSrc, setPendingImgSrc] = useState("");
  const [customAltText, setCustomAltText] = useState("");

  const SEO_ALT_SUGGESTIONS = [
    "Computerized XRF Spectrometer gold purity testing at GBC - trusted Gold Buyer in Colombo",
    "Selling old 22k gold jewelry for the highest cash payout at GBC - premier Gold Buyer in Colombo",
    "Certified dual-display electronic weighing scales at GBC - honest Gold Buyer in Colombo since 1976",
    "Transparent pawn gold liquidation and cash for gold services by GBC - Gold Buyer in Colombo",
    "GBC Wellawatte branch gold valuation - secure and professional Gold Buyer in Colombo",
    "High-precision gold bar and bullion appraisal at GBC - certified Gold Buyer in Colombo",
    "Instant bank transfer and cash payout for gold jewelry - GBC, leading Gold Buyer in Colombo"
  ];

  const insertImageWithAlt = (src: string, altText: string) => {
    const finalAlt = altText.trim() || "GBC - Premium Gold Buyer in Colombo gold valuation";
    const imgHtml = `<img src="${src}" alt="${finalAlt}" class="my-6 rounded-lg shadow-md max-w-full mx-auto" />`;
    executeCmd("insertHTML", imgHtml);
    setShowAltModal(false);
    setPendingImgSrc("");
    setCustomAltText("");
  };

  const handleLinkPrompt = () => {
    const url = prompt("Enter hyperlink URL (e.g. https://goldbuyerscolombo.com/):", "https://");
    if (url) {
      executeCmd("createLink", url);
    }
  };

  const handleImageUrlPrompt = () => {
    const url = prompt("Enter image URL:", "https://");
    if (url) {
      const defaultAlt = SEO_ALT_SUGGESTIONS[Math.floor(Math.random() * SEO_ALT_SUGGESTIONS.length)];
      setPendingImgSrc(url);
      setCustomAltText(defaultAlt);
      setShowAltModal(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const fileKeywords = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const defaultAlt = `GBC - ${fileKeywords} | Certified Gold Buyer in Colombo premium gold valuation services`;
        setPendingImgSrc(event.target.result as string);
        setCustomAltText(defaultAlt);
        setShowAltModal(true);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOptimizeAllAltTags = () => {
    if (!editorRef.current) return;
    
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = editorRef.current.innerHTML;
    const imgs = tempDiv.querySelectorAll("img");
    
    if (imgs.length === 0) {
      alert("No images found in the current blog post to optimize.");
      return;
    }
    
    let optimizedCount = 0;
    imgs.forEach((img, index) => {
      const currentAlt = img.getAttribute("alt") || "";
      if (!currentAlt || !currentAlt.toLowerCase().includes("gold buyer")) {
        const seoAlt = SEO_ALT_SUGGESTIONS[index % SEO_ALT_SUGGESTIONS.length];
        img.setAttribute("alt", seoAlt);
        optimizedCount++;
      }
    });
    
    if (optimizedCount > 0) {
      editorRef.current.innerHTML = tempDiv.innerHTML;
      handleInput();
      alert(`Success! Automatically optimized alt text for ${optimizedCount} images using the 'Gold Buyer in Colombo' SEO keyword context.`);
    } else {
      alert("All images already have highly optimized alt tags containing the necessary SEO keyword context!");
    }
  };

  return (
    <div 
      className={`border rounded-xl flex flex-col overflow-hidden bg-white text-neutral-900 border-neutral-300 transition-all ${
        isFullscreen ? "fixed inset-0 z-[9999] h-screen" : "h-[480px]"
      }`}
    >
      {/* WYSIWYG Tool Bar Header */}
      <div className="bg-neutral-100 border-b border-neutral-300 p-2 flex flex-wrap gap-1 items-center justify-between shrink-0 select-none">
        <div className="flex flex-wrap gap-1 items-center">
          
          {/* Font Family Selector */}
          <div className="relative inline-block mr-1">
            <select
              value={activeFont}
              onChange={(e) => {
                setActiveFont(e.target.value);
                applyCustomStyle("font-family", e.target.value);
              }}
              title="Font Family"
              className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs text-neutral-800 font-mono focus:outline-none h-7"
            >
              {FONTS.map(f => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size Selector */}
          <div className="relative inline-block mr-2">
            <select
              value={activeSize}
              onChange={(e) => {
                setActiveSize(e.target.value);
                applyCustomStyle("font-size", e.target.value);
              }}
              title="Font Size"
              className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs text-neutral-800 focus:outline-none h-7"
            >
              {FONT_SIZES.map(sz => (
                <option key={sz.value} value={sz.value}>
                  {sz.label}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-neutral-300 mx-1"></div>

          {/* Core Formatting (B, I, U, S) */}
          <button
            type="button"
            onClick={() => executeCmd("bold")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd("italic")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd("underline")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Underline"
          >
            <Underline className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd("strikeThrough")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-neutral-300 mx-1"></div>

          {/* Color & Highlight pickers */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              className="p-1 hover:bg-neutral-200 rounded transition-colors flex items-center gap-0.5"
              title="Text Color"
            >
              <Palette className="h-3.5 w-3.5" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 block"></span>
            </button>
            {showColorPicker && (
              <div className="absolute left-0 mt-1 p-2 bg-white border border-neutral-300 rounded-lg shadow-xl z-20 grid grid-cols-5 gap-1.5 w-40">
                {COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      executeCmd("foreColor", c.value);
                      setShowColorPicker(false);
                    }}
                    className="w-5 h-5 rounded border border-neutral-200"
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              className="p-1 hover:bg-neutral-200 rounded transition-colors flex items-center gap-0.5"
              title="Text Highlight"
            >
              <Highlighter className="h-3.5 w-3.5" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 block"></span>
            </button>
            {showHighlightPicker && (
              <div className="absolute left-0 mt-1 p-2 bg-white border border-neutral-300 rounded-lg shadow-xl z-20 grid grid-cols-4 gap-1.5 w-44">
                {HIGHLIGHTS.map(h => (
                  <button
                    key={h.value}
                    type="button"
                    onClick={() => {
                      executeCmd("backColor", h.value);
                      setShowHighlightPicker(false);
                    }}
                    className="text-[10px] p-1 border rounded hover:bg-neutral-50 border-neutral-200"
                    style={{ background: h.value }}
                    title={h.name}
                  >
                    {h.name === "None" ? "Clear" : "Abc"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-neutral-300 mx-1"></div>

          {/* Alignments */}
          <button
            type="button"
            onClick={() => executeCmd("justifyLeft")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Align Left"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd("justifyCenter")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Align Center"
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd("justifyRight")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Align Right"
          >
            <AlignRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd("justifyFull")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Justify"
          >
            <AlignJustify className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-neutral-300 mx-1"></div>

          {/* Headings (H1 to H4) */}
          <button
            type="button"
            onClick={() => executeCmd("formatBlock", "<h1>")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors font-bold text-xs"
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => executeCmd("formatBlock", "<h2>")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors font-bold text-xs"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => executeCmd("formatBlock", "<h3>")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors font-bold text-xs"
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => executeCmd("formatBlock", "<h4>")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors font-bold text-xs"
            title="Heading 4"
          >
            H4
          </button>
          <button
            type="button"
            onClick={() => executeCmd("formatBlock", "<p>")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors text-xs"
            title="Normal Paragraph"
          >
            <Type className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-neutral-300 mx-1"></div>

          {/* Lists */}
          <button
            type="button"
            onClick={() => executeCmd("insertUnorderedList")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Bullet List"
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd("insertOrderedList")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </button>

          {/* Blockquotes and Pre */}
          <button
            type="button"
            onClick={() => executeCmd("formatBlock", "<blockquote>")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Blockquote"
          >
            <Quote className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd("formatBlock", "<pre>")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Code Block"
          >
            <Code2 className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-neutral-300 mx-1"></div>

          {/* Link Insertion */}
          <button
            type="button"
            onClick={handleLinkPrompt}
            className="p-1 hover:bg-neutral-200 rounded transition-colors text-blue-700"
            title="Insert Link"
          >
            <Link2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd("unlink")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors text-neutral-500"
            title="Remove Link"
          >
            <Unlink2 className="h-3.5 w-3.5" />
          </button>

          {/* Image Insertion */}
          <button
            type="button"
            onClick={handleImageUrlPrompt}
            className="p-1 hover:bg-neutral-200 rounded transition-colors text-emerald-700"
            title="Insert Image by URL"
          >
            <Image className="h-3.5 w-3.5" />
          </button>
          
          {/* File Upload Image Ingestion */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1 hover:bg-neutral-200 rounded transition-colors text-indigo-700"
            title="Upload Local Image"
          >
            <Upload className="h-3.5 w-3.5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Batch Alt Tag Optimizer */}
          <button
            type="button"
            onClick={handleOptimizeAllAltTags}
            className="p-1 hover:bg-neutral-200 rounded transition-colors text-amber-700 flex items-center gap-0.5"
            title="Optimize Image Alt Tags for Colombo Gold SEO"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
            <span className="text-[10px] font-bold font-sans">Alt SEO</span>
          </button>

          <div className="h-4 w-px bg-neutral-300 mx-1"></div>

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => executeCmd("undo")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Undo"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd("redo")}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
            title="Redo"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* View mode toggle (WYSIWYG vs Code Source) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              if (isSourceMode && editorRef.current) {
                // If exiting source mode, grab HTML content
                onChange(editorRef.current.innerText);
              }
              setIsSourceMode(!isSourceMode);
            }}
            className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 font-mono font-bold ${
              isSourceMode ? "bg-amber-500 text-black" : "hover:bg-neutral-200 text-neutral-600"
            }`}
            title="Toggle Raw HTML Editor"
          >
            {isSourceMode ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Show Editor</span>
              </>
            ) : (
              <>
                <Code className="h-3.5 w-3.5" />
                <span>Show HTML</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-neutral-200 rounded transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body Area */}
      <div className="flex-1 overflow-y-auto relative bg-white flex flex-col">
        {/* Source Mode HTML TextArea */}
        {isSourceMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full flex-1 p-4 font-mono text-xs text-neutral-800 bg-neutral-950 text-emerald-400 border-none outline-none resize-none h-full"
            placeholder="Type raw HTML directly here..."
          />
        ) : (
          /* WYSIWYG ContentEditable DIV */
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onPaste={handlePaste}
            className="rich-text-editor prose prose-amber max-w-none flex-1 p-6 text-sm text-neutral-800 outline-none overflow-y-auto min-h-full leading-relaxed"
            style={{ fontFamily: activeFont, fontSize: activeSize }}
            data-placeholder={placeholder || "Start typing or paste from Google Docs with full formatting intact..."}
          />
        )}
      </div>

      {/* Editor Footer / Info bar */}
      <div className="bg-neutral-100 border-t border-neutral-300 px-3 py-1.5 flex justify-between items-center text-[10px] text-neutral-500 font-mono shrink-0">
        <div className="flex items-center gap-2">
          <span>Active Font: <strong className="text-neutral-700">{FONTS.find(f => f.value === activeFont)?.name}</strong></span>
          <span>•</span>
          <span>Size: <strong className="text-neutral-700">{activeSize}</strong></span>
        </div>
        <div className="flex items-center gap-1 text-amber-700">
          <Sparkles className="h-3 w-3 animate-pulse" />
          <span>Supports direct paste from Google Docs & Word</span>
        </div>
      </div>

      {/* Dynamic Alt Text Generation Modal */}
      {showAltModal && (
        <div className="absolute inset-0 bg-neutral-950/80 flex items-center justify-center p-4 z-[100] backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 rounded-xl max-w-lg w-full p-5 shadow-2xl flex flex-col gap-4 font-sans text-neutral-900">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold text-neutral-950">GBC SEO Image Alt Text Generator</h3>
                <p className="text-[11px] text-neutral-500">Generate descriptive, highly optimized alt attributes for GBC accessibility and GEO/SEO indexing.</p>
              </div>
            </div>

            <div className="flex gap-3">
              {pendingImgSrc.startsWith("data:") ? (
                <div className="w-16 h-16 rounded border border-neutral-200 bg-neutral-100 flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={pendingImgSrc} className="object-cover w-full h-full" alt="Preview" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded border border-neutral-200 bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-400 text-xs text-center font-mono font-semibold p-1 break-all overflow-hidden font-sans">
                  URL Image
                </div>
              )}

              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Target Keywords Context</label>
                <div className="text-xs bg-amber-50 border border-amber-200 text-amber-850 rounded px-2 py-1 font-semibold inline-block font-sans">
                  Keyword: "Gold Buyer in Colombo"
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">Edit Alt Text Attribute</label>
              <textarea
                value={customAltText}
                onChange={(e) => setCustomAltText(e.target.value)}
                rows={3}
                className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-amber-500 font-sans"
                placeholder="Describe the image incorporating GBC and 'Gold Buyer in Colombo'..."
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Recommended Colombo Alt Presets:</span>
              <div className="max-h-24 overflow-y-auto border border-neutral-200 rounded-lg p-1.5 space-y-1 divide-y divide-neutral-100 bg-neutral-50">
                {SEO_ALT_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomAltText(suggestion)}
                    className="w-full text-left p-1.5 text-xs text-neutral-700 hover:text-neutral-950 hover:bg-amber-50/50 rounded transition-colors block font-sans"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-neutral-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  setShowAltModal(false);
                  setPendingImgSrc("");
                }}
                className="px-3.5 py-1.5 border border-neutral-300 hover:bg-neutral-100 rounded-lg text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => insertImageWithAlt(pendingImgSrc, customAltText)}
                className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
              >
                Insert Image with Alt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
