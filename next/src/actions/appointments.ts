"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getAppointments(filters?: {
  doctorId?: string;
  status?: string;
  date?: string;
}) {
  const supabase = createAdminClient();

  let query = supabase
    .from("appointments")
    .select(
      `
      id, scheduled_at, status, notes, duration_minutes,
      patient:patient_id (
        id,
        profile:profile_id ( name, patient_uid )
      ),
      doctor:doctor_id (
        id,
        profile:profile_id ( name )
      )
    `,
    )
    .is("deleted_at", null)
    .order("scheduled_at", { ascending: false });

  if (filters?.doctorId) query = query.eq("doctor_id", filters.doctorId);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.date) {
    const start = new Date(filters.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(filters.date);
    end.setHours(23, 59, 59, 999);
    query = query
      .gte("scheduled_at", start.toISOString())
      .lte("scheduled_at", end.toISOString());
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function createAppointment(formData: {
  patient_id: string;
  doctor_id: string;
  scheduled_at: string;
  duration_minutes: number;
  notes?: string;
  created_by: string;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("appointments").insert({
    ...formData,
    status: "upcoming",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/appointments");
}

export async function updateAppointmentStatus(id: string, status: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/appointments");
}

export async function deleteAppointment(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("appointments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/appointments");
}

export async function getDoctors() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("doctors")
    .select("id, profile:profile_id ( name )")
    .is("deleted_at", null);
  if (error) throw new Error(error.message);
  return data;
}

export async function getPatients() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("patients")
    .select("id, profile:profile_id ( name, patient_uid )")
    .is("deleted_at", null);
  if (error) throw new Error(error.message);
  return data;
}
