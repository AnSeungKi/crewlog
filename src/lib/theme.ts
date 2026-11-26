import type { ThemeConfig } from "antd";

export const PALETTE = {
  canvas: "#F6F7FB",
  surface: "#FFFFFF",
  ink: "#14161F",
  inkSoft: "#3A3F51",
  muted: "#6E7587",
  faint: "#9AA1B2",
  line: "#ECEEF3",
  lineStrong: "#E2E5EC",
  blue: "#4F63FF",
  blueDeep: "#3D50E8",
  blueSoft: "#EEF0FF",
  mint: "#2E9E6B",
  amber: "#C8863C",
} as const;

const SANS =
  '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif';

export const crewlogTheme: ThemeConfig = {
  token: {
    colorPrimary: PALETTE.blue,
    colorInfo: PALETTE.blue,
    colorSuccess: PALETTE.mint,
    colorWarning: PALETTE.amber,
    colorError: "#E5484D",
    colorLink: PALETTE.blue,
    colorText: PALETTE.ink,
    colorTextSecondary: PALETTE.muted,
    colorTextTertiary: PALETTE.faint,
    colorTextQuaternary: "#B7BCC9",
    colorBgLayout: PALETTE.canvas,
    colorBgContainer: PALETTE.surface,
    colorBgElevated: PALETTE.surface,
    colorBorder: PALETTE.lineStrong,
    colorBorderSecondary: PALETTE.line,
    colorFillSecondary: "#F1F2F7",
    colorFillTertiary: "#F5F6FA",
    colorFillQuaternary: "#F9FAFD",
    fontFamily: SANS,
    fontSize: 14,
    controlHeight: 40,
    borderRadius: 16,
    borderRadiusLG: 20,
    borderRadiusSM: 10,
    lineWidth: 1,
    wireframe: false,
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
    boxShadowSecondary: "0 12px 34px rgba(15, 23, 42, 0.12)",
  },
  components: {
    Button: {
      fontWeight: 600,
      primaryShadow: "none",
      defaultShadow: "none",
      dangerShadow: "none",
      controlHeight: 42,
      borderRadius: 999,
      paddingInline: 18,
      defaultBorderColor: PALETTE.lineStrong,
      defaultColor: PALETTE.inkSoft,
    },
    Input: {
      controlHeight: 44,
      borderRadius: 16,
      paddingInline: 14,
      activeShadow: "none",
    },
    Select: {
      controlHeight: 44,
      borderRadius: 16,
    },
    DatePicker: {
      controlHeight: 44,
      borderRadius: 16,
    },
    InputNumber: {
      controlHeight: 44,
      borderRadius: 16,
    },
    Segmented: {
      trackBg: "#EDEFF5",
      itemSelectedBg: "#FFFFFF",
      itemSelectedColor: PALETTE.ink,
      trackPadding: 3,
    },
    Drawer: {
      paddingLG: 0,
      colorBgElevated: PALETTE.surface,
    },
    Modal: {
      paddingContentHorizontalLG: 22,
      titleFontSize: 17,
    },
    Progress: {
      defaultColor: PALETTE.blue,
      remainingColor: "#EDEFF5",
    },
    Tag: {
      defaultBg: "#F1F2F7",
      borderRadiusSM: 999,
    },
    Switch: {
      colorPrimary: PALETTE.blue,
    },
  },
};
