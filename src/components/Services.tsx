import React from "react";
import { Coins, Gem, Watch, CheckCircle2 } from "lucide-react";
import { Language } from "../lib/translations.js";

interface ServicesProps {
  currentLang: Language;
}

export default function Services({ currentLang }: ServicesProps) {
  const services = [
    {
      icon: <Coins className="h-8 w-8 text-amber-500" />,
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
      icon: <Gem className="h-8 w-8 text-amber-500" />,
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
      icon: <Watch className="h-8 w-8 text-amber-500" />,
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-neutral-950/50 rounded-xl border border-neutral-800 p-8 hover:border-amber-500/30 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-1">
                {service.title}
              </h3>
              <p className="text-sm font-medium text-amber-500 mb-4">{service.subtitle}</p>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                {service.desc}
              </p>
              <ul className="space-y-3">
                {service.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-300">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
