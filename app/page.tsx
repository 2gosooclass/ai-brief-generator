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
    <div className="min-h-screen bg-[#FAFAF7] relative flex flex-col justify-between overflow-x-hidden font-pretendard text-[#1C1410]">

      {/* ── STICKY 헤더 ── */}
      <header className="border-b border-[#E8E0D8]/60 bg-[#FAFAF7]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1C1410] flex items-center justify-center shadow-sm">
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F0EA] hover:bg-[#E8D5B7] text-[#5C4A3A] hover:text-[#1C1410] rounded-xl text-[10px] font-pretendard font-semibold transition-colors cursor-pointer"
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

      {/* ── 심플 프리미엄 에디토리얼 히어로 배너 ── */}
      <section className="relative py-14 md:py-20 px-6 bg-[#FAFAF7] border-b border-[#E8E0D8]/60 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center relative z-10 w-full">
          
          {/* 좌측 7열: 타이포그래피 & 소개글 */}
          <div className="md:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 border border-[#C8A97E]/30 bg-[#FDF8F3] text-[#C8A97E] px-3 py-1 rounded-full text-[10px] font-pretendard tracking-wider uppercase font-semibold mb-5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E] animate-pulse" />
              <span>Vibe Coding Prompt Engine</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light leading-[1.15] tracking-tight mb-5 text-[#1C1410] font-serif-kr">
              완벽한 웹사이트 아키텍처를 <br />
              <span className="font-instrument italic text-4xl sm:text-5xl md:text-6xl text-[#C8A97E] mr-2">5분 만에 기획</span>
              <span className="block mt-1 text-2xl sm:text-3xl font-normal text-[#1C1410]">AI 브리프 자동 생성</span>
            </h2>

            <p className="font-pretendard text-xs sm:text-sm text-[#8C7A6A] leading-relaxed max-w-xl">
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
                  className="w-full max-w-md rounded-2xl p-6 shadow-lg bg-white border border-[#E8E0D8] text-[#1C1410] relative overflow-hidden flex flex-col justify-between min-h-[200px]"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-semibold block mb-3 text-[#A09080]">
                      선택된 템플릿
                    </span>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div
                        className="w-11 h-11 rounded-xl shrink-0 shadow-sm border border-[#E8E0D8]"
                        style={{ backgroundColor: selectedTemplate.colors.accent }}
                      />
                      <div className="min-w-0">
                        <h3 className="font-serif-kr text-base font-bold leading-tight truncate text-[#1C1410]">
                          {selectedTemplate.name}
                        </h3>
                        <p className="text-[11px] font-pretendard leading-tight truncate mt-1 text-[#8C7A6A]">
                          {selectedTemplate.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={openPanel}
                    className="w-full py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-[#1C1410] hover:bg-[#3A2D27] text-white shadow"
                  >
                    <span>프롬프트 및 세부 설정 열기</span>
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
                  className="w-full max-w-md rounded-2xl p-8 text-center text-xs flex flex-col items-center justify-center min-h-[200px] bg-white border border-[#E8E0D8]/80 text-[#8C7A6A] shadow-sm"
                >
                  <p className="mb-1 text-[#8C7A6A]">아래 목록에서 디자인 템플릿을 선택하시면</p>
                  <p className="font-serif-kr text-sm font-semibold text-[#1C1410]">
                    즉시 시스템 프롬프트가 조립됩니다.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ── 메인 콘텐츠: 템플릿 그리드 & 사이드 가이드 ── */}
      <div className="border-t border-[#E8E0D8]/60 bg-[#FAFAF7]">
        <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* 좌측 4열: 사용 가이드 */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="md:sticky md:top-24 space-y-8 text-left">
              
              <div className="space-y-3">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-[#C8A97E] block">Guide</span>
                <h3 className="font-serif-kr text-base font-bold text-[#1C1410]">사용 방법</h3>
                <p className="text-[11px] leading-relaxed text-[#8C7A6A]">
                  우측 목록에서 마음에 드는 디자인 카드를 클릭하세요. 상세 설정 창에서 브랜드명과 레퍼런스, 이미지 비율을 정하고 프롬프트를 복사하여 AI 에이전트에 붙여넣으면 됩니다.
                </p>
              </div>

              {/* 간단 단계 안내 */}
              <div className="pt-6 border-t border-[#E8E0D8]/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-[#C8A97E]">Workflow</span>
                  <button
                    onClick={() => setIsGuideOpen(true)}
                    className="text-[10px] font-pretendard font-semibold text-[#C8A97E] hover:text-[#A08060] transition-colors cursor-pointer"
                  >
                    상세 가이드 📖
                  </button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { title: "템플릿 선택", desc: "우측 그리드에서 카드를 선택해 상세 설정 패널을 엽니다." },
                    { title: "옵션 조율", desc: "브랜드명, 레퍼런스 URL/스크린샷, 이미지 비율을 설정합니다." },
                    { title: "프롬프트 복사/다운로드", desc: "사출된 마크다운을 복사하거나 .md 파일로 저장합니다." },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-2 items-start">
                      <span className="text-xs text-[#C8A97E] shrink-0 mt-0.5">✦</span>
                      <div>
                        <p className="text-xs font-pretendard font-semibold text-[#1C1410]">{item.title}</p>
                        <p className="text-[10px] font-pretendard leading-normal mt-0.5 text-[#8C7A6A]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* 우측 8열: 템플릿 그리드 */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6 text-left">
            <div>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#C8A97E] block mb-1">Templates</span>
              <h3 className="font-serif-kr text-lg font-bold text-[#1C1410]">구조적 템플릿 컬렉션</h3>
            </div>
            <TemplateGrid />
          </div>

        </main>
      </div>

      {/* ── 푸터 ── */}
      <footer className="border-t border-[#E8E0D8]/80 py-5 px-5 bg-[#FAFAF7] text-[#A09080]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs font-pretendard">
            © 2026 2GOSOO AI LAB. AI 웹사이트 브리프 생성기.
          </p>
          <div className="flex items-center gap-3 text-[11px] font-pretendard">
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
