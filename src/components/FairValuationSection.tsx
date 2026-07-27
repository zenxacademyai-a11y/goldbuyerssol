import React from "react";
import { Scale, Sparkles, Calculator, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Language } from "../lib/translations.js";

interface FairValuationProps {
  currentLang: Language;
}

export default function FairValuationSection({ currentLang }: FairValuationProps) {
  const points = [
    {
      icon: <Scale className="h-6 w-6 text-amber-500" />,
      title: currentLang === "si" ? "ඩිජිටල් තරාදි බර මැනීම" : currentLang === "ta" ? "டிஜிட்டல் எடைக் கணிப்பு" : "Dual-Display Digital Weight Measurement",
      desc: currentLang === "si" 
        ? "ඔබ ඉදිරිපිටදීම ඩිජිටල් තරාදියෙන් 0.001g සියුම්ම නිවැරදිභාවයෙන් බර මැන බැලීම."
        : currentLang === "ta"
        ? "உங்கள் கண் முன்னால் துல்லியமான டிஜிட்டல் தராசில் எடை சரிபார்க்கப்படும்."
        : "Certified precision scale weighing with real-time customer dual-display screens for 100% visibility."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      title: currentLang === "si" ? "පරිගණක XRF පරීක්ෂාව" : currentLang === "ta" ? "கணினி எக்ස්ஆர்எஃப் பரிசோதனை" : "100% Non-Destructive XRF Purity Test",
      desc: currentLang === "si"
        ? "ඇසිඩ් හෝ කැපීම් වලින් තොරව XRF ස්පෙක්ට්‍රෝමීටර් පරිගණක යන්ත්‍රයෙන් කැරට් පිරිසිදුකම මැනීම."
        : currentLang === "ta"
        ? "அமிலங்கள் அல்லது வெட்டுக்கள் இல்லாமல் எக்ஸ்ஆர்எஃப் கணினி மூலம் கரட் தூய்மை கணக்கிடப்படும்."
        : "Advanced X-Ray Fluorescence technology determines exact karat percentage in 30 seconds without damaging your jewelry."
    },
    {
      icon: <Calculator className="h-6 w-6 text-amber-500" />,
      title: currentLang === "si" ? "පැහැදිලි මිල ගණනය කිරීම" : currentLang === "ta" ? "வெளிப்படையான விலை கணிப்பு" : "Transparent Price Formula",
      desc: currentLang === "si"
        ? "ලෝක වෙළඳපල සහ ශ්‍රී ලංකා රන් මිල මත පදනම්ව විනිවිදභාවයෙන් යුත් මිළ ගණනය."
        : currentLang === "ta"
        ? "உலகச் சந்தை மற்றும் இலங்கை தங்க விலையின் அடிப்படையில் நேரடி வெளிப்படையான விலை."
        : "Live per-gram market rate multiplied directly by pure gold weight — calculated transparently in front of you."
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
      title: currentLang === "si" ? "අසාධාරණ කප්පාදු නැත" : currentLang === "ta" ? "மறைமுகக் கட்டணங்கள் இல்லை" : "Zero Hidden Fees or Deductions",
      desc: currentLang === "si"
        ? "ඇසිඩ් කැපීම්, රත් කිරීමේ පාඩු හෝ වෙනත් අසාධාරණ ගාස්තු අය නොකෙරේ."
        : currentLang === "ta"
        ? "உருக்கல் இழப்பு அல்லது மறைமுகக் கட்டணங்கள் எதுவுமில்லை."
        : "No melting charges, no acid scratch deductions, and no hidden appraisal fees — you get paid the full valuation."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 text-white border-t border-neutral-800 relative overflow-hidden">
      {/* Subtle gold glow background effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <ShieldCheck className="h-4 w-4" />
            <span>{currentLang === "si" ? "විශ්වාසය සහ විනිවිදභාවය" : currentLang === "ta" ? "நம்பகத்தன்மை & வெளிப்படைத்தன்மை" : "Fair Valuation Guarantee"}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {currentLang === "si" ? (
              <>අපගේ රන් තක්සේරුව <span className="text-amber-400">100% සාධාරණ</span> වන්නේ ඇයි?</>
            ) : currentLang === "ta" ? (
              <>எங்களது தங்க மதிப்பீடு <span className="text-amber-400">100% நியாயமானது</span> ஏன்?</>
            ) : (
              <>Why Our Valuation Is <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">100% Fair & Accurate</span></>
            )}
          </h2>

          <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {currentLang === "si"
              ? "අසාධාරණ තක්සේරු කිරීම් හා සැඟවුණු කප්පාදු වලින් මිදී, ලංකාවේ ඉහළම වෙළඳපල වටිනාකම ක්ෂණිකව ලබා ගන්න."
              : currentLang === "ta"
              ? "மறைமுகக் கட்டணங்கள் இன்றி உங்கள் தங்கத்திற்கு உண்மையான உயர் சந்தை மதிப்பை உடனடியாகப் பெறுங்கள்."
              : "Eliminate doubts and unfair jewelry shop deductions. We use laboratory-grade technology so you receive every rupee your gold is truly worth."}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col justify-between group"
            >
              <div>
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {pt.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {pt.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  {pt.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <Zap className="h-3.5 w-3.5" />
                <span>100% Transparent</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
