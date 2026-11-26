"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { App, Drawer, Progress } from "antd";
import dynamic from "next/dynamic";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  EnvironmentOutlined,
  GiftFilled,
  ShareAltOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { Avatar, AvatarStack, CategoryGlyph, CategoryTag, EmptyRow, SectionHead } from "./ui";
import { BookmarkIcon } from "./icons";
import { MeetupRow, ProofCard } from "./cards";
import { categoryOf, neighborhoodOf } from "@/lib/seed";
import { clock, dayBadge, fromNow, pct } from "@/lib/format";
import { useCrewlog } from "@/lib/store";

const MarkerMap = dynamic(() => import("./map/marker-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-[#EDEFF5]" />,
});

function startLabel(iso: string) {
  const target = new Date(iso).getTime();
  const diffMin = Math.round((target - Date.now()) / 60000);
  if (diffMin < -30) return "이미 시작한 번개예요";
  if (diffMin < 30) return "곧 시작해요";
  if (diffMin < 90) return `${Math.round(diffMin / 5) * 5}분 뒤 시작`;
  if (diffMin < 60 * 8) return `${Math.round(diffMin / 60)}시간 뒤 시작`;
  const days = Math.round(diffMin / 1440);
  return days <= 1 ? "내일 시작해요" : `${days}일 뒤 시작해요`;
}

export function MeetupDetailBody({ id, onBack }: { id: string; onBack: () => void }) {
  const {
    meetupById,
    meetups,
    posts,
    userById,
    participantCount,
    spotsLeft,
    joined,
    interested,
    toggleJoin,
    toggleInterested,
    isBoosted,
    openBoost,
    openCoupon,
    sponsorById,
    openDetail,
  } = useCrewlog();
  const { message } = App.useApp();

  const meetup = meetupById(id);
  if (!meetup) {
    return (
      <div className="grid h-full place-items-center p-6 text-center text-[13px] text-[#9AA1B2]">
        번개를 찾을 수 없어요.
      </div>
    );
  }

  const category = categoryOf(meetup.categoryId);
  const neighborhood = neighborhoodOf(meetup.neighborhoodId);
  const host = userById(meetup.hostId);
  const sponsor = meetup.sponsorId ? sponsorById(meetup.sponsorId) : undefined;
  const related = posts.filter((post) => post.meetupId === meetup.id);
  const others = meetups.filter((item) => item.neighborhoodId === meetup.neighborhoodId && item.id !== meetup.id).slice(0, 3);
  const count = participantCount(meetup.id);
  const left = spotsLeft(meetup.id);
  const isJoined = Boolean(joined[meetup.id]);
  const isInterested = Boolean(interested[meetup.id]);
  const mine = meetup.hostId === "u1";

  const share = async () => {
    const url = meetup.persisted ? `${window.location.origin}/meetups/${meetup.id}` : window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: meetup.title, text: meetup.description.slice(0, 80), url });
      } else {
        await navigator.clipboard.writeText(url);
        message.success("링크를 복사했어요.");
      }
    } catch {
      message.info(url);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#F6F7FB]">
      <div className="relative flex-1 overflow-y-auto quiet-scroll">
        {/* hero */}
        <div className="relative h-[288px] w-full md:h-[340px]">
          {meetup.cover ? (
            <Image src={meetup.cover} alt={meetup.title} fill priority sizes="100vw" className="object-cover" />
          ) : (
            <div
              className="grid h-full w-full place-items-center"
              style={{ background: category.tint, color: category.color }}
            >
              <CategoryGlyph id={meetup.categoryId} size={38} />
            </div>
          )}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
          <div
            className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pb-2"
            style={{ paddingTop: "calc(12px + env(safe-area-inset-top))" }}
          >
            <button
              type="button"
              onClick={onBack}
              aria-label="뒤로"
              className="press grid h-10 w-10 place-items-center rounded-full bg-white/92 text-[#14161F] backdrop-blur"
              style={{ boxShadow: "0 6px 18px rgba(15,23,42,0.18)" }}
            >
              <ArrowLeftOutlined style={{ fontSize: 14 }} />
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggleInterested(meetup.id)}
                aria-label="다음에"
                className="press grid h-10 w-10 place-items-center rounded-full backdrop-blur"
                style={{
                  background: isInterested ? "#4F63FF" : "rgba(255,255,255,0.92)",
                  color: isInterested ? "#fff" : "#14161F",
                  boxShadow: "0 6px 18px rgba(15,23,42,0.18)",
                }}
              >
                <BookmarkIcon filled={isInterested} size={14} />
              </button>
              <button
                type="button"
                onClick={share}
                aria-label="공유"
                className="press grid h-10 w-10 place-items-center rounded-full bg-white/92 text-[#14161F] backdrop-blur"
                style={{ boxShadow: "0 6px 18px rgba(15,23,42,0.18)" }}
              >
                <ShareAltOutlined style={{ fontSize: 14 }} />
              </button>
            </div>
          </div>
        </div>

        {/* sheet over hero */}
        <div className="relative -mt-6 rounded-t-[28px] bg-[#F6F7FB] px-4 pb-6">
          <div className="flex items-center gap-1.5 pt-5">
            <CategoryTag category={category} />
            <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#6E7587]">
              {neighborhood.label}
            </span>
            {isBoosted(meetup.id) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF0FF] px-2.5 py-1 text-[11px] font-bold text-[#4F63FF]">
                <ThunderboltFilled style={{ fontSize: 9 }} /> 부스트
              </span>
            )}
            {left <= 0 && (
              <span className="inline-flex items-center rounded-full bg-[#F1F2F7] px-2.5 py-1 text-[11px] font-semibold text-[#6E7587]">
                마감
              </span>
            )}
          </div>

          <h1 className="mt-2.5 text-[23px] font-extrabold leading-[1.3] tracking-[-0.045em] text-[#14161F] md:text-[28px]">
            {meetup.title}
          </h1>

          <div className="mt-3 flex items-center gap-2.5">
            <Avatar user={host} size={36} solid />
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-[#14161F]">
                {host.name}
                {host.pro && <span className="ml-1 text-[10px] font-bold text-[#4F63FF]">PRO</span>}
                {mine && <span className="ml-1 text-[10.5px] font-medium text-[#9AA1B2]">· 나</span>}
              </p>
              <p className="truncate text-[11px] text-[#9AA1B2]">@{host.handle}</p>
            </div>
            <span className="ml-auto text-[11.5px] font-semibold text-[#6E7587]">
              {count}/{meetup.capacity}명
            </span>
          </div>

          {/* when & where */}
          <div className="app-card mt-4 overflow-hidden p-0">
            <div className="flex items-start gap-3 p-4">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#EEF0FF] text-[#4F63FF]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 7.5V12l3 2" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <p className="text-[13.5px] font-bold text-[#14161F]">
                  {dayBadge(meetup.startsAt)} {clock(meetup.startsAt)}
                </p>
                <p className="mt-0.5 text-[11.5px] text-[#9AA1B2]">{startLabel(meetup.startsAt)}</p>
              </div>
            </div>
            <div className="h-px bg-[#F0F2F7]" />
            <div className="flex items-start gap-3 p-4">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F1F2F7] text-[#6E7587]">
                <EnvironmentOutlined style={{ fontSize: 13 }} />
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold text-[#14161F]">{meetup.place}</p>
                <p className="mt-0.5 text-[11.5px] text-[#9AA1B2]">{neighborhood.label} · 도보 6분</p>
              </div>
            </div>
            <div className="relative h-[132px] w-full border-t border-[#F0F2F7]">
              <MarkerMap
                meetups={[meetup]}
                sponsors={[]}
                center={{ lat: meetup.lat, lng: meetup.lng, zoom: 16 }}
                selectedId={meetup.id}
                category="all"
                onSelect={() => {}}
                onSponsor={() => {}}
                interactive={false}
              />
              <Link
                href="/#map"
                className="absolute bottom-2.5 right-2.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#14161F] shadow-[0_4px_14px_rgba(15,23,42,0.16)] backdrop-blur"
              >
                지도에서 보기
              </Link>
            </div>
          </div>

          {/* participants */}
          <div className="app-card mt-3 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-semibold text-[#14161F]">
                참여자 {count}명
                <span className="ml-1.5 font-normal text-[#9AA1B2]">· {left > 0 ? `${left}자리 남음` : "정원 마감"}</span>
              </p>
              <AvatarStack users={[...(isJoined ? [userById("u1")] : []), ...meetup.participantIds.map(userById)]} max={5} size={26} />
            </div>
            <div className="mt-2.5">
              <Progress
                percent={pct(count, meetup.capacity)}
                showInfo={false}
                size={{ height: 5 }}
                strokeColor={left <= 0 ? "#9AA1B2" : "#4F63FF"}
                trailColor="#EDEFF5"
              />
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {[...(isJoined ? ["u1"] : []), ...meetup.participantIds].slice(0, 8).map((userId) => (
                <span key={userId} className="rounded-full bg-[#F5F6FA] px-2 py-1 text-[10.5px] font-medium text-[#6E7587]">
                  {userById(userId).name}
                </span>
              ))}
              {count > 8 && (
                <span className="rounded-full bg-[#F5F6FA] px-2 py-1 text-[10.5px] font-medium text-[#9AA1B2]">
                  +{count - 8}
                </span>
              )}
            </div>
          </div>

          <p className="mt-4 whitespace-pre-line text-[13.5px] leading-[1.85] text-[#3A3F51]">
            {meetup.description}
          </p>

          {sponsor && (
            <button
              type="button"
              onClick={() => openCoupon(sponsor.id)}
              className="press mt-4 flex w-full items-center gap-3 rounded-2xl bg-[#F7F5FE] p-3.5 text-left"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#8B6BD9]">
                <GiftFilled style={{ fontSize: 14 }} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold text-[#8B6BD9]">참여자 전용 쿠폰</span>
                <span className="block truncate text-[12.5px] font-semibold text-[#14161F]">
                  {sponsor.name} · {sponsor.benefit}
                </span>
              </span>
              <span className="text-[11.5px] font-semibold text-[#8B6BD9]">받기</span>
            </button>
          )}

          {mine && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => openBoost(meetup.id)}
                className="press flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#C9D0FF] bg-[#F6F7FF] text-[12.5px] font-semibold text-[#4F63FF]"
              >
                <ThunderboltFilled style={{ fontSize: 11 }} />
                {isBoosted(meetup.id) ? "부스트 연장 · 2,900원" : "부스트로 위에 올리기"}
              </button>
            </div>
          )}

          {related.length > 0 && (
            <section className="mt-6">
              <SectionHead title="이 번개에서 남은 장면" sub={`${related.length}개의 인증샷`} />
              <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
                {related.map((post) => (
                  <ProofCard key={post.id} post={post} compact />
                ))}
              </div>
            </section>
          )}

          <section className="mt-6">
            <SectionHead title={`${neighborhood.label}의 다른 번개`} sub="가까운 순" />
            <div className="mt-2.5 space-y-1">
              {others.length > 0 ? (
                others.map((item) => <MeetupRow key={item.id} meetup={item} onOpen={() => openDetail(item.id)} />)
              ) : (
                <EmptyRow>이 동네의 다른 번개는 곧 열려요.</EmptyRow>
              )}
            </div>
          </section>

          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-white p-3">
            <Avatar user={host} size={32} />
            <p className="min-w-0 flex-1 truncate text-[11.5px] text-[#6E7587]">{host.bio}</p>
            <span className="rounded-full bg-[#F5F6FA] px-2 py-1 text-[10.5px] font-semibold text-[#9AA1B2]">호스트</span>
          </div>

          <p className="mt-4 text-center text-[10.5px] leading-relaxed text-[#B7BCC9]">
            데모 앱이에요. 참여와 결제는 이 브라우저 세션에만 저장됩니다.
          </p>
        </div>
      </div>

      {/* sticky action bar */}
      <div className="border-t border-[#ECEEF3] bg-white px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleInterested(meetup.id)}
            className="press flex h-12 w-[92px] items-center justify-center gap-1.5 rounded-full border text-[12.5px] font-semibold"
            style={{
              borderColor: isInterested ? "#C9D0FF" : "#E2E5EC",
              background: isInterested ? "#EEF0FF" : "#fff",
              color: isInterested ? "#4F63FF" : "#3A3F51",
            }}
          >
            <BookmarkIcon filled={isInterested} size={12} />
            다음에
          </button>
          <button
            type="button"
            onClick={() => {
              if (mine) {
                message.info("내가 연 번개예요. 프로필에서 관리할 수 있어요.");
                return;
              }
              if (!isJoined && left <= 0) {
                message.warning("자리가 모두 찼어요.");
                return;
              }
              toggleJoin(meetup.id);
              message.success(isJoined ? "참여를 취소했어요." : "참여했어요. 시간에 봐요!");
            }}
            className="press flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full text-[14px] font-bold"
            style={{
              background: isJoined ? "#EEF0FF" : left <= 0 ? "#EDEFF5" : "#4F63FF",
              color: isJoined ? "#4F63FF" : left <= 0 ? "#9AA1B2" : "#fff",
            }}
          >
            {isJoined && <CheckOutlined style={{ fontSize: 12 }} />}
            {mine
              ? `호스트로 참여 중 · ${left}자리 남음`
              : isJoined
                ? "참여 중 · 취소하기"
                : left <= 0
                  ? "마감된 번개"
                  : `참여하기 · ${left}자리 남음`}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MeetupDetailSheet() {
  const { detailId, closeDetail } = useCrewlog();
  return (
    <Drawer
      open={Boolean(detailId)}
      onClose={closeDetail}
      placement="right"
      width={760}
      rootClassName="detail-drawer"
      closable={false}
      styles={{ body: { padding: 0 } }}
    >
      {detailId && <MeetupDetailBody id={detailId} onBack={closeDetail} />}
    </Drawer>
  );
}

export function MeetupDetailPage({ id }: { id: string }) {
  const router = useRouter();
  return (
    <div className="min-h-[100dvh] bg-[#F6F7FB] md:py-8">
      <div className="mx-auto h-[100dvh] max-w-[760px] overflow-hidden bg-[#F6F7FB] md:h-[calc(100dvh-64px)] md:rounded-[28px] md:border md:border-[#ECEEF3] md:shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
        <MeetupDetailBody id={id} onBack={() => router.push("/")} />
      </div>
    </div>
  );
}
