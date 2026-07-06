"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBriefStore } from "@/store/briefStore";
import { buildPrompt } from "@/lib/promptBuilder";

interface PromptOutputProps {
  /** 패널 상단 고정 시 compact 모드 사용 */
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
    });
    setPrompt(built);
  }, [selectedTemplate, selectedCategory, imageMode, uploadedImageUrl, selectedStockImages, modifyOptions, userInputs]);

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

  if (!selectedTemplate) return null;

  return (
    <div className="space-y-2.5">
      {/* 안내 배너 — compact 모드에서도 표시 (작게) */}
      <div className={`rounded-xl border ${compact ? "px-3 py-2 bg-[#FDF8F0] border-[#E8D5B7]" : "px-4 py-3 bg-[#FDF8F0] border-[#E8D5B7]"}`}>
        <p className={`font-pretendard text-[#5C4A3A] leading-relaxed ${compact ? "text-[10px]" : "text-[11px]"}`}>
          이 프롬프트를 사용하시는{" "}
          <span className="font-semibold text-[#C8A97E]">AI 에이전트</span>
          (예: Antigravity, Codex, Hermes, Lovable, v0, Claude, Cursor 등)에 붙여넣기 하세요.
        </p>
      </div>

      {/* 프롬프트 텍스트 영역 */}
      <div className="relative">
        <textarea
          id="prompt-text"
          readOnly
          value={prompt}
          className={`prompt-textarea w-full px-4 py-3 rounded-xl border border-[#E0D8D0] bg-[#FAFAF7] text-[#2C2118] resize-none focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/30 ${
            compact ? "text-[10px] h-36 leading-relaxed" : "text-xs h-72"
          }`}
        />
        {/* 글자 수 */}
        <div className="absolute bottom-2.5 right-3 text-[9px] text-[#A09080] font-pretendard bg-white/80 px-1.5 py-0.5 rounded">
          {prompt.length.toLocaleString()}자
        </div>
      </div>

      {/* 복사 버튼 */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleCopy}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-pretendard font-semibold transition-all duration-200 ${
          copied
            ? "bg-green-500 text-white"
            : "bg-[#1C1410] text-white hover:bg-[#2C2118]"
        }`}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span key="copied"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              복사 완료! AI에 붙여넣기 하세요
            </motion.span>
          ) : (
            <motion.span key="copy"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              📋 프롬프트 복사하기
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* 복사 완료 피드백 */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-green-50 border border-green-200 rounded-xl px-3 py-2.5"
          >
            <p className="text-[11px] font-pretendard text-green-700">
              ✅ 클립보드에 복사됐습니다. AI 에이전트 채팅창에 붙여넣기(⌘V) 하세요!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
