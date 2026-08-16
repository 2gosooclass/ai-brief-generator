"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBriefStore } from "@/store/briefStore";
import UnsplashPreview from "./UnsplashPreview";
import ImageUploader from "./ImageUploader";
import AiImagePromptGenerator from "./AiImagePromptGenerator";
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
    logoUrl,
    setLogoUrl,
    referenceScreenshotUrl,
    setReferenceScreenshotUrl,
  } = useBriefStore();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setLogoUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setReferenceScreenshotUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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

              {/* ── 🏷️ 브랜드 기본 설정 (상시 노출) ── */}
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#1C1410] flex items-center justify-center text-[#C8A97E] text-[9px] font-bold shrink-0">
                    1
                  </div>
                  <h3 className="text-xs font-pretendard font-semibold text-[#1C1410]">브랜드 및 로고 설정</h3>
                </div>
                
                <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E8E0D8]">
                  {/* 브랜드명 */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8C7A6A] font-pretendard font-medium block">브랜드명 (업체명)</label>
                    <input
                      type="text"
                      placeholder="예: 블루문 카페"
                      value={userInputs.businessName}
                      onChange={(e) => setUserInput("businessName", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/40 placeholder:text-[#C0B8B0]"
                    />
                  </div>

                  {/* 로고 설정 */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8C7A6A] font-pretendard font-medium block">로고 이미지</label>
                    <div className="flex items-center gap-2">
                      {logoUrl ? (
                        <div className="relative w-12 h-12 rounded border border-[#E0D8D0] bg-white flex items-center justify-center overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLogoUrl(null);
                            }}
                            className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-[10px] transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      ) : (
                        <label className="flex-1 flex flex-col items-center justify-center h-12 border border-dashed border-[#E0D8D0] hover:border-[#C8A97E] rounded-lg cursor-pointer bg-[#FAFAF7] hover:bg-white transition-all">
                          <span className="text-[10px] font-pretendard text-[#8C7A6A] flex items-center gap-1">📤 로고 파일 업로드 (PNG, SVG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            onClick={(e) => e.stopPropagation()}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-5 border-t border-[#E8E0D8]" />

              {/* ── 📎 STEP 2: 레퍼런스 및 감성 설정 (상시 노출) ── */}
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#1C1410] flex items-center justify-center text-[#C8A97E] text-[9px] font-bold shrink-0">
                    2
                  </div>
                  <h3 className="text-xs font-pretendard font-semibold text-[#1C1410]">레퍼런스 및 감성 설정</h3>
                </div>
                
                <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E8E0D8]">
                  {/* 레퍼런스 URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8C7A6A] font-pretendard font-medium block">레퍼런스 웹사이트 URL</label>
                    <input
                      type="url"
                      placeholder="예: https://awwwards.com/site-example"
                      value={userInputs.referenceUrl}
                      onChange={(e) => setUserInput("referenceUrl", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/40 placeholder:text-[#C0B8B0]"
                    />
                  </div>

                  {/* 레퍼런스 스크린샷 */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8C7A6A] font-pretendard font-medium block">레퍼런스 스크린샷</label>
                    <div className="flex items-center gap-2">
                      {referenceScreenshotUrl ? (
                        <div className="relative w-12 h-12 rounded border border-[#E0D8D0] bg-white flex items-center justify-center overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={referenceScreenshotUrl} alt="Reference Preview" className="max-w-full max-h-full object-contain" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReferenceScreenshotUrl(null);
                            }}
                            className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-[10px] transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      ) : (
                        <label className="flex-1 flex flex-col items-center justify-center h-12 border border-dashed border-[#E0D8D0] hover:border-[#C8A97E] rounded-lg cursor-pointer bg-[#FAFAF7] hover:bg-white transition-all">
                          <span className="text-[10px] font-pretendard text-[#8C7A6A] flex items-center gap-1">📤 스크린샷 업로드 (PNG, JPG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleReferenceScreenshotUpload}
                            onClick={(e) => e.stopPropagation()}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-5 border-t border-[#E8E0D8]" />

              {/* ── 🖼️ 대표 이미지 설정 (상시 노출) ── */}
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#1C1410] flex items-center justify-center text-[#C8A97E] text-[9px] font-bold shrink-0">
                    3
                  </div>
                  <h3 className="text-xs font-pretendard font-semibold text-[#1C1410]">대표 이미지 설정</h3>
                </div>

                <div className="space-y-3">
                  {/* 방식 토글 */}
                  <div className="flex rounded-xl border border-[#E0D8D0] overflow-hidden">
                    {(["stock", "upload", "prompt"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setImageMode(mode)}
                        className={`flex-1 py-2 text-[11px] font-pretendard font-medium transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                          imageMode === mode
                            ? "bg-[#1C1410] text-white"
                            : "bg-white text-[#5C4A3A] hover:bg-[#F5F0EA]"
                        }`}
                      >
                        <span>{mode === "stock" ? "🖼️" : mode === "upload" ? "📤" : "✨"}</span>
                        {mode === "stock" ? "스톡 자동" : mode === "upload" ? "직접 업로드" : "AI 프롬프트"}
                      </button>
                    ))}
                  </div>

                  {/* 방식별 콘텐츠 */}
                  <div className="bg-white p-3 rounded-xl border border-[#E8E0D8]">
                    {imageMode === "stock" ? (
                      <UnsplashPreview keyword={selectedTemplate.unsplashKeyword} />
                    ) : imageMode === "upload" ? (
                      <ImageUploader />
                    ) : (
                      <AiImagePromptGenerator />
                    )}
                  </div>
                </div>
              </div>

              <div className="mx-5 border-t border-[#E8E0D8]" />

              {/* ── ⚙️ 세부 조정 아코디언 ── */}
              <div className="mx-3 mt-2 mb-6">
                <AccordionHeader
                  title="세부 정보 및 레이아웃 조정"
                  icon="⚙️"
                  isOpen={modifyOpen}
                  onToggle={() => setModifyOpen(v => !v)}
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
                      <div className="px-3 pb-4 pt-1 space-y-3">
                        
                        {/* 1. 소개 문구 및 연락처 */}
                        <div className="bg-white p-4 rounded-xl border border-[#E8E0D8] space-y-3">
                          <h4 className="text-xs font-pretendard font-semibold text-[#1C1410] flex items-center gap-1.5">
                            <span>📝</span> 소개 문구 및 연락처
                          </h4>
                          
                          <div className="space-y-1">
                            <label className="text-[10px] text-[#8C7A6A] font-pretendard font-medium block">한줄 소개</label>
                            <textarea
                              placeholder="예: 제주의 바람을 담은 핸드드립 카페"
                              value={userInputs.description}
                              onChange={(e) => setUserInput("description", e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              rows={2}
                              className="w-full px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/40 placeholder:text-[#C0B8B0] resize-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-[#8C7A6A] font-pretendard font-medium block">연락처 및 링크</label>
                            <input
                              type="text"
                              placeholder="예: 02-1234-5678 / info@cafe.com"
                              value={userInputs.contact}
                              onChange={(e) => setUserInput("contact", e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/40 placeholder:text-[#C0B8B0]"
                            />
                          </div>
                        </div>

                        {/* 2. 포인트 컬러 변경 */}
                        <div className="bg-white p-4 rounded-xl border border-[#E8E0D8] space-y-3">
                          <h4 className="text-xs font-pretendard font-semibold text-[#1C1410] flex items-center gap-1.5">
                            <span>🎨</span> 포인트 컬러 커스터마이징
                          </h4>
                          <div className="space-y-2">
                            <p className="text-[10px] text-[#8C7A6A] font-pretendard flex items-center gap-1.5">
                              기본 포인트 컬러:
                              <span className="inline-block w-3 h-3 rounded-full border border-black/10 animate-pulse"
                                style={{ backgroundColor: selectedTemplate.colors.accent }} />
                              <code className="text-[#5C4A3A] font-mono">{selectedTemplate.colors.accent}</code>
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
                        </div>

                        {/* 3. 섹션 배치 재구성 */}
                        <div className="bg-white p-4 rounded-xl border border-[#E8E0D8] space-y-3">
                          <h4 className="text-xs font-pretendard font-semibold text-[#1C1410] flex items-center gap-1.5">
                            <span>↕️</span> 섹션 배치 구성
                          </h4>
                          <div className="space-y-2">
                            <p className="text-[10px] text-[#8C7A6A] font-pretendard leading-relaxed">
                              기본 배치 순서:<br />
                              <span className="text-[#5C4A3A] font-mono font-semibold block mt-1">
                                {selectedTemplate.sections.join(" → ")}
                              </span>
                            </p>
                            <input
                              type="text"
                              placeholder="예: hero → about → gallery → contact"
                              value={userInputs.sectionOrder}
                              onChange={(e) => setUserInput("sectionOrder", e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full px-3 py-2 text-xs font-pretendard rounded-lg border border-[#E0D8D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/40 placeholder:text-[#C0B8B0]"
                            />
                          </div>
                        </div>

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
