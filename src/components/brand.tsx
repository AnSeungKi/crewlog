"use client";

import Link from "next/link";

export function Logomark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center bg-[#141413] text-[#FAF8F5]"
      style={{ width: size, height: size, borderRadius: 2 }}
      aria-hidden
    >
      <span
        className="leading-none"
        style={{ fontFamily: "var(--font-serif)", fontSize: size * 0.56 }}
      >
        C
      </span>
    </span>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="크루로그 홈">
      <Logomark />
      <span className="leading-none">
        <span
          className="block text-[19px] tracking-[-0.05em]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          크루로그
        </span>
        {!compact && (
          <span className="mt-[5px] block font-mono text-[8px] tracking-[0.32em] text-[#9A948C]">
            CREWLOG
          </span>
        )}
      </span>
    </Link>
  );
}
