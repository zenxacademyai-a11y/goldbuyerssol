/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, Award, ShieldCheck, ArrowRight } from "lucide-react";
import { Language, translations } from "../lib/translations.js";

interface ExitIntentPopupProps {
  currentLang: Language;
}

export default function ExitIntentPopup({ currentLang }: ExitIntentPopupProps) {
  const t = translations[currentLang];
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check session storage to only show once per visit
    const shownBefore = sessionStorage.getItem("gbc_exit_shown");
    if (shownBefore) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // If cursor leaves top window boundary (user moving towards tabs/close)
      if (e.clientY < 20 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("gbc_exit_shown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      
      {/* Premium Content Card */}
      <div className="bg-white border border-amber-500/30 rounded-2xl max-w-md w-full p-8 relative shadow-2xl shadow-amber-500/5 overflow-hidden">
        
        {/* Luxury circular gold badge backdrops */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 flex items-center justify-center mx-auto mb-6">
            <Award className="h-6 w-6 text-amber-700 animate-bounce" />
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-black text-neutral-950 tracking-tight mb-2">
            Leaving Colombo?
          </h3>
          <p className="text-amber-700 text-xs font-mono uppercase tracking-widest mb-4 font-bold">
            Get an Extra +2.5% Premium Valuation
          </p>
          <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mb-6">
            Before you leave, lock in today's gold rate. We pay immediate cash and guarantee to beat any pawn or jewelry broker valuation in Colombo!
          </p>

          {/* Action Links */}
          <div className="space-y-3">
            <a
              href="https://wa.me/94718321321?text=Hi%20GBC!%20I'm%20leaving%20the%20website%20and%20want%20to%20lock%20my%20gold%20rate%20for%20an%20extra%20%2B2.5%25%20bonus."
              target="_blank"
              rel="noreferrer"
              onClick={handleClose}
              id="exit_popup_wa_lock"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-md transition-all shadow-lg"
            >
              <span>Lock My Extra Rate on WhatsApp</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </a>
            
            <a
              href="tel:0718321321"
              id="exit_popup_call"
              onClick={handleClose}
              className="block text-xs text-neutral-600 hover:text-amber-700 font-mono text-center py-2 transition-colors hover:underline"
            >
              Or Call Desk Directly: <strong>0718 321 321</strong>
            </a>
          </div>

          {/* Compliance Info */}
          <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-neutral-200 text-[9px] text-neutral-500 font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
            <span>100% Free Appraisal, No Commitments</span>
          </div>

        </div>
      </div>
    </div>
  );
}
