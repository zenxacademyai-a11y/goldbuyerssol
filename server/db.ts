/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { GoldKarat, GoldRate, SystemSettings, Lead, BlogPost, HistoricalRate } from "../src/types.js";
import { injectSEOAndAuthorityLinks } from "./blog_hyperlinker.js";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

interface DatabaseSchema {
  rates: GoldRate[];
  settings: SystemSettings;
  leads: Lead[];
  blogs: BlogPost[];
  historicalRates: HistoricalRate[];
}

// Ensure the data directory and db.json file exist with seeded data
export function initializeDb(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  // Initial Seed Data
  const defaultRates: GoldRate[] = [
    { karat: GoldKarat.K24, purity: 0.999, ratePerGram: 25500 },
    { karat: GoldKarat.K22, purity: 0.916, ratePerGram: 23380 },
    { karat: GoldKarat.K21, purity: 0.875, ratePerGram: 22310 },
  ];

  const defaultSettings: SystemSettings = {
    lastUpdated: new Date().toISOString(),
    pavanWeightGrams: 8.0,
    bonusPremiumRate: 2.5, // GBC pays 2.5% premium for outright cash sell
    testingFeePerGram: 150, // Deducted for cleaning/testing
  };

  const defaultLeads: Lead[] = [
    {
      id: "lead_1",
      name: "Sajith Perera",
      phone: "0771234567",
      email: "sajith@example.com",
      goldKarat: GoldKarat.K22,
      weightGrams: 24, // 3 pavans
      estimatedValue: 561120,
      status: "Contacted",
      message: "I want to sell my grandmother's necklace. Please call me in the afternoon.",
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
    },
    {
      id: "lead_2",
      name: "Dilini Fernando",
      phone: "0719876543",
      email: "dilini.f@example.com",
      goldKarat: GoldKarat.K24,
      weightGrams: 10,
      estimatedValue: 255000,
      status: "New",
      message: "Have 24K gold biscuits. Looking for immediate cash in hand. Can come tomorrow morning.",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    },
  ];

  const articleConfigs = [
    {
      id: "blog_u1",
      slug: "10-best-gold-buyers-in-colombo-2026-guide",
      title: "10 Best Gold Buyers in Colombo (2026 Guide)",
      category: "Selling Gold" as const,
      tags: ["Gold Buyers", "Colombo Guide", "Best Payouts", "Sell Gold Sri Lanka", "Trusted Valuations"],
      metaTitle: "10 Best Gold Buyers in Colombo (2026 Comprehensive Guide)",
      metaDescription: "Looking to sell gold in Sri Lanka? Check out the 10 best gold buyers in Colombo for 2026. Compare payout rates, transparency, and computerized XRF testing.",
      author: "Samantha Alwis (Chief Valuation Officer, GBC)",
      date: "2026-06-25",
      theme: "Gold Payout Maximization & Professional Appraisers",
      focusKeyword: "Best Gold Buyers in Colombo",
      localizedPointers: ["Sea Street, Pettah", "Galle Road, Colombo 03", "Bambalapitiya Junction", "Wellawatte Galle Road", "Hatton National Bank Tower"],
      technicalContext: "German-engineered X-ray Fluorescence (XRF) spectroscopy vs subjective touchstone acid tests.",
      questions: [
        { q: "Who is the most trusted gold buyer in Colombo?", a: "To secure the highest cash payout for your gold in Colombo, you must bypass traditional middlemen and visit a professional gold buying office like Gold Buyers Colombo (GBC). Traditional jewelry shops in Pettah, particularly along Sea Street, often include subjective 'wastage' and 'melting loss' deductions that can reduce your payout by 10% to 20%. GBC uses certified computerized scales and non-destructive XRF technology to determine the exact weight and purity of your gold, ensuring you get paid for every milligram." },
        { q: "How is gold jewelry valued by top buyers in Sri Lanka?", a: "The value of your gold jewelry is determined by three main factors: the gross weight of the item, the exact metallurgical purity (karat), and the current global market spot rate of gold. Professional buyers use computerized digital scales calibrated by the Sri Lanka Standards Institution (SLSI) to find the weight, and XRF spectrometers to verify the exact gold percentage. Gemstones and non-gold alloys are deducted scientifically before applying the daily spot rate." },
        { q: "Do gold buyers in Colombo accept broken or scrap jewelry?", a: "Yes, professional gold buyers in Colombo accept broken, damaged, scrap, and single earrings with missing partners. This is because gold has high intrinsic value based solely on its metal content, not its artistic design or condition. A certified buyer will remove non-gold attachments like gemstones or steel springs, test the remaining alloy, and pay you the full market rate per gram for that karat." }
      ]
    },
    {
      id: "blog_u2",
      slug: "8-top-places-to-sell-gold-in-colombo-for-the-best-price",
      title: "8 Top Places to Sell Gold in Colombo for the Best Price",
      category: "Selling Gold" as const,
      tags: ["Sell Gold", "Best Price", "Colombo", "Pettah", "Wellawatte", "Gold Valuation"],
      metaTitle: "8 Top Places to Sell Gold in Colombo for the Best Price",
      metaDescription: "Discover the 8 top places to sell your gold in Colombo. Read about Sea Street, Wellawatte, Galle Road, and learn how to get the maximum payouts.",
      author: "Samantha Alwis (Chief Valuation Officer, GBC)",
      date: "2026-06-20",
      theme: "Comparative Valuation & Prime Localities",
      focusKeyword: "Sell gold in Colombo for best price",
      localizedPointers: ["Kollupitiya Galle Road", "Bambalapitiya Junction", "Sea Street Pettah", "Sampath Bank Colombo", "People's Bank"],
      technicalContext: "Comparing the business model of luxury bullion traders with retail pawning counters in Sri Lanka.",
      questions: [
        { q: "Where can I sell gold for the absolute best price in Colombo?", a: "The absolute best price is secured by selling to dedicated gold buyers like Gold Buyers Colombo (GBC) that use certified computerized X-ray spectrometers. Unlike traditional retailers or pawning banks who build massive risk margins, GBC operates on thin wholesale spreads and pays a real premium for your outright cash gold without 'kapaaha' (wastage) or high retail deductions." },
        { q: "Should I sell my gold in Pettah or Wellawatte?", a: "While Pettah (especially Sea Street) is famous as a high-density jewelry hub, it is highly informal, fast-paced, and involves aggressive bargaining and street tout commissions. Wellawatte and Bambalapitiya host more professional, private corporate buying offices (like GBC) where you can sell in secure, air-conditioned, private cabins with immediate CEFT electronic bank transfers, ensuring both a higher payout and superior safety." },
        { q: "Why do retail jewelry shops offer lower buyback prices?", a: "Retail jewelry shops are structured around selling finished jewelry with high markups. Their buyback policies are typically designed to encourage exchanges (trade-ins for other items) rather than cash payouts. When you request cash, they apply heavy penalties for melting and wastage to protect their cash flow, resulting in payouts 10% to 15% lower than specialized gold buyers." }
      ]
    },
    {
      id: "blog_u3",
      slug: "gold-buyer-vs-pawn-shop-in-sri-lanka-which-pays-more",
      title: "Gold Buyer vs Pawn Shop in Sri Lanka: Which Pays More?",
      category: "Selling Gold" as const,
      tags: ["Gold Buyer", "Pawn Shop Sri Lanka", "Ugas", "Financial Advice", "Gold Loans"],
      metaTitle: "Gold Buyer vs Pawn Shop Sri Lanka | Which Pays More?",
      metaDescription: "Gold buyer vs pawn shop in Sri Lanka: Compare loan-to-value ratios, interest accumulation, auction risks, and discover which option gets you more cash.",
      author: "Samantha Alwis (Chief Valuation Officer, GBC)",
      date: "2026-06-15",
      theme: "Macro Finance & Debt Avoidance",
      focusKeyword: "Gold Buyer vs Pawn Shop Sri Lanka",
      localizedPointers: ["Commercial Bank Colpetty", "BOC Fort", "Sampath Bank Wellawatte", "R.A. De Mel Mawatha", "GBC Colombo Appraisal Desk"],
      technicalContext: "Compound interest accumulation math, auction forfeiture terms, and liquid capital opportunity costs in the current LKR macroeconomic environment.",
      questions: [
        { q: "Does pawning gold or selling gold pay more in Sri Lanka?", a: "Selling gold outright to a specialized buyer pays significantly more cash. Banks and pawn shops typically limit their loans (Ugas) to 60%-80% of the gold's actual value to protect themselves from risk. Furthermore, pawning traps you in high-interest debt, where interest rates of 12%-24% rapidly compound. Selling outright gets you 100% of the peak market value in hand with zero debt." },
        { q: "What are the risks of pawning gold with a bank in Colombo?", a: "The biggest risk is unredeemed auctioning. If you cannot settle the principal and accumulated interest within 12 months, the bank will auction your gold. You lose your jewelry forever, and auction administrative charges, late penalties, and auctioneer fees typically wipe out any remaining equity, leaving you with nothing." },
        { q: "Can a gold buyer release my pawned gold from the bank for me?", a: "Yes, professional gold buyers like GBC offer a 'Pawn Release Service' (Ugas Bera Ganeema). GBC will clear your outstanding loan and interest at the bank, retrieve your physical gold, evaluate it using computerized XRF tech back at their office, deduct the bank settlement amount, and give you the remaining cash balance immediately." }
      ]
    },
    {
      id: "blog_u4",
      slug: "where-can-you-sell-gold-in-colombo-complete-local-guide",
      title: "Where Can You Sell Gold in Colombo? Complete Local Guide",
      category: "Selling Gold" as const,
      tags: ["Colombo Local Guide", "Selling Gold", "Gold Shops Pettah", "Bambalapitiya", "Sri Lanka"],
      metaTitle: "Where Can You Sell Gold in Colombo? Complete Local Guide",
      metaDescription: "Looking for where to sell gold in Colombo? Read our complete neighborhood guide covering Pettah, Wellawatte, Colombo 03, and Colombo 04.",
      author: "Samantha Alwis (Chief Valuation Officer, GBC)",
      date: "2026-06-10",
      theme: "Urban Geography & Commercial Mapping",
      focusKeyword: "Where to sell gold in Colombo",
      localizedPointers: ["Sea Street Pettah", "Duplication Road Colombo 03", "Marine Drive Bambalapitiya", "Viharamahadevi Park Area", "Liberty Plaza Mall"],
      technicalContext: "Reviewing regional pricing disparities, scale variations, and physical transportation hazards of precious metal logistics.",
      questions: [
        { q: "Where is the safest place to sell gold jewelry in Colombo?", a: "The safest place is a secure, modern corporate buying office on a main road like Galle Road (Bambalapitiya/Wellawatte). Offices like Gold Buyers Colombo (GBC) feature private valuation rooms, continuous CCTV monitoring, private parking, and pay via instant bank transfer. This is infinitely safer than carrying large bags of cash through crowded Pettah streets." },
        { q: "How do local Colombo gold rates differ from the world market?", a: "Colombo gold rates are directly tied to the international gold spot price (priced in USD per troy ounce on markets like COMEX/LBMA). However, the local rate fluctuates based on the domestic USD/LKR exchange rate, local import taxes/duties, and wedding/festival season demand. Buyers like GBC calculate rates dynamically using live feeds to ensure you get accurate pricing." },
        { q: "Are there licensed gold buyers outside of Pettah?", a: "Yes! While Pettah has historically been the center of gold trading, modern corporate offices like GBC have established licensed, state-of-the-art appraisal centers in premium suburbs like Colombo 04 (Bambalapitiya) and Colombo 03 (Kollupitiya) to provide a much more professional and accessible experience for retail sellers." }
      ]
    },
    {
      id: "blog_u5",
      slug: "gold-price-in-colombo-today-how-it-affects-selling-your-gold",
      title: "Gold Price in Colombo Today: How It Affects Selling Your Gold",
      category: "Gold Price" as const,
      tags: ["Gold Price Today", "Colombo Gold Rates", "22K Pavan Price", "LKR Exchange Rate", "Market Trends"],
      metaTitle: "Gold Price in Colombo Today | How It Affects Sellers",
      metaDescription: "Discover today's gold price in Colombo. Learn how the London Bullion Market, USD/LKR exchange rate, and local spreads calculate your jewelry's payout value.",
      author: "Samantha Alwis (Chief Valuation Officer, GBC)",
      date: "2026-06-05",
      theme: "Gold Macroeconomics & Price Formula Calculation",
      focusKeyword: "Gold price in Colombo today",
      localizedPointers: ["Colombo Fort Gold Exchange", "Central Bank of Sri Lanka Head Office", "Chatham Street Colombo 01", "World Trade Center Colombo"],
      technicalContext: "Arbitrage parity formulas, spot gold prices, LKR devaluation mathematics, import tariff structures, and CBSL reserve asset ratios.",
      questions: [
        { q: "Why does the gold price in Colombo change daily?", a: "Local gold prices change daily because they are tied to global commodity exchanges where gold is traded in real-time. Since global gold is denominated in US Dollars, any movement in the international spot price or any fluctuation in the USD/LKR exchange rate immediately alters the domestic rupee price of gold." },
        { q: "How is the price of a 22K pavan calculated in Sri Lanka Rupees?", a: "A Pavan is equivalent to 8.0 grams of gold. For 22K (which is 91.6% pure gold), the calculation is: (International Gold price per Troy Ounce / 31.1035g) * 0.916 * USD/LKR Exchange Rate + local premium. To find the price of a 22K pavan, multiply the daily 22K gold price per gram by 8. GBC provides a live online calculator that automates this calculation in real-time." },
        { q: "When is the best time to sell my gold jewelry in Sri Lanka?", a: "The best time to sell gold jewelry is when global spot rates are high, the LKR currency is facing local inflationary pressure, or when you have high-interest personal debt to clear. Since gold rates are currently near historic highs in 2026, selling unused or scrap gold unlocks huge liquidity that can be deployed into higher-yielding investments." }
      ]
    },
    {
      id: "blog_u6",
      slug: "12-common-mistakes-to-avoid-when-selling-gold-in-sri-lanka",
      title: "12 Common Mistakes to Avoid When Selling Gold in Sri Lanka",
      category: "Selling Gold" as const,
      tags: ["Selling Mistakes", "Gold Scams", "Kapaaha Payouts", "Sri Lanka Gold", "Purity Testing"],
      metaTitle: "12 Mistakes to Avoid When Selling Gold in Sri Lanka",
      metaDescription: "Protect your wealth. Avoid these 12 common mistakes when selling gold in Sri Lanka, including touchstone scraping, hidden kapaaha fees, and weight tricks.",
      author: "Samantha Alwis (Chief Valuation Officer, GBC)",
      date: "2026-06-01",
      theme: "Consumer Advocacy & Fraud Prevention Checklist",
      focusKeyword: "Selling gold in Sri Lanka mistakes",
      localizedPointers: ["National Gem and Jewellery Authority", "Colombo 03 Kollupitiya", "Sea Street Pettah", "SLSI Laboratory Colombo"],
      technicalContext: "Calibration tamper-prevention, scale verification protocols, computerized weighing standards, and physical stone-scrape loss tracking.",
      questions: [
        { q: "What are the most common weight traps used by dishonest gold buyers?", a: "Dishonest buyers often use uncalibrated mechanical scales, place scales under strong air conditioning drafts (which adds downward pressure to the reading), or weight jewelry with heavy gemstones attached and then guess/overstate the stone weight to deduct more gold weight than necessary. Always look for SLSI-calibrated digital scales positioned in full public view." },
        { q: "Is it safe to let a jeweler scrape or acid-test my gold?", a: "No. Traditional 'touchstone' scraping physically scratches your jewelry, scraping off valuable gold. If you decide not to sell, your jewelry remains permanently damaged and lighter. Corrosive nitric acid can also discolor your item. Insist on non-destructive computerized XRF spectroscopy which scans the metal without scratch marks." },
        { q: "What is 'Kapaaha' or wastage and is it fair to deduct it?", a: "Kapaaha (wastage) is a traditional retail deduction of 5% to 15% applied under the claim that gold is lost during melting. For modern outright purchases of solid jewelry, this deduction is highly unfair and is used solely to maximize dealer profit. Certified buyers like GBC pay you for the exact solid metal weight without arbitrary wastage fees." }
      ]
    },
    {
      id: "blog_u7",
      slug: "cash-for-gold-in-colombo-everything-you-need-to-know",
      title: "Cash for Gold in Colombo: Everything You Need to Know",
      category: "Selling Gold" as const,
      tags: ["Cash for Gold", "Colombo Cash", "Sell Gold Legally", "CEFT Bank Transfer"],
      metaTitle: "Cash for Gold in Colombo: Complete 2026 Seller Guide",
      metaDescription: "Thinking of getting cash for gold in Colombo? Understand legal requirements, required ID documents, and how to verify computerized XRF purity on the spot.",
      author: "Samantha Alwis (Chief Valuation Officer, GBC)",
      date: "2026-05-25",
      theme: "Legal Compliance & Instant Cash Logistics",
      focusKeyword: "Cash for gold in Colombo",
      localizedPointers: ["Sea Street Pettah", "Bambalapitiya Majestic City", "Wellawatte Galle Road", "Colombo Municipal Council", "National Gem & Jewellery Authority"],
      technicalContext: "Reviewing anti-money laundering regulations, NIC verification steps, and instant CEFT electronic bank transfer systems.",
      questions: [
        { q: "Do I need a purchase receipt to sell my gold in Colombo?", a: "No, you do not need the original purchase receipt to sell your gold in Colombo. Modern appraisers use computerized XRF spectroscopy to verify the exact purity of your gold on the spot, making old receipts redundant for valuation. However, some buyers might ask for a receipt for high-value bullion biscuits." },
        { q: "Is an instant bank transfer safer than carrying cash in Pettah?", a: "Yes, infinitely safer. Carrying millions of Sri Lankan Rupees in cash through busy public spaces presents an extreme security risk. Modern offices like GBC provide instant CEFT bank transfers to any major Sri Lankan bank (BOC, HNB, Sampath, Commercial) in seconds, ensuring your funds are securely deposited before you walk out." },
        { q: "What documents are legally required to sell gold in Sri Lanka?", a: "To prevent the recycling of stolen goods and to comply with anti-money laundering and local police guidelines, you must present a valid government-issued photo ID. This includes your National Identity Card (NIC), valid driving license, or passport. The buyer will log this information securely and keep it confidential." }
      ]
    },
    {
      id: "blog_u8",
      slug: "used-jewellery-buyers-in-colombo-how-to-get-maximum-value",
      title: "Used Jewellery Buyers in Colombo: How to Get Maximum Value",
      category: "Jewelry" as const,
      tags: ["Used Jewellery Buyers", "Maximum Value", "Sell Gold Jewelry", "Gemstone Deductions"],
      metaTitle: "Used Jewellery Buyers in Colombo | Get Maximum Value",
      metaDescription: "How to get maximum value from used jewellery buyers in Colombo. Learn how purity XRF scans, stone weights, and professional valuations maximize your cash.",
      author: "Samantha Alwis (Chief Valuation Officer, GBC)",
      date: "2026-05-20",
      theme: "Retail Preparation & Value Optimization",
      focusKeyword: "Used Jewellery Buyers in Colombo",
      localizedPointers: ["Colombo 07 Cinnamon Gardens", "Flower Road Colombo", "National Museum Colombo", "Galle Face Green District"],
      technicalContext: "Analyzing the metallurgy of alloy elements and the accurate estimation of gemstone tare weights using volume equations.",
      questions: [
        { q: "How do gold buyers value old wedding jewelry in Sri Lanka?", a: "Old wedding jewelry is valued strictly based on its precious metal content (net gold weight and karat purity). Traditional Sri Lankan wedding jewelry is typically 22K (91.6% pure), though older heirlooms might be 20K (840 purity). Buyers like GBC use XRF scans to find the exact purity and pay you based on the daily market rate per gram." },
        { q: "Will buyers pay for diamonds or gemstones in my gold ring?", a: "Most traditional scrap dealers deduct the weight of gemstones entirely and value them at zero because they lack gemological expertise. At GBC, our certified appraisers evaluate valuable gemstones (like Sri Lankan blue sapphires) scientifically, offering a fair price for them or returning them to you undamaged." },
        { q: "Does cleaning my gold jewelry before selling make a difference?", a: "Yes, it is highly recommended. Over years of wear, jewelry gathers soap scum, body oils, lotions, and dirt in its settings, which can coat the surface and affect testing or add artificial weight. Cleaning your jewelry in warm soapy water with a soft toothbrush ensures an accurate weight and a clear, clean XRF reading." }
      ]
    },
    {
      id: "blog_u9",
      slug: "how-to-choose-a-trusted-gold-buyer-in-colombo-2026-checklist",
      title: "How to Choose a Trusted Gold Buyer in Colombo (2026 Checklist)",
      category: "Selling Gold" as const,
      tags: ["Trusted Gold Buyer", "Colombo Checklist", "Gold Appraisal", "Purity Scanners"],
      metaTitle: "How to Choose a Trusted Gold Buyer in Colombo (Checklist)",
      metaDescription: "A critical checklist for choosing a trusted gold buyer in Colombo. Spot uncalibrated scales, look for SLSI certs, XRF machines, and secure private cabins.",
      author: "Samantha Alwis (Chief Valuation Officer, GBC)",
      date: "2026-05-15",
      theme: "Trust Signals & Audit Requirements",
      focusKeyword: "How to choose a trusted gold buyer in Colombo",
      localizedPointers: ["Central Bank of Sri Lanka Head Office", "Chatham Street Colombo 01", "World Trade Center Colombo", "YMBA Building Pettah"],
      technicalContext: "Scale calibration stamps, regulatory compliance checks, and non-destructive spectroscopy audit metrics.",
      questions: [
        { q: "How do I verify if a gold buyer in Colombo is licensed?", a: "A trusted gold buyer should display their business registration and any municipal licenses openly in their office. They should provide official, printed, computer-generated transaction receipts containing their registered company details, address, and SLSI-scale certifications, rather than handwritten scraps." },
        { q: "Why is computerized XRF testing superior to touchstone tests?", a: "Computerized XRF testing is superior because it is 100% scientific, objective, and non-destructive. It provides an immediate printout of the exact percentages of gold, silver, copper, and zinc in your jewelry in 30 seconds. Touchstone testing is subjective, scrapes off valuable metal, and cannot detect gold-plated jewelry." },
        { q: "What should I see on the display of a certified gold scale?", a: "Before your gold is placed on the scale, the digital display must read exactly '0.00g'. The scale should be shielded by a wind protector (glass box) to prevent drafts from affecting the weight. It must also have a valid sticker showing calibration approval by the Sri Lanka Standards Institution (SLSI)." }
      ]
    },
    {
      id: "blog_u10",
      slug: "gold-buyers-colombo-vs-jewellery-shops-which-offers-better-value",
      title: "Gold Buyers Colombo vs Jewellery Shops: Which Offers Better Value?",
      category: "Selling Gold" as const,
      tags: ["Gold Buyers", "Jewellery Shops", "Outright Cash Buy", "Gold Exchange", "Sri Lanka Gold"],
      metaTitle: "Gold Buyers vs Jewellery Shops Colombo | Better Value?",
      metaDescription: "Compare gold buyers vs jewelry shops in Colombo. Discover why jewelry shops charge melting loss and retail fees, while dedicated buyers offer slim spreads.",
      author: "Samantha Alwis (Chief Valuation Officer, GBC)",
      date: "2026-05-10",
      theme: "Business Model Comparison & Value Spreads",
      focusKeyword: "Gold Buyers Colombo vs Jewellery Shops",
      localizedPointers: ["Duplication Road Colombo 03", "Marine Drive Bambalapitiya", "Viharamahadevi Park Area", "Liberty Plaza Mall"],
      technicalContext: "Retail markup structures, buyback margins, and cash liquidity ratios for scrap metal refining.",
      questions: [
        { q: "Why do jewelry shops pay less cash for gold buyback?", a: "Jewelry shops make their money selling highly marked-up finished items. They do not want to buy back scrap gold for cash because it ties up their capital in illiquid inventory that must be sent for refining. To discourage cash buybacks, they apply heavy 10%-20% melting and wastage penalties. Specialized buyers like GBC deal in high wholesale volumes and offer premium cash prices." },
        { q: "Is it better to exchange gold for new jewelry or sell for cash?", a: "Exchanging gold is only beneficial if you are 100% committed to buying a new piece from the exact same shop. However, you will still pay high 'making charges' and markups on the new item. If you want maximum liquid flexibility, selling for cash to a professional gold buyer gets you the highest value, which you can save, deposit, or spend anywhere." },
        { q: "What is a specialized gold buyer and how do they make a profit?", a: "A specialized gold buyer (like GBC) is a corporate institution that focus exclusively on buying gold jewelry, coins, and bullion from the public. They operate on very slim profit margins, buying gold at near-market rates and selling it in massive wholesale volumes directly to refineries. This high-volume model allows them to pay you significantly higher cash rates than retail jewelry shops." }
      ]
    }
  ];

  function generateDetailedHtmlContent(cfg: typeof articleConfigs[number]) {
    return `
<p class="lead">For residents and investors looking to navigate the precious metals market, understanding how to value, test, and sell assets is critical for protecting household wealth. This comprehensive guide, compiled by the chief appraisal team at <strong>Gold Buyers Colombo (GBC)</strong>, provides a complete, scientific, and localized breakdown of the gold trade in Sri Lanka for 2026.</p>

<h2>1. Introduction to the Colombo Gold Ecosystem</h2>
<p>The gold trade in Sri Lanka is a deeply rooted cultural and economic institution. Historically centered around <strong>${cfg.localizedPointers[0]}</strong> in Pettah, the market has evolved rapidly over the past decade. Today, sellers have access to traditional wholesale dealers, local pawning centers (known as <em>Ugas</em>), retail jewelers, and modern corporate gold-buying offices like GBC located along <strong>${cfg.localizedPointers[1]}</strong> and <strong>${cfg.localizedPointers[2]}</strong>.</p>
<p>In 2026, navigating this market requires more than just walking into the nearest shop. Daily price fluctuations are driven by global macroeconomic factors and the domestic USD to LKR exchange rate, which is heavily influenced by policies set by the <strong>Central Bank of Sri Lanka</strong>. To secure the absolute best price for your physical gold, you must understand the underlying science of gold appraisal, identify common retail traps, and follow a structured selling process.</p>

<h2>2. Traditional Pettah Trading vs. Modern Computerized Appraisers</h2>
<p>When selling gold in Colombo, the two primary pathways are traditional informal dealers in Pettah and modern corporate appraisers. Understanding the differences in their operational models is essential for getting a fair valuation:</p>
<ul>
  <li><strong>Informal Pettah / Sea Street Shops:</strong> These shops rely heavily on traditional appraisal methods, variable daily rates, face-to-face bargaining, and street tout introductions. While historically popular, they often deduct substantial fees (up to 15%) for "wastage" (<em>Kapaaha</em>) or "melting losses" (<em>Uruveema</em>).</li>
  <li><strong>Modern Appraisers (GBC):</strong> Corporate offices like GBC utilize advanced technology, SLSI-certified scales, and fixed daily premium rates. There are no subjective "wastage" or "melting loss" deductions, and transactions are completed in private, secure valuation rooms with immediate electronic bank transfers via systems like CEFT or SLIPS.</li>
</ul>

<h3>Comparison Matrix: Traditional Pettah vs. GBC Corporate Offices</h3>
<table class="min-w-full divide-y divide-neutral-300 my-6">
  <thead>
    <tr class="bg-neutral-100">
      <th class="px-4 py-2 text-left font-semibold">Feature / Metric</th>
      <th class="px-4 py-2 text-left font-semibold">Traditional Pettah Dealers</th>
      <th class="px-4 py-2 text-left font-semibold">Modern Corporate Offices (GBC)</th>
    </tr>
  </thead>
  <tbody class="divide-y divide-neutral-200">
    <tr>
      <td class="px-4 py-2 font-medium">Primary Testing Method</td>
      <td class="px-4 py-2">Subjective touchstone scraping & corrosive acid test</td>
      <td class="px-4 py-2">Scientific, non-destructive computerized XRF scanning</td>
    </tr>
    <tr>
      <td class="px-4 py-2 font-medium">Physical Damage to Gold</td>
      <td class="px-4 py-2">Permanent scratches and loss of physical mass</td>
      <td class="px-4 py-2">100% damage-free, preserves physical integrity</td>
    </tr>
    <tr>
      <td class="px-4 py-2 font-medium">Weighing Standards</td>
      <td class="px-4 py-2">Older mechanical or uncertified digital scales</td>
      <td class="px-4 py-2">SLSI-calibrated digital scales in 100% public view</td>
    </tr>
    <tr>
      <td class="px-4 py-2 font-medium">Wastage & Melting Fees</td>
      <td class="px-4 py-2">Arbitrary deductions (Kapaaha/Uruveema) of 5%-15%</td>
      <td class="px-4 py-2">Zero arbitrary deductions; pays for exact solid weight</td>
    </tr>
    <tr>
      <td class="px-4 py-2 font-medium">Payout Methods</td>
      <td class="px-4 py-2">Bundles of physical cash on the street</td>
      <td class="px-4 py-2">Immediate CEFT/SLIPS bank transfers inside secure cabins</td>
    </tr>
  </tbody>
</table>

<h2>3. The Science of Karat Purity and Computerized XRF Assaying</h2>
<p>Gold is naturally extremely soft and malleable, making 100% pure gold (24 Karat) highly impractical for jewelry manufacturing. To increase its strength, goldsmiths alloy gold with harder metals such as silver, copper, and zinc. The karat system designates the purity of the alloy out of a maximum of 24 parts:</p>
<blockquote>
  <p><strong>Purity Calculation:</strong> Karat = 24 &times; (Mass of pure gold / Total mass of alloy)</p>
</blockquote>
<p>In Sri Lanka, <strong>22 Karat gold</strong>, universally stamped as <strong>"916"</strong>, is the standard for high-quality wedding and family heirloom jewelry. 916 gold contains exactly 91.6% pure gold by weight. Older estate jewelry might carry a stamp of <strong>"840"</strong> (20 Karat, 84% pure), while modern white gold or diamond-set pieces are usually <strong>18 Karat</strong> ("750", 75% pure).</p>
<p>To determine this purity accurately and fairly, modern appraisers utilize <strong>computerized X-ray Fluorescence (XRF) spectroscopy</strong>. The XRF spectrometer is completely non-destructive: it exposes the gold alloy to controlled X-rays, exciting the metal atoms. The atoms emit secondary, characteristic X-rays that are analyzed by high-resolution sensors to compute the exact elemental composition of the gold in less than 30 seconds. This scientific approach eliminates subjective visual guesswork, ensuring you get paid for every milligram of pure gold present.</p>

<h2>4. Step-by-Step Guide: How to Sell Gold Safely in Colombo</h2>
<p>To maximize your payout and protect your high-value physical assets, GBC recommends following this systematic five-step operational checklist before walking into any gold buying office:</p>
<ol>
  <li><strong>Conduct a Home Inventory:</strong> Gather your jewelry, coins, or biscuits and inspect them under a magnifying glass to find hallmark stamps (916, 22K, 18K, 840). Group your items by purity.</li>
  <li><strong>Gentle Cleaning:</strong> Over years of wear, gold jewelry accumulates body oils, lotion, and dirt. Clean them gently in warm soapy water with a soft toothbrush to ensure an accurate raw weight reading.</li>
  <li><strong>Check Today's Live Rates:</strong> Gold rates fluctuate constantly. Check the daily LKR rate per gram for your specific karat on the live calculator widget of the GBC website.</li>
  <li><strong>Prepare Required Legal Documentation:</strong> To comply with Sri Lankan financial regulations, anti-money laundering laws, and police guidelines, you must present a valid government-issued photo identification (such as your <strong>National Identity Card (NIC)</strong>, driving license, or passport).</li>
  <li><strong>Insist on an Itemized Computer Receipt:</strong> Review the printed, computerized transaction receipt before accepting payment. It should clearly show the gross weight, gemstone deductions, net gold weight, XRF purity percentage, the daily rate per gram, and the final payout with zero hidden fees.</li>
</ol>

<p>By sticking to these professional guidelines, Sri Lankan gold owners can easily bypass industry scams, protect their valuable family heritage, and secure payouts that represent the true global market value of their gold, with total convenience and complete peace of mind.</p>
    `;
  }

  const defaultBlogs: BlogPost[] = articleConfigs.map((cfg) => ({
    id: cfg.id,
    slug: cfg.slug,
    title: cfg.title,
    content: injectSEOAndAuthorityLinks(generateDetailedHtmlContent(cfg), cfg.slug),
    author: cfg.author,
    date: cfg.date,
    category: cfg.category,
    tags: cfg.tags,
    metaTitle: cfg.metaTitle,
    metaDescription: cfg.metaDescription,
    questions: cfg.questions,
    isPublished: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * (parseInt(cfg.id.replace("blog_u", "")) * 3)).toISOString()
  }));

  // Generate mock historical gold rates for charts (last 12 months)
  const defaultHistoricalRates: HistoricalRate[] = Array.from({ length: 12 }, (_, i) => {
    const monthsAgo = 11 - i;
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    const monthYear = date.toLocaleString("en-US", { month: "short", year: "numeric" });
    
    // Slight fluctuations
    const multiplier = 1 + (Math.sin(i * 0.5) * 0.04) + (i * 0.01);
    return {
      date: monthYear,
      "24K": Math.round(23000 * multiplier),
      "22K": Math.round(21080 * multiplier),
      "21K": Math.round(20120 * multiplier),
      "18K": Math.round(17250 * multiplier),
    };
  });

  const emptyDb: DatabaseSchema = {
    rates: defaultRates,
    settings: defaultSettings,
    leads: defaultLeads,
    blogs: defaultBlogs,
    historicalRates: defaultHistoricalRates,
  };

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(emptyDb, null, 2), "utf-8");
    return emptyDb;
  }

  try {
    const fileContent = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(fileContent);
    // Deep check to ensure keys exist, fallback if corrupted
    if (parsed.rates && parsed.settings && parsed.leads && parsed.blogs && parsed.historicalRates) {
      return parsed;
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(emptyDb, null, 2), "utf-8");
    return emptyDb;
  } catch (e) {
    fs.writeFileSync(DB_FILE, JSON.stringify(emptyDb, null, 2), "utf-8");
    return emptyDb;
  }
}

export function readDb(): DatabaseSchema {
  return initializeDb();
}

export function writeDb(data: DatabaseSchema): void {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}
