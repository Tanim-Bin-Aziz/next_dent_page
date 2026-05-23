/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";

type AppointmentStatus = "upcoming" | "completed" | "cancelled";

const statusConfig: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  upcoming: {
    label: "Upcoming",
    className: "bg-blue-100 text-blue-700",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700",
  },
};

export default async function PatientAppointmentsPage() {
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

  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      `
      id,
      scheduled_at,
      appointment_status,
      notes,
      doctor:doctor_id(
        profile:profile_id(name)
      )
    `,
    )
    .eq("patient_id", patient.id)
    .is("deleted_at", null)
    .order("scheduled_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-500 text-sm mt-1">Your appointment history</p>
      </div>

      {!appointments || appointments.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No appointments found</p>
          <p className="text-sm mt-1">
            Your appointments will appear here once scheduled
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => {
            const status = appt.appointment_status as AppointmentStatus;
            const config = statusConfig[status] ?? {
              label: status,
              className: "bg-gray-100 text-gray-700",
            };
            const doctorName = (appt.doctor as any)?.profile?.name ?? "—";

            return (
              <Card key={appt.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <span
                        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${config.className}`}
                      >
                        {config.label}
                      </span>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {format(
                            new Date(appt.scheduled_at),
                            "dd MMM yyyy, hh:mm a",
                          )}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="h-4 w-4 text-gray-400" />
                          Dr. {doctorName}
                        </span>
                      </div>
                      {appt.notes && (
                        <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                          {appt.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
