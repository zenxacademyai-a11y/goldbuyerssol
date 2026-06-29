/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Phone, CheckCircle, ShieldCheck, Award, MessageCircle, Coins, Gem, Scale, Sparkles, Flame } from "lucide-react";
import { Language, translations } from "../lib/translations.js";
import { motion } from "motion/react";

interface HeroProps {
  currentLang: Language;
}

export default function Hero({ currentLang }: HeroProps) {
  const t = translations[currentLang];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 px-4">
      {/* Luxury Background Visual elements - Continuous animated gradient background using Framer Motion */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(120deg, #fafaf9 0%, #fef3c7 35%, #fffbeb 65%, #f5f5f4 100%)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Golden accent blur orbs with continuous floating Framer Motion animation */}
      <motion.div
        className="absolute top-1/10 -left-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[110px] z-0"
        animate={{
          x: [0, 45, -35, 0],
          y: [0, -35, 45, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/10 -right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[110px] z-0"
        animate={{
          x: [0, -45, 35, 0],
          y: [0, 35, -45, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-80 h-80 bg-amber-500/8 rounded-full blur-[90px] z-0"
        animate={{
          x: [0, 25, -25, 0],
          y: [0, -25, 25, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
 
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 z-0"></div>
 
      {/* Floating Gold-Related Icons with Mild Looping Animations & Depth-Of-Field Blur */}
      
      {/* Layer 1: Blurred/Ambient Floating Gold Elements (Far Field) */}
      <motion.div
        className="absolute top-1/4 left-1/6 text-amber-600/10 hidden md:block z-0 pointer-events-none blur-[4px]"
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
          rotate: [0, 15, -15, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Coins className="h-24 w-24 stroke-[1] filter drop-shadow-[0_15px_30px_rgba(245,158,11,0.2)]" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/12 text-amber-500/10 hidden md:block z-0 pointer-events-none blur-[3px]"
        animate={{
          y: [0, 25, 0],
          x: [0, -20, 0],
          rotate: [0, -20, 20, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Gem className="h-20 w-20 stroke-[1] filter drop-shadow-[0_15px_25px_rgba(245,158,11,0.15)]" />
      </motion.div>

      <motion.div
        className="absolute top-1/10 right-1/4 text-amber-500/8 hidden lg:block z-0 pointer-events-none blur-[5px]"
        animate={{
          scale: [1, 1.2, 0.8, 1],
          y: [0, 15, -15, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Scale className="h-28 w-28 stroke-[0.8] filter drop-shadow-[0_20px_40px_rgba(245,158,11,0.1)]" />
      </motion.div>

      {/* Layer 2: Sharp / In-Focus Floating Gold Elements (Mid Field) */}
      <motion.div
        className="absolute top-1/3 right-1/12 text-amber-500/25 hidden md:block z-0 pointer-events-none"
        animate={{
          y: [0, -18, 0],
          rotate: [0, 8, -8, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Coins className="h-16 w-16 stroke-[1.25] drop-shadow-[0_8px_20px_rgba(245,158,11,0.25)]" />
      </motion.div>

      <motion.div
        className="absolute top-1/3 left-1/12 text-amber-500/20 hidden md:block z-0 pointer-events-none"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -10, 10, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <Gem className="h-14 w-14 stroke-[1.25] drop-shadow-[0_8px_18px_rgba(245,158,11,0.2)]" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-1/10 text-amber-500/20 hidden md:block z-0 pointer-events-none"
        animate={{
          y: [0, -14, 0],
          rotate: [-6, 6, -6],
          scale: [1, 1.03, 0.97, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Scale className="h-16 w-16 stroke-[1.25] drop-shadow-[0_8px_18px_rgba(245,158,11,0.18)]" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-1/10 text-amber-500/30 hidden md:block z-0 pointer-events-none"
        animate={{
          scale: [1, 1.3, 0.7, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Sparkles className="h-12 w-12 stroke-[1.25] drop-shadow-[0_6px_15px_rgba(245,158,11,0.3)]" />
      </motion.div>

      <motion.div
        className="absolute top-16 right-1/3 text-amber-500/15 hidden lg:block z-0 pointer-events-none"
        animate={{
          y: [0, -22, 0],
          rotate: [0, 12, -12, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      >
        <Flame className="h-10 w-10 stroke-[1.25] drop-shadow-[0_6px_14px_rgba(245,158,11,0.2)]" />
      </motion.div>
 
      {/* Content Container with custom requested Glass-morphism effect */}
      <div className="relative max-w-5xl mx-auto text-center z-10 bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-8 sm:p-12 md:p-16 shadow-[0_30px_70px_-10px_rgba(245,158,11,0.1)]">
        {/* Luxury Sub-header */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/25 bg-white/80 backdrop-blur-md text-amber-700 text-xs tracking-widest uppercase mb-8 font-mono font-semibold shadow-sm">
          <Award className="h-4 w-4 text-amber-600 animate-pulse" />
          <span>Colombo's Most Trusted Gold Exchange</span>
        </div>
 
        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-neutral-950 mb-6">
          <span className="block">{t.heroTitle}</span>
          <span className="block mt-2 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 bg-clip-text text-transparent">
            With Complete Transparency
          </span>
        </h2>
 
        {/* Subtitle */}
        <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          {t.heroSubtitle}
        </p>
 
        {/* Main CTA Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#calculator"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-400 hover:to-amber-500 text-black font-extrabold text-sm uppercase tracking-wider rounded-md transition-all duration-300 shadow-xl shadow-amber-500/20 transform hover:-translate-y-0.5"
          >
            {t.getEstimate}
          </a>
          <a
            href="tel:0718321321"
            id="hero_cta_call"
            className="w-full sm:w-auto px-8 py-4 bg-white/80 hover:bg-neutral-100 text-neutral-900 font-bold text-sm uppercase tracking-wider rounded-md border border-neutral-200 hover:border-amber-500/40 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
          >
            <Phone className="h-4 w-4 text-amber-600" />
            <span>0718 321 321</span>
          </a>
          <a
            href="https://wa.me/94718321321?text=Hi%20GBC%20Colombo%2C%20I'd%20like%20to%20sell%20my%20gold%20jewelry.%20Could%20I%20get%20today's%20live%20buying%20rates?"
            target="_blank"
            rel="noreferrer"
            id="hero_cta_wa"
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider rounded-md transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
          >
            {/* WhatsApp Text */}
            <span>{t.whatsappUs}</span>
          </a>
        </div>
 
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-neutral-200/60 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-md hover:border-amber-500/30 shadow-sm transition-all duration-300 hover:bg-white/70">
            <span className="text-xl sm:text-2xl font-serif font-black text-amber-600">50+</span>
            <span className="text-xs text-neutral-600 mt-1 font-sans text-center font-medium">{t.yearsExperience}</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-md hover:border-amber-500/30 shadow-sm transition-all duration-300 hover:bg-white/70">
            <span className="text-xl sm:text-2xl font-serif font-black text-amber-600">3,500+</span>
            <span className="text-xs text-neutral-600 mt-1 font-sans text-center font-medium">{t.happyCustomers}</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-md hover:border-amber-500/30 shadow-sm transition-all duration-300 hover:bg-white/70">
            <span className="text-xl sm:text-2xl font-serif font-black text-amber-600">4.9 ★</span>
            <span className="text-xs text-neutral-600 mt-1 font-sans text-center font-medium">{t.ratingTitle}</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-md hover:border-amber-500/30 shadow-sm transition-all duration-300 hover:bg-white/70">
            <CheckCircle className="h-5 w-5 text-amber-600 mb-0.5" />
            <span className="text-xs text-neutral-600 mt-1.5 font-sans text-center font-medium">{t.transparentLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
