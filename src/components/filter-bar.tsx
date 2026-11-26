"use client";

import { Segmented, Tag } from "antd";
import { CATEGORIES, NEIGHBORHOODS } from "@/lib/seed";
import type { NeighborhoodId } from "@/lib/types";
import {
  useCrewlog,
  type CategoryFilter,
  type FeedSort,
  type NeighborhoodFilter,
} from "@/lib/store";

const SORTS: { label: string; value: FeedSort }[] = [
  { label: "추천", value: "recommended" },
  { label: "최신", value: "latest" },
  { label: "인기", value: "popular" },
];

export function FilterBar() {
  const { neighborhood, setNeighborhood, category, setCategory, sort, setSort, counts } =
    useCrewlog();

  const neighborhoodOptions: { label: React.ReactNode; value: NeighborhoodFilter }[] = [
    {
      value: "all",
      label: (
        <span className="flex items-center gap-1.5">
          전체
          <span className="num text-[10px] opacity-60">{counts.all}</span>
        </span>
      ),
    },
    ...NEIGHBORHOODS.map((item) => ({
      value: item.id as NeighborhoodFilter,
      label: (
        <span className="flex items-center gap-1.5">
          {item.label}
          <span className="num text-[10px] opacity-60">
            {counts[item.id as NeighborhoodId]}
          </span>
        </span>
      ),
    })),
  ];

  return (
    <div className="sticky top-16 z-30 border-y border-[#E5E0D8] bg-[#FAF8F5]">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-2.5 px-5 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
        <div className="quiet-scroll -mx-1 shrink-0 overflow-x-auto px-1 pb-0.5">
          <Segmented
            value={neighborhood}
            onChange={(value) => setNeighborhood(value as NeighborhoodFilter)}
            options={neighborhoodOptions}
            aria-label="동네 선택"
          />
        </div>

        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative min-w-0 flex-1">
          <div className="quiet-scroll flex min-w-0 items-center gap-1.5 overflow-x-auto pb-0.5 pr-4 lg:pr-0">
            <Tag.CheckableTag
              checked={category === "all"}
              onChange={() => setCategory("all")}
              style={{
                border: "1px solid #E5E0D8",
                borderRadius: 3,
                padding: "3px 10px",
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              전체
            </Tag.CheckableTag>
            {CATEGORIES.map((item) => (
              <Tag.CheckableTag
                key={item.id}
                checked={category === item.id}
                onChange={() => setCategory(item.id as CategoryFilter)}
                style={{
                  border: "1px solid #E5E0D8",
                  borderRadius: 3,
                  padding: "3px 10px",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                  color: category === item.id ? "#FAF8F5" : "#3D3A36",
                  background: category === item.id ? item.color : "transparent",
                }}
              >
                {item.label}
              </Tag.CheckableTag>
            ))}
          </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#FAF8F5] to-transparent lg:hidden" />
          </div>

          <span className="hidden h-4 w-px shrink-0 bg-[#E5E0D8] lg:block" />

          <Segmented
            size="small"
            value={sort}
            onChange={(value) => setSort(value as FeedSort)}
            options={SORTS}
            aria-label="정렬"
            className="shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
