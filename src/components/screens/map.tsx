"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { App, Drawer } from "antd";
import {
  AimOutlined,
  CheckOutlined,
  CloseOutlined,
  ControlOutlined,
  EnvironmentFilled,
  EnvironmentOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { AvatarStack, CategoryGlyph, IconButton } from "../ui";
import { NeighborhoodSheet } from "../sheets/neighborhood";
import { MeetupRow } from "../cards";
import { CATEGORIES, NEIGHBORHOODS, categoryOf } from "@/lib/seed";
import { clock, dayBadge } from "@/lib/format";
import { useCrewlog } from "@/lib/store";
import type { CategoryId, Meetup } from "@/lib/types";
import type { NeighborhoodFilter } from "@/lib/store";

const MarkerMap = dynamic(() => import("../map/marker-map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-[#EDEFF5]">
      <span className="text-[12px] text-[#9AA1B2]">지도를 불러오는 중…</span>
    </div>
  ),
});

export function MapScreen() {
  const {
    meetups,
    posts,
    sponsors,
    neighborhood,
    setNeighborhood,
    userById,
    participantCount,
    spotsLeft,
    joined,
    interested,
    toggleJoin,
    toggleInterested,
    openDetail,
    openCoupon,
    isBoosted,
  } = useCrewlog();
  const { message } = App.useApp();

  const [areaId, setAreaId] = useState<NeighborhoodFilter>(
    neighborhood === "all" ? "seongsu" : neighborhood,
  );
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nbOpen, setNbOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showPartners, setShowPartners] = useState(true);

  const area = areaId === "all" ? null : NEIGHBORHOODS.find((n) => n.id === areaId)!;
  const center = useMemo(
    () =>
      area
        ? { lat: area.lat, lng: area.lng, zoom: area.zoom }
        : { lat: 37.5445, lng: 127.0557, zoom: 12.4 },
    [area],
  );

  const inArea = useMemo(
    () => meetups.filter((m) => areaId === "all" || m.neighborhoodId === areaId),
    [meetups, areaId],
  );

  const pins = useMemo(
    () => inArea.filter((m) => category === "all" || m.categoryId === category),
    [inArea, category],
  );

  const strip = useMemo(
    () =>
      [...pins].sort(
        (a, b) =>
          Number(isBoosted(b.id)) - Number(isBoosted(a.id)) ||
          dayjs(a.startsAt).valueOf() - dayjs(b.startsAt).valueOf(),
      ),
    [pins, isBoosted],
  );

  const areaPosts = posts.filter((post) => areaId === "all" || post.neighborhoodId === areaId);
  const selected = selectedId ? meetups.find((m) => m.id === selectedId) ?? null : null;
  const areaLabel = area ? area.label : "서울 · 모든 동네";
  const partnerPins = showPartners
    ? sponsors.filter((s) => areaId === "all" || s.neighborhoodId === areaId)
    : [];

  const locate = () => {
    message.success("현재 위치 기준으로 지도를 맞췄어요.");
    setSelectedId(null);
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden md:grid md:grid-cols-[366px_minmax(0,1fr)]">
      {/* ---------------- desktop list panel ---------------- */}
      <aside className="hidden h-[100dvh] flex-col border-r border-[#ECEEF3] bg-white md:flex">
        <div className="border-b border-[#F0F2F7] px-5 pb-4 pt-6">
          <p className="text-[11.5px] font-semibold text-[#9AA1B2]">지도에서 찾기</p>
          <h1 className="mt-1 text-[21px] font-extrabold tracking-[-0.04em] text-[#14161F]">{areaLabel}</h1>
          <button
            type="button"
            onClick={() => setNbOpen(true)}
            className="press mt-3 flex w-full items-center justify-between rounded-2xl border border-[#E2E5EC] bg-[#FBFBFE] px-3.5 py-2.5 text-left"
          >
            <span className="flex items-center gap-2 text-[12.5px] font-semibold text-[#3A3F51]">
              <EnvironmentFilled style={{ color: "#4F63FF", fontSize: 12 }} />
              {area ? `${area.label} 근처` : "동네 선택"}
            </span>
            <span className="text-[11px] text-[#9AA1B2]">변경</span>
          </button>
          <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto md:flex-wrap md:overflow-visible">
            <FilterChip active={category === "all"} onClick={() => setCategory("all")} label="전체" />
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c.id}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
                label={c.label}
                color={c.color}
              />
            ))}
          </div>
        </div>

        <div className="quiet-scroll flex-1 overflow-y-auto px-3 py-3">
          <p className="px-2 pb-2 text-[11.5px] font-semibold text-[#9AA1B2]">
            {strip.length}개의 번개 · 가까운 순
          </p>
          <div className="space-y-1">
            {strip.map((meetup) => (
              <div
                key={meetup.id}
                className="rounded-2xl transition-colors"
                style={{ background: selectedId === meetup.id ? "#F4F6FF" : undefined }}
                onMouseEnter={() => setSelectedId(meetup.id)}
              >
                <MeetupRow meetup={meetup} onOpen={() => setSelectedId(meetup.id)} />
              </div>
            ))}
          </div>
        </div>

        {areaPosts.length > 0 && (
          <div className="border-t border-[#F0F2F7] px-3 pb-2 pt-3">
            <p className="px-2 pb-2 text-[11.5px] font-semibold text-[#9AA1B2]">이 동네 인증샷</p>
            <div className="space-y-0.5">
              {areaPosts.slice(0, 2).map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => post.meetupId && openDetail(post.meetupId)}
                  className="press flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left hover:bg-[#F6F7FB]"
                >
                  <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[#EDEFF5]">
                    {post.image && (
                      <Image src={post.image} alt="" fill sizes="36px" className="object-cover" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11.5px] font-semibold text-[#14161F]">
                      {post.title}
                    </span>
                    <span className="block text-[10.5px] text-[#9AA1B2]">
                      {userById(post.authorId).name} · 좋아요 {post.baseLikeCount}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-[#F0F2F7] p-3">
          <button
            type="button"
            onClick={() => partnerPins[0] && openCoupon(partnerPins[0].id)}
            className="press flex w-full items-center justify-between rounded-2xl bg-[#F7F5FE] px-3.5 py-3 text-left"
          >
            <span>
              <span className="block text-[11px] font-bold text-[#8B6BD9]">제휴 쿠폰 {partnerPins.length}곳</span>
              <span className="mt-0.5 block text-[11.5px] text-[#6E7587]">지도 위 배지를 눌러 받아보세요</span>
            </span>
            <span className="text-[12px] font-semibold text-[#8B6BD9]">보기</span>
          </button>
        </div>
      </aside>

      {/* ---------------- map ---------------- */}
      <div className="relative h-[100dvh] w-full map-attribution-lift">
        <MarkerMap
          meetups={meetups}
          sponsors={partnerPins}
          center={center}
          selectedId={selectedId}
          category={category}
          onSelect={setSelectedId}
          onSponsor={(id) => openCoupon(id)}
          mePoint={{ lat: center.lat - 0.0034, lng: center.lng - 0.0042 }}
        />

        {/* top controls */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 px-4"
          style={{ paddingTop: "calc(12px + env(safe-area-inset-top))" }}
        >
          <button
            type="button"
            onClick={() => setNbOpen(true)}
            className="press pointer-events-auto flex h-11 items-center gap-2 rounded-full bg-white pl-3.5 pr-3 text-[13.5px] font-bold text-[#14161F]"
            style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.16)" }}
          >
            <EnvironmentFilled style={{ color: "#4F63FF", fontSize: 13 }} />
            {area ? area.label : "서울 전체"}
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#9AA1B2" strokeWidth="1.8">
              <path d="m3 4.5 3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="pointer-events-auto flex gap-2">
            <IconButton label="내 위치" onClick={locate} size={44}>
              <AimOutlined style={{ fontSize: 16, color: "#3A3F51" }} />
            </IconButton>
            <IconButton label="필터" onClick={() => setFilterOpen(true)} size={44}>
              <ControlOutlined
                style={{ fontSize: 16, color: category === "all" ? "#3A3F51" : "#4F63FF" }}
              />
            </IconButton>
          </div>
        </div>

        {/* selected meetup card — floating above the map */}
        {selected && (
          <div
            className="absolute inset-x-4 z-20 rise md:hidden"
            style={{ top: "calc(70px + env(safe-area-inset-top))" }}
          >
            <SelectedCard
              meetup={selected}
              onClose={() => setSelectedId(null)}
              onOpen={() => openDetail(selected.id)}
            />
          </div>
        )}

        {/* desktop selected card sits over the map's top-left */}
        {selected && (
          <div className="absolute left-6 top-6 z-20 hidden w-[360px] rise md:block">
            <SelectedCard
              meetup={selected}
              onClose={() => setSelectedId(null)}
              onOpen={() => openDetail(selected.id)}
            />
          </div>
        )}

        {/* bottom card strip — mobile */}
        <div
          className="absolute inset-x-0 z-20 md:hidden"
          style={{ bottom: "calc(92px + env(safe-area-inset-bottom))" }}
        >
          <div className="no-scrollbar flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1">
            {strip.map((meetup) => {
              const categoryMeta = categoryOf(meetup.categoryId);
              const isActive = selectedId === meetup.id;
              return (
                <button
                  key={meetup.id}
                  type="button"
                  onClick={() => setSelectedId(meetup.id)}
                  className="press flex w-[268px] shrink-0 snap-start items-center gap-3 rounded-[18px] bg-white p-2.5 text-left"
                  style={{
                    boxShadow: isActive ? "0 10px 28px rgba(79,99,255,0.22)" : "0 8px 24px rgba(15,23,42,0.14)",
                    border: isActive ? "1.5px solid #4F63FF" : "1px solid #ECEEF3",
                  }}
                >
                  <span className="relative h-[62px] w-[62px] shrink-0 overflow-hidden rounded-[13px] bg-[#EDEFF5]">
                    {meetup.cover ? (
                      <Image src={meetup.cover} alt="" fill sizes="62px" className="object-cover" />
                    ) : (
                      <span
                        className="grid h-full w-full place-items-center"
                        style={{ background: categoryMeta.tint, color: categoryMeta.color }}
                      >
                        <CategoryGlyph id={meetup.categoryId} size={20} />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1 text-[10.5px] font-bold" style={{ color: categoryMeta.color }}>
                      {isBoosted(meetup.id) && <ThunderboltFilled style={{ fontSize: 9, color: "#4F63FF" }} />}
                      {dayBadge(meetup.startsAt)} {clock(meetup.startsAt)}
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] font-bold text-[#14161F]">{meetup.title}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-[#6E7587]">{meetup.place}</span>
                    <span className="mt-0.5 block text-[10.5px] text-[#9AA1B2]">
                      {participantCount(meetup.id)}/{meetup.capacity}명 참여
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* partner hint — mobile */}
        {partnerPins.length > 0 && (
          <div
            className="absolute left-4 z-20 md:hidden"
            style={{ bottom: "calc(196px + env(safe-area-inset-bottom))" }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[10.5px] font-semibold text-[#8B6BD9] shadow-[0_6px_18px_rgba(15,23,42,0.12)] backdrop-blur">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-[#F4F1FD] text-[10px]">%</span>
              배지를 누르면 쿠폰
            </span>
          </div>
        )}
      </div>

      <NeighborhoodSheet
        open={nbOpen}
        onClose={() => setNbOpen(false)}
        value={areaId}
        onPick={(id) => {
          setAreaId(id);
          setNeighborhood(id);
          setSelectedId(null);
          setNbOpen(false);
        }}
        counts={Object.fromEntries(
          NEIGHBORHOODS.map((n) => [n.id, meetups.filter((m) => m.neighborhoodId === n.id).length]),
        )}
        total={meetups.length}
      />

      <Drawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        placement="bottom"
        height="auto"
        rootClassName="app-sheet"
      >
        <div className="pb-[calc(22px+env(safe-area-inset-bottom))]">
          <div className="px-5 pb-4 pt-2">
            <div className="mb-4 flex justify-center">
              <span className="sheet-grip" />
            </div>
            <h2 className="text-[19px] font-bold tracking-[-0.03em] text-[#14161F]">지도 필터</h2>
            <p className="mt-1 text-[12.5px] text-[#6E7587]">종류를 고르면 핀과 목록이 바로 바뀌어요.</p>
          </div>
          <div className="px-5">
            <div className="grid grid-cols-3 gap-2">
              <FilterTile
                active={category === "all"}
                onClick={() => setCategory("all")}
                label="전체"
                color="#14161F"
                tint="#F1F2F7"
              />
              {CATEGORIES.map((c) => (
                <FilterTile
                  key={c.id}
                  active={category === c.id}
                  onClick={() => setCategory(c.id)}
                  label={c.label}
                  color={c.color}
                  tint={c.tint}
                  iconId={c.id}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowPartners((v) => !v)}
              className="mt-4 flex w-full items-center justify-between rounded-2xl border border-[#F0F2F7] px-4 py-3"
            >
              <span className="text-left">
                <span className="block text-[13px] font-semibold text-[#14161F]">제휴 쿠폰 배지 보기</span>
                <span className="block text-[11.5px] text-[#9AA1B2]">동네 가게 {partnerPins.length}곳</span>
              </span>
              <span
                className="relative h-6 w-11 rounded-full transition-colors"
                style={{ background: showPartners ? "#4F63FF" : "#E2E5EC" }}
              >
                <span
                  className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                  style={{ left: showPartners ? 22 : 2 }}
                />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="press mt-5 h-12 w-full rounded-full bg-[#14161F] text-[13.5px] font-semibold text-white"
            >
              {strip.length}개의 번개 보기
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[11.5px] font-semibold transition-colors"
      style={{
        borderColor: active ? "#14161F" : "#E2E5EC",
        background: active ? "#14161F" : "#fff",
        color: active ? "#fff" : "#3A3F51",
      }}
    >
      {color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />}
      {label}
    </button>
  );
}

function FilterTile({
  active,
  onClick,
  label,
  color,
  tint,
  iconId,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color: string;
  tint: string;
  iconId?: CategoryId;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 transition-colors"
      style={{
        borderColor: active ? "#14161F" : "#ECEEF3",
        background: active ? "#F6F7FB" : "#fff",
      }}
    >
      <span
        className="grid h-8 w-8 place-items-center rounded-full"
        style={{ background: active ? color : tint, color: active ? "#fff" : color }}
      >
        {iconId ? (
          <CategoryGlyph id={iconId} size={14} />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
            <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
            <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
          </svg>
        )}
      </span>
      <span className="text-[11.5px] font-semibold text-[#3A3F51]">{label}</span>
    </button>
  );
}

function SelectedCard({
  meetup,
  onClose,
  onOpen,
}: {
  meetup: Meetup;
  onClose: () => void;
  onOpen: () => void;
}) {
  const {
    userById,
    participantCount,
    spotsLeft,
    joined,
    interested,
    toggleJoin,
    toggleInterested,
    isBoosted,
  } = useCrewlog();
  const { message } = App.useApp();
  const category = categoryOf(meetup.categoryId);
  const left = spotsLeft(meetup.id);
  const count = participantCount(meetup.id);
  const isJoined = Boolean(joined[meetup.id]);
  const isInterested = Boolean(interested[meetup.id]);

  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white p-3"
      style={{ boxShadow: "0 16px 40px rgba(15,23,42,0.2)" }}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onOpen}
          className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[14px] bg-[#EDEFF5]"
        >
          {meetup.cover ? (
            <Image src={meetup.cover} alt={meetup.title} fill sizes="76px" className="object-cover" />
          ) : (
            <span
              className="grid h-full w-full place-items-center"
              style={{ background: category.tint, color: category.color }}
            >
              <CategoryGlyph id={meetup.categoryId} size={22} />
            </span>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <button type="button" onClick={onOpen} className="min-w-0 text-left">
              <p className="flex items-center gap-1.5 text-[10.5px] font-bold" style={{ color: category.color }}>
                {isBoosted(meetup.id) && <ThunderboltFilled style={{ fontSize: 9, color: "#4F63FF" }} />}
                {category.label} · {dayBadge(meetup.startsAt)} {clock(meetup.startsAt)}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[13.5px] font-bold leading-snug text-[#14161F]">
                {meetup.title}
              </p>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="카드 닫기"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#F5F6FA] text-[#9AA1B2]"
            >
              <CloseOutlined style={{ fontSize: 10 }} />
            </button>
          </div>
          <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-[#6E7587]">
            <EnvironmentOutlined style={{ fontSize: 10 }} />
            {meetup.place}
          </p>
          <p className="mt-0.5 text-[10.5px] text-[#9AA1B2]">
            {count}/{meetup.capacity}명 · {left > 0 ? `${left}자리 남음` : "마감"}
          </p>
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <AvatarStack users={meetup.participantIds.map(userById)} max={3} size={22} />
        <button
          type="button"
          onClick={() => toggleInterested(meetup.id)}
          className="ml-auto flex h-9 items-center gap-1 rounded-full border px-3 text-[12px] font-semibold"
          style={{
            borderColor: isInterested ? "#C9D0FF" : "#E2E5EC",
            background: isInterested ? "#EEF0FF" : "#fff",
            color: isInterested ? "#4F63FF" : "#3A3F51",
          }}
        >
          {isInterested && <CheckOutlined style={{ fontSize: 10 }} />}
          다음에
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isJoined && left <= 0) {
              message.warning("자리가 모두 찼어요.");
              return;
            }
            toggleJoin(meetup.id);
            message.success(isJoined ? "참여를 취소했어요." : "참여했어요. 시간에 봐요!");
          }}
          className="flex h-9 items-center rounded-full px-4 text-[12px] font-semibold"
          style={{
            background: isJoined ? "#EEF0FF" : left <= 0 ? "#EDEFF5" : "#4F63FF",
            color: isJoined ? "#4F63FF" : left <= 0 ? "#9AA1B2" : "#fff",
          }}
        >
          {isJoined ? "참여 중" : left <= 0 ? "마감" : "참여하기"}
        </button>
      </div>
    </div>
  );
}
