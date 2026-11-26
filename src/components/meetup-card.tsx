"use client";

import Image from "next/image";
import { App, Button, Card, Tag } from "antd";
import { ArrowRightOutlined, ThunderboltFilled } from "@ant-design/icons";
import { AvatarStack } from "./avatar";
import { ME } from "@/lib/seed";
import { categoryOf, neighborhoodOf } from "@/lib/seed";
import { clock, dayBadge, pct } from "@/lib/format";
import { useCrewlog } from "@/lib/store";
import type { Meetup } from "@/lib/types";

export function MeetupCard({
  meetup,
  isNew = false,
  feature = false,
}: {
  meetup: Meetup;
  isNew?: boolean;
  feature?: boolean;
}) {
  const {
    userById,
    participantCount,
    spotsLeft,
    joined,
    toggleJoin,
    openDetail,
    isBoosted,
    openBoost,
  } = useCrewlog();
  const { message } = App.useApp();

  const category = categoryOf(meetup.categoryId);
  const host = userById(meetup.hostId);
  const count = participantCount(meetup.id);
  const left = spotsLeft(meetup.id);
  const capped = left <= 0;
  const boosted = isBoosted(meetup.id);

  const join = () => {
    if (!joined[meetup.id] && capped) {
      message.warning("자리가 모두 찼습니다.");
      return;
    }
    toggleJoin(meetup.id);
    message.success(
      joined[meetup.id] ? "참여를 취소했습니다." : "참여했습니다. 시간에 봐요.",
    );
  };

  return (
    <Card
      variant="outlined"
      className="overflow-hidden transition-colors duration-300 hover:border-[#CFC7BA]"
      style={{ borderColor: "#E5E0D8", background: "#FFFFFF", borderRadius: 8 }}
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ height: 3, background: category.color }} />

      <div className={feature ? "flex flex-col sm:flex-row" : "flex flex-col"}>
        {feature && (
          <div className="relative h-[190px] w-full shrink-0 overflow-hidden bg-[#EFEAE2] sm:h-auto sm:w-[46%]">
            {meetup.cover ? (
              <Image
                src={meetup.cover}
                alt={meetup.title}
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover"
              />
            ) : (
              <div
                className="grid h-full w-full place-items-center"
                style={{ background: category.tint }}
              >
                <span
                  className="text-[22px]"
                  style={{ fontFamily: "var(--font-serif)", color: category.color }}
                >
                  {category.label}
                </span>
              </div>
            )}
            {boosted && (
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-[3px] bg-[#E84A27] px-2 py-[3px] text-[10px] font-medium text-[#FAF8F5]">
                <ThunderboltFilled style={{ fontSize: 9 }} /> 부스트 노출
              </span>
            )}
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-2 border-b border-[#EFEBE4] px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag
                bordered={false}
                style={{
                  background: category.tint,
                  color: category.color,
                  fontSize: 10,
                  lineHeight: "18px",
                  padding: "0 7px",
                  borderRadius: 3,
                }}
              >
                {category.label}
              </Tag>
              {boosted && !feature && (
                <Tag
                  bordered={false}
                  style={{
                    background: "#FBEDE8",
                    color: "#C43E1F",
                    fontSize: 10,
                    lineHeight: "18px",
                    padding: "0 7px",
                    borderRadius: 3,
                  }}
                >
                  <ThunderboltFilled style={{ fontSize: 9, marginRight: 2 }} />
                  부스트
                </Tag>
              )}
              {capped && (
                <Tag
                  bordered={false}
                  style={{
                    background: "#F1ECE4",
                    color: "#9A948C",
                    fontSize: 10,
                    lineHeight: "18px",
                    padding: "0 7px",
                    borderRadius: 3,
                  }}
                >
                  마감
                </Tag>
              )}
              {isNew && (
                <Tag
                  bordered={false}
                  style={{
                    background: "#141413",
                    color: "#FAF8F5",
                    fontSize: 10,
                    lineHeight: "18px",
                    padding: "0 7px",
                    borderRadius: 3,
                  }}
                >
                  NEW
                </Tag>
              )}
            </div>
            <span className="num shrink-0 text-[10.5px] text-[#6B6660]">
              {dayBadge(meetup.startsAt)} {clock(meetup.startsAt)}
            </span>
          </div>

          <div className={`flex flex-1 flex-col px-4 pb-3.5 ${feature ? "pt-4 sm:px-5" : "pt-3.5"}`}>
            <p className="eyebrow">
              번개 모집 · {neighborhoodOf(meetup.neighborhoodId).label} · {host.name} 호스트
            </p>
            <button
              type="button"
              onClick={() => openDetail(meetup.id)}
              className="mt-1.5 block text-left"
            >
              <h3
                className={`tracking-[-0.035em] text-[#141413] ${
                  feature
                    ? "text-[22px] leading-[1.32] sm:text-[24px]"
                    : "text-[18.5px] leading-[1.36]"
                }`}
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {meetup.title}
              </h3>
            </button>
            <p className="mt-1.5 truncate text-[11.5px] text-[#6B6660]">{meetup.place}</p>

            {feature && (
              <p className="mt-2 line-clamp-2 text-[12.5px] leading-[1.75] text-[#3D3A36]">
                {meetup.description}
              </p>
            )}

            {feature && (
              <button
                type="button"
                onClick={() => openDetail(meetup.id)}
                className="mt-2 inline-flex items-center gap-1 self-start text-[11px] text-[#1F5E4B] hover:underline"
              >
                번개 자세히 보기 <ArrowRightOutlined style={{ fontSize: 9 }} />
              </button>
            )}

            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="num text-[#3D3A36]">
                  {count}/{meetup.capacity}명
                </span>
                <span className="num" style={{ color: capped ? "#9A948C" : "#E84A27" }}>
                  {capped ? "자리 없음" : `${left}자리 남음`}
                </span>
              </div>
              <div className="mt-1.5 h-[3px] w-full overflow-hidden bg-[#EFEBE4]">
                <div
                  className="h-full transition-[width] duration-500"
                  style={{
                    width: `${pct(count, meetup.capacity)}%`,
                    background: capped ? "#9A948C" : category.color,
                  }}
                />
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 pt-3.5">
              <div className="flex min-w-0 items-center gap-2">
                <AvatarStack
                  users={[
                    ...(joined[meetup.id] ? [ME] : []),
                    ...meetup.participantIds.map(userById),
                  ]}
                  max={4}
                  size={22}
                />
                <span className="truncate text-[10.5px] text-[#9A948C]">{count}명 참여</span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {meetup.hostId === "u1" && !boosted && (
                  <Button size="small" onClick={() => openBoost(meetup.id)}>
                    부스트
                  </Button>
                )}
                <Button
                  size="small"
                  type={joined[meetup.id] ? "default" : "primary"}
                  danger={joined[meetup.id]}
                  disabled={!joined[meetup.id] && capped}
                  onClick={join}
                >
                  {joined[meetup.id] ? "참여 취소" : capped ? "마감" : "참여"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
