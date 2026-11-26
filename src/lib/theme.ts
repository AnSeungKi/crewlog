import type { ThemeConfig } from "antd";

export const PALETTE = {
  paper: "#FAF8F5",
  paperDeep: "#F4F0E9",
  surface: "#FFFFFF",
  ink: "#141413",
  inkSoft: "#3D3A36",
  muted: "#6B6660",
  faint: "#9A948C",
  line: "#E5E0D8",
  lineSoft: "#EFEBE4",
  vermilion: "#E84A27",
  forest: "#1F5E4B",
  brass: "#9A7B3F",
} as const;

const SANS =
  'var(--font-plex-sans), "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif';

export const crewlogTheme: ThemeConfig = {
  token: {
    colorPrimary: PALETTE.vermilion,
    colorInfo: PALETTE.vermilion,
    colorSuccess: PALETTE.forest,
    colorWarning: PALETTE.brass,
    colorError: "#B93C25",
    colorLink: PALETTE.forest,
    colorText: PALETTE.ink,
    colorTextSecondary: PALETTE.muted,
    colorTextTertiary: PALETTE.faint,
    colorTextQuaternary: "#C4BEB4",
    colorBgLayout: PALETTE.paper,
    colorBgContainer: PALETTE.surface,
    colorBgElevated: PALETTE.surface,
    colorBorder: "#DCD5C9",
    colorBorderSecondary: PALETTE.line,
    colorFillSecondary: PALETTE.paperDeep,
    colorFillTertiary: "#F6F2EC",
    colorFillQuaternary: "#FAF7F2",
    fontFamily: SANS,
    fontSize: 14,
    controlHeight: 36,
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    lineWidth: 1,
    wireframe: false,
    boxShadow: "0 1px 2px rgba(20, 20, 19, 0.05)",
    boxShadowSecondary: "0 12px 32px rgba(20, 20, 19, 0.10)",
  },
  components: {
    Button: {
      fontWeight: 500,
      primaryShadow: "none",
      defaultShadow: "none",
      dangerShadow: "none",
      controlHeight: 38,
      paddingInline: 18,
      defaultBorderColor: "#DCD5C9",
      defaultColor: PALETTE.ink,
    },
    Segmented: {
      trackBg: "#F1ECE4",
      trackPadding: 3,
      itemColor: PALETTE.muted,
      itemHoverColor: PALETTE.ink,
      itemSelectedBg: PALETTE.ink,
      itemSelectedColor: PALETTE.paper,
      borderRadius: 4,
      borderRadiusSM: 3,
    },
    Card: {
      colorBorderSecondary: PALETTE.line,
      borderRadiusLG: 8,
      headerFontSize: 14,
    },
    Tag: {
      defaultBg: "transparent",
      defaultColor: PALETTE.muted,
      borderRadiusSM: 3,
    },
    Modal: {
      contentBg: PALETTE.paper,
      headerBg: "transparent",
      titleFontSize: 20,
      borderRadiusLG: 10,
      paddingContentHorizontalLG: 28,
    },
    Drawer: {
      colorBgElevated: PALETTE.paper,
      paddingLG: 24,
    },
    Input: {
      activeShadow: "0 0 0 2px rgba(232, 74, 39, 0.10)",
      hoverBorderColor: "#C9C1B4",
      activeBorderColor: PALETTE.vermilion,
      paddingBlock: 7,
    },
    InputNumber: {
      activeShadow: "0 0 0 2px rgba(232, 74, 39, 0.10)",
      hoverBorderColor: "#C9C1B4",
      activeBorderColor: PALETTE.vermilion,
    },
    Select: {
      optionSelectedBg: "#FBEDE8",
      optionSelectedColor: PALETTE.ink,
      optionActiveBg: "#F6F2EC",
    },
    DatePicker: {
      activeShadow: "0 0 0 2px rgba(232, 74, 39, 0.10)",
      activeBorderColor: PALETTE.vermilion,
    },
    Tabs: {
      inkBarColor: PALETTE.vermilion,
      itemSelectedColor: PALETTE.ink,
      itemHoverColor: PALETTE.ink,
      titleFontSize: 15,
      horizontalItemGutter: 24,
    },
    Progress: {
      defaultColor: PALETTE.vermilion,
      remainingColor: "#EDE7DE",
    },
    Statistic: {
      contentFontSize: 28,
      titleFontSize: 12,
    },
    Message: {
      contentBg: PALETTE.ink,
      colorText: PALETTE.paper,
      borderRadiusLG: 6,
    },
    Tooltip: {
      colorBgSpotlight: PALETTE.ink,
      borderRadius: 4,
      fontSize: 12,
    },
    Divider: {
      colorSplit: PALETTE.line,
    },
    Badge: {
      colorError: PALETTE.vermilion,
    },
    Switch: {
      colorPrimary: PALETTE.forest,
    },
    Form: {
      labelColor: PALETTE.muted,
      labelFontSize: 12,
      verticalLabelPadding: "0 0 6px",
      itemMarginBottom: 20,
    },
    Empty: {
      colorTextDescription: PALETTE.faint,
    },
    Avatar: {
      containerSize: 36,
      textFontSize: 15,
    },
    Popover: {
      borderRadiusLG: 8,
    },
  },
};
