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
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
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
    contact
  };

  switch (layoutType) {
    case "vertical": return <VerticalLayout {...props} />;
    case "grid": return <GridLayout {...props} />;
    case "overlay": return <OverlayLayout {...props} />;
    case "finedining": return <FineDiningLayout {...props} />;
    case "casual": return <CasualLayout {...props} />;
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
}

// ─────────────────────────────────────────────
// 1. VERTICAL LAYOUT (미니멀 카페, 신뢰 학원 등)
// ─────────────────────────────────────────────
function VerticalLayout({ template, isMultiPage, accentColor, bizName, bizDesc, sections, images, logoUrl, contact }: LayoutProps) {
  const { colors, fonts } = template;
  const heroDark = isDark(colors.primary);
  const navBg = colors.surface ?? colors.bg;
  const navText = isDark(navBg) ? "#FFFFFF" : colors.primary;

  return (
    <div className="min-h-full w-full flex flex-col font-pretendard" style={{ backgroundColor: colors.bg, fontFamily: fonts.body }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 sticky top-0 z-10 border-b border-black/5" style={{ backgroundColor: navBg }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-8 max-w-[150px] object-contain" />
        ) : (
          <span className="text-xl font-bold tracking-widest uppercase" style={{ fontFamily: fonts.heading, color: navText }}>
            {bizName}
          </span>
        )}
        <div className="flex gap-6">
          {isMultiPage ? (
            ["Home", "Curriculum", "Teachers", "Reviews"].map(i => (
              <span key={i} className="text-sm cursor-pointer hover:opacity-80" style={{ color: navText }}>{i}</span>
            ))
          ) : (
            ["소개", "서비스", "문의"].map(i => (
              <span key={i} className="text-sm cursor-pointer hover:opacity-80" style={{ color: navText }}>{i}</span>
            ))
          )}
        </div>
      </nav>

      {/* Hero */}
      <EditableImage
        asBackground
        sectionKey="hero"
        defaultUrl={images[0]}
        className="px-8 py-32 flex flex-col items-center text-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.35))`
        }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 relative z-10 leading-tight text-white font-serif-kr" style={{ fontFamily: fonts.heading }}>
          {bizDesc}
        </h1>
        <p className="text-lg md:text-xl mb-10 relative z-10 text-white/90">
          {bizName}에 오신 것을 환영합니다.
        </p>
        <button className="px-8 py-4 rounded-full text-lg font-bold relative z-10 transition-transform hover:scale-105 shadow-md"
          style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
          자세히 알아보기
        </button>
      </EditableImage>

      {/* 12가지 레이아웃 구조 패턴 순차 순회 */}
      <main className="flex-1 px-8 py-16 max-w-5xl mx-auto w-full space-y-16">
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
      <footer className="w-full py-8 px-8 border-t text-center text-xs opacity-60 mt-auto border-black/10" style={{ color: colors.text }}>
        <p className="font-semibold mb-2">{bizName}</p>
        {contact && <p className="mb-2">연락처: {contact}</p>}
        <p>© {new Date().getFullYear()} {bizName}. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. GRID LAYOUT (빈티지 브런치, 크리에이티브 클래스 등)
// ─────────────────────────────────────────────
function GridLayout({ template, accentColor, bizName, bizDesc, sections, images, logoUrl, contact }: LayoutProps) {
  const { colors, fonts } = template;
  const heroDark = isDark(colors.primary);
  const heroText = heroDark ? "#FFFFFF" : "#111111";

  return (
    <div className="min-h-full w-full flex flex-col font-pretendard" style={{ backgroundColor: colors.bg, fontFamily: fonts.body }}>
      <nav className="flex justify-between items-center px-8 py-4 border-b border-black/5" style={{ backgroundColor: colors.surface }}>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: accentColor }} />
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-7 max-w-[130px] object-contain" />
          ) : (
            <span className="text-lg font-bold" style={{ fontFamily: fonts.heading, color: colors.primary }}>{bizName}</span>
          )}
        </div>
        <div className="hidden md:flex gap-4">
          {sections.slice(0, 4).map(sec => (
            <span key={sec} className="text-sm font-medium opacity-70" style={{ color: colors.text }}>{SECTION_KR[sec] ?? sec}</span>
          ))}
        </div>
      </nav>

      {/* Split Hero */}
      <header className="flex flex-col md:flex-row min-h-[60vh]">
        <div className="flex-1 flex flex-col justify-center p-12 lg:p-24" style={{ backgroundColor: colors.primary }}>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight font-serif-kr" style={{ fontFamily: fonts.heading, color: heroText }}>
            {bizDesc}
          </h1>
          <p className="text-lg opacity-80 mb-10 leading-relaxed" style={{ color: heroText }}>
            독창적인 시각과 따뜻한 감성으로 완성된 {bizName}만의 특별한 가치를 경험해보세요.
          </p>
          <button className="px-8 py-4 w-fit font-bold rounded shadow-lg transition-transform hover:-translate-y-1"
            style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
            시작하기
          </button>
        </div>
        <div className="flex-1 relative min-h-[300px]">
          <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(45deg, ${colors.primary}15, transparent)` }} />
        </div>
      </header>

      {/* 12가지 레이아웃 구조 패턴 순차 순회 */}
      <main className="flex-1 px-8 py-16 max-w-5xl mx-auto w-full space-y-16">
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
      <footer className="w-full py-8 px-8 border-t text-center text-xs opacity-60 mt-auto border-black/10" style={{ color: colors.text }}>
        <p className="font-semibold mb-2">{bizName}</p>
        {contact && <p className="mb-2">연락처: {contact}</p>}
        <p>© {new Date().getFullYear()} {bizName}. All rights reserved.</p>
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
    <div className="min-h-full w-full bg-[#000] text-white relative font-sans" style={{ fontFamily: fonts.body }}>
      {/* Fixed Fullscreen Background Image */}
      <div className="fixed inset-0 z-0">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="w-full h-full opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/45 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col min-h-full">
        <nav className="flex justify-between items-center p-8">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-8 max-w-[150px] object-contain" />
          ) : (
            <span className="text-2xl font-black tracking-tighter" style={{ fontFamily: fonts.heading, color: accentColor }}>
              {bizName.toUpperCase()}
            </span>
          )}
          <div className="w-8 h-8 rounded-full border border-white/20 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="w-4 h-0.5 bg-white rounded-full" />
            <div className="w-4 h-0.5 bg-white rounded-full" />
          </div>
        </nav>

        <header className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-20">
          <div className="w-16 h-1 mb-8" style={{ backgroundColor: accentColor }} />
          <h1 className="text-5xl lg:text-7xl font-light leading-tight mb-6 font-serif-kr" style={{ fontFamily: fonts.heading }}>
            {bizDesc.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "font-bold" : ""}>{word} </span>
            ))}
          </h1>
          <p className="text-xl max-w-2xl opacity-70 mb-12 leading-relaxed">
            모던하고 세련된 풀스크린 오버레이 디자인입니다. 영상이나 고품질 화보 이미지를 배경으로 두고, 여백을 살려 고급스러운 분위기를 연출합니다.
          </p>
          <div className="flex items-center gap-6">
            <button className="px-10 py-4 rounded-full font-bold text-lg transition-colors shadow-lg"
              style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
              알아보기
            </button>
            <span className="uppercase tracking-widest text-sm opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
              Scroll Down ↓
            </span>
          </div>
        </header>

        {/* 12가지 다크 레이아웃 구조 패턴 순회 */}
        <div className="px-8 lg:px-24 py-20 bg-black/65 backdrop-blur-md border-t border-white/10 mt-auto space-y-16">
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
        <footer className="w-full py-8 px-8 border-t border-white/10 text-center text-xs opacity-50 mt-auto text-white bg-black">
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
      <nav className="flex justify-center p-8 border-b border-black/5">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-10 max-w-[180px] object-contain" />
        ) : (
          <h1 className="text-3xl font-bold tracking-widest font-serif-kr" style={{ fontFamily: fonts.heading, color: accentColor }}>{bizName}</h1>
        )}
      </nav>
      
      {/* Signature Dish Hero */}
      <header className="relative h-[70vh] flex items-center justify-center text-center">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        <div className="relative z-10 max-w-3xl p-8">
          <p className="text-sm tracking-[0.3em] mb-4 uppercase" style={{ color: accentColor }}>Signature Experience</p>
          <h2 className="text-5xl md:text-6xl font-light mb-8 text-white font-serif-kr" style={{ fontFamily: fonts.heading }}>{bizDesc}</h2>
          <button className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors">
            예약하기
          </button>
        </div>
      </header>

      {/* Course Menu Section */}
      <section className="py-24 px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 font-serif-kr" style={{ fontFamily: fonts.heading }}>Tasting Menu</h3>
          <div className="w-12 h-0.5 mx-auto" style={{ backgroundColor: accentColor }} />
        </div>
        
        <div className="grid md:grid-cols-2 gap-16">
          {/* Lunch Course */}
          <div className="p-10 border shadow-lg rounded-2xl bg-white border-black/5" style={{ backgroundColor: colors.surface }}>
            <h4 className="text-2xl font-bold mb-8 text-center font-serif-kr" style={{ color: accentColor }}>Lunch Course</h4>
            <div className="space-y-6">
              {[
                { name: "Amuse-Bouche", desc: "제철 식재료를 활용한 세 가지 한입 거리" },
                { name: "Appetizer", desc: "캐비어를 곁들인 단새우 타르타르" },
                { name: "Main", desc: "최상급 한우 채끝 스테이크와 트러플 매쉬" },
                { name: "Dessert", desc: "바닐라 빈 몽블랑과 계절 과일" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline border-b pb-4 border-black/5">
                  <div>
                    <p className="text-lg font-bold">{item.name}</p>
                    <p className="text-sm opacity-60 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-2xl font-bold mt-10 font-serif-kr" style={{ fontFamily: fonts.heading }}>120,000 KRW</p>
          </div>

          {/* Dinner Course */}
          <div className="p-10 border shadow-lg rounded-2xl bg-white border-black/5" style={{ backgroundColor: colors.surface }}>
            <h4 className="text-2xl font-bold mb-8 text-center font-serif-kr" style={{ color: accentColor }}>Dinner Course</h4>
            <div className="space-y-6">
              {[
                { name: "Amuse-Bouche", desc: "다섯 가지 시그니처 아뮤즈 부쉬" },
                { name: "Seafood", desc: "숯불에 구운 랍스터와 뵈르블랑 소스" },
                { name: "Main", desc: "드라이에이징 한우 안심과 포트와인 쥬" },
                { name: "Dessert", desc: "시그니처 초콜릿 텍스처" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline border-b pb-4 border-black/5">
                  <div>
                    <p className="text-lg font-bold">{item.name}</p>
                    <p className="text-sm opacity-60 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-2xl font-bold mt-10 font-serif-kr" style={{ fontFamily: fonts.heading }}>250,000 KRW</p>
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
      <footer className="w-full py-8 px-8 border-t text-center text-xs opacity-60 mt-auto border-black/10" style={{ color: colors.text }}>
        <p className="font-semibold mb-2">{bizName}</p>
        {contact && <p className="mb-2">연락처: {contact}</p>}
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
      {/* Friendly Nav */}
      <nav className="flex justify-between items-center px-6 py-4 sticky top-0 z-20 shadow-sm border-b border-black/5" style={{ backgroundColor: colors.surface }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-8 max-w-[140px] object-contain" />
        ) : (
          <h1 className="text-2xl font-black font-serif-kr" style={{ fontFamily: fonts.heading, color: colors.primary }}>{bizName}</h1>
        )}
        <button className="px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity" style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
          웨이팅 등록
        </button>
      </nav>

      {/* Vibrant Hero */}
      <header className="p-6 md:p-12">
        <div className="rounded-3xl overflow-hidden relative h-[50vh] flex items-center p-8 md:p-16 shadow-lg bg-cover bg-center" style={{ backgroundColor: colors.primary }}>
          <div className="relative z-10 max-w-xl text-white">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-wider animate-bounce-slow" style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>NEW OPEN</span>
            <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight font-serif-kr">{bizDesc}</h2>
            <p className="text-lg opacity-90 mb-8 font-medium">맛있는 음식과 신나는 분위기! {bizName}에서 즐거운 시간을 보내세요.</p>
          </div>
          <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 mix-blend-overlay hidden md:block" />
        </div>
      </header>

      {/* Photo Menu Board */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full border-b border-black/10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-3xl font-black font-serif-kr" style={{ fontFamily: fonts.heading, color: colors.primary }}>대표 메뉴</h3>
            <p className="opacity-60 mt-2 text-lg">매일 아침 신선한 재료로 준비합니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white pb-4 border border-black/5 group cursor-pointer">
              <div className="h-48 bg-gray-100 relative">
                <EditableImage sectionKey={`menu-${i}`} defaultUrl={images[i % images.length]} className="w-full h-full" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded text-xs font-bold shadow z-10" style={{ color: accentColor }}>
                  HIT
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2 text-black">
                  <h4 className="text-lg font-bold">시그니처 메뉴 {i}</h4>
                  <span className="font-black text-lg" style={{ color: accentColor }}>15.0</span>
                </div>
                <p className="text-sm opacity-60 leading-relaxed text-black">바삭하게 튀겨낸 베스트셀러 요리입니다. 맥주와 함께 즐겨보세요.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12가지 레이아웃 구조 패턴 순차 순회 */}
      <main className="flex-1 px-6 md:px-12 py-16 max-w-6xl mx-auto w-full space-y-16">
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
      <footer className="w-full py-8 px-8 border-t text-center text-xs opacity-60 mt-auto border-black/10" style={{ color: colors.text }}>
        <p className="font-semibold mb-2">{bizName}</p>
        {contact && <p className="mb-2">연락처: {contact}</p>}
        <p>© {new Date().getFullYear()} {bizName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
