/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Phone, Calendar } from "lucide-react";
import { Language, translations } from "../lib/translations.js";

interface MobileStickyBarProps {
  currentLang: Language;
  todayRate24k: number;
  todayRate22k: number;
}

export default function MobileStickyBar({ currentLang, todayRate24k, todayRate22k }: MobileStickyBarProps) {
  const t = translations[currentLang];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 border-t border-amber-500/20 px-3 py-2.5 z-40 flex items-center justify-between shadow-2xl backdrop-blur-md">
      {/* Rate ticker */}
      <div className="flex flex-col text-[11px] font-mono text-neutral-700">
        <div className="flex items-center gap-1.5 text-amber-700 font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{t.rates}:</span>
        </div>
        <div className="flex gap-2 mt-0.5">
          <span>24K: <strong className="text-neutral-900">LKR {Math.round(todayRate24k).toLocaleString()}</strong></span>
          <span>|</span>
          <span>22K: <strong className="text-neutral-900">LKR {Math.round(todayRate22k).toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <a
          href="tel:0718321321"
          id="sticky_mobile_call"
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-yellow-500 text-black px-3.5 py-2 rounded-full text-xs font-black shadow-lg"
        >
          <Phone className="h-3 w-3" />
          <span>{t.callNow}</span>
        </a>
        <a
          href="https://wa.me/94718321321?text=Hi%20GBC%2C%20I%20want%20to%20get%20a%20live%20valuation%20for%20my%20gold."
          target="_blank"
          rel="noreferrer"
          id="sticky_mobile_wa"
          className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-2 rounded-full text-xs font-bold shadow-lg"
        >
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
