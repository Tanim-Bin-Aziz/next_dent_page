/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { createTreatmentPlan } from "@/actions/treatment";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Stethoscope } from "lucide-react";

interface Props {
  appointmentId: string;
  patientId: string;
  existingTreatmentId?: string | null;
}

export function StartTreatmentBtn({
  appointmentId,
  patientId,
  existingTreatmentId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      if (existingTreatmentId) {
        router.push(`/doctor/treatments/${existingTreatmentId}`);
        return;
      }
      const t = await createTreatmentPlan({
        appointment_id: appointmentId,
        patient_id: patientId,
        chief_complaints: "",
        examination: "",
        diagnosis: "",
        plan: "",
      });
      router.push(`/doctor/treatments/${t.id}`);
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleClick}
      disabled={loading}
    >
      <Stethoscope className="w-4 h-4 mr-1" />
      {existingTreatmentId ? "View Treatment" : "Start Treatment"}
    </Button>
  );
}
