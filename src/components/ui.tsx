"use client";

import type { ReactNode } from "react";
import { CoffeeOutlined, CameraOutlined, CompassOutlined, AppstoreOutlined, ThunderboltFilled } from "@ant-design/icons";
import type { Category, CategoryId, CrewUser } from "@/lib/types";
import { categoryOf } from "@/lib/seed";

/* ------------------------------------------------------------------ *
 * avatars
 * ------------------------------------------------------------------ */

export function Avatar({
  user,
  size = 36,
  solid = false,
  ring = false,
}: {
  user: CrewUser;
  size?: number;
  solid?: boolean;
  ring?: boolean;
}) {
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center rounded-full select-none"
      style={{
        width: size,
        height: size,
        background: solid ? user.accent : `${user.accent}1F`,
        color: solid ? "#fff" : user.accent,
        fontSize: Math.round(size * 0.38),
        fontWeight: 700,
        letterSpacing: "-0.03em",
        boxShadow: ring ? "0 0 0 2px #fff" : undefined,
      }}
      aria-hidden
    >
      {user.name.slice(0, 1)}
    </span>
  );
}

export function AvatarStack({
  users,
  max = 4,
  size = 24,
}: {
  users: CrewUser[];
  max?: number;
  size?: number;
}) {
  const visible = users.slice(0, max);
  const rest = users.length - visible.length;
  return (
    <span className="flex items-center">
      {visible.map((user, index) => (
        <span
          key={user.id}
          className="relative"
          style={{ marginLeft: index === 0 ? 0 : -Math.round(size * 0.3), zIndex: 10 - index }}
        >
          <Avatar user={user} size={size} ring />
        </span>
      ))}
      {rest > 0 && (
        <span
          className="relative grid place-items-center rounded-full bg-[#F1F2F7] font-semibold text-[#6E7587] ring-2 ring-white"
          style={{ width: size, height: size, fontSize: size * 0.36, marginLeft: -Math.round(size * 0.3) }}
        >
          +{rest}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * category icon + chip
 * ------------------------------------------------------------------ */

export function CategoryGlyph({ id, size = 16 }: { id: CategoryId; size?: number }) {
  const style = { fontSize: size };
  switch (id) {
    case "running":
      return <ThunderboltFilled style={style} />;
    case "cafe":
      return <CoffeeOutlined style={style} />;
    case "hiking":
      return <CompassOutlined style={style} />;
    case "boardgame":
      return <AppstoreOutlined style={style} />;
    case "photowalk":
      return <CameraOutlined style={style} />;
    default:
      return <ThunderboltFilled style={style} />;
  }
}

export function CategoryTag({
  category,
  muted = false,
}: {
  category: Category;
  muted?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{
        background: muted ? "#F5F6FA" : category.tint,
        color: muted ? "#6E7587" : category.color,
      }}
    >
      <CategoryGlyph id={category.id} size={11} />
      {category.label}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * buttons
 * ------------------------------------------------------------------ */

export function IconButton({
  children,
  label,
  onClick,
  tone = "white",
  size = 42,
  className = "",
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  tone?: "white" | "ink" | "blue";
  size?: number;
  className?: string;
}) {
  const styles =
    tone === "ink"
      ? "bg-[#14161F] text-white"
      : tone === "blue"
        ? "bg-[#4F63FF] text-white"
        : "bg-white text-[#3A3F51] border border-[#ECEEF3]";
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`press grid place-items-center rounded-full ${styles} ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow: tone === "white" ? "0 6px 20px rgba(15, 23, 42, 0.12)" : "0 8px 20px rgba(20, 22, 31, 0.22)",
      }}
    >
      {children}
    </button>
  );
}

export function Pill({
  children,
  active = false,
  onClick,
  size = "md",
  className = "",
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className={`app-pill press ${size === "sm" ? "app-pill-sm" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * sheet header
 * ------------------------------------------------------------------ */

export function SheetHeader({
  title,
  subtitle,
  onClose,
  right,
}: {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  right?: ReactNode;
}) {
  return (
    <div className="px-5 pb-4 pt-2">
      <div className="mb-4 flex justify-center">
        <span className="sheet-grip" />
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[19px] font-bold tracking-[-0.03em] text-[#14161F]">{title}</h2>
          {subtitle && <p className="mt-1 text-[12.5px] leading-relaxed text-[#6E7587]">{subtitle}</p>}
        </div>
        {right ?? (
          onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-2 py-1 text-[12.5px] font-semibold text-[#9AA1B2] hover:text-[#14161F]"
            >
              닫기
            </button>
          )
        )}
      </div>
    </div>
  );
}

export function SectionHead({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3 px-1">
      <div>
        <h3 className="text-[15px] font-bold tracking-[-0.03em] text-[#14161F]">{title}</h3>
        {sub && <p className="mt-0.5 text-[12px] text-[#9AA1B2]">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * misc
 * ------------------------------------------------------------------ */

export function joinedLabel(categoryId: CategoryId) {
  const category = categoryOf(categoryId);
  return category.label;
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#E2E5EC] px-4 py-8 text-center text-[12.5px] leading-relaxed text-[#9AA1B2]">
      {children}
    </div>
  );
}
