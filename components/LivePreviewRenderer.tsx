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
// 🌐 12가지 웹사이트 구조 패턴 통합 렌더러 컴포넌트
// ─────────────────────────────────────────────
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
  const layoutPatternIndex = idx % 12;
  const imageUrl = images[(idx + 1) % images.length];
  const koreanTitle = SECTION_KR[sec] ?? sec;
  const contentText = SECTION_CONTENTS[sec] || `${bizName}의 ${koreanTitle} 섹션입니다. 기획안의 12가지 독창적 웹사이트 구조 패턴 중 하나를 반영하여 완성도를 보강했습니다.`;
  
  // 인터랙티브 탭 상태관리
  const [activeTab, setActiveTab] = useState(0);

  const cardBg = themeMode === "dark" ? "bg-white/5 border-white/10" : "bg-white border-black/5";
  const textColor = themeMode === "dark" ? "text-white" : "text-[#1C1410]";
  const subTextColor = themeMode === "dark" ? "text-white/60" : "text-[#8C7A6A]";

  switch (layoutPatternIndex) {
    case 0:
      // 1. 그리드 레이아웃 (Grid Layout) - 모듈형 정렬
      return (
        <section key={sec} className={`rounded-2xl p-8 border shadow-sm ${cardBg} space-y-6`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E]">Pattern 01: Grid Layout</span>
            <h4 className={`text-xl font-bold ${textColor}`}>{koreanTitle} 모듈</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((cardNum) => (
              <div key={cardNum} className="p-5 border rounded-xl bg-black/5 dark:bg-white/5 space-y-2">
                <div className="w-8 h-1 rounded" style={{ backgroundColor: accentColor }} />
                <h5 className={`font-bold text-sm ${textColor}`}>핵심 포인트 {cardNum}</h5>
                <p className={`text-xs ${subTextColor}`}>{contentText.slice(0, 70)}...</p>
              </div>
            ))}
          </div>
        </section>
      );

    case 1:
      // 2. 분할 화면 레이아웃 (Split Screen Layout) - 50:50
      return (
        <section key={sec} className={`flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden shadow-sm border ${cardBg}`}>
          <EditableImage sectionKey={sec} defaultUrl={imageUrl} className="flex-1 min-h-[300px] md:h-auto" />
          <div className="flex-1 p-8 flex flex-col justify-center space-y-6">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E]">Pattern 02: Split Screen</span>
            <h3 className={`text-3xl font-bold leading-tight ${textColor}`}>{koreanTitle}</h3>
            <p className={`text-sm ${subTextColor} leading-relaxed`}>{contentText}</p>
            <button className="px-6 py-2.5 w-fit rounded font-bold transition-transform hover:scale-105"
              style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
              자세히 보기
            </button>
          </div>
        </section>
      );

    case 2:
      // 3. 비대칭 레이아웃 (Asymmetrical Layout) - 70:30 시각 무게
      return (
        <section key={sec} className={`grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch`}>
          <div className={`md:col-span-8 relative rounded-2xl overflow-hidden shadow-sm border h-80 ${cardBg}`}>
            <EditableImage sectionKey={sec} defaultUrl={imageUrl} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 z-10 text-white max-w-xl">
              <span className="text-[9px] font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                Pattern 03: Asymmetrical Focus
              </span>
              <h3 className="text-xl font-bold mt-2" style={{ fontFamily: fonts.heading }}>{koreanTitle}</h3>
            </div>
          </div>
          <div className={`md:col-span-4 p-6 rounded-2xl border flex flex-col justify-between ${cardBg}`}>
            <div className="space-y-4">
              <div className="w-10 h-1 rounded" style={{ backgroundColor: accentColor }} />
              <p className={`text-xs ${subTextColor} leading-relaxed`}>{contentText}</p>
            </div>
            <button className="w-full mt-6 py-3 rounded font-bold text-center border transition-all hover:bg-black/5 dark:hover:bg-white/5"
              style={{ borderColor: accentColor, color: colors.text }}>
              서비스 예약하기
            </button>
          </div>
        </section>
      );

    case 3:
      // 4. 전체 화면 레이아웃 (Full Screen Layout) - 이미지 타격
      return (
        <section key={sec} className="relative rounded-2xl overflow-hidden h-96 flex items-center justify-center text-center shadow-lg border border-black/5">
          <EditableImage sectionKey={sec} defaultUrl={imageUrl} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          <div className="relative z-10 p-6 max-w-xl text-white space-y-4">
            <span className="text-[9px] font-bold tracking-widest uppercase bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm text-[#C8A97E]">
              Pattern 04: Full Canvas
            </span>
            <h3 className="text-2xl font-bold" style={{ fontFamily: fonts.heading }}>{koreanTitle}</h3>
            <p className="text-sm text-white/80 leading-relaxed">{contentText}</p>
          </div>
        </section>
      );

    case 4:
      // 5. 사이드 스크롤 레이아웃 (Side Scroll Layout) - 슬라이더
      return (
        <section key={sec} className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E] block mb-1">Pattern 05: Side Scroll</span>
              <h3 className={`text-2xl font-bold ${textColor}`}>{koreanTitle}</h3>
            </div>
            <span className="text-xs opacity-50 font-pretendard">스와이프 ➔</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x text-black dark:text-white">
            {[1, 2, 3].map((cardIdx) => (
              <div key={cardIdx} className={`min-w-[260px] rounded-xl overflow-hidden border snap-start ${cardBg}`}>
                <EditableImage sectionKey={`${sec}-${cardIdx}`} defaultUrl={images[(cardIdx) % images.length]} className="h-36 w-full" />
                <div className="p-4 space-y-1">
                  <h4 className={`font-bold text-sm ${textColor}`}>컬렉션 {cardIdx}</h4>
                  <p className={`text-xs ${subTextColor}`}>{contentText.slice(0, 50)}...</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 5:
      // 6. 카드 레이아웃 (Card Layout) - 콤팩트 다단
      return (
        <section key={sec} className="space-y-4">
          <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E] block w-fit">Pattern 06: Card System</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((itemNum) => (
              <div key={itemNum} className={`rounded-xl overflow-hidden border p-5 space-y-3 ${cardBg}`}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-black/10 dark:bg-white/10 text-xs font-bold" style={{ color: accentColor }}>
                  {itemNum}
                </div>
                <h4 className={`font-bold text-sm ${textColor}`}>{koreanTitle} 리스트 {itemNum}</h4>
                <p className={`text-[11px] ${subTextColor} leading-relaxed`}>{contentText.slice(0, 60)}...</p>
              </div>
            ))}
          </div>
        </section>
      );

    case 6:
      // 7. 잡지 레이아웃 (Magazine Layout) - 비주얼 가중치 조절
      return (
        <section key={sec} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-4">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E] block w-fit">Pattern 07: Magazine Layout</span>
            <h3 className={`text-3xl font-light leading-tight font-serif-kr ${textColor}`}>
              {koreanTitle}의<br /><span className="font-bold">주요 스토리라인</span>
            </h3>
            <p className={`text-xs ${subTextColor} leading-relaxed`}>{contentText}</p>
          </div>
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <EditableImage sectionKey={`${sec}-sub1`} defaultUrl={images[1]} className="h-44 rounded-xl shadow-sm border" />
              <h4 className={`font-bold text-sm ${textColor}`}>전략 기획 및 컨설팅</h4>
              <p className={`text-[11px] ${subTextColor}`}>{contentText.slice(0, 60)}...</p>
            </div>
            <div className="space-y-2">
              <EditableImage sectionKey={`${sec}-sub2`} defaultUrl={images[2]} className="h-44 rounded-xl shadow-sm border" />
              <h4 className={`font-bold text-sm ${textColor}`}>시네마틱 솔루션 배포</h4>
              <p className={`text-[11px] ${subTextColor}`}>{contentText.slice(0, 60)}...</p>
            </div>
          </div>
        </section>
      );

    case 7:
      // 8. 갤러리 레이아웃 (Gallery Layout) - 비주얼 집중
      return (
        <section key={sec} className="space-y-4">
          <div className="flex justify-between items-baseline">
            <h3 className={`text-2xl font-bold ${textColor}`}>{koreanTitle} 화보</h3>
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E]">Pattern 08: Premium Gallery</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((idxNum) => (
              <EditableImage key={idxNum} sectionKey={`${sec}-gallery-${idxNum}`} defaultUrl={images[idxNum % images.length]} className="h-32 md:h-44 rounded-xl border border-black/5" />
            ))}
          </div>
        </section>
      );

    case 8:
      // 9. 지그재그 레이아웃 (Zig-Zag Layout) - 시선 Z자 정렬
      return (
        <section key={sec} className="flex flex-col md:flex-row gap-8 items-center border-b pb-12" style={{ borderColor: `${accentColor}15` }}>
          <div className="flex-1 space-y-4">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E] block w-fit">Pattern 09: Zig-Zag</span>
            <h3 className={`text-2xl font-bold ${textColor}`}>{koreanTitle}</h3>
            <p className={`text-sm ${subTextColor} leading-relaxed`}>{contentText}</p>
          </div>
          <EditableImage sectionKey={sec} defaultUrl={imageUrl} className="flex-1 w-full h-64 rounded-xl shadow-sm border" />
        </section>
      );

    case 9:
      // 10. F-패턴 레이아웃 (F-Pattern Layout) - 장문 최적화 (좌측 스캔)
      return (
        <section key={sec} className={`rounded-2xl p-6 border ${cardBg} space-y-4`}>
          <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E]">Pattern 10: F-Pattern Scan</span>
          <h2 className={`text-4xl font-bold tracking-tight text-left ${textColor}`}>{koreanTitle} 요약</h2>
          <div className="w-16 h-1 rounded" style={{ backgroundColor: accentColor }} />
          <div className="space-y-4 text-left max-w-2xl">
            <h4 className={`font-bold text-base ${textColor}`}>1순위 탐색 영역: 핵심 요약</h4>
            <p className={`text-sm ${subTextColor} leading-relaxed`}>{contentText}</p>
            <button className="px-6 py-2.5 rounded text-xs font-bold transition-all hover:scale-105"
              style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
              자세히 진단받기
            </button>
          </div>
        </section>
      );

    case 10:
      // 11. 인터랙티브 레이아웃 (Interactive Layout) - 실시간 탭 조작!
      return (
        <section key={sec} className={`rounded-2xl p-6 border ${cardBg} space-y-4`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E]">Pattern 11: Interactive Tabs</span>
            <span className="text-[9px] text-[#A09080] font-pretendard bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">실시간 탭 클릭 작동</span>
          </div>
          <h3 className={`text-xl font-bold ${textColor}`}>{koreanTitle} 인포</h3>
          
          <div className="flex gap-2 border-b border-black/10 dark:border-white/10 pb-2">
            {["핵심 혜택", "상세 구성", "도입 가이드"].map((tabLabel, tIdx) => (
              <button
                key={tabLabel}
                onClick={() => setActiveTab(tIdx)}
                className={`text-xs px-3 py-1.5 rounded transition-all font-pretendard ${
                  activeTab === tIdx
                    ? "bg-[#1C1410] text-white dark:bg-white dark:text-black font-semibold"
                    : "hover:bg-black/5 dark:hover:bg-white/5 text-[#8C7A6A]"
                }`}
              >
                {tabLabel}
              </button>
            ))}
          </div>

          <div className="py-2 text-xs leading-relaxed text-[#8C7A6A] dark:text-white/80">
            {activeTab === 0 && <p>🏆 {bizName}의 {koreanTitle} 혜택: {contentText}</p>}
            {activeTab === 1 && <p>⚙️ {koreanTitle} 설계 규격: {contentText.slice(0, 100)}... 12가지 레이아웃 구조가 긴밀하게 연동되어 있습니다.</p>}
            {activeTab === 2 && <p>🚀 {koreanTitle} 셋업 가이드: 2GOSOO AI LAB 에이전트의 원천 코드를 복사하여 Lovable 이나 v0에 붙여넣으면 즉시 배포 가능합니다.</p>}
          </div>
        </section>
      );

    default:
      // 12. 애니메이션 레이아웃 (Animation Layout) - 모션 그래픽 피드
      return (
        <section key={sec} className={`group cursor-pointer rounded-2xl p-6 border transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg ${cardBg}`}>
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A97E]">Pattern 12: Motion Card</span>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
          </div>
          <h3 className={`text-xl font-bold transition-colors ${textColor} group-hover:text-[var(--accent)]`} style={{ "--accent": accentColor } as any}>
            {koreanTitle} <span className="inline-block transition-transform group-hover:translate-x-1">➔</span>
          </h3>
          <p className={`text-xs mt-2 ${subTextColor} leading-relaxed`}>{contentText}</p>
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
          backgroundImage: `linear-gradient(rgba(0, 0, 0, ${heroDark ? 0.75 : 0.55}), rgba(0, 0, 0, ${heroDark ? 0.75 : 0.55}))`
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
          <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(45deg, ${colors.primary}50, transparent)` }} />
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
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="w-full h-full opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/95 pointer-events-none" />
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
        <div className="px-8 lg:px-24 py-20 bg-black/85 backdrop-blur-md border-t border-white/10 mt-auto space-y-16">
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
