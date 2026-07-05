/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTreatmentPlanById } from "@/actions/treatment";
import { getXraysByPatient } from "@/actions/xray";
import { TreatmentInfoForm } from "@/components/treatment/treatment-info-form";
import { PrescriptionSection } from "@/components/treatment/prescription-section";
import { XrayUploadSection } from "@/components/treatment/xray-upload-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { notFound } from "next/navigation";

export default async function TreatmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let treatment;
  try {
    treatment = await getTreatmentPlanById(params.id);
  } catch {
    notFound();
  }

  const xrays = await getXraysByPatient(treatment.patient_id);
  const patient = treatment.patient as any;
  const appointment = treatment.appointment as any;
  const prescriptions = ((treatment.prescriptions as any[]) ?? []).filter(
    (p: any) => !p.deleted_at,
  );

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Treatment Plan</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>
            Patient: <strong>{patient?.profile?.name}</strong>
          </span>
          <span>·</span>
          <Badge variant="secondary">{patient?.profile?.patient_uid}</Badge>
          {appointment && (
            <>
              <span>·</span>
              <span>
                Appt:{" "}
                {format(new Date(appointment.scheduled_at), "dd MMM yyyy")}
              </span>
            </>
          )}
          <Badge
            variant={treatment.status === "completed" ? "secondary" : "default"}
          >
            {treatment.status}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Treatment Info</TabsTrigger>
          <TabsTrigger value="prescriptions">
            Prescriptions ({prescriptions.length})
          </TabsTrigger>
          <TabsTrigger value="xrays">X-rays ({xrays.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <TreatmentInfoForm treatment={treatment} />
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-4">
          <PrescriptionSection
            treatmentPlanId={treatment.id}
            patientId={treatment.patient_id}
            prescriptions={(treatment.prescriptions as any[]) ?? []}
          />
        </TabsContent>

        <TabsContent value="xrays" className="mt-4">
          <XrayUploadSection
            treatmentPlanId={treatment.id}
            patientId={treatment.patient_id}
            xrays={xrays}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
