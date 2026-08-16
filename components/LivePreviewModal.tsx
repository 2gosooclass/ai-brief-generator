"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBriefStore } from "@/store/briefStore";
import UnsplashPreview from "./UnsplashPreview";
import ImageUploader from "./ImageUploader";
import AiImagePromptGenerator from "./AiImagePromptGenerator";
import PromptOutput from "./PromptOutput";
import LivePreviewRenderer from "./LivePreviewRenderer";
import type { ModifyOptions } from "@/lib/types";

const COLOR_PRESETS = ["#1C1410", "#2C6BAD", "#D4AF70", "#E5989B", "#2D6A4F", "#7C3AED", "#FF6B35"];

export default function LivePreviewModal() {
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
    <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm">
      {/* ── 좌측: 실시간 풀사이즈 미리보기 ── */}
      <div className="flex-1 flex flex-col p-4 lg:p-6 min-w-0">
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
        className="w-full max-w-md bg-[#FAFAF7] border-l border-[#E8E0D8] shadow-2xl flex flex-col shrink-0 text-left"
      >
        {/* 헤더 */}
        <div className="shrink-0 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-[#E8E0D8] px-5 py-3.5 flex items-center gap-3">
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
            className="w-7 h-7 rounded-full bg-[#F0EAE2] hover:bg-[#E8DDD5] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-[#5C4A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto">

          {/* 1. 자동 생성 브리프 프롬프트 항상 최상단 노출 */}
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-pretendard font-semibold text-[#1C1410] flex items-center gap-1.5">
                <span>⚡</span> 자동 생성 브리프
              </h3>
              <span className="text-[9px] font-pretendard text-[#C8A97E] bg-[#FDF8F3] px-2 py-0.5 rounded-full border border-[#E8D8C0]">
                실시간 동기화
              </span>
            </div>
            <PromptOutput compact />
          </div>

          <div className="mx-5 border-t border-[#E8E0D8]" />

          {/* 2. 브랜드 로고 및 기본 정보 설정 */}
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🏷️</span>
              <h3 className="text-xs font-pretendard font-semibold text-[#1C1410]">기본 정보 및 로고 설정</h3>
            </div>
            
            <div className="bg-white border border-[#E8E0D8] rounded-2xl p-4 space-y-3 shadow-sm">
              {/* 로고 업로드 */}
              <div className="space-y-1">
                <label className="text-[10px] text-[#8C7A6A] font-pretendard font-medium block">브랜드 로고 이미지</label>
                <div className="flex items-center gap-2">
                  {logoUrl ? (
                    <div className="relative w-12 h-12 rounded-xl border border-[#E0D8D0] bg-white flex items-center justify-center overflow-hidden shrink-0">
                      <img src={logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogoUrl(null);
                        }}
                        className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-[10px] transition-colors cursor-pointer"
                      >
                        삭제
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex flex-col items-center justify-center h-12 border border-dashed border-[#E0D8D0] hover:border-[#C8A97E] rounded-xl cursor-pointer bg-[#FAF8F5] transition-colors">
                      <span className="text-[10px] font-pretendard text-[#8C7A6A] flex items-center gap-1.5 font-medium">📤 로고 파일 업로드 (PNG, SVG)</span>
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
              <div className="space-y-1">
                <label className="text-[10px] text-[#8C7A6A] font-pretendard font-medium block">업체명 (사이트 타이틀)</label>
                <input
                  type="text"
                  placeholder="업체명 (예: 블루문 카페)"
                  value={userInputs.businessName}
                  onChange={(e) => setUserInput("businessName", e.target.value)}
                  className="w-full px-3 py-2 text-xs font-pretendard rounded-xl border border-[#E0D8D0] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/30"
                />
              </div>

              {/* 한줄 소개 */}
              <div className="space-y-1">
                <label className="text-[10px] text-[#8C7A6A] font-pretendard font-medium block">메인 한줄 소개</label>
                <textarea
                  placeholder="한줄 소개 (예: 제주의 바람을 담은 핸드드립 카페)"
                  value={userInputs.description}
                  onChange={(e) => setUserInput("description", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs font-pretendard rounded-xl border border-[#E0D8D0] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/30 resize-none"
                />
              </div>

              {/* 연락처 */}
              <div className="space-y-1">
                <label className="text-[10px] text-[#8C7A6A] font-pretendard font-medium block">하단 연락처 (이메일/전화번호)</label>
                <input
                  type="text"
                  placeholder="연락처 (예: 010-1234-5678)"
                  value={userInputs.contact}
                  onChange={(e) => setUserInput("contact", e.target.value)}
                  className="w-full px-3 py-2 text-xs font-pretendard rounded-xl border border-[#E0D8D0] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/30"
                />
              </div>
            </div>
          </div>

          <div className="mx-5 border-t border-[#E8E0D8]" />

          {/* 3. 🧭 상단 네비게이션 메뉴 수정 & 추가 섹션 */}
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🧭</span>
                <h3 className="text-xs font-pretendard font-semibold text-[#1C1410]">상단 메뉴 수정 & 추가</h3>
              </div>
              <span className="text-[9.5px] font-pretendard text-[#8C7A6A]">
                총 {navMenus.length}개 항목
              </span>
            </div>

            <div className="bg-white border border-[#E8E0D8] rounded-2xl p-3.5 space-y-3 shadow-sm">
              <p className="text-[10px] font-pretendard text-[#8C7A6A] leading-tight">
                💡 메뉴 이름을 클릭하여 수정하거나, 우측 삭제(✕) 및 하단 입력창을 통해 새 메뉴를 추가할 수 있습니다.
              </p>

              {/* 현재 메뉴 뱃지 목록 */}
              <div className="flex flex-wrap gap-2">
                {navMenus.map((menu, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E0D8D0] text-xs font-pretendard font-medium text-[#1C1410]"
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
                        className="w-20 px-1 py-0.5 text-xs font-bold rounded bg-white border border-[#C8A97E] outline-none"
                      />
                    ) : (
                      <span
                        onClick={() => handleStartEditMenu(idx, menu)}
                        title="클릭하여 수정"
                        className="cursor-pointer hover:text-[#C8A97E] transition-colors"
                      >
                        {menu}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeNavMenu(idx)}
                      title="메뉴 삭제"
                      className="text-[#A09080] hover:text-red-500 transition-colors ml-1 text-[11px] cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* 새 메뉴 추가 폼 */}
              <form onSubmit={handleAddMenu} className="flex gap-2 pt-1 border-t border-[#F0EAE2]">
                <input
                  type="text"
                  placeholder="새 메뉴 이름 (예: REVIEWS)"
                  value={newMenuInput}
                  onChange={(e) => setNewMenuInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs font-pretendard rounded-lg border border-[#E0D8D0] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/30 placeholder:text-[#C0B8B0]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#1C1410] hover:bg-[#3A2D27] text-white rounded-lg text-xs font-pretendard font-semibold transition-all cursor-pointer shrink-0"
                >
                  + 메뉴 추가
                </button>
              </form>
            </div>
          </div>

          <div className="mx-5 border-t border-[#E8E0D8]" />

          {/* 4. 레퍼런스 웹사이트 & 스크린샷 설정 */}
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">📎</span>
              <h3 className="text-xs font-pretendard font-semibold text-[#1C1410]">레퍼런스 및 스타일</h3>
            </div>
            
            <div className="bg-white border border-[#E8E0D8] rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="space-y-1">
                <label className="text-[10px] text-[#8C7A6A] font-pretendard font-medium block">레퍼런스 웹사이트 URL</label>
                <input
                  type="url"
                  placeholder="예: https://awwwards.com/site-example"
                  value={userInputs.referenceUrl}
                  onChange={(e) => setUserInput("referenceUrl", e.target.value)}
                  className="w-full px-3 py-2 text-xs font-pretendard rounded-xl border border-[#E0D8D0] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#8C7A6A] font-pretendard font-medium block">레퍼런스 스크린샷</label>
                <div className="flex items-center gap-2">
                  {referenceScreenshotUrl ? (
                    <div className="relative w-12 h-12 rounded-xl border border-[#E0D8D0] bg-white flex items-center justify-center overflow-hidden shrink-0">
                      <img src={referenceScreenshotUrl} alt="Reference Preview" className="max-w-full max-h-full object-contain" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReferenceScreenshotUrl(null);
                        }}
                        className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-[10px] transition-colors cursor-pointer"
                      >
                        삭제
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex flex-col items-center justify-center h-12 border border-dashed border-[#E0D8D0] hover:border-[#C8A97E] rounded-xl cursor-pointer bg-[#FAF8F5] transition-colors">
                      <span className="text-[10px] font-pretendard text-[#8C7A6A] flex items-center gap-1.5 font-medium">📤 스크린샷 업로드 (PNG, JPG)</span>
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

          <div className="mx-5 border-t border-[#E8E0D8]" />

          {/* 5. 🖼️ 대표 비주얼 및 생성형 AI 이미지 규격/프롬프트 설정 (3단 탭) */}
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🖼️</span>
              <h3 className="text-xs font-pretendard font-semibold text-[#1C1410]">대표 비주얼 & AI 이미지 생성 규격</h3>
            </div>

            <div className="space-y-3">
              {/* 방식 토글 (3단 탭) */}
              <div className="flex rounded-xl border border-[#E0D8D0] overflow-hidden bg-[#FAF8F5]">
                {(["stock", "upload", "prompt"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setImageMode(mode)}
                    className={`flex-1 py-2 text-[11px] font-pretendard font-medium transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                      imageMode === mode
                        ? "bg-[#1C1410] text-white shadow-sm"
                        : "bg-white text-[#5C4A3A] hover:bg-[#F5F0EA]"
                    }`}
                  >
                    <span>{mode === "stock" ? "🖼️" : mode === "upload" ? "📤" : "✨"}</span>
                    {mode === "stock" ? "스톡 이미지" : mode === "upload" ? "직접 업로드" : "AI 프롬프트 (사이즈/규격)"}
                  </button>
                ))}
              </div>

              {/* 방식별 콘텐츠 */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E0D8] shadow-sm">
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

          {/* 6. 포인트 컬러 커스터마이징 */}
          <div className="px-5 py-4 space-y-3 mb-6">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🎨</span>
              <h3 className="text-xs font-pretendard font-semibold text-[#1C1410]">포인트 컬러 변경</h3>
            </div>

            <div className="bg-white border border-[#E8E0D8] rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex flex-wrap gap-2 items-center">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setUserInput("pickedColor", color)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      (userInputs.pickedColor || selectedTemplate.colors.accent) === color
                        ? "scale-115 border-black shadow"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={userInputs.pickedColor || selectedTemplate.colors.accent}
                  onChange={(e) => setUserInput("pickedColor", e.target.value)}
                  className="w-7 h-7 rounded-lg border border-[#E0D8D0] cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>
      </motion.aside>
    </div>
  );
}
