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
    "/images/hero-bg.png",
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

// ── 1. 인라인 이미지 교체 모달 컴포넌트 ──
function ImageEditModal() {
  const {
    activeEditingSection,
    setEditingSection,
    setSectionImage,
    selectedTemplate,
  } = useBriefStore();

  const [customUrl, setCustomUrl] = useState("");

  if (!activeEditingSection || !selectedTemplate) return null;

  const sampleStockPool = [
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1200&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&q=80",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
    "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=1200&q=80",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80",
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=80",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
  ];

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

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setSectionImage(activeEditingSection, customUrl.trim());
      setCustomUrl("");
    }
  };

  const sectionName = SECTION_KR[activeEditingSection] || activeEditingSection;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-pretendard"
      onClick={() => setEditingSection(null)}
    >
      <div
        className="bg-white rounded-3xl border-2 border-[#111827] shadow-2xl max-w-lg w-full p-6 text-left space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
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

        {/* 추천 사이즈 가이드 */}
        <div className="bg-[#FFFDF9] border-2 border-[#E5D7C5] p-3 rounded-2xl text-xs space-y-1">
          <p className="font-bold text-[#111827]">📐 추천 이미지 해상도 & 비율</p>
          <p className="text-[#374151] font-mono leading-relaxed">
            • 메인 히어로: <strong>16:9 (1920 × 1080)</strong> 또는 <strong>3:4 (1200 × 1600)</strong><br />
            • 갤러리/콘텐츠 카드: <strong>4:3 (1600 × 1200)</strong> 또는 <strong>1:1 (1024 × 1024)</strong>
          </p>
        </div>

        {/* 1. 추천 고화질 사진 풀 */}
        <div className="space-y-2">
          <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">
            🖼️ 추천 스톡 사진에서 선택 (클릭 즉시 반영)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {sampleStockPool.slice(0, 6).map((imgUrl, idx) => (
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

        {/* 2. 내 컴퓨터 파일 업로드 */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">
            📤 내 컴퓨터 파일 직접 업로드
          </label>
          <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-[#D1D5DB] hover:border-[#111827] rounded-2xl cursor-pointer bg-[#F9FAFB] hover:bg-white transition-all text-xs font-bold text-[#374151]">
            <span>📁 이미지 파일 선택 (JPG, PNG, WEBP)</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* 3. 웹 이미지 URL 직접 입력 */}
        <form onSubmit={handleApplyCustomUrl} className="space-y-1.5">
          <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">
            🔗 외부 이미지 URL 직접 입력
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs font-semibold rounded-xl border-2 border-gray-300 focus:border-[#111827] outline-none text-[#111827]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#111827] hover:bg-[#374151] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0"
            >
              적용
            </button>
          </div>
        </form>
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

// ── 3. 12가지 레이아웃 구조 패턴 렌더러 ──
const TEMPLATE_SECTION_PATTERNS: Record<string, Record<string, number>> = {
  "cafe-minimal": { "about": 8, "menu": 0, "gallery": 7, "location": 1, "instagram": 4 },
  "cafe-vintage": { "story": 8, "menu": 5, "events": 11, "gallery": 7, "contact": 1 },
  "cafe-modern": { "philosophy": 3, "menu": 0, "barista": 2, "reservations": 10 },
  "cafe-finedining": { "chef": 2, "course-menu": 6, "reservation": 1, "private-room": 3 },
  "cafe-casual": { "menu-board": 0, "waiting": 10, "location": 1, "reviews": 5 },
  "academy-trust": { "features": 0, "curriculum": 8, "teachers": 6, "results": 9, "schedule": 5, "contact": 1 },
  "academy-creative": { "classes": 0, "gallery": 7, "instructors": 2, "testimonials": 5, "pricing": 9, "enroll": 10 },
  "academy-online": { "features": 0, "courses": 5, "instructors": 6, "demo": 10, "pricing": 9, "faq": 10 },
  "personal-portfolio": { "works": 7, "about": 2, "skills": 0, "services": 5, "contact": 1 },
  "personal-consultant": { "about": 2, "services": 0, "results": 9, "process": 8, "booking": 1 },
  "personal-creator": { "about": 2, "latest-content": 7, "links": 0, "shop": 5, "newsletter": 1 },
  "religion-church": { "about": 2, "schedule": 0, "events": 6, "gallery": 7, "location": 1 },
  "religion-ngo": { "about": 2, "results": 9, "events": 6, "testimonials": 5, "contact": 1 },
  "religion-community": { "about": 2, "features": 0, "events": 6, "gallery": 7, "contact": 1 },
  "traditional-knots": { "about": 8, "works": 7, "classes": 0, "process": 8, "location": 1 },
  "traditional-pottery": { "philosophy": 3, "gallery": 7, "process": 8, "shop": 0, "contact": 1 }
};

function PatternSectionRenderer({
  sec,
  idx,
  template,
  accentColor,
  bizName,
  images,
  themeMode = "light",
  onActionClick,
}: {
  sec: string;
  idx: number;
  template: Template;
  accentColor: string;
  bizName: string;
  images: string[];
  themeMode?: "light" | "dark";
  onActionClick?: (label: string) => void;
}) {
  const tId = template.id;
  const patternIndex = TEMPLATE_SECTION_PATTERNS[tId]?.[sec] ?? (idx % 12);
  const imageUrl = images[idx % images.length] || images[0];
  const koreanTitle = SECTION_KR[sec] ?? sec;
  const contentText = SECTION_CONTENTS[sec] ?? `${bizName}의 독창적인 ${koreanTitle} 세부 구성안입니다.`;

  const isDarkBg = themeMode === "dark";
  const bgCard = isDarkBg ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm";
  const textColor = isDarkBg ? "text-white" : "text-[#1C1410]";
  const subTextColor = isDarkBg ? "text-gray-300" : "text-[#5C4A3A]";

  const handleBtnClick = (actionName: string) => {
    if (onActionClick) onActionClick(actionName);
  };

  switch (patternIndex) {
    case 0:
      return (
        <section id={sec} className={`py-12 px-6 rounded-2xl border ${bgCard}`}>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-4 dark:border-white/10">
              <h3 className={`text-xl font-bold ${textColor}`}>{koreanTitle}</h3>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">그리드 레이아웃</span>
            </div>
            <p className={`text-sm ${subTextColor} leading-relaxed`}>{contentText}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className={`p-4 rounded-xl border ${isDarkBg ? 'bg-white/5 border-white/5' : 'bg-[#FAFAFA] border-gray-100'} space-y-2`}>
                  <EditableImage sectionKey={`${sec}-grid-${num}`} defaultUrl={images[num % images.length]} className="h-28 rounded-lg shadow-sm" />
                  <h4 className={`text-sm font-bold ${textColor}`}>{koreanTitle} 항목 {num}</h4>
                  <p className={`text-xs ${subTextColor}`}>엄선된 프리미엄 옵션과 상세 스펙을 제공합니다.</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 1:
      return (
        <section id={sec} className={`rounded-2xl border overflow-hidden ${bgCard}`}>
          <div className="flex flex-col md:flex-row min-h-[380px]">
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center space-y-4">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md w-fit">분할 화면 레이아웃</span>
              <h3 className={`text-2xl font-bold ${textColor}`}>{koreanTitle}</h3>
              <p className={`text-sm ${subTextColor} leading-relaxed`}>{contentText}</p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleBtnClick(`${koreanTitle} 신청하기`)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-transform hover:scale-105 cursor-pointer shadow"
                  style={{ backgroundColor: accentColor }}
                >
                  {koreanTitle} 신청하기
                </button>
              </div>
            </div>
            <EditableImage sectionKey={sec} defaultUrl={imageUrl} className="flex-1 min-h-[300px] md:h-auto" />
          </div>
        </section>
      );

    default:
      return (
        <section id={sec} className={`py-12 px-6 rounded-2xl border ${bgCard}`}>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-4 dark:border-white/10">
              <h3 className={`text-xl font-bold ${textColor}`}>{koreanTitle}</h3>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">아키텍처 섹션</span>
            </div>
            <p className={`text-sm ${subTextColor} leading-relaxed`}>{contentText}</p>
            <EditableImage sectionKey={sec} defaultUrl={imageUrl} className="h-64 rounded-xl shadow-md w-full" />
          </div>
        </section>
      );
  }
}

// ── 4. 공통 레이아웃 Props ──
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

// ── 5. 에디토리얼 버티컬 레이아웃 ──
function VerticalLayout({
  template,
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
  const { fonts } = template;

  return (
    <div className="min-h-full w-full flex flex-col font-pretendard bg-[#FAF9F6] text-[#111827]">
      {/* Editorial Nav */}
      <nav className="flex items-center justify-between px-8 py-5 sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Logo" className="h-7 max-w-[140px] object-contain cursor-pointer" onClick={() => onNavClick("hero", 0)} />
        ) : (
          <span
            className="text-base font-bold tracking-widest uppercase font-serif-kr text-[#111827] cursor-pointer"
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
              className="text-xs font-bold tracking-wider hover:text-amber-800 transition-colors text-[#374151] cursor-pointer"
            >
              {menu}
            </button>
          ))}
        </div>
      </nav>

      {/* Editorial Hero */}
      <header id="hero" className="px-8 py-16 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7 space-y-6 text-left">
          <span className="text-xs font-bold tracking-widest uppercase text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
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
              className="px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase bg-[#111827] text-white hover:bg-[#374151] transition-all cursor-pointer shadow-md"
            >
              DISCOVER ARCHIVE
            </button>
          </div>
        </div>

        <div className="md:col-span-5 flex justify-center md:justify-end">
          <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#E5E7EB]">
            <EditableImage
              sectionKey="hero"
              defaultUrl={images[0]}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* 섹션 순회 */}
      <main className="flex-1 px-8 py-12 max-w-6xl mx-auto w-full space-y-12 border-t border-[#E5E7EB]">
        {sections.filter(s => s !== "hero").map((sec, i) => (
          <PatternSectionRenderer
            key={sec}
            sec={sec}
            idx={i}
            template={template}
            accentColor={accentColor}
            bizName={bizName}
            images={images}
            themeMode="light"
            onActionClick={onActionClick}
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-8 border-t border-[#E5E7EB] text-center text-xs font-semibold text-[#4B5563] bg-white mt-auto">
        <p className="font-bold mb-2 uppercase tracking-widest text-[#111827]">{bizName}</p>
        {contact && <p className="mb-2">INQUIRY: {contact}</p>}
        <p className="opacity-70">© 2026 {bizName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// ── 6. 다이내믹 & 그리드 레이아웃 (통합 렌더) ──
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
    const templateId = selectedTemplate.id;
    const fallbacks = TEMPLATE_DEFAULTS[templateId] || [
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80"
    ];

    const resolved = [...fallbacks];
    if (imageMode === "upload" && uploadedImageUrl) {
      resolved[0] = uploadedImageUrl;
    } else if (imageMode === "stock" && selectedStockImages.length > 0) {
      selectedStockImages.forEach((img, idx) => {
        if (idx < resolved.length) resolved[idx] = img;
      });
    }
    return resolved;
  }, [selectedTemplate.id, imageMode, uploadedImageUrl, selectedStockImages]);

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

  return (
    <div className="relative w-full min-h-full">
      <VerticalLayout {...props} />

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
