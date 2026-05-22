"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  Doctor,
  CreateDoctorInput,
  PaginatedResult,
} from "@/types/nextdent";

export async function getDoctors({
  search = "",
  page = 1,
  pageSize = 10,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResult<Doctor>> {
  const supabase = await createClient();

  let query = supabase
    .from("doctors")
    .select("*, profiles!inner(*)", { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (search.trim()) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`, {
      referencedTable: "profiles",
    });
  }

  const from = (page - 1) * pageSize;
  const { data, error, count } = await query.range(from, from + pageSize - 1);

  if (error) throw new Error(error.message);

  return {
    data: data as Doctor[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function createDoctor(input: CreateDoctorInput): Promise<Doctor> {
  const supabase = await createClient();

  // Step 1: Auth user
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: { role: "doctor" },
    });

  if (authError) throw new Error(authError.message);

  const userId = authData.user.id;

  // Step 2: profiles insert
  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    role: "doctor",
    name: input.name,
    email: input.email,
    phone: input.phone || null,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(userId);
    throw new Error(profileError.message);
  }

  // Step 3: doctors insert
  const { data, error: doctorError } = await supabase
    .from("doctors")
    .insert({
      profile_id: userId,
      specialization: input.specialization || null,
      qualification: input.qualification || null,
      designation: input.designation || null,
      bio: input.bio || null,
    })
    .select("*, profiles!inner(*)")
    .single();

  if (doctorError) {
    await supabase.auth.admin.deleteUser(userId);
    throw new Error(doctorError.message);
  }

  revalidatePath("/admin/doctors");
  return data as Doctor;
}

export async function softDeleteDoctor(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: doctor } = await supabase
    .from("doctors")
    .select("profile_id")
    .eq("id", id)
    .single();

  await supabase
    .from("doctors")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (doctor) {
    await supabase
      .from("profiles")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", doctor.profile_id);
  }

  revalidatePath("/admin/doctors");
}
