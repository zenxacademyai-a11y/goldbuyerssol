/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Dynamically updates the document title, meta description, keywords,
 * and Open Graph tags for search engine optimization (SEO/AEO/GEO).
 */
export function updateMetaTags(title: string, description: string, keywords: string) {
  if (typeof document === "undefined") return;

  // 1. Update Title
  document.title = title;

  // 2. Update or create description tag
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.setAttribute("name", "description");
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute("content", description);

  // 3. Update or create keywords tag
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement("meta");
    metaKeywords.setAttribute("name", "keywords");
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute("content", keywords);

  // 4. Update Open Graph title tag
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute("content", title);

  // 5. Update Open Graph description tag
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement("meta");
    ogDesc.setAttribute("property", "og:description");
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute("content", description);
}
