"use client";

import { useEffect, useState } from "react";
import { App, Button, Modal, Statistic, Tag } from "antd";
import { CheckOutlined, ThunderboltFilled } from "@ant-design/icons";
import { BOOST_HOURS, BOOST_PRICE, categoryOf } from "@/lib/seed";
import { clock, dayBadge, won } from "@/lib/format";
import { useCrewlog } from "@/lib/store";

type Step = "offer" | "paying" | "done";

export function BoostModal() {
  const {
    boostTargetId,
    closeBoost,
    meetupById,
    participantCount,
    boostMeetup,
    openDetail,
  } = useCrewlog();
  const { message } = App.useApp();
  const [step, setStep] = useState<Step>("offer");

  const meetup = boostTargetId ? meetupById(boostTargetId) : undefined;

  useEffect(() => {
    if (boostTargetId) setStep("offer");
  }, [boostTargetId]);

  const reach = meetup ? 60 + participantCount(meetup.id) * 8 : 0;

  const pay = () => {
    setStep("paying");
    window.setTimeout(() => {
      if (meetup) boostMeetup(meetup.id);
      setStep("done");
      message.success("부스트가 시작되었습니다.");
    }, 950);
  };

  return (
    <Modal
      open={Boolean(boostTargetId && meetup)}
      onCancel={() => {
        closeBoost();
        setStep("offer");
      }}
      footer={null}
      width={480}
      title={
        <div>
          <p className="eyebrow">BOOST</p>
          <p
            className="mt-1 text-[19px] tracking-[-0.03em]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            번개 상단 부스트
          </p>
        </div>
      }
    >
      {meetup && step === "offer" && (
        <div>
          <div className="border border-[#E5E0D8] bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: categoryOf(meetup.categoryId).color }}
              />
              <span className="eyebrow">
                {categoryOf(meetup.categoryId).label} · {dayBadge(meetup.startsAt)}{" "}
                {clock(meetup.startsAt)}
              </span>
            </div>
            <p className="mt-1 text-[13.5px] font-medium text-[#141413]">{meetup.title}</p>
            <p className="num mt-0.5 text-[11px] text-[#6B6660]">
              {participantCount(meetup.id)}/{meetup.capacity}명 · {meetup.place}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 divide-x divide-[#E5E0D8] border-y border-[#E5E0D8] py-4">
            <div className="pr-4">
              <p className="eyebrow">24시간 요금</p>
              <p className="num mt-1 text-[24px] leading-none text-[#141413]">
                {won(BOOST_PRICE)}
              </p>
            </div>
            <div className="pl-4">
              <p className="eyebrow">예상 노출 (시뮬레이션)</p>
              <p className="num mt-1 text-[13px] leading-none text-[#9A948C] line-through">
                {reach}회
              </p>
              <p className="num mt-1.5 text-[24px] leading-none text-[#E84A27]">
                {Math.round(reach * 3.4)}
                <span className="ml-1 text-[11px] text-[#6B6660]">회</span>
              </p>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {[
              "피드 최상단에 '부스트' 표시와 함께 노출",
              "지도에서 가장 먼저 보이는 핀으로 고정",
              `${BOOST_HOURS}시간 후 자동 종료, 연장 가능`,
            ].map((line) => (
              <li key={line} className="flex items-start gap-2 text-[12px] text-[#3D3A36]">
                <ThunderboltFilled style={{ color: "#E84A27", fontSize: 10, marginTop: 4 }} />
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between border border-[#E5E0D8] bg-[#F4F0E9] px-3.5 py-2.5">
            <span className="text-[11.5px] text-[#3D3A36]">
              결제 수단 · 등록된 카드 ···· 4021
            </span>
            <Tag
              bordered={false}
              style={{ background: "#FFFFFF", color: "#9A948C", fontSize: 9, margin: 0 }}
            >
              데모 결제
            </Tag>
          </div>

          <div className="mt-5 flex gap-2">
            <Button block onClick={closeBoost}>
              취소
            </Button>
            <Button type="primary" block onClick={pay}>
              {won(BOOST_PRICE)} 결제하고 시작
            </Button>
          </div>
          <p className="mt-3 text-[10.5px] leading-relaxed text-[#A8A096]">
            데모 앱입니다. 실제 결제가 발생하지 않으며 카드 정보도 전송되지 않습니다.
          </p>
        </div>
      )}

      {meetup && step === "paying" && (
        <div className="flex flex-col items-center py-10">
          <span className="live-dot inline-block h-2 w-2 rounded-full bg-[#E84A27]" />
          <p className="mt-4 text-[13px] text-[#3D3A36]">결제를 확인하는 중…</p>
          <p className="num mt-1 text-[10.5px] text-[#A8A096]">{won(BOOST_PRICE)}</p>
        </div>
      )}

      {meetup && step === "done" && (
        <div className="py-2">
          <div className="flex flex-col items-center py-4 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#E6EDE9]">
              <CheckOutlined style={{ color: "#1F5E4B", fontSize: 20 }} />
            </span>
            <p
              className="mt-4 text-[18px] tracking-[-0.03em]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              부스트가 시작되었습니다
            </p>
            <p className="mt-1.5 max-w-[34ch] text-[12px] leading-relaxed text-[#6B6660]">
              {BOOST_HOURS}시간 동안 피드 상단과 지도 상단 핀에 노출됩니다. 지금 피드
              맨 위에서 확인할 수 있어요.
            </p>
          </div>

          <div className="mt-2 grid grid-cols-3 border-y border-[#E5E0D8] py-3.5">
            <Statistic
              title={<span className="text-[10px] text-[#9A948C]">결제</span>}
              value="2,900원"
              valueStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: 16,
                color: "#141413",
              }}
            />
            <Statistic
              title={<span className="text-[10px] text-[#9A948C]">노출 시간</span>}
              value="24시간"
              valueStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: 16,
                color: "#141413",
              }}
            />
            <Statistic
              title={<span className="text-[10px] text-[#9A948C]">상태</span>}
              value="노출 중"
              valueStyle={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                color: "#1F5E4B",
              }}
            />
          </div>

          <div className="mt-5 flex gap-2">
            <Button block onClick={closeBoost}>
              확인
            </Button>
            <Button
              type="primary"
              block
              onClick={() => {
                const id = meetup.id;
                closeBoost();
                openDetail(id);
              }}
            >
              번개 보기
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
