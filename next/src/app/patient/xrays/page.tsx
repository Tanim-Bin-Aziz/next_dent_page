import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ScanLine } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

export default async function PatientXraysPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: patient } = await supabase
    .from("patients")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!patient) redirect("/login");

  const { data: xrays } = await supabase
    .from("xrays")
    .select("id, label, path, created_at")
    .eq("patient_id", patient.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("xrays").getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">X-Rays</h1>
        <p className="text-gray-500 text-sm mt-1">
          Your dental imaging records
        </p>
      </div>

      {!xrays || xrays.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <ScanLine className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No X-rays found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {xrays.map((xray) => {
            const url = getPublicUrl(xray.path);
            return (
              <div
                key={xray.id}
                className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <div className="aspect-square bg-gray-900 overflow-hidden">
                    <Image
                      src={url}
                      alt={xray.label}
                      className="w-full h-full object-contain hover:opacity-90 transition-opacity"
                      width={400}
                      height={400}
                    />
                  </div>
                </a>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900">
                    {xray.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {format(new Date(xray.created_at), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
