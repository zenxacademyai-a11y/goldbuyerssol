/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Shield, Compass, Landmark } from "lucide-react";
import { Language, translations } from "../lib/translations.js";

interface SellingProcessProps {
  currentLang: Language;
}

export default function SellingProcess({ currentLang }: SellingProcessProps) {
  const t = translations[currentLang];

  const steps = [
    {
      num: "01",
      icon: <Compass className="h-6 w-6 text-amber-500" />,
      title: t.step1Title,
      desc: t.step1Desc,
    },
    {
      num: "02",
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      title: t.step2Title,
      desc: t.step2Desc,
    },
    {
      num: "03",
      icon: <Shield className="h-6 w-6 text-amber-500" />,
      title: t.step3Title,
      desc: t.step3Desc,
    },
    {
      num: "04",
      icon: <Landmark className="h-6 w-6 text-amber-500" />,
      title: t.step4Title,
      desc: t.step4Desc,
    },
  ];

  return (
    <section className="py-20 px-4 bg-white border-t border-neutral-100 text-neutral-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-700 block mb-3 font-semibold">
            In-Store Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-950 mb-4">
            {t.processTitle}
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t.processSubtitle}
          </p>
        </div>
 
        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          {/* Connecting line for desktop timeline */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[1px] bg-neutral-200 z-0"></div>
 
          {steps.map((step, index) => (
            <div
              key={step.num}
              className="relative bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col items-center text-center group hover:border-amber-500/30 transition-all duration-300 hover:shadow-md hover:shadow-amber-500/5 shadow-sm z-10"
            >
              {/* Step indicator circle */}
              <div className="h-14 w-14 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-6 shadow-sm group-hover:border-amber-500/55 transition-colors z-20">
                {step.icon}
              </div>
 
              {/* Step index badge */}
              <span className="absolute top-4 right-4 text-xs font-mono font-bold text-neutral-300 group-hover:text-amber-700/60 transition-colors">
                {step.num}
              </span>
 
              {/* Details */}
              <h3 className="text-lg font-serif font-bold text-neutral-900 group-hover:text-amber-700 transition-colors mb-3">
                {step.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
