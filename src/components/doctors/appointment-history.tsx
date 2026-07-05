"use client";

import { Clock } from "lucide-react";

// TODO: replace with real query, e.g.
//   const history = await getAppointments({ doctorId, status: "completed" });
// scoped to the logged-in doctor via doctor_id (RLS already restricts doctors
// to their own rows on the appointments table).
const MOCK_HISTORY = [
  {
    id: "h-1",
    patientName: "Fahim Ahmed",
    patientUid: "ND-00021",
    date: "2026-07-01",
    status: "completed" as const,
  },
  {
    id: "h-2",
    patientName: "Nusrat Jahan",
    patientUid: "ND-00019",
    date: "2026-06-29",
    status: "completed" as const,
  },
  {
    id: "h-3",
    patientName: "Tanvir Hasan",
    patientUid: "ND-00003",
    date: "2026-06-27",
    status: "cancelled" as const,
  },
];

const STATUS_STYLE: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function AppointmentHistory() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h2 className="font-semibold mb-4">Appointment History</h2>
      <div className="space-y-2">
        {MOCK_HISTORY.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{item.patientName}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {item.patientUid}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {new Date(item.date).toLocaleDateString("en-BD")}
              </span>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[item.status]}`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground italic">
        Sample data shown — will pull real history once appointments are wired
        to this doctor&apos;s account.
      </p>
    </div>
  );
}
