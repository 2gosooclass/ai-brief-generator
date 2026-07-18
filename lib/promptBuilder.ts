import type { Template, ImageMode, ModifyOptions, UserInputs } from "./types";

const CATEGORY_LABELS: Record<string, string> = {
  cafe: "카페·레스토랑",
  academy: "학원·강좌",
  personal: "개인 브랜드",
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
};

// 🌐 템플릿별로 각 섹션에 어울리는 12대 레이아웃 구조 패턴 고유 매핑 (획일화 탈피 마스터 테이블)
const TEMPLATE_SECTION_PATTERNS: Record<string, Record<string, number>> = {
  "cafe-minimal": {
    "about": 8,       // 지그재그 레이아웃
    "menu": 0,        // 그리드 레이아웃 (모듈형)
    "gallery": 7,     // 갤러리 레이아웃
    "location": 1,    // 분할 화면 레이아웃 (50:50)
    "instagram": 4    // 사이드 스크롤 레이아웃
  },
  "cafe-vintage": {
    "story": 8,       // 지그재그 레이아웃
    "menu": 5,        // 카드 레이아웃
    "events": 11,     // 애니메이션 레이아웃
    "gallery": 7,     // 갤러리 레이아웃
    "contact": 1      // 분할 화면 레이아웃
  },
  "cafe-modern": {
    "philosophy": 3,  // 전체 화면 레이아웃 (감성 타격)
    "menu": 0,        // 그리드 레이아웃
    "barista": 2,     // 비대칭 레이아웃 (70:30)
    "reservations": 10 // 인터랙티브 레이아웃
  },
  "cafe-finedining": {
    "chef": 2,        // 비대칭 레이아웃 (70:30)
    "course-menu": 6, // 잡지 레이아웃
    "reservation": 1, // 분할 화면 레이아웃
    "private-room": 3 // 전체 화면 레이아웃
  },
  "cafe-casual": {
    "menu-board": 0,  // 그리드 레이아웃
    "waiting": 10,    // 인터랙티브 레이아웃
    "location": 1,    // 분할 화면 레이아웃
    "reviews": 5      // 카드 레이아웃
  },
  "academy-trust": {
    "features": 0,    // 그리드 레이아웃
    "curriculum": 8,  // 지그재그 레이아웃
    "teachers": 6,    // 잡지 레이아웃
    "results": 9,     // F-패턴 레이아웃
    "schedule": 5,    // 카드 레이아웃
    "contact": 1      // 분할 화면 레이아웃
  },
  "academy-creative": {
    "classes": 0,     // 그리드 레이아웃
    "gallery": 7,     // 갤러리 레이아웃
    "instructors": 2, // 비대칭 레이아웃
    "testimonials": 5, // 카드 레이아웃
    "pricing": 9,     // F-패턴 레이아웃
    "enroll": 10      // 인터랙티브 레이아웃
  },
  "academy-online": {
    "features": 0,    // 그리드 레이아웃
    "courses": 5,     // 카드 레이아웃
    "demo": 10,       // 인터랙티브 레이아웃
    "pricing": 9,     // F-패턴 레이아웃
    "faq": 8,         // 지그재그 레이아웃
    "cta": 11         // 애니메이션 레이아웃
  },
  "personal-portfolio": {
    "about": 8,       // 지그재그
    "works": 7,       // 갤러리
    "process": 0,     // 그리드
    "skills": 5,      // 카드
    "contact": 1      // 분할 화면
  },
  "personal-consultant": {
    "about": 8,       // 지그재그
    "services": 0,    // 그리드
    "results": 9,     // F-패턴
    "testimonials": 5, // 카드
    "booking": 10     // 인터랙티브
  },
  "personal-creator": {
    "links": 5,       // 카드
    "latest-content": 4, // 사이드 스크롤
    "shop": 0,        // 그리드
    "about": 8,       // 지그재그
    "newsletter": 1   // 분할 화면
  },
  "religion-church": {
    "about": 8,       // 지그재그
    "events": 11,     // 애니메이션
    "gallery": 7,     // 갤러리
    "location": 1,    // 분할 화면
    "contact": 0      // 그리드
  },
  "religion-ngo": {
    "story": 8,       // 지그재그
    "events": 11,     // 애니메이션
    "gallery": 7,     // 갤러리
    "contact": 1      // 분할 화면
  },
  "religion-community": {
    "about": 8,       // 지그재그
    "events": 11,     // 애니메이션
    "gallery": 7,     // 갤러리
    "contact": 1      // 분할 화면
  },
  "traditional-knots": {
    "about": 8,       // 지그재그
    "classes": 0,     // 그리드
    "gallery": 7,     // 갤러리
    "location": 1,    // 분할 화면
    "contact": 5      // 카드
  },
  "traditional-pottery": {
    "philosophy": 3,  // 전체 화면
    "courses": 0,     // 그리드
    "gallery": 7,     // 갤러리
    "location": 1,    // 분할 화면
    "contact": 5      // 카드
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
}: {
  template: Template;
  categoryId: string;
  imageMode: ImageMode;
  uploadedImageUrl: string | null;
  selectedStockImages?: string[];
  modifyOptions: ModifyOptions;
  userInputs: UserInputs;
}): string {
  const categoryLabel = CATEGORY_LABELS[categoryId] ?? categoryId;
  const templateId = template.id;
  
  const sectionList = template.sections
    .map((s, idx) => {
      const label = SECTION_LABELS[s] ?? s;
      
      // 히어로나 첫 섹션은 Full Screen Layout
      if (s === "hero" || idx === 0) {
        return `[섹션 ${idx + 1} 구조 패턴 유형: 전체 화면 레이아웃 (Full Screen Layout - Z-패턴 기본 반영)]\n  - ${label}: 화면 전체를 하나의 압도적인 비주얼로 채우고 미니멀 타이포그래피만 배치하여 브랜드 감성을 각인하십시오. 요소의 시선 흐름이 마지막에 CTA(행동 유도 버튼)로 명확히 꽂히게 유도해 주세요.`;
      }
      
      // 템플릿별로 각 섹션 고유 레이아웃 인덱스 조회 (정의되지 않은 경우 i % 12 매핑)
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

  // 이미지 섹션
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
  } else {
    // 스톡 이미지 모드
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

  // 수정 항목 섹션
  const modifyParts: string[] = [];

  if (modifyOptions.textChange) {
    const bizName = userInputs.businessName
      ? `"${userInputs.businessName}"`
      : "[업체명을 여기에 적어주세요]";
    const bizDesc = userInputs.description
      ? `"${userInputs.description}"`
      : "[업체 소개 문구를 여기에 적어주세요]";
    modifyParts.push(
      `- **텍스트 변경**: 업체명은 ${bizName}으로, 소개 문구는 ${bizDesc}으로 교체해 주세요.`
    );
  }

  if (modifyOptions.colorChange) {
    const targetColor = userInputs.customColor
      ? `"${userInputs.customColor}" 계열`
      : "[원하는 컬러를 여기에 적어주세요] 계열";
    modifyParts.push(
      `- **컬러 변경**: 포인트 컬러(${template.colors.accent})를 ${targetColor}로 변경해 주세요. 전체 컬러 시스템이 자연스럽게 어우러지도록 조정해 주세요.`
    );
  }

  if (modifyOptions.sectionReorder) {
    const order = userInputs.sectionOrder
      ? `"${userInputs.sectionOrder}"`
      : "[원하는 섹션 순서를 여기에 적어주세요. 예: 히어로 > 메뉴 > 갤러리 > 위치]";
    modifyParts.push(
      `- **섹션 순서 변경**: 섹션을 다음 순서로 재배치해 주세요: ${order}`
    );
  }

  const modifySection =
    modifyParts.length > 0
      ? `\n## 수정 요청 사항\n${modifyParts.join("\n")}`
      : "";

  // 최종 프롬프트 조합
  return `# ${categoryLabel} 웹사이트 제작 요청

## 기본 설정
아래 디자인 스타일을 참고하여 "${template.name}" 스타일의 ${categoryLabel} 웹사이트를 만들어 주세요.
디자인 컨셉: ${template.tagline}
레퍼런스 스타일: ${template.referenceStyle}

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

## 기술 요구사항
- 반응형 웹사이트로 만들어 주세요 (모바일 우선 설계).
- 버튼, 링크, 호버 효과 등 인터랙션을 자연스럽게 넣어 주세요.
- 빠른 로딩을 위해 이미지는 lazy loading을 적용해 주세요.
- 완성 후 전체 페이지 미리보기를 보여주세요.

---
✅ 이 프롬프트는 AI 웹사이트 브리프 생성기(2GOSOO AI LAB)로 자동 생성되었습니다.`.trim();
}
