import type { NeighborhoodId } from "./types";

/**
 * Hand-drawn street geometry for each neighbourhood, in a 1000 × 620
 * coordinate space. Blocks are generated around these roads so every
 * neighbourhood reads like a different part of the city:
 * Seongsu's brick grid, Yeonnam's forest path, Jamsil's river, Pangyo's
 * new-town park.
 */
export interface MapRoad {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  label?: string;
  labelX?: number;
  labelY?: number;
  rotate?: number;
  tone?: "street" | "avenue";
}

export interface MapPark {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  rotate?: number;
  tone?: "park" | "sand";
}

export interface MapSpec {
  seed: number;
  /** river or stream silhouette */
  waterPath?: string;
  waterLabel?: { x: number; y: number; text: string; rotate?: number };
  /** a linear park drawn as a thick stroke, e.g. 경의선숲길 */
  greenway?: { x1: number; y1: number; x2: number; y2: number; width: number; label: string; rotate: number };
  parks: MapPark[];
  roads: MapRoad[];
  /** map corner caption */
  corner: string;
  /** meetup pin anchors in canvas units */
  pinSpots: { x: number; y: number }[];
  /** partner pin anchor */
  sponsorSpot: { x: number; y: number };
}

export const MAP_SPECS: Record<NeighborhoodId, MapSpec> = {
  seongsu: {
    seed: 11,
    corner: "성수동 · 37.5445°N 127.0557°E",
    roads: [
      { x1: -20, y1: 246, x2: 1020, y2: 228, width: 26, label: "성수이로", labelX: 150, labelY: 232, tone: "avenue" },
      { x1: 430, y1: -20, x2: 452, y2: 640, width: 22, label: "연무장길", labelX: 442, labelY: 92, rotate: -88 },
      { x1: 726, y1: -20, x2: 704, y2: 640, width: 13 },
      { x1: -20, y1: 442, x2: 1020, y2: 430, width: 13, label: "뚝섬로", labelX: 840, labelY: 424 },
      { x1: -20, y1: 566, x2: 1020, y2: 486, width: 17, label: "아차산로", labelX: 300, labelY: 540, rotate: -4 },
    ],
    parks: [
      { x: 770, y: 300, w: 196, h: 110, label: "서울숲", tone: "park" },
      { x: 96, y: 60, w: 132, h: 96, label: "성수 근린공원", tone: "park" },
    ],
    pinSpots: [
      { x: 372, y: 330 },
      { x: 604, y: 372 },
      { x: 250, y: 480 },
    ],
    sponsorSpot: { x: 706, y: 186 },
  },
  yeonnam: {
    seed: 23,
    corner: "연남동 · 37.5629°N 126.9254°E",
    roads: [
      { x1: -20, y1: 302, x2: 1020, y2: 288, width: 20, label: "성미산로", labelX: 700, labelY: 280, tone: "avenue" },
      { x1: 306, y1: -20, x2: 322, y2: 640, width: 18, label: "동진시장길", labelX: 314, labelY: 130, rotate: -88 },
      { x1: 668, y1: -20, x2: 650, y2: 640, width: 13, label: "모래내로", labelX: 660, labelY: 520, rotate: -88 },
      { x1: -20, y1: 470, x2: 1020, y2: 458, width: 12 },
      { x1: 60, y1: 116, x2: 980, y2: 100, width: 12 },
    ],
    greenway: {
      x1: 40,
      y1: 600,
      x2: 1000,
      y2: 128,
      width: 34,
      label: "경의선숲길",
      rotate: -25,
    },
    parks: [
      { x: 700, y: 380, w: 150, h: 110, label: "연남 어린이공원", tone: "park" },
      { x: 120, y: 330, w: 120, h: 86, label: "성미산 자락", tone: "park" },
    ],
    pinSpots: [
      { x: 430, y: 232 },
      { x: 560, y: 350 },
      { x: 330, y: 540 },
    ],
    sponsorSpot: { x: 742, y: 214 },
  },
  jamsil: {
    seed: 37,
    corner: "잠실·한강 · 37.5133°N 127.1000°E",
    waterPath:
      "M-20,468 C140,430 300,500 470,472 C640,444 800,504 1020,462 L1020,640 L-20,640 Z",
    waterLabel: { x: 300, y: 566, text: "한강 · HANGANG", rotate: -2 },
    roads: [
      { x1: -20, y1: 196, x2: 1020, y2: 208, width: 24, label: "송파대로", labelX: 128, labelY: 188, tone: "avenue" },
      { x1: 528, y1: -20, x2: 512, y2: 470, width: 22, label: "잠실로", labelX: 520, labelY: 120, rotate: -88 },
      { x1: 142, y1: -20, x2: 158, y2: 460, width: 13, label: "올림픽로", labelX: 150, labelY: 330, rotate: -88 },
      { x1: 690, y1: -20, x2: 676, y2: 460, width: 13 },
    ],
    parks: [
      { x: 700, y: 250, w: 166, h: 120, label: "석촌호수", tone: "sand" },
      { x: 60, y: 300, w: 150, h: 96, label: "잠실 근린공원", tone: "park" },
    ],
    pinSpots: [
      { x: 420, y: 300 },
      { x: 620, y: 360 },
      { x: 300, y: 402 },
    ],
    sponsorSpot: { x: 396, y: 170 },
  },
  pangyo: {
    seed: 53,
    corner: "판교 · 37.3948°N 127.1112°E",
    roads: [
      { x1: -20, y1: 322, x2: 1020, y2: 334, width: 23, label: "판교역로", labelX: 700, labelY: 314, tone: "avenue" },
      { x1: 566, y1: -20, x2: 548, y2: 640, width: 21, label: "대왕판교로", labelX: 558, labelY: 96, rotate: -88 },
      { x1: 252, y1: -20, x2: 268, y2: 640, width: 12, label: "낙생로", labelX: 260, labelY: 520, rotate: -88 },
      { x1: -20, y1: 138, x2: 1020, y2: 126, width: 12 },
    ],
    parks: [
      { x: 70, y: 392, w: 300, h: 176, label: "중앙공원", tone: "park" },
      { x: 700, y: 150, w: 150, h: 110, label: "운중천 산책로", tone: "park" },
    ],
    pinSpots: [
      { x: 452, y: 262 },
      { x: 640, y: 400 },
      { x: 330, y: 470 },
    ],
    sponsorSpot: { x: 690, y: 250 },
  },
};

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 620;

export const toLeft = (x: number): string => `${(x / MAP_WIDTH) * 100}%`;
export const toTop = (y: number): string => `${(y / MAP_HEIGHT) * 100}%`;
