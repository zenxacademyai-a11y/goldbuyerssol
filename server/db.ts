/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { GoldKarat, GoldRate, SystemSettings, Lead, BlogPost, HistoricalRate } from "../src/types.js";

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
    { karat: GoldKarat.K18, purity: 0.750, ratePerGram: 19125 },
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

  const defaultBlogs: BlogPost[] = [
    {
      id: "blog_1",
      slug: "gold-price-trends-sri-lanka-2026",
      title: "Gold Price Trends in Sri Lanka (2026): A Complete Guide for Sellers",
      content: `### Understanding LKR Gold Prices in Colombo

Gold continues to be one of the most resilient assets in Sri Lanka, functioning as both a traditional store of value and a crucial financial backup. As we move through 2026, the local price of gold in Sri Lanka Rupees (LKR) is influenced by international spot rates, exchange rates, and local market demand.

For anyone looking to **sell gold in Colombo**, timing is everything. Currently, 22K gold (traditional jewelry gold) is holding solid ground above LKR 180,000 per pavan (8 grams), while 24K pure gold is trading near LKR 200,000 per pavan.

#### Key Factors Driving Gold Prices in Colombo:
1. **Global Economic Indicators**: Federal Reserve interest rates and geopolitics dictate international USD gold spot rates.
2. **LKR/USD Exchange Rate**: Since gold is imported and priced in USD globally, fluctuations in the Sri Lankan Rupee directly affect domestic jewelry rates.
3. **Wedding and Festival Seasons**: Traditional demand spikes during April (Sinhala & Tamil New Year) and winter wedding months, leading to tighter local spreads.

#### Tips for Selling Your Gold Safely:
* **Check Today's Live Rates**: Never walk into a dealer without checking the daily rate per gram.
* **Understand Purity (Karat)**: 22K gold contains 91.6% pure gold, often hallmarked as '916'.
* **Insist on Transparent Testing**: Professional buyers like **GBC (Gold Buyers Colombo)** use computerized XRF spectrometers to test purity without damaging your jewelry, ensuring you get paid for every single milligram of gold.

If you are looking to get cash for gold, come visit GBC today for complete transparency and the highest payout rates in Colombo!`,
      author: "Samantha Alwis (Chief Valuation Officer, GBC)",
      date: "2026-06-25",
      category: "Gold Price",
      tags: ["Gold Rates", "Sri Lanka", "Selling Gold", "Colombo Gold Prices"],
      metaTitle: "Gold Price Trends Sri Lanka 2026 | Sell Gold in Colombo",
      metaDescription: "Discover gold price trends in Sri Lanka for 2026. Get expert tips on when and how to sell your gold jewelry in Colombo for maximum payout value.",
      isPublished: true,
      createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    },
    {
      id: "blog_2",
      slug: "pawn-vs-selling-gold-colombo",
      title: "Pawn vs. Selling Gold in Sri Lanka: Which is Better?",
      content: `### Making the Right Financial Decision with Your Gold Assets

When facing an urgent need for cash in Sri Lanka, many gold owners struggle with a key question: **Should I pawn my gold or sell it outright?**

While pawning gold (known locally as *Ugas*) is a highly popular option offered by commercial banks and private pawning centers across Colombo, it may not always be the most financially advantageous choice in the long run. Let's compare the two options objectively.

#### 1. Pawning Gold (Ugas)
* **How it works**: You receive a temporary loan against your gold jewelry, with an obligation to pay back the principal plus monthly interest.
* **The Catch**: High monthly interest rates can accumulate rapidly. If you cannot redeem the gold within the agreed period (usually 6 to 12 months), the bank or pawning center will auction your gold, and you lose it forever.
* **Best for**: Very short-term cash needs where you are 100% certain you can pay off the debt and retrieve your jewelry within months.

#### 2. Selling Gold Outright
* **How it works**: You sell your gold directly to a certified gold buyer and receive instant cash.
* **The Advantage**: No debt, no interest payments, and no stress. Given today's historically high gold rates, selling your unused, broken, or scrap jewelry can unlock massive liquid funds that you can invest elsewhere or use to settle high-interest liabilities.
* **Best for**: Jewelry you no longer wear, broken pieces, or when you need permanent capital without recurring debt obligations.

#### Why Choose GBC for Selling Gold?
At **GBC (Gold Buyers Colombo)**, we provide a transparent, professional gold-selling experience that rivals international luxury standards. We offer:
* Instant cash or bank transfer in minutes.
* No hidden deductions or high commissions.
* Computerized testing to guarantee 100% accurate valuation.

Stop letting your unused gold gather dust or burden you with pawning debt. Contact GBC today for a free valuation!`,
      author: "amantha Alwis (Chief Valuation Officer, GBC)",
      date: "2026-06-20",
      category: "Selling Gold",
      tags: ["Pawning Gold", "Selling Gold", "Financial Advice", "Colombo"],
      metaTitle: "Pawn vs Selling Gold in Sri Lanka | Gold Buyers Colombo",
      metaDescription: "Struggling to choose between pawning and selling gold in Sri Lanka? Read our comprehensive comparison of interest rates, payout values, and long-term costs.",
      isPublished: true,
      createdAt: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
    },
  ];

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
