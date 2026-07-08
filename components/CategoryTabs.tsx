"use client";

import { useBriefStore } from "@/store/briefStore";
import type { CategoryId } from "@/lib/types";
import { motion } from "framer-motion";

const CATEGORIES: { id: CategoryId; label: string; emoji: string; desc: string }[] = [
  { id: "cafe", label: "카페·레스토랑", emoji: "☕", desc: "감성 카페, 레스토랑, 베이커리" },
  { id: "academy", label: "학원·강좌", emoji: "📚", desc: "학원, 취미 클래스, 온라인 강좌" },
  { id: "personal", label: "개인 브랜드", emoji: "✨", desc: "포트폴리오, 컨설팅, 인플루언서" },
  { id: "religion", label: "종교·단체", emoji: "🕊️", desc: "교회, 비영리단체, 커뮤니티" },
  { id: "traditional", label: "전통공예·매듭", emoji: "🏮", desc: "전통매듭 공방, 국악, 전통 공예 클래스" },
];

export default function CategoryTabs() {
  const { selectedCategory, setCategory } = useBriefStore();

  return (
    <div className="mb-10">
      {/* 단계 표시 */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-full bg-[#C8A97E] flex items-center justify-center text-white text-xs font-bold font-pretendard shrink-0">
          1
        </div>
        <p className="text-sm font-pretendard text-[#5C4A3A]">
          업종 카테고리를 선택하세요
        </p>
      </div>

      {/* 탭 버튼 그룹 */}
      <div className="flex gap-3 flex-wrap">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`relative flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 transition-all duration-300 text-left group ${
                isActive
                  ? "border-[#C8A97E] bg-[#FDF8F3] shadow-md"
                  : "border-[#E5DDD5] bg-white hover:border-[#C8A97E]/60 hover:bg-[#FDF8F3]/50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FDF8F3] to-[#F9F1E8]"
                  style={{ zIndex: 0 }}
                />
              )}

              <span className="text-2xl relative z-10">{cat.emoji}</span>

              <div className="relative z-10">
                <p
                  className={`font-serif-kr text-sm font-medium leading-tight ${
                    isActive ? "text-[#1C1410]" : "text-[#5C4A3A]"
                  }`}
                >
                  {cat.label}
                </p>
                <p className="font-pretendard text-xs text-[#8C7A6A] mt-0.5 leading-tight">
                  {cat.desc}
                </p>
              </div>

              {isActive && (
                <div className="ml-auto relative z-10">
                  <div className="w-2 h-2 rounded-full bg-[#C8A97E]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
