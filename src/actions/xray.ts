"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadXRay(
  patientId: string,
  file: File,
  label?: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const admin = createAdminClient();

  // Upload file to storage
  const ext = file.name.split(".").pop();
  const path = `${patientId}/${Date.now()}.${ext}`;

  const { error: storageError } = await admin.storage
    .from("xrays")
    .upload(path, file);

  if (storageError) throw new Error(storageError.message);

  const { data: urlData } = admin.storage.from("xrays").getPublicUrl(path);

  // Save record
  const { data, error } = await admin
    .from("xrays")
    .insert({
      patient_id: patientId,
      path,
      file_url: urlData.publicUrl,
      label: label ?? null,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/patients/${patientId}`);
  return data;
}

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

export async function deleteXray(id: string, patientId?: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("xrays")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  if (patientId) revalidatePath(`/admin/patients/${patientId}`);
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