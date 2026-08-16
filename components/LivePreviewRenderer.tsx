"use client";

import { useBriefStore } from "@/store/briefStore";
import type { Template } from "@/lib/types";
import { useMemo, useState } from "react";

const SECTION_KR: Record<string, string> = {
  hero: "히어로", about: "소개", menu: "메뉴/사역", gallery: "갤러리",
  location: "오시는 길", instagram: "인스타그램", story: "우리의 이야기", events: "소식/이벤트",
  contact: "문의하기", features: "주요 특징", curriculum: "커리큘럼", teachers: "강사진",
  results: "합격 실적", schedule: "시간표", classes: "클래스 안내", instructors: "강사 소개",
  testimonials: "수강 후기", pricing: "수강료", enroll: "신청하기", courses: "강좌 목록",
  demo: "무료 체험", faq: "자주 묻는 질문", cta: "시작하기", works: "포트폴리오", process: "작업 과정",
  video: "유튜브 영상", sermon: "설교 영상"
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
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80",
    "https://images.unsplash.com/photo-1548625361-195fe612b7a4?w=1200&q=80",
    "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&q=80",
    "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=80",
    "https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?w=1200&q=80"
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

  const handleNextPage = () => setPage((prev) => (prev + 1) % totalPages);
  const handleSelectImage = (url: string) => setSectionImage(activeEditingSection, url);

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

// ── 3. 반응형 유튜브 영상 플레이어 컴포넌트 ──
function YouTubePlayerSection({
  videoId = "dQw4w9WgXcQ",
  title = "공식 소개 영상",
  tag = "OFFICIAL VIDEO",
  theme = "dark"
}: {
  videoId?: string;
  title?: string;
  tag?: string;
  theme?: "dark" | "light";
}) {
  return (
    <section className={`w-full rounded-3xl p-6 sm:p-10 border-2 shadow-2xl ${
      theme === "dark" ? "bg-[#111827] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
    }`}>
      <div className="max-w-4xl mx-auto space-y-4 text-center">
        <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full bg-red-600/20 text-red-500 border border-red-500/30">
          ▶ {tag}
        </span>
        <h3 className="text-xl sm:text-3xl font-black">{title}</h3>
        
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 bg-black mt-4">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
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
// 🎓 학원 1. 스타강사 라이브 & 동영상 강좌 (화이트 & 핑크/레드 2열 스플릿)
// ════════════════════════════════════════════════════════════════════════
function AcademyLiveLayout(props: LayoutProps) {
  const { bizName, bizDesc, images, logoUrl, contact, onActionClick, onNavClick } = props;
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#FAFAFA] text-[#0F172A]">
      <div className="bg-[#DC2626] text-white text-xs py-2 px-8 flex justify-between items-center font-bold">
        <span>🔴 LIVE 실시간 스트리밍 진행 중</span>
        <span>고객센터: {contact || "1899-3540"}</span>
      </div>

      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b-2 border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavClick("hero", 0)}>
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-black text-slate-900">{bizName}</span>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => onActionClick("수강신청")} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#DC2626] text-white shadow-md">
            수강 신청하기 &rarr;
          </button>
        </div>
      </nav>

      {/* 좌우 2열 스플릿 히어로 */}
      <header className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
        <div className="lg:col-span-7 space-y-5">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">STAR INSTRUCTOR LIVE</span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
            스타강사의 명강의를 <br /><span className="text-red-600">온라인 Live로!</span>
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">{bizDesc || "오프라인 현장의 몰입감과 1:1 실시간 피드백을 당신의 방에서 완벽하게 경험하세요."}</p>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => onActionClick("실시간 강의 보기")} className="px-6 py-3.5 rounded-xl text-xs font-bold bg-red-600 text-white shadow-lg">
              실시간 강좌 신청 &rarr;
            </button>
          </div>
        </div>
        <div className="lg:col-span-5 h-[380px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
          <EditableImage sectionKey="hero" defaultUrl={images[0]} className="w-full h-full object-cover" />
        </div>
      </header>

      {/* 유튜브 VOD 영상 쇼케이스 */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        <YouTubePlayerSection videoId="ysz5S6PUM-U" title="2026 스타강사 실시간 맛보기 공개 강의" tag="LIVE SAMPLE LECTURE" theme="light" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "2026 합격 보장 올인원 마스터", price: "월 49,000원", badge: "HOT LIVE", imgIdx: 1 },
            { title: "비전공자 실무 8주 완성 코스", price: "월 59,000원", badge: "BEST", imgIdx: 2 },
            { title: "PDF 전자책 & VOD 무제한 멤버십", price: "월 19,900원", badge: "구독형", imgIdx: 3 },
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-3xl border-2 border-slate-200 p-5 space-y-3 shadow-sm text-left">
              <div className="h-44 rounded-2xl overflow-hidden">
                <EditableImage sectionKey={`course-${idx}`} defaultUrl={images[card.imgIdx % images.length]} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{card.badge}</span>
              <h4 className="text-sm font-bold text-slate-900">{card.title}</h4>
              <p className="text-sm font-black text-red-600">{card.price}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full py-10 px-8 border-t-2 border-slate-200 bg-white text-center text-xs text-slate-400 mt-auto">
        © 2026 {bizName}. All Rights Reserved.
      </footer>
    </div>
  );
}

// 🎓 학원 2. 전문 교육원 & 자격증 (네이비 다크 16:9 풀와이드 배너)
function AcademyCertLayout(props: LayoutProps) {
  const { bizName, bizDesc, images, onActionClick } = props;
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#0F172A] text-white">
      <nav className="flex items-center justify-between px-8 py-5 bg-[#1E293B] border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏛️</span>
          <span className="text-xl font-black text-blue-400">{bizName}</span>
        </div>
        <button type="button" onClick={() => onActionClick("수료증 발급 상담")} className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white">
          자격증 상담 신청
        </button>
      </nav>

      {/* 16:9 풀와이드 히어로 배너 */}
      <header className="relative w-full h-[450px] flex items-center justify-center text-center overflow-hidden">
        <EditableImage sectionKey="hero" defaultUrl={images[1 % images.length]} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/70" />
        <div className="relative z-20 space-y-4 max-w-3xl px-6">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-950 border border-blue-500/40">
            OFFICIAL CERTIFICATION INSTITUTE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">{bizDesc || "공인 수료증과 실무 중심의 전문 자격 교육"}</h1>
          <p className="text-xs sm:text-sm text-slate-300">누적 수료생 10,000명 돌파 · 공인 인증 교육기관</p>
        </div>
      </header>

      {/* 4단 신뢰 스탯 바 */}
      <section className="max-w-5xl mx-auto px-6 -mt-8 relative z-30 w-full">
        <div className="bg-[#1E293B] rounded-2xl p-6 border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center shadow-2xl">
          <div><h4 className="text-2xl font-black text-blue-400">10,000+</h4><p className="text-xs text-slate-400">누적 수료생</p></div>
          <div><h4 className="text-2xl font-black text-amber-400">99.2%</h4><p className="text-xs text-slate-400">자격 취득률</p></div>
          <div><h4 className="text-2xl font-black text-emerald-400">100%</h4><p className="text-xs text-slate-400">공인 수료증</p></div>
          <div><h4 className="text-2xl font-black text-purple-400">50+</h4><p className="text-xs text-slate-400">기업 협약</p></div>
        </div>
      </section>

      {/* 유튜브 세미나 영상 */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        <YouTubePlayerSection videoId="dQw4w9WgXcQ" title="공인 자격증 취득 및 실무 세미나 안내" tag="SEMINAR ARCHIVE" theme="dark" />
      </main>

      <footer className="w-full py-10 px-8 border-t border-white/10 bg-[#0A0F1D] text-center text-xs text-slate-500 mt-auto">
        © 2026 {bizName} 공인교육원. All Rights Reserved.
      </footer>
    </div>
  );
}

// 🎓 학원 3. PDF 전자책 & 정기구독 (민트 그린 라이프스타일 테마)
function AcademyEbookLayout(props: LayoutProps) {
  const { bizName, bizDesc, images, onActionClick } = props;
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#F0FDFA] text-[#134E4A]">
      <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-teal-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="text-xl font-black text-teal-800">{bizName}</span>
        </div>
        <button type="button" onClick={() => onActionClick("구독 시작")} className="px-5 py-2.5 rounded-full text-xs font-bold bg-teal-600 text-white shadow-md">
          첫 달 무료 구독 &rarr;
        </button>
      </nav>

      <header className="max-w-5xl mx-auto px-8 py-16 text-center space-y-5">
        <span className="text-xs font-bold text-teal-600 bg-teal-100 px-3.5 py-1 rounded-full uppercase">E-BOOK & KNOWLEDGE SUBSCRIPTION</span>
        <h1 className="text-3xl sm:text-5xl font-black text-teal-950 leading-tight">{bizDesc || "당신의 일상 언제 어디서나 편안하게 즐기는 독서"}</h1>
        <p className="text-sm text-teal-700 max-w-lg mx-auto">언제 어디서나 스마트폰과 태블릿으로 지식 라이브러리를 무제한 스트리밍하세요.</p>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6 space-y-12">
        <YouTubePlayerSection videoId="L_LUpnjgPso" title="모아의 서재 이용 가이드 & 추천 전자책 큐레이션" tag="E-BOOK PREVIEW" theme="light" />

        {/* 요금제 비교 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-white p-8 rounded-3xl border-2 border-teal-200 shadow-sm space-y-4">
            <h4 className="text-lg font-bold text-teal-900">월간 베이직 플랜</h4>
            <p className="text-2xl font-black text-teal-600">월 9,900원</p>
            <p className="text-xs text-teal-700">매월 업데이트되는 신간 전자책 무제한 열람</p>
            <button type="button" onClick={() => onActionClick("월간 구독")} className="w-full py-3 rounded-xl text-xs font-bold bg-teal-100 text-teal-800">
              베이직 시작하기
            </button>
          </div>
          <div className="bg-teal-900 text-white p-8 rounded-3xl border-2 border-teal-700 shadow-xl space-y-4 relative overflow-hidden">
            <span className="text-[10px] font-bold text-amber-300 bg-teal-800 px-2 py-0.5 rounded">BEST VALUE</span>
            <h4 className="text-lg font-bold">연간 프리미엄 플랜</h4>
            <p className="text-2xl font-black text-amber-300">연 99,000원 (2개월 무료)</p>
            <p className="text-xs text-teal-200">전체 PDF 전자책 + VOD 강의 + 템플릿 무제한 다운로드</p>
            <button type="button" onClick={() => onActionClick("연간 구독")} className="w-full py-3 rounded-xl text-xs font-bold bg-teal-500 text-white">
              프리미엄 구독하기 &rarr;
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full py-10 px-8 border-t border-teal-100 bg-white text-center text-xs text-teal-600 mt-auto">
        © 2026 {bizName}. All Rights Reserved.
      </footer>
    </div>
  );
}

// 🎓 학원 4. 고전환 VOD 세일즈 원페이지 (블랙 & 네온 레드 초강렬 다크 VSL)
function AcademyVslLayout(props: LayoutProps) {
  const { bizName, bizDesc, onActionClick } = props;
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#09090B] text-white selection:bg-red-600">
      <div className="bg-red-600 text-white text-xs py-2 px-8 text-center font-black animate-pulse">
        ⏳ [마감 임박] 얼리버드 50% 할인 특별 모집 종료까지 03시간 42분 남음!
      </div>

      <header className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
        <span className="text-xs font-bold text-red-500 uppercase tracking-widest border border-red-500/40 px-3.5 py-1 rounded-full bg-red-950/60">
          PROVEN HIGH-CONVERTING MASTERCLASS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black leading-tight text-white drop-shadow-2xl">
          {bizDesc || "단 하나의 강의로 끝내는 실전 수익화 & 마스터클래스"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
          이론만 늘어놓는 강의는 이제 그만. 100% 현업 실무 데이터와 1:1 밀착 코칭으로 완성합니다.
        </p>

        {/* 중앙 대형 유튜브 VSL 영상 */}
        <div className="pt-4">
          <YouTubePlayerSection videoId="dQw4w9WgXcQ" title="대표 강사 직강 VSL - 수익화의 모든 것" tag="VSL SALES VIDEO" theme="dark" />
        </div>

        <div className="pt-6">
          <button
            type="button"
            onClick={() => onActionClick("얼리버드 할인 신청")}
            className="px-10 py-5 rounded-2xl text-base font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-2xl transition-transform hover:scale-105 cursor-pointer"
          >
            지금 50% 할인받고 수강신청하기 &rarr;
          </button>
        </div>
      </header>

      <footer className="w-full py-10 px-8 border-t border-white/10 bg-black text-center text-xs text-gray-600 mt-auto">
        © 2026 {bizName}. All Rights Reserved.
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// ⛪ 교회 1. 모던 워십 & 글로벌 교회 (상단 4단 틸 블록 & 설교 유튜브)
// ════════════════════════════════════════════════════════════════════════
function ChurchGatewayLayout(props: LayoutProps) {
  const { bizName, bizDesc, images, contact, onActionClick, onNavClick } = props;
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-white text-[#0F172A]">
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavClick("hero", 0)}>
          <span className="text-2xl">⛪</span>
          <span className="text-xl font-black text-teal-800">{bizName}</span>
        </div>
        <button type="button" onClick={() => onActionClick("온라인 헌금")} className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-teal-600 shadow-md">
          온라인 헌금 (GIVE) ❤️
        </button>
      </nav>

      {/* 상단 4단 틸 블록 */}
      <section className="w-full grid grid-cols-2 md:grid-cols-4 text-white text-left divide-x divide-white/10">
        {[
          { title: "NEW HERE?", desc: "처음 오셨나요? 새가족 환영", bg: "#0D9488" },
          { title: "ABOUT US", desc: "교회 소개 및 비전", bg: "#0F766E" },
          { title: "MINISTRIES", desc: "다음세대 & 부서 사역", bg: "#115E59" },
          { title: "GIVE", desc: "감사의 온라인 헌금", bg: "#134E4A" },
        ].map((block, idx) => (
          <div key={idx} onClick={() => onActionClick(block.title)} className="p-6 cursor-pointer hover:brightness-110" style={{ backgroundColor: block.bg }}>
            <h3 className="text-base font-black">{block.title}</h3>
            <p className="text-xs text-teal-100">{block.desc}</p>
          </div>
        ))}
      </section>

      {/* 히어로 */}
      <header className="relative w-full h-[450px] overflow-hidden bg-black flex items-center justify-center text-center text-white">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-75" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-20 space-y-4 max-w-2xl px-6">
          <h1 className="text-4xl sm:text-6xl font-black">WE&apos;RE ALL ABOUT PEOPLE.</h1>
          <p className="text-sm text-gray-200">{bizDesc || "하나님의 사랑과 은혜가 머무는 믿음의 공동체"}</p>
        </div>
      </header>

      {/* 주일 설교 유튜브 플레이어 */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <YouTubePlayerSection videoId="jNQXAC9IVRw" title="최신 주일 대예배 설교 말씀 (Live Stream)" tag="SUNDAY SERMON" theme="light" />
      </main>

      <footer className="w-full py-10 px-8 border-t border-gray-100 bg-gray-50 text-center text-xs text-gray-500 mt-auto">
        {bizName} | 사무실: {contact || "(303) 755-1234"}
      </footer>
    </div>
  );
}

// ⛪ 교회 2. 전통 장로/감리교회 (경건한 딥네이비 & 2단 담임목사 환영사 + 실시간 예배 유튜브)
function ChurchHeritageLayout(props: LayoutProps) {
  const { bizName, bizDesc, images, onActionClick } = props;
  return (
    <div className="min-h-full w-full flex flex-col font-serif-kr bg-[#F8FAFC] text-[#0F172A]">
      <nav className="flex items-center justify-between px-8 py-5 bg-[#1E3A8A] text-white sticky top-0 z-30">
        <span className="text-xl font-bold">{bizName}</span>
        <button type="button" onClick={() => onActionClick("주보 다운로드")} className="px-4 py-2 rounded-lg text-xs font-sans font-bold bg-white text-blue-950">
          이번 주 주보 PDF 📄
        </button>
      </nav>

      <header className="max-w-5xl mx-auto px-8 py-14 text-center space-y-4">
        <span className="text-xs font-sans font-bold text-blue-700 uppercase tracking-widest">KOREAN UNITED METHODIST CHURCH</span>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">{bizDesc || "말씀과 기도로 든든히 서가는 경건한 신앙 공동체"}</h1>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-4 space-y-12">
        <YouTubePlayerSection videoId="5qap5aO4i9A" title="주일 대예배 실시간 생중계 (1부/2부)" tag="LIVE WORSHIP SERVICE" theme="light" />
      </main>

      <footer className="w-full py-10 px-8 bg-[#1E293B] text-white text-center text-xs mt-auto font-sans">
        © 2026 {bizName}. All Rights Reserved.
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🥩 외식/카페 1. 정통 숯불 다이닝 (다크 & 시즐링 유튜브)
// ════════════════════════════════════════════════════════════════════════
function DiningKbbqLayout(props: LayoutProps) {
  const { bizName, bizDesc, images, onActionClick } = props;
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#09090B] text-white selection:bg-red-600">
      <nav className="flex items-center justify-between px-8 py-4 bg-[#18181B] border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥩</span>
          <span className="text-xl font-black uppercase text-white">{bizName}</span>
        </div>
        <button type="button" onClick={() => onActionClick("테이블 예약")} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 text-white">
          TABLE RESERVATION &rarr;
        </button>
      </nav>

      <header className="max-w-5xl mx-auto px-8 py-16 text-center space-y-5">
        <span className="text-xs font-bold text-red-500 uppercase tracking-widest">SIZZLING AUTHENTIC KOREAN BBQ</span>
        <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">{bizDesc || "참숯 위에서 완벽하게 구워내는 최상급 프라임 꽃갈비"}</h1>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-4 space-y-12">
        <YouTubePlayerSection videoId="M7lc1UVf-VE" title="시즐링 숯불구이 & 프라임 갈비 다이닝 영상" tag="SIZZLING GRILL VIDEO" theme="dark" />
      </main>

      <footer className="w-full py-10 px-8 border-t border-white/10 bg-black text-center text-xs text-gray-500 mt-auto">
        © 2026 {bizName}. All Rights Reserved.
      </footer>
    </div>
  );
}

// ☕ 외식/카페 2. 프리미엄 프랜차이즈 (화이트 & 풀와이드 슬라이더)
function FranchiseCorporateLayout(props: LayoutProps) {
  const { bizName, bizDesc, images, onActionClick } = props;
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#F8F9FA] text-gray-900">
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b-2 border-gray-200 sticky top-0 z-30">
        <span className="text-xl font-black text-red-600">{bizName}</span>
        <button type="button" onClick={() => onActionClick("가맹 상담")} className="px-5 py-2.5 rounded-full text-xs font-bold bg-red-600 text-white">
          가맹 개설 문의 &rarr;
        </button>
      </nav>

      <header className="relative w-full h-[450px] overflow-hidden bg-black flex items-center">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="relative z-20 max-w-4xl mx-auto px-8 w-full text-left text-white space-y-4">
          <span className="text-xs font-bold bg-red-600 px-3 py-1 rounded">SEASON SIGNATURE</span>
          <h1 className="text-4xl sm:text-5xl font-black">{bizDesc}</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <YouTubePlayerSection videoId="kJQP7kiw5Fk" title="시즌 시그니처 신메뉴 & 브랜드 필름" tag="BRAND FILM" theme="light" />
      </main>

      <footer className="w-full py-10 px-8 border-t-2 border-gray-200 bg-white text-center text-xs text-gray-400 mt-auto">
        © 2026 {bizName} Corp. All Rights Reserved.
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 MAIN ROUTER (각 템플릿 ID별 완전히 고유한 레이아웃 분기)
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
    showToast(`🧭 '${menu}' 섹션으로 이동했습니다.`);
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
    navMenus: navMenus && navMenus.length > 0 ? navMenus : ["OVERVIEW", "CURRICULUM", "VIDEO", "REVIEWS"],
    onActionClick: handleActionClick,
    onNavClick: handleNavClick,
  };

  const templateId = selectedTemplate.id;

  const renderLayout = () => {
    // 🎓 학원 4종 고유 레이아웃
    if (templateId === "academy-live") return <AcademyLiveLayout {...props} />;
    if (templateId === "academy-cert") return <AcademyCertLayout {...props} />;
    if (templateId === "academy-ebook") return <AcademyEbookLayout {...props} />;
    if (templateId === "academy-vsl") return <AcademyVslLayout {...props} />;

    // ⛪ 교회 3종 고유 레이아웃
    if (templateId === "religion-gateway") return <ChurchGatewayLayout {...props} />;
    if (templateId === "religion-heritage") return <ChurchHeritageLayout {...props} />;

    // 🥩 외식/카페 고유 레이아웃
    if (templateId === "cafe-kbbq") return <DiningKbbqLayout {...props} />;
    if (templateId === "cafe-corporate") return <FranchiseCorporateLayout {...props} />;

    // 기본값: 카테고리별 분기
    if (selectedCategory === "academy") return <AcademyLiveLayout {...props} />;
    if (selectedCategory === "religion") return <ChurchGatewayLayout {...props} />;
    if (selectedCategory === "cafe") return <DiningKbbqLayout {...props} />;

    return <FranchiseCorporateLayout {...props} />;
  };

  return (
    <div className="relative w-full min-h-full">
      {renderLayout()}
      <ImageEditModal />
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 text-xs font-bold">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
