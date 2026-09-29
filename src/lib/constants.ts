import { GoldKarat, GoldRate, SystemSettings, HistoricalRate, CustomerLead } from "../types.js";

/**
 * Clean initial default state objects for React rendering before MySQL API response loads.
 * Stored purely in memory during runtime with zero localStorage or client-side disk persistence.
 */
export const DEFAULT_RATES: GoldRate[] = [
  { karat: GoldKarat.K24, purity: 0.999, ratePerGram: 25600 },
  { karat: GoldKarat.K22, purity: 0.916, ratePerGram: 23450 },
  { karat: GoldKarat.K21, purity: 0.875, ratePerGram: 22400 },
  { karat: GoldKarat.K18, purity: 0.750, ratePerGram: 19200 },
];

export const DEFAULT_SETTINGS: SystemSettings = {
  bonusPremiumRate: 2.5,
  testingFeePerGram: 0,
  pavanWeightGrams: 8.0,
  lastUpdated: new Date().toISOString(),
};

export const DEFAULT_HISTORICAL: HistoricalRate[] = [
  { date: "2026-05-01", "24K": 24800, "22K": 22700, "21K": 21700, "18K": 18600, pavan: 181600 },
  { date: "2026-05-08", "24K": 25000, "22K": 22900, "21K": 21875, "18K": 18750, pavan: 183200 },
  { date: "2026-05-15", "24K": 25250, "22K": 23150, "21K": 22100, "18K": 18940, pavan: 185200 },
  { date: "2026-05-22", "24K": 25400, "22K": 23300, "21K": 22225, "18K": 19050, pavan: 186400 },
  { date: "2026-05-29", "24K": 25600, "22K": 23450, "21K": 22400, "18K": 19200, pavan: 187600 },
];

export const DEFAULT_LEADS: CustomerLead[] = [];
