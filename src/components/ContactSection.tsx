/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MapPin, Phone, Clock, Car, Compass, CheckCircle } from "lucide-react";
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
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          message,
        }),
      });

      if (response.ok) {
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
    <section id="contact" className="py-20 px-4 bg-white border-t border-neutral-100 text-neutral-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-700 block mb-3 font-semibold">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-950 mb-4">
            {t.contactTitle}
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base max-w-2xl mx-auto">
            {t.contactSubtitle}
          </p>
        </div>
 
        {/* Form and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Details Cards */}
            <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 space-y-5 shadow-sm">
              
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold">
                    {t.addressLabel}
                  </h4>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    GBC Building, Galle Road, Colombo 03, Sri Lanka
                  </p>
                </div>
              </div>
 
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold">
                    {t.phoneLabel}
                  </h4>
                  <a href="tel:0718321321" className="text-sm font-bold text-amber-700 mt-1 hover:underline block">
                    0718 321 321
                  </a>
                  <a href="https://wa.me/94718321321" target="_blank" rel="noreferrer" className="text-xs text-neutral-600 mt-0.5 block hover:underline">
                    WhatsApp: +94 718 321 321
                  </a>
                </div>
              </div>
 
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold">
                    {t.hoursLabel}
                  </h4>
                  <p className="text-sm text-neutral-900 mt-1 font-semibold">
                    Monday - Saturday: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-[10px] text-neutral-500 italic mt-0.5">
                    Closed on Sundays & Full Moon Poya Days.
                  </p>
                </div>
              </div>
 
            </div>
 
            {/* Parking & Landmark Info Box */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-4 shadow-sm">
              
              <div className="flex gap-3 text-xs text-neutral-600">
                <Car className="h-5 w-5 text-amber-700 flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-black text-neutral-900">{t.parkingLabel}</h4>
                  <p className="text-neutral-600 text-[11px] mt-1 leading-relaxed">
                    Dedicated, secure private parking space inside our building gate. Completely safe for clients transporting valuable gold items.
                  </p>
                </div>
              </div>
 
              <div className="flex gap-3 text-xs text-neutral-600">
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
 
          {/* Contact Form & Visual Mock Map (lg:col-span-7) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Contact Form Container */}
            <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-neutral-950 mb-6 border-b border-neutral-200 pb-3">
                Send Digital Enquiry
              </h3>
 
              {isSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 text-center animate-fade-in h-full flex flex-col justify-center items-center">
                  <CheckCircle className="h-10 w-10 text-emerald-600 mb-3 animate-bounce" />
                  <p className="text-xs text-emerald-800 font-sans leading-relaxed">
                    {t.formSuccess}
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-xs text-amber-700 underline uppercase tracking-wider mt-4 hover:text-amber-600 block"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-neutral-600 mb-1 font-mono uppercase tracking-wider text-[10px] font-semibold">
                      {t.formName} *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-white border border-neutral-250 rounded px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-amber-500 shadow-sm"
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
                      className="w-full bg-white border border-neutral-250 rounded px-3 py-2 text-sm text-neutral-800 font-mono focus:outline-none focus:border-amber-500 shadow-sm"
                    />
                  </div>
 
                  <div>
                    <label className="block text-neutral-600 mb-1 font-mono uppercase tracking-wider text-[10px] font-semibold">
                      {t.formEmail}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-neutral-250 rounded px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-amber-500 shadow-sm"
                    />
                  </div>
 
                  <div>
                    <label className="block text-neutral-600 mb-1 font-mono uppercase tracking-wider text-[10px] font-semibold">
                      {t.formMessage}
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white border border-neutral-250 rounded px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-amber-500 shadow-sm"
                    ></textarea>
                  </div>
 
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-extrabold uppercase tracking-widest text-xs rounded transition-all transform active:scale-95 shadow-md shadow-amber-500/10"
                  >
                    {isSubmitting ? t.calculating : t.submitForm}
                  </button>
                </form>
              )}
            </div>
 
            {/* Map Placeholder Graphic */}
            <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between overflow-hidden relative shadow-sm">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-neutral-600 mb-4 font-semibold">
                  Visual Location Map
                </h3>
                
                {/* Visual stylised vector Map Graphic */}
                <div className="h-56 w-full rounded-lg bg-white border border-neutral-200 relative flex items-center justify-center overflow-hidden">
                  
                  {/* Grid Lines resembling roads */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
                  
                  {/* Visual Roads */}
                  <div className="absolute top-[30%] left-0 right-0 h-4 bg-neutral-100 border-y border-neutral-200 flex items-center px-4">
                    <span className="text-[7px] text-neutral-500 font-mono">GALLE ROAD</span>
                  </div>
                  <div className="absolute top-0 bottom-0 left-[60%] w-4 bg-neutral-100 border-x border-neutral-200 flex items-center justify-center">
                    <span className="text-[7px] text-neutral-500 font-mono rotate-90 whitespace-nowrap">ALFRED PLACE</span>
                  </div>
 
                  {/* Ocean Marker */}
                  <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-sky-50 border-t border-sky-100 flex items-center justify-center font-mono text-[9px] text-sky-600/40 tracking-widest">
                    INDIAN OCEAN
                  </div>
 
                  {/* GBC Colombo Red/Gold Pulsing Node */}
                  <div className="absolute top-[28%] left-[58%] z-10 flex flex-col items-center">
                    <div className="h-4 w-4 rounded-full bg-amber-500 border-2 border-neutral-100 animate-pulse shadow-lg flex items-center justify-center">
                      <div className="h-1 w-1 rounded-full bg-red-600"></div>
                    </div>
                    <span className="bg-white border border-amber-500/55 text-[8px] text-amber-700 px-1.5 py-0.5 rounded font-serif mt-1 shadow-xl whitespace-nowrap font-bold">
                      GBC Office
                    </span>
                  </div>
 
                  {/* Landmarks markers */}
                  <div className="absolute top-[10%] left-[10%] text-[8px] text-neutral-500 font-mono">
                    Majestic City Mall
                  </div>
                  <div className="absolute top-[48%] left-[65%] text-[8px] text-neutral-500 font-mono">
                    Marine Drive
                  </div>
                </div>
              </div>
 
              {/* Driving details */}
              <div className="text-xs text-neutral-600 leading-normal font-mono border-t border-neutral-200 pt-4 mt-4">
                <span className="text-amber-700 font-bold">★ Direct Directions:</span> 15 mins driving from Fort Station. Valet customer parking is located directly under our Galle Road signage.
              </div>
            </div>
 
          </div>
 
        </div>
      </div>
    </section>
  );
}
