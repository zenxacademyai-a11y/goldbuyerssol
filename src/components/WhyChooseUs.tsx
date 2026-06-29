/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Award, ShieldCheck, Scale, Compass, Coins, Users } from "lucide-react";
import { Language, translations } from "../lib/translations.js";

interface WhyChooseUsProps {
  currentLang: Language;
}

export default function WhyChooseUs({ currentLang }: WhyChooseUsProps) {
  const t = translations[currentLang];

  const benefits = [
    {
      icon: <Award className="h-6 w-6 text-amber-500" />,
      title: t.why1Title,
      desc: t.why1Desc,
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-amber-500" />,
      title: t.why2Title,
      desc: t.why2Desc,
    },
    {
      icon: <Scale className="h-6 w-6 text-amber-500" />,
      title: t.why3Title,
      desc: t.why3Desc,
    },
    {
      icon: <Coins className="h-6 w-6 text-amber-500" />,
      title: t.why4Title,
      desc: t.why4Desc,
    },
    {
      icon: <Users className="h-6 w-6 text-amber-500" />,
      title: "Government Compliant",
      desc: "Licensed exchange complying with the Central Bank of Sri Lanka and Sri Lanka Gem and Jewellery Authority regulations.",
    },
    {
      icon: <Compass className="h-6 w-6 text-amber-500" />,
      title: "Centrally Located Lounge",
      desc: "Our high-security private trading lounge is centrally located in Colombo, offering secure customer parking and top privacy.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white text-neutral-900 border-t border-neutral-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-700 block mb-3 font-semibold">
            Premium Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-950 mb-4">
            {t.whyTitle}
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t.whySubtitle}
          </p>
        </div>
 
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 hover:border-amber-500/30 hover:bg-neutral-50 transition-all duration-300 shadow-sm"
            >
              <div className="h-12 w-12 rounded bg-amber-500/5 border border-amber-500/20 flex items-center justify-center mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-serif font-bold text-neutral-900 mb-2.5">
                {benefit.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
