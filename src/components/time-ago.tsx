"use client";

import { useEffect, useState } from "react";
import { fromNow, stamp } from "@/lib/format";

/**
 * Relative time is computed only after mount so the prerendered HTML and
 * the client render always agree. Before mount the absolute stamp shows.
 */
export function TimeAgo({ iso, className }: { iso: string; className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <span className={className} suppressHydrationWarning>
      {mounted ? fromNow(iso) : stamp(iso)}
    </span>
  );
}
