"use client";

import Image from "next/image";
import Link from "next/link";
import { App, Button, Progress, Tag } from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  GiftFilled,
  ThunderboltFilled,
} from "@ant-design/icons";
import { AvatarStack, CrewAvatar } from "./avatar";
import { MeetupCard } from "./meetup-card";
import { ProofCard } from "./proof-card";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { categoryOf, neighborhoodOf } from "@/lib/seed";
import { clock, dayBadge, pct } from "@/lib/format";
import { useCrewlog } from "@/lib/store";

export function MeetupPageView({ id }: { id: string }) {
  const {
    meetupById,
    meetups,
    userById,
    participantCount,
    spotsLeft,
    joined,
    toggleJoin,
    isBoosted,
    openBoost,
    posts,
    sponsorById,
    openCoupon,
  } = useCrewlog();
  const { message } = App.useApp();

  const meetup = meetupById(id);
  if (!meetup) return null;

  const category = categoryOf(meetup.categoryId);
  const neighborhood = neighborhoodOf(meetup.neighborhoodId);
  const host = userById(meetup.hostId);
  const sponsor = meetup.sponsorId ? sponsorById(meetup.sponsorId) : undefined;
  const related = posts.filter((post) => post.meetupId === meetup.id);
  const others = meetups.filter((item) => item.id !== meetup.id).slice(0, 3);
  const count = participantCount(meetup.id);
  const left = spotsLeft(meetup.id);
  const capped = left <= 0;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-[1240px] px-5 pt-8">
        <div className="flex items-center justify-between gap-4 border-b border-[#E5E0D8] pb-3">
          <Link
            href="/#map"
            className="inline-flex items-center gap-1.5 text-[11.5px] text-[#6B6660] hover:text-[#141413]"
          >
            <ArrowLeftOutlined style={{ fontSize: 10 }} /> 동네 지도로
          </Link>
          <p className="eyebrow">
            {neighborhood.label} · {category.label} · 번개 상세
          </p>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            {meetup.cover ? (
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#E5E0D8] bg-[#EFEAE2]">
                <Image
                  src={meetup.cover}
                  alt={meetup.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className="grid aspect-[16/7] w-full place-items-center border border-[#E5E0D8]"
                style={{ background: category.tint }}
              >
                <span
                  className="text-[26px]"
                  style={{ fontFamily: "var(--font-serif)", color: category.color }}
                >
                  {category.label}
                </span>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-1.5">
              <Tag
                bordered={false}
                style={{
                  background: category.tint,
                  color: category.color,
                  fontSize: 10,
                  lineHeight: "18px",
                  padding: "0 7px",
                }}
              >
                {category.label}
              </Tag>
              <Tag
                bordered={false}
                style={{
                  background: "#F4F0E9",
                  color: "#6B6660",
                  fontSize: 10,
                  lineHeight: "18px",
                  padding: "0 7px",
                }}
              >
                {neighborhood.label}
              </Tag>
              {isBoosted(meetup.id) && (
                <Tag
                  bordered={false}
                  style={{
                    background: "#FBEDE8",
                    color: "#C43E1F",
                    fontSize: 10,
                    lineHeight: "18px",
                    padding: "0 7px",
                  }}
                >
                  <ThunderboltFilled style={{ fontSize: 9, marginRight: 2 }} />
                  부스트 노출 중
                </Tag>
              )}
            </div>

            <h1
              className="mt-3 text-[30px] leading-[1.24] tracking-[-0.045em] text-[#141413] sm:text-[38px]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {meetup.title}
            </h1>

            <div className="mt-4 flex items-center gap-2.5 border-b border-[#EFEBE4] pb-5">
              <CrewAvatar user={host} size={36} />
              <div>
                <p className="text-[13px] font-medium text-[#141413]">
                  {host.name}
                  {host.pro && (
                    <span className="ml-1.5 rounded-[2px] border border-[#1F5E4B]/25 bg-[#E6EDE9] px-1 font-mono text-[8px] text-[#1F5E4B]">
                      PRO
                    </span>
                  )}
                </p>
                <p className="font-mono text-[10px] text-[#9A948C]">
                  호스트 · @{host.handle}
                </p>
              </div>
              <span className="ml-auto num text-[10.5px] text-[#9A948C]">
                {count}/{meetup.capacity}명 참여
              </span>
            </div>

            <p className="mt-5 whitespace-pre-line text-[14px] leading-[1.9] text-[#3D3A36]">
              {meetup.description}
            </p>

            <div className="mt-7 border border-[#E5E0D8] bg-white px-4 py-4">
              <div className="flex items-center justify-between">
                <p className="eyebrow">참여자 {count}명</p>
                <AvatarStack users={meetup.participantIds.map(userById)} max={8} size={26} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[...(joined[meetup.id] ? ["u1"] : []), ...meetup.participantIds].map(
                  (userId) => (
                    <span
                      key={userId}
                      className="border border-[#E5E0D8] px-2 py-0.5 text-[10.5px] text-[#3D3A36]"
                    >
                      {userById(userId).name}
                    </span>
                  ),
                )}
              </div>
            </div>

            {sponsor && (
              <button
                type="button"
                onClick={() => openCoupon(sponsor.id)}
                className="mt-4 flex w-full items-center justify-between gap-3 border border-[#1F5E4B]/30 bg-[#E6EDE9] px-4 py-3 text-left"
              >
                <span className="flex items-center gap-2">
                  <GiftFilled style={{ color: "#1F5E4B", fontSize: 13 }} />
                  <span className="text-[12px] text-[#1F5E4B]">
                    참여자 전용 · {sponsor.name} {sponsor.benefit}
                  </span>
                </span>
                <span className="text-[11px] font-medium text-[#1F5E4B]">쿠폰 받기 →</span>
              </button>
            )}

            <section className="mt-10">
              <div className="flex items-end justify-between border-b border-[#141413]/15 pb-3">
                <div>
                  <p className="eyebrow">FROM THIS MEETUP</p>
                  <h2
                    className="mt-1 text-[20px] tracking-[-0.04em]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    이 번개에서 남은 인증샷
                  </h2>
                </div>
                <span className="num text-[11px] text-[#9A948C]">{related.length}건</span>
              </div>

              {related.length > 0 ? (
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  {related.map((post) => (
                    <ProofCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="mt-4 border border-dashed border-[#DDD6C9] bg-white/60 px-4 py-8 text-center text-[12px] text-[#9A948C]">
                  아직 인증샷이 없습니다. 다녀온 뒤 첫 장면을 남겨보세요.
                </p>
              )}
            </section>
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-[#E5E0D8] bg-white lg:sticky lg:top-24">
              <div className="border-b border-[#E5E0D8] px-5 py-4">
                <p className="eyebrow">WHEN &amp; WHERE</p>
                <p
                  className="mt-1.5 text-[22px] leading-none tracking-[-0.04em] text-[#141413]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {dayBadge(meetup.startsAt)} {clock(meetup.startsAt)}
                </p>
                <p className="mt-2 flex items-start gap-1.5 text-[12px] leading-relaxed text-[#3D3A36]">
                  <EnvironmentOutlined style={{ marginTop: 3, fontSize: 11, color: "#9A948C" }} />
                  {meetup.place}
                </p>
              </div>

              <div className="px-5 py-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="num text-[#3D3A36]">
                    {count}/{meetup.capacity}명
                  </span>
                  <span
                    className="num"
                    style={{ color: capped ? "#9A948C" : "#E84A27" }}
                  >
                    {capped ? "마감" : `${left}자리 남음`}
                  </span>
                </div>
                <div className="mt-2">
                  <Progress
                    percent={pct(count, meetup.capacity)}
                    showInfo={false}
                    size={{ height: 4 }}
                    strokeColor={capped ? "#9A948C" : "#141413"}
                    trailColor="#EFEBE4"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <Button
                    type={joined[meetup.id] ? "default" : "primary"}
                    danger={joined[meetup.id]}
                    block
                    size="large"
                    disabled={!joined[meetup.id] && capped}
                    onClick={() => {
                      if (!joined[meetup.id] && capped) {
                        message.warning("자리가 모두 찼습니다.");
                        return;
                      }
                      toggleJoin(meetup.id);
                      message.success(
                        joined[meetup.id]
                          ? "참여를 취소했습니다."
                          : "참여했습니다. 시간에 봐요.",
                      );
                    }}
                  >
                    {joined[meetup.id]
                      ? "참여 취소"
                      : capped
                        ? "마감된 번개"
                        : "참여하기"}
                  </Button>
                  {meetup.hostId === "u1" && !isBoosted(meetup.id) && (
                    <Button block onClick={() => openBoost(meetup.id)}>
                      부스트로 상단에 노출
                    </Button>
                  )}
                </div>

                <p className="mt-3 text-[10.5px] leading-relaxed text-[#A8A096]">
                  참여는 데모 상태로만 저장됩니다. 실제 예약이나 결제는 없습니다.
                </p>
              </div>

              <div className="border-t border-[#E5E0D8] bg-[#FAF8F5] px-5 py-3">
                <p className="eyebrow">HOST</p>
                <div className="mt-2 flex items-center gap-2.5">
                  <CrewAvatar user={host} size={30} />
                  <div className="min-w-0">
                    <p className="truncate text-[12px] text-[#141413]">{host.bio}</p>
                    <p className="font-mono text-[10px] text-[#9A948C]">@{host.handle}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <div className="flex items-end justify-between border-b border-[#141413]/15 pb-3">
            <div>
              <p className="eyebrow">MORE CREWS</p>
              <h2
                className="mt-1 text-[20px] tracking-[-0.04em]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                이 동네의 다른 번개
              </h2>
            </div>
          </div>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            {others.map((item) => (
              <MeetupCard key={item.id} meetup={item} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
