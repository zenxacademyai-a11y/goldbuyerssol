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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-neutral-950/95 border-t border-amber-500/30 px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] z-40 shadow-2xl backdrop-blur-xl transition-colors duration-200">
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
        {/* Rate Ticker */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="uppercase tracking-wider font-mono text-[9px] font-bold whitespace-nowrap">{t.rates} Today</span>
          </div>
          <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-center gap-0.5 min-[380px]:gap-1.5 mt-0.5 text-[10px] min-[380px]:text-xs font-black text-neutral-900 dark:text-white">
            <div className="inline-flex items-center gap-1">
              <span className="text-[9px] min-[380px]:text-[10px] text-neutral-500 dark:text-neutral-400 font-bold">24K:</span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold">Rs.{Math.round(todayRate24k).toLocaleString()}</span>
            </div>
            <span className="hidden min-[380px]:inline text-neutral-300 dark:text-neutral-700 font-light">|</span>
            <div className="inline-flex items-center gap-1">
              <span className="text-[9px] min-[380px]:text-[10px] text-neutral-500 dark:text-neutral-400 font-bold">22K:</span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold">Rs.{Math.round(todayRate22k).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href="tel:0718321321"
            id="sticky_mobile_call"
            className="flex items-center justify-center gap-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-neutral-950 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black shadow-md whitespace-nowrap transition-transform active:scale-95 no-underline shrink-0"
          >
            <Phone className="h-3.5 w-3.5 fill-neutral-950 shrink-0" />
            <span>{t.callNow}</span>
          </a>
          <a
            href="https://wa.me/94718321321?text=Hi%20GBC%2C%20I%20want%20to%20get%20a%20live%20valuation%20for%20my%20gold."
            target="_blank"
            rel="noreferrer"
            id="sticky_mobile_wa"
            className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold shadow-md whitespace-nowrap transition-transform active:scale-95 no-underline shrink-0"
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

