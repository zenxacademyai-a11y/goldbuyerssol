/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Phone, CheckCircle, ShieldCheck, Award, MessageCircle, Coins, Gem, Scale, Sparkles, Flame, Move, Rotate3d, Compass, Users, Calendar, Building2, ChevronDown } from "lucide-react";
import { Language, translations } from "../lib/translations.js";
import { motion, useAnimation } from "motion/react";
import CSSSparkles from "./CSSSparkles.js";
import GoldIngot from "./GoldIngot.js";

interface AnimatedCounterProps {
  value: number;
  suffix: string;
  label: string;
  icon: React.ComponentType<any>;
}

function AnimatedCounter({ value, suffix, label, icon: Icon }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const end = value;
          const duration = 1500; // 1.5 seconds
          const stepTime = Math.max(Math.floor(duration / end), 25);
          
          const timer = setInterval(() => {
            start += Math.ceil(end / 40); // smooth step
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, stepTime);
          
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [value]);

  return (
    <div ref={elementRef} className="flex items-center gap-4 p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-neutral-200/80 shadow-sm hover:border-amber-500/35 hover:shadow-md transition-all duration-300">
      <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="text-3xl font-serif font-black text-neutral-900 tracking-tight">
          <span>{count}</span>
          <span className="text-amber-600">{suffix}</span>
        </div>
        <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold font-mono mt-0.5 leading-none">
          {label}
        </div>
      </div>
    </div>
  );
}

interface HeroProps {
  currentLang: Language;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1], // premium smooth feel
    }
  }
};

export default function Hero({ currentLang }: HeroProps) {
  const t = translations[currentLang];

  // Mouse tracking state for 3D parallax and reflections
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [shineAngle, setShineAngle] = useState(45);
  const [activeTab, setActiveTab] = useState<"bar" | "stats">("bar");
  const containerRef = useRef<HTMLDivElement>(null);

  // States for 3D gold bar configurator
  const [selectedPurity, setSelectedPurity] = useState<"24K" | "22K" | "18K">("24K");
  const [selectedWeight, setSelectedWeight] = useState<8 | 100 | 500 | 1000>(100);

  // Sri Lankan gold buying rates mapped per gram
  const goldRatesPerGram = {
    "24K": 26875, // Rs. 215,000 per Sovereign (8g)
    "22K": 24625, // Rs. 197,000 per Sovereign (8g)
    "18K": 20125, // Rs. 161,000 per Sovereign (8g)
  };

  const currentRatePerGram = goldRatesPerGram[selectedPurity];
  const liveEstimatedPayout = selectedWeight * currentRatePerGram;

  // Format dynamic gold specifications based on selected purity
  const goldConfigs = {
    "24K": {
      frontGrad: "from-amber-300 via-yellow-400 to-amber-600",
      topGrad: "from-amber-200 via-amber-400 to-amber-550",
      sideGrad: "from-amber-400 to-amber-650",
      bottomBg: "bg-amber-900",
      specifier: "999.9",
      purityText: "FINE GOLD",
      detailLabel: "★ PUREST 24K ★"
    },
    "22K": {
      frontGrad: "from-amber-400 via-amber-500 to-amber-700",
      topGrad: "from-amber-300 via-amber-450 to-amber-600",
      sideGrad: "from-amber-500 to-amber-750",
      bottomBg: "bg-amber-950",
      specifier: "916.0",
      purityText: "STANDARD GOLD",
      detailLabel: "★ 22K SOVEREIGN ★"
    },
    "18K": {
      frontGrad: "from-yellow-200 via-amber-350 to-amber-500",
      topGrad: "from-yellow-100 via-amber-250 to-amber-400",
      sideGrad: "from-amber-300 to-amber-550",
      bottomBg: "bg-amber-800/90",
      specifier: "750.0",
      purityText: "LUXURY GOLD",
      detailLabel: "★ 18K JEWELRY ★"
    }
  }[selectedPurity];

  // Dynamic scale factor for the 3D gold bar based on weights
  const barScaleFactor = {
    8: "scale-[0.72]",
    100: "scale-[0.88]",
    500: "scale-[1.0]",
    1000: "scale-[1.12]"
  }[selectedWeight];

  // Auto-orbit animation angles when mouse is idle or on mobile
  const [autoAngle, setAutoAngle] = useState(0);

  useEffect(() => {
    let animationId: number;
    const updateAutoOrbit = () => {
      setAutoAngle((prev) => (prev + 0.3) % 360);
      animationId = requestAnimationFrame(updateAutoOrbit);
    };
    if (!isHovered) {
      animationId = requestAnimationFrame(updateAutoOrbit);
    }
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate coordinates normalized from -1 to 1
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    setCoords({ x, y });
    setIsHovered(true);

    // Calculate dynamic sheen reflection angle based on mouse position
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    setShineAngle(angle);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly spring back coordinates
    const step = () => {
      setCoords((prev) => {
        const nextX = prev.x * 0.85;
        const nextY = prev.y * 0.85;
        if (Math.abs(nextX) < 0.01 && Math.abs(nextY) < 0.01) {
          return { x: 0, y: 0 };
        }
        requestAnimationFrame(step);
        return { x: nextX, y: nextY };
      });
    };
    requestAnimationFrame(step);
  };

  // Trigger full 360 spin animation
  const trigger3DSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
  };

  // 3D rotation formulas based on cursor location or auto-rotation
  const rotateY = isHovered ? coords.x * 25 : Math.sin((autoAngle * Math.PI) / 180) * 12;
  const rotateX = isHovered ? -coords.y * 20 : Math.cos((autoAngle * Math.PI) / 180) * 8;

  // Parallax offsets for background elements
  const paraX1 = coords.x * -15;
  const paraY1 = coords.y * -15;
  const paraX2 = coords.x * 20;
  const paraY2 = coords.y * 20;
  const paraX3 = coords.x * -28;
  const paraY3 = coords.y * -28;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 lg:py-24 px-4 bg-white">
      {/* Luxury Background Visual elements - Continuous animated gradient background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "linear-gradient(120deg, #fafaf9 0%, #fffbeb 35%, #fffbeb 65%, #f5f5f4 100%)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Subtle gold sparkles CSS system */}
      <CSSSparkles />

      {/* Slowly pulsing premium glowing gold radial gradient behind the content */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] aspect-square rounded-full z-0 pointer-events-none opacity-40 mix-blend-multiply sm:mix-blend-normal"
        style={{
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.03) 45%, transparent 70%)",
        }}
        animate={{
          scale: [0.95, 1.12, 0.95],
          opacity: [0.4, 0.65, 0.4]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Golden accent blur orbs with continuous floating animation */}
      <motion.div
        className="absolute top-1/10 -left-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[110px] z-0 pointer-events-none"
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.08, 0.92, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/10 -right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[110px] z-0 pointer-events-none"
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 30, -30, 0],
          scale: [1, 0.92, 1.08, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 z-0 pointer-events-none"></div>

      {/* Main Grid Content Layout Wrapper */}
      <div className="relative max-w-7xl mx-auto w-full z-10 flex flex-col gap-12 lg:gap-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
        
        {/* Left Column: Headline, Copy, Action Buttons & Badges with Framer Motion Staggered Entrance */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 text-left space-y-6 sm:space-y-8 flex flex-col justify-center"
        >
          
          {/* Luxury Sub-header with elegant rotating shine sparkle */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 self-start px-4.5 py-2 rounded-full border border-amber-500/25 bg-white/90 backdrop-blur-md text-amber-800 text-[11px] tracking-widest uppercase font-mono font-semibold shadow-sm hover:border-amber-500/40 transition-colors"
          >
            <Award className="h-4 w-4 text-amber-600 animate-pulse" />
            <span className="flex items-center gap-1">
              Colombo's Most Trusted Gold Exchange
              <Sparkles className="h-3 w-3 text-amber-500 animate-bounce shrink-0" />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-neutral-900 leading-[1.1]"
          >
            <span className="block">{t.heroTitle}</span>
            <span className="block mt-2.5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 bg-clip-text text-transparent">
              With 100% Honest Valuation
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed"
          >
            {t.heroSubtitle} We provide instant payouts for gold jewellery, gold bars, and coins inside our secure, private appraisal lounge.
          </motion.p>

          {/* Main Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-xl"
          >
            <a
              href="#calculator"
              className="px-8 py-4.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-xl shadow-amber-500/20 transform hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2"
            >
              <Scale className="h-4 w-4 text-black shrink-0" />
              <span>{t.getEstimate}</span>
            </a>
            <a
              href="tel:0718321321"
              id="hero_cta_call"
              className="px-8 py-4.5 bg-white hover:bg-neutral-50 text-neutral-900 font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-200 hover:border-amber-500/40 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
            >
              <Phone className="h-4 w-4 text-amber-600 animate-bounce" />
              <span>0718 321 321</span>
            </a>
            <a
              href="https://wa.me/94718321321?text=Hi%20GBC%20Colombo%2C%20I'd%20like%20to%20sell%20my%20gold%20jewelry.%20Could%20I%20get%20today's%20live%20buying%20rates?"
              target="_blank"
              rel="noreferrer"
              id="hero_cta_wa"
              className="px-8 py-4.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <MessageCircle className="h-4 w-4 text-white shrink-0" />
              <span>{t.whatsappUs}</span>
            </a>
          </motion.div>

          {/* Quick trust assurances */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-xs font-mono text-neutral-500"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              Licensed Buyer
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              German XRF Computer Testing
            </span>
            <span className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-600 shrink-0 animate-pulse" />
              Highest Colombo Payouts
            </span>
          </motion.div>

          {/* Core Trust Statistics Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-2xl"
          >
            <div className="flex flex-col p-4.5 rounded-2xl border border-neutral-200 bg-white/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-amber-500/30 hover:bg-white/80 group">
              <span className="text-2xl font-serif font-black text-amber-600 group-hover:scale-105 transition-transform origin-left">50+</span>
              <span className="text-[11px] text-neutral-600 mt-1 font-sans font-medium">{t.yearsExperience}</span>
            </div>
            <div className="flex flex-col p-4.5 rounded-2xl border border-neutral-200 bg-white/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-amber-500/30 hover:bg-white/80 group">
              <span className="text-2xl font-serif font-black text-amber-600 group-hover:scale-105 transition-transform origin-left">3,500+</span>
              <span className="text-[11px] text-neutral-600 mt-1 font-sans font-medium">{t.happyCustomers}</span>
            </div>
            <div className="flex flex-col p-4.5 rounded-2xl border border-neutral-200 bg-white/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-amber-500/30 hover:bg-white/80 group">
              <span className="text-2xl font-serif font-black text-amber-600 group-hover:scale-105 transition-transform origin-left">4.9 ★</span>
              <span className="text-[11px] text-neutral-600 mt-1 font-sans font-medium">{t.ratingTitle}</span>
            </div>
            <div className="flex flex-col p-4.5 rounded-2xl border border-neutral-200 bg-white/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-amber-500/30 hover:bg-white/80 group items-start justify-center">
              <CheckCircle className="h-5 w-5 text-amber-600 mb-1" />
              <span className="text-[11px] text-neutral-600 font-sans font-medium leading-tight">{t.transparentLabel}</span>
            </div>
          </motion.div>

        </motion.div>

        {/* Right Column: Interactive 3D Gold Bullion Configurator & Parallax Space */}
        <div className="lg:col-span-5 relative w-full flex flex-col items-center justify-center py-6">
          
          {/* Glass Card Containing the 3D Element and interactive controls */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-[420px] bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-[32px] p-5.5 flex flex-col gap-5 overflow-hidden shadow-2xl shadow-neutral-900/5 cursor-grab active:cursor-grabbing group select-none min-h-[580px]"
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d"
            }}
          >
            {/* Background luxury reflection glow inside card */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100"
              style={{
                backgroundImage: isHovered 
                  ? `radial-gradient(circle 240px at ${((coords.x + 1) / 2) * 100}% ${((coords.y + 1) / 2) * 100}%, rgba(245, 158, 11, 0.18), transparent 80%)`
                  : `radial-gradient(circle 180px at 50% 50%, rgba(245, 158, 11, 0.08), transparent 75%)`
              }}
            />

            {/* Depth Level 1: Distant Ambient 3D floating coins inside the card boundary (Parallax Back) */}
            <div 
              className="absolute inset-0 pointer-events-none transition-transform duration-200 ease-out"
              style={{
                transform: `translate3d(${paraX1}px, ${paraY1}px, -40px) rotate(${rotateY * 0.15}deg)`,
                transformStyle: "preserve-3d"
              }}
            >
              {/* Floating coin back left */}
              <div className="absolute top-1/6 left-1/10 w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-700 opacity-30 shadow-lg flex items-center justify-center text-[10px] font-bold text-amber-950/40 border border-amber-300/30 blur-[1px]">
                <Coins className="h-5 w-5" />
              </div>
              
              {/* Floating gold spark back right */}
              <div className="absolute top-1/4 right-1/8 text-amber-500/25 animate-pulse blur-[1.5px]">
                <Sparkles className="h-8 w-8" />
              </div>

              {/* Security Shield Badge */}
              <div className="absolute bottom-1/5 left-1/8 text-amber-600/15 animate-bounce blur-[0.5px]">
                <ShieldCheck className="h-10 w-10" />
              </div>
            </div>

            {/* Title Overlay with High 3D Contrast */}
            <div 
              className="relative z-10 flex justify-between items-start transition-transform duration-300"
              style={{ transform: "translateZ(30px)" }}
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold block mb-1">
                  Active 3D Interactive
                </span>
                <h3 className="font-serif font-black text-lg text-neutral-900 flex items-center gap-1.5">
                  <span>Pure {selectedPurity} Ingot</span>
                  <Flame className="h-4 w-4 text-amber-600 inline shrink-0 animate-pulse" />
                </h3>
              </div>
              
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[9px] font-mono font-bold uppercase tracking-wider shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-ping"></span>
                <span>Tilt & Customize</span>
              </div>
            </div>

            {/* Interactive Selector Controls inside the Card */}
            <div 
              className="relative z-20 flex flex-col gap-3 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-md"
              style={{ transform: "translateZ(40px)" }}
            >
              {/* Purity selector */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                    Select Gold Purity
                  </span>
                  <span className="text-[9px] font-mono font-black text-amber-700">
                    {selectedPurity === "24K" ? "99.9% Pure" : selectedPurity === "22K" ? "91.6% Standard" : "75.0% Jewelry"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["24K", "22K", "18K"] as const).map((pur) => (
                    <button
                      key={pur}
                      onClick={() => setSelectedPurity(pur)}
                      className={`py-2 px-2 rounded-xl text-[10px] font-black font-mono transition-all duration-200 cursor-pointer border ${
                        selectedPurity === pur
                          ? "bg-amber-500 border-amber-500 text-neutral-950 shadow-md font-extrabold"
                          : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
                      }`}
                    >
                      {pur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight selector */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                    Select Ingot Weight
                  </span>
                  <span className="text-[9px] font-mono font-black text-amber-700">
                    {selectedWeight === 8 ? "1 Sovereign" : selectedWeight === 1000 ? "1 Kilogram" : `${selectedWeight} Grams`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {([8, 100, 500, 1000] as const).map((wt) => (
                    <button
                      key={wt}
                      onClick={() => setSelectedWeight(wt)}
                      className={`py-2 px-1 rounded-xl text-[10px] font-black font-mono transition-all duration-200 cursor-pointer border ${
                        selectedWeight === wt
                          ? "bg-neutral-900 border-neutral-900 text-white shadow-md"
                          : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {wt === 8 ? "8g" : wt === 1000 ? "1kg" : `${wt}g`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Depth Level 2: Central Interactive 3D Gold Bar with WebGL */}
            <div 
              className="relative flex-1 flex flex-col justify-center min-h-[220px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <GoldIngot purity={selectedPurity} weight={selectedWeight} />
            </div>

            {/* Dynamic Value Readout Panel */}
            <div 
              className="relative z-10 flex flex-col p-3 bg-neutral-900 text-white rounded-2xl border border-neutral-800 shadow-inner"
              style={{ transform: "translateZ(35px)" }}
            >
              <div className="flex justify-between items-center text-[8px] font-mono tracking-widest text-neutral-400 uppercase font-bold">
                <span>Estimated Buying Payout</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  LIVE VALUATION
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-xl sm:text-2xl font-mono font-black text-amber-400 tracking-tight">
                  {new Intl.NumberFormat("en-LK", {
                    style: "currency",
                    currency: "LKR",
                    maximumFractionDigits: 0
                  }).format(liveEstimatedPayout)}
                </span>
                <span className="text-[10px] text-neutral-400 font-sans font-medium">
                  {selectedWeight === 8 ? "per Sovereign" : `for ${selectedWeight}g`}
                </span>
              </div>
            </div>

            {/* Depth Level 4: Bottom Interactive controller details */}
            <div 
              className="relative z-10 flex flex-col gap-2.5 pt-3 border-t border-neutral-200/50"
              style={{ transform: "translateZ(45px)" }}
            >
              {/* Live pricing micro-widget */}
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                <span className="flex items-center gap-1">
                  <Compass className="h-3 w-3 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Real-time Interactive 3D</span>
                </span>
                <span className="text-emerald-700 font-bold uppercase tracking-wider text-[9px]">
                  Highest Rates Locked
                </span>
              </div>

              {/* Action cues */}
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                <button 
                  onClick={trigger3DSpin}
                  className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 border border-neutral-800 hover:border-amber-500/20 shadow transition-all duration-300 cursor-pointer"
                >
                  <Rotate3d className="h-3.5 w-3.5 text-amber-500" />
                  <span>CLICK TO SPIN</span>
                </button>
                <div className="py-2.5 bg-white/85 text-neutral-700 border border-neutral-200 font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
                  <Move className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                  <span>DRAG TO ROTATE</span>
                </div>
              </div>
            </div>

          </div>

          {/* Luxury background platform/pedestal shadow for the whole card */}
          <div className="absolute -bottom-2 w-3/4 h-8 bg-amber-500/10 blur-[25px] rounded-full z-0 pointer-events-none" />

        </div>

      </div>

      {/* Trust Metrics row */}
      <div className="w-full mt-4 pt-10 border-t border-neutral-200/50 z-10">
        <div className="text-center mb-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-bold">
            Our Legacy of Confidence
          </span>
          <h2 className="text-lg sm:text-xl font-serif font-black text-neutral-900 mt-1">
            Guaranteed Security & Trust Metrics
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto w-full">
          <AnimatedCounter
            value={10}
            suffix="k+"
            label={
              currentLang === "si"
                ? "සතුටුදායක ගනුදෙනුකරුවන්"
                : currentLang === "ta"
                ? "மகிழ்ச்சியான வாடிக்கையாளர்கள்"
                : "Happy Customers"
            }
            icon={Users}
          />
          <AnimatedCounter
            value={48}
            suffix=" Years"
            label={
              currentLang === "si"
                ? "විශ්වාසනීය පළපුරුද්ද"
                : currentLang === "ta"
                ? "ஆண்டுகள் அனுபவம்"
                : "Experience"
            }
            icon={Calendar}
          />
          <AnimatedCounter
            value={16}
            suffix=" Branches"
            label={
              currentLang === "si"
                ? "කොළඹ ශාඛා"
                : currentLang === "ta"
                ? "கொழும்பு கிளைகள்"
                : "Colombo Branches"
            }
            icon={Building2}
          />
        </div>
      </div>

    </div>

    {/* Scroll Down Indicator */}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1">
      <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">Scroll Down</span>
      <motion.a
        href="#calculator"
        animate={{ y: [0, 6, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-neutral-400 hover:text-amber-600 transition-colors duration-200"
      >
        <ChevronDown className="h-4 w-4" />
      </motion.a>
    </div>

  </section>
  );
}
