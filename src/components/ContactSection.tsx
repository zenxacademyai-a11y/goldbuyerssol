/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MapPin, Phone, Clock, Car, Compass, CheckCircle, ExternalLink } from "lucide-react";
import { Language, translations } from "../lib/translations.js";

interface ContactSectionProps {
  currentLang: Language;
}

export default function ContactSection({ currentLang }: ContactSectionProps) {
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
    <section id="contact" className="py-20 px-4 bg-amber-50/50 dark:bg-neutral-950 border-t border-amber-200/50 dark:border-neutral-900 text-neutral-900 dark:text-neutral-100 scroll-mt-20 transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-700 dark:text-amber-400 block mb-3 font-semibold">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-950 dark:text-white mb-4">
            {t.contactTitle}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto">
            {t.contactSubtitle}
          </p>
        </div>
 
        {/* Form and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Details Cards */}
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-5 shadow-sm">
              
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400 flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold">
                    {t.addressLabel}
                  </h4>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                    68 S. De S. Jayasinghe Mawatha, Nugegoda 10250, Sri Lanka
                  </p>
                </div>
              </div>
 
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400 flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold">
                    {t.phoneLabel}
                  </h4>
                  <a href="tel:0718321321" className="text-sm font-bold text-amber-700 dark:text-amber-400 mt-1 hover:underline block">
                    0718 321 321
                  </a>
                  <a href="https://wa.me/94718321321" target="_blank" rel="noreferrer" className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 block hover:underline">
                    WhatsApp: +94 718 321 321
                  </a>
                </div>
              </div>
 
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400 flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold">
                    {t.hoursLabel}
                  </h4>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100 mt-1 font-semibold">
                    Monday - Saturday: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 italic mt-0.5">
                    Closed on Sundays & Full Moon Poya Days.
                  </p>
                </div>
              </div>
 
            </div>
 
            {/* Parking & Landmark Info Box */}
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-4 shadow-sm">
              
              <div className="flex gap-3 text-xs text-neutral-600 dark:text-neutral-300">
                <Car className="h-5 w-5 text-amber-700 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-black text-neutral-900 dark:text-white">{t.parkingLabel}</h4>
                  <p className="text-neutral-600 dark:text-neutral-300 text-[11px] mt-1 leading-relaxed">
                    Dedicated, secure private parking space inside our building gate. Completely safe for clients transporting valuable gold items.
                  </p>
                </div>
              </div>
 
              <div className="flex gap-3 text-xs text-neutral-600 dark:text-neutral-300">
                <Compass className="h-5 w-5 text-amber-700 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-black text-neutral-900 dark:text-white">{t.landmarkLabel}</h4>
                  <p className="text-neutral-600 dark:text-neutral-300 text-[11px] mt-1 leading-relaxed">
                    Located at 68 S. De S. Jayasinghe Mawatha, Nugegoda 10250, Sri Lanka (ICC Business Complex / Nugegoda Flyover Junction).
                  </p>
                </div>
              </div>
 
            </div>
 
          </div>
 
          {/* Contact Form & Visual Mock Map (lg:col-span-7) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Contact Form Container */}
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-neutral-950 dark:text-white mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                Send Digital Enquiry
              </h3>
 
              {isSuccess ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 text-center animate-fade-in h-full flex flex-col justify-center items-center">
                  <CheckCircle className="h-10 w-10 text-amber-600 dark:text-amber-400 mb-3 animate-bounce" />
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-sans leading-relaxed">
                    {t.formSuccess}
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-xs text-amber-700 dark:text-amber-400 underline uppercase tracking-wider mt-4 hover:text-amber-600 dark:hover:text-amber-300 block cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-mono uppercase tracking-wider text-[10px] font-semibold">
                      {t.formName} *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-250 dark:border-neutral-700 rounded px-3 py-2 text-sm text-neutral-800 dark:text-neutral-100 focus:outline-none focus:border-amber-500 shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-mono uppercase tracking-wider text-[10px] font-semibold">
                      {t.formPhone} *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-250 dark:border-neutral-700 rounded px-3 py-2 text-sm text-neutral-800 dark:text-neutral-100 font-mono focus:outline-none focus:border-amber-500 shadow-sm"
                    />
                  </div>
 
                  <div>
                    <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-mono uppercase tracking-wider text-[10px] font-semibold">
                      {t.formEmail}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-250 dark:border-neutral-700 rounded px-3 py-2 text-sm text-neutral-800 dark:text-neutral-100 focus:outline-none focus:border-amber-500 shadow-sm"
                    />
                  </div>
 
                  <div>
                    <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-mono uppercase tracking-wider text-[10px] font-semibold">
                      {t.formMessage}
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-250 dark:border-neutral-700 rounded px-3 py-2 text-sm text-neutral-800 dark:text-neutral-100 focus:outline-none focus:border-amber-500 shadow-sm"
                    ></textarea>
                  </div>
 
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-extrabold uppercase tracking-widest text-xs rounded transition-all transform active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer"
                  >
                    {isSubmitting ? t.calculating : t.submitForm}
                  </button>
                </form>
              )}
            </div>
 
            {/* Interactive Google Map */}
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col justify-between overflow-hidden relative shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-neutral-800 dark:text-neutral-200 font-bold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span>Interactive Location Map</span>
                  </h3>
                  <a
                    href="https://maps.google.com/?q=Gold+Buyers+Colombo,+68+S.+De+S.+Jayasinghe+Mawatha,+Nugegoda+10250"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open in App</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                
                {/* Embedded Interactive Google Map */}
                <div className="h-64 sm:h-72 w-full rounded-xl bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 relative overflow-hidden shadow-inner">
                  <iframe
                    title="Gold Buyers Colombo Location Map"
                    src="https://maps.google.com/maps?q=Gold+Buyers+Colombo,+68+S.+De+S.+Jayasinghe+Mawatha,+Nugegoda+10250,+Sri+Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full rounded-xl"
                  ></iframe>
                </div>
              </div>
 
              {/* Driving details & Directions CTA */}
              <div className="text-xs text-neutral-600 dark:text-neutral-400 leading-normal font-mono border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-amber-700 dark:text-amber-400 font-bold">★ Direct Directions:</span> 68 S. De S. Jayasinghe Mawatha, Nugegoda 10250, Sri Lanka. Customer parking available.
                </div>
                <a
                  href="https://maps.google.com/?q=Gold+Buyers+Colombo,+68+S.+De+S.+Jayasinghe+Mawatha,+Nugegoda+10250"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-neutral-950 font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-sm whitespace-nowrap transition-transform active:scale-95 flex items-center justify-center gap-1.5 no-underline shrink-0"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
 
          </div>
 
        </div>
      </div>
    </section>
  );
}
