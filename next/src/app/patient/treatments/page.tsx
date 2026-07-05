import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function PatientTreatmentsPage() {
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

  const { data: treatments } = await supabase
    .from("treatment_plans")
    .select("id, chief_complaints, diagnosis, plan, status, cost, created_at")
    .eq("patient_id", patient.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Treatment Plans</h1>
        <p className="text-gray-500 text-sm mt-1">
          Your treatment history and invoices
        </p>
      </div>

      {!treatments || treatments.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No treatment plans found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {treatments.map((tp) => (
            <Card key={tp.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          statusColors[tp.status] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {tp.status.charAt(0).toUpperCase() + tp.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {format(new Date(tp.created_at), "dd MMM yyyy")}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Chief Complaints
                      </p>
                      <p className="text-sm text-gray-800 mt-0.5">
                        {tp.chief_complaints}
                      </p>
                    </div>

                    {tp.diagnosis && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Diagnosis
                        </p>
                        <p className="text-sm text-gray-800 mt-0.5">
                          {tp.diagnosis}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-sm text-gray-500">Total Cost:</span>
                      <span className="text-base font-bold text-gray-900">
                        ৳{Number(tp.cost ?? 0).toLocaleString("en-BD")}
                      </span>
                    </div>
                  </div>

                  <Link href={`/patient/treatments/${tp.id}/invoice`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 shrink-0"
                    >
                      <FileText className="h-4 w-4" />
                      Invoice
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
