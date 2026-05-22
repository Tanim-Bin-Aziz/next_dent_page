"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Patient } from "@/types/nextdent";
import { softDeletePatient } from "@/actions/patient.actions";
import { toast } from "sonner";

const BLOOD_COLOR: Record<string, string> = {
  "A+": "bg-red-100 text-red-700",
  "B+": "bg-blue-100 text-blue-700",
  "AB+": "bg-purple-100 text-purple-700",
  "O+": "bg-green-100 text-green-700",
};

function ActionsCell({ patient }: { patient: Patient }) {
  const router = useRouter();
  async function handleDelete() {
    if (!confirm(`Delete ${patient.profiles.name}?`)) return;
    try {
      await softDeletePatient(patient.id);
      toast.success("Patient removed");
    } catch {
      toast.error("Failed to delete");
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/admin/patients/${patient.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" /> View Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const patientColumns: ColumnDef<Patient>[] = [
  {
    id: "patient_uid",
    header: "Patient ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium text-primary">
        {row.original.profiles.patient_uid}
      </span>
    ),
  },
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.profiles.name}</span>
    ),
  },
  {
    id: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.profiles.phone ?? "—",
  },
  {
    accessorKey: "sex",
    header: "Sex",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.sex ?? "—"}</span>
    ),
  },
  {
    accessorKey: "blood_group",
    header: "Blood",
    cell: ({ row }) => {
      const bg = row.original.blood_group;
      if (!bg) return <span className="text-muted-foreground">—</span>;
      return (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${BLOOD_COLOR[bg] ?? "bg-muted"}`}
        >
          {bg}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Registered",
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleDateString("en-BD"),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionsCell patient={row.original} />,
  },
];
