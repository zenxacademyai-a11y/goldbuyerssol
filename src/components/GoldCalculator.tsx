/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Calculator, Phone, Share2, Printer, Check, Info, FileText } from "lucide-react";
import { Language, translations } from "../lib/translations.js";
import { GoldKarat, GoldRate, SystemSettings } from "../types.js";

interface GoldCalculatorProps {
  currentLang: Language;
  rates: GoldRate[];
  settings: SystemSettings;
  isLoading?: boolean;
}

export default function GoldCalculator({ currentLang, rates, settings, isLoading = false }: GoldCalculatorProps) {
  const t = translations[currentLang];
  
  // State
  const [karat, setKarat] = useState<GoldKarat>(GoldKarat.K22);
  const [weight, setWeight] = useState<number>(8); // 1 pavan by default
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

  // Lead capture state
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPrintVoucher, setShowPrintVoucher] = useState(false);

  // Calculate whenever inputs change
  useEffect(() => {
    const activeRate = rates.find((r) => r.karat === karat)?.ratePerGram || 0;
    
    // Weight conversion
    const weightInGrams = unit === "pavans" ? weight * settings.pavanWeightGrams : weight;
    
    // Standard market value
    const marketValue = weightInGrams * activeRate;
    
    // Premium bonus (+2.5%)
    const premiumBonus = marketValue * (settings.bonusPremiumRate / 100);
    
    // computerized testing/cleaning deductions (e.g. 150 LKR per gram, maxed or adjusted)
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

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: leadName,
        phone: leadPhone,
        email: leadEmail,
        goldKarat: karat,
        weightGrams: calcResult.weightInGrams,
        estimatedValue: calcResult.finalPayout,
        message: `Generated via Online Calculator. Unit selected: ${weight} ${unit}.`,
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
        setLeadName("");
        setLeadPhone("");
        setLeadEmail("");
      } else {
        alert("Lead submission failed. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Error sending request. Please call our desk directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prefilled WhatsApp link
  const waText = encodeURIComponent(
    `Hi GBC Colombo! I just calculated my gold payout online:
- Karat: ${karat}
- Weight: ${weight} ${unit === "grams" ? "g" : "pavan(s)"}
- Estimated Payout: LKR ${Math.round(calcResult.finalPayout).toLocaleString()}
I'd like to book an appointment to test and sell my gold today.`
  );
  const whatsappUrl = `https://wa.me/94718321321?text=${waText}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="calculator" className="py-20 px-4 bg-white text-neutral-900 scroll-mt-20 border-t border-neutral-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-amber-700 font-mono text-xs uppercase tracking-widest mb-3 font-semibold">
            <Calculator className="h-4 w-4" />
            <span>CRO Valuation Tool</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-950 mb-4">
            {t.calcTitle}
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t.calcSubtitle}
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {isLoading ? (
            <>
              {/* Inputs Section Skeleton (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-sm min-h-[450px] animate-pulse">
                <div className="space-y-6">
                  <div className="h-5 w-44 bg-neutral-200 rounded mb-4"></div>
                  
                  {/* Karat selection skeleton */}
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-neutral-200 rounded"></div>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-11 bg-neutral-200 rounded"></div>
                      ))}
                    </div>
                  </div>

                  {/* Weight unit selection skeleton */}
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-neutral-200 rounded"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-9 bg-neutral-200 rounded"></div>
                      <div className="h-9 bg-neutral-200 rounded"></div>
                    </div>
                  </div>

                  {/* Slider & inputs skeleton */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-3.5 w-24 bg-neutral-200 rounded"></div>
                      <div className="h-7 w-20 bg-neutral-200 rounded"></div>
                    </div>
                    <div className="h-4 bg-neutral-200 rounded"></div>
                    <div className="h-3.5 w-36 bg-neutral-200 rounded"></div>
                  </div>

                  {/* Deduction field skeleton */}
                  <div className="space-y-2">
                    <div className="h-3.5 w-44 bg-neutral-200 rounded"></div>
                    <div className="h-10 bg-neutral-200 rounded"></div>
                  </div>
                </div>

                <div className="h-12 w-full bg-neutral-150 rounded mt-6"></div>
              </div>

              {/* Outputs Section Skeleton (lg:col-span-7) */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch animate-pulse">
                {/* Visual Value Card Skeleton */}
                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-sm">
                  <div className="space-y-6">
                    <div className="h-4.5 w-32 bg-neutral-200 rounded"></div>
                    
                    <div className="space-y-2 py-4">
                      <div className="h-3 w-20 bg-neutral-200 rounded"></div>
                      <div className="h-10 w-44 bg-neutral-200 rounded"></div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-neutral-200/60">
                      <div className="flex justify-between"><div className="h-3.5 w-20 bg-neutral-200 rounded"></div><div className="h-3.5 w-16 bg-neutral-200 rounded"></div></div>
                      <div className="flex justify-between"><div className="h-3.5 w-24 bg-neutral-200 rounded"></div><div className="h-3.5 w-16 bg-neutral-200 rounded"></div></div>
                      <div className="flex justify-between"><div className="h-3.5 w-24 bg-neutral-200 rounded"></div><div className="h-3.5 w-16 bg-neutral-200 rounded"></div></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-neutral-200/60">
                    <div className="h-9 bg-neutral-200 rounded"></div>
                    <div className="h-9 bg-neutral-200 rounded"></div>
                  </div>
                </div>

                {/* Lead capture skeleton */}
                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-sm">
                  <div className="space-y-4">
                    <div className="h-5 w-40 bg-neutral-200 rounded"></div>
                    <div className="h-3.5 w-48 bg-neutral-200 rounded"></div>
                    <div className="space-y-3 pt-4">
                      <div className="h-10 bg-neutral-200 rounded"></div>
                      <div className="h-10 bg-neutral-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-11 w-full bg-neutral-200 rounded mt-6"></div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Inputs Section (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-sm">
                <div className="space-y-6">
                  <h3 className="text-lg font-serif font-bold text-neutral-950 border-b border-neutral-200 pb-3">
                    1. Specify Gold Specifications
                  </h3>
     
                  {/* Karat Selection */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-mono text-neutral-600 mb-2 font-semibold">
                      {t.goldType}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(Object.values(GoldKarat) as GoldKarat[]).map((k) => (
                        <button
                          key={k}
                          onClick={() => setKarat(k)}
                          className={`py-3 rounded text-sm font-bold tracking-wide border transition-all cursor-pointer ${
                            karat === k
                              ? "bg-amber-600 border-amber-500 text-black font-extrabold shadow-md shadow-amber-500/10"
                              : "bg-white border-neutral-250 text-neutral-700 hover:border-amber-500/30 hover:bg-neutral-50 shadow-sm"
                          }`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>
     
                  {/* Weight Unit Toggles */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-mono text-neutral-600 mb-2 font-semibold">
                      {t.weightUnit}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setUnit("grams");
                          // Reset default weights gracefully
                          if (weight === 1) setWeight(8);
                        }}
                        className={`py-2 rounded text-xs uppercase font-semibold border transition-all cursor-pointer ${
                          unit === "grams"
                            ? "bg-amber-500/10 border-amber-500 text-amber-700 font-bold"
                            : "bg-white border-neutral-250 text-neutral-600 hover:bg-neutral-50 shadow-sm"
                        }`}
                      >
                        {t.grams}
                      </button>
                      <button
                        onClick={() => {
                          setUnit("pavans");
                          if (weight === 8) setWeight(1);
                        }}
                        className={`py-2 rounded text-xs uppercase font-semibold border transition-all cursor-pointer ${
                          unit === "pavans"
                            ? "bg-amber-500/10 border-amber-500 text-amber-700 font-bold"
                            : "bg-white border-neutral-250 text-neutral-600 hover:bg-neutral-50 shadow-sm"
                        }`}
                      >
                        {t.pavans}
                      </button>
                    </div>
                  </div>
     
                  {/* Weight Input Slider & Box */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs uppercase tracking-wider font-mono text-neutral-600 font-semibold">
                        {t.weightInput} ({unit === "grams" ? "g" : "pavan"})
                      </label>
                      <input
                        type="number"
                        value={weight || ""}
                        onChange={(e) => setWeight(Math.max(0, Number(e.target.value)))}
                        className="w-20 bg-white border border-neutral-250 rounded px-2 py-1 text-right text-sm font-mono text-amber-700 focus:outline-none focus:border-amber-500 shadow-sm"
                      />
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max={unit === "grams" ? "100" : "15"}
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full accent-amber-500 h-1 bg-neutral-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-neutral-500 block mt-1">
                      *Standard Sri Lankan Pavan is exactly {settings.pavanWeightGrams}g.
                    </span>
                  </div>
     
                  {/* Adjustments (Deductions e.g. impurities/stones) */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-mono text-neutral-600 mb-2 font-semibold">
                      Stones / Design Deduction (LKR if any)
                    </label>
                    <input
                      type="number"
                      placeholder="0 LKR"
                      value={makingCharges || ""}
                      onChange={(e) => setMakingCharges(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white border border-neutral-250 rounded px-3 py-2 text-sm font-mono text-neutral-800 focus:outline-none focus:border-amber-500 shadow-sm"
                    />
                  </div>
                </div>
     
                <div className="mt-6 pt-4 border-t border-neutral-200 text-xs text-neutral-600 leading-relaxed flex gap-2">
                  <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Testing is done with computerized Spectrometer XRF machines in our office. This preserves 100% of your jewelry's weight compared to melting or scraping.
                  </span>
                </div>
              </div>

              {/* Outputs & Breakdown Section (lg:col-span-7) */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Visual Value Card */}
                <div className="bg-gradient-to-b from-neutral-50 via-neutral-50 to-neutral-100 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <h3 className="text-sm uppercase tracking-widest font-mono text-neutral-600 mb-6 flex items-center gap-1.5 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse"></span>
                      Payout Estimate
                    </h3>
     
                    {/* Main Estimated Value */}
                    <div className="mb-6">
                      <span className="text-xs uppercase tracking-wider font-mono text-neutral-500 block">
                        {t.finalPayout}
                      </span>
                      <div className="text-2xl sm:text-3xl font-serif font-black text-amber-700 mt-1">
                        LKR {Math.round(calcResult.finalPayout).toLocaleString()}
                      </div>
                    </div>
     
                    {/* Financial Breakdown List */}
                    <div className="space-y-3.5 text-xs border-t border-neutral-200 pt-4 font-mono text-neutral-600">
                      <div className="flex justify-between">
                        <span>{t.marketValue}</span>
                        <span className="text-neutral-900 font-bold">LKR {Math.round(calcResult.marketValue).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-amber-700 font-semibold">
                        <span>GBC Payout Premium (+{settings.bonusPremiumRate}%)</span>
                        <span>+LKR {Math.round(calcResult.premiumBonus).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-neutral-500">
                        <span>Computerized Testing Fee</span>
                        <span>-LKR {Math.round(calcResult.testingDeductions).toLocaleString()}</span>
                      </div>
                      {makingCharges > 0 && (
                        <div className="flex justify-between text-rose-700 font-semibold">
                          <span>Stones / Impurities deduction</span>
                          <span>-LKR {makingCharges.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
     
                  {/* Interactive Share / Print Utility */}
                  <div className="grid grid-cols-2 gap-2 mt-6 border-t border-neutral-200 pt-4">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      id="calc_share_wa"
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded border border-neutral-200 hover:border-amber-500/40 text-xs font-mono font-bold text-neutral-700 hover:text-amber-700 bg-white hover:bg-neutral-50 shadow-sm transition-all"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>{t.shareEstimate}</span>
                    </a>
                    <button
                      onClick={handlePrint}
                      id="calc_print_pdf"
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded border border-neutral-200 hover:border-amber-500/40 text-xs font-mono font-bold text-neutral-700 hover:text-amber-700 bg-white hover:bg-neutral-50 shadow-sm transition-all cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>{t.printPDF}</span>
                    </button>
                  </div>
                </div>

                {/* Instant Rate Lock Lead Form */}
                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <h3 className="text-sm uppercase tracking-widest font-mono text-neutral-600 mb-4 flex items-center gap-1.5 font-semibold">
                      <FileText className="h-4 w-4 text-amber-600" />
                      Lock Your Price Out
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                      Colombo gold prices fluctuate by the hour. Submit this form to lock this rate in for the next 24 hours. Our officer will call you.
                    </p>
     
                    {isSuccess ? (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center animate-fade-in my-4">
                        <Check className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                        <p className="text-xs text-amber-800 font-sans leading-relaxed">
                          {t.formSuccess}
                        </p>
                        <button
                          onClick={() => setIsSuccess(false)}
                          className="text-[10px] text-amber-700 underline uppercase tracking-wider mt-3 block mx-auto hover:text-amber-600 font-bold"
                        >
                          Calculate New Value
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleLeadSubmit} className="space-y-3 text-xs">
                        <div>
                          <input
                            type="text"
                            placeholder={t.formName}
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                            required
                            className="w-full bg-white border border-neutral-250 rounded px-3 py-2 font-sans text-neutral-800 focus:outline-none focus:border-amber-500 shadow-sm"
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            placeholder={t.formPhone}
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            required
                            className="w-full bg-white border border-neutral-250 rounded px-3 py-2 font-mono text-neutral-800 focus:outline-none focus:border-amber-500 shadow-sm"
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            placeholder={t.formEmail}
                            value={leadEmail}
                            onChange={(e) => setLeadEmail(e.target.value)}
                            className="w-full bg-white border border-neutral-250 rounded px-3 py-2 font-sans text-neutral-800 focus:outline-none focus:border-amber-500 shadow-sm"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-neutral-200 disabled:text-neutral-450 text-black font-extrabold uppercase tracking-widest text-xs rounded transition-all mt-2 cursor-pointer"
                        >
                          {isSubmitting ? t.calculating : "Submit Payout Request"}
                        </button>
                      </form>
                    )}
                  </div>
     
                  {/* Footer Trust Signals */}
                  <div className="text-[10px] text-neutral-500 text-center border-t border-neutral-200 pt-4 font-mono">
                    No obligations. Free valuations.
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </section>
  );
}
