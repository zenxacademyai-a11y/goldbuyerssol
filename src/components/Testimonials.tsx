/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Star, ShieldCheck, Quote } from "lucide-react";
import { Language, translations } from "../lib/translations.js";

interface TestimonialsProps {
  currentLang: Language;
}

export default function Testimonials({ currentLang }: TestimonialsProps) {
  const t = translations[currentLang];

  const reviews = [
    {
      name: "Roshan Devendra",
      location: "Colombo 03",
      stars: 5,
      date: "2 weeks ago",
      text: "Sold some old family jewelry to GBC. Truly amazed by the computerized testing. Standard shops tried to claim the gold was lower carat to cut rates, but GBC showed me the spectrometer readings on screen. Got 45,000 LKR more than standard jewelry shops offered!",
    },
    {
      name: "Tharushi de Silva",
      location: "Nugegoda",
      stars: 5,
      date: "1 month ago",
      text: "Extremely professional, high-end experience. The lounge feels like a private Swiss bank. Very safe, polite officers, and fast cash transfer directly to my Commercial Bank account in 10 minutes. Will definitely recommend GBC over pawning centers.",
    },
    {
      name: "Mohamed Rilwan",
      location: "Colombo 10",
      stars: 5,
      date: "2 months ago",
      text: "Best gold buyer in Colombo hands down. Honest scales, no hidden commissions. They weighed my items on digital scales right in front of me and calculated the payout on their computer. Zero stress, highly recommended.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white border-t border-neutral-100 text-neutral-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-amber-700 block mb-3 font-semibold">
              Client Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-950 mb-2">
              Trusted by 3,500+ Sri Lankans
            </h2>
            <p className="text-neutral-600 text-xs sm:text-sm">
              Read real-world reviews from people who got cash for gold with complete honesty.
            </p>
          </div>
 
          {/* Google Ratings Trust Badge */}
          <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 p-4 rounded-xl">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center font-bold text-amber-700 font-serif border border-amber-500/20 shadow">
              G
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-base font-extrabold text-neutral-900">4.9</span>
                <div className="flex text-amber-600">
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                </div>
              </div>
              <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono mt-0.5">
                Google Business Profile
              </p>
            </div>
          </div>
        </div>
 
        {/* Reviews Cards Slider / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between hover:border-amber-500/30 transition-all group shadow-sm"
            >
              <div>
                <Quote className="h-6 w-6 text-amber-700/20 mb-4" />
                
                {/* Stars */}
                <div className="flex text-amber-600 mb-3">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
 
                {/* Review Text */}
                <p className="text-xs text-neutral-700 leading-relaxed italic mb-6">
                  "{rev.text}"
                </p>
              </div>
 
              {/* Author */}
              <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                <div>
                  <h4 className="text-xs font-serif font-bold text-neutral-900 group-hover:text-amber-700 transition-colors">
                    {rev.name}
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    {rev.location}
                  </p>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
