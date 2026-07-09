import { GoldRate, SystemSettings, CustomerLead, BlogPost, HistoricalRate, GoldKarat } from "../types.js";

const DEFAULT_RATES: GoldRate[] = [
  { karat: GoldKarat.K24, purity: 0.999, ratePerGram: 31250 },
  { karat: GoldKarat.K22, purity: 0.916, ratePerGram: 28650 },
  { karat: GoldKarat.K21, purity: 0.875, ratePerGram: 27350 },
  { karat: GoldKarat.K18, purity: 0.75, ratePerGram: 23450 },
];

const DEFAULT_SETTINGS: SystemSettings = {
  bonusPremiumRate: 2.5,
  testingFeePerGram: 150,
  pavanWeightGrams: 8,
  lastUpdated: new Date().toISOString(),
};

const DEFAULT_HISTORICAL: HistoricalRate[] = [
  { date: "2024-05-01", "24K": 29500, "22K": 27100, "21K": 26000, "18K": 22000 },
  { date: "2024-05-05", "24K": 29800, "22K": 27300, "21K": 26200, "18K": 22100 },
  { date: "2024-05-10", "24K": 30100, "22K": 27600, "21K": 26500, "18K": 22400 },
  { date: "2024-05-15", "24K": 30500, "22K": 28000, "21K": 26800, "18K": 22800 },
  { date: "2024-05-20", "24K": 30900, "22K": 28300, "21K": 27100, "18K": 23100 },
  { date: "2024-05-25", "24K": 31250, "22K": 28650, "21K": 27350, "18K": 23450 },
];

export const localDb = {
  get: (key: string, defaultValue: any) => {
    try {
      const item = localStorage.getItem(`gbc_${key}`);
      if (item) return JSON.parse(item);
    } catch (e) {
      console.warn("localStorage error", e);
    }
    return defaultValue;
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(`gbc_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn("localStorage error", e);
    }
  }
};

export const fetchFallbackData = () => {
  return {
    rates: localDb.get("rates", DEFAULT_RATES),
    settings: localDb.get("settings", DEFAULT_SETTINGS),
    leads: localDb.get("leads", []),
    blogs: localDb.get("blogs", []),
    historical: localDb.get("historical", DEFAULT_HISTORICAL),
  };
};
