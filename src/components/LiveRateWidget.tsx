/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, RefreshCw, Landmark, ShieldCheck, Sparkles } from "lucide-react";
import { Language, translations } from "../lib/translations.js";
import { GoldRate, HistoricalRate, SystemSettings } from "../types.js";

interface LiveRateWidgetProps {
  currentLang: Language;
  rates: GoldRate[];
  settings: SystemSettings;
  historicalRates: HistoricalRate[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function LiveRateWidget({
  currentLang,
  rates,
  settings,
  historicalRates,
  onRefresh,
  isLoading = false,
}: LiveRateWidgetProps) {
  const t = translations[currentLang];
  const [chartRange, setChartRange] = useState<"Monthly" | "Weekly">("Monthly");

  // Format date nicely
  const formattedDate = new Date(settings.lastUpdated).toLocaleString(
    currentLang === "en" ? "en-US" : currentLang === "si" ? "si-LK" : "ta-LK",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  // Filter historical rate data based on selected range
  const chartData = chartRange === "Weekly" ? historicalRates.slice(-7) : historicalRates;

  return (
    <section id="rates" className="py-20 px-4 bg-white border-t border-neutral-100 text-neutral-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1 text-amber-700 font-mono text-xs uppercase tracking-widest mb-3 font-semibold">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Live Price Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-950 mb-4">
            {t.liveRatesTitle}
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t.liveRatesSubtitle}
          </p>
        </div>
 
        {/* Live Rates Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Main Table/Cards (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-sm min-h-[400px]">
            
            {isLoading ? (
              <div className="space-y-6 animate-pulse">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-20 bg-neutral-200 rounded"></div>
                    <div className="h-3.5 w-32 bg-neutral-200 rounded"></div>
                  </div>
                  <div className="h-8 w-8 bg-neutral-200 rounded-full"></div>
                </div>

                {/* Skeletons for rates row block */}
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-neutral-200/60 last:border-0">
                      <div className="space-y-2">
                        <div className="h-5 w-36 bg-neutral-200 rounded"></div>
                        <div className="h-3 w-20 bg-neutral-200 rounded"></div>
                      </div>
                      <div className="flex gap-4 sm:gap-12 text-right">
                        <div className="h-5 w-20 sm:w-24 bg-neutral-200 rounded"></div>
                        <div className="h-5 w-24 sm:w-28 bg-neutral-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Table Header Controls */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono tracking-widest text-neutral-500">
                      {t.lastUpdated}:
                    </span>
                    <span className="text-xs text-amber-700 font-mono font-bold">{formattedDate}</span>
                  </div>
                  {onRefresh && (
                    <button
                      onClick={onRefresh}
                      className="p-2 rounded-full border border-neutral-200 hover:border-amber-500/30 text-neutral-600 hover:text-amber-600 transition-all flex items-center justify-center bg-white shadow-sm active:rotate-180 duration-500 cursor-pointer"
                      title="Refresh Live Rates"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-neutral-200 text-xs font-mono uppercase tracking-wider text-neutral-500">
                        <th className="pb-4 font-normal">{t.karat}</th>
                        <th className="pb-4 font-normal">{t.purity}</th>
                        <th className="pb-4 font-normal text-right">{t.perGram}</th>
                        <th className="pb-4 font-normal text-right">{t.perPavan}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {rates.map((r) => {
                        const ratePerGram = r.ratePerGram;
                        const ratePerPavan = r.ratePerGram * settings.pavanWeightGrams;
                        return (
                          <tr key={r.karat} className="hover:bg-neutral-100 transition-colors group">
                            <td className="py-4 font-serif font-bold text-lg text-neutral-900 group-hover:text-amber-700 transition-colors">
                              {r.karat} Pure Gold
                            </td>
                            <td className="py-4 text-xs font-mono text-neutral-500">
                              {(r.purity * 100).toFixed(1)}% {r.karat === "22K" ? "(916 Hallmarked)" : ""}
                            </td>
                            <td className="py-4 text-right text-base font-bold font-mono text-neutral-900">
                              LKR {Math.round(ratePerGram).toLocaleString()}
                            </td>
                            <td className="py-4 text-right text-base font-bold font-mono text-amber-700">
                              LKR {Math.round(ratePerPavan).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View (Horizontal Swipe/Scroll or Stacked Cards) */}
                <div className="block sm:hidden space-y-4">
                  {rates.map((r) => {
                    const ratePerGram = r.ratePerGram;
                    const ratePerPavan = r.ratePerGram * settings.pavanWeightGrams;
                    return (
                      <div
                        key={r.karat}
                        className="p-4 rounded-lg bg-white border border-neutral-200 hover:border-amber-500/30 transition-all hover:shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-base font-serif font-extrabold text-amber-700">
                            {r.karat} Gold
                          </span>
                          <span className="text-[10px] font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                            {(r.purity * 100).toFixed(1)}% Pure
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-150 text-sm">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-neutral-500 block">
                              Per Gram
                            </span>
                            <strong className="text-neutral-900 font-mono">
                              LKR {Math.round(ratePerGram).toLocaleString()}
                            </strong>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-mono text-neutral-500 block">
                              Per Pavan (8g)
                            </span>
                            <strong className="text-amber-700 font-mono">
                              LKR {Math.round(ratePerPavan).toLocaleString()}
                            </strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-neutral-500 italic mt-6 font-mono">
                  {t.ratesDisclaimer}
                </p>
              </>
            )}
          </div>
 
          {/* Historical Trends Chart (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-sm min-h-[400px]">
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-4 w-48 bg-neutral-200 rounded"></div>
                  <div className="h-7 w-20 bg-neutral-200 rounded"></div>
                </div>
                {/* Simulated Chart Wave */}
                <div className="h-64 w-full bg-neutral-100 rounded-lg flex items-end p-4 gap-2 justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-200/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                  <div className="w-[8%] h-[20%] bg-neutral-200/80 rounded-t"></div>
                  <div className="w-[8%] h-[35%] bg-neutral-200/80 rounded-t"></div>
                  <div className="w-[8%] h-[25%] bg-neutral-200/80 rounded-t"></div>
                  <div className="w-[8%] h-[45%] bg-neutral-200/80 rounded-t"></div>
                  <div className="w-[8%] h-[55%] bg-neutral-200/80 rounded-t"></div>
                  <div className="w-[8%] h-[50%] bg-neutral-200/80 rounded-t"></div>
                  <div className="w-[8%] h-[70%] bg-neutral-200/80 rounded-t"></div>
                  <div className="w-[8%] h-[60%] bg-neutral-200/80 rounded-t"></div>
                  <div className="w-[8%] h-[80%] bg-neutral-200/80 rounded-t"></div>
                  <div className="w-[8%] h-[75%] bg-neutral-200/80 rounded-t"></div>
                  <div className="w-[8%] h-[90%] bg-neutral-200/80 rounded-t"></div>
                </div>
                {/* Simulated bonus banner card */}
                <div className="h-16 w-full bg-neutral-100 border border-neutral-200/40 rounded-lg"></div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-neutral-600 flex items-center gap-1.5 font-semibold">
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                    Historical LKR Gold Trends
                  </h3>
                  <div className="inline-flex rounded-md bg-white p-1 border border-neutral-200 text-xs shadow-sm">
                    <button
                      onClick={() => setChartRange("Monthly")}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        chartRange === "Monthly"
                          ? "bg-amber-600 text-black font-extrabold"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      12M
                    </button>
                    <button
                      onClick={() => setChartRange("Weekly")}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        chartRange === "Weekly"
                          ? "bg-amber-600 text-black font-extrabold"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      7M
                    </button>
                  </div>
                </div>

                {/* Interactive Chart using Recharts with strict width/height and wrappers */}
                <div className="h-64 w-full" style={{ width: "100%", height: "256px", minWidth: "100%", minHeight: "256px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="color22K" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} />
                      <YAxis
                        stroke="#9ca3af"
                        fontSize={10}
                        domain={["auto", "auto"]}
                        tickLine={false}
                        tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        labelStyle={{ color: "#b45309", fontFamily: "monospace", fontSize: "11px" }}
                        itemStyle={{ color: "#111827", fontSize: "12px" }}
                        formatter={(value: any) => [`LKR ${Number(value).toLocaleString()}`, "22K Per Gram"]}
                      />
                      <Area isAnimationActive={false}
                        type="monotone"
                        dataKey="22K"
                        stroke="#d97706"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#color22K)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
     
                {/* GBC Buying Bonus Card */}
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-amber-600/5 via-yellow-500/5 to-transparent border border-amber-500/20 flex items-center gap-3">
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-700 flex-shrink-0">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-black text-amber-700 uppercase tracking-wider">
                      Outright Liquidation Premium
                    </h4>
                    <p className="text-[11px] text-neutral-600 leading-normal mt-0.5">
                      Get paid up to <strong>+{settings.bonusPremiumRate}% extra</strong> bonus value for selling outright compared to commercial pawn rate limits.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
