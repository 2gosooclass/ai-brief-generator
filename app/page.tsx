"use client";

import { useState } from "react";
import { useBriefStore } from "@/store/briefStore";
import { motion, AnimatePresence } from "framer-motion";
import CategoryTabs from "@/components/CategoryTabs";
import TemplateGrid from "@/components/TemplateGrid";
import DetailPanel from "@/components/DetailPanel";
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

      {/* ── 히어로 배너 ── */}
      <section className="bg-gradient-to-br from-[#1C1410] via-[#2A1C12] to-[#1C1410] text-white py-12 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <div className="inline-flex items-center gap-2 bg-[#C8A97E]/15 border border-[#C8A97E]/25 rounded-full px-3.5 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C8A97E] animate-pulse" />
                <span className="text-[11px] font-pretendard text-[#C8A97E]">초보자도 5분이면 완성</span>
              </div>
              
              {/* 히어로 가이드북 숏컷 버튼 */}
              <button
                onClick={() => setIsGuideOpen(true)}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white rounded-full px-3.5 py-1.5 text-[11px] font-pretendard transition-colors"
              >
                <span>📖</span> 친절한 가이드 보기
              </button>
            </div>

            <h2 className="font-serif-kr text-3xl sm:text-4xl font-bold leading-tight mb-4">
              업종별 템플릿 선택 →<br />
              <span className="text-[#C8A97E]">바이브 코딩 프롬프트</span> 자동 생성
            </h2>

            <p className="font-pretendard text-sm text-white/65 leading-relaxed mb-6">
              카페, 학원, 개인 브랜드 등 업종에 맞는 검증된 웹사이트 구조를 선택하면,
              사용하시는 AI 에이전트(Antigravity, Codex, Hermes, Lovable, v0, Claude, Cursor 등)에 그대로 붙여넣을 수 있는 프롬프트가 자동으로 만들어집니다.
            </p>

            {/* 사용 흐름 */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-pretendard mb-6">
              {[
                { n: "1", t: "업종 선택" },
                { n: "2", t: "템플릿 클릭" },
                { n: "3", t: "옵션 설정" },
                { n: "4", t: "프롬프트 복사" },
                { n: "5", t: "AI에 붙여넣기" },
              ].map((step, i) => (
                <div key={step.n} className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#C8A97E] flex items-center justify-center text-[#1C1410] text-[9px] font-bold">
                    {step.n}
                  </div>
                  <span className="text-white/75">{step.t}</span>
                  {i < 4 && <span className="text-white/25">→</span>}
                </div>
              ))}
            </div>

            {/* ── 선택된 템플릿 동적 표시 ── */}
            <AnimatePresence>
              {selectedTemplate && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 backdrop-blur-sm"
                >
                  {/* 컬러 도트 */}
                  <div
                    className="w-8 h-8 rounded-lg shrink-0 border-2 border-white/20"
                    style={{ backgroundColor: selectedTemplate.colors.accent }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-white/50 font-pretendard">선택된 템플릿</p>
                    <p className="text-sm font-serif-kr text-white font-semibold leading-tight truncate">
                      {selectedTemplate.name}
                    </p>
                    <p className="text-[10px] text-white/60 font-pretendard truncate">
                      {selectedTemplate.tagline}
                    </p>
                  </div>
                  <button
                    onClick={openPanel}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#C8A97E] hover:bg-[#D4BA8C] text-[#1C1410] rounded-xl text-[11px] font-pretendard font-semibold transition-colors"
                  >
                    프롬프트 보기
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── 메인 콘텐츠 ── */}
      <main className="max-w-6xl mx-auto px-5 py-10">
        {/* 단계 1: 업종 선택 */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-full bg-[#C8A97E] flex items-center justify-center text-[#1C1410] text-xs font-bold font-pretendard shrink-0">
            1
          </div>
          <p className="text-sm font-pretendard font-semibold text-[#1C1410]">업종 카테고리 선택</p>
        </div>
        <CategoryTabs />

        {/* 단계 2: 템플릿 선택 */}
        <TemplateGrid />

        {/* 사용 가이드 */}
        <div className="mt-12 bg-white border border-[#E8E0D8] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-serif-kr text-base font-semibold text-[#1C1410]">사용 가이드</h3>
            {/* 가이드 전체보기 버튼 */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-xs font-pretendard text-[#C8A97E] hover:text-[#A08060] font-semibold flex items-center gap-1 transition-colors"
            >
              친절한 상세 설명서(전체) 읽기 <span>→</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: "🖱️", title: "템플릿 클릭", desc: "마음에 드는 카드를 클릭하면 오른쪽에 상세 패널이 열립니다. 구조가 다른 3종 레이아웃 중 선택하세요." },
              { icon: "⚙️", title: "옵션 설정", desc: "이미지 방식을 선택하고, 업체명·컬러·섹션 순서를 설정하면 프롬프트가 실시간으로 업데이트됩니다." },
              { icon: "📋", title: "프롬프트 복사", desc: "자동 생성된 프롬프트를 복사해서 사용하시는 AI 에이전트(Antigravity, Codex, Hermes, Lovable, v0, Claude, Cursor 등)에 붙여넣기 하세요." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-pretendard font-semibold text-[#1C1410] mb-1">{item.title}</p>
                  <p className="text-xs font-pretendard text-[#8C7A6A] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 메인 하단 구글 애드센스(Google AdSense) 광고 슬롯 영역 ── */}
        <div className="mt-8">
          <div className="bg-white border-2 border-dashed border-[#E8E0D8] rounded-2xl p-6 text-center hover:border-[#C8A97E]/30 transition-colors">
            <span className="text-[9px] tracking-widest text-[#A09080] font-bold uppercase block mb-1">Google AdSense Advertisements</span>
            <p className="text-xs text-[#8C7A6A] font-pretendard">
              여기에 광고 배너 코드를 연동하여 부가 수익(애드센스)을 올리실 수 있습니다.
            </p>
          </div>
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

      {/* 상세 패널 */}
      <DetailPanel />

      {/* 친절한 사용 설명서 모달 */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
