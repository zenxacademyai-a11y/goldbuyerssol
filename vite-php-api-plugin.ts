/**
 * Vite Dev Server Plugin: PHP REST API & MySQL Emulator
 * Provides real-time API responses for development without running a custom Node server.
 * Implements the exact same JSON format and business rules as the PHP REST API backend.
 * Zero localStorage usage - all state is maintained server-side.
 */

import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';

interface GoldRateItem {
  karat: string;
  purity: number;
  ratePerGram: number;
  currency: string;
  updatedAt?: string;
}

interface SystemSettingsData {
  bonusPremiumRate: number;
  testingFeePerGram: number;
  pavanWeightGrams: number;
  crmBusinessName: string;
  crmPhone: string;
  crmWhatsApp: string;
  lastUpdated: string;
}

interface LeadItem {
  id: number;
  lead_uuid: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string | null;
  phone: string;
  source: string;
  status: string;
  rating: string;
  gold_weight: number | null;
  karat_interest: string;
  notes: string | null;
  assigned_to: number;
  created_at: string;
}

function getInitialStore() {
  return {
    rates: [
      { karat: "24K", purity: 0.999, ratePerGram: 25500, currency: "LKR", updatedAt: new Date().toISOString() },
      { karat: "22K", purity: 0.916, ratePerGram: 23380, currency: "LKR", updatedAt: new Date().toISOString() },
      { karat: "21K", purity: 0.875, ratePerGram: 22310, currency: "LKR", updatedAt: new Date().toISOString() },
      { karat: "18K", purity: 0.750, ratePerGram: 19125, currency: "LKR", updatedAt: new Date().toISOString() }
    ] as GoldRateItem[],
    settings: {
      bonusPremiumRate: 2.5,
      testingFeePerGram: 0,
      pavanWeightGrams: 8,
      crmBusinessName: "Gold Buyers Colombo (Pvt) Ltd",
      crmPhone: "+94 11 234 5678",
      crmWhatsApp: "+94 77 123 4567",
      lastUpdated: new Date().toISOString()
    } as SystemSettingsData,
    historical: [
      { date: "2026-05-01", "24K": 24200, "22K": 22180, "21K": 21100, "18K": 18150, pavan: 177440 },
      { date: "2026-05-08", "24K": 24550, "22K": 22500, "21K": 21450, "18K": 18400, pavan: 180000 },
      { date: "2026-05-15", "24K": 24900, "22K": 22800, "21K": 21780, "18K": 18675, pavan: 182400 },
      { date: "2026-05-22", "24K": 25200, "22K": 23100, "21K": 22050, "18K": 18900, pavan: 184800 },
      { date: "2026-05-29", "24K": 25500, "22K": 23380, "21K": 22310, "18K": 19125, pavan: 187040 }
    ],
    leads: [
      {
        id: 1,
        lead_uuid: "lead_1001_initial",
        first_name: "Dinesh",
        last_name: "Perera",
        name: "Dinesh Perera",
        email: "dinesh.p@gmail.com",
        phone: "+94772345678",
        source: "website",
        status: "new",
        rating: "hot",
        gold_weight: 24.5,
        karat_interest: "22K",
        notes: "Selling 3 sovereign bangles. Needs instant bank transfer.",
        assigned_to: 1,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 2,
        lead_uuid: "lead_1002_initial",
        first_name: "Kavinda",
        last_name: "Silva",
        name: "Kavinda Silva",
        email: "kavinda.silva@yahoo.com",
        phone: "+94719876543",
        source: "WhatsApp",
        status: "contacted",
        rating: "warm",
        gold_weight: 16.0,
        karat_interest: "24K",
        notes: "Has 2 gold coins. Requested current live rate valuation.",
        assigned_to: 2,
        created_at: new Date(Date.now() - 3600000 * 6).toISOString()
      }
    ] as LeadItem[],
    webhook_logs: [
      {
        id: 1,
        event_type: "lead.created",
        request_body: JSON.stringify({ name: "Dinesh Perera", phone: "+94772345678", source: "website" }),
        response_status: 200,
        response_body: JSON.stringify({ success: true, lead_id: 1 }),
        ip_address: "127.0.0.1",
        created_at: new Date().toISOString()
      }
    ]
  };
}

let memoryStore: any = null;

function loadStore() {
  if (!memoryStore) {
    memoryStore = getInitialStore();
  }
  return memoryStore;
}

function saveStore(data: unknown) {
  memoryStore = data;
}

export function phpApiEmulatorPlugin(): Plugin {
  return {
    name: 'vite-php-api-emulator',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] || '';
        const method = req.method || 'GET';

        // Only handle /api/ endpoints
        if (!url.startsWith('/api/')) {
          return next();
        }

        // Helper to send JSON
        const sendJson = (statusCode: number, data: unknown) => {
          res.setHeader('Content-Type', 'application/json; charset=UTF-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Webhook-Secret');
          res.statusCode = statusCode;
          res.end(JSON.stringify(data));
        };

        if (method === 'OPTIONS') {
          return sendJson(200, { success: true });
        }

        // Parse body if present
        let body: any = null;
        if (['POST', 'PUT', 'DELETE'].includes(method)) {
          try {
            const buffers: Buffer[] = [];
            for await (const chunk of req) {
              buffers.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            const rawBody = Buffer.concat(buffers).toString('utf-8');
            if (rawBody) {
              body = JSON.parse(rawBody);
            }
          } catch {
            body = null;
          }
        }

        const store = loadStore();

        // 1. GET /api/get-gold-rates.php or /api/rates
        if ((url === '/api/get-gold-rates.php' || url === '/api/rates') && method === 'GET') {
          return sendJson(200, {
            success: true,
            message: "Live gold rates retrieved successfully from MySQL",
            data: {
              rates: store.rates,
              settings: store.settings,
              historical: store.historical,
              serverTime: new Date().toISOString()
            },
            rates: store.rates,
            settings: store.settings,
            historical: store.historical,
            lastUpdated: store.settings?.lastUpdated
          });
        }

        // 2. POST /api/get-gold-rates.php or /api/rates
        if ((url === '/api/get-gold-rates.php' || url === '/api/rates') && (method === 'POST' || method === 'PUT')) {
          if (body?.rates && Array.isArray(body.rates)) {
            store.rates = body.rates.map((r: any) => ({
              karat: String(r.karat),
              purity: Number(r.purity),
              ratePerGram: Number(r.ratePerGram || r.rate_per_gram),
              currency: String(r.currency || 'LKR'),
              updatedAt: new Date().toISOString()
            }));

            // Also update historical chart with new 22K rate
            const r22 = store.rates.find((r: any) => r.karat === '22K')?.ratePerGram;
            const r24 = store.rates.find((r: any) => r.karat === '24K')?.ratePerGram;
            if (r22 && r24) {
              const todayStr = new Date().toISOString().split('T')[0];
              const existingIdx = store.historical.findIndex((h: any) => h.date === todayStr);
              const point = {
                date: todayStr,
                "24K": r24,
                "22K": r22,
                "21K": Math.round(r24 * 0.875),
                "18K": Math.round(r24 * 0.75),
                pavan: Math.round(r22 * 8)
              };
              if (existingIdx >= 0) {
                store.historical[existingIdx] = point;
              } else {
                store.historical.push(point);
              }
            }
          }

          if (body?.settings) {
            store.settings = {
              ...store.settings,
              ...body.settings,
              lastUpdated: new Date().toISOString()
            };
          }

          saveStore(store);
          return sendJson(200, {
            success: true,
            message: "Gold rates and settings successfully saved to MySQL database",
            data: { savedAt: new Date().toISOString() }
          });
        }

        // 3. GET /api/rates/history
        if (url === '/api/rates/history' && method === 'GET') {
          return sendJson(200, {
            success: true,
            message: "Historical rates retrieved from MySQL",
            data: store.historical
          });
        }

        // 4. GET /api/leads
        if (url === '/api/leads' && method === 'GET') {
          return sendJson(200, {
            success: true,
            message: "Leads retrieved from MySQL",
            data: store.leads
          });
        }

        // 5. POST /api/leads
        if (url === '/api/leads' && method === 'POST') {
          const newLead: LeadItem = {
            id: Date.now(),
            lead_uuid: `lead_${Date.now()}`,
            first_name: body?.first_name || (body?.name ? body.name.split(' ')[0] : 'Inquiry'),
            last_name: body?.last_name || (body?.name ? body.name.split(' ').slice(1).join(' ') : ''),
            name: body?.name || `${body?.first_name || ''} ${body?.last_name || ''}`.trim(),
            email: body?.email || null,
            phone: body?.phone || '',
            source: body?.source || 'website',
            status: body?.status || 'new',
            rating: body?.rating || 'warm',
            gold_weight: body?.weightGrams ? Number(body.weightGrams) : null,
            karat_interest: body?.karat || '22K',
            notes: body?.notes || body?.message || null,
            assigned_to: 1,
            created_at: new Date().toISOString()
          };
          store.leads.unshift(newLead);
          saveStore(store);
          return sendJson(201, {
            success: true,
            message: "Lead successfully created in MySQL",
            data: newLead
          });
        }

        // 6. DELETE /api/leads
        if (url === '/api/leads' && method === 'DELETE') {
          const id = Number(new URL(req.url || '', 'http://localhost').searchParams.get('id') || body?.id);
          store.leads = store.leads.filter((l: any) => l.id !== id);
          saveStore(store);
          return sendJson(200, {
            success: true,
            message: "Lead successfully removed from MySQL database",
            data: { id }
          });
        }

        // 7. POST /api/webhooks/leads (Serverless Inbound Webhook)
        if (url === '/api/webhooks/leads' && method === 'POST') {
          const secret = req.headers['x-webhook-secret'] || '';
          if (secret !== 'gbc_sec_99a8b7c6d5e4f3a2b1c0d9e8f7') {
            return sendJson(401, {
              success: false,
              message: "Unauthorized: Invalid or missing X-Webhook-Secret header.",
              error: { code: "WEBHOOK_SECRET_INVALID" }
            });
          }

          const newLead: LeadItem = {
            id: Date.now(),
            lead_uuid: `lead_wh_${Date.now()}`,
            first_name: body?.first_name || (body?.name ? body.name.split(' ')[0] : 'Webhook'),
            last_name: body?.last_name || '',
            name: body?.name || 'Webhook Lead',
            email: body?.email || null,
            phone: body?.phone || '+94770000000',
            source: body?.source || 'webhook',
            status: 'new',
            rating: 'hot',
            gold_weight: body?.weightGrams ? Number(body.weightGrams) : null,
            karat_interest: body?.karat || '22K',
            notes: `[Serverless Webhook] ${body?.notes || body?.message || 'Captured automatically via API'}`,
            assigned_to: 1,
            created_at: new Date().toISOString()
          };

          store.leads.unshift(newLead);
          store.webhook_logs.unshift({
            id: Date.now(),
            event_type: "lead.capture",
            request_body: JSON.stringify(body),
            response_status: 200,
            response_body: JSON.stringify({ success: true, lead_id: newLead.id }),
            ip_address: req.socket.remoteAddress || "127.0.0.1",
            created_at: new Date().toISOString()
          });

          saveStore(store);
          return sendJson(200, {
            success: true,
            message: "Lead created successfully in MySQL database via Serverless Webhook",
            lead_id: newLead.id
          });
        }

        // 8. GET /api/webhooks/logs
        if (url === '/api/webhooks/logs' && method === 'GET') {
          return sendJson(200, {
            success: true,
            message: "Webhook audit logs retrieved from MySQL",
            data: store.webhook_logs
          });
        }

        // 9. GET /api/analytics/dashboard
        if (url === '/api/analytics/dashboard' && method === 'GET') {
          const totalLeads = store.leads.length;
          const newLeads = store.leads.filter((l: any) => l.status === 'new').length;
          const qualifiedLeads = store.leads.filter((l: any) => l.status === 'qualified').length;
          const wonDeals = 4;
          const revenue = 18500000;
          return sendJson(200, {
            success: true,
            message: "CRM analytics computed from MySQL",
            data: {
              kpis: {
                totalLeads,
                newLeads,
                qualifiedLeads,
                openDeals: 6,
                wonDeals,
                revenue,
                conversionRate: totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100) : 0,
                goldWeightGrams: 345.8
              },
              leadsBySource: [
                { source: "website", count: store.leads.filter((l: any) => l.source === 'website').length },
                { source: "WhatsApp", count: store.leads.filter((l: any) => l.source === 'WhatsApp').length },
                { source: "webhook", count: store.leads.filter((l: any) => l.source === 'webhook').length }
              ],
              timestamp: new Date().toISOString()
            }
          });
        }

        // 10. GET /api/db/test (phpMyAdmin & MySQL Health Diagnostic)
        if ((url === '/api/db/test' || url === '/api/health') && method === 'GET') {
          return sendJson(200, {
            success: true,
            message: "MySQL database connection verified and healthy",
            data: {
              status: "connected",
              driver: "PDO_MYSQL",
              host: "localhost",
              database: "crm_database",
              charset: "utf8mb4",
              latency_ms: 1.4,
              tables: [
                { name: "users", rows: 2, status: "OK" },
                { name: "gold_rates", rows: store.rates.length, status: "OK" },
                { name: "rate_history", rows: store.historical.length, status: "OK" },
                { name: "system_settings", rows: 8, status: "OK" },
                { name: "leads", rows: store.leads.length, status: "OK" },
                { name: "pipelines", rows: 1, status: "OK" },
                { name: "pipeline_stages", rows: 7, status: "OK" },
                { name: "deals", rows: 10, status: "OK" },
                { name: "tasks", rows: 5, status: "OK" },
                { name: "activities", rows: 14, status: "OK" },
                { name: "webhook_integrations", rows: 1, status: "OK" },
                { name: "webhook_logs", rows: store.webhook_logs.length, status: "OK" },
                { name: "audit_logs", rows: 28, status: "OK" }
              ],
              phpmyadmin_import_ready: true,
              schema_path: "/database/schema.sql",
              timestamp: new Date().toISOString()
            }
          });
        }

        // Default: 404
        return sendJson(404, {
          success: false,
          message: `Endpoint ${url} not found on PHP REST API`,
          error: { code: "NOT_FOUND" }
        });
      });
    }
  };
}
