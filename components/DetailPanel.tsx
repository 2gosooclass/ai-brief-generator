"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBriefStore } from "@/store/briefStore";
import UnsplashPreview from "./UnsplashPreview";
import ImageUploader from "./ImageUploader";
import PromptOutput from "./PromptOutput";
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

// ── 아코디언 헤더 ──────────────────────────────────────────
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

// ── 메인 컴포넌트 ──────────────────────────────────────────
export default function DetailPanel() {
  const {
    selectedTemplate,
    isPanelOpen,
    closePanel,
    imageMode,
    setImageMode,
    modifyOptions,
    toggleModifyOption,
    userInputs,
    setUserInput,
    resetPanel,
  } = useBriefStore();

  // 아코디언 독립 상태
  const [imageOpen,  setImageOpen]  = useState(true);
  const [modifyOpen, setModifyOpen] = useState(true);

  const handleClose = () => {
    closePanel();
    resetPanel();
    setImageOpen(true);
    setModifyOpen(true);
  };

  return (
    <AnimatePresence>
      {isPanelOpen && selectedTemplate && (
        <>
          {/* 모바일 딤 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* 패널 슬라이드인 */}
          <motion.aside
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#FAFAF7] border-l border-[#E8E0D8] shadow-2xl z-50 flex flex-col"
          >
            {/* ──────────── STICKY 헤더 ──────────── */}
            <div className="shrink-0 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-[#E8E0D8] px-5 py-3 flex items-center gap-3">
              {/* 컬러 도트 */}
              <div
                className="w-7 h-7 rounded-lg shrink-0 border border-black/10"
                style={{ backgroundColor: selectedTemplate.colors.accent }}
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
                aria-label="닫기"
              >
                <svg className="w-3.5 h-3.5 text-[#5C4A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ──────────── 스크롤 영역 ──────────── */}
            <div className="flex-1 overflow-y-auto">

              {/* ── 🔝 STEP 1: 프롬프트 항상 상단 고정 ── */}
              <div className="px-5 pt-4 pb-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-[#1C1410] flex items-center justify-center text-[#C8A97E] text-[9px] font-bold shrink-0">
                    ✓
                  </div>
                  <p className="text-xs font-pretendard font-semibold text-[#1C1410]">
                    자동 생성 프롬프트
                  </p>
                  <span className="text-[10px] font-pretendard text-[#C8A97E] bg-[#FDF8F3] px-1.5 py-0.5 rounded-full border border-[#E8D8C0]">
                    실시간 업데이트
                  </span>
                </div>
                <PromptOutput compact />
              </div>

              <div className="mx-5 border-t border-[#E8E0D8]" />

              {/* ── 🖼️ STEP 2: 이미지 처리 아코디언 ── */}
              <div className="mx-3 mt-2">
                <AccordionHeader
                  title="이미지 처리 방식"
                  icon="🖼️"
                  isOpen={imageOpen}
                  onToggle={() => setImageOpen(v => !v)}
                  badge={imageMode === "stock" ? "스톡 자동" : "직접 업로드"}
                />

                <AnimatePresence initial={false}>
                  {imageOpen && (
                    <motion.div
                      key="image-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-4 pt-1">
                        {/* 방식 토글 */}
                        <div className="flex rounded-xl border border-[#E0D8D0] overflow-hidden mb-3">
                          {(["stock", "upload"] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setImageMode(mode)}
                              className={`flex-1 py-2 text-xs font-pretendard font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                                imageMode === mode
                                  ? "bg-[#1C1410] text-white"
                                  : "bg-white text-[#5C4A3A] hover:bg-[#F5F0EA]"
                              }`}
                            >
                              <span>{mode === "stock" ? "🖼️" : "📤"}</span>
                              {mode === "stock" ? "스톡 이미지 자동" : "내 사진 업로드"}
                            </button>
                          ))}
                        </div>

                        {/* 방식별 콘텐츠 */}
                        <AnimatePresence mode="wait">
                          {imageMode === "stock" ? (
                            <motion.div key="stock"
                              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                              <UnsplashPreview keyword={selectedTemplate.unsplashKeyword} />
                            </motion.div>
                          ) : (
                            <motion.div key="upload"
                              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                              <ImageUploader />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mx-5 border-t border-[#E8E0D8]" />

              {/* ── ✏️ STEP 3: 수정 항목 아코디언 ── */}
              <div className="mx-3 mt-2 mb-4">
                <AccordionHeader
                  title="수정 요청 항목"
                  icon="⚙️"
                  isOpen={modifyOpen}
                  onToggle={() => setModifyOpen(v => !v)}
                  badge={
                    Object.values(modifyOptions).filter(Boolean).length > 0
                      ? `${Object.values(modifyOptions).filter(Boolean).length}개 선택`
                      : undefined
                  }
                />

                <AnimatePresence initial={false}>
                  {modifyOpen && (
                    <motion.div
                      key="modify-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-4 pt-1 space-y-2">
                        {MODIFY_OPTIONS.map((opt) => {
                          const isChecked = modifyOptions[opt.key];
                          return (
                            <div key={opt.key}>
                              {/* 체크박스 행 */}
                              <div
                                role="checkbox"
                                aria-checked={isChecked}
                                tabIndex={0}
                                onClick={() => toggleModifyOption(opt.key)}
                                onKeyDown={(e) => {
                                  if (e.key === " " || e.key === "Enter") {
                                    e.preventDefault();
                                    toggleModifyOption(opt.key);
                                  }
                                }}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 select-none transition-all duration-200 ${
                                  isChecked
                                    ? "border-[#C8A97E] bg-[#FDF8F3]"
                                    : "border-[#E8E0D8] bg-white hover:border-[#C8A97E]/50"
                                }`}
                              >
                                {/* 시각적 체크박스 */}
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                  isChecked ? "border-[#C8A97E] bg-[#C8A97E]" : "border-[#C5BBB0] bg-white"
                                }`}>
                                  {isChecked && (
                                    <motion.svg
                                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                                      className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </motion.svg>
                                  )}
                                </div>

                                {/* 텍스트 */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm">{opt.icon}</span>
                                    <span className="text-xs font-pretendard font-medium text-[#1C1410]">{opt.label}</span>
                                  </div>
                                  <p className="text-[10px] text-[#8C7A6A] font-pretendard mt-0.5">{opt.desc}</p>
                                </div>

                                {/* 화살표 */}
                                <motion.svg
                                  animate={{ rotate: isChecked ? 180 : 0 }} transition={{ duration: 0.2 }}
                                  className="w-3.5 h-3.5 text-[#A09080] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </motion.svg>
                              </div>

                              {/* 입력 필드 */}
                              <AnimatePresence>
                                {isChecked && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.22 }}
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
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/40 placeholder:text-[#C0B8B0]"
                                          />
                                          <textarea
                                            placeholder="한줄 소개 (예: 제주의 바람을 담은 핸드드립 카페)"
                                            value={userInputs.description}
                                            onChange={(e) => setUserInput("description", e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            rows={2}
                                            className="w-full px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/40 placeholder:text-[#C0B8B0] resize-none"
                                          />
                                        </>
                                      )}

                                      {opt.key === "colorChange" && (
                                        <div className="space-y-1">
                                          <p className="text-[10px] text-[#8C7A6A] font-pretendard flex items-center gap-1.5">
                                            현재 포인트 컬러:
                                            <span className="inline-block w-3 h-3 rounded-full border border-black/10"
                                              style={{ backgroundColor: selectedTemplate.colors.accent }} />
                                            <code className="text-[#5C4A3A]">{selectedTemplate.colors.accent}</code>
                                          </p>
                                          <input
                                            type="text"
                                            placeholder="변경할 컬러 (예: 딥 네이비, #1A3A5C, 민트 계열)"
                                            value={userInputs.customColor}
                                            onChange={(e) => setUserInput("customColor", e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/40 placeholder:text-[#C0B8B0]"
                                          />
                                        </div>
                                      )}

                                      {opt.key === "sectionReorder" && (
                                        <div className="space-y-1">
                                          <p className="text-[10px] text-[#8C7A6A] font-pretendard leading-relaxed">
                                            기본 순서:{" "}
                                            <span className="text-[#5C4A3A]">
                                              {selectedTemplate.sections.join(" → ")}
                                            </span>
                                          </p>
                                          <input
                                            type="text"
                                            placeholder="원하는 순서 (예: hero → gallery → menu → location)"
                                            value={userInputs.sectionOrder}
                                            onChange={(e) => setUserInput("sectionOrder", e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/40 placeholder:text-[#C0B8B0]"
                                          />
                                        </div>
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

            </div>{/* end scroll area */}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
