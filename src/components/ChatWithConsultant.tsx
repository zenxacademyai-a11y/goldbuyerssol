/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, MapPin, ShieldCheck, HelpCircle, Building2, Flame } from "lucide-react";
import { Language } from "../lib/translations.js";

interface ChatWithConsultantProps {
  currentLang: Language;
}

interface ChatOption {
  id: string;
  name: {
    en: string;
    si: string;
    ta: string;
  };
  status: {
    en: string;
    si: string;
    ta: string;
  };
  isFlagship: boolean;
  messageTemplate: {
    en: string;
    si: string;
    ta: string;
  };
}

const chatOptions: ChatOption[] = [
  {
    id: "general",
    name: {
      en: "General Desk / Senior Consultant",
      si: "ප්‍රධාන රන් තක්සේරු අංශය (General)",
      ta: "பொது தங்க மதிப்பீட்டு பிரிவு"
    },
    status: {
      en: "Senior Valuer Online",
      si: "ජ්‍යෙෂ්ඨ තක්සේරුකරු සම්බන්ධයි",
      ta: "மூத்த மதிப்பீட்டாளர் தயார்"
    },
    isFlagship: true,
    messageTemplate: {
      en: "Hi GBC Colombo, I want to inquire about gold prices or get a valuation for my gold items.",
      si: "ආයුබෝවන් GBC, මට රන් මිල ගණන් දැනගැනීමට හෝ මගේ රන් භාණ්ඩ තක්සේරු කරවා ගැනීමට අවශ්‍යයි.",
      ta: "வணக்கம் GBC, நான் தங்கம் விலை பற்றி அறிய அல்லது எனது தங்கத்தை மதிப்பீடு செய்ய விரும்புகிறேன்."
    }
  },
  {
    id: "head_office",
    name: {
      en: "Head Office Branch (Kohuwala)",
      si: "ප්‍රධාන කාර්යාල ශාඛාව (කොහුවල)",
      ta: "தலைமை அலுவலக கிளை (கொஹுவலை)"
    },
    status: {
      en: "Full Service & Valuation Lab",
      si: "සම්පූර්ණ සේවා සහ රන් පරික්ෂණ විද්‍යාගාරය",
      ta: "முழு சேவை மற்றும் தங்க மதிப்பீட்டு ஆய்வகம்"
    },
    isFlagship: true,
    messageTemplate: {
      en: "Hi GBC Colombo, I would like to visit the Head Office Branch in Kohuwala for a direct gold valuation.",
      si: "ආයුබෝවන් GBC, මම රන් තක්සේරුවක් සඳහා කොහුවල ප්‍රධාන කාර්යාල ශාඛාවට පැමිණීමට බලාපොරොත්තු වෙමි.",
      ta: "வணக்கம் GBC, நான் கொஹுவலை தலைமை அலுவலக கிளைக்கு நேரடி தங்க மதிப்பீட்டிற்கு வர விரும்புகிறேன்."
    }
  },
  {
    id: "bambalapitiya",
    name: {
      en: "Bambalapitiya Branch (W Space)",
      si: "බම්බලපිටිය ශාඛාව (W Space)",
      ta: "பம்பலப்பிட்டி கிளை (W ஸ்பேஸ்)"
    },
    status: {
      en: "Premium Exchange & XRF Assaying Lounge",
      si: "ප්‍රමුඛතම හුවමාරු සහ XRF පරිගණක පරීක්ෂණ පරිශ්‍රය",
      ta: "பிரீமியம் பரிமாற்றம் மற்றும் XRF கணினி மதிப்பீட்டு மையம்"
    },
    isFlagship: true,
    messageTemplate: {
      en: "Hi GBC Colombo, I am planning to visit the Bambalapitiya Branch at W Space. Please provide live rate details.",
      si: "ආයුබෝවන් GBC, මම බම්බලපිටිය ශාඛාවට පැමිණීමට බලාපොරොත්තු වෙමි. කරුණාකර අද රන් මිල පිළිබඳ විස්තර ලබා දෙන්න.",
      ta: "வணக்கம் GBC, நான் பம்பலப்பிட்டி கிளைக்கு வர திட்டமிட்டுள்ளேன். இன்றைய நேரடி தங்க விலையை வழங்கவும்."
    }
  },
  {
    id: "dehiwala_icc",
    name: {
      en: "Dehiwala Branch (ICC Business Center)",
      si: "දෙහිවල ශාඛාව (ICC ව්‍යාපාරික මධ්‍යස්ථානය)",
      ta: "தெஹிவளை கிளை (ICC வணிக மையம்)"
    },
    status: {
      en: "Secure VIP Appraisal Desk",
      si: "VIP ආරක්ෂිත රන් තක්සේරු අංශය",
      ta: "VIP பாதுகாப்பான தங்க மதிப்பீட்டு பிரிவு"
    },
    isFlagship: true,
    messageTemplate: {
      en: "Hi GBC Colombo, I'd like to book an appointment for the VIP Appraisal Desk at ICC Business Center in Dehiwala.",
      si: "ආයුබෝවන් GBC, මට දෙහිවල ICC ව්‍යාපාරික මධ්‍යස්ථානයේ VIP තක්සේරු අංශය සඳහා වේලාවක් වෙන් කරවා ගැනීමට අවශ්‍යයි.",
      ta: "வணக்கம் GBC, தெஹிவளை ICC வணிக மையத்தில் உள்ள VIP மதிப்பீட்டு பிரிவில் ஒரு சந்திப்பை முன்பதிவு செய்ய விரும்புகிறேன்."
    }
  },
  {
    id: "kohuwala_hosp",
    name: {
      en: "Kohuwala Branch (Hospital Road)",
      si: "කොහුවල ශාඛාව (රෝහල් පාර)",
      ta: "கொஹுவலை கிளை (வைத்தியசாலை வீதி)"
    },
    status: {
      en: "Express Valuation Center",
      si: "ක්ෂණික රන් තක්සේරු මධ්‍යස්ථානය",
      ta: "விரைவு தங்க மதிப்பீட்டு மையம்"
    },
    isFlagship: false,
    messageTemplate: {
      en: "Hi GBC Colombo, I am coming to the Hospital Road Branch in Kohuwala for computerized gold testing.",
      si: "ආයුබෝවන් GBC, මම පරිගණකගත රන් පරීක්ෂාව සඳහා කොහුවල රෝහල් පාර ශාඛාවට පැමිණෙමි.",
      ta: "வணக்கம் GBC, கணினிமயமாக்கப்பட்ட தங்க சோதனைக்காக கொஹுவலை வைத்தியசாலை வீதி கிளைக்கு வருகிறேன்."
    }
  },
  {
    id: "dehiwala_mount",
    name: {
      en: "Dehiwala / Mount Lavinia Branch",
      si: "දෙහිවල / ගල්කිස්ස ශාඛාව",
      ta: "தெஹிவளை / கல்கிசை கிளை"
    },
    status: {
      en: "Coastal Region Valuation Hub",
      si: "වෙරළබඩ කලාපීය රන් තක්සේරු මධ්‍යස්ථානය",
      ta: "கடற்கரை பிராந்திய தங்க மதிப்பீட்டு மையம்"
    },
    isFlagship: false,
    messageTemplate: {
      en: "Hi GBC Colombo, I'm interested in selling gold at the Dehiwala / Mount Lavinia Branch.",
      si: "ආයුබෝවන් GBC, මම දෙහිවල / ගල්කිස්ස ශාඛාවෙන් රන් විකිණීමට කැමතියි.",
      ta: "வணக்கம் GBC, தெஹிவளை / கல்கிசை கிளையில் தங்கம் விற்க விரும்புகிறேன்."
    }
  }
];

export default function ChatWithConsultant({ currentLang }: ChatWithConsultantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (option: ChatOption) => {
    const text = option.messageTemplate[currentLang] || option.messageTemplate.en;
    const phone = "94718321321";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  // Translations dictionary local to widget
  const translations = {
    en: {
      buttonLabel: "Chat with Consultant",
      title: "GBC WhatsApp Desk",
      subtitle: "Select a branch to chat with our gold experts instantly",
      licensed: "Licensed Gold Buyer",
      payouts: "Highest Payouts Guaranteed"
    },
    si: {
      buttonLabel: "උපදේශකයෙකු අමතන්න",
      title: "GBC වට්ස්ඇප් සේවාව",
      subtitle: "අපගේ රන් විශේෂඥයන් සමඟ සම්බන්ධ වීමට ශාඛාවක් තෝරන්න",
      licensed: "බලපත්‍රලාභී රන් ගැනුම්කරු",
      payouts: "ඉහළම ගෙවීම් සහතිකයි"
    },
    ta: {
      buttonLabel: "ஆலோசகருடன் அரட்டை",
      title: "GBC வாட்ஸ்அப் சேவை",
      subtitle: "தங்க நிபுணர்களுடன் அரட்டையடிக்க ஒரு கிளையைத் தேர்ந்தெடுக்கவும்",
      licensed: "அங்கீகரிக்கப்பட்ட தங்க வாங்குபவர்",
      payouts: "உயர்ந்த விலை உத்தரவாதம்"
    }
  };

  const t = translations[currentLang] || translations.en;

  return (
    <div ref={widgetRef} className="fixed bottom-16 right-4 md:bottom-6 md:right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute bottom-16 right-0 w-[340px] sm:w-[380px] bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden mb-3"
            style={{ originX: 1, originY: 1 }}
          >
            {/* Header portion */}
            <div className="p-5 bg-gradient-to-br from-amber-600 to-amber-700 text-white relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center border border-white/10 shadow-inner">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-base tracking-wide flex items-center gap-1">
                    <span>{t.title}</span>
                    <span className="inline-flex h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
                  </h4>
                  <p className="text-[11px] text-amber-100 font-sans mt-0.5 leading-tight">
                    {t.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* List of Options */}
            <div className="p-3 max-h-[350px] overflow-y-auto space-y-1.5 bg-neutral-50/50">
              {chatOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  className="w-full text-left p-3.5 bg-white hover:bg-amber-50/40 rounded-2xl border border-neutral-200/70 hover:border-amber-500/35 transition-all duration-200 group flex items-start gap-3 shadow-sm active:scale-[0.98] cursor-pointer"
                >
                  <div className={`mt-0.5 h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                    option.id === "general" 
                      ? "bg-amber-500/10 text-amber-700" 
                      : option.isFlagship 
                      ? "bg-amber-600/10 text-amber-800" 
                      : "bg-neutral-100 text-neutral-600"
                  }`}>
                    {option.id === "general" ? (
                      <HelpCircle className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="font-sans font-bold text-xs text-neutral-900 group-hover:text-amber-800 transition-colors truncate">
                        {option.name[currentLang] || option.name.en}
                      </h5>
                      {option.isFlagship && option.id !== "general" && (
                        <span className="text-[8px] bg-amber-500/10 text-amber-800 px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0 uppercase">
                          Flagship
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight flex items-center gap-1 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
                      <span>{option.status[currentLang] || option.status.en}</span>
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Assurances footer */}
            <div className="p-3.5 bg-neutral-100 border-t border-neutral-200/80 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span className="flex items-center gap-1 text-amber-700 font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                <span>{t.licensed}</span>
              </span>
              <span className="flex items-center gap-1 font-bold text-amber-700">
                <Flame className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                <span>{t.payouts}</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4.5 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 border border-amber-500/20 group hover:from-amber-500 hover:to-amber-400 transition-all duration-300 cursor-pointer"
      >
        <div className="relative">
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-400 border border-white animate-ping"></span>
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-400 border border-white"></span>
          <MessageCircle className="h-5.5 w-5.5" />
        </div>
        <span className="font-sans font-extrabold text-xs tracking-wider uppercase hidden sm:inline-block">
          {t.buttonLabel}
        </span>
      </motion.button>
    </div>
  );
}
