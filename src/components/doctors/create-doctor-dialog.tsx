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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Eye, EyeOff } from "lucide-react";
import { createDoctor } from "@/actions/doctor.actions";
import { toast } from "sonner";
import type { CreateDoctorInput } from "@/types/nextdent";

// ✅ CreateDoctorInput-এর সঠিক field নাম: name (full_name নয়)
const INITIAL: CreateDoctorInput = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  qualification: "",
  designation: "",
  bio: "",
  password: "",
};

export function CreateDoctorDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateDoctorInput>(INITIAL);
  const [showPass, setShowPass] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(field: keyof CreateDoctorInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    if (!form.name.trim()) return toast.error("Full name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!form.password || form.password.length < 8)
      return toast.error("Password must be at least 8 characters");

    startTransition(async () => {
      try {
        const doctor = await createDoctor(form);
        // ✅ name → profiles.name
        toast.success(`Doctor created: ${doctor.profiles.name}`);
        setOpen(false);
        setForm(INITIAL);
      } catch (err: unknown) {
        toast.error((err as Error)?.message ?? "Failed to create doctor");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Name */}
          <div className="grid gap-1.5">
            <Label htmlFor="d_name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="d_name"
              placeholder="Dr. Jane Smith"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="grid gap-1.5">
            <Label htmlFor="d_email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="d_email"
              type="email"
              placeholder="jane@clinic.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="d_phone">Phone</Label>
              <Input
                id="d_phone"
                placeholder="01XXXXXXXXX"
                value={form.phone ?? ""}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="d_spec">Specialization</Label>
              <Input
                id="d_spec"
                placeholder="Orthodontist"
                value={form.specialization ?? ""}
                onChange={(e) => handleChange("specialization", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="d_qual">Qualification</Label>
              <Input
                id="d_qual"
                placeholder="BDS, MDS"
                value={form.qualification ?? ""}
                onChange={(e) => handleChange("qualification", e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="d_desig">Designation</Label>
              <Input
                id="d_desig"
                placeholder="Senior Dentist"
                value={form.designation ?? ""}
                onChange={(e) => handleChange("designation", e.target.value)}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="grid gap-1.5">
            <Label htmlFor="d_bio">Bio</Label>
            <Textarea
              id="d_bio"
              rows={2}
              placeholder="Short bio / qualifications…"
              value={form.bio ?? ""}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="grid gap-1.5">
            <Label htmlFor="d_pass">
              Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="d_pass"
                type={showPass ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPass((s) => !s)}
              >
                {showPass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
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
            Add Doctor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
