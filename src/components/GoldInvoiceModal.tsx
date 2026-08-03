/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  X, 
  Download, 
  Printer, 
  MessageCircle, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  QrCode, 
  Sparkles,
  FileText,
  User,
  Calendar,
  Clock,
  Award
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Language } from "../lib/translations.js";
import { GoldKarat } from "../types.js";

interface GoldInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  karat: GoldKarat;
  weight: number;
  unit: "grams" | "pavans";
  weightInGrams: number;
  ratePerGram: number;
  marketValue: number;
  makingCharges: number;
  finalPayout: number;
}

export default function GoldInvoiceModal({
  isOpen,
  onClose,
  currentLang,
  karat,
  weight,
  unit,
  weightInGrams,
  ratePerGram,
  marketValue,
  makingCharges,
  finalPayout,
}: GoldInvoiceModalProps) {
  if (!isOpen) return null;

  // Invoice form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [branch, setBranch] = useState("Nugegoda Head Office (68 S. De S. Jayasinghe Mawatha)");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  // Generate unique invoice number & timestamp once per modal session
  const [invoiceDetails] = useState(() => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return {
      invoiceNo: `GBC-VAL-2026-${randomId}`,
      date: dateStr,
      time: timeStr,
    };
  });

  const invoiceRef = useRef<HTMLDivElement>(null);

  // Pavans calculation
  const pavanValue = (weightInGrams / 8).toFixed(2);

  // Download PDF Handler
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    try {
      setIsGeneratingPdf(true);
      
      // Target element
      const element = invoiceRef.current;
      
      // Capture at high resolution scale
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      
      pdf.save(`GBC-Gold-Valuation-Invoice-${invoiceDetails.invoiceNo}.pdf`);
      
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. You can also click 'Print Invoice' to print or save as PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // WhatsApp share
  const waMessage = encodeURIComponent(
    `Hi GBC Colombo! Here is my Gold Valuation Invoice #${invoiceDetails.invoiceNo}:
- Name: ${customerName || "Valued Client"}
- Karat: ${karat}
- Weight: ${weightInGrams.toFixed(2)}g (${pavanValue} Pavans)
- Estimated Payout: LKR ${Math.round(finalPayout).toLocaleString()}
- Date: ${invoiceDetails.date}

I would like to book an appointment for instant cash payout.`
  );
  const whatsappUrl = `https://wa.me/94718321321?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
      
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        
        {/* Top Modal Navigation Header (Hidden during Print) */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 bg-neutral-950 border-b border-neutral-800 text-white shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                Official Gold Valuation Invoice & Voucher
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                Invoice ID: <span className="text-amber-400 font-bold">{invoiceDetails.invoiceNo}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Inputs for Optional Customer Details (Hidden on print) */}
        <div className="bg-neutral-900/90 border-b border-neutral-800 px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3 text-xs text-white shrink-0 print:hidden">
          <div className="flex items-center gap-1.5 min-w-[180px] flex-1">
            <User className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <input
              type="text"
              placeholder="Customer Name (Optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-750 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 min-w-[160px] flex-1">
            <Phone className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <input
              type="text"
              placeholder="Contact No (Optional)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-750 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 min-w-[200px] flex-1">
            <Building2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-750 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Nugegoda Head Office (68 S. De S. Jayasinghe Mawatha)">Nugegoda Head Office (68 S. De S. Jayasinghe Mawatha)</option>
              <option value="Kandy Branch (Peradeniya Rd)">Kandy Branch (Peradeniya Rd)</option>
              <option value="Galle Branch (Main St)">Galle Branch (Main St)</option>
              <option value="Negombo Branch (Colombo Rd)">Negombo Branch (Colombo Rd)</option>
              <option value="Jaffna Branch (Hospital Rd)">Jaffna Branch (Hospital Rd)</option>
            </select>
          </div>
        </div>

        {/* Printable/PDF Certificate Paper Container */}
        <div className="overflow-y-auto p-3 sm:p-6 bg-neutral-950 print:bg-white print:p-0 print:overflow-visible">
          
          <div
            ref={invoiceRef}
            id="gbc-invoice-certificate"
            className="w-full max-w-[800px] mx-auto bg-white text-neutral-900 p-6 sm:p-10 rounded-xl shadow-xl border border-neutral-200 font-sans print:shadow-none print:border-none print:p-6 print:max-w-none"
          >
            {/* Header with Logo */}
            <div className="border-b-2 border-amber-500/80 pb-5 mb-6">
              <div className="flex justify-between items-start gap-4 flex-wrap sm:flex-nowrap">
                
                {/* Logo & Company Title */}
                <div className="flex items-center gap-3.5">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden border-2 border-amber-500 bg-neutral-950 shrink-0 flex items-center justify-center shadow-md">
                    <img
                      src="/gbc-logo-original.png"
                      alt="Gold Buyers Colombo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-serif font-black text-neutral-950 uppercase tracking-tight m-0 leading-tight">
                      GOLD BUYERS COLOMBO
                    </h1>
                    <p className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-wider m-0 mt-0.5">
                      THE PREMIUM GOLD EXCHANGE IN SRI LANKA
                    </p>
                    <p className="text-[10px] text-neutral-500 font-mono m-0 mt-0.5">
                      Govt. Reg # GBC-LK-8831 | Licensed Bullion Exchange & Buyer
                    </p>
                  </div>
                </div>

                {/* Invoice Metadata */}
                <div className="text-left sm:text-right font-mono text-xs">
                  <div className="inline-block bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1 rounded-md font-bold text-xs uppercase mb-1.5">
                    VALUATION INVOICE
                  </div>
                  <p className="m-0 font-bold text-neutral-800">
                    ID: <span className="text-amber-700">{invoiceDetails.invoiceNo}</span>
                  </p>
                  <p className="m-0 text-neutral-600 text-[11px]">
                    Date: {invoiceDetails.date} ({invoiceDetails.time})
                  </p>
                  <p className="m-0 text-emerald-700 text-[10px] font-bold mt-0.5">
                    ★ Live Exchange Rate Applied
                  </p>
                </div>

              </div>
            </div>

            {/* Client & Branch Information Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 border border-neutral-200 rounded-lg p-3.5 mb-6 text-xs">
              <div>
                <p className="text-[10px] font-mono uppercase text-neutral-500 font-bold mb-1">
                  CUSTOMER DETAILS
                </p>
                <p className="font-bold text-neutral-900 m-0">
                  {customerName.trim() || "Valued Client / Gold Owner"}
                </p>
                {customerPhone && (
                  <p className="text-neutral-600 font-mono text-[11px] m-0">
                    Phone: {customerPhone}
                  </p>
                )}
                <p className="text-neutral-500 text-[11px] m-0">
                  Verification: Computerized XRF Spectrometer Assessment
                </p>
              </div>

              <div>
                <p className="text-[10px] font-mono uppercase text-neutral-500 font-bold mb-1">
                  BRANCH & APPRAISER LOCATION
                </p>
                <p className="font-bold text-amber-900 m-0">
                  {branch}
                </p>
                <p className="text-neutral-600 text-[11px] m-0">
                  Desk Hotline: +94 718 321 321
                </p>
                <p className="text-neutral-500 text-[11px] m-0">
                  Status: Payout Quotation Ready
                </p>
              </div>
            </div>

            {/* Gold Item Valuation Table */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 mb-2">
                1. Itemized Gold Payout Breakdown
              </h4>
              
              <div className="overflow-x-auto border border-neutral-300 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-900 text-white font-mono text-[11px] uppercase border-b border-neutral-900">
                      <th className="p-2.5">Item Assessment</th>
                      <th className="p-2.5">Karat</th>
                      <th className="p-2.5 text-right">Weight (g)</th>
                      <th className="p-2.5 text-right">Pavans (8g)</th>
                      <th className="p-2.5 text-right">Rate/Gram</th>
                      <th className="p-2.5 text-right">Gross Value (LKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-neutral-800">
                    <tr>
                      <td className="p-2.5 font-bold">
                        Gold Jewelry / Coin / Scrap Assessment
                      </td>
                      <td className="p-2.5">
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px]">
                          {karat}
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold">
                        {weightInGrams.toFixed(2)} g
                      </td>
                      <td className="p-2.5 text-right font-mono">
                        {pavanValue} pavan
                      </td>
                      <td className="p-2.5 text-right font-mono">
                        LKR {ratePerGram.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-neutral-900">
                        LKR {Math.round(marketValue).toLocaleString()}
                      </td>
                    </tr>

                    {makingCharges > 0 && (
                      <tr className="bg-rose-50/50 text-rose-900">
                        <td colSpan={5} className="p-2.5 italic">
                          Stone / Design / Impurity Deduction
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-rose-700">
                          -LKR {makingCharges.toLocaleString()}
                        </td>
                      </tr>
                    )}

                    <tr className="bg-emerald-50/50">
                      <td colSpan={5} className="p-2.5 text-emerald-800">
                        <span className="font-bold">Computerized XRF Spectrometer Testing Fee</span>
                        <span className="text-[10px] text-emerald-600 block">100% Non-destructive analysis preserving full gold weight</span>
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                        FREE (LKR 0)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Net Payout Box */}
            <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white rounded-xl p-4 sm:p-5 mb-6 border-2 border-amber-500 shadow-md flex flex-wrap justify-between items-center gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-0.5">
                  NET ESTIMATED CASH / BANK PAYOUT
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400 tracking-tight">
                  LKR {Math.round(finalPayout).toLocaleString()}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  (In Words: Sri Lankan Rupees {Math.round(finalPayout).toLocaleString()} Only)
                </span>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg text-amber-300 font-mono text-[11px] font-bold text-right shrink-0">
                <span>IMMEDIATE SETTLEMENT</span>
                <span className="block text-[10px] text-emerald-400">Cash or Wire Transfer</span>
              </div>
            </div>

            {/* Terms & Certification Disclaimer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-neutral-200 pt-4 mb-6 text-[10px] text-neutral-600">
              <div className="sm:col-span-2 space-y-1">
                <p className="font-bold text-neutral-800 m-0 uppercase font-mono">
                  TERMS & GUARANTEE CONDITIONS
                </p>
                <ol className="list-decimal pl-3 space-y-0.5 m-0 text-[10px] leading-tight">
                  <li>This valuation invoice is calculated based on live Colombo bullion exchange rates.</li>
                  <li>Final payment is subject to physical verification and XRF spectrometer testing at any GBC branch.</li>
                  <li>Valid Government National ID (NIC) or Passport is required for instant cash settlement as per Sri Lankan regulations.</li>
                </ol>
              </div>

              {/* Official Stamp & QR Code Representation */}
              <div className="flex flex-col items-center justify-center border border-dashed border-amber-400 bg-amber-50/50 p-2.5 rounded-lg text-center">
                <div className="flex items-center gap-1.5 text-amber-800 font-black text-[11px] mb-1">
                  <ShieldCheck className="h-4 w-4 text-amber-600" />
                  <span>GBC VERIFIED</span>
                </div>
                <div className="h-12 w-12 bg-white border border-neutral-300 rounded p-1 flex items-center justify-center my-0.5 shadow-2xs">
                  <QrCode className="h-10 w-10 text-neutral-800" />
                </div>
                <span className="text-[9px] font-mono text-neutral-500 font-bold">
                  AUTH CODE: {invoiceDetails.invoiceNo}
                </span>
              </div>
            </div>

            {/* Official Footer with Company Information */}
            <div className="border-t-2 border-neutral-900 pt-4 text-center sm:text-left text-[11px] text-neutral-700 font-mono flex flex-wrap justify-between items-center gap-3">
              <div>
                <p className="font-bold text-neutral-950 m-0">
                  GOLD BUYERS COLOMBO (PVT) LTD
                </p>
                <p className="m-0 text-[10px] text-neutral-600">
                  Head Office: 68 S. De S. Jayasinghe Mawatha, Nugegoda 10250, Sri Lanka
                </p>
                <p className="m-0 text-[10px] text-neutral-600">
                  Hotline: +94 718 321 321 | WhatsApp: +94 718 321 321 | Email: info@goldlanka.lk
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="font-bold text-amber-800 m-0 text-[10px]">
                  WWW.GOLDLANKA.LK
                </p>
                <p className="m-0 text-[9px] text-neutral-500">
                  Hours: Mon-Sat 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer Actions (Download PDF / Print / WhatsApp) */}
        <div className="bg-neutral-950 border-t border-neutral-800 px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-3 shrink-0 print:hidden">
          
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Sri Lanka's #1 Rated Gold Buyer</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-neutral-700"
            >
              <Printer className="h-4 w-4" />
              <span>Print Invoice</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 no-underline shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Send to WhatsApp</span>
            </a>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-98 disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <div className="h-4 w-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating PDF...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-neutral-950" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 text-neutral-950" />
                  <span>Download PDF Invoice</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
