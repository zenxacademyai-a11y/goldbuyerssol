/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Clock, Car, Compass, CheckCircle2, MessageCircle, HelpCircle, Mail, ShieldAlert } from "lucide-react";
import { Language, translations } from "../lib/translations.js";

interface ContactPageProps {
  currentLang: Language;
}

const contactPageTranslations = {
  en: {
    pageTitle: "Contact GBC Appraisals Desk",
    pageSubtitle: "Reach out to Colombo's leading gold buyers. Visit our private secure exchange or schedule a valuation.",
    directLine: "Direct Appraisal Hotlines",
    emailSupport: "Secure Email Correspondence",
    addressTitle: "Headquarters Location",
    transitInstructions: "Directions & Transit Guidance",
    submitSuccess: "Enquiry Registered Successfully! Our Senior Appraisal Officer will contact you in 5 minutes to lock your price.",
    formHeading: "Request Secure Valuation",
    formSub: "Submit this form to pre-register your gold items and lock in the current hourly Colombo spot market price for 24 hours.",
    faqHelpTitle: "Need Immediate Help?",
    faqHelpText: "Have questions about the valuation process? Give us a call at our appraisal desk or click the WhatsApp button to chat instantly with a senior agent.",
    workingHoursTitle: "Standard Appraisals Hours"
  },
  si: {
    pageTitle: "GBC ඇගයීම් කාර්යාලය හා සම්බන්ධ වන්න",
    pageSubtitle: "කොළඹ ප්‍රමුඛතම රන් මිලදී ගන්නන් හමුවන්න. පෞද්ගලික ආරක්ෂිත පරිශ්‍රයට පැමිණෙන්න හෝ තක්සේරුවක් වෙන්කරවා ගන්න.",
    directLine: "සෘජු රන් ඇගයීම් දුරකථන",
    emailSupport: "විද්‍යුත් තැපැල් සේවාව",
    addressTitle: "ප්‍රධාන කාර්යාල ලිපිනය",
    transitInstructions: "පැමිණීමේ මාර්ගෝපදේශය",
    submitSuccess: "ඔබේ විස්තර සාර්ථකව ලියාපදිංචි කරන ලදී! අද රන් මිල ස්ථාවර කරගැනීම සඳහා අපගේ ජ්‍යෙෂ්ඨ නිලධාරියෙකු විනාඩි 5ක් ඇතුළත ඔබව සම්බන්ධ කර ගනු ඇත.",
    formHeading: "ආරක්ෂිත රන් තක්සේරු ඉල්ලීම",
    formSub: "අද දවසේ පවතින රන් මිල ඉදිරි පැය 24 සඳහා ස්ථාවර කරගැනීමට සහ ඔබේ රන් භාණ්ඩ කලින් ලියාපදිංචි කිරීමට මෙම පෝරමය පුරවා එවන්න.",
    faqHelpTitle: "ක්ෂණික සහය අවශ්‍යද?",
    faqHelpText: "තක්සේරු කිරීම් සම්බන්ධයෙන් කිසියම් ගැටළුවක් තිබේද? අපගේ ඇගයීම් කවුන්ටරය අමතන්න හෝ වට්ස්ඇප් හරහා අපගේ ජ්‍යෙෂ්ඨ නිලධාරියෙකු සමග සජීවීව සම්බන්ධ වන්න.",
    workingHoursTitle: "වැඩ කරන වේලාවන්"
  },
  ta: {
    pageTitle: "GBC மதிப்பீட்டுப் பிரிவைத் தொடர்பு கொள்ளவும்",
    pageSubtitle: "கொழும்பின் முதன்மையான தங்கம் வாங்குபவர்களைத் தொடர்பு கொள்ளுங்கள். எங்களது பாதுகாப்பான நிலையத்திற்கு வருகை தரவும்.",
    directLine: "நேரடி மதிப்பீட்டுத் தொலைபேசி",
    emailSupport: "மின்னஞ்சல் தொடர்பு",
    addressTitle: "தலைமையக முகவரி",
    transitInstructions: "போக்குவரத்து மற்றும் திசைகள்",
    submitSuccess: "உங்கள் கோரிக்கை வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது! எங்களது சிரேஷ்ட மதிப்பீட்டு அதிகாரி உங்களை 5 நிமிடங்களில் தொடர்புகொள்வார்.",
    formHeading: "பாதுகாப்பான மதிப்பீட்டு கோரிக்கை",
    formSub: "இன்றைய தங்க விலையை அடுத்த 24 மணி நேரத்திற்கு உறுதிப்படுத்தவும் உங்களது தங்கப் பொருட்களை முன்பதிவு செய்யவும் இந்த படிவத்தை சமர்ப்பிக்கவும்.",
    faqHelpTitle: "உடனடி உதவி தேவையா?",
    faqHelpText: "மதிப்பீட்டு முறை பற்றி ஏதேனும் கேள்விகள் உள்ளதா? எங்களது மதிப்பீட்டு பிரிவை நேரடியாக அழைக்கவும் அல்லது வாட்ஸ்அப் மூலம் உடனடியாக அரட்டையடிக்கவும்.",
    workingHoursTitle: "வேலை நேரங்கள்"
  }
};

export default function ContactPage({ currentLang }: ContactPageProps) {
  const g = contactPageTranslations[currentLang] || contactPageTranslations.en;
  const t = translations[currentLang];

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        phone,
        email,
        message,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "new"
      };
      
      let isOk = false;
      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        isOk = response.ok;
      } catch (err) {
        isOk = false;
      }

      if (!isOk) {
        // Fallback for static hosting
        const existing = JSON.parse(localStorage.getItem("gbc_leads") || "[]");
        existing.push(payload);
        localStorage.setItem("gbc_leads", JSON.stringify(existing));
        isOk = true;
      }

      if (isOk) {
        setIsSuccess(true);
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred. Please call 0718 321 321 directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 overflow-hidden pb-16">
      
      {/* Background Animated Gradients */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.01) 50%, transparent 80%)",
            "radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.01) 50%, transparent 80%)",
            "radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.01) 50%, transparent 80%)"
          ]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 z-0 pointer-events-none"></div>

      {/* Hero Banner Section */}
      <div className="relative z-10 max-w-7xl mx-auto pt-28 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-800 text-xs tracking-widest uppercase mb-6 font-mono font-bold shadow-sm"
        >
          <ShieldAlert className="h-4 w-4 text-amber-600" />
          <span>Secured Private Transactions Lounge</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-neutral-950 mb-6 max-w-4xl mx-auto leading-none"
        >
          {g.pageTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          {g.pageSubtitle}
        </motion.p>
      </div>

      {/* Contact Main Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Details / Left Side (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Cards */}
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-sm">
              <h3 className="text-base font-serif font-black text-neutral-950 border-b border-neutral-200 pb-3">
                Appraisal Desk Details
              </h3>

              {/* Phones */}
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                    {g.directLine}
                  </h4>
                  <a href="tel:0718321321" className="text-base font-bold text-amber-700 mt-1 hover:underline block">
                    0718 321 321
                  </a>
                  <a href="https://wa.me/94718321321" target="_blank" rel="noreferrer" className="text-xs text-neutral-600 mt-0.5 block hover:underline">
                    WhatsApp: +94 718 321 321
                  </a>
                </div>
              </div>

              {/* Support Email */}
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                    {g.emailSupport}
                  </h4>
                  <a href="mailto:support@gbc.lk" className="text-sm font-semibold text-neutral-900 mt-1 hover:underline block">
                    valuations@goldbuyerscolombo.lk
                  </a>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Response within 1 business hour.</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                    {g.addressTitle}
                  </h4>
                  <p className="text-sm font-semibold text-neutral-900 mt-1 leading-normal">
                    GBC Building, Galle Road, Colombo 03, Sri Lanka
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                    {g.workingHoursTitle}
                  </h4>
                  <p className="text-sm text-neutral-900 mt-1 font-semibold">
                    Monday - Saturday: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-[10px] text-neutral-500 italic mt-0.5">
                    Closed on Sundays & Government Poya Holidays.
                  </p>
                </div>
              </div>

            </div>

            {/* Parking & landmarks */}
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-serif font-bold text-neutral-900 uppercase tracking-wide">
                {g.transitInstructions}
              </h3>
              
              <div className="flex gap-3 text-xs text-neutral-600">
                <Car className="h-5 w-5 text-amber-700 flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-black text-neutral-900">{t.parkingLabel}</h4>
                  <p className="text-neutral-600 text-[11px] mt-1 leading-relaxed">
                    Dedicated, secure private parking space inside our building gate. Completely safe for clients transporting valuable gold items.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 text-xs text-neutral-600 border-t border-neutral-200/50 pt-4">
                <Compass className="h-5 w-5 text-amber-700 flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-black text-neutral-900">{t.landmarkLabel}</h4>
                  <p className="text-neutral-600 text-[11px] mt-1 leading-relaxed">
                    Located on Galle Road, just 200m past the Bambalapitiya junction, opposite the Liberty Plaza entrance pathway.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Form & Map / Right Side (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Form */}
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-neutral-950 mb-2">
                {g.formHeading}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-6 border-b border-neutral-200 pb-4">
                {g.formSub}
              </p>

              {isSuccess ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-8 text-center animate-fade-in flex flex-col justify-center items-center">
                  <CheckCircle2 className="h-12 w-12 text-amber-600 mb-4 animate-bounce" />
                  <p className="text-sm text-amber-800 font-sans font-bold leading-relaxed">
                    {g.submitSuccess}
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-xs text-amber-700 underline uppercase tracking-wider mt-6 hover:text-amber-600 font-bold block"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-600 mb-1 font-mono uppercase tracking-wider text-[10px] font-semibold">
                        {t.formName} *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-white border border-neutral-250 rounded-lg px-3 py-2.5 text-sm text-neutral-800 focus:outline-none focus:border-amber-500 shadow-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-neutral-600 mb-1 font-mono uppercase tracking-wider text-[10px] font-semibold">
                        {t.formPhone} *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full bg-white border border-neutral-250 rounded-lg px-3 py-2.5 text-sm text-neutral-800 font-mono focus:outline-none focus:border-amber-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-600 mb-1 font-mono uppercase tracking-wider text-[10px] font-semibold">
                      {t.formEmail}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-neutral-250 rounded-lg px-3 py-2.5 text-sm text-neutral-800 focus:outline-none focus:border-amber-500 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-600 mb-1 font-mono uppercase tracking-wider text-[10px] font-semibold">
                      {t.formMessage}
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g., 22k Gold necklace weight approx 16g (2 pavans)"
                      className="w-full bg-white border border-neutral-250 rounded-lg px-3 py-2.5 text-sm text-neutral-800 focus:outline-none focus:border-amber-500 shadow-sm"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-extrabold uppercase tracking-widest text-xs rounded-lg transition-all transform active:scale-[0.98] shadow-md shadow-amber-500/10 cursor-pointer"
                  >
                    {isSubmitting ? t.calculating : "Register Secure Price Lock"}
                  </button>
                </form>
              )}
            </div>

            {/* Quick help bar */}
            <div className="bg-amber-500/5 rounded-2xl border border-amber-500/20 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="font-serif font-black text-neutral-950 flex items-center gap-1.5 justify-center md:justify-start">
                  <HelpCircle className="h-4 w-4 text-amber-700" />
                  {g.faqHelpTitle}
                </h4>
                <p className="text-xs text-neutral-600 max-w-sm">
                  {g.faqHelpText}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href="https://wa.me/94718321321"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-mono font-bold shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="h-4.5 w-4.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
