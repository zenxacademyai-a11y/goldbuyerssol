/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Share, PlusSquare, Sparkles, CheckCircle2 } from "lucide-react";
import { Language } from "../lib/translations.js";

interface InstallAppBannerProps {
  currentLang: Language;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallAppBanner({ currentLang }: InstallAppBannerProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone mode (PWA installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone || localStorage.getItem("gbc_pwa_installed") === "true") {
      setIsInstalled(true);
      return;
    }

    // Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIos(isIosDevice);

    // Track visit count
    const visits = parseInt(localStorage.getItem("gbc_visit_count") || "1", 10);
    const calculatorInteracted = localStorage.getItem("gbc_calculator_interacted") === "true";

    // Dismissal check (hide if dismissed within last 12 hours)
    const lastDismissed = localStorage.getItem("gbc_pwa_dismissed_at");
    const isDismissedRecently = lastDismissed && Date.now() - parseInt(lastDismissed, 10) < 12 * 60 * 60 * 1000;

    // Check if trigger conditions are met
    const shouldTrigger = (visits >= 2 || calculatorInteracted) && !isDismissedRecently;

    // 2. Listen for Chrome / Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (shouldTrigger) {
        setIsVisible(true);
      }
    };

    // 3. Listen for calculator interaction event
    const handleCalculatorInteraction = () => {
      localStorage.setItem("gbc_calculator_interacted", "true");
      const currentDismissed = localStorage.getItem("gbc_pwa_dismissed_at");
      const dismissedRecently = currentDismissed && Date.now() - parseInt(currentDismissed, 10) < 4 * 60 * 60 * 1000;
      if (!isStandalone && !dismissedRecently) {
        setIsVisible(true);
      }
    };

    // 4. Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      localStorage.setItem("gbc_pwa_installed", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("gbc_calculator_interaction", handleCalculatorInteraction);
    window.addEventListener("appinstalled", handleAppInstalled);

    // If iOS or Chrome where event already fired or trigger condition met
    if (shouldTrigger && !isStandalone) {
      // Small timeout for smooth initial render
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("gbc_calculator_interaction", handleCalculatorInteraction);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          localStorage.setItem("gbc_pwa_installed", "true");
          setIsVisible(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn("PWA installation prompt error:", err);
      }
    } else if (isIos) {
      setShowIosInstructions((prev) => !prev);
    } else {
      // Fallback instructions for unsupported browsers
      setShowIosInstructions((prev) => !prev);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("gbc_pwa_dismissed_at", Date.now().toString());
  };

  if (!isVisible || isInstalled) return null;

  // Multi-language text mapping
  const texts = {
    en: {
      badge: "Fast & Offline Capable",
      title: "Install GBC Colombo App",
      desc: "Instant live gold spot rates, 24K/22K payout calculator & branch maps on your home screen.",
      installBtn: "Install App",
      dismiss: "Not now",
      iosHeader: "To install on iPhone / iPad:",
      iosStep1: "Tap the Share button below",
      iosStep2: "Scroll down and tap 'Add to Home Screen'",
    },
    si: {
      badge: "වේගවත් සහ ඇප් එකක් ලෙස",
      title: "GBC Colombo ඇප් එක ස්ථාපනය කරන්න",
      desc: "සජීවී රන් මිල, 24K/22K ගණකය සහ ශාඛා සිතියම් ඔබගේ දුරකථනයේ හෝම් ස්ක්‍රීන් එකට ලබා ගන්න.",
      installBtn: "ඇප් එක ස්ථාපනය කරන්න",
      dismiss: "දැන් එපා",
      iosHeader: "iPhone / iPad හි ස්ථාපනය කිරීමට:",
      iosStep1: "පහල ඇති Share බොත්තම ඔබන්න",
      iosStep2: "පහලට ගොස් 'Add to Home Screen' ඔබන්න",
    },
    ta: {
      badge: "வேகமான ஆப் அனுபவம்",
      title: "GBC Colombo ஆப் நிறுவவும்",
      desc: "நேரலை தங்க விலைகள், 24K/22K கணக்கிடு மற்றும் கிளை வழிகளை உங்கள் முகப்புத் திரையில் பெறவும்.",
      installBtn: "ஆப் நிறுவவும்",
      dismiss: "இப்போது வேண்டாம்",
      iosHeader: "iPhone / iPad இல் நிறுவ:",
      iosStep1: "கீழே உள்ள Share பொத்தானை தட்டவும்",
      iosStep2: "கீழே சென்று 'Add to Home Screen' தட்டவும்",
    },
  };

  const t = texts[currentLang] || texts.en;

  return (
    <div
      id="pwa_install_banner"
      className="fixed bottom-[60px] md:bottom-5 left-3 right-3 sm:left-auto sm:right-5 sm:max-w-md z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="bg-neutral-950/95 dark:bg-neutral-900/95 text-white p-4 rounded-2xl border border-amber-500/40 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Subtle Ambient Glow Effect */}
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            {/* App Logo Avatar */}
            <div className="relative shrink-0">
              <img
                src="/gbc-logo-original.png"
                alt="Gold Buyers Colombo App"
                className="w-12 h-12 rounded-xl object-contain bg-neutral-900 p-1 border border-amber-400/40 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black p-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {t.badge}
                </span>
              </div>
              <h4 className="text-sm font-serif font-bold text-white truncate leading-snug">
                {t.title}
              </h4>
              <p className="text-[11px] text-neutral-300 line-clamp-2 mt-0.5 leading-relaxed">
                {t.desc}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            aria-label="Close Install App Banner"
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Row */}
        <div className="mt-3.5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2 relative z-10">
          <button
            onClick={handleDismiss}
            className="text-xs font-semibold text-neutral-400 hover:text-neutral-200 px-3 py-2 rounded-xl hover:bg-neutral-800/50 transition-colors"
          >
            {t.dismiss}
          </button>

          <button
            onClick={handleInstallClick}
            id="btn_pwa_install_now"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
            <span>{t.installBtn}</span>
          </button>
        </div>

        {/* iOS / Safari Manual Instructions Panel */}
        {showIosInstructions && (
          <div className="mt-3 pt-3 border-t border-amber-500/30 bg-amber-950/40 rounded-xl p-3 text-xs text-neutral-200 animate-in fade-in duration-200">
            <p className="font-bold text-amber-300 mb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>{t.iosHeader}</span>
            </p>
            <ol className="space-y-1.5 text-[11px] text-neutral-300">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                <span>{t.iosStep1}</span>
                <Share className="w-3.5 h-3.5 text-amber-400 inline shrink-0" />
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                <span>{t.iosStep2}</span>
                <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline shrink-0" />
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
