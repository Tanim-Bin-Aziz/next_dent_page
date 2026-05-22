/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useCallback, useTransition } from "react";
import { Upload, X, FileImage, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { uploadXRay } from "@/actions/xray.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

const ACCEPTED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/dicom",
  "image/tiff",
];
const MAX_SIZE_MB = 20;

interface XRayUploadProps {
  patientId: string;
  onSuccess?: () => void;
}

interface FilePreview {
  file: File;
  url: string;
  notes: string;
  status: "pending" | "uploading" | "done" | "error";
  errorMsg?: string;
}

export function XRayUpload({ patientId, onSuccess }: XRayUploadProps) {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(incoming: File[]) {
    const valid = incoming.filter((f) => {
      if (!ACCEPTED.includes(f.type) && !f.name.endsWith(".dcm")) {
        toast.error(`${f.name}: unsupported format`);
        return false;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${f.name}: exceeds ${MAX_SIZE_MB}MB limit`);
        return false;
      }
      return true;
    });

    const previews: FilePreview[] = valid.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      notes: "",
      status: "pending",
    }));

    setFiles((prev) => [...prev, ...previews]);
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  function updateNotes(index: number, notes: string) {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, notes } : f)));
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, []);

  function handleUploadAll() {
    const pending = files.filter((f) => f.status === "pending");
    if (!pending.length) return;

    startTransition(async () => {
      const updated = [...files];

      for (let i = 0; i < updated.length; i++) {
        if (updated[i].status !== "pending") continue;
        updated[i] = { ...updated[i], status: "uploading" };
        setFiles([...updated]);

        try {
          await uploadXRay(
            patientId,
            updated[i].file,
            updated[i].notes || undefined,
          );
          updated[i] = { ...updated[i], status: "done" };
        } catch (err: any) {
          updated[i] = {
            ...updated[i],
            status: "error",
            errorMsg: err?.message,
          };
        }

        setFiles([...updated]);
      }

      const allDone = updated.every((f) => f.status === "done");
      if (allDone) {
        toast.success("All X-rays uploaded!");
        setTimeout(() => {
          setFiles([]);
          onSuccess?.();
        }, 800);
      } else {
        toast.error("Some uploads failed — check the list");
      }
    });
  }

  const pendingCount = files.filter((f) => f.status === "pending").length;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
        )}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="font-medium text-sm">Drag & drop X-rays here</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            or click to browse — JPG, PNG, DICOM, TIFF up to {MAX_SIZE_MB}MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          className="hidden"
          onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((f, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3 rounded-lg border p-3",
                f.status === "error" &&
                  "border-destructive/50 bg-destructive/5",
                f.status === "done" && "border-green-500/50 bg-green-50/50",
              )}
            >
              {/* Thumbnail */}
              <div className="shrink-0 h-16 w-16 rounded overflow-hidden bg-muted flex items-center justify-center">
                {f.file.type.startsWith("image/") ? (
                  <Image
                    src={f.url}
                    alt={f.file.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FileImage className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              {/* Info + notes */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium truncate">
                      {f.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(f.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {f.status === "uploading" && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                    {f.status === "done" && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {f.status === "error" && (
                      <span className="text-xs text-destructive">
                        {f.errorMsg}
                      </span>
                    )}
                    {f.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(i)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {f.status === "pending" && (
                  <div className="grid gap-1">
                    <Label className="text-xs">Notes (optional)</Label>
                    <Textarea
                      rows={1}
                      placeholder="e.g. Full mouth panoramic, 2024-05-22"
                      className="text-xs resize-none"
                      value={f.notes}
                      onChange={(e) => updateNotes(i, e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          <Button
            onClick={handleUploadAll}
            disabled={isPending || pendingCount === 0}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…
              </>
            ) : (
              `Upload ${pendingCount} X-ray${pendingCount !== 1 ? "s" : ""}`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
