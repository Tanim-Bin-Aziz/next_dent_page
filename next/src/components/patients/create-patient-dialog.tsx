"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { createPatient } from "@/actions/patient.actions";
import { toast } from "sonner";
import type { CreatePatientInput, BloodGroup } from "@/types/nextdent";

const BLOOD_GROUPS: BloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const INITIAL: CreatePatientInput = {
  name: "",
  phone: "",
  dob: "",
  sex: undefined,
  address: "",
  blood_group: undefined,
};

export function CreatePatientDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreatePatientInput>(INITIAL);
  const [isPending, startTransition] = useTransition();

  function handleChange(field: keyof CreatePatientInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value || undefined }));
  }

  function handleSubmit() {
    if (!form.name.trim()) return toast.error("Full name is required");
    if (!form.phone.trim()) return toast.error("Phone number is required");
    if (!/^01[3-9]\d{8}$/.test(form.phone))
      return toast.error("Invalid BD phone number");

    startTransition(async () => {
      try {
        // ✅ createPatient returns Patient (profiles joined)
        const patient = await createPatient(form);
        toast.success(`Patient created: ${patient.profiles.patient_uid}`);
        setOpen(false);
        setForm(INITIAL);
      } catch (err: unknown) {
        toast.error((err as Error)?.message ?? "Failed to create patient");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Full Name */}
          <div className="grid gap-1.5">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Rahim Uddin"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="grid gap-1.5">
            <Label htmlFor="phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="01XXXXXXXXX"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Login credential হবে: 01XXXXXXXXX@nextdent.internal
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* DOB */}
            <div className="grid gap-1.5">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={form.dob ?? ""}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            </div>

            {/* Sex */}
            <div className="grid gap-1.5">
              <Label>Sex</Label>
              {/* ✅ gender → sex */}
              <Select
                value={form.sex}
                onValueChange={(v) => handleChange("sex", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Blood Group */}
            <div className="grid gap-1.5">
              <Label>Blood Group</Label>
              <Select
                value={form.blood_group}
                onValueChange={(v) => handleChange("blood_group", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Marital Status */}
            <div className="grid gap-1.5">
              <Label>Marital Status</Label>
              <Select
                value={form.marital_status}
                onValueChange={(v) => handleChange("marital_status", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div className="grid gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="e.g. Gulshan, Dhaka"
              value={form.address ?? ""}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          {/* Father / Husband */}
          <div className="grid gap-1.5">
            <Label htmlFor="father_or_husband">Father / Husband Name</Label>
            <Input
              id="father_or_husband"
              placeholder="e.g. Karim Uddin"
              value={form.father_or_husband ?? ""}
              onChange={(e) =>
                handleChange("father_or_husband", e.target.value)
              }
            />
          </div>

          {/* Referred By */}
          <div className="grid gap-1.5">
            <Label htmlFor="referred_by">Referred By</Label>
            <Input
              id="referred_by"
              placeholder="e.g. Dr. Ahmed"
              value={form.referred_by ?? ""}
              onChange={(e) => handleChange("referred_by", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
