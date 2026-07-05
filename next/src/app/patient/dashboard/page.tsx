/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  ClipboardList,
  FileText,
  ScanLine,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function PatientDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, patient_uid")
    .eq("id", user.id)
    .single();

  const { data: patient } = await supabase
    .from("patients")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!patient) redirect("/login");

  const { data: tpData } = await supabase
    .from("treatment_plans")
    .select("id")
    .eq("patient_id", patient.id)
    .is("deleted_at", null);

  const tpIds = (tpData ?? []).map((t) => t.id);

  const [
    { count: upcomingAppts },
    { count: activeTreatments },
    prescResult,
    { count: totalXrays },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("patient_id", patient.id)
      .eq("appointment_status", "upcoming")
      .is("deleted_at", null),
    supabase
      .from("treatment_plans")
      .select("*", { count: "exact", head: true })
      .eq("patient_id", patient.id)
      .eq("status", "active")
      .is("deleted_at", null),
    tpIds.length > 0
      ? supabase
          .from("prescriptions")
          .select("*", { count: "exact", head: true })
          .in("treatment_plan_id", tpIds)
          .is("deleted_at", null)
      : Promise.resolve({ count: 0 }),
    supabase
      .from("xrays")
      .select("*", { count: "exact", head: true })
      .eq("patient_id", patient.id)
      .is("deleted_at", null),
  ]);

  const stats = [
    {
      label: "Upcoming Appointments",
      value: upcomingAppts ?? 0,
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Active Treatments",
      value: activeTreatments ?? 0,
      icon: ClipboardList,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Prescriptions",
      value: (prescResult as any).count ?? 0,
      icon: FileText,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
    {
      label: "X-Rays on File",
      value: totalXrays ?? 0,
      icon: ScanLine,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
    },
  ];

  const firstName = profile?.name?.split(" ")[0] ?? "Patient";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Patient ID:{" "}
          <span className="font-mono font-medium text-gray-700">
            {profile?.patient_uid}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
          <Card key={label} className={cn("border", border)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {value}
                  </p>
                </div>
                <div className={cn("p-3 rounded-xl", bg)}>
                  <Icon className={cn("h-5 w-5", color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <div className="flex items-start gap-3">
          <Activity className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Your health records are here
            </p>
            <p className="text-sm text-blue-700 mt-0.5">
              View your appointments, treatment plans, prescriptions, and X-rays
              from the sidebar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
