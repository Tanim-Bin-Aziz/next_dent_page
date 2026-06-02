"use client";

import Image from "next/image";
import { ScanLine } from "lucide-react";
import { useState } from "react";

interface XRayImageProps {
  src: string;
  alt: string;
}

export function XRayImage({ src, alt }: XRayImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <ScanLine className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={200}
      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
      onError={() => setHasError(true)}
    />
  );
}
