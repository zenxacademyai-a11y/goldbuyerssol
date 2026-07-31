import React from "react";
import { Phone, MapPin, Clock, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Language } from "../lib/translations.js";

interface FinalCTAProps {
  currentLang: Language;
}

export default function FinalCTASection({ currentLang }: FinalCTAProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-amber-500 via-amber-400 to-yellow-500 text-neutral-950 relative overflow-hidden shadow-inner">
      {/* Subtle background luxury pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-950 text-amber-400 text-xs font-black uppercase tracking-widest mb-6 shadow-xl">
          <Sparkles className="h-4 w-4" />
          <span>{currentLang === "si" ? "අදම උපරිම මිල ලබා ගන්න" : currentLang === "ta" ? "இன்றைய உச்ச விலை பெறுங்கள்" : "Get Best Market Rates Today"}</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
          {currentLang === "si" ? (
            <>ඔබගේ රන් ආභරණ සඳහා <span className="underline decoration-amber-900/30">අදම ඉහළම මුදල</span> ලබා ගන්න!</>
          ) : currentLang === "ta" ? (
            <>உங்கள் தங்கத்திற்கு <span className="underline decoration-amber-900/30">இன்றே மிக உயர்ந்த</span> பணத்தைப் பெறுங்கள்!</>
          ) : (
            <>Ready to Convert Your Gold into <span className="underline decoration-amber-950/20">Instant Top Cash?</span></>
          )}
        </h2>

        {/* Subtitle */}
        <p className="text-neutral-900 font-medium text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {currentLang === "si"
            ? "විනාඩි 5කින් 100% ක් නිවැරදි පරිගණක XRF පරීක්ෂාවෙන් පසු ක්ෂණික මුදල් හෝ බැංකු තැන්පතු ලබා ගන්න. කිසිදු අසාධාරණ කැපීමක් නැත."
            : currentLang === "ta"
            ? "5 நிமிடங்களில் எக்ස්ஆர்எஃப் கணினி பரிசோதனை மூலம் உடனடி பணமளிப்பு பெற அருகிலுள்ள கிளையை தொடர்பு கொள்ளவும்."
            : "Visit our high-security private lounge in Colombo or call us now for a 100% free XRF valuation with instant cash or direct bank transfer."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {/* Direct Phone Call */}
          <a
            href="tel:0718321321"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-neutral-950 hover:bg-neutral-900 text-white font-black text-base transition-all duration-200 shadow-2xl hover:scale-105 cursor-pointer no-underline group"
          >
            <Phone className="h-5 w-5 fill-amber-400 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Call Hotline: 0718 321 321</span>
            <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Direct WhatsApp */}
          <a
            href="https://wa.me/94718321321?text=Hi%20Gold%20Buyers%20Colombo%2C%20I%20am%20interested%20in%20selling%20my%20gold."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-950 font-black text-base transition-all duration-200 shadow-xl hover:scale-105 cursor-pointer no-underline"
          >
            <Phone className="h-5 w-5 fill-emerald-600 text-emerald-600" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Store Address & Hours Trust Footer Bar */}
        <div className="pt-8 border-t border-amber-950/15 grid grid-cols-1 md:grid-cols-3 gap-6 text-neutral-950 text-xs sm:text-sm font-semibold">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-neutral-950" />
            <span>Main Flagship Lounge: Galle Road, Colombo 03, Sri Lanka</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-neutral-950" />
            <span>Open Daily: 8:30 AM – 7:30 PM (All 7 Days)</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4 shrink-0 text-neutral-950" />
            <span>Instant Cash & VIP Room Privacy Guaranteed</span>
          </div>
        </div>

      </div>
    </section>
  );
}
