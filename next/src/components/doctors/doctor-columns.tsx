"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Doctor } from "@/types/nextdent";
import { softDeleteDoctor } from "@/actions/doctor.actions";
import { toast } from "sonner";

function ActionsCell({ doctor }: { doctor: Doctor }) {
  const router = useRouter();

  async function handleDelete() {
    // ✅ name → profiles.name
    if (!confirm(`Remove Dr. ${doctor.profiles.name}?`)) return;
    try {
      await softDeleteDoctor(doctor.id);
      toast.success("Doctor removed");
    } catch {
      toast.error("Failed to remove doctor");
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
        {/* Doctor profile page এখনো নেই তাই View বাদ দেওয়া হয়েছে */}
        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const doctorColumns: ColumnDef<Doctor>[] = [
  {
    id: "avatar",
    header: "",
    cell: ({ row }) => {
      // ✅ name → profiles.name
      const name = row.original.profiles.name;
      const initials = name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      return (
        <Avatar className="h-8 w-8">
          {/* ✅ Doctor type-এ avatar_url নেই, তাই AvatarImage বাদ */}
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    id: "name",
    header: "Name",
    // ✅ accessorKey → id + custom cell (nested field)
    cell: ({ row }) => (
      <span className="font-medium">{row.original.profiles.name}</span>
    ),
  },
  {
    id: "email",
    header: "Email",
    // ✅ email → profiles.email
    cell: ({ row }) =>
      row.original.profiles.email ?? (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: "phone",
    header: "Phone",
    // ✅ phone → profiles.phone
    cell: ({ row }) =>
      row.original.profiles.phone ?? (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "specialization",
    header: "Specialization",
    cell: ({ row }) =>
      row.original.specialization ?? (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) =>
      row.original.designation ?? (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleDateString("en-BD"),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionsCell doctor={row.original} />,
  },
];
