"use client";

import React, { useState } from "react";
import { useBriefStore } from "@/store/briefStore";
import PromptOutput from "./PromptOutput";
import LivePreviewRenderer from "./LivePreviewRenderer";

const COLOR_PRESETS = ["#1C1410", "#DC2626", "#D62828", "#0D9488", "#78350F", "#1E40AF", "#6D28D9", "#FF6B35"];

export default function LivePreviewModal() {
  const {
    selectedTemplate,
    isPanelOpen,
    closePanel,
    userInputs,
    setUserInput,
    resetPanel,
    navMenus,
    addNavMenu,
    removeNavMenu,
    updateNavMenu,
  } = useBriefStore();

  const [newMenuInput, setNewMenuInput] = useState("");
  const [editingMenuIndex, setEditingMenuIndex] = useState<number | null>(null);
  const [editingMenuValue, setEditingMenuValue] = useState("");

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuInput.trim()) return;
    addNavMenu(newMenuInput.trim().toUpperCase());
    setNewMenuInput("");
  };

  const handleStartEditMenu = (index: number, current: string) => {
    setEditingMenuIndex(index);
    setEditingMenuValue(current);
  };

  const handleSaveEditMenu = (index: number) => {
    if (editingMenuValue.trim()) {
      updateNavMenu(index, editingMenuValue.trim().toUpperCase());
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
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
            </div>
            <div className="flex-1 max-w-sm mx-auto bg-white rounded-lg px-3 py-1 text-[11px] text-[#888888] font-mono text-center truncate border border-[#E0E0E0]">
              https://preview.2gosoo.ai/{selectedTemplate.id}
            </div>
          </div>

          {/* 메인 뷰포트 (인터랙티브 렌더러) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
            <LivePreviewRenderer />
          </div>
        </div>
      </div>

      {/* ── 우측: 세부 커스터마이징 & 브리프 패널 ── */}
      <aside className="w-full max-w-md lg:max-w-lg xl:max-w-xl bg-[#FDFBF7] border-l-2 border-[#E5E7EB] shadow-2xl flex flex-col h-full z-10 text-left">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b-2 border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg shadow-sm border border-black/10 shrink-0"
              style={{ backgroundColor: userInputs.pickedColor || selectedTemplate.colors.accent }}
            />
            <div>
              <h2 className="text-base font-black text-[#111827] leading-tight font-serif-kr truncate max-w-[280px]">
                {userInputs.businessName || selectedTemplate.name}
              </h2>
              <p className="text-xs text-[#4B5563] font-medium truncate max-w-[280px]">
                {userInputs.description || selectedTemplate.tagline}
              </p>
            </div>
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

          {/* 2. 상단 네비게이션 메뉴 관리 (서브페이지 자동 편성 기준) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🧭</span>
                <h3 className="text-sm sm:text-[15px] font-bold text-[#111827]">상단 메뉴 & 서브페이지 관리</h3>
              </div>
              <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                서브페이지 자동 연동
              </span>
            </div>

            <div className="bg-white border-2 border-[#E5E7EB] rounded-2xl p-4 space-y-3 shadow-sm">
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                💡 등록된 메뉴 항목들을 기준으로 브리프의 <strong>서브페이지 상세 기획</strong>이 실시간 동기화됩니다.
              </p>

              {/* 메뉴 칩 목록 */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(navMenus && navMenus.length > 0 ? navMenus : ["MENU", "STORY", "RESERVATION", "LOCATION"]).map((menu, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F3F4F6] text-[#111827] border border-[#D1D5DB] shadow-sm hover:border-[#111827] transition-all"
                  >
                    {editingMenuIndex === idx ? (
                      <input
                        type="text"
                        value={editingMenuValue}
                        onChange={(e) => setEditingMenuValue(e.target.value)}
                        onBlur={() => handleSaveEditMenu(idx)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveEditMenu(idx)}
                        autoFocus
                        className="w-20 bg-white border border-black px-1.5 py-0.5 rounded text-xs outline-none uppercase"
                      />
                    ) : (
                      <span
                        onClick={() => handleStartEditMenu(idx, menu)}
                        className="cursor-pointer hover:underline"
                        title="클릭하여 이름 수정"
                      >
                        {menu}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeNavMenu(idx)}
                      className="w-4 h-4 rounded-full hover:bg-gray-300 flex items-center justify-center text-[10px] text-gray-500 hover:text-black cursor-pointer transition-colors"
                      title="삭제"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* 새 메뉴 추가 입력 폼 */}
              <form onSubmit={handleAddMenu} className="flex gap-2 pt-2 border-t border-gray-100">
                <input
                  type="text"
                  placeholder="새 메뉴 이름 (예: REVIEWS, FAQ)"
                  value={newMenuInput}
                  onChange={(e) => setNewMenuInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-bold rounded-xl border border-gray-300 focus:border-black outline-none bg-gray-50 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-transform hover:scale-102 shrink-0"
                >
                  + 메뉴 추가
                </button>
              </form>
            </div>
          </div>

          <hr className="border-[#E5E7EB]" />

          {/* 3. 기본 정보 설정 (순수 텍스트 입력) */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🏷️</span>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#111827]">기본 브랜드 정보</h3>
            </div>
            
            <div className="bg-white border-2 border-[#E5E7EB] rounded-2xl p-4 space-y-3.5 shadow-sm">
              {/* 업체명 */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">업체명 (사이트 타이틀)</label>
                <input
                  type="text"
                  placeholder="업체명 (예: 블루문 카페)"
                  value={userInputs.businessName}
                  onChange={(e) => setUserInput("businessName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D1D5DB] focus:border-[#111827] text-xs sm:text-sm font-bold text-[#111827] outline-none shadow-sm"
                />
              </div>

              {/* 메인 한줄 소개 */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-[13px] font-bold text-[#111827] block">메인 한줄 소개</label>
                <input
                  type="text"
                  placeholder="한줄 소개 (예: 제주의 바람을 담은 핸드드립 카페)"
                  value={userInputs.description}
                  onChange={(e) => setUserInput("description", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D1D5DB] focus:border-[#111827] text-xs sm:text-sm font-medium text-[#111827] outline-none shadow-sm"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D1D5DB] focus:border-[#111827] text-xs sm:text-sm font-medium text-[#111827] outline-none shadow-sm"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#E5E7EB]" />

          {/* 4. 포인트 컬러 커스터마이징 */}
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
                  className="w-9 h-9 rounded-full border-0 p-0 cursor-pointer overflow-hidden shadow-sm"
                />
              </div>
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
}
