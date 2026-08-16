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

// 🌐 템플릿별로 각 섹션에 어울리는 12대 레이아웃 구조 패턴 고유 매핑 (획일화 탈피 마스터 테이블)
const TEMPLATE_SECTION_PATTERNS: Record<string, Record<string, number>> = {
  "cafe-minimal": {
    "about": 8, "menu": 0, "gallery": 7, "location": 1, "instagram": 4
  },
  "cafe-vintage": {
    "story": 8, "menu": 5, "events": 11, "gallery": 7, "contact": 1
  },
  "cafe-modern": {
    "philosophy": 3, "menu": 0, "barista": 2, "reservations": 10
  },
  "cafe-finedining": {
    "chef": 2, "course-menu": 6, "reservation": 1, "private-room": 3
  },
  "cafe-casual": {
    "menu-board": 0, "waiting": 10, "location": 1, "reviews": 5
  },
  "academy-trust": {
    "features": 0, "curriculum": 8, "teachers": 6, "results": 9, "schedule": 5, "contact": 1
  },
  "academy-creative": {
    "classes": 0, "gallery": 7, "instructors": 2, "testimonials": 5, "pricing": 9, "enroll": 10
  },
  "academy-online": {
    "features": 0, "courses": 5, "demo": 10, "pricing": 9, "faq": 8, "cta": 11
  },
  "personal-portfolio": {
    "about": 8, "works": 7, "process": 0, "skills": 5, "contact": 1
  },
  "personal-consultant": {
    "about": 8, "services": 0, "results": 9, "testimonials": 5, "booking": 10
  },
  "personal-creator": {
    "links": 5, "latest-content": 4, "shop": 0, "about": 8, "newsletter": 1
  },
  "religion-church": {
    "about": 8, "events": 11, "gallery": 7, "location": 1, "contact": 0
  },
  "religion-ngo": {
    "story": 8, "events": 11, "gallery": 7, "contact": 1
  },
  "religion-community": {
    "about": 8, "events": 11, "gallery": 7, "contact": 1
  },
  "traditional-knots": {
    "about": 8, "classes": 0, "gallery": 7, "location": 1, "contact": 5
  },
  "traditional-pottery": {
    "philosophy": 3, "courses": 0, "gallery": 7, "location": 1, "contact": 5
  }
};

const PATTERN_TYPES = [
  "그리드 레이아웃 (Grid Layout - 모듈형 그리드 및 단일 열 그리드 활용)",
  "분할 화면 레이아웃 (Split Screen Layout - 50:50 비주얼과 양식/스펙 대조)",
  "비대칭 레이아웃 (Asymmetrical Layout - 70:30 시선 유도 및 CTA 배치)",
  "전체 화면 레이아웃 (Full Screen Layout - 압도적 배경 및 미니멀 타이포그래피)",
  "사이드 스크롤 레이아웃 (Side Scroll Layout - 넷플릭스 스타일 가로 롤)",
  "카드 레이아웃 (Card Layout - 콤팩트 직사각형 탐색 구조 ※ 남발 금지)",
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
        return `[섹션 ${idx + 1} 구조 패턴 유형: 전체 화면 레이아웃 (Full Screen Layout)]\n  - ${label}: 화면 전체를 하나의 압도적인 비주얼로 채우고 미니멀 타이포그래피만 배치하여 브랜드 감성을 각인하십시오. 요소의 시선 흐름이 마지막에 CTA(행동 유도 버튼)로 명확히 꽂히게 유도해 주세요.`;
      }
      
      const patternIdx = TEMPLATE_SECTION_PATTERNS[templateId]?.[s] ?? ((idx - 1) % PATTERN_TYPES.length);
      const pattern = PATTERN_TYPES[patternIdx];
      
      return `[섹션 ${idx + 1} 구조 패턴 유형: ${pattern}]\n  - ${label}: 초보자 웹사이트처럼 똑같은 [상단 이미지 + 하단 텍스트] 그리드 레이아웃이 절대 남발되지 않도록 이 구조적 패턴 가이드라인을 엄수해 주세요. 좌우 비대칭 배치나 사이드 스크롤, 또는 지그재그 Z-패턴의 흐름을 사용하여 시각적 강약을 줍니다.`;
    })
    .join("\n\n");

  const colorsText = [
    `  - 메인 컬러: ${template.colors.primary}`,
    `  - 서브 컬러: ${template.colors.secondary}`,
    `  - 포인트 컬러: ${template.colors.accent}`,
    `  - 배경색: ${template.colors.bg}`,
    `  - 카드/서피스 색: ${template.colors.surface}`,
  ].join("\n");

  const fontsText = [
    `  - 제목 폰트: ${template.fonts.heading}`,
    `  - 본문 폰트: ${template.fonts.body}`,
  ].join("\n");

  let imageSection = "";
  if (imageMode === "upload" && uploadedImageUrl) {
    imageSection = `
## 이미지 처리
제가 제공하는 아래 이미지 URL을 히어로 섹션과 갤러리에 사용해 주세요:
- ${uploadedImageUrl}
(다른 섹션에는 위와 유사한 분위기의 Unsplash 이미지를 자동 배치해 주세요.)`;
  } else if (imageMode === "upload" && !uploadedImageUrl) {
    imageSection = `
## 이미지 처리
저는 직접 이미지를 제공할 예정입니다. 히어로와 갤러리 섹션은 [이미지 URL을 여기에 넣어주세요] 형태로 플레이스홀더를 남겨두고, 나머지는 Unsplash에서 "${template.unsplashKeyword}" 키워드로 어울리는 이미지를 찾아 사용해 주세요.`;
  } else if (imageMode === "prompt") {
    const userVisualKeyword = userInputs.imagePromptKeyword?.trim() ? `, ${userInputs.imagePromptKeyword.trim()}` : "";
    imageSection = `
## 이미지 처리 (AI 프롬프트 생성 모드)
제가 AI 생성 툴(Midjourney/DALL-E)로 직접 이미지를 생성하여 배치할 예정입니다. 히어로 및 주요 섹션에는 아래 AI 생성 프롬프트로 생성된 결과물이나 고해상도 비주얼이 최적의 비율로 담길 수 있도록 이미지 캔버스와 3D/글래스모피즘 프레임을 설계해 주세요:
- 미드저니/DALL-E 추천 프롬프트: \`A high-end cinematic editorial photograph of ${template.unsplashKeyword}${userVisualKeyword}, ${template.referenceStyle} aesthetic, 8k resolution --ar 16:9 --v 6.0\`
(그 외 다른 보조 섹션에는 "${template.unsplashKeyword}" 키워드로 분위기가 조화로운 Unsplash 이미지를 자동 배치해 주세요.)`;
  } else {
    if (selectedStockImages && selectedStockImages.length > 0) {
      const urlsText = selectedStockImages.map((url) => `- ${url}`).join("\n");
      imageSection = `
## 이미지 처리
제가 직접 선택한 아래 Unsplash 이미지 URL들을 웹사이트의 히어로 섹션 또는 주요 소개/갤러리 섹션의 배경 이미지로 우선 배치해 주세요:
${urlsText}
(그 외 다른 섹션에는 "${template.unsplashKeyword}" 키워드로 검색되는 분위기가 조화로운 이미지를 추가로 자동 배치해 주세요.)`;
    } else {
      imageSection = `
## 이미지 처리
이미지는 Unsplash에서 "${template.unsplashKeyword}" 키워드로 검색하여 어울리는 이미지를 자동으로 배치해 주세요. 히어로 섹션 1장, 갤러리/소개 섹션 3~4장 정도 사용하면 됩니다.`;
    }
  }

  const modifyParts: string[] = [];
  const bizName = userInputs.businessName || template.name;
  const bizDesc = userInputs.description || template.tagline;

  modifyParts.push(
    `- **브랜드 정보 변경**: 업체명은 "${bizName}"으로 적용하고, 소개 문구(태그라인)는 "${bizDesc}"으로 반영해 주세요.`
  );

  if (logoUrl) {
    modifyParts.push(
      `- **브랜드 로고 사용**: 제공된 로고 파일 URL(\`${logoUrl}\`)을 헤더 영역과 푸터 영역에 텍스트 대신 깔끔하고 균형 잡힌 비율로 삽입해 주세요.`
    );
  }

  if (userInputs.referenceUrl) {
    modifyParts.push(
      `- **레퍼런스 웹사이트 참조**: 다음 레퍼런스 URL의 레이아웃 구조, 네비게이션 형태 및 전반적인 UX 흐름을 분석하고 모사하여 제작해 주세요: ${userInputs.referenceUrl}`
    );
  }

  if (referenceScreenshotUrl) {
    modifyParts.push(
      `- **레퍼런스 스크린샷 모사**: 제공된 레퍼런스 캡처 스크린샷 이미지(\`${referenceScreenshotUrl}\`)의 시각적 레이아웃, 카드 배열, 데코레이션 디테일 및 컴포넌트 마감 처리를 충실하게 모사하여 프론트엔드 스타일링을 설계해 주세요.`
    );
  }

  if (userInputs.contact) {
    modifyParts.push(
      `- **연락처 정보**: 연락처 및 문의하기 수단 정보로 "${userInputs.contact}"를 명시적으로 삽입해 주세요.`
    );
  }

  if (userInputs.customColor) {
    modifyParts.push(
      `- **컬러 변경**: 포인트 컬러(액센트)를 기본값 대신 "${userInputs.customColor}" 계열로 변경하여 전체 컬러 시스템(메인, 서브, 배경)에 자연스럽고 미려하게 어우러지도록 설계해 주세요.`
    );
  }

  if (userInputs.sectionOrder) {
    modifyParts.push(
      `- **섹션 순서 변경**: 섹션을 다음 순서대로 재배치해 주세요: "${userInputs.sectionOrder}"`
    );
  }

  const modifySection =
    modifyParts.length > 0
      ? `\n## 상세 디자인 및 수정 요청 사항\n${modifyParts.join("\n")}`
      : "";

  const userVisualKeyword = userInputs.imagePromptKeyword?.trim() ? `, ${userInputs.imagePromptKeyword.trim()}` : "";
  const midjourneyPrompt = `A high-end cinematic editorial photograph of ${template.unsplashKeyword}${userVisualKeyword}, ${template.referenceStyle} style, detailed visual architecture, luxury lighting, ultra realistic, 8k resolution, aspect ratio 16:9 --ar 16:9 --v 6.0`;
  const runwayPrompt = `Slow cinematic sweeping panning shot of ${template.unsplashKeyword}${userVisualKeyword}, soft golden hour sunlight, ${template.referenceStyle} atmosphere, highly detailed, ultra realistic 4k resolution, cinematic camera movement`;

  const recommendedMediaSection = `
## 부록: 추천 미디어(이미지/비디오) 생성 프롬프트 & 규격 가이드
이 웹사이트의 히어로 배경이나 랜딩페이지 비주얼에 들어갈 이미지/비디오를 생성할 때 아래 규격과 프롬프트를 복사하여 AI 생성 툴(Midjourney, DALL-E 3, Runway, Luma 등)에 입력해 보세요.

### 📐 웹사이트 컴포넌트별 권장 이미지 생성 규격
| 적용 위치 | 추천 비율 (Midjourney) | 권장 픽셀 해상도 (PC/일반) | DALL-E 3 전용 해상도 |
| :--- | :--- | :--- | :--- |
| **PC 히어로 메인 배경** | 16:9 (\`--ar 16:9\`) | 1920 × 1080 px | 1792 × 1024 px |
| **에디토리얼 / 매거진 화보** | 3:4 (\`--ar 3:4\`) | 1200 × 1600 px | 1024 × 1365 px |
| **모바일 풀스크린 / 스토리** | 9:16 (\`--ar 9:16\`) | 1080 × 1920 px | 1024 × 1792 px |
| **제품 썸네일 / 피드** | 1:1 (\`--ar 1:1\`) | 1024 × 1024 px | 1024 × 1024 px |
| **블로그 / 갤러리 카드** | 4:3 (\`--ar 4:3\`) | 1600 × 1200 px | 1365 × 1024 px |

### 🎨 추천 프롬프트 복사본
- **Midjourney / DALL-E 3용 이미지 생성 프롬프트 (히어로 16:9 기준)**:
  \`\`\`text
  ${midjourneyPrompt}
  \`\`\`

- **Runway Gen-3 / Luma Dream Machine용 비디오 생성 프롬프트 (16:9 4K)**:
  \`\`\`text
  ${runwayPrompt}
  \`\`\`
`.trim();

  const navSection =
    navMenus && navMenus.length > 0
      ? `\n## 네비게이션 메뉴 구성\n상단 네비게이션 바(GNB)에는 다음 메뉴 항목들을 배치하고, 클릭 시 해당 섹션으로 부드럽게 스크롤(Smooth Scroll)되도록 구현해 주세요:\n${navMenus.map((m) => `- ${m}`).join("\n")}\n`
      : "";

  return `# Google Flow 전용 웹사이트 빌드 브리프 (${categoryLabel})

## 기본 설정
아래 아키텍처 및 디자인 스타일을 기반으로 "${template.name}" 스타일의 ${categoryLabel} 웹사이트를 완벽하게 빌드해 주세요.
디자인 컨셉: ${template.tagline}
레퍼런스 스타일: ${template.referenceStyle}
${navSection}
## 레이아웃 구조
아래 순서로 섹션을 구성해 주세요:
${sectionList}

## 컬러 팔레트
${colorsText}

## 폰트
${fontsText}
(한글 폰트가 지원되지 않으면 Google Fonts에서 Noto Serif KR과 Pretendard를 불러와 사용해 주세요.)
${imageSection}
${modifySection}

${recommendedMediaSection}

## 기술 요구사항
- 반응형 웹사이트로 만들어 주세요 (모바일 우선 설계).
- 버튼, 링크, 호버 효과 등 인터랙션을 자연스럽게 넣어 주세요.
${
  template.layoutType === "dynamic"
    ? "- **다이내믹 인터랙션 구현**: Framer Motion 또는 GSAP를 활용하여 부드러운 스크롤 패럴랙스, 카드 호버 3D 틸트 효과, 무한 롤링 텍스트 티커(Ticker Bar), 마우스 트래킹 마이크로 인터랙션을 생생하게 구현해 주세요.\n"
    : ""
}- 빠른 로딩을 위해 이미지는 lazy loading을 적용해 주세요.
- 완성 후 전체 페이지 미리보기를 보여주세요.

---
✅ 이 브리프는 Google Flow AI Prompt Engine (2GOSOO AI LAB)으로 생성되었습니다.`.trim();
}
