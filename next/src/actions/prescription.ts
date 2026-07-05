"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export async function createPrescription(formData: {
  treatment_plan_id: string;
  patient_id: string;
  medicines: Medicine[];
  notes?: string;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const admin = createAdminClient();

  const { data: doctor } = await admin
    .from("doctors")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (!doctor) throw new Error("Doctor not found");

  const { data, error } = await admin
    .from("prescriptions")
    .insert({
      treatment_plan_id: formData.treatment_plan_id,
      patient_id: formData.patient_id,
      doctor_id: doctor.id,
      medicines: formData.medicines,
      notes: formData.notes,
      issued_at: new Date().toISOString().split("T")[0],
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/doctor/treatments/${formData.treatment_plan_id}`);
  return data;
}

export async function deletePrescription(id: string, treatmentPlanId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("prescriptions")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/doctor/treatments/${treatmentPlanId}`);
}
