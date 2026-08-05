/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SEOOptions {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
  imageUrl?: string;
  type?: "article" | "website";
  author?: string;
  publishedTime?: string;
  section?: string;
}

/**
 * Helper to update or create a meta tag by name or property attribute.
 */
function setMetaTag(attributeName: "name" | "property", attributeValue: string, content: string) {
  if (typeof document === "undefined" || !content) return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

/**
 * Dynamically updates the document title, meta description, keywords,
 * Open Graph tags, and Twitter Card tags for social sharing and search engine optimization.
 */
export function updateMetaTags(
  titleOrOptions: string | SEOOptions,
  description?: string,
  keywords?: string
) {
  if (typeof document === "undefined") return;

  let opts: SEOOptions;
  if (typeof titleOrOptions === "object") {
    opts = titleOrOptions;
  } else {
    opts = {
      title: titleOrOptions,
      description: description || "",
      keywords: keywords || "",
    };
  }

  const {
    title,
    description: desc,
    keywords: kw,
    url = typeof window !== "undefined" ? window.location.href : "https://www.goldlanka.lk",
    imageUrl = "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80",
    type = "website",
    author = "Gold Buyers Colombo",
    publishedTime,
    section,
  } = opts;

  // 1. Title & Standard Meta
  document.title = title;
  setMetaTag("name", "description", desc);
  if (kw) setMetaTag("name", "keywords", kw);
  setMetaTag("name", "author", author);

  // Canonical link tag update
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);

  // 2. Open Graph Tags
  setMetaTag("property", "og:site_name", "Gold Buyers Colombo (GBC)");
  setMetaTag("property", "og:type", type);
  setMetaTag("property", "og:title", title);
  setMetaTag("property", "og:description", desc);
  setMetaTag("property", "og:url", url);
  setMetaTag("property", "og:image", imageUrl);
  setMetaTag("property", "og:image:alt", title);

  if (publishedTime) {
    setMetaTag("property", "article:published_time", publishedTime);
  }
  if (author) {
    setMetaTag("property", "article:author", author);
  }
  if (section) {
    setMetaTag("property", "article:section", section);
  }

  // 3. Twitter / X Card Tags
  setMetaTag("name", "twitter:card", "summary_large_image");
  setMetaTag("name", "twitter:site", "@GoldBuyersSL");
  setMetaTag("name", "twitter:title", title);
  setMetaTag("name", "twitter:description", desc);
  setMetaTag("name", "twitter:image", imageUrl);
}

