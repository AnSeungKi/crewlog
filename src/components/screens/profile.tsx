"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { App, Segmented } from "antd";
import {
  ArrowRightOutlined,
  CheckOutlined,
  CrownFilled,
  EnvironmentOutlined,
  GiftFilled,
  SettingOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { Avatar, EmptyRow, SectionHead } from "../ui";
import { MeetupRow, ProofCard } from "../cards";
import { ME, PRO_PRICE } from "@/lib/seed";
import { won } from "@/lib/format";
import { useCrewlog } from "@/lib/store";
import type { TabKey } from "../app-shell";

type ListKey = "joined" | "hosting" | "interested" | "posts";

export function ProfileScreen({
  counts,
  onNavigate,
}: {
  counts: { joined: number; interested: number; boosts: number };
  onNavigate: (tab: TabKey) => void;
}) {
  const {
    meetups,
    posts,
    joined,
    interested,
    boosts,
    meetupById,
    coupons,
    sponsors,
    openCoupon,
    openDetail,
    setProOpen,
    openComposer,
    isBoosted,
  } = useCrewlog();
  const { message } = App.useApp();
  const [list, setList] = useState<ListKey>("joined");

  const joinedMeetups = useMemo(
    () => meetups.filter((m) => joined[m.id] && dayjs(m.startsAt).isAfter(dayjs().subtract(1, "hour"))),
    [meetups, joined],
  );
  const hosting = useMemo(() => meetups.filter((m) => m.hostId === ME.id), [meetups]);
  const saved = useMemo(() => meetups.filter((m) => interested[m.id]), [meetups, interested]);
  const myPosts = useMemo(() => posts.filter((p) => p.authorId === ME.id), [posts]);
  const claimed = sponsors.filter((s) => coupons[s.id]);
  const stats = [
    { label: "참여 번개", value: joinedMeetups.length },
    { label: "인증샷", value: myPosts.length },
    { label: "보관 쿠폰", value: claimed.length },
    { label: "다음에", value: saved.length },
  ];

  const demo = (what: string) => message.info(`${what}은 데모에서 열리지 않아요.`);

  const rows: Record<ListKey, React.ReactNode> = {
    joined: joinedMeetups.length ? (
      <div className="space-y-1">
        {joinedMeetups.map((m) => (
          <MeetupRow key={m.id} meetup={m} />
        ))}
      </div>
    ) : (
      <EmptyRow>
        아직 참여 중인 번개가 없어요.
        <br />
        지도에서 가까운 번개를 골라보세요.
      </EmptyRow>
    ),
    hosting: hosting.length ? (
      <div className="space-y-1">
        {hosting.map((m) => (
          <MeetupRow key={m.id} meetup={m} />
        ))}
      </div>
    ) : (
      <EmptyRow>아직 연 번개가 없어요. 아래 + 버튼으로 하나 열어보세요.</EmptyRow>
    ),
    interested: saved.length ? (
      <div className="space-y-1">
        {saved.map((m) => (
          <MeetupRow key={m.id} meetup={m} />
        ))}
      </div>
    ) : (
      <EmptyRow>‘다음에’에 담아둔 번개가 없어요.</EmptyRow>
    ),
    posts: myPosts.length ? (
      <div className="space-y-3">
        {myPosts.map((post) => (
          <ProofCard key={post.id} post={post} compact />
        ))}
      </div>
    ) : (
      <EmptyRow>아직 인증샷이 없어요. 다녀온 번개의 첫 장면을 남겨보세요.</EmptyRow>
    ),
  };

  return (
    <div className="screen">
      <div className="mx-auto w-full max-w-[900px] px-4 md:px-8 md:pt-8">
        <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-8">
          {/* ---------------- profile card ---------------- */}
          <div className="lg:sticky lg:top-8">
            <header className="flex items-start justify-between pt-5 md:pt-0">
              <p className="text-[12.5px] font-medium text-[#9AA1B2]">내 프로필</p>
              <button
                type="button"
                onClick={() => demo("설정")}
                aria-label="설정"
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#6E7587] shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
              >
                <SettingOutlined style={{ fontSize: 15 }} />
              </button>
            </header>

            <div className="mt-4 flex items-center gap-4">
              <Avatar user={ME} size={72} solid />
              <div className="min-w-0">
                <h1 className="text-[21px] font-extrabold tracking-[-0.04em] text-[#14161F]">{ME.name}</h1>
                <p className="text-[12.5px] text-[#9AA1B2]">@{ME.handle}</p>
                <p className="mt-1 text-[11.5px] font-semibold text-[#4F63FF]">
                  호스트 {hosting.length}회 · 참여 {joinedMeetups.length}회
                </p>
              </div>
            </div>

            <p className="mt-3 text-[12.5px] leading-relaxed text-[#6E7587]">{ME.bio}</p>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => demo("프로필 편집")}
                className="press h-9 flex-1 rounded-full border border-[#E2E5EC] bg-white text-[12px] font-semibold text-[#3A3F51]"
              >
                프로필 편집
              </button>
              <button
                type="button"
                onClick={() => openComposer("meetup")}
                className="press h-9 flex-1 rounded-full bg-[#14161F] text-[12px] font-semibold text-white"
              >
                번개 열기
              </button>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-1 rounded-2xl bg-white p-3 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="tnum text-[16px] font-extrabold text-[#14161F]">{stat.value}</p>
                  <p className="mt-0.5 text-[10px] font-medium text-[#9AA1B2]">{stat.label}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setProOpen(true)}
              className="press mt-3 flex w-full items-center gap-3 overflow-hidden rounded-2xl p-4 text-left text-white"
              style={{ background: "linear-gradient(135deg,#4F63FF 0%,#3039B8 100%)" }}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15">
                <CrownFilled style={{ fontSize: 15 }} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-bold">호스트 Pro</span>
                <span className="block text-[11px] text-white/70">부스트 2회 · 월 {won(PRO_PRICE)}</span>
              </span>
              <ArrowRightOutlined style={{ fontSize: 11 }} />
            </button>

            <div className="mt-3 hidden space-y-1 rounded-2xl bg-white p-2 lg:block">
              {[
                { label: "알림 설정", icon: <ThunderboltFilled style={{ fontSize: 11 }} /> },
                { label: "내 동네 · 성수동", icon: <EnvironmentOutlined style={{ fontSize: 12 }} /> },
                { label: "문의하기", icon: <GiftFilled style={{ fontSize: 12 }} /> },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => demo(item.label)}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[12px] font-medium text-[#3A3F51] hover:bg-[#F6F7FB]"
                >
                  <span className="text-[#9AA1B2]">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* ---------------- lists ---------------- */}
          <div className="mt-6 pb-4">
            <Segmented
              block
              value={list}
              onChange={(value) => setList(value as ListKey)}
              options={[
                { label: `참여 ${joinedMeetups.length}`, value: "joined" },
                { label: `내 번개 ${hosting.length}`, value: "hosting" },
                { label: `다음에 ${saved.length}`, value: "interested" },
                { label: `인증샷 ${myPosts.length}`, value: "posts" },
              ]}
            />
            <div className="mt-3">{rows[list]}</div>

            {/* coupons */}
            <div className="mt-6">
              <SectionHead
                title="쿠폰 보관함"
                sub={claimed.length ? `${claimed.length}장 보관 중` : "참여한 번개의 쿠폰이 여기에 모여요"}
                action={
                  <button
                    type="button"
                    onClick={() => onNavigate("map")}
                    className="text-[11.5px] font-semibold text-[#4F63FF]"
                  >
                    지도에서 받기
                  </button>
                }
              />
              <div className="mt-2 space-y-2">
                {claimed.length === 0 && (
                  <EmptyRow>아직 보관한 쿠폰이 없어요. 지도 위 제휴 배지를 눌러 받아보세요.</EmptyRow>
                )}
                {claimed.map((sponsor) => (
                  <button
                    key={sponsor.id}
                    type="button"
                    onClick={() => openCoupon(sponsor.id)}
                    className="press app-card flex w-full items-center gap-3 p-3 text-left"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F4F1FD] text-[#8B6BD9]">
                      <GiftFilled style={{ fontSize: 15 }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-semibold text-[#14161F]">
                        {sponsor.name}
                      </span>
                      <span className="block truncate text-[11.5px] text-[#6E7587]">{sponsor.benefit}</span>
                    </span>
                    <span className="rounded-full bg-[#F4F1FD] px-2 py-1 text-[10px] font-bold text-[#8B6BD9]">
                      {sponsor.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* boost history */}
            {boosts.length > 0 && (
              <div className="mt-6">
                <SectionHead title="부스트 내역" sub="데모 결제로 기록된 내역이에요" />
                <div className="mt-2 space-y-2">
                  {boosts.map((boost) => {
                    const meetup = meetupById(boost.meetupId);
                    return (
                      <div key={boost.id} className="app-card flex items-center gap-3 p-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EEF0FF] text-[#4F63FF]">
                          <ThunderboltFilled style={{ fontSize: 12 }} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-semibold text-[#14161F]">
                            {meetup?.title ?? "삭제된 번개"}
                          </p>
                          <p className="text-[11px] text-[#9AA1B2]">
                            {dayjs(boost.createdAt).format("M월 D일 HH:mm")} · {boost.hours}시간
                          </p>
                        </div>
                        <span className="tnum text-[12px] font-semibold text-[#3A3F51]">{won(boost.amount)}</span>
                        <span className="rounded-full bg-[#E9F6EF] px-2 py-1 text-[10px] font-bold text-[#2E9E6B]">
                          결제됨
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {hosting.some((m) => isBoosted(m.id)) && (
              <p className="mt-4 flex items-center gap-1.5 px-1 text-[11px] text-[#4F63FF]">
                <CheckOutlined style={{ fontSize: 10 }} />
                지금 부스트 중인 번개가 있어요.
              </p>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-[#ECEEF3] pt-4">
              <p className="text-[11px] text-[#B7BCC9]">크루로그 1.0.0 · 데모</p>
              <button
                type="button"
                onClick={() => demo("로그아웃")}
                className="text-[11.5px] font-semibold text-[#9AA1B2]"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
