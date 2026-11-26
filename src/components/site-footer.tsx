import Link from "next/link";
import { Wordmark } from "./brand";
import { NEIGHBORHOODS } from "@/lib/seed";

const GROUPS = [
  {
    title: "둘러보기",
    links: [
      { label: "동네 지도", href: "/#map" },
      { label: "인증샷 피드", href: "/#feed" },
      { label: "제휴 쿠폰", href: "/#partners" },
    ],
  },
  {
    title: "호스트",
    links: [
      { label: "번개 열기", href: "/#feed" },
      { label: "크루 호스트 Pro", href: "/#partners" },
      { label: "번개 부스트", href: "/#partners" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[#E5E0D8] bg-[#F4F0E9]">
      <div className="mx-auto max-w-[1320px] px-5 py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark />
            <p
              className="mt-4 max-w-[30ch] text-[15px] leading-[1.6] tracking-[-0.03em] text-[#141413]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              동네에서, 오늘 바로.
              <br />
              짧은 약속과 긴 기록.
            </p>
            <p className="mt-4 max-w-[38ch] text-[11.5px] leading-relaxed text-[#6B6660]">
              CREWLOG는 동네 기반 번개 모임과 인증샷을 위한 데모 프로젝트입니다. 결제와
              쿠폰은 시뮬레이션이며 실제 거래가 발생하지 않습니다.
            </p>
          </div>

          {GROUPS.map((group) => (
            <div key={group.title} className="lg:col-span-2">
              <p className="eyebrow">{group.title}</p>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="ink-link text-[12px] text-[#3D3A36]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-3">
            <p className="eyebrow">동네</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {NEIGHBORHOODS.map((item) => (
                <li key={item.id} className="text-[12px] text-[#3D3A36]">
                  <span className="mr-1.5 font-mono text-[9px] text-[#A8A096]">
                    {item.code}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
            <a
              href="https://github.com/AnSeungKi/crewlog"
              target="_blank"
              rel="noreferrer"
              className="ink-link mt-5 inline-block font-mono text-[10.5px] text-[#6B6660]"
            >
              github.com/AnSeungKi/crewlog
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-[#E1DACE] pt-4">
          <p className="font-mono text-[10px] tracking-[0.08em] text-[#9A948C]">
            © 2026 CREWLOG · SEOUL
          </p>
          <p className="font-mono text-[10px] tracking-[0.08em] text-[#9A948C]">
            NEXT.JS · ANT DESIGN · PRISMA
          </p>
        </div>
      </div>
    </footer>
  );
}
