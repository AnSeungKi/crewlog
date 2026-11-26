"use client";

import Image from "next/image";
import { App } from "antd";
import {
  CheckOutlined,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { useState } from "react";
import { Avatar, AvatarStack, CategoryGlyph, CategoryTag } from "./ui";
import { BookmarkIcon } from "./icons";
import { categoryOf, neighborhoodOf } from "@/lib/seed";
import { clock, dayBadge, fromNow } from "@/lib/format";
import { useCrewlog } from "@/lib/store";
import type { Meetup, ProofPost } from "@/lib/types";

/* ------------------------------------------------------------------ *
 * meetup card — the primary feed unit
 * ------------------------------------------------------------------ */

export function MeetupCard({ meetup, compact = false }: { meetup: Meetup; compact?: boolean }) {
  const {
    userById,
    participantCount,
    spotsLeft,
    joined,
    interested,
    toggleJoin,
    toggleInterested,
    isBoosted,
    openDetail,
    openBoost,
  } = useCrewlog();
  const { message } = App.useApp();

  const category = categoryOf(meetup.categoryId);
  const host = userById(meetup.hostId);
  const neighborhood = neighborhoodOf(meetup.neighborhoodId);
  const count = participantCount(meetup.id);
  const left = spotsLeft(meetup.id);
  const isJoined = Boolean(joined[meetup.id]);
  const isInterested = Boolean(interested[meetup.id]);
  const boosted = isBoosted(meetup.id);
  const mine = meetup.hostId === "u1";

  return (
    <article className="app-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 pb-3 pt-3.5">
        <Avatar user={host} size={32} />
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-semibold leading-tight text-[#14161F]">
            {host.name}
            {host.pro && <span className="ml-1 text-[10px] font-bold text-[#4F63FF]">PRO</span>}
            <span className="ml-1 font-normal text-[#9AA1B2]">· {neighborhood.label}</span>
          </p>
          <p className="mt-0.5 text-[11.5px] text-[#6E7587]">
            <span className="font-semibold text-[#3A3F51]">
              {dayBadge(meetup.startsAt)} {clock(meetup.startsAt)}
            </span>
            <span className="mx-1 text-[#D5D9E4]">|</span>
            {category.label}
          </p>
        </div>
        {boosted && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#EEF0FF] px-2 py-1 text-[10.5px] font-bold text-[#4F63FF]">
            <ThunderboltFilled style={{ fontSize: 10 }} /> 부스트
          </span>
        )}
        {!boosted && mine && (
          <span className="ml-auto rounded-full bg-[#F5F6FA] px-2 py-1 text-[10.5px] font-semibold text-[#6E7587]">
            내가 연 번개
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => openDetail(meetup.id)}
        className="block w-full px-2.5 text-left"
        aria-label={`${meetup.title} 상세 보기`}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[15px] bg-[#EDEFF5]">
          {meetup.cover ? (
            <Image
              src={meetup.cover}
              alt={meetup.title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
          ) : (
            <div
              className="grid h-full w-full place-items-center"
              style={{ background: category.tint, color: category.color }}
            >
              <CategoryGlyph id={category.id} size={30} />
            </div>
          )}
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#14161F] backdrop-blur">
            {dayBadge(meetup.startsAt)} {clock(meetup.startsAt)}
          </span>
          <span className="absolute right-2.5 top-2.5 rounded-full bg-[#14161F]/72 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {left > 0 ? `${count}/${meetup.capacity}명` : "마감"}
          </span>
        </div>
      </button>

      <div className="px-4 pb-4 pt-3">
        <button type="button" onClick={() => openDetail(meetup.id)} className="block w-full text-left">
          <h3 className="line-clamp-2 text-[16.5px] font-bold leading-[1.32] tracking-[-0.03em] text-[#14161F]">
            {meetup.title}
          </h3>
        </button>
        <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-[#6E7587]">
          <EnvironmentOutlined style={{ fontSize: 11, color: "#9AA1B2" }} />
          <span className="truncate">{meetup.place}</span>
        </p>

        {!compact && (
          <div className="mt-3 flex items-center justify-between">
            <AvatarStack
              users={[...(isJoined ? [userById("u1")] : []), ...meetup.participantIds.map(userById)]}
              max={4}
              size={24}
            />
            <span className="text-[11.5px] font-medium text-[#9AA1B2]">
              {count}명 참여 ·{" "}
              <span className="font-semibold text-[#3A3F51]">{left > 0 ? `${left}자리 남음` : "자리 없음"}</span>
            </span>
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              toggleInterested(meetup.id);
              message.success(isInterested ? "‘다음에’에서 뺐어요." : "‘다음에’에 담아뒀어요.");
            }}
            className="press flex h-11 items-center justify-center gap-1.5 rounded-full border text-[13px] font-semibold"
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
              if (!isJoined && left <= 0) {
                message.warning("자리가 모두 찼어요.");
                return;
              }
              toggleJoin(meetup.id);
              message.success(isJoined ? "참여를 취소했어요." : "참여했어요. 시간에 봐요!");
            }}
            className="press flex h-11 items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold"
            style={{
              background: isJoined ? "#EEF0FF" : left <= 0 ? "#EDEFF5" : "#4F63FF",
              color: isJoined ? "#4F63FF" : left <= 0 ? "#9AA1B2" : "#fff",
            }}
          >
            {isJoined && <CheckOutlined style={{ fontSize: 11 }} />}
            {isJoined ? "참여 중" : left <= 0 ? "마감" : "참여하기"}
          </button>
        </div>

        {mine && !boosted && (
          <button
            type="button"
            onClick={() => openBoost(meetup.id)}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-[12px] font-semibold text-[#4F63FF] hover:bg-[#F6F7FF]"
          >
            <ThunderboltFilled style={{ fontSize: 11 }} />
            부스트로 위에 올리기 · 2,900원
          </button>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ *
 * proof-shot card
 * ------------------------------------------------------------------ */

export function ProofCard({ post, compact = false }: { post: ProofPost; compact?: boolean }) {
  const { userById, likeCount, liked, toggleLike, saved, toggleSave, commentsFor } = useCrewlog();
  const author = userById(post.authorId);
  const category = categoryOf(post.categoryId);
  const neighborhood = neighborhoodOf(post.neighborhoodId);
  const comments = commentsFor(post.id).length;

  return (
    <article className="app-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 pb-3 pt-3.5">
        <Avatar user={author} size={32} />
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-semibold leading-tight text-[#14161F]">
            {author.name}
            <span className="ml-1 font-normal text-[#9AA1B2]">
              · {neighborhood.label}
            </span>
          </p>
          <p className="mt-0.5 text-[11.5px] text-[#6E7587]">{fromNow(post.createdAt)}</p>
        </div>
        <span className="ml-auto">
          <CategoryTag category={category} />
        </span>
      </div>

      {post.image && (
        <div className="px-2.5">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[15px] bg-[#EDEFF5]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="px-4 pb-3 pt-3">
        <h3 className="text-[15.5px] font-bold leading-snug tracking-[-0.03em] text-[#14161F]">
          {post.title}
        </h3>
        <p
          className={`mt-1.5 text-[13px] leading-[1.65] text-[#6E7587] ${compact ? "line-clamp-2" : "line-clamp-3"}`}
        >
          {post.body}
        </p>
      </div>

      <div className="mx-4 flex items-center gap-5 border-t border-[#F0F2F7] py-2.5">
        <button
          type="button"
          onClick={() => toggleLike(post.id)}
          className={`flex items-center gap-1.5 text-[12px] font-semibold transition-colors ${
            liked[post.id] ? "text-[#E5484D]" : "text-[#6E7587]"
          }`}
          aria-label="좋아요"
        >
          {liked[post.id] ? <HeartFilled style={{ fontSize: 13 }} /> : <HeartOutlined style={{ fontSize: 13 }} />}
          <span className="tnum">{likeCount(post.id)}</span>
        </button>
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6E7587]">
          <MessageOutlined style={{ fontSize: 13 }} />
          <span className="tnum">{comments}</span>
        </span>
        <button
          type="button"
          onClick={() => toggleSave(post.id)}
          className={`ml-auto flex h-8 w-8 items-center justify-center rounded-full ${
            saved[post.id] ? "bg-[#EEF0FF] text-[#4F63FF]" : "text-[#9AA1B2]"
          }`}
          aria-label="저장"
        >
          <BookmarkIcon filled={Boolean(saved[post.id])} size={13} />
        </button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ *
 * compact rows for lists (profile, map sheet, detail)
 * ------------------------------------------------------------------ */

export function MeetupRow({ meetup, onOpen }: { meetup: Meetup; onOpen?: () => void }) {
  const { userById, participantCount, openDetail } = useCrewlog();
  const category = categoryOf(meetup.categoryId);
  const host = userById(meetup.hostId);

  return (
    <button
      type="button"
      onClick={onOpen ?? (() => openDetail(meetup.id))}
      className="press flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-2.5 text-left"
    >
      <span className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-xl bg-[#EDEFF5]">
        {meetup.cover ? (
          <Image src={meetup.cover} alt="" fill sizes="52px" className="object-cover" />
        ) : (
          <span
            className="grid h-full w-full place-items-center"
            style={{ background: category.tint, color: category.color }}
          >
            <CategoryGlyph id={category.id} size={18} />
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-semibold text-[#14161F]">{meetup.title}</span>
        <span className="mt-0.5 block truncate text-[11.5px] text-[#6E7587]">
          {dayBadge(meetup.startsAt)} {clock(meetup.startsAt)} · {meetup.place}
        </span>
        <span className="mt-0.5 block text-[11px] text-[#9AA1B2]">
          {host.name} 호스트 · {participantCount(meetup.id)}/{meetup.capacity}명
        </span>
      </span>
    </button>
  );
}

/* small helper kept for meetup detail footer */
export function JoinHint() {
  const [shown, setShown] = useState(true);
  if (!shown) return null;
  return (
    <p className="px-1 text-[11px] leading-relaxed text-[#9AA1B2]">
      참여와 쿠폰은 이 브라우저 세션에만 저장되는 데모입니다.{" "}
      <button type="button" onClick={() => setShown(false)} className="underline">
        숨기기
      </button>
    </p>
  );
}
