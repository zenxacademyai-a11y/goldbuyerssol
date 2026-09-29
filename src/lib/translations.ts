export type Language = "en" | "si" | "ta";

export interface TranslationDictionary {
  fullName: string;
  tagline: string;
  home: string;
  services: string;
  branches: string;
  about: string;
  contact: string;
  admin: string;
  calculator: string;
  calcTitle: string;
  liveRatesTitle: string;
  liveRatesSubtitle: string;
  footerDesc: string;
  footerRights: string;
  callNow: string;
  karat: string;
  purity: string;
  perGram: string;
  perPavan: string;
  lastUpdated: string;
  ratesDisclaimer: string;
  processTitle: string;
  processSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  whyTitle: string;
  whySubtitle: string;
  why1Title: string;
  why1Desc: string;
  why2Title: string;
  why2Desc: string;
  why3Title: string;
  why3Desc: string;
  why4Title: string;
  why4Desc: string;
  contactTitle: string;
  contactSubtitle: string;
  addressLabel: string;
  phoneLabel: string;
  hoursLabel: string;
  landmarkLabel: string;
  parkingLabel: string;
  formName: string;
  formPhone: string;
  formEmail: string;
  formMessage: string;
  submitForm: string;
  formSuccess: string;
  calculating: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    fullName: "Gold Buyers Colombo",
    tagline: "Highest Cash Payout for Gold in Sri Lanka",
    home: "Home",
    services: "Services",
    branches: "Branches",
    about: "About Us",
    contact: "Contact",
    admin: "Admin",
    calculator: "Calculator",
    calcTitle: "Instant Gold Calculator",
    liveRatesTitle: "Today's Live Gold Rates in Colombo",
    liveRatesSubtitle: "Real-time rates per gram and sovereign (pavan) updated continuously.",
    footerDesc: "Colombo's premier certified gold buying exchange. Transparent computerized XRF testing, instant cash payouts, and highest market rates.",
    footerRights: "All Rights Reserved. Licensed Gold Merchant in Sri Lanka.",
    callNow: "Call Hotline",
    karat: "Karat",
    purity: "Purity",
    perGram: "Per Gram (LKR)",
    perPavan: "Per Pavan (8g)",
    lastUpdated: "Last Updated",
    ratesDisclaimer: "*Rates are subject to international market fluctuations. Instant cash payout based on non-destructive XRF test.",
    processTitle: "Simple 4-Step Selling Process",
    processSubtitle: "Experience a private, secure, and transparent appraisal in under 5 minutes.",
    step1Title: "1. Visit or Book Appointment",
    step1Desc: "Walk into our secure Colombo lounge or request a VIP private appraisal session.",
    step2Title: "2. Computerized XRF Assay",
    step2Desc: "Non-destructive German spectrometer test detects exact purity without melting or scratching.",
    step3Title: "3. Instant Valuation Offer",
    step3Desc: "Our live market engine computes the highest payout based on real-time spot rates.",
    step4Title: "4. Immediate Cash or Transfer",
    step4Desc: "Receive instant cash or immediate direct bank transfer to any Sri Lankan bank account.",
    whyTitle: "Why Choose Gold Buyers Colombo",
    whySubtitle: "Setting the gold standard for integrity, precision, and customer payouts.",
    why1Title: "Highest Market Rates",
    why1Desc: "Up to 2.5% premium bonus above standard Colombo jeweller rates with zero hidden deductions.",
    why2Title: "100% Non-Destructive Testing",
    why2Desc: "State-of-the-art XRF spectrometry ensures your precious jewelry is never damaged or scratched.",
    why3Title: "Instant Cash Payout",
    why3Desc: "Walk away with cash in hand or immediate digital bank transfer within 5 minutes.",
    why4Title: "Confidential VIP Chambers",
    why4Desc: "Complete privacy and high security for your transactions in private consultation rooms.",
    contactTitle: "Get in Touch With Us",
    contactSubtitle: "Visit our flagship Colombo branch or speak to a certified valuation specialist today.",
    addressLabel: "Head Office Address",
    phoneLabel: "Customer Hotline",
    hoursLabel: "Opening Hours",
    landmarkLabel: "Landmarks Nearby",
    parkingLabel: "Customer Parking",
    formName: "Your Full Name",
    formPhone: "Phone Number",
    formEmail: "Email Address (Optional)",
    formMessage: "Tell us about your gold items (weight, karat, type)",
    submitForm: "Submit for Instant Valuation",
    formSuccess: "Thank you! Our valuation officer will contact you shortly.",
    calculating: "Calculating live market value...",
  },
  si: {
    fullName: "ගෝල්ඩ් බයර්ස් කොළඹ",
    tagline: "ශ්‍රී ලංකාවේ ඉහළම මුදල් ගෙවීම",
    home: "මුල් පිටුව",
    services: "සේවාවන්",
    branches: "ශාඛා",
    about: "අප ගැන",
    contact: "සම්බන්ධ වන්න",
    admin: "පරිපාලක",
    calculator: "කැල්කියුලේටරය",
    calcTitle: "ක්ෂණික රන් කැල්කියුලේටරය",
    liveRatesTitle: "අද කොළඹ සජීවී රන් මිල ගණන්",
    liveRatesSubtitle: "ග්‍රෑමයක සහ පවුමක සජීවී මිල ගණන් පහතින් පරීක්ෂා කරන්න.",
    footerDesc: "කොළඹ විශ්වාසනීය සහ සහතිකලත් රන් ගැනුම්කරු. පරිගණකගත XRF පරීක්ෂාව සහ ක්ෂණික මුදල් ගෙවීම.",
    footerRights: "සියලු හිමිකම් ඇවිරිණි. ශ්‍රී ලංකාවේ බලපත්‍රලාභී රන් වෙළෙන්ඳා.",
    callNow: "ඇමතුමක් ලබා දෙන්න",
    karat: "කැරට්",
    purity: "පිරිසිදුකම",
    perGram: "ග්‍රෑමයකට (රු.)",
    perPavan: "පවුමකට (8g)",
    lastUpdated: "අවසන් යාවත්කාලීන කිරීම",
    ratesDisclaimer: "*ජාත්‍යන්තර වෙළඳපල වෙනස්වීම් මත මිල ගණන් වෙනස් විය හැක.",
    processTitle: "පහසු පියවර 4කින් මුදල් ලබාගන්න",
    processSubtitle: "විනාඩි 5ක් ඇතුළත ආරක්ෂිත සහ විනිවිදභාවයෙන් යුතු ඇගයීමක් ලබාගන්න.",
    step1Title: "1. අපගේ කාර්යාලයට පැමිණෙන්න",
    step1Desc: "කොළඹ පිහිටි අපගේ සුරක්ෂිත කාර්යාලයට පැමිණෙන්න.",
    step2Title: "2. පරිගණකගත XRF පරීක්ෂාව",
    step2Desc: "හානියක් නොවන ජර්මානු තාක්ෂණයෙන් නිවැරදි රන් ප්‍රතිශතය සොයාගන්න.",
    step3Title: "3. ඉහළම වටිනාකම් මිල ගණන්",
    step3Desc: "සජීවී වෙළඳපල අනුපාත මත පදනම්ව උපරිම මුදලක් ලබාගන්න.",
    step4Title: "4. ක්ෂණික මුදල් හෝ බැංකු තැන්පතු",
    step4Desc: "අතටම මුදල් හෝ ක්ෂණික බැංකු හුවමාරුවක් ලබාගන්න.",
    whyTitle: "ඇයි ගෝල්ඩ් බයර්ස් කොළඹ තෝරාගත යුත්තේ?",
    whySubtitle: "විශ්වාසය, නිරවද්‍යතාවය සහ ඉහළම මිල සඳහා ප්‍රමුඛයා.",
    why1Title: "ඉහළම වෙළඳපල මිල",
    why1Desc: "සාමාන්‍ය රන් ආභරණ වෙළඳසැල්වලට වඩා 2.5% ක අමතර බෝනස් මුදලක්.",
    why2Title: "100% හානි නොවන පරීක්ෂාව",
    why2Desc: "නවීන XRF තාක්ෂණය මගින් ආභරණවලට කිසිදු හානියක් සිදු නොවේ.",
    why3Title: "ක්ෂණික මුදල් ගෙවීම",
    why3Desc: "විනාඩි 5කින් අතට මුදල් ලබාගැනීමේ හැකියාව.",
    why4Title: "පුද්ගලික රහස්‍යභාවය",
    why4Desc: "සම්පූර්ණ ආරක්ෂාව සහ රහස්‍යභාවය සහිත ප්‍රභූ කාමර.",
    contactTitle: "අප හා සම්බන්ධ වන්න",
    contactSubtitle: "අදම අපගේ ප්‍රධාන ශාඛාවට පැමිණෙන්න හෝ දුරකථනයෙන් අමතන්න.",
    addressLabel: "ප්‍රධාන කාර්යාල ලිපිනය",
    phoneLabel: "ක්ෂණික ඇමතුම් අංකය",
    hoursLabel: "විවෘත වේලාවන්",
    landmarkLabel: "ආසන්න සලකුණු",
    parkingLabel: "රථ ගාල",
    formName: "ඔබගේ සම්පූර්ණ නම",
    formPhone: "දුරකථන අංකය",
    formEmail: "විද්‍යුත් තැපෑල (විකල්ප)",
    formMessage: "ඔබගේ රන් ආභරණ පිළිබඳ විස්තර",
    submitForm: "ක්ෂණික තක්සේරුවක් ලබාගන්න",
    formSuccess: "ස්තූතියි! අපගේ නිලධාරියෙකු ඔබව ඉක්මනින් සම්බන්ධ කරගනු ඇත.",
    calculating: "සජීවී වටිනාකම ගණනය කරමින්...",
  },
  ta: {
    fullName: "கோல்ட் பையர்ஸ் கொழும்பு",
    tagline: "இலங்கையில் தங்கத்திற்கு அதிகபட்ச ரொக்கப் பணம்",
    home: "முகப்பு",
    services: "சேவைகள்",
    branches: "கிளைகள்",
    about: "எங்களை பற்றி",
    contact: "தொடர்பு கொள்ள",
    admin: "நிர்வாகம்",
    calculator: "கால்குலேட்டர்",
    calcTitle: "உடனடி தங்க கால்குலேட்டர்",
    liveRatesTitle: "கொழும்பில் இன்றைய நேரலை தங்க விலை",
    liveRatesSubtitle: "கிராம் மற்றும் பவுனுக்கான நேரலை விலை நிலவரம்.",
    footerDesc: "கொழும்பின் முன்னணி சான்றளிக்கப்பட்ட தங்க கொள்வனவாளர். கணினிமயப்படுத்தப்பட்ட XRF பரிசோதனை மற்றும் உடனடி பணம்.",
    footerRights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. உரிமம் பெற்ற தங்க வியாபாரி.",
    callNow: "அழைக்க",
    karat: "காரட்",
    purity: "தூய்மை",
    perGram: "ஒரு கிராம் (LKR)",
    perPavan: "ஒரு பவுன் (8g)",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",
    ratesDisclaimer: "*சர்வதேச சந்தை மாற்றங்களுக்கு ஏற்ப விலைகள் மாறலாம்.",
    processTitle: "4 எளிய படிகளில் ரொக்கப் பணம்",
    processSubtitle: "5 நிமிடங்களுக்குள் பாதுகாப்பான மற்றும் வெளிப்படையான மதிப்பீடு.",
    step1Title: "1. எங்களை அணுகவும்",
    step1Desc: "கொழும்பில் உள்ள எமது பாதுகாப்பான அலுவலகத்திற்கு வருகை தரவும்.",
    step2Title: "2. கணினிமயப்படுத்தப்பட்ட XRF சோதனை",
    step2Desc: "சேதமில்லாத ஜெர்மன் தொழில்நுட்பம் மூலம் துல்லியமான தங்க தூய்மை அறிதல்.",
    step3Title: "3. சிறந்த சந்தை மதிப்பு",
    step3Desc: "நேரலை சந்தை நிலவரப்படி அதிகபட்ச பண மதிப்பீடு.",
    step4Title: "4. உடனடி ரொக்கம் அல்லது வங்கி வைப்பு",
    step4Desc: "உடனடியாக கையில் ரொக்கம் அல்லது வங்கி பரிமாற்றம் பெறுங்கள்.",
    whyTitle: "ஏன் கோல்ட் பையர்ஸ் கொழும்பை தெரிவு செய்ய வேண்டும்?",
    whySubtitle: "நம்பிக்கை மற்றும் சிறந்த விலைக்கு முதன்மையானவர்கள்.",
    why1Title: "அதிகபட்ச சந்தை விலை",
    why1Desc: "வழக்கமான விலையை விட 2.5% கூடுதல் போனஸ் சலுகை.",
    why2Title: "100% சேதமில்லா சோதனை",
    why2Desc: "நவீன XRF முறை மூலம் நகைகளுக்கு எந்த சேதமும் ஏற்படாது.",
    why3Title: "உடனடி பணம்",
    why3Desc: "5 நிமிடத்தில் உடனடி பண பட்டுவாடா.",
    why4Title: "பாதுகாப்பான தனிப்பட்ட அறை",
    why4Desc: "முழுமையான பாதுகாப்பு மற்றும் இரகசியத்தன்மை.",
    contactTitle: "எங்களை தொடர்பு கொள்ளவும்",
    contactSubtitle: "இன்றே எமது கொழும்பு தலைமை கிளையை அணுகவும்.",
    addressLabel: "தலைமை அலுவலக முகவரி",
    phoneLabel: "வாடிக்கையாளர் அவசர தொலைபேசி",
    hoursLabel: "திறக்கும் நேரம்",
    landmarkLabel: "அருகிலுள்ள அடையாளங்கள்",
    parkingLabel: "வாகன தரிப்பிடம்",
    formName: "உங்கள் பெயர்",
    formPhone: "தொலைபேசி எண்",
    formEmail: "மின்னஞ்சல் (விருப்பத்திற்குரியது)",
    formMessage: "உங்கள் தங்க நகைகள் பற்றிய விபரம்",
    submitForm: "உடனடி மதிப்பீட்டைப் பெறுக",
    formSuccess: "நன்றி! எமது அதிகாரி விரைவில் உங்களை தொடர்புகொள்வார்.",
    calculating: "நேரலை மதிப்பு கணக்கிடப்படுகிறது...",
  },
};
