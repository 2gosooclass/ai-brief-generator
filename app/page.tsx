"use client";

import { useState } from "react";
import { useBriefStore } from "@/store/briefStore";
import { motion, AnimatePresence } from "framer-motion";

import TemplateGrid from "@/components/TemplateGrid";
import LivePreviewModal from "@/components/LivePreviewModal";
import GuideModal from "@/components/GuideModal";

export default function Home() {
  const { selectedTemplate, openPanel } = useBriefStore();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative flex flex-col justify-between overflow-x-hidden font-pretendard text-[#111827]">

      {/* ── STICKY 헤더 ── */}
      <header className="border-b-2 border-[#E5E7EB] bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#111827] flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="font-serif-kr text-base sm:text-lg font-bold text-[#111827] leading-tight">
                AI 웹사이트 브리프 생성기
              </h1>
              <p className="text-xs font-semibold text-[#4B5563]">by 2GOSOO AI LAB</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 가이드북 버튼 */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-[#111827] rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm border border-gray-300"
            >
              <span>📖</span> 가이드북 읽기
            </button>

            <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[#4B5563]">
              {["Antigravity", "Codex", "Hermes", "Lovable", "v0"].map((tool) => (
                <span key={tool} className="px-2.5 py-1 bg-gray-100 rounded-lg border border-gray-200 text-[#1F2937]">{tool}</span>
              ))}
              <span className="text-amber-800 font-bold ml-1">등 AI 에이전트 완벽 호환</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── 심플 프리미엄 에디토리얼 히어로 배너 ── */}
      <section className="relative py-12 md:py-16 px-6 bg-[#FDFBF7] border-b-2 border-[#E5E7EB] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center relative z-10 w-full">
          
          {/* 좌측 7열: 타이포그래피 & 소개글 */}
          <div className="md:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 border-2 border-amber-300 bg-amber-50 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-4 w-fit shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Vibe Coding Prompt Engine</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.2] tracking-tight mb-4 text-[#111827] font-serif-kr">
              완벽한 웹사이트 아키텍처를 <br />
              <span className="font-instrument italic text-4xl sm:text-5xl md:text-6xl text-amber-700 mr-2">5분 만에 기획</span>
              <span className="block mt-1 text-2xl sm:text-3xl font-bold text-[#111827]">AI 브리프 자동 생성</span>
            </h2>

            <p className="font-pretendard text-sm sm:text-base font-medium text-[#374151] leading-relaxed max-w-xl">
              원하는 디자인 템플릿을 선택하고 브랜드명과 레퍼런스를 지정하면, Lovable, v0, Claude Code, Cursor 등 모든 AI 에이전트에 즉시 입력할 수 있는 최적화된 마크다운(.md) 브리프와 이미지 생성 프롬프트가 자동으로 완성됩니다.
            </p>
          </div>

          {/* 우측 5열: 선택된 템플릿의 간략 정보 */}
          <div className="md:col-span-5 flex justify-end">
            <AnimatePresence mode="wait">
              {selectedTemplate ? (
                <motion.div
                  key={selectedTemplate.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-md rounded-2xl p-6 shadow-xl bg-white border-2 border-[#E5E7EB] text-[#111827] relative overflow-hidden flex flex-col justify-between min-h-[210px]"
                >
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold block mb-2 text-[#4B5563]">
                      선택된 템플릿
                    </span>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl shrink-0 shadow-md border-2 border-black/10"
                        style={{ backgroundColor: selectedTemplate.colors.accent }}
                      />
                      <div className="min-w-0">
                        <h3 className="font-serif-kr text-lg font-bold leading-tight truncate text-[#111827]">
                          {selectedTemplate.name}
                        </h3>
                        <p className="text-xs font-semibold leading-tight truncate mt-1 text-[#4B5563]">
                          {selectedTemplate.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={openPanel}
                    className="w-full py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer bg-[#111827] hover:bg-[#374151] text-white shadow-md"
                  >
                    <span>프롬프트 및 세부 설정 열기</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-md rounded-2xl p-8 text-center text-xs flex flex-col items-center justify-center min-h-[210px] bg-white border-2 border-[#E5E7EB] text-[#4B5563] shadow-md"
                >
                  <p className="mb-2 text-sm font-medium text-[#4B5563]">아래 목록에서 디자인 템플릿을 선택하시면</p>
                  <p className="font-serif-kr text-base font-bold text-[#111827]">
                    즉시 시스템 프롬프트가 조립됩니다.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ── 메인 콘텐츠: 템플릿 그리드 & 사이드 가이드 ── */}
      <div className="border-t border-[#E5E7EB] bg-[#FDFBF7]">
        <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* 좌측 4열: 사용 가이드 */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="md:sticky md:top-24 space-y-8 text-left">
              
              <div className="space-y-3 bg-white p-5 rounded-2xl border-2 border-[#E5E7EB] shadow-sm">
                <span className="text-xs font-bold tracking-widest uppercase text-amber-800 block">Guide</span>
                <h3 className="font-serif-kr text-base sm:text-lg font-bold text-[#111827]">사용 방법</h3>
                <p className="text-xs sm:text-[13px] leading-relaxed font-medium text-[#374151]">
                  우측 목록에서 마음에 드는 디자인 카드를 클릭하세요. 상세 설정 창에서 브랜드명과 레퍼런스, 이미지 비율을 정하고 프롬프트를 복사하여 AI 에이전트에 붙여넣으면 됩니다.
                </p>
              </div>

              {/* 간단 단계 안내 */}
              <div className="space-y-3 bg-white p-5 rounded-2xl border-2 border-[#E5E7EB] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold tracking-widest uppercase text-amber-800">Workflow</span>
                  <button
                    onClick={() => setIsGuideOpen(true)}
                    className="text-xs font-bold text-[#111827] hover:underline"
                  >
                    자세히 보기 &rarr;
                  </button>
                </div>

                <div className="space-y-3 text-xs sm:text-[13px] text-[#1F2937]">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    <p className="font-semibold">템플릿 선택 및 브랜드 정보 입력</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    <p className="font-semibold">생성형 AI 이미지 규격 및 프롬프트 생성</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                    <p className="font-semibold">상단 네비게이션 메뉴 수정 및 추가</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-bold shrink-0">4</span>
                    <p className="font-semibold">브리프 프롬프트 복사 후 AI 코딩 도구에 전송</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 우측 8열: 카테고리 탭 & 템플릿 카드 그리드 */}
          <div className="md:col-span-8 lg:col-span-9">
            <TemplateGrid />
          </div>

        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t-2 border-[#E5E7EB] bg-white py-10 px-6 text-center text-xs sm:text-sm font-semibold text-[#4B5563]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 2GOSOO AI LAB. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => setIsGuideOpen(true)} className="hover:text-[#111827] transition-colors cursor-pointer">
              프롬프트 가이드북
            </button>
            <a href="https://github.com/2gosooclass" target="_blank" rel="noopener noreferrer" className="hover:text-[#111827] transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* ── 모달 레이어 ── */}
      <LivePreviewModal />
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

    </div>
  );
}
