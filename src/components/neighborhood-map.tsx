"use client";

import { useEffect, useMemo, useState } from "react";
import { App, Button, Empty, Tag, Tooltip } from "antd";
import { GiftFilled, ThunderboltFilled } from "@ant-design/icons";
import { MAP_HEIGHT, MAP_SPECS, MAP_WIDTH, toLeft, toTop } from "@/lib/map";
import { NEIGHBORHOODS, categoryOf, neighborhoodOf } from "@/lib/seed";
import { clock, dayBadge } from "@/lib/format";
import { useCrewlog } from "@/lib/store";
import type { NeighborhoodId } from "@/lib/types";

/* deterministic block generator so server and client draw the same city */
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: "light" | "deep";
  footprints: { x: number; y: number; w: number; h: number }[];
}

function buildBlocks(seed: number): Block[] {
  const rng = mulberry32(seed);
  const cols = 6;
  const rows = 4;
  const cw = MAP_WIDTH / cols;
  const ch = MAP_HEIGHT / rows;
  const out: Block[] = [];

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const insetX = 5 + rng() * 7;
      const insetY = 5 + rng() * 7;
      const w = cw - insetX * 2 - rng() * 4;
      const h = ch - insetY * 2 - rng() * 4;
      const x = c * cw + insetX;
      const y = r * ch + insetY;
      const footprints: Block["footprints"] = [];
      if (rng() > 0.3) {
        const count = 1 + Math.floor(rng() * 3);
        for (let k = 0; k < count; k += 1) {
          const fw = w * (0.18 + rng() * 0.32);
          const fh = h * (0.16 + rng() * 0.32);
          footprints.push({
            x: x + 4 + rng() * Math.max(1, w - fw - 8),
            y: y + 4 + rng() * Math.max(1, h - fh - 8),
            w: fw,
            h: fh,
          });
        }
      }
      out.push({ x, y, w, h, tone: rng() > 0.78 ? "deep" : "light", footprints });
    }
  }
  return out;
}

export function NeighborhoodMap() {
  const {
    neighborhood,
    setNeighborhood,
    meetupsIn,
    sponsors,
    participantCount,
    spotsLeft,
    joined,
    toggleJoin,
    openCoupon,
    openDetail,
    isBoosted,
    openBoost,
  } = useCrewlog();
  const { message } = App.useApp();

  const active: NeighborhoodId = neighborhood === "all" ? "seongsu" : neighborhood;
  const spec = MAP_SPECS[active];
  const blocks = useMemo(() => buildBlocks(spec.seed), [spec.seed]);

  const pins = useMemo(() => meetupsIn(active), [meetupsIn, active]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(null);
  }, [active]);

  const selected = pins.find((meetup) => meetup.id === selectedId) ?? pins[0] ?? null;
  const sponsor = sponsors.find((item) => item.neighborhoodId === active);

  const handleJoin = (meetupId: string) => {
    if (!joined[meetupId] && spotsLeft(meetupId) <= 0) {
      message.warning("자리가 모두 찼습니다. 다음 번개를 기다려 주세요.");
      return;
    }
    toggleJoin(meetupId);
    message.success(joined[meetupId] ? "참여를 취소했습니다." : "참여했습니다. 시간에 봐요.");
  };

  return (
    <div className="overflow-hidden border border-[#E5E0D8] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[#E5E0D8] px-4 py-3">
        <div>
          <p className="eyebrow">NEIGHBOURHOOD MAP</p>
          <p
            className="mt-0.5 text-[17px] tracking-[-0.03em]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {neighborhoodOf(active).label}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-[#9A948C]">
            {neighborhoodOf(active).note}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {NEIGHBORHOODS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setNeighborhood(item.id)}
                title={item.label}
                className="num grid h-7 w-8 place-items-center border text-[10px] transition-colors"
                style={{
                  borderColor: isActive ? "#141413" : "#E5E0D8",
                  background: isActive ? "#141413" : "transparent",
                  color: isActive ? "#FAF8F5" : "#6B6660",
                  borderRadius: 3,
                }}
              >
                {item.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------- canvas ---------------- */}
      <div className="relative h-[330px] w-full overflow-hidden bg-[#F4F0E9] sm:h-[380px] lg:h-[400px]">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#F4F0E9" />

          {blocks.map((block, index) => (
            <g key={`b-${index}`}>
              <rect
                x={block.x}
                y={block.y}
                width={block.w}
                height={block.h}
                rx={2}
                fill={block.tone === "deep" ? "#F1ECE2" : "#FAF7F1"}
                stroke="#E6E0D5"
                strokeWidth={1}
              />
              {block.footprints.map((footprint, fIndex) => (
                <rect
                  key={`f-${index}-${fIndex}`}
                  x={footprint.x}
                  y={footprint.y}
                  width={footprint.w}
                  height={footprint.h}
                  fill="none"
                  stroke="#E3DCD0"
                  strokeWidth={1}
                />
              ))}
            </g>
          ))}

          {spec.parks.map((park, index) => (
            <g key={`p-${index}`}>
              <rect
                x={park.x}
                y={park.y}
                width={park.w}
                height={park.h}
                rx={5}
                fill={park.tone === "sand" ? "#EDE6D6" : "#E6EADE"}
                stroke={park.tone === "sand" ? "#DFD5BF" : "#D9E0D0"}
                strokeWidth={1}
              />
              {Array.from({ length: 5 }).map((_, t) => (
                <circle
                  key={`t-${index}-${t}`}
                  cx={park.x + 14 + ((t * 37 + index * 13) % Math.max(20, park.w - 24))}
                  cy={park.y + 14 + ((t * 23 + index * 17) % Math.max(16, park.h - 24))}
                  r={3.2}
                  fill="none"
                  stroke={park.tone === "sand" ? "#D6C9AE" : "#C9D4BE"}
                  strokeWidth={1}
                />
              ))}
            </g>
          ))}

          {spec.greenway && (
            <g>
              <line
                x1={spec.greenway.x1}
                y1={spec.greenway.y1}
                x2={spec.greenway.x2}
                y2={spec.greenway.y2}
                stroke="#D9E0D0"
                strokeWidth={spec.greenway.width + 2}
              />
              <line
                x1={spec.greenway.x1}
                y1={spec.greenway.y1}
                x2={spec.greenway.x2}
                y2={spec.greenway.y2}
                stroke="#EBEFE2"
                strokeWidth={spec.greenway.width}
              />
              <line
                x1={spec.greenway.x1}
                y1={spec.greenway.y1}
                x2={spec.greenway.x2}
                y2={spec.greenway.y2}
                stroke="#C9D4BE"
                strokeWidth={1}
                strokeDasharray="3 6"
              />
            </g>
          )}

          {spec.roads.map((road, index) => (
            <g key={`r-${index}`}>
              <line
                x1={road.x1}
                y1={road.y1}
                x2={road.x2}
                y2={road.y2}
                stroke="#DDD6C9"
                strokeWidth={road.width + 2}
              />
              <line
                x1={road.x1}
                y1={road.y1}
                x2={road.x2}
                y2={road.y2}
                stroke="#FBF9F5"
                strokeWidth={road.width}
              />
              {road.tone === "avenue" && (
                <line
                  x1={road.x1}
                  y1={road.y1}
                  x2={road.x2}
                  y2={road.y2}
                  stroke="#E9E1D3"
                  strokeWidth={1}
                  strokeDasharray="8 8"
                />
              )}
            </g>
          ))}

          {spec.waterPath && (
            <g>
              <path d={spec.waterPath} fill="#DFE7E5" stroke="#D1DCD9" strokeWidth={1} />
              <path
                d={spec.waterPath}
                fill="none"
                stroke="#CBD8D5"
                strokeWidth={1}
                strokeDasharray="12 10"
                transform="translate(0, 26)"
              />
              <path
                d={spec.waterPath}
                fill="none"
                stroke="#D3DEDB"
                strokeWidth={1}
                strokeDasharray="6 14"
                transform="translate(0, 52)"
              />
            </g>
          )}
        </svg>

        {/* html labels keep type crisp at every size */}
        {spec.roads
          .filter((road) => road.label)
          .map((road, index) => (
            <span
              key={`rl-${index}`}
              className="pointer-events-none absolute whitespace-nowrap font-mono text-[9px] tracking-[0.14em] text-[#A8A096]"
              style={{
                left: `${((road.labelX ?? 0) / MAP_WIDTH) * 100}%`,
                top: `${((road.labelY ?? 0) / MAP_HEIGHT) * 100}%`,
                transform: `translate(-50%, -50%) rotate(${road.rotate ?? 0}deg)`,
              }}
            >
              {road.label}
            </span>
          ))}

        {spec.parks
          .filter((park) => park.label)
          .map((park, index) => (
            <span
              key={`pl-${index}`}
              className="pointer-events-none absolute whitespace-nowrap font-mono text-[9px] tracking-[0.12em] text-[#9AA48D]"
              style={{
                left: `${((park.x + park.w / 2) / MAP_WIDTH) * 100}%`,
                top: `${((park.y + park.h - 12) / MAP_HEIGHT) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {park.label}
            </span>
          ))}

        {spec.greenway && (
          <span
            className="pointer-events-none absolute whitespace-nowrap font-mono text-[9px] tracking-[0.12em] text-[#9AA48D]"
            style={{
              left: `${((spec.greenway.x1 + spec.greenway.x2) / 2 / MAP_WIDTH) * 100}%`,
              top: `${((spec.greenway.y1 + spec.greenway.y2) / 2 / MAP_HEIGHT) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${spec.greenway.rotate}deg)`,
            }}
          >
            {spec.greenway.label}
          </span>
        )}

        {spec.waterLabel && (
          <span
            className="pointer-events-none absolute whitespace-nowrap text-[13px] tracking-[0.34em] text-[#8FA5A2]"
            style={{
              left: `${(spec.waterLabel.x / MAP_WIDTH) * 100}%`,
              top: `${(spec.waterLabel.y / MAP_HEIGHT) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${spec.waterLabel.rotate ?? 0}deg)`,
              fontFamily: "var(--font-serif)",
            }}
          >
            {spec.waterLabel.text}
          </span>
        )}

        {/* meetup pins */}
        {pins.map((meetup, index) => {
          const spot = spec.pinSpots[index % spec.pinSpots.length];
          const category = categoryOf(meetup.categoryId);
          const isSelected = selected?.id === meetup.id;
          const capped = spotsLeft(meetup.id) <= 0;
          return (
            <Tooltip
              key={meetup.id}
              title={`${meetup.title} · ${dayBadge(meetup.startsAt)} ${clock(meetup.startsAt)}`}
            >
              <button
                type="button"
                onClick={() => setSelectedId(meetup.id)}
                className="group absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
                style={{
                  left: toLeft(spot.x),
                  top: toTop(spot.y),
                  zIndex: isSelected ? 20 : 10,
                }}
                aria-label={`${meetup.title} 핀`}
              >
                <span
                  className="flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-[3px] font-mono text-[10px] transition-all"
                  style={{
                    background: isSelected ? "#141413" : "#FFFFFF",
                    color: isSelected ? "#FAF8F5" : "#141413",
                    borderColor: isSelected ? "#141413" : capped ? "#DCD5C9" : "#CFC7BA",
                    boxShadow: isSelected
                      ? "0 6px 14px rgba(20,20,19,0.18)"
                      : "0 1px 2px rgba(20,20,19,0.06)",
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: category.color }}
                  />
                  {participantCount(meetup.id)}/{meetup.capacity}
                  {isBoosted(meetup.id) && (
                    <ThunderboltFilled style={{ fontSize: 8, color: "#E84A27" }} />
                  )}
                </span>
                <span
                  className="block h-3 w-px"
                  style={{ background: isSelected ? "#141413" : "#C9C1B4" }}
                />
                <span
                  className="block h-[7px] w-[7px] rounded-full border"
                  style={{
                    background: isSelected ? "#E84A27" : "#FAF8F5",
                    borderColor: isSelected ? "#E84A27" : "#B9B1A3",
                  }}
                />
              </button>
            </Tooltip>
          );
        })}

        {/* partner pin */}
        {sponsor && (
          <Tooltip title={`${sponsor.name} · ${sponsor.benefit}`}>
            <button
              type="button"
              onClick={() => openCoupon(sponsor.id)}
              className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
              style={{ left: toLeft(sponsor.x), top: toTop(sponsor.y) }}
              aria-label={`${sponsor.name} 제휴 핀`}
            >
              <span
                className="flex items-center gap-1 whitespace-nowrap rounded-[3px] px-1.5 py-[3px] text-[9.5px] font-medium tracking-tight"
                style={{ background: "#1F5E4B", color: "#F1F5F2" }}
              >
                <GiftFilled style={{ fontSize: 9 }} />
                제휴
              </span>
              <span className="block h-2.5 w-px bg-[#1F5E4B]" />
              <span className="block h-[6px] w-[6px] rotate-45 border border-[#1F5E4B] bg-[#FAF8F5]" />
            </button>
          </Tooltip>
        )}

        {/* map furniture */}
        <span className="pointer-events-none absolute left-3 top-3 font-mono text-[9px] tracking-[0.18em] text-[#B3ABA0]">
          {spec.corner.split(" · ")[0]}
        </span>
        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-3 font-mono text-[9px] text-[#A8A096]">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#141413]" /> 번개
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-[#1F5E4B]" /> 제휴
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-[#D9E0D0]" /> 공원
          </span>
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 flex flex-col items-end gap-1">
          <span className="font-mono text-[9px] text-[#A8A096]">{spec.corner}</span>
          <span className="flex items-center gap-1 font-mono text-[8px] text-[#B3ABA0]">
            <span className="block h-px w-8 bg-[#B3ABA0]" /> 200m
          </span>
        </div>
      </div>

      {/* ---------------- selected meetup ---------------- */}
      <div className="border-t border-[#E5E0D8] px-4 py-3.5">
        {selected ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: categoryOf(selected.categoryId).color }}
                />
                <span className="eyebrow text-[#6B6660]">
                  {categoryOf(selected.categoryId).label} · {dayBadge(selected.startsAt)}{" "}
                  {clock(selected.startsAt)}
                </span>
                {isBoosted(selected.id) && (
                  <Tag
                    bordered={false}
                    style={{
                      background: "#FBEDE8",
                      color: "#C43E1F",
                      fontSize: 9,
                      lineHeight: "16px",
                      padding: "0 6px",
                    }}
                  >
                    부스트
                  </Tag>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-[14px] font-medium leading-snug text-[#141413]">
                {selected.title}
              </p>
              <p className="num mt-0.5 truncate text-[11px] text-[#6B6660]">
                {selected.place} · {participantCount(selected.id)}/{selected.capacity}명 ·{" "}
                {spotsLeft(selected.id) > 0
                  ? `${spotsLeft(selected.id)}자리 남음`
                  : "마감"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Button size="small" onClick={() => openDetail(selected.id)}>
                자세히
              </Button>
              {selected.hostId === "u1" && !isBoosted(selected.id) && (
                <Button size="small" onClick={() => openBoost(selected.id)}>
                  부스트
                </Button>
              )}
              <Button
                size="small"
                type={joined[selected.id] ? "default" : "primary"}
                danger={joined[selected.id]}
                disabled={!joined[selected.id] && spotsLeft(selected.id) <= 0}
                onClick={() => handleJoin(selected.id)}
              >
                {joined[selected.id]
                  ? "참여 취소"
                  : spotsLeft(selected.id) > 0
                    ? "참여하기"
                    : "마감"}
              </Button>
            </div>
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-[12px] text-[#9A948C]">
                이 동네에 열린 번개가 아직 없습니다
              </span>
            }
            style={{ margin: "8px 0" }}
          />
        )}
      </div>
    </div>
  );
}
