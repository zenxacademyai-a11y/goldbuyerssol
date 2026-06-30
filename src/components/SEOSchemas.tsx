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
    const rate24k = rates.find((r) => r.karat === "24K")?.ratePerGram || 31250;
    const rate22k = rates.find((r) => r.karat === "22K")?.ratePerGram || 28650;
    const rate21k = rates.find((r) => r.karat === "21K")?.ratePerGram || 27350;
    const rate18k = rates.find((r) => r.karat === "18K")?.ratePerGram || 23450;

    // Get today's ISO date
    const todayStr = new Date().toISOString().split("T")[0];

    // 2. Build Unified LocalBusiness, Review, and Gold Rate Schema
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Gold Buyers Colombo (GBC)",
      "image": "https://ais-pre-dyuherzilrm6vpvwg3vmbk-934405636140.asia-east1.run.app/logo_exact.jpg",
      "@id": "https://ais-pre-dyuherzilrm6vpvwg3vmbk-934405636140.asia-east1.run.app",
      "url": "https://ais-pre-dyuherzilrm6vpvwg3vmbk-934405636140.asia-east1.run.app",
      "telephone": "+94718321321",
      "priceRange": "$$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "GBC Building, Galle Road",
        "addressLocality": "Colombo 03",
        "postalCode": "00300",
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
        "ratingValue": "4.9",
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
          "reviewBody": "Sold some old family jewelry to GBC. Truly amazed by the computerized testing. Standard shops tried to claim the gold was lower carat to cut rates, but GBC showed me the spectrometer readings on screen. Got 45,000 LKR more than standard jewelry shops offered!",
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
            "name": "24K Gold Buying Price (Per Gram)",
            "description": "Daily live buying price for 24K solid pure gold per gram in Colombo, Sri Lanka by Gold Buyers Colombo."
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
            "name": "22K Gold Buying Price (Per Gram)",
            "description": "Daily live buying price for 22K (916) jewelry standard gold per gram in Colombo, Sri Lanka by Gold Buyers Colombo."
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
            "name": "21K Gold Buying Price (Per Gram)",
            "description": "Daily live buying price for 21K jewelry standard gold per gram in Colombo, Sri Lanka by Gold Buyers Colombo."
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": rate21k,
            "priceCurrency": "LKR",
            "valueAddedTaxIncluded": false,
            "validFrom": todayStr
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "18K Gold Buying Price (Per Gram)",
            "description": "Daily live buying price for 18K (750) white or yellow gold per gram in Colombo, Sri Lanka by Gold Buyers Colombo."
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": rate18k,
            "priceCurrency": "LKR",
            "valueAddedTaxIncluded": false,
            "validFrom": todayStr
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

    // Cleanup on unmount
    return () => {
      const scriptToClean = document.getElementById("gbc-lb-jsonld");
      if (scriptToClean) {
        scriptToClean.remove();
      }
    };
  }, [rates]);

  return null; // Component renders script elements into document.head
}
