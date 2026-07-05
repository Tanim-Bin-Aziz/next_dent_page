/* eslint-disable @typescript-eslint/no-explicit-any */
export type UserRole = "admin" | "doctor" | "patient";
export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export interface Profile {
  id: string;
  role: UserRole;
  name: string;
  phone: string | null;
  email: string | null;
  patient_uid: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// patients row + profiles join করা
export interface Patient {
  id: string;
  profile_id: string;
  dob: string | null;
  sex: string | null;
  blood_group: string | null;
  address: string | null;
  marital_status: string | null;
  father_or_husband: string | null;
  office_business: string | null;
  referred_by: string | null;
  medical_history: Record<string, any>;
  drug_history: Record<string, any>;
  personal_history: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  profiles: Profile; // joined
}

// doctors row + profiles join করা
export interface Doctor {
  id: string;
  profile_id: string;
  specialization: string | null;
  qualification: string | null;
  designation: string | null;
  bio: string | null;
  created_at: string;
  deleted_at: string | null;
  profiles: Profile; // joined
}

export interface XRay {
  id: string;
  patient_id: string;
  file_url: string;
  label: string | null;
  uploaded_by: string | null;
  created_at: string;
  deleted_at: string | null;
}

// Form inputs
export interface CreatePatientInput {
  name: string;
  phone: string;
  dob?: string;
  sex?: string;
  blood_group?: string;
  address?: string;
  marital_status?: string;
  father_or_husband?: string;
  referred_by?: string;
}

export interface CreateDoctorInput {
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  qualification?: string;
  designation?: string;
  bio?: string;
  password: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
