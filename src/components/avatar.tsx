"use client";

import { Avatar, Tooltip } from "antd";
import type { CrewUser } from "@/lib/types";

export function CrewAvatar({
  user,
  size = 34,
  tooltip = false,
}: {
  user: CrewUser;
  size?: number;
  tooltip?: boolean;
}) {
  const node = (
    <Avatar
      size={size}
      style={{
        background: user.accent,
        color: "#FAF8F5",
        fontFamily: "var(--font-serif)",
        fontSize: Math.round(size * 0.42),
        border: "1px solid rgba(20,20,19,0.08)",
      }}
    >
      {user.name.slice(0, 1)}
    </Avatar>
  );

  if (!tooltip) return node;
  return (
    <Tooltip title={`${user.name} · @${user.handle}`}>
      <span>{node}</span>
    </Tooltip>
  );
}

export function AvatarStack({
  users,
  max = 5,
  size = 26,
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
          style={{ marginLeft: index === 0 ? 0 : -7, zIndex: visible.length - index }}
          className="relative"
        >
          <CrewAvatar user={user} size={size} />
        </span>
      ))}
      {rest > 0 && (
        <span
          className="relative grid place-items-center rounded-full border border-[#E5E0D8] bg-[#F4F0E9] font-mono text-[10px] text-[#6B6660]"
          style={{ width: size, height: size, marginLeft: -7 }}
        >
          +{rest}
        </span>
      )}
    </span>
  );
}
