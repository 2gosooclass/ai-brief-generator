import type { Template, ImageMode, ModifyOptions, UserInputs } from "./types";

const CATEGORY_LABELS: Record<string, string> = {
  cafe: "카페·레스토랑",
  academy: "학원·강좌",
  personal: "개인 브랜드",
  religion: "종교·NGO",
  traditional: "전통 공방"
};

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
  philosophy: "커피 철학",
  barista: "바리스타 소개",
  reservations: "예약하기",
  chef: "셰프 소개",
  "course-menu": "코스 메뉴",
  reservation: "예약 폼",
  "private-room": "프라이빗 룸",
  "menu-board": "전체 메뉴판",
  waiting: "웨이팅 안내",
  reviews: "고객 리뷰"
};

const TEMPLATE_SECTION_PATTERNS: Record<string, Record<string, number>> = {
  "cafe-minimal": { "about": 8, "menu": 0, "gallery": 7, "location": 1, "instagram": 4 },
  "cafe-vintage": { "story": 8, "menu": 5, "events": 11, "gallery": 7, "contact": 1 },
  "cafe-modern": { "philosophy": 3, "menu": 0, "barista": 2, "reservations": 10 },
  "cafe-finedining": { "chef": 2, "course-menu": 6, "reservation": 1, "private-room": 3 },
  "cafe-casual": { "menu-board": 0, "waiting": 10, "location": 1, "reviews": 5 },
  "academy-trust": { "features": 0, "curriculum": 8, "teachers": 6, "results": 9, "schedule": 5, "contact": 1 },
  "academy-creative": { "classes": 0, "gallery": 7, "instructors": 2, "testimonials": 5, "pricing": 9, "enroll": 10 },
  "academy-online": { "features": 0, "courses": 5, "instructors": 6, "demo": 10, "pricing": 9, "faq": 10 },
  "personal-portfolio": { "works": 7, "about": 2, "skills": 0, "services": 5, "contact": 1 },
  "personal-consultant": { "about": 2, "services": 0, "results": 9, "process": 8, "booking": 1 },
  "personal-creator": { "about": 2, "latest-content": 7, "links": 0, "shop": 5, "newsletter": 1 },
  "religion-church": { "about": 2, "schedule": 0, "events": 6, "gallery": 7, "location": 1 },
  "religion-ngo": { "about": 2, "results": 9, "events": 6, "testimonials": 5, "contact": 1 },
  "religion-community": { "about": 2, "features": 0, "events": 6, "gallery": 7, "contact": 1 },
  "traditional-knots": { "about": 8, "works": 7, "classes": 0, "process": 8, "location": 1 },
  "traditional-pottery": { "philosophy": 3, "gallery": 7, "process": 8, "shop": 0, "contact": 1 }
};

const PATTERN_TYPES = [
  "그리드 레이아웃 (Grid Layout - 3~4단 카드 배열)",
  "분할 화면 레이아웃 (Split Screen Layout - 50:50 비주얼과 양식/스펙 대조)",
  "비대칭 레이아웃 (Asymmetrical Layout - 70:30 시선 유도 및 CTA 배치)",
  "전체 화면 레이아웃 (Full Screen Layout - 압도적 배경 및 미니멀 타이포그래피)",
  "사이드 스크롤 레이아웃 (Side Scroll Layout - 넷플릭스 스타일 가로 롤)",
  "카드 레이아웃 (Card Layout - 콤팩트 직사각형 탐색 구조)",
  "잡지 레이아웃 (Magazine Layout - 거대 메인 비주얼과 주변 서브 배치)",
  "갤러리 레이아웃 (Gallery Layout - 텍스트 최소화 이미지 전시)",
  "지그재그 레이아웃 (Zig-Zag Layout - Z-패턴 교차 배치)",
  "F-패턴 레이아웃 (F-Pattern Layout - 좌측 상단 흐름 중심 장문 스캔 최적화)",
  "인터랙티브 레이아웃 (Interactive Layout - 탭/슬라이더 클릭 가상 체험)",
  "애니메이션 레이아웃 (Animation Layout - 스크롤 페이드인 및 모션 그래픽)"
];

export function buildPrompt({
  template,
  categoryId,
  imageMode,
  uploadedImageUrl,
  selectedStockImages = [],
  modifyOptions,
  userInputs,
  logoUrl,
  referenceScreenshotUrl,
  navMenus,
}: {
  template: Template;
  categoryId: string;
  imageMode: ImageMode;
  uploadedImageUrl: string | null;
  selectedStockImages?: string[];
  modifyOptions: ModifyOptions;
  userInputs: UserInputs;
  logoUrl: string | null;
  referenceScreenshotUrl: string | null;
  navMenus?: string[];
}): string {
  const categoryLabel = CATEGORY_LABELS[categoryId] ?? categoryId;
  const templateId = template.id;
  
  const sectionList = template.sections
    .map((s, idx) => {
      const label = SECTION_LABELS[s] ?? s;
      if (s === "hero" || idx === 0) {
        return `[섹션 ${idx + 1}: 전체 화면 레이아웃 (Full Screen Layout)]\n  - ${label}: 화면 전체를 하나의 압도적인 비주얼로 채우고 미니멀 타이포그래피만 배치하여 브랜드 감성을 각인하십시오. 요소의 시선 흐름이 마지막에 CTA(행동 유도 버튼)로 명확히 꽂히게 유도해 주세요.`;
      }
      const patternIdx = TEMPLATE_SECTION_PATTERNS[templateId]?.[s] ?? ((idx - 1) % PATTERN_TYPES.length);
      const pattern = PATTERN_TYPES[patternIdx];
      return `[섹션 ${idx + 1}: ${pattern}]\n  - ${label}: 단조로운 그리드를 탈피하여 이 구조적 패턴 가이드라인을 엄수해 주세요.`;
    })
    .join("\n\n");

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

  // 레퍼런스 섹션 (최상단 강조)
  const referenceSection = userInputs.referenceUrl?.trim() || referenceScreenshotUrl
    ? `\n## 레퍼런스 벤치마킹 사이트\n${
        userInputs.referenceUrl?.trim()
          ? `- **벤치마킹 타겟 URL**: ${userInputs.referenceUrl.trim()}\n  (위 레퍼런스 사이트의 시각적 인터랙션, 여백 설계, 컴포넌트 계층 구조 및 프리미엄 UX/UI 스타일을 100% 벤치마킹하여 구현해 주세요.)\n`
          : ""
      }${
        referenceScreenshotUrl
          ? `- **레퍼런스 스크린샷**: 제공된 캡처 이미지(\`${referenceScreenshotUrl}\`)의 카드 배열 및 시각적 디테일을 정밀하게 반영해 주세요.\n`
          : ""
      }`
    : "";

  // 네비게이션 메뉴 섹션
  const navSection =
    navMenus && navMenus.length > 0
      ? `\n## 네비게이션 메뉴 구성\n상단 네비게이션 바(GNB)에는 다음 메뉴 항목들을 배치하고, 클릭 시 해당 섹션으로 부드럽게 스크롤(Smooth Scroll)되도록 구현해 주세요:\n${navMenus.map((m) => `- ${m}`).join("\n")}\n`
      : "";

  let imageSection = "";
  if (imageMode === "upload" && uploadedImageUrl) {
    imageSection = `\n## 이미지 에셋 구성\n- 메인 히어로 및 주요 섹션 이미지: ${uploadedImageUrl}\n(기타 섹션은 "${template.unsplashKeyword}" 무드의 Unsplash 고화질 이미지를 배치해 주세요.)`;
  } else if (imageMode === "prompt") {
    const userVisualKeyword = userInputs.imagePromptKeyword?.trim() ? `, ${userInputs.imagePromptKeyword.trim()}` : "";
    imageSection = `\n## 이미지 에셋 구성 (Google Flow Image Prompt Mode)\nGoogle Flow 전용 이미지 생성 엔진으로 생성할 예정입니다. 아래 프롬프트 규격을 지원하는 반응형 캔버스를 구성해 주세요:\n- Google Flow 이미지 프롬프트: \`A high-end cinematic editorial photograph of ${template.unsplashKeyword}${userVisualKeyword}, ${template.referenceStyle} aesthetic, 8k resolution, photorealistic\``;
  } else {
    if (selectedStockImages && selectedStockImages.length > 0) {
      const urlsText = selectedStockImages.map((url) => `- ${url}`).join("\n");
      imageSection = `\n## 이미지 에셋 구성 (선택된 스톡 이미지)\n아래 이미지 URL들을 히어로 및 주요 섹션에 우선 배치해 주세요:\n${urlsText}`;
    } else {
      imageSection = `\n## 이미지 에셋 구성\nUnsplash에서 "${template.unsplashKeyword}" 키워드의 고화질 이미지를 자동 배치해 주세요.`;
    }
  }

  const bizName = userInputs.businessName || template.name;
  const bizDesc = userInputs.description || template.tagline;

  const userVisualKeyword = userInputs.imagePromptKeyword?.trim() ? `, ${userInputs.imagePromptKeyword.trim()}` : "";
  const googleFlowImagePrompt = `A high-end cinematic editorial photograph of ${template.unsplashKeyword}${userVisualKeyword}, ${template.referenceStyle} aesthetic, sophisticated lighting and composition, 8k resolution, photorealistic, elegant atmosphere`;
  const googleFlowVideoPrompt = `Slow cinematic sweeping panning shot of ${template.unsplashKeyword}${userVisualKeyword}, soft natural sunlight, ${template.referenceStyle} atmosphere, 4k ultra realistic, smooth fluid camera motion, 24fps`;

  return `# Google Flow 전용 웹사이트 빌드 브리프 (${categoryLabel})

## 기본 프로젝트 정보
- 브랜드명: ${bizName}
- 메인 슬로건 / 태그라인: ${bizDesc}
- 디자인 컨셉: ${template.tagline}
- 레퍼런스 스타일: ${template.referenceStyle}
${userInputs.contact ? `- 고객 문의처: ${userInputs.contact}\n` : ""}${referenceSection}${navSection}
## 레이아웃 아키텍처 및 섹션 구조
아래 순서 및 구조 패턴 가이드라인을 준수하여 각 섹션을 빌드해 주세요:
${sectionList}

## 컬러 팔레트
${colorsText}

## 타이포그래피 (폰트)
${fontsText}
(Google Fonts의 Noto Serif KR과 Pretendard를 기본 로드하여 사용해 주세요.)
${imageSection}

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
- 버튼, 메뉴 링크, 호버 효과 등 마이크로 인터랙션을 부드럽게 구현해 주세요.
${
  template.layoutType === "dynamic"
    ? "- **다이내믹 인터랙션**: Framer Motion을 활용한 패럴랙스 스크롤, 3D 카드 틸트, 무한 롤링 티커 바를 적용해 주세요.\n"
    : ""
}- 빠른 렌더링을 위해 이미지 지연 로딩(Lazy Loading)을 적용해 주세요.
- 완성 후 즉시 브라우저에서 검증 가능한 전체 페이지 코드를 사출해 주세요.

---
✅ 이 브리프는 Google Flow AI Prompt Engine (2GOSOO AI LAB)으로 생성되었습니다.`.trim();
}
