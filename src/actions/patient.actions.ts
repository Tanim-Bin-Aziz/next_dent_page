/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  Patient,
  CreatePatientInput,
  PaginatedResult,
  XRay,
} from "@/types/nextdent";

export async function getPatients({
  search = "",
  page = 1,
  pageSize = 10,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResult<Patient>> {
  const supabase = await createClient();

  // ✅ profiles!patients_profile_id_fkey — foreign key explicitly বলে দেওয়া
  // কারণ patients table-এ profile_id ও created_by দুটোই profiles কে reference করে
  let query = supabase
    .from("patients")
    .select("*, profiles!patients_profile_id_fkey(*)", { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (search.trim()) {
    query = query.or(
      `name.ilike.%${search}%,phone.ilike.%${search}%,patient_uid.ilike.%${search}%`,
      { referencedTable: "profiles" },
    );
  }

  const from = (page - 1) * pageSize;
  const { data, error, count } = await query.range(from, from + pageSize - 1);

  if (error) throw new Error(error.message);

  return {
    data: data as Patient[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getPatientById(
  id: string,
): Promise<Patient & { xrays: XRay[] }> {
  const supabase = await createClient();

  // ✅ এখানেও same fix
  const { data, error } = await supabase
    .from("patients")
    .select("*, profiles!patients_profile_id_fkey(*), xrays(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw new Error(error.message);
  return data as any;
}

export async function createPatient(
  input: CreatePatientInput,
): Promise<Patient> {
  const supabase = await createClient();

  const internalEmail = `${input.phone}@nextdent.internal`;
  const defaultPassword = `ND@${input.phone}`;

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: internalEmail,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: { role: "patient" },
    });

  if (authError) throw new Error(authError.message);

  const userId = authData.user.id;

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    role: "patient",
    name: input.name,
    phone: input.phone,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(userId);
    throw new Error(profileError.message);
  }

  const { data, error: patientError } = await supabase
    .from("patients")
    .insert({
      profile_id: userId,
      dob: input.dob || null,
      sex: input.sex || null,
      blood_group: input.blood_group || null,
      address: input.address || null,
      marital_status: input.marital_status || null,
      father_or_husband: input.father_or_husband || null,
      referred_by: input.referred_by || null,
    })
    // ✅ এখানেও fix
    .select("*, profiles!patients_profile_id_fkey(*)")
    .single();

  if (patientError) {
    await supabase.auth.admin.deleteUser(userId);
    throw new Error(patientError.message);
  }

  revalidatePath("/admin/patients");
  return data as Patient;
}

export async function softDeletePatient(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("patients")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  const { data: patient } = await supabase
    .from("patients")
    .select("profile_id")
    .eq("id", id)
    .single();

  if (patient) {
    await supabase
      .from("profiles")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", patient.profile_id);
  }

  revalidatePath("/admin/patients");
}
