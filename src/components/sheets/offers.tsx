"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { App, Drawer } from "antd";
import {
  CheckCircleFilled,
  CheckOutlined,
  CopyOutlined,
  CrownFilled,
  GiftFilled,
  ThunderboltFilled,
} from "@ant-design/icons";
import { BOOST_HOURS, BOOST_PRICE, PRO_PRICE, categoryOf } from "@/lib/seed";
import { clock, dayBadge, won } from "@/lib/format";
import { useCrewlog } from "@/lib/store";
import { CategoryGlyph, SheetHeader } from "../ui";

/* ------------------------------------------------------------------ *
 * boost — 2,900원 / 24시간 (데모 결제)
 * ------------------------------------------------------------------ */

export function BoostSheet() {
  const { boostTargetId, closeBoost, meetupById, participantCount, boostMeetup, openDetail } = useCrewlog();
  const { message } = App.useApp();
  const [step, setStep] = useState<"offer" | "paying" | "done">("offer");

  const meetup = boostTargetId ? meetupById(boostTargetId) : undefined;

  useEffect(() => {
    if (boostTargetId) setStep("offer");
  }, [boostTargetId]);

  const reach = meetup ? 64 + participantCount(meetup.id) * 9 : 0;

  const pay = () => {
    setStep("paying");
    window.setTimeout(() => {
      if (meetup) boostMeetup(meetup.id);
      setStep("done");
      message.success("부스트가 시작됐어요. 24시간 노출됩니다.");
    }, 900);
  };

  return (
    <Drawer
      open={Boolean(boostTargetId && meetup)}
      onClose={() => {
        closeBoost();
        setStep("offer");
      }}
      placement="bottom"
      height="auto"
      rootClassName="app-sheet"
    >
      {meetup && (
        <div className="pb-[calc(20px+env(safe-area-inset-bottom))]">
          <SheetHeader
            title="번개 부스트"
            subtitle="동네 사람들 피드와 지도 위쪽에 24시간 노출해요."
            onClose={() => {
              closeBoost();
              setStep("offer");
            }}
          />

          {step !== "done" ? (
            <div className="px-4">
              <div className="flex items-center gap-3 rounded-2xl bg-[#F8F9FD] p-3">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#EDEFF5]">
                  {meetup.cover ? (
                    <Image src={meetup.cover} alt="" fill sizes="48px" className="object-cover" />
                  ) : (
                    <span
                      className="grid h-full w-full place-items-center"
                      style={{ background: categoryOf(meetup.categoryId).tint }}
                    >
                      <CategoryGlyph id={meetup.categoryId} size={16} />
                    </span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-semibold text-[#14161F]">{meetup.title}</p>
                  <p className="mt-0.5 text-[11px] text-[#6E7587]">
                    {dayBadge(meetup.startsAt)} {clock(meetup.startsAt)} · {meetup.place}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 rounded-2xl border border-[#ECEEF3] p-4">
                <Row label="예상 도달" value={`약 ${reach}명`} />
                <Row label="노출 시간" value={`${BOOST_HOURS}시간`} />
                <Row label="노출 위치" value="피드 상단 · 지도 핀 강조" />
                <div className="my-1 h-px bg-[#F0F2F7]" />
                <Row label="결제 금액" value={won(BOOST_PRICE)} strong />
              </div>

              <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-[#FBF1E4] px-3 py-2.5 text-[11px] leading-relaxed text-[#8A5F23]">
                <span className="mt-[1px] whitespace-nowrap font-bold">데모 결제</span>
                실제 카드 결제는 일어나지 않아요. 이 브라우저 세션에만 기록됩니다.
              </p>

              <button
                type="button"
                onClick={pay}
                disabled={step === "paying"}
                className="press mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#4F63FF] text-[14px] font-bold text-white disabled:opacity-70"
              >
                {step === "paying" ? (
                  "결제하는 중…"
                ) : (
                  <>
                    <ThunderboltFilled style={{ fontSize: 12 }} /> {won(BOOST_PRICE)}으로 부스트하기
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="px-5 pb-2 pt-2 text-center">
              <CheckCircleFilled style={{ fontSize: 34, color: "#4F63FF" }} />
              <p className="mt-3 text-[17px] font-bold tracking-[-0.03em] text-[#14161F]">부스트가 시작됐어요</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[#6E7587]">
                24시간 동안 피드 상단과 지도에서 파란 핀으로 보여요.
                <br />
                결제 {won(BOOST_PRICE)} · 데모
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    closeBoost();
                    setStep("offer");
                  }}
                  className="press h-11 flex-1 rounded-full border border-[#E2E5EC] text-[13px] font-semibold text-[#3A3F51]"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeBoost();
                    setStep("offer");
                    openDetail(meetup.id);
                  }}
                  className="press h-11 flex-1 rounded-full bg-[#14161F] text-[13px] font-semibold text-white"
                >
                  번개 보기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-[#6E7587]">{label}</span>
      <span className={`text-[12.5px] ${strong ? "font-bold text-[#14161F]" : "font-semibold text-[#3A3F51]"}`}>
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * partner coupon
 * ------------------------------------------------------------------ */

export function CouponSheet() {
  const { couponTargetId, closeCoupon, sponsorById, claimCoupon } = useCrewlog();
  const { message } = App.useApp();
  const sponsor = couponTargetId ? sponsorById(couponTargetId) : undefined;

  useEffect(() => {
    if (couponTargetId) claimCoupon(couponTargetId);
  }, [couponTargetId, claimCoupon]);

  return (
    <Drawer
      open={Boolean(sponsor)}
      onClose={closeCoupon}
      placement="bottom"
      height="auto"
      rootClassName="app-sheet"
    >
      {sponsor && (
        <div className="pb-[calc(20px+env(safe-area-inset-bottom))]">
          <SheetHeader title={sponsor.name} subtitle={`${sponsor.categoryLabel} · 번개 참여자 전용`} onClose={closeCoupon} />

          <div className="px-4">
            <div className="flex items-center gap-2.5 rounded-2xl bg-[#F7F5FE] px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#8B6BD9]">
                <GiftFilled style={{ fontSize: 15 }} />
              </span>
              <div>
                <p className="text-[13.5px] font-bold text-[#5C4A9E]">{sponsor.benefit}</p>
                <p className="mt-0.5 text-[11px] text-[#8B80AC]">~{sponsor.expiresAt} · 1인 1회</p>
              </div>
            </div>

            <p className="mt-3 text-[12.5px] leading-relaxed text-[#6E7587]">{sponsor.detail}</p>

            <div className="mt-4 rounded-2xl border border-dashed border-[#D9D2F0] bg-[#FCFBFF] p-4">
              <p className="text-[10.5px] font-semibold tracking-[0.08em] text-[#A79CC6]">COUPON CODE</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="tnum text-[21px] font-extrabold tracking-[0.08em] text-[#14161F]">
                  {sponsor.code}
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(sponsor.code);
                      message.success("쿠폰 코드를 복사했어요.");
                    } catch {
                      message.info(`쿠폰 코드: ${sponsor.code}`);
                    }
                  }}
                  className="press flex h-9 items-center gap-1.5 rounded-full bg-[#14161F] px-3 text-[11.5px] font-semibold text-white"
                >
                  <CopyOutlined style={{ fontSize: 11 }} /> 복사
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#9AA1B2]">
              <CheckOutlined style={{ fontSize: 10, color: "#2E9E6B" }} />
              보관함에 저장했어요 · 프로필에서 다시 볼 수 있어요
            </div>

            <button
              type="button"
              onClick={closeCoupon}
              className="press mt-4 h-12 w-full rounded-full bg-[#4F63FF] text-[14px] font-bold text-white"
            >
              확인
            </button>
            <p className="mt-2 text-center text-[10.5px] text-[#B7BCC9]">
              데모 쿠폰이에요. 실제 매장에서 사용할 수 없습니다.
            </p>
          </div>
        </div>
      )}
    </Drawer>
  );
}

/* ------------------------------------------------------------------ *
 * host pro — 19,000원 / 월 (데모 결제)
 * ------------------------------------------------------------------ */

const PRO_FEATURES = [
  { title: "부스트 2회 포함", body: "매달 번개 두 개를 24시간 상단에 노출해요." },
  { title: "참여자 관리", body: "누가 참여했는지, 자리가 몇 개 남았는지 한눈에." },
  { title: "쿠폰 노출", body: "동네 제휴 가게 쿠폰을 번개 참여자에게 연결해요." },
  { title: "호스트 배지", body: "프로필과 번개 카드에 PRO 배지가 붙어요." },
];

export function ProSheet() {
  const { proOpen, setProOpen } = useCrewlog();
  const { message } = App.useApp();

  return (
    <Drawer open={proOpen} onClose={() => setProOpen(false)} placement="bottom" height="auto" rootClassName="app-sheet">
      <div className="pb-[calc(20px+env(safe-area-inset-bottom))]">
        <SheetHeader
          title="호스트 Pro"
          subtitle="번개를 자주 여는 사람을 위한 월 구독이에요."
          onClose={() => setProOpen(false)}
        />
        <div className="px-4">
          <div
            className="relative overflow-hidden rounded-2xl p-4 text-white"
            style={{ background: "linear-gradient(135deg,#4F63FF 0%,#3039B8 100%)" }}
          >
            <CrownFilled style={{ fontSize: 20 }} />
            <p className="mt-2 text-[17px] font-bold tracking-[-0.03em]">
              월 {won(PRO_PRICE)}
              <span className="ml-1 text-[11.5px] font-medium text-white/70">· 언제든 해지</span>
            </p>
            <p className="mt-1 text-[11.5px] text-white/75">부스트 2회 포함 · 데모 결제</p>
          </div>

          <div className="mt-3 space-y-2">
            {PRO_FEATURES.map((feature) => (
              <div key={feature.title} className="flex gap-2.5 rounded-2xl border border-[#ECEEF3] p-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EEF0FF] text-[#4F63FF]">
                  <CheckOutlined style={{ fontSize: 9 }} />
                </span>
                <div>
                  <p className="text-[12.5px] font-semibold text-[#14161F]">{feature.title}</p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#6E7587]">{feature.body}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => message.info("데모 앱이라 실제 결제는 진행되지 않아요.")}
            className="press mt-4 h-12 w-full rounded-full bg-[#4F63FF] text-[14px] font-bold text-white"
          >
            Pro 시작하기 · 월 {won(PRO_PRICE)}
          </button>
          <p className="mt-2 text-center text-[10.5px] leading-relaxed text-[#B7BCC9]">
            데모 결제입니다. 카드 정보는 받지 않고 청구도 일어나지 않아요.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
