"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveXrayRecord(formData: {
  patient_id: string;
  file_url: string;
  label?: string;
  treatmentPlanId?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("xrays")
    .insert({
      patient_id: formData.patient_id,
      file_url: formData.file_url,
      label: formData.label ?? null,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (formData.treatmentPlanId) {
    revalidatePath(`/doctor/treatments/${formData.treatmentPlanId}`);
  }
  return data;
}

export async function deleteXray(id: string, treatmentPlanId?: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("xrays")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  if (treatmentPlanId) {
    revalidatePath(`/doctor/treatments/${treatmentPlanId}`);
  }
}

export async function getXraysByPatient(patientId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("xrays")
    .select("*")
    .eq("patient_id", patientId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}