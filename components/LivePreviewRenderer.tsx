"use client";

import { useBriefStore } from "@/store/briefStore";
import type { Template } from "@/lib/types";
import { useMemo, useState } from "react";

const SECTION_KR: Record<string, string> = {
  hero: "히어로", about: "교회 소개", menu: "사역 안내", gallery: "갤러리",
  location: "오시는 길", instagram: "인스타그램", story: "우리의 이야기", events: "교회 소식",
  contact: "문의하기", features: "주요 특징", curriculum: "커리큘럼", teachers: "강사진",
  results: "합격 실적", schedule: "예배 시간표", classes: "클래스 안내", instructors: "강사 소개",
  testimonials: "수강 후기", pricing: "수강료", enroll: "신청하기", courses: "강좌 목록",
  demo: "무료 체험", faq: "자주 묻는 질문", cta: "시작하기", works: "포트폴리오", process: "작업 과정",
  skills: "보유 스킬", services: "제공 서비스", booking: "예약하기", links: "링크 모음",
  "latest-content": "최신 콘텐츠", shop: "쇼핑몰", newsletter: "주보 및 소식지",
  philosophy: "목회 철학", barista: "목회자 소개", reservations: "예배 등록",
  stay: "객실 및 공간", architecture: "건축 이야기", reservation: "테이블 예약",
  chef: "셰프 소개", "course-menu": "코스 메뉴", "private-room": "프라이빗 룸"
};

const KEYWORD_IMAGE_POOLS: Record<string, string[]> = {
  cafe: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80"
  ],
  academy: [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80"
  ],
  religion: [
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80", // Church Worship Crowd
    "https://images.unsplash.com/photo-1548625361-195fe612b7a4?w=1200&q=80", // Bible / Cross
    "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&q=80", // Church Sanctuary
    "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=80", // Warm Community
    "https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?w=1200&q=80"  // Pastor Sermon
  ],
  personal: [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80"
  ],
  traditional: [
    "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?w=1200&q=80",
    "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1200&q=80",
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80",
    "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&q=80"
  ],
  default: [
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80",
    "https://images.unsplash.com/photo-1548625361-195fe612b7a4?w=1200&q=80",
    "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&q=80"
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
// 🌟 1. 모던 워십 & 교회 커뮤니티 레이아웃 (Gateway Church / Denver FMC 스타일)
// ════════════════════════════════════════════════════════════════════════
function ModernChurchCommunityLayout({
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
  const brandTeal = accentColor || "#0D9488";

  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-white text-[#0F172A]">
      {/* 1. Top Church Nav Header */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavClick("hero", 0)}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" className="h-8 max-w-[160px] object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl">⛪</span>
              <span className="text-xl font-black tracking-tight text-gray-900">{bizName}</span>
            </div>
          )}
        </div>

        <div className="hidden md:flex gap-8 items-center text-xs sm:text-sm font-bold text-gray-600">
          {navMenus.map((menu, idx) => (
            <button key={menu} type="button" onClick={() => onNavClick(menu, idx)} className="hover:text-teal-700 transition-colors cursor-pointer uppercase">
              {menu}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onActionClick("ONLINE GIVING")}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
            style={{ backgroundColor: brandTeal }}
          >
            온라인 헌금 (GIVE) ❤️
          </button>
        </div>
      </nav>

      {/* 2. Top 4-Color Action Blocks (Gateway Church Signature) */}
      <section className="w-full grid grid-cols-2 md:grid-cols-4 text-white text-left font-pretendard divide-x divide-white/10">
        {[
          { title: "NEW HERE?", desc: "처음 오셨나요? 새가족 환영", bg: "#0D9488" },
          { title: "ABOUT US", desc: "교회 소개 및 목회 비전", bg: "#0F766E" },
          { title: "MINISTRIES", desc: "교회학교 및 다음세대 사역", bg: "#115E59" },
          { title: "GIVE", desc: "사랑과 감사의 온라인 헌금", bg: "#134E4A" },
        ].map((block, idx) => (
          <div
            key={idx}
            onClick={() => onActionClick(block.title)}
            className="p-6 sm:p-8 cursor-pointer transition-all hover:brightness-110 flex flex-col justify-between min-h-[110px]"
            style={{ backgroundColor: block.bg }}
          >
            <h3 className="text-base sm:text-lg font-black tracking-wider">{block.title}</h3>
            <p className="text-xs text-teal-100 font-medium opacity-90">{block.desc}</p>
          </div>
        ))}
      </section>

      {/* 3. Worship Hero Banner (16:9 찬양 집회 대형 화보) */}
      <header id="hero" className="relative w-full h-[480px] md:h-[560px] overflow-hidden bg-black flex items-center justify-center">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />

        <div className="relative z-20 max-w-4xl mx-auto px-6 w-full text-center space-y-5 text-white">
          <span className="text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full bg-teal-900/80 border border-teal-400/40 text-teal-200">
            WELCOME TO {bizName.toUpperCase()}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black leading-tight drop-shadow-2xl">
            WE&apos;RE ALL ABOUT <br />
            <span style={{ color: brandTeal }}>PEOPLE & FAITH.</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-200 font-medium max-w-xl mx-auto leading-relaxed">
            {bizDesc || "하나님의 은혜와 사랑이 머무는 곳, 모든 세대가 함께 예배하고 회복되는 믿음의 공동체입니다."}
          </p>

          <div className="flex justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={() => onActionClick("PLAN YOUR VISIT")}
              className="px-7 py-3.5 rounded-xl text-xs font-bold text-white shadow-xl transition-all hover:scale-105 cursor-pointer"
              style={{ backgroundColor: brandTeal }}
            >
              예배 방문 안내 (PLAN YOUR VISIT) &rarr;
            </button>
            <button
              type="button"
              onClick={() => onActionClick("WATCH ONLINE")}
              className="px-6 py-3.5 rounded-xl text-xs font-bold bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-all border border-white/30 cursor-pointer"
            >
              실시간 온라인 예배 📺
            </button>
          </div>
        </div>
      </header>

      {/* 4. 3단 퀵 안내 박스 (Quick Essentials Bar: Location / Service Time / Sermons) */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-30 w-full">
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 overflow-hidden">
          {/* Box 1: Location */}
          <div className="p-6 sm:p-8 space-y-3 text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-teal-600 font-bold text-xs">
                <span>📍</span> LOCATION
              </div>
              <h4 className="text-base font-black text-gray-900 mt-1">교회 본당 및 오시는 길</h4>
              <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                7380 E 2nd Street, Scottsdale, AZ 85251<br />
                (넓은 전용 주차 공간 및 셔틀 운행)
              </p>
            </div>
            <button
              type="button"
              onClick={() => onActionClick("GET DIRECTIONS")}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
            >
              GET DIRECTIONS &rarr;
            </button>
          </div>

          {/* Box 2: Service Time */}
          <div className="p-6 sm:p-8 space-y-3 text-left flex flex-col justify-between bg-teal-50/50">
            <div>
              <div className="flex items-center gap-2 text-teal-700 font-bold text-xs">
                <span>🕒</span> SERVICE TIME
              </div>
              <h4 className="text-base font-black text-gray-900 mt-1">주일 및 주중 예배 시간</h4>
              <p className="text-xs text-gray-600 font-medium mt-1 leading-relaxed">
                주일 1부 예배: 오전 9:00<br />
                주일 2부 예배: 오전 11:00 (어린이 사역 동시 진행)
              </p>
            </div>
            <button
              type="button"
              onClick={() => onActionClick("PLAN YOUR VISIT")}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow transition-transform hover:scale-102"
              style={{ backgroundColor: brandTeal }}
            >
              PLAN YOUR VISIT &rarr;
            </button>
          </div>

          {/* Box 3: Sermons */}
          <div className="p-6 sm:p-8 space-y-3 text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-teal-600 font-bold text-xs">
                <span>🎙️</span> SERMONS
              </div>
              <h4 className="text-base font-black text-gray-900 mt-1">주일 설교 말씀 다시듣기</h4>
              <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                언제 어디서나 유튜브와 오디오 팟캐스트로 매주 선포되는 생명의 말씀을 들으실 수 있습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onActionClick("LISTEN SERMONS")}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
            >
              LISTEN NOW 🎧
            </button>
          </div>
        </div>
      </section>

      {/* 5. 4단 사역 & 부서 카드 (Ministries Grid) */}
      <main className="max-w-6xl mx-auto px-6 py-20 w-full space-y-20 text-left">
        <section id="ministries" className="space-y-8">
          <div className="border-b-2 border-gray-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">WHERE TO CONNECT</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">부서별 사역 안내</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🙌", title: "WORSHIP", desc: "영과 진리로 드리는 뜨거운 찬양과 예배" },
              { icon: "📅", title: "CALENDAR", desc: "교회 주요 행사 및 연간 사역 일정" },
              { icon: "🧒", title: "NEXT GEN", desc: "믿음으로 자라나는 영유아 및 청소년부" },
              { icon: "🌍", title: "MISSIONS", desc: "세상을 품고 복음을 전하는 국내외 선교" },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => onActionClick(item.title)}
                className="bg-white p-6 rounded-3xl border-2 border-gray-100 hover:border-teal-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 text-left flex flex-col justify-between"
              >
                <span className="text-3xl p-3 rounded-2xl bg-teal-50 w-fit">{item.icon}</span>
                <div>
                  <h4 className="text-base font-bold text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. 최신 주일 설교 말씀 3열 카드 쇼케이스 (NEW SERMONS) */}
        <section id="sermons" className="space-y-8">
          <div className="flex items-end justify-between border-b-2 border-gray-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">MESSAGE ARCHIVE</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">최신 주일 설교 말씀</h2>
            </div>
            <button
              type="button"
              onClick={() => onActionClick("설교 아카이브 전체보기")}
              className="text-xs font-bold text-gray-600 hover:text-teal-700"
            >
              설교 전체 아카이브 &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "믿음의 반석 위에 세운 공동체", scripture: "마태복음 16:18", date: "2026.08.16 주일 2부", imgIdx: 1 },
              { title: "광야에서 만나는 하나님의 은혜", scripture: "출애굽기 17:1-7", date: "2026.08.09 주일 2부", imgIdx: 2 },
              { title: "다음 세대를 향한 소망과 비전", scripture: "디모데후서 1:5", date: "2026.08.02 주일 2부", imgIdx: 3 },
            ].map((sermon, idx) => (
              <div key={idx} className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <EditableImage sectionKey={`sermon-${idx}`} defaultUrl={images[sermon.imgIdx % images.length]} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="w-12 h-12 rounded-full bg-white/90 text-teal-800 flex items-center justify-center text-lg shadow-lg">
                      ▶
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{sermon.date}</span>
                    <h4 className="text-base font-bold text-gray-900 mt-2">{sermon.title}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">📖 본문: {sermon.scripture}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onActionClick(`설교 재생: ${sermon.title}`)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900"
                    >
                      영상 보기 &rarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => onActionClick(`주보 다운로드: ${sermon.date}`)}
                      className="text-[11px] font-bold text-gray-500 hover:text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg"
                    >
                      주보 PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 7. Church Footer */}
      <footer className="w-full py-12 px-8 border-t-2 border-gray-100 bg-gray-50 text-left text-xs text-gray-500 mt-auto">
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="font-bold text-gray-900 uppercase tracking-wider">{bizName}</p>
          <p className="text-gray-500">교회 사무실: {contact || "(303) 755-1234"} | 주소: 7380 E 2nd Street, Scottsdale, AZ 85251</p>
          <p className="opacity-70">© 2026 {bizName}. All Rights Reserved. Powered by Google Flow.</p>
        </div>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 2. 온라인 라이브 & 동영상 강좌 플랫폼
// ════════════════════════════════════════════════════════════════════════
function OnlineAcademyLiveLayout({
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
  const brandPink = accentColor || "#DC2626";

  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#F8FAFC] text-[#0F172A]">
      <div className="bg-[#1E1B4B] text-white text-xs py-2.5 px-8 flex justify-between items-center border-b border-indigo-900">
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1.5 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full animate-pulse">
            🔴 LIVE
          </span>
          <span className="font-semibold text-indigo-200">2026 스타강사 실시간 Live 클래스 전격 개강</span>
          <span className="hidden sm:inline text-indigo-400">|</span>
          <span className="hidden sm:inline text-xs text-indigo-300">상담 문의: {contact || "1899-3540"}</span>
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={() => onActionClick("로그인 / 회원가입")} className="text-indigo-200 hover:text-white font-bold transition-colors cursor-pointer">
            로그인 · 수강생 센터 &rarr;
          </button>
        </div>
      </div>

      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b-2 border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavClick("hero", 0)}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" className="h-8 max-w-[160px] object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <span className="text-xl font-black tracking-tight text-slate-900">{bizName}</span>
            </div>
          )}
        </div>

        <div className="hidden md:flex gap-8 items-center text-xs sm:text-sm font-bold text-slate-700">
          {navMenus.map((menu, idx) => (
            <button key={menu} type="button" onClick={() => onNavClick(menu, idx)} className="hover:text-red-600 transition-colors cursor-pointer">
              {menu}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onActionClick("수강 신청하기")}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
            style={{ backgroundColor: brandPink }}
          >
            수강 신청하기 &rarr;
          </button>
        </div>
      </nav>

      <header id="hero" className="relative w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden py-16 sm:py-20 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/30 border border-red-500/50 text-red-400 text-xs font-bold">
              <span>⭐</span> 대한민국 No.1 프리미엄 라이브 아카데미
            </div>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight drop-shadow-md">
              스타강사의 명강의를 <br />
              <span className="text-amber-400">온라인 Live로!</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-lg leading-relaxed">
              {bizDesc || "오프라인 현장의 생생한 몰입감과 1:1 실시간 밀착 피드백을 당신의 방에서 완벽하게 경험해 보세요."}
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 aspect-[4/5] bg-slate-800">
              <EditableImage sectionKey="hero-instructor" defaultUrl={images[0]} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 3. 정통 숯불 다이닝 & 그릴 레이아웃
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
      <div className="bg-[#18181B] text-gray-300 text-xs py-2 px-8 flex justify-between items-center border-b border-white/10">
        <div className="flex gap-4 items-center">
          <span className="text-red-500 font-bold">🔥 AUTHENTIC SIZZLING DINING</span>
          <span className="text-gray-600">|</span>
          <span>RESERVATION & INQUIRY: {contact || "(847) 983-8282"}</span>
        </div>
      </div>

      <nav className="flex items-center justify-between px-8 py-4 bg-[#09090B]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavClick("hero", 0)}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥩</span>
              <span className="text-lg font-black tracking-tight text-white uppercase">{bizName}</span>
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

        <button
          type="button"
          onClick={() => onActionClick("TABLE RESERVATION")}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
          style={{ backgroundColor: sizzleRed }}
        >
          TABLE RESERVATION &rarr;
        </button>
      </nav>

      <header id="hero" className="relative w-full h-[500px] md:h-[560px] overflow-hidden bg-black flex items-center justify-center">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-black/40 to-black/70" />

        <div className="relative z-20 max-w-5xl mx-auto px-6 w-full text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight drop-shadow-2xl">
            AUTHENTIC SIZZLING <br />
            <span style={{ color: sizzleRed }}>EXPERIENCE.</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-medium max-w-xl mx-auto leading-relaxed">
            {bizDesc || "참숯 위에서 완벽하게 구워내는 최상급 프라임 꽃갈비와 정통 다이닝 요리의 진수를 경험해 보세요."}
          </p>
        </div>
      </header>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 4. 프리미엄 프랜차이즈 & 코퍼레이트 레이아웃
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
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b-2 border-gray-200 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavClick("hero", 0)}>
          <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: brandRed }} />
          <span className="text-xl font-black tracking-tight text-gray-900">{bizName}</span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          {navMenus.map((menu, idx) => (
            <button key={menu} type="button" onClick={() => onNavClick(menu, idx)} className="text-sm font-bold text-gray-700 hover:text-red-600 transition-colors cursor-pointer">
              {menu}
            </button>
          ))}
        </div>
      </nav>

      <header id="hero" className="relative w-full h-[480px] md:h-[540px] overflow-hidden bg-black flex items-center">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative z-20 max-w-6xl mx-auto px-8 w-full text-left space-y-5">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-md">
            {bizDesc}
          </h1>
        </div>
      </header>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 5. MAIN ROUTER
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
    navMenus: navMenus && navMenus.length > 0 ? navMenus : ["NEW HERE", "ABOUT US", "MINISTRIES", "SERMONS"],
    onActionClick: handleActionClick,
    onNavClick: handleNavClick,
  };

  const templateId = selectedTemplate.id;
  const layoutType = selectedTemplate.layoutType;

  const renderLayout = () => {
    // 1. 종교 / 교회 / NGO 커뮤니티 카테고리
    if (selectedCategory === "religion" || templateId.includes("religion") || templateId.includes("church")) {
      return <ModernChurchCommunityLayout {...props} />;
    }
    // 2. 학원 / 교육 / 동영상 클래스 카테고리
    if (selectedCategory === "academy" || templateId.includes("academy")) {
      return <OnlineAcademyLiveLayout {...props} />;
    }
    // 3. 정통 숯불 다이닝 & 그릴 레이아웃
    if (templateId === "cafe-kbbq" || layoutType === "kbbq" || templateId.includes("finedining") || templateId.includes("modern")) {
      return <KoreanBBQRestaurantLayout {...props} />;
    }
    // 4. 프리미엄 프랜차이즈 & 코퍼레이트 레이아웃
    return <CorporateFranchiseLayout {...props} />;
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
