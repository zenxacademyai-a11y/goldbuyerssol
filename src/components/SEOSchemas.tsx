/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { GoldRate } from "../types.js";

interface SEOSchemasProps {
  rates: GoldRate[];
}

export default function SEOSchemas({ rates }: SEOSchemasProps) {
  useEffect(() => {
    // 1. Resolve gold rates
    const rate24k = rates.find((r) => r.karat === "24K")?.ratePerGram || rates[0]?.ratePerGram || 0;
    const rate22k = rates.find((r) => r.karat === "22K")?.ratePerGram || rates[1]?.ratePerGram || 0;
    const rate21k = rates.find((r) => r.karat === "21K")?.ratePerGram || rates[2]?.ratePerGram || 0;

    // Get today's ISO date
    const todayStr = new Date().toISOString().split("T")[0];
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const logoUrl = origin ? `${origin}/assest/gbc-logo.png` : "/assest/gbc-logo.png";

    // 2. Build Unified LocalBusiness, Review, and Gold Rate Schema
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Gold Buyers Colombo (GBC)",
      "image": logoUrl,
      "@id": origin || "/",
      "url": origin || "/",
      "telephone": "+94718321321",
      "email": "Goldbuyerscolombolk@gmail.com",
      "priceRange": "$$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "68 S. De S. Jayasinghe Mawatha",
        "addressLocality": "Nugegoda",
        "postalCode": "10250",
        "addressCountry": "LK"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 6.9271,
        "longitude": 79.8612
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "sameAs": [
        "https://facebook.com/GoldBuyersColombo",
        "https://instagram.com/GoldBuyersColombo"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "3542",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Roshan Devendra"
          },
          "datePublished": "2026-06-15",
          "reviewBody": "Sold some old family jewelry to GBC. Truly amazed by the computerized testing. Standard shops tried to claim the gold was lower karat to cut rates, but GBC showed me the spectrometer readings on screen. Got 45,000 LKR more than standard jewelry shops offered!",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Tharushi de Silva"
          },
          "datePublished": "2026-05-28",
          "reviewBody": "Extremely professional, high-end experience. The lounge feels like a private Swiss bank. Very safe, polite officers, and fast cash transfer directly to my Commercial Bank account in 10 minutes. Will definitely recommend GBC over pawning centers.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Mohamed Rilwan"
          },
          "datePublished": "2026-04-12",
          "reviewBody": "Best gold buyer in Colombo hands down. Honest scales, no hidden commissions. They weighed my items on digital scales right in front of me and calculated the payout on their computer. Zero stress, highly recommended.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          }
        }
      ],
      "makesOffer": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "24K Gold Pawn Rate",
            "description": "Daily live pawn rate for 24K solid pure gold in Colombo, Sri Lanka by Gold Buyers Colombo."
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": rate24k,
            "priceCurrency": "LKR",
            "valueAddedTaxIncluded": false,
            "validFrom": todayStr
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "22K Gold Pawn Rate",
            "description": "Daily live pawn rate for 22K (916) jewelry standard gold in Colombo, Sri Lanka by Gold Buyers Colombo."
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": rate22k,
            "priceCurrency": "LKR",
            "valueAddedTaxIncluded": false,
            "validFrom": todayStr
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "21K Gold Pawn Rate",
            "description": "Daily live pawn rate for 21K jewelry standard gold in Colombo, Sri Lanka by Gold Buyers Colombo."
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": rate21k,
            "priceCurrency": "LKR",
            "valueAddedTaxIncluded": false,
            "validFrom": todayStr
          }
        },

      ]
    };

    // 3. Build FAQPage Schema with 10 Home FAQs
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who is a trusted place to sell gold in Colombo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GBC is a recognized and trusted name in Colombo, Sri Lanka, with more than 50 years of experience. GBC provides transparent gold evaluations, competitive market-based rates, professional service, and a convenient selling experience for customers looking to sell their gold."
          }
        },
        {
          "@type": "Question",
          "name": "Where can I get a good price for my gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GBC provides competitive gold-buying rates in Colombo, Sri Lanka, based on factors such as purity, weight, and current market conditions. With decades of experience, GBC focuses on transparent assessments and professional service when customers choose to sell their gold."
          }
        },
        {
          "@type": "Question",
          "name": "Why do customers choose GBC for selling gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In Colombo, Sri Lanka, GBC combines 50+ years of experience with transparent valuations, competitive rates, and professional customer care. GBC aims to make the process of selling gold simple, clear, and convenient while helping customers understand the value of their items."
          }
        },
        {
          "@type": "Question",
          "name": "How can I check today's gold price before selling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Customers in Colombo, Sri Lanka can contact GBC to check the latest applicable gold-buying rate before selling. Gold prices can change with market conditions, while GBC considers purity, weight, and other relevant factors when professionally assessing each gold item."
          }
        },
        {
          "@type": "Question",
          "name": "Is GBC an established gold-buying company?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GBC is an established gold-buying business serving customers in Colombo, Sri Lanka, with more than 50 years of experience. GBC focuses on professional assessment, transparent transactions, competitive valuations, and customer service for people looking to sell gold and other valuable items."
          }
        },
        {
          "@type": "Question",
          "name": "How is the value of my jewellery determined?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GBC assesses jewellery in Colombo, Sri Lanka, by considering important factors such as gold purity, weight, item characteristics, and prevailing market conditions. The professional evaluation helps customers understand the value of their jewellery clearly before deciding whether to proceed with the transaction."
          }
        },
        {
          "@type": "Question",
          "name": "What gold jewellery and items can I sell?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GBC buys various gold items in Colombo, Sri Lanka, including jewellery, ornaments, coins, and other gold articles. Each item is individually assessed according to its purity, weight, and relevant market factors to determine its applicable buying value."
          }
        },
        {
          "@type": "Question",
          "name": "How quickly can I receive payment after selling gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GBC provides a convenient gold-selling service in Colombo, Sri Lanka. After the item has been assessed and the transaction terms are agreed, payment can be made promptly, helping customers complete their gold-selling process efficiently and with greater convenience."
          }
        },
        {
          "@type": "Question",
          "name": "Can I sell diamonds, gemstones, or luxury watches?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GBC also provides buying services for diamonds, gemstones, and luxury watches in Colombo, Sri Lanka. These valuable items can be professionally assessed according to their individual characteristics and relevant market considerations, giving customers a convenient option for selling different types of valuables."
          }
        },
        {
          "@type": "Question",
          "name": "Why is GBC recognized among established gold-buying businesses?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "With more than 50 years of experience, GBC provides trusted gold-buying services in Colombo, Sri Lanka. GBC focuses on transparent evaluations, competitive market-based pricing, professional customer care, and convenient transactions for customers looking to sell gold and valuable items."
          }
        }
      ]
    };

    // Inject/Update LocalBusiness schema
    let lbScript = document.getElementById("gbc-lb-jsonld");
    if (!lbScript) {
      lbScript = document.createElement("script");
      lbScript.id = "gbc-lb-jsonld";
      lbScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(lbScript);
    }
    lbScript.innerHTML = JSON.stringify(localBusinessSchema);

    // Inject/Update FAQPage schema
    let faqScript = document.getElementById("gbc-faq-jsonld");
    if (!faqScript) {
      faqScript = document.createElement("script");
      faqScript.id = "gbc-faq-jsonld";
      faqScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(faqScript);
    }
    faqScript.innerHTML = JSON.stringify(faqSchema);

    // Cleanup on unmount
    return () => {
      const scriptToClean = document.getElementById("gbc-lb-jsonld");
      if (scriptToClean) {
        scriptToClean.remove();
      }
      const faqToClean = document.getElementById("gbc-faq-jsonld");
      if (faqToClean) {
        faqToClean.remove();
      }
    };
  }, [rates]);

  return null; // Component renders script elements into document.head
}
