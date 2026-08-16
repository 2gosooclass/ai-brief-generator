"use client";

import { useBriefStore } from "@/store/briefStore";
import type { Template } from "@/lib/types";
import { useMemo, useState } from "react";

const SECTION_KR: Record<string, string> = {
  hero: "히어로", about: "브랜드 소개", menu: "메뉴 안내", gallery: "갤러리",
  location: "오시는 길", instagram: "인스타그램", story: "우리의 이야기", events: "이벤트",
  contact: "문의하기", features: "주요 특징", curriculum: "커리큘럼", teachers: "강사진",
  results: "합격 실적", schedule: "수업 시간표", classes: "클래스 안내", instructors: "강사 소개",
  testimonials: "수강 후기", pricing: "수강료", enroll: "신청하기", courses: "강좌 목록",
  demo: "무료 체험", faq: "자주 묻는 질문", cta: "시작하기", works: "포트폴리오", process: "작업 과정",
  skills: "보유 스킬", services: "제공 서비스", booking: "예약하기", links: "링크 모음",
  "latest-content": "최신 콘텐츠", shop: "쇼핑몰", newsletter: "뉴스레터",
  philosophy: "커피 철학", barista: "바리스타", reservations: "예약 안내",
  chef: "셰프 소개", "course-menu": "코스 메뉴", reservation: "예약 폼", "private-room": "프라이빗 룸",
  "menu-board": "전체 메뉴판", waiting: "웨이팅 안내", reviews: "고객 리뷰"
};

const SECTION_CONTENTS: Record<string, string> = {
  about: "전통과 현대의 미학이 공존하는 공간에서 숙련된 전문가들이 고객의 비즈니스 페르소나에 맞춰 가장 시맨틱하고 깊이 있는 최적의 맞춤 브랜딩 솔루션을 설계해 드립니다.",
  services: "1:1 퍼스널 아키텍처 수립부터 고부가가치 솔루션 연동 리포트까지 대표님의 한계 돌파와 무한한 생산성 해방을 위한 차별화된 핵심 맞춤 프로그램을 제안합니다.",
  results: "매년 98% 이상의 압도적인 합격률과 만족도를 달성하며, 국내외 유수의 선두 기관들과 공식 파트너십을 체결하여 그 절대적인 역량과 신뢰를 증명하고 있습니다.",
  testimonials: "비서실의 조언 덕분에 막막했던 브랜딩 방향성을 하루 만에 정리했고, 실서버 배포 후 첫 달 매출이 200% 이상 폭발적으로 도약하는 기적 같은 경험을 직접 체감했습니다.",
  booking: "대표님의 예약 현황에 맞춰 선착순으로 제한되어 운영되는 프라이빗 스케줄러입니다. 신청 양식을 작성해 주시면 24시간 이내에 담당 마스터가 상세 일정을 조율해 드립니다.",
  curriculum: "기초 아키텍처 셋업부터 고도화 클라우드 배포까지 5단계 입체 과정을 통해, 비개발자라도 현업 마스터들의 설계 장벽을 단숨에 뛰어넘는 최단기 집중 마스터 로드맵입니다.",
  teachers: "구글 클라우드(GCP) 인프라 구축 및 시니어 엔지니어링 실무 경력 15년 이상의 노련한 강사진이 대표님의 단독 기술 멘토가 되어 살아있는 지식과 노하우를 직접 전수합니다.",
  works: "디스코드 VIP 시황 분석기부터 헤르메스 자동화 비디오 사출 공정까지, 2GOSOO AI LAB이 독자적으로 완수해 낸 최고 난이도의 기술 포트폴리오를 대조해 보십시오.",
  faq: "도입 후 소스코드는 온전히 저희가 소유할 수 있나요? 실시간 API 연동 비용은 어느 정도로 청구되나요? 등 대표님들이 상담 시 가장 자주 문의하시는 핵심 쟁점들을 간추렸습니다.",
  cta: "지금 바로 당사의 인텔리전트 엔지니어링 시스템을 가동하여 비주얼 슬롭에서 완전히 벗어나고 대표님만의 비즈니스 성장을 폭발적으로 가속화하십시오.",
  menu: "신선한 원두로 추출한 시그니처 에스프레소부터 매칭 디저트까지, 계절의 변화와 자연의 감성을 한눈에 담아낸 감각적인 메뉴 구성을 제안합니다.",
  gallery: "정갈하고 담백한 화보식 무드와 자연광이 머무는 아름다운 일상의 순간들을 렌더링한 프리미엄 스튜디오 갤러리 아카이브입니다."
};

function isDark(hex: string): boolean {
  if (!hex) return false;
  const h = hex.replace("#", "");
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

const TEMPLATE_DEFAULTS: Record<string, string[]> = {
  "cafe-minimal": [
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80"
  ],
  "cafe-vintage": [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=800&q=80",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80"
  ],
  "cafe-modern": [
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"
  ],
  "cafe-finedining": [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
  ],
  "cafe-casual": [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80"
  ],
  "academy-trust": [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80"
  ],
  "academy-creative": [
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"
  ],
  "academy-online": [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80"
  ],
  "personal-portfolio": [
    "/images/hero-bg.png",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80"
  ],
  "personal-consultant": [
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80"
  ],
  "personal-creator": [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80"
  ],
  "religion-church": [
    "https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?w=800&q=80",
    "https://images.unsplash.com/photo-1515002246390-7bf7e8f87b54?w=800&q=80",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80"
  ],
  "religion-ngo": [
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80",
    "https://images.unsplash.com/photo-1469571486040-7a9785ad667f?w=800&q=80"
  ],
  "religion-community": [
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80"
  ],
  "traditional-knots": [
    "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
    "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&q=80",
    "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&q=80"
  ],
  "traditional-pottery": [
    "https://images.unsplash.com/photo-1610483178766-829288225575?w=800&q=80",
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80",
    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80"
  ]
};

// ── 개별 섹션 이미지 변경 지원을 위한 래퍼 컴포넌트 ──
interface EditableImageProps {
  sectionKey: string;
  defaultUrl: string;
  className?: string;
  asBackground?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

function EditableImage({
  sectionKey,
  defaultUrl,
  className = "",
  asBackground = false,
  children,
  style = {}
}: EditableImageProps) {
  const { sectionImages, setEditingSection } = useBriefStore();
  const imageUrl = sectionImages[sectionKey] || defaultUrl;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSection(sectionKey);
  };

  if (asBackground) {
    return (
      <div
        className={`group relative bg-cover bg-center ${className}`}
        style={{
          ...style,
          backgroundImage: style.backgroundImage
            ? `${style.backgroundImage.toString().split(', url')[0]}, url(${imageUrl})`
            : `url(${imageUrl})`
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
          <button
            onClick={handleClick}
            className="pointer-events-auto px-4 py-2 bg-white/95 text-[#1C1410] rounded-xl text-xs font-pretendard font-bold shadow-lg hover:bg-white hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <span>📷</span> 이미지 변경
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={`group relative overflow-hidden ${className}`} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={sectionKey} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
        <button
          onClick={handleClick}
          className="pointer-events-auto px-4 py-2 bg-white/95 text-[#1C1410] rounded-xl text-xs font-pretendard font-bold shadow-lg hover:bg-white hover:scale-105 transition-all flex items-center gap-1.5"
        >
          <span>📷</span> 이미지 변경
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 🌐 12가지 웹사이트 구조 패턴 통합 렌더러 컴포넌트 (대표님 명세 지침 100% 반영)
// ─────────────────────────────────────────────
// 🌐 템플릿별로 각 섹션에 어울리는 12대 레이아웃 구조 패턴 고유 매핑 (획일화 탈피 마스터 테이블)
const TEMPLATE_SECTION_PATTERNS: Record<string, Record<string, number>> = {
  "cafe-minimal": {
    "about": 8,       // 지그재그 레이아웃
    "menu": 0,        // 그리드 레이아웃
    "gallery": 7,     // 갤러리 레이아웃
    "location": 1,    // 분할 화면 레이아웃 (오시는 길 50:50)
    "instagram": 4    // 사이드 스크롤 레이아웃 (인스타그램 롤)
  },
  "cafe-vintage": {
    "story": 8,       // 지그재그 레이아웃
    "menu": 5,        // 카드 레이아웃
    "events": 11,     // 애니메이션 레이아웃 (제품/이벤트 모션)
    "gallery": 7,     // 갤러리 레이아웃
    "contact": 1      // 분할 화면 레이아웃 (문의 폼 50:50)
  },
  "cafe-modern": {
    "philosophy": 3,  // 전체 화면 레이아웃 (철학 감성 타격)
    "menu": 0,        // 그리드 레이아웃 (메뉴)
    "barista": 2,     // 비대칭 레이아웃 (바리스타 소개 70:30)
    "reservations": 10 // 인터랙티브 레이아웃 (예약 탭 스위처)
  },
  "cafe-finedining": {
    "chef": 2,        // 비대칭 레이아웃 (셰프 소개 70:30)
    "course-menu": 6, // 잡지 레이아웃 (코스 메뉴)
    "reservation": 1, // 분할 화면 레이아웃 (예약 가입 양식)
    "private-room": 3 // 전체 화면 레이아웃 (프라이빗 룸 화보)
  },
  "cafe-casual": {
    "menu-board": 0,  // 그리드 레이아웃 (메뉴판)
    "waiting": 10,    // 인터랙티브 레이아웃 (웨이팅 시뮬레이션)
    "location": 1,    // 분할 화면 레이아웃
    "reviews": 5      // 카드 레이아웃 (수강후기/리뷰)
  },
  "academy-trust": {
    "features": 0,    // 그리드 레이아웃 (주요 특징)
    "curriculum": 8,  // 지그재그 레이아웃 (커리큘럼 단계)
    "teachers": 6,    // 잡지 레이아웃 (강사진 스토리)
    "results": 9,     // F-패턴 레이아웃 (합격 실적 대형 수치)
    "schedule": 5,    // 카드 레이아웃 (시간표)
    "contact": 1      // 분할 화면 레이아웃
  },
  "academy-creative": {
    "classes": 0,     // 그리드 레이아웃
    "gallery": 7,     // 갤러리 레이아웃
    "instructors": 2, // 비대칭 레이아웃
    "testimonials": 5, // 카드 레이아웃
    "pricing": 9,     // F-패턴 레이아웃
    "enroll": 10      // 인터랙티브 레이아웃 (신청 탭)
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
    "process": 0,     // 그리드 (작업 과정)
    "skills": 5,      // 카드 (보유 스킬)
    "contact": 1      // 분할 화면
  },
  "personal-consultant": {
    "about": 8,       // 지그재그
    "services": 0,    // 그리드 (제공 서비스)
    "results": 9,     // F-패턴 (실적 수치)
    "testimonials": 5, // 카드 (후기)
    "booking": 10     // 인터랙티브 (예약 탭)
  },
  "personal-creator": {
    "links": 5,       // 카드 (링크 모음)
    "latest-content": 4, // 사이드 스크롤 (최신 피드 롤)
    "shop": 0,        // 그리드 (샵 상품)
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
    "classes": 0,     // 그리드 (매듭 클래스)
    "gallery": 7,     // 갤러리
    "location": 1,    // 분할 화면
    "contact": 5      // 카드
  },
  "traditional-pottery": {
    "philosophy": 3,  // 전체 화면 (도예 철학)
    "courses": 0,     // 그리드
    "gallery": 7,     // 갤러리
    "location": 1,    // 분할 화면
    "contact": 5      // 카드
  }
};

function PatternSectionRenderer({
  sec,
  idx,
  template,
  accentColor,
  bizName,
  images,
  themeMode = "light"
}: {
  sec: string;
  idx: number;
  template: Template;
  accentColor: string;
  bizName: string;
  images: string[];
  themeMode?: "light" | "dark";
}) {
  const { colors, fonts } = template;
  const templateId = template.id;
  const layoutPatternIndex = TEMPLATE_SECTION_PATTERNS[templateId]?.[sec] ?? (idx % 12);
  const imageUrl = images[(idx + 1) % images.length];
  const koreanTitle = SECTION_KR[sec] ?? sec;
  const contentText = SECTION_CONTENTS[sec] || `${bizName}의 ${koreanTitle} 섹션입니다. 기획안의 12가지 독창적 웹사이트 구조 패턴 중 하나를 반영하여 완성도를 보강했습니다.`;
  
  // 11. 인터랙티브 레이아웃 탭 및 수치 조작 상태
  const [activeTab, setActiveTab] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);

  const cardBg = themeMode === "dark" ? "bg-white/5 border-white/10" : "bg-white border-black/5";
  const textColor = themeMode === "dark" ? "text-white" : "text-[#1C1410]";
  const subTextColor = themeMode === "dark" ? "text-white/60" : "text-[#8C7A6A]";

  switch (layoutPatternIndex) {
    case 0:
      // 1. 그리드 레이아웃 (Grid Layout)
      // - 모듈형 그리드: 상품이나 포트폴리오 이미지를 바둑판 형태로 정렬
      // - 단일 열 그리드: 긴 글로 이루어진 철학이나 블로그 형태에 적용
      return (
        <section key={sec} className={`rounded-2xl p-8 border shadow-sm ${cardBg} space-y-8`}>
          <div className="flex justify-between items-center border-b pb-4 dark:border-white/10">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E]">Pattern 01: Grid Layout</span>
            <h4 className={`text-xl font-bold ${textColor}`}>{koreanTitle}</h4>
          </div>
          
          <div className="space-y-6">
            {/* 모듈형 그리드 */}
            <div>
              <p className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-wider mb-3">■ 모듈형 그리드 (바둑판 정렬)</p>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((num) => (
                  <div key={num} className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 space-y-2">
                    <EditableImage sectionKey={`${sec}-grid-mod-${num}`} defaultUrl={images[num % images.length]} className="h-28 rounded-lg shadow-sm" />
                    <h5 className={`font-bold text-xs ${textColor}`}>포트폴리오 {num}</h5>
                  </div>
                ))}
              </div>
            </div>

            {/* 단일 열 그리드 */}
            <div>
              <p className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-wider mb-3">■ 단일 열 그리드 (블로그/철학 최적화)</p>
              <div className="space-y-3">
                <div className="p-5 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 space-y-2 text-left">
                  <h5 className={`font-serif-kr font-bold text-sm ${textColor}`}>본질과 가치에 대한 고찰</h5>
                  <p className={`text-xs ${subTextColor} leading-relaxed`}>{contentText}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      );

    case 1:
      // 2. 분할 화면 레이아웃 (Split Screen Layout)
      // - 화면을 정확히 50:50으로 나누어, 한쪽에는 고품질 비주얼을 두고 반대쪽에는 텍스트 가입 양식이나 핵심 핵심 스펙 요약을 대조 배치.
      return (
        <section key={sec} className={`flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden shadow-sm border ${cardBg}`}>
          {/* 한쪽 고품질 비주얼 (50%) */}
          <EditableImage sectionKey={sec} defaultUrl={imageUrl} className="flex-1 min-h-[350px] md:h-auto" />
          
          {/* 반대쪽 텍스트 가입 양식 및 스펙 대조 (50%) */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center space-y-6">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E]">Pattern 02: Split Screen (50:50)</span>
            <h3 className={`text-3xl font-bold leading-tight ${textColor}`}>{koreanTitle}</h3>
            
            {/* 핵심 스펙 요약 대조 배치 */}
            <div className="grid grid-cols-2 gap-4 border-y py-4 dark:border-white/10">
              <div>
                <p className="text-[10px] opacity-50">성공률</p>
                <p className={`text-xl font-bold font-serif-kr ${textColor}`}>98% 달성</p>
              </div>
              <div>
                <p className="text-[10px] opacity-50">도입 속도</p>
                <p className={`text-xl font-bold font-serif-kr ${textColor}`}>평균 5분</p>
              </div>
            </div>

            {/* 가입 양식 모사 UI */}
            <div className="space-y-2">
              <input type="text" placeholder="이메일 주소를 입력해 주십시오" className="w-full px-4 py-2 border rounded-lg text-xs bg-black/5 dark:bg-white/5 focus:outline-none dark:border-white/10" disabled />
              <button className="px-6 py-2.5 w-full rounded font-bold transition-transform hover:scale-103 text-center"
                style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
                지금 가입 신청 및 리포트 받기
              </button>
            </div>
          </div>
        </section>
      );

    case 2:
      // 3. 비대칭 레이아웃 (Asymmetrical Layout)
      // - 좌우 비율을 의도적으로 다르게 가져가(예: 70:30), 더 큰 공간으로 사용자의 시선을 강제로 유도하고 그곳에 핵심 CTA 버튼을 배치.
      return (
        <section key={sec} className="grid grid-cols-1 md:grid-cols-10 gap-6 items-stretch">
          {/* 70% 넓은 비주얼 영역으로 시선 강제 유도 */}
          <div className={`md:col-span-7 relative rounded-2xl overflow-hidden shadow-sm border h-88 ${cardBg}`}>
            <EditableImage sectionKey={sec} defaultUrl={imageUrl} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 z-10 text-white max-w-xl">
              <span className="text-[9px] font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                Pattern 03: Asymmetrical 70:30 Layout
              </span>
              <h3 className="text-2xl font-bold mt-2" style={{ fontFamily: fonts.heading }}>{koreanTitle}</h3>
              <p className="text-xs text-white/80 leading-normal mt-1">{bizName}의 대표적인 시각적 임팩트 구도입니다.</p>
            </div>
          </div>
          
          {/* 30% 영역에 핵심 CTA 배치 */}
          <div className={`md:col-span-3 p-6 rounded-2xl border flex flex-col justify-between ${cardBg}`}>
            <div className="space-y-4">
              <span className="text-[9px] text-[#C8A97E] uppercase tracking-widest font-bold">Action Control</span>
              <p className={`text-xs ${subTextColor} leading-relaxed`}>{contentText}</p>
            </div>
            
            {/* 핵심 CTA 버튼 */}
            <button className="w-full py-4.5 rounded-xl font-bold text-center transition-all duration-300 transform hover:scale-[1.03] shadow-md text-sm border"
              style={{ backgroundColor: accentColor, borderColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
              핵심 가이드 다운로드 ➔
            </button>
          </div>
        </section>
      );

    case 3:
      // 4. 전체 화면 레이아웃 (Full Screen Layout)
      // - 화면 전체를 하나의 압도적인 배경 이미지/영상으로 채우고, 그 위에 미니멀한 타이포그래피만 얹어 브랜드의 감성을 한눈에 타격하는 구조.
      return (
        <section key={sec} className="relative rounded-2xl overflow-hidden h-96 flex items-center justify-center text-center shadow-lg border border-black/5">
          <EditableImage sectionKey={sec} defaultUrl={imageUrl} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-black/70 pointer-events-none" />
          <div className="relative z-10 p-6 max-w-2xl text-white space-y-6">
            <span className="text-[9px] font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm text-[#C8A97E]">
              Pattern 04: Full Canvas Layout
            </span>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight leading-tight font-serif-kr">
              감각적인 미학, <span className="font-bold">한눈에 와닿는 브랜드 감성</span>
            </h1>
            <p className="text-xs text-white/70 max-w-lg mx-auto leading-relaxed">{contentText}</p>
          </div>
        </section>
      );

    case 4:
      // 5. 사이드 스크롤 레이아웃 (Side Scroll Layout)
      // - 상하 스크롤이 아닌 좌우로 부드럽게 넘기는 넷플릭스 스타일 구조. 카테고리나 이미지 갤러리를 압도감 없이 나열할 때 사용.
      return (
        <section key={sec} className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E] block mb-1">Pattern 05: Side Scroll</span>
              <h3 className={`text-2xl font-bold ${textColor}`}>{koreanTitle}</h3>
            </div>
            <span className="text-xs opacity-50 font-pretendard">마우스/드래그하여 넘기기 ➔</span>
          </div>
          
          {/* 가로 넷플릭스 롤 */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x text-black dark:text-white">
            {[1, 2, 3, 4].map((cardIdx) => (
              <div key={cardIdx} className={`min-w-[240px] rounded-xl overflow-hidden border snap-start ${cardBg}`}>
                <EditableImage sectionKey={`${sec}-${cardIdx}`} defaultUrl={images[(cardIdx) % images.length]} className="h-32 w-full" />
                <div className="p-4 space-y-1">
                  <h4 className={`font-bold text-xs ${textColor}`}>카테고리 화보 {cardIdx}</h4>
                  <p className={`text-[11px] ${subTextColor}`}>{bizName}의 대표적 나열 스펙</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 5:
      // 6. 카드 레이아웃 (Card Layout)
      // - 직사각형 상자 안에 이미지, 제목, 가격/설명을 콤팩트하게 담아 빠른 탐색을 유도하는 구조. (※ 사이트 전체 남발 금지, 특정 1개 섹션에만 한정할 것)
      return (
        <section key={sec} className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E] block w-fit">Pattern 06: Card Layout</span>
            <span className="text-[9px] text-[#A08060] font-pretendard bg-[#FDF8F0] border border-[#E8D5B7] px-2 py-0.5 rounded-full">※ 특정 1개 섹션에만 한정 적용</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((itemNum) => (
              <div key={itemNum} className={`rounded-xl overflow-hidden border p-4 space-y-3 shadow-sm hover:shadow transition-shadow ${cardBg}`}>
                <EditableImage sectionKey={`${sec}-card-img-${itemNum}`} defaultUrl={images[itemNum % images.length]} className="h-32 rounded-lg" />
                <div className="space-y-1 text-left">
                  <h4 className={`font-bold text-sm ${textColor}`}>{koreanTitle} 상품 {itemNum}</h4>
                  <p className="text-xs font-semibold text-[#C8A97E]">₩{(itemNum * 50000).toLocaleString()}</p>
                  <p className={`text-[10px] ${subTextColor} leading-relaxed`}>{contentText.slice(0, 50)}...</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 6:
      // 7. 잡지 레이아웃 (Magazine Layout)
      // - 인쇄 매거진처럼 가장 큰 메인 스토리에는 거대한 영웅 이미지를 쓰고, 나머지 서브 콘텐츠는 주변에 작게 배치하여 정보의 강약을 조절하는 구조.
      return (
        <section key={sec} className="space-y-6">
          <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E] block w-fit">Pattern 07: Magazine Layout</span>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* 거대 영웅 이미지 메인 스토리 (60%) */}
            <div className="md:col-span-7 space-y-4">
              <EditableImage sectionKey={`${sec}-mag-hero`} defaultUrl={imageUrl} className="h-64 md:h-80 rounded-2xl shadow-sm border border-black/5" />
              <h3 className={`text-2xl font-bold ${textColor}`}>{koreanTitle} 시그니처 픽</h3>
              <p className={`text-xs ${subTextColor} leading-relaxed`}>{contentText}</p>
            </div>

            {/* 주변 서브 콘텐츠 작게 배치 (40%) */}
            <div className="md:col-span-5 space-y-6 border-l pl-6 dark:border-white/10">
              {[1, 2].map((subNum) => (
                <div key={subNum} className="flex gap-4 items-center text-left">
                  <EditableImage sectionKey={`${sec}-mag-sub-${subNum}`} defaultUrl={images[subNum % images.length]} className="w-20 h-20 rounded-xl shrink-0" />
                  <div className="space-y-1">
                    <h4 className={`font-bold text-sm ${textColor}`}>서브 콘텐츠 {subNum}</h4>
                    <p className={`text-[11px] ${subTextColor} leading-normal`}>{contentText.slice(0, 45)}...</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      );

    case 7:
      // 8. 갤러리 레이아웃 (Gallery Layout)
      // - 텍스트를 극도로 아끼고 오직 이미지/비주얼의 힘으로만 승부하는 레이아웃. 포트폴리오 전시용.
      return (
        <section key={sec} className="space-y-4">
          <div className="flex justify-between items-baseline border-b pb-2 dark:border-white/10">
            <h3 className={`text-xl font-bold ${textColor}`}>{koreanTitle} 전시 갤러리</h3>
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E]">Pattern 08: Gallery Only</span>
          </div>
          
          {/* 텍스트 배제, 오직 이미지의 힘으로만 승부 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((gNum) => (
              <EditableImage key={gNum} sectionKey={`${sec}-gal-item-${gNum}`} defaultUrl={images[gNum % images.length]} className="h-44 rounded-xl border border-black/5 shadow-sm" />
            ))}
          </div>
        </section>
      );

    case 8:
      // 9. 지그재그 레이아웃 (Zig-Zag Layout)
      // - 시선이 Z 모양으로 움직이도록 [좌 이미지/우 텍스트] ➔ [좌 텍스트/우 이미지] 형태로 번갈아 배치하여 가독성과 참여율을 높이는 구조.
      return (
        <section key={sec} className="space-y-12">
          <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E] block w-fit">Pattern 09: Zig-Zag (Z-Pattern)</span>
          
          <div className="space-y-12">
            {/* 좌 이미지 / 우 텍스트 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <EditableImage sectionKey={`${sec}-zig-1`} defaultUrl={images[0]} className="flex-1 w-full h-56 rounded-xl shadow-sm border" />
              <div className="flex-1 text-left space-y-2">
                <h4 className={`font-bold text-lg ${textColor}`}>01. 본질의 이해</h4>
                <p className={`text-xs ${subTextColor} leading-relaxed`}>{contentText}</p>
              </div>
            </div>

            {/* 좌 텍스트 / 우 이미지 */}
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <EditableImage sectionKey={`${sec}-zig-2`} defaultUrl={images[1]} className="flex-1 w-full h-56 rounded-xl shadow-sm border" />
              <div className="flex-1 text-left space-y-2">
                <h4 className={`font-bold text-lg ${textColor}`}>02. 실전 고도화 배포</h4>
                <p className={`text-xs ${subTextColor} leading-relaxed`}>{contentText}</p>
              </div>
            </div>
          </div>
        </section>
      );

    case 9:
      // 10. F-패턴 레이아웃 (F-Pattern Layout)
      // - 사용자가 글을 읽을 때 왼쪽 상단 위주로 먼저 스캔하는 F자 습성을 고려하여, 핵심 헤드라인과 네비게이션, 중요 CTA를 철저히 좌측 상단 흐름에 배치하는 장문 최적화 구조.
      return (
        <section key={sec} className={`rounded-2xl p-8 border ${cardBg} space-y-6 text-left`}>
          <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E]">Pattern 10: F-Pattern Layout</span>
          
          {/* 좌측 상단 위주 밀집 설계 */}
          <div className="space-y-4 max-w-2xl">
            <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${textColor}`}>
              {koreanTitle} 핵심 리포트
            </h1>
            <div className="w-12 h-1 rounded" style={{ backgroundColor: accentColor }} />
            
            <p className={`text-xs ${subTextColor} leading-relaxed`}>
              독자의 시선은 언제나 좌측 상단을 1순위로 스캔합니다. 가장 매혹적인 요약 정보와 가독성 장치를 여기에 밀집 배치하여, 시선 흐름이 끊기지 않고 자연스럽게 머무르도록 유도합니다.
            </p>

            <div className="pt-2">
              {/* 좌측 정렬 중요 CTA */}
              <button className="px-8 py-3 rounded-lg text-xs font-bold transition-transform hover:scale-103 shadow-md"
                style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
                1분 무료 진단 신청하기
              </button>
            </div>
          </div>
        </section>
      );

    case 10:
      // 11. 인터랙티브 레이아웃 (Interactive Layout)
      // - 사용자의 클릭, 스크롤, 슬라이더 조작에 따라 화면이 동적으로 반응하거나 가상 체험을 유도하는 몰입형 구조.
      return (
        <section key={sec} className={`rounded-2xl p-6 border ${cardBg} space-y-6 text-left`}>
          <div className="flex justify-between items-center border-b pb-3 dark:border-white/10">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E]">Pattern 11: Interactive Layout</span>
            <span className="text-[9px] text-green-600 bg-green-50 px-2 py-0.5 rounded">가상 체험 시뮬레이터</span>
          </div>

          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${textColor}`}>인터랙티브 대시보드</h3>
            
            {/* 클릭 조작 탭 */}
            <div className="flex gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
              {["코칭 서비스", "포트폴리오", "실시간 분석"].map((tabLabel, tIdx) => (
                <button
                  key={tabLabel}
                  onClick={() => setActiveTab(tIdx)}
                  className={`flex-1 text-[11px] py-2 rounded-md transition-all font-pretendard ${
                    activeTab === tIdx
                      ? "bg-white text-black shadow font-semibold dark:bg-[#1C1410] dark:text-white"
                      : "text-[#8C7A6A] hover:bg-black/5"
                  }`}
                >
                  {tabLabel}
                </button>
              ))}
            </div>

            {/* 슬라이더 조작 (동적 반응) */}
            <div className="space-y-2 border p-4 rounded-xl dark:border-white/10 bg-black/5 dark:bg-white/5">
              <div className="flex justify-between text-xs">
                <span className={textColor}>시스템 가동 예산</span>
                <span className="font-bold text-[#C8A97E]">{sliderValue} 만원</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full accent-[#C8A97E]"
              />
              <p className={`text-[10px] ${subTextColor} text-center mt-1`}>
                예산에 따라 매칭되는 최적화 파이프라인 개수: <span className="font-bold text-white bg-[#C8A97E] px-1.5 py-0.25 rounded-md">{Math.round(sliderValue / 15)}개</span>
              </p>
            </div>

            {/* 탭 반응 설명 */}
            <div className="p-4 rounded-xl bg-white dark:bg-white/5 border dark:border-white/10 text-xs text-[#8C7A6A] dark:text-white/80 leading-relaxed">
              {activeTab === 0 && <p>🎯 {bizName} 퍼스널 컨설팅: {contentText}</p>}
              {activeTab === 1 && <p>📂 12가지 독창적 시각 아키텍처 포트폴리오를 적용하여 기계적 그리드 배열을 원천 극복합니다.</p>}
              {activeTab === 2 && <p>📊 예산 {sliderValue}만원에 튜닝되는 자동화 파이프라인 분석 리포트를 즉시 사출해냅니다.</p>}
            </div>
          </div>
        </section>
      );

    default:
      // 12. 애니메이션 레이아웃 (Animation Layout)
      // - 스크롤을 내릴 때 요소들이 스르륵 나타나거나(Fade-in), 제품의 작동 모습을 짧은 모션 그래픽으로 직관적(CSS/키프레임)으로 보여주는 구조.
      return (
        <section key={sec} className={`group rounded-2xl p-6 border transition-all duration-500 hover:scale-[1.02] hover:shadow-lg ${cardBg}`}>
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E]">Pattern 12: Animation Layout</span>
            <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded animate-pulse">실시간 모션 그래픽 작동 중</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3 text-left">
              <h3 className={`text-xl font-bold ${textColor}`}>{koreanTitle} 엔진</h3>
              <p className={`text-xs ${subTextColor} leading-relaxed`}>{contentText}</p>
            </div>
            
            {/* 제품 작동 모습을 모사하는 짧은 모션 그래픽 UI (CSS 애니메이션) */}
            <div className="h-44 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center relative overflow-hidden border dark:border-white/10">
              <div className="absolute inset-0 flex items-center justify-center opacity-25">
                <div className="w-32 h-32 rounded-full border border-dashed border-[#C8A97E] animate-spin-slow" />
              </div>
              <div className="relative z-10 flex flex-col items-center space-y-3">
                {/* 펄스 파동 그래픽 */}
                <div className="flex items-end gap-1.5 h-12">
                  <div className="w-1 bg-[#C8A97E] rounded-full animate-[pulse_1s_infinite_100ms] h-8" />
                  <div className="w-1 bg-white rounded-full animate-[pulse_1.2s_infinite_300ms] h-12" />
                  <div className="w-1 bg-[#C8A97E] rounded-full animate-[pulse_0.8s_infinite_0s] h-6" />
                  <div className="w-1 bg-white rounded-full animate-[pulse_1.4s_infinite_500ms] h-10" />
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#C8A97E] animate-pulse">
                  System Processing...
                </span>
              </div>
            </div>
          </div>
        </section>
      );
  }
}

export default function LivePreviewRenderer() {
  const {
    selectedTemplate,
    selectedCategory,
    modifyOptions,
    userInputs,
    imageMode,
    uploadedImageUrl,
    selectedStockImages,
    logoUrl,
  } = useBriefStore();

  if (!selectedTemplate) return null;

  const { layoutType } = selectedTemplate;

  const accentColor = userInputs.pickedColor || selectedTemplate.colors.accent;
  const bizName = userInputs.businessName || selectedTemplate.name;
  const bizDesc = userInputs.description || selectedTemplate.tagline;
  const contact = userInputs.contact || "";
  const sections = userInputs.sectionOrder
    ? userInputs.sectionOrder.split("→").map(s => s.trim()).filter(Boolean)
    : selectedTemplate.sections;

  const images = useMemo(() => {
    const templateId = selectedTemplate.id;
    const fallbacks = TEMPLATE_DEFAULTS[templateId] || [
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80"
    ];

    let resolved = [...fallbacks];

    if (imageMode === "upload" && uploadedImageUrl) {
      resolved[0] = uploadedImageUrl;
    } else if (imageMode === "stock" && selectedStockImages.length > 0) {
      selectedStockImages.forEach((img, idx) => {
        if (idx < resolved.length) {
          resolved[idx] = img;
        }
      });
    }

    return resolved;
  }, [selectedTemplate.id, imageMode, uploadedImageUrl, selectedStockImages]);

  const { navMenus } = useBriefStore();

  const props = {
    template: selectedTemplate,
    category: selectedCategory,
    isMultiPage: modifyOptions.isMultiPage,
    accentColor,
    bizName,
    bizDesc,
    sections,
    images,
    logoUrl,
    contact,
    navMenus: navMenus && navMenus.length > 0 ? navMenus : ["OVERVIEW", "COLLECTION", "STORY", "CONTACT"],
  };

  switch (layoutType) {
    case "vertical": return <VerticalLayout {...props} />;
    case "grid": return <GridLayout {...props} />;
    case "overlay": return <OverlayLayout {...props} />;
    case "finedining": return <FineDiningLayout {...props} />;
    case "casual": return <CasualLayout {...props} />;
    case "dynamic": return <DynamicLayout {...props} />;
    default: return <VerticalLayout {...props} />;
  }
}

interface LayoutProps {
  template: Template;
  category: string;
  isMultiPage: boolean;
  accentColor: string;
  bizName: string;
  bizDesc: string;
  sections: string[];
  images: string[];
  logoUrl: string | null;
  contact: string;
  navMenus: string[];
}

// ─────────────────────────────────────────────
// 1. VERTICAL LAYOUT (미니멀 카페, 신뢰 학원 등)
// ─────────────────────────────────────────────
function VerticalLayout({ template, isMultiPage, accentColor, bizName, bizDesc, sections, images, logoUrl, contact, navMenus }: LayoutProps) {
  const { colors, fonts } = template;
  const navBg = "#FAFAF9";
  const editorialBg = "#FAF9F6";
  const borderCol = "#EAE6DF";

  return (
    <div className="min-h-full w-full flex flex-col font-pretendard" style={{ backgroundColor: editorialBg, fontFamily: fonts.body }}>
      {/* Editorial Nav */}
      <nav className="flex items-center justify-between px-10 py-6 sticky top-0 z-10 border-b" style={{ backgroundColor: navBg, borderColor: borderCol }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-7 max-w-[140px] object-contain transition-transform hover:scale-102" />
        ) : (
          <span className="text-sm font-bold tracking-[0.25em] uppercase font-serif-kr text-[#1C1410]" style={{ fontFamily: fonts.heading }}>
            {bizName}
          </span>
        )}
        <div className="flex gap-8">
          {navMenus.map(i => (
            <span key={i} className="text-[10px] tracking-wider font-semibold cursor-pointer hover:text-[#C8A97E] transition-colors text-[#5C4A3A]">{i}</span>
          ))}
        </div>
      </nav>

      {/* Editorial Hero: 2-Column Asymmetric Asymmetric Layout */}
      <header className="px-10 py-20 md:py-28 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left Typography Column (7 Cols) */}
        <div className="md:col-span-7 space-y-8 text-left">
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C8A97E]">EDITORIAL COLLECTION</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] text-[#1C1410] font-serif-kr tracking-tight" style={{ fontFamily: fonts.heading }}>
            {bizDesc}
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-[#5C4A3A] font-pretendard max-w-lg">
            {bizName}가 선보이는 정제된 미학의 아카이브입니다. 본질적인 형태와 사유의 공간 속에서 최적의 균형을 발견해 보십시오.
          </p>
          <div className="pt-2">
            <button className="px-7 py-3 rounded-none text-xs tracking-wider uppercase font-bold border border-[#1C1410] text-[#1C1410] hover:bg-[#1C1410] hover:text-white transition-all cursor-pointer">
              DISCOVER ARCHIVE
            </button>
          </div>
        </div>

        {/* Right Editorial Aspect Image Column (5 Cols) */}
        <div className="md:col-span-5 flex justify-center md:justify-end">
          <div className="relative w-full max-w-[340px] aspect-[3/4] bg-[#F2EDE6] overflow-hidden shadow-2xl border border-[#E8E0D8]/45">
            <EditableImage
              sectionKey="hero"
              defaultUrl={images[0]}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Elegant overlay frame accent */}
            <div className="absolute inset-4 border border-white/30 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* 12가지 레이아웃 구조 패턴 순차 순회 */}
      <main className="flex-1 px-10 py-16 max-w-6xl mx-auto w-full space-y-20 border-t border-[#EAE6DF]">
        {sections.filter(s => s !== 'hero').map((sec, i) => (
          <PatternSectionRenderer
            key={sec}
            sec={sec}
            idx={i}
            template={template}
            accentColor={accentColor}
            bizName={bizName}
            images={images}
            themeMode="light"
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-10 border-t text-center text-[10px] tracking-wider opacity-70 mt-auto border-[#EAE6DF]" style={{ color: "#5C4A3A", backgroundColor: "#FAFAF9" }}>
        <p className="font-bold mb-3 uppercase tracking-widest">{bizName}</p>
        {contact && <p className="mb-3">INQUIRY: {contact}</p>}
        <p>© {new Date().getFullYear()} {bizName.toUpperCase()}. DESIGNED EDITORIAL ARCHIVE.</p>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. GRID LAYOUT (빈티지 브런치, 크리에이티브 클래스 등)
// ─────────────────────────────────────────────
function GridLayout({ template, accentColor, bizName, bizDesc, sections, images, logoUrl, contact }: LayoutProps) {
  const { colors, fonts } = template;
  const gridBorder = "border-[#E5E7EB] dark:border-white/10";

  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#F9FAFB]" style={{ fontFamily: fonts.body }}>
      {/* Grid Centered Nav */}
      <nav className="grid grid-cols-3 items-center px-10 py-5 border-b bg-white" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex gap-4">
          {sections.slice(0, 2).map(sec => (
            <span key={sec} className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-black cursor-pointer">{SECTION_KR[sec] ?? sec}</span>
          ))}
        </div>
        <div className="flex justify-center">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-6 max-w-[130px] object-contain" />
          ) : (
            <span className="text-lg font-bold tracking-widest text-black uppercase" style={{ fontFamily: fonts.heading }}>{bizName}</span>
          )}
        </div>
        <div className="flex justify-end gap-4">
          <span className="text-xs font-bold text-gray-400">CONNECTING // 2GOSOO</span>
        </div>
      </nav>

      {/* Grid Hero: Pinterest-style Floating Cards */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b" style={{ borderColor: "#E5E7EB" }}>
        {/* Left Info Column (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center p-12 lg:p-20 bg-white border-r" style={{ borderColor: "#E5E7EB" }}>
          <div className="w-10 h-10 rounded-sm mb-6 flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: accentColor }}>
            M
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-6 leading-tight tracking-tight text-gray-900 font-serif-kr" style={{ fontFamily: fonts.heading }}>
            {bizDesc}
          </h1>
          <p className="text-sm text-gray-600 mb-10 leading-relaxed max-w-lg">
            {bizName}는 정교한 모듈식 배열과 레이아웃 격자를 활용해 가장 기능적이면서도 예술적인 사용성을 설계합니다.
          </p>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 rounded-lg font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer"
              style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
              GET STARTED
            </button>
            <button className="px-6 py-3 rounded-lg border font-bold text-xs tracking-wider uppercase bg-transparent text-gray-700 hover:bg-gray-50 transition-all cursor-pointer">
              READ BRIEF
            </button>
          </div>
        </div>

        {/* Right Floating Pinterest Layout Column (5 Cols) */}
        <div className="lg:col-span-5 p-8 bg-gray-50 flex items-center justify-center relative min-h-[380px]">
          <div className="relative w-full max-w-[320px] h-[320px]">
            {/* Main floating card */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl border border-gray-200/50">
              <EditableImage sectionKey="hero" defaultUrl={images[0]} className="w-full h-full" />
            </div>
            {/* Secondary overlapping float badge card */}
            <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 flex flex-col justify-between transform -rotate-6 hover:rotate-0 transition-transform">
              <EditableImage sectionKey="grid-hero-sub" defaultUrl={images[1 % images.length]} className="w-full h-16 rounded-lg overflow-hidden" />
              <p className="text-[9px] font-bold text-center mt-1 text-gray-800">CRAFT VIBE</p>
            </div>
          </div>
        </div>
      </header>

      {/* 12가지 레이아웃 구조 패턴 순차 순회 */}
      <main className="flex-1 px-10 py-16 max-w-6xl mx-auto w-full space-y-20">
        {sections.filter(s => s !== 'hero').map((sec, i) => (
          <PatternSectionRenderer
            key={sec}
            sec={sec}
            idx={i}
            template={template}
            accentColor={accentColor}
            bizName={bizName}
            images={images}
            themeMode="light"
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-10 border-t bg-white text-center text-xs opacity-60 mt-auto" style={{ color: colors.text, borderColor: "#E5E7EB" }}>
        <p className="font-bold mb-2 tracking-widest uppercase">{bizName}</p>
        {contact && <p className="mb-2">CONTACT: {contact}</p>}
        <p>© {new Date().getFullYear()} {bizName.toUpperCase()}. GRID ARCHITECTURE PLATFORM.</p>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. OVERLAY LAYOUT (모던 스페셜티, 온라인 강좌 등)
// ─────────────────────────────────────────────
function OverlayLayout({ template, accentColor, bizName, bizDesc, sections, images, logoUrl, contact }: LayoutProps) {
  const { colors, fonts } = template;
  
  return (
    <div className="min-h-full w-full bg-[#060608] text-white relative font-sans" style={{ fontFamily: fonts.body }}>
      {/* Cinematic Fullscreen Background Image with Dark Vignette */}
      <div className="fixed inset-0 z-0">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="w-full h-full opacity-65" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-[#060608] pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col min-h-full">
        {/* Glassmorphism Header */}
        <nav className="flex justify-between items-center p-8 bg-black/10 backdrop-blur-md border-b border-white/5 sticky top-0">
          {logoUrl ? (
            <div className="relative p-1">
              <img src={logoUrl} alt="Logo" className="h-7 max-w-[140px] object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            </div>
          ) : (
            <span className="text-xl font-black tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]" style={{ fontFamily: fonts.heading }}>
              {bizName.toUpperCase()}
            </span>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider font-bold bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">CINEMATIC MODE</span>
          </div>
        </nav>

        <header className="flex-1 flex flex-col justify-center px-10 lg:px-24 py-28 relative min-h-[75vh]">
          {/* Neon Point bar */}
          <div className="w-20 h-1 mb-8 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]" style={{ backgroundColor: accentColor }} />
          <h1 className="text-5xl lg:text-7xl font-extralight leading-[1.08] mb-8 tracking-tight font-serif-kr text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]" style={{ fontFamily: fonts.heading }}>
            {bizDesc}
          </h1>
          <p className="text-base md:text-lg max-w-2xl text-white/70 mb-12 leading-relaxed font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            영화의 한 장면처럼 몰입도 높은 어두운 배경 위에 미니멀 타이포를 극대화한 오버레이 레이아웃입니다. 브랜드의 첫 인상을 강렬하게 시각화합니다.
          </p>
          <div className="flex items-center gap-6">
            <button className="px-9 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:scale-103 cursor-pointer"
              style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
              ENTER SYSTEM
            </button>
            <span className="uppercase tracking-widest text-[10px] font-bold text-white/50 hover:text-white cursor-pointer transition-opacity animate-pulse">
              SCROLL TO ARCHIVE ↓
            </span>
          </div>
        </header>

        {/* 12가지 다크 레이아웃 구조 패턴 순회 */}
        <div className="px-10 lg:px-24 py-24 bg-[#0A0A0C]/90 backdrop-blur-2xl border-t border-white/5 mt-auto space-y-20">
          {sections.filter(s => s !== 'hero').map((sec, i) => (
            <PatternSectionRenderer
              key={sec}
              sec={sec}
              idx={i}
              template={template}
              accentColor={accentColor}
              bizName={bizName}
              images={images}
              themeMode="dark"
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="w-full py-10 px-8 border-t border-white/5 text-center text-xs opacity-50 mt-auto text-white bg-black">
          <p className="font-semibold mb-2">{bizName}</p>
          {contact && <p className="mb-2">Contact: {contact}</p>}
          <p>© {new Date().getFullYear()} {bizName}. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. FINE DINING LAYOUT (파인다이닝 전용)
// ─────────────────────────────────────────────
function FineDiningLayout({ template, accentColor, bizName, bizDesc, sections, images, logoUrl, contact }: LayoutProps) {
  const { colors, fonts } = template;
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard" style={{ backgroundColor: colors.bg, fontFamily: fonts.body, color: colors.text }}>
      {/* Luxury Grand Centered Header */}
      <nav className="flex flex-col items-center justify-center py-10 border-b border-black/5 bg-white">
        <span className="text-[9px] tracking-[0.4em] text-gray-400 font-bold block mb-4">ESTABLISHED IN 2GOSOO</span>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-12 max-w-[200px] object-contain transition-transform hover:scale-102" />
        ) : (
          <h1 className="text-3xl font-light tracking-[0.2em] font-serif-kr uppercase text-[#1C1410]" style={{ fontFamily: fonts.heading, color: accentColor }}>
            {bizName}
          </h1>
        )}
      </nav>
      
      {/* Signature Dish Hero with Double Gold Frame Panel */}
      <header className="relative h-[75vh] flex items-center justify-center text-center px-6">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />
        
        {/* Frame Box */}
        <div className="relative z-10 max-w-2xl p-8 md:p-12 border-2 border-white/20 backdrop-blur-sm bg-black/20">
          {/* Inner accent frame line */}
          <div className="absolute inset-1 border border-white/10 pointer-events-none" />
          <p className="text-xs tracking-[0.35em] mb-4 uppercase text-[#C8A97E]">PREMIUM CULINARY ART</p>
          <h2 className="text-4xl md:text-5xl font-extralight mb-8 text-white font-serif-kr leading-tight" style={{ fontFamily: fonts.heading }}>
            {bizDesc}
          </h2>
          <button className="px-8 py-3.5 border border-white/60 text-white text-xs tracking-wider font-semibold bg-transparent hover:bg-white hover:text-black transition-colors rounded-none">
            RESERVE PRIVATE TABLE
          </button>
        </div>
      </header>

      {/* Course Menu Section */}
      <section className="py-24 px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.3em] text-[#C8A97E] uppercase font-bold mb-2">CURATED EXPERIENCE</p>
          <h3 className="text-3xl md:text-4xl font-light mb-4 font-serif-kr" style={{ fontFamily: fonts.heading }}>Tasting Menu</h3>
          <div className="w-12 h-0.5 mx-auto" style={{ backgroundColor: accentColor }} />
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Lunch Course */}
          <div className="p-8 md:p-10 border bg-white border-black/5 shadow-xl relative rounded-none" style={{ backgroundColor: colors.surface }}>
            {/* Decorative Gold Top Edge */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accentColor }} />
            <h4 className="text-xl font-bold mb-8 text-center font-serif-kr uppercase tracking-wider" style={{ color: accentColor }}>Lunch Course</h4>
            <div className="space-y-6">
              {[
                { name: "Amuse-Bouche", desc: "제철 식재료를 활용한 세 가지 한입 거리" },
                { name: "Appetizer", desc: "캐비어를 곁들인 단새우 타르타르" },
                { name: "Main Dish", desc: "최상급 한우 채끝 스테이크와 트러플 매쉬" },
                { name: "Signature Dessert", desc: "바닐라 빈 몽블랑과 계절 과일" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline border-b pb-4 border-black/5 text-left">
                  <div>
                    <p className="text-sm font-bold text-gray-950 font-serif-kr">{item.name}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xl font-semibold mt-10 font-serif-kr" style={{ fontFamily: fonts.heading }}>120,000 KRW</p>
          </div>

          {/* Dinner Course */}
          <div className="p-8 md:p-10 border bg-white border-black/5 shadow-xl relative rounded-none" style={{ backgroundColor: colors.surface }}>
            {/* Decorative Gold Top Edge */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accentColor }} />
            <h4 className="text-xl font-bold mb-8 text-center font-serif-kr uppercase tracking-wider" style={{ color: accentColor }}>Dinner Course</h4>
            <div className="space-y-6">
              {[
                { name: "Amuse-Bouche", desc: "다섯 가지 시그니처 아뮤즈 부쉬" },
                { name: "Seafood Choice", desc: "숯불에 구운 랍스터와 뵈르블랑 소스" },
                { name: "Signature Main", desc: "드라이에이징 한우 안심과 포트와인 쥬" },
                { name: "Grand Dessert", desc: "시그니처 초콜릿 텍스처" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline border-b pb-4 border-black/5 text-left">
                  <div>
                    <p className="text-sm font-bold text-gray-950 font-serif-kr">{item.name}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xl font-semibold mt-10 font-serif-kr" style={{ fontFamily: fonts.heading }}>250,000 KRW</p>
          </div>
        </div>
      </section>

      {/* 12가지 레이아웃 구조 패턴 순차 순회 */}
      <main className="flex-1 px-8 py-16 max-w-5xl mx-auto w-full space-y-16 border-t border-black/10">
        {sections.filter(s => s !== 'hero').map((sec, i) => (
          <PatternSectionRenderer
            key={sec}
            sec={sec}
            idx={i}
            template={template}
            accentColor={accentColor}
            bizName={bizName}
            images={images}
            themeMode="light"
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-8 border-t text-center text-xs opacity-60 mt-auto border-black/10 bg-white" style={{ color: colors.text }}>
        <p className="font-semibold mb-2 uppercase tracking-widest">{bizName}</p>
        {contact && <p className="mb-2">CONTACT: {contact}</p>}
        <p>© {new Date().getFullYear()} {bizName}. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. CASUAL DINING LAYOUT (캐주얼 다이닝 전용)
// ─────────────────────────────────────────────
function CasualLayout({ template, accentColor, bizName, bizDesc, sections, images, logoUrl, contact }: LayoutProps) {
  const { colors, fonts } = template;
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard" style={{ backgroundColor: colors.bg, fontFamily: fonts.body, color: colors.text }}>
      {/* Friendly Badge-styled Nav */}
      <nav className="flex justify-between items-center px-8 py-5 sticky top-0 z-20 shadow-md border-b-2" style={{ backgroundColor: colors.surface, borderColor: accentColor }}>
        {logoUrl ? (
          <div className="px-3 py-1 bg-white rounded-full border shadow-sm">
            <img src={logoUrl} alt="Logo" className="h-6 max-w-[130px] object-contain" />
          </div>
        ) : (
          <div className="px-4 py-1.5 rounded-full text-white font-extrabold text-lg tracking-wider" style={{ backgroundColor: colors.primary }}>
            {bizName}
          </div>
        )}
        <button className="px-6 py-2.5 rounded-full font-extrabold text-xs tracking-wider uppercase transition-transform active:scale-95 shadow-md" style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
          JOIN WAITING
        </button>
      </nav>

      {/* Vibrant Pop Hero with Blob Mockup */}
      <header className="p-6 md:p-8">
        <div className="rounded-[2rem] overflow-hidden relative min-h-[460px] flex items-center p-8 md:p-14 shadow-2xl" style={{ backgroundColor: colors.primary }}>
          {/* Fun pattern dots overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
          
          <div className="relative z-10 max-w-md text-white text-left">
            <span className="inline-block px-4 py-1 rounded-full text-[10px] font-black mb-4 tracking-wider shadow" style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>★ POPULAR CHOICE ★</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.15] font-serif-kr" style={{ fontFamily: fonts.heading }}>{bizDesc}</h2>
            <p className="text-sm opacity-90 mb-8 font-medium leading-relaxed">경쾌하고 경쾌한 감성으로 채운 공간! {bizName}가 전하는 맛과 멋의 향연을 함께 즐겨요.</p>
            <button className="px-8 py-3.5 rounded-2xl font-black text-xs tracking-wider uppercase shadow-xl hover:scale-102 transition-transform" style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
              DISCOVER MORE ➔
            </button>
          </div>
          
          {/* Rounded Blob masked image */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-96 h-96 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] overflow-hidden shadow-2xl border-4 border-white/20 hidden lg:block">
            <EditableImage sectionKey="hero" defaultUrl={images[0]} className="w-full h-full object-cover scale-102" />
          </div>
        </div>
      </header>

      {/* Photo Menu Board */}
      <section className="py-16 px-6 md:px-8 max-w-7xl mx-auto w-full border-b border-black/5 text-left">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 block mb-2">HOT SELLER</span>
            <h3 className="text-3xl font-black font-serif-kr text-gray-900" style={{ fontFamily: fonts.heading }}>대표 시그니처</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all bg-white border border-gray-100 pb-4 group cursor-pointer text-left">
              <div className="h-44 bg-gray-100 relative overflow-hidden">
                <EditableImage sectionKey={`menu-${i}`} defaultUrl={images[i % images.length]} className="w-full h-full transition-transform duration-500 group-hover:scale-103" />
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur rounded-full text-[9px] font-black shadow z-10" style={{ color: accentColor }}>
                  HIT MENU
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2 text-black">
                  <h4 className="text-base font-bold">시그니처 요리 {i}</h4>
                  <span className="font-extrabold text-sm" style={{ color: accentColor }}>₩15,000</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">엄선된 신선한 재료로 요리해 드리는 {bizName}의 베스트셀러 스펙입니다.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12가지 레이아웃 구조 패턴 순차 순회 */}
      <main className="flex-1 px-6 md:px-8 py-16 max-w-6xl mx-auto w-full space-y-16">
        {sections.filter(s => s !== 'hero').map((sec, i) => (
          <PatternSectionRenderer
            key={sec}
            sec={sec}
            idx={i}
            template={template}
            accentColor={accentColor}
            bizName={bizName}
            images={images}
            themeMode="light"
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-8 border-t text-center text-xs opacity-60 mt-auto border-black/10 bg-white" style={{ color: colors.text }}>
        <p className="font-semibold mb-2 uppercase tracking-widest">{bizName}</p>
        {contact && <p className="mb-2">연락처: {contact}</p>}
        <p>© {new Date().getFullYear()} {bizName}. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────
// 6. DYNAMIC MOTION & INTERACTIVE LAYOUT (동적 인터랙티브 전용)
// ─────────────────────────────────────────────
function DynamicLayout({ template, isMultiPage, accentColor, bizName, bizDesc, sections, images, logoUrl, contact, navMenus }: LayoutProps) {
  const { fonts } = template;
  const darkBg = "#0A0D14";
  const neonAccent = accentColor || "#00F2FE";

  return (
    <div className="min-h-full w-full flex flex-col font-pretendard text-white selection:bg-cyan-500 selection:text-black overflow-hidden" style={{ backgroundColor: darkBg, fontFamily: fonts.body }}>
      {/* 1. Infinite Running Ticker Banner */}
      <div className="w-full py-2 bg-black/60 border-b border-white/10 overflow-hidden flex whitespace-nowrap">
        <div className="flex gap-8 text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase animate-pulse">
          <span>⚡ DYNAMIC MOTION ARCHITECTURE</span>
          <span>•</span>
          <span>3D WEBGL & FRAMER MOTION</span>
          <span>•</span>
          <span>INTERACTIVE LIVING UI</span>
          <span>•</span>
          <span>ULTRA SMOOTH SCROLL</span>
          <span>•</span>
          <span>⚡ DYNAMIC MOTION ARCHITECTURE</span>
          <span>•</span>
          <span>3D WEBGL & FRAMER MOTION</span>
        </div>
      </div>

      {/* 2. Dynamic Glassmorphic Nav */}
      <nav className="flex items-center justify-between px-8 py-5 sticky top-0 z-30 backdrop-blur-xl bg-[#0A0D14]/80 border-b border-white/10">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-7 max-w-[130px] object-contain drop-shadow-[0_0_8px_rgba(0,242,254,0.4)]" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-sm font-black tracking-wider uppercase font-serif-kr text-white" style={{ fontFamily: fonts.heading }}>
                {bizName}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-[11px] tracking-widest text-gray-400 font-medium">
            {navMenus.map((menu) => (
              <span key={menu} className="hover:text-cyan-400 transition-colors cursor-pointer">{menu}</span>
            ))}
          </div>
          <button
            className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(0,242,254,0.3)] cursor-pointer"
            style={{ backgroundColor: neonAccent, color: isDark(neonAccent) ? "#FFF" : "#000" }}
          >
            START DEMO
          </button>
        </div>
      </nav>

      {/* 3. Hero: Kinetic Motion Visual Canvas */}
      <header className="relative px-8 py-20 md:py-28 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Neon Glow Blobs behind */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-300 font-bold">NEXT-GEN INTERACTIVE LAB</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight font-serif-kr text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400" style={{ fontFamily: fonts.heading }}>
            {bizDesc}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl font-light">
            정적인 웹사이트의 틀을 깨고, 스크롤 인터랙션과 실시간 마이크로 모션으로 방문자에게 압도적인 몰입감을 선사합니다. {bizName}의 미래형 디지털 경험을 탐색하세요.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              className="px-8 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,242,254,0.5)] hover:-translate-y-0.5 cursor-pointer"
              style={{ backgroundColor: neonAccent, color: isDark(neonAccent) ? "#FFF" : "#000" }}
            >
              LAUNCH PROJECT ➔
            </button>
            <button className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all cursor-pointer">
              VIEW MOTION SHOWCASE
            </button>
          </div>
        </div>

        {/* Right Column: 3D Floating Interactive Card (5 Cols) */}
        <div className="lg:col-span-5 relative z-10 flex justify-center">
          <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl p-2 bg-gradient-to-br from-white/15 to-white/5 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.02]">
            <div className="w-full h-full rounded-xl overflow-hidden relative">
              <EditableImage
                sectionKey="hero"
                defaultUrl={images[0]}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <span className="text-[9px] font-mono text-cyan-400 block mb-1">INTERACTIVE SHOWCASE</span>
                  <p className="text-xs font-bold text-white">Dynamic Visual Canvas</p>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur text-[10px] font-mono text-white">
                  60 FPS
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4. Motion Metric Grid */}
      <section className="py-12 px-8 max-w-7xl mx-auto w-full border-y border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {[
            { label: "FRAME RATE", val: "120 FPS", sub: "Ultra Smooth Interaction" },
            { label: "LIGHTHOUSE", val: "99.8%", sub: "Optimized Performance" },
            { label: "LOAD SPEED", val: "0.4s", sub: "Instant Asset Delivery" },
            { label: "ENGAGEMENT", val: "+240%", sub: "High Conversion Motion" }
          ].map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
              <span className="text-[9px] font-mono text-cyan-400 tracking-wider block mb-1">{m.label}</span>
              <p className="text-2xl font-black font-mono text-white mb-1">{m.val}</p>
              <p className="text-[10px] text-gray-400">{m.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 12가지 레이아웃 구조 패턴 순차 순회 (다크 테마) */}
      <main className="flex-1 px-8 py-20 max-w-6xl mx-auto w-full space-y-20">
        {sections.filter(s => s !== 'hero').map((sec, i) => (
          <PatternSectionRenderer
            key={sec}
            sec={sec}
            idx={i}
            template={template}
            accentColor={neonAccent}
            bizName={bizName}
            images={images}
            themeMode="dark"
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 border-t border-white/10 text-center text-xs text-gray-500 mt-auto bg-[#07090E]">
        <p className="font-bold mb-2 uppercase tracking-widest text-gray-300">{bizName}</p>
        {contact && <p className="mb-2 text-gray-400">연락처: {contact}</p>}
        <p className="font-mono text-[10px]">© {new Date().getFullYear()} {bizName}. Dynamic Motion Engine. All rights reserved.</p>
      </footer>
    </div>
  );
}
