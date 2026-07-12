import React, { useState } from "react";
import { Phone, CheckCircle, ShieldCheck, Award, MessageCircle, Coins, Gem, Scale, Sparkles, Flame, Move, Rotate3d, Compass, Users, Calendar, Building2, ChevronDown, ArrowRight, X } from "lucide-react";
import { Language, translations } from "../lib/translations.js";
import InteractiveBackground from "./InteractiveBackground.js";

export default function Hero({ currentLang }: { currentLang: Language }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const text = `Hi Gold Buyers Colombo,\nI would like to book an appointment.\nName: ${name}\nPhone: ${phone}\nDate: ${date}`;
      const url = `https://wa.me/94718321321?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
      setIsModalOpen(false);
      setName("");
      setPhone("");
      setDate("");
      setIsSubmitting(false);
    }, 600);
  };

  const services = [
    "Sell Gold Jewelry",
    "Highest Cash Price",
    "Gold Testing",
    "Scrap Gold",
    "Gold Coins",
    "24K Gold",
    "22K Gold",
    "Instant Cash Payment",
    "XRF Computer Testing",
    "Trusted Appraisers",
  ];

  return (
    <section className="w-full bg-white relative overflow-hidden pt-24 pb-16 px-4 md:pt-32 md:pb-24">
      <InteractiveBackground />
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center relative z-10 pointer-events-none">
        
        {/* Top Pill */}
        <div className="pointer-events-auto inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full border border-neutral-200 bg-neutral-50 mb-8">
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
            "Colombo's most trusted gold buyers and gold merchants — delivering the highest cash payout for your gold jewelry, gold coins, scrap gold & more across Sri Lanka."}
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
        <div className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm md:text-base transition-colors duration-200">
            0718 321 321
            <Phone className="h-4 w-4" />
          </button>
          
          <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 font-bold text-sm md:text-base transition-colors duration-200 shadow-sm">
            <Calendar className="h-4 w-4 text-amber-500" />
            Book Appointment
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

      {/* Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 w-full max-w-md relative z-10 shadow-xl animate-fade-in pointer-events-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700">
              <X className="h-5 w-5" />
            </button>
            <div className="mb-6">
              <h3 className="text-xl font-serif font-black text-neutral-900">Book Appointment</h3>
              <p className="text-sm text-neutral-600 mt-1">Fill this out to continue to WhatsApp.</p>
            </div>
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-bold">Your Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-amber-500 transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-bold">Phone Number *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono text-neutral-900 focus:outline-none focus:border-amber-500 transition-colors" placeholder="077 123 4567" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-bold">Preferred Date/Time *</label>
                <input type="text" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Tomorrow at 10 AM" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase tracking-widest text-xs rounded-lg transition-all mt-6 shadow-sm shadow-amber-500/20">
                {isSubmitting ? "Opening WhatsApp..." : "Send via WhatsApp"}
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
