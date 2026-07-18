"use client";

import { useState } from "react";
import { useBriefStore } from "@/store/briefStore";
import { motion, AnimatePresence } from "framer-motion";
import CategoryTabs from "@/components/CategoryTabs";
import TemplateGrid from "@/components/TemplateGrid";
import LivePreviewModal from "@/components/LivePreviewModal";
import GuideModal from "@/components/GuideModal";

interface VideoData {
  url: string;
  label: string;
}

const VIDEOS: VideoData[] = [
  {
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4",
    label: "Golden Hour"
  },
  {
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4",
    label: "Still Water"
  },
  {
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4",
    label: "Deep Woods"
  },
  {
    url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4",
    label: "Quiet Dawn"
  }
];

export default function Home() {
  const { selectedTemplate, openPanel } = useBriefStore();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleVideoSwitch = (index: number) => {
    if (index === activeVideo || isTransitioning) return;
    setActiveVideo(index);
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const isDarkTheme = activeVideo === 2; // Deep Woods (3rd video, index 2)

  return (
    <div className="min-h-screen bg-black relative flex flex-col justify-between overflow-x-hidden">

      {/* ── STICKY 헤더 ── */}
      <header className="border-b border-[#E8E0D8]/60 bg-[#FAFAF7]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">
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

      {/* ── 히어로 배너: 비대칭 2단 분할 구조 + 시네마틱 백그라운드 ── */}
      <section className="relative py-16 md:py-24 px-6 overflow-hidden min-h-[460px] flex items-center">
        
        {/* 1. Background Video Layer (brightness & contrast 조율로 가독성 강제 확보) */}
        <div className="absolute inset-0 z-0">
          {VIDEOS.map((vid, idx) => (
            <video
              key={vid.url}
              autoPlay
              muted
              loop
              playsInline
              style={{ filter: "brightness(0.35) contrast(1.05) saturate(0.65)" }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out select-none pointer-events-none ${
                idx === activeVideo ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src={vid.url} type="video/mp4" />
            </video>
          ))}
          {/* 비디오 바로 위 가독성 전용 다크 그라데이션 마스크 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/35 pointer-events-none z-10" />
        </div>

        {/* 2. Figma PNG Texture Overlay (가독성 방해 최소화를 위해 opacity 15%로 대폭 하향) */}
        <img
          src="https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png"
          alt="Figma Texture Overlay"
          className="absolute inset-0 z-10 w-full h-full object-cover pointer-events-none animate-train-bob opacity-15"
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center relative z-20 w-full">
          
          {/* 좌측 7열: 타이포그래피 & 소개글 (드롭 섀도우를 통한 초강력 시인성 확보) */}
          <div className="md:col-span-7 flex flex-col justify-center transition-colors duration-700">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className={`inline-flex items-center gap-2 border px-3.5 py-1.5 rounded-full text-[10px] font-pretendard tracking-wider uppercase font-semibold transition-all duration-700 ${
                isDarkTheme
                  ? "border-[#182C41]/30 bg-[#182C41]/10 text-[#182C41]"
                  : "border-white/20 bg-white/5 text-white/90"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDarkTheme ? "bg-[#182C41]" : "bg-white"}`} />
                <span>Vibe Coding Prompt Engine</span>
              </div>

              {/* Video Switcher */}
              <div className={`flex items-center gap-1.5 rounded-full p-1 border transition-all duration-700 ${
                isDarkTheme ? "bg-[#182C41]/10 border-[#182C41]/20" : "bg-black/30 border-white/10"
              }`}>
                {VIDEOS.map((vid, idx) => (
                  <button
                    key={vid.label}
                    onClick={() => handleVideoSwitch(idx)}
                    className={`text-[9px] font-pretendard font-bold uppercase px-2.5 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeVideo
                        ? isDarkTheme
                          ? "bg-[#182C41] text-white"
                          : "bg-white text-black"
                        : isDarkTheme
                        ? "text-[#182C41]/60 hover:text-[#182C41]"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {vid.label}
                  </button>
                ))}
              </div>
            </div>

            <h2 className={`text-4xl sm:text-5xl md:text-7xl font-light leading-[1.05] tracking-tight mb-6 transition-colors duration-700 drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] ${
              isDarkTheme ? "text-[#182C41]" : "text-white"
            }`}>
              Architect your layout <br />
              <span className={`font-instrument italic text-5xl sm:text-6xl md:text-8xl mr-2 transition-colors duration-700 ${
                isDarkTheme ? "text-[#182C41]/90" : "text-[#F5C88E] drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              }`}>in 5 minutes</span>
              <span className={`font-serif-kr font-normal text-3xl sm:text-4xl block mt-2 transition-colors duration-700 ${
                isDarkTheme ? "text-[#182C41]" : "text-white"
              }`}>바이브 코딩 프롬프트 생성기</span>
            </h2>

            <p className={`font-pretendard text-sm md:text-base leading-relaxed max-w-xl transition-colors duration-700 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${
              isDarkTheme ? "text-[#182C41]/80" : "text-white/85"
            }`}>
              카페, 학원, 개인 포트폴리오 등 검증된 업종별 레이아웃을 기반으로 고품질의 프롬프트를 자동 설계합니다. 생성된 아키텍처 코드를 Lovable, v0, Claude Code 등의 AI 에이전트에 바로 붙여넣어 완결성 높은 웹사이트를 신속하게 구현하십시오.
            </p>
          </div>

          {/* 우측 5열: 선택된 템플릿의 간략 정보 (dark-liquid-glass 적용하여 투명도 대폭 제어) */}
          <div className="md:col-span-5 flex justify-end">
            <AnimatePresence mode="wait">
              {selectedTemplate ? (
                <motion.div
                  key={selectedTemplate.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full max-w-md rounded-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px] transition-all duration-700 ${
                    isDarkTheme
                      ? "bg-[#182C41]/15 border border-[#182C41]/25 text-[#182C41]"
                      : "dark-liquid-glass text-white"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A97E]/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div>
                    <span className={`text-[10px] uppercase tracking-widest font-semibold block mb-3 transition-colors duration-700 ${
                      isDarkTheme ? "text-[#182C41]/70" : "text-white/70"
                    }`}>Active Spec</span>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div
                        className="w-11 h-11 rounded-lg shrink-0 border border-white/10 shadow-sm"
                        style={{ backgroundColor: selectedTemplate.colors.accent }}
                      />
                      <div className="min-w-0">
                        <h3 className={`font-serif-kr text-base font-bold leading-tight truncate transition-colors duration-700 ${
                          isDarkTheme ? "text-[#182C41]" : "text-white"
                        }`}>
                          {selectedTemplate.name}
                        </h3>
                        <p className={`text-[11px] font-pretendard leading-tight truncate mt-0.5 transition-colors duration-700 ${
                          isDarkTheme ? "text-[#182C41]/80" : "text-white/80"
                        }`}>
                          {selectedTemplate.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={openPanel}
                    className={`w-full py-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-98 ${
                      isDarkTheme
                        ? "bg-[#182C41] hover:bg-[#1C3650] text-white"
                        : "bg-white hover:bg-white/90 text-[#1C1410]"
                    }`}
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
                  className={`w-full max-w-md rounded-xl p-8 text-center text-xs flex flex-col items-center justify-center min-h-[220px] transition-all duration-700 ${
                    isDarkTheme
                      ? "bg-[#182C41]/15 border border-[#182C41]/25 text-[#182C41]"
                      : "dark-liquid-glass text-white"
                  }`}
                >
                  <p className={`mb-2 transition-colors duration-700 ${isDarkTheme ? "text-[#182C41]/80" : "text-white/80"}`}>아래에서 업종 템플릿을 선택하여</p>
                  <p className={`font-serif-kr text-sm font-medium transition-colors duration-700 ${isDarkTheme ? "text-[#182C41]" : "text-white"}`}>프롬프트 빌드 아키텍처를 활성화하십시오.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ── 메인 콘텐츠: 2단 비대칭 Split 구조 (백드롭 필터 적용) ── */}
      <div className="bg-[#FAFAF7]/95 backdrop-blur-xl border-t border-[#E8E0D8]/60 relative z-20">
        <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* 좌측 4열: 카테고리 선택 및 사용 가이드 */}
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
                    className="text-[10px] font-pretendard text-[#C8A97E] hover:text-[#A08060] font-semibold transition-colors cursor-pointer"
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
      </div>

      {/* ── 푸터 ── */}
      <footer className="border-t border-[#E8E0D8]/60 bg-[#FAFAF7] py-5 px-5 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
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
