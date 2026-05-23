/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTreatmentPlan } from "@/actions/treatment";
import { toast } from "sonner";

interface Props {
  treatment: {
    id: string;
    chief_complaints: string | null;
    examination: string | null;
    diagnosis: string | null;
    plan: string | null;
    status: string | null;
  };
}

export function TreatmentInfoForm({ treatment }: Props) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    chief_complaints: treatment.chief_complaints ?? "",
    examination: treatment.examination ?? "",
    diagnosis: treatment.diagnosis ?? "",
    plan: treatment.plan ?? "",
    status: treatment.status ?? "active",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  function handleSubmit() {
    startTransition(async () => {
      try {
        await updateTreatmentPlan(treatment.id, form);
        toast.success("Treatment plan updated");
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  }

  return (
    <div className="space-y-4">
      {[
        {
          name: "chief_complaints",
          label: "Chief Complaints",
          placeholder: "Patient's main complaints...",
        },
        {
          name: "examination",
          label: "Examination Findings",
          placeholder: "Clinical examination notes...",
        },
        { name: "diagnosis", label: "Diagnosis", placeholder: "Diagnosis..." },
        {
          name: "plan",
          label: "Treatment Plan",
          placeholder: "Planned procedures, steps...",
        },
      ].map((field) => (
        <div key={field.name} className="space-y-2">
          <Label>{field.label}</Label>
          <Textarea
            name={field.name}
            value={(form as any)[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            rows={3}
          />
        </div>
      ))}

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(val) => setForm((prev) => ({ ...prev, status: val }))}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
