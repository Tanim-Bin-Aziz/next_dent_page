import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { format } from "date-fns";
import InvoicePrintWrapper from "@/components/patients/invoice-print-wrapper";

type Medicine = {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
};

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: patient } = await supabase
    .from("patients")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!patient) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, patient_uid, phone")
    .eq("id", user.id)
    .single();

  // Verify treatment belongs to this patient
  const { data: treatment } = await supabase
    .from("treatment_plans")
    .select("*")
    .eq("id", id)
    .eq("patient_id", patient.id)
    .is("deleted_at", null)
    .single();

  if (!treatment) notFound();

  const { data: prescriptions } = await supabase
    .from("prescriptions")
    .select("medicines")
    .eq("treatment_plan_id", id)
    .is("deleted_at", null);

  const allMedicines = (prescriptions ?? []).flatMap(
    (p) => (p.medicines as Medicine[]) ?? [],
  );

  return (
    <InvoicePrintWrapper
      invoiceNumber={`INV-${id.slice(-8).toUpperCase()}`}
      invoiceDate={format(new Date(treatment.created_at), "dd MMMM yyyy")}
      patient={{
        name: profile?.name ?? "—",
        patientUid: profile?.patient_uid ?? "—",
        phone: profile?.phone ?? "—",
      }}
      treatment={{
        chiefComplaints: treatment.chief_complaints,
        examination: treatment.examination,
        diagnosis: treatment.diagnosis,
        plan: treatment.plan,
        status: treatment.status,
        cost: Number(treatment.cost ?? 0),
      }}
      medicines={allMedicines}
    />
  );
}
