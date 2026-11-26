"use client";

import { Badge, Button, Dropdown } from "antd";
import { PlusOutlined, ThunderboltFilled } from "@ant-design/icons";
import { CrewAvatar } from "./avatar";
import { Wordmark } from "./brand";
import { ME } from "@/lib/seed";
import { useCrewlog } from "@/lib/store";

const NAV = [
  { href: "#map", label: "동네 지도" },
  { href: "#feed", label: "인증샷 피드" },
  { href: "#partners", label: "제휴 쿠폰" },
];

export function SiteHeader() {
  const { openComposer, setProOpen, saved } = useCrewlog();
  const savedCount = Object.values(saved).filter(Boolean).length;

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E0D8] bg-[#FAF8F5]">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-8">
          <Wordmark />
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="ink-link text-[13.5px] text-[#3D3A36]"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setProOpen(true)}
              className="ink-link text-[13.5px] text-[#1F5E4B]"
            >
              호스트 Pro
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="mr-1 hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#9A948C] lg:flex">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-[#E84A27]" />
            seoul · live
          </span>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openComposer("meetup")}
            style={{ height: 36 }}
          >
            번개 열기
          </Button>

          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              items: [
                {
                  key: "me",
                  disabled: true,
                  label: (
                    <div className="py-1 pr-4">
                      <div className="text-[13px] font-medium text-[#141413]">
                        {ME.name}
                      </div>
                      <div className="font-mono text-[10px] text-[#9A948C]">
                        @{ME.handle} · Free
                      </div>
                    </div>
                  ),
                },
                { type: "divider" },
                {
                  key: "pro",
                  icon: <ThunderboltFilled style={{ color: "#E84A27" }} />,
                  label: "호스트 Pro 알아보기",
                },
                { key: "meetup", label: "번개 열기" },
                { key: "post", label: "인증샷 올리기" },
                {
                  key: "saved",
                  disabled: true,
                  label: (
                    <span className="text-[12px] text-[#6B6660]">
                      저장한 인증샷 {savedCount}개
                    </span>
                  ),
                },
              ],
              onClick: ({ key }) => {
                if (key === "pro") setProOpen(true);
                if (key === "meetup") openComposer("meetup");
                if (key === "post") openComposer("post");
              },
            }}
          >
            <button
              type="button"
              className="relative rounded-full outline-none"
              aria-label="내 계정"
            >
              <Badge dot offset={[-2, 3]} color="#1F5E4B">
                <CrewAvatar user={ME} size={34} />
              </Badge>
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
