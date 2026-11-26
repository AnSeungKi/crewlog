"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { App } from "antd";
import { ArrowRightOutlined, DownOutlined, EnvironmentOutlined, ThunderboltFilled } from "@ant-design/icons";
import { MeetupCard, ProofCard } from "../cards";
import { Avatar, EmptyRow, Pill, SectionHead } from "../ui";
import { NeighborhoodSheet } from "../sheets/neighborhood";
import { NEIGHBORHOODS, ME, PRO_PRICE, SPONSOR_PINS, categoryOf } from "@/lib/seed";
import { won } from "@/lib/format";
import { useCrewlog, type NeighborhoodFilter } from "@/lib/store";
import type { TabKey } from "../app-shell";

const MarkerMap = dynamic(() => import("../map/marker-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-[#EDEFF5]" />,
});

type Kind = "all" | "meetup" | "post";

export function HomeScreen({ onNavigate }: { onNavigate: (tab: TabKey) => void }) {
  const {
    visibleFeed,
    meetupById,
    postById,
    meetups,
    posts,
    neighborhood,
    setNeighborhood,
    openDetail,
    openCoupon,
    setProOpen,
    setCategory,
    interested,
    joined,
  } = useCrewlog();
  const { message } = App.useApp();
  const [kind, setKind] = useState<Kind>("all");
  const [sheet, setSheet] = useState(false);

  const now = dayjs();
  const upcoming = meetups.filter((meetup) => dayjs(meetup.startsAt).isAfter(now)).length;
  const upcomingAll = meetups.length;

  const items = useMemo(() => {
    return visibleFeed.filter((item) => {
      if (kind === "all") return true;
      if (item.kind !== kind) return false;
      if (kind === "meetup") {
        const meetup = meetupById(item.kind === "meetup" ? item.meetupId : "");
        return Boolean(meetup && dayjs(meetup.startsAt).isAfter(dayjs()));
      }
      return true;
    });
  }, [visibleFeed, kind]);

  const feedMeetups = visibleFeed.filter(
    (item) => item.kind === "meetup" && meetupById(item.meetupId),
  );
  const feedPosts = visibleFeed.filter((item) => item.kind === "post");
  const meetupTotal = feedMeetups.length;
  const postTotal = feedPosts.length;
  const upcomingInView = meetups.filter(
    (m) => (neighborhood === "all" || m.neighborhoodId === neighborhood) && dayjs(m.startsAt).isAfter(now),
  ).length;

  const today = now.format("M월 D일 dddd");
  const myMeetups = Object.values(joined).filter(Boolean).length + Object.values(interested).filter(Boolean).length;

  return (
    <div className="screen">
      <div className="mx-auto w-full max-w-[1080px] px-4 md:px-8 md:pt-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,600px)_330px] lg:items-start">
          {/* ---------------- main column ---------------- */}
          <div className="mx-auto w-full min-w-0 max-w-[600px] lg:mx-0 lg:max-w-none">
            <header className="flex items-start justify-between gap-4 pt-5 md:pt-0">
              <div>
                <p className="text-[12.5px] font-medium text-[#9AA1B2]">{today}</p>
                <h1 className="mt-1 text-[26px] font-extrabold leading-tight tracking-[-0.045em] text-[#14161F] md:text-[30px]">
                  안녕하세요 <span className="align-middle">👋</span>
                </h1>
                <p className="mt-1.5 text-[13px] text-[#6E7587]">
                  지금 동네에서 <span className="font-semibold text-[#14161F]">{upcomingInView}개의 번개</span>가 열려 있어요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("profile")}
                className="press mt-1 rounded-full ring-2 ring-white"
                aria-label="내 프로필"
              >
                <Avatar user={ME} size={44} solid />
              </button>
            </header>

            <div className="sticky top-0 z-20 -mx-4 mt-5 bg-[#F6F7FB]/92 px-4 py-3 backdrop-blur-md md:-mx-2 md:px-2">
              <div className="no-scrollbar flex gap-2 overflow-x-auto">
                <Pill active={kind === "all"} onClick={() => setKind("all")}>
                  전체 {visibleFeed.length}
                </Pill>
                <Pill active={kind === "meetup"} onClick={() => setKind("meetup")}>
                  예정된 번개 {upcomingInView}
                </Pill>
                <Pill active={kind === "post"} onClick={() => setKind("post")}>
                  인증샷 {postTotal}
                </Pill>
                <Pill
                  active={neighborhood !== "all"}
                  onClick={() => setSheet(true)}
                  className="ml-auto shrink-0"
                >
                  <EnvironmentOutlined style={{ fontSize: 12 }} />
                  {neighborhood === "all" ? "동네" : NEIGHBORHOODS.find((n) => n.id === neighborhood)?.label}
                  <DownOutlined style={{ fontSize: 8, opacity: 0.6 }} />
                </Pill>
              </div>
            </div>

            <div className="mt-1 flex flex-col gap-3.5 pb-6">
              {items.length === 0 && (
                <EmptyRow>
                  아직 이 조합의 글이 없어요.
                  <br />
                  동네를 바꾸거나 필터를 풀어보세요.
                </EmptyRow>
              )}

              {items.map((item) => {
                if (item.kind === "meetup") {
                  const meetup = meetupById(item.meetupId);
                  if (!meetup) return null;
                  return <MeetupCard key={item.id} meetup={meetup} />;
                }
                const post = postById(item.postId);
                if (!post) return null;
                return <ProofCard key={item.id} post={post} />;
              })}

              <ProBand onOpen={() => setProOpen(true)} />

              <div className="px-1 pb-2 pt-4 text-center">
                <p className="text-[11px] leading-relaxed text-[#B7BCC9]">
                  {upcomingAll}개의 번개 · {posts.length}개의 인증샷 · 성수 · 연남 · 잠실 · 판교
                  <br />
                  크루로그는 데모 앱이에요. 참여와 결제는 저장되지 않습니다.
                </p>
              </div>
            </div>
          </div>

          {/* ---------------- desktop side column ---------------- */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 space-y-4">
              <div className="app-card overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-4">
                  <div>
                    <p className="text-[13px] font-bold tracking-[-0.02em] text-[#14161F]">지금 우리 동네</p>
                    <p className="mt-0.5 text-[11.5px] text-[#9AA1B2]">
                      {neighborhood === "all"
                        ? "성수 · 연남 · 잠실 · 판교"
                        : NEIGHBORHOODS.find((n) => n.id === neighborhood)?.note}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate("map")}
                    className="rounded-full bg-[#F5F6FA] px-2.5 py-1.5 text-[11px] font-semibold text-[#3A3F51] hover:bg-[#EDEFF5]"
                  >
                    지도 열기
                  </button>
                </div>
                <div className="mt-3 h-[190px] w-full overflow-hidden">
                  <MarkerMap
                    meetups={meetups}
                    sponsors={[]}
                    center={
                      neighborhood === "all"
                        ? { lat: 37.5445, lng: 127.0557, zoom: 14 }
                        : {
                            lat: NEIGHBORHOODS.find((n) => n.id === neighborhood)!.lat,
                            lng: NEIGHBORHOODS.find((n) => n.id === neighborhood)!.lng,
                            zoom: 14.5,
                          }
                    }
                    selectedId={null}
                    category="all"
                    onSelect={(id) => id && openDetail(id)}
                    onSponsor={(id) => openCoupon(id)}
                    interactive={false}
                  />
                </div>
              </div>

              <div className="app-card p-4">
                <SectionHead title="동네 둘러보기" sub="핀을 눌러 번개를 확인하세요" />
                <div className="mt-3 space-y-1">
                  {NEIGHBORHOODS.map((n) => {
                    const count = meetups.filter((m) => m.neighborhoodId === n.id).length;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          setNeighborhood(n.id);
                          setCategory("all");
                          onNavigate("map");
                        }}
                        className="press flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left hover:bg-[#F6F7FB]"
                      >
                        <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#F1F2F7] text-[11px] font-bold text-[#6E7587]">
                          {n.label.slice(0, 1)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12.5px] font-semibold text-[#14161F]">{n.label}</span>
                          <span className="block text-[11px] text-[#9AA1B2]">{n.note}</span>
                        </span>
                        <span className="tnum text-[11.5px] font-semibold text-[#9AA1B2]">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="app-card p-4">
                <SectionHead title="제휴 쿠폰" sub="번개 참여자에게 열려요" />
                <div className="mt-3 space-y-2">
                  {SPONSOR_PINS.slice(0, 2).map((sponsor) => (
                    <button
                      key={sponsor.id}
                      type="button"
                      onClick={() => openCoupon(sponsor.id)}
                      className="press flex w-full items-center gap-2.5 rounded-xl border border-[#F0F2F7] px-2.5 py-2 text-left"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#F4F1FD] text-[13px] text-[#8B6BD9]">
                        %
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] font-semibold text-[#14161F]">
                          {sponsor.name}
                        </span>
                        <span className="block truncate text-[11px] text-[#6E7587]">{sponsor.benefit}</span>
                      </span>
                      <ArrowRightOutlined style={{ fontSize: 10, color: "#B7BCC9" }} />
                    </button>
                  ))}
                </div>
              </div>

              <p className="px-2 text-[10.5px] leading-relaxed text-[#B7BCC9]">
                데모 앱 · 참여와 결제는 이 브라우저에서만 동작해요 · 참여 {myMeetups}건
              </p>
            </div>
          </aside>
        </div>
      </div>

      <NeighborhoodSheet
        open={sheet}
        onClose={() => setSheet(false)}
        value={neighborhood}
        onPick={(id) => {
          setNeighborhood(id);
          setSheet(false);
          message.success(id === "all" ? "모든 동네를 보고 있어요." : "동네를 바꿨어요.");
        }}
        counts={Object.fromEntries(
          NEIGHBORHOODS.map((n) => [n.id, meetups.filter((m) => m.neighborhoodId === n.id).length]),
        )}
        total={meetups.length}
      />
    </div>
  );
}

function ProBand({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      className="relative overflow-hidden rounded-[20px] p-5 text-white"
      style={{ background: "linear-gradient(135deg, #4F63FF 0%, #3039B8 100%)" }}
    >
      <div className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-12 right-10 h-24 w-24 rounded-full bg-white/[0.07]" />
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-bold">
        <ThunderboltFilled style={{ fontSize: 10 }} /> 호스트 PRO
      </span>
      <p className="mt-2.5 text-[16px] font-bold leading-snug tracking-[-0.03em]">
        번개를 여는 사람을 위한
        <br />
        작은 도구들
      </p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-white/75">
        부스트 2회 · 참여자 관리 · 쿠폰 노출 · 월 {won(PRO_PRICE)}
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="press mt-3.5 rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-[#3039B8]"
      >
        자세히 보기
      </button>
    </div>
  );
}
