/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AppointmentFilters({ doctors }: { doctors: any[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function apply(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (value && value !== "all") p.set(key, value);
    else p.delete(key);
    router.push(`/admin/appointments?${p.toString()}`);
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <Input
        type="date"
        defaultValue={params.get("date") ?? ""}
        onChange={(e) => apply("date", e.target.value)}
        className="w-44"
      />

      <Select
        defaultValue={params.get("doctorId") ?? "all"}
        onValueChange={(v) => apply("doctorId", v)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Doctors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Doctors</SelectItem>
          {doctors.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {d.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={params.get("status") ?? "all"}
        onValueChange={(v) => apply("status", v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => router.push("/admin/appointments")}
      >
        Clear
      </Button>
    </div>
  );
}
