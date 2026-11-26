import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export const won = (value: number): string =>
  `${value.toLocaleString("ko-KR")}원`;

/** 19:30 */
export const clock = (iso: string): string => dayjs(iso).format("HH:mm");

/** 11.26 목 */
export const shortDay = (iso: string): string => dayjs(iso).format("MM.DD ddd");

/** 11.26 목 19:30 */
export const stamp = (iso: string): string =>
  `${dayjs(iso).format("MM.DD ddd")} ${dayjs(iso).format("HH:mm")}`;

/** 오늘 / 내일 / 11.28 */
export const dayBadge = (iso: string): string => {
  const target = dayjs(iso).startOf("day");
  const today = dayjs().startOf("day");
  const diff = target.diff(today, "day");
  if (diff === 0) return "오늘";
  if (diff === 1) return "내일";
  return dayjs(iso).format("MM.DD");
};

export const fromNow = (iso: string): string => dayjs(iso).fromNow();

export const pct = (part: number, whole: number): number =>
  whole <= 0 ? 0 : Math.min(100, Math.round((part / whole) * 100));
