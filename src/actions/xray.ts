"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const BUCKET = "xrays";

export async function uploadXRay(
  patientId: string,
  file: File,
  label?: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const filePath = `${patientId}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, 60 * 60 * 24 * 365);

  const { data, error } = await supabase
    .from("xrays")
    .insert({
      patient_id: patientId,
      file_url: urlData?.signedUrl ?? filePath,
      label: label || null,
      uploaded_by: user?.id ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/patients/${patientId}`);
  return data;
}
