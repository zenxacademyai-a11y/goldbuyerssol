import React from "react";
import { Language, translations } from "../lib/translations.js";
import Services from "./Services.js";

interface ServicesPageProps {
  currentLang: Language;
}

export default function ServicesPage({ currentLang }: ServicesPageProps) {
  return (
    <div className="pt-24 pb-12 bg-neutral-900 min-h-screen">
      <Services currentLang={currentLang} />
    </div>
  );
}
