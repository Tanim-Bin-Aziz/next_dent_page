"use client";

import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Medicine = {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
};

interface Props {
  invoiceNumber: string;
  invoiceDate: string;
  patient: {
    name: string;
    patientUid: string;
    phone: string;
  };
  treatment: {
    chiefComplaints: string;
    examination?: string;
    diagnosis?: string;
    plan?: string;
    status: string;
    cost: number;
  };
  medicines: Medicine[];
}

export default function InvoicePrintWrapper({
  invoiceNumber,
  invoiceDate,
  patient,
  treatment,
  medicines,
}: Props) {
  return (
    <div>
      {/* Toolbar - hidden on print */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link href="/patient/treatments">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Treatments
          </Button>
        </Link>
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" />
          Print Invoice
        </Button>
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-xl border shadow-sm p-8 max-w-3xl mx-auto print:shadow-none print:border-none print:p-0 print:max-w-none print:rounded-none">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">NextDent</h1>
            <p className="text-sm text-gray-500 mt-1">
              Dental Clinic Management System
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900">INVOICE</h2>
            <p className="text-sm font-mono text-gray-500 mt-1">
              {invoiceNumber}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">{invoiceDate}</p>
          </div>
        </div>

        {/* Patient Info */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Patient Details
          </h3>
          <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
            {[
              { label: "Name", value: patient.name },
              { label: "Patient ID", value: patient.patientUid, mono: true },
              { label: "Phone", value: patient.phone },
            ].map(({ label, value, mono }) => (
              <div key={label}>
                <p className="text-xs text-gray-500">{label}</p>
                <p
                  className={`text-sm font-semibold text-gray-900 mt-0.5 ${
                    mono ? "font-mono" : ""
                  }`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Details */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Treatment Details
          </h3>
          <div className="space-y-3">
            {[
              { label: "Chief Complaints", value: treatment.chiefComplaints },
              { label: "Examination", value: treatment.examination },
              { label: "Diagnosis", value: treatment.diagnosis },
              { label: "Treatment Plan", value: treatment.plan },
            ]
              .filter((item) => item.value)
              .map(({ label, value }) => (
                <div key={label} className="border-b pb-3 last:border-b-0">
                  <p className="text-xs font-medium text-gray-500">{label}</p>
                  <p className="text-sm text-gray-800 mt-1">{value}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Medicines */}
        {medicines.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Prescribed Medicines
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs">
                  <th className="text-left py-2 px-3 rounded-l-lg">Medicine</th>
                  <th className="text-left py-2 px-3">Dosage</th>
                  <th className="text-left py-2 px-3">Frequency</th>
                  <th className="text-left py-2 px-3 rounded-r-lg">Duration</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="py-2.5 px-3 font-medium text-gray-900">
                      {med.name}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">
                      {med.dosage ?? "—"}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">
                      {med.frequency ?? "—"}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">
                      {med.duration ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Cost Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>৳{treatment.cost.toLocaleString("en-BD")}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t pt-2">
                <span>Total Amount Due</span>
                <span>৳{treatment.cost.toLocaleString("en-BD")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t mt-8 pt-4 text-center">
          <p className="text-xs text-gray-400">
            Thank you for choosing NextDent. This is a system-generated invoice.
          </p>
        </div>
      </div>
    </div>
  );
}
