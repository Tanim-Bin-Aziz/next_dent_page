import { DoctorTable } from '@/components/doctors/doctor-table'
import { CreateDoctorDialog } from '@/components/doctors/create-doctor-dialog'
import { Stethoscope } from 'lucide-react'

export const metadata = { title: 'Doctors | NextDent Admin' }

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Stethoscope className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
            <p className="text-sm text-muted-foreground">Manage clinic doctors and staff</p>
          </div>
        </div>
        <CreateDoctorDialog />
      </div>

      <DoctorTable />
    </div>
  )
}
