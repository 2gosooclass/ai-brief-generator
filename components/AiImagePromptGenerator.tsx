"use client";

import { useState } from "react";
import { useBriefStore } from "@/store/briefStore";

interface AspectRatioOption {
  id: string;
  label: string;
  ratio: string;
  resolution: string;
  usage: string;
  icon: string;
}

const RATIO_OPTIONS: AspectRatioOption[] = [
  {
    id: "16-9",
    label: "가로 와이드 (PC 히어로)",
    ratio: "16:9",
    resolution: "1920 × 1080 px",
    usage: "PC 히어로 메인 배경, 와이드 배너",
    icon: "🖥️",
  },
  {
    id: "3-4",
    label: "에디토리얼 세로 (잡지형)",
    ratio: "3:4",
    resolution: "1200 × 1600 px",
    usage: "세로 에디토리얼 화보, 룩북",
    icon: "📰",
  },
  {
    id: "9-16",
    label: "세로 풀스크린 (모바일)",
    ratio: "9:16",
    resolution: "1080 × 1920 px",
    usage: "모바일 풀스크린, 숏폼/스토리",
    icon: "📱",
  },
  {
    id: "1-1",
    label: "정사각형 (제품/프로필)",
    ratio: "1:1",
    resolution: "1024 × 1024 px",
    usage: "제품 썸네일, 인스타그램 피드",
    icon: "📦",
  },
  {
    id: "4-3",
    label: "콘텐츠 카드 (갤러리)",
    ratio: "4:3",
    resolution: "1600 × 1200 px",
    usage: "블로그 카드, 갤러리 그리드",
    icon: "🖼️",
  },
];

const PRESET_TAGS = [
  "Golden Hour Sunlight",
  "Minimalist Architecture",
  "Moody Cinema Lighting",
  "Cyber Neon Glow",
  "Editorial Magazine Style",
  "Luxury Natural Texture",
  "Warm Wood & Plants",
  "Cozy Ambient Blur",
];

export default function AiImagePromptGenerator() {
  const { selectedTemplate, userInputs, setUserInput } = useBriefStore();
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioOption>(RATIO_OPTIONS[0]);
  const [copied, setCopied] = useState<string | null>(null);
  const [justGenerated, setJustGenerated] = useState(false);

  if (!selectedTemplate) return null;

  const baseKeyword = selectedTemplate.unsplashKeyword || "modern architectural space";
  const baseStyle = selectedTemplate.referenceStyle || "clean and minimal";
  const userKeyword = userInputs.imagePromptKeyword.trim();

  // Google Flow 이미지 프롬프트 조립
  const googleFlowImagePrompt = `A high-end cinematic editorial photograph of ${baseKeyword}${
    userKeyword ? `, ${userKeyword}` : ""
  }, ${baseStyle} aesthetic, sophisticated lighting and composition, shot on 35mm lens, 8k resolution, photorealistic, elegant atmosphere, ${selectedRatio.ratio} aspect ratio`;

  // Google Flow 비디오 프롬프트 조립
  const googleFlowVideoPrompt = `Slow cinematic sweeping panning shot of ${baseKeyword}${
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

  const handleGenerateClick = () => {
    setJustGenerated(true);
    setTimeout(() => setJustGenerated(false), 1500);
  };

  const handleAddTag = (tag: string) => {
    const current = userInputs.imagePromptKeyword;
    if (current.includes(tag)) return;
    const updated = current ? `${current}, ${tag}` : tag;
    setUserInput("imagePromptKeyword", updated);
  };

  return (
    <div className="space-y-4 pt-1 text-left font-pretendard">
      {/* ── 1. 규격 및 비율 선택기 ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-[13px] font-bold text-[#111827] flex items-center gap-1.5">
            <span>📏</span> 규격 및 종횡비 선택
          </label>
          <span className="text-xs font-bold font-mono text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
            선택: {selectedRatio.ratio}
          </span>
        </div>

        {/* 비율 선택 버튼 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {RATIO_OPTIONS.map((opt) => {
            const isSelected = selectedRatio.id === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedRatio(opt)}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#111827] border-[#111827] text-white shadow-lg scale-[1.01]"
                    : "bg-white border-[#D1D5DB] text-[#1F2937] hover:border-[#111827] hover:bg-[#F9FAFB]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    {opt.icon} {opt.ratio}
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isSelected ? "bg-white/20 text-amber-300" : "bg-gray-100 text-[#374151]"
                  }`}>
                    {opt.resolution}
                  </span>
                </div>
                <p className={`text-xs font-semibold truncate ${isSelected ? "text-gray-100" : "text-[#374151]"}`}>
                  {opt.label}
                </p>
                <div className="mt-2 pt-1.5 border-t border-black/10 text-[11px] font-medium">
                  <span className={isSelected ? "text-gray-200" : "text-[#4B5563]"}>적용: {opt.usage}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. 연출 키워드 튜닝 ── */}
      <div className="space-y-2">
        <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">
          추가 연출 키워드 (선택 입력)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="예: 따뜻한 커피 김, 빗방울 맺힌 창가, 옥상 테라스"
            value={userInputs.imagePromptKeyword}
            onChange={(e) => setUserInput("imagePromptKeyword", e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl border-2 border-[#D1D5DB] bg-white text-[#111827] focus:outline-none focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/20 placeholder:text-[#9CA3AF]"
          />
          <button
            type="button"
            onClick={handleGenerateClick}
            className="px-4 py-2.5 bg-[#1C1410] hover:bg-[#374151] text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shrink-0 shadow"
          >
            {justGenerated ? "✓ 갱신 완료" : "✨ 프롬프트 갱신"}
          </button>
        </div>
        
        {/* 퀵 프리셋 태그 */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {PRESET_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleAddTag(tag)}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#F3F4F6] text-[#374151] transition-colors cursor-pointer"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Google Flow 이미지 프롬프트 카드 ── */}
      <div className={`bg-white rounded-2xl border-2 border-[#E5E7EB] p-4 space-y-2.5 shadow-sm transition-all duration-300 ${
        justGenerated ? "ring-2 ring-amber-400 bg-amber-50/20" : ""
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-[13px] font-bold text-[#111827] flex items-center gap-1.5">
            🎨 Google Flow Image Prompt ({selectedRatio.ratio})
          </span>
          <button
            type="button"
            onClick={() => handleCopyText(googleFlowImagePrompt, "image")}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#111827] text-white hover:bg-[#374151] transition-colors flex items-center gap-1 cursor-pointer shadow"
          >
            {copied === "image" ? "✓ 복사 완료" : "📋 프롬프트 복사"}
          </button>
        </div>
        <p className="text-xs sm:text-[12.5px] font-mono font-medium text-[#1F2937] bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB] leading-relaxed select-all">
          {googleFlowImagePrompt}
        </p>
      </div>

      {/* ── 4. Google Flow 비디오 프롬프트 카드 ── */}
      <div className="bg-white rounded-2xl border-2 border-[#E5E7EB] p-4 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-[13px] font-bold text-[#111827] flex items-center gap-1.5">
            🎬 Google Flow Video Prompt (16:9 4K)
          </span>
          <button
            type="button"
            onClick={() => handleCopyText(googleFlowVideoPrompt, "video")}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#111827] text-white hover:bg-[#374151] transition-colors flex items-center gap-1 cursor-pointer shadow"
          >
            {copied === "video" ? "✓ 복사 완료" : "📋 비디오 프롬프트 복사"}
          </button>
        </div>
        <p className="text-xs sm:text-[12.5px] font-mono font-medium text-[#1F2937] bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB] leading-relaxed select-all">
          {googleFlowVideoPrompt}
        </p>
      </div>
    </div>
  );
}
