"use client";

import { Button, Statistic } from "antd";
import { ArrowRightOutlined, ThunderboltFilled } from "@ant-design/icons";
import { BOOST_HOURS, BOOST_PRICE } from "@/lib/seed";
import { won } from "@/lib/format";
import { useCrewlog } from "@/lib/store";

export function ProBand() {
  const { setProOpen, openBoost, meetups } = useCrewlog();
  const myMeetup = meetups.find((meetup) => meetup.hostId === "u1");

  return (
    <section className="mx-auto mt-16 max-w-[1320px] px-5">
      <div className="bg-[#141413] px-6 py-10 text-[#FAF8F5] sm:px-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="eyebrow text-[#E84A27]">CREW HOST PRO</p>
            <h2
              className="mt-3 text-[32px] leading-[1.24] tracking-[-0.04em] sm:text-[38px]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              크루를 여는 사람을
              <br />
              위한 도구
            </h2>
            <p className="mt-4 max-w-[42ch] text-[13px] leading-[1.8] text-[#B8B2A8]">
              번개 상단 노출, 참여자 관리, 정산 리포트까지. 동네에서 꾸준히 사람을
              모으는 호스트에게 필요한 것만 담았습니다. 수수료는 받지 않습니다.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="large" onClick={() => setProOpen(true)}>
                Pro 플랜 알아보기
              </Button>
              <button
                type="button"
                onClick={() => myMeetup && openBoost(myMeetup.id)}
                className="flex items-center gap-2 text-[12.5px] text-[#E8E2D8] hover:text-white"
              >
                <ThunderboltFilled style={{ color: "#E84A27" }} />
                부스트 {won(BOOST_PRICE)} / {BOOST_HOURS}시간
                <ArrowRightOutlined style={{ fontSize: 10 }} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 lg:border-l lg:border-white/10 lg:pl-10">
            <div className="grid grid-cols-3 gap-4">
              <Statistic
                title={<span className="text-[10.5px] text-[#9C968C]">번개 부스트</span>}
                value="2,900원"
                valueStyle={{
                  color: "#FAF8F5",
                  fontFamily: "var(--font-mono)",
                  fontSize: 26,
                  letterSpacing: "-0.03em",
                }}
              />
              <Statistic
                title={<span className="text-[10.5px] text-[#9C968C]">호스트 수수료</span>}
                value="0%"
                valueStyle={{
                  color: "#FAF8F5",
                  fontFamily: "var(--font-mono)",
                  fontSize: 26,
                  letterSpacing: "-0.03em",
                }}
              />
              <Statistic
                title={<span className="text-[10.5px] text-[#9C968C]">Pro 월 요금</span>}
                value="19,000원"
                valueStyle={{
                  color: "#FAF8F5",
                  fontFamily: "var(--font-mono)",
                  fontSize: 26,
                  letterSpacing: "-0.03em",
                }}
              />
            </div>

            <div className="mt-8 space-y-2.5 border-t border-white/10 pt-6">
              {[
                "번개 상단 부스트 — 24시간, 2,900원",
                "참여자 명단·노쇼 관리, 카카오톡 공유 링크",
                "월간 정산 리포트와 제휴 쿠폰 발행",
              ].map((line) => (
                <p key={line} className="flex items-start gap-2 text-[12px] text-[#DDD6C9]">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#E84A27]" />
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
