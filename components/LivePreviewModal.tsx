"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBriefStore } from "@/store/briefStore";
import UnsplashPreview from "./UnsplashPreview";
import ImageUploader from "./ImageUploader";
import AiImagePromptGenerator from "./AiImagePromptGenerator";
import PromptOutput from "./PromptOutput";
import LivePreviewRenderer from "./LivePreviewRenderer";

const COLOR_PRESETS = ["#1C1410", "#2C6BAD", "#D4AF70", "#E5989B", "#2D6A4F", "#7C3AED", "#FF6B35"];

export default function LivePreviewModal() {
  const {
    selectedTemplate,
    isPanelOpen,
    closePanel,
    imageMode,
    setImageMode,
    userInputs,
    setUserInput,
    resetPanel,
    logoUrl,
    setLogoUrl,
    referenceScreenshotUrl,
    setReferenceScreenshotUrl,
    navMenus,
    addNavMenu,
    removeNavMenu,
    updateNavMenu,
  } = useBriefStore();

  const [newMenuInput, setNewMenuInput] = useState("");
  const [editingMenuIndex, setEditingMenuIndex] = useState<number | null>(null);
  const [editingMenuValue, setEditingMenuValue] = useState("");

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

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuInput.trim()) return;
    addNavMenu(newMenuInput);
    setNewMenuInput("");
  };

  const handleStartEditMenu = (index: number, current: string) => {
    setEditingMenuIndex(index);
    setEditingMenuValue(current);
  };

  const handleSaveEditMenu = (index: number) => {
    if (editingMenuValue.trim()) {
      updateNavMenu(index, editingMenuValue);
    }
    setEditingMenuIndex(null);
    setEditingMenuValue("");
  };

  const handleClose = () => {
    closePanel();
    resetPanel();
  };

  if (!isPanelOpen || !selectedTemplate) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm font-pretendard">
      {/* ── 좌측: 실시간 풀사이즈 미리보기 ── */}
      <div className="flex-1 flex flex-col p-3 lg:p-6 min-w-0">
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* 브라우저 상단 목업 툴바 */}
          <div className="h-10 bg-[#F2F2F2] flex items-center px-4 gap-2 shrink-0 border-b border-[#E0E0E0]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            </div>
            <div className="ml-4 flex-1 flex justify-center">
              <div className="w-72 h-6 bg-white rounded-md border border-[#D9D9D9] flex items-center justify-center shadow-inner">
                <span className="text-[11px] font-mono text-[#6B7280]">
                  https://preview.2gosoo.ai
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

      {/* ── 우측: 고가독성 컨트롤 사이드바 (너비 확장 500px) ── */}
      <motion.aside
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        className="w-full sm:w-[500px] max-w-[520px] bg-[#FAF9F6] border-l-2 border-[#E5E7EB] shadow-2xl flex flex-col shrink-0 text-left"
      >
        {/* 헤더 */}
        <div className="shrink-0 bg-white/95 backdrop-blur-md border-b-2 border-[#E5E7EB] px-6 py-4 flex items-center gap-3.5 shadow-sm">
          <div
            className="w-8 h-8 rounded-xl shrink-0 border-2 border-black/10 shadow-sm"
            style={{ backgroundColor: userInputs.pickedColor || selectedTemplate.colors.accent }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-serif-kr text-base sm:text-lg font-bold text-[#111827] leading-tight truncate">
              {selectedTemplate.name}
            </h2>
            <p className="text-xs font-medium text-[#4B5563] leading-tight truncate mt-0.5">
              {selectedTemplate.tagline}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center transition-colors shrink-0 cursor-pointer text-[#1F2937]"
            title="닫기"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* 1. 자동 생성 브리프 프롬프트 항상 최상단 노출 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <span className="text-base">⚡</span> 생성된 브리프 프롬프트
              </h3>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                실시간 동기화
              </span>
            </div>
            <PromptOutput compact />
          </div>

          <hr className="border-[#E5E7EB]" />

          {/* 2. 브랜드 로고 및 기본 정보 설정 */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🏷️</span>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#111827]">기본 정보 및 로고 설정</h3>
            </div>
            
            <div className="bg-white border-2 border-[#E5E7EB] rounded-2xl p-4 space-y-3.5 shadow-sm">
              {/* 로고 업로드 */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">브랜드 로고 이미지</label>
                <div className="flex items-center gap-2">
                  {logoUrl ? (
                    <div className="relative w-14 h-14 rounded-xl border-2 border-[#D1D5DB] bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      <img src={logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogoUrl(null);
                        }}
                        className="absolute inset-0 bg-black/60 hover:bg-black/80 flex items-center justify-center text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        삭제
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex flex-col items-center justify-center h-14 border-2 border-dashed border-[#D1D5DB] hover:border-[#111827] rounded-xl cursor-pointer bg-[#F9FAFB] hover:bg-white transition-all">
                      <span className="text-xs sm:text-[13px] text-[#374151] flex items-center gap-1.5 font-bold">📤 로고 파일 업로드 (PNG, SVG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* 업체명 */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">업체명 (사이트 타이틀)</label>
                <input
                  type="text"
                  placeholder="업체명 (예: 블루문 카페)"
                  value={userInputs.businessName}
                  onChange={(e) => setUserInput("businessName", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#111827] rounded-xl border-2 border-[#D1D5DB] bg-white focus:outline-none focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/15 placeholder:text-[#9CA3AF]"
                />
              </div>

              {/* 한줄 소개 */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">메인 한줄 소개</label>
                <textarea
                  placeholder="한줄 소개 (예: 제주의 바람을 담은 핸드드립 카페)"
                  value={userInputs.description}
                  onChange={(e) => setUserInput("description", e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#111827] rounded-xl border-2 border-[#D1D5DB] bg-white focus:outline-none focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/15 placeholder:text-[#9CA3AF] resize-none leading-relaxed"
                />
              </div>

              {/* 연락처 */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">하단 연락처 (이메일/전화번호)</label>
                <input
                  type="text"
                  placeholder="연락처 (예: 010-1234-5678)"
                  value={userInputs.contact}
                  onChange={(e) => setUserInput("contact", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#111827] rounded-xl border-2 border-[#D1D5DB] bg-white focus:outline-none focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/15 placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#E5E7EB]" />

          {/* 3. 🧭 상단 네비게이션 메뉴 수정 & 추가 섹션 */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🧭</span>
                <h3 className="text-sm sm:text-[15px] font-bold text-[#111827]">상단 메뉴 수정 & 추가</h3>
              </div>
              <span className="text-xs font-bold text-[#4B5563] bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                총 {navMenus.length}개 메뉴
              </span>
            </div>

            <div className="bg-white border-2 border-[#E5E7EB] rounded-2xl p-4 space-y-3.5 shadow-sm">
              <p className="text-xs text-[#4B5563] font-medium leading-relaxed">
                💡 메뉴 이름을 클릭하여 수정하거나, 우측 ✕로 삭제 및 새 메뉴를 추가할 수 있습니다.
              </p>

              {/* 현재 메뉴 뱃지 목록 */}
              <div className="flex flex-wrap gap-2">
                {navMenus.map((menu, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F3F4F6] border border-[#D1D5DB] text-xs sm:text-[13px] font-bold text-[#111827] shadow-sm"
                  >
                    {editingMenuIndex === idx ? (
                      <input
                        type="text"
                        autoFocus
                        value={editingMenuValue}
                        onChange={(e) => setEditingMenuValue(e.target.value)}
                        onBlur={() => handleSaveEditMenu(idx)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEditMenu(idx);
                        }}
                        className="w-24 px-1.5 py-0.5 text-xs font-bold rounded bg-white border-2 border-[#111827] outline-none"
                      />
                    ) : (
                      <span
                        onClick={() => handleStartEditMenu(idx, menu)}
                        title="클릭하여 수정"
                        className="cursor-pointer hover:text-cyan-700 transition-colors"
                      >
                        {menu}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeNavMenu(idx)}
                      title="메뉴 삭제"
                      className="text-[#6B7280] hover:text-red-600 transition-colors ml-1 text-sm font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* 새 메뉴 추가 폼 */}
              <form onSubmit={handleAddMenu} className="flex gap-2 pt-2 border-t border-[#F3F4F6]">
                <input
                  type="text"
                  placeholder="새 메뉴 이름 (예: REVIEWS)"
                  value={newMenuInput}
                  onChange={(e) => setNewMenuInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#111827] rounded-xl border-2 border-[#D1D5DB] bg-white focus:outline-none focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/15 placeholder:text-[#9CA3AF]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#111827] hover:bg-[#374151] text-white rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 shadow"
                >
                  + 메뉴 추가
                </button>
              </form>
            </div>
          </div>

          <hr className="border-[#E5E7EB]" />

          {/* 4. 레퍼런스 웹사이트 & 스크린샷 설정 */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-base">📎</span>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#111827]">레퍼런스 및 스타일</h3>
            </div>
            
            <div className="bg-white border-2 border-[#E5E7EB] rounded-2xl p-4 space-y-3.5 shadow-sm">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">레퍼런스 웹사이트 URL</label>
                <input
                  type="url"
                  placeholder="예: https://awwwards.com/site-example"
                  value={userInputs.referenceUrl}
                  onChange={(e) => setUserInput("referenceUrl", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#111827] rounded-xl border-2 border-[#D1D5DB] bg-white focus:outline-none focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/15 placeholder:text-[#9CA3AF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">레퍼런스 스크린샷</label>
                <div className="flex items-center gap-2">
                  {referenceScreenshotUrl ? (
                    <div className="relative w-14 h-14 rounded-xl border-2 border-[#D1D5DB] bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      <img src={referenceScreenshotUrl} alt="Reference Preview" className="max-w-full max-h-full object-contain" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReferenceScreenshotUrl(null);
                        }}
                        className="absolute inset-0 bg-black/60 hover:bg-black/80 flex items-center justify-center text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        삭제
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex flex-col items-center justify-center h-14 border-2 border-dashed border-[#D1D5DB] hover:border-[#111827] rounded-xl cursor-pointer bg-[#F9FAFB] hover:bg-white transition-all">
                      <span className="text-xs sm:text-[13px] text-[#374151] flex items-center gap-1.5 font-bold">📤 스크린샷 업로드 (PNG, JPG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReferenceScreenshotUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-[#E5E7EB]" />

          {/* 5. 🖼️ 대표 비주얼 및 생성형 AI 이미지 규격/프롬프트 설정 (3단 탭) */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🖼️</span>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#111827]">대표 비주얼 & AI 이미지 규격 설정</h3>
            </div>

            <div className="space-y-3">
              {/* 방식 토글 (3단 탭 - 고대비 폰트) */}
              <div className="flex rounded-2xl border-2 border-[#D1D5DB] overflow-hidden bg-white shadow-sm p-1 gap-1">
                {(["stock", "upload", "prompt"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setImageMode(mode)}
                    className={`flex-1 py-2.5 text-xs sm:text-[12.5px] font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                      imageMode === mode
                        ? "bg-[#111827] text-white shadow-md"
                        : "bg-transparent text-[#374151] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <span>{mode === "stock" ? "🖼️" : mode === "upload" ? "📤" : "✨"}</span>
                    {mode === "stock" ? "스톡 이미지" : mode === "upload" ? "직접 업로드" : "AI 프롬프트 (사이즈)"}
                  </button>
                ))}
              </div>

              {/* 방식별 콘텐츠 */}
              <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E7EB] shadow-sm">
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

          <hr className="border-[#E5E7EB]" />

          {/* 6. 포인트 컬러 커스터마이징 */}
          <div className="space-y-3.5 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-base">🎨</span>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#111827]">포인트 컬러 변경</h3>
            </div>

            <div className="bg-white border-2 border-[#E5E7EB] rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex flex-wrap gap-2.5 items-center">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setUserInput("pickedColor", color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer shadow-sm ${
                      (userInputs.pickedColor || selectedTemplate.colors.accent) === color
                        ? "scale-115 border-black ring-2 ring-black/20"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={userInputs.pickedColor || selectedTemplate.colors.accent}
                  onChange={(e) => setUserInput("pickedColor", e.target.value)}
                  className="w-8 h-8 rounded-xl border-2 border-[#D1D5DB] cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>
      </motion.aside>
    </div>
  );
}
