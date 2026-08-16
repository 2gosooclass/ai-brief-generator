"use client";

import { useState } from "react";
import { useBriefStore } from "@/store/briefStore";

interface AspectRatioOption {
  id: string;
  label: string;
  ratio: string;
  arParam: string;
  resolution: string;
  dalleSize: string;
  usage: string;
  icon: string;
}

const RATIO_OPTIONS: AspectRatioOption[] = [
  {
    id: "16-9",
    label: "가로 와이드 (PC 히어로)",
    ratio: "16:9",
    arParam: "--ar 16:9",
    resolution: "1920 × 1080 px",
    dalleSize: "1792 × 1024 px",
    usage: "PC 히어로 메인 배경, 와이드 배너",
    icon: "🖥️",
  },
  {
    id: "3-4",
    label: "에디토리얼 세로 (잡지형)",
    ratio: "3:4",
    arParam: "--ar 3:4",
    resolution: "1200 × 1600 px",
    dalleSize: "1024 × 1365 px",
    usage: "세로 에디토리얼 화보, 룩북",
    icon: "📰",
  },
  {
    id: "9-16",
    label: "세로 풀스크린 (모바일)",
    ratio: "9:16",
    arParam: "--ar 9:16",
    resolution: "1080 × 1920 px",
    dalleSize: "1024 × 1792 px",
    usage: "모바일 풀스크린, 숏폼/스토리",
    icon: "📱",
  },
  {
    id: "1-1",
    label: "정사각형 (제품/프로필)",
    ratio: "1:1",
    arParam: "--ar 1:1",
    resolution: "1024 × 1024 px",
    dalleSize: "1024 × 1024 px",
    usage: "제품 썸네일, 인스타그램 피드",
    icon: "📦",
  },
  {
    id: "4-3",
    label: "콘텐츠 카드 (갤러리)",
    ratio: "4:3",
    arParam: "--ar 4:3",
    resolution: "1600 × 1200 px",
    dalleSize: "1365 × 1024 px",
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

  // 미드저니/DALL-E 프롬프트 조립
  const midjourneyPrompt = `A high-end cinematic editorial photograph of ${baseKeyword}${
    userKeyword ? `, ${userKeyword}` : ""
  }, ${baseStyle} aesthetic, sophisticated lighting and composition, shot on 35mm lens, 8k resolution, photorealistic, elegant atmosphere ${selectedRatio.arParam} --v 6.0`;

  // 런웨이/루마 동영상 프롬프트 조립
  const videoPrompt = `Slow cinematic sweeping panning shot of ${baseKeyword}${
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
      {/* ── 안내 배너 (선명하고 큼직한 글씨) ── */}
      <div className="bg-[#FFFDF9] border-2 border-[#E5D7C5] rounded-2xl p-3.5 shadow-sm">
        <p className="text-xs sm:text-[13px] font-medium text-[#2D2218] leading-relaxed">
          📐 <strong className="font-bold text-[#111827]">생성형 AI 전용 규격 & 프롬프트 생성기</strong>
          <span className="block mt-1 text-[#4B5563] text-xs">원하시는 이미지 비율을 누르면 최적 해상도와 파라미터가 자동으로 조립됩니다.</span>
        </p>
      </div>

      {/* ── 1. 이미지 비율 및 규격 선택기 ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-[13px] font-bold text-[#111827] flex items-center gap-1.5">
            <span>📏</span> 이미지 규격 및 종횡비 선택
          </label>
          <span className="text-xs font-bold font-mono text-cyan-800 bg-cyan-100 border border-cyan-300 px-2 py-0.5 rounded-md">
            선택: {selectedRatio.ratio}
          </span>
        </div>

        {/* 비율 선택 버튼 그리드 (큼직하고 뚜렷한 텍스트) */}
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
                    isSelected ? "bg-white/20 text-cyan-300" : "bg-gray-100 text-[#374151]"
                  }`}>
                    {opt.arParam}
                  </span>
                </div>
                <p className={`text-xs font-semibold truncate ${isSelected ? "text-gray-100" : "text-[#374151]"}`}>
                  {opt.label}
                </p>
                <div className="mt-2 pt-1.5 border-t border-black/10 flex items-center justify-between text-[11px] font-mono font-medium">
                  <span className={isSelected ? "text-gray-200" : "text-[#4B5563]"}>추천: {opt.resolution}</span>
                  <span className={isSelected ? "text-cyan-200" : "text-[#1F2937] font-semibold"}>DALL-E: {opt.dalleSize}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 현재 선택된 규격 상세 가이드 뱃지 */}
        <div className="p-3 rounded-2xl bg-white border-2 border-[#E5E7EB] flex items-center justify-between text-xs shadow-sm">
          <div className="space-y-1">
            <p className="font-bold text-[#111827]">적용 대상: {selectedRatio.usage}</p>
            <p className="text-[#374151] font-mono text-[11.5px]">
              권장 생성 사이즈: <strong className="text-black font-bold">{selectedRatio.resolution}</strong> (DALL-E 3: <strong className="text-black font-bold">{selectedRatio.dalleSize}</strong>)
            </p>
          </div>
          <span className="px-2.5 py-1 bg-green-100 text-green-900 font-mono font-bold rounded-lg border border-green-300 shrink-0 text-xs">
            {selectedRatio.arParam}
          </span>
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

      {/* ── 3. 미드저니 / DALL-E 3 프롬프트 카드 ── */}
      <div className={`bg-white rounded-2xl border-2 border-[#E5E7EB] p-4 space-y-2.5 shadow-sm transition-all duration-300 ${
        justGenerated ? "ring-2 ring-amber-400 bg-amber-50/20" : ""
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-[13px] font-bold text-[#111827] flex items-center gap-1.5">
            🎨 Midjourney / DALL-E 3 ({selectedRatio.ratio} 규격)
          </span>
          <button
            type="button"
            onClick={() => handleCopyText(midjourneyPrompt, "image")}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#111827] text-white hover:bg-[#374151] transition-colors flex items-center gap-1 cursor-pointer shadow"
          >
            {copied === "image" ? "✓ 복사 완료" : "📋 프롬프트 복사"}
          </button>
        </div>
        <p className="text-xs sm:text-[12.5px] font-mono font-medium text-[#1F2937] bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB] leading-relaxed select-all">
          {midjourneyPrompt}
        </p>
      </div>

      {/* ── 4. 비디오 생성 프롬프트 카드 ── */}
      <div className="bg-white rounded-2xl border-2 border-[#E5E7EB] p-4 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-[13px] font-bold text-[#111827] flex items-center gap-1.5">
            🎬 Runway / Luma 비디오 프롬프트 (16:9 4K)
          </span>
          <button
            type="button"
            onClick={() => handleCopyText(videoPrompt, "video")}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#111827] text-white hover:bg-[#374151] transition-colors flex items-center gap-1 cursor-pointer shadow"
          >
            {copied === "video" ? "✓ 복사 완료" : "📋 비디오 프롬프트 복사"}
          </button>
        </div>
        <p className="text-xs sm:text-[12.5px] font-mono font-medium text-[#1F2937] bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB] leading-relaxed select-all">
          {videoPrompt}
        </p>
      </div>
    </div>
  );
}
