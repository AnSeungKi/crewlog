"use client";

import { useEffect, useState } from "react";
import {
  BellFilled,
  BellOutlined,
  EnvironmentFilled,
  EnvironmentOutlined,
  HomeFilled,
  HomeOutlined,
  PlusOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Avatar } from "./ui";
import { HomeScreen } from "./screens/home";
import { MapScreen } from "./screens/map";
import { ActivityScreen } from "./screens/activity";
import { ProfileScreen } from "./screens/profile";
import { ME } from "@/lib/seed";
import { useCrewlog } from "@/lib/store";
import { BASE_PATH } from "@/lib/asset";

export type TabKey = "home" | "map" | "activity" | "profile";

const TABS: {
  key: TabKey;
  label: string;
  on: React.ReactNode;
  off: React.ReactNode;
}[] = [
  { key: "home", label: "홈", on: <HomeFilled />, off: <HomeOutlined /> },
  { key: "map", label: "지도", on: <EnvironmentFilled />, off: <EnvironmentOutlined /> },
  { key: "activity", label: "알림", on: <BellFilled />, off: <BellOutlined /> },
  { key: "profile", label: "프로필", on: <UserOutlined />, off: <UserOutlined /> },
];

export function AppShell() {
  const [tab, setTab] = useState<TabKey>("home");
  const { openCreate, joined, interested, boosts } = useCrewlog();
  const unread = 3;

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "map") setTab("map");
    if (hash === "profile") setTab("profile");
  }, []);

  const switchTab = (next: TabKey) => {
    setTab(next);
    // history.replaceState bypasses Next's basePath handling, so prefix it here.
    const url = next === "home" ? `${BASE_PATH}/` : `${BASE_PATH}/#${next}`;
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const counts = {
    joined: Object.values(joined).filter(Boolean).length,
    interested: Object.values(interested).filter(Boolean).length,
    boosts: boosts.length,
  };

  return (
    <div className="min-h-[100dvh] bg-[#F6F7FB]">
      <DesktopRail tab={tab} onTab={switchTab} onPlus={openCreate} />

      <div className="md:pl-[86px] lg:pl-[236px]">
        {tab === "home" && <HomeScreen onNavigate={switchTab} />}
        {tab === "map" && <MapScreen />}
        {tab === "activity" && <ActivityScreen />}
        {tab === "profile" && <ProfileScreen counts={counts} onNavigate={switchTab} />}
      </div>

      {/* floating tab bar — mobile */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 px-3 md:hidden"
        style={{ paddingBottom: "calc(10px + env(safe-area-inset-bottom))" }}
        aria-label="주요 메뉴"
      >
        <div
          className="relative mx-auto flex h-[66px] max-w-[520px] items-center justify-around rounded-[26px] border border-[#ECEEF3] px-1.5"
          style={{
            background: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
          }}
        >
          {TABS.slice(0, 2).map((item) => (
            <TabButton key={item.key} item={item} active={tab === item.key} onClick={() => switchTab(item.key)} />
          ))}

          <div className="relative flex w-[64px] justify-center">
            <button
              type="button"
              onClick={openCreate}
              aria-label="새 번개 열기"
              className="press absolute -top-[24px] grid h-[54px] w-[54px] place-items-center rounded-full bg-[#14161F] text-white"
              style={{ boxShadow: "0 10px 22px rgba(20, 22, 31, 0.32)" }}
            >
              <PlusOutlined style={{ fontSize: 20 }} />
            </button>
          </div>

          <TabButton
            item={{ ...TABS[2], label: "알림" }}
            active={tab === "activity"}
            onClick={() => switchTab("activity")}
            badge={unread}
          />
          <TabButton item={TABS[3]} active={tab === "profile"} onClick={() => switchTab("profile")} />
        </div>
      </nav>
    </div>
  );
}

function TabButton({
  item,
  active,
  onClick,
  badge,
}: {
  item: (typeof TABS)[number];
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-full min-w-[56px] flex-1 flex-col items-center justify-center gap-[3px]"
      aria-current={active ? "page" : undefined}
    >
      <span
        className="relative grid h-7 w-9 place-items-center rounded-full text-[17px] transition-colors"
        style={{
          color: active ? "#4F63FF" : "#9AA1B2",
          background: active ? "#EEF0FF" : "transparent",
        }}
      >
        {active ? item.on : item.off}
        {badge ? (
          <span className="absolute -right-0.5 -top-0.5 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-[#E5484D] px-1 text-[9px] font-bold text-white ring-2 ring-white">
            {badge}
          </span>
        ) : null}
      </span>
      <span
        className="text-[10.5px] font-semibold tracking-[-0.02em]"
        style={{ color: active ? "#14161F" : "#9AA1B2" }}
      >
        {item.label}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * desktop navigation rail
 * ------------------------------------------------------------------ */

function DesktopRail({
  tab,
  onTab,
  onPlus,
}: {
  tab: TabKey;
  onTab: (tab: TabKey) => void;
  onPlus: () => void;
}) {
  const { openDetail, meetups } = useCrewlog();
  const nextMeetup = meetups[0];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-[#ECEEF3] bg-white md:flex md:w-[86px] md:px-3 lg:w-[236px] lg:px-4">
      <div className="flex h-[86px] items-center gap-2.5 px-1 lg:px-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-[#4F63FF] text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M13.2 2 4.8 13.4h5.1L9.2 22l8.9-11.6h-5.3L13.2 2Z" />
          </svg>
        </span>
        <span className="hidden text-[16px] font-extrabold tracking-[-0.04em] text-[#14161F] lg:block">
          크루로그
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 pt-2">
        {TABS.map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onTab(item.key)}
              className="press flex h-[46px] items-center gap-3 rounded-[14px] px-3 transition-colors"
              style={{ background: active ? "#EEF0FF" : "transparent", color: active ? "#4F63FF" : "#6E7587" }}
            >
              <span className="grid w-5 place-items-center text-[17px]">{active ? item.on : item.off}</span>
              <span
                className="hidden text-[13.5px] font-semibold tracking-[-0.02em] lg:block"
                style={{ color: active ? "#14161F" : "#6E7587" }}
              >
                {item.label}
              </span>
              {item.key === "activity" && (
                <span className="ml-auto hidden h-[18px] min-w-[18px] place-items-center rounded-full bg-[#E5484D] px-1 text-[9.5px] font-bold text-white lg:grid">
                  3
                </span>
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={onPlus}
          className="press mt-3 flex h-[46px] items-center justify-center gap-2 rounded-[14px] bg-[#14161F] text-white lg:justify-start lg:px-3"
        >
          <PlusOutlined style={{ fontSize: 15 }} />
          <span className="hidden text-[13.5px] font-semibold lg:block">번개 열기</span>
        </button>

        <div className="mt-6 hidden lg:block">
          <p className="px-3 pb-2 text-[11px] font-semibold text-[#B7BCC9]">다가오는 번개</p>
          {nextMeetup && (
            <button
              type="button"
              onClick={() => openDetail(nextMeetup.id)}
              className="press w-full rounded-[14px] p-2 text-left hover:bg-[#F6F7FB]"
            >
              <span className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[#EEF0FF] text-[13px]">
                  <MessageOutlined style={{ color: "#4F63FF" }} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[11.5px] font-semibold text-[#3A3F51]">
                    {nextMeetup.title}
                  </span>
                  <span className="block text-[10.5px] text-[#9AA1B2]">오늘 저녁 · 한강</span>
                </span>
              </span>
            </button>
          )}
        </div>
      </nav>

      <div className="mb-4 mt-2 border-t border-[#F0F2F7] pt-3">
        <button
          type="button"
          onClick={() => onTab("profile")}
          className="press flex w-full items-center gap-2.5 rounded-[14px] px-1.5 py-2 hover:bg-[#F6F7FB]"
        >
          <Avatar user={ME} size={32} solid />
          <span className="hidden min-w-0 lg:block">
            <span className="block text-[12.5px] font-semibold text-[#14161F]">{ME.name}</span>
            <span className="block text-[10.5px] text-[#9AA1B2]">@{ME.handle}</span>
          </span>
        </button>
      </div>
    </aside>
  );
}
