/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllTreatmentPlans } from "@/actions/treatment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminTreatmentsPage() {
  const treatments = await getAllTreatmentPlans();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Treatment Plans</h1>
        <p className="text-muted-foreground text-sm">
          {treatments.length} records
        </p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-10"
                >
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              treatments.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <p className="font-medium">
                      {(t.patient as any)?.profile?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(t.patient as any)?.profile?.patient_uid}
                    </p>
                  </TableCell>
                  <TableCell>{(t.creator as any)?.name ?? "—"}</TableCell>
                  <TableCell>{t.diagnosis ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{t.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(t.created_at), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/treatments/${t.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
