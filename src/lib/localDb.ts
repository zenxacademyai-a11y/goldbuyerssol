import { GoldRate, SystemSettings, CustomerLead, BlogPost, HistoricalRate, GoldKarat } from "../types.js";

const memoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && typeof window.localStorage !== "undefined" && window.localStorage !== null) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // ignore restricted mode / sandbox errors
    }
    return memoryStore[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && typeof window.localStorage !== "undefined" && window.localStorage !== null) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // ignore restricted mode / sandbox errors
    }
    memoryStore[key] = value;
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && typeof window.localStorage !== "undefined" && window.localStorage !== null) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // ignore restricted mode / sandbox errors
    }
    delete memoryStore[key];
  }
};

const DEFAULT_RATES: GoldRate[] = [
  { karat: GoldKarat.K24, purity: 0.999, ratePerGram: 25500 },
  { karat: GoldKarat.K22, purity: 0.916, ratePerGram: 23380 },
  { karat: GoldKarat.K21, purity: 0.875, ratePerGram: 22310 },
  { karat: GoldKarat.K18, purity: 0.750, ratePerGram: 19125 },
];

const DEFAULT_SETTINGS: SystemSettings = {
  bonusPremiumRate: 2.5,
  testingFeePerGram: 150,
  pavanWeightGrams: 8,
  lastUpdated: new Date().toISOString(),
};

const DEFAULT_HISTORICAL: HistoricalRate[] = [
  { date: "2024-05-01", "24K": 29500, "22K": 27100, "21K": 26000 },
  { date: "2024-05-05", "24K": 29800, "22K": 27300, "21K": 26200 },
  { date: "2024-05-10", "24K": 30100, "22K": 27600, "21K": 26500 },
  { date: "2024-05-15", "24K": 30500, "22K": 28000, "21K": 26800 },
  { date: "2024-05-20", "24K": 30900, "22K": 28300, "21K": 27100 },
  { date: "2024-05-25", "24K": 31250, "22K": 28650, "21K": 27350 },
];

export const localDb = {
  get: (key: string, defaultValue: any) => {
    try {
      const item = safeStorage.getItem(`gbc_${key}`);
      if (item) return JSON.parse(item);
    } catch {
      // Safe fallback without uncaught exceptions
    }
    return defaultValue;
  },
  set: (key: string, value: any) => {
    try {
      safeStorage.setItem(`gbc_${key}`, JSON.stringify(value));
    } catch {
      // Safe fallback without uncaught exceptions
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
