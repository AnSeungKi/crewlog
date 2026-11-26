"use client";

import { useState } from "react";
import { App, Button, Modal, Slider, Statistic, Switch, Tag } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { BOOST_PRICE, PRO_PRICE } from "@/lib/seed";
import { won } from "@/lib/format";
import { useCrewlog } from "@/lib/store";

const PLANS = [
  {
    id: "free",
    name: "무료",
    price: "0원",
    caption: "가볍게 시작",
    features: ["번개 월 2회", "기본 참여자 명단", "제휴 쿠폰 사용"],
    highlight: false,
  },
  {
    id: "pro",
    name: "크루 호스트 Pro",
    price: won(PRO_PRICE),
    caption: "꾸준히 모으는 호스트",
    features: [
      "번개 무제한",
      "부스트 1회 무료 제공",
      "노쇼 관리 · 정산 리포트",
      "제휴 쿠폰 발행",
    ],
    highlight: true,
  },
  {
    id: "partner",
    name: "파트너",
    price: "별도 문의",
    caption: "동네 가게",
    features: ["지도 제휴 핀", "쿠폰 캠페인", "방문 리포트"],
    highlight: false,
  },
];

export function ProModal() {
  const { proOpen, setProOpen } = useCrewlog();
  const { message } = App.useApp();
  const [runs, setRuns] = useState(4);
  const [withBoost, setWithBoost] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  const participants = runs * 9;
  const cost = PRO_PRICE + (withBoost ? runs * BOOST_PRICE : 0);

  return (
    <Modal
      open={proOpen}
      onCancel={() => setProOpen(false)}
      footer={null}
      width={720}
      title={
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">CREW HOST PRO</p>
            <p
              className="mt-1 text-[19px] tracking-[-0.03em]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              크루를 여는 사람을 위한 플랜
            </p>
          </div>
          {subscribed && (
            <Tag
              bordered={false}
              style={{ background: "#E6EDE9", color: "#1F5E4B", fontSize: 10, margin: 0 }}
            >
              구독 중
            </Tag>
          )}
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col border px-4 py-4"
            style={{
              borderColor: plan.highlight ? "#141413" : "#E5E0D8",
              background: plan.highlight ? "#FFFFFF" : "transparent",
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-[#141413]">{plan.name}</p>
              {plan.highlight && (
                <span className="rounded-[2px] bg-[#141413] px-1.5 py-0.5 font-mono text-[8px] tracking-[0.1em] text-[#FAF8F5]">
                  추천
                </span>
              )}
            </div>
            <p
              className="mt-2 text-[19px] leading-none tracking-[-0.03em] text-[#141413]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {plan.price}
            </p>
            <p className="mt-1 text-[10.5px] text-[#9A948C]">{plan.caption}</p>
            <ul className="mt-3 space-y-1.5 border-t border-[#EFEBE4] pt-3">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-1.5 text-[11px] leading-relaxed text-[#3D3A36]"
                >
                  <CheckOutlined style={{ fontSize: 9, marginTop: 4, color: "#1F5E4B" }} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-5 border border-[#E5E0D8] bg-white px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">SIMULATION · 예상 비용</p>
            <p className="mt-0.5 text-[12px] text-[#6B6660]">
              한 달에 몇 번 번개를 열 계획인가요?
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#6B6660]">
            부스트 사용
            <Switch
              size="small"
              checked={withBoost}
              onChange={setWithBoost}
              style={{ marginLeft: 4 }}
            />
          </div>
        </div>

        <Slider
          min={1}
          max={8}
          value={runs}
          onChange={setRuns}
          tooltip={{ formatter: (value) => `${value}회` }}
          style={{ marginTop: 8, marginBottom: 4 }}
        />

        <div className="mt-2 grid grid-cols-3 border-t border-[#EFEBE4] pt-3">
          <Statistic
            title={<span className="text-[10px] text-[#9A948C]">월 운영</span>}
            value={runs}
            suffix="회"
            valueStyle={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "#141413" }}
          />
          <Statistic
            title={<span className="text-[10px] text-[#9A948C]">예상 참여 인원</span>}
            value={participants}
            suffix="명"
            valueStyle={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "#141413" }}
          />
          <Statistic
            title={<span className="text-[10px] text-[#9A948C]">월 예상 비용</span>}
            value={cost}
            suffix="원"
            valueStyle={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "#E84A27" }}
          />
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-[#A8A096]">
          * 참여 인원은 최근 번개 평균(9명)을 기준으로 한 예상치입니다. 정산 수수료는
          0%입니다.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[36ch] text-[10.5px] leading-relaxed text-[#A8A096]">
          데모 앱입니다. 구독 버튼을 눌러도 실제 결제는 발생하지 않고 이 화면에서만
          상태가 바뀝니다.
        </p>
        <div className="flex gap-2">
          <Button onClick={() => setProOpen(false)}>나중에</Button>
          <Button
            type="primary"
            onClick={() => {
              setSubscribed(true);
              message.success("데모: 크루 호스트 Pro가 활성화되었습니다.");
            }}
          >
            {subscribed ? "Pro 구독 중" : "Pro 시작하기"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
