"use client";

import { motion } from "framer-motion";
import type { Template } from "@/lib/types";
import { useBriefStore } from "@/store/briefStore";
import MiniMockup from "./MiniMockup";

interface TemplateCardProps {
  template: Template;
  index: number;
}

const BADGE_STYLES: Record<string, string> = {
  amber: "bg-amber-100 text-amber-800 border-amber-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  pink: "bg-pink-100 text-pink-800 border-pink-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  green: "bg-green-100 text-green-800 border-green-200",
};

export default function TemplateCard({ template, index }: TemplateCardProps) {
  const { selectedTemplate, selectTemplate } = useBriefStore();
  const isSelected = selectedTemplate?.id === template.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={() => selectTemplate(template)}
      className={`template-card cursor-pointer rounded-lg overflow-hidden border transition-all duration-300 ${
        isSelected
          ? "border-[#C8A97E] bg-[#FDF8F3]/10 shadow-md ring-2 ring-[#C8A97E]/5"
          : "border-[#E8E0D8]/80 hover:border-[#C8A97E]/50 hover:shadow-sm"
      }`}
    >
      {/* 미니 목업 영역 */}
      <div className="relative h-52 bg-[#F5F0EA] p-3">
        <MiniMockup template={template} />

        {/* 배지 */}
        {template.badge && template.badgeColor && (
          <div
            className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-bold border font-pretendard z-10 ${
              BADGE_STYLES[template.badgeColor] ?? "bg-gray-100 text-gray-800 border-gray-200"
            }`}
          >
            {template.badge}
          </div>
        )}

        {/* 선택 표시 */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 left-3 w-6 h-6 rounded-full bg-[#C8A97E] flex items-center justify-center z-10"
          >
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        )}
      </div>

      {/* 카드 정보 */}
      <div className="bg-white p-4">
        {/* 컬러 스와치 */}
        <div className="flex gap-1.5 mb-3">
          {Object.values(template.colors)
            .slice(0, 5)
            .map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-white shadow-sm ring-1 ring-black/5"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
        </div>

        <h3 className="font-serif-kr text-base font-semibold text-[#1C1410] leading-tight mb-1">
          {template.name}
        </h3>
        <p className="font-pretendard text-xs text-[#8C7A6A] leading-relaxed mb-3">
          {template.tagline}
        </p>

        {/* 폰트 정보 */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] text-[#A09080] font-pretendard">폰트</span>
          <span className="text-[10px] text-[#5C4A3A] font-pretendard font-medium">
            {template.fonts.heading}
          </span>
        </div>

        {/* 섹션 수 */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#A09080] font-pretendard">
            {template.sections.length}개 섹션
          </span>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className={`text-[11px] px-3 py-1.5 rounded font-pretendard font-semibold tracking-wider transition-colors uppercase ${
              isSelected
                ? "bg-[#1C1410] text-[#FAFAF7]"
                : "bg-[#F5F0EA] text-[#5C4A3A] hover:bg-[#E8D5B7] hover:text-[#1C1410]"
            }`}
          >
            {isSelected ? "Active" : "Select"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
