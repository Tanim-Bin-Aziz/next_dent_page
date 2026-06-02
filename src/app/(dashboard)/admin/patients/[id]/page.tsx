/* eslint-disable react-hooks/purity */
import { notFound } from "next/navigation";
import { getPatientById } from "@/actions/patient.actions";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { XRayUpload } from "@/components/xray/xray-upload";
import { XRayImage } from "@/components/xray/xray-image";
import { ArrowLeft, User, ScanLine } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

const BLOOD_COLOR: Record<string, string> = {
  "A+": "bg-red-100 text-red-700 border-red-200",
  "B+": "bg-blue-100 text-blue-700 border-blue-200",
  "AB+": "bg-purple-100 text-purple-700 border-purple-200",
  "O+": "bg-green-100 text-green-700 border-green-200",
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm">
        {value || <span className="text-muted-foreground">—</span>}
      </span>
    </div>
  );
}

export default async function PatientProfilePage({ params }: Props) {
  const { id } = await params;

  let patient;
  try {
    patient = await getPatientById(id);
  } catch {
    notFound();
  }

  const initials = patient.profiles.name
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const age = patient.dob
    ? Math.floor(
        (Date.now() - new Date(patient.dob).getTime()) /
          (365.25 * 24 * 3600 * 1000),
      )
    : null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link
        href="/admin/patients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Patients
      </Link>

      {/* Patient Header Card */}
      <div className="rounded-xl border bg-card p-6 flex items-start gap-5">
        <Avatar className="h-16 w-16 text-lg font-semibold">
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold">{patient.profiles.name}</h1>
            <Badge variant="outline" className="font-mono text-xs">
              {patient.profiles.patient_uid}
            </Badge>
            {patient.blood_group && (
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${BLOOD_COLOR[patient.blood_group] ?? "bg-muted"}`}
              >
                {patient.blood_group}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {patient.profiles.phone}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Registered{" "}
            {new Date(patient.created_at).toLocaleDateString("en-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="xrays" className="gap-2">
            <ScanLine className="h-4 w-4" />
            X-Rays
            {patient.xrays?.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                {patient.xrays.filter((x) => !x.deleted_at).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-4">
          <div className="rounded-xl border bg-card p-6 space-y-6">
            <div>
              <h2 className="font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                <InfoRow label="Full Name" value={patient.profiles.name} />
                <InfoRow label="Phone" value={patient.profiles.phone} />
                <InfoRow
                  label="Date of Birth"
                  value={
                    patient.dob
                      ? `${new Date(patient.dob).toLocaleDateString("en-BD")}${age ? ` (${age} yrs)` : ""}`
                      : null
                  }
                />
                <InfoRow
                  label="Sex"
                  value={
                    patient.sex
                      ? patient.sex.charAt(0).toUpperCase() +
                        patient.sex.slice(1)
                      : null
                  }
                />
                <InfoRow label="Blood Group" value={patient.blood_group} />
                <InfoRow label="Address" value={patient.address} />
                <InfoRow
                  label="Marital Status"
                  value={patient.marital_status}
                />
                <InfoRow
                  label="Father / Husband"
                  value={patient.father_or_husband}
                />
                <InfoRow label="Referred By" value={patient.referred_by} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* X-Rays Tab */}
        <TabsContent value="xrays" className="mt-4 space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold mb-4">Upload X-Rays</h2>
            <XRayUpload patientId={patient.id} />
          </div>

          {patient.xrays?.filter((x) => !x.deleted_at).length > 0 && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-semibold mb-4">
                X-Ray History (
                {patient.xrays.filter((x) => !x.deleted_at).length})
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {patient.xrays
                  .filter((x) => !x.deleted_at)
                  .map((xray) => (
                    <a
                      key={xray.id}
                      href={xray.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-lg border overflow-hidden hover:border-primary/50 transition-colors"
                    >
                      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                        <XRayImage
                          src={xray.file_url}
                          alt={xray.label ?? "X-Ray"}
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">
                          {xray.label ?? "X-Ray"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(xray.created_at).toLocaleDateString(
                            "en-BD",
                          )}
                        </p>
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
