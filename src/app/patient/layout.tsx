import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PatientSidebar from "@/components/patients/patient-sidebar";

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name, patient_uid")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "patient") redirect("/login");

  return (
    <div className="flex h-screen bg-gray-50">
      <PatientSidebar
        userName={profile.name}
        patientUid={profile.patient_uid}
      />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
