import type { Metadata, Viewport } from "next";
import { Gowun_Batang, IBM_Plex_Mono, IBM_Plex_Sans_KR } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "./providers";
import "./globals.css";

const sans = IBM_Plex_Sans_KR({
  variable: "--font-plex-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
  preload: false,
});

const serif = Gowun_Batang({
  variable: "--font-gowun",
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://crewlog.local"),
  title: {
    default: "크루로그 CREWLOG — 동네에서, 오늘 바로",
    template: "%s · 크루로그",
  },
  description:
    "성수동·연남동·잠실·판교의 번개 모임과 인증샷을 한 장면처럼. 동네 지도에서 열린 번개를 찾고, 참여하고, 오늘의 기록을 남기세요.",
  keywords: [
    "번개 모임",
    "동네 커뮤니티",
    "성수동",
    "연남동",
    "한강 러닝",
    "인증샷",
    "CREWLOG",
    "크루로그",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "CREWLOG 크루로그",
    title: "크루로그 CREWLOG — 동네에서, 오늘 바로",
    description:
      "동네 지도 위에서 열린 번개를 찾고, 인증샷으로 하루를 남기는 하이퍼로컬 크루 매거진.",
    images: [{ url: "/images/seongsu-dusk.jpg", width: 1600, height: 709 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "크루로그 CREWLOG",
    description: "동네에서, 오늘 바로 만나는 사람들.",
    images: ["/images/seongsu-dusk.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
        <AntdRegistry layer>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
