import React, { useState } from "react";
import { Coins, Gem, Watch, CheckCircle2, ShieldCheck, X, ZoomIn } from "lucide-react";
import { Language } from "../lib/translations.js";
import ResponsiveImage from "./ResponsiveImage.js";

// Import original JPG files
import gallery1 from "../assets/images/gallery-1.jpg";
import gallery2 from "../assets/images/gallery-2.jpg";
import gallery3 from "../assets/images/gallery-3.jpg";
import gallery4 from "../assets/images/gallery-4.jpg";
import gallery5 from "../assets/images/gallery-5.jpg";

// Import generated WebP images
import gallery1Sm from "../assets/images/gallery-1-sm.webp";
import gallery1Md from "../assets/images/gallery-1-md.webp";
import gallery1Lg from "../assets/images/gallery-1-lg.webp";

import gallery2Sm from "../assets/images/gallery-2-sm.webp";
import gallery2Md from "../assets/images/gallery-2-md.webp";
import gallery2Lg from "../assets/images/gallery-2-lg.webp";

import gallery3Sm from "../assets/images/gallery-3-sm.webp";
import gallery3Md from "../assets/images/gallery-3-md.webp";
import gallery3Lg from "../assets/images/gallery-3-lg.webp";

import gallery4Sm from "../assets/images/gallery-4-sm.webp";
import gallery4Md from "../assets/images/gallery-4-md.webp";
import gallery4Lg from "../assets/images/gallery-4-lg.webp";

import gallery5Sm from "../assets/images/gallery-5-sm.webp";
import gallery5Md from "../assets/images/gallery-5-md.webp";
import gallery5Lg from "../assets/images/gallery-5-lg.webp";

interface ServicesProps {
  currentLang: Language;
}

interface GalleryItemType {
  src: string;
  srcSm: string;
  srcMd: string;
  srcLg: string;
  title: string;
  desc: string;
}

export default function Services({ currentLang }: ServicesProps) {
  const [activePhoto, setActivePhoto] = useState<GalleryItemType | null>(null);

  const services = [
    {
      icon: <Coins className="h-6 w-6 text-amber-500" />,
      image: gallery1,
      imageSm: gallery1Sm,
      imageMd: gallery1Md,
      imageLg: gallery1Lg,
      title: "Gold Buying Service",
      subtitle: "Highest Cash Prices in Sri Lanka",
      desc: "Looking for a trusted gold buying service in Sri Lanka? We offer competitive prices for all types of gold, including gold jewelry, gold coins, gold bars, and scrap gold. Our experienced team provides free evaluations, transparent pricing based on the latest gold market rates, and instant cash payments.",
      points: [
        "Instant cash payments",
        "Free gold valuation",
        "Secure and confidential",
        "Buy broken & investment gold"
      ]
    },
    {
      icon: <Gem className="h-6 w-6 text-amber-500" />,
      image: gallery2,
      imageSm: gallery2Sm,
      imageMd: gallery2Md,
      imageLg: gallery2Lg,
      title: "Diamond & Gem Buying",
      subtitle: "Certified & Precious Gemstones",
      desc: "Looking for a trusted diamond and gem buyer in Sri Lanka? We buy natural diamonds, certified diamonds, precious gemstones, loose stones, and diamond jewelry at competitive market prices. We ensure a secure, confidential, and hassle-free experience for rubies, sapphires, emeralds, and more.",
      points: [
        "Professional gem evaluation",
        "Instant cash payments",
        "Buy loose & certified diamonds",
        "Safe and confidential"
      ]
    },
    {
      icon: <Watch className="h-6 w-6 text-amber-500" />,
      image: gallery3,
      imageSm: gallery3Sm,
      imageMd: gallery3Md,
      imageLg: gallery3Lg,
      title: "Luxury Watch Buyers",
      subtitle: "Rolex, Patek Philippe, Omega & More",
      desc: "Looking to sell your luxury watch? We are trusted luxury watch buyers in Sri Lanka, offering competitive prices for authentic luxury timepieces. We buy pre-owned and new luxury watches providing professional evaluations, fair market prices, and instant payments.",
      points: [
        "Free professional watch valuation",
        "Instant cash payments",
        "Buy single watches & collections",
        "Trusted buyers in Colombo"
      ]
    }
  ];

  const galleryItems: GalleryItemType[] = [
    {
      src: gallery1,
      srcSm: gallery1Sm,
      srcMd: gallery1Md,
      srcLg: gallery1Lg,
      title: "Precision Gold Inspection",
      desc: "Evaluating gold weight and testing purity with high-precision instrumentation."
    },
    {
      src: gallery2,
      srcSm: gallery2Sm,
      srcMd: gallery2Md,
      srcLg: gallery2Lg,
      title: "XRF Computerized Testing",
      desc: "Using advanced XRF spectrometer technology for 100% non-destructive purity analysis."
    },
    {
      src: gallery3,
      srcSm: gallery3Sm,
      srcMd: gallery3Md,
      srcLg: gallery3Lg,
      title: "Professional Appraisal Desk",
      desc: "Providing a secure, private, and confidential environment for asset valuations."
    },
    {
      src: gallery4,
      srcSm: gallery4Sm,
      srcMd: gallery4Md,
      srcLg: gallery4Lg,
      title: "Certified Digital Scales",
      desc: "Government-approved and calibrated state-of-the-art scale readouts."
    },
    {
      src: gallery5,
      srcSm: gallery5Sm,
      srcMd: gallery5Md,
      srcLg: gallery5Lg,
      title: "Instant Secure Cash Out",
      desc: "Instant cash payouts or bank transfers with fully transparent receipts."
    }
  ];

  return (
    <section className="py-20 px-4 bg-neutral-900 text-white" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-500 block mb-3 font-semibold">
            Our Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Premium Asset Purchasing Services
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base">
            We specialize in providing secure, transparent, and high-value exchange services for your precious assets in Colombo, Sri Lanka.
          </p>
        </div>

        {/* Services Grid with Real Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-neutral-950/50 rounded-2xl border border-neutral-800/80 overflow-hidden hover:border-amber-500/40 transition-all duration-350 flex flex-col group shadow-lg"
            >
              {/* Image Header with Zoom Hover */}
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-neutral-950">
                <ResponsiveImage
                  srcSm={service.imageSm}
                  srcMd={service.imageMd}
                  srcLg={service.imageLg}
                  srcFallback={service.image}
                  alt={service.title}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 h-12 w-12 rounded-full bg-neutral-900/90 border border-amber-500/40 flex items-center justify-center backdrop-blur-sm shadow-md z-10">
                  {service.icon}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-serif font-bold text-white mb-1.5 group-hover:text-amber-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-4">{service.subtitle}</p>
                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                  {service.desc}
                </p>
                <ul className="space-y-3 mt-auto pt-4 border-t border-neutral-800/60">
                  {service.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Real Colombo Store & Live Appraisal Gallery Showcase */}
        <div className="border-t border-neutral-800/60 pt-20">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-mono tracking-widest text-amber-500 block mb-3 font-semibold">
              Live Office & Appraisal Lab
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
              GBC Colombo Office in Action
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-sm">
              We operate a fully equipped, secure private evaluation lounge in Colombo. Take a look at our transparent computerized testing workflow and state-of-the-art appraisal process.
            </p>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {galleryItems.map((item, index) => (
              <div 
                key={index}
                onClick={() => setActivePhoto(item)}
                className="group relative h-48 md:h-56 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 cursor-pointer hover:border-amber-500/40 transition-all duration-300 shadow-md"
              >
                <ResponsiveImage
                  srcSm={item.srcSm}
                  srcMd={item.srcMd}
                  srcLg={item.srcLg}
                  srcFallback={item.src}
                  alt={item.title}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                {/* Overlay Text & Icon */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-left flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300 z-10 pointer-events-none">
                  <span className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-wider block mb-0.5">Appraisal Lounge</span>
                  <h4 className="text-xs font-serif font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[9px] text-neutral-400 line-clamp-2 mt-1 hidden group-hover:block transition-all duration-300">
                    {item.desc}
                  </p>
                </div>

                <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-neutral-900/80 border border-neutral-700/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <ZoomIn className="h-3.5 w-3.5 text-amber-500" />
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badge Bar */}
          <div className="mt-12 bg-neutral-950/40 border border-neutral-800/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-sm sm:text-base">100% Genuine, Transparent & Secure</h4>
                <p className="text-xs text-neutral-400">Our Colombo office utilizes computerized XRF mineral spectrometry and certified digital scales calibrated to SL standards.</p>
              </div>
            </div>
            <a 
              href="tel:0718321321" 
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs uppercase tracking-widest rounded-lg transition-colors shadow-lg shadow-amber-500/5"
            >
              Call Colombo Office
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <button 
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors bg-neutral-900/60 p-2.5 rounded-full border border-neutral-800 z-50"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <ResponsiveImage
              srcSm={activePhoto.srcSm}
              srcMd={activePhoto.srcMd}
              srcLg={activePhoto.srcLg}
              srcFallback={activePhoto.src}
              alt={activePhoto.title}
              className="max-w-full max-h-[80vh] rounded-xl border border-neutral-800 shadow-2xl animate-zoom-in"
              imgClassName="object-contain max-h-[80vh]"
              priority={true}
            />
            {/* Description matching the active photo */}
            <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 text-center w-full max-w-lg px-4">
              <h4 className="text-sm font-serif font-bold text-amber-400">{activePhoto.title}</h4>
              <p className="text-xs text-neutral-400 mt-1">{activePhoto.desc}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
