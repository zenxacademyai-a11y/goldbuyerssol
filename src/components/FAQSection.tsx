/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Language, translations } from "../lib/translations.js";

interface FAQSectionProps {
  currentLang: Language;
}

export default function FAQSection({ currentLang }: FAQSectionProps) {
  const t = translations[currentLang];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Who is GBC (Gold Buyers Colombo)?",
      a: "GBC is Colombo's premier licensed luxury gold exchange institution. Unlike traditional pawn brokers, we specialize exclusively in high-value outright gold buying, utilizing computerized XRF spectrometer testing to guarantee maximum payout values on the spot with complete transparency.",
    },
    {
      q: "What types of gold do you buy at your Colombo office?",
      a: "We buy all forms of gold including 24K, 22K, 21K jewelry, sovereign coins (pavans), gold biscuits, gold bullion bars, broken gold pieces, scrap jewelry, and dental gold. Payout rates are based entirely on weight and verified purity.",
    },
    {
      q: "Why is selling gold to GBC better than pawning (Ugas) in Sri Lanka?",
      a: "Pawning gold traps you in high-interest debt cycles. If you fail to pay bank interest rates, your jewelry is auctioned and lost. Selling outright to GBC unlocks maximum liquidity at today's peak market rates with zero debt, zero interest, and zero hidden deductions.",
    },
    {
      q: "How does your computerized XRF gold purity testing work?",
      a: "We do not use destructive acid scratch or melt testing by default. We use state-of-the-art X-Ray Fluorescence (XRF) spectrometer technology. It shoots X-rays at your gold to detect exact karat and purity percentages down to 0.01% in seconds, completely damage-free, and visible to you.",
    },
    {
      q: "Where is GBC located, and is there secure customer parking?",
      a: "GBC is located in the heart of Colombo, Sri Lanka. Our premises are designed to Rolex/Swiss bank security standards, featuring a private appraisal lounge, fully armed security, and secure dedicated parking for customers.",
    },
    {
      q: "When is the best time to sell gold in Colombo?",
      a: "Gold prices are currently trading near historical highs in LKR. If you have unused jewelry, broken rings, or need immediate capital for high-yield investments, now is an excellent time to capitalize on peak rates. You can get today's top rates by contacting us.",
    },
    {
      q: "Do you have any hidden deductions or commissions?",
      a: "No. Unlike traditional pawn brokers or local jewelry shops who deduct massive fees for 'making charges', 'stones', or 'melt loss', we weigh your items on certified balances and offer payouts based strictly on gold weight and verified karat. What we estimate is what we pay.",
    },
    {
      q: "Do I need to make an appointment to visit GBC?",
      a: "No appointment is necessary. Walk-ins are highly welcome Monday through Saturday between 9:00 AM and 6:00 PM. However, you can book an appointment in advance via WhatsApp to secure priority service in our VIP appraisal room.",
    },
  ];

  // Schema generation
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
      },
    })),
  };

  return (
    <section id="faq" className="py-20 px-4 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 scroll-mt-20 border-t border-neutral-100 dark:border-neutral-900 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        {/* Schema Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
 
        {/* Header Block */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-700 dark:text-amber-400 block mb-3 font-semibold">
            Search & Answers (AEO)
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-950 dark:text-white mb-4">
            {t.faqTitle}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto">
            {t.faqSubtitle}
          </p>
        </div>
 
        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all duration-200 shadow-2xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-neutral-100/60 dark:hover:bg-neutral-850 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-serif font-bold text-neutral-900 dark:text-neutral-100 pr-4 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                    {faq.q}
                  </span>
                  <div className="text-amber-700 dark:text-amber-400 flex-shrink-0">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>
 
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-top-2 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
