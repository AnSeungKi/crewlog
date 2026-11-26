"use client";

import { useState } from "react";
import Image from "next/image";
import { App, Avatar, Card, Input } from "antd";
import {
  BookFilled,
  BookOutlined,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { CrewAvatar } from "./avatar";
import { TimeAgo } from "./time-ago";
import { categoryOf, neighborhoodOf, ME } from "@/lib/seed";
import { clock, dayBadge, pct } from "@/lib/format";
import { useCrewlog } from "@/lib/store";
import type { ProofPost } from "@/lib/types";

export function ProofCard({
  post,
  feature = false,
  priority = false,
}: {
  post: ProofPost;
  feature?: boolean;
  priority?: boolean;
}) {
  const {
    userById,
    meetupById,
    sponsorById,
    commentsFor,
    likeCount,
    liked,
    saved,
    toggleLike,
    toggleSave,
    addComment,
    participantCount,
    spotsLeft,
    joined,
    toggleJoin,
    openDetail,
    openCoupon,
  } = useCrewlog();
  const { message } = App.useApp();

  const [draft, setDraft] = useState("");
  const [showAll, setShowAll] = useState(false);

  const author = userById(post.authorId);
  const category = categoryOf(post.categoryId);
  const meetup = post.meetupId ? meetupById(post.meetupId) : undefined;
  const sponsor = post.sponsorId ? sponsorById(post.sponsorId) : undefined;
  const comments = commentsFor(post.id);
  const visibleComments = showAll ? comments : comments.slice(-2);
  const isLiked = Boolean(liked[post.id]);
  const isSaved = Boolean(saved[post.id]);

  const submitComment = () => {
    if (!draft.trim()) return;
    addComment(post.id, draft);
    setDraft("");
    setShowAll(true);
  };

  return (
    <Card
      variant="outlined"
      className="group transition-colors duration-300 hover:border-[#CFC7BA]"
      style={{ borderColor: "#E5E0D8", background: "#FFFFFF", borderRadius: 8 }}
      styles={{ body: { padding: 0 } }}
    >
      <div className={feature ? "flex flex-col sm:flex-row" : "flex flex-col"}>
        {post.image && (
          <div
            className={
              feature
                ? "relative h-[220px] w-full shrink-0 overflow-hidden bg-[#EFEAE2] sm:h-auto sm:w-[52%]"
                : "relative aspect-[3/2] w-full shrink-0 overflow-hidden bg-[#EFEAE2]"
            }
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority={priority}
              sizes={feature ? "(max-width: 640px) 100vw, 440px" : "(max-width: 768px) 100vw, 420px"}
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
              <span
                className="rounded-[3px] px-2 py-[3px] text-[10px] font-medium tracking-tight text-[#FAF8F5]"
                style={{ background: "rgba(20,20,19,0.82)" }}
              >
                {category.label}
              </span>
              {sponsor && (
                <button
                  type="button"
                  onClick={() => openCoupon(sponsor.id)}
                  className="rounded-[3px] bg-[#1F5E4B] px-2 py-[3px] text-[10px] font-medium tracking-tight text-[#F1F5F2]"
                >
                  제휴 · 혜택
                </button>
              )}
            </div>
          </div>
        )}

        <div className={`flex min-w-0 flex-1 flex-col p-5 ${feature ? "sm:p-6" : ""}`}>
          <div className="flex items-center gap-2.5">
            <CrewAvatar user={author} size={32} />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[12.5px] font-medium leading-tight text-[#141413]">
                {author.name}
                {author.pro && (
                  <span className="rounded-[2px] border border-[#1F5E4B]/25 bg-[#E6EDE9] px-1 font-mono text-[8px] tracking-[0.08em] text-[#1F5E4B]">
                    PRO
                  </span>
                )}
                {author.partner && (
                  <span className="rounded-[2px] border border-[#9A7B3F]/25 bg-[#F5EFE2] px-1 font-mono text-[8px] tracking-[0.08em] text-[#8C6E3A]">
                    PARTNER
                  </span>
                )}
              </p>
              <p className="mt-0.5 truncate font-mono text-[10px] text-[#9A948C]">
                @{author.handle} · {neighborhoodOf(post.neighborhoodId).label} ·{" "}
                <TimeAgo iso={post.createdAt} />
              </p>
            </div>
          </div>

          <h3
            className={`mt-3.5 tracking-[-0.035em] text-[#141413] ${
              feature ? "text-[24px] leading-[1.3] sm:text-[26px]" : "text-[19px] leading-[1.36]"
            }`}
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {post.title}
          </h3>
          <p
            className={`mt-2 text-[13px] leading-[1.75] text-[#3D3A36] ${
              feature ? "line-clamp-5" : "line-clamp-4"
            }`}
          >
            {post.body}
          </p>

          {meetup && (
            <div className="mt-3.5 flex items-center gap-2 border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-2">
              <button
                type="button"
                onClick={() => openDetail(meetup.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <span className="shrink-0 font-mono text-[10px] text-[#6B6660]">
                  {dayBadge(meetup.startsAt)} {clock(meetup.startsAt)}
                </span>
                <span className="hidden h-3 w-px shrink-0 bg-[#E5E0D8] sm:block" />
                <span className="truncate text-[11.5px] text-[#141413]">{meetup.title}</span>
                <span className="ml-auto shrink-0 font-mono text-[10px] text-[#6B6660]">
                  {participantCount(meetup.id)}/{meetup.capacity}
                </span>
              </button>
              <span className="h-3.5 w-px shrink-0 bg-[#E5E0D8]" />
              <button
                type="button"
                onClick={() => {
                  if (!joined[meetup.id] && spotsLeft(meetup.id) <= 0) {
                    message.warning("자리가 모두 찼습니다.");
                    return;
                  }
                  toggleJoin(meetup.id);
                  message.success(
                    joined[meetup.id] ? "참여를 취소했습니다." : "참여했습니다. 시간에 봐요.",
                  );
                }}
                className="shrink-0 whitespace-nowrap text-[11px] font-medium"
                style={{ color: joined[meetup.id] ? "#9A948C" : "#E84A27" }}
              >
                {joined[meetup.id] ? "참여 취소" : "참여"}
              </button>
            </div>
          )}

          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between gap-2 border-t border-[#EFEBE4] pt-3">
              <div className="flex min-w-0 items-center gap-3.5 text-[12px]">
                <button
                  type="button"
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-1.5 transition-transform active:scale-[0.92]"
                  style={{ color: isLiked ? "#E84A27" : "#3D3A36" }}
                  aria-label="좋아요"
                >
                  {isLiked ? (
                    <HeartFilled style={{ fontSize: 14 }} />
                  ) : (
                    <HeartOutlined style={{ fontSize: 14 }} />
                  )}
                  <span className="num text-[11.5px]">{likeCount(post.id)}</span>
                </button>
                <span className="flex items-center gap-1.5 text-[#3D3A36]">
                  <MessageOutlined style={{ fontSize: 13 }} />
                  <span className="num text-[11.5px]">{comments.length}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    toggleSave(post.id);
                    message.success(
                      isSaved ? "저장을 해제했습니다." : "인증샷을 저장했습니다.",
                    );
                  }}
                  className="flex items-center gap-1 transition-transform active:scale-[0.92]"
                  style={{ color: isSaved ? "#1F5E4B" : "#3D3A36" }}
                  aria-label="저장"
                >
                  {isSaved ? (
                    <BookFilled style={{ fontSize: 13 }} />
                  ) : (
                    <BookOutlined style={{ fontSize: 13 }} />
                  )}
                  <span className="hidden text-[10.5px] sm:inline">
                    {isSaved ? "저장됨" : "저장"}
                  </span>
                </button>
              </div>

              {meetup && (
                <span className="num shrink-0 text-[10px] text-[#9A948C]">
                  {pct(participantCount(meetup.id), meetup.capacity)}% 참여
                </span>
              )}
            </div>

            <div className="mt-2.5">
              {comments.length > 2 && !showAll && (
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="mb-1.5 text-[11px] text-[#9A948C] hover:text-[#3D3A36]"
                >
                  댓글 {comments.length}개 모두 보기
                </button>
              )}
              <div className="space-y-1.5">
                {visibleComments.map((comment) => {
                  const writer = userById(comment.authorId);
                  return (
                    <p key={comment.id} className="text-[12px] leading-[1.6] text-[#3D3A36]">
                      <span className="mr-1.5 font-medium text-[#141413]">{writer.name}</span>
                      {comment.body}
                    </p>
                  );
                })}
              </div>

              <div className="mt-2 flex items-center gap-2">
                <Avatar
                  size={22}
                  style={{
                    background: ME.accent,
                    color: "#FAF8F5",
                    fontFamily: "var(--font-serif)",
                    fontSize: 10,
                    border: "1px solid rgba(20,20,19,0.08)",
                    flexShrink: 0,
                  }}
                >
                  {ME.name.slice(0, 1)}
                </Avatar>
                <Input
                  variant="borderless"
                  size="small"
                  placeholder="댓글 달기…"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onPressEnter={submitComment}
                  className="min-w-0 flex-1"
                  style={{ paddingInline: 0, fontSize: 12 }}
                />
                <button
                  type="button"
                  onClick={submitComment}
                  disabled={!draft.trim()}
                  className="flex shrink-0 items-center text-[11px] font-medium disabled:opacity-30"
                  style={{ color: "#E84A27" }}
                  aria-label="댓글 게시"
                >
                  <SendOutlined style={{ fontSize: 12 }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
