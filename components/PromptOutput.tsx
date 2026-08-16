"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBriefStore } from "@/store/briefStore";
import { buildPrompt } from "@/lib/promptBuilder";

interface PromptOutputProps {
  compact?: boolean;
}

export default function PromptOutput({ compact = false }: PromptOutputProps) {
  const {
    selectedTemplate,
    selectedCategory,
    imageMode,
    uploadedImageUrl,
    selectedStockImages,
    modifyOptions,
    userInputs,
    logoUrl,
    referenceScreenshotUrl,
    navMenus,
  } = useBriefStore();

  const [copied, setCopied] = useState(false);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (!selectedTemplate) return;
    const built = buildPrompt({
      template: selectedTemplate,
      categoryId: selectedCategory,
      imageMode,
      uploadedImageUrl,
      selectedStockImages,
      modifyOptions,
      userInputs,
      logoUrl,
      referenceScreenshotUrl,
      navMenus,
    });
    setPrompt(built);
  }, [
    selectedTemplate,
    selectedCategory,
    imageMode,
    uploadedImageUrl,
    selectedStockImages,
    modifyOptions,
    userInputs,
    logoUrl,
    referenceScreenshotUrl,
    navMenus,
  ]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.getElementById("prompt-text") as HTMLTextAreaElement;
      el?.select();
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const bizName = userInputs.businessName || selectedTemplate?.name || "template";
    const fileName = `${bizName.replace(/\s+/g, "_")}_웹사이트_브리프.md`;
    const blob = new Blob([prompt], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!selectedTemplate) return null;

  return (
    <div className="space-y-3 font-pretendard">
      {/* 안내 배너 */}
      <div className="rounded-2xl border-2 border-[#E5D7C5] px-3.5 py-2.5 bg-[#FFFDF9] shadow-sm">
        <p className="text-xs sm:text-[12.5px] font-medium text-[#2D2218] leading-relaxed">
          💡 이 프롬프트를 복사하여{" "}
          <strong className="font-bold text-[#111827]">Google Flow</strong>
          (구글 플로우 AI 엔지니어링 에이전트)에 바로 전달하세요.
        </p>
      </div>

      {/* 프롬프트 텍스트 영역 (큼직하고 뚜렷한 글씨) */}
      <div className="relative">
        <textarea
          id="prompt-text"
          readOnly
          value={prompt}
          className={`prompt-textarea w-full px-4 py-3 rounded-2xl border-2 border-[#D1D5DB] bg-white text-[#111827] font-mono font-medium resize-none focus:outline-none focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/15 shadow-inner ${
            compact ? "text-xs sm:text-[12.5px] h-40 leading-relaxed" : "text-xs sm:text-[13px] h-80 leading-relaxed"
          }`}
        />
        {/* 글자 수 */}
        <div className="absolute bottom-3 right-3 text-[11px] font-bold text-[#4B5563] bg-white/90 px-2 py-0.5 rounded-md border border-[#E5E7EB] shadow-sm">
          {prompt.length.toLocaleString()}자
        </div>
      </div>

      {/* 복사 및 다운로드 버튼 (시원한 크기와 선명한 폰트) */}
      <div className="flex gap-2.5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-md cursor-pointer ${
            copied
              ? "bg-green-600 text-white"
              : "bg-[#111827] text-white hover:bg-[#374151]"
          }`}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span key="copied"
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                복사 완료!
              </motion.span>
            ) : (
              <motion.span key="copy"
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                브리프 복사
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white border-2 border-[#D1D5DB] text-[#111827] hover:border-[#111827] hover:bg-[#F9FAFB] transition-all duration-200 shadow-sm cursor-pointer"
        >
          <span>📥</span> MD 다운로드
        </motion.button>
      </div>

      {/* 복사 완료 피드백 */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-green-50 border-2 border-green-200 rounded-xl px-3.5 py-2.5 shadow-sm"
          >
            <p className="text-xs sm:text-sm font-bold text-green-800">
              ✅ 클립보드에 복사됐습니다. AI 에이전트 채팅창에 붙여넣기(⌘V) 하세요!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
