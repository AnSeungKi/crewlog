# 크루로그 · CREWLOG

**동네에서, 오늘 바로.**
성수동·연남동·잠실·한강·판교의 번개 모임과 인증샷을 한 장면처럼 엮은 **하이퍼로컬 크루 매거진**입니다.
당근의 동네성과 인스타그램의 기록성을 Ant Design 위에서 다시 조판했습니다.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15.5-141413?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-141413?style=flat-square&logo=react&logoColor=white" />
  <img alt="Ant Design" src="https://img.shields.io/badge/Ant%20Design-5.29-E84A27?style=flat-square&logo=antdesign&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-4-1F5E4B?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-6-3D3A36?style=flat-square&logo=prisma&logoColor=white" />
</p>

![히어로](docs/screenshots/01-hero.jpg)

---

## 한눈에

| | |
| --- | --- |
| **한 줄 정의** | 오늘 내 동네에서 열린 번개를 지도에서 찾고, 다녀와서 인증샷을 남기는 커뮤니티 |
| **핵심 화면** | 동네 지도(핀) · 인증샷 피드 · 번개 상세 · 만들기 드로어 |
| **수익 모델** | 번개 상단 부스트(2,900원/24h) · 크루 호스트 Pro(19,000원/월) · 로컬 제휴 핀·쿠폰 |
| **스택** | Next.js 15 App Router · TypeScript · Ant Design 5 · Tailwind CSS v4 · Prisma 6 |
| **데이터** | 세션 메모리 시드 데이터로 즉시 실행, `prisma/schema.prisma`로 PostgreSQL 전환 가능 |

| 동네 지도 + 피드 | 부스트 결제 |
| --- | --- |
| ![지도와 피드](docs/screenshots/02-map-feed.jpg) | ![부스트](docs/screenshots/03-boost.jpg) |

| 번개 상세 페이지 | 모바일 |
| --- | --- |
| ![상세](docs/screenshots/04-meetup-page.jpg) | ![모바일](docs/screenshots/05-mobile.jpg) |

---

## 주요 기능

### 1. 동네 지도와 살아 있는 핀
- **동네 선택** — `Segmented`로 `전체 / 성수동 / 연남동 / 잠실·한강 / 판교`를 오갑니다. 각 항목에 지금 열린 번개 수가 붙습니다.
- **카테고리 필터** — `Tag.CheckableTag`로 `러닝 · 카페·작업 · 등산 · 보드게임 · 사진산책`을 걸러냅니다.
- **직접 그린 지도** — 외부 지도 SDK 없이 인라인 SVG로 그린 거리 격자입니다. 성수동의 붉은 벽돌 블록, 연남동의 경의선숲길, 잠실의 한강, 판교의 중앙공원이 각각 다른 도면으로 그려지고, 같은 시드에서 항상 같은 블록이 생성됩니다(`mulberry32`).
- **핀** — 번개 핀은 `참여/정원`을 숫자로 보여주고, 호버하면 제목과 시간이 뜹니다. 핀을 누르면 아래 요약 바에서 바로 `참여하기`를 누를 수 있습니다. 초록 `제휴` 핀은 동네 가게의 쿠폰으로 이어집니다.

### 2. 매거진형 인증샷 피드
- 첫 항목은 **가로형 리드 카드**, 이후는 2단 그리드로 흐르는 편집 레이아웃입니다(`Row` / `Col` / `Card`).
- 좋아요·북마크·참여·댓글은 모두 **낙관적 UI**: 누르는 즉시 숫자와 상태가 바뀌고 토스트로 확인해 줍니다.
- 사진이 없는 모임은 얇은 카테고리 컬러 바와 진행 게이지를 가진 **리스팅 카드**로 구분됩니다.

### 3. 만들기 (번개 · 인증샷)
- 헤더의 `번개 열기` 또는 아바타 메뉴에서 `Drawer`가 열립니다. `Tabs`로 두 가지 작성 모드를 오갑니다.
- 번개: 제목·종류·동네·일시(`DatePicker`)·정원(`InputNumber`)·장소·소개 + **상단 부스트 토글(2,900원)**
- 인증샷: 제목·본문·샘플 사진 선택·연결할 번개 선택
- 등록하면 **지도에 핀이 서고 피드 맨 위에 카드가 생기며**, 번개 상세 드로어가 자동으로 열립니다.

### 4. 수익화 플로우
| 상품 | 가격 | 동작 |
| --- | --- | --- |
| 번개 상단 부스트 | 2,900원 / 24시간 | 피드 최상단 + 지도 상단 핀, 예상 노출 시뮬레이션, 데모 결제 → 성공 화면 |
| 크루 호스트 Pro | 19,000원 / 월 | 플랜 3종 비교, 월 운영 횟수 슬라이더로 예상 비용·참여 인원 시뮬레이션 |
| 로컬 제휴 핀 · 쿠폰 | 무료(파트너 계약) | 지도의 초록 핀·쿠폰 카드 → 쿠폰 티켓(코드 복사) |

> 결제와 쿠폰은 모두 **시뮬레이션**입니다. 카드 정보는 어디로도 전송되지 않습니다.

---

## 디자인 시스템

기본 Ant Design의 파란 관리자 화면이 아니라, **따뜻한 종이와 인쇄물**의 규칙을 따릅니다.

### 테마 토큰 (`src/lib/theme.ts`)
| 토큰 | 값 | 쓰임 |
| --- | --- | --- |
| `colorBgLayout` | `#FAF8F5` | 종이 바탕 |
| `colorBgContainer` | `#FFFFFF` | 카드·패널 |
| `colorPrimary` | `#E84A27` | 시그널 버밀리언 (주요 버튼·강조) |
| `colorSuccess` | `#1F5E4B` | 포레스트 그린 (제휴·성공) |
| `colorText` | `#141413` | 잉크 |
| `colorBorderSecondary` | `#E5E0D8` | 1px 헤어라인 |
| `borderRadius` | `6` | 각진 인쇄물 느낌 |
| `fontFamily` | IBM Plex Sans KR | 본문 |
| 표제 | Gowun Batang (serif) | 제목·인용 |
| 숫자 | IBM Plex Mono + `tabular-nums` | 시간·가격·인원 |

### Ant Design × Tailwind v4 공존
Ant Design 5는 `:where()`로 명시도를 낮추기 때문에 Tailwind의 preflight와 부딪히기 쉽습니다. 이 프로젝트는 **CSS 레이어 순서**로 해결했습니다.

```css
/* src/app/globals.css */
@layer theme, base, antd, components, utilities;
@import "tailwindcss";
```

```tsx
/* src/app/layout.tsx — antd 스타일을 antd 레이어에 주입 */
<AntdRegistry layer>
  <Providers>{children}</Providers>
</AntdRegistry>
```

- `ConfigProvider` 테마 + `App`(message/modal 컨텍스트) + 한국어 로케일(`ko_KR`)은 `src/app/providers.tsx`에서 한 번만 구성합니다.
- 레이아웃·간격은 Tailwind 유틸리티로, 컴포넌트 동작은 Ant Design 컴포넌트로 나눠 씁니다.
- 종이 질감은 `body::after`의 SVG 노이즈(약 5% 불투명도)로, 그림자 대신 **1px 헤어라인**을 기본으로 씁니다.

---

## 구조

```
src/
├─ app/
│  ├─ layout.tsx            AntdRegistry · 폰트 · 메타데이터
│  ├─ providers.tsx         ConfigProvider + App + 전역 오버레이
│  ├─ page.tsx              홈 (히어로 → 필터 → 지도+피드 → 제휴 → Pro)
│  ├─ globals.css           레이어 순서 · 테마 변수 · 편집 프리미티브
│  └─ meetups/[id]/page.tsx 번개 상세 (SSG, 12개 경로)
├─ components/
│  ├─ site-header.tsx       스티키 헤더 · 계정 메뉴
│  ├─ hero.tsx              마스트헤드 · 커버 스토리 · 라이브 티커
│  ├─ filter-bar.tsx        동네 Segmented · 카테고리 태그 · 정렬
│  ├─ neighborhood-map.tsx  SVG 지도 · 핀 · 요약 바
│  ├─ feed.tsx              리드 + 2단 그리드
│  ├─ proof-card.tsx        인증샷 카드 (좋아요·저장·참여·댓글)
│  ├─ meetup-card.tsx       번개 리스팅 카드
│  ├─ composer.tsx          작성 드로어 (번개 / 인증샷)
│  ├─ meetup-detail.tsx     상세 드로어
│  ├─ boost-modal.tsx       부스트 결제 시뮬레이션
│  ├─ pro-modal.tsx         Pro 플랜 · 비용 시뮬레이터
│  └─ coupon-modal.tsx      제휴 쿠폰 티켓
└─ lib/
   ├─ types.ts              도메인 타입
   ├─ seed.ts               12개 번개 · 7개 인증샷 · 4개 제휴 · 12명 크루원
   ├─ map.ts                동네별 거리 도면(도로·공원·강)
   ├─ store.tsx             클라이언트 스토어 (필터·낙관적 상태·작성)
   ├─ theme.ts              Ant Design 토큰
   └─ format.ts             날짜·금액·진행률 포맷
prisma/schema.prisma        PostgreSQL 스키마
public/images/              생성한 편집 사진 7장 (AI 생성)
```

### 상태와 데이터
- `CrewlogProvider`가 시드 데이터를 초기값으로 잡고, 모든 상호작용을 한 곳에서 처리합니다.
- 파생 값(필터된 피드, 남은 자리, 부스트 여부)은 `useMemo`로 계산하고, 액션은 낙관적으로 상태를 먼저 바꿉니다.
- 새로 만든 번개·인증샷은 이 브라우저 세션에만 존재합니다(새로고침하면 시드로 돌아갑니다). `prisma/schema.prisma`의 모델과 1:1로 대응되도록 설계되어 있어, 데이터 레이어만 교체하면 그대로 영속화할 수 있습니다.
- 서버/클라이언트 렌더가 어긋나지 않도록 상대 시간은 마운트 이후에만 계산합니다(`time-ago.tsx`).

---

## 데이터베이스 (Prisma + PostgreSQL)

`prisma/schema.prisma`에 서비스에 필요한 모델이 모두 정의되어 있습니다.

`User` · `Meetup` · `MeetupParticipant` · `ProofPost` · `Comment` · `SponsorPin` · `CouponClaim` · `BoostOrder`

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/crewlog"
npx prisma generate
npx prisma migrate dev --name init
```

- `Neighborhood`·`Category`·`BoostStatus`는 enum으로 고정했습니다.
- `Meetup`은 `@@index([neighborhood, startsAt])`로 지도/피드 정렬을, `BoostOrder`는 `@@index([meetupId, endsAt])`로 노출 만료 판정을 받칩니다.
- 앱은 DB 없이도 실행되도록 시드 레이어를 우선 사용합니다.

---

## 시작하기

```bash
# Node.js 20.9+ (권장 22)
npm install
npm run dev      # http://localhost:3000
```

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 (정적 페이지 17개 생성) |
| `npm start` | 빌드 결과 실행 |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run prisma:generate` | Prisma 클라이언트 생성 |

### 검증
- `npx tsc --noEmit` — 오류 0
- `npm run build` — 컴파일 성공, 17개 페이지 프리렌더(`/`, `/icon.svg`, `/meetups/[id]` × 12, `/_not-found`)
- 헤드리스 브라우저로 데스크톱(1440×1000)·모바일(390×844) 렌더를 확인했고 콘솔 오류는 없습니다.

---

## 데모 고지

- 결제·쿠폰·구독은 모두 **UI 시뮬레이션**이며 실제 결제, 예약, 할인이 발생하지 않습니다.
- 사진은 AI로 생성한 편집 이미지(7장)이며 실제 인물·매장과 무관합니다. 매장명과 쿠폰 코드도 예시입니다.
- 사용자가 만든 데이터는 서버로 전송되지 않고 브라우저 세션에만 남습니다.

## 라이선스

MIT. 사진은 이 프로젝트를 위해 생성되었습니다.
