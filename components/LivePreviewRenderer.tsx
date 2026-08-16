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
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80", // Female Instructor
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80", // Auditorium / Classroom
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80", // Students Studying
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80", // Professional Teacher
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80"  // Online Learning Laptop
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
  religion: [
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80",
    "https://images.unsplash.com/photo-1548625361-195fe612b7a4?w=1200&q=80",
    "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&q=80"
  ],
  default: [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80"
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
// 🌟 1. 온라인 라이브 & 동영상 강좌 플랫폼 (모아 아카데미 / 권아나스쿨 스타일)
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
      {/* 1. Top Utility Notification Bar */}
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

      {/* 2. Education GNB */}
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
            onClick={() => onActionClick("무료 맛보기 강의")}
            className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
          >
            무료 샘플 강의
          </button>
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

      {/* 3. 스타강사 프로필 & 라이브 히어로 (2단 스플릿) */}
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

            <div className="flex flex-wrap gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => onActionClick("전체 강좌 둘러보기")}
                className="px-7 py-3.5 rounded-xl text-xs font-bold text-white shadow-xl transition-all hover:scale-105 cursor-pointer"
                style={{ backgroundColor: brandPink }}
              >
                실시간 강좌 신청 &rarr;
              </button>
              <button
                type="button"
                onClick={() => onActionClick("1:1 학습 상담")}
                className="px-6 py-3.5 rounded-xl text-xs font-bold bg-white/15 text-white backdrop-blur-md hover:bg-white/25 transition-all border border-white/20 cursor-pointer"
              >
                1:1 맞춤 학습 상담
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 aspect-[4/5] bg-slate-800">
              <EditableImage sectionKey="hero-instructor" defaultUrl={images[0]} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-left">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">CHIEF INSTRUCTOR</span>
                <h4 className="text-lg font-black text-white">대표 스타 강사진 1:1 라이브</h4>
                <p className="text-xs text-slate-300">누적 수강생 15,000명 돌파 · 평점 4.9★</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4. 4단 실시간 추천 강좌 뱃지 바 */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-20 w-full">
        <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 overflow-hidden">
          {[
            { icon: "🗣️", title: "실전 스피킹 & 토익", desc: "스타강사 실시간 어학 코칭" },
            { icon: "💼", title: "수익화 & 창업 마스터", desc: "월매출 3천 실전 비즈니스" },
            { icon: "📜", title: "국가공인 자격증", desc: "단기 합격 실전 커리큘럼" },
            { icon: "📖", title: "PDF 전자책 정기구독", desc: "지식 라이브러리 무제한" },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onActionClick(item.title)}
              className="p-5 flex items-center gap-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <span className="text-3xl p-2.5 rounded-2xl bg-indigo-50 shrink-0">{item.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 인기 강좌 목록 & 커리큘럼 쇼케이스 */}
      <main className="max-w-6xl mx-auto px-6 py-16 w-full space-y-16 text-left">
        <section id="courses" className="space-y-8">
          <div className="flex items-end justify-between border-b-2 border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">POPULAR COURSES</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">실시간 인기 추천 강좌</h2>
            </div>
            <button type="button" onClick={() => onActionClick("전체 강좌 보기")} className="text-xs font-bold text-slate-600 hover:text-slate-900">
              전체 강좌 목록 &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "2026 합격 보장 올인원 마스터", sub: "스타강사의 핵심 비법 직강", price: "월 49,000원", badge: "HOT LIVE", imgIdx: 1 },
              { title: "비전공자 실무 완성 8주 완성", sub: "기초부터 포트폴리오까지 1:1 코칭", price: "월 59,000원", badge: "BEST", imgIdx: 2 },
              { title: "PDF 전자책 & VOD 무제한 멤버십", sub: "언제 어디서나 무제한 스트리밍", price: "월 19,900원", badge: "구독형", imgIdx: 3 },
            ].map((card, idx) => (
              <div key={idx} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <EditableImage sectionKey={`course-${idx}`} defaultUrl={images[card.imgIdx % images.length]} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {card.badge}
                  </span>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{card.title}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{card.sub}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-black text-indigo-950">{card.price}</span>
                    <button
                      type="button"
                      onClick={() => onActionClick(`강좌 수강 - ${card.title}`)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-transform hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: brandPink }}
                    >
                      수강신청
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. 수강생 리얼 합격 후기 & 만족도 4.9★ */}
        <section className="bg-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">REAL TESTIMONIALS</span>
            <h3 className="text-2xl sm:text-3xl font-black">수강생 98.4%가 증명하는 합격 실적</h3>
            <p className="text-xs text-indigo-300">실제 라이브 수강생들의 생생한 수강 후기와 실전 합격 스토리입니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-slate-900">
            {[
              { author: "김*진 수강생", course: "실전 토익 마스터", review: "퇴근 후 집에서 라이브로 들었는데 현장 강의보다 집중도가 훨씬 높았습니다! 3달 만에 목표 점수 달성했어요." },
              { author: "이*석 수강생", course: "비즈니스 실무", review: "체계적인 커리큘럼과 1:1 과제 피드백 덕분에 혼자서 막막했던 실무 프로젝트를 완벽히 끝낼 수 있었습니다." },
              { author: "박*아 수강생", course: "PDF 전자책 정기구독", review: "이동 중에 태블릿으로 보기 너무 편하고 알짜배기 노하우만 꽉꽉 차 있어서 매일 성장하는 느낌입니다." },
            ].map((rev, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-md space-y-3 text-left">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-800">{rev.author}</span>
                  <span className="text-amber-500 font-bold">★★★★★ 5.0</span>
                </div>
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded block">{rev.course}</span>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.review}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 7. Education Footer */}
      <footer className="w-full py-12 px-8 border-t-2 border-slate-200 bg-white text-left text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="font-bold text-slate-900 uppercase tracking-wider">{bizName} 원격평생교육원</p>
          <p className="text-slate-400">대표상담센터: {contact || "1899-3540"} | 사업자등록번호: 120-88-12345</p>
          <p className="opacity-70">© 2026 {bizName}. All Rights Reserved. Powered by Google Flow.</p>
        </div>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 2. 정통 숯불 다이닝 & 그릴 레이아웃 (K-BBQ & Dining)
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
        <div className="flex gap-4">
          <span className="text-amber-400 font-bold">★ 4.9 (Verified Gourmet Reviews)</span>
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
              <div>
                <span className="text-lg font-black tracking-tight text-white uppercase">{bizName}</span>
                <span className="block text-[10px] text-red-500 font-bold tracking-widest -mt-1">PREMIUM GRILL & DINING</span>
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
            onClick={() => onActionClick("ORDER ONLINE")}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            ONLINE ORDER 🛵
          </button>
          <button
            type="button"
            onClick={() => onActionClick("TABLE RESERVATION")}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
            style={{ backgroundColor: sizzleRed }}
          >
            TABLE RESERVATION &rarr;
          </button>
        </div>
      </nav>

      <header id="hero" className="relative w-full h-[500px] md:h-[560px] overflow-hidden bg-black flex items-center justify-center">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-black/40 to-black/70" />

        <div className="relative z-20 max-w-5xl mx-auto px-6 w-full text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-widest">
            <span>🔥</span> SIZZLING PREMIUM PRIME STEAK & BBQ
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight drop-shadow-2xl">
            AUTHENTIC SIZZLING <br />
            <span style={{ color: sizzleRed }}>EXPERIENCE.</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-medium max-w-xl mx-auto leading-relaxed">
            {bizDesc || "참숯 위에서 완벽하게 구워내는 최상급 프라임 꽃갈비와 정통 다이닝 요리의 진수를 경험해 보세요."}
          </p>

          <div className="max-w-2xl mx-auto bg-[#18181B]/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-medium text-left">
            <input type="text" placeholder="📅 Date: Today" className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white outline-none" />
            <input type="text" placeholder="⏰ Time: 6:30 PM" className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white outline-none" />
            <input type="text" placeholder="👤 4 Guests" className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white outline-none" />
            <button
              type="button"
              onClick={() => onActionClick("FIND TABLE")}
              className="py-2 rounded-xl font-bold text-white shadow transition-transform hover:scale-105 cursor-pointer text-center"
              style={{ backgroundColor: sizzleRed }}
            >
              FIND TABLE
            </button>
          </div>
        </div>
      </header>

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
      </main>

      <footer className="w-full py-12 px-8 border-t border-white/10 bg-black text-center text-xs text-gray-500 mt-auto">
        <p className="font-bold text-white mb-2 uppercase tracking-widest">{bizName}</p>
        <p className="text-gray-400 mb-2">PHONE: {contact || "(847) 983-8282"}</p>
        <p className="opacity-60">© 2026 {bizName}. All Rights Reserved. Powered by Google Flow.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 3. 프리미엄 프랜차이즈 & 코퍼레이트 레이아웃
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
        </div>
      </header>

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
                <h3 className="text-2xl font-black text-white mb-2">시그니처 디저트 & 블렌드</h3>
                <p className="text-xs text-gray-200 leading-relaxed max-w-md">
                  깊은 풍미의 스페셜티 블렌드 원두와 함께 완벽한 디저트 페어링을 즐겨보세요.
                </p>
              </div>
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
// 🌟 4. 글로벌 모던 비즈니스 / 부동산 / 에이전시 레이아웃
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
              <span className="text-xl">🏢</span>
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
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-[380px] sm:h-[440px]">
            <EditableImage sectionKey="hero" defaultUrl={images[0]} className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <footer className="w-full py-12 px-8 border-t-2 border-gray-200 bg-white text-center text-xs font-semibold text-gray-500 mt-auto">
        <p className="font-bold text-gray-900 mb-2 uppercase tracking-widest">{bizName}</p>
        <p className="opacity-70">© 2026 {bizName}. All Rights Reserved. Powered by Google Flow.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 5. 헤리티지 럭셔리 스테이 / 전통 공방 레이아웃
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

      <footer className="w-full py-12 px-8 bg-[#1C1410] text-[#E5D7C5] text-center text-xs mt-auto font-sans">
        <p className="font-bold text-base font-serif-kr mb-2">{bizName}</p>
        <p className="text-gray-400 opacity-80">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 6. 럭셔리 여행 / 리조트 큐레이션 레이아웃
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

      <footer className="w-full py-12 px-8 border-t border-gray-200 text-center text-xs font-sans text-gray-500 mt-auto">
        <p className="font-bold text-gray-900 mb-2 uppercase">{bizName}</p>
        <p className="opacity-70">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 7. MAIN ROUTER
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
    navMenus: navMenus && navMenus.length > 0 ? navMenus : ["COURSES", "INSTRUCTORS", "CURRICULUM", "REVIEWS"],
    onActionClick: handleActionClick,
    onNavClick: handleNavClick,
  };

  const templateId = selectedTemplate.id;
  const layoutType = selectedTemplate.layoutType;

  const renderLayout = () => {
    // 1. 학원 / 교육 / 동영상 클래스 카테고리
    if (selectedCategory === "academy" || templateId.includes("academy")) {
      return <OnlineAcademyLiveLayout {...props} />;
    }
    // 2. 정통 숯불 다이닝 & 그릴 레이아웃
    if (templateId === "cafe-kbbq" || layoutType === "kbbq" || templateId.includes("finedining") || templateId.includes("modern")) {
      return <KoreanBBQRestaurantLayout {...props} />;
    }
    // 3. 프리미엄 프랜차이즈 & 코퍼레이트 레이아웃
    if (templateId === "cafe-corporate" || layoutType === "corporate") {
      return <CorporateFranchiseLayout {...props} />;
    }
    // 4. 전통 한옥 스테이 / 전통 공방 레이아웃
    if (selectedCategory === "traditional" || templateId.includes("traditional")) {
      return <TraditionalStayHeritageLayout {...props} />;
    }
    // 5. 럭셔리 여행 / 리조트 큐레이션 레이아웃
    if (layoutType === "overlay" || selectedCategory === "personal" || selectedCategory === "religion") {
      return <LuxuryTravelResortLayout {...props} />;
    }
    // 6. 기본: 글로벌 모던 비즈니스 / 부동산 / 에이전시 레이아웃
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
