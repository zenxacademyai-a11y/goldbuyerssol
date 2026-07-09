import React from "react";
import { Phone, CheckCircle, ShieldCheck, Award, MessageCircle, Coins, Gem, Scale, Sparkles, Flame, Move, Rotate3d, Compass, Users, Calendar, Building2, ChevronDown, ArrowRight } from "lucide-react";
import { Language, translations } from "../lib/translations.js";

export default function Hero({ currentLang }: { currentLang: Language }) {
  const services = [
    "Sell Gold Jewelry",
    "Highest Cash Price",
    "Gold Testing",
    "Pawning Items",
    "Scrap Gold",
    "Gold Coins",
    "24K Gold",
    "22K Gold",
    "18K Gold",
    "Instant Cash Payment",
    "XRF Computer Testing",
    "Trusted Appraisers",
  ];

  return (
    <section className="w-full bg-white relative overflow-hidden pt-24 pb-16 px-4 md:pt-32 md:pb-24">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center relative z-10">
        
        {/* Top Pill */}
        <div className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full border border-neutral-200 bg-neutral-50 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-neutral-600 uppercase">
            {currentLang === "si" ? "කොළඹ රන් ගැනුම්කරුවන්" : currentLang === "ta" ? "கொழும்பில் தங்கம் வாங்குபவர்கள்" : "Gold Buyers in Colombo"}
          </span>
        </div>

        {/* Big Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
          <span className="text-neutral-900 block md:inline">Trusted </span>
          <span className="text-neutral-900 block md:inline">Gold Buyers</span>
          <br className="hidden md:block" />
          <span className="text-neutral-900"> in </span>
          <span className="text-amber-500">Colombo</span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl text-neutral-600 text-sm md:text-base leading-relaxed mb-10">
          {currentLang === "si" ? 
            "කොළඹ වඩාත්ම විශ්වාසදායක රන් ගැනුම්කරුවන් — ඔබගේ රන් ආභරණ, රන් කාසි සහ රන් බාර් සඳහා ඉහළම මුදල් ගෙවීම් ශ්‍රී ලංකාව පුරා ලබා දීම." : 
           currentLang === "ta" ? 
            "கொழும்பின் மிகவும் நம்பகமான தங்கம் வாங்குபவர்கள் - உங்கள் தங்க நகைகள், தங்க நாணயங்கள் மற்றும் தங்கக் கட்டிகளுக்கு அதிகபட்ச பணத்தை வழங்குகிறோம்." : 
            "Colombo's most trusted gold buyers, gold merchants & pawning services — delivering the highest cash payout for your gold jewelry, gold coins, scrap gold & more across Sri Lanka."}
        </p>

        {/* Chips - Scrolling Marquee */}
        <div className="w-full md:w-[120vw] lg:w-[150vw] max-w-none overflow-hidden mb-12 flex flex-col gap-3 relative [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] left-1/2 -translate-x-1/2">
          {/* Row 1 - Left to Right */}
          <div className="flex w-max animate-marquee-left gap-3">
            {[...services.slice(0, 6), ...services.slice(0, 6), ...services.slice(0, 6), ...services.slice(0, 6)].map((service, idx) => (
              <div key={`r1-${idx}`} className="inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-neutral-200 bg-white shadow-sm text-[10px] md:text-xs font-bold text-neutral-600">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                {service}
              </div>
            ))}
          </div>
          
          {/* Row 2 - Right to Left */}
          <div className="flex w-max animate-marquee-right gap-3">
            {[...services.slice(6, 12), ...services.slice(6, 12), ...services.slice(6, 12), ...services.slice(6, 12)].map((service, idx) => (
              <div key={`r2-${idx}`} className="inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-neutral-200 bg-white shadow-sm text-[10px] md:text-xs font-bold text-neutral-600">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                {service}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm md:text-base transition-colors duration-200">
            Get Free Quote
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 font-bold text-sm md:text-base transition-colors duration-200 shadow-sm">
            <MessageCircle className="h-4 w-4 text-amber-500" />
            WhatsApp Now
          </button>
        </div>

      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1">
        <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">Scroll Down</span>
        <a
          href="#calculator"
          className="text-neutral-400 hover:text-amber-600 transition-colors duration-200 animate-bounce mt-1"
        >
          <ChevronDown className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
