/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, MessageCircle, Search, Building2, ShieldCheck, CheckCircle2, Navigation } from "lucide-react";
import { Language } from "../lib/translations.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface BranchesPageProps {
  currentLang: Language;
}

interface Branch {
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
  lat: number;
  lng: number;
}

const branchesData: Branch[] = [
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
      ta: "எண் 106, பெர்னார்ட்ஸ் பிசினஸ் பார்க், 106 துடுகெமுனு வீதி, கொஹுவலை"
    },
    phone: "0718321321",
    isFlagship: true,
    status: {
      en: "Full Service & Valuation Lab",
      si: "සම්පූර්ණ සේවා සහ රන් පරික්ෂණ විද්‍යාගාරය",
      ta: "முழு சேவை மற்றும் தங்க மதிப்பீட்டு ஆய்வகம்"
    },
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
      en: "W Space, 252A, Galle Road, Bambalapitiya, Colombo",
      si: "W Space, 252A, ගාලු පාර, බම්බලපිටිය, කොළඹ",
      ta: "W ஸ்பேஸ், 252A, காலி வீதி, பம்பலப்பிட்டி, கொழும்பு"
    },
    phone: "0718321321",
    isFlagship: true,
    status: {
      en: "Premium Exchange & XRF Assaying Lounge",
      si: "ප්‍රමුඛතම හුවමාරු සහ XRF පරිගණක පරීක්ෂණ පරිශ්‍රය",
      ta: "பிரீமியம் பரிமாற்றம் மற்றும் XRF கணினி மதிப்பீட்டு மையம்"
    },
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
      en: "ICC Business Center, 68, Jayasinghe Mawatha, Nugegoda 10250",
      si: "ICC ව්‍යාපාරික මධ්‍යස්ථානය, 68, ජයසිංහ මාවත, නුගේගොඩ 10250",
      ta: "ICC வணிக மையம், 68, ஜெயசிங்க மாவத்தை, நுகேகொட 10250"
    },
    phone: "0718321321",
    isFlagship: true,
    status: {
      en: "Secure VIP Appraisal Desk",
      si: "VIP ආරක්ෂිත රන් තක්සේරු අංශය",
      ta: "VIP பாதுகாப்பான தங்க மதிப்பீட்டு பிரிவு"
    },
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
    lat: 6.8485,
    lng: 79.8710
  },
  // Express/Contact Available branches
  {
    id: "battaramulla",
    name: {
      en: "Battaramulla Branch",
      si: "බත්තරමුල්ල ශාඛාව",
      ta: "பத்தரமுல்ல கிளை"
    },
    address: {
      en: "Battaramulla, Colombo, Sri Lanka (Secure Local Desk)",
      si: "බත්තරමුල්ල, කොළඹ (ආරක්ෂිත ප්‍රාදේශීය අංශය)",
      ta: "பத்தரமுல்ல, கொழும்பு (பாதுகாப்பான பிராந்திய பிரிவு)"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Mobile / Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
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
      en: "Nawala, Colombo, Sri Lanka (Secure Local Desk)",
      si: "නාවල, කොළඹ (ආරක්ෂිත ප්‍රාදේශීය අංශය)",
      ta: "நாவல, கொழும்பு (பாதுகாப்பான பிராந்திய பிரிவு)"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Mobile / Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
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
      en: "Rajagiriya, Colombo, Sri Lanka (Secure Local Desk)",
      si: "රාජගිරිය, කොළඹ (ආරක්ෂිත ප්‍රාදේශීය අංශය)",
      ta: "ராஜகிரிய, கொழும்பு (பாதுகாப்பான பிராந்திய பிரிவு)"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Mobile / Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
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
      en: "Maharagama, Colombo, Sri Lanka (Secure Local Desk)",
      si: "මහරගම, කොළඹ (ආරක්ෂිත ප්‍රාදේශීය අංශය)",
      ta: "மகரகம, கொழும்பு (பாதுகாப்பான பிராந்திய பிரிவு)"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Mobile / Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
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
      en: "Piliyandala, Colombo, Sri Lanka (Secure Local Desk)",
      si: "පිළියන්දල, කොළඹ (ආරක්ෂිත ප්‍රාදේශීය අංශය)",
      ta: "பிலியந்தல, கொழும்பு (பாதுகாப்பான பிராந்திய பிரிவு)"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Mobile / Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
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
      en: "Boralesgamuwa, Colombo, Sri Lanka (Secure Local Desk)",
      si: "බොරලැස්ගමුව, කොළඹ (ආරක්ෂිත ප්‍රාදේශීය අංශය)",
      ta: "பொரலஸகமுவ, கொழும்பு (பாதுகாப்பான பிராந்திய பிரிவு)"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Mobile / Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
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
      en: "Nugegoda, Colombo, Sri Lanka (Secure Local Desk)",
      si: "නුගේගොඩ, කොළඹ (ආරක්ෂිත ප්‍රාදේශීය අංශය)",
      ta: "நுகேகொட, கொழும்பு (பாதுகாப்பான பிராந்திய பிரிவு)"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Mobile / Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
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
      en: "Wellawatta, Colombo, Sri Lanka (Secure Local Desk)",
      si: "වැල්ලවත්ත, කොළඹ (ආරක්ෂිත ප්‍රාදේශීය අංශය)",
      ta: "வெல்லவத்தை, கொழும்பு (பாதுகாப்பான பிராந்திய பிரிவு)"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Mobile / Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
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
      en: "Bauddhaloka Mawatha, Colombo, Sri Lanka (Secure Local Desk)",
      si: "බෞද්ධාලෝක මාවත, කොළඹ (ආරක්ෂිත ප්‍රාදේශීය අංශය)",
      ta: "பௌத்தாலோக மாவத்தை, கொழும்பு (பாதுகாப்பான பிராந்திய பிரிவு)"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Mobile / Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
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
      en: "Sea Street, Colombo 11, Sri Lanka (Secure Local Desk)",
      si: "සී වීදිය, කොළඹ 11 (ආරක්ෂිත ප්‍රාදේශීය අංශය)",
      ta: "செட்டித்தெரு, கொழும்பு 11 (பாதுகாப்பான பிராந்திய பிரிவு)"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Mobile / Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
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
      en: "Wattala, Colombo, Sri Lanka (Secure Local Desk)",
      si: "වත්තල, කොළඹ (ආරක්ෂිත ප්‍රාදේශීය අංශය)",
      ta: "வத்தளை, கொழும்பு (பாதுகாப்பான பிராந்திய பிரிவு)"
    },
    phone: "0718321321",
    isFlagship: false,
    status: {
      en: "Call to Book Mobile / Desk Valuation",
      si: "දුරකථනයෙන් සම්බන්ධ වී වේලාවක් වෙන්කරවා ගන්න",
      ta: "அழைத்து நேரத்தை முன்பதிவு செய்யவும்"
    },
    lat: 6.9811,
    lng: 79.8930
  }
];

export default function BranchesPage({ currentLang }: BranchesPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("head_office");
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  const pageTitle = {
    en: "Our Colombo Branch Network",
    si: "අපගේ කොළඹ ශාඛා ජාලය",
    ta: "எங்களது கொழும்பு கிளை நெட்வொர்க்"
  }[currentLang];

  const pageSubtitle = {
    en: "With 16 strategic locations across Colombo, we offer convenient private lounges with computerized XRF testing and instant top-tier payouts.",
    si: "කොළඹ පුරා විහිදුණු අපගේ ශාඛා 16 කින් සමන්විත ජාලය හරහා, පරිගණක XRF පරීක්ෂාව සහ ඉහළම මිල ගෙවීම් සහිත සේවාවක් ලබා ගත හැක.",
    ta: "கொழும்பு முழுவதும் 16 கிளைகளுடன், கணினிமயமாக்கப்பட்ட XRF பரிசோதனை மற்றும் உயர்ந்த பட்டுவாடாவுடன் கூடிய பிரத்தியேக மையங்களை வழங்குகிறோம்."
  }[currentLang];

  const flagshipHeading = {
    en: "Flagship Appraisal Centers",
    si: "ප්‍රධාන රන් තක්සේරු මධ්‍යස්ථාන",
    ta: "முதன்மை தங்க மதிப்பீட்டு மையங்கள்"
  }[currentLang];

  const expressHeading = {
    en: "Express Valuation Branches & Local Desks",
    si: "අනෙකුත් ක්ෂණික තක්සේරු ශාඛා සහ කලාපීය කවුන්ටර",
    ta: "விரைவு மதிப்பீட்டு கிளைகள் & பிராந்திய பிரிவுகள்"
  }[currentLang];

  const callNowText = {
    en: "Call Branch Desk",
    si: "ශාඛාව අමතන්න",
    ta: "கிளையை அழைக்கவும்"
  }[currentLang];

  const whatsappText = {
    en: "WhatsApp Secure Chat",
    si: "වට්ස්ඇප් හරහා සම්බන්ධ වන්න",
    ta: "வாட்ஸ்அப் அரட்டை"
  }[currentLang];

  const searchPlaceholder = {
    en: "Search branches by area (e.g., Dehiwala, Kohuwala, Sea Street...)",
    si: "ශාඛා සොයන්න (උදා: දෙහිවල, කොහුවල...)",
    ta: "கிளைகளைத் தேடுங்கள் (உதாரணமாக: தெஹிவளை, கொஹுவலை...)"
  }[currentLang];

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mapContainer = document.getElementById("colombo-branches-map");
    if (!mapContainer) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Clean up any remaining leaflet id on the container to prevent reuse errors
    delete (mapContainer as any)._leaflet_id;

    // Initialize map centered on Colombo City
    const map = L.map("colombo-branches-map", {
      center: [6.8900, 79.8850],
      zoom: 12,
      scrollWheelZoom: false,
    });

    mapRef.current = map;

    // Use CartoDB Light/Positron tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20
    }).addTo(map);

    // Create custom beautiful styled amber/gold ping icons
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
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -10]
      });
    };

    const markers: { [key: string]: any } = {};

    branchesData.forEach((branch) => {
      const marker = L.marker([branch.lat, branch.lng], {
        icon: createCustomIcon(branch.isFlagship)
      }).addTo(map);

      const popupContent = `
        <div class="p-2.5 min-w-[200px] text-neutral-950 font-sans leading-normal">
          <div class="text-[9px] font-mono uppercase tracking-wider ${branch.isFlagship ? 'text-amber-700 font-bold' : 'text-neutral-500'} mb-1">
            ${branch.isFlagship ? 'Flagship Center' : 'Secure Appraisal Desk'}
          </div>
          <h4 class="font-serif font-black text-sm text-neutral-950 mb-1 leading-tight">${branch.name[currentLang]}</h4>
          <p class="text-[11px] text-neutral-600 mb-2 leading-snug">${branch.address[currentLang]}</p>
          <div class="text-[10px] text-neutral-500 font-semibold mb-3 bg-neutral-100 p-1.5 rounded border border-neutral-200">${branch.status[currentLang]}</div>
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
            <a href="tel:${branch.phone}" class="py-1.5 bg-neutral-950 text-white rounded text-[10px] font-bold text-center no-underline hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1">
              📞 Call
            </a>
            <a href="https://wa.me/94718321321?text=Hello%20GBC%20Gold%20Buyers%20Colombo,%20I%20want%20to%20visit%20your%20${encodeURIComponent(branch.name.en)}%20for%20a%20valuation." target="_blank" class="py-1.5 bg-amber-600 text-white rounded text-[10px] font-bold text-center no-underline hover:bg-amber-500 transition-colors flex items-center justify-center gap-1">
              💬 WhatsApp
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", () => {
        setSelectedBranchId(branch.id);
      });

      markers[branch.id] = marker;
    });

    markersRef.current = markers;

    // Center and open popup for Kohuwala on start
    if (markers["head_office"]) {
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.setView([6.8783, 79.8824], 13);
          markers["head_office"].openPopup();
        }
      }, 300);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [currentLang]);

  const focusOnBranch = (branch: Branch) => {
    setSelectedBranchId(branch.id);
    if (mapRef.current && markersRef.current[branch.id]) {
      mapRef.current.setView([branch.lat, branch.lng], 14);
      markersRef.current[branch.id].openPopup();
      
      const mapElement = document.getElementById("colombo-branches-map-container");
      if (mapElement && window.innerWidth < 1024) {
        mapElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 pb-16">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 z-0 pointer-events-none"></div>

      {/* Header Banner */}
      <div className="relative z-10 max-w-7xl mx-auto pt-28 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-800 text-xs tracking-widest uppercase mb-6 font-mono font-bold shadow-sm"
        >
          <Building2 className="h-4 w-4 text-amber-600" />
          <span>16 Certified Colombo Branches</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-neutral-950 mb-6 max-w-4xl mx-auto leading-none"
        >
          {pageTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-neutral-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-10"
        >
          {pageSubtitle}
        </motion.p>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto z-20">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-250 rounded-full text-sm text-neutral-800 focus:outline-none focus:border-amber-500 focus:bg-white shadow-md transition-all placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Interactive Map Section */}
      <div id="colombo-branches-map-container" className="relative z-25 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-4">
          
          {/* Quick Finder Sidebar */}
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-neutral-200 flex flex-col h-[380px] lg:h-[500px] bg-neutral-50/50">
            <div className="mb-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold flex items-center gap-1.5">
                <Navigation className="h-4 w-4 text-amber-600 animate-pulse" />
                <span>Quick Locator</span>
              </h3>
              <p className="text-[11px] text-neutral-500 mt-1">
                Click any of our 16 branches below to navigate the map:
              </p>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
              {filteredBranches.map((branch) => {
                const isSelected = selectedBranchId === branch.id;
                return (
                  <button
                    key={branch.id}
                    onClick={() => focusOnBranch(branch)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500 text-amber-950 ring-1 ring-amber-500/25"
                        : "bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1 w-full">
                      <span className="font-serif font-black text-xs leading-snug line-clamp-1">
                        {branch.name[currentLang]}
                      </span>
                      <span className={`text-[8px] font-mono uppercase tracking-wider font-bold shrink-0 px-1.5 py-0.5 rounded-full ${
                        branch.isFlagship
                          ? "bg-amber-500/10 text-amber-800 border border-amber-500/20"
                          : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                      }`}>
                        {branch.isFlagship ? "Flagship" : "Express"}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500 line-clamp-1">
                      {branch.address[currentLang]}
                    </p>
                  </button>
                );
              })}
              {filteredBranches.length === 0 && (
                <div className="text-center py-10 text-neutral-400 text-[11px] font-mono">
                  No branches match query.
                </div>
              )}
            </div>
          </div>

          {/* Map canvas container */}
          <div className="lg:col-span-3 h-[400px] lg:h-[500px] relative">
            <div id="colombo-branches-map" className="w-full h-full z-10" />

            {/* Float overlay status badge */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-neutral-200 px-3 py-2 rounded-xl shadow-md z-30 pointer-events-none hidden sm:block">
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                </span>
                <span className="text-neutral-700 font-bold uppercase">16 Secure Branches Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Flagship Section */}
        {flagshipBranches.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-neutral-950 mb-6 flex items-center gap-2 border-b border-neutral-200 pb-3">
              <span className="h-2 w-2 rounded-full bg-amber-600"></span>
              {flagshipHeading}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flagshipBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-neutral-50/80 hover:bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 group relative"
                >
                  <div className="absolute top-4 right-4 bg-amber-500/10 text-amber-800 border border-amber-500/20 text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                    Flagship
                  </div>

                  <div>
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 mb-4 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <h3 className="text-base font-serif font-black text-neutral-950 mb-2">
                      {branch.name[currentLang]}
                    </h3>

                    <p className="text-xs text-amber-700 font-semibold mb-3">
                      {branch.status[currentLang]}
                    </p>

                    <div className="flex gap-2 text-neutral-600 text-xs leading-relaxed mb-6">
                      <MapPin className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
                      <span>{branch.address[currentLang]}</span>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-neutral-200/60 pt-4">
                    <a
                      href={`tel:${branch.phone}`}
                      className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{callNowText}: 0718 321 321</span>
                    </a>
                    <a
                      href={`https://wa.me/94718321321?text=Hello%20GBC%20Gold%20Buyers%20Colombo,%20I%20want%20to%20visit%20your%20${encodeURIComponent(branch.name.en)}%20for%20a%20valuation.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{whatsappText}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Express / Other Locations Section */}
        {expressBranches.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-neutral-950 mb-6 flex items-center gap-2 border-b border-neutral-200 pb-3">
              <span className="h-2 w-2 rounded-full bg-neutral-600"></span>
              {expressHeading}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expressBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-neutral-50/50 hover:bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span className="text-[10px] text-amber-800 bg-amber-50 font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                        Available Securely
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 mb-1.5">
                      {branch.name[currentLang]}
                    </h3>

                    <p className="text-[11px] text-neutral-500 leading-relaxed mb-4">
                      {branch.address[currentLang]}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-neutral-100 pt-3">
                    <div className="flex justify-between items-center text-[11px] font-mono text-neutral-500">
                      <span>Secure Desk Helpline:</span>
                      <a href="tel:0718321321" className="text-amber-700 font-bold hover:underline">
                        0718 321 321
                      </a>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`tel:${branch.phone}`}
                        className="py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-md text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-colors text-center"
                      >
                        <Phone className="h-3 w-3" />
                        <span>Call Now</span>
                      </a>
                      <a
                        href={`https://wa.me/94718321321?text=Hello%20GBC%20Gold%20Buyers%20Colombo,%20I%20want%20to%20arrange%20a%20valuation%20near%20your%20${encodeURIComponent(branch.name.en)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-md text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-colors text-center"
                      >
                        <MessageCircle className="h-3 w-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Safety Notice block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 z-10 relative">
        <div className="bg-amber-500/5 rounded-2xl border border-amber-500/15 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 items-start text-left">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-serif font-black text-neutral-950 text-sm">
                Secure Private Escort & Valuation Desk
              </h4>
              <p className="text-xs text-neutral-600 max-w-2xl mt-1 leading-relaxed">
                All 16 branches operate under high-security guidelines complying with the Gem and Jewellery Authority. For secure transport assistance or specialized valuation desk booking, call our central office directly.
              </p>
            </div>
          </div>
          <a
            href="tel:0718321321"
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shrink-0 transition-colors"
          >
            Hotline: 0718 321 321
          </a>
        </div>
      </div>
    </div>
  );
}
