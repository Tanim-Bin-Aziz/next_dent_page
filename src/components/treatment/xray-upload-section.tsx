/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveXrayRecord, deleteXray } from "@/actions/xray";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Upload, Eye } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Xray {
  id: string;
  file_url: string;
  label: string | null;
  created_at: string;
  deleted_at?: string | null;
}

interface Props {
  treatmentPlanId: string;
  patientId: string;
  xrays: Xray[];
}

export function XrayUploadSection({
  treatmentPlanId,
  patientId,
  xrays,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [label, setLabel] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${patientId}/${Date.now()}.${ext}`;

      const { error: storageError } = await supabase.storage
        .from("xrays")
        .upload(path, file, { upsert: false });
      if (storageError) throw new Error(storageError.message);

      const { data: urlData } = supabase.storage
        .from("xrays")
        .getPublicUrl(path);

      await saveXrayRecord({
        patient_id: patientId,
        file_url: urlData.publicUrl,
        label: label.trim() || undefined,
        treatmentPlanId,
      });
      toast.success("X-ray uploaded");
      setLabel("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Label (e.g. OPG, Periapical)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />

      <div
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) uploadFile(f);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-primary/50"
        }`}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {uploading ? "Uploading..." : "Drag & drop or click to upload X-ray"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {xrays.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No X-rays uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {xrays.map((xray) => (
            <div
              key={xray.id}
              className="relative group border rounded-lg overflow-hidden"
            >
              <Image
                src={xray.file_url}
                alt={xray.label ?? "X-ray"}
                className="w-full h-36 object-cover"
                width={300}
                height={144}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a href={xray.file_url} target="_blank" rel="noreferrer">
                  <Button size="icon" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                </a>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() =>
                    startTransition(async () => {
                      try {
                        await deleteXray(xray.id, treatmentPlanId);
                        toast.success("Deleted");
                      } catch (err: any) {
                        toast.error(err.message);
                      }
                    })
                  }
                  disabled={isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {xray.label && (
                <p className="text-xs text-muted-foreground p-1 truncate">
                  {xray.label}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
