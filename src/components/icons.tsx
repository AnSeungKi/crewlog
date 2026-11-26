"use client";

export function BookmarkIcon({ filled = false, size = 13 }: { filled?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 4.5h12v16l-6-4.2-6 4.2v-16Z" />
    </svg>
  );
}

export function BoltIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.2 2 4.8 13.4h5.1L9.2 22l8.9-11.6h-5.3L13.2 2Z" />
    </svg>
  );
}

export function LogoMark({ size = 18 }: { size?: number }) {
  return <BoltIcon size={size} />;
}
