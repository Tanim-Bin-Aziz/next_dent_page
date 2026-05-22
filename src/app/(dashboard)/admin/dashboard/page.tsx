import { getPatients } from "@/actions/patient.actions";
import { getDoctors } from "@/actions/doctor.actions";
import { Users, Stethoscope, CalendarClock } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard | NextDent Admin" };

export default async function AdminDashboardPage() {
  const [patientsResult, doctorsResult] = await Promise.all([
    getPatients({ pageSize: 5 }),
    getDoctors({ pageSize: 100 }),
  ]);

  const totalPatients = patientsResult.total;
  const totalDoctors = doctorsResult.total;
  const recentPatients = patientsResult.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          NextDent clinic overview
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          color="bg-blue-50 border-blue-100"
          href="/admin/patients"
        />
        <StatCard
          title="Total Doctors"
          value={totalDoctors}
          icon={<Stethoscope className="h-5 w-5 text-green-600" />}
          color="bg-green-50 border-green-100"
          href="/admin/doctors"
        />
        <StatCard
          title="Appointments"
          value="—"
          icon={<CalendarClock className="h-5 w-5 text-purple-600" />}
          color="bg-purple-50 border-purple-100"
          href="#"
        />
      </div>

      {/* Recent Patients */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold">Recent Patients</h2>
          <Link
            href="/admin/patients"
            className="text-xs text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y">
          {recentPatients.length === 0 && (
            <p className="px-6 py-8 text-sm text-center text-muted-foreground">
              No patients yet.
            </p>
          )}
          {recentPatients.map((patient) => (
            <Link
              key={patient.id}
              href={`/admin/patients/${patient.id}`}
              className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{patient.profiles.name}</p>
                <p className="text-xs text-muted-foreground">
                  {patient.profiles.phone ?? "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-primary">
                  {patient.profiles.patient_uid}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(patient.created_at).toLocaleDateString("en-BD")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  href,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl border p-5 flex items-center gap-4 hover:shadow-sm transition-shadow ${color}`}
    >
      <div className="p-2 rounded-lg bg-white/80 border">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Link>
  );
}
