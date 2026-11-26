"use client";

import dayjs from "dayjs";
import "dayjs/locale/ko";
import { App as AntdApp, ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";
import { CrewlogProvider } from "@/lib/store";
import { crewlogTheme } from "@/lib/theme";
import { AppOverlays } from "@/components/overlays";

dayjs.locale("ko");

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={crewlogTheme} locale={koKR}>
      <AntdApp>
        <CrewlogProvider>
          {children}
          <AppOverlays />
        </CrewlogProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
