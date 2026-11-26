"use client";

import { Drawer } from "antd";
import { NEIGHBORHOODS } from "@/lib/seed";
import type { NeighborhoodFilter } from "@/lib/store";

export function NeighborhoodSheet({
  open,
  onClose,
  value,
  onPick,
  counts,
  total,
}: {
  open: boolean;
  onClose: () => void;
  value: NeighborhoodFilter;
  onPick: (id: NeighborhoodFilter) => void;
  counts: Record<string, number>;
  total: number;
}) {
  return (
    <Drawer open={open} onClose={onClose} placement="bottom" height="auto" rootClassName="app-sheet">
      <div className="pb-[calc(18px+env(safe-area-inset-bottom))]">
        <div className="px-5 pb-4 pt-2">
          <div className="mb-4 flex justify-center">
            <span className="sheet-grip" />
          </div>
          <h2 className="text-[19px] font-bold tracking-[-0.03em] text-[#14161F]">어느 동네를 볼까요</h2>
          <p className="mt-1 text-[12.5px] text-[#6E7587]">고르면 지도와 피드가 그 동네로 좁혀져요.</p>
        </div>
        <div className="space-y-1 px-3">
          <button
            type="button"
            onClick={() => onPick("all")}
            className="press flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left hover:bg-[#F6F7FB]"
            style={{ background: value === "all" ? "#F6F7FF" : undefined }}
          >
            <span>
              <span className="block text-[14px] font-semibold text-[#14161F]">모든 동네</span>
              <span className="block text-[11.5px] text-[#9AA1B2]">서울 네 곳을 한 번에</span>
            </span>
            <span className="tnum text-[12px] font-semibold text-[#6E7587]">{total}</span>
          </button>
          {NEIGHBORHOODS.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => onPick(n.id)}
              className="press flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left hover:bg-[#F6F7FB]"
              style={{ background: value === n.id ? "#F6F7FF" : undefined }}
            >
              <span>
                <span className="block text-[14px] font-semibold text-[#14161F]">{n.label}</span>
                <span className="block text-[11.5px] text-[#9AA1B2]">{n.note}</span>
              </span>
              <span className="tnum text-[12px] font-semibold text-[#6E7587]">{counts[n.id] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>
    </Drawer>
  );
}
