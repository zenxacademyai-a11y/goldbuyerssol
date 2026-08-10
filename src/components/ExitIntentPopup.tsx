/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, Smartphone, X, Sparkles, CheckCircle, Share, PlusSquare, ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import { Language } from "../lib/translations.js";

interface ExitIntentPopupProps {
  currentLang: Language;
}

const popupTranslations = {
  en: {
    badge: "INSTANT GBC APP & VALUATION",
    title: "Install Gold Buyers Colombo App",
    subtitle: "Get instant live gold rates, offline pawn rate calculator, and instant valuation right on your smartphone.",
    installBtn: "Install Web App",
    whatsappBtn: "WhatsApp Valuation",
    iosTitle: "How to Install on iPhone / iPad",
    iosStep1: "Tap the Share button at the bottom of Safari",
    iosStep2: "Scroll down and tap 'Add to Home Screen'",
    iosStep3: "Tap 'Add' in the top right corner to finish",
    feature1: "Instant 24/7 Live Pawn Rates",
    feature2: "Fast Cash Valuation Booking",
    close: "Close",
    dismissText: "No thanks, continue to website"
  },
  si: {
    badge: "GBC ඇප් එක සහ සජීවී තක්සේරුව",
    title: "Gold Buyers Colombo ඇප් එක install කරගන්න",
    subtitle: "කොළඹ සජීවී රන් මිල, උකස් ගණකය සහ ක්ෂණික තක්සේරුව ඔබගේ දුරකථනයටම ලබාගන්න.",
    installBtn: "ඇප් එක ස්ථාපනය කරන්න",
    whatsappBtn: "WhatsApp තක්සේරුව",
    iosTitle: "iPhone / iPad වල Install කරන ආකාරය",
    iosStep1: "Safari හි පහළ ඇති Share බොත්තම ඔබන්න",
    iosStep2: "'Add to Home Screen' මත තෝරන්න",
    iosStep3: "දකුණු පස ඉහළ ඇති 'Add' මත ඔබන්න",
    feature1: "සජීවී රන් සහ උකස් මිල ගණන්",
    feature2: "ක්ෂණික මුදල් තක්සේරු සේවාව",
    close: "වසා දමන්න",
    dismissText: "පසුව බලන්න"
  },
  ta: {
    badge: "GBC செயலி மற்றும் உடனடி மதிப்பீடு",
    title: "Gold Buyers Colombo செயலியை நிறுவவும்",
    subtitle: "கொழும்பு தங்க விலையின் உடனடி அறிவிப்புகள் மற்றும் அடகு மதிப்பீட்டை உங்கள் மொபைலில் பெறவும்.",
    installBtn: "செயலியை நிறுவவும்",
    whatsappBtn: "WhatsApp மதிப்பீடு",
    iosTitle: "iPhone / iPad இல் நிறுவுவது எப்படி",
    iosStep1: "Safari இன் கீழே உள்ள Share பொத்தானைத் தட்டவும்",
    iosStep2: "'Add to Home Screen' என்பதைத் தேர்ந்தெடுக்கவும்",
    iosStep3: "மேல் வலது மூலையில் உள்ள 'Add' என்பதைக் கிளிக் செய்யவும்",
    feature1: "நேரலை தங்க மற்றும் அடகு விலைகள்",
    feature2: "உடனடி பண மதிப்பீட்டு சேவை",
    close: "மூடுக",
    dismissText: "பிறகு பார்க்கவும்"
  }
};

export default function ExitIntentPopup({ currentLang }: ExitIntentPopupProps) {
  return null;
}

