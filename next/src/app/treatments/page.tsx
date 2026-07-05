"use client";

const treatments = [
  {
    title: "Consultation & Diagnosis",
    items: [
      "Card Entry — 1000 BDT",
      "X-ray — 300 BDT",
      "Diabetic Check — 200 BDT",
    ],
  },
  {
    title: "Teeth Cleaning & Whitening",
    items: [
      "Scaling — 3000",
      "Polishing — 2500",
      "Scaling + Polishing — 5000",
      "Air Polishing — 5000",
      "Teeth Whitening — 15000",
      "Night Bleaching — 35000",
      "Walking Bleach — 15000",
    ],
  },
  {
    title: "Minor Surgery",
    items: [
      "Tooth Extraction — 2000–12000",
      "PRF — 5000",
      "Wisdom Tooth — Consult",
      "Biopsy — 5000",
      "Apicoectomy — 18000",
      "Operculectomy — 5000",
      "Curettage — 2000",
    ],
  },
  {
    title: "Implant",
    items: ["Tooth Implant — 120000", "GBR — 40000"],
  },
  {
    title: "Root Canal (Endodontic)",
    items: [
      "RCT — 22000–25000",
      "Re-RCT — 25000",
      "Pulpotomy — 10000",
      "MTA — 5000",
      "File Retrieval — 18000",
    ],
  },
  {
    title: "Restoration / Filling",
    items: [
      "Temporary — 1000",
      "Composite — 6000–10000",
      "Aesthetic — 8000",
      "Veneer — 30000",
      "GIC — 3000",
    ],
  },
  {
    title: "Fixed Prosthesis",
    items: [
      "Metal Crown — 12000",
      "Zirconia — 25000",
      "E-max — 30000",
      "PFM — 15000",
    ],
  },
  {
    title: "Removable Denture",
    items: [
      "Partial — 6000",
      "Acrylic — 50000",
      "Flexible — 60000",
      "Thermoplastic — 50000",
    ],
  },
];

export default function TreatmentPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-10">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-10">
        Treatment Plans
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {treatments.map((cat, index) => (
          <div
            key={index}
            className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-xl p-5 hover:scale-[1.03] transition"
          >
            <h2 className="text-xl font-semibold mb-4">{cat.title}</h2>

            <ul className="space-y-2 text-sm">
              {cat.items.map((item, i) => (
                <li key={i} className="bg-white/50 rounded-lg px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
