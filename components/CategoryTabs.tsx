"use client";

import { useBriefStore } from "@/store/briefStore";
import type { CategoryId } from "@/lib/types";

const CATEGORIES: { id: CategoryId; label: string; emoji: string }[] = [
  { id: "cafe", label: "카페·레스토랑", emoji: "☕" },
  { id: "academy", label: "학원·강좌", emoji: "📚" },
  { id: "personal", label: "개인 브랜드", emoji: "✨" },
  { id: "religion", label: "종교·단체", emoji: "🕊️" },
  { id: "traditional", label: "전통공예·스테이", emoji: "🏺" },
];

export default function CategoryTabs() {
  const { selectedCategory, setCategory } = useBriefStore();

  return (
    <div className="flex flex-wrap items-center gap-2 pb-6 border-b-2 border-gray-200 w-full">
      {CATEGORIES.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
              isActive
                ? "bg-[#111827] text-white shadow-md scale-105"
                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-[#111827] hover:bg-gray-50"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
