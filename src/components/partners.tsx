"use client";

import { Col, Row, Tag } from "antd";
import { GiftOutlined } from "@ant-design/icons";
import { neighborhoodOf } from "@/lib/seed";
import { useCrewlog } from "@/lib/store";

export function Partners() {
  const { sponsors, coupons, openCoupon, setProOpen } = useCrewlog();

  return (
    <section id="partners" className="mx-auto mt-16 max-w-[1320px] scroll-mt-36 px-5">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#141413]/15 pb-3">
        <div>
          <p className="eyebrow">LOCAL PARTNERS · 제휴 스팟</p>
          <h2
            className="mt-1 text-[25px] leading-tight tracking-[-0.04em]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            이 동네에서만 받는 쿠폰
          </h2>
        </div>
        <p className="max-w-[38ch] text-[12px] leading-relaxed text-[#6B6660]">
          동네 가게와 크루로그가 함께 만든 혜택입니다. 번개 참여 인증만 있으면 바로
          사용할 수 있어요. 지도의 초록 핀에서도 받을 수 있습니다.
        </p>
      </header>

      <Row gutter={[16, 16]} className="mt-5">
        {sponsors.map((sponsor) => {
          const claimed = Boolean(coupons[sponsor.id]);
          return (
            <Col key={sponsor.id} xs={24} sm={12} xl={6}>
              <div className="relative flex h-full flex-col border border-[#E5E0D8] bg-white transition-colors hover:border-[#CFC7BA]">
                <div className="flex items-start justify-between gap-2 px-4 pb-3 pt-4">
                  <div className="min-w-0">
                    <p className="eyebrow truncate">
                      {neighborhoodOf(sponsor.neighborhoodId).label} ·{" "}
                      {sponsor.categoryLabel}
                    </p>
                    <p className="mt-1 truncate text-[14.5px] font-medium text-[#141413]">
                      {sponsor.name}
                    </p>
                    <p className="mt-1 text-[12.5px] text-[#C43E1F]">{sponsor.benefit}</p>
                  </div>
                  {claimed ? (
                    <Tag
                      bordered={false}
                      style={{
                        background: "#E6EDE9",
                        color: "#1F5E4B",
                        fontSize: 9,
                        lineHeight: "16px",
                        padding: "0 6px",
                        marginInlineEnd: 0,
                      }}
                    >
                      보유
                    </Tag>
                  ) : (
                    <GiftOutlined style={{ color: "#C9C1B4", fontSize: 14 }} />
                  )}
                </div>

                <div className="relative mt-auto border-t border-dashed border-[#E5E0D8] px-4 py-2.5">
                  <span className="absolute -left-[5px] -top-[5px] h-[9px] w-[9px] rounded-full border border-[#E5E0D8] bg-[#FAF8F5]" />
                  <span className="absolute -right-[5px] -top-[5px] h-[9px] w-[9px] rounded-full border border-[#E5E0D8] bg-[#FAF8F5]" />
                  <div className="flex items-center justify-between">
                    <span className="num text-[10px] text-[#9A948C]">
                      ~{sponsor.expiresAt.slice(5).replace("-", ".")}
                    </span>
                    <button
                      type="button"
                      onClick={() => openCoupon(sponsor.id)}
                      className="text-[11.5px] font-medium text-[#1F5E4B] hover:underline"
                    >
                      {claimed ? "쿠폰 열기" : "쿠폰 받기"} →
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-[#E5E0D8] bg-[#F4F0E9] px-4 py-3">
        <p className="text-[12px] text-[#3D3A36]">
          <span className="font-medium">우리 가게도 제휴하고 싶다면</span> · 동네 크루가
          실제로 지나가는 자리에 핀을 세워드립니다.
        </p>
        <button
          type="button"
          onClick={() => setProOpen(true)}
          className="text-[11.5px] font-medium text-[#E84A27] hover:underline"
        >
          파트너 플랜 보기 →
        </button>
      </div>

      <p className="mt-3 text-[10.5px] text-[#A8A096]">
        쿠폰은 데모용이며 실제 결제나 할인이 발생하지 않습니다.
      </p>
    </section>
  );
}
