"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getCurrentProfileId(): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export async function createTreatmentPlan(formData: {
  appointment_id?: string;
  patient_id: string;
  chief_complaints: string;
  examination: string;
  diagnosis: string;
  plan: string;
}) {
  const created_by = await getCurrentProfileId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("treatment_plans")
    .insert({ ...formData, created_by, status: "active" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/doctor/treatments");
  return data;
}

export async function updateTreatmentPlan(
  id: string,
  formData: {
    chief_complaints?: string;
    examination?: string;
    diagnosis?: string;
    plan?: string;
    status?: string;
  },
) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("treatment_plans")
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/doctor/treatments");
  revalidatePath(`/doctor/treatments/${id}`);
}

export async function getTreatmentsByDoctor() {
  const created_by = await getCurrentProfileId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("treatment_plans")
    .select(
      `
      id, chief_complaints, diagnosis, status, created_at,
      patient:patient_id(
        id,
        profile:profile_id(name, patient_uid)
      ),
      appointment:appointment_id(id, scheduled_at)
    `,
    )
    .eq("created_by", created_by)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getTreatmentPlanById(id: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("treatment_plans")
    .select(
      `
      *,
      patient:patient_id(
        id,
        profile:profile_id(name, patient_uid, phone)
      ),
      creator:created_by(name),
      appointment:appointment_id(id, scheduled_at),
      prescriptions(*)
    `,
    )
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getAllTreatmentPlans() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("treatment_plans")
    .select(
      `
      id, chief_complaints, diagnosis, status, created_at,
      patient:patient_id(profile:profile_id(name, patient_uid)),
      creator:created_by(name)
    `,
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function deleteTreatmentPlan(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("treatment_plans")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/doctor/treatments");
  revalidatePath("/admin/treatments");
}

export async function getTreatmentPlanByAppointment(appointmentId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("treatment_plans")
    .select("id")
    .eq("appointment_id", appointmentId)
    .is("deleted_at", null)
    .maybeSingle();
  return data;
}
