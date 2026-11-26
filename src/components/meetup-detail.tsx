"use client";

import Image from "next/image";
import Link from "next/link";
import { App, Button, Drawer, Progress, Tag } from "antd";
import { ArrowRightOutlined, ThunderboltFilled } from "@ant-design/icons";
import { AvatarStack, CrewAvatar } from "./avatar";
import { categoryOf, neighborhoodOf } from "@/lib/seed";
import { clock, dayBadge, pct } from "@/lib/format";
import { useCrewlog } from "@/lib/store";

export function MeetupDetail() {
  const {
    detailId,
    closeDetail,
    meetupById,
    userById,
    participantCount,
    spotsLeft,
    joined,
    toggleJoin,
    isBoosted,
    openBoost,
  } = useCrewlog();
  const { message } = App.useApp();

  const meetup = detailId ? meetupById(detailId) : undefined;

  return (
    <Drawer
      open={Boolean(detailId && meetup)}
      onClose={closeDetail}
      width={520}
      title={<span className="eyebrow">번개 상세</span>}
      styles={{ body: { padding: 0 } }}
    >
      {meetup && (
        <div>
          {meetup.cover ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#EFEAE2]">
              <Image
                src={meetup.cover}
                alt={meetup.title}
                fill
                sizes="520px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="grid aspect-[16/7] w-full place-items-center"
              style={{ background: categoryOf(meetup.categoryId).tint }}
            >
              <span
                className="text-[22px] tracking-[0.06em]"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: categoryOf(meetup.categoryId).color,
                }}
              >
                {categoryOf(meetup.categoryId).label}
              </span>
            </div>
          )}

          <div className="p-6">
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag
                bordered={false}
                style={{
                  background: categoryOf(meetup.categoryId).tint,
                  color: categoryOf(meetup.categoryId).color,
                  fontSize: 10,
                  lineHeight: "18px",
                  padding: "0 7px",
                }}
              >
                {categoryOf(meetup.categoryId).label}
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
                {neighborhoodOf(meetup.neighborhoodId).label}
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
              {spotsLeft(meetup.id) <= 0 && (
                <Tag
                  bordered={false}
                  style={{
                    background: "#F1ECE4",
                    color: "#9A948C",
                    fontSize: 10,
                    lineHeight: "18px",
                    padding: "0 7px",
                  }}
                >
                  마감
                </Tag>
              )}
            </div>

            <h2
              className="mt-3 text-[24px] leading-[1.3] tracking-[-0.04em] text-[#141413]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {meetup.title}
            </h2>
            <p className="mt-1.5 text-[12px] text-[#6B6660]">{meetup.place}</p>

            <div className="mt-5 grid grid-cols-3 border-y border-[#E5E0D8]">
              <div className="py-3 pr-3">
                <p className="eyebrow">일시</p>
                <p className="num mt-1 text-[12px] text-[#141413]">
                  {dayBadge(meetup.startsAt)} {clock(meetup.startsAt)}
                </p>
              </div>
              <div className="border-l border-[#E5E0D8] px-3 py-3">
                <p className="eyebrow">인원</p>
                <p className="num mt-1 text-[12px] text-[#141413]">
                  {participantCount(meetup.id)}/{meetup.capacity}명
                </p>
              </div>
              <div className="border-l border-[#E5E0D8] py-3 pl-3">
                <p className="eyebrow">남은 자리</p>
                <p
                  className="num mt-1 text-[12px]"
                  style={{ color: spotsLeft(meetup.id) > 0 ? "#E84A27" : "#9A948C" }}
                >
                  {spotsLeft(meetup.id) > 0 ? `${spotsLeft(meetup.id)}자리` : "마감"}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <Progress
                percent={pct(participantCount(meetup.id), meetup.capacity)}
                showInfo={false}
                size={{ height: 3 }}
                strokeColor="#141413"
                trailColor="#EFEBE4"
              />
            </div>

            <p className="mt-4 text-[13px] leading-[1.85] text-[#3D3A36]">
              {meetup.description}
            </p>

            <div className="mt-6">
              <p className="eyebrow">HOST</p>
              <div className="mt-2 flex items-center gap-2.5">
                <CrewAvatar user={userById(meetup.hostId)} size={34} />
                <div>
                  <p className="text-[12.5px] font-medium text-[#141413]">
                    {userById(meetup.hostId).name}
                    {userById(meetup.hostId).pro && (
                      <span className="ml-1.5 rounded-[2px] border border-[#1F5E4B]/25 bg-[#E6EDE9] px-1 font-mono text-[8px] text-[#1F5E4B]">
                        PRO
                      </span>
                    )}
                  </p>
                  <p className="font-mono text-[10px] text-[#9A948C]">
                    @{userById(meetup.hostId).handle}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="eyebrow">참여자 {participantCount(meetup.id)}명</p>
                <AvatarStack
                  users={meetup.participantIds.map(userById)}
                  max={7}
                  size={26}
                />
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {[...(joined[meetup.id] ? ["u1"] : []), ...meetup.participantIds].map(
                  (userId) => (
                    <span
                      key={userId}
                      className="border border-[#E5E0D8] bg-white px-2 py-0.5 text-[10.5px] text-[#3D3A36]"
                    >
                      {userById(userId).name}
                    </span>
                  ),
                )}
              </div>
            </div>

            {meetup.persisted && (
              <Link
                href={`/meetups/${meetup.id}`}
                onClick={closeDetail}
                className="ink-link mt-5 inline-flex items-center gap-1 text-[11.5px] text-[#1F5E4B]"
              >
                전체 페이지에서 보기 <ArrowRightOutlined style={{ fontSize: 10 }} />
              </Link>
            )}

            <div className="sticky bottom-0 -mx-6 mt-5 flex gap-2 border-t border-[#E5E0D8] bg-[#FAF8F5] px-6 py-4">
              <Button
                type={joined[meetup.id] ? "default" : "primary"}
                danger={joined[meetup.id]}
                block
                size="large"
                disabled={!joined[meetup.id] && spotsLeft(meetup.id) <= 0}
                onClick={() => {
                  if (!joined[meetup.id] && spotsLeft(meetup.id) <= 0) {
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
                  : spotsLeft(meetup.id) > 0
                    ? "참여하기"
                    : "마감된 번개"}
              </Button>
              {meetup.hostId === "u1" && !isBoosted(meetup.id) && (
                <Button size="large" onClick={() => openBoost(meetup.id)}>
                  부스트
                </Button>
              )}
            </div>

          </div>
        </div>
      )}
    </Drawer>
  );
}
