const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// Add useState
code = code.replace(
  'import React from "react";',
  'import React, { useState } from "react";'
);

// Add X icon
code = code.replace(
  'ChevronDown, ArrowRight } from "lucide-react";',
  'ChevronDown, ArrowRight, X } from "lucide-react";'
);

const stateAndHandler = `
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const text = \`Hi Gold Buyers Colombo,\\nI would like to book an appointment.\\nName: \${name}\\nPhone: \${phone}\\nDate: \${date}\`;
      const url = \`https://wa.me/94718321321?text=\${encodeURIComponent(text)}\`;
      window.open(url, "_blank");
      setIsModalOpen(false);
      setName("");
      setPhone("");
      setDate("");
      setIsSubmitting(false);
    }, 600);
  };
`;

code = code.replace(
  '  const services = [',
  stateAndHandler + '\n  const services = ['
);

const oldButton = `<button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 font-bold text-sm md:text-base transition-colors duration-200 shadow-sm">
            <Calendar className="h-4 w-4 text-amber-500" />
            Book Appointment
          </button>`;

const newButton = `<button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 font-bold text-sm md:text-base transition-colors duration-200 shadow-sm">
            <Calendar className="h-4 w-4 text-amber-500" />
            Book Appointment
          </button>`;

code = code.replace(oldButton, newButton);

const modalCode = `
      {/* Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 w-full max-w-md relative z-10 shadow-xl animate-fade-in pointer-events-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700">
              <X className="h-5 w-5" />
            </button>
            <div className="mb-6">
              <h3 className="text-xl font-serif font-black text-neutral-900">Book Appointment</h3>
              <p className="text-sm text-neutral-600 mt-1">Fill this out to continue to WhatsApp.</p>
            </div>
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-bold">Your Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-amber-500 transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-bold">Phone Number *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono text-neutral-900 focus:outline-none focus:border-amber-500 transition-colors" placeholder="077 123 4567" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-bold">Preferred Date/Time *</label>
                <input type="text" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Tomorrow at 10 AM" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase tracking-widest text-xs rounded-lg transition-all mt-6 shadow-sm shadow-amber-500/20">
                {isSubmitting ? "Opening WhatsApp..." : "Send via WhatsApp"}
              </button>
            </form>
          </div>
        </div>
      )}
`;

code = code.replace(
  '    </section>',
  modalCode + '\n    </section>'
);

fs.writeFileSync('src/components/Hero.tsx', code);
console.log('Fixed hero modal');
