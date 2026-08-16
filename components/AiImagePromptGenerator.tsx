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
    <div className="space-y-4 pt-1 text-left">
      {/* ── 안내 배너 ── */}
      <div className="bg-[#FAF8F5] border border-[#EBE3D8] rounded-xl p-3">
        <p className="text-[11px] font-pretendard text-[#5C4A3A] leading-relaxed">
          📐 <span className="font-semibold text-[#1C1410]">생성형 AI 전용 규격 & 프롬프트 생성기</span>입니다. 아래에서 비율을 선택하고 추가 키워드를 입력하면 생성 프롬프트가 즉시 만들어집니다.
        </p>
      </div>

      {/* ── 1. 이미지 비율 및 규격 선택기 ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-pretendard font-semibold text-[#1C1410] flex items-center gap-1.5">
            <span>📏</span> 이미지 규격 / 종횡비 선택
          </label>
          <span className="text-[9px] font-mono text-cyan-600 bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded">
            선택: {selectedRatio.ratio}
          </span>
        </div>

        {/* 비율 선택 버튼 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {RATIO_OPTIONS.map((opt) => {
            const isSelected = selectedRatio.id === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedRatio(opt)}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#1C1410] border-[#1C1410] text-white shadow-md scale-[1.01]"
                    : "bg-white border-[#E0D8D0] text-[#4A3B2C] hover:bg-[#F8F5F0]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-pretendard font-bold flex items-center gap-1">
                    {opt.icon} {opt.ratio}
                  </span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? "bg-white/20 text-cyan-300" : "bg-black/5 text-[#8C7A6A]"
                  }`}>
                    {opt.arParam}
                  </span>
                </div>
                <p className={`text-[10px] font-pretendard truncate ${isSelected ? "text-gray-200" : "text-[#7A6A5A]"}`}>
                  {opt.label}
                </p>
                <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-between text-[8.5px] font-mono opacity-80">
                  <span>추천: {opt.resolution}</span>
                  <span className="opacity-75">DALL-E: {opt.dalleSize}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 현재 선택된 규격 상세 가이드 뱃지 */}
        <div className="p-2.5 rounded-xl bg-white border border-[#E8E0D8] flex items-center justify-between text-[10px] font-pretendard">
          <div className="space-y-0.5">
            <p className="font-semibold text-[#1C1410]">적용 대상: {selectedRatio.usage}</p>
            <p className="text-[#8C7A6A] font-mono text-[9.5px]">
              권장 생성 사이즈: <strong>{selectedRatio.resolution}</strong> (DALL-E 3: <strong>{selectedRatio.dalleSize}</strong>)
            </p>
          </div>
          <span className="px-2 py-1 bg-green-50 text-green-700 font-mono font-bold rounded-md border border-green-200 shrink-0 text-[10px]">
            {selectedRatio.arParam}
          </span>
        </div>
      </div>

      {/* ── 2. 연출 키워드 튜닝 ── */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-pretendard font-medium text-[#8C7A6A] block">
          추가 연출 키워드 (선택 입력)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="예: 따뜻한 커피 김, 빗방울 맺힌 창가, 옥상 테라스"
            value={userInputs.imagePromptKeyword}
            onChange={(e) => setUserInput("imagePromptKeyword", e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/40 placeholder:text-[#C0B8B0]"
          />
          <button
            type="button"
            onClick={handleGenerateClick}
            className="px-3 py-2 bg-[#C8A97E] hover:bg-[#B8986D] text-white font-pretendard font-bold text-xs rounded-lg transition-all cursor-pointer shrink-0"
          >
            {justGenerated ? "✓ 갱신됨" : "✨ 프롬프트 갱신"}
          </button>
        </div>
        
        {/* 퀵 프리셋 태그 */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {PRESET_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleAddTag(tag)}
              className="text-[9px] font-pretendard px-2 py-0.5 rounded-full border border-[#E0D8D0] bg-white hover:bg-[#F5F0EA] text-[#5C4A3A] transition-colors cursor-pointer"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. 미드저니 / DALL-E 3 프롬프트 카드 ── */}
      <div className={`bg-white rounded-xl border border-[#E8E0D8] p-3 space-y-2 transition-all duration-300 ${
        justGenerated ? "ring-2 ring-[#C8A97E]/50 bg-amber-50/20" : ""
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-pretendard font-semibold text-[#1C1410] flex items-center gap-1">
            🎨 Midjourney / DALL-E 3 ({selectedRatio.ratio} 규격)
          </span>
          <button
            type="button"
            onClick={() => handleCopyText(midjourneyPrompt, "image")}
            className="text-[10px] font-pretendard px-2.5 py-1 rounded-md bg-[#1C1410] text-white hover:bg-[#2C2118] transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copied === "image" ? "✓ 복사 완료" : "📋 프롬프트 복사"}
          </button>
        </div>
        <p className="text-[10px] font-mono text-[#5C4A3A] bg-[#FAFAF7] p-2.5 rounded-lg border border-[#EFECE8] leading-relaxed select-all">
          {midjourneyPrompt}
        </p>
      </div>

      {/* ── 4. 비디오 생성 프롬프트 카드 ── */}
      <div className="bg-white rounded-xl border border-[#E8E0D8] p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-pretendard font-semibold text-[#1C1410] flex items-center gap-1">
            🎬 Runway / Luma 비디오 프롬프트 (16:9 4K)
          </span>
          <button
            type="button"
            onClick={() => handleCopyText(videoPrompt, "video")}
            className="text-[10px] font-pretendard px-2.5 py-1 rounded-md bg-[#1C1410] text-white hover:bg-[#2C2118] transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copied === "video" ? "✓ 복사 완료" : "📋 비디오 프롬프트 복사"}
          </button>
        </div>
        <p className="text-[10px] font-mono text-[#5C4A3A] bg-[#FAFAF7] p-2.5 rounded-lg border border-[#EFECE8] leading-relaxed select-all">
          {videoPrompt}
        </p>
      </div>
    </div>
  );
}
