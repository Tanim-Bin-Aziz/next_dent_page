export type UserRole = "admin" | "doctor" | "patient";

export interface Profile {
  id: string;
  role: UserRole;
  name: string;
  phone: string | null;
  email: string | null;
  patient_uid: string | null;
  created_at: string;
  deleted_at: string | null;
}
