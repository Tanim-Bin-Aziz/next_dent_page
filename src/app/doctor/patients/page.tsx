import { DoctorPatientTable } from "@/components/doctors/doctor-patient-table";

export default function DoctorPatientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Patients</h1>
        <p className="text-muted-foreground text-sm">
          Search, sort, and view your patients.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <DoctorPatientTable />
      </div>
    </div>
  );
}
