/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Search, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Navigation, 
  ChevronRight, 
  ArrowLeft,
  Clock,
  Car,
  Award,
  Sparkles,
  Zap,
  Lock
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
    lng: 79.8824
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
    lng: 79.8553
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
    lng: 79.8923
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
    lng: 79.8810
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
    lng: 79.8710
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
    lng: 79.9275
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
    lng: 79.8986
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
    lng: 79.8992
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
    lng: 79.9212
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
    lng: 79.9224
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
    lng: 79.9030
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
    lng: 79.8903
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
    lng: 79.8610
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
    lng: 79.8645
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
    lng: 79.8510
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
    lng: 79.8930
  }
];

export default function BranchesPage({
  currentLang,
  selectedBranchId,
  onSelectBranch,
  setView
}: BranchesPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
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
    const term = searchTerm.toLowerCase();
    return (
      branch.name.en.toLowerCase().includes(term) ||
      branch.name.si.includes(term) ||
      branch.name.ta.includes(term) ||
      branch.address.en.toLowerCase().includes(term) ||
      branch.address.si.includes(term) ||
      branch.address.ta.includes(term)
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
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 no-underline"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call {activeBranch.phone}</span>
                    </a>

                    <a
                      href={`https://wa.me/94718321321?text=Hi%20GBC,%20I%20want%20to%20visit%20your%20${encodeURIComponent(activeBranch.name.en)}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all no-underline"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp Branch</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${activeBranch.lat},${activeBranch.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold text-xs sm:text-sm transition-all no-underline"
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

              {/* Search Bar */}
              <div className="pt-4 max-w-xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search branches by area (e.g. Dehiwala, Kohuwala, Bambalapitiya)..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Interactive Leaflet Map showing all pins */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm sm:text-base font-serif font-bold text-white">Colombo Interactive Map (16 Locations)</h3>
                </div>
                <span className="text-xs text-amber-400 font-bold">{filteredBranches.length} Branches Found</span>
              </div>

              <div id="colombo-branches-map" className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-neutral-800 z-10"></div>
            </div>

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
