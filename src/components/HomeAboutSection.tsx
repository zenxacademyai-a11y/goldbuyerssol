import React from "react";
import { Award, ShieldCheck, Building, CheckCircle2, ArrowRight, HeartHandshake, MapPin } from "lucide-react";
import { Language } from "../lib/translations.js";
import ResponsiveImage from "./ResponsiveImage.js";

interface HomeAboutSectionProps {
  currentLang: Language;
  setView?: (view: any) => void;
}

export default function HomeAboutSection({ currentLang, setView }: HomeAboutSectionProps) {
  return (
    <section className="py-20 px-4 bg-amber-100/30 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 border-t border-amber-200/50 dark:border-neutral-800 relative overflow-hidden transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 group">
              <ResponsiveImage
                srcFallback="/assest/img-7.jpeg"
                srcSm="/assest/img-7.jpeg"
                srcMd="/assest/img-7.jpeg"
                srcLg="/assest/img-7.jpeg"
                alt="Gold Buyers Colombo Private Appraisal Lounge"
                className="w-full h-full"
                imgClassName="w-full h-64 sm:h-80 lg:h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Legacy Info Box Below Image */}
            <div className="mt-3 p-4 rounded-2xl bg-neutral-900 dark:bg-neutral-900 border border-neutral-800 text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">50+ Years Legacy Since 1976</h4>
                  <p className="text-xs text-neutral-300">Sri Lanka's Premier Gold Exchange Merchant</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Story & Credentials */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-widest mb-4">
              <Building className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>{currentLang === "si" ? "අපගේ කතාව සහ අභිමානය" : currentLang === "ta" ? "எங்கள் வரலாறு" : "About Gold Buyers Colombo (GBC)"}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight mb-6">
              {currentLang === "si" ? (
                <>වසර 50ක අසමාන විශ්වාසය සහ <span className="text-amber-600 dark:text-amber-400">විනිවිදභාවය</span></>
              ) : currentLang === "ta" ? (
                <>50 வருட කාල <span className="text-amber-600 dark:text-amber-400">நம்பகத்தன்மை</span> மற்றும் சேவை</>
              ) : (
                <>50+ Years of Uncompromising <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">Trust & Transparency</span></>
              )}
            </h2>

            <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
              {currentLang === "si"
                ? "1976 වසරේ සිට ශ්‍රී ලංකාවේ ප්‍රමුඛතම රන් ගැනුම්කරුවන් ලෙස, පරම්පරා ගණනාවක විශ්වාසය ආරක්ෂා කරමින් අපි කටයුතු කරන්නෙමු. ශ්‍රී ලංකා මැණික් හා ස්වර්ණාභරණ අධිකාරියේ (SLGJA) පූර්ණ අනුකූලතාවය සහිතව, නවීනතම XRF පරිගණක තාක්ෂණයෙන් 100% ක් නිවැරදි තක්සේරුවක් ලබා දීමට අපි බැඳී සිටිමු."
                : currentLang === "ta"
                ? "1976 ஆம் ஆண்டு முதல் இலங்கையின் முன்னணி தங்கம் வாங்குபவர்களாக பல தலைமுறைகளாக சேவையாற்றி வருகிறோம். இலங்கை இரத்தினக்கல் மற்றும் ஆபரண அதிகார சபையின் (SLGJA) அங்கீகாரத்துடன், நவீன எக்ஸ்ஆர்எஃப் கணினி தொழில்நுட்பம் மூலம் வெளிப்படையான சேவையை வழங்குகிறோம்."
                : "Established in 1976, Gold Buyers Colombo (GBC) is Sri Lanka's leading certified gold exchange merchant. Fully compliant with Sri Lanka Gem & Jewellery Authority (SLGJA) directives, we introduced non-destructive XRF computerized purity testing to Colombo, ensuring gold owners get exact market payouts without deductions."}
            </p>

            {/* Core Values / Mission Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-0.5">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 dark:text-white mb-1">Our Mission</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-normal">
                    Provide 100% transparent gold liquidations with zero hidden fees and maximum daily market payouts.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-0.5">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 dark:text-white mb-1">16 Colombo Branches</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-normal">
                    Secure private lounges in Kollupitiya, Bambalapitiya, Wellawatte, Dehiwala, Nugegoda & Kohuwala.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {setView && (
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => { setView("about"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Read Full History</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button 
                  onClick={() => { setView("branches"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="px-6 py-3.5 rounded-xl bg-amber-100 hover:bg-amber-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border border-amber-300/60 dark:border-neutral-700"
                >
                  <MapPin className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                  <span>Find Nearest Branch</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
