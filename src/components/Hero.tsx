import React, { useState, useEffect } from "react";
import { 
  Phone, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Calendar, 
  ChevronDown, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Zap, 
  Lock, 
  Scale, 
  CircleDollarSign,
  Building,
  TrendingUp,
  Clock,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../lib/translations.js";
import InteractiveBackground from "./InteractiveBackground.js";
import ResponsiveImage from "./ResponsiveImage.js";

interface HeroProps {
  currentLang: Language;
}

// Smooth Count Up component
function Counter({ end, suffix = "", prefix = "", decimals = 0 }: { end: number; suffix?: string; prefix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = easeProgress * end;
      setCount(Number(current.toFixed(decimals)));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [end, decimals]);

  return (
    <span className="font-extrabold tracking-tight">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Hero({ currentLang }: HeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const text = `Hi Gold Buyers Colombo,\nI would like to book a VIP appointment.\nName: ${name}\nPhone: ${phone}\nPreferred Date/Time: ${date}`;
      const url = `https://wa.me/94718321321?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
      setIsModalOpen(false);
      setName("");
      setPhone("");
      setDate("");
      setIsSubmitting(false);
    }, 600);
  };

  const marqueeBadges = [
    "No.1 Gold Buyer in Colombo",
    "100% XRF Non-Destructive Testing",
    "Instant Cash & Local Bank Transfer",
    "Highest Daily Market Payouts",
    "Zero Acid & Dirt Deductions",
    "Licensed SLGJA Gold Merchant",
    "22K & 24K Gold Jewelry",
    "Gold Coins & Bullion Bars",
    "Confidential VIP Appraisal Room",
    "Over 50 Years Legacy"
  ];

  return (
    <section className="w-full bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 relative overflow-hidden pt-24 pb-16 px-4 md:pt-32 md:pb-24">
      {/* Interactive Background with floating particle icons */}
      <InteractiveBackground />

      {/* Luxurious Ambient Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Headline, Value Prop, CTAs, Trust Signals & Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Top Glassmorphism Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md shadow-sm mb-6"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-xs font-bold tracking-wider text-amber-950 uppercase">
                {currentLang === "si" 
                  ? "කොළඹ නො.1 බලපත්‍රලාභී රන් ගැනුම්කරුවෝ" 
                  : currentLang === "ta" 
                  ? "கொழும்பின் No.1 சான்றளிக்கப்பட்ட தங்கம் வாங்குபவர்" 
                  : "No.1 Licensed Gold Buyer in Colombo, Sri Lanka"}
              </span>
            </motion.div>

            {/* Main Headline (2-3 lines, bold, gold gradient highlight) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] xl:text-[64px] font-black tracking-tight leading-[1.08] text-neutral-900 mb-6">
              {currentLang === "si" ? (
                <>
                  <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent block sm:inline">
                    නො.1 විශ්වාසදායක
                  </span>{" "}
                  <span className="text-neutral-900">රන් ගැනුම්කරුවෝ</span>
                  <br className="hidden sm:block" />
                  <span className="text-neutral-800"> කොළඹ, ශ්‍රී ලංකාව</span>
                </>
              ) : currentLang === "ta" ? (
                <>
                  <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent block sm:inline">
                    No.1 நம்பகமான
                  </span>{" "}
                  <span className="text-neutral-900">தங்கம் வாங்குபவர்</span>
                  <br className="hidden sm:block" />
                  <span className="text-neutral-800"> கொழும்பு, இலங்கை</span>
                </>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent block sm:inline">
                    No.1 Trusted
                  </span>{" "}
                  <span className="text-neutral-900">Gold Buyer</span>
                  <br className="hidden sm:block" />
                  <span className="text-neutral-800">in Colombo, Sri Lanka</span>
                </>
              )}
            </h1>

            {/* Subtitle / Value Proposition */}
            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mb-8 max-w-2xl">
              {currentLang === "si" ? (
                "ඔබගේ රන් ආභරණ, රන් කාසි සහ රන් බාර් සඳහා 100% නිවැරදි පරිගණක XRF පරීක්ෂාවෙන් පසු ශ්‍රී ලංකාවේ ඉහළම වෙළඳපල මිලට ක්ෂණික මුදල් හෝ බැංකු තැන්පතු ලබා ගන්න. ශතපහකවත් අසාධාරණ කැපීම් නැත."
              ) : currentLang === "ta" ? (
                "உங்கள் தங்க நகைகள், தங்க நாணயங்கள் மற்றும் தங்கக் கட்டிகளுக்கு 100% கணினி எக்ஸ்ஆர்எஃப் பரிசோதனை மூலம் இலங்கையின் மிக உயர்ந்த சந்தை விலைக்கு உடனடி பணமளிப்பு பெறுக."
              ) : (
                "Get the absolute highest cash payout for your gold jewelry, coins, and bullion. Experience 100% transparent, non-destructive XRF computerized purity testing with instant cash or bank transfers on the spot."
              )}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-8">
              {/* Primary CTA - Gold Gradient - Get Today's Gold Price */}
              <a 
                href="#live-rates" 
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-amber-500 text-neutral-950 font-black text-base transition-all duration-200 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 no-underline group cursor-pointer"
              >
                <TrendingUp className="h-5 w-5 text-neutral-950 group-hover:scale-110 transition-transform duration-200" />
                <span>{currentLang === "si" ? "අද රන් මිල බලන්න" : currentLang === "ta" ? "இன்றைய தங்க விலை" : "Get Today's Gold Price"}</span>
                <ArrowRight className="h-4 w-4 text-neutral-950 group-hover:translate-x-1 transition-transform duration-200" />
              </a>

              {/* Secondary CTA - WhatsApp Now */}
              <a 
                href="https://wa.me/94718321321?text=Hi%20Gold%20Buyers%20Colombo%2C%20I%20would%20like%20to%20get%20today%27s%20gold%20buying%20rate." 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base transition-all duration-200 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/35 hover:-translate-y-0.5 no-underline cursor-pointer"
              >
                <Phone className="h-5 w-5 fill-white text-white" />
                <span>{currentLang === "si" ? "WhatsApp මගින් සම්බන්ධ වන්න" : currentLang === "ta" ? "WhatsApp தொடர்பு கொள்க" : "WhatsApp Now"}</span>
              </a>
            </div>

            {/* Trust Signal Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl mb-10">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-neutral-200/80 shadow-xs backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-neutral-800">Licensed & Compliant</span>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-neutral-200/80 shadow-xs backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-neutral-800">Instant Payouts</span>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-neutral-200/80 shadow-xs backdrop-blur-sm col-span-2 sm:col-span-1">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                  <Scale className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-neutral-800">XRF Purity Testing</span>
              </div>
            </div>

            {/* Animated Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
              <div className="p-4 rounded-2xl bg-white/85 border border-amber-500/20 shadow-md backdrop-blur-md flex flex-col items-start">
                <div className="text-2xl sm:text-3xl font-black text-neutral-900 mb-0.5">
                  <Counter end={3500} suffix="+" />
                </div>
                <span className="text-[11px] font-medium text-neutral-600 uppercase tracking-wide">
                  Happy Sellers
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/85 border border-amber-500/20 shadow-md backdrop-blur-md flex flex-col items-start">
                <div className="text-2xl sm:text-3xl font-black text-neutral-900 mb-0.5">
                  <Counter end={50} suffix="+" />
                </div>
                <span className="text-[11px] font-medium text-neutral-600 uppercase tracking-wide">
                  Years Legacy
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/85 border border-amber-500/20 shadow-md backdrop-blur-md flex flex-col items-start">
                <div className="text-2xl sm:text-3xl font-black text-neutral-900 mb-0.5 flex items-center gap-1">
                  <Counter end={4.9} decimals={1} />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400 inline" />
                </div>
                <span className="text-[11px] font-medium text-neutral-600 uppercase tracking-wide">
                  Google Rating
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/85 border border-amber-500/20 shadow-md backdrop-blur-md flex flex-col items-start">
                <div className="text-2xl sm:text-3xl font-black text-amber-600 mb-0.5">
                  <Counter end={100} suffix="%" />
                </div>
                <span className="text-[11px] font-medium text-neutral-600 uppercase tracking-wide">
                  Payout Rate
                </span>
              </div>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: Hero Showcase Card with Glassmorphic Badges */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative w-full flex flex-col items-center"
          >
            {/* Outer Luxury Frame Container */}
            <div className="relative w-full rounded-[28px] p-3 bg-gradient-to-b from-amber-300/40 via-white/80 to-amber-200/30 border border-amber-400/40 shadow-2xl shadow-amber-950/10 backdrop-blur-xl">
              
              {/* Inner Image Frame */}
              <div className="relative rounded-[20px] overflow-hidden aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] bg-neutral-900 group">
                <ResponsiveImage
                  srcFallback="/images/gallery-1.jpg"
                  srcSm="/images/gallery-1-sm.webp"
                  srcMd="/images/gallery-1-md.webp"
                  srcLg="/images/gallery-1-lg.webp"
                  alt="Precision Computerized Gold Purity Valuation at Gold Buyers Colombo"
                  priority={true}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Vignette Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/20 pointer-events-none" />

                {/* Top Right Floating Badge - Instant Payout */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute top-4 right-4 bg-neutral-950/90 border border-amber-500/40 text-white px-3.5 py-2.5 rounded-2xl backdrop-blur-md shadow-xl flex items-center gap-2.5"
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="text-left">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Payout Status</p>
                    <p className="text-xs font-bold text-amber-400">Instant Cash / Transfer</p>
                  </div>
                </motion.div>

                {/* Bottom Overlay Info Banner */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-100">XRF Computerized Purity Test</h4>
                      <p className="text-[11px] text-neutral-400">100% Non-Destructive • Zero Damage</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500 text-black">
                    FREE
                  </span>
                </div>
              </div>

              {/* Live Gold Price Card (22K & 24K) Directly in Hero */}
              <div className="mt-3 p-4 rounded-2xl bg-neutral-900 border border-amber-500/30 shadow-lg text-white">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Live Gold Buying Rate Today</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">Updated Today</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-2.5 rounded-xl bg-neutral-800/80 border border-amber-500/20">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">24K Solid Gold</span>
                    <span className="text-sm sm:text-base font-black text-amber-300">Rs. 31,250 <span className="text-[10px] text-neutral-400 font-normal">/g</span></span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-800/80 border border-amber-500/20">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">22K Jewelry Gold</span>
                    <span className="text-sm sm:text-base font-black text-amber-300">Rs. 28,650 <span className="text-[10px] text-neutral-400 font-normal">/g</span></span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Glassmorphism Floating Trust Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-4 w-full p-4 rounded-2xl bg-white/90 border border-neutral-200/80 shadow-lg backdrop-blur-md flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-amber-500 text-black text-xs font-bold flex items-center justify-center">G</span>
                  <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">B</span>
                  <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-amber-400 text-black text-xs font-bold flex items-center justify-center">C</span>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-neutral-800">4.9/5 Rating from 3,500+ Sellers</p>
                </div>
              </div>
              
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                Verified Reviews
              </span>
            </motion.div>

          </motion.div>

        </div>

        {/* Dual Angled Overlapping Marquee Ribbons (Inspired by image) */}
        <div className="relative mt-20 mb-8 py-12 w-[110vw] left-1/2 -translate-x-1/2 overflow-hidden pointer-events-none select-none">
          {/* Background glow behind ribbons */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 blur-2xl pointer-events-none" />

          {/* Ribbon 1: Bright Gold/Lime Ribbon (Tilted -2.5 degrees, scrolling left) */}
          <div className="relative z-20 w-full transform -rotate-[2.5deg] scale-105 shadow-2xl py-3.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-lime-300 text-neutral-950 border-y-2 border-amber-500/50 my-[-10px]">
            <div className="flex w-max animate-marquee-left gap-6 font-black text-xs sm:text-sm tracking-wider uppercase items-center">
              {[
                "⚡ NO.1 TRUSTED GOLD BUYER IN COLOMBO",
                "★ HIGHEST DAILY MARKET PAYOUTS",
                "⚡ 100% XRF COMPUTERIZED PURITY TESTING",
                "★ INSTANT CASH & BANK TRANSFER",
                "⚡ ZERO ACID & DIRT DEDUCTIONS",
                "★ LICENSED SLGJA GOLD MERCHANT",
                "⚡ 50+ YEARS TRUSTED LEGACY",
                "★ 3,500+ SATISFIED CLIENTS",
                "⚡ NO.1 TRUSTED GOLD BUYER IN COLOMBO",
                "★ HIGHEST DAILY MARKET PAYOUTS",
                "⚡ 100% XRF COMPUTERIZED PURITY TESTING",
                "★ INSTANT CASH & BANK TRANSFER",
                "⚡ ZERO ACID & DIRT DEDUCTIONS",
                "★ LICENSED SLGJA GOLD MERCHANT",
                "⚡ 50+ YEARS TRUSTED LEGACY",
                "★ 3,500+ SATISFIED CLIENTS",
              ].map((item, idx) => (
                <span key={idx} className="flex items-center gap-2 whitespace-nowrap drop-shadow-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Ribbon 2: Dark Luxury Ribbon (Tilted +2.5 degrees, scrolling right) */}
          <div className="relative z-10 w-full transform rotate-[2.5deg] scale-105 shadow-2xl py-3.5 bg-neutral-950/95 text-amber-300 border-y border-amber-500/40 my-[-10px] backdrop-blur-md">
            <div className="flex w-max animate-marquee-right gap-6 font-extrabold text-xs sm:text-sm tracking-wider uppercase items-center">
              {[
                "✦ 22K & 24K GOLD JEWELRY",
                "✨ SOLID GOLD COINS & BULLION BARS",
                "✦ CONFIDENTIAL VIP APPRAISAL ROOM",
                "✨ 4.9 GOOGLE MAPS RATING",
                "✦ 16 BRANCHES IN COLOMBO",
                "✨ SERVING KOLLUPITIYA, BAMBALAPITIYA & WELLAWATTE",
                "✦ PROVEN PERFORMANCE & TRANSPARENCY",
                "✨ 22K & 24K GOLD JEWELRY",
                "✦ SOLID GOLD COINS & BULLION BARS",
                "✨ CONFIDENTIAL VIP APPRAISAL ROOM",
                "✦ 4.9 GOOGLE MAPS RATING",
                "✨ 16 BRANCHES IN COLOMBO",
                "✦ SERVING KOLLUPITIYA, BAMBALAPITIYA & WELLAWATTE",
                "✨ PROVEN PERFORMANCE & TRANSPARENCY",
              ].map((item, idx) => (
                <span key={idx} className="flex items-center gap-2 whitespace-nowrap text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Appointment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md" 
              onClick={() => setIsModalOpen(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl border border-amber-500/30 p-6 sm:p-8 w-full max-w-md relative z-10 shadow-2xl pointer-events-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-5 right-5 p-1 rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Lock className="h-3 w-3" /> Confidential VIP Desk
                </div>
                <h3 className="text-2xl font-black text-neutral-900">Book VIP Appointment</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Schedule your private gold valuation at our Colombo branch.
                </p>
              </div>

              <form onSubmit={handleBookAppointment} className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Your Full Name *
                  </label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" 
                    placeholder="e.g. Ruwan Perera" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono" 
                    placeholder="077 123 4567" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Preferred Date & Time *
                  </label>
                  <input 
                    type="text" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" 
                    placeholder="e.g. Tomorrow at 10:30 AM" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-amber-500 text-neutral-950 font-black uppercase tracking-widest text-xs rounded-xl transition-all mt-6 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {isSubmitting ? "Opening WhatsApp Desk..." : "Confirm & Chat on WhatsApp"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
