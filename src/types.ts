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
  purity: number; // e.g., 0.999, 0.916, 0.875, 0.750
  ratePerGram: number; // LKR per gram
}

export interface SystemSettings {
  lastUpdated: string;
  pavanWeightGrams: number; // Standard 8g in Sri Lanka
  bonusPremiumRate: number; // GBC bonus cash rate % (e.g. +2%)
  testingFeePerGram: number; // Deductions for gold melt/test (e.g. 150 LKR)
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

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  createdAt: string;
  excerpt?: string;
  image?: string;
  status?: "draft" | "published" | "scheduled" | "archived" | string;
  canonicalUrl?: string;
  focusKeyword?: string;
  isFeatured?: boolean;
  readTime?: string;
  // Optional SEO & EEAT properties
  theme?: string;
  localizedPointers?: string[];
  technicalContext?: string;
  questions?: { q: string; a: string }[];
}

export interface HistoricalRate {
  date: string;
  "24K": number;
  "22K": number;
  "21K": number;
}
