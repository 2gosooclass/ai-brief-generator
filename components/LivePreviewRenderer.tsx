"use client";

import { useBriefStore } from "@/store/briefStore";
import type { Template } from "@/lib/types";
import { useMemo, useState } from "react";

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
    "https://images.unsplash.com/photo-1555423461-b5056ae13db6?w=1200&q=80",
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80",
    "https://images.unsplash.com/photo-1548625361-195fe612b7a4?w=1200&q=80",
    "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&q=80",
    "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=80"
  ],
  personal: [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80"
  ],
  traditional: [
    "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?w=1200&q=80",
    "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1200&q=80",
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80"
  ],
  default: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80"
  ]
};

// ── 공통 이미지 래퍼 ──
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
  const { sectionImages } = useBriefStore();
  const imageUrl = sectionImages[sectionKey] || defaultUrl;

  if (asBackground) {
    return (
      <div
        className={`relative bg-cover bg-center ${className}`}
        style={{
          ...style,
          backgroundImage: style.backgroundImage
            ? `${style.backgroundImage.toString().split(', url')[0]}, url(${imageUrl})`
            : `url(${imageUrl})`
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={sectionKey} className="w-full h-full object-cover" loading="lazy" />
    </div>
  );
}

interface LayoutProps {
  template: Template;
  category: string;
  isMultiPage?: boolean;
  accentColor: string;
  bizName: string;
  bizDesc: string;
  sections: string[];
  images: string[];
  logoUrl: string | null;
  contact?: string;
  navMenus: string[];
  activeSubPage: string;
  setActiveSubPage: (page: string) => void;
  onActionClick: (action: string) => void;
}

// ════════════════════════════════════════════════════════════════════════
// 1. ⛪ [교회 1: 밝고 경건한 자연색] 전통 한인 장로 & 감리교회 (religion-heritage)
// ════════════════════════════════════════════════════════════════════════
function HeritageChurchLayout({ accentColor, bizName, bizDesc, images, contact, onActionClick }: LayoutProps) {
  const gold = accentColor || "#D4AF70";
  const navy = "#1E3A8A";

  return (
    <div className="min-h-full w-full flex flex-col font-serif-kr bg-[#FDFBF7] text-[#1E293B] text-left">
      {/* 상단 예배 공지 바 */}
      <div className="bg-[#1E3A8A] text-amber-100 text-xs py-2.5 px-8 flex justify-between items-center shadow-sm">
        <span className="font-pretendard flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          주일 대예배 1부 (오전 9:00) · 2부 (오전 11:00) | 실시간 설교 생중계
        </span>
        <span className="font-pretendard">목양실: {contact || "010-1234-5678"}</span>
      </div>

      {/* 네비게이션 헤더 */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur-md border-b border-amber-900/10 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-xl text-[#1E3A8A]">
            ✝️
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif-kr text-[#1E3A8A] leading-tight">{bizName}</h2>
            <span className="text-[10px] text-[#D4AF70] font-pretendard font-bold tracking-widest block">KOREAN PRESBYTERIAN & METHODIST CHURCH</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold text-[#1E293B] font-pretendard">
          <span className="hover:text-[#1E3A8A] cursor-pointer">ABOUT (교회소개)</span>
          <span className="hover:text-[#1E3A8A] cursor-pointer">EVENTS (사역안내)</span>
          <span className="hover:text-[#1E3A8A] cursor-pointer">GALLERY (사진첩)</span>
          <span className="hover:text-[#1E3A8A] cursor-pointer">LOCATION (오시는길)</span>
          <span className="hover:text-[#1E3A8A] cursor-pointer">설교방송</span>
        </div>
        <button onClick={() => onActionClick("새가족 등록")} className="px-5 py-2.5 rounded-xl text-xs font-bold font-pretendard shadow-md hover:scale-105 transition-all text-[#172554]" style={{ backgroundColor: gold }}>
          새가족 등록 및 문의 &rarr;
        </button>
      </nav>

      {/* 화사한 자연 채광 성전 히어로 */}
      <header className="relative w-full h-[520px] bg-[#172554] flex items-center justify-center text-center overflow-hidden">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#172554]/95 via-black/40 to-transparent" />
        <div className="relative z-20 max-w-3xl px-6 space-y-4 text-white">
          <span className="inline-block text-xs tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-amber-300/40 bg-black/40 text-amber-200 font-pretendard font-bold shadow-sm">
            ✝️ FAITH & PRAYER SANCTUARY
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif-kr font-bold text-white leading-tight">
            말씀과 기도로 든든히 서가는<br />
            <span className="text-[#FDE68A]">경건한 신앙 공동체</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed font-pretendard">
            {bizDesc || "하나님의 거룩한 말씀 위에 굳건히 서서, 정통 개혁신학과 뜨거운 사랑 실천으로 이 땅과 열방을 섬깁니다."}
          </p>
          <div className="flex justify-center gap-3 pt-2 font-pretendard">
            <button onClick={() => onActionClick("교회 사명 알아보기")} className="px-6 py-3 rounded-xl text-xs font-bold text-[#172554] shadow-lg hover:brightness-110 transition-all" style={{ backgroundColor: gold }}>
              교회 사명 알아보기 &rarr;
            </button>
            <button onClick={() => onActionClick("온라인 설교방송")} className="px-6 py-3 rounded-xl text-xs font-bold bg-white/20 text-white border border-white/40 hover:bg-white/30 backdrop-blur-sm transition-all">
              실시간 설교방송
            </button>
          </div>
        </div>
      </header>

      {/* 4단 예배 시간 안내 바 */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-30 w-full font-pretendard">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 overflow-hidden">
          {[
            { tag: "주일 1부 예배", time: "오전 09:00", place: "전통 경건 예배 (본당)" },
            { tag: "주일 2부 대예배", time: "오전 11:00", place: "찬양 & 강해 설교 (생중계)" },
            { tag: "수요 성경강해", time: "수요일 오후 07:30", place: "소예배실 및 온라인 줌" },
            { tag: "새벽 기도회", time: "화~토 오전 05:30", place: "매일 은혜 채플홀" },
          ].map((item, idx) => (
            <div key={idx} className="p-5 space-y-1 text-left bg-gradient-to-b from-white to-[#F8FAFC]">
              <span className="text-[11px] font-bold text-[#1E3A8A] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full">{item.tag}</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">{item.time}</h4>
              <p className="text-xs text-slate-500">{item.place}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 메인 콘텐츠: 담임목사 환영사 & 4대 핵심 사역 */}
      <main className="max-w-6xl mx-auto px-6 py-16 space-y-16 w-full font-pretendard">
        {/* 담임목사 환영사 */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="md:col-span-5 h-72 rounded-2xl overflow-hidden shadow-md">
            <EditableImage sectionKey="pastor" defaultUrl={images[1]} className="w-full h-full object-cover" />
          </div>
          <div className="md:col-span-7 space-y-4 text-left">
            <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-widest bg-[#EFF6FF] px-3 py-1 rounded-full">PASTORAL MESSAGE</span>
            <h3 className="text-2xl font-serif-kr font-bold text-slate-900 leading-snug">
              주님의 따뜻한 사랑으로<br />여러분을 환영합니다
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              우리 교회는 성경 중심의 바른 신학과 뜨거운 성령의 역사가 조화를 이루는 영적 보금자리입니다. 삶의 무거운 짐을 내려놓고 참된 평안과 구원의 기쁨을 함께 누리시길 축복합니다.
            </p>
            <p className="text-xs font-serif-kr font-bold text-[#1E3A8A]">담임목사 및 사역팀 일동</p>
          </div>
        </section>

        {/* 4대 핵심 사역 그리드 */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">OUR MISSION</span>
            <h3 className="text-2xl font-serif-kr font-bold text-slate-900">교회 4대 핵심 사역</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { i: "📖", t: "성경 중심 강해", d: "장로교 정통 개혁신학에 기초한 체계적 말씀 양육" },
              { i: "🙏", t: "뜨거운 성령 기도", d: "매일 새벽과 금요철야로 무릎 꿇는 기도의 용사" },
              { i: "🌱", t: "다음세대 전수", d: "영유아부부터 청년부까지 거룩한 신앙 정체성 확립" },
              { i: "🤝", t: "사랑의 이웃 섬김", d: "지역 사회 나눔과 해외 선교지를 향한 헌신과 섬김" },
            ].map((card, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-left hover:-translate-y-1 transition-transform">
                <span className="text-3xl">{card.i}</span>
                <h4 className="text-base font-bold text-slate-900">{card.t}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{card.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 하단 푸터 */}
      <footer className="py-12 px-8 bg-[#172554] text-slate-300 font-pretendard text-center text-xs space-y-2 mt-auto border-t-2 border-amber-400">
        <h4 className="font-bold text-base text-white font-serif-kr">{bizName}</h4>
        <p className="opacity-80">성전 주소: 경기도 용인시 기흥구 기흥로 42번길 15 · 대표 문의: {contact || "010-1234-5678"}</p>
        <p className="opacity-80">150대 무료 주차 완비 · 기흥역 순환 주일 셔틀버스 운행</p>
        <p className="text-[11px] text-amber-300/60 pt-2">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2. 🕊️ [교회 2: 화사한 화이트 & 틸] 모던 워십 글로벌 교회 (religion-gateway)
// ════════════════════════════════════════════════════════════════════════
function ModernChurchCommunityLayout({ accentColor, bizName, bizDesc, images, contact, onActionClick }: LayoutProps) {
  const teal = accentColor || "#0D9488";
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#FFFFFF] text-[#0F172A] text-left">
      {/* 4단 퀵 게이트웨이 상단 바 */}
      <div className="grid grid-cols-2 md:grid-cols-4 text-center text-xs font-bold text-white shadow-sm">
        <div onClick={() => onActionClick("새가족 환영")} className="py-3 bg-[#0F766E] hover:bg-[#115E59] cursor-pointer transition-colors">✨ NEW HERE? (새가족)</div>
        <div onClick={() => onActionClick("교회 소개")} className="py-3 bg-[#0D9488] hover:bg-[#0F766E] cursor-pointer transition-colors">⛪ ABOUT US (교회소개)</div>
        <div onClick={() => onActionClick("사역 안내")} className="py-3 bg-[#14B8A6] hover:bg-[#0D9488] cursor-pointer transition-colors">🌱 MINISTRIES (부서사역)</div>
        <div onClick={() => onActionClick("온라인 헌금")} className="py-3 bg-[#2DD4BF] text-teal-950 hover:bg-[#14B8A6] cursor-pointer transition-colors">💳 ONLINE GIVE (온라인헌금)</div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-xl font-bold">🕊️</div>
          <div>
            <h2 className="text-base font-black text-slate-900 leading-tight">{bizName}</h2>
            <span className="text-[10px] text-teal-600 font-bold tracking-wider">GLOBAL WORSHIP COMMUNITY</span>
          </div>
        </div>
        <div className="hidden md:flex gap-6 text-xs font-bold text-slate-600">
          <span className="hover:text-teal-600 cursor-pointer">WORSHIP & SERMON</span>
          <span className="hover:text-teal-600 cursor-pointer">COMMUNITY</span>
          <span className="hover:text-teal-600 cursor-pointer">NEXT GENERATION</span>
          <span className="hover:text-teal-600 cursor-pointer">LOCATION</span>
        </div>
        <button onClick={() => onActionClick("온라인 예배")} className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md" style={{ backgroundColor: teal }}>
          LIVE 예배 참여 &rarr;
        </button>
      </nav>

      {/* 화사한 워십 히어로 */}
      <header className="relative w-full h-[480px] bg-slate-900 flex items-center justify-center text-center overflow-hidden">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-teal-950/40 to-transparent" />
        <div className="relative z-20 max-w-3xl px-6 space-y-4 text-white">
          <span className="inline-block text-xs font-bold px-3 py-1 bg-teal-600/80 rounded-full text-white backdrop-blur-sm">
            하나님의 사랑과 은혜가 머무는 믿음의 공동체
          </span>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight text-white">{bizName}</h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-lg mx-auto">{bizDesc}</p>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={() => onActionClick("주일예배 안내")} className="px-6 py-3 rounded-xl text-xs font-bold text-white shadow-lg" style={{ backgroundColor: teal }}>
              주일 예배 안내 &rarr;
            </button>
            <button onClick={() => onActionClick("설교 아카이브")} className="px-6 py-3 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100">
              최신 설교 듣기
            </button>
          </div>
        </div>
      </header>

      {/* 설교 카드 3열 쇼케이스 */}
      <main className="max-w-6xl mx-auto px-6 py-14 space-y-12 w-full">
        <div className="flex justify-between items-end border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase">ONLINE MESSAGES</span>
            <h3 className="text-xl font-bold text-slate-900">은혜로운 최근 강해 설교</h3>
          </div>
          <button onClick={() => onActionClick("전체 설교")} className="text-xs font-bold text-teal-600 hover:underline">전체 설교 보기 &rarr;</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { t: "믿음의 반석 위에 서라", d: "에베소서 2:19~22", p: "2026.08.16 주일 2부" },
            { t: "기도의 무릎으로 여는 하늘 문", d: "빌립보서 4:6~7", p: "2026.08.09 주일 2부" },
            { t: "세상을 이기는 사랑의 능력", d: "요한일서 4:7~12", p: "2026.08.02 주일 2부" },
          ].map((c, idx) => (
            <div key={idx} className="bg-[#F8FAFC] rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-44 overflow-hidden relative">
                <EditableImage sectionKey={`sermon-${idx}`} defaultUrl={images[(idx + 1) % images.length]} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-teal-700 flex items-center justify-center shadow-lg font-bold pl-0.5">▶</div>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[11px] font-bold text-teal-600">{c.p}</span>
                <h4 className="text-sm font-bold text-slate-900">{c.t}</h4>
                <p className="text-xs text-slate-500">{c.d}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-10 px-8 bg-slate-900 text-slate-400 text-center text-xs mt-auto">
        <p className="font-bold text-white">{bizName} · 문의처: {contact || "010-1234-5678"}</p>
        <p className="opacity-70 mt-1">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3. 🌿 [NGO 3: 따뜻한 자연색 어스그린] 나눔 & 비영리 NGO 커뮤니티 (religion-ngo)
// ════════════════════════════════════════════════════════════════════════
function NgoCommunityLayout({ accentColor, bizName, bizDesc, images, contact, onActionClick }: LayoutProps) {
  const green = accentColor || "#22C55E";
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#F0FDF4] text-[#14532D] text-left">
      {/* 상단 기부 바 */}
      <div className="bg-[#15803D] text-emerald-100 text-xs py-2 px-8 flex justify-between">
        <span>세상을 바꾸는 따뜻한 연대와 사랑의 실천</span>
        <span>후원 문의: {contact || "1588-0000"}</span>
      </div>

      <nav className="flex items-center justify-between px-8 py-4 bg-white/95 border-b border-emerald-200 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <span className="text-lg font-black text-emerald-950">{bizName}</span>
        </div>
        <div className="hidden md:flex gap-6 text-xs font-bold text-emerald-900">
          <span>구호 사역</span><span>후원 프로그램</span><span>스토리</span><span>투명성 리포트</span>
        </div>
        <button onClick={() => onActionClick("정기 후원 신청")} className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md" style={{ backgroundColor: "#15803D" }}>
          정기 후원하기 &rarr;
        </button>
      </nav>

      {/* 따뜻한 나눔 히어로 */}
      <header className="relative w-full h-[460px] bg-emerald-950 flex items-center justify-center text-center overflow-hidden">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-black/40 to-transparent" />
        <div className="relative z-20 max-w-3xl px-6 space-y-4 text-white">
          <span className="text-xs font-bold px-3 py-1 bg-emerald-700/80 rounded-full text-white">HOPE & SHARING COMMUNITY</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">{bizName}</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">{bizDesc}</p>
        </div>
      </header>

      {/* 3단 임팩트 스탯 */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm text-center">
          <div><h4 className="text-2xl font-black text-emerald-700">12,400+</h4><p className="text-xs text-slate-500">후원받는 결식 아동</p></div>
          <div><h4 className="text-2xl font-black text-emerald-700">98.7%</h4><p className="text-xs text-slate-500">투명 사업비 집행률</p></div>
          <div><h4 className="text-2xl font-black text-emerald-700">34개국</h4><p className="text-xs text-slate-500">글로벌 구호 네트워크</p></div>
        </div>
      </main>

      <footer className="py-10 px-8 bg-emerald-950 text-emerald-300 text-center text-xs mt-auto">
        <p className="font-bold text-white">{bizName} · {contact || "1588-0000"}</p>
        <p className="opacity-70 mt-1">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 4. 🥩 [카페/식음료 1: 다크 시즐링] 정통 숯불 다이닝 (cafe-kbbq)
// ════════════════════════════════════════════════════════════════════════
function KoreanBBQRestaurantLayout({ accentColor, bizName, bizDesc, images, contact, onActionClick }: LayoutProps) {
  const red = accentColor || "#DC2626";
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#09090B] text-[#FAFAFA] text-left">
      <div className="bg-[#18181B] text-gray-300 text-xs py-2.5 px-8 flex justify-between items-center border-b border-white/10">
        <span className="text-red-500 font-bold">🔥 SIZZLING PRIME DINING</span>
        <span>RESERVATION: {contact || "(847) 983-8282"}</span>
      </div>

      <nav className="flex items-center justify-between px-8 py-4 bg-[#09090B]/95 border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥩</span>
          <span className="text-lg font-black text-white">{bizName}</span>
        </div>
        <div className="hidden md:flex gap-6 text-xs font-bold text-gray-300">
          <span>BBQ MENU</span><span>RESERVATION</span><span>PRIVATE ROOM</span><span>LOCATION</span>
        </div>
        <button onClick={() => onActionClick("테이블 예약")} className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: red }}>
          TABLE BOOKING &rarr;
        </button>
      </nav>

      <header className="relative w-full h-[520px] bg-black flex items-center justify-center text-center overflow-hidden">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-black/40 to-black/60" />
        <div className="relative z-20 max-w-4xl px-6 space-y-4">
          <span className="text-xs font-bold px-3.5 py-1.5 bg-red-950 text-red-400 border border-red-500/40 rounded-full">🔥 24H FRUIT AGED PRIME BBQ</span>
          <h1 className="text-4xl sm:text-6xl font-black text-white">{bizName}</h1>
          <p className="text-sm text-gray-300 max-w-xl mx-auto">{bizDesc}</p>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={() => onActionClick("실시간 예약")} className="px-7 py-3.5 rounded-xl text-xs font-bold text-white shadow-xl" style={{ backgroundColor: red }}>실시간 테이블 예약 &rarr;</button>
          </div>
        </div>
      </header>

      <footer className="py-10 px-8 border-t border-white/10 bg-black text-center text-xs text-gray-500 mt-auto">
        <p className="font-bold text-white">{bizName} · TEL: {contact || "(847) 983-8282"}</p>
        <p className="opacity-60 mt-2">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 5. 🥐 [카페/식음료 2: 밝고 따뜻한 미니멀 베이지] 미니멀 카페 & 브런치 (cafe-minimal)
// ════════════════════════════════════════════════════════════════════════
function MinimalCafeBrunchLayout({ accentColor, bizName, bizDesc, images, contact, onActionClick }: LayoutProps) {
  const wood = accentColor || "#C8A97E";
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#FAFAF7] text-[#2C2118] text-left">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#E8E0D8] bg-white sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-xl">☕</span>
          <span className="font-serif-kr text-lg font-bold text-[#1C1410]">{bizName}</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-medium text-[#5C4A3A]">
          <span>COFFEE</span><span>BAKERY & BRUNCH</span><span>STORY</span><span>SPACE</span>
        </div>
        <button onClick={() => onActionClick("매장 방문 안내")} className="px-4 py-2 rounded-lg text-xs font-bold text-[#1C1410] border border-[#C8A97E] hover:bg-[#F5F0EA]">
          VISIT STORE &rarr;
        </button>
      </nav>

      {/* 에디토리얼 분할 히어로 */}
      <header className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6 space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C8A97E] font-bold">ARTISAN ROASTERY</span>
          <h1 className="font-serif-kr text-4xl sm:text-5xl font-bold text-[#1C1410] leading-tight">
            여백과 감성으로 채우는<br /><span className="text-[#C8A97E]">따뜻한 한 잔의 온기</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5C4A3A] leading-relaxed">{bizDesc}</p>
        </div>
        <div className="md:col-span-6 h-80 rounded-2xl overflow-hidden shadow-lg border border-[#E8E0D8]">
          <EditableImage sectionKey="hero" defaultUrl={images[0]} className="w-full h-full object-cover" />
        </div>
      </header>

      <footer className="py-10 px-8 border-t border-[#E8E0D8] bg-white text-center text-xs text-[#8C7A6A] mt-auto">
        <p className="font-bold text-[#1C1410]">{bizName} · {contact || "02-1234-5678"}</p>
        <p className="mt-1">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 6. ☕ [카페 3: 깔끔한 화이트 코퍼레이트] 프리미엄 프랜차이즈 (cafe-corporate)
// ════════════════════════════════════════════════════════════════════════
function CorporateFranchiseLayout({ accentColor, bizName, bizDesc, images, contact, onActionClick }: LayoutProps) {
  const brandRed = accentColor || "#D62828";
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#FFFFFF] text-[#111827] text-left">
      <div className="bg-[#1E1E24] text-gray-300 text-xs py-2 px-8 flex justify-between">
        <span>프리미엄 프랜차이즈 코퍼레이트</span>
        <span>가맹문의: {contact || "1577-4410"}</span>
      </div>
      <header className="relative w-full h-[450px] bg-gray-100 flex items-center overflow-hidden">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-85" />
        <div className="relative z-20 max-w-5xl mx-auto px-8 text-left space-y-3">
          <span className="text-xs font-bold px-3 py-1 rounded text-white" style={{ backgroundColor: brandRed }}>SEASON SIGNATURE</span>
          <h1 className="text-4xl font-black text-white">{bizName}</h1>
          <p className="text-sm text-gray-100 max-w-md">{bizDesc}</p>
        </div>
      </header>
      <footer className="py-8 bg-gray-50 text-center text-xs text-gray-500 mt-auto border-t">
        <p>© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 7. 🎓 [학원 1: 다이내믹 인디고 라이브] 스타강사 Live 클래스 (academy-live)
// ════════════════════════════════════════════════════════════════════════
function OnlineAcademyLiveLayout({ accentColor, bizName, bizDesc, images, onActionClick }: LayoutProps) {
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#0F172A] text-white text-left">
      <div className="bg-[#1E1B4B] text-white text-xs py-2.5 px-8 flex justify-between border-b border-indigo-900">
        <span>🔴 2026 스타강사 실시간 Live 클래스 온에어</span>
        <span className="text-indigo-300">수강생 98.4% 합격 신화</span>
      </div>
      <header className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white py-16 px-8 text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <h1 className="text-4xl font-black">스타강사의 명강의를<br /><span className="text-amber-400">온라인 실시간 Live로</span></h1>
            <p className="text-xs text-slate-300">{bizDesc}</p>
          </div>
          <div className="md:col-span-5 h-72 rounded-2xl overflow-hidden border-2 border-white/20">
            <EditableImage sectionKey="teacher" defaultUrl={images[0]} className="w-full h-full object-cover" />
          </div>
        </div>
      </header>
      <footer className="py-8 bg-black text-center text-xs text-gray-500 mt-auto">
        <p>© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 8. 📜 [학원 2: 로열블루 공인인증] 전문 자격증 교육원 (academy-cert)
// ════════════════════════════════════════════════════════════════════════
function CertInstituteLayout({ accentColor, bizName, bizDesc, images }: LayoutProps) {
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#F8FAFC] text-[#0F172A] text-left">
      <nav className="px-8 py-4 bg-white border-b border-slate-200 flex justify-between items-center">
        <span className="text-base font-bold text-[#1E3A8A]">{bizName}</span>
        <span className="text-xs font-bold text-slate-600">공인 수료증 및 실무 교육</span>
      </nav>
      <header className="max-w-6xl mx-auto px-6 py-12 text-left space-y-3">
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded">OFFICIAL CERTIFICATE</span>
        <h1 className="text-3xl font-black text-slate-900">{bizName}</h1>
        <p className="text-xs text-slate-600">{bizDesc}</p>
      </header>
      <footer className="py-8 bg-white border-t text-center text-xs text-slate-500 mt-auto">
        <p>© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 9. 📚 [학원 3: 산뜻한 민트/세이지] 전자책 지식구독 (academy-ebook)
// ════════════════════════════════════════════════════════════════════════
function EbookMembershipLayout({ accentColor, bizName, bizDesc, images }: LayoutProps) {
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#F0FDFA] text-[#134E4A] text-left">
      <header className="max-w-6xl mx-auto px-6 py-12 text-left space-y-3">
        <span className="text-xs font-bold text-teal-700 bg-teal-100 px-3 py-1 rounded-full">DIGITAL SUBSCRIPTION</span>
        <h1 className="text-3xl font-black text-teal-950">{bizName}</h1>
        <p className="text-xs text-teal-800">{bizDesc}</p>
      </header>
      <footer className="py-8 bg-teal-900 text-teal-200 text-center text-xs mt-auto">
        <p>© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 10. 🎨 [개인 1: 다크 네온 모션] 다이내믹 인터랙티브 랩 (personal-dynamic)
// ════════════════════════════════════════════════════════════════════════
function DynamicMotionLabLayout({ accentColor, bizName, bizDesc, images }: LayoutProps) {
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#0A0D14] text-[#F8FAFC] text-left">
      <header className="max-w-6xl mx-auto px-6 py-16 text-center space-y-4">
        <span className="text-xs font-bold px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded-full">3D MOTION & INTERACTIVE</span>
        <h1 className="text-4xl sm:text-6xl font-black text-white">{bizName}</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">{bizDesc}</p>
      </header>
      <footer className="py-8 bg-black text-center text-xs text-gray-500 mt-auto">
        <p>© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 11. 🖼️ [개인 2: 화이트 모노크롬] 크리에이터 포트폴리오 (personal-portfolio)
// ════════════════════════════════════════════════════════════════════════
function CleanPortfolioLayout({ accentColor, bizName, bizDesc, images }: LayoutProps) {
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#FFFFFF] text-[#0A0A0A] text-left">
      <header className="max-w-6xl mx-auto px-6 py-14 text-left space-y-3 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-400">PORTFOLIO</span>
        <h1 className="text-4xl font-black text-black">{bizName}</h1>
        <p className="text-xs text-gray-600">{bizDesc}</p>
      </header>
      <footer className="py-8 bg-gray-50 text-center text-xs text-gray-500 mt-auto border-t">
        <p>© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 12. 🎎 [전통 1: 한옥 웜우드] 전통매듭 & 공예 아틀리에 (traditional-knots / traditional-pottery)
// ════════════════════════════════════════════════════════════════════════
function TraditionalCraftLayout({ accentColor, bizName, bizDesc, images }: LayoutProps) {
  return (
    <div className="min-h-full w-full flex flex-col font-serif-kr bg-[#FAF7F2] text-[#2A1311] text-left">
      <header className="max-w-6xl mx-auto px-6 py-14 text-center space-y-4">
        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-pretendard">KOREAN TRADITIONAL ATELIER</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#4A1A17]">{bizName}</h1>
        <p className="text-xs text-[#7D524A] max-w-md mx-auto font-pretendard">{bizDesc}</p>
      </header>
      <footer className="py-8 bg-[#4A1A17] text-amber-100 text-center text-xs mt-auto">
        <p>© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 🌟 MAIN ROUTER
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
    activeSubPage,
    setActiveSubPage,
  } = useBriefStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!selectedTemplate) return null;

  const templateId = selectedTemplate.id;
  const layoutType = selectedTemplate.layoutType;
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
    navMenus: navMenus && navMenus.length > 0 ? navMenus : ["HOME", "ABOUT", "SERVICES", "CONTACT"],
    activeSubPage: activeSubPage || "home",
    setActiveSubPage,
    onActionClick: handleActionClick,
  };

  const renderLayout = () => {
    // 1. 종교/NGO 카테고리 (밝고 경건한 자연색)
    if (templateId === "religion-heritage" || layoutType === "religion-heritage") {
      return <HeritageChurchLayout {...props} />;
    }
    if (templateId === "religion-gateway" || layoutType === "religion-gateway") {
      return <ModernChurchCommunityLayout {...props} />;
    }
    if (templateId === "religion-ngo" || layoutType === "religion-ngo") {
      return <NgoCommunityLayout {...props} />;
    }

    // 2. 카페/식음료 카테고리 (다크, 화이트, 웜베이지 다양한 구성)
    if (templateId === "cafe-kbbq" || layoutType === "kbbq") {
      return <KoreanBBQRestaurantLayout {...props} />;
    }
    if (templateId === "cafe-minimal" || templateId === "cafe-vintage" || layoutType === "minimal-cafe") {
      return <MinimalCafeBrunchLayout {...props} />;
    }
    if (templateId === "cafe-corporate" || layoutType === "corporate") {
      return <CorporateFranchiseLayout {...props} />;
    }

    // 3. 학원/강좌 카테고리
    if (templateId === "academy-live" || layoutType === "academy-live") {
      return <OnlineAcademyLiveLayout {...props} />;
    }
    if (templateId === "academy-cert" || layoutType === "academy-cert") {
      return <CertInstituteLayout {...props} />;
    }
    if (templateId === "academy-ebook" || layoutType === "academy-ebook") {
      return <EbookMembershipLayout {...props} />;
    }

    // 4. 개인 브랜드 / 크리에이터
    if (templateId === "personal-dynamic" || layoutType === "personal-dynamic" || layoutType === "dynamic") {
      return <DynamicMotionLabLayout {...props} />;
    }
    if (templateId === "personal-portfolio" || layoutType === "personal-portfolio") {
      return <CleanPortfolioLayout {...props} />;
    }

    // 5. 전통 공예
    if (selectedCategory === "traditional" || layoutType.includes("traditional")) {
      return <TraditionalCraftLayout {...props} />;
    }

    // 기본 폴백
    if (selectedCategory === "religion") {
      return <HeritageChurchLayout {...props} />;
    }
    if (selectedCategory === "academy") {
      return <OnlineAcademyLiveLayout {...props} />;
    }
    return <MinimalCafeBrunchLayout {...props} />;
  };

  return (
    <div className="relative w-full min-h-full">
      {renderLayout()}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 text-xs font-bold">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
