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

const SECTION_PRESETS: Record<string, { badge: string; subHeading: string; subDesc: string; btnText: string }> = {
  about: {
    badge: "BRAND STORY",
    subHeading: "본질에 집중하는 공간 철학",
    subDesc: "정제된 미학과 편안한 분위기 속에서 머무는 모든 순간이 특별한 기억이 됩니다.",
    btnText: "브랜드 스토리 전체보기",
  },
  menu: {
    badge: "SIGNATURE MENU",
    subHeading: "엄선된 프리미엄 메뉴 라인업",
    subDesc: "신선한 스페셜티 원두와 정성으로 구워낸 수제 디저트의 완벽한 페어링을 선사합니다.",
    btnText: "전체 메뉴 보러가기",
  },
  gallery: {
    badge: "SPACE ARCHIVE",
    subHeading: "빛과 여백이 머무는 공간",
    subDesc: "자연광이 스며드는 따뜻한 감성과 세련된 인테리어의 조화를 경험해 보세요.",
    btnText: "갤러리 둘러보기",
  },
  location: {
    badge: "LOCATION & HOURS",
    subHeading: "찾아오시는 길 & 운영 안내",
    subDesc: "도심 속 조용한 쉼터, 일상의 온전한 휴식을 만끽할 수 있는 최적의 공간으로 안내합니다.",
    btnText: "오시는 길 안내",
  },
  instagram: {
    badge: "SOCIAL FEED",
    subHeading: "일상의 감각적인 순간들",
    subDesc: "매일 새롭게 업데이트되는 시즌 메뉴와 매장의 생생한 소식을 확인해 보세요.",
    btnText: "인스타그램 피드 보기",
  },
  contact: {
    badge: "GET IN TOUCH",
    subHeading: "프라이빗 예약 및 상담 문의",
    subDesc: "궁금하신 점이나 특별한 요청 사항을 남겨주시면 정성껏 안내해 드리겠습니다.",
    btnText: "예약 및 문의 접수하기",
  },
  services: {
    badge: "OUR SERVICES",
    subHeading: "맞춤형 프리미엄 솔루션",
    subDesc: "고객 한 분 한 분의 니즈에 맞춘 차별화된 프로그램과 전문적인 케어를 제공합니다.",
    btnText: "서비스 상세 안내",
  },
  results: {
    badge: "PERFORMANCE",
    subHeading: "수치로 증명하는 압도적 성과",
    subDesc: "수많은 성공 사례와 고객 만족도를 통해 검증된 최고의 퀄리티를 확인해 보세요.",
    btnText: "실적 데이터 확인하기",
  },
  curriculum: {
    badge: "CURRICULUM",
    subHeading: "체계적인 단계별 마스터 코스",
    subDesc: "기초부터 심화 실무까지 단기간에 최고 수준으로 이끌어주는 집중 로드맵입니다.",
    btnText: "커리큘럼 전체보기",
  },
  teachers: {
    badge: "INSTRUCTORS",
    subHeading: "분야별 정상급 전문 강사진",
    subDesc: "현업 15년 이상의 노하우를 갖춘 마스터들이 밀착 코칭을 진행합니다.",
    btnText: "강사진 프로필 보기",
  },
  works: {
    badge: "PORTFOLIO",
    subHeading: "최고 수준의 완성작 아카이브",
    subDesc: "엄격한 기준과 독창적인 감각으로 완성해낸 대표 프로젝트들을 만나보세요.",
    btnText: "포트폴리오 보러가기",
  },
};

const KEYWORD_IMAGE_POOLS: Record<string, string[]> = {
  cafe: [
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1200&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&q=80",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
    "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=1200&q=80",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80"
  ],
  academy: [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80",
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80"
  ],
  personal: [
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=80",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80"
  ],
  default: [
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1200&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&q=80",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80"
  ]
};

// ── 1. 인라인 이미지 교체 모달 ──
function ImageEditModal() {
  const {
    activeEditingSection,
    setEditingSection,
    setSectionImage,
    selectedTemplate,
    selectedCategory,
  } = useBriefStore();

  const [page, setPage] = useState(0);

  if (!activeEditingSection || !selectedTemplate) return null;

  const categoryPool = KEYWORD_IMAGE_POOLS[selectedCategory] || KEYWORD_IMAGE_POOLS.default;
  const itemsPerPage = 6;
  const totalPages = Math.ceil(categoryPool.length / itemsPerPage);
  const currentImages = categoryPool.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handleNextPage = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  const handleSelectImage = (url: string) => {
    setSectionImage(activeEditingSection, url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setSectionImage(activeEditingSection, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sectionName = SECTION_KR[activeEditingSection] || activeEditingSection;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-pretendard"
      onClick={() => setEditingSection(null)}
    >
      <div
        className="bg-white rounded-3xl border-2 border-[#111827] shadow-2xl max-w-lg w-full p-6 text-left space-y-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📷</span>
            <h3 className="text-base sm:text-lg font-bold text-[#111827]">
              [{sectionName}] 이미지 변경
            </h3>
          </div>
          <button
            onClick={() => setEditingSection(null)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="bg-[#FFFDF9] border-2 border-[#E5D7C5] p-3 rounded-2xl text-xs space-y-1">
          <p className="font-bold text-[#111827]">📐 추천 이미지 해상도 & 종횡비</p>
          <p className="text-[#374151] font-mono leading-relaxed">
            • 메인 히어로: <strong>16:9 (1920 × 1080)</strong> 또는 <strong>3:4 (1200 × 1600)</strong><br />
            • 갤러리/콘텐츠 카드: <strong>4:3 (1600 × 1200)</strong> 또는 <strong>1:1 (1024 × 1024)</strong>
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">
              🖼️ 추천 스톡 사진 (클릭 즉시 반영)
            </label>
            <button
              type="button"
              onClick={handleNextPage}
              className="text-xs font-bold text-[#111827] bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg border border-gray-300 transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
            >
              🔄 다른 사진 보기 ({page + 1}/{totalPages})
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {currentImages.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectImage(imgUrl)}
                className="relative aspect-video rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#111827] hover:scale-102 transition-all cursor-pointer group shadow-sm bg-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgUrl} alt={`Stock ${idx}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                  선택
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">
            📤 내 컴퓨터 파일 직접 업로드
          </label>
          <label className="flex items-center justify-center gap-2 p-3.5 border-2 border-dashed border-[#D1D5DB] hover:border-[#111827] rounded-2xl cursor-pointer bg-[#F9FAFB] hover:bg-white transition-all text-xs sm:text-sm font-bold text-[#374151]">
            <span>📁 이미지 파일 선택 (JPG, PNG, WEBP)</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}

// ── 2. 개별 섹션 이미지 변경 지원 래퍼 컴포넌트 ──
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
    e.preventDefault();
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
            type="button"
            onClick={handleClick}
            className="pointer-events-auto px-4 py-2 bg-white text-[#111827] rounded-xl text-xs font-pretendard font-bold shadow-2xl hover:bg-gray-100 hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer border border-black/10"
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
          type="button"
          onClick={handleClick}
          className="pointer-events-auto px-4 py-2 bg-white text-[#111827] rounded-xl text-xs font-pretendard font-bold shadow-2xl hover:bg-gray-100 hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer border border-black/10"
        >
          <span>📷</span> 이미지 변경
        </button>
      </div>
    </div>
  );
}

// ── 공통 Layout Props ──
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
  onActionClick: (label: string) => void;
  onNavClick: (menu: string, idx: number) => void;
}

// ═════════════════════════════════════════════════════════
// 1. DYNAMIC MOTION & 3D WEBGL LAYOUT (다이내믹 전용)
// ═════════════════════════════════════════════════════════
function DynamicLayout({
  accentColor,
  bizName,
  bizDesc,
  sections,
  images,
  logoUrl,
  contact,
  navMenus,
  onActionClick,
  onNavClick,
}: LayoutProps) {
  const neonColor = accentColor || "#00F2FE";

  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#0A0D14] text-white selection:bg-cyan-500 selection:text-black">
      {/* 무한 롤링 티커 배너 */}
      <div className="w-full py-2 bg-black/80 border-b border-white/10 overflow-hidden flex whitespace-nowrap">
        <div className="flex gap-8 text-[11px] font-mono tracking-widest text-cyan-400 font-bold uppercase animate-pulse">
          <span>⚡ GOOGLE FLOW DYNAMIC ENGINE</span>
          <span>•</span>
          <span>3D WEBGL & FRAMER MOTION</span>
          <span>•</span>
          <span>INTERACTIVE LIVING UI</span>
          <span>•</span>
          <span>NEXT-GEN WEB ARCHITECTURE</span>
        </div>
      </div>

      {/* Cyber Nav */}
      <nav className="flex items-center justify-between px-8 py-5 sticky top-0 z-30 backdrop-blur-xl bg-[#0A0D14]/85 border-b border-white/10">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Logo" className="h-7 max-w-[140px] object-contain cursor-pointer" onClick={() => onNavClick("hero", 0)} />
        ) : (
          <span
            className="text-lg font-black tracking-widest uppercase cursor-pointer"
            style={{ color: neonColor }}
            onClick={() => onNavClick("hero", 0)}
          >
            {bizName}
          </span>
        )}
        <div className="flex gap-6">
          {navMenus.map((menu, idx) => (
            <button
              key={menu}
              type="button"
              onClick={() => onNavClick(menu, idx)}
              className="text-xs font-bold tracking-wider hover:text-cyan-400 transition-colors text-gray-300 cursor-pointer"
            >
              {menu}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onActionClick("CONNECT WEBGL")}
          className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,242,254,0.4)] cursor-pointer"
          style={{ backgroundColor: neonColor }}
        >
          EXPERIENCE
        </button>
      </nav>

      {/* 3D Cyber Hero */}
      <header id="hero" className="px-8 py-20 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>3D SPATIAL INTERACTION LAB</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-white">
            {bizDesc}
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-gray-300 max-w-lg font-medium">
            마우스 반응형 3D 인터랙션과 실시간 모션 그래픽이 결합된 차세대 디지털 쇼케이스입니다.
          </p>
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => onActionClick("LAUNCH DEMO")}
              className="px-7 py-3.5 rounded-2xl text-xs font-bold tracking-wider uppercase text-black transition-all hover:scale-105 shadow-[0_0_25px_rgba(0,242,254,0.5)] cursor-pointer"
              style={{ backgroundColor: neonColor }}
            >
              LAUNCH DEMO &rarr;
            </button>
            <button
              type="button"
              onClick={() => onActionClick("TECH STACK")}
              className="px-6 py-3.5 rounded-2xl text-xs font-bold tracking-wider uppercase border border-white/20 hover:bg-white/10 transition-all cursor-pointer"
            >
              TECH STACK
            </button>
          </div>
        </div>

        <div className="md:col-span-5 flex justify-center md:justify-end">
          <div
            className="relative w-full max-w-[360px] aspect-square rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,242,254,0.25)] border-2"
            style={{ borderColor: neonColor }}
          >
            <EditableImage sectionKey="hero" defaultUrl={images[0]} className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Cyber Sections */}
      <main className="flex-1 px-8 py-12 max-w-6xl mx-auto w-full space-y-12 border-t border-white/10">
        {sections.filter(s => s !== "hero").map((sec, i) => {
          const preset = SECTION_PRESETS[sec] || {
            badge: "MODULE",
            subHeading: `${SECTION_KR[sec] || sec} 인터랙티브 뷰`,
            subDesc: "실시간 반응형 모션과 첨단 그래픽이 적용된 섹션입니다.",
            btnText: "모듈 상세 실행",
          };
          return (
            <section key={sec} id={sec} className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#00F2FE]" />
                  <h3 className="text-xl font-bold text-white">{SECTION_KR[sec] || sec}</h3>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {preset.badge}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <EditableImage sectionKey={sec} defaultUrl={images[i % images.length]} className="h-64 rounded-2xl border border-white/10 shadow-lg" />
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">{preset.subHeading}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{preset.subDesc}</p>
                  <button
                    type="button"
                    onClick={() => onActionClick(preset.btnText)}
                    className="px-6 py-3 rounded-xl text-xs font-bold text-black shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-transform hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: neonColor }}
                  >
                    {preset.btnText}
                  </button>
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-8 border-t border-white/10 text-center text-xs text-gray-400 bg-black/60 mt-auto">
        <p className="font-bold mb-2 uppercase tracking-widest text-white">{bizName}</p>
        {contact && <p className="mb-2">COMMUNICATION: {contact}</p>}
        <p className="opacity-70">© 2026 {bizName}. POWERED BY GOOGLE FLOW.</p>
      </footer>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// 2. GRID LAYOUT (핀터레스트 카드 / 학원 / 포트폴리오)
// ═════════════════════════════════════════════════════════
function GridLayout({
  accentColor,
  bizName,
  bizDesc,
  sections,
  images,
  logoUrl,
  contact,
  navMenus,
  onActionClick,
  onNavClick,
}: LayoutProps) {
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#F9FAFB] text-[#111827]">
      {/* Centered Grid Nav */}
      <nav className="grid grid-cols-3 items-center px-8 py-5 border-b-2 border-gray-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex gap-4">
          {navMenus.slice(0, 2).map((menu, idx) => (
            <button
              key={menu}
              type="button"
              onClick={() => onNavClick(menu, idx)}
              className="text-xs font-bold tracking-wider hover:text-black transition-colors text-gray-600 cursor-pointer"
            >
              {menu}
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" className="h-7 max-w-[140px] object-contain cursor-pointer" onClick={() => onNavClick("hero", 0)} />
          ) : (
            <span
              className="text-lg font-black tracking-widest uppercase cursor-pointer"
              style={{ color: accentColor }}
              onClick={() => onNavClick("hero", 0)}
            >
              {bizName}
            </span>
          )}
        </div>
        <div className="flex justify-end gap-4">
          {navMenus.slice(2).map((menu, idx) => (
            <button
              key={menu}
              type="button"
              onClick={() => onNavClick(menu, idx + 2)}
              className="text-xs font-bold tracking-wider hover:text-black transition-colors text-gray-600 cursor-pointer"
            >
              {menu}
            </button>
          ))}
        </div>
      </nav>

      {/* Grid Hero */}
      <header id="hero" className="grid grid-cols-1 lg:grid-cols-12 border-b-2 border-gray-200 bg-white">
        <div className="lg:col-span-7 p-10 lg:p-16 flex flex-col justify-center space-y-6 text-left border-r-2 border-gray-200">
          <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-md text-white w-fit shadow" style={{ backgroundColor: accentColor }}>
            PINTEREST GRID ARCHITECTURE
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-gray-900">
            {bizDesc}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            시각적 탐색 효율을 극대화한 멀티 카드 그리드 레이아웃입니다.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onActionClick("EXPLORE GRID")}
              className="px-7 py-3.5 rounded-xl text-xs font-bold text-white transition-transform hover:scale-105 shadow-md cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              EXPLORE ARCHIVE
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 bg-gray-50 flex items-center justify-center">
          <div className="w-full h-80 rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200">
            <EditableImage sectionKey="hero" defaultUrl={images[0]} className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Grid Sections */}
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.filter(s => s !== "hero").map((sec, i) => {
            const preset = SECTION_PRESETS[sec] || {
              badge: "GRID ITEM",
              subHeading: `${SECTION_KR[sec] || sec} 상세`,
              subDesc: "콘텐츠 카드를 통해 신속하고 직관적으로 정보를 확인하세요.",
              btnText: "카드 상세 보기",
            };
            return (
              <div key={sec} id={sec} className="bg-white rounded-2xl border-2 border-gray-200 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow text-left">
                <EditableImage sectionKey={sec} defaultUrl={images[i % images.length]} className="h-44 rounded-xl shadow-sm w-full" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">{preset.badge}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100">{SECTION_KR[sec] || sec}</span>
                </div>
                <h4 className="text-base font-bold text-gray-900">{preset.subHeading}</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">{preset.subDesc}</p>
                <button
                  type="button"
                  onClick={() => onActionClick(preset.btnText)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  {preset.btnText}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-8 border-t-2 border-gray-200 text-center text-xs font-semibold text-gray-500 bg-white mt-auto">
        <p className="font-bold mb-2 uppercase tracking-widest text-gray-900">{bizName}</p>
        {contact && <p className="mb-2">CONTACT: {contact}</p>}
        <p className="opacity-70">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// 3. OVERLAY LAYOUT (시네마틱 풀스크린 / 오버레이)
// ═════════════════════════════════════════════════════════
function OverlayLayout({
  accentColor,
  bizName,
  bizDesc,
  sections,
  images,
  logoUrl,
  contact,
  navMenus,
  onActionClick,
  onNavClick,
}: LayoutProps) {
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#111827] text-white">
      {/* Fullscreen Hero with Nav overlay */}
      <div className="relative min-h-[500px] flex flex-col justify-between">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#111827]" />

        {/* Overlay Nav */}
        <nav className="relative z-20 flex items-center justify-between px-8 py-6">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" className="h-7 max-w-[140px] object-contain cursor-pointer" onClick={() => onNavClick("hero", 0)} />
          ) : (
            <span className="text-xl font-bold tracking-widest uppercase cursor-pointer" onClick={() => onNavClick("hero", 0)}>
              {bizName}
            </span>
          )}
          <div className="flex gap-6">
            {navMenus.map((menu, idx) => (
              <button
                key={menu}
                type="button"
                onClick={() => onNavClick(menu, idx)}
                className="text-xs font-bold tracking-wider hover:text-amber-300 transition-colors text-gray-200 cursor-pointer"
              >
                {menu}
              </button>
            ))}
          </div>
        </nav>

        {/* Center Hero Typography */}
        <div className="relative z-20 px-8 py-16 text-center max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
            CINEMATIC OVERLAY EXPERIENCE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-white drop-shadow-lg">
            {bizDesc}
          </h1>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-medium">
            압도적인 시각적 몰입감을 선사하는 풀스크린 오버레이 아키텍처입니다.
          </p>
          <div>
            <button
              type="button"
              onClick={() => onActionClick("ENTER")}
              className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 shadow-2xl cursor-pointer"
              style={{ backgroundColor: accentColor || "#FFF" }}
            >
              DISCOVER MORE
            </button>
          </div>
        </div>
        <div className="relative z-20 pb-4" />
      </div>

      {/* Sections */}
      <main className="flex-1 px-8 py-16 max-w-5xl mx-auto w-full space-y-12">
        {sections.filter(s => s !== "hero").map((sec, i) => {
          const preset = SECTION_PRESETS[sec] || {
            badge: "OVERLAY VIEW",
            subHeading: `${SECTION_KR[sec] || sec} 안내`,
            subDesc: "웅장한 배경과 함께 콘텐츠를 감상해 보세요.",
            btnText: "상세 보기",
          };
          return (
            <div key={sec} id={sec} className="relative rounded-3xl overflow-hidden p-8 border border-white/15 bg-white/5 backdrop-blur-md space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white">{SECTION_KR[sec] || sec}</h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-gray-300">{preset.badge}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <EditableImage sectionKey={sec} defaultUrl={images[i % images.length]} className="h-64 rounded-2xl shadow-xl w-full" />
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">{preset.subHeading}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{preset.subDesc}</p>
                  <button
                    type="button"
                    onClick={() => onActionClick(preset.btnText)}
                    className="px-6 py-3 rounded-xl text-xs font-bold text-black transition-transform hover:scale-105 cursor-pointer shadow-md"
                    style={{ backgroundColor: accentColor || "#FFF" }}
                  >
                    {preset.btnText}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-8 border-t border-white/10 text-center text-xs text-gray-400 bg-black/50 mt-auto">
        <p className="font-bold mb-2 uppercase tracking-widest text-white">{bizName}</p>
        {contact && <p className="mb-2">CONTACT: {contact}</p>}
        <p className="opacity-70">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// 4. VERTICAL EDITORIAL LAYOUT (미니멀 에디토리얼)
// ═════════════════════════════════════════════════════════
function VerticalLayout({
  accentColor,
  bizName,
  bizDesc,
  sections,
  images,
  logoUrl,
  contact,
  navMenus,
  onActionClick,
  onNavClick,
}: LayoutProps) {
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#FAF9F6] text-[#111827]">
      {/* Editorial Nav */}
      <nav
        className="flex items-center justify-between px-8 py-5 sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 shadow-sm"
        style={{ borderColor: `${accentColor}33` }}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Logo" className="h-7 max-w-[140px] object-contain cursor-pointer" onClick={() => onNavClick("hero", 0)} />
        ) : (
          <span
            className="text-base font-bold tracking-widest uppercase font-serif-kr cursor-pointer"
            style={{ color: accentColor }}
            onClick={() => onNavClick("hero", 0)}
          >
            {bizName}
          </span>
        )}
        <div className="flex gap-6">
          {navMenus.map((menu, idx) => (
            <button
              key={menu}
              type="button"
              onClick={() => onNavClick(menu, idx)}
              className="text-xs font-bold tracking-wider transition-colors cursor-pointer text-[#374151] hover:opacity-80"
            >
              {menu}
            </button>
          ))}
        </div>
      </nav>

      {/* Editorial Hero */}
      <header id="hero" className="px-8 py-16 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7 space-y-6 text-left">
          <span
            className="text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full border shadow-sm inline-block"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
              borderColor: `${accentColor}40`
            }}
          >
            EDITORIAL COLLECTION
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-[#111827] font-serif-kr">
            {bizDesc}
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-[#4B5563] max-w-lg font-medium">
            {bizName}가 선보이는 정제된 미학의 아카이브입니다. 본질적인 형태와 사유의 공간 속에서 최적의 균형을 발견해 보십시오.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onActionClick("DISCOVER ARCHIVE")}
              className="px-7 py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase text-white transition-all cursor-pointer shadow-lg hover:scale-102"
              style={{ backgroundColor: accentColor }}
            >
              DISCOVER ARCHIVE
            </button>
          </div>
        </div>

        <div className="md:col-span-5 flex justify-center md:justify-end">
          <div
            className="relative w-full max-w-[340px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4"
            style={{ borderColor: accentColor }}
          >
            <EditableImage sectionKey="hero" defaultUrl={images[0]} className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* 섹션 순회 */}
      <main className="flex-1 px-8 py-12 max-w-6xl mx-auto w-full space-y-12 border-t-2 border-[#E5E7EB]">
        {sections.filter(s => s !== "hero").map((sec, i) => {
          const preset = SECTION_PRESETS[sec] || {
            badge: "SECTION",
            subHeading: `${SECTION_KR[sec] || sec} 상세 안내`,
            subDesc: "고객에게 최적화된 맞춤 구성과 감각적인 경험을 선사합니다.",
            btnText: `${SECTION_KR[sec] || sec} 자세히 보기`,
          };
          return (
            <section key={sec} id={sec} className="py-12 px-8 rounded-3xl border-2 border-[#E5E7EB] bg-white shadow-sm space-y-6 text-left">
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: accentColor }} />
                  <h3 className="text-xl font-bold text-[#111827]">{SECTION_KR[sec] || sec}</h3>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  {preset.badge}
                </span>
              </div>

              <p className="text-sm text-[#4B5563] leading-relaxed font-medium">
                {preset.subDesc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
                <EditableImage sectionKey={sec} defaultUrl={images[i % images.length]} className="h-64 rounded-2xl shadow-md w-full" />
                <div className="space-y-4 flex flex-col justify-center">
                  <h4 className="text-base font-bold text-[#111827]">{preset.subHeading}</h4>
                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-medium">
                    {preset.subDesc}
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => onActionClick(preset.btnText)}
                      className="px-6 py-3 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 cursor-pointer shadow-md"
                      style={{ backgroundColor: accentColor }}
                    >
                      {preset.btnText}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-8 border-t-2 border-[#E5E7EB] text-center text-xs font-semibold text-[#4B5563] bg-white mt-auto">
        <p className="font-bold mb-2 uppercase tracking-widest text-[#111827]">{bizName}</p>
        {contact && <p className="mb-2">INQUIRY: {contact}</p>}
        <p className="opacity-70">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// 5. MAIN ROUTER
// ═════════════════════════════════════════════════════════
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
    navMenus,
  } = useBriefStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!selectedTemplate) return null;

  const accentColor = userInputs.pickedColor || selectedTemplate.colors.accent;
  const bizName = userInputs.businessName || selectedTemplate.name;
  const bizDesc = userInputs.description || selectedTemplate.tagline;
  const contact = userInputs.contact || "";
  const sections = userInputs.sectionOrder
    ? userInputs.sectionOrder.split("→").map((s) => s.trim()).filter(Boolean)
    : selectedTemplate.sections;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const images = useMemo(() => {
    const templatePool = KEYWORD_IMAGE_POOLS[selectedCategory] || KEYWORD_IMAGE_POOLS.default;
    const resolved = [...templatePool.slice(0, 3)];

    if (imageMode === "upload" && uploadedImageUrl) {
      resolved[0] = uploadedImageUrl;
    } else if (imageMode === "stock" && selectedStockImages.length > 0) {
      selectedStockImages.forEach((img, idx) => {
        if (idx < resolved.length) resolved[idx] = img;
      });
    }
    return resolved;
  }, [selectedCategory, imageMode, uploadedImageUrl, selectedStockImages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleNavClick = (menu: string, idx: number) => {
    const secList = sections.filter((s) => s !== "hero");
    const targetSec = secList[idx] || menu.toLowerCase().replace(/\s+/g, "-");
    const el = document.getElementById(targetSec) || document.getElementById("hero");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      showToast(`🧭 '${menu}' 섹션으로 이동했습니다.`);
    } else {
      showToast(`🧭 '${menu}' 메뉴가 클릭되었습니다.`);
    }
  };

  const handleActionClick = (actionName: string) => {
    showToast(`⚡ '${actionName}' 인터랙션이 감지되었습니다.`);
  };

  const props: LayoutProps = {
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
    onActionClick: handleActionClick,
    onNavClick: handleNavClick,
  };

  const layoutType = selectedTemplate.layoutType || "vertical";

  const renderLayout = () => {
    switch (layoutType) {
      case "dynamic":
        return <DynamicLayout {...props} />;
      case "grid":
        return <GridLayout {...props} />;
      case "overlay":
        return <OverlayLayout {...props} />;
      case "vertical":
      default:
        return <VerticalLayout {...props} />;
    }
  };

  return (
    <div className="relative w-full min-h-full">
      {renderLayout()}

      {/* 이미지 변경 팝업 모달 */}
      <ImageEditModal />

      {/* 인터랙션 피드백 토스트 알림 */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
