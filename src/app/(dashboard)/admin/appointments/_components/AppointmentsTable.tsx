/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  updateAppointmentStatus,
  deleteAppointment,
} from "@/actions/appointments";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const statusColor: Record<string, any> = {
  upcoming: "secondary",
  confirmed: "default",
  completed: "outline",
  cancelled: "destructive",
};

export default function AppointmentsTable({
  appointments,
}: {
  appointments: any[];
}) {
  if (!appointments.length)
    return (
      <p className="text-muted-foreground text-sm">No appointments found.</p>
    );

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="p-3 text-left">Patient</th>
            <th className="p-3 text-left">Doctor</th>
            <th className="p-3 text-left">Date & Time</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Notes</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt.id} className="border-t hover:bg-muted/30">
              <td className="p-3">
                <div className="font-medium">{apt.patient?.profile?.name}</div>
                <div className="text-xs text-muted-foreground">
                  {apt.patient?.profile?.patient_uid}
                </div>
              </td>
              <td className="p-3">{apt.doctor?.profile?.name}</td>
              <td className="p-3">
                {format(new Date(apt.scheduled_at), "dd MMM yyyy, hh:mm a")}
              </td>
              <td className="p-3">
                <Badge variant={statusColor[apt.status]}>{apt.status}</Badge>
              </td>
              <td className="p-3 text-muted-foreground">{apt.notes ?? "—"}</td>
              <td className="p-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        updateAppointmentStatus(apt.id, "confirmed")
                      }
                    >
                      Confirm
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAppointmentStatus(apt.id, "completed")
                      }
                    >
                      Mark Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAppointmentStatus(apt.id, "cancelled")
                      }
                    >
                      Cancel
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => deleteAppointment(apt.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
