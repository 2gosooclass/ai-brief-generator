"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBriefStore } from "@/store/briefStore";
import UnsplashPreview from "./UnsplashPreview";
import ImageUploader from "./ImageUploader";
import PromptOutput from "./PromptOutput";
import LivePreviewRenderer from "./LivePreviewRenderer";
import type { ModifyOptions } from "@/lib/types";

const MODIFY_OPTIONS: {
  key: keyof ModifyOptions;
  label: string;
  desc: string;
  icon: string;
}[] = [
  { key: "textChange",    label: "텍스트 변경",    desc: "업체명, 소개 문구 교체",       icon: "✏️" },
  { key: "colorChange",   label: "컬러 변경",      desc: "포인트 컬러 커스터마이징",      icon: "🎨" },
  { key: "sectionReorder",label: "섹션 순서 변경",  desc: "원하는 순서로 재배치",         icon: "↕️" },
];

const COLOR_PRESETS = ["#1C1410", "#2C6BAD", "#D4AF70", "#E5989B", "#2D6A4F", "#7C3AED", "#FF6B35"];

function AccordionHeader({
  title,
  icon,
  isOpen,
  onToggle,
  badge,
}: {
  title: string;
  icon: string;
  isOpen: boolean;
  onToggle: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-[#F5F0EA] rounded-xl"
    >
      <span className="text-sm">{icon}</span>
      <span className="flex-1 text-xs font-pretendard font-semibold text-[#1C1410]">{title}</span>
      {badge && (
        <span className="text-[10px] font-pretendard text-[#C8A97E] bg-[#FDF8F3] border border-[#E8D8C0] px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <svg className="w-3.5 h-3.5 text-[#A09080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </button>
  );
}

export default function LivePreviewModal() {
  const {
    selectedCategory,
    selectedTemplate,
    isPanelOpen,
    closePanel,
    imageMode,
    setImageMode,
    modifyOptions,
    toggleModifyOption,
    toggleMultiPage,
    userInputs,
    setUserInput,
    resetPanel,
  } = useBriefStore();

  const [imageOpen, setImageOpen] = useState(true);
  const [modifyOpen, setModifyOpen] = useState(true);

  const handleClose = () => {
    closePanel();
    resetPanel();
    setImageOpen(true);
    setModifyOpen(true);
  };

  if (!isPanelOpen || !selectedTemplate) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm">
      {/* ── 좌측: 실시간 풀사이즈 미리보기 ── */}
      <div className="flex-1 flex flex-col p-4 lg:p-8 min-w-0">
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* 브라우저 상단 목업 툴바 */}
          <div className="h-10 bg-[#F2F2F2] flex items-center px-4 gap-2 shrink-0 border-b border-[#E0E0E0]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            </div>
            <div className="ml-4 flex-1 flex justify-center">
              <div className="w-64 h-6 bg-white rounded-md border border-[#D9D9D9] flex items-center justify-center">
                <span className="text-[10px] text-[#A0A0A0] font-pretendard">
                  preview.2gosooweb.app
                </span>
              </div>
            </div>
          </div>
          {/* 프리뷰 렌더러 영역 */}
          <div className="flex-1 overflow-y-auto bg-[#FAFAFA] relative">
            <LivePreviewRenderer />
          </div>
        </div>
      </div>

      {/* ── 우측: 컨트롤 사이드바 ── */}
      <motion.aside
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        className="w-full max-w-md bg-[#FAFAF7] border-l border-[#E8E0D8] shadow-2xl flex flex-col shrink-0"
      >
        <div className="shrink-0 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-[#E8E0D8] px-5 py-3 flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg shrink-0 border border-black/10"
            style={{ backgroundColor: userInputs.pickedColor || selectedTemplate.colors.accent }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-serif-kr text-sm font-semibold text-[#1C1410] leading-tight truncate">
              {selectedTemplate.name}
            </h2>
            <p className="text-[10px] font-pretendard text-[#8C7A6A] leading-tight truncate">
              {selectedTemplate.tagline}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-[#F0EAE2] hover:bg-[#E8DDD5] flex items-center justify-center transition-colors shrink-0"
          >
            <svg className="w-3.5 h-3.5 text-[#5C4A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* 프롬프트 */}
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-[#1C1410] flex items-center justify-center text-[#C8A97E] text-[9px] font-bold shrink-0">
                ✓
              </div>
              <p className="text-xs font-pretendard font-semibold text-[#1C1410]">
                자동 생성 프롬프트
              </p>
            </div>
            <PromptOutput compact />
          </div>

          <div className="mx-5 border-t border-[#E8E0D8]" />

          {/* 이미지 처리 */}
          <div className="mx-3 mt-2">
            <AccordionHeader
              title="이미지 처리 방식"
              icon="🖼️"
              isOpen={imageOpen}
              onToggle={() => setImageOpen((v) => !v)}
              badge={imageMode === "stock" ? "스톡 자동" : "직접 업로드"}
            />
            <AnimatePresence initial={false}>
              {imageOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-4 pt-1">
                    <div className="flex rounded-xl border border-[#E0D8D0] overflow-hidden mb-3">
                      {(["stock", "upload"] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setImageMode(mode)}
                          className={`flex-1 py-2 text-xs font-pretendard font-medium flex items-center justify-center gap-1.5 ${
                            imageMode === mode
                              ? "bg-[#1C1410] text-white"
                              : "bg-white text-[#5C4A3A] hover:bg-[#F5F0EA]"
                          }`}
                        >
                          <span>{mode === "stock" ? "🖼️" : "📤"}</span>
                          {mode === "stock" ? "스톡 이미지" : "직접 업로드"}
                        </button>
                      ))}
                    </div>
                    {imageMode === "stock" ? (
                      <UnsplashPreview keyword={selectedTemplate.unsplashKeyword} />
                    ) : (
                      <ImageUploader />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mx-5 border-t border-[#E8E0D8]" />

          {/* 멀티페이지 토글 (학원 전용) */}
          {selectedCategory === "academy" && (
            <div className="mx-5 py-4 flex items-center justify-between border-b border-[#E8E0D8]">
              <div className="flex items-center gap-2">
                <span className="text-sm">📄</span>
                <span className="text-xs font-pretendard font-semibold text-[#1C1410]">다중 페이지 설정</span>
              </div>
              <button
                onClick={toggleMultiPage}
                className={`w-11 h-6 rounded-full p-1 transition-colors ${modifyOptions.isMultiPage ? "bg-[#C8A97E]" : "bg-[#D9D9D9]"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${modifyOptions.isMultiPage ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          )}

          {/* 수정 항목 */}
          <div className="mx-3 mt-2 mb-4">
            <AccordionHeader
              title="수정 요청 항목"
              icon="⚙️"
              isOpen={modifyOpen}
              onToggle={() => setModifyOpen((v) => !v)}
            />
            <AnimatePresence initial={false}>
              {modifyOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-4 pt-1 space-y-2">
                    {MODIFY_OPTIONS.map((opt) => {
                      if (opt.key === "isMultiPage") return null;
                      const isChecked = modifyOptions[opt.key];
                      return (
                        <div key={opt.key}>
                          <div
                            onClick={() => toggleModifyOption(opt.key)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 select-none transition-all ${
                              isChecked
                                ? "border-[#C8A97E] bg-[#FDF8F3]"
                                : "border-[#E8E0D8] bg-white"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                              isChecked ? "border-[#C8A97E] bg-[#C8A97E]" : "border-[#C5BBB0] bg-white"
                            }`}>
                              {isChecked && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm">{opt.icon}</span>
                                <span className="text-xs font-pretendard font-medium text-[#1C1410]">{opt.label}</span>
                              </div>
                              <p className="text-[10px] text-[#8C7A6A] font-pretendard mt-0.5">{opt.desc}</p>
                            </div>
                          </div>

                          <AnimatePresence>
                            {isChecked && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-2 pb-1 px-1 space-y-2">
                                  {opt.key === "textChange" && (
                                    <>
                                      <input
                                        type="text"
                                        placeholder="업체명 (예: 블루문 카페)"
                                        value={userInputs.businessName}
                                        onChange={(e) => setUserInput("businessName", e.target.value)}
                                        className="w-full px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0]"
                                      />
                                      <textarea
                                        placeholder="한줄 소개 (예: 제주의 바람을 담은 핸드드립 카페)"
                                        value={userInputs.description}
                                        onChange={(e) => setUserInput("description", e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0] resize-none"
                                      />
                                    </>
                                  )}

                                  {opt.key === "colorChange" && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 mb-1">
                                        <input
                                          type="color"
                                          value={userInputs.pickedColor || selectedTemplate.colors.accent}
                                          onChange={(e) => setUserInput("pickedColor", e.target.value)}
                                          className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                                        />
                                        <span className="text-[10px] text-[#8C7A6A] font-pretendard">직접 선택</span>
                                      </div>
                                      <div className="flex gap-1.5 flex-wrap">
                                        {COLOR_PRESETS.map(color => (
                                          <button
                                            key={color}
                                            onClick={() => setUserInput("pickedColor", color)}
                                            className="w-6 h-6 rounded-full border border-black/10"
                                            style={{ backgroundColor: color }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {opt.key === "sectionReorder" && (
                                    <input
                                      type="text"
                                      placeholder="원하는 순서 (예: hero → gallery → menu)"
                                      value={userInputs.sectionOrder}
                                      onChange={(e) => setUserInput("sectionOrder", e.target.value)}
                                      className="w-full px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0]"
                                    />
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
