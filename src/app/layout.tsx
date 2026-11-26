import type { Metadata, Viewport } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://crewlog.local"),
  title: {
    default: "크루로그 — 동네에서, 오늘 바로",
    template: "%s · 크루로그",
  },
  description:
    "성수동·연남동·잠실·판교의 번개 모임과 인증샷. 지도에서 가까운 번개를 찾고, 바로 참여하세요.",
  applicationName: "크루로그",
  appleWebApp: {
    capable: true,
    title: "크루로그",
    statusBarStyle: "default",
  },
  keywords: ["번개 모임", "동네 모임", "성수동", "연남동", "잠실", "판교", "크루로그"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "크루로그",
    title: "크루로그 — 동네에서, 오늘 바로",
    description: "지도에서 가까운 번개를 찾고, 바로 참여하세요.",
    images: [{ url: "/images/seongsu-dusk.jpg", width: 1600, height: 709 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "크루로그",
    description: "동네에서, 오늘 바로 만나는 사람들.",
    images: ["/images/seongsu-dusk.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F7FB",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <AntdRegistry layer>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
