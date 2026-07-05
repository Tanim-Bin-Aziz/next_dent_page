import { PatientTable } from '@/components/patients/patient-table'
import { CreatePatientDialog } from '@/components/patients/create-patient-dialog'
import { Users } from 'lucide-react'

export const metadata = { title: 'Patients | NextDent Admin' }

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
            <p className="text-sm text-muted-foreground">Manage all registered patients</p>
          </div>
        </div>
        <CreatePatientDialog />
      </div>

      {/* Table */}
      <PatientTable />
    </div>
  )
}
