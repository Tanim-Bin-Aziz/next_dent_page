import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Hash, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function PatientProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, patient_uid, phone, created_at")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const fields = [
    { icon: User, label: "Full Name", value: profile.name },
    { icon: Hash, label: "Patient ID", value: profile.patient_uid, mono: true },
    { icon: Phone, label: "Phone Number", value: profile.phone ?? "—" },
    { icon: Shield, label: "Role", value: "Patient" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Your personal information</p>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Avatar card */}
        <div className="flex items-center gap-4 p-6 bg-white rounded-xl border shadow-sm">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">
              {profile.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-sm font-mono text-gray-500 mt-0.5">
              {profile.patient_uid}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Member since {new Date(profile.created_at).getFullYear()}
            </p>
          </div>
        </div>

        {/* Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {fields.map(({ icon: Icon, label, value, mono }) => (
              <div
                key={label}
                className="flex items-center gap-4 py-3 border-b last:border-b-0"
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Icon className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p
                    className={`text-sm font-medium text-gray-900 mt-0.5 ${
                      mono ? "font-mono" : ""
                    }`}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-xs text-gray-400 text-center pb-4">
          To update your information, please contact the clinic.
        </p>
      </div>
    </div>
  );
}
