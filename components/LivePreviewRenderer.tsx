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

// ── 개별 섹션 이미지 래퍼 ──
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
      <img src={imageUrl} alt={sectionKey} className="w-full h-full object-cover" />
    </div>
  );
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
  activeSubPage: string;
  setActiveSubPage: (page: string) => void;
  onActionClick: (label: string) => void;
}

// ════════════════════════════════════════════════════════════════════════
// 1. 🥩 K-BBQ 정통 숯불 다이닝 레이아웃 (완성형 풀 롱페이지)
// ════════════════════════════════════════════════════════════════════════
function KoreanBBQRestaurantLayout({ accentColor, bizName, bizDesc, images, contact, setActiveSubPage, onActionClick }: LayoutProps) {
  const red = accentColor || "#DC2626";
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#09090B] text-[#FAFAFA] text-left">
      {/* 상단 띠 */}
      <div className="bg-[#18181B] text-gray-300 text-xs py-2.5 px-8 flex justify-between items-center border-b border-white/10">
        <span className="text-red-500 font-bold">🔥 SIZZLING PRIME DINING</span>
        <span>RESERVATION: {contact || "(847) 983-8282"}</span>
      </div>

      {/* 네비게이션 */}
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

      {/* 16:9 다크 히어로 */}
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

      {/* 4단 퀵 바 */}
      <section className="max-w-6xl mx-auto px-6 -mt-6 relative z-30 w-full">
        <div className="bg-[#18181B] rounded-2xl border border-white/10 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 shadow-2xl">
          {[{ i: "🥩", t: "Prime Beef Galbi", d: "최상급 꽃갈비 & 양념갈비" }, { i: "🥓", t: "Thick Pork Belly", d: "두툼한 칼집 통삼겹살" }, { i: "🍲", t: "Authentic Stews", d: "해물순두부 & 차돌된장" }, { i: "🍶", t: "Soju & Craft Beer", d: "한국 소주 & 프리미엄 드링크" }].map((item, idx) => (
            <div key={idx} className="p-4 flex items-center gap-3">
              <span className="text-2xl">{item.i}</span>
              <div><h4 className="text-xs font-bold text-white">{item.t}</h4><p className="text-[11px] text-gray-400">{item.d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* 3열 시그니처 메뉴 쇼케이스 */}
      <main className="max-w-6xl mx-auto px-6 py-16 space-y-16 w-full">
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4"><span className="text-xs font-bold text-red-500">SIGNATURE</span><h2 className="text-2xl font-black text-white">인기 숯불구이 라인업</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "프라임 양념 소갈비", p: "$39.95", d: "24시간 특제 과일 양념에 숙성한 부드러운 육질", img: images[1%images.length] },
              { t: "칼집 생삼겹살 세트", p: "$29.95", d: "신선한 통삼겹살과 겉절이 김치, 쌈채소", img: images[2%images.length] },
              { t: "차돌박이 & 해물순두부", p: "$27.95", d: "고소한 차돌박이와 칼칼한 뚝배기 순두부", img: images[3%images.length] },
            ].map((c, i) => (
              <div key={i} className="bg-[#18181B] rounded-3xl border border-white/10 overflow-hidden shadow-lg">
                <div className="h-48 overflow-hidden"><EditableImage sectionKey={`kbbq-${i}`} defaultUrl={c.img} className="w-full h-full object-cover" /></div>
                <div className="p-5 space-y-2">
                  <div className="flex justify-between font-bold"><span className="text-sm text-white">{c.t}</span><span className="text-amber-400">{c.p}</span></div>
                  <p className="text-xs text-gray-400">{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 프라이빗 룸 배너 */}
        <section className="bg-gradient-to-r from-red-950/80 via-[#18181B] to-black p-8 rounded-3xl border border-red-900/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2"><span className="text-xs font-bold text-amber-400">PRIVATE DINING</span><h3 className="text-2xl font-black text-white">단체 회식 & 가족 모임 전용 프라이빗 룸</h3><p className="text-xs text-gray-300">최대 50인 수용 가능한 전용 룸과 최첨단 환기 시스템</p></div>
          <button onClick={() => onActionClick("룸 예약 문의")} className="px-6 py-3 rounded-xl text-xs font-bold text-white whitespace-nowrap" style={{ backgroundColor: red }}>룸 예약 문의 &rarr;</button>
        </section>
      </main>

      <footer className="py-10 px-8 border-t border-white/10 bg-black text-center text-xs text-gray-500 mt-auto">
        <p className="font-bold text-white">{bizName} · TEL: {contact || "(847) 983-8282"}</p>
        <p className="mt-1">📍 8520 Golf Rd, Niles, IL 60714 (시카고 인근)</p>
        <p className="opacity-60 mt-2">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2. ⛪ 전통 한인 장로 & 감리교회 레이아웃 (경건한 버건디 & 베이지 풀 롱페이지)
// ════════════════════════════════════════════════════════════════════════
function HeritageChurchLayout({ accentColor, bizName, bizDesc, images, contact, onActionClick }: LayoutProps) {
  const burgundy = accentColor || "#881337";
  return (
    <div className="min-h-full w-full flex flex-col font-serif-kr bg-[#FDFBF7] text-[#451A03] text-left">
      {/* 1. 상단 유틸리티 띠 */}
      <div className="bg-[#881337] text-amber-100 text-xs py-2.5 px-8 flex justify-between items-center">
        <span>⛪ 말씀과 기도로 든든히 서가는 경건한 신앙 공동체</span>
        <span>교회 사무실: {contact || "(303) 755-1234"}</span>
      </div>

      {/* 2. 경건한 네비게이션 헤더 */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b-2 border-amber-900/10 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⛪</span>
          <div>
            <h2 className="text-xl font-bold font-serif text-amber-950 leading-tight">{bizName}</h2>
            <span className="text-[10px] text-amber-800 font-mono tracking-widest block">KOREAN PRESBYTERIAN & METHODIST CHURCH</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold text-amber-950 font-pretendard">
          <span>교회소개</span><span>말씀과 설교</span><span>예배시간표</span><span>교구 및 부서</span><span>교우소식</span>
        </div>
        <button onClick={() => onActionClick("온라인 주보")} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow font-pretendard" style={{ backgroundColor: burgundy }}>
          이번 주 주보 PDF &rarr;
        </button>
      </nav>

      {/* 3. 성전 전경 대형 히어로 */}
      <header className="relative w-full h-[480px] bg-amber-950 flex items-center justify-center text-center overflow-hidden">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#881337]/90 via-black/40 to-black/60" />
        <div className="relative z-20 max-w-3xl px-6 space-y-4 text-white">
          <span className="text-xs tracking-widest uppercase px-3 py-1 rounded-full border border-amber-300/40 bg-amber-950/60 text-amber-200">2026년 교회 표어</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-50 leading-tight">
            &quot;오직 은혜, 오직 믿음으로<br />세상을 치유하는 교회&quot;
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-lg mx-auto leading-relaxed">{bizDesc}</p>
          <div className="flex justify-center gap-3 pt-3 font-pretendard">
            <button onClick={() => onActionClick("새가족 등록")} className="px-6 py-3 rounded-xl text-xs font-bold bg-amber-400 text-amber-950 shadow-lg hover:bg-amber-300">새가족 등록 안내 &rarr;</button>
            <button onClick={() => onActionClick("주일 설교")} className="px-6 py-3 rounded-xl text-xs font-bold bg-white/20 text-white border border-white/30 hover:bg-white/30">주일 설교 듣기</button>
          </div>
        </div>
      </header>

      {/* 4. 4단 예배 시간 및 안내 바 */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-30 w-full font-pretendard">
        <div className="bg-white rounded-3xl border-2 border-amber-900/10 shadow-2xl grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-amber-100 overflow-hidden">
          {[
            { tag: "주일 대예배", time: "주일 오전 11:00", place: "본당 대예배실 (생중계)" },
            { tag: "수요 성경강해", time: "매주 수요일 저녁 7:30", place: "소예배실 및 온라인 줌" },
            { tag: "새벽 기도회", time: "화~토 오전 6:00", place: "비전채플실" },
            { tag: "주일학교 / 청년부", time: "주일 오전 11:00", place: "교육관 2층 글로리아홀" },
          ].map((item, idx) => (
            <div key={idx} className="p-5 space-y-1">
              <span className="text-[11px] font-bold text-[#881337] bg-rose-50 px-2 py-0.5 rounded">{item.tag}</span>
              <h4 className="text-sm font-bold text-amber-950 mt-1">{item.time}</h4>
              <p className="text-xs text-stone-500">{item.place}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 메인 콘텐츠: 담임목사 환영사 & 최신 설교 영상 */}
      <main className="max-w-6xl mx-auto px-6 py-16 space-y-16 w-full font-pretendard">
        {/* 담임목사 환영사 2단 스플릿 */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 h-80 rounded-3xl overflow-hidden border-2 border-amber-900/10 shadow-md">
            <EditableImage sectionKey="pastor" defaultUrl={images[1%images.length]} className="w-full h-full object-cover" />
          </div>
          <div className="md:col-span-7 space-y-4 text-left">
            <span className="text-xs font-bold text-[#881337] uppercase tracking-widest">PASTORAL MESSAGE</span>
            <h3 className="text-2xl font-serif font-bold text-amber-950">주님의 사랑으로 여러분을 환영합니다</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              우리 교회는 이민 사회의 따뜻한 안식처이자, 다음 세대를 믿음의 거목으로 세워가는 영적 보금자리입니다. 예배의 감격과 성도의 교제가 살아 숨쉬는 거룩한 공동체로 여러분을 정중히 초대합니다.
            </p>
            <p className="text-xs font-serif font-bold text-amber-900">담임목사 김은혜 드림</p>
          </div>
        </section>

        {/* 최신 주일 설교 말씀 영상 섹션 */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b-2 border-amber-900/10 pb-3">
            <div>
              <span className="text-xs font-bold text-[#881337] uppercase">LATEST SERMON</span>
              <h3 className="text-xl font-bold text-amber-950">최신 주일 말씀 영상</h3>
            </div>
            <button onClick={() => onActionClick("설교 아카이브")} className="text-xs font-bold text-[#881337] hover:underline">지난 설교 전체보기 &rarr;</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 aspect-video rounded-3xl overflow-hidden bg-black border-2 border-amber-900/10 shadow-lg relative">
              <EditableImage sectionKey="sermon-video" defaultUrl={images[2%images.length]} className="w-full h-full object-cover opacity-85" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center text-2xl shadow-2xl pl-1 cursor-pointer hover:scale-110 transition-transform">▶</div>
              </div>
            </div>
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border-2 border-amber-900/10 shadow-sm space-y-4 text-left">
              <span className="text-xs font-bold text-amber-700">2026년 8월 16일 주일 설교</span>
              <h4 className="text-base font-bold text-amber-950">광야에서 피어나는 믿음의 꽃</h4>
              <p className="text-xs text-stone-500 font-mono">본문: 이사야 43장 18~21절</p>
              <p className="text-xs text-stone-600 leading-relaxed">광야에 길을 내시고 사막에 강을 만드시는 하나님의 신실하신 약속을 굳게 붙잡으십시오.</p>
              <button onClick={() => onActionClick("설교 요약 다운로드")} className="w-full py-2.5 rounded-xl text-xs font-bold border border-amber-800/30 hover:bg-amber-50 text-amber-950">설교 요약문 PDF 다운로드</button>
            </div>
          </div>
        </section>

        {/* 4단 세대별 사역 부서 그리드 */}
        <section className="space-y-6">
          <div className="border-b-2 border-amber-900/10 pb-3"><span className="text-xs font-bold text-[#881337]">MINISTRIES</span><h3 className="text-xl font-bold text-amber-950">세대별 사역 및 공동체</h3></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { t: "꿈나무 영유아부", d: "말씀 안에서 쑥쑥 자라는 아기학교", icon: "👶" },
              { t: "유초등부 조이풀", d: "재미있는 성경공부와 찬양 축제", icon: "🎈" },
              { t: "청년부 비전워십", d: "세상을 변화시키는 청년 복음 사역", icon: "🔥" },
              { t: "시니어 은혜구역", d: "기도와 말씀 나눔의 따스한 교제", icon: "🌿" },
            ].map((m, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border-2 border-amber-900/10 shadow-sm space-y-2 text-left">
                <span className="text-2xl">{m.icon}</span>
                <h4 className="text-sm font-bold text-amber-950">{m.t}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{m.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 6. 하단 푸터 & 오시는 길 */}
      <footer className="py-12 px-8 bg-[#2A0808] text-amber-100 font-pretendard text-center text-xs space-y-2 mt-auto border-t-4 border-[#881337]">
        <h4 className="font-bold text-base text-white font-serif">{bizName}</h4>
        <p className="opacity-80">주소: 1234 Faith Blvd, Denver, CO 80231 · 연락처: {contact || "(303) 755-1234"}</p>
        <p className="opacity-80">주일 대예배 1부 9:00 AM / 2부 11:00 AM · 수요기도회 7:30 PM</p>
        <p className="text-[11px] text-amber-300/60 pt-2">© 2026 {bizName}. All Rights Reserved. 대한예수교장로회 / 미주감리교회</p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3. 🕊️ 모던 워십 글로벌 교회 (religion-gateway) - 딥 틸 & 슬레이트
// ════════════════════════════════════════════════════════════════════════
function ModernChurchCommunityLayout({ accentColor, bizName, bizDesc, images, contact, onActionClick }: LayoutProps) {
  const teal = accentColor || "#0D9488";
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#0F172A] text-white text-left">
      <div className="grid grid-cols-2 md:grid-cols-4 text-center text-xs font-bold text-white">
        <div className="py-3 bg-[#0F766E] cursor-pointer">NEW HERE? (새가족)</div>
        <div className="py-3 bg-[#0D9488] cursor-pointer">ABOUT US (교회소개)</div>
        <div className="py-3 bg-[#14B8A6] cursor-pointer">MINISTRIES (사역안내)</div>
        <div className="py-3 bg-[#2DD4BF] text-slate-900 cursor-pointer">ONLINE GIVE (헌금)</div>
      </div>
      <nav className="flex items-center justify-between px-8 py-4 bg-[#0F172A]/95 border-b border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2"><span className="text-2xl">⛪</span><span className="text-lg font-black">{bizName}</span></div>
        <div className="hidden md:flex gap-6 text-xs font-bold text-slate-300"><span>WORSHIP</span><span>SERMONS</span><span>GROUPS</span><span>LOCATION</span></div>
        <button onClick={() => onActionClick("온라인 헌금")} className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: teal }}>ONLINE GIVE &rarr;</button>
      </nav>
      <header className="relative w-full h-[500px] bg-black flex items-center justify-center text-center overflow-hidden">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="relative z-20 max-w-3xl px-6 space-y-4">
          <span className="text-xs font-bold px-3 py-1 bg-teal-950 text-teal-300 border border-teal-500/30 rounded-full">GLOBAL WORSHIP COMMUNITY</span>
          <h1 className="text-4xl sm:text-6xl font-black">{bizName}</h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">{bizDesc}</p>
        </div>
      </header>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 4. ☕ 프리미엄 프랜차이즈 (cafe-corporate)
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
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 5. 🎓 스타강사 실시간 Live 클래스 아카데미 (academy-live)
// ════════════════════════════════════════════════════════════════════════
function OnlineAcademyLiveLayout({ accentColor, bizName, bizDesc, images, onActionClick }: LayoutProps) {
  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#F8FAFC] text-[#0F172A] text-left">
      <div className="bg-[#1E1B4B] text-white text-xs py-2.5 px-8 flex justify-between">
        <span>🔴 2026 스타강사 실시간 Live 클래스 온에어</span>
        <span className="text-indigo-300">수강생 98.4% 합격 신화</span>
      </div>
      <header className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white py-16 px-8 text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <h1 className="text-4xl font-black">스타강사의 명강의를<br /><span className="text-amber-400">온라인 실시간 Live로</span></h1>
            <p className="text-xs text-slate-300">{bizDesc}</p>
          </div>
          <div className="md:col-span-5 h-72 rounded-2xl overflow-hidden border-2 border-white/20"><EditableImage sectionKey="teacher" defaultUrl={images[0]} className="w-full h-full object-cover" /></div>
        </div>
      </header>
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
    if (templateId === "religion-heritage") {
      return <HeritageChurchLayout {...props} />;
    }
    if (templateId === "religion-gateway" || selectedCategory === "religion") {
      return <ModernChurchCommunityLayout {...props} />;
    }
    if (templateId === "cafe-corporate") {
      return <CorporateFranchiseLayout {...props} />;
    }
    if (selectedCategory === "academy" || templateId.includes("academy")) {
      return <OnlineAcademyLiveLayout {...props} />;
    }
    return <KoreanBBQRestaurantLayout {...props} />;
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
