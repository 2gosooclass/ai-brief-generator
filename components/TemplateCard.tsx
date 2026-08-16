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
  amber: "bg-amber-100 text-amber-900 border-amber-300",
  blue: "bg-blue-100 text-blue-900 border-blue-300",
  purple: "bg-purple-100 text-purple-900 border-purple-300",
  orange: "bg-orange-100 text-orange-900 border-orange-300",
  pink: "bg-pink-100 text-pink-900 border-pink-300",
  yellow: "bg-yellow-100 text-yellow-900 border-yellow-300",
  green: "bg-green-100 text-green-900 border-green-300",
  cyan: "bg-cyan-100 text-cyan-900 border-cyan-300",
};

export default function TemplateCard({ template, index }: TemplateCardProps) {
  const { selectedTemplate, selectTemplate } = useBriefStore();
  const isSelected = selectedTemplate?.id === template.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={() => selectTemplate(template)}
      className={`template-card cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 font-pretendard text-left ${
        isSelected
          ? "border-[#111827] bg-white shadow-xl ring-2 ring-black/10 scale-[1.01]"
          : "border-[#E5E7EB] bg-white hover:border-[#111827]/60 hover:shadow-lg"
      }`}
    >
      {/* 미니 목업 영역 */}
      <div className="relative h-56 bg-[#F3F4F6] p-3.5">
        <MiniMockup template={template} />

        {/* 배지 */}
        {template.badge && (
          <div
            className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold border font-pretendard z-10 shadow-sm ${
              (template.badgeColor && BADGE_STYLES[template.badgeColor]) ?? "bg-gray-100 text-gray-900 border-gray-300"
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
            className="absolute top-4 left-4 w-7 h-7 rounded-full bg-[#111827] flex items-center justify-center z-10 shadow"
          >
            <svg
              className="w-4 h-4 text-white"
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
      <div className="p-5 space-y-3">
        {/* 컬러 스와치 */}
        <div className="flex gap-2">
          {Object.values(template.colors)
            .slice(0, 5)
            .map((color, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-black/10"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
        </div>

        <div>
          <h3 className="font-serif-kr text-base sm:text-lg font-bold text-[#111827] leading-tight mb-1">
            {template.name}
          </h3>
          <p className="font-pretendard text-xs sm:text-[13px] font-medium text-[#4B5563] leading-relaxed">
            {template.tagline}
          </p>
        </div>

        {/* 폰트 & 섹션 정보 */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6] text-xs font-semibold text-[#4B5563]">
          <span>{template.fonts.heading}</span>
          <span className="text-[#111827] font-bold">{template.sections.length}개 섹션</span>
        </div>

        {/* 선택 버튼 */}
        <div className="pt-1">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className={`w-full py-2.5 rounded-xl font-pretendard text-xs sm:text-sm font-bold tracking-wider transition-all duration-200 uppercase cursor-pointer shadow-sm ${
              isSelected
                ? "bg-[#111827] text-white"
                : "bg-[#F3F4F6] text-[#1F2937] hover:bg-[#E5E7EB] hover:text-black"
            }`}
          >
            {isSelected ? "✓ 선택 완료" : "템플릿 선택"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
