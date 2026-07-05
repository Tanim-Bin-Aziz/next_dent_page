import DoctorSidebar from "@/components/doctors/doctor-sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "doctor") redirect("/login");

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DoctorSidebar userName={profile.name} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
