# 크루로그 · CREWLOG

**동네에서, 오늘 바로.**
성수동·연남동·잠실·한강·판교의 번개 모임과 인증샷을 잇는 하이퍼로컬 커뮤니티 앱입니다.
모바일에서 네이티브 앱처럼 동작하고, 데스크톱에서는 앱 셸로 자연스럽게 넓어집니다.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15.5-14161F?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-14161F?style=flat-square&logo=react&logoColor=white" />
  <img alt="Ant Design" src="https://img.shields.io/badge/Ant%20Design-5.29-4F63FF?style=flat-square&logo=antdesign&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-4-0F9D9D?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Leaflet" src="https://img.shields.io/badge/Leaflet-1.9-2E9E6B?style=flat-square&logo=leaflet&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-6-3A3F51?style=flat-square&logo=prisma&logoColor=white" />
</p>

| 홈 | 지도 |
| --- | --- |
| ![모바일 홈](docs/screenshots/01-mobile-home.jpg) | ![모바일 지도](docs/screenshots/02-mobile-map.jpg) |

| 만들기 | 데스크톱 |
| --- | --- |
| ![만들기](docs/screenshots/03-mobile-create.jpg) | ![데스크톱](docs/screenshots/04-desktop-responsive.jpg) |

---

## 한눈에

| | |
| --- | --- |
| **한 줄 정의** | 오늘 내 동네에서 열린 번개를 지도에서 찾고, 참여하고, 다녀와서 인증샷을 남기는 앱 |
| **앱 구조** | 하단 탭바 5칸 — `홈` · `지도` · 중앙 `+` · `알림(채팅)` · `프로필` |
| **핵심 화면** | 홈 피드 · 실지도(Leaflet) · 작성 시트 · 번개 상세 · 프로필 |
| **수익 모델** | 번개 부스트(2,900원/24h) · 호스트 Pro(19,000원/월) · 동네 제휴 쿠폰 (모두 데모 결제) |
| **스택** | Next.js 15 App Router · TypeScript · Ant Design 5 · Tailwind CSS v4 · Leaflet 1.9 · Prisma 6 |
| **데이터** | 세션 메모리 시드로 즉시 실행, `prisma/schema.prisma`로 PostgreSQL 전환 가능 |

---

## 화면

| | |
| --- | --- |
| ![번개 상세](docs/screenshots/05-mobile-meetup.jpg) | ![부스트](docs/screenshots/07-mobile-boost.jpg) |
| **번개 상세** — 히어로 이미지 위로 올라오는 시트, 실지도 미리보기, 하단 고정 참여 바 | **부스트** — 예상 도달·노출 시간·금액, 데모 결제 안내 |
| ![쿠폰](docs/screenshots/08-mobile-map-coupon.jpg) | ![채팅](docs/screenshots/10-mobile-chat.jpg) |
| **제휴 쿠폰** — 지도 배지 핀 → 쿠폰 코드 시트 | **채팅** — 크루별 대화, 보낸 메시지는 세션에만 저장 |
| ![프로필](docs/screenshots/06-mobile-profile.jpg) | ![동네 선택](docs/screenshots/11-mobile-neighborhood.jpg) |
| **프로필** — 참여·내가 연 번개·다음에·인증샷, 쿠폰 보관함, 부스트 내역 | **동네 선택** — 동네별 번개 수와 함께 고르는 시트 |

데스크톱은 좌측 슬림 레일 + 중앙 피드 + 우측 동네 지도/쿠폰 패널, 지도 탭은 목록 패널 + 넓은 지도로 갈라집니다.

![데스크톱 지도](docs/screenshots/09-desktop-map.jpg)

---

## 주요 기능

### 1. 모바일 앱 셸
- `100dvh` 풀스크린, `env(safe-area-inset-bottom)`을 반영한 **플로팅 탭바**(반투명 + 블러)와 살짝 떠 있는 중앙 `+` 버튼.
- 탭 전환 시 스크롤 위치를 초기화하고 `/#map`, `/#profile` 해시로도 열립니다.
- 데스크톱(≥768px)에서는 탭바 대신 **좌측 레일**(아이콘 86px → 라벨 포함 236px)로 바뀌고, 콘텐츠는 `600px 피드 + 330px 사이드` 2단으로 정렬됩니다.
- 768–1023px에서는 피드가 600px로 중앙 정렬되어 넓은 화면에서 늘어지지 않습니다.

### 2. 홈 피드
- 인사말 + 오늘 날짜, 필터 칩(`전체` · `예정된 번개` · `인증샷` · `동네`).
- 번개 카드: 호스트·시간·카테고리 → 16:10 큰 사진 → 제목·장소 → 참여자 아바타 스택 → `다음에` / `참여하기` 2분할 버튼.
- 인증샷 카드: 작성자·시간·카테고리 → 4:3 사진 → 제목·본문 → 좋아요·댓글·저장.
- 부스트 중인 번개는 파란 `부스트` 배지와 ⚡ 핀으로 강조되고, 피드 상단으로 정렬됩니다.
- 참여/다음에/좋아요/저장은 모두 **낙관적 UI**로 즉시 반영됩니다.

### 3. 지도 (Leaflet + 실제 서울 지도)
- API 키 없이 동작하는 **Leaflet 1.9** + OpenStreetMap France(HOT) 타일. 지도 타일은 앱 팔레트에 맞게 약간 채도를 낮춰 그립니다.
- 좌상단 **동네 선택 알약**(성수동 ▾), 우상단 **내 위치 · 필터** 원형 버튼.
- 카테고리 색 원형 핀(러닝·카페·등산·보드게임·사진산책)과 현재 위치 파란 점.
- 핀을 누르면 지도 위에 **플로팅 모임 카드**(사진·시간·장소·잔여 자리·`다음에`/`참여하기`)가 뜹니다.
- 하단에는 가로 스와이프 **모임 카드 스트립**(부스트·임박 순).
- 제휴 가게는 **흰 배지 핀**으로 표시되고, 누르면 쿠폰 바텀시트가 열립니다.
- 동네를 바꾸면 지도가 해당 동네로 부드럽게 이동하고 목록·핀이 함께 갱신됩니다.

### 4. 만들기 (`+`)
- 바텀시트에서 `번개 열기` / `인증샷 올리기`를 고릅니다.
- 번개: 카테고리 칩 · 이름 · 오늘/내일/모레 + 시간 칩 · 동네 · 장소 · 정원 스테퍼 · 소개 · 부스트(2,900원) 토글.
- 인증샷: 제목 · 카테고리 · 동네 · 샘플 사진 · 본문 · 연결할 번개.
- 등록하면 **지도에 핀이 서고 피드 맨 위에 카드가 생기며**, 번개 상세가 바로 열립니다.

### 5. 알림 · 채팅
- 알림: 부스트 시작, 쿠폰 보관, 참여 소식, 댓글·초대 등. 스토어의 실제 상태(부스트·쿠폰·참여)에서 동적으로 만들어집니다.
- 채팅: 크루 3개 + 크루로그 안내. 스레드는 전체 높이 레이아웃으로 열리고, 보낸 메시지는 세션에 남습니다.

### 6. 수익화 (모두 데모 결제)
| 상품 | 가격 | 동작 |
| --- | --- | --- |
| 번개 부스트 | 2,900원 / 24시간 | 예상 도달·노출 위치 안내 → 데모 결제 → 성공 화면 → 피드·지도 상단 노출 |
| 호스트 Pro | 19,000원 / 월 | 혜택 4종 안내, `Pro 시작하기`는 데모 안내 토스트 |
| 동네 제휴 쿠폰 | 무료 | 배지 핀 → 쿠폰 코드 복사 · 프로필 보관함에 저장 |

> 결제·쿠폰은 모두 UI 시뮬레이션이며 카드 정보는 어디로도 전송되지 않습니다.

---

## 디자인 시스템

화이트 + 블루, 얇은 경계와 부드러운 그림자. 종이색·명조체·버밀리언을 쓰던 이전 매거진 톤은 모두 걷어냈습니다.

### 토큰 (`src/app/globals.css` · `src/lib/theme.ts`)
| 토큰 | 값 | 쓰임 |
| --- | --- | --- |
| `canvas` | `#F6F7FB` | 앱 배경 |
| `surface` | `#FFFFFF` | 카드·시트 |
| `blue` | `#4F63FF` (hover `#3D50E8`) | 주요 버튼·선택 상태 |
| `charcoal` | `#14161F` | 활성 칩·중앙 `+` 버튼·본문 |
| `line` | `#ECEEF3` | 1px 경계 |
| `shadow-card` | `0 6px 24px rgba(15,23,42,0.06)` | 카드 |
| `radius-card` | `20px` (antd `borderRadius` 16) | 카드·시트·컨트롤 |
| 폰트 | **Pretendard Variable** (CDN) → `Apple SD Gothic Neo` fallback | 전체 |

- 칩·버튼은 모두 알약(`999px`), 카드 안 사진은 `15px` 라운드로 이중 리듬을 만듭니다.
- 카테고리는 5색(러닝 `#4F63FF`, 카페 `#C8863C`, 등산 `#2E9E6B`, 보드게임 `#8B6BD9`, 사진산책 `#0F9D9D`)만 쓰고, 나머지는 무채색입니다.
- `prefers-reduced-motion`에서 애니메이션을 끕니다.

### Ant Design × Tailwind v4
Ant Design 5는 `:where()`로 명시도를 낮추기 때문에 Tailwind preflight와 부딪히기 쉽습니다. **CSS 레이어 순서**로 해결했습니다.

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

- `ConfigProvider` 토큰(`colorPrimary #4F63FF`, `borderRadius 14`, `controlHeight 40`)을 새 팔레트에 맞추고, `Drawer`·`Modal`·`Input`·`Segmented`·`Progress`·`App(message)`을 앱 톤에 맞게 다듬었습니다.
- 시트는 모두 `Drawer placement="bottom"` + `app-sheet` 클래스로 모바일에서는 바텀시트, 데스크톱에서는 520px 중앙 시트로 보입니다.

---

## 구조

```
src/
├─ app/
│  ├─ layout.tsx              Pretendard CDN · 뷰포트(viewport-fit) · 메타데이터
│  ├─ providers.tsx           ConfigProvider + App + 전역 시트
│  ├─ page.tsx                앱 셸
│  ├─ globals.css             레이어 순서 · 토큰 · 지도/시트/antd 보정
│  └─ meetups/[id]/page.tsx   번개 상세 (SSG, 12개 경로)
├─ components/
│  ├─ app-shell.tsx           탭 상태 · 모바일 플로팅 탭바 · 데스크톱 레일
│  ├─ ui.tsx                  아바타 · 칩 · 아이콘 버튼 · 섹션 헤더
│  ├─ icons.tsx               북마크/번개 SVG
│  ├─ cards.tsx               번개 카드 · 인증샷 카드 · 리스트 행
│  ├─ meetup-detail.tsx       상세 본문 + 드로어 + 라우트 페이지
│  ├─ overlays.tsx            시트 모음
│  ├─ screens/
│  │  ├─ home.tsx             인사말 · 필터 · 피드 · 데스크톱 사이드
│  │  ├─ map.tsx              지도 화면(모바일 오버레이 / 데스크톱 2단)
│  │  ├─ activity.tsx         알림 · 채팅
│  │  └─ profile.tsx          프로필 · 보관함 · 부스트 내역
│  ├─ sheets/
│  │  ├─ composer.tsx         만들기 메뉴 · 작성 폼
│  │  ├─ offers.tsx           부스트 · 쿠폰 · Pro
│  │  └─ neighborhood.tsx     동네 선택
│  └─ map/marker-map.tsx      Leaflet 마운트 · 커스텀 핀 · 위치 점
└─ lib/
   ├─ types.ts                도메인 타입 (좌표 포함)
   ├─ seed.ts                 12개 번개 · 7개 인증샷 · 4개 제휴 · 12명 크루원
   ├─ store.tsx               클라이언트 스토어 (필터·낙관적 상태·작성)
   ├─ theme.ts                Ant Design 토큰
   └─ format.ts               날짜·금액·진행률 포맷
prisma/schema.prisma          PostgreSQL 스키마
public/images/                생성한 편집 사진 7장
```

### 상태와 데이터
- `CrewlogProvider`가 시드 데이터를 초기값으로 잡고, 참여·다음에·좋아요·저장·부스트·쿠폰·작성을 한 곳에서 처리합니다.
- 파생 값(필터된 피드, 남은 자리, 부스트 여부)은 `useMemo`로 계산하고, 액션은 낙관적으로 상태를 먼저 바꿉니다.
- 새로 만든 번개·인증샷은 이 브라우저 세션에만 존재합니다(새로고침하면 시드로 돌아갑니다). `prisma/schema.prisma` 모델과 1:1로 대응되도록 설계되어 데이터 레이어만 교체하면 영속화할 수 있습니다.
- 지도 좌표는 앱 타입 `Meetup.lat/lng` · `SponsorPin.lat/lng`에 있고, Prisma 모델에서는 `latitude` · `longitude`입니다. 새 번개는 선택한 동네 중심에서 ±300m 안쪽에 배치됩니다.

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
- `Meetup`은 `@@index([neighborhood, startsAt])`로 지도/피드 정렬을, `BoostOrder`는 `@@index([meetupId, endsAt])`로 노출 만료 판정을 받습니다.
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
- 헤드리스 Chrome(390×844)에서 아래 흐름을 실제 클릭으로 확인했고 **콘솔 오류 0건**입니다.
  - 인증샷 필터 → 인증샷 카드만 표시
  - 참여 버튼 토글(`참여 중` ↔ `참여하기`)
  - 지도 타일 로드·핀 12개, 핀 클릭 → 플로팅 카드, 동네 변경, 제휴 핀 → 쿠폰 시트
  - `+` → 번개 작성 → 등록 → 상세 열림 → 부스트 데모 결제 → 피드 최상단·지도 핀(13개) 반영
  - 채팅 메시지 전송
- 데스크톱(1440×900)·태블릿(834×1000) 레이아웃도 캡처로 확인했습니다.

### 지도 타일
- 타일: `https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png` (API 키 불필요, © OpenStreetMap contributors · OSM France)
- 운영 환경에서는 사용량 정책에 맞는 타일 제공자(예: 자체 타일 서버, 유료 키)로 교체하는 것을 권장합니다. `src/components/map/marker-map.tsx`의 `TILES` 상수만 바꾸면 됩니다.

---

## 데모 고지

- 결제·쿠폰·구독은 모두 **UI 시뮬레이션**이며 실제 결제, 예약, 할인이 발생하지 않습니다.
- 사진은 AI로 생성한 편집 이미지(7장)이며 실제 인물·매장과 무관합니다. 매장명과 쿠폰 코드도 예시입니다.
- 사용자가 만든 데이터는 서버로 전송되지 않고 브라우저 세션에만 남습니다.

## 라이선스

MIT. 사진은 이 프로젝트를 위해 생성되었습니다.
