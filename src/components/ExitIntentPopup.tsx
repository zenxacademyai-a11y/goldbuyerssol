/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, Smartphone, X, Sparkles, CheckCircle, Share, PlusSquare, ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import { Language } from "../lib/translations.js";

interface ExitIntentPopupProps {
  currentLang: Language;
}

const popupTranslations = {
  en: {
    badge: "INSTANT GBC APP & VALUATION",
    title: "Install Gold Buyers Colombo App",
    subtitle: "Get instant live gold rates, offline pawn rate calculator, and instant valuation right on your smartphone.",
    installBtn: "Install Web App",
    whatsappBtn: "WhatsApp Valuation",
    iosTitle: "How to Install on iPhone / iPad",
    iosStep1: "Tap the Share button at the bottom of Safari",
    iosStep2: "Scroll down and tap 'Add to Home Screen'",
    iosStep3: "Tap 'Add' in the top right corner to finish",
    feature1: "Instant 24/7 Live Pawn Rates",
    feature2: "Fast Cash Valuation Booking",
    close: "Close",
    dismissText: "No thanks, continue to website"
  },
  si: {
    badge: "GBC ඇප් එක සහ සජීවී තක්සේරුව",
    title: "Gold Buyers Colombo ඇප් එක install කරගන්න",
    subtitle: "කොළඹ සජීවී රන් මිල, උකස් ගණකය සහ ක්ෂණික තක්සේරුව ඔබගේ දුරකථනයටම ලබාගන්න.",
    installBtn: "ඇප් එක ස්ථාපනය කරන්න",
    whatsappBtn: "WhatsApp තක්සේරුව",
    iosTitle: "iPhone / iPad වල Install කරන ආකාරය",
    iosStep1: "Safari හි පහළ ඇති Share බොත්තම ඔබන්න",
    iosStep2: "'Add to Home Screen' මත තෝරන්න",
    iosStep3: "දකුණු පස ඉහළ ඇති 'Add' මත ඔබන්න",
    feature1: "සජීවී රන් සහ උකස් මිල ගණන්",
    feature2: "ක්ෂණික මුදල් තක්සේරු සේවාව",
    close: "වසා දමන්න",
    dismissText: "පසුව බලන්න"
  },
  ta: {
    badge: "GBC செயலி மற்றும் உடனடி மதிப்பீடு",
    title: "Gold Buyers Colombo செயலியை நிறுவவும்",
    subtitle: "கொழும்பு தங்க விலையின் உடனடி அறிவிப்புகள் மற்றும் அடகு மதிப்பீட்டை உங்கள் மொபைலில் பெறவும்.",
    installBtn: "செயலியை நிறுவவும்",
    whatsappBtn: "WhatsApp மதிப்பீடு",
    iosTitle: "iPhone / iPad இல் நிறுவுவது எப்படி",
    iosStep1: "Safari இன் கீழே உள்ள Share பொத்தானைத் தட்டவும்",
    iosStep2: "'Add to Home Screen' என்பதைத் தேர்ந்தெடுக்கவும்",
    iosStep3: "மேல் வலது மூலையில் உள்ள 'Add' என்பதைக் கிளிக் செய்யவும்",
    feature1: "நேரலை தங்க மற்றும் அடகு விலைகள்",
    feature2: "உடனடி பண மதிப்பீட்டு சேவை",
    close: "மூடுக",
    dismissText: "பிறகு பார்க்கவும்"
  }
};

export default function ExitIntentPopup({ currentLang }: ExitIntentPopupProps) {
  const t = popupTranslations[currentLang] || popupTranslations.en;

  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already dismissed in current session
    const isDismissed = sessionStorage.getItem("gbc_auto_popup_dismissed");
    if (isDismissed === "true") {
      return;
    }

    // 10-Second Auto Trigger timer
    const timer = setTimeout(() => {
      // Don't popup if app is already running as standalone app
      const isStandaloneMode = 
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;

      if (!isStandaloneMode) {
        setIsOpen(true);
      }
    }, 10000); // Trigger 10 seconds after page load

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIphoneOrIpad = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIos(isIphoneOrIpad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("gbc_auto_popup_dismissed", "true");
  };

  const handleInstall = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        handleClose();
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: If no prompt API available, open WhatsApp consultation or guide
      window.open("https://wa.me/94718321321?text=Hi%20GBC!%20I%20want%20to%20install%20the%20app%20and%20get%20live%20gold%20rates.", "_blank");
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white dark:bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-neutral-900 dark:text-neutral-100 overflow-hidden"
        >
          {/* Top Decorative Gold Glow Flare */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-yellow-500/0 rounded-full blur-2xl pointer-events-none"></div>

          {/* Close X Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer z-10"
            aria-label="Close Popup"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Popup Content Header */}
          <div className="space-y-3 pr-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] tracking-wider uppercase font-mono font-extrabold">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span>{t.badge}</span>
            </div>

            <h3 className="font-serif font-bold text-neutral-950 dark:text-white text-xl sm:text-2xl leading-snug">
              {t.title}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="my-5 p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/60 space-y-2">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{t.feature1}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0" />
              <span>{t.feature2}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleInstall}
              className="w-full py-3.5 px-5 rounded-xl font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 shadow-md border border-amber-400 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all"
            >
              <Download className="h-4 w-4 animate-bounce shrink-0" />
              <span>{t.installBtn}</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>

            <a
              href="https://wa.me/94718321321?text=Hi%20GBC!%20I%20would%20like%20to%20get%20an%20instant%20gold%20rate%20valuation."
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="w-full py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm no-underline"
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span>{t.whatsappBtn}</span>
            </a>
          </div>

          {/* Dismiss Text */}
          <button
            onClick={handleClose}
            className="w-full mt-3 text-center text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
          >
            {t.dismissText}
          </button>

          {/* iOS Guidance Sub-modal overlay */}
          {showIosGuide && (
            <div className="absolute inset-0 bg-white dark:bg-neutral-900 z-20 p-6 flex flex-col justify-between rounded-3xl animate-fadeIn">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-amber-500" />
                    <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                      {t.iosTitle}
                    </h4>
                  </div>
                  <button onClick={() => setShowIosGuide(false)} className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                    <p className="pt-0.5 text-neutral-700 dark:text-neutral-300">
                      {t.iosStep1} <Share className="inline h-3.5 w-3.5 text-blue-500 mx-1 align-middle" />
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                    <p className="pt-0.5 text-neutral-700 dark:text-neutral-300">
                      {t.iosStep2} <PlusSquare className="inline h-3.5 w-3.5 text-neutral-800 dark:text-neutral-200 mx-1 align-middle" />
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                    <p className="pt-0.5 text-neutral-700 dark:text-neutral-300">
                      {t.iosStep3}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowIosGuide(false);
                  handleClose();
                }}
                className="w-full py-2.5 bg-neutral-950 text-white font-extrabold uppercase text-xs rounded-xl mt-4 cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

