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
  stay: "객실 및 공간", architecture: "건축 이야기", reservation: "테이블 예약"
};

const KEYWORD_IMAGE_POOLS: Record<string, string[]> = {
  cafe: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80", // Korean BBQ Galbi / Meat Grill
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80"
  ],
  traditional: [
    "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?w=1200&q=80",
    "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1200&q=80",
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80",
    "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&q=80"
  ],
  personal: [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80"
  ],
  default: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80"
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
// 🌟 1. 정통 K-BBQ & 갈비 하우스 (김치BBQ / 시카고 갈비 하우스 스타일)
// ════════════════════════════════════════════════════════════════════════
function KoreanBBQRestaurantLayout({
  accentColor,
  bizName,
  bizDesc,
  images,
  logoUrl,
  contact,
  navMenus,
  onActionClick,
  onNavClick,
}: LayoutProps) {
  const sizzleRed = accentColor || "#DC2626";

  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#09090B] text-[#FAFAFA] selection:bg-red-600 selection:text-white">
      {/* 1. Top Utility Bar */}
      <div className="bg-[#18181B] text-gray-300 text-xs py-2 px-8 flex justify-between items-center border-b border-white/10">
        <div className="flex gap-4 items-center">
          <span className="text-red-500 font-bold">🔥 AUTHENTIC KOREAN BBQ</span>
          <span className="text-gray-600">|</span>
          <span>RESERVATION & PICKUP: {contact || "(847) 983-8282"}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-amber-400 font-bold">★ 4.9 (Google & Yelp Reviews)</span>
        </div>
      </div>

      {/* 2. Dark BBQ Nav */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#09090B]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavClick("hero", 0)}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥩</span>
              <div>
                <span className="text-lg font-black tracking-tight text-white uppercase">{bizName}</span>
                <span className="block text-[10px] text-red-500 font-bold tracking-widest -mt-1">KOREAN BBQ & GALBI</span>
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex gap-6 items-center text-xs font-bold text-gray-300">
          {navMenus.map((menu, idx) => (
            <button key={menu} type="button" onClick={() => onNavClick(menu, idx)} className="hover:text-red-500 transition-colors cursor-pointer uppercase">
              {menu}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onActionClick("ORDER ONLINE (DoorDash/UberEats)")}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            ORDER ONLINE 🛵
          </button>
          <button
            type="button"
            onClick={() => onActionClick("TABLE BOOKING")}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
            style={{ backgroundColor: sizzleRed }}
          >
            TABLE RESERVATION &rarr;
          </button>
        </div>
      </nav>

      {/* 3. Dark Sizzling Hero Banner (16:9 숯불 구이 화보) */}
      <header id="hero" className="relative w-full h-[500px] md:h-[560px] overflow-hidden bg-black flex items-center justify-center">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-black/40 to-black/70" />

        <div className="relative z-20 max-w-5xl mx-auto px-6 w-full text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-widest">
            <span>🔥</span> SIZZLING PREMIUM PRIME GALBI & PORK BELLY
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight drop-shadow-2xl">
            AUTHENTIC KOREAN BBQ <br />
            <span style={{ color: sizzleRed }}>EXPERIENCE.</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-medium max-w-xl mx-auto leading-relaxed">
            {bizDesc || "참숯 위에서 완벽하게 구워내는 최상급 프라임 꽃갈비와 정통 한식 요리의 진수를 경험해 보세요."}
          </p>

          {/* 하단 실시간 테이블 예약 퀵 바 */}
          <div className="max-w-2xl mx-auto bg-[#18181B]/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-medium text-left">
            <input type="text" placeholder="📅 Date: Today" className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white outline-none" />
            <input type="text" placeholder="⏰ Time: 6:30 PM" className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white outline-none" />
            <input type="text" placeholder="👤 4 Guests" className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white outline-none" />
            <button
              type="button"
              onClick={() => onActionClick("FIND A TABLE")}
              className="py-2 rounded-xl font-bold text-white shadow transition-transform hover:scale-105 cursor-pointer text-center"
              style={{ backgroundColor: sizzleRed }}
            >
              FIND TABLE
            </button>
          </div>
        </div>
      </header>

      {/* 4. 4단 K-BBQ 하이라이트 바 */}
      <section className="max-w-6xl mx-auto px-6 -mt-6 relative z-30 w-full">
        <div className="bg-[#18181B] rounded-2xl shadow-2xl border border-white/10 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 overflow-hidden">
          {[
            { icon: "🥩", title: "Prime Beef Galbi", desc: "최상급 프라임 양념/생갈비" },
            { icon: "🥓", title: "Thick Pork Belly", desc: "두툼한 칼집 통삼겹살" },
            { icon: "🍲", title: "Authentic Stews", desc: "해물순두부 & 차돌된장찌개" },
            { icon: "🍶", title: "Soju & Craft Beer", desc: "한국 소주 & 프리미엄 맥주" },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onActionClick(item.title)}
              className="p-4 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer text-left"
            >
              <span className="text-2xl p-2 rounded-xl bg-black/60 shrink-0">{item.icon}</span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                <p className="text-[11px] text-gray-400 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 시그니처 K-BBQ 메뉴 쇼케이스 (3열 카드) */}
      <main className="max-w-6xl mx-auto px-6 py-16 w-full space-y-16 text-left">
        <section id="menu" className="space-y-8">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-500">SIGNATURE SELECTION</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">POPULAR BBQ & GALBI</h2>
            </div>
            <button
              type="button"
              onClick={() => onActionClick("FULL MENU")}
              className="text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              전체 메뉴판 보기 &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Marinated Prime Galbi", kor: "프라임 양념 소갈비", price: "$39.95", desc: "24시간 특제 과일 양념에 숙성한 부드러운 육질", imgIdx: 1 },
              { title: "K-Pork Belly Combo", kor: "생삼겹살 & 목살 콤보", price: "$29.95", desc: "신선한 통삼겹살과 겉절이 김치, 쌈채소 세트", imgIdx: 2 },
              { title: "Chadolbaegi & Stew", kor: "차돌박이 & 된장찌개", price: "$27.95", desc: "고소한 차돌박이와 구수한 된장찌개의 조화", imgIdx: 3 },
            ].map((card, idx) => (
              <div key={idx} className="bg-[#18181B] rounded-3xl border border-white/10 overflow-hidden shadow-lg hover:border-red-500/50 transition-all flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <EditableImage sectionKey={`kbbq-menu-${idx}`} defaultUrl={images[card.imgIdx % images.length]} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    BEST SELLER
                  </span>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{card.title}</h4>
                    <p className="text-xs text-red-400 font-semibold">{card.kor}</p>
                    <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-base font-black text-amber-400">{card.price}</span>
                    <button
                      type="button"
                      onClick={() => onActionClick(`ORDER ${card.title}`)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow transition-transform hover:scale-105"
                      style={{ backgroundColor: sizzleRed }}
                    >
                      주문하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. 프라이빗 룸 & 단체 파티 예약 안내 */}
        <section className="bg-gradient-to-r from-red-950/60 via-[#18181B] to-black rounded-3xl p-8 sm:p-12 border border-red-900/30 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">PRIVATE DINING & EVENTS</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              단체 회식 & 프라이빗 파티 룸 완비
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg">
              10인부터 50인까지 수용 가능한 프라이빗 다이닝 룸과 최신식 환기 시스템으로 쾌적한 K-BBQ 파티를 즐기실 수 있습니다.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-start md:justify-end">
            <button
              type="button"
              onClick={() => onActionClick("단체 예약 문의")}
              className="px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-xl transition-all hover:scale-105 cursor-pointer"
              style={{ backgroundColor: sizzleRed }}
            >
              룸 예약 및 대관 문의 &rarr;
            </button>
          </div>
        </section>

        {/* 7. 영업 시간 & 오시는 길 2단 스플릿 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-[#18181B] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <span className="text-xs font-bold text-red-500 uppercase">HOURS OF OPERATION</span>
            <h3 className="text-lg font-bold text-white">영업 시간 안내</h3>
            <div className="space-y-2 text-xs text-gray-300 font-mono">
              <p className="flex justify-between border-b border-white/5 pb-1.5"><span>월요일 - 목요일:</span> <span>11:30 AM - 10:00 PM</span></p>
              <p className="flex justify-between border-b border-white/5 pb-1.5"><span>금요일 - 토요일:</span> <span>11:30 AM - 11:00 PM</span></p>
              <p className="flex justify-between"><span>일요일:</span> <span>12:00 PM - 10:00 PM</span></p>
            </div>
          </div>

          <div className="bg-[#18181B] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <span className="text-xs font-bold text-red-500 uppercase">LOCATION & PARKING</span>
            <h3 className="text-lg font-bold text-white">매장 위치 및 주차 안내</h3>
            <p className="text-xs text-gray-300 leading-relaxed font-mono">
              📍 8520 Golf Rd, Niles, IL 60714 (시카고 인근)<br />
              🚗 대형 무료 주차장 완비 (전용 파킹랏 제공)
            </p>
            <button
              type="button"
              onClick={() => onActionClick("GOOGLE MAPS")}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Google Maps 길찾기 &rarr;
            </button>
          </div>
        </section>
      </main>

      {/* 8. K-BBQ Footer */}
      <footer className="w-full py-12 px-8 border-t border-white/10 bg-black text-center text-xs text-gray-500 mt-auto">
        <p className="font-bold text-white mb-2 uppercase tracking-widest">{bizName} KOREAN BBQ</p>
        <p className="text-gray-400 mb-2">PHONE: {contact || "(847) 983-8282"}</p>
        <p className="opacity-60">© 2026 {bizName}. All Rights Reserved. Powered by Google Flow.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 2. 프리미엄 프랜차이즈 표준 풀와이드 (투썸플레이스 / 스타벅스 스타일)
// ════════════════════════════════════════════════════════════════════════
function CorporateFranchiseLayout({
  accentColor,
  bizName,
  bizDesc,
  images,
  logoUrl,
  contact,
  navMenus,
  onActionClick,
  onNavClick,
}: LayoutProps) {
  const brandRed = accentColor || "#D62828";

  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#F8F9FA] text-[#111827]">
      <div className="bg-[#1E1E24] text-gray-300 text-xs py-2 px-8 flex justify-between items-center border-b border-gray-800">
        <div className="flex gap-4">
          <span className="font-semibold text-white">프리미엄 프랜차이즈</span>
          <span className="text-gray-500">|</span>
          <span>고객센터: {contact || "1577-4410"}</span>
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={() => onActionClick("가맹 상담")} className="hover:text-white transition-colors cursor-pointer">
            가맹점 개설 문의 &rarr;
          </button>
        </div>
      </div>

      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b-2 border-gray-200 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-6">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" className="h-8 max-w-[160px] object-contain cursor-pointer" onClick={() => onNavClick("hero", 0)} />
          ) : (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavClick("hero", 0)}>
              <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: brandRed }} />
              <span className="text-xl font-black tracking-tight text-gray-900">{bizName}</span>
            </div>
          )}
        </div>

        <div className="hidden md:flex gap-8 items-center">
          {navMenus.map((menu, idx) => (
            <button
              key={menu}
              type="button"
              onClick={() => onNavClick(menu, idx)}
              className="text-sm font-bold text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
            >
              {menu}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onActionClick("ONLINE ORDER")}
          className="px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
          style={{ backgroundColor: brandRed }}
        >
          매장 주문 / 예약
        </button>
      </nav>

      <header id="hero" className="relative w-full h-[480px] md:h-[540px] overflow-hidden bg-black flex items-center">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="relative z-20 max-w-6xl mx-auto px-8 w-full text-left space-y-5">
          <span
            className="text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-md text-white shadow-sm inline-block"
            style={{ backgroundColor: brandRed }}
          >
            SEASON SIGNATURE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-md">
            {bizDesc}
          </h1>
          <p className="text-base sm:text-lg text-gray-200 font-medium max-w-xl leading-relaxed">
            {bizName}가 제안하는 이번 시즌 가장 찬란한 디저트와 깊은 풍미의 스페셜티 블렌드를 만나보세요.
          </p>
          <div className="pt-2 flex gap-3.5">
            <button
              type="button"
              onClick={() => onActionClick("신메뉴 보러가기")}
              className="px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-xl transition-all hover:scale-105 cursor-pointer"
              style={{ backgroundColor: brandRed }}
            >
              신메뉴 자세히 보기 &rarr;
            </button>
            <button
              type="button"
              onClick={() => onActionClick("가까운 매장 찾기")}
              className="px-7 py-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-all cursor-pointer border border-white/30"
            >
              매장 찾기
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-30 w-full">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 overflow-hidden">
          {[
            { icon: "☕", title: "신제품 소개", desc: "시즌 시그니처 라인업" },
            { icon: "🎂", title: "홀케이크 예약", desc: "원하는 날짜에 픽업" },
            { icon: "📍", title: "매장 찾기", desc: "내 주변 가까운 매장" },
            { icon: "🤝", title: "가맹 개설 문의", desc: "1:1 창업 컨설팅" },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onActionClick(item.title)}
              className="p-5 flex items-center gap-3.5 hover:bg-gray-50 transition-colors cursor-pointer text-left"
            >
              <span className="text-3xl p-2.5 rounded-xl bg-gray-100 shrink-0">{item.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full space-y-16">
        <section id="menu" className="space-y-8 text-left">
          <div className="flex items-center justify-between border-b-2 border-gray-200 pb-4">
            <div>
              <span className="text-xs font-bold text-red-600 tracking-wider uppercase">OUR BEST MENU</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">시그니처 메뉴 라인업</h2>
            </div>
            <button
              type="button"
              onClick={() => onActionClick("전체 메뉴 보기")}
              className="text-xs font-bold text-gray-700 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              전체 메뉴 보기 &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-3xl overflow-hidden border-2 border-gray-200 shadow-md relative min-h-[380px]">
              <EditableImage sectionKey="menu-hero" defaultUrl={images[1 % images.length]} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-left">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">PREMIUM SELECTION</span>
                <h3 className="text-2xl font-black text-white mb-2">스트로베리 초콜릿 링 생크림</h3>
                <p className="text-xs text-gray-200 leading-relaxed max-w-md">
                  신선한 생딸기와 진한 가나슈 생크림이 조화를 이루는 {bizName}의 부동의 No.1 대표 시그니처 케이크입니다.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-6">
              {[
                { title: "스패니쉬 연유 라떼", desc: "진하고 부드러운 스위트 에스프레소", imgIdx: 2 },
                { title: "로얄 밀크티 쉐이크", desc: "얼그레이 찻잎을 진하게 우려낸 풍미", imgIdx: 3 },
              ].map((subItem, idx) => (
                <div key={idx} className="bg-white rounded-3xl border-2 border-gray-200 p-5 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                    <EditableImage sectionKey={`sub-menu-${idx}`} defaultUrl={images[subItem.imgIdx % images.length]} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-left space-y-1">
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">RECOMMEND</span>
                    <h4 className="text-sm font-bold text-gray-900">{subItem.title}</h4>
                    <p className="text-xs text-gray-500 font-medium">{subItem.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 px-8 border-t-2 border-gray-200 bg-white text-left text-xs text-gray-500 mt-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <p><strong>(주){bizName}</strong> | 고객상담센터: {contact || "1577-4410"}</p>
          <p className="text-gray-400">© 2026 {bizName} Corp. ALL RIGHTS RESERVED. POWERED BY GOOGLE FLOW.</p>
        </div>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 3. 글로벌 모던 비즈니스 / 부동산 / 에이전시 (Horizon Realty 스타일)
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
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 4. 헤리티지 럭셔리 스테이 / 전통 공방 (감찰댁 한옥마을 스타일)
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

      <header id="hero" className="relative w-full h-[520px] sm:h-[600px] flex items-center justify-center text-center">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-20 space-y-4 px-6 text-white max-w-2xl">
          <span className="text-xs font-sans tracking-widest uppercase text-[#E5D7C5]">A RELAXATION UNIT ROOTS IN NATURE</span>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight drop-shadow-md">
            {bizDesc || "사계절이 머무는 고즈넉한 쉼터"}
          </h1>
        </div>
      </header>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 5. 럭셔리 여행 / 리조트 큐레이션 (The Art of Escape 스타일)
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
        </div>
      </header>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 6. MAIN ROUTER
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
    navMenus: navMenus && navMenus.length > 0 ? navMenus : ["BBQ MENU", "TABLE RESERVATION", "ONLINE ORDER", "LOCATION"],
    onActionClick: handleActionClick,
    onNavClick: handleNavClick,
  };

  const templateId = selectedTemplate.id;
  const layoutType = selectedTemplate.layoutType;

  const renderLayout = () => {
    // 1. K-BBQ & 갈비 하우스 (김치BBQ / 시카고 갈비 하우스 스타일)
    if (templateId === "cafe-kbbq" || layoutType === "kbbq") {
      return <KoreanBBQRestaurantLayout {...props} />;
    }
    // 2. 투썸플레이스 / 대형 브랜드 프랜차이즈 표준 레이아웃
    if (templateId === "cafe-corporate" || layoutType === "corporate") {
      return <CorporateFranchiseLayout {...props} />;
    }
    // 3. 전통 한옥 스테이 / 전통 공방 (감찰댁 스타일)
    if (selectedCategory === "traditional" || templateId.includes("traditional")) {
      return <TraditionalStayHeritageLayout {...props} />;
    }
    // 4. 럭셔리 리조트 / 여행 큐레이션 (The Art of Escape 스타일)
    if (layoutType === "overlay" || selectedCategory === "personal") {
      return <LuxuryTravelResortLayout {...props} />;
    }
    // 5. 기본: 글로벌 모던 비즈니스 / 부동산 / 에이전시 (Horizon Realty 스타일)
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
