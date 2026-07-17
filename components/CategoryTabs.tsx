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
    <div className="w-full">
      {/* 탭 버튼 그룹 (수직 정렬) */}
      <div className="flex flex-col gap-2.5 w-full">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 text-left w-full group ${
                isActive
                  ? "border-[#C8A97E] bg-[#FDF8F3]/60 shadow-sm"
                  : "border-[#E8E0D8]/80 bg-white hover:border-[#C8A97E]/50 hover:bg-[#FDF8F3]/30"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 rounded-lg bg-[#FDF8F3]"
                  style={{ zIndex: 0 }}
                />
              )}

              <span className="text-xl relative z-10">{cat.emoji}</span>

              <div className="relative z-10 flex-1 min-w-0">
                <p
                  className={`font-serif-kr text-xs font-semibold leading-tight ${
                    isActive ? "text-[#1C1410]" : "text-[#5C4A3A]"
                  }`}
                >
                  {cat.label}
                </p>
                <p className="font-pretendard text-[10px] text-[#8C7A6A] mt-0.5 leading-tight truncate">
                  {cat.desc}
                </p>
              </div>

              {isActive && (
                <div className="ml-auto relative z-10 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
