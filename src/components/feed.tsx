"use client";

import { Col, Empty, Row } from "antd";
import { MeetupCard } from "./meetup-card";
import { ProofCard } from "./proof-card";
import { useCrewlog } from "@/lib/store";

export function Feed() {
  const {
    visibleFeed,
    postById,
    meetupById,
    neighborhood,
    category,
    setNeighborhood,
    setCategory,
  } = useCrewlog();

  const isFiltered = neighborhood !== "all" || category !== "all";

  return (
    <section id="feed" className="scroll-mt-36">
      <header className="flex items-end justify-between gap-4 border-b border-[#141413]/15 pb-3">
        <div>
          <p className="eyebrow">THE FEED · 동네 기록</p>
          <h2
            className="mt-1 text-[25px] leading-tight tracking-[-0.04em]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            오늘의 인증샷과 열린 번개
          </h2>
        </div>
        <div className="shrink-0 text-right">
          <p className="num text-[20px] leading-none text-[#141413]">
            {visibleFeed.length}
            <span className="ml-0.5 text-[11px] text-[#9A948C]">건</span>
          </p>
          <p className="eyebrow mt-1">{isFiltered ? "FILTERED" : "ALL STORIES"}</p>
        </div>
      </header>

      {isFiltered && (
        <button
          type="button"
          onClick={() => {
            setNeighborhood("all");
            setCategory("all");
          }}
          className="mt-3 inline-flex items-center gap-1.5 border border-[#E5E0D8] bg-white px-2.5 py-1 text-[11px] text-[#6B6660] hover:border-[#CFC7BA] hover:text-[#141413]"
        >
          필터 초기화
        </button>
      )}

      {visibleFeed.length > 0 ? (
        <Row gutter={[20, 20]} align="top" className="mt-4">
          {visibleFeed.map((item, index) => {
            const feature = index === 0;
            if (item.kind === "post") {
              const post = postById(item.postId);
              if (!post) return null;
              return (
                <Col key={item.id} xs={24} md={feature ? 24 : 12} xl={feature ? 24 : 12}>
                  <ProofCard post={post} feature={feature} priority={index < 2} />
                </Col>
              );
            }
            const meetup = meetupById(item.meetupId);
            if (!meetup) return null;
            return (
              <Col key={item.id} xs={24} md={feature ? 24 : 12} xl={feature ? 24 : 12}>
                <MeetupCard
                  meetup={meetup}
                  isNew={!meetup.persisted}
                  feature={feature}
                />
              </Col>
            );
          })}
        </Row>
      ) : (
        <div className="mt-6 border border-dashed border-[#DDD6C9] bg-white/60 py-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-[12.5px] text-[#6B6660]">
                이 조합에는 아직 기록이 없습니다. 첫 번째 글을 남겨보세요.
              </span>
            }
          />
        </div>
      )}

      <div className="mt-7 flex items-center justify-center gap-3 text-[10.5px] tracking-[0.06em] text-[#A8A096]">
        <span className="h-px w-10 bg-[#E5E0D8]" />
        동네 소식은 계속 업데이트됩니다
        <span className="h-px w-10 bg-[#E5E0D8]" />
      </div>
    </section>
  );
}
