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
  philosophy: "공간 철학", barista: "전문가 소개", reservations: "예약 안내",
  stay: "객실 및 공간", architecture: "건축 이야기"
};

const KEYWORD_IMAGE_POOLS: Record<string, string[]> = {
  cafe: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80", // Modern Luxury House
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80"
  ],
  traditional: [
    "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?w=1200&q=80", // Hanok / Traditional
    "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1200&q=80",
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80",
    "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&q=80"
  ],
  personal: [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80", // Resort / Luxury Travel
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80"
  ],
  default: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
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
  const totalPages = Math.max(1, Math.ceil(categoryPool.length / itemsPerPage));
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">
              🖼️ 추천 고화질 스톡 사진
            </label>
            {totalPages > 1 && (
              <button
                type="button"
                onClick={handleNextPage}
                className="text-xs font-bold text-[#111827] bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg border border-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                🔄 다른 사진 보기 ({page + 1}/{totalPages})
              </button>
            )}
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

// ════════════════════════════════════════════════════════════════════════
// 🌟 1. 글로벌 모던 비즈니스 / 부동산 / 에이전시 (Horizon Realty 스타일)
// ════════════════════════════════════════════════════════════════════════
function ModernAgencyRealtyLayout({
  accentColor,
  bizName,
  bizDesc,
  images,
  logoUrl,
  navMenus,
  onActionClick,
  onNavClick,
}: LayoutProps) {
  const brandColor = accentColor || "#D97706";

  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#F3F4F6] text-[#111827]">
      {/* 1. Modern Header */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavClick("hero", 0)}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xl">🏠</span>
              <span className="text-lg font-black tracking-tight text-gray-900 uppercase">{bizName}</span>
            </div>
          )}
        </div>

        <div className="hidden md:flex gap-8 items-center text-xs sm:text-sm font-bold text-gray-600">
          {navMenus.map((menu, idx) => (
            <button key={menu} type="button" onClick={() => onNavClick(menu, idx)} className="hover:text-black transition-colors cursor-pointer">
              {menu}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onActionClick("Book a Consultation")}
          className="px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
          style={{ backgroundColor: brandColor }}
        >
          Book a Consultation
        </button>
      </nav>

      {/* 2. Asymmetrical Hero (좌: 타이포 & CTA / 우: 대형 모던 건축 화보) */}
      <header id="hero" className="max-w-6xl mx-auto px-8 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">FIND YOUR PLACE. LIVE YOUR DREAM.</span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
            Discover Spaces That <span style={{ color: brandColor }}>Inspire.</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed max-w-md">
            {bizDesc || "우리는 단순한 공간을 넘어 당신의 삶과 비즈니스를 완벽히 실현하는 프리미엄 아키텍처를 큐레이션합니다."}
          </p>
          <div className="flex gap-3.5 pt-2">
            <button
              type="button"
              onClick={() => onActionClick("Explore Properties")}
              className="px-6 py-3.5 rounded-xl text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
              style={{ backgroundColor: brandColor }}
            >
              Explore Properties &rarr;
            </button>
            <button
              type="button"
              onClick={() => onActionClick("Book a Tour")}
              className="px-6 py-3.5 rounded-xl text-xs font-bold bg-white text-gray-800 border-2 border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
            >
              Book a Tour
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-[380px] sm:h-[440px]">
            <EditableImage sectionKey="hero" defaultUrl={images[0]} className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* 3. 4단 퀵 스탯 바 (KPI Bar) */}
      <section className="max-w-6xl mx-auto px-8 w-full -mt-6 relative z-20">
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {[
            { num: "250+", label: "Properties Curated", desc: "엄선된 프리미엄 공간" },
            { num: "120+", label: "Happy Clients", desc: "100% 검증된 고객 만족도" },
            { num: "15+", label: "Years Experience", desc: "현업 15년 이상의 노하우" },
            { num: "20+", label: "Global Locations", desc: "핵심 요충지 네트워크" },
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900" style={{ color: i === 0 ? brandColor : undefined }}>
                {stat.num}
              </h3>
              <p className="text-xs font-bold text-gray-800">{stat.label}</p>
              <p className="text-[11px] text-gray-500 font-medium">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 3단 카드 갤러리 섹션 (Handpicked Properties / Featured Cards) */}
      <main className="max-w-6xl mx-auto px-8 py-16 w-full space-y-16 text-left">
        <section className="space-y-8">
          <div className="flex items-end justify-between border-b-2 border-gray-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">FEATURED ARCHIVE</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                Handpicked Spaces Just For <span style={{ color: brandColor }}>You.</span>
              </h2>
            </div>
            <button type="button" onClick={() => onActionClick("View All")} className="text-xs font-bold text-gray-700 hover:text-black flex items-center gap-1">
              전체 보기 &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Modern Villa Residence", price: "₩ 1,450,000,000", loc: "서울 용산구 한남동", imgIdx: 1 },
              { title: "Minimal Penthouse Studio", price: "₩ 2,100,000,000", loc: "서울 강남구 청담동", imgIdx: 2 },
              { title: "Contemporary Heritage House", price: "₩ 1,850,000,000", loc: "경기도 성남시 판교동", imgIdx: 3 },
            ].map((card, idx) => (
              <div key={idx} className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <EditableImage sectionKey={`card-${idx}`} defaultUrl={images[card.imgIdx % images.length]} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                    EXCLUSIVE
                  </span>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">{card.title}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">📍 {card.loc}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-black text-gray-900">{card.price}</span>
                    <button
                      type="button"
                      onClick={() => onActionClick(card.title)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: brandColor }}
                    >
                      상세 보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. 풀와이드 다크 비디오 배너 섹션 */}
        <section className="bg-[#111827] text-white rounded-3xl p-10 sm:p-14 relative overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">EXCLUSIVE SERVICE</span>
            <h3 className="text-3xl sm:text-4xl font-black leading-tight">
              Let&apos;s Get You <br />The <span style={{ color: brandColor }}>Best Value.</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed max-w-lg">
              완벽한 시장 분석과 데이터 기반 전략으로 고객에게 가장 탁월한 결과만을 약속드립니다.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onActionClick("Free Consultation")}
                className="px-7 py-3.5 rounded-xl text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: brandColor }}
              >
                무료 상담 신청하기 &rarr;
              </button>
            </div>
          </div>
          <div className="md:col-span-5 flex justify-center">
            <div className="w-full h-48 sm:h-60 rounded-2xl overflow-hidden relative shadow-2xl border-2 border-white/20">
              <EditableImage sectionKey="video-banner" defaultUrl={images[4 % images.length]} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onActionClick("Play Video")}
                  className="w-14 h-14 rounded-full bg-white/90 text-black flex items-center justify-center text-xl shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. 클라이언트 신뢰 로고 바 */}
        <section className="pt-4 text-center space-y-4">
          <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">AS SEEN ON TRUSTED MEDIA</p>
          <div className="flex flex-wrap justify-center items-center gap-10 text-gray-400 font-black text-base sm:text-lg tracking-widest opacity-60">
            <span>FORBES</span>
            <span>ARCHITECTURAL DIGEST</span>
            <span>ELLE DECOR</span>
            <span>BLOOMBERG</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 border-t-2 border-gray-200 bg-white text-center text-xs font-semibold text-gray-500 mt-auto">
        <p className="font-bold text-gray-900 mb-2 uppercase tracking-widest">{bizName}</p>
        <p className="opacity-70">© 2026 {bizName}. All Rights Reserved. Powered by Google Flow.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 2. 헤리티지 럭셔리 스테이 / 전통 공방 (감찰댁 한옥마을 스타일)
// ════════════════════════════════════════════════════════════════════════
function TraditionalStayHeritageLayout({
  accentColor,
  bizName,
  bizDesc,
  images,
  logoUrl,
  navMenus,
  onActionClick,
  onNavClick,
}: LayoutProps) {
  const deepColor = accentColor || "#78350F";

  return (
    <div className="min-h-full w-full flex flex-col font-serif-kr bg-[#F5F2EC] text-[#2C2118]">
      {/* Dark Minimal Heritage Nav */}
      <nav className="flex items-center justify-between px-10 py-5 bg-[#1C1410] text-gray-200 sticky top-0 z-30 shadow-md">
        <div className="cursor-pointer" onClick={() => onNavClick("hero", 0)}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" className="h-7 object-contain" />
          ) : (
            <span className="text-lg font-bold tracking-widest text-[#E5D7C5]">{bizName}</span>
          )}
        </div>
        <div className="flex gap-8 text-xs sm:text-sm font-medium">
          {navMenus.map((menu, idx) => (
            <button key={menu} type="button" onClick={() => onNavClick(menu, idx)} className="hover:text-[#E5D7C5] transition-colors cursor-pointer">
              {menu}
            </button>
          ))}
        </div>
      </nav>

      {/* Fullscreen Hanok Hero */}
      <header id="hero" className="relative w-full h-[520px] sm:h-[600px] flex items-center justify-center text-center">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-20 space-y-4 px-6 text-white max-w-2xl">
          <span className="text-xs font-sans tracking-widest uppercase text-[#E5D7C5]">A RELAXATION UNIT ROOTS IN NATURE</span>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight drop-shadow-md">
            {bizDesc || "사계절이 머무는 고즈넉한 쉼터"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed max-w-lg mx-auto pt-2">
            수백 년의 시간과 자연의 숨결이 깃든 한옥에서 온전한 휴식과 사유의 시간을 경험해 보세요.
          </p>
        </div>
      </header>

      {/* Heritage Sections */}
      <main className="max-w-5xl mx-auto px-6 py-20 w-full space-y-24 text-left font-sans">
        {/* Section 1: 오버랩 2단 카드 (좌측 야경 + 우측 다크 박스) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <EditableImage sectionKey="sec-1" defaultUrl={images[1 % images.length]} className="w-full h-full object-cover" />
          </div>
          <div className="md:col-span-5 bg-[#2C2118] text-[#F5F2EC] p-8 sm:p-10 rounded-3xl shadow-xl space-y-4 -mt-10 md:-mt-0 md:-ml-12 relative z-20">
            <span className="text-xs tracking-widest text-[#C8A97E] uppercase font-serif-kr">KOREAN STYLE STAY</span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-kr">사계절이 아름다운 전통 한옥 펜션</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              정갈하게 손질된 소나무 정원과 전통 창호 너머로 스며드는 달빛. 바쁜 도심에서 벗어나 자연과 호흡하는 완벽한 힐링을 선사합니다.
            </p>
            <div className="pt-2">
              <button type="button" onClick={() => onActionClick("객실 안내")} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow" style={{ backgroundColor: deepColor }}>
                객실 둘러보기 &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: 좌측 텍스트 카드 + 우측 와이드 사진 */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 bg-white p-8 sm:p-10 rounded-3xl border border-[#E5D7C5] shadow-md space-y-4">
            <span className="text-xs tracking-widest text-amber-900 uppercase font-serif-kr">MAKING MEMORIES</span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#2C2118] font-serif-kr">소중한 사람과 함께하는 추억</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              흙과 나무로 지어진 전통 공간 속에서 다도 체험과 계절별 전통 공예 프로그램을 프라이빗하게 즐기실 수 있습니다.
            </p>
          </div>
          <div className="md:col-span-7 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <EditableImage sectionKey="sec-2" defaultUrl={images[2 % images.length]} className="w-full h-full object-cover" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-[#1C1410] text-[#E5D7C5] text-center text-xs mt-auto font-sans">
        <p className="font-bold text-base font-serif-kr mb-2">{bizName}</p>
        <p className="text-gray-400 opacity-80">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 3. 럭셔리 여행 / 리조트 큐레이션 (The Art of Escape 스타일)
// ════════════════════════════════════════════════════════════════════════
function LuxuryTravelResortLayout({
  accentColor,
  bizName,
  bizDesc,
  images,
  logoUrl,
  navMenus,
  onActionClick,
  onNavClick,
}: LayoutProps) {
  const luxuryGold = accentColor || "#B45309";

  return (
    <div className="min-h-full w-full flex flex-col font-serif-kr bg-[#FAF7F2] text-[#1E293B]">
      {/* Floating Glassmorphism Nav */}
      <div className="p-6 sticky top-0 z-30">
        <nav className="max-w-4xl mx-auto flex items-center justify-between px-8 py-3.5 rounded-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg">
          <div className="cursor-pointer" onClick={() => onNavClick("hero", 0)}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" className="h-6 object-contain" />
            ) : (
              <span className="text-sm font-black tracking-widest uppercase">{bizName}</span>
            )}
          </div>
          <div className="flex gap-6 text-xs font-sans font-bold text-gray-700">
            {navMenus.map((menu, idx) => (
              <button key={menu} type="button" onClick={() => onNavClick(menu, idx)} className="hover:text-amber-700 transition-colors cursor-pointer">
                {menu}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Resort Hero with Floating Reservation Card */}
      <header id="hero" className="max-w-6xl mx-auto px-8 py-10 w-full relative min-h-[500px] rounded-3xl overflow-hidden shadow-2xl flex items-center">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

        <div className="relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left text-white p-6">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-sans tracking-widest uppercase text-amber-200">CURATED LUXURY JOURNEYS</span>
            <h1 className="text-4xl sm:text-6xl font-black leading-none drop-shadow-md">
              THE ART <br />OF ESCAPE.
            </h1>
            <p className="text-xs sm:text-sm font-sans text-gray-200 max-w-md leading-relaxed">
              {bizDesc || "전 세계 가장 프라이빗하고 감각적인 럭셔리 리조트 아카이브를 선사합니다."}
            </p>
          </div>

          {/* Floating Booking Card */}
          <div className="lg:col-span-4 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white text-gray-900 space-y-4 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">RESERVE YOUR STAY</h4>
            <div className="space-y-2 text-xs font-medium">
              <input type="text" placeholder="📅 Check-in — Check-out" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white" />
              <input type="text" placeholder="👤 2 Guests · 1 Suite" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white" />
            </div>
            <button
              type="button"
              onClick={() => onActionClick("Request a Quote")}
              className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-102 cursor-pointer"
              style={{ backgroundColor: luxuryGold }}
            >
              REQUEST A QUOTE
            </button>
          </div>
        </div>
      </header>

      {/* 4단 럭셔리 캐러셀 카드 섹션 */}
      <main className="max-w-6xl mx-auto px-8 py-16 w-full space-y-16 text-left">
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              JOURNEYS WORTH <br />REMEMBERING.
            </h2>
            <p className="text-xs sm:text-sm font-sans text-gray-600 mt-2">
              오직 당신만을 위해 준비된 특별한 목적지들을 확인해 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
            {[
              { dest: "AMALFI COAST", sub: "Mediterranean Elegance", imgIdx: 1 },
              { dest: "MALDIVES", sub: "Island Serenity", imgIdx: 2 },
              { dest: "SERENGETI", sub: "Wild Sophistication", imgIdx: 3 },
              { dest: "SANTORINI", sub: "Aegean Sunset Suite", imgIdx: 0 },
            ].map((card, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <EditableImage sectionKey={`resort-${idx}`} defaultUrl={images[card.imgIdx % images.length]} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="text-xs font-bold text-gray-900 uppercase">{card.dest}</h4>
                  <p className="text-[11px] text-gray-500">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 border-t border-gray-200 text-center text-xs font-sans text-gray-500 mt-auto">
        <p className="font-bold text-gray-900 mb-2 uppercase">{bizName}</p>
        <p className="opacity-70">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 4. MAIN ROUTER
// ════════════════════════════════════════════════════════════════════════
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
    const resolved = [...templatePool.slice(0, 5)];

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
    navMenus: navMenus && navMenus.length > 0 ? navMenus : ["OVERVIEW", "PROPERTIES", "ARCHIVE", "CONTACT"],
    onActionClick: handleActionClick,
    onNavClick: handleNavClick,
  };

  const layoutType = selectedTemplate.layoutType;

  const renderLayout = () => {
    if (selectedCategory === "traditional") {
      return <TraditionalStayHeritageLayout {...props} />;
    }
    if (layoutType === "overlay" || selectedCategory === "personal") {
      return <LuxuryTravelResortLayout {...props} />;
    }
    return <ModernAgencyRealtyLayout {...props} />;
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
