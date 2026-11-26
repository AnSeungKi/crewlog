"use client";

import Image from "next/image";
import dayjs from "dayjs";
import { Button } from "antd";
import { ArrowRightOutlined, PlusOutlined } from "@ant-design/icons";
import { categoryOf, ME, MEETUPS, neighborhoodOf } from "@/lib/seed";
import type { NeighborhoodId } from "@/lib/types";
import { clock, dayBadge } from "@/lib/format";
import { useCrewlog } from "@/lib/store";

export function Hero() {
  const { meetups, openComposer, participantCount, spotsLeft } = useCrewlog();

  const people = meetups.reduce((sum, meetup) => sum + participantCount(meetup.id), 0);
  const openMeetups = meetups.filter((meetup) => spotsLeft(meetup.id) > 0);
  const neighborhoodIds: NeighborhoodId[] = ["seongsu", "yeonnam", "jamsil", "pangyo"];
  const busiest = neighborhoodIds
    .map((id) => ({
      id,
      count: meetups.filter((m) => m.neighborhoodId === id).length,
    }))
    .sort((a, b) => b.count - a.count)[0];

  const ticker = MEETUPS.slice(0, 4).map((meetup) => {
    const category = categoryOf(meetup.categoryId);
    return `${neighborhoodOf(meetup.neighborhoodId).label} ${category.label} · ${dayBadge(
      meetup.startsAt,
    )} ${clock(meetup.startsAt)}`;
  });

  return (
    <section className="mx-auto max-w-[1320px] px-5 pt-9">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D8] pb-3">
        <p className="eyebrow">
          VOL. 12 · {dayjs().format("YYYY.MM.DD ddd")} · SEOUL
        </p>
        <p className="eyebrow flex items-center gap-2 text-[#E84A27]">
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-[#E84A27]" />
          실시간 업데이트
        </p>
      </div>

      <div className="grid gap-10 pt-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-[#E84A27]">HYPERLOCAL CREW MAGAZINE</p>
          <h1 className="display mt-3 text-[40px] leading-[1.12] sm:text-[54px] lg:text-[62px]">
            동네에서,
            <br />
            오늘 바로
            <br />
            <em>만나는 사람들</em>
          </h1>
          <p className="mt-5 max-w-[44ch] text-[14.5px] leading-[1.8] text-[#3D3A36]">
            성수동의 붉은 벽돌 골목부터 한강의 긴 노을까지. 오늘 열린 번개 모임과
            그 자리에서 남은 인증샷을 한 호에 담았습니다. 약속은 짧게, 기록은
            길게.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => openComposer("meetup")}
            >
              번개 열기
            </Button>
            <Button
              size="large"
              onClick={() =>
                document.getElementById("map")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              동네 지도 <ArrowRightOutlined style={{ fontSize: 11 }} />
            </Button>
            <span className="num text-[11px] text-[#9A948C]">
              {openMeetups.length}개 모집 중 · {people}명 참여
            </span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <aside className="border border-[#E5E0D8] bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="eyebrow">EDITOR&apos;S NOTE</p>
              <p className="eyebrow">NO. 12</p>
            </div>
            <p
              className="mt-3 text-[21px] leading-[1.55] tracking-[-0.03em]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              &ldquo;약속은 짧게,
              <br />
              기록은 길게.&rdquo;
            </p>

            <div className="mt-5 grid grid-cols-3 border-y border-[#EFEBE4] py-4">
              {[
                { label: "열린 번개", value: openMeetups.length, unit: "개" },
                { label: "모인 크루원", value: people, unit: "명" },
                { label: "동네", value: 4, unit: "곳" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={index === 0 ? "" : "border-l border-[#EFEBE4] pl-4"}
                >
                  <p className="num text-[26px] leading-none text-[#141413]">
                    {stat.value}
                    <span className="ml-0.5 text-[11px] text-[#9A948C]">
                      {stat.unit}
                    </span>
                  </p>
                  <p className="mt-1.5 text-[11px] text-[#6B6660]">{stat.label}</p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[12px] leading-relaxed text-[#6B6660]">
              지금 가장 붐비는 동네는{" "}
              <span className="font-medium text-[#141413]">
                {neighborhoodOf(busiest.id).label}
              </span>{" "}
              — {busiest.count}개의 번개가 열려 있습니다.
            </p>
          </aside>
        </div>
      </div>

      <figure className="relative mt-9 overflow-hidden border border-[#E5E0D8] bg-[#EFEAE2]">
        <Image
          src="/images/seongsu-dusk.jpg"
          alt="해 질 무렵 붉은 벽돌 카페가 불을 밝힌 성수동 골목"
          width={1600}
          height={709}
          priority
          sizes="(max-width: 1320px) 100vw, 1320px"
          className="h-[250px] w-full object-cover sm:h-[340px] lg:h-[400px]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141413]/55 via-[#141413]/0 to-[#141413]/0" />
        <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 text-[#FAF8F5] sm:p-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-75">
              Cover story · {ME.name}의 기록
            </p>
            <p
              className="mt-1.5 text-[19px] leading-tight sm:text-[23px]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              해 질 무렵의 성수동, 사람들이 제일 많이 웃는 시간
            </p>
          </div>
          <p className="num text-[10.5px] opacity-75">11.26 18:04 · ISO 400</p>
        </figcaption>
      </figure>

      <div className="mt-4 flex items-center gap-4 overflow-hidden border-b border-[#E5E0D8] pb-3">
        <span className="eyebrow shrink-0 text-[#E84A27]">● 지금</span>
        <div className="quiet-scroll flex gap-5 overflow-x-auto whitespace-nowrap font-mono text-[11px] text-[#3D3A36]">
          {ticker.map((line) => (
            <span key={line} className="shrink-0">
              {line}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
