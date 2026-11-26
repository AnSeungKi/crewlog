import { Feed } from "@/components/feed";
import { FilterBar } from "@/components/filter-bar";
import { Hero } from "@/components/hero";
import { NeighborhoodMap } from "@/components/neighborhood-map";
import { Partners } from "@/components/partners";
import { ProBand } from "@/components/pro-band";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const NOTES = [
  { n: "01", text: "지도의 핀을 누르면 그 번개의 시간과 남은 자리가 보입니다." },
  { n: "02", text: "초록색 제휴 핀은 동네 가게입니다. 쿠폰을 받아두세요." },
  { n: "03", text: "번개를 열면 지도와 피드에 바로 반영됩니다." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <Hero />
        <FilterBar />

        <section id="map" className="mx-auto max-w-[1320px] scroll-mt-36 px-5 pt-7">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="space-y-4 lg:sticky lg:top-[136px]">
                <NeighborhoodMap />

                <div className="border border-[#E5E0D8] bg-white px-4 py-4">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow">HOW TO USE THE MAP</p>
                    <p className="eyebrow">SEOUL · 4</p>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {NOTES.map((note) => (
                      <li key={note.n} className="flex gap-2.5 text-[11.5px] leading-relaxed text-[#3D3A36]">
                        <span className="num mt-[1px] shrink-0 text-[9.5px] text-[#C4BEB4]">
                          {note.n}
                        </span>
                        {note.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <Feed />
            </div>
          </div>
        </section>

        <Partners />
        <ProBand />
      </main>

      <SiteFooter />
    </div>
  );
}
