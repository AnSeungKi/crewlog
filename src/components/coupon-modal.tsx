"use client";

import { useEffect } from "react";
import { Button, Modal, Tag, Typography } from "antd";
import { GiftFilled } from "@ant-design/icons";
import { neighborhoodOf } from "@/lib/seed";
import { useCrewlog } from "@/lib/store";

export function CouponModal() {
  const { couponTargetId, closeCoupon, sponsorById, claimCoupon } = useCrewlog();
  const sponsor = couponTargetId ? sponsorById(couponTargetId) : undefined;

  useEffect(() => {
    if (couponTargetId) claimCoupon(couponTargetId);
  }, [couponTargetId, claimCoupon]);

  return (
    <Modal
      open={Boolean(sponsor)}
      onCancel={closeCoupon}
      footer={null}
      width={440}
      title={
        <div className="flex items-center gap-2">
          <GiftFilled style={{ color: "#1F5E4B", fontSize: 14 }} />
          <span className="eyebrow">PARTNER COUPON</span>
        </div>
      }
    >
      {sponsor && (
        <div>
          <p className="eyebrow">
            {neighborhoodOf(sponsor.neighborhoodId).label} · {sponsor.categoryLabel}
          </p>
          <p
            className="mt-1 text-[20px] tracking-[-0.03em] text-[#141413]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {sponsor.name}
          </p>
          <p className="mt-1 text-[14px] text-[#C43E1F]">{sponsor.benefit}</p>
          <p className="mt-2.5 text-[12px] leading-[1.8] text-[#3D3A36]">
            {sponsor.detail}
          </p>

          <div className="relative mt-4 border border-dashed border-[#C9C1B4] bg-[#FBF8F2] px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">COUPON CODE</p>
                <Typography.Text
                  copyable={{
                    text: sponsor.code,
                    tooltips: ["복사", "복사했습니다"],
                  }}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 19,
                    letterSpacing: "0.12em",
                    color: "#141413",
                    marginTop: 4,
                    display: "inline-block",
                  }}
                >
                  {sponsor.code}
                </Typography.Text>
                <p className="num mt-1 text-[10.5px] text-[#9A948C]">
                  ~{sponsor.expiresAt} · 1인 1회
                </p>
              </div>
              <Tag
                bordered={false}
                style={{ background: "#E6EDE9", color: "#1F5E4B", fontSize: 10, margin: 0 }}
              >
                보유
              </Tag>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-[10.5px] text-[#A8A096]">
              번개 참여 인증 화면과 함께 보여주세요.
            </p>
            <Button type="primary" onClick={closeCoupon}>
              확인
            </Button>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-[#A8A096]">
            데모 쿠폰입니다. 실제 매장에서 사용할 수 없으며 어떤 결제도 발생하지
            않습니다.
          </p>
        </div>
      )}
    </Modal>
  );
}
