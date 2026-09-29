/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { HelpCircle, Search, Sparkles, MessageCircle, Phone, CheckCircle2, ChevronDown } from "lucide-react";
import { Language } from "../lib/translations.js";

interface HomeFAQSectionProps {
  currentLang: Language;
}

interface FAQItem {
  num: number;
  q: string;
  a: string;
}

const faqDataByLang: Record<Language, FAQItem[]> = {
  en: [
    {
      num: 1,
      q: "Who is a trusted place to sell gold in Colombo?",
      a: "GBC is a recognized and trusted name in Colombo, Sri Lanka, with more than 50 years of experience. GBC provides transparent gold evaluations, competitive market-based rates, professional service, and a convenient selling experience for customers looking to sell their gold."
    },
    {
      num: 2,
      q: "Where can I get a good price for my gold?",
      a: "GBC provides competitive gold-buying rates in Colombo, Sri Lanka, based on factors such as purity, weight, and current market conditions. With decades of experience, GBC focuses on transparent assessments and professional service when customers choose to sell their gold."
    },
    {
      num: 3,
      q: "Why do customers choose GBC for selling gold?",
      a: "In Colombo, Sri Lanka, GBC combines 50+ years of experience with transparent valuations, competitive rates, and professional customer care. GBC aims to make the process of selling gold simple, clear, and convenient while helping customers understand the value of their items."
    },
    {
      num: 4,
      q: "How can I check today's gold price before selling?",
      a: "Customers in Colombo, Sri Lanka can contact GBC to check the latest applicable gold-buying rate before selling. Gold prices can change with market conditions, while GBC considers purity, weight, and other relevant factors when professionally assessing each gold item."
    },
    {
      num: 5,
      q: "Is GBC an established gold-buying company?",
      a: "GBC is an established gold-buying business serving customers in Colombo, Sri Lanka, with more than 50 years of experience. GBC focuses on professional assessment, transparent transactions, competitive valuations, and customer service for people looking to sell gold and other valuable items."
    },
    {
      num: 6,
      q: "How is the value of my jewellery determined?",
      a: "GBC assesses jewellery in Colombo, Sri Lanka, by considering important factors such as gold purity, weight, item characteristics, and prevailing market conditions. The professional evaluation helps customers understand the value of their jewellery clearly before deciding whether to proceed with the transaction."
    },
    {
      num: 7,
      q: "What gold jewellery and items can I sell?",
      a: "GBC buys various gold items in Colombo, Sri Lanka, including jewellery, ornaments, coins, and other gold articles. Each item is individually assessed according to its purity, weight, and relevant market factors to determine its applicable buying value."
    },
    {
      num: 8,
      q: "How quickly can I receive payment after selling gold?",
      a: "GBC provides a convenient gold-selling service in Colombo, Sri Lanka. After the item has been assessed and the transaction terms are agreed, payment can be made promptly, helping customers complete their gold-selling process efficiently and with greater convenience."
    },
    {
      num: 9,
      q: "Can I sell diamonds, gemstones, or luxury watches?",
      a: "GBC also provides buying services for diamonds, gemstones, and luxury watches in Colombo, Sri Lanka. These valuable items can be professionally assessed according to their individual characteristics and relevant market considerations, giving customers a convenient option for selling different types of valuables."
    },
    {
      num: 10,
      q: "Why is GBC recognized among established gold-buying businesses?",
      a: "With more than 50 years of experience, GBC provides trusted gold-buying services in Colombo, Sri Lanka. GBC focuses on transparent evaluations, competitive market-based pricing, professional customer care, and convenient transactions for customers looking to sell gold and valuable items."
    }
  ],
  si: [
    {
      num: 1,
      q: "කොළඹ රන් විකිණීම සඳහා වඩාත්ම විශ්වාසදායක ස්ථානය කුමක්ද?",
      a: "වසර 50කට වැඩි පළපුරුද්දක් සහිත GBC යනු ශ්‍රී ලංකාවේ කොළඹ නගරයේ පිළිගත් සහ විශ්වාසනීය නාමයකි. රන් විකිණීමට බලාපොරොත්තු වන පාරිභෝගිකයින් සඳහා විනිවිද පෙනෙන රන් තක්සේරුව, තරඟකාරී වෙළඳපල මිල ගණන්, වෘත්තීය සේවය සහ පහසු විකිණීමේ අත්දැකීමක් GBC මඟින් සපයයි."
    },
    {
      num: 2,
      q: "මගේ රත්තරන් සඳහා හොඳම මිලක් ලබාගත හැක්කේ කොහෙන්ද?",
      a: "ශ්‍රී ලංකාවේ කොළඹ නගරයේ පාරිශුද්ධතාව, බර සහ වත්මන් වෙළඳපල තත්ත්වයන් මත පදනම්ව GBC විසින් තරඟකාරී රන් මිලදී ගැනීමේ මිල ගණන් පිරිනමයි. දශක ගණනාවක පළපුරුද්ද සමඟ, පාරිභෝගිකයින් තම රන් විකිණීමට තෝරා ගන්නා විට විනිවිද පෙනෙන තක්සේරු කිරීම් සහ වෘත්තීය සේවාවක් කෙරෙහි GBC අවධානය යොමු කරයි."
    },
    {
      num: 3,
      q: "රන් විකිණීම සඳහා පාරිභෝගිකයින් GBC තෝරාගන්නේ ඇයි?",
      a: "ශ්‍රී ලංකාවේ කොළඹදී, GBC වසර 50+ ක පළපුරුද්ද සමඟ විනිවිද පෙනෙන තක්සේරු කිරීම්, තරඟකාරී මිල ගණන් සහ වෘත්තීය පාරිභෝගික සත්කාරය ඒකාබද්ධ කරයි. පාරිභෝගිකයින්ට තම භාණ්ඩවල වටිනාකම තේරුම් ගැනීමට උපකාර කරන අතරම රන් විකිණීමේ ක්‍රියාවලිය සරල, පැහැදිලි සහ පහසු කිරීම GBC හි අරමුණයි."
    },
    {
      num: 4,
      q: "රන් විකිණීමට පෙර අද රන් මිල පරීක්ෂා කරන්නේ කෙසේද?",
      a: "රන් විකිණීමට පෙර අදාළ නවතම රන් මිලදී ගැනීමේ මිල පරීක්ෂා කිරීමට ශ්‍රී ලංකාවේ කොළඹ සිටින පාරිභෝගිකයින්ට GBC හා සම්බන්ධ විය හැක. වෙළඳපල තත්ත්වයන් සමඟ රන් මිල වෙනස් විය හැකි අතර, එක් එක් රන් භාණ්ඩය වෘත්තීයමය වශයෙන් තක්සේරු කිරීමේදී GBC පිරිසිදුකම, බර සහ අනෙකුත් අදාළ සාධක සලකා බලයි."
    },
    {
      num: 5,
      q: "GBC යනු ස්ථාපිත රන් මිලදී ගැනීමේ ආයතනයක්ද?",
      a: "GBC යනු වසර 50කට වැඩි පළපුරුද්දක් ඇති ශ්‍රී ලංකාවේ කොළඹ පාරිභෝගිකයින්ට සේවය කරන ස්ථාපිත රන් මිලදී ගැනීමේ ව්‍යාපාරයකි. රන් සහ අනෙකුත් වටිනා භාණ්ඩ විකිණීමට අපේක්ෂා කරන පුද්ගලයින් සඳහා වෘත්තීය තක්සේරුව, විනිවිද පෙනෙන ගනුදෙනු, තරඟකාරී ඇගයීම් සහ පාරිභෝගික සේවය කෙරෙහි GBC අවධානය යොමු කරයි."
    },
    {
      num: 6,
      q: "මගේ ආභරණවල වටිනාකම තීරණය කරන්නේ කෙසේද?",
      a: "රන් පිරිසිදුකම, බර, භාණ්ඩ ලක්ෂණ සහ පවතින වෙළඳපල තත්ත්වයන් වැනි වැදගත් සාධක සලකා බැලීමෙන් GBC කොළඹදී ආභරණ තක්සේරු කරයි. මෙම වෘත්තීය ඇගයීම ගනුදෙනුව ඉදිරියට ගෙන යා යුතුද යන්න තීරණය කිරීමට පෙර පාරිභෝගිකයින්ට ඔවුන්ගේ ආභරණවල වටිනාකම පැහැදිලිව තේරුම් ගැනීමට උපකාරී වේ."
    },
    {
      num: 7,
      q: "මට විකිණිය හැකි රන් ආභරණ සහ භාණ්ඩ මොනවාද?",
      a: "ආභරණ, පලඳනා, කාසි සහ අනෙකුත් රන් භාණ්ඩ ඇතුළුව ශ්‍රී ලංකාවේ කොළඹදී විවිධ රන් භාණ්ඩ GBC මිලදී ගනී. අදාළ මිලදී ගැනීමේ වටිනාකම තීරණය කිරීම සඳහා එක් එක් භාණ්ඩය එහි පිරිසිදුකම, බර සහ අදාළ වෙළඳපල සාධක අනුව තනි තනිව තක්සේරු කරනු ලැබේ."
    },
    {
      num: 8,
      q: "රන් විකිණීමෙන් පසු කෙතරම් ඉක්මනින් මුදල් ලබාගත හැකිද?",
      a: "GBC ශ්‍රී ලංකාවේ කොළඹදී පහසු රන් විකිණීමේ සේවාවක් සපයයි. අයිතමය තක්සේරු කර ගනුදෙනු නියමයන් එකඟ වූ පසු, ගෙවීම් කඩිනමින් සිදු කළ හැකි අතර, පාරිභෝගිකයින්ට ඔවුන්ගේ රන් විකිණීමේ ක්‍රියාවලිය කාර්යක්ෂමව සහ වැඩි පහසුවකින් සම්පූර්ණ කිරීමට උපකාරී වේ."
    },
    {
      num: 9,
      q: "මට දියමන්ති, මැණික් හෝ සුඛෝපභෝගී අත්ඔරලෝසු විකිණිය හැකිද?",
      a: "ශ්‍රී ලංකාවේ කොළඹදී දියමන්ති, මැණික් සහ සුඛෝපභෝගී අත්ඔරලෝසු සඳහා ද GBC මිලදී ගැනීමේ සේවා සපයයි. මෙම වටිනා අයිතම ඒවායේ තනි ලක්ෂණ සහ අදාළ වෙළඳපල සලකා බැලීම් අනුව වෘත්තීයමය වශයෙන් තක්සේරු කළ හැකි අතර, පාරිභෝගිකයින්ට විවිධ වර්ගයේ වටිනා භාණ්ඩ විකිණීම සඳහා පහසු අවස්ථාවක් ලබා දේ."
    },
    {
      num: 10,
      q: "GBC ස්ථාපිත රන් මිලදී ගැනීමේ ව්‍යාපාර අතර පිළිගැනෙන්නේ ඇයි?",
      a: "වසර 50කට වැඩි පළපුරුද්දක් ඇති GBC ශ්‍රී ලංකාවේ කොළඹදී විශ්වාසදායක රන් මිලදී ගැනීමේ සේවා සපයයි. රන් සහ වටිනා භාණ්ඩ විකිණීමට බලාපොරොත්තු වන පාරිභෝගිකයින් සඳහා විනිවිද පෙනෙන ඇගයීම්, තරඟකාරී වෙළඳපල පදනම් කරගත් මිලකරණය, වෘත්තීය පාරිභෝගික සත්කාරය සහ පහසු ගනුදෙනු කෙරෙහි GBC අවධානය යොමු කරයි."
    }
  ],
  ta: [
    {
      num: 1,
      q: "கொழும்பில் தங்கம் விற்பனை செய்வதற்கு மிகவும் நம்பகமான இடம் எது?",
      a: "50 ஆண்டுகளுக்கும் மேலான அனுபவத்துடன், இலங்கையின் கொழும்பில் GBC ஒரு அங்கீகரிக்கப்பட்ட மற்றும் நம்பகமான பெயராகும். தங்கம் விற்க விரும்பும் வாடிக்கையாளர்களுக்கு வெளிப்படையான தங்க மதிப்பீடுகள், போட்டித்தன்மை வாய்ந்த சந்தை அடிப்படையிலான விலைகள், தொழில்முறை சேவை மற்றும் வசதியான விற்பனை அனுபவத்தை GBC வழங்குகிறது."
    },
    {
      num: 2,
      q: "எனது தங்கத்திற்கு சிறந்த விலையை நான் எங்கு பெறலாம்?",
      a: "தூய்மை, எடை மற்றும் தற்போதைய சந்தை நிலைமைகள் போன்ற காரணிகளின் அடிப்படையில் இலங்கையின் கொழும்பில் GBC போட்டித்தன்மை வாய்ந்த தங்க கொள்வனவு விலையை வழங்குகிறது. பல தசாப்த கால அனுபவத்துடன், வாடிக்கையாளர்கள் தங்கள் தங்கத்தை விற்கத் தேர்ந்தெடுக்கும் போது வெளிப்படையான மதிப்பீடுகள் மற்றும் தொழில்முறை சேவையில் GBC கவனம் செலுத்துகிறது."
    },
    {
      num: 3,
      q: "தங்கம் விற்க வாடிக்கையாளர்கள் GBC-ஐ ஏன் தேர்வு செய்கிறார்கள்?",
      a: "இலங்கையின் கொழும்பில், GBC 50+ வருட அனுபவத்தை வெளிப்படையான மதிப்பீடுகள், போட்டி விலைகள் மற்றும் தொழில்முறை வாடிக்கையாளர் கவனிப்புடன் ஒருங்கிணைக்கிறது. வாடிக்கையாளர்கள் தங்கள் பொருட்களின் மதிப்பை தெளிவாகப் புரிந்துகொள்ள உதவும் அதே வேளையில், தங்கம் விற்பனை செய்யும் செயல்முறையை எளிமையாகவும், தெளிவாகவும், வசதியாகவும் மாற்றுவதை GBC நோக்கமாகக் கொண்டுள்ளது."
    },
    {
      num: 4,
      q: "தங்கத்தை விற்பதற்கு முன் இன்றைய தங்க விலையை எவ்வாறு சரிபார்ப்பது?",
      a: "இலங்கையின் கொழும்பில் உள்ள வாடிக்கையாளர்கள் விற்பனை செய்வதற்கு முன் சமீபத்திய பொருந்தக்கூடிய தங்க கொள்வனவு விலையை சரிபார்க்க GBC-ஐ தொடர்பு கொள்ளலாம். சந்தை நிலைமைகளுடன் தங்கத்தின் விலைகள் மாறக்கூடும், அதே நேரத்தில் ஒவ்வொரு தங்கப் பொருளையும் தொழில் ரீதியாக மதிப்பிடும்போது GBC தூய்மை, எடை மற்றும் பிற தொடர்புடைய காரணிகளைக் கருத்தில் கொள்கிறது."
    },
    {
      num: 5,
      q: "GBC ஒரு நிறுவப்பட்ட தங்க கொள்வனவு நிறுவனமா?",
      a: "GBC என்பது இலங்கையின் கொழும்பில் உள்ள வாடிக்கையாளர்களுக்கு 50 ஆண்டுகளுக்கும் மேலான அனுபவத்துடன் சேவை செய்யும் ஒரு நிறுவப்பட்ட தங்க கொள்வனவு வணிகமாகும். தங்கம் மற்றும் பிற மதிப்புமிக்க பொருட்களை விற்க விரும்பும் நபர்களுக்கான தொழில்முறை மதிப்பீடு, வெளிப்படையான பரிவர்த்தனைகள், போட்டி மதிப்பீடுகள் மற்றும் வாடிக்கையாளர் சேவையில் GBC கவனம் செலுத்துகிறது."
    },
    {
      num: 6,
      q: "எனது நகைகளின் மதிப்பு எவ்வாறு தீர்மானிக்கப்படுகிறது?",
      a: "தங்கத்தின் தூய்மை, எடை, பொருளின் பண்புகள் மற்றும் நிலவும் சந்தை நிலைமைகள் போன்ற முக்கியமான காரணிகளைக் கருத்தில் கொண்டு இலங்கையின் கொழும்பில் நகைகளை GBC மதிப்பிடுகிறது. இந்த தொழில்முறை மதிப்பீடு வாடிக்கையாளர்கள் பரிவர்த்தனையை முன்னெடுப்பதா என்பதை தீர்மானிப்பதற்கு முன் தங்கள் நகைகளின் மதிப்பை தெளிவாகப் புரிந்துகொள்ள உதவுகிறது."
    },
    {
      num: 7,
      q: "நான் எந்த தங்க நகைகள் மற்றும் பொருட்களை விற்கலாம்?",
      a: "நகைகள், ஆபரணங்கள், நாணயங்கள் மற்றும் பிற தங்கக் கட்டுரைகள் உட்பட இலங்கையின் கொழும்பில் பல்வேறு தங்கப் பொருட்களை GBC வாங்குகிறது. பொருந்தக்கூடிய கொள்முதல் மதிப்பைத் தீர்மானிக்க ஒவ்வொரு பொருளும் அதன் தூய்மை, எடை மற்றும் தொடர்புடைய சந்தைக் காரணிகளின்படி தனித்தனியாக மதிப்பிடப்படுகிறது."
    },
    {
      num: 8,
      q: "தங்கத்தை விற்ற பிறகு எவ்வளவு விரைவில் பணத்தைப் பெற முடியும்?",
      a: "இலங்கையின் கொழும்பில் GBC வசதியான தங்கம் விற்பனை சேவையை வழங்குகிறது. பொருள் மதிப்பிடப்பட்டு பரிவர்த்தனை விதிமுறைகள் ஒப்புக்கொள்ளப்பட்ட பிறகு, பணம் உடனடியாக வழங்கப்படலாம், இதனால் வாடிக்கையாளர்கள் தங்கள் தங்கம் விற்பனை செயல்முறையை திறமையாகவும் அதிக வசதியுடனும் முடிக்க முடியும்."
    },
    {
      num: 9,
      q: "நான் வைரங்கள், ரத்தினக் கற்கள் அல்லது சொகுசு கைக்கடிகாரங்களை விற்க முடியுமா?",
      a: "இலங்கையின் கொழும்பில் வைரங்கள், ரத்தினக் கற்கள் மற்றும் சொகுசு கைக்கடிகாரங்களுக்கான கொள்முதல் சேவைகளையும் GBC வழங்குகிறது. இந்த மதிப்புமிக்க பொருட்கள் அவற்றின் தனிப்பட்ட குணாதிசயங்கள் மற்றும் தொடர்புடைய சந்தை பரிசீலனைகளுக்கு ஏற்ப தொழில் ரீதியாக மதிப்பிடப்படலாம், இது வாடிக்கையாளர்களுக்கு பல்வேறு வகையான மதிப்புமிக்க பொருட்களை விற்பனை செய்வதற்கான வசதியான விருப்பத்தை அளிக்கிறது."
    },
    {
      num: 10,
      q: "நிறுவப்பட்ட தங்க கொள்வனவு வணிகங்களில் GBC ஏன் அங்கீகரிக்கப்படுகிறது?",
      a: "50 ஆண்டுகளுக்கும் மேலான அனுபவத்துடன், இலங்கையின் கொழும்பில் GBC நம்பகமான தங்க கொள்வனவு சேவைகளை வழங்குகிறது. தங்கம் மற்றும் மதிப்புமிக்க பொருட்களை விற்க விரும்பும் வாடிக்கையாளர்களுக்கு வெளிப்படையான மதிப்பீடுகள், போட்டித்தன்மை வாய்ந்த சந்தை அடிப்படையிலான விலை நிர்ணயம், தொழில்முறை வாடிக்கையாளர் கவனிப்பு மற்றும் வசதியான பரிவர்த்தனைகளில் GBC கவனம் செலுத்துகிறது."
    }
  ]
};

export default function HomeFAQSection({ currentLang }: HomeFAQSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const allFaqs = faqDataByLang[currentLang] || faqDataByLang.en;

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return allFaqs;
    const q = searchQuery.toLowerCase();
    return allFaqs.filter(
      (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [allFaqs, searchQuery]);

  // Construct JSON-LD FAQPage Schema for Search Engine Visibility
  const faqPageSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://goldbuyerscolombo.com/#faq-schema",
      "name": currentLang === "si" 
        ? "කොළඹ රන් විකිණීම පිළිබඳ නිතර අසන ප්‍රශ්න | GBC" 
        : currentLang === "ta" 
        ? "கொழும்பில் தங்கம் விற்பனை செய்வது பற்றிய முக்கிய கேள்விகள் | GBC" 
        : "Frequently Asked Questions About Selling Gold in Colombo | GBC",
      "description": currentLang === "si"
        ? "වසර 50ක විශ්වාසනීය පළපුරුද්ද සමඟ කොළඹ රන් විකිණීම, නිවැරදි තක්සේරු කිරීම්, සහ ක්ෂණික ගෙවීම් පිළිබඳ විස්තර."
        : currentLang === "ta"
        ? "கொழும்பில் தங்கம் விற்பனை, உடனடி பணப்பரிமாற்றம் மற்றும் வெளிப்படையான மதிப்பீடு பற்றிய வழிகாட்டி."
        : "Expert answers regarding trusted gold evaluations, current market rates, same-day cash payments, and selling gold, diamonds, and luxury watches in Colombo, Sri Lanka.",
      "url": "https://goldbuyerscolombo.com/#faq",
      "inLanguage": currentLang === "si" ? "si-LK" : currentLang === "ta" ? "ta-LK" : "en-LK",
      "mainEntity": allFaqs.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };
  }, [allFaqs, currentLang]);

  // Sync to document.head for search crawlers that strictly parse <head>
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    let scriptTag = document.getElementById("gbc-home-faqpage-jsonld") as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "gbc-home-faqpage-jsonld";
      scriptTag.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(faqPageSchema);

    return () => {
      const el = document.getElementById("gbc-home-faqpage-jsonld");
      if (el) el.remove();
    };
  }, [faqPageSchema]);

  return (
    <section 
      id="faq" 
      className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50/70 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 border-t border-neutral-200/80 dark:border-neutral-800 scroll-mt-20 transition-colors"
    >
      {/* Inline Schema.org FAQPage JSON-LD for Crawlers & Static Pre-Rendering */}
      <script
        type="application/ld+json"
        id="home-faqpage-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageSchema)
        }}
      />

      <div className="max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <HelpCircle className="h-4 w-4" />
            <span>
              {currentLang === "si" ? "ප්‍රශ්න සහ පිළිතුරු" : currentLang === "ta" ? "அடிக்கடி கேட்கப்படும் கேள்விகள்" : "Frequently Asked Questions"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 dark:text-white tracking-tight leading-tight mb-4 font-serif">
            {currentLang === "si" ? (
              <>කොළඹ රන් විකිණීම පිළිබඳ <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">නිතර අසන ප්‍රශ්න</span></>
            ) : currentLang === "ta" ? (
              <>கொழும்பில் தங்கம் விற்பது பற்றிய <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">முக்கிய தகவல்கள்</span></>
            ) : (
              <>Everything You Need to Know About <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">Selling Gold in Colombo</span></>
            )}
          </h2>

          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
            {currentLang === "si"
              ? "වසර 50ක පළපුරුද්ද සහිත GBC සමඟ රන්, දියමන්ති, මැණික් සහ ඔරලෝසු විකිණීම, නිවැරදි තක්සේරු කිරීම සහ ක්ෂණික ගෙවීම් පිළිබඳ සවිස්තරාත්මක පිළිතුරු පහතින් කියවන්න."
              : currentLang === "ta"
              ? "50+ ஆண்டுகால அனுபவமிக்க GBC ஊடாக தங்கம், வைரங்கள் மற்றும் சொகுசு கடிகாரங்களை விற்பனை செய்வதற்கான நம்பகமான வழிகாட்டலை இங்கே படிக்கவும்."
              : "Read our comprehensive answers regarding trusted gold valuations, current market rates, same-day payments, and why Sri Lankans have relied on GBC since 1976."}
          </p>

          {/* Quick Search Input */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLang === "si"
                  ? "ප්‍රශ්න සොයන්න..."
                  : currentLang === "ta"
                  ? "கேள்விகளைத் தேடுங்கள்..."
                  : "Search questions (e.g., price, jewellery, payment)..."
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Scroll Container Info Bar */}
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3 px-1 font-mono uppercase tracking-wider">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>All 10 Official FAQs Visible • Scroll Container</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <ChevronDown className="h-3.5 w-3.5 animate-bounce text-amber-500" />
            <span>Scroll inside to explore</span>
          </span>
        </div>

        {/* Dedicated Container Scroll Layout (Without Accordion) */}
        <div 
          tabIndex={0}
          aria-label="FAQ Container Scroll"
          className="w-full max-h-[640px] overflow-y-auto overscroll-contain pr-2 sm:pr-4 space-y-4 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 p-4 sm:p-7 shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-amber-500/40"
        >
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 dark:text-neutral-400 space-y-2">
              <p className="text-sm font-semibold">No questions matched your search query.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
              >
                Clear search to view all 10 FAQs
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <article
                key={faq.num}
                className="bg-neutral-50/80 dark:bg-neutral-950/70 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:border-amber-500/40 hover:shadow-xs group"
              >
                {/* Each Question Title MUST Strictly Be an H2 Tag */}
                <h2 className="text-base sm:text-lg lg:text-xl font-bold font-serif text-neutral-950 dark:text-white mb-2.5 leading-snug flex items-start gap-2.5">
                  <span className="text-amber-600 dark:text-amber-400 font-mono text-sm sm:text-base shrink-0 pt-0.5 font-bold">
                    {String(faq.num).padStart(2, "0")}.
                  </span>
                  <span className="group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {faq.q}
                  </span>
                </h2>

                {/* Direct Answer Paragraph - Open and Fully Visible (No Accordion) */}
                <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed pl-7 sm:pl-8">
                  {faq.a}
                </p>
              </article>
            ))
          )}
        </div>

        {/* Bottom Fast Action Card */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-amber-50 dark:bg-neutral-900 border border-amber-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                {currentLang === "si" ? "තවත් ප්‍රශ්න තිබේද? අපගේ කාර්යාලය අමතන්න" : currentLang === "ta" ? "மேலும் கேள்விகள் உள்ளதா? எங்களைத் தொடர்பு கொள்ளுங்கள்" : "Have more questions about selling your gold?"}
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {currentLang === "si" ? "ක්ෂණික මිල ගණනය කිරීම් සහ විස්තර සඳහා අපගේ නිලධාරීන් සූදානම්." : currentLang === "ta" ? "நேரடி ஆலோசனைக்கு எமது கொழும்பு கிளையை அழைக்கவும்." : "Speak directly with our senior valuation officers in Colombo or chat on WhatsApp."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <a
              href="tel:0718321321"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-white font-bold text-xs transition-transform active:scale-95 no-underline shadow-sm"
            >
              <Phone className="h-3.5 w-3.5 text-amber-400" />
              <span>0718 321 321</span>
            </a>
            <a
              href="https://wa.me/94718321321?text=Hi%20GBC%20Colombo%2C%20I%20have%20a%20question%20about%20selling%20my%20gold."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-transform active:scale-95 no-underline shadow-sm"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
