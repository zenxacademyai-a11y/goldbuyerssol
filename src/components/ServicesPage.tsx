import React, { useState } from "react";
import { 
  Coins, 
  Gem, 
  Watch, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Calculator, 
  TrendingUp, 
  HelpCircle,
  Sparkles,
  Award,
  Lock,
  X,
  ZoomIn
} from "lucide-react";
import { Language } from "../lib/translations.js";
import ResponsiveImage from "./ResponsiveImage.js";

interface ServicesPageProps {
  currentLang: Language;
  selectedServiceId?: string | null;
  onSelectService?: (serviceId: string | null) => void;
  setView?: (view: any) => void;
  onSelectBranch?: (branchId: string) => void;
}

export interface ServiceDetail {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  image: string;
  desc: string;
  acceptedItems: string[];
  processSteps: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export const servicesData: ServiceDetail[] = [
  {
    id: "gold-buying",
    title: "Gold Buying & Scrap Gold Service",
    subtitle: "Highest Cash Prices in Sri Lanka for Gold Jewelry, Coins & Scrap",
    badge: "Most Popular",
    icon: <Coins className="h-6 w-6 text-amber-500" />,
    image: "/img-1.jpeg",
    desc: "Looking for a trusted gold buying service in Sri Lanka? We offer competitive market-leading prices for all types of gold, including gold jewelry, chains, bangles, rings, gold coins, gold bars, broken items, and scrap gold. Our experienced metallurgical team provides free evaluations, 100% damage-free XRF computerized testing, transparent weight verification, and instant cash payments on the spot.",
    acceptedItems: [
      "24K, 22K, 21K, 18K, 14K Gold Jewelry",
      "Gold Chains, Bangles, Necklaces & Rings",
      "Gold Coins, Sovereigns & Investment Bars",
      "Broken, Damaged & Scrap Gold Items",
      "Pawned Gold Receipt Settlement"
    ],
    processSteps: [
      { title: "1. Visit Our Lounge", desc: "Bring your gold items to any of our 16 Colombo branches. No appointment necessary." },
      { title: "2. Computerized XRF Test", desc: "Our X-Ray Spectrometer measures exact karat purity non-destructively without acid scratches." },
      { title: "3. Certified Live Weight", desc: "Weighed on government-calibrated digital scales visible to you down to 0.001g." },
      { title: "4. Instant Cash Payment", desc: "Receive immediate cash in hand or instant bank transfer directly to your account." }
    ],
    faqs: [
      { q: "What karats of gold do you purchase?", a: "We purchase all karats including 9K, 14K, 18K, 21K, 22K, and 24K fine gold." },
      { q: "Will my gold jewelry be damaged during testing?", a: "No! We use advanced non-destructive XRF laser spectrometers that analyze elemental composition without scratch or acid damage." },
      { q: "How is the payout rate determined?", a: "Payouts are linked directly to daily Colombo spot gold rates plus our GBC bonus premium of up to +2.5%." }
    ]
  },
  {
    id: "diamond-gem-buying",
    title: "Diamond & Precious Gemstone Buying",
    subtitle: "Certified Evaluation for Loose Diamonds, Rubies & Ceylon Sapphires",
    badge: "Certified Gemologists",
    icon: <Gem className="h-6 w-6 text-amber-500" />,
    image: "/img-4.jpeg",
    desc: "Looking to sell natural diamonds or precious gemstones in Sri Lanka? We buy natural diamonds, GIA/IGI certified stones, loose diamonds, Ceylon blue sapphires, rubies, emeralds, and fine gemstone jewelry at competitive international market prices. We ensure a secure, confidential, and hassle-free valuation experience with instant payouts.",
    acceptedItems: [
      "Loose & Certified Diamonds (GIA, IGI, HRD)",
      "Diamond Engagement Rings & Pendants",
      "Ceylon Blue Sapphires & Yellow Sapphires",
      "Natural Rubies & Emeralds",
      "Heirloom Fine Gemstone Jewelry"
    ],
    processSteps: [
      { title: "1. Gemologist Inspection", desc: "Our certified in-house gemologists examine carat, clarity, color & cut under magnification." },
      { title: "2. Certificate Verification", desc: "We verify GIA, IGI, GRS, or local lab certificates if available." },
      { title: "3. International Valuation", desc: "Priced accurately using Rapaport diamond index and gemstone market rarity." },
      { title: "4. Immediate Cash Settlement", desc: "Get paid instantly in cash or wire transfer with a full purchase invoice." }
    ],
    faqs: [
      { q: "Do I need a lab certificate to sell my diamond?", a: "No certificate is required. Our certified gemologists perform in-house optical testing for uncertified diamonds as well." },
      { q: "Do you buy Ceylon Blue Sapphires?", a: "Yes! Sri Lanka is world-famous for sapphires and we offer top international market rates for high quality Ceylon sapphires." }
    ]
  },
  {
    id: "luxury-watches",
    title: "Luxury Watch Buyers (Rolex, Omega, Patek)",
    subtitle: "Instant Cash Payouts for Authentic Pre-Owned & New Timepieces",
    badge: "Watch Experts",
    icon: <Watch className="h-6 w-6 text-amber-500" />,
    image: "/img-6.jpeg",
    desc: "Looking to sell your luxury timepiece? We are trusted luxury watch buyers in Colombo, Sri Lanka, offering top competitive prices for authentic luxury timepieces. We buy pre-owned and new luxury watches including Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, Breitling, and Tag Heuer with professional movement authentication, fair market valuation, and instant payout.",
    acceptedItems: [
      "Rolex (Submariner, Daytona, Datejust, GMT-Master II)",
      "Patek Philippe & Audemars Piguet",
      "Omega (Speedmaster, Seamaster)",
      "Cartier, Breitling, IWC & Tag Heuer",
      "Gold & Diamond Luxury Timepieces"
    ],
    processSteps: [
      { title: "1. Watch Authentication", desc: "Expert inspection of movement, serial number, dial, and physical condition." },
      { title: "2. Box & Papers Review", desc: "Having original box, guarantee cards, and purchase papers adds extra payout value." },
      { title: "3. Market Pricing", desc: "Valued against secondary global luxury timepiece market trading indexes." },
      { title: "4. Immediate Payout", desc: "Immediate cash payout or bank transfer completed in our private VIP lounge." }
    ],
    faqs: [
      { q: "Can I sell my watch if I lost the original box or papers?", a: "Yes! We authenticate watches in-person using physical and movement inspection even without papers." },
      { q: "How long does the valuation process take?", a: "Watch authentication usually takes 10 to 15 minutes, after which payment is made immediately." }
    ]
  },
  {
    id: "pawned-gold-release",
    title: "Pawned Gold Release & Ticket Settlement",
    subtitle: "We Settle Bank Debt & Pawn Tickets so You Walk Away with Cash Profit",
    badge: "Debt Relief Service",
    icon: <FileText className="h-6 w-6 text-amber-500" />,
    image: "/img-2.jpeg",
    desc: "Is your gold pledged at a bank or pawn shop with high monthly compound interest rates? Don't let your valuable gold get auctioned! GBC offers a specialized Pawn Ticket Settlement Service. We pay off your bank debt or pawn balance on your behalf, retrieve your gold items, evaluate them at today's peak market gold rates, and hand you the remaining cash profit!",
    acceptedItems: [
      "Commercial Bank Pawn Receipts",
      "People's Bank & BOC Pawn Tickets",
      "HNB, Sampath & Seylan Pawn Receipts",
      "Private Pawn Shop Pledges",
      "Pawned Gold Chains, Bangles & Rings"
    ],
    processSteps: [
      { title: "1. Review Your Receipt", desc: "Bring your pawn receipt or bank statement to GBC Colombo office." },
      { title: "2. Calculate Surplus Profit", desc: "We calculate today's gold payout minus the bank payoff debt." },
      { title: "3. Ticket Settlement", desc: "We accompany you to the bank or settle the balance directly with the institution." },
      { title: "4. Receive Cash Surplus", desc: "Your gold is released, verified, and you walk away with the remaining cash profit!" }
    ],
    faqs: [
      { q: "How do I know how much surplus cash I will receive?", a: "Bring your pawn ticket to GBC. We calculate today's gold rate minus the debt owed—the difference is instant cash in your pocket." },
      { q: "Is the process safe and confidential?", a: "100% safe, legal, and confidential. We handle all redemption documentation securely." }
    ]
  },
  {
    id: "sovereign-bullion",
    title: "Gold Sovereigns, Coins & Bullion Bars",
    subtitle: "Maximum Payouts for 24K & 22K Investment Gold Sovereigns & Bars",
    badge: "100% Full Payout",
    icon: <Coins className="h-6 w-6 text-amber-500" />,
    image: "/img-8.jpeg",
    desc: "Selling investment gold coins or 24K bullion bars? We purchase Sovereign gold coins (English Sovereigns, King George, Queen Elizabeth), 22K coins, PAMP Suisse bars, Valcambi, and local gold mint bars at maximum spot market value with zero processing or assaying fees.",
    acceptedItems: [
      "Gold Sovereigns (Pawan / 8g Coins)",
      "24K Fine Gold Bullion Bars (1g to 1kg)",
      "PAMP Suisse, Credit Suisse & Valcambi Bars",
      "Commemorative & Foreign Gold Coins",
      "22K Gold Bullion Medallions"
    ],
    processSteps: [
      { title: "1. Weight & Purity Check", desc: "Weighed on certified 0.001g digital scales and XRF verified." },
      { title: "2. Zero Melting Deduction", desc: "Pure coins and hallmark bullion bars incur zero assaying or melting charges." },
      { title: "3. Live Market Pricing", desc: "Calculated directly at daily spot market rate plus GBC bonus rate." },
      { title: "4. Immediate Cash", desc: "Immediate cash payout or instant online bank wire in hand." }
    ],
    faqs: [
      { q: "What is the weight of 1 Gold Sovereign (Pawan)?", a: "A standard Gold Sovereign (Pawan) weighs exactly 8.00 grams of 22K gold." },
      { q: "Are there any deductions for 24K bullion bars?", a: "No! Standard 24K hallmark bullion bars receive 100% full payout with zero deductions." }
    ]
  }
];

export default function ServicesPage({
  currentLang,
  selectedServiceId,
  onSelectService,
  setView,
  onSelectBranch
}: ServicesPageProps) {
  const [activePhoto, setActivePhoto] = useState<any | null>(null);

  const activeService = selectedServiceId 
    ? servicesData.find(s => s.id === selectedServiceId) || null
    : null;

  const handleServiceClick = (id: string) => {
    if (onSelectService) {
      onSelectService(id);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToAllServices = () => {
    if (onSelectService) {
      onSelectService(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pt-24 pb-16 bg-neutral-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumbs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <button 
              type="button"
              onClick={() => {
                if (setView) setView("home");
              }}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="h-3 w-3 text-neutral-600" />
            <button 
              type="button"
              onClick={handleBackToAllServices}
              className={`hover:text-amber-400 transition-colors cursor-pointer ${!activeService ? "text-amber-400 font-bold" : ""}`}
            >
              Services
            </button>
            {activeService && (
              <>
                <ChevronRight className="h-3 w-3 text-neutral-600" />
                <span className="text-amber-400 font-bold truncate max-w-[200px] sm:max-w-xs">{activeService.title}</span>
              </>
            )}
          </div>

          {activeService && (
            <button
              onClick={handleBackToAllServices}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-amber-500" />
              <span>All Services</span>
            </button>
          )}
        </div>

        {/* Top Quick Services Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <button
            type="button"
            onClick={handleBackToAllServices}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              !activeService
                ? "bg-amber-500 text-neutral-950 font-black shadow-lg shadow-amber-500/20"
                : "bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            }`}
          >
            All Services
          </button>
          {servicesData.map((service) => {
            const isActive = activeService?.id === service.id;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => handleServiceClick(service.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-amber-500 text-neutral-950 font-black shadow-lg shadow-amber-500/20"
                    : "bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <span>{service.title.split(" ")[0]} {service.title.split(" ")[1]}</span>
              </button>
            );
          })}
        </div>

        {/* CONDITIONAL RENDER: SINGLE SERVICE PAGE vs ALL SERVICES MASTER VIEW */}
        {activeService ? (
          /* INDIVIDUAL SERVICE DETAIL PAGE */
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Header / Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-950/80 border border-neutral-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>{activeService.badge}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-serif font-black text-white leading-tight">
                  {activeService.title}
                </h1>

                <p className="text-sm sm:text-base text-amber-400 font-semibold">
                  {activeService.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {activeService.desc}
                </p>

                {/* Quick Action CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="tel:0718321321"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 no-underline"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call 0718 321 321</span>
                  </a>

                  <a
                    href="https://wa.me/94718321321?text=Hi%20GBC,%20I%20am%20interested%20in%20your%20services"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all no-underline"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp Desk</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (setView) setView("calculator");
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <Calculator className="h-4 w-4 text-amber-400" />
                    <span>Gold Calculator</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
                  <img
                    src={activeService.image}
                    alt={activeService.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-500/20 backdrop-blur-md rounded-xl border border-amber-500/30 text-amber-400">
                        {activeService.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">100% Guaranteed Payouts</div>
                        <div className="text-[10px] text-amber-400">Computerized XRF Assaying</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accepted Items & Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Accepted Items */}
              <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">What We Accept</h3>
                    <p className="text-xs text-neutral-400">Items eligible for instant cash valuation</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {activeService.acceptedItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/60">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-semibold text-neutral-200">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Testing & Valuation Process */}
              <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">4-Step Valuation Process</h3>
                    <p className="text-xs text-neutral-400">Transparent & damage-free</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {activeService.processSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/60">
                      <div className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{step.title}</h4>
                        <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Specific FAQs */}
            <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Frequently Asked Questions</h3>
                  <p className="text-xs text-neutral-400">Common questions about {activeService.title}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeService.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800/60 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-amber-400 leading-snug">{faq.q}</h4>
                    <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Find Branch Banner */}
            <div className="bg-gradient-to-r from-amber-500/20 via-neutral-900 to-neutral-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-left">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white">Find a Branch Offering This Service</h3>
                <p className="text-xs text-neutral-300">All 16 GBC branches across Colombo offer instant valuation and cash payouts.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (setView) setView("branches");
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all shrink-0 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <MapPin className="h-4 w-4" />
                <span>Explore 16 Branches</span>
              </button>
            </div>

            {/* Other Services Navigation Grid */}
            <div className="pt-8 border-t border-neutral-800">
              <h3 className="text-base font-serif font-bold text-white mb-6">Explore Other Services</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {servicesData.filter(s => s.id !== activeService.id).map((otherService) => (
                  <div
                    key={otherService.id}
                    onClick={() => handleServiceClick(otherService.id)}
                    className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-amber-500 mb-2">
                        {otherService.icon}
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">{otherService.badge}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {otherService.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">
                        {otherService.subtitle}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>View Service</span>
                      <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* MASTER SERVICES OVERVIEW PAGE */
          <div className="space-y-16 animate-in fade-in duration-300">
            {/* Master Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs uppercase font-mono tracking-widest text-amber-500 font-semibold block">
                Our Expertise
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-black text-white leading-tight">
                Premium Asset Purchasing Services
              </h1>
              <p className="text-xs sm:text-base text-neutral-400 leading-relaxed">
                We specialize in providing secure, transparent, and high-value exchange services for your gold jewelry, certified diamonds, precious gemstones, and luxury timepieces in Colombo, Sri Lanka.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {servicesData.map((service) => (
                <div
                  key={service.id}
                  className="bg-neutral-950/70 rounded-2xl border border-neutral-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300 flex flex-col group shadow-xl"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-neutral-950">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-neutral-900/90 border border-neutral-700/60 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                      {service.badge}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">{service.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6 line-clamp-3">
                      {service.desc}
                    </p>

                    <div className="mt-auto space-y-4">
                      <ul className="space-y-2 border-t border-neutral-800/60 pt-4">
                        {service.acceptedItems.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={() => handleServiceClick(service.id)}
                        className="w-full py-3 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 border border-amber-500/30 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group-hover:border-amber-500"
                      >
                        <span>Explore Dedicated Page</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Office & Appraisal Lab Gallery */}
            <div className="border-t border-neutral-800/80 pt-16">
              <div className="text-center mb-10 max-w-2xl mx-auto space-y-2">
                <span className="text-xs uppercase font-mono tracking-widest text-amber-500 font-semibold block">
                  Live Office & Appraisal Lab
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  GBC Colombo Office in Action
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400">
                  We operate fully equipped, secure private evaluation lounges in Colombo. Take a look at our transparent computerized testing workflow.
                </p>
              </div>

              {/* Photo Showcase Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { src: "/img-1.jpeg", title: "Precision Gold Valuation", desc: "Evaluating gold weight and testing purity with high precision instrumentation." },
                  { src: "/img-2.jpeg", title: "Gold Jewelry Inspection", desc: "Comprehensive testing for chains, bangles, and family heirlooms." },
                  { src: "/img-3.jpeg", title: "XRF Purity Testing", desc: "Advanced non-destructive X-Ray spectrometer analysis." },
                  { src: "/img-4.jpeg", title: "Diamond Appraisal", desc: "Certified gemologist evaluation for loose diamonds and sapphires." },
                  { src: "/img-5.jpeg", title: "Certified Scales", desc: "Calibrated digital scales guaranteeing 100% accurate weight." }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhoto(item)}
                    className="group cursor-pointer flex flex-col"
                  >
                    <div className="relative h-40 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 group-hover:border-amber-500/40 transition-all">
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <div className="mt-2 text-left">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-neutral-400 line-clamp-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={() => setActivePhoto(null)}
        >
          <button 
            type="button"
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 text-neutral-400 hover:text-white bg-neutral-900/80 p-2.5 rounded-full border border-neutral-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="relative max-w-3xl max-h-[85vh] w-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={activePhoto.src}
              alt={activePhoto.title}
              className="max-w-full max-h-[75vh] rounded-xl border border-neutral-800 shadow-2xl object-contain"
            />
            <div className="text-center mt-4">
              <h4 className="text-base font-serif font-bold text-amber-400">{activePhoto.title}</h4>
              <p className="text-xs text-neutral-300 mt-1">{activePhoto.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
