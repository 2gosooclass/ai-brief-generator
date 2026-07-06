"use client";

import type { Template } from "@/lib/types";

interface Props {
  template: Template;
}

// YIQ 기반 다크/라이트 판정
function isDark(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

const SECTION_KR: Record<string, string> = {
  hero: "히어로", about: "소개", menu: "메뉴", gallery: "갤러리",
  location: "위치", instagram: "인스타", story: "스토리", events: "이벤트",
  contact: "문의", features: "특징", curriculum: "커리큘럼", teachers: "강사",
  results: "성과", schedule: "시간표", classes: "클래스", instructors: "강사진",
  testimonials: "후기", pricing: "수강료", enroll: "신청", courses: "강좌",
  demo: "체험", faq: "FAQ", cta: "CTA", works: "포트폴리오", process: "프로세스",
  skills: "스킬", services: "서비스", booking: "예약", links: "링크",
  "latest-content": "콘텐츠", shop: "쇼핑", newsletter: "뉴스레터",
  philosophy: "철학", barista: "바리스타", reservations: "예약",
};

// ─────────────────────────────────────────────
// VARIANT A: CLASSIC
// 상단 네비 + 대형 히어로(전체 폭) + 섹션 세로 리스트
// ─────────────────────────────────────────────
function ClassicLayout({ template }: Props) {
  const { colors, fonts, sections, tagline, name } = template;
  const heroDark = isDark(colors.primary);
  const heroText = heroDark ? "#FFFFFF" : "#111111";
  const heroSub = heroDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)";
  const ctaText = isDark(colors.accent) ? "#FFFFFF" : "#111111";
  const navBgDark = isDark(colors.surface ?? colors.bg);
  const navText = navBgDark ? "rgba(255,255,255,0.8)" : colors.primary;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden flex flex-col"
      style={{ backgroundColor: colors.bg, fontFamily: fonts.body }}>

      {/* Nav */}
      <div className="flex items-center justify-between px-3 py-1.5 shrink-0"
        style={{ backgroundColor: colors.surface ?? colors.bg }}>
        <span className="text-[6px] font-bold tracking-widest uppercase"
          style={{ fontFamily: fonts.heading, color: navText }}>
          {name.slice(0, 7)}
        </span>
        <div className="flex gap-2">
          {["메뉴", "소개", "문의"].map(i => (
            <span key={i} className="text-[4.5px]" style={{ color: navText, opacity: 0.6 }}>{i}</span>
          ))}
        </div>
      </div>

      {/* Hero — full-width, tall */}
      <div className="relative px-4 py-5 flex flex-col justify-center shrink-0"
        style={{ backgroundColor: colors.primary, minHeight: "80px" }}>
        {/* 배경 장식 원 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full opacity-10"
          style={{ backgroundColor: colors.accent }} />
        <p className="text-[10px] font-bold leading-tight mb-1 relative z-10"
          style={{ fontFamily: fonts.heading, color: heroText }}>
          {tagline.length > 14 ? tagline.slice(0, 13) + "…" : tagline}
        </p>
        <p className="text-[5.5px] mb-2.5 relative z-10" style={{ color: heroSub }}>{name}</p>
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[4.5px] font-bold w-fit relative z-10"
          style={{ backgroundColor: colors.accent, color: ctaText }}>
          시작하기 <span>→</span>
        </div>
      </div>

      {/* Section list — vertical rows */}
      <div className="flex-1 px-2.5 py-2 space-y-1 overflow-hidden">
        {sections.slice(1, 5).map((sec, i) => (
          <div key={sec} className="flex items-center gap-2 px-2 py-1 rounded"
            style={{ backgroundColor: i === 0 ? `${colors.accent}22` : `${colors.primary}0A` }}>
            <div className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: i === 0 ? colors.accent : colors.secondary }} />
            <span className="text-[5.5px] font-medium" style={{ color: colors.text }}>
              {SECTION_KR[sec] ?? sec}
            </span>
            {i === 0 && (
              <div className="ml-auto w-4 h-0.5 rounded-full"
                style={{ backgroundColor: `${colors.accent}60` }} />
            )}
          </div>
        ))}
      </div>

      {/* Footer pill */}
      <div className="px-2.5 py-1.5 flex items-center justify-between shrink-0"
        style={{ backgroundColor: `${colors.primary}E0` }}>
        <span className="text-[4.5px]" style={{ color: heroSub }}>{sections.length}개 섹션</span>
        <div className="flex gap-0.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1 h-1 rounded-full"
              style={{ backgroundColor: i === 0 ? colors.accent : `${colors.accent}40` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VARIANT B: SIDEBAR
// 얇은 네비 + 좌우 분할 히어로 (텍스트|이미지 플레이스홀더) + 2열 카드 그리드
// ─────────────────────────────────────────────
function SidebarLayout({ template }: Props) {
  const { colors, fonts, sections, tagline, name } = template;
  const heroDark = isDark(colors.primary);
  const heroText = heroDark ? "#FFFFFF" : "#111111";
  const heroSub = heroDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)";
  const ctaText = isDark(colors.accent) ? "#FFFFFF" : "#111111";
  const bgDark = isDark(colors.bg);
  const bodyText = bgDark ? "rgba(255,255,255,0.8)" : colors.text;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden flex flex-col"
      style={{ backgroundColor: colors.bg, fontFamily: fonts.body }}>

      {/* Thin nav */}
      <div className="flex items-center justify-between px-3 py-1 shrink-0"
        style={{ backgroundColor: colors.surface ?? colors.bg, borderBottom: `1px solid ${colors.accent}30` }}>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors.accent }} />
          <span className="text-[5.5px] font-bold" style={{ fontFamily: fonts.heading, color: colors.primary, opacity: isDark(colors.bg) ? 1 : undefined }}>
            {name.slice(0, 6)}
          </span>
        </div>
        <div className="w-5 h-[1.5px] rounded-full" style={{ backgroundColor: `${colors.primary}40` }} />
      </div>

      {/* Split hero: left text | right photo placeholder */}
      <div className="flex shrink-0" style={{ backgroundColor: colors.primary, minHeight: "72px" }}>
        {/* Left: Text */}
        <div className="flex-1 px-3 py-3 flex flex-col justify-center">
          <p className="text-[9px] font-bold leading-tight mb-1"
            style={{ fontFamily: fonts.heading, color: heroText }}>
            {tagline.length > 11 ? tagline.slice(0, 10) + "…" : tagline}
          </p>
          <p className="text-[5px] mb-2" style={{ color: heroSub }}>{name}</p>
          <div className="px-1.5 py-0.5 rounded text-[4px] font-bold w-fit"
            style={{ backgroundColor: colors.accent, color: ctaText }}>
            알아보기
          </div>
        </div>

        {/* Right: faux image placeholder */}
        <div className="w-16 relative shrink-0 overflow-hidden"
          style={{ backgroundColor: `${colors.accent}25` }}>
          {/* 이미지 스타일 줄무늬 */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="w-full h-1/2 opacity-30"
              style={{ background: `linear-gradient(to top, ${colors.accent}, transparent)` }} />
          </div>
          {/* 모서리 아이콘 */}
          <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full border"
            style={{ borderColor: `${colors.accent}80` }}>
            <div className="absolute inset-0.5 rounded-full"
              style={{ backgroundColor: `${colors.accent}60` }} />
          </div>
          <div className="absolute bottom-1 left-1">
            <div className="w-5 h-0.5 rounded-full mb-0.5" style={{ backgroundColor: `${colors.accent}70` }} />
            <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: `${colors.accent}40` }} />
          </div>
        </div>
      </div>

      {/* 2-column card grid */}
      <div className="flex-1 p-2 grid grid-cols-2 gap-1.5 content-start overflow-hidden">
        {sections.slice(1, 5).map((sec, i) => (
          <div key={sec} className="rounded px-2 py-1.5"
            style={{
              backgroundColor: i % 2 === 0 ? `${colors.accent}18` : colors.surface ?? `${colors.primary}0C`,
              border: `1px solid ${colors.accent}20`,
            }}>
            <div className="w-2.5 h-2.5 rounded-sm mb-0.5"
              style={{ backgroundColor: i === 0 ? colors.accent : `${colors.secondary}50` }} />
            <p className="text-[5px] font-medium leading-tight" style={{ color: bodyText }}>
              {SECTION_KR[sec] ?? sec}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center gap-1 px-2.5 py-1 shrink-0"
        style={{ backgroundColor: colors.surface ?? `${colors.primary}15` }}>
        <div className="flex gap-0.5 flex-1">
          {sections.slice(4).map((sec) => (
            <span key={sec} className="text-[4px] px-1 py-0.5 rounded-full"
              style={{ backgroundColor: `${colors.accent}20`, color: colors.secondary }}>
              {SECTION_KR[sec] ?? sec}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VARIANT C: MAGAZINE
// 네비 일체형 대형 히어로(그라디언트 오버레이) + 수평 섹션 칩 + 피처 카드
// ─────────────────────────────────────────────
function MagazineLayout({ template }: Props) {
  const { colors, fonts, sections, tagline, name } = template;
  const bgDark = isDark(colors.bg);
  const heroTextColor = "#FFFFFF";
  const ctaText = isDark(colors.accent) ? "#FFFFFF" : "#111111";
  const chipBg = bgDark ? "rgba(255,255,255,0.10)" : `${colors.primary}12`;
  const chipText = bgDark ? "rgba(255,255,255,0.70)" : colors.primary;
  const featureBg = bgDark ? colors.surface ?? "#1E1A18" : colors.surface ?? "#F5F0EA";
  const featureText = bgDark ? "rgba(255,255,255,0.85)" : colors.text;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden flex flex-col"
      style={{ backgroundColor: colors.bg, fontFamily: fonts.body }}>

      {/* Full-bleed hero with integrated nav */}
      <div className="relative shrink-0 px-3 pt-2 pb-4 flex flex-col"
        style={{
          background: `linear-gradient(145deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          minHeight: "88px",
        }}>
        {/* Integrated nav row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[5.5px] font-bold tracking-widest uppercase opacity-70"
            style={{ fontFamily: fonts.heading, color: heroTextColor }}>
            {name.slice(0, 7)}
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.accent }} />
            <div className="w-1 h-1 rounded-full opacity-40" style={{ backgroundColor: colors.accent }} />
            <div className="w-1 h-1 rounded-full opacity-40" style={{ backgroundColor: colors.accent }} />
          </div>
        </div>

        {/* Accent decorative line */}
        <div className="w-5 h-0.5 rounded-full mb-1.5" style={{ backgroundColor: colors.accent }} />

        {/* Headline */}
        <p className="text-[11px] font-black leading-tight mb-1"
          style={{ fontFamily: fonts.heading, color: heroTextColor, letterSpacing: "-0.02em" }}>
          {tagline.length > 12 ? tagline.slice(0, 11) + "…" : tagline}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[4.5px] opacity-60" style={{ color: heroTextColor }}>{name}</p>
          <div className="flex-1 h-px opacity-20" style={{ backgroundColor: heroTextColor }} />
          <div className="px-2 py-0.5 rounded-full text-[4.5px] font-bold"
            style={{ backgroundColor: colors.accent, color: ctaText }}>
            시작 →
          </div>
        </div>

        {/* Decorative bottom-right shape */}
        <div className="absolute bottom-0 right-0 w-12 h-12 opacity-10"
          style={{
            background: `radial-gradient(circle at 100% 100%, ${colors.accent}, transparent)`,
          }} />
      </div>

      {/* Horizontal section chips */}
      <div className="flex gap-1 px-2 py-1.5 overflow-hidden shrink-0"
        style={{ borderBottom: `1px solid ${colors.accent}25` }}>
        {sections.slice(0, 5).map((sec, i) => (
          <div key={sec}
            className="flex-shrink-0 px-1.5 py-0.5 rounded-full text-[4px] font-medium"
            style={{
              backgroundColor: i === 1 ? colors.accent : chipBg,
              color: i === 1 ? ctaText : chipText,
            }}>
            {SECTION_KR[sec] ?? sec}
          </div>
        ))}
      </div>

      {/* Feature card */}
      <div className="flex-1 p-2 flex flex-col gap-1.5 overflow-hidden">
        {/* Main feature */}
        <div className="rounded-lg px-3 py-2 flex items-center gap-2"
          style={{ backgroundColor: featureBg }}>
          <div className="w-4 h-4 rounded-md shrink-0 flex items-center justify-center"
            style={{ backgroundColor: colors.accent }}>
            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
          </div>
          <div>
            <p className="text-[5.5px] font-semibold" style={{ color: featureText }}>
              {SECTION_KR[sections[2]] ?? sections[2]}
            </p>
            <p className="text-[4px] opacity-50" style={{ color: featureText }}>주요 콘텐츠</p>
          </div>
          <div className="ml-auto">
            <div className="text-[4px] opacity-40" style={{ color: featureText }}>↗</div>
          </div>
        </div>

        {/* Secondary row */}
        <div className="flex gap-1.5">
          {sections.slice(3, 5).map((sec) => (
            <div key={sec} className="flex-1 rounded px-2 py-1.5 flex items-center gap-1"
              style={{ backgroundColor: `${colors.accent}15` }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent }} />
              <p className="text-[4.5px] font-medium" style={{ color: featureText }}>
                {SECTION_KR[sec] ?? sec}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DISPATCHER
// ─────────────────────────────────────────────
export default function MiniMockup({ template }: Props) {
  switch (template.mockupVariant) {
    case "sidebar":
      return <SidebarLayout template={template} />;
    case "magazine":
      return <MagazineLayout template={template} />;
    default:
      return <ClassicLayout template={template} />;
  }
}
