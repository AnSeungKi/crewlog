import dayjs from "dayjs";
import { asset } from "./asset";
import type {
  Category,
  CrewUser,
  FeedItem,
  Meetup,
  Neighborhood,
  PostComment,
  ProofPost,
  SponsorPin,
} from "./types";

/* ------------------------------------------------------------------ *
 * Editorial metadata
 * ------------------------------------------------------------------ */

export const CATEGORIES: Category[] = [
  {
    id: "running",
    label: "러닝",
    color: "#4F63FF",
    tint: "#EEF0FF",
    blurb: "같이 뛰면 6km도 짧아진다",
  },
  {
    id: "cafe",
    label: "카페·작업",
    color: "#C8863C",
    tint: "#FBF1E4",
    blurb: "각자 하던 일, 같은 테이블",
  },
  {
    id: "hiking",
    label: "등산",
    color: "#2E9E6B",
    tint: "#E9F6EF",
    blurb: "능선 위에서 먹는 김밥",
  },
  {
    id: "boardgame",
    label: "보드게임",
    color: "#8B6BD9",
    tint: "#F2EEFB",
    blurb: "룰 몰라도 첫 판은 재밌다",
  },
  {
    id: "photowalk",
    label: "사진산책",
    color: "#0F9D9D",
    tint: "#E7F5F6",
    blurb: "빛이 좋은 골목을 천천히",
  },
];

export const NEIGHBORHOODS: Neighborhood[] = [
  { id: "seongsu", label: "성수동", note: "붉은 벽돌, 낮은 커피값", lat: 37.5445, lng: 127.0557, zoom: 15 },
  { id: "yeonnam", label: "연남동", note: "골목마다 다른 온도", lat: 37.5625, lng: 126.9255, zoom: 15 },
  { id: "jamsil", label: "잠실·한강", note: "노을이 가장 긴 강변", lat: 37.5155, lng: 127.0795, zoom: 14 },
  { id: "pangyo", label: "판교", note: "퇴근 후 두 시간의 여유", lat: 37.3975, lng: 127.1085, zoom: 15 },
];

export const categoryOf = (id: Category["id"]): Category =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];

export const neighborhoodOf = (id: Neighborhood["id"]): Neighborhood =>
  NEIGHBORHOODS.find((n) => n.id === id) ?? NEIGHBORHOODS[0];

/* ------------------------------------------------------------------ *
 * People
 * ------------------------------------------------------------------ */

export const USERS: CrewUser[] = [
  {
    id: "u1",
    name: "안승기",
    handle: "ahnseunggi9",
    bio: "동네에서 본 것을 기록합니다. 필름 카메라와 낡은 운동화.",
    accent: "#4F63FF",
  },
  {
    id: "u2",
    name: "하린",
    handle: "harin.runs",
    bio: "잠실·한강 러닝 크루 '슬로우식스' 리더. 말 없이 뛰는 걸 좋아합니다.",
    accent: "#2E9E6B",
    pro: true,
  },
  {
    id: "u3",
    name: "도윤",
    handle: "doyun.roasters",
    bio: "성수 로스터리 바리스타. 오후 두 시의 창가 자리를 지킵니다.",
    accent: "#C8863C",
    partner: true,
  },
  {
    id: "u4",
    name: "서연",
    handle: "seoyeon.frames",
    bio: "필름 사진가. 골목의 빛을 두 시간씩 기다립니다.",
    accent: "#0F9D9D",
  },
  {
    id: "u5",
    name: "지후",
    handle: "jihoo.boards",
    bio: "연남 보드게임 살롱 운영. 처음 온 사람이 이기게 만드는 게 취미.",
    accent: "#8B6BD9",
    pro: true,
    partner: true,
  },
  {
    id: "u6",
    name: "유진",
    handle: "yujin.hikes",
    bio: "주말마다 북한산. 초보 능선 코스를 안내합니다.",
    accent: "#2F8F6B",
  },
  {
    id: "u7",
    name: "민서",
    handle: "minseo.works",
    bio: "프리랜서 디자이너. 카페 작업 번개의 단골.",
    accent: "#D9715B",
  },
  {
    id: "u8",
    name: "태오",
    handle: "taeo.pangyo",
    bio: "판교에서 일하고 아침에 뜁니다. 6시 40분의 공원이 제일 좋습니다.",
    accent: "#5B7C99",
  },
  {
    id: "u9",
    name: "지안",
    handle: "jian.morning",
    bio: "아침 러닝 3년차. 판교 크루 고정 멤버.",
    accent: "#B07A4A",
  },
  {
    id: "u10",
    name: "태윤",
    handle: "taeyun.k",
    bio: "퇴근 후 한강. 주 3회 6km.",
    accent: "#667089",
  },
  {
    id: "u11",
    name: "소윤",
    handle: "soyoon.draws",
    bio: "그림 그리는 사람. 카페 작업 번개에서 자주 봅니다.",
    accent: "#C06A8A",
  },
  {
    id: "u12",
    name: "현우",
    handle: "hyunwoo.hikes",
    bio: "주말엔 산, 평일엔 보드게임.",
    accent: "#3E8070",
  },
];

export const ME: CrewUser = USERS[0];

export const userOf = (id: string): CrewUser =>
  USERS.find((u) => u.id === id) ?? ME;

/* ------------------------------------------------------------------ *
 * Time helpers — the seed always describes "today" so the demo never
 * looks stale. Absolute clock times are rendered, so server and client
 * agree on every meetup label.
 * ------------------------------------------------------------------ */

const TODAY = dayjs().startOf("day");

const at = (dayOffset: number, time: string): string => {
  const [hour, minute] = time.split(":").map(Number);
  return TODAY.add(dayOffset, "day")
    .hour(hour)
    .minute(minute)
    .second(0)
    .millisecond(0)
    .toISOString();
};

const hoursAgo = (hours: number): string =>
  dayjs().subtract(hours, "hour").toISOString();

export const seedStartOfToday = TODAY.toISOString();

/* ------------------------------------------------------------------ *
 * Meetups
 * ------------------------------------------------------------------ */

export const MEETUPS: Meetup[] = [
  {
    id: "m-hanriver-6k",
    title: "퇴근 후 한강 6K, 말 없이 뛰어요",
    categoryId: "running",
    neighborhoodId: "jamsil",
    startsAt: at(0, "19:30"),
    place: "잠실한강공원 2번 출구 앞",
    lat: 37.5183,
    lng: 127.0736,
    hostId: "u2",
    capacity: 12,
    participantIds: ["u2", "u1", "u8", "u7", "u4", "u6", "u3", "u5"],
    description:
      "각자 페이스로 6km를 달립니다. 말은 없어도 됩니다. 마지막 400m만 같이 들어와요. 7분/km부터 5분/km까지 알아서 흩어지고, 끝나고 물 한 잔은 제가 쏩니다. 처음 오시면 시작 전에 손 한 번 잡고 출발해요.",
    cover: asset("/images/hanriver-run.jpg"),
    boostedUntil: at(1, "19:30"),
    persisted: true,
  },
  {
    id: "m-seongsu-table",
    title: "성수 로스터리에서 각자 작업 모임",
    categoryId: "cafe",
    neighborhoodId: "seongsu",
    startsAt: at(1, "14:00"),
    place: "성수 로스터리 · 창가 테이블 (제휴)",
    lat: 37.5443,
    lng: 127.0556,
    hostId: "u3",
    capacity: 8,
    participantIds: ["u3", "u7", "u4", "u1", "u6", "u8"],
    description:
      "각자 하던 일 들고 오세요. 두 시간 집중하고 30분 수다 떱니다. 콘센트 가까운 자리는 먼저 온 사람 것. 참여자에게는 아메리카노 20% 할인 쿠폰이 따라옵니다.",
    cover: asset("/images/seongsu-cafe.jpg"),
    sponsorId: "s-roastery",
    persisted: true,
  },
  {
    id: "m-bukhansan-ridge",
    title: "북한산 초보 능선, 네 시간 코스",
    categoryId: "hiking",
    neighborhoodId: "yeonnam",
    startsAt: at(1, "07:20"),
    place: "연신내역 3번 출구",
    lat: 37.619,
    lng: 126.921,
    hostId: "u6",
    capacity: 10,
    participantIds: ["u6", "u2", "u7", "u4", "u3", "u8", "u5"],
    description:
      "왕복 4시간, 초보 능선 코스입니다. 등산화만 있으면 됩니다. 간식은 나눠 먹어요. 하산 후 막걸리 한 잔은 선택이지만 대부분 하십니다.",
    cover: asset("/images/bukhansan-hike.jpg"),
    persisted: true,
  },
  {
    id: "m-yeonnam-boards",
    title: "연남 골목 보드게임, 처음 오셔도 돼요",
    categoryId: "boardgame",
    neighborhoodId: "yeonnam",
    startsAt: at(0, "20:00"),
    place: "연남 보드게임 살롱 · 2층 (제휴)",
    lat: 37.5628,
    lng: 126.9252,
    hostId: "u5",
    capacity: 6,
    participantIds: ["u5", "u1", "u7", "u4"],
    description:
      "룰 몰라도 됩니다. 가벼운 파티게임부터 두 판 정도 돌립니다. 처음 오신 분에게는 음료 한 잔 서비스. 늦어도 11시에는 끝나요.",
    cover: asset("/images/yeonnam-boardgame.jpg"),
    sponsorId: "s-salon",
    persisted: true,
  },
  {
    id: "m-seongsu-photowalk",
    title: "성수 골목 사진산책 — 붉은 벽돌과 간판",
    categoryId: "photowalk",
    neighborhoodId: "seongsu",
    startsAt: at(1, "16:30"),
    place: "성수역 3번 출구",
    lat: 37.5466,
    lng: 127.0584,
    hostId: "u4",
    capacity: 8,
    participantIds: ["u4", "u1", "u7", "u3", "u8"],
    description:
      "필름이든 폰이든 상관없어요. 네 블록을 두 시간 천천히 걷습니다. 빛이 좋은 골목은 제가 알고 있습니다. 현상한 사진은 다음 주에 같이 봐요.",
    cover: asset("/images/photowalk-alley.jpg"),
    persisted: true,
  },
  {
    id: "m-pangyo-5k",
    title: "판교 아침 5K, 출근 전에",
    categoryId: "running",
    neighborhoodId: "pangyo",
    startsAt: at(1, "06:40"),
    place: "판교역 1번 출구 광장",
    lat: 37.3946,
    lng: 127.1112,
    hostId: "u8",
    capacity: 15,
    participantIds: [
      "u8",
      "u9",
      "u10",
      "u2",
      "u3",
      "u4",
      "u11",
      "u12",
      "u5",
      "u6",
      "u7",
    ],
    description:
      "출근 전 5km, 6시 40분 출발. 7시 20분이면 다들 씻고 나올 수 있는 코스입니다. 매주 화·목요일, 비 오면 쉽니다.",
    cover: asset("/images/pangyo-morning.jpg"),
    persisted: true,
  },
  {
    id: "m-yeonnam-film",
    title: "연남 노을 필름 산책 (마감)",
    categoryId: "photowalk",
    neighborhoodId: "yeonnam",
    startsAt: at(0, "17:10"),
    place: "홍대입구역 3번 출구",
    lat: 37.5572,
    lng: 126.924,
    hostId: "u4",
    capacity: 6,
    participantIds: ["u4", "u1", "u3", "u5", "u7", "u6"],
    description:
      "해가 지기 전 40분이 승부처입니다. 필름 카메라 없어도 됩니다. 이번 회차는 마감됐고, 다음 회차는 일요일에 열어요.",
    persisted: true,
  },
  {
    id: "m-jamsil-night10k",
    title: "잠실 야간 10K, 천천히 두 바퀴",
    categoryId: "running",
    neighborhoodId: "jamsil",
    startsAt: at(0, "21:00"),
    place: "잠실한강공원 야간 개장 입구",
    lat: 37.514,
    lng: 127.082,
    hostId: "u10",
    capacity: 10,
    participantIds: ["u10", "u2", "u9", "u12", "u3"],
    description:
      "밤의 한강을 두 바퀴 도는 10km입니다. 페이스는 6분 30초, 말은 적게. 반사 조끼나 밝은 색 상의를 입어주세요. 끝나고 편의점에서 아이스크림 한 개.",
    cover: asset("/images/hanriver-run.jpg"),
    persisted: true,
  },
  {
    id: "m-jamsil-sunset-photo",
    title: "한강 노을 사진산책, 삼각대 없이",
    categoryId: "photowalk",
    neighborhoodId: "jamsil",
    startsAt: at(1, "17:20"),
    place: "잠실대교 남단 산책로",
    lat: 37.5215,
    lng: 127.0745,
    hostId: "u4",
    capacity: 6,
    participantIds: ["u4", "u11", "u1", "u7"],
    description:
      "해 지기 40분 전에 모여 노을이 끝날 때까지 걷습니다. 삼각대 없이, 손으로. 폰 카메라도 환영이고 마지막에 서로 한 장씩 찍어줍니다.",
    cover: asset("/images/seongsu-dusk.jpg"),
    persisted: true,
  },
  {
    id: "m-pangyo-lunch-boards",
    title: "판교 점심 보드게임 40분",
    categoryId: "boardgame",
    neighborhoodId: "pangyo",
    startsAt: at(1, "12:10"),
    place: "판교 테크원 1층 라운지",
    lat: 37.4021,
    lng: 127.1015,
    hostId: "u12",
    capacity: 6,
    participantIds: ["u12", "u9", "u10"],
    description:
      "점심시간 40분, 한 판만. 룰 5분 설명하고 바로 시작합니다. 늦어도 12시 55분에는 정리해요. 샌드위치 가져오셔도 됩니다.",
    persisted: true,
  },
  {
    id: "m-pangyo-cafe-work",
    title: "판교 카페 작업 오후, 각자 일하기",
    categoryId: "cafe",
    neighborhoodId: "pangyo",
    startsAt: at(0, "15:00"),
    place: "판교 브루웍스 2층 (제휴)",
    lat: 37.3955,
    lng: 127.112,
    hostId: "u7",
    capacity: 6,
    participantIds: ["u7", "u11", "u3", "u8"],
    description:
      "두 시간 집중, 20분 수다. 각자 노트북이나 스케치북을 들고 오세요. 참여자는 평일 오전 커피 1+1 쿠폰을 받습니다.",
    sponsorId: "s-brew",
    persisted: true,
  },
  {
    id: "m-seongsu-brunch",
    title: "성수 브런치에서 이력서 같이 봐요",
    categoryId: "cafe",
    neighborhoodId: "seongsu",
    startsAt: at(2, "10:30"),
    place: "성수동 브런치 카페 (제휴)",
    lat: 37.548,
    lng: 127.049,
    hostId: "u1",
    capacity: 5,
    participantIds: ["u7", "u1"],
    description:
      "이직 준비하는 사람끼리 서로의 이력서를 읽어줍니다. 20분씩 돌아가며 피드백. 커피는 각자.",
    persisted: true,
  },
];

/* ------------------------------------------------------------------ *
 * Proof-shot posts
 * ------------------------------------------------------------------ */

export const POSTS: ProofPost[] = [
  {
    id: "p-seongsu-dusk",
    title: "해 질 무렵 성수, 사람들이 제일 많이 웃는 시간",
    body:
      "여섯 시가 넘으면 붉은 벽돌 벽에 불이 하나씩 켜진다. 낮에 봤던 창고들이 저녁엔 다 다른 표정이 된다. 오늘은 카메라를 들고 네 블록을 걸었고, 그중 세 장면이 마음에 남았다.",
    categoryId: "photowalk",
    neighborhoodId: "seongsu",
    authorId: "u1",
    image: asset("/images/seongsu-dusk.jpg"),
    createdAt: hoursAgo(2),
    baseLikeCount: 173,
  },
  {
    id: "p-brick-4pm",
    title: "붉은 벽돌 사이로 오후 네 시",
    body:
      "빛이 가장 낮게 들어오는 골목을 찾았다. 골목 끝 빨래가 걸린 집, 문 앞의 화분, 세워둔 자전거 한 대. 사진산책은 결국 '천천히 걷는 연습'인 것 같다.",
    categoryId: "photowalk",
    neighborhoodId: "seongsu",
    authorId: "u4",
    image: asset("/images/photowalk-alley.jpg"),
    createdAt: hoursAgo(5),
    meetupId: "m-seongsu-photowalk",
    baseLikeCount: 128,
  },
  {
    id: "p-6k-water",
    title: "6K를 뛰고 나서 마시는 물맛",
    body:
      "기록은 어제보다 12초 느렸지만, 오늘은 넷이 같이 들어왔다. 말 없이 뛰다가 마지막 400미터에서 다 같이 웃었다. 다음 주에도 같은 시간에 나간다.",
    categoryId: "running",
    neighborhoodId: "jamsil",
    authorId: "u2",
    image: asset("/images/hanriver-run.jpg"),
    createdAt: hoursAgo(8),
    meetupId: "m-hanriver-6k",
    baseLikeCount: 214,
  },
  {
    id: "p-kimbap-ridge",
    title: "능선 위에서 먹은 김밥은 왜 더 맛있을까",
    body:
      "네 시간을 올라 바람이 부는 자리에 앉았다. 준비해 간 김밥이 조금 눌렸는데, 그게 제일 맛있었다. 하산길엔 발목이 아팠지만 마음은 가벼웠다.",
    categoryId: "hiking",
    neighborhoodId: "yeonnam",
    authorId: "u6",
    image: asset("/images/bukhansan-hike.jpg"),
    createdAt: hoursAgo(26),
    meetupId: "m-bukhansan-ridge",
    baseLikeCount: 96,
  },
  {
    id: "p-first-win",
    title: "처음 온 사람이 이기는 게임이 제일 재밌다",
    body:
      "룰 설명 다섯 분, 첫 판은 일부러 살짝 봐준다. 그런데 오늘 온 분이 마지막에 진짜로 이겨버렸다. 테이블 위에 웃음이 남는 밤이었다.",
    categoryId: "boardgame",
    neighborhoodId: "yeonnam",
    authorId: "u5",
    image: asset("/images/yeonnam-boardgame.jpg"),
    createdAt: hoursAgo(31),
    meetupId: "m-yeonnam-boards",
    baseLikeCount: 61,
  },
  {
    id: "p-window-seat",
    title: "오늘의 작업 테이블: 창가 두 번째 자리",
    body:
      "오후 두 시, 콘센트 가까운 자리는 늘 누군가의 자리다. 오늘은 세 명이 각자 노트북을 열고 네 시간을 앉아 있었다. 서로 말은 없었지만 같은 속도로 집중하는 기분.",
    categoryId: "cafe",
    neighborhoodId: "seongsu",
    authorId: "u3",
    image: asset("/images/seongsu-cafe.jpg"),
    createdAt: hoursAgo(34),
    meetupId: "m-seongsu-table",
    sponsorId: "s-roastery",
    baseLikeCount: 87,
  },
  {
    id: "p-pangyo-30",
    title: "출근 전 30분, 하루가 달라진다",
    body:
      "여섯 시 사십 분의 판교는 조용하다. 공원을 한 바퀴 돌고 오면 아직 사무실 불이 다 켜지지 않은 시간. 그 30분이 하루의 성질을 바꾼다.",
    categoryId: "running",
    neighborhoodId: "pangyo",
    authorId: "u8",
    image: asset("/images/pangyo-morning.jpg"),
    createdAt: hoursAgo(48),
    meetupId: "m-pangyo-5k",
    baseLikeCount: 42,
  },
];

/* ------------------------------------------------------------------ *
 * Comments
 * ------------------------------------------------------------------ */

export const COMMENTS: PostComment[] = [
  {
    id: "c1",
    postId: "p-seongsu-dusk",
    authorId: "u4",
    body: "세 번째 사진, 어느 골목인가요?",
    createdAt: hoursAgo(1.6),
  },
  {
    id: "c2",
    postId: "p-seongsu-dusk",
    authorId: "u1",
    body: "성수이로 뒷길이에요. 해 질 때가 제일 좋습니다.",
    createdAt: hoursAgo(1.2),
  },
  {
    id: "c3",
    postId: "p-6k-water",
    authorId: "u3",
    body: "다음 주엔 저도 갈게요. 5분 페이스로 따라가도 되나요?",
    createdAt: hoursAgo(6.5),
  },
  {
    id: "c4",
    postId: "p-6k-water",
    authorId: "u2",
    body: "네, 뒤에서 두 명이 같이 뜁니다. 오시면 제가 옆에 붙어 있을게요.",
    createdAt: hoursAgo(6),
  },
  {
    id: "c5",
    postId: "p-brick-4pm",
    authorId: "u7",
    body: "빨래 사진 좋네요. 이 골목 다음엔 저도 같이 걸어요.",
    createdAt: hoursAgo(4.4),
  },
];

/* ------------------------------------------------------------------ *
 * Local partner pins (monetization surface #1)
 * ------------------------------------------------------------------ */

export const SPONSOR_PINS: SponsorPin[] = [
  {
    id: "s-roastery",
    name: "성수 로스터리",
    neighborhoodId: "seongsu",
    categoryLabel: "카페",
    benefit: "아메리카노 20% 할인",
    detail:
      "번개 참여자 전용입니다. 주문할 때 쿠폰 코드를 보여주세요. 창가 테이블 4인석은 크루로그 참여자에게 우선 배정됩니다.",
    code: "CREW-SS20",
    expiresAt: "2026-12-31",
    lat: 37.5426,
    lng: 127.0578,
  },
  {
    id: "s-salon",
    name: "연남 보드게임 살롱",
    neighborhoodId: "yeonnam",
    categoryLabel: "보드게임",
    benefit: "1시간 무료 + 음료 1잔",
    detail:
      "평일 18시 이전, 4인 이상 참여자에게 1시간을 무료로 드립니다. 게임 마스터가 첫 판을 설명해드려요.",
    code: "CREW-YN60",
    expiresAt: "2026-12-15",
    lat: 37.5652,
    lng: 126.9220,
  },
  {
    id: "s-runner",
    name: "잠실 러닝 스토어",
    neighborhoodId: "jamsil",
    categoryLabel: "러닝",
    benefit: "러닝화·양말 15% 할인",
    detail:
      "한강 러닝 참여 인증샷을 보여주시면 러닝화와 양말을 15% 할인해 드립니다. 발 측정 서비스 포함.",
    code: "CREW-JS15",
    expiresAt: "2026-12-31",
    lat: 37.5134,
    lng: 127.1012,
  },
  {
    id: "s-brew",
    name: "판교 브루웍스",
    neighborhoodId: "pangyo",
    categoryLabel: "카페",
    benefit: "평일 오전 커피 1+1",
    detail:
      "아침 러닝 참여자에게 평일 오전 7시~9시 커피 1+1. 테이크아웃도 됩니다.",
    code: "CREW-PG11",
    expiresAt: "2026-11-30",
    lat: 37.3940,
    lng: 127.1148,
  },
];

export const sponsorOf = (id: string): SponsorPin | undefined =>
  SPONSOR_PINS.find((s) => s.id === id);

/* ------------------------------------------------------------------ *
 * Feed composition — proof-shots and open meetups alternate like a
 * magazine's mix of stories and listings.
 * ------------------------------------------------------------------ */

export const FEED: FeedItem[] = [
  { id: "f1", kind: "post", postId: "p-seongsu-dusk", createdAt: hoursAgo(2) },
  { id: "f12", kind: "meetup", meetupId: "m-jamsil-night10k", createdAt: hoursAgo(2.2) },
  { id: "f2", kind: "meetup", meetupId: "m-hanriver-6k", createdAt: hoursAgo(2.4) },
  { id: "f3", kind: "post", postId: "p-brick-4pm", createdAt: hoursAgo(5) },
  { id: "f13", kind: "meetup", meetupId: "m-pangyo-cafe-work", createdAt: hoursAgo(6) },
  { id: "f4", kind: "post", postId: "p-6k-water", createdAt: hoursAgo(8) },
  { id: "f5", kind: "meetup", meetupId: "m-yeonnam-boards", createdAt: hoursAgo(9) },
  { id: "f6", kind: "post", postId: "p-window-seat", createdAt: hoursAgo(34) },
  { id: "f14", kind: "meetup", meetupId: "m-jamsil-sunset-photo", createdAt: hoursAgo(12) },
  { id: "f7", kind: "post", postId: "p-kimbap-ridge", createdAt: hoursAgo(26) },
  { id: "f8", kind: "meetup", meetupId: "m-seongsu-photowalk", createdAt: hoursAgo(28) },
  { id: "f9", kind: "post", postId: "p-first-win", createdAt: hoursAgo(31) },
  { id: "f15", kind: "meetup", meetupId: "m-pangyo-lunch-boards", createdAt: hoursAgo(36) },
  { id: "f10", kind: "meetup", meetupId: "m-pangyo-5k", createdAt: hoursAgo(40) },
  { id: "f16", kind: "meetup", meetupId: "m-seongsu-brunch", createdAt: hoursAgo(44) },
  { id: "f11", kind: "post", postId: "p-pangyo-30", createdAt: hoursAgo(48) },
];

/* ------------------------------------------------------------------ *
 * Cover options offered in the proof-shot composer
 * ------------------------------------------------------------------ */

export const COVER_OPTIONS = [
  { src: asset("/images/seongsu-dusk.jpg"), label: "성수의 저녁" },
  { src: asset("/images/seongsu-cafe.jpg"), label: "카페 테이블" },
  { src: asset("/images/hanriver-run.jpg"), label: "한강 러닝" },
  { src: asset("/images/bukhansan-hike.jpg"), label: "능선" },
  { src: asset("/images/yeonnam-boardgame.jpg"), label: "보드게임" },
  { src: asset("/images/photowalk-alley.jpg"), label: "골목" },
  { src: asset("/images/pangyo-morning.jpg"), label: "판교 아침" },
];

/** default cover per category, so a meetup created in the app never looks empty */
export const CATEGORY_COVERS: Record<Category["id"], string> = {
  running: asset("/images/hanriver-run.jpg"),
  cafe: asset("/images/seongsu-cafe.jpg"),
  hiking: asset("/images/bukhansan-hike.jpg"),
  boardgame: asset("/images/yeonnam-boardgame.jpg"),
  photowalk: asset("/images/photowalk-alley.jpg"),
};

export const BOOST_PRICE = 2900;
export const BOOST_HOURS = 24;
export const PRO_PRICE = 19000;
