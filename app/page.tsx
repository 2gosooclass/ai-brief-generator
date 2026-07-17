"use client";

import { useState } from "react";
import { useBriefStore } from "@/store/briefStore";
import { motion, AnimatePresence } from "framer-motion";
import CategoryTabs from "@/components/CategoryTabs";
import TemplateGrid from "@/components/TemplateGrid";
import LivePreviewModal from "@/components/LivePreviewModal";
import GuideModal from "@/components/GuideModal";

export default function Home() {
  const { selectedTemplate, openPanel } = useBriefStore();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">

      {/* ── STICKY 헤더 ── */}
      <header className="border-b border-[#E8E0D8] bg-white/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1C1410] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="font-serif-kr text-sm font-semibold text-[#1C1410] leading-tight">
                AI 웹사이트 브리프 생성기
              </h1>
              <p className="text-[10px] text-[#8C7A6A] font-pretendard">by 2GOSOO AI LAB</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 가이드북 버튼 */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F0EA] hover:bg-[#E8D5B7] text-[#5C4A3A] hover:text-[#1C1410] rounded-xl text-[10px] font-pretendard font-semibold transition-colors"
            >
              <span>📖</span> 가이드북 읽기
            </button>

            <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-pretendard text-[#A09080]">
              {["Antigravity", "Codex", "Hermes", "Lovable", "v0"].map((tool) => (
                <span key={tool} className="px-2 py-1 bg-[#F5F0EA] rounded-lg">{tool}</span>
              ))}
              <span className="text-[#C8A97E] ml-1">등 AI 에이전트에 바로 붙여넣기</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── 히어로 배너: 비대칭 2단 분할 구조 (Swiss Editorial Style) ── */}
      <section className="border-b border-[#E8E0D8]/60 py-16 md:py-24 px-6 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* 좌측 7열: 타이포그래피 & 소개글 */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 border border-[#C8A97E]/30 bg-[#FDF8F3] px-3.5 py-1.5 rounded-full w-fit mb-6 text-[10px] font-pretendard text-[#C8A97E] tracking-wider uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E] animate-pulse" />
              <span>Vibe Coding Prompt Engine</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-7xl font-light leading-[1.05] tracking-tight mb-6 text-[#1C1410]">
              Architect your layout <br />
              <span className="font-instrument italic text-5xl sm:text-6xl md:text-8xl text-[#C8A97E] mr-2">in 5 minutes</span>
              <span className="font-serif-kr font-normal text-3xl sm:text-4xl block mt-2 text-[#1C1410]">바이브 코딩 프롬프트 생성기</span>
            </h2>

            <p className="font-pretendard text-sm md:text-base text-[#8C7A6A] leading-relaxed max-w-xl">
              카페, 학원, 개인 포트폴리오 등 검증된 업종별 레이아웃을 기반으로 고품질의 프롬프트를 자동 설계합니다. 생성된 아키텍처 코드를 Lovable, v0, Claude Code 등의 AI 에이전트에 바로 붙여넣어 완결성 높은 웹사이트를 신속하게 구현하십시오.
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
                  className="w-full max-w-md bg-white border border-[#E8E0D8] rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A97E]/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div>
                    <span className="text-[10px] text-[#A09080] uppercase tracking-widest font-semibold block mb-3">Active Spec</span>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div
                        className="w-11 h-11 rounded-lg shrink-0 border border-[#E8E0D8] shadow-sm"
                        style={{ backgroundColor: selectedTemplate.colors.accent }}
                      />
                      <div className="min-w-0">
                        <h3 className="font-serif-kr text-base font-bold text-[#1C1410] leading-tight truncate">
                          {selectedTemplate.name}
                        </h3>
                        <p className="text-[11px] font-pretendard text-[#8C7A6A] leading-tight truncate mt-0.5">
                          {selectedTemplate.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={openPanel}
                    className="w-full py-3 bg-[#1C1410] hover:bg-[#3A2D27] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View System Prompt</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-md bg-white border border-[#E8E0D8]/60 rounded-xl p-8 text-center text-xs text-[#8C7A6A] flex flex-col items-center justify-center min-h-[220px]"
                >
                  <p className="mb-2">아래에서 업종 템플릿을 선택하여</p>
                  <p className="font-serif-kr text-sm text-[#1C1410] font-medium">프롬프트 빌드 아키텍처를 활성화하십시오.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ── 메인 콘텐츠: 2단 비대칭 Split 구조 (FLOWSTATE 골격) ── */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        
        {/* 좌측 4열: 카테고리 선택 및 사용 가이드 (스크롤 추적 Sticky) */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="md:sticky md:top-24 space-y-10">
            
            {/* Step 01: 업종 선택 */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-[#C8A97E] font-semibold tracking-widest uppercase block mb-1">Step 01</span>
                <h3 className="font-serif-kr text-lg font-bold text-[#1C1410]">업종 카테고리</h3>
                <p className="text-[11px] text-[#8C7A6A] leading-relaxed mt-0.5">제작 목적에 부합하는 업종 구조를 선택해 주십시오.</p>
              </div>
              <CategoryTabs />
            </div>

            {/* 사용 가이드 컴팩트 리뉴얼 */}
            <div className="pt-8 border-t border-[#E8E0D8]/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#C8A97E] font-semibold tracking-widest uppercase">Documentation</span>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="text-[10px] font-pretendard text-[#C8A97E] hover:text-[#A08060] font-semibold transition-colors"
                >
                  상세 설명서 📖
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "템플릿 선택", desc: "우측 그리드에서 카드를 선택해 상세 옵션 패널을 엽니다." },
                  { title: "옵션 조율", desc: "브랜드명, 커스텀 컬러, 섹션 배치 순서를 설계합니다." },
                  { title: "프롬프트 복사", desc: "사출된 원천 코드를 AI 요원(Lovable, v0 등)에 주입합니다." },
                ].map((item, i) => (
                  <div key={item.title} className="flex gap-2">
                    <span className="text-[10px] font-bold text-[#C8A97E] font-pretendard shrink-0 mt-0.5">0{i+1}.</span>
                    <div>
                      <p className="text-xs font-pretendard font-semibold text-[#1C1410]">{item.title}</p>
                      <p className="text-[10px] font-pretendard text-[#8C7A6A] leading-normal mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 우측 8열: 템플릿 그리드 */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          <div>
            <span className="text-[10px] text-[#C8A97E] font-semibold tracking-widest uppercase block mb-1">Step 02</span>
            <h3 className="font-serif-kr text-lg font-bold text-[#1C1410] mb-4">구조적 템플릿</h3>
          </div>
          <TemplateGrid />
        </div>

      </main>

      {/* ── 푸터 ── */}
      <footer className="border-t border-[#E8E0D8] bg-white py-5 px-5 mt-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs font-pretendard text-[#A09080]">
            © 2026 2GOSOO AI LAB. AI 웹사이트 브리프 생성기.
          </p>
          <div className="flex items-center gap-3 text-[11px] font-pretendard text-[#A09080]">
            <span>Photos by Unsplash</span>
            <span>·</span>
            <span>Built with Next.js + Tailwind</span>
          </div>
        </div>
      </footer>

      {/* 상세 패널 및 풀스크린 라이브 프리뷰 */}
      <LivePreviewModal />

      {/* 친절한 사용 설명서 모달 */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
