/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum GoldKarat {
  K24 = "24K",
  K22 = "22K",
  K21 = "21K",
  K18 = "18K",
  CUSTOM = "Custom",
}

export interface GoldRate {
  karat: GoldKarat;
  purity: number; // e.g. 0.916 for 22K
  ratePerGram: number; // In LKR
}

export interface SystemSettings {
  bonusPremiumRate: number; // e.g. 2.5% bonus
  testingFeePerGram: number; // 0 for free testing
  pavanWeightGrams: number; // typically 8.0 grams
  lastUpdated: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  goldKarat: GoldKarat;
  weightGrams: number;
  estimatedValue: number;
  status: "New" | "Contacted" | "Completed" | "Spam";
  message?: string;
  createdAt: string;
}

export type CustomerLead = Lead;

export interface HistoricalRate {
  date: string;
  "24K": number;
  "22K": number;
  "21K": number;
  "18K"?: number;
  pavan?: number;
}
