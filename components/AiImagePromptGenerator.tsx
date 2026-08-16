"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBriefStore } from "@/store/briefStore";

const PRESET_TAGS = [
  "Golden Hour Sunlight",
  "Minimalist Architecture",
  "Moody Cinema Lighting",
  "Cyber Neon Glow",
  "Editorial Magazine Style",
  "Luxury Natural Texture",
];

export default function AiImagePromptGenerator() {
  const { selectedTemplate, userInputs, setUserInput } = useBriefStore();
  const [copied, setCopied] = useState<string | null>(null);

  if (!selectedTemplate) return null;

  const baseKeyword = selectedTemplate.unsplashKeyword || "modern architecture";
  const baseStyle = selectedTemplate.referenceStyle || "clean and minimal";
  const userKeyword = userInputs.imagePromptKeyword.trim();

  // 미드저니/DALL-E 프롬프트 조립
  const midjourneyPrompt = `A high-end cinematic editorial photograph of ${baseKeyword}${
    userKeyword ? `, ${userKeyword}` : ""
  }, ${baseStyle} aesthetic, sophisticated lighting and composition, shot on 35mm lens, 8k resolution, photorealistic, elegant atmosphere --ar 16:9 --v 6.0`;

  // 런웨이/루마 동영상 프롬프트 조립
  const videoPrompt = `Slow cinematic drone gliding shot of ${baseKeyword}${
    userKeyword ? `, ${userKeyword}` : ""
  }, soft natural sunlight, ${baseStyle} atmosphere, 4k ultra realistic, smooth fluid camera motion, 24fps`;

  const handleCopyText = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleAddTag = (tag: string) => {
    const current = userInputs.imagePromptKeyword;
    if (current.includes(tag)) return;
    const updated = current ? `${current}, ${tag}` : tag;
    setUserInput("imagePromptKeyword", updated);
  };

  return (
    <div className="space-y-3.5 pt-1">
      {/* 안내 */}
      <div className="bg-[#FAF8F5] border border-[#EBE3D8] rounded-xl p-3">
        <p className="text-[11px] font-pretendard text-[#5C4A3A] leading-relaxed">
          ✨ 선택하신 템플릿 분위기에 맞춘 <span className="font-semibold text-[#1C1410]">AI 이미지/비디오 생성 프롬프트</span>입니다. 미드저니, DALL-E, 런웨이 등에 바로 입력할 수 있습니다.
        </p>
      </div>

      {/* 키워드 커스텀 입력 */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-pretendard font-medium text-[#8C7A6A] block">
          추가 연출 키워드 (선택 입력)
        </label>
        <input
          type="text"
          placeholder="예: 따뜻한 커피 김, 빗방울 맺힌 창가, 옥상 테라스"
          value={userInputs.imagePromptKeyword}
          onChange={(e) => setUserInput("imagePromptKeyword", e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="w-full px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/40 placeholder:text-[#C0B8B0]"
        />
        
        {/* 퀵 프리셋 태그 */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {PRESET_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleAddTag(tag)}
              className="text-[9px] font-pretendard px-2 py-0.5 rounded-full border border-[#E0D8D0] bg-white hover:bg-[#F5F0EA] text-[#5C4A3A] transition-colors"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 1. 이미지 생성 프롬프트 카드 */}
      <div className="bg-white rounded-xl border border-[#E8E0D8] p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-pretendard font-semibold text-[#1C1410] flex items-center gap-1">
            🎨 Midjourney / DALL-E 3 프롬프트
          </span>
          <button
            type="button"
            onClick={() => handleCopyText(midjourneyPrompt, "image")}
            className="text-[10px] font-pretendard px-2 py-1 rounded-md bg-[#1C1410] text-white hover:bg-[#2C2118] transition-colors flex items-center gap-1"
          >
            {copied === "image" ? "✓ 복사됨" : "📋 복사"}
          </button>
        </div>
        <p className="text-[10px] font-mono text-[#5C4A3A] bg-[#FAFAF7] p-2 rounded-lg border border-[#EFECE8] leading-relaxed select-all">
          {midjourneyPrompt}
        </p>
      </div>

      {/* 2. 비디오 생성 프롬프트 카드 */}
      <div className="bg-white rounded-xl border border-[#E8E0D8] p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-pretendard font-semibold text-[#1C1410] flex items-center gap-1">
            🎬 Runway / Luma 비디오 프롬프트
          </span>
          <button
            type="button"
            onClick={() => handleCopyText(videoPrompt, "video")}
            className="text-[10px] font-pretendard px-2 py-1 rounded-md bg-[#1C1410] text-white hover:bg-[#2C2118] transition-colors flex items-center gap-1"
          >
            {copied === "video" ? "✓ 복사됨" : "📋 복사"}
          </button>
        </div>
        <p className="text-[10px] font-mono text-[#5C4A3A] bg-[#FAFAF7] p-2 rounded-lg border border-[#EFECE8] leading-relaxed select-all">
          {videoPrompt}
        </p>
      </div>
    </div>
  );
}
