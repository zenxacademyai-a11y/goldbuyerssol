/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Define high-quality replacements with appropriate target URLs (External and Internal)
export const replacements = [
  // 1. High-Authority External Sites
  {
    pattern: /Central Bank of Sri Lanka/gi,
    url: "https://www.cbsl.gov.lk",
    isExternal: true,
    anchorText: "Central Bank of Sri Lanka"
  },
  {
    pattern: /National Gem and Jewellery Authority/gi,
    url: "https://www.gemandjewelleryauthority.gov.lk",
    isExternal: true,
    anchorText: "National Gem and Jewellery Authority"
  },
  {
    pattern: /Sri Lanka Standards Institution/gi,
    url: "https://www.slsi.lk",
    isExternal: true,
    anchorText: "Sri Lanka Standards Institution"
  },
  {
    pattern: /\bSLSI\b/g,
    url: "https://www.slsi.lk",
    isExternal: true,
    anchorText: "SLSI"
  },
  {
    pattern: /London Bullion Market Association/gi,
    url: "https://www.lbma.org.uk",
    isExternal: true,
    anchorText: "London Bullion Market Association"
  },
  {
    pattern: /\bLBMA\b/g,
    url: "https://www.lbma.org.uk",
    isExternal: true,
    anchorText: "LBMA"
  },
  {
    pattern: /Colombo Municipal Council/gi,
    url: "https://www.colombomc.lk",
    isExternal: true,
    anchorText: "Colombo Municipal Council"
  },

  // 2. Main Page Navigation Anchor Sections
  {
    pattern: /live gold rate calculator/gi,
    url: "#calculator",
    isExternal: false,
    anchorText: "live gold rate calculator"
  },
  {
    pattern: /gold rate calculator/gi,
    url: "#calculator",
    isExternal: false,
    anchorText: "gold rate calculator"
  },
  {
    pattern: /today's live gold rates/gi,
    url: "#rates",
    isExternal: false,
    anchorText: "today's live gold rates"
  },
  {
    pattern: /live gold rates/gi,
    url: "#rates",
    isExternal: false,
    anchorText: "live gold rates"
  },
  {
    pattern: /free gold appraisal/gi,
    url: "#contact",
    isExternal: false,
    anchorText: "free gold appraisal"
  },
  {
    pattern: /book a free appraisal/gi,
    url: "#contact",
    isExternal: false,
    anchorText: "book a free appraisal"
  },
  {
    pattern: /get an instant quote/gi,
    url: "#contact",
    isExternal: false,
    anchorText: "get an instant quote"
  },

  // 3. Blog Interlinking (Longest Phrases first to ensure perfect subphrase protection)
  {
    pattern: /10 Best Gold Buyers in Colombo \(2026 Guide\)/gi,
    url: "/blog/10-best-gold-buyers-in-colombo-2026-guide",
    isExternal: false,
    anchorText: "10 Best Gold Buyers in Colombo (2026 Guide)"
  },
  {
    pattern: /10 Best Gold Buyers in Colombo/gi,
    url: "/blog/10-best-gold-buyers-in-colombo-2026-guide",
    isExternal: false,
    anchorText: "10 Best Gold Buyers in Colombo"
  },
  {
    pattern: /best gold buyers in Colombo/gi,
    url: "/blog/10-best-gold-buyers-in-colombo-2026-guide",
    isExternal: false,
    anchorText: "best gold buyers in Colombo"
  },
  {
    pattern: /8 Top Places to Sell Gold in Colombo/gi,
    url: "/blog/8-top-places-to-sell-gold-in-colombo-for-the-best-price",
    isExternal: false,
    anchorText: "8 Top Places to Sell Gold in Colombo"
  },
  {
    pattern: /places to sell gold in Colombo/gi,
    url: "/blog/8-top-places-to-sell-gold-in-colombo-for-the-best-price",
    isExternal: false,
    anchorText: "places to sell gold in Colombo"
  },
  {
    pattern: /Gold Buyer vs Pawn Shop/gi,
    url: "/blog/gold-buyer-vs-pawn-shop-in-sri-lanka-which-pays-more",
    isExternal: false,
    anchorText: "Gold Buyer vs Pawn Shop"
  },
  {
    pattern: /pawn shop in Sri Lanka/gi,
    url: "/blog/gold-buyer-vs-pawn-shop-in-sri-lanka-which-pays-more",
    isExternal: false,
    anchorText: "pawn shop in Sri Lanka"
  },
  {
    pattern: /where to sell gold in Colombo/gi,
    url: "/blog/where-can-you-sell-gold-in-colombo-complete-local-guide",
    isExternal: false,
    anchorText: "where to sell gold in Colombo"
  },
  {
    pattern: /Gold Price in Colombo Today/gi,
    url: "/blog/gold-price-in-colombo-today-how-it-affects-selling-your-gold",
    isExternal: false,
    anchorText: "Gold Price in Colombo Today"
  },
  {
    pattern: /mistakes to avoid when selling gold/gi,
    url: "/blog/12-common-mistakes-to-avoid-when-selling-gold-in-sri-lanka",
    isExternal: false,
    anchorText: "mistakes to avoid when selling gold"
  },
  {
    pattern: /cash for gold in Colombo/gi,
    url: "/blog/cash-for-gold-in-colombo-everything-you-need-to-know",
    isExternal: false,
    anchorText: "cash for gold in Colombo"
  },
  {
    pattern: /used jewellery buyers/gi,
    url: "/blog/used-jewellery-buyers-in-colombo-how-to-get-maximum-value",
    isExternal: false,
    anchorText: "used jewellery buyers"
  },
  {
    pattern: /how to choose a trusted gold buyer/gi,
    url: "/blog/how-to-choose-a-trusted-gold-buyer-in-colombo-2026-checklist",
    isExternal: false,
    anchorText: "how to choose a trusted gold buyer"
  },
  {
    pattern: /Gold Buyers Colombo vs Jewellery Shops/gi,
    url: "/blog/gold-buyers-colombo-vs-jewellery-shops-which-offers-better-value",
    isExternal: false,
    anchorText: "Gold Buyers Colombo vs Jewellery Shops"
  },
  {
    pattern: /15 Best Places to Sell Gold/gi,
    url: "/blog/15-best-places-to-sell-gold-in-colombo",
    isExternal: false,
    anchorText: "15 Best Places to Sell Gold"
  },
  {
    pattern: /12 Trusted Gold Buyers/gi,
    url: "/blog/12-trusted-gold-buyers-in-sri-lanka",
    isExternal: false,
    anchorText: "12 Trusted Gold Buyers"
  },
  {
    pattern: /8 Best Cash for Gold Services/gi,
    url: "/blog/8-best-cash-for-gold-services-in-colombo",
    isExternal: false,
    anchorText: "8 Best Cash for Gold Services"
  },
  {
    pattern: /Top 10 Jewellery Buyers/gi,
    url: "/blog/top-10-jewellery-buyers-in-colombo",
    isExternal: false,
    anchorText: "Top 10 Jewellery Buyers"
  },
  {
    pattern: /20 Tips Before Selling Gold/gi,
    url: "/blog/20-tips-before-selling-gold-in-colombo",
    isExternal: false,
    anchorText: "20 Tips Before Selling Gold"
  },
  {
    pattern: /9 Best Gold Exchange Companies/gi,
    url: "/blog/9-best-gold-exchange-companies-in-colombo",
    isExternal: false,
    anchorText: "9 Best Gold Exchange Companies"
  },
  {
    pattern: /10 Best Gold Dealers/gi,
    url: "/blog/10-best-gold-dealers-in-colombo",
    isExternal: false,
    anchorText: "10 Best Gold Dealers"
  },
  {
    pattern: /gold buying companies in Sri Lanka/gi,
    url: "/blog/top-gold-buying-companies-in-sri-lanka",
    isExternal: false,
    anchorText: "gold buying companies in Sri Lanka"
  },
  {
    pattern: /15 Highest Paying Gold Buyers/gi,
    url: "/blog/15-highest-paying-gold-buyers-in-colombo",
    isExternal: false,
    anchorText: "15 Highest Paying Gold Buyers"
  },
  {
    pattern: /gold jewellery buyers near Colombo/gi,
    url: "/blog/top-gold-jewellery-buyers-near-colombo",
    isExternal: false,
    anchorText: "gold jewellery buyers near Colombo"
  },
  {
    pattern: /gold selling tips/gi,
    url: "/blog/18-gold-selling-tips-that-save-you-money",
    isExternal: false,
    anchorText: "gold selling tips"
  },
  {
    pattern: /gold appraisal services/gi,
    url: "/blog/10-best-gold-appraisal-services-in-colombo",
    isExternal: false,
    anchorText: "gold appraisal services"
  },
  {
    pattern: /gold testing centres/gi,
    url: "/blog/top-gold-testing-centres-in-colombo",
    isExternal: false,
    anchorText: "gold testing centres"
  },
  {
    pattern: /gold buyers for old jewellery/gi,
    url: "/blog/best-gold-buyers-for-old-jewellery",
    isExternal: false,
    anchorText: "gold buyers for old jewellery"
  },
  {
    pattern: /gold buyers for broken jewellery/gi,
    url: "/blog/best-gold-buyers-for-broken-jewellery",
    isExternal: false,
    anchorText: "gold buyers for broken jewellery"
  },
  {
    pattern: /gold buyers for antique jewellery/gi,
    url: "/blog/best-gold-buyers-for-antique-jewellery",
    isExternal: false,
    anchorText: "gold buyers for antique jewellery"
  },
  {
    pattern: /gold coin buyers/gi,
    url: "/blog/best-gold-buyers-for-gold-coins",
    isExternal: false,
    anchorText: "gold coin buyers"
  },
  {
    pattern: /gold buyers for bullion/gi,
    url: "/blog/best-gold-buyers-for-bullion",
    isExternal: false,
    anchorText: "gold buyers for bullion"
  },
  {
    pattern: /gold shops that buy jewellery/gi,
    url: "/blog/top-gold-shops-that-buy-jewellery",
    isExternal: false,
    anchorText: "gold shops that buy jewellery"
  }
];

// Sort replacements by descending keyword length to prevent nested tag replacement issues
replacements.sort((a, b) => b.anchorText.length - a.anchorText.length);

/**
 * Bulletproof HTML hyperlinker: splits HTML by tags and text fragments,
 * then safely replaces only raw text nodes that are not inside <a> tags.
 * Ensures each URL is linked at most once per blog post.
 * 
 * @param {string} htmlContent - The raw blog HTML content
 * @param {string} currentSlug - The slug of the current blog to avoid self-linking
 * @returns {string} - The hyperlinked HTML content
 */
export function injectSEOAndAuthorityLinks(htmlContent, currentSlug = "") {
  if (!htmlContent) return "";

  // Set to track linked URLs in this blog post to avoid over-linking (max 1 link per target URL per post)
  const linkedUrls = new Set();
  
  // If we have a self-slug, add its corresponding URLs to the set so we don't self-link
  if (currentSlug) {
    linkedUrls.add(`/blog/${currentSlug}`);
  }

  // Tokenize the HTML content by splitting on tags: <...>
  // This produces alternating elements: tags and text nodes
  const tokens = htmlContent.split(/(<[^>]+>)/);
  let insideLink = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    if (token.startsWith("<")) {
      // It's a tag
      const lowerTag = token.toLowerCase();
      if (lowerTag.startsWith("<a ") || lowerTag === "<a>") {
        insideLink = true;
      } else if (lowerTag === "</a>") {
        insideLink = false;
      }
    } else {
      // It's a text node. Only perform replacements if we are NOT inside an existing link tag!
      if (!insideLink) {
        let textNode = token;
        
        for (const replacement of replacements) {
          if (linkedUrls.has(replacement.url)) {
            continue; // Already linked this URL in this post, skip to keep SEO clean and professional
          }

          // Generate non-global, case-insensitive regex to target only the first occurrence in the entire post
          const regex = new RegExp(replacement.pattern.source, "i");
          
          if (regex.test(textNode)) {
            textNode = textNode.replace(regex, (matchedText) => {
              linkedUrls.add(replacement.url); // Mark as linked
              
              const extAttr = replacement.isExternal 
                ? ' target="_blank" rel="noopener noreferrer" title="Official Authority Website"' 
                : "";
              
              return `<a href="${replacement.url}" class="text-amber-600 hover:underline font-semibold decoration-amber-500/30"${extAttr}>${matchedText}</a>`;
            });
          }
        }
        
        tokens[i] = textNode;
      }
    }
  }

  return tokens.join("");
}
