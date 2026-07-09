/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Download, Sparkles, X, Share, PlusSquare, Smartphone, CheckCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../lib/translations.js";

interface InstallWebAppButtonProps {
  currentLang: Language;
  variant?: "header" | "footer" | "floating";
}

const pwaTranslations = {
  en: {
    installApp: "Install App",
    installTitle: "Download GBC Mobile App",
    installSubtitle: "Track live gold rates and compute payouts instantly on your home screen.",
    installBtn: "Install GBC App",
    alreadyInstalled: "GBC App Installed",
    iosTitle: "Install on your iPhone / iPad",
    iosStep1: "Tap the Share icon in Safari",
    iosStep2: "Scroll down and select 'Add to Home Screen'",
    iosStep3: "Tap 'Add' to place GBC on your home screen",
    pwaBenefitsTitle: "App Advantages",
    benefit1: "Real-time push alert updates on Colombo gold rates",
    benefit2: "Instant offline gold payout valuations",
    benefit3: "Secured private data storage and localized price locking",
    close: "Close"
  },
  si: {
    installApp: "ඇප් එක ගන්න",
    installTitle: "GBC ඇප් එක ඩවුන්ලෝඩ් කරන්න",
    installSubtitle: "අද රන් මිල සහ රන් තක්සේරු ගණකය ඔබගේ දුරකථනයේ මුල් තිරයටම ලබා ගන්න.",
    installBtn: "ඇප් එක ස්ථාපනය කරන්න",
    alreadyInstalled: "GBC ඇප් එක ස්ථාපනය කර ඇත",
    iosTitle: "iPhone / iPad සදහා ස්ථාපනය",
    iosStep1: "Safari බ්‍රවුසරයේ ඇති Share බොත්තම ඔබන්න",
    iosStep2: "පහළට ගොස් 'Add to Home Screen' යන්න තෝරන්න",
    iosStep3: "පසුව 'Add' යන්න ඔබා ඇප් එක එක් කරගන්න",
    pwaBenefitsTitle: "ඇප් එකෙහි වාසි",
    benefit1: "කොළඹ සජීවී රන් මිල ගණන් ක්ෂණිකව ලබා ගත හැක",
    benefit2: "අන්තර්ජාලය නොමැතිව වුවද රන් මිල ගණන් මැනගත හැක",
    benefit3: "සුරක්ෂිත පෞද්ගලික දත්ත ගබඩාව සහ මිල ස්ථාවර කිරීම",
    close: "වසන්න"
  },
  ta: {
    installApp: "செயலியைப் பெறுக",
    installTitle: "GBC செயலியைப் பதிவிறக்கவும்",
    installSubtitle: "இன்றைய தங்க விலை மற்றும் மதிப்பீட்டாளரை உங்களது மொபைல் முகப்புத் திரையிலேயே பெறுங்கள்.",
    installBtn: "செயலியை நிறுவவும்",
    alreadyInstalled: "GBC செயலி நிறுவப்பட்டுள்ளது",
    iosTitle: "iPhone / iPad-இல் நிறுவ",
    iosStep1: "Safari உலாவியில் உள்ள Share குறியீட்டை அழுத்தவும்",
    iosStep2: "கீழே உருட்டி 'Add to Home Screen' என்பதைத் தேர்ந்தெடுக்கவும்",
    iosStep3: "செயலியைச் சேர்க்க 'Add' என்பதை அழுத்தவும்",
    pwaBenefitsTitle: "செயலியின் நன்மைகள்",
    benefit1: "கொழும்பு தங்க விலையின் உடனடி அறிவிப்புகள்",
    benefit2: "இணையம் இல்லாமலும் தங்கத்தின் மதிப்பை கணக்கிடலாம்",
    benefit3: "பாதுகாப்பான தனிப்பட்ட தரவுச் சேமிப்பு மற்றும் விலை உறுதிப்பாடு",
    close: "மூடுக"
  }
};

export default function InstallWebAppButton({ currentLang, variant = "header" }: InstallWebAppButtonProps) {
  const t = pwaTranslations[currentLang] || pwaTranslations.en;

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / standalone mode
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://");
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // 2. Check if iOS device
    const checkIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIphoneOrIpad = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
      setIsIos(isIphoneOrIpad);
    };

    checkIos();

    // 3. Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      // Show iOS guidance popup
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback: If no prompt but not iOS/standalone, try to guide them or show info
      return;
    }

    // Trigger native install prompt
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  // If already running in standalone mode (installed), don't show the component
  if (isStandalone) {
    return null;
  }

  // Header Mode
  if (variant === "header") {
    // We want the button to always be visible as "Install App" if installable, iOS, or even as a premium link.
    // If none of those and not installable on current desktop browser, we can still show it or gracefully fallback.
    // To provide maximum usability, we show the header install button if:
    // - browser supports install (isInstallable) OR
    // - user is on iOS (can be added via share) OR
    // - we are in dev/preview (to showcase the feature)
    const showHeaderButton = isInstallable || isIos || true; 

    if (!showHeaderButton) return null;

    return (
      <>
        <button
          onClick={handleInstallClick}
          className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 text-xs tracking-wider uppercase font-mono font-bold transition-all shadow-sm cursor-pointer"
        >
          <Download className="h-3 w-3 animate-bounce" />
          <span>{t.installApp}</span>
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </button>

        {/* iOS installation guide overlay */}
        <AnimatePresence>
          {showIosGuide && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-neutral-900 overflow-hidden"
              >
                {/* Background gold flare */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none"></div>

                <div className="flex justify-between items-start pb-4 border-b border-neutral-100 mb-6">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-amber-600" />
                    <h3 className="font-serif font-bold text-neutral-950 text-base sm:text-lg">
                      {t.iosTitle}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowIosGuide(false)}
                    className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 flex items-center justify-center font-mono font-bold">1</span>
                    <p className="text-neutral-700 leading-normal pt-0.5">
                      {t.iosStep1} <Share className="inline h-4 w-4 text-blue-500 mx-1 align-middle" />
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 flex items-center justify-center font-mono font-bold">2</span>
                    <p className="text-neutral-700 leading-normal pt-0.5">
                      {t.iosStep2} <PlusSquare className="inline h-4 w-4 text-neutral-800 mx-1 align-middle" />
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 flex items-center justify-center font-mono font-bold">3</span>
                    <p className="text-neutral-700 leading-normal pt-0.5">
                      {t.iosStep3}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    onClick={() => setShowIosGuide(false)}
                    className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold uppercase tracking-widest text-[10px] rounded transition-all cursor-pointer"
                  >
                    {t.close}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Footer / Banner Mode
  return (
    <>
      <div className="bg-gradient-to-b from-neutral-50 to-neutral-100 border border-neutral-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Text Details (md:col-span-8) */}
          <div className="md:col-span-8 space-y-3 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-800 text-[10px] tracking-wider uppercase font-mono font-bold">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>GBC Web App Available</span>
            </div>
            
            <h3 className="font-serif font-bold text-neutral-950 text-xl sm:text-2xl leading-snug">
              {t.installTitle}
            </h3>
            
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl">
              {t.installSubtitle}
            </p>

            {/* Benefits list */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-neutral-700">
                <CheckCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span>{t.benefit1}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-700">
                <CheckCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span>{t.benefit2}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-700">
                <ShieldCheck className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span>{t.benefit3}</span>
              </div>
            </div>
          </div>

          {/* Action Button (md:col-span-4) */}
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <button
              onClick={handleInstallClick}
              className="w-full sm:w-auto md:w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-extrabold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              <span>{t.installBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* iOS installation guide overlay */}
      <AnimatePresence>
        {showIosGuide && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-neutral-900 overflow-hidden"
            >
              {/* Background gold flare */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none"></div>

              <div className="flex justify-between items-start pb-4 border-b border-neutral-100 mb-6">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-amber-600" />
                  <h3 className="font-serif font-bold text-neutral-950 text-base sm:text-lg">
                    {t.iosTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setShowIosGuide(false)}
                  className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 flex items-center justify-center font-mono font-bold">1</span>
                  <p className="text-neutral-700 leading-normal pt-0.5">
                    {t.iosStep1} <Share className="inline h-4 w-4 text-blue-500 mx-1 align-middle" />
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 flex items-center justify-center font-mono font-bold">2</span>
                  <p className="text-neutral-700 leading-normal pt-0.5">
                    {t.iosStep2} <PlusSquare className="inline h-4 w-4 text-neutral-800 mx-1 align-middle" />
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 flex items-center justify-center font-mono font-bold">3</span>
                  <p className="text-neutral-700 leading-normal pt-0.5">
                    {t.iosStep3}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-100 flex justify-end">
                <button
                  onClick={() => setShowIosGuide(false)}
                  className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold uppercase tracking-widest text-[10px] rounded transition-all cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
