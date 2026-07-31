/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Calculator, Scale, FileText, Share2, Printer, Check, Info, MessageCircle } from "lucide-react";
import { Language, translations } from "../lib/translations.js";
import { GoldKarat, GoldRate, SystemSettings } from "../types.js";

interface GoldCalculatorProps {
  currentLang: Language;
  rates: GoldRate[];
  settings: SystemSettings;
  isLoading?: boolean;
}

export default function GoldCalculator({ currentLang, rates, settings, isLoading = false }: GoldCalculatorProps) {
  const t = translations[currentLang] || translations.en;
  
  // State
  const [karat, setKarat] = useState<GoldKarat>(GoldKarat.K22);
  const [weight, setWeight] = useState<number>(8); // 8g (1 pavan) default as requested
  const [unit, setUnit] = useState<"grams" | "pavans">("grams");
  const [makingCharges, setMakingCharges] = useState<number>(0); // Custom deductions option
  
  // Results
  const [calcResult, setCalcResult] = useState({
    weightInGrams: 0,
    marketValue: 0,
    premiumBonus: 0,
    testingDeductions: 0,
    finalPayout: 0,
  });

  // Calculate whenever inputs change
  useEffect(() => {
    const activeRate = rates.find((r) => r.karat === karat)?.ratePerGram || 0;
    
    // Weight conversion
    const weightInGrams = unit === "pavans" ? weight * settings.pavanWeightGrams : weight;
    
    // Standard market value
    const marketValue = weightInGrams * activeRate;
    
    // Premium bonus (+2.5%)
    const premiumBonus = marketValue * (settings.bonusPremiumRate / 100);
    
    // computerized testing/cleaning deductions
    const testingDeductions = weightInGrams * settings.testingFeePerGram;
    
    // Final payout
    const finalPayout = Math.max(0, marketValue + premiumBonus - testingDeductions - makingCharges);

    setCalcResult({
      weightInGrams,
      marketValue,
      premiumBonus,
      testingDeductions,
      finalPayout,
    });
  }, [karat, weight, unit, makingCharges, rates, settings]);

  // Prefilled WhatsApp link
  const waText = encodeURIComponent(
    `Hi GBC Colombo! I just calculated my gold payout online:
- Karat: ${karat}
- Weight: ${weight} ${unit === "grams" ? "g" : "pavan(s)"}
- Estimated Payout: LKR ${Math.round(calcResult.finalPayout).toLocaleString()}
I'd like to book an appointment to test and sell my gold today.`
  );
  const whatsappUrl = `https://wa.me/94718321321?text=${waText}`;

  const featuredKarats = [GoldKarat.K24, GoldKarat.K22, GoldKarat.K21];

  return (
    <section id="calculator" className="py-16 sm:py-20 px-4 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 scroll-mt-20 border-t border-neutral-100 dark:border-neutral-900 transition-colors">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-mono text-xs uppercase tracking-widest mb-3 font-semibold">
            <Calculator className="h-4 w-4" />
            <span>Live Valuation Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-950 dark:text-white mb-3">
            Instant Gold Valuation Calculator
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto text-sm sm:text-base">
            Enter your gold details below for an accurate live payout estimate. Highest rates guaranteed.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Section */}
          <div className="lg:col-span-7 bg-neutral-50 dark:bg-neutral-900/90 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-lg font-serif font-bold text-neutral-950 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-3 flex items-center gap-2">
                <Scale className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span>1. Specify Gold Specifications</span>
              </h3>

              {/* Karat Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-neutral-700 dark:text-neutral-300 mb-2 font-semibold">
                  Gold Type / Karat
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {featuredKarats.map((k) => (
                    <button
                      key={k}
                      onClick={() => setKarat(k)}
                      className={`py-3 rounded-xl text-sm font-bold tracking-wide border transition-all cursor-pointer ${
                        karat === k
                          ? "bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-400 text-neutral-950 font-black shadow-md"
                          : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-amber-500/50 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 shadow-2xs"
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Unit Toggles */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-neutral-700 dark:text-neutral-300 mb-2 font-semibold">
                  Weight Unit
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      setUnit("grams");
                      if (weight === 1) setWeight(8);
                    }}
                    className={`py-2.5 rounded-xl text-xs uppercase font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      unit === "grams"
                        ? "bg-amber-500/10 dark:bg-amber-400/10 border-amber-500 text-amber-800 dark:text-amber-300 font-extrabold shadow-2xs"
                        : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-750"
                    }`}
                  >
                    <span>Grams (g)</span>
                  </button>
                  <button
                    onClick={() => {
                      setUnit("pavans");
                      if (weight === 8) setWeight(1);
                    }}
                    className={`py-2.5 rounded-xl text-xs uppercase font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      unit === "pavans"
                        ? "bg-amber-500/10 dark:bg-amber-400/10 border-amber-500 text-amber-800 dark:text-amber-300 font-extrabold shadow-2xs"
                        : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-750"
                    }`}
                  >
                    <span>Pavans (8g)</span>
                  </button>
                </div>
              </div>

              {/* Weight Input Box & Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs uppercase tracking-wider font-mono text-neutral-700 dark:text-neutral-300 font-semibold">
                    Gold Weight ({unit === "grams" ? "g" : "pavan"})
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={weight || ""}
                      onChange={(e) => setWeight(Math.max(0, Number(e.target.value)))}
                      className="w-24 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-right text-base font-mono font-bold text-amber-700 dark:text-amber-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                    <span className="text-xs font-mono font-bold text-neutral-500">{unit === "grams" ? "g" : "pavan"}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max={unit === "grams" ? "100" : "15"}
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-1.5 font-mono">
                  *Standard Sri Lankan Pavan is exactly 8g.
                </span>
              </div>

              {/* Deductions (Stones / Design) */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-neutral-700 dark:text-neutral-300 mb-2 font-semibold">
                  Stones / Design Deduction (LKR if any)
                </label>
                <input
                  type="number"
                  placeholder="0 LKR"
                  value={makingCharges || ""}
                  onChange={(e) => setMakingCharges(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-mono text-neutral-800 dark:text-neutral-100 focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>
            </div>

            {/* XRF Notice Box */}
            <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed flex gap-2.5 bg-amber-50/60 dark:bg-amber-950/20 p-3.5 rounded-xl border border-amber-200/50 dark:border-amber-900/30">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                Testing is done with computerized Spectrometer XRF machines in our office. This preserves 100% of your jewelry's weight compared to melting or scraping.
              </span>
            </div>
          </div>

          {/* Live Payout Result Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-neutral-800">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  2. Estimated Live Payout
                </span>
                <span className="text-[10px] font-mono bg-amber-500/20 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                  LIVE RATE
                </span>
              </div>

              {/* Payout Display */}
              <div className="mb-6 text-center lg:text-left">
                <span className="text-xs uppercase tracking-wider font-mono text-neutral-400 block mb-1">
                  Estimated Cash / Bank Payout
                </span>
                <div className="text-3xl sm:text-4xl lg:text-3xl xl:text-4xl font-mono font-black text-amber-400 tracking-tight">
                  LKR {Math.round(calcResult.finalPayout).toLocaleString()}
                </div>
                <span className="text-[11px] text-neutral-400 font-mono mt-1 block">
                  Based on {calcResult.weightInGrams.toFixed(2)}g of {karat} Gold
                </span>
              </div>

              {/* Itemized Details */}
              <div className="space-y-2.5 py-4 border-y border-neutral-800 text-xs font-mono text-neutral-300 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Standard Market Value:</span>
                  <span className="font-bold">LKR {Math.round(calcResult.marketValue).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span>+ GBC Premium Bonus (+2.5%):</span>
                  <span className="font-bold">+LKR {Math.round(calcResult.premiumBonus).toLocaleString()}</span>
                </div>
                {makingCharges > 0 && (
                  <div className="flex justify-between items-center text-rose-400">
                    <span>- Stone / Design Deduction:</span>
                    <span className="font-bold">-LKR {makingCharges.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-neutral-400 pt-2 border-t border-neutral-800/80">
                  <span>Testing Fee (XRF Machine):</span>
                  <span className="text-emerald-400 font-bold">FREE (LKR 0)</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 no-underline"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>Get Cash Rate Quote on WhatsApp</span>
              </a>

              <a
                href="tel:0718321321"
                className="w-full py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 no-underline border border-neutral-700"
              >
                <span>Call Desk: 0718 321 321</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
