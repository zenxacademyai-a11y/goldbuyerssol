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
  Award,
  Receipt,
  Check
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

// Branch location details
export const BRANCH_LOCATIONS = [
  {
    id: "nugegoda",
    name: "Nugegoda Head Office",
    address: "68 S. De S. Jayasinghe Mawatha, Nugegoda 10250",
    city: "Colombo / Nugegoda",
    phone: "+94 718 321 321",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
  },
  {
    id: "kandy",
    name: "Kandy Premier Branch",
    address: "142 Peradeniya Road, Kandy 20000",
    city: "Kandy",
    phone: "+94 812 222 321",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
  },
  {
    id: "galle",
    name: "Galle Fort Branch",
    address: "88 Main Street, Galle 80000",
    city: "Galle",
    phone: "+94 912 233 321",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
  },
  {
    id: "negombo",
    name: "Negombo Coastal Branch",
    address: "215 Colombo Road, Negombo 11500",
    city: "Negombo",
    phone: "+94 312 244 321",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
  },
  {
    id: "jaffna",
    name: "Jaffna Town Branch",
    address: "45 Hospital Road, Jaffna 40000",
    city: "Jaffna",
    phone: "+94 212 255 321",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
  },
];

// Utility: Convert number to English Sri Lankan Rupees in words
function numberToWordsLkr(amount: number): string {
  const num = Math.round(amount);
  if (num === 0) return "Zero Sri Lankan Rupees";

  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convert(n: number): string {
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + units[n % 10] : "");
    if (n < 1000) return units[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convert(n % 1000) : "");
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + convert(n % 10000000) : "");
  }

  return convert(num) + " Sri Lankan Rupees Only";
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
  const [selectedBranchId, setSelectedBranchId] = useState("nugegoda");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  // Get active branch info
  const selectedBranch = BRANCH_LOCATIONS.find((b) => b.id === selectedBranchId) || BRANCH_LOCATIONS[0];

  // Generate unique receipt number & timestamp
  const [invoiceDetails] = useState(() => {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return {
      receiptNo: `GBC-VAL-${randomId}`,
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
      const element = invoiceRef.current;

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

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`GBC-Valuation-Receipt-${invoiceDetails.receiptNo}.pdf`);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Generating PDF... You can also click 'Print Receipt' for a direct print copy.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // WhatsApp share message
  const waMessage = encodeURIComponent(
    `Hi GBC Colombo! Here is my Gold Valuation Receipt #${invoiceDetails.receiptNo}:
- Client: ${customerName || "Valued Client"}
- Branch: ${selectedBranch.name}
- Karat: ${karat}
- Weight: ${weightInGrams.toFixed(2)}g (${pavanValue} Pavans)
- Calculated Gold Payout: LKR ${Math.round(finalPayout).toLocaleString()}
- Date: ${invoiceDetails.date} at ${invoiceDetails.time}

I would like to book an appointment to sell my gold at this estimated payout.`
  );
  const whatsappUrl = `https://wa.me/94718321321?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        
        {/* Top Modal Navigation Header (Hidden during Print) */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 bg-neutral-950 border-b border-neutral-800 text-white shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Gold Valuation Receipt & Voucher</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded uppercase font-bold">
                  Print Ready
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                Voucher ID: <span className="text-amber-400 font-bold">{invoiceDetails.receiptNo}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Customer & Branch Customizer Bar (Hidden during Print) */}
        <div className="bg-neutral-900/90 border-b border-neutral-800 px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3 text-xs text-white shrink-0 print:hidden">
          
          {/* Branch Location Picker */}
          <div className="flex items-center gap-1.5 min-w-[220px] flex-1">
            <Building2 className="h-4 w-4 text-amber-400 shrink-0" />
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
            >
              {BRANCH_LOCATIONS.map((b) => (
                <option key={b.id} value={b.id}>
                  📍 {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          {/* Customer Name */}
          <div className="flex items-center gap-1.5 min-w-[170px] flex-1">
            <User className="h-4 w-4 text-amber-400 shrink-0" />
            <input
              type="text"
              placeholder="Client Name (Optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-750 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Customer Phone */}
          <div className="flex items-center gap-1.5 min-w-[150px] flex-1">
            <Phone className="h-4 w-4 text-amber-400 shrink-0" />
            <input
              type="text"
              placeholder="Contact No (Optional)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-750 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

        </div>

        {/* Printable/PDF Certificate Paper Container */}
        <div className="overflow-y-auto p-3 sm:p-6 bg-neutral-950 print:bg-white print:p-0 print:overflow-visible">
          
          <div
            ref={invoiceRef}
            id="gbc-invoice-certificate"
            className="w-full max-w-[800px] mx-auto bg-white text-neutral-900 p-6 sm:p-10 rounded-xl shadow-xl border-2 border-amber-500/80 font-sans print:shadow-none print:border-2 print:border-amber-600 print:p-6 print:max-w-none"
          >
            
            {/* Header: Logo, Title, Official Govt Registration */}
            <div className="border-b-2 border-amber-500 pb-5 mb-6">
              <div className="flex justify-between items-start gap-4 flex-wrap sm:flex-nowrap">
                
                {/* Logo & Company Title */}
                <div className="flex items-center gap-3.5">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-amber-500 bg-neutral-950 shrink-0 flex items-center justify-center shadow-md">
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
                    <p className="text-[11px] font-mono font-bold text-amber-800 uppercase tracking-wider m-0 mt-0.5">
                      PREMIUM GOLD VALUATION & EXCHANGE RECEIPT
                    </p>
                    <p className="text-[10px] text-neutral-600 font-mono m-0 mt-0.5">
                      Govt. Reg # GBC-LK-8831 | Licensed Bullion Exchange & Buyer
                    </p>
                  </div>
                </div>

                {/* Receipt Metadata */}
                <div className="text-left sm:text-right font-mono text-xs">
                  <div className="inline-block bg-amber-50 border-2 border-amber-400 text-amber-950 px-3 py-1 rounded-md font-extrabold text-xs uppercase mb-1.5 shadow-2xs">
                    OFFICIAL VALUATION RECEIPT
                  </div>
                  <p className="m-0 font-bold text-neutral-900">
                    RECEIPT NO: <span className="text-amber-800 font-extrabold">{invoiceDetails.receiptNo}</span>
                  </p>
                  <p className="m-0 text-neutral-700 text-[11px] font-semibold">
                    DATE: <span className="text-neutral-900 font-bold">{invoiceDetails.date}</span> ({invoiceDetails.time})
                  </p>
                  <p className="m-0 text-emerald-800 text-[10px] font-extrabold mt-0.5 flex items-center justify-start sm:justify-end gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 inline" />
                    Guaranteed Live Market Rate Applied
                  </p>
                </div>

              </div>
            </div>

            {/* Branch Location & Client Details Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/40 border border-amber-300/80 rounded-xl p-4 mb-6 text-xs">
              
              {/* Branch Details */}
              <div className="border-b sm:border-b-0 sm:border-r border-amber-200/80 pb-3 sm:pb-0 sm:pr-4">
                <p className="text-[10px] font-mono uppercase text-amber-900 font-bold tracking-wider mb-1 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-amber-700" />
                  <span>APPRAISER BRANCH LOCATION</span>
                </p>
                <p className="font-extrabold text-neutral-950 text-sm m-0">
                  {selectedBranch.name}
                </p>
                <p className="text-neutral-700 font-semibold m-0 mt-0.5">
                  📍 {selectedBranch.address}
                </p>
                <p className="text-neutral-600 font-mono text-[11px] m-0 mt-0.5">
                  📞 Hotline: {selectedBranch.phone}
                </p>
                <p className="text-neutral-500 text-[10px] m-0 mt-0.5 font-mono">
                  ⏰ Hours: {selectedBranch.hours}
                </p>
              </div>

              {/* Customer / Appraisal Details */}
              <div className="sm:pl-2">
                <p className="text-[10px] font-mono uppercase text-amber-900 font-bold tracking-wider mb-1 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-amber-700" />
                  <span>CLIENT & APPRAISAL SPECIFICATIONS</span>
                </p>
                <p className="font-bold text-neutral-900 m-0 text-xs">
                  Client: <strong className="text-neutral-950">{customerName.trim() || "Valued Customer / Gold Owner"}</strong>
                </p>
                {customerPhone && (
                  <p className="text-neutral-700 font-mono text-[11px] m-0 mt-0.5">
                    Contact Phone: {customerPhone}
                  </p>
                )}
                <p className="text-neutral-700 text-[11px] m-0 mt-0.5">
                  Method: Computerized XRF Spectrometer Non-Destructive Assay
                </p>
                <p className="text-emerald-800 text-[10px] font-bold m-0 mt-0.5">
                  Status: Payout Guaranteed for Same-Day Exchange
                </p>
              </div>

            </div>

            {/* Calculated Gold Value Itemized Table */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-800 mb-2 flex items-center gap-1.5">
                <Receipt className="h-4 w-4 text-amber-700" />
                <span>Summary of Calculated Gold Specifications & Value</span>
              </h4>
              
              <div className="overflow-x-auto border-2 border-neutral-900 rounded-lg shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-950 text-amber-400 font-mono text-[11px] uppercase border-b-2 border-neutral-900">
                      <th className="p-3">Specification / Description</th>
                      <th className="p-3">Gold Karat</th>
                      <th className="p-3 text-right">Measured Weight</th>
                      <th className="p-3 text-right">Pavans (8.0g)</th>
                      <th className="p-3 text-right">Rate / Gram</th>
                      <th className="p-3 text-right">Gross Market Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-neutral-900 font-sans">
                    <tr className="bg-white">
                      <td className="p-3 font-bold">
                        Jewelry / Scrap / Coin Appraisal
                        <span className="block text-[10px] text-neutral-500 font-mono font-normal">
                          Full metal purity non-destructive spectrometer test
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-amber-100 border border-amber-300 text-amber-950 font-extrabold px-2.5 py-1 rounded font-mono text-[11px]">
                          {karat}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-sm text-neutral-950">
                        {weightInGrams.toFixed(2)} g
                      </td>
                      <td className="p-3 text-right font-mono font-semibold">
                        {pavanValue} pavans
                      </td>
                      <td className="p-3 text-right font-mono font-semibold">
                        LKR {ratePerGram.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono font-extrabold text-neutral-950 text-sm">
                        LKR {Math.round(marketValue).toLocaleString()}
                      </td>
                    </tr>

                    {makingCharges > 0 && (
                      <tr className="bg-rose-50/70 text-rose-950">
                        <td colSpan={5} className="p-3 italic font-semibold">
                          Less: Stone / Design / Impurity Deduction
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-rose-700">
                          -LKR {makingCharges.toLocaleString()}
                        </td>
                      </tr>
                    )}

                    <tr className="bg-emerald-50/60">
                      <td colSpan={5} className="p-3 text-emerald-950">
                        <span className="font-extrabold">Computerized XRF Testing & Assay Fee</span>
                        <span className="text-[10px] text-emerald-700 block">Preserves 100% of gold weight without melting or scratching</span>
                      </td>
                      <td className="p-3 text-right font-mono font-extrabold text-emerald-800">
                        FREE (LKR 0)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Calculated Net Payout Hero Box */}
            <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-black text-white rounded-xl p-5 mb-6 border-2 border-amber-500 shadow-md flex flex-wrap justify-between items-center gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-extrabold block mb-1">
                  NET CALCULATED GOLD PAYOUT (ESTIMATE)
                </span>
                <span className="text-3xl sm:text-4xl font-mono font-black text-amber-400 tracking-tight block">
                  LKR {Math.round(finalPayout).toLocaleString()}
                </span>
                <span className="text-[11px] text-amber-200/90 font-mono block mt-1 italic">
                  In Words: {numberToWordsLkr(finalPayout)}
                </span>
              </div>

              <div className="bg-amber-500/10 border-2 border-amber-400/50 px-4 py-2.5 rounded-xl text-amber-300 font-mono text-xs font-bold text-right shrink-0">
                <span className="text-white block font-extrabold uppercase">IMMEDIATE SETTLEMENT</span>
                <span className="block text-[11px] text-emerald-400 font-bold">Direct Cash or Bank Wire</span>
              </div>
            </div>

            {/* Terms, Verification & Appraiser Stamp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t-2 border-neutral-200 pt-4 mb-6 text-[10px] text-neutral-700">
              
              <div className="sm:col-span-2 space-y-1">
                <p className="font-extrabold text-neutral-950 m-0 uppercase font-mono text-[11px]">
                  VALUATION & PAYOUT GUARANTEE TERMS
                </p>
                <ol className="list-decimal pl-4 space-y-1 m-0 text-[10px] leading-relaxed text-neutral-800 font-medium">
                  <li>Valuation is calculated using live Colombo Bullion Exchange market spot rates.</li>
                  <li>Final payout is verified upon physical XRF spectrometer testing at any GBC branch.</li>
                  <li>Valid Government NIC or Passport required for immediate cash disbursement per CBSL guidelines.</li>
                </ol>
              </div>

              {/* Official Stamp Box */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-amber-500/80 bg-amber-50/60 p-3 rounded-xl text-center">
                <div className="flex items-center gap-1.5 text-amber-950 font-black text-[11px] mb-1 uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-amber-600" />
                  <span>GBC VERIFIED SEAL</span>
                </div>
                <div className="h-12 w-12 bg-white border border-neutral-300 rounded p-1 flex items-center justify-center my-0.5 shadow-2xs">
                  <QrCode className="h-10 w-10 text-neutral-900" />
                </div>
                <span className="text-[9px] font-mono text-neutral-600 font-extrabold">
                  AUTH CODE: {invoiceDetails.receiptNo}
                </span>
              </div>

            </div>

            {/* Receipt Footer */}
            <div className="border-t-2 border-neutral-950 pt-4 text-center sm:text-left text-[11px] text-neutral-800 font-mono flex flex-wrap justify-between items-center gap-3">
              <div>
                <p className="font-extrabold text-neutral-950 m-0">
                  GOLD BUYERS COLOMBO (PVT) LTD
                </p>
                <p className="m-0 text-[10px] text-neutral-600">
                  Branch: {selectedBranch.name} • {selectedBranch.address}
                </p>
                <p className="m-0 text-[10px] text-neutral-600">
                  Direct Line: {selectedBranch.phone} | Official Site: www.goldlanka.lk
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="font-extrabold text-amber-800 m-0 text-[11px]">
                  SRI LANKA'S TRUSTED GOLD EXCHANGE
                </p>
                <p className="m-0 text-[9px] text-neutral-500">
                  Generated on {invoiceDetails.date} at {invoiceDetails.time}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer Actions (Download PDF / Print / WhatsApp) */}
        <div className="bg-neutral-950 border-t border-neutral-800 px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-3 shrink-0 print:hidden">
          
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Highest Gold Buying Rates in Sri Lanka</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl hover:from-amber-400 hover:to-yellow-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-98"
            >
              <Printer className="h-4 w-4 text-neutral-950" />
              <span>Print Valuation Receipt</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 no-underline shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Send via WhatsApp</span>
            </a>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-neutral-700 disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <div className="h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating PDF...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 text-amber-400" />
                  <span>Download PDF Receipt</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
