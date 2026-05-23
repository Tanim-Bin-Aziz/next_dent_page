/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill } from "lucide-react";
import { format } from "date-fns";

type Medicine = {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
};

export default async function PatientPrescriptionsPage() {
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

  const { data: tpData } = await supabase
    .from("treatment_plans")
    .select("id, chief_complaints")
    .eq("patient_id", patient.id)
    .is("deleted_at", null);

  const tpIds = (tpData ?? []).map((t) => t.id);
  const tpMap = Object.fromEntries(
    (tpData ?? []).map((t) => [t.id, t.chief_complaints]),
  );

  let prescriptions: any[] = [];
  if (tpIds.length > 0) {
    const { data } = await supabase
      .from("prescriptions")
      .select("id, medicines, treatment_plan_id, created_at")
      .in("treatment_plan_id", tpIds)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    prescriptions = data ?? [];
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
        <p className="text-gray-500 text-sm mt-1">Your prescribed medicines</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Pill className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No prescriptions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((presc) => {
            const medicines = (presc.medicines as Medicine[]) ?? [];
            return (
              <Card key={presc.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium text-gray-700">
                        {tpMap[presc.treatment_plan_id] ?? "Treatment"}
                      </CardTitle>
                      <p className="text-xs text-gray-400 mt-1">
                        Issued:{" "}
                        {format(new Date(presc.created_at), "dd MMM yyyy")}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {medicines.length} medicine
                      {medicines.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs">
                        <th className="text-left py-2 px-3 rounded-l-lg">
                          Medicine
                        </th>
                        <th className="text-left py-2 px-3">Dosage</th>
                        <th className="text-left py-2 px-3">Frequency</th>
                        <th className="text-left py-2 px-3 rounded-r-lg">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map((med, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                          <td className="py-2.5 px-3 font-medium text-gray-900">
                            {med.name}
                          </td>
                          <td className="py-2.5 px-3 text-gray-600">
                            {med.dosage ?? "—"}
                          </td>
                          <td className="py-2.5 px-3 text-gray-600">
                            {med.frequency ?? "—"}
                          </td>
                          <td className="py-2.5 px-3 text-gray-600">
                            {med.duration ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
