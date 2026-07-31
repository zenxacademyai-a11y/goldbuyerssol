/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  MapPin, 
  Phone, 
  PhoneCall,
  MessageCircle, 
  Search, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Navigation, 
  ChevronRight, 
  ChevronLeft,
  ArrowLeft,
  Clock,
  Car,
  Award,
  Sparkles,
  Zap,
  Lock,
  Image,
  Play,
  Pause,
  Maximize2,
  X,
  Filter
} from "lucide-react";
import { Language } from "../lib/translations.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface BranchesPageProps {
  currentLang: Language;
  selectedBranchId?: string | null;
  onSelectBranch?: (branchId: string | null) => void;
  setView?: (view: any) => void;
}

export interface BranchImage {
  url: string;
  title: string;
  caption: string;
  category: "interior" | "exterior" | "security" | "equipment";
}

export interface BranchBadge {
  label: {
    en: string;
    si: string;
    ta: string;
  };
  iconName?: "map-pin" | "shield-check" | "clock" | "car" | "building" | "sparkles" | "zap" | "check";
  variant?: "amber" | "emerald" | "blue" | "purple" | "neutral";
}

export interface Branch {
  id: string;
  name: {
    en: string;
    si: string;
    ta: string;
  };
  address: {
    en: string;
    si: string;
    ta: string;
  };
  phone: string;
  isFlagship: boolean;
  status: {
    en: string;
    si: string;
    ta: string;
  };
  landmark?: string;
  hours?: string;
  facilities?: string[];
  lat: number;
  lng: number;
  images?: BranchImage[];
  badges?: BranchBadge[];
}

export function BranchBadgePills({ badges, currentLang }: { badges?: BranchBadge[]; currentLang: Language }) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
      {badges.map((badge, idx) => {
        const text = badge.label[currentLang] || badge.label.en;
        
        let icon = <MapPin className="h-3 w-3 text-amber-400 shrink-0" />;
        if (badge.iconName === "shield-check") icon = <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />;
        else if (badge.iconName === "clock") icon = <Clock className="h-3 w-3 text-amber-400 shrink-0" />;
        else if (badge.iconName === "car") icon = <Car className="h-3 w-3 text-blue-400 shrink-0" />;
        else if (badge.iconName === "building") icon = <Building2 className="h-3 w-3 text-purple-400 shrink-0" />;
        else if (badge.iconName === "sparkles") icon = <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />;
        else if (badge.iconName === "zap") icon = <Zap className="h-3 w-3 text-amber-400 shrink-0" />;

        let colorClasses = "bg-neutral-900 border-neutral-800 text-neutral-300";
        if (badge.variant === "amber") {
          colorClasses = "bg-amber-500/10 border-amber-500/30 text-amber-300";
        } else if (badge.variant === "emerald") {
          colorClasses = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
        } else if (badge.variant === "blue") {
          colorClasses = "bg-blue-500/10 border-blue-500/30 text-blue-300";
        } else if (badge.variant === "purple") {
          colorClasses = "bg-purple-500/10 border-purple-500/30 text-purple-300";
        }

        return (
          <span
            key={idx}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${colorClasses} shadow-2xs`}
          >
            {icon}
            <span>{text}</span>
          </span>
        );
      })}
    </div>
  );
}

export const branchesData: Branch[] = [
  {
    id: "head_office",
    name: {
      en: "Head Office Branch (Kohuwala)",
      si: "ප්‍රධාන කාර්යාල ශාඛාව (කොහුවල)",
      ta: "தலைமை அலுவலக கிளை (கொஹுவலை)"
    },
    address: {
      en: "No 106, Bernard's Business Park, 106 Dutugemunu St, Kohuwala",
      si: "නො. 106, බර්නාඩ්ස් බිස්නස් පාර්ක්, 106 දුටුගැමුණු වීදිය, කොහුවල",
      ta: "எண் 106, பெர்னார்ட்ස් பிசினஸ் பார்க், 106 துடுகெமுனு வீதி, கொஹுவலை"
    },
    phone: "0718321321",
    isFlagship: true,
    status: {
      en: "Full Service & Metallurgical Lab",
      si: "සම්පූර්ණ සේවා සහ රන් පරික්ෂණ විද්‍යාගාරය",
      ta: "முழு சேவை மற்றும் தங்க மதிப்பீட்டு ஆய்வகம்"
    },
    landmark: "Bernard's Business Park, Dutugemunu Street Junction",
    hours: "8:30 AM - 6:30 PM (Mon-Sat) | 9:00 AM - 3:00 PM (Sun)",
    facilities: ["Computerized XRF Spectrometer", "Certified 0.001g Scale", "Private VIP Client Lounge", "Instant Cash / Bank Wire Desk", "Ample Visitor Parking"],
    lat: 6.8783,
    lng: 79.8824,
    badges: [
      { label: { en: "In City Center", si: "නගර මධ්‍යයේ", ta: "நகர மையத்தில்" }, iconName: "map-pin", variant: "amber" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரவேசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "இன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" },
      { label: { en: "Visitor Parking", si: "පැමිණෙන්නන්ට රථ ගාල", ta: "பார்வையாளர் நிறுத்துமிடம்" }, iconName: "car", variant: "purple" }
    ]
  },
  {
    id: "bambalapitiya",
    name: {
      en: "Bambalapitiya Branch (W Space)",
      si: "බම්බලපිටිය ශාඛාව (W Space)",
      ta: "பம்பலப்பிட்டி கிளை (W ஸ்பேஸ்)"
    },
    address: {
      en: "W Space, 252A, Galle Road, Bambalapitiya, Colombo 04",
      si: "W Space, 252A, ගාලු පාර, බම්බලපිටිය, කොළඹ 04",
      ta: "W ஸ்பேஸ், 252A, காலி வீதி, பம்பலப்பிட்டி, கொழும்பு 04"
    },
    phone: "0718321321",
    isFlagship: true,
    status: {
      en: "Premium Exchange & XRF Assaying Lounge",
      si: "ප්‍රමුඛතම හුවමාරු සහ XRF පරිගණක පරීක්ෂණ පරිශ්‍රය",
      ta: "பிரீமியம் பரிமாற்றம் மற்றும் XRF கணினி மதிப்பீட்டு மையம்"
    },
    landmark: "Inside W Space, Galle Road, Opposite Marine Drive Turn",
    hours: "9:00 AM - 6:00 PM (Mon-Sat)",
    facilities: ["XRF Spectrometer", "Diamond & Watch Valuation Desk", "Air-conditioned Private Lounge", "Valet Parking Available"],
    lat: 6.8962,
    lng: 79.8553,
    badges: [
      { label: { en: "Galle Road Hub", si: "ගාලු පාර මධ්‍යස්ථානය", ta: "காலி வீதி மையம்" }, iconName: "map-pin", variant: "amber" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" },
      { label: { en: "Valet Parking", si: "වැලේ රථ ගාල", ta: "வாலட் பார்க்கிங்" }, iconName: "car", variant: "purple" }
    ]
  },
  {
    id: "dehiwala_icc",
    name: {
      en: "Dehiwala Branch (ICC Business Center)",
      si: "දෙහිවල ශාඛාව (ICC ව්‍යාපාරික මධ්‍යස්ථානය)",
      ta: "தெஹிவளை கிளை (ICC வணிக மையம்)"
    },
    address: {
      en: "ICC Business Center, 68, Jayasinghe Mawatha, Nugegoda / Dehiwala 10250",
      si: "ICC ව්‍යාපාරික මධ්‍යස්ථානය, 68, ජයසිංහ මාවත, නුගේගොඩ / දෙහිවල 10250",
      ta: "ICC வணிக மையம், 68, ஜெயசிங்க மாவத்தை, நுகேகொட / தெஹிவளை 10250"
    },
    phone: "0718321321",
    isFlagship: true,
    status: {
      en: "Secure VIP Appraisal Desk",
      si: "VIP ආරක්ෂිත රන් තක්සේරු අංශය",
      ta: "VIP பாதுகாப்பான தங்க மதிப்பீட்டு பிரிவு"
    },
    landmark: "ICC Business Complex, Near Jayasinghe Mawatha",
    hours: "8:30 AM - 6:00 PM (Mon-Sat)",
    facilities: ["Non-destructive Gold Testing", "High Security Vault Access", "Instant Local Wire Transfer", "Covered Parking"],
    lat: 6.8741,
    lng: 79.8923,
    badges: [
      { label: { en: "Business Center VIP", si: "ව්‍යාපාරික මධ්‍යස්ථාන VIP", ta: "வணிக மைய VIP" }, iconName: "building", variant: "purple" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  },
  {
    id: "kohuwala_hosp",
    name: {
      en: "Kohuwala Branch (Hospital Road)",
      si: "කොහුවල ශාඛාව (රෝහල් පාර)",
      ta: "கொஹுவலை கிளை (வைத்தியசாலை வீதி)"
    },
    address: {
      en: "68, Kalubowila Hospital Road, Kohuwala",
      si: "68, කළුබෝවිල රෝහල් පාර, කොහුවල",
      ta: "68, களுபோவில வைத்தியசாலை வீதி, கொஹுவலை"
    },
    phone: "0718321321",
    isFlagship: true,
    status: {
      en: "Express Valuation Center",
      si: "ක්ෂණික රන් තක්සේරු මධ්‍යස්ථානය",
      ta: "விரைவு தங்க மதிப்பீட்டு மையம்"
    },
    landmark: "Near Kalubowila Teaching Hospital Main Entrance",
    hours: "8:30 AM - 6:30 PM (Mon-Sat)",
    facilities: ["Express Gold Testing", "Immediate Cash Handout", "Confidential Consultation Desk"],
    lat: 6.8744,
    lng: 79.8810,
    badges: [
      { label: { en: "Hospital Road Hub", si: "රෝහල් පාර මධ්‍යස්ථානය", ta: "வைத்தியசாலை வீதி மையம்" }, iconName: "map-pin", variant: "amber" },
      { label: { en: "Express Valuation", si: "ක්ෂණික තක්සේරුව", ta: "விரைவு மதிப்பீடு" }, iconName: "zap", variant: "amber" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  },
  {
    id: "dehiwala_mount",
    name: {
      en: "Dehiwala / Mount Lavinia Branch",
      si: "දෙහිවල / ගල්කිස්ස ශාඛාව",
      ta: "தெஹிவளை / கல்கிசை கிளை"
    },
    address: {
      en: "13, Katukurunduwatta Road, Dehiwala, Mount Lavinia 10390",
      si: "13, කටුකුරුන්දුවත්ත පාර, දෙහිවල, ගල්කිස්ස 10390",
      ta: "13, காட்டுக்குருந்துவத்தை வீதி, தெஹிவளை, கல்கிசை 10390"
    },
    phone: "0718321321",
    isFlagship: true,
    status: {
      en: "Coastal Region Valuation Hub",
      si: "වෙරළබඩ කලාපීය රන් තක්සේරු මධ්‍යස්ථානය",
      ta: "கடற்கரை பிராந்திய தங்க மதிப்பீட்டு மையம்"
    },
    landmark: "Katukurunduwatta Road, Off Galle Road Mount Lavinia",
    hours: "9:00 AM - 6:00 PM (Mon-Sat)",
    facilities: ["XRF Purity Analyzer", "Private Meeting Room", "Direct Cash Counter"],
    lat: 6.8485,
    lng: 79.8710,
    badges: [
      { label: { en: "Coastal Region Hub", si: "වෙරළබඩ කලාපීය මධ්‍යස්ථානය", ta: "கடற்கரை பிராந்திய மையம்" }, iconName: "map-pin", variant: "amber" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  },
  {
    id: "battaramulla",
    name: {
      en: "Battaramulla Branch",
      si: "බත්තරමුල්ල ශාඛාව",
      ta: "பத்தரமுல்ல கிளை"
    },
    address: {
      en: "Battaramulla, Main Administrative Zone, Colombo",
      si: "බත්තරමුල්ල, ප්‍රධාන පරිපාලන කලාපය, කොළඹ",
      ta: "பத்தரமுல்ல, கொழும்பு"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
    landmark: "Near Diyatha Uyana / Main Battaramulla Junction",
    hours: "9:00 AM - 5:30 PM (Mon-Sat)",
    facilities: ["Mobile / Desk Valuation", "Secure Escort Available"],
    lat: 6.9012,
    lng: 79.9275,
    badges: [
      { label: { en: "Administrative Zone", si: "පරිපාලන කලාපය", ta: "நிர்வாக மண்டலம்" }, iconName: "building", variant: "purple" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  },
  {
    id: "nawala",
    name: {
      en: "Nawala Branch",
      si: "නාවල ශාඛාව",
      ta: "நாவல கிளை"
    },
    address: {
      en: "Nawala Road, Nawala, Colombo",
      si: "නාවල පාර, නාවල, කොළඹ",
      ta: "நாவல வீதி, நாவல, கொழும்பு"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
    landmark: "Nawala Junction, Near Open University Drive",
    hours: "9:00 AM - 5:30 PM (Mon-Sat)",
    facilities: ["XRF Testing Desk", "Instant Bank Wire Transfer"],
    lat: 6.8858,
    lng: 79.8986,
    badges: [
      { label: { en: "Near Open University", si: "විවෘත විශ්වවිද්‍යාලය අසල", ta: "திறந்த பல்கலைக்கழகம் அருகில்" }, iconName: "map-pin", variant: "amber" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  },
  {
    id: "rajagiriya",
    name: {
      en: "Rajagiriya Branch",
      si: "රාජගිරිය ශාඛාව",
      ta: "ராஜகிரிய கிளை"
    },
    address: {
      en: "Parliament Road, Rajagiriya, Colombo",
      si: "පාර්ලිමේන්තු පාර, රාජගිරිය, කොළඹ",
      ta: "பாராளுமன்ற வீதி, ராஜகிரிய, கொழும்பு"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
    landmark: "Rajagiriya Flyover Junction",
    hours: "9:00 AM - 5:30 PM (Mon-Sat)",
    facilities: ["Confidential Gold Valuation", "Direct Cash Payout"],
    lat: 6.9090,
    lng: 79.8992,
    badges: [
      { label: { en: "Parliament Road Hub", si: "පාර්ලිමේන්තු පාර මධ්‍යස්ථානය", ta: "பாராளுமன்ற வீதி மையம்" }, iconName: "map-pin", variant: "amber" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  },
  {
    id: "maharagama",
    name: {
      en: "Maharagama Branch",
      si: "මහරගම ශාඛාව",
      ta: "மகரகம கிளை"
    },
    address: {
      en: "High Level Road, Maharagama, Colombo",
      si: "හයිලෙවල් පාර, මහරගම, කොළඹ",
      ta: "ஹைலெவல் வீதி, மகரகம, கொழும்பு"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
    landmark: "High Level Road, Near Maharagama Bus Stand",
    hours: "8:30 AM - 6:00 PM (Mon-Sat)",
    facilities: ["Certified Gold Assaying", "Instant Payout"],
    lat: 6.8511,
    lng: 79.9212,
    badges: [
      { label: { en: "High Level Hub", si: "හයිලෙවල් මධ්‍යස්ථානය", ta: "ஹைලෙவல் மையம்" }, iconName: "map-pin", variant: "amber" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  },
  {
    id: "piliyandala",
    name: {
      en: "Piliyandala Branch",
      si: "පිළියන්දල ශාඛාව",
      ta: "பிலியந்தல கிளை"
    },
    address: {
      en: "Main Street, Piliyandala, Colombo",
      si: "ප්‍රධාන වීදිය, පිළියන්දල, කොළඹ",
      ta: "பிரதான வீதி, பிலியந்தல, கொழும்பு"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பතිவு செய்யவும்"
    },
    landmark: "Piliyandala Clock Tower Junction",
    hours: "8:30 AM - 6:00 PM (Mon-Sat)",
    facilities: ["Express Assaying Desk", "Digital Scale Weighing"],
    lat: 6.8018,
    lng: 79.9224,
    badges: [
      { label: { en: "Clock Tower Junction", si: "ඔරලෝසු කණුව හන්දිය", ta: "கடிகார கோபுரம் சந்திப்பு" }, iconName: "map-pin", variant: "amber" },
      { label: { en: "Express Assaying", si: "ක්ෂණික පරීක්ෂාව", ta: "விரைவு சோதனை" }, iconName: "zap", variant: "amber" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  },
  {
    id: "boralesgamuwa",
    name: {
      en: "Boralesgamuwa Branch",
      si: "බොරලැස්ගමුව ශාඛාව",
      ta: "பொரலஸகமுவ கிளை"
    },
    address: {
      en: "Colombo Road, Boralesgamuwa",
      si: "කොළඹ පාර, බොරලැස්ගමුව",
      ta: "கொழும்பு வீதி, பொரலஸகமுவ"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
    landmark: "Boralesgamuwa Lake Roundabout",
    hours: "8:30 AM - 6:00 PM (Mon-Sat)",
    facilities: ["Gold & Diamond Valuation Desk"],
    lat: 6.8400,
    lng: 79.9030,
    badges: [
      { label: { en: "Lake Roundabout Zone", si: "වැව වටරවුම කලාපය", ta: "ஏரி சுற்றுவட்ட மண்டலம்" }, iconName: "map-pin", variant: "amber" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  },
  {
    id: "nugegoda",
    name: {
      en: "Nugegoda Branch",
      si: "නුගේගොඩ ශාඛාව",
      ta: "நுகேகொட கிளை"
    },
    address: {
      en: "High Level Road, Nugegoda, Colombo",
      si: "හයිලෙවල් පාර, නුගේගොඩ, කොළඹ",
      ta: "ஹைலெவல் வீதி, நுகேகொட, கொழும்பு"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
    landmark: "Nugegoda Supermarket / Flyover Junction",
    hours: "8:30 AM - 6:30 PM (Mon-Sat)",
    facilities: ["XRF Purity Testing", "Instant Cash Counter"],
    lat: 6.8756,
    lng: 79.8903,
    badges: [
      { label: { en: "In City Center", si: "නගර මධ්‍යයේ", ta: "நகர மையத்தில்" }, iconName: "map-pin", variant: "amber" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  },
  {
    id: "wellawatta",
    name: {
      en: "Wellawatta Branch",
      si: "වැල්ලවත්ත ශාඛාව",
      ta: "வெல்லவத்தை கிளை"
    },
    address: {
      en: "Galle Road, Wellawatta, Colombo 06",
      si: "ගාලු පාර, වැල්ලවත්ත, කොළඹ 06",
      ta: "காலி வீதி, வெல்லவத்தை, கொழும்பு 06"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
    landmark: "Galle Road, Near Savoy Cinema Wellawatte",
    hours: "9:00 AM - 6:00 PM (Mon-Sat)",
    facilities: ["Pawned Ticket Redemption", "XRF Assaying"],
    lat: 6.8712,
    lng: 79.8610,
    badges: [
      { label: { en: "Galle Road Hub", si: "ගාලු පාර මධ්‍යස්ථානය", ta: "காலி வீதி மையம்" }, iconName: "map-pin", variant: "amber" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  },
  {
    id: "bauddhaloka_mawatha",
    name: {
      en: "Bauddhaloka Mawatha Colombo Branch",
      si: "බෞද්ධාලෝක මාවත කොළඹ ශාඛාව",
      ta: "பௌத்தாலோக மாவத்தை கொழும்பு கிளை"
    },
    address: {
      en: "Bauddhaloka Mawatha, Colombo 07",
      si: "බෞද්ධාලෝක මාවත, කොළඹ 07",
      ta: "பௌத்தாலோக மாவத்தை, கொழும்பு 07"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
    landmark: "Near BMICH / Cinnamon Gardens",
    hours: "9:00 AM - 5:30 PM (Mon-Sat)",
    facilities: ["Private Client Valuation Lounge"],
    lat: 6.9015,
    lng: 79.8645,
    badges: [
      { label: { en: "Cinnamon Gardens VIP", si: "කුරුඳු වත්ත VIP", ta: "கறுவாத்தோட்டம் VIP" }, iconName: "building", variant: "purple" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  },
  {
    id: "sea_street",
    name: {
      en: "Sea Street Colombo Branch",
      si: "සී වීදිය කොළඹ ශාඛාව",
      ta: "செட்டித்தெரு கொழும்பு கிளை"
    },
    address: {
      en: "Sea Street, Pettah, Colombo 11",
      si: "සී වීදිය, පිටකොටුව, කොළඹ 11",
      ta: "செட்டித்தெரு, புறக்கோட்டை, கொழும்பு 11"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
    landmark: "Pettah Gold Market / Sea Street Junction",
    hours: "9:00 AM - 6:00 PM (Mon-Sat)",
    facilities: ["Bulllion & Sovereign Exchange Desk"],
    lat: 6.9405,
    lng: 79.8510,
    badges: [
      { label: { en: "Pettah Gold Market", si: "පිටකොටුව රන් වෙළඳපොළ", ta: "புறக்கோட்டை தங்க சந்தை" }, iconName: "map-pin", variant: "amber" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  },
  {
    id: "wattala",
    name: {
      en: "Wattala Branch",
      si: "වත්තල ශාඛාව",
      ta: "வத்தளை கிளை"
    },
    address: {
      en: "Negombo Road, Wattala",
      si: "මීගමුව පාර, වත්තල",
      ta: "நீர்கொழும்பு வீதி, வத்தளை"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
    landmark: "Negombo Road, Wattala Town Junction",
    hours: "8:30 AM - 6:00 PM (Mon-Sat)",
    facilities: ["Gold Assaying Desk", "Instant Payout"],
    lat: 6.9811,
    lng: 79.8930,
    badges: [
      { label: { en: "Negombo Road Hub", si: "මීගමුව පාර මධ්‍යස්ථානය", ta: "நீர்கொழும்பு வீதி மையம்" }, iconName: "map-pin", variant: "amber" },
      { label: { en: "Secure Private Access", si: "ආරක්ෂිත පෞද්ගලික ප්‍රවේශය", ta: "பாதுகாப்பான தனிப்பட்ட பிரවේசம்" }, iconName: "shield-check", variant: "emerald" },
      { label: { en: "Open Today", si: "අද විවෘතයි", ta: "ඉன்று திறந்துள்ளது" }, iconName: "clock", variant: "blue" }
    ]
  }
];

export function getBranchImages(branch: Branch): BranchImage[] {
  if (branch.images && branch.images.length > 0) {
    return branch.images;
  }

  return [
    {
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      title: `${branch.name.en} - Private VIP Lounge`,
      caption: "Soundproof private evaluation suite ensuring total discretion, air-conditioned comfort, and personal attention.",
      category: "interior"
    },
    {
      url: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80",
      title: "German XRF Spectrometer & Precision Scale",
      caption: "Computerized non-destructive gold purity analysis testing exact karat purity down to 0.001g accuracy in 60 seconds.",
      category: "equipment"
    },
    {
      url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
      title: "Secure Cash Disbursement Counter",
      caption: "CCTV monitored vault and high-security payout desk providing instant cash payouts or direct bank wire transfers.",
      category: "security"
    },
    {
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      title: `${branch.name.en} - Secure Entrance`,
      caption: `Located near ${branch.landmark || "major Colombo route"} with dedicated visitor parking and armed guard security.`,
      category: "exterior"
    }
  ];
}

export function BranchCarousel({ branchName, images }: { branchName: string; images: BranchImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImg = images[currentIndex] || images[0];

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Image className="h-5 w-5 text-amber-500" />
          <div>
            <h3 className="text-base font-serif font-bold text-white">Branch Gallery & Security Showcase</h3>
            <p className="text-xs text-neutral-400">Explore interior lounge, XRF testing equipment, and security features</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer border border-neutral-800"
            title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
          >
            {isPlaying ? <Pause className="h-4 w-4 text-amber-400" /> : <Play className="h-4 w-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Carousel Display */}
      <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 group">
        <img
          src={currentImg.url}
          alt={currentImg.title}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="px-3 py-1.5 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider shadow-lg">
            {currentImg.category === "interior" && "🏛️ Private VIP Lounge"}
            {currentImg.category === "equipment" && "🔬 German XRF Assaying"}
            {currentImg.category === "security" && "🔒 Monitored Cash Vault"}
            {currentImg.category === "exterior" && "🏢 Branch & Parking"}
          </span>

          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 text-white backdrop-blur-md border border-neutral-700 transition-all cursor-pointer shadow-lg"
            title="Expand Image Lightbox"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-950/80 hover:bg-neutral-900 text-white backdrop-blur-md border border-neutral-700 transition-all cursor-pointer shadow-xl opacity-90 sm:opacity-0 group-hover:opacity-100"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-950/80 hover:bg-neutral-900 text-white backdrop-blur-md border border-neutral-700 transition-all cursor-pointer shadow-xl opacity-90 sm:opacity-0 group-hover:opacity-100"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Caption Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-neutral-950 via-neutral-950/85 to-transparent p-5 space-y-1">
          <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <span>{currentImg.title}</span>
          </h4>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {currentImg.caption}
          </p>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setIsPlaying(false);
            }}
            className={`relative rounded-xl overflow-hidden border-2 h-20 sm:h-24 transition-all cursor-pointer ${
              idx === currentIndex
                ? "border-amber-500 ring-2 ring-amber-500/30 scale-102"
                : "border-neutral-800 opacity-60 hover:opacity-100"
            }`}
          >
            <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-neutral-950/20"></div>
            {idx === currentIndex && (
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm ring-2 ring-amber-950"></div>
            )}
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="max-w-5xl w-full space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 max-h-[75vh] flex items-center justify-center bg-black">
              <img
                src={currentImg.url}
                alt={currentImg.title}
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-serif font-bold text-white">{currentImg.title}</h3>
              <p className="text-sm text-neutral-300 max-w-2xl mx-auto">{currentImg.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BranchesPage({
  currentLang,
  selectedBranchId,
  onSelectBranch,
  setView
}: BranchesPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const mapRef = useRef<any>(null);

  const activeBranch = selectedBranchId
    ? branchesData.find(b => b.id === selectedBranchId) || null
    : null;

  const handleBranchSelect = (id: string | null) => {
    if (onSelectBranch) {
      onSelectBranch(id);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredBranches = branchesData.filter((branch) => {
    const term = searchTerm.trim().toLowerCase();
    
    // Check area filter
    let matchesArea = true;
    if (selectedArea !== "all") {
      const areaKeyword = selectedArea.toLowerCase();
      matchesArea = 
        branch.name.en.toLowerCase().includes(areaKeyword) ||
        branch.address.en.toLowerCase().includes(areaKeyword) ||
        (branch.landmark && branch.landmark.toLowerCase().includes(areaKeyword));
    }

    if (!matchesArea) return false;

    if (!term) return true;

    return (
      branch.name.en.toLowerCase().includes(term) ||
      branch.name.si.includes(term) ||
      branch.name.ta.includes(term) ||
      branch.address.en.toLowerCase().includes(term) ||
      branch.address.si.includes(term) ||
      branch.address.ta.includes(term) ||
      (branch.landmark && branch.landmark.toLowerCase().includes(term))
    );
  });

  const flagshipBranches = filteredBranches.filter(b => b.isFlagship);
  const expressBranches = filteredBranches.filter(b => !b.isFlagship);

  // Initialize interactive Leaflet map for either single branch or all branches
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mapElementId = activeBranch ? "single-branch-map" : "colombo-branches-map";
    const mapContainer = document.getElementById(mapElementId);
    if (!mapContainer) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    delete (mapContainer as any)._leaflet_id;

    const centerLat = activeBranch ? activeBranch.lat : 6.8900;
    const centerLng = activeBranch ? activeBranch.lng : 79.8850;
    const zoomLevel = activeBranch ? 15 : 12;

    const map = L.map(mapElementId, {
      center: [centerLat, centerLng],
      zoom: zoomLevel,
      scrollWheelZoom: false,
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20
    }).addTo(map);

    const createCustomIcon = (isFlagship: boolean) => {
      return L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 ${isFlagship ? 'bg-amber-500/30' : 'bg-neutral-500/20'} rounded-full animate-ping"></div>
            <div class="relative w-5 h-5 ${isFlagship ? 'bg-amber-600 border-2 border-white' : 'bg-neutral-700 border-2 border-white'} rounded-full flex items-center justify-center shadow-md">
              <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        `,
        className: "custom-leaflet-pin",
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
    };

    const targetBranches = activeBranch ? [activeBranch] : branchesData;

    targetBranches.forEach((b) => {
      const marker = L.marker([b.lat, b.lng], {
        icon: createCustomIcon(b.isFlagship)
      }).addTo(map);

      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 200px;">
          <div style="font-weight: 800; font-size: 13px; color: #171717; margin-bottom: 4px;">${b.name[currentLang]}</div>
          <div style="font-size: 11px; color: #525252; margin-bottom: 8px; line-height: 1.4;">${b.address[currentLang]}</div>
          <a href="https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}" target="_blank" style="display: block; text-align: center; background: #d97706; color: white; padding: 6px 10px; border-radius: 6px; font-weight: bold; font-size: 10px; text-decoration: none;">Open Directions</a>
        </div>
      `;

      marker.bindPopup(popupHtml);
      if (activeBranch) {
        marker.openPopup();
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activeBranch, currentLang, selectedBranchId]);

  return (
    <div className="pt-24 pb-16 bg-neutral-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-3 mb-8 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <button
              type="button"
              onClick={() => { if (setView) setView("home"); }}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="h-3 w-3 text-neutral-600" />
            <button
              type="button"
              onClick={() => handleBranchSelect(null)}
              className={`hover:text-amber-400 transition-colors cursor-pointer ${!activeBranch ? "text-amber-400 font-bold" : ""}`}
            >
              16 Branches
            </button>
            {activeBranch && (
              <>
                <ChevronRight className="h-3 w-3 text-neutral-600" />
                <span className="text-amber-400 font-bold truncate max-w-[200px] sm:max-w-xs">{activeBranch.name[currentLang]}</span>
              </>
            )}
          </div>

          {activeBranch && (
            <button
              onClick={() => handleBranchSelect(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-amber-500" />
              <span>All 16 Branches</span>
            </button>
          )}
        </div>

        {/* CONDITIONAL RENDER: SINGLE BRANCH LOCATION PAGE vs ALL 16 BRANCHES OVERVIEW */}
        {activeBranch ? (
          /* INDIVIDUAL BRANCH LOCATION PAGE */
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Location Hero Card */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>{activeBranch.isFlagship ? "Flagship Appraisal Lounge" : "Express Location Desk"}</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-serif font-black text-white leading-tight">
                    {activeBranch.name[currentLang]}
                  </h1>

                  {/* Location Badges / Tags */}
                  <div className="pt-1">
                    <BranchBadgePills badges={activeBranch.badges} currentLang={currentLang} />
                  </div>

                  <div className="flex items-start gap-2.5 text-neutral-300 text-sm">
                    <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{activeBranch.address[currentLang]}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-2">
                    <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
                      <Clock className="h-4 w-4 text-amber-400" />
                      <span>{activeBranch.hours || "8:30 AM - 6:00 PM (Mon-Sat)"}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
                      <Lock className="h-4 w-4 text-emerald-400" />
                      <span>{activeBranch.status[currentLang]}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-4">
                    <a
                      href={`tel:${activeBranch.phone}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 no-underline shrink-0"
                    >
                      <PhoneCall className="h-4 w-4" />
                      <span>Click to Call {activeBranch.phone}</span>
                    </a>

                    <a
                      href={`https://wa.me/94718321321?text=Hi%20GBC,%20I%20want%20to%20visit%20your%20${encodeURIComponent(activeBranch.name.en)}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all no-underline shrink-0"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp Branch</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${activeBranch.lat},${activeBranch.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold text-xs sm:text-sm transition-all no-underline shrink-0"
                    >
                      <Navigation className="h-4 w-4 text-amber-400" />
                      <span>Google Maps Directions</span>
                    </a>
                  </div>
                </div>

                {/* Quick Info Box */}
                <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-4 lg:w-80 shrink-0">
                  <h3 className="text-sm font-serif font-bold text-amber-400 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Branch Security & Facilities</span>
                  </h3>

                  <ul className="space-y-2.5 text-xs text-neutral-300">
                    {(activeBranch.facilities || [
                      "Computerized XRF Assaying",
                      "Certified 0.001g Scale",
                      "Private VIP Client Room",
                      "Instant Cash Counter"
                    ]).map((fac, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400">
                    <span className="font-bold text-neutral-200">Landmark: </span>
                    <span>{activeBranch.landmark || "Located in Colombo commercial zone"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Branch Image Showcase & Facilities Carousel */}
            <BranchCarousel
              branchName={activeBranch.name[currentLang]}
              images={getBranchImages(activeBranch)}
            />

            {/* Dedicated Interactive Map */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-500" />
                  <h3 className="text-base font-serif font-bold text-white">Branch Location Map</h3>
                </div>
                <span className="text-xs text-neutral-400 font-mono">Lat: {activeBranch.lat} | Lng: {activeBranch.lng}</span>
              </div>

              <div id="single-branch-map" className="w-full h-80 rounded-xl overflow-hidden border border-neutral-800 z-10"></div>
            </div>

            {/* Other Branches Selector Grid */}
            <div className="pt-8 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-serif font-bold text-white">Explore Other GBC Branches in Colombo</h3>
                <button
                  type="button"
                  onClick={() => handleBranchSelect(null)}
                  className="text-xs text-amber-400 font-bold hover:underline"
                >
                  View All 16 Branches &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {branchesData.filter(b => b.id !== activeBranch.id).slice(0, 8).map((otherBranch) => (
                  <div
                    key={otherBranch.id}
                    onClick={() => handleBranchSelect(otherBranch.id)}
                    className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                          {otherBranch.isFlagship ? "Flagship" : "Express"}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {otherBranch.name[currentLang]}
                      </h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">
                        {otherBranch.address[currentLang]}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>View Location</span>
                      <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* MASTER 16 BRANCHES OVERVIEW PAGE */
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Master Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs uppercase font-mono tracking-widest text-amber-500 font-semibold block">
                Colombo Branch Network
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-black text-white leading-tight">
                Our 16 Secure Colombo Locations
              </h1>
              <p className="text-xs sm:text-base text-neutral-400 leading-relaxed">
                With 16 strategic locations across Colombo, we offer convenient private lounges with computerized XRF testing and instant top-tier cash payouts.
              </p>

              {/* Search Bar & Neighborhood Filter Pills */}
              <div className="pt-4 max-w-2xl mx-auto space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Type city or neighborhood (e.g. Dehiwala, Kohuwala, Bambalapitiya)..."
                    className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Quick Area Filter Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <span className="text-xs text-neutral-400 font-mono flex items-center gap-1 mr-1">
                    <Filter className="h-3 w-3 text-amber-500" /> Area:
                  </span>
                  {[
                    { id: "all", label: "All Areas (16)" },
                    { id: "kohuwala", label: "Kohuwala / Nugegoda" },
                    { id: "bambalapitiya", label: "Bambalapitiya" },
                    { id: "dehiwala", label: "Dehiwala" },
                    { id: "kirulapone", label: "Kirulapone" },
                    { id: "wellawatte", label: "Wellawatte" },
                    { id: "pettah", label: "Pettah" },
                    { id: "wattala", label: "Wattala" }
                  ].map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setSelectedArea(area.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        selectedArea === area.id
                          ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20"
                          : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      {area.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Leaflet Map showing all pins */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm sm:text-base font-serif font-bold text-white">Colombo Interactive Map</h3>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {filteredBranches.length} {filteredBranches.length === 1 ? "Branch" : "Branches"} Found
                </span>
              </div>

              <div id="colombo-branches-map" className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-neutral-800 z-10"></div>
            </div>

            {/* Empty State when no branches match filters */}
            {filteredBranches.length === 0 && (
              <div className="text-center py-16 px-6 bg-neutral-950 border border-neutral-800 rounded-3xl space-y-4 max-w-xl mx-auto">
                <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white">No Branches Match Your Filter</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  We couldn't find a branch matching "{searchTerm}" in the selected area. Try clearing your search term or select "All Areas".
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedArea("all");
                  }}
                  className="px-5 py-2.5 bg-amber-500 text-neutral-950 font-black text-xs rounded-xl hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Flagship Centers */}
            {flagshipBranches.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    Flagship Appraisal Centers
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {flagshipBranches.map((branch) => (
                    <div
                      key={branch.id}
                      className="bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group shadow-lg"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase">
                            Flagship Lounge
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">0718 321 321</span>
                        </div>

                        {/* Location Badges / Tags */}
                        <BranchBadgePills badges={branch.badges} currentLang={currentLang} />

                        <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                          {branch.name[currentLang]}
                        </h3>

                        <p className="text-xs text-neutral-400 leading-relaxed">
                          {branch.address[currentLang]}
                        </p>

                        <div className="text-[11px] text-amber-400/90 font-medium pt-1">
                          {branch.status[currentLang]}
                        </div>
                      </div>

                      <div className="pt-6 mt-6 border-t border-neutral-800/80 space-y-2">
                        <button
                          type="button"
                          onClick={() => handleBranchSelect(branch.id)}
                          className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/10"
                        >
                          <span>View Branch Details Page</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`tel:${branch.phone}`}
                            className="py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-[11px] font-bold text-center flex items-center justify-center gap-1.5 transition-colors no-underline"
                          >
                            <Phone className="h-3.5 w-3.5 text-amber-400" />
                            <span>Call</span>
                          </a>

                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lng}`}
                            target="_blank"
                            rel="noreferrer"
                            className="py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-[11px] font-bold text-center flex items-center justify-center gap-1.5 transition-colors no-underline"
                          >
                            <Navigation className="h-3.5 w-3.5 text-amber-400" />
                            <span>Map</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Express Branches */}
            {expressBranches.length > 0 && (
              <div className="space-y-6 pt-6">
                <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
                  <div className="h-3 w-3 rounded-full bg-neutral-500"></div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    Express Valuation Branches & Regional Desks
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {expressBranches.map((branch) => (
                    <div
                      key={branch.id}
                      className="bg-neutral-950/80 border border-neutral-800/80 hover:border-amber-500/40 rounded-xl p-5 flex flex-col justify-between transition-all group"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Available Desk</span>
                        </div>

                        {/* Location Badges / Tags */}
                        <BranchBadgePills badges={branch.badges} currentLang={currentLang} />

                        <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {branch.name[currentLang]}
                        </h3>

                        <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                          {branch.address[currentLang]}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-neutral-800/60 space-y-2">
                        <button
                          type="button"
                          onClick={() => handleBranchSelect(branch.id)}
                          className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-amber-500 text-neutral-300 hover:text-neutral-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Location Details</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>

                        <a
                          href={`tel:${branch.phone}`}
                          className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-bold text-center flex items-center justify-center gap-1.5 transition-colors no-underline border border-amber-500/20"
                        >
                          <PhoneCall className="h-3 w-3 text-amber-400" />
                          <span>Click to Call {branch.phone}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
