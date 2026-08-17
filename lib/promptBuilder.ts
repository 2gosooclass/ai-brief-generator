import type { Template, ImageMode, ModifyOptions, UserInputs } from "./types";

const SECTION_LABELS: Record<string, string> = {
  hero: "메인 히어로 섹션",
  about: "브랜드 소개",
  menu: "메뉴/서비스 목록",
  gallery: "갤러리",
  location: "위치·오시는 길",
  instagram: "인스타그램 피드",
  story: "브랜드 스토리",
  events: "이벤트/행사",
  contact: "문의하기",
  features: "주요 특징",
  curriculum: "커리큘럼",
  teachers: "강사 소개",
  results: "성과·합격 실적",
  schedule: "수업 시간표",
  classes: "클래스 목록",
  instructors: "강사진",
  testimonials: "수강 후기",
  pricing: "수강료·요금",
  enroll: "수강 신청",
  courses: "강좌 목록",
  demo: "무료 체험",
  faq: "자주 묻는 질문",
  cta: "행동 유도 섹션",
  works: "작업물 포트폴리오",
  process: "작업 프로세스",
  skills: "보유 스킬",
  services: "서비스 안내",
  booking: "예약·상담 신청",
  links: "소셜 링크 모음",
  "latest-content": "최신 콘텐츠",
  shop: "쇼핑/상품 링크",
  newsletter: "뉴스레터 구독",
  philosophy: "공간 철학",
  barista: "전문가 소개",
  reservations: "예약하기",
  chef: "셰프 소개",
  "course-menu": "코스 메뉴",
  reservation: "예약 폼",
  "private-room": "프라이빗 룸"
};

const PATTERN_TYPES = [
  "그리드 레이아웃 (Grid Layout - 3~4단 카드 배열)",
  "분할 화면 레이아웃 (Split Screen Layout - 50:50 비주얼과 양식/스펙 대조)",
  "비대칭 레이아웃 (Asymmetrical Layout - 70:30 시선 유도 및 CTA 배치)",
  "전체 화면 레이아웃 (Full Screen Layout - 압도적 배경 및 미니멀 타이포그래피)",
  "사이드 스크롤 레이아웃 (Side Scroll Layout - 넷플릭스 스타일 가로 롤)",
  "카드 레이아웃 (Card Layout - 콤팩트 직사각형 탐색 구조)",
  "잡지 레이아웃 (Magazine Layout - 거대 메인 비주얼과 주변 서브 배치)",
  "갤러리 레이아웃 (Gallery Layout - 텍스트 최소화 이미지 전시)"
];

export function buildPrompt({
  template,
  categoryId,
  userInputs,
  navMenus,
}: {
  template: Template;
  categoryId: string;
  imageMode?: ImageMode;
  uploadedImageUrl?: string | null;
  selectedStockImages?: string[];
  modifyOptions?: ModifyOptions;
  userInputs: UserInputs;
  logoUrl?: string | null;
  referenceScreenshotUrl?: string | null;
  navMenus?: string[];
}): string {
  const bizName = userInputs.businessName || template.name;
  const bizDesc = userInputs.description || template.tagline;

  const effectiveNavMenus = navMenus && navMenus.length > 0
    ? navMenus
    : ["MENU", "STORY", "RESERVATION", "LOCATION"];

  // 1. 메인 페이지 섹션 구조
  const mainSectionList = template.sections
    .map((s, idx) => {
      const label = SECTION_LABELS[s] ?? s;
      if (s === "hero" || idx === 0) {
        return `[섹션 ${idx + 1}: 전체 화면 레이아웃 (Full Screen Layout)]\n  - ${label}: 화면 전체를 하나의 압도적인 비주얼로 채우고 미니멀 타이포그래피만 배치하여 브랜드 감성을 각인하십시오.`;
      }
      const pattern = PATTERN_TYPES[(idx - 1) % PATTERN_TYPES.length];
      return `[섹션 ${idx + 1}: ${pattern}]\n  - ${label}: 단조로운 그리드를 탈피하여 이 구조적 패턴 가이드라인을 엄수해 주세요.`;
    })
    .join("\n\n");

  // 2. 서브페이지 및 메뉴 라우팅 목록
  const subPageList = effectiveNavMenus
    .map((menu) => `- [${menu} 서브페이지]: ${bizName}의 ${menu} 관련 독립 상세 페이지 (상단 GNB 및 링크 클릭 시 전환)`)
    .join("\n");

  const colorsText = [
    `  - 메인 컬러: ${template.colors.primary}`,
    `  - 서브 컬러: ${template.colors.secondary}`,
    `  - 포인트 컬러: ${userInputs.pickedColor || template.colors.accent}`,
    `  - 배경색: ${template.colors.bg}`,
    `  - 카드/서피스 색: ${template.colors.surface}`,
  ].join("\n");

  const fontsText = [
    `  - 제목 폰트: ${template.fonts.heading}`,
    `  - 본문 폰트: ${template.fonts.body}`,
  ].join("\n");

  const googleFlowImagePrompt = `A high-end cinematic editorial photograph of ${template.unsplashKeyword}, ${template.referenceStyle} aesthetic, sophisticated lighting and composition, 8k resolution, photorealistic, elegant atmosphere`;
  const googleFlowVideoPrompt = `Slow cinematic sweeping panning shot of ${template.unsplashKeyword}, soft natural sunlight, ${template.referenceStyle} atmosphere, 4k ultra realistic, smooth fluid camera motion, 24fps`;

  return `## 기본 프로젝트 정보
- 브랜드명: ${bizName}
- 메인 슬로건 / 태그라인: ${bizDesc}
- 디자인 컨셉: ${template.tagline}
- 레퍼런스 스타일: ${template.referenceStyle}
${userInputs.contact ? `- 고객 문의처: ${userInputs.contact}\n` : ""}
## 네비게이션 메뉴 및 서브페이지 구조 (Multi-Page Architecture)
상단 GNB 메뉴 및 독립된 서브페이지 화면으로 전환되는 전체 페이지 구성입니다:
- [메인 홈 (Home)]: 전체 레이아웃 히어로 및 핵심 요약 섹션
${subPageList}

## 메인 페이지 레이아웃 아키텍처 및 섹션 구조
아래 순서 및 구조 패턴 가이드라인을 준수하여 메인 페이지를 빌드해 주세요:
${mainSectionList}

## 컬러 팔레트
${colorsText}

## 타이포그래피 (폰트)
${fontsText}
(Google Fonts의 Noto Serif KR과 Pretendard를 기본 로드하여 사용해 주세요.)

## Google Flow 비주얼 미디어 생성 가이드
웹사이트의 히어로 배경 및 주요 섹션에 들어갈 이미지/비디오를 Google Flow에서 생성할 때 사용할 프롬프트입니다:

### 📐 권장 생성 규격
- **PC 히어로 메인 배경**: 16:9 (1920 × 1080 px)
- **에디토리얼 / 매거진 화보**: 3:4 (1200 × 1600 px)
- **모바일 풀스크린 / 스토리**: 9:16 (1080 × 1920 px)
- **제품 썸네일 / 피드**: 1:1 (1024 × 1024 px)
- **블로그 / 갤러리 카드**: 4:3 (1600 × 1200 px)

### 🎨 Google Flow 전용 프롬프트
- **Google Flow 이미지 생성 프롬프트**:
  \`\`\`text
  ${googleFlowImagePrompt}
  \`\`\`

- **Google Flow 시네마틱 비디오 생성 프롬프트 (16:9 4K)**:
  \`\`\`text
  ${googleFlowVideoPrompt}
  \`\`\`

## 기술 및 구현 요구사항
- 모바일 우선 반응형 웹사이트로 설계해 주세요.
- 메인 페이지와 각 서브페이지(${effectiveNavMenus.join(", ")}) 간의 라우팅 및 탭 전환이 독립된 컴포넌트로 매끄럽게 작동하도록 구현해 주세요.
- 각 서브페이지의 상세 텍스트 콘텐츠, 카피라이팅, 시각 에셋 구성은 업종 컨셉에 최적화하여 생성형 AI가 완성도 높게 직접 생성해 주세요.
- 버튼, 메뉴 링크, 호버 효과 등 마이크로 인터랙션을 부드럽게 구현해 주세요.
- 빠른 렌더링을 위해 이미지 지연 로딩(Lazy Loading)을 적용해 주세요.
- 완성 후 즉시 브라우저에서 검증 가능한 전체 페이지 코드를 사출해 주세요.

---
✅ 이 브리프는 Google Flow AI Prompt Engine (2GOSOO AI LAB)으로 생성되었습니다.`.trim();
}
