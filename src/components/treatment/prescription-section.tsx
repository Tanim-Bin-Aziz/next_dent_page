/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createPrescription,
  deletePrescription,
  type Medicine,
} from "@/actions/prescription";
import { format } from "date-fns";
import { toast } from "sonner";

interface Prescription {
  id: string;
  medicines: Medicine[];
  notes: string | null;
  issued_at: string | null;
  deleted_at?: string | null;
}

interface Props {
  treatmentPlanId: string;
  patientId: string;
  prescriptions: Prescription[];
}

const emptyMed: Medicine = {
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

export function PrescriptionSection({
  treatmentPlanId,
  patientId,
  prescriptions,
}: Props) {
  const [open, setOpen] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([{ ...emptyMed }]);
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  const active = prescriptions.filter((p) => !p.deleted_at);

  const updateMed = (i: number, field: keyof Medicine, val: string) =>
    setMedicines((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)),
    );

  function handleCreate() {
    const valid = medicines.filter((m) => m.name.trim());
    if (!valid.length) {
      toast.error("Add at least one medicine");
      return;
    }
    startTransition(async () => {
      try {
        await createPrescription({
          treatment_plan_id: treatmentPlanId,
          patient_id: patientId,
          medicines: valid,
          notes: notes.trim() || undefined,
        });
        toast.success("Prescription created");
        setMedicines([{ ...emptyMed }]);
        setNotes("");
        setOpen(false);
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deletePrescription(id, treatmentPlanId);
        toast.success("Prescription deleted");
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{active.length} slip(s)</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" /> New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Prescription</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              {medicines.map((med, idx) => (
                <div key={idx} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Medicine {idx + 1}
                    </span>
                    {medicines.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          setMedicines((p) => p.filter((_, i) => i !== idx))
                        }
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder="Medicine name *"
                    value={med.name}
                    onChange={(e) => updateMed(idx, "name", e.target.value)}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Dosage"
                      value={med.dosage}
                      onChange={(e) => updateMed(idx, "dosage", e.target.value)}
                    />
                    <Input
                      placeholder="Frequency"
                      value={med.frequency}
                      onChange={(e) =>
                        updateMed(idx, "frequency", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Duration"
                      value={med.duration}
                      onChange={(e) =>
                        updateMed(idx, "duration", e.target.value)
                      }
                    />
                  </div>
                  <Input
                    placeholder="Instructions (e.g. After meal)"
                    value={med.instructions}
                    onChange={(e) =>
                      updateMed(idx, "instructions", e.target.value)
                    }
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMedicines((p) => [...p, { ...emptyMed }])}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Another Medicine
              </Button>
              <div className="space-y-1">
                <Label>Additional Notes</Label>
                <Textarea
                  placeholder="Extra instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleCreate}
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Prescription"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {active.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          No prescriptions yet.
        </p>
      ) : (
        <div className="space-y-4">
          {active.map((rx) => (
            <div key={rx.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Issued:{" "}
                  {rx.issued_at
                    ? format(new Date(rx.issued_at), "dd MMM yyyy")
                    : "—"}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive h-7 w-7"
                  onClick={() => handleDelete(rx.id)}
                  disabled={isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {(rx.medicines as Medicine[]).map((med, i) => (
                <div key={i} className="flex flex-wrap gap-1 items-center">
                  <span className="font-medium text-sm">{med.name}</span>
                  {med.dosage && (
                    <Badge variant="secondary">{med.dosage}</Badge>
                  )}
                  {med.frequency && (
                    <Badge variant="secondary">{med.frequency}</Badge>
                  )}
                  {med.duration && (
                    <Badge variant="outline">{med.duration}</Badge>
                  )}
                  {med.instructions && (
                    <span className="text-xs text-muted-foreground">
                      — {med.instructions}
                    </span>
                  )}
                </div>
              ))}
              {rx.notes && (
                <p className="text-xs text-muted-foreground border-t pt-2">
                  {rx.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
