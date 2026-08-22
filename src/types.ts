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
  createdAt?: string;
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

export interface CategoryItem {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  post_count?: number;
  created_at?: string;
}

export interface TagItem {
  id: number | string;
  name: string;
  slug: string;
  post_count?: number;
  created_at?: string;
}

export interface MediaItem {
  id: string;
  fileName: string;
  url: string;
  originalKb: number;
  compressedKb: number;
  width: number;
  height: number;
  alt_text?: string;
  uploadDate: string;
}

export interface CommentItem {
  id: number | string;
  post_id: number | string;
  post_title?: string;
  post_slug?: string;
  author_name: string;
  author_email: string;
  content: string;
  status: "approved" | "pending" | "spam" | "trash";
  ip_address?: string;
  created_at: string;
}

export interface UserItem {
  id: number | string;
  user_uuid?: string;
  name: string;
  email: string;
  role: "super_admin" | "editor" | "author" | "contributor";
  avatar?: string;
  bio?: string;
  status?: string;
  last_login_at?: string;
  post_count?: number;
  created_at?: string;
}

export interface AuditLogItem {
  id: number;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: number | null;
  ip_address: string;
  created_at: string;
  payload?: any;
}

export interface CmsSettings {
  site_name?: string;
  site_tagline?: string;
  admin_email?: string;
  default_author?: string;
  posts_per_page?: string;
  enable_comments?: string;
  auto_approve_comments?: string;
  google_analytics_id?: string;
  default_meta_description?: string;
  [key: string]: string | undefined;
}

