/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAppointment } from "@/actions/appointments";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function NewAppointmentForm({
  doctors,
  patients,
}: {
  doctors: any[];
  patients: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);

    // admin এর session থেকে created_by নাও
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    try {
      await createAppointment({
        patient_id: patientId,
        doctor_id: doctorId,
        scheduled_at: new Date(fd.get("scheduled_at") as string).toISOString(),
        duration_minutes: Number(fd.get("duration_minutes")),
        notes: fd.get("notes") as string,
        created_by: user!.id,
      });
      router.push("/admin/appointments");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Patient</Label>
        <Select required onValueChange={setPatientId}>
          <SelectTrigger>
            <SelectValue placeholder="Select patient" />
          </SelectTrigger>
          <SelectContent>
            {patients.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.profile?.name} ({p.profile?.patient_uid})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Doctor</Label>
        <Select required onValueChange={setDoctorId}>
          <SelectTrigger>
            <SelectValue placeholder="Select doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.profile?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Date & Time</Label>
        <Input type="datetime-local" name="scheduled_at" required />
      </div>

      <div>
        <Label>Duration (minutes)</Label>
        <Input
          type="number"
          name="duration_minutes"
          defaultValue={30}
          min={10}
          max={120}
        />
      </div>

      <div>
        <Label>Notes (optional)</Label>
        <Textarea name="notes" placeholder="Any special notes..." />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading || !patientId || !doctorId}>
          {loading ? "Creating..." : "Create Appointment"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
