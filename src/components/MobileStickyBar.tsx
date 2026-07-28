/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Phone, MessageSquare } from "lucide-react";
import { Language, translations } from "../lib/translations.js";

interface MobileStickyBarProps {
  currentLang: Language;
  todayRate24k: number;
  todayRate22k: number;
}

export default function MobileStickyBar({ currentLang, todayRate24k, todayRate22k }: MobileStickyBarProps) {
  const t = translations[currentLang];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-neutral-950/95 border-t border-amber-500/20 px-3.5 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] z-40 flex items-center justify-between shadow-2xl backdrop-blur-xl gap-2 transition-colors duration-200">
      {/* Rate Ticker */}
      <div className="flex flex-col text-[10px] sm:text-[11px] font-mono text-neutral-800 dark:text-neutral-200 min-w-0 shrink">
        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold whitespace-nowrap">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span>{t.rates}:</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap text-neutral-700 dark:text-neutral-300 font-semibold">
          <span>24K: <strong className="text-neutral-950 dark:text-white font-black">LKR {Math.round(todayRate24k).toLocaleString()}</strong></span>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <span>22K: <strong className="text-neutral-950 dark:text-white font-black">LKR {Math.round(todayRate22k).toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href="tel:0718321321"
          id="sticky_mobile_call"
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-neutral-950 px-3 py-2 rounded-xl text-xs font-black shadow-md whitespace-nowrap transition-transform active:scale-95 no-underline"
        >
          <Phone className="h-3.5 w-3.5 fill-neutral-950" />
          <span>{t.callNow}</span>
        </a>
        <a
          href="https://wa.me/94718321321?text=Hi%20GBC%2C%20I%20want%20to%20get%20a%20live%20valuation%20for%20my%20gold."
          target="_blank"
          rel="noreferrer"
          id="sticky_mobile_wa"
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md whitespace-nowrap transition-transform active:scale-95 no-underline"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

