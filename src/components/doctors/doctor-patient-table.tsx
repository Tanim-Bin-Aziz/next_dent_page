"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import { getPatients } from "@/actions/patient.actions";
import type { Patient } from "@/types/nextdent";
import { useDebounce } from "@/hooks/use-debounce";

const PAGE_SIZE = 8;

const BLOOD_COLOR: Record<string, string> = {
  "A+": "bg-red-100 text-red-700",
  "B+": "bg-blue-100 text-blue-700",
  "AB+": "bg-purple-100 text-purple-700",
  "O+": "bg-green-100 text-green-700",
};

export function DoctorPatientTable() {
  const router = useRouter();
  const [data, setData] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [isPending, startTransition] = useTransition();

  const debouncedSearch = useDebounce(search, 400);
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  const fetchData = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await getPatients({
          search: debouncedSearch,
          page,
          pageSize: PAGE_SIZE,
          sort,
        });
        // Defensive: skip any row whose joined profile is missing/null
        // (can happen if a profile was deleted but the patient row wasn't).
        const safeData = (result.data ?? []).filter((p) => p.profiles);
        setData(safeData);
        setTotal(result.total);
      } catch (err) {
        console.error(err);
      }
    });
  }, [debouncedSearch, page, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 whenever search or sort changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort]);

  return (
    <div className="space-y-4">
      {/* Search + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or patient ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
          className="gap-2 shrink-0"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {sort === "newest"
            ? "Newest patients first"
            : "Oldest patients first"}
        </Button>
      </div>

      {/* Table (scrollable) */}
      <div className="rounded-md border">
        <div className="max-h-[420px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Sex</TableHead>
                <TableHead>Blood</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Profile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending && data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                      No patient found.
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() =>
                      router.push(`/doctor/patients/${patient.id}`)
                    }
                  >
                    <TableCell className="font-mono text-sm font-medium text-primary">
                      {patient.profiles?.patient_uid ?? "—"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {patient.profiles?.name ?? "—"}
                    </TableCell>
                    <TableCell>{patient.profiles?.phone ?? "—"}</TableCell>
                    <TableCell className="capitalize">
                      {patient.sex ?? "—"}
                    </TableCell>
                    <TableCell>
                      {patient.blood_group ? (
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${BLOOD_COLOR[patient.blood_group] ?? "bg-muted"}`}
                        >
                          {patient.blood_group}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(patient.created_at).toLocaleDateString("en-BD")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/doctor/patients/${patient.id}`);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total === 0
            ? "No results"
            : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total} patients`}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isPending}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[5ch] text-center">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isPending}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
