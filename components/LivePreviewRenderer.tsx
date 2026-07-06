"use client";

import { useBriefStore } from "@/store/briefStore";
import type { Template } from "@/lib/types";
import { useMemo } from "react";

const SECTION_KR: Record<string, string> = {
  hero: "히어로", about: "브랜드 소개", menu: "메뉴 안내", gallery: "갤러리",
  location: "오시는 길", instagram: "인스타그램", story: "우리의 이야기", events: "이벤트",
  contact: "문의하기", features: "주요 특징", curriculum: "커리큘럼", teachers: "강사진",
  results: "합격 실적", schedule: "수업 시간표", classes: "클래스 안내", instructors: "강사 소개",
  testimonials: "수강 후기", pricing: "수강료", enroll: "신청하기", courses: "강좌 목록",
  demo: "무료 체험", faq: "자주 묻는 질문", cta: "시작하기", works: "포트폴리오", process: "작업 과정",
  skills: "보유 스킬", services: "제공 서비스", booking: "예약하기", links: "링크 모음",
  "latest-content": "최신 콘텐츠", shop: "쇼핑몰", newsletter: "뉴스레터",
  philosophy: "브랜드 철학", barista: "바리스타", reservations: "예약 안내",
  chef: "셰프 소개", "course-menu": "코스 메뉴", reservation: "예약 폼", "private-room": "프라이빗 룸",
  "menu-board": "전체 메뉴판", waiting: "웨이팅 안내", reviews: "고객 리뷰"
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
        {/* 호버 오버레이 */}
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
      
      {/* 호버 오버레이 */}
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

export default function LivePreviewRenderer() {
  const {
    selectedTemplate,
    selectedCategory,
    modifyOptions,
    userInputs,
    imageMode,
    uploadedImageUrl,
    selectedStockImages
  } = useBriefStore();

  if (!selectedTemplate) return null;

  const { layoutType } = selectedTemplate;

  const accentColor = userInputs.pickedColor || selectedTemplate.colors.accent;
  const bizName = userInputs.businessName || selectedTemplate.name;
  const bizDesc = userInputs.description || selectedTemplate.tagline;
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
    images
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
}

// ─────────────────────────────────────────────
// 1. VERTICAL LAYOUT (미니멀 카페, 신뢰 학원 등)
// ─────────────────────────────────────────────
function VerticalLayout({ template, isMultiPage, accentColor, bizName, bizDesc, sections, images }: LayoutProps) {
  const { colors, fonts } = template;
  const heroDark = isDark(colors.primary);
  const navBg = colors.surface ?? colors.bg;
  const navText = isDark(navBg) ? "#FFFFFF" : colors.primary;

  return (
    <div className="min-h-full w-full flex flex-col" style={{ backgroundColor: colors.bg, fontFamily: fonts.body }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 sticky top-0 z-10" style={{ backgroundColor: navBg }}>
        <span className="text-xl font-bold tracking-widest uppercase" style={{ fontFamily: fonts.heading, color: navText }}>
          {bizName}
        </span>
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
        <h1 className="text-5xl md:text-6xl font-bold mb-6 relative z-10 leading-tight text-white" style={{ fontFamily: fonts.heading }}>
          {bizDesc}
        </h1>
        <p className="text-lg md:text-xl mb-10 relative z-10 text-white/90">
          {bizName}에 오신 것을 환영합니다.
        </p>
        <button className="px-8 py-4 rounded-full text-lg font-bold relative z-10 transition-transform hover:scale-105"
          style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
          자세히 알아보기
        </button>
      </EditableImage>

      {/* Sections */}
      <main className="flex-1 px-8 py-16 max-w-5xl mx-auto w-full space-y-24">
        {sections.filter(s => s !== 'hero').map((sec, i) => (
          <section key={i} className="flex flex-col md:flex-row gap-12 items-center">
            {i % 2 !== 0 && (
              <EditableImage
                sectionKey={sec}
                defaultUrl={images[i % images.length]}
                className="flex-1 w-full h-80 rounded-2xl bg-gray-200 shadow-sm border border-black/5"
              />
            )}
            <div className="flex-1">
              <div className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-4" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                {sec.toUpperCase()}
              </div>
              <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: fonts.heading, color: colors.text }}>
                {SECTION_KR[sec] ?? sec}
              </h2>
              <p className="text-lg opacity-70 leading-relaxed" style={{ color: colors.text }}>
                {bizName}의 {SECTION_KR[sec] ?? sec} 섹션입니다. 고객에게 전달할 핵심 가치와 상세 내용을 이곳에 기입하게 됩니다. 미니멀하고 깔끔한 레이아웃이 돋보입니다.
              </p>
            </div>
            {i % 2 === 0 && (
              <EditableImage
                sectionKey={sec}
                defaultUrl={images[i % images.length]}
                className="flex-1 w-full h-80 rounded-2xl bg-gray-200 shadow-sm border border-black/5"
              />
            )}
          </section>
        ))}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. GRID LAYOUT (빈티지 브런치, 크리에이티브 클래스 등)
// ─────────────────────────────────────────────
function GridLayout({ template, accentColor, bizName, bizDesc, sections, images }: LayoutProps) {
  const { colors, fonts } = template;
  const heroDark = isDark(colors.primary);
  const heroText = heroDark ? "#FFFFFF" : "#111111";

  return (
    <div className="min-h-full w-full flex flex-col" style={{ backgroundColor: colors.bg, fontFamily: fonts.body }}>
      <nav className="flex justify-between items-center px-8 py-4 border-b" style={{ borderColor: `${accentColor}30`, backgroundColor: colors.surface }}>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: accentColor }} />
          <span className="text-lg font-bold" style={{ fontFamily: fonts.heading, color: colors.primary }}>{bizName}</span>
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
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: fonts.heading, color: heroText }}>
            {bizDesc}
          </h1>
          <p className="text-lg opacity-80 mb-10" style={{ color: heroText }}>
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

      {/* Grid Content */}
      <main className="flex-1 p-8 lg:p-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.filter(s => s !== 'hero').map((sec, i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: colors.surface, border: `1px solid ${accentColor}20` }}>
              <EditableImage sectionKey={sec} defaultUrl={images[(i + 1) % images.length]} className="h-48 bg-gray-100" />
              <div className="p-6">
                <div className="w-8 h-1 mb-4 rounded-full" style={{ backgroundColor: accentColor }} />
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: fonts.heading, color: colors.text }}>{SECTION_KR[sec] ?? sec}</h3>
                <p className="opacity-70 text-sm" style={{ color: colors.text }}>
                  그리드 레이아웃의 카드 컴포넌트입니다. 이미지가 상단에 위치하고 깔끔한 텍스트가 이어집니다.
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. OVERLAY LAYOUT (모던 스페셜티, 온라인 강좌 등)
// ─────────────────────────────────────────────
function OverlayLayout({ template, accentColor, bizName, bizDesc, sections, images }: LayoutProps) {
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
          <span className="text-2xl font-black tracking-tighter" style={{ fontFamily: fonts.heading, color: accentColor }}>
            {bizName.toUpperCase()}
          </span>
          <div className="w-8 h-8 rounded-full border border-white/20 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="w-4 h-0.5 bg-white rounded-full" />
            <div className="w-4 h-0.5 bg-white rounded-full" />
          </div>
        </nav>

        <header className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-20">
          <div className="w-16 h-1 mb-8" style={{ backgroundColor: accentColor }} />
          <h1 className="text-5xl lg:text-7xl font-light leading-tight mb-6" style={{ fontFamily: fonts.heading }}>
            {bizDesc.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "font-bold" : ""}>{word} </span>
            ))}
          </h1>
          <p className="text-xl max-w-2xl opacity-70 mb-12 leading-relaxed">
            모던하고 세련된 풀스크린 오버레이 디자인입니다. 영상이나 고품질 화보 이미지를 배경으로 두고, 여백을 살려 고급스러운 분위기를 연출합니다.
          </p>
          <div className="flex items-center gap-6">
            <button className="px-10 py-4 rounded-full font-bold text-lg transition-colors"
              style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
              알아보기
            </button>
            <span className="uppercase tracking-widest text-sm opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
              Scroll Down ↓
            </span>
          </div>
        </header>

        <div className="px-8 lg:px-24 py-20 bg-black/60 backdrop-blur-md border-t border-white/10 mt-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {sections.slice(1, 4).map((sec, i) => (
              <div key={i} className="group cursor-pointer">
                <span className="text-sm font-bold opacity-50 mb-2 block" style={{ color: accentColor }}>0{i + 1}</span>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[var(--accent)] transition-colors" style={{ '--accent': accentColor } as any}>
                  {SECTION_KR[sec] ?? sec}
                </h3>
                <p className="opacity-60 leading-relaxed text-sm">강렬한 대비와 세련된 타이포그래피로 시선을 사로잡는 섹션입니다.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. FINE DINING LAYOUT (파인다이닝 전용)
// ─────────────────────────────────────────────
function FineDiningLayout({ template, accentColor, bizName, bizDesc, sections, images }: LayoutProps) {
  const { colors, fonts } = template;
  return (
    <div className="min-h-full w-full flex flex-col" style={{ backgroundColor: colors.bg, fontFamily: fonts.body, color: colors.text }}>
      <nav className="flex justify-center p-8 border-b" style={{ borderColor: `${accentColor}30` }}>
        <h1 className="text-3xl font-bold tracking-widest" style={{ fontFamily: fonts.heading, color: accentColor }}>{bizName}</h1>
      </nav>
      
      {/* Signature Dish Hero */}
      <header className="relative h-[70vh] flex items-center justify-center text-center">
        <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        <div className="relative z-10 max-w-3xl p-8">
          <p className="text-sm tracking-[0.3em] mb-4 uppercase" style={{ color: accentColor }}>Signature Experience</p>
          <h2 className="text-5xl md:text-6xl font-light mb-8 text-white" style={{ fontFamily: fonts.heading }}>{bizDesc}</h2>
          <button className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors">
            예약하기
          </button>
        </div>
      </header>

      {/* Course Menu Section */}
      <section className="py-24 px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4" style={{ fontFamily: fonts.heading }}>Tasting Menu</h3>
          <div className="w-12 h-0.5 mx-auto" style={{ backgroundColor: accentColor }} />
        </div>
        
        <div className="grid md:grid-cols-2 gap-16">
          {/* Lunch Course */}
          <div className="p-10 border shadow-lg" style={{ borderColor: `${accentColor}40`, backgroundColor: colors.surface }}>
            <h4 className="text-2xl font-bold mb-8 text-center" style={{ color: accentColor }}>Lunch Course</h4>
            <div className="space-y-6">
              {[
                { name: "Amuse-Bouche", desc: "제철 식재료를 활용한 세 가지 한입 거리" },
                { name: "Appetizer", desc: "캐비어를 곁들인 단새우 타르타르" },
                { name: "Main", desc: "최상급 한우 채끝 스테이크와 트러플 매쉬" },
                { name: "Dessert", desc: "바닐라 빈 몽블랑과 계절 과일" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline border-b pb-4" style={{ borderColor: `${accentColor}20` }}>
                  <div>
                    <p className="text-lg font-bold">{item.name}</p>
                    <p className="text-sm opacity-60 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-2xl font-bold mt-10" style={{ fontFamily: fonts.heading }}>120,000 KRW</p>
          </div>

          {/* Dinner Course */}
          <div className="p-10 border shadow-lg" style={{ borderColor: `${accentColor}40`, backgroundColor: colors.surface }}>
            <h4 className="text-2xl font-bold mb-8 text-center" style={{ color: accentColor }}>Dinner Course</h4>
            <div className="space-y-6">
              {[
                { name: "Amuse-Bouche", desc: "다섯 가지 시그니처 아뮤즈 부쉬" },
                { name: "Seafood", desc: "숯불에 구운 랍스터와 뵈르블랑 소스" },
                { name: "Main", desc: "드라이에이징 한우 안심과 포트와인 쥬" },
                { name: "Dessert", desc: "시그니처 초콜릿 텍스처" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline border-b pb-4" style={{ borderColor: `${accentColor}20` }}>
                  <div>
                    <p className="text-lg font-bold">{item.name}</p>
                    <p className="text-sm opacity-60 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-2xl font-bold mt-10" style={{ fontFamily: fonts.heading }}>250,000 KRW</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. CASUAL DINING LAYOUT (캐주얼 다이닝 전용)
// ─────────────────────────────────────────────
function CasualLayout({ template, accentColor, bizName, bizDesc, sections, images }: LayoutProps) {
  const { colors, fonts } = template;
  return (
    <div className="min-h-full w-full flex flex-col" style={{ backgroundColor: colors.bg, fontFamily: fonts.body, color: colors.text }}>
      {/* Friendly Nav */}
      <nav className="flex justify-between items-center px-6 py-4 sticky top-0 z-20 shadow-sm border-b" style={{ backgroundColor: colors.surface, borderColor: `${accentColor}20` }}>
        <h1 className="text-2xl font-black" style={{ fontFamily: fonts.heading, color: colors.primary }}>{bizName}</h1>
        <button className="px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity" style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>
          웨이팅 등록
        </button>
      </nav>

      {/* Vibrant Hero */}
      <header className="p-6 md:p-12">
        <div className="rounded-3xl overflow-hidden relative h-[50vh] flex items-center p-8 md:p-16 shadow-lg bg-cover bg-center" style={{ backgroundColor: colors.primary }}>
          <div className="relative z-10 max-w-xl text-white">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-wider" style={{ backgroundColor: accentColor, color: isDark(accentColor) ? "#FFF" : "#000" }}>NEW OPEN</span>
            <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">{bizDesc}</h2>
            <p className="text-lg opacity-90 mb-8 font-medium">맛있는 음식과 신나는 분위기! {bizName}에서 즐거운 시간을 보내세요.</p>
          </div>
          <EditableImage sectionKey="hero" defaultUrl={images[0]} className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 mix-blend-overlay hidden md:block" />
        </div>
      </header>

      {/* Photo Menu Board */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-3xl font-black" style={{ color: colors.primary }}>대표 메뉴</h3>
            <p className="opacity-60 mt-2 text-lg">매일 아침 신선한 재료로 준비합니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white pb-4 border border-black/5 group cursor-pointer">
              <div className="h-48 bg-gray-100 relative">
                <EditableImage sectionKey={`menu-${i}`} defaultUrl={images[i % images.length]} className="w-full h-full" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded text-xs font-bold shadow z-10" style={{ color: accentColor }}>
                  HIT
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold">시그니처 메뉴 {i}</h4>
                  <span className="font-black text-lg" style={{ color: accentColor }}>15.0</span>
                </div>
                <p className="text-sm opacity-60 leading-relaxed">바삭하게 튀겨낸 베스트셀러 요리입니다. 맥주와 함께 즐겨보세요.</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
