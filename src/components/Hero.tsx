import React, { useState, useEffect } from "react";
import { 
  Phone, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Calendar, 
  X, 
  ArrowRight, 
  Star, 
  Zap, 
  Lock, 
  Scale, 
  TrendingUp,
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

  return (
    <section className="w-full min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] bg-gradient-to-b from-amber-50/80 via-white to-amber-50/40 relative overflow-hidden flex flex-col justify-between pt-16 sm:pt-20 pb-2 px-3 sm:px-6 lg:px-8">
      {/* Interactive Background with floating particle icons */}
      <InteractiveBackground />

      {/* Luxurious Ambient Background Glows */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container - Single Viewport Layout */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center relative z-10 my-auto">
        
        {/* Two-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center my-auto">
          
          {/* LEFT COLUMN: Headline, Value Prop, CTAs, Trust Badges, Counters */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md shadow-2xs mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-bold tracking-wider text-amber-950 uppercase">
                {currentLang === "si" 
                  ? "කොළඹ නො.1 බලපත්‍රලාභී රන් ගැනුම්කරුවෝ" 
                  : currentLang === "ta" 
                  ? "கொழும்பின் No.1 சான்றளிக்கப்பட்ட தங்கம் வாங்குபவர்" 
                  : "No.1 Licensed Gold Buyer in Colombo, Sri Lanka"}
              </span>
            </div>

            {/* Main Headline (Strictly 2 Lines) */}
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-black tracking-tight leading-[1.1] text-neutral-900 mb-2">
              {currentLang === "si" ? (
                <>
                  <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent block">
                    නො.1 විශ්වාසදායක රන් ගැනුම්කරුවෝ
                  </span>
                  <span className="text-neutral-900 block mt-0.5">
                    කොළඹ, ශ්‍රී ලංකාව
                  </span>
                </>
              ) : currentLang === "ta" ? (
                <>
                  <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent block">
                    No.1 நம்பகமான தங்கம் வாங்குபவர்
                  </span>
                  <span className="text-neutral-900 block mt-0.5">
                    கொழும்பு, இலங்கை
                  </span>
                </>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent block">
                    No.1 Trusted Gold Buyer
                  </span>
                  <span className="text-neutral-900 block mt-0.5">
                    in Colombo, Sri Lanka
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle / Concise Value Proposition */}
            <p className="text-xs sm:text-sm lg:text-base text-neutral-600 font-normal leading-relaxed mb-4 max-w-xl">
              {currentLang === "si" ? (
                "100% නිවැරදි පරිගණක XRF පරීක්ෂාවෙන් පසු ශ්‍රී ලංකාවේ ඉහළම වෙළඳපල මිලට ක්ෂණික මුදල් හෝ බැංකු තැන්පතු ලබා ගන්න. කිසිදු අසාධාරණ කැපීමක් නැත."
              ) : currentLang === "ta" ? (
                "100% கணினி எක්ස්ఆర్එஃப் பரிசோதனை மூலம் இலங்கையின் மிக உயர்ந்த சந்தை விலைக்கு உடனடி பணமளிப்பு பெறுக."
              ) : (
                "Get the absolute highest cash payout for your gold with 100% transparent XRF computerized purity testing and instant payment on the spot."
              )}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row items-center gap-2.5 w-full sm:w-auto mb-4">
              {/* Primary CTA */}
              <a 
                href="#live-rates" 
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-amber-500 text-neutral-950 font-black text-xs sm:text-sm transition-all duration-200 shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-0.5 no-underline group cursor-pointer"
              >
                <TrendingUp className="h-4 w-4 text-neutral-950 group-hover:scale-110 transition-transform duration-200" />
                <span>{currentLang === "si" ? "අද රන් මිල බලන්න" : currentLang === "ta" ? "இன்றைய தங்க விலை" : "Get Today's Gold Price"}</span>
                <ArrowRight className="h-3.5 w-3.5 text-neutral-950 group-hover:translate-x-1 transition-transform duration-200" />
              </a>

              {/* Secondary Outline Button */}
              <a 
                href="https://wa.me/94718321321?text=Hi%20Gold%20Buyers%20Colombo%2C%20I%20would%20like%20to%20get%20today%27s%20gold%20buying%20rate." 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/80 hover:bg-amber-50/80 border border-neutral-300 hover:border-amber-500/80 text-neutral-900 font-bold text-xs sm:text-sm transition-all duration-200 shadow-2xs hover:shadow-md backdrop-blur-md cursor-pointer no-underline group"
              >
                <Phone className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>{currentLang === "si" ? "WhatsApp" : currentLang === "ta" ? "WhatsApp" : "WhatsApp Now"}</span>
              </a>
            </div>

            {/* Trust Signal Badges in Glassmorphism Cards */}
            <div className="flex flex-wrap gap-2 w-full max-w-xl mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white/90 border border-amber-500/30 shadow-2xs backdrop-blur-md text-[11px] font-bold text-neutral-800">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                <span>Licensed Gold Buyer</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white/90 border border-amber-500/30 shadow-2xs backdrop-blur-md text-[11px] font-bold text-neutral-800">
                <Zap className="h-3.5 w-3.5 text-emerald-600" />
                <span>Instant Payment</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white/90 border border-amber-500/30 shadow-2xs backdrop-blur-md text-[11px] font-bold text-neutral-800">
                <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
                <span>Best Market Rates</span>
              </div>
            </div>

            {/* Animated Counters Grid */}
            <div className="grid grid-cols-4 gap-2 w-full max-w-xl">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white/85 border border-amber-500/20 shadow-2xs backdrop-blur-md flex flex-col items-start">
                <div className="text-sm sm:text-lg font-black text-neutral-900 leading-tight">
                  <Counter end={3500} suffix="+" />
                </div>
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-tight">
                  Customers
                </span>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-white/85 border border-amber-500/20 shadow-2xs backdrop-blur-md flex flex-col items-start">
                <div className="text-sm sm:text-lg font-black text-neutral-900 leading-tight">
                  <Counter end={50} suffix="+" />
                </div>
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-tight">
                  Years Exp
                </span>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-white/85 border border-amber-500/20 shadow-2xs backdrop-blur-md flex flex-col items-start">
                <div className="text-sm sm:text-lg font-black text-neutral-900 leading-tight flex items-center gap-0.5">
                  <Counter end={4.9} decimals={1} />
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400 inline" />
                </div>
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-tight">
                  Rating
                </span>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-white/85 border border-amber-500/20 shadow-2xs backdrop-blur-md flex flex-col items-start">
                <div className="text-sm sm:text-lg font-black text-amber-600 leading-tight">
                  <Counter end={100} suffix="%" />
                </div>
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-tight">
                  Payout
                </span>
              </div>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: Showcase Card with Integrated Rates */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 w-full max-w-md mx-auto flex flex-col items-center"
          >
            <div className="relative w-full rounded-2xl p-2.5 bg-gradient-to-b from-amber-300/40 via-white/90 to-amber-200/30 border border-amber-400/40 shadow-lg backdrop-blur-xl">
              
              {/* Image & Video Frame */}
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-neutral-900 group">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/img-1.jpeg"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                >
                  <source src="/gbc-hero-bg-video.mp4" type="video/mp4" />
                  <source src="/assets/gbc-hero-bg-video.mp4" type="video/mp4" />
                  <img
                    src="/img-1.jpeg"
                    alt="Precision Computerized Gold Purity Valuation at Gold Buyers Colombo"
                    className="w-full h-full object-cover"
                  />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/20 pointer-events-none" />

                {/* Floating Top Badge */}
                <div className="absolute top-2.5 right-2.5 bg-neutral-950/90 border border-amber-500/40 text-white px-2.5 py-1.5 rounded-xl backdrop-blur-md shadow-md flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-amber-400">Instant Cash / Transfer</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-neutral-100">XRF Computerized Test</h4>
                      <p className="text-[9px] text-neutral-400">100% Non-Destructive</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-black">
                    FREE
                  </span>
                </div>
              </div>

              {/* Integrated Live Gold Price Card (22K & 24K) */}
              <div className="mt-2 p-2.5 rounded-xl bg-neutral-900 border border-amber-500/30 shadow-md text-white">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-neutral-800">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Live Rates Today</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 font-mono">Updated</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="p-2 rounded-lg bg-neutral-800/80 border border-amber-500/20">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">24K Solid Gold</span>
                    <span className="text-xs sm:text-sm font-black text-amber-300">Rs. 31,250 <span className="text-[9px] text-neutral-400 font-normal">/g</span></span>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-800/80 border border-amber-500/20">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">22K Jewelry Gold</span>
                    <span className="text-xs sm:text-sm font-black text-amber-300">Rs. 28,650 <span className="text-[9px] text-neutral-400 font-normal">/g</span></span>
                  </div>
                </div>
              </div>

            </div>

            {/* Compact Review Card */}
            <div className="mt-2 w-full p-2 rounded-xl bg-white/90 border border-neutral-200/80 shadow-2xs backdrop-blur-md flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">G</span>
                  <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">B</span>
                  <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-amber-400 text-black text-[10px] font-bold flex items-center justify-center">C</span>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-neutral-800">4.9/5 from 3,500+ Sellers</p>
                </div>
              </div>
              
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>

          </motion.div>

        </div>

      </div>

      {/* Docked Horizontal Marquee Ticker at Section Bottom */}
      <div className="w-full py-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-neutral-950 font-black text-[11px] tracking-wider uppercase overflow-hidden rounded-xl shadow-2xs mt-auto">
        <div className="flex w-max animate-marquee-left gap-6 items-center">
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
          ].map((item, idx) => (
            <span key={idx} className="flex items-center gap-2 whitespace-nowrap">
              {item}
            </span>
          ))}
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
