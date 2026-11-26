"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { App, Drawer, InputNumber } from "antd";
import {
  CameraOutlined,
  CheckOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  MinusOutlined,
  PlusOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { CATEGORIES, COVER_OPTIONS, NEIGHBORHOODS, BOOST_PRICE, BOOST_HOURS, PRO_PRICE } from "@/lib/seed";
import { won } from "@/lib/format";
import { useCrewlog } from "@/lib/store";
import { CategoryGlyph, SheetHeader } from "../ui";
import type { CategoryId, NeighborhoodId } from "@/lib/types";

/* ------------------------------------------------------------------ *
 * 1. create menu
 * ------------------------------------------------------------------ */

export function CreateSheet() {
  const { createOpen, closeCreate, openComposer, setProOpen } = useCrewlog();

  return (
    <Drawer
      open={createOpen}
      onClose={closeCreate}
      placement="bottom"
      height="auto"
      rootClassName="app-sheet"
    >
      <div className="pb-[calc(26px+env(safe-area-inset-bottom))]">
        <SheetHeader
          title="무엇을 남길까요"
          subtitle="번개를 열면 지도와 피드에 바로 반영돼요."
          onClose={closeCreate}
        />
        <div className="space-y-2 px-4">
          <button
            type="button"
            onClick={() => {
              closeCreate();
              window.setTimeout(() => openComposer("meetup"), 120);
            }}
            className="press flex w-full items-center gap-3.5 rounded-2xl bg-[#EEF0FF] p-4 text-left"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#4F63FF] text-white">
              <PlusOutlined style={{ fontSize: 17 }} />
            </span>
            <span className="flex-1">
              <span className="block text-[14.5px] font-bold text-[#14161F]">번개 열기</span>
              <span className="mt-0.5 block text-[12px] text-[#5C6382]">오늘 만날 사람을 모아요 · 1분이면 끝</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              closeCreate();
              window.setTimeout(() => openComposer("post"), 120);
            }}
            className="press flex w-full items-center gap-3.5 rounded-2xl bg-[#F4F1FD] p-4 text-left"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#8B6BD9] text-white">
              <CameraOutlined style={{ fontSize: 17 }} />
            </span>
            <span className="flex-1">
              <span className="block text-[14.5px] font-bold text-[#14161F]">인증샷 올리기</span>
              <span className="mt-0.5 block text-[12px] text-[#605A78]">다녀온 장면을 동네에 남겨요</span>
            </span>
          </button>
        </div>

        <div className="mt-3 flex gap-2 px-4">
          <button
            type="button"
            onClick={() => {
              closeCreate();
              setProOpen(true);
            }}
            className="press flex-1 rounded-xl border border-[#ECEEF3] px-3 py-2.5 text-[11.5px] font-semibold text-[#6E7587]"
          >
            호스트 Pro · 월 {won(PRO_PRICE)}
          </button>
          <button
            type="button"
            onClick={() => {
              closeCreate();
              openComposer("meetup");
            }}
            className="press flex-1 rounded-xl border border-[#ECEEF3] px-3 py-2.5 text-[11.5px] font-semibold text-[#6E7587]"
          >
            부스트 · {won(BOOST_PRICE)}
          </button>
        </div>
      </div>
    </Drawer>
  );
}

/* ------------------------------------------------------------------ *
 * 2. composer
 * ------------------------------------------------------------------ */

const TIMES = ["07:00", "09:00", "12:00", "14:00", "18:00", "19:30", "20:00", "21:00"];

export function ComposerSheet() {
  const {
    composerOpen,
    composerTab,
    setComposerTab,
    closeComposer,
    createMeetup,
    createPost,
    openDetail,
    neighborhood,
    meetups,
  } = useCrewlog();
  const { message } = App.useApp();

  const defaultNb: NeighborhoodId = neighborhood === "all" ? "seongsu" : neighborhood;
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("19:30");
  const [category, setCategory] = useState<CategoryId>("running");
  const [nb, setNb] = useState<NeighborhoodId>(defaultNb);
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [capacity, setCapacity] = useState(8);
  const [desc, setDesc] = useState("");
  const [boost, setBoost] = useState(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [linked, setLinked] = useState<string | undefined>(undefined);
  const [body, setBody] = useState("");
  const [postCategory, setPostCategory] = useState<CategoryId>("photowalk");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (composerOpen) {
      setNb(defaultNb);
      setBusy(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composerOpen]);

  const startsAt = useMemo(
    () => dayjs().add(day, "day").format("YYYY-MM-DD") + "T" + time + ":00",
    [day, time],
  );

  const submitMeetup = () => {
    if (!title.trim()) return message.warning("번개 이름을 적어주세요.");
    if (!place.trim()) return message.warning("만나는 곳을 적어주세요.");
    if (!desc.trim()) return message.warning("한두 줄 소개를 적어주세요.");
    setBusy(true);
    const id = createMeetup({
      title: title.trim(),
      categoryId: category,
      neighborhoodId: nb,
      startsAt: new Date(startsAt).toISOString(),
      place: place.trim(),
      capacity,
      description: desc.trim(),
      boost,
    });
    setBusy(false);
    setTitle("");
    setPlace("");
    setDesc("");
    setBoost(false);
    closeComposer();
    message.success(boost ? "번개를 열고 부스트를 걸었어요. 24시간 노출됩니다." : "번개를 열었어요. 지도에 핀이 섰어요.");
    window.setTimeout(() => openDetail(id), 320);
  };

  const submitPost = () => {
    if (!title.trim()) return message.warning("한 줄 제목을 적어주세요.");
    if (!body.trim()) return message.warning("오늘의 장면을 적어주세요.");
    createPost({
      title: title.trim(),
      body: body.trim(),
      categoryId: postCategory,
      neighborhoodId: nb,
      image,
      meetupId: linked,
    });
    setTitle("");
    setBody("");
    setImage(undefined);
    setLinked(undefined);
    closeComposer();
    message.success("인증샷을 피드 맨 위에 올렸어요.");
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  };

  return (
    <Drawer
      open={composerOpen}
      onClose={closeComposer}
      placement="bottom"
      height="94%"
      rootClassName="app-sheet"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 pb-1 pt-2">
          <div className="flex gap-1.5 rounded-full bg-[#F1F2F7] p-1">
            {[
              { key: "meetup" as const, label: "번개 열기" },
              { key: "post" as const, label: "인증샷" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setComposerTab(tab.key)}
                className="rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors"
                style={{
                  background: composerTab === tab.key ? "#fff" : "transparent",
                  color: composerTab === tab.key ? "#14161F" : "#6E7587",
                  boxShadow: composerTab === tab.key ? "0 1px 3px rgba(15,23,42,0.1)" : "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={closeComposer}
            aria-label="닫기"
            className="grid h-9 w-9 place-items-center rounded-full bg-[#F5F6FA] text-[#6E7587]"
          >
            <CloseOutlined style={{ fontSize: 13 }} />
          </button>
        </div>

        <div className="quiet-scroll flex-1 overflow-y-auto px-5 pb-6 pt-4">
          {composerTab === "meetup" ? (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-[11.5px] font-semibold text-[#9AA1B2]">어떤 번개인가요</p>
                <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      className="press flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-semibold"
                      style={{
                        borderColor: category === c.id ? c.color : "#ECEEF3",
                        background: category === c.id ? c.tint : "#fff",
                        color: category === c.id ? c.color : "#6E7587",
                      }}
                    >
                      <CategoryGlyph id={c.id} size={12} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="번개 이름">
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={40}
                  placeholder="예) 퇴근 후 한강 6K, 말 없이 뛰어요"
                  className="h-12 w-full rounded-[14px] border border-[#E2E5EC] bg-[#FBFBFE] px-3.5 text-[13.5px] outline-none focus:border-[#4F63FF]"
                />
              </Field>

              <Field label="언제">
                <div className="flex gap-2">
                  {["오늘", "내일", "모레"].map((label, index) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setDay(index)}
                      className="flex-1 rounded-[12px] border py-2.5 text-[12.5px] font-semibold"
                      style={{
                        borderColor: day === index ? "#14161F" : "#ECEEF3",
                        background: day === index ? "#14161F" : "#fff",
                        color: day === index ? "#fff" : "#6E7587",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto pb-1">
                  {TIMES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTime(value)}
                      className="tnum shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-semibold"
                      style={{
                        borderColor: time === value ? "#C9D0FF" : "#ECEEF3",
                        background: time === value ? "#EEF0FF" : "#fff",
                        color: time === value ? "#4F63FF" : "#6E7587",
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="동네">
                <div className="grid grid-cols-4 gap-1.5">
                  {NEIGHBORHOODS.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setNb(n.id)}
                      className="rounded-[12px] border py-2.5 text-[12px] font-semibold"
                      style={{
                        borderColor: nb === n.id ? "#14161F" : "#ECEEF3",
                        background: nb === n.id ? "#14161F" : "#fff",
                        color: nb === n.id ? "#fff" : "#6E7587",
                      }}
                    >
                      {n.label.replace("·한강", "")}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="만나는 곳">
                <div className="relative">
                  <EnvironmentOutlined
                    style={{ fontSize: 13, color: "#9AA1B2", position: "absolute", left: 14, top: 17 }}
                  />
                  <input
                    value={place}
                    onChange={(event) => setPlace(event.target.value)}
                    maxLength={40}
                    placeholder="예) 잠실한강공원 2번 출구 앞"
                    className="h-12 w-full rounded-[14px] border border-[#E2E5EC] bg-[#FBFBFE] pl-9 pr-3.5 text-[13.5px] outline-none focus:border-[#4F63FF]"
                  />
                </div>
              </Field>

              <Field label="정원">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full border border-[#E2E5EC] bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setCapacity((v) => Math.max(2, v - 1))}
                      aria-label="정원 줄이기"
                      className="grid h-8 w-8 place-items-center rounded-full text-[#6E7587] hover:bg-[#F5F6FA]"
                    >
                      <MinusOutlined style={{ fontSize: 11 }} />
                    </button>
                    <span className="tnum w-8 text-center text-[14px] font-bold text-[#14161F]">{capacity}</span>
                    <button
                      type="button"
                      onClick={() => setCapacity((v) => Math.min(40, v + 1))}
                      aria-label="정원 늘리기"
                      className="grid h-8 w-8 place-items-center rounded-full text-[#6E7587] hover:bg-[#F5F6FA]"
                    >
                      <PlusOutlined style={{ fontSize: 11 }} />
                    </button>
                  </div>
                  <span className="text-[11.5px] text-[#9AA1B2]">명 · 최소 2명</span>
                </div>
              </Field>

              <Field label="소개">
                <textarea
                  value={desc}
                  onChange={(event) => setDesc(event.target.value)}
                  maxLength={300}
                  rows={4}
                  placeholder="페이스, 준비물, 끝나고 할 일까지 적어두면 참여가 빨라져요."
                  className="w-full resize-none rounded-[14px] border border-[#E2E5EC] bg-[#FBFBFE] px-3.5 py-3 text-[13px] leading-relaxed outline-none focus:border-[#4F63FF]"
                />
                <p className="mt-1 text-right text-[10.5px] text-[#B7BCC9]">{desc.length}/300</p>
              </Field>

              <button
                type="button"
                onClick={() => setBoost((v) => !v)}
                className="flex w-full items-start gap-3 rounded-[16px] border p-3.5 text-left"
                style={{ borderColor: boost ? "#C9D0FF" : "#ECEEF3", background: boost ? "#F6F7FF" : "#fff" }}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#EEF0FF] text-[#4F63FF]">
                  <ThunderboltFilled style={{ fontSize: 12 }} />
                </span>
                <span className="flex-1">
                  <span className="block text-[12.5px] font-bold text-[#14161F]">
                    상단 부스트 · {won(BOOST_PRICE)}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-relaxed text-[#6E7587]">
                    {BOOST_HOURS}시간 동안 피드와 지도 위쪽에 노출돼요. 데모 결제입니다.
                  </span>
                </span>
                <span
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border"
                  style={{
                    borderColor: boost ? "#4F63FF" : "#D5D9E4",
                    background: boost ? "#4F63FF" : "#fff",
                    color: "#fff",
                  }}
                >
                  {boost && <CheckOutlined style={{ fontSize: 9 }} />}
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <Field label="한 줄 제목">
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={40}
                  placeholder="예) 붉은 벽돌 사이로 오후 네 시"
                  className="h-12 w-full rounded-[14px] border border-[#E2E5EC] bg-[#FBFBFE] px-3.5 text-[13.5px] outline-none focus:border-[#4F63FF]"
                />
              </Field>

              <Field label="종류">
                <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPostCategory(c.id)}
                      className="press flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-semibold"
                      style={{
                        borderColor: postCategory === c.id ? c.color : "#ECEEF3",
                        background: postCategory === c.id ? c.tint : "#fff",
                        color: postCategory === c.id ? c.color : "#6E7587",
                      }}
                    >
                      <CategoryGlyph id={c.id} size={12} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="동네">
                <div className="grid grid-cols-4 gap-1.5">
                  {NEIGHBORHOODS.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setNb(n.id)}
                      className="rounded-[12px] border py-2.5 text-[12px] font-semibold"
                      style={{
                        borderColor: nb === n.id ? "#14161F" : "#ECEEF3",
                        background: nb === n.id ? "#14161F" : "#fff",
                        color: nb === n.id ? "#fff" : "#6E7587",
                      }}
                    >
                      {n.label.replace("·한강", "")}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="사진">
                <div className="grid grid-cols-4 gap-2">
                  {COVER_OPTIONS.map((option) => {
                    const active = image === option.src;
                    return (
                      <button
                        key={option.src}
                        type="button"
                        onClick={() => setImage(active ? undefined : option.src)}
                        className="relative aspect-square overflow-hidden rounded-xl"
                        style={{ outline: active ? "2px solid #4F63FF" : "1px solid #ECEEF3", outlineOffset: active ? 2 : 0 }}
                        title={option.label}
                      >
                        <Image src={option.src} alt={option.label} fill sizes="90px" className="object-cover" />
                        {active && (
                          <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-[#4F63FF] text-white">
                            <CheckOutlined style={{ fontSize: 9 }} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="남기고 싶은 이야기">
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  maxLength={300}
                  rows={4}
                  placeholder="오늘의 장면을 적어주세요."
                  className="w-full resize-none rounded-[14px] border border-[#E2E5EC] bg-[#FBFBFE] px-3.5 py-3 text-[13px] leading-relaxed outline-none focus:border-[#4F63FF]"
                />
                <p className="mt-1 text-right text-[10.5px] text-[#B7BCC9]">{body.length}/300</p>
              </Field>

              <Field label="연결할 번개 (선택)">
                <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
                  <button
                    type="button"
                    onClick={() => setLinked(undefined)}
                    className="shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold"
                    style={{
                      borderColor: !linked ? "#14161F" : "#ECEEF3",
                      background: !linked ? "#14161F" : "#fff",
                      color: !linked ? "#fff" : "#6E7587",
                    }}
                  >
                    연결 안 함
                  </button>
                  {meetups.slice(0, 6).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setLinked(m.id)}
                      className="shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold"
                      style={{
                        borderColor: linked === m.id ? "#14161F" : "#ECEEF3",
                        background: linked === m.id ? "#14161F" : "#fff",
                        color: linked === m.id ? "#fff" : "#6E7587",
                      }}
                    >
                      {m.title.slice(0, 14)}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}
        </div>

        <div className="border-t border-[#F0F2F7] px-5 pb-[calc(14px+env(safe-area-inset-bottom))] pt-3">
          <button
            type="button"
            disabled={busy}
            onClick={composerTab === "meetup" ? submitMeetup : submitPost}
            className="press h-12 w-full rounded-full bg-[#4F63FF] text-[14px] font-bold text-white disabled:opacity-60"
          >
            {composerTab === "meetup" ? (boost ? `번개 열고 부스트 · ${won(BOOST_PRICE)}` : "번개 열기") : "피드에 올리기"}
          </button>
          <p className="mt-2 text-center text-[10.5px] leading-relaxed text-[#B7BCC9]">
            데모 앱이에요. 입력한 내용은 이 브라우저 세션에만 저장됩니다.
          </p>
        </div>
      </div>
    </Drawer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11.5px] font-semibold text-[#9AA1B2]">{label}</p>
      {children}
    </div>
  );
}
