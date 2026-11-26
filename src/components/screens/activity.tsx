"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeftOutlined,
  BellOutlined,
  CheckCircleFilled,
  GiftFilled,
  MessageOutlined,
  SendOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { Segmented } from "antd";
import { Avatar } from "../ui";
import dayjs from "dayjs";
import { ME, USERS, userOf } from "@/lib/seed";
import { useCrewlog } from "@/lib/store";
import { asset } from "@/lib/asset";

interface Notice {
  id: string;
  tone: "blue" | "mint" | "purple" | "amber";
  icon: React.ReactNode;
  title: string;
  body?: string;
  time: string;
  unread?: boolean;
  thumb?: string;
}

const SEED_NOTICES: Notice[] = [
  {
    id: "n1",
    tone: "blue",
    icon: <MessageOutlined style={{ fontSize: 13 }} />,
    title: "하린님이 인증샷에 댓글을 남겼어요",
    body: "“세 번째 사진, 어느 골목인가요?”",
    time: "1시간 전",
    unread: true,
    thumb: asset("/images/seongsu-dusk.jpg"),
  },
  {
    id: "n2",
    tone: "mint",
    icon: <BellOutlined style={{ fontSize: 13 }} />,
    title: "도윤님이 번개에 초대했어요",
    body: "성수 로스터리에서 각자 작업 모임 · 내일 14:00",
    time: "2시간 전",
    unread: true,
  },
  {
    id: "n3",
    tone: "purple",
    icon: <GiftFilled style={{ fontSize: 13 }} />,
    title: "제휴 쿠폰이 도착했어요",
    body: "성수 로스터리 아메리카노 20% · 12월 31일까지",
    time: "어제",
    unread: true,
  },
  {
    id: "n4",
    tone: "amber",
    icon: <ThunderboltFilled style={{ fontSize: 12 }} />,
    title: "부스트가 끝났어요",
    body: "‘한강 노을 사진산책’이 24시간 노출되었어요.",
    time: "어제",
  },
  {
    id: "n5",
    tone: "blue",
    icon: <CheckCircleFilled style={{ fontSize: 13 }} />,
    title: "슬로우식스 크루에서 공지가 올라왔어요",
    body: "이번 주는 목요일 19:30, 잠실 2번 출구입니다.",
    time: "2일 전",
  },
];

const TONES: Record<Notice["tone"], { bg: string; fg: string }> = {
  blue: { bg: "#EEF0FF", fg: "#4F63FF" },
  mint: { bg: "#E9F6EF", fg: "#2E9E6B" },
  purple: { bg: "#F4F1FD", fg: "#8B6BD9" },
  amber: { bg: "#FBF1E4", fg: "#C8863C" },
};

interface ChatMessage {
  id: string;
  authorId: string;
  body: string;
  at: string;
}

interface Thread {
  id: string;
  name: string;
  community: boolean;
  members: string[];
  preview: string;
  time: string;
  unread: number;
  messages: ChatMessage[];
}

const INITIAL_THREADS: Thread[] = [
  {
    id: "t1",
    name: "슬로우식스",
    community: true,
    members: ["u2", "u10", "u8", "u1"],
    preview: "사진 한 장 남겨주세요. 인증샷 올리면 다음 번개가 더 붙어요.",
    time: "12:40",
    unread: 2,
    messages: [
      { id: "m1", authorId: "u2", body: "오늘 7시 30분, 잠실한강공원 2번 출구 앞이에요.", at: "11:02" },
      { id: "m2", authorId: "u1", body: "넵, 조금 일찍 도착할게요. 물은 제가 챙겨갈게요.", at: "11:08" },
      { id: "m3", authorId: "u8", body: "오늘 바람이 좀 부네요. 얇은 거 하나 걸치고 오세요.", at: "12:12" },
      { id: "m4", authorId: "u10", body: "저는 5분 페이스로 뒤에서 따라갈게요.", at: "12:30" },
      { id: "m5", authorId: "u2", body: "사진 한 장 남겨주세요. 인증샷 올리면 다음 번개가 더 붙어요.", at: "12:40" },
    ],
  },
  {
    id: "t2",
    name: "성수 작업 모임",
    community: true,
    members: ["u3", "u7", "u4", "u1"],
    preview: "창가 4인석 제가 먼저 가서 잡아둘게요.",
    time: "어제",
    unread: 0,
    messages: [
      { id: "m6", authorId: "u3", body: "내일 2시, 창가 자리 제가 먼저 가서 잡아둘게요.", at: "어제 18:20" },
      { id: "m7", authorId: "u7", body: "저는 2시 10분쯤 도착할 것 같아요. 콘센트 자리 부탁드려요!", at: "어제 18:44" },
      { id: "m8", authorId: "u3", body: "네, 두 자리 비워둘게요.", at: "어제 18:46" },
    ],
  },
  {
    id: "t3",
    name: "판교 아침 5K",
    community: true,
    members: ["u8", "u9", "u12", "u1"],
    preview: "내일 비 온대요. 6시에 한 번 더 공지할게요.",
    time: "어제",
    unread: 0,
    messages: [
      { id: "m9", authorId: "u9", body: "내일 비 온대요. 우산 쓰고 나갈까요?", at: "어제 21:10" },
      { id: "m10", authorId: "u8", body: "6시에 한 번 더 공지할게요. 비 오면 쉬어요.", at: "어제 21:22" },
    ],
  },
  {
    id: "t4",
    name: "크루로그",
    community: false,
    members: [],
    preview: "번개를 열면 지도와 피드에 바로 반영돼요.",
    time: "3일 전",
    unread: 0,
    messages: [
      {
        id: "m11",
        authorId: "u1",
        body: "번개를 열면 지도와 피드에 바로 반영돼요. 인증샷은 번개에 연결하면 더 잘 보여요.",
        at: "3일 전",
      },
    ],
  },
];

export function ActivityScreen() {
  const [tab, setTab] = useState<"notice" | "chat">("notice");
  const { boosts, meetupById, coupons, sponsors, joined } = useCrewlog();
  const [threadId, setThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [draft, setDraft] = useState("");

  const notices = useMemo<Notice[]>(() => {
    const dynamic: Notice[] = [];
    boosts.slice(0, 2).forEach((boost) => {
      const meetup = meetupById(boost.meetupId);
      if (!meetup) return;
      dynamic.push({
        id: `b-${boost.id}`,
        tone: "blue",
        icon: <ThunderboltFilled style={{ fontSize: 12 }} />,
        title: "부스트가 시작되었어요",
        body: `${meetup.title} · ${boost.hours}시간 노출 (데모 결제)`,
        time: dayjs(boost.createdAt).format("HH:mm"),
        unread: true,
      });
    });
    const claimed = Object.keys(coupons).filter((key) => coupons[key]);
    claimed.slice(0, 2).forEach((id) => {
      const sponsor = sponsors.find((s) => s.id === id);
      if (!sponsor) return;
      dynamic.push({
        id: `c-${id}`,
        tone: "purple",
        icon: <GiftFilled style={{ fontSize: 13 }} />,
        title: "쿠폰을 보관했어요",
        body: `${sponsor.name} ${sponsor.benefit} · 코드 ${sponsor.code}`,
        time: "방금",
        unread: true,
      });
    });
    if (Object.values(joined).filter(Boolean).length > 0) {
      dynamic.push({
        id: "j-now",
        tone: "mint",
        icon: <CheckCircleFilled style={{ fontSize: 13 }} />,
        title: "참여 중인 번개가 있어요",
        body: "시간에 맞춰 출발 준비를 해보세요.",
        time: "오늘",
      });
    }
    return [...dynamic, ...SEED_NOTICES];
  }, [boosts, meetupById, coupons, sponsors, joined]);

  const thread = threads.find((t) => t.id === threadId) ?? null;

  const send = () => {
    if (!thread || !draft.trim()) return;
    const body = draft.trim();
    setThreads((prev) =>
      prev.map((item) =>
        item.id === thread.id
          ? {
              ...item,
              preview: body,
              time: dayjs().format("HH:mm"),
              messages: [
                ...item.messages,
                { id: `m-${Date.now()}`, authorId: ME.id, body, at: dayjs().format("HH:mm") },
              ],
            }
          : item,
      ),
    );
    setDraft("");
  };

  if (tab === "chat" && thread) {
    return (
      <div className="screen">
        <div className="mx-auto flex h-[calc(100dvh-96px)] w-full max-w-[720px] flex-col px-4 md:h-[100dvh] md:px-8 md:pt-6">
          <header className="flex items-center gap-2.5 border-b border-[#ECEEF3] pb-3 pt-4">
            <button
              type="button"
              onClick={() => setThreadId(null)}
              aria-label="대화 목록"
              className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#3A3F51] shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
            >
              <ArrowLeftOutlined style={{ fontSize: 13 }} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold text-[#14161F]">{thread.name}</p>
              <p className="text-[11px] text-[#9AA1B2]">
                {thread.community ? `${thread.members.length}명 · 번개 크루` : "크루로그 안내"}
              </p>
            </div>
          </header>

          <div className="quiet-scroll flex-1 space-y-3 overflow-y-auto py-4">
            {thread.messages.map((message) => {
              const mine = message.authorId === ME.id;
              const author = USERS.find((u) => u.id === message.authorId) ?? ME;
              return (
                <div key={message.id} className={`flex gap-2 ${mine ? "justify-end" : "justify-start"}`}>
                  {!mine && <Avatar user={author} size={30} />}
                  <div className={`flex max-w-[78%] flex-col gap-1 ${mine ? "items-end" : "items-start"}`}>
                    {!mine && (
                      <span className="px-1 text-[10.5px] font-medium text-[#9AA1B2]">
                        {author.name} · {message.at}
                      </span>
                    )}
                    <div
                      className="rounded-[16px] px-3.5 py-2 text-[12.5px] leading-relaxed"
                      style={{
                        background: mine ? "#4F63FF" : "#fff",
                        color: mine ? "#fff" : "#14161F",
                        borderBottomRightRadius: mine ? 6 : 16,
                        borderBottomLeftRadius: mine ? 16 : 6,
                        boxShadow: mine ? "none" : "0 2px 10px rgba(15,23,42,0.05)",
                      }}
                    >
                      {message.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            className="flex shrink-0 items-center gap-2 border-t border-[#ECEEF3] bg-[#F6F7FB] py-2.5"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="메시지 보내기"
              className="h-11 flex-1 rounded-full border border-[#E2E5EC] bg-white px-4 text-[13px] outline-none focus:border-[#4F63FF]"
            />
            <button
              type="submit"
              aria-label="보내기"
              className="grid h-11 w-11 place-items-center rounded-full bg-[#14161F] text-white disabled:opacity-40"
              disabled={!draft.trim()}
            >
              <SendOutlined style={{ fontSize: 14 }} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="mx-auto w-full max-w-[720px] px-4 md:px-8 md:pt-8">
        <header className="flex items-center justify-between pt-5 md:pt-0">
          <div>
            <p className="text-[12.5px] font-medium text-[#9AA1B2]">
              {tab === "notice" ? "받은 소식" : "함께하는 사람들"}
            </p>
            <h1 className="mt-1 text-[24px] font-extrabold tracking-[-0.045em] text-[#14161F]">
              {tab === "notice" ? "알림" : "채팅"}
            </h1>
          </div>
          <Avatar user={ME} size={38} solid />
        </header>

        <div className="mt-4">
          <Segmented
            block
            value={tab}
            onChange={(value) => setTab(value as "notice" | "chat")}
            options={[
              { label: "알림", value: "notice" },
              { label: "채팅", value: "chat" },
            ]}
          />
        </div>

        {tab === "notice" && (
          <div className="mt-4 space-y-2 pb-4">
            <p className="px-2 pb-1 text-[11.5px] font-semibold text-[#9AA1B2]">오늘</p>
            {notices.map((notice, index) => {
              const tone = TONES[notice.tone];
              return (
                <div
                  key={notice.id}
                  className="app-card flex items-start gap-3 p-3.5"
                  style={{ borderColor: notice.unread ? "#E4E7FF" : undefined }}
                >
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
                    style={{ background: tone.bg, color: tone.fg }}
                  >
                    {notice.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-snug text-[#14161F]">{notice.title}</p>
                    {notice.body && (
                      <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-[#6E7587]">{notice.body}</p>
                    )}
                    <p className="mt-1 text-[11px] text-[#B7BCC9]">{notice.time}</p>
                  </div>
                  {notice.thumb ? (
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#EDEFF5]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={notice.thumb} alt="" className="h-full w-full object-cover" />
                    </span>
                  ) : notice.unread ? (
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#4F63FF]" />
                  ) : null}
                  {index === 0 && <span className="sr-only">최신</span>}
                </div>
              );
            })}
            <p className="px-2 pt-3 text-center text-[11px] leading-relaxed text-[#B7BCC9]">
              지난 알림은 7일 뒤에 정리돼요.
            </p>
          </div>
        )}

        {tab === "chat" && !thread && (
          <div className="mt-4 space-y-2 pb-4">
            <p className="px-2 pb-1 text-[11.5px] font-semibold text-[#9AA1B2]">대화 {threads.length}</p>
            {threads.map((item) => {
              const others = item.members.filter((id) => id !== ME.id);
              const lead = others[0] ? userOf(others[0]) : null;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setThreadId(item.id);
                    setThreads((prev) => prev.map((t) => (t.id === item.id ? { ...t, unread: 0 } : t)));
                  }}
                  className="press app-card flex w-full items-center gap-3 p-3.5 text-left"
                >
                  {lead ? (
                    <Avatar user={lead} size={44} />
                  ) : (
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#14161F] text-[13px] font-bold text-white">
                      C
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[13.5px] font-semibold text-[#14161F]">{item.name}</span>
                      {item.community && (
                        <span className="rounded-full bg-[#F1F2F7] px-1.5 py-0.5 text-[9.5px] font-semibold text-[#6E7587]">
                          크루
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-[#6E7587]">{item.preview}</span>
                  </span>
                  <span className="flex flex-col items-end gap-1">
                    <span className="text-[10.5px] text-[#B7BCC9]">{item.time}</span>
                    {item.unread > 0 && (
                      <span className="grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[#4F63FF] px-1 text-[9.5px] font-bold text-white">
                        {item.unread}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
            <p className="px-2 pt-3 text-center text-[11px] leading-relaxed text-[#B7BCC9]">
              데모 대화입니다. 보낸 메시지는 이 브라우저에만 남아요.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
