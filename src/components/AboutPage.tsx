/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Award, ShieldCheck, History, Target, Users, Gem, Sparkles, Building2, MapPin, Phone } from "lucide-react";
import { Language } from "../lib/translations.js";

interface AboutPageProps {
  currentLang: Language;
  setView: (view: "home" | "blog" | "admin" | "about" | "contact") => void;
}

const aboutTranslations = {
  en: {
    title: "About Gold Buyers Colombo",
    subtitle: "Sri Lanka's leading professional gold exchange institution setting global standards in transparency.",
    legacyTitle: "Our 50-Year Trusted Legacy",
    legacyText1: "Established originally in 1976, Gold Buyers Colombo (GBC) has served generations of Sri Lankans with honesty, reliability, and precision. We pioneered the shift from old-fashioned, destructive acid scratch tests and arbitrary 'dirt deductions' to professional, non-destructive computerized gold appraisals in Colombo.",
    legacyText2: "Today, we operate a secure, high-end private gold exchange office centered in the heart of Colombo, offering the highest payouts based directly on global spot refinery rates.",
    missionTitle: "Our Mission & Commitment",
    missionText: "To empower gold sellers in Sri Lanka by providing an completely transparent, zero-stress appraisal experience with zero hidden fees, utilizing state-of-the-art XRF spectrometers and government-calibrated scales.",
    valuesTitle: "Our Core Pillars",
    value1Title: "100% Scientific Appraisal",
    value1Desc: "No guesswork. No scratching. We utilize non-destructive X-Ray Fluorescence (XRF) spectrometer technology to determine gold purity down to 0.01% in 30 seconds.",
    value2Title: "Highest Payouts",
    value2Desc: "Because we export directly to international gold refineries, we can operate on thinner margins and offer up to 2.5% premium bonuses above standard market rates.",
    value3Title: "Secure private lounge",
    value3Desc: "Your privacy is paramount. Transactions are carried out in highly confidential private chambers equipped with high-security locks, compliance audits, and CCTV.",
    statsTitle: "GBC by the Numbers",
    stat1Val: "1976",
    stat1Lbl: "Year Established",
    stat2Val: "35k+",
    stat2Lbl: "Valuations Completed",
    stat3Val: "100%",
    stat3Lbl: "Accurate XRF Testing",
    stat4Val: "4.9 ★",
    stat4Lbl: "Google Maps Rating",
    teamTitle: "Our Leadership Team",
    teamSubtitle: "Managed by certified mineralogists, gemologists, and financial compliance officers with international gold market expertise.",
    ctaTitle: "Ready to Experience GBC?",
    ctaSubtitle: "Bring your gold jewelry, coins, bullion, or scrap to our Colombo office for a free computerized valuation.",
    ctaBtn1: "Calculate Payout Estimate",
    ctaBtn2: "Contact Our Appraisal Desk"
  },
  si: {
    title: "ගෝල්ඩ් බයර්ස් කොළඹ අප ගැන",
    subtitle: "විනිවිදභාවය සහ පාරිභෝගික විශ්වාසය අතින් ශ්‍රී ලංකාවේ ප්‍රමුඛතම වෘත්තීය රන් හුවමාරු ආයතනය.",
    legacyTitle: "වසර 50ක විශ්වාසනීය උරුමය",
    legacyText1: "1976 දී ආරම්භ කරන ලද ගෝල්ඩ් බයර්ස් කොළඹ (GBC), පරම්පරා ගණනාවක් පුරා ශ්‍රී ලාංකිකයන්ට අවංකභාවයෙන් සහ විශ්වාසයෙන් යුතුව සේවය කර ඇත. රන්වලට හානි කරන පැරණි අම්ල පරීක්ෂණ සහ අසාධාරණ 'අලාභ කැපීම්' වෙනුවට නවීන පරිගණක තාක්ෂණයෙන් යුත් රන් ඇගයීම් ක්‍රම ශ්‍රී ලංකාවට මුලින්ම හඳුන්වා දුන්නේ අප ආයතනයයි.",
    legacyText2: "අද වන විට, අපි කොළඹ හදවතෙහි පිහිටි අපගේ ආරක්ෂිත, සුඛෝපභෝගී කාර්යාලය හරහා ගෝලීය වෙළඳපල රන් මිල ගණන් මත පදනම්ව ඉහළම ගෙවීම් ලබා දෙන්නෙමු.",
    missionTitle: "අපගේ අරමුණ සහ කැපවීම",
    missionText: "නවීනතම XRF තාක්ෂණය සහ රජයේ සහතික ලත් ඉතා සියුම් තරාදි භාවිතා කරමින්, කිසිදු සැඟවුණු කැපීමකින් තොරව පූර්ණ විනිවිදභාවයෙන් යුතු රන් විකිණීමේ අත්දැකීමක් ශ්‍රී ලාංකිකයන්ට ලබා දීම අපගේ අරමුණයි.",
    valuesTitle: "අපගේ මූලික කුළුණු",
    value1Title: "100% විද්‍යාත්මක පරීක්ෂාව",
    value1Desc: "කිසිදු අනුමානයක් හෝ රන්වලට හානියක් නැත. අපි තත්පර 30කින් 0.01%ක් දක්වා නිවැරදිව රන් පිරිසිදුතාවය මනින XRF තාක්ෂණය භාවිතා කරමු.",
    value2Title: "ඉහළම මිල සහතිකය",
    value2Desc: "අප සෘජුවම ජාත්‍යන්තර රන් පිරිපහදු වෙත අපනයනය කරන බැවින්, අපට වෙළඳපල මිලට වඩා 2.5% දක්වා වැඩි මිලක් ගෙවිය හැකිය.",
    value3Title: "සුරක්ෂිත පෞද්ගලික මැදිරිය",
    value3Desc: "ඔබේ රහස්‍යභාවය අපට අතිශයින්ම වැදගත් වේ. සියලුම ගනුදෙනු CCTV නිරීක්ෂණ සහිත පෞද්ගලික ආරක්ෂිත කාමර තුළ සිදුවේ.",
    statsTitle: "සංඛ්‍යාලේඛන මගින් GBC",
    stat1Val: "1976",
    stat1Lbl: "ආරම්භක වර්ෂය",
    stat2Val: "35,000+",
    stat2Lbl: "තක්සේරු කිරීම්",
    stat3Val: "100%",
    stat3Lbl: "නිවැරදි XRF පරීක්ෂාව",
    stat4Val: "4.9 ★",
    stat4Lbl: "ගූගල් පරිශීලක ඇගයීම්",
    teamTitle: "අපගේ නායකත්ව කණ්ඩායම",
    teamSubtitle: "දේශීය හා විදේශීය රන් වෙළඳපල පිළිබඳ මනා පළපුරුද්දක් ඇති සහතික ලත් ඛනිජ විද්‍යාඥයින් සහ මූල්‍ය නිලධාරීන්ගෙන් සමන්විත වේ.",
    ctaTitle: "අදම පැමිණ වෙනස වටහා ගන්න",
    ctaSubtitle: "නොමිලේ පරිගණකගත රන් තක්සේරුවක් ලබා ගැනීම සඳහා ඔබේ රන් ආභරණ කොළඹ කාර්යාලය වෙත රැගෙන එන්න.",
    ctaBtn1: "දැන්ම මිල ගණනය කරන්න",
    ctaBtn2: "කාර්යාලය අමතන්න"
  },
  ta: {
    title: "கோல்ட் பையர்ஸ் கொழும்பு எங்களைப் பற்றி",
    subtitle: "வெளிப்படைத்தன்மை மற்றும் வாடிக்கையாளர் நம்பிக்கையில் சர்வதேச தரத்தை நிர்ணயிக்கும் இலங்கையின் முன்னணி தங்கம் பரிமாற்ற நிறுவனம்.",
    legacyTitle: "எங்களது 50 வருட நம்பகமான பாரம்பரியம்",
    legacyText1: "1976 ஆம் ஆண்டில் தொடங்கப்பட்ட கோல்ட் பையர்ஸ் கொழும்பு (GBC), தலைமுறைகளாக இலங்கை மக்களுக்கு நேர்மையாகவும் துல்லியமாகவும் சேவை செய்து வருகிறது. தங்கத்திற்கு சேதம் விளைவிக்கும் பழைய அமில சோதனைகள் மற்றும் நியாயமற்ற கழிவு பிடித்தல்களுக்கு பதிலாக நவீன கணினிமயமாக்கப்பட்ட தங்கம் மதிப்பீட்டு முறைகளை இலங்கையில் முதன்முதலில் அறிமுகப்படுத்தியது நாமே.",
    legacyText2: "இன்று, நாங்கள் கொழும்பின் மையப்பகுதியில் எங்களது பாதுகாப்பான, ஆடம்பர அலுவலகத்தின் மூலம் உலகளாவிய சந்தை தங்க விலையின் அடிப்படையில் மிக உயர்ந்த கொடுப்பனவுகளை வழங்குகிறோம்.",
    missionTitle: "எங்கள் நோக்கம் மற்றும் அர்ப்பணிப்பு",
    missionText: "மேம்பட்ட XRF தொழில்நுட்பம் மற்றும் அரசால் சான்றளிக்கப்பட்ட தராசுகளைப் பயன்படுத்தி, எந்தவொரு மறைமுக கழிவுகளும் இல்லாமல் முழுமையான வெளிப்படைத்தன்மையுடன் தங்கத்தை விற்கும் அனுபவத்தை இலங்கை மக்களுக்கு வழங்குவதே எமது நோக்கமாகும்.",
    valuesTitle: "எங்கள் முக்கிய தூண்கள்",
    value1Title: "100% அறிவியல் சோதனை",
    value1Desc: "யூகங்கள் ஏதுமின்றி, தங்கத்திற்கு எந்த சேதமும் விளைவிக்காமல், 30 வினாடிகளில் 0.01% துல்லியமாக தங்கத்தின் தூய்மையை அளவிடும் XRF தொழில்நுட்பத்தை பயன்படுத்துகிறோம்.",
    value2Title: "மிக உயர்ந்த கொடுப்பனவு",
    value2Desc: "நாங்கள் நேரடியாக சர்வதேச சுத்திகரிப்பு நிலையங்களுக்கு ஏற்றுமதி செய்வதால், எங்களால் சந்தை விலையை விட 2.5% வரை கூடுதல் லாபம் வழங்க முடிகிறது.",
    value3Title: "பாதுகாப்பான தனிப்பட்ட அறை",
    value3Desc: "உங்களின் ரகசியம் எங்களுக்கு மிகவும் முக்கியமானது. அனைத்து பரிவர்த்தனைகளும் CCTV கண்காணிப்புடன் கூடிய தனிப்பட்ட பாதுகாப்பான அறைகளில் நடைபெறும்.",
    statsTitle: "புள்ளிவிவரங்கள் மூலம் GBC",
    stat1Val: "1976",
    stat1Lbl: "தொடங்கப்பட்ட ஆண்டு",
    stat2Val: "35,000+",
    stat2Lbl: "மதிப்பீடுகள்",
    stat3Val: "100%",
    stat3Lbl: "துல்லியமான XRF சோதனை",
    stat4Val: "4.9 ★",
    stat4Lbl: "கூகுள் மதிப்பீடு",
    teamTitle: "எங்கள் தலைமைக்குழு",
    teamSubtitle: "உள்நாட்டு மற்றும் சர்வதேச தங்க சந்தையில் அனுபவம் வாய்ந்த சான்றளிக்கப்பட்ட தாதுப் பொறியாளர்கள் மற்றும் நிதி அதிகாரிகள் கொண்ட குழு.",
    ctaTitle: "அதிநவீன சேவையை அனுபவிக்க தயாரா?",
    ctaSubtitle: "இலவச கணினிமயமாக்கப்பட்ட தங்க மதிப்பீட்டைப் பெற உங்களது தங்க ஆபரணங்களை எங்களது கொழும்பு அலுவலகத்திற்கு கொண்டு வாருங்கள்.",
    ctaBtn1: "விலையைக் கணக்கிடுக",
    ctaBtn2: "எங்களை அழைக்கவும்"
  }
};

export default function AboutPage({ currentLang, setView }: AboutPageProps) {
  const t = aboutTranslations[currentLang] || aboutTranslations.en;

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 overflow-hidden pb-16">
      
      {/* Dynamic continuous background animated gradient using Framer Motion */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.01) 50%, transparent 80%)",
            "radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.01) 50%, transparent 80%)",
            "radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.04) 0%, rgba(251, 191, 36, 0.01) 50%, transparent 80%)",
            "radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.01) 50%, transparent 80%)"
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 z-0 pointer-events-none"></div>

      {/* Hero Banner Section */}
      <div className="relative z-10 max-w-7xl mx-auto pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-800 text-xs tracking-widest uppercase mb-6 font-mono font-bold shadow-sm"
        >
          <Award className="h-4 w-4 text-amber-600" />
          <span>Colombo's Certified Exchange Since 1976</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-neutral-950 mb-6 max-w-4xl mx-auto leading-[1.15]"
        >
          {t.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          {t.subtitle}
        </motion.p>
      </div>

      {/* Grid content: Legacy & Mission */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Legacy Narrative (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
                <History className="h-5 w-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-950">
                {t.legacyTitle}
              </h2>
            </div>
            
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              {t.legacyText1}
            </p>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              {t.legacyText2}
            </p>

            {/* Mission highlight card */}
            <div className="bg-amber-500/5 rounded-2xl border border-amber-500/20 p-6 flex gap-4 items-start shadow-sm mt-8">
              <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-800 flex-shrink-0">
                <Target className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-neutral-950 text-sm mb-1.5">{t.missionTitle}</h4>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">{t.missionText}</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase (lg:col-span-5) */}
          <div className="lg:col-span-5">
            <div className="relative p-2 bg-gradient-to-b from-neutral-100 to-neutral-200 border border-neutral-300 rounded-3xl shadow-xl overflow-hidden group">
              {/* Glass container inside */}
              <div className="bg-white rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-amber-700 font-bold">Scientific Validation</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                
                <h3 className="text-lg font-serif font-bold text-neutral-950">
                  Computerized Gold Analysis
                </h3>
                
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Testing is executed via high-precision computerized X-Ray Fluorescence (XRF) Spectrometer technology. This eliminates any structural damage or scraping.
                </p>

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-700 space-y-2.5">
                  <div className="flex justify-between">
                    <span>Appraisal Accuracy:</span>
                    <span className="font-bold text-amber-700">99.99% Certified</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scales Calibration:</span>
                    <span className="font-bold text-amber-700">SL Gem Authority</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Time:</span>
                    <span className="font-bold text-amber-700">Under 5 Mins</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-amber-800 font-semibold bg-amber-500/10 px-4 py-2.5 rounded-lg border border-amber-500/20 justify-center">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Licensed gem & jewelry authority guidelines</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Stats Section with Glassmorphism grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-neutral-50 rounded-3xl border border-neutral-200 p-8 sm:p-12 shadow-sm text-center">
          <h3 className="text-xs font-mono uppercase tracking-widest text-amber-700 mb-8 font-semibold">
            {t.statsTitle}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-serif font-black text-neutral-950">{t.stat1Val}</div>
              <div className="text-[10px] sm:text-xs font-mono text-neutral-500 uppercase tracking-wider">{t.stat1Lbl}</div>
            </div>
            <div className="space-y-1 border-l border-neutral-200">
              <div className="text-3xl sm:text-4xl font-serif font-black text-neutral-950">{t.stat2Val}</div>
              <div className="text-[10px] sm:text-xs font-mono text-neutral-500 uppercase tracking-wider">{t.stat2Lbl}</div>
            </div>
            <div className="space-y-1 border-l border-neutral-200">
              <div className="text-3xl sm:text-4xl font-serif font-black text-neutral-950">{t.stat3Val}</div>
              <div className="text-[10px] sm:text-xs font-mono text-neutral-500 uppercase tracking-wider">{t.stat3Lbl}</div>
            </div>
            <div className="space-y-1 border-l border-neutral-200">
              <div className="text-3xl sm:text-4xl font-serif font-black text-neutral-950">{t.stat1Val === "1976" ? "4.9 ★" : t.stat4Val}</div>
              <div className="text-[10px] sm:text-xs font-mono text-neutral-500 uppercase tracking-wider">{t.stat4Lbl}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-950">
            {t.valuesTitle}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 hover:border-amber-500/30 hover:shadow-lg transition-all shadow-sm">
            <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center rounded-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              {t.value1Title}
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
              {t.value1Desc}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 hover:border-amber-500/30 hover:shadow-lg transition-all shadow-sm">
            <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center rounded-lg">
              <Gem className="h-5 w-5" />
            </div>
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              {t.value2Title}
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
              {t.value2Desc}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 hover:border-amber-500/30 hover:shadow-lg transition-all shadow-sm">
            <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              {t.value3Title}
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
              {t.value3Desc}
            </p>
          </div>

        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-neutral-950 to-neutral-900 border border-amber-500/20 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] z-0 pointer-events-none"></div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-amber-400">
              {t.ctaTitle}
            </h2>
            
            <p className="text-neutral-300 text-sm max-w-xl mx-auto leading-relaxed">
              {t.ctaSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={() => {
                  setView("home");
                  setTimeout(() => {
                    const el = document.getElementById("calculator");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-extrabold uppercase tracking-widest text-xs rounded transition-all cursor-pointer shadow-lg shadow-amber-500/10"
              >
                {t.ctaBtn1}
              </button>
              <button
                onClick={() => setView("contact")}
                className="w-full sm:w-auto px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-extrabold uppercase tracking-widest text-xs rounded transition-all cursor-pointer"
              >
                {t.ctaBtn2}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
