"use client";

import { motion, AnimatePresence } from "framer-motion";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 딤 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* 모달 윈도우 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-10 bottom-10 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:h-[80vh] bg-[#FAFAF7] border border-[#E8E0D8] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* 헤더 */}
            <div className="shrink-0 bg-white border-b border-[#E8E0D8] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📖</span>
                <div>
                  <h2 className="font-serif-kr text-base font-semibold text-[#1C1410]">
                    AI 브리프 생성기 &amp; 바이브 코딩 가이드
                  </h2>
                  <p className="text-[10px] text-[#8C7A6A] font-pretendard">초보자를 위한 친절한 사용 설명서</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#F0EAE2] hover:bg-[#E8DDD5] flex items-center justify-center transition-colors text-[#5C4A3A]"
                aria-label="닫기"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 본문 스크롤 영역 */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 font-pretendard text-xs text-[#2C2118] leading-relaxed">
              
              {/* 인트로 */}
              <div className="bg-[#FDF8F0] border border-[#E8D5B7] rounded-xl p-4">
                <p className="text-[11px] text-[#5C4A3A]">
                  안녕하세요 대표님! 마우스 클릭 몇 번으로 세련된 웹사이트 기획안을 만들고, AI를 통해 5분 만에 완성형 사이트를 제작하는 마법 같은 파이프라인의 통합 설명서입니다. 이 가이드대로만 따라 해보세요!
                </p>
              </div>

              {/* 1단계 */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-semibold text-[#1C1410] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#C8A97E] text-white text-[10px] font-bold flex items-center justify-center">1</span>
                  브리프 생성기로 나만의 기획안 만들기
                </h3>
                <div className="pl-7 space-y-2 text-[#5C4A3A] text-[11px]">
                  <p><strong>1. 업종 카테고리 선택</strong>: 화면 상단에서 업종(카페·레스토랑, 학원·강좌, 개인 브랜드) 중 하나를 선택합니다.</p>
                  <p><strong>2. 템플릿 선택</strong>: 구조와 색상이 다르게 설계된 3가지 카드 예시 중 마음에 드는 템플릿 카드를 클릭하면 우측 설정 패널이 열립니다.</p>
                  <p><strong>3. 상세 옵션 수정</strong>: 텍스트 변경, 컬러 변경, 섹션 순서 변경 체크박스를 켜고 원하는 값을 입력하면 실시간으로 조합됩니다.</p>
                  <p><strong>4. 추천 이미지 선택</strong>: 추천 스톡 사진을 마우스로 클릭하면 골드 체크마크가 활성화되며, 이 이미지의 실제 주소 URL이 생성될 프롬프트에 자동으로 포함됩니다.</p>
                  <p><strong>5. 프롬프트 복사</strong>: 패널 상단 영역에 실시간으로 완성된 프롬프트 아래 복사하기 버튼을 눌러 복사합니다.</p>
                </div>
              </div>

              <div className="border-t border-[#E8E0D8]/60" />

              {/* 2단계 */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-semibold text-[#1C1410] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#C8A97E] text-white text-[10px] font-bold flex items-center justify-center">2</span>
                  복사한 프롬프트로 웹사이트 완성하기
                </h3>
                <div className="pl-7 space-y-3.5 text-[11px] text-[#5C4A3A]">
                  <div className="bg-[#EBF3FB] border border-[#D3E2F2] rounded-xl p-3.5">
                    <p className="font-semibold text-[#1A3A5C] mb-1">방법 A: 지금 대화 중인 안티그레피티(김비서)에게 던지기</p>
                    <p className="text-[10px] leading-relaxed">복사한 프롬프트를 현재 안티그레피티 채팅창에 그대로 붙여넣으면서 "이대로 내 컴퓨터 폴더에 사이트 코드 다 만들어줘"라고 명령하시면, 즉시 파일들을 생성하고 개발 서버까지 원스톱으로 세팅해 드립니다.</p>
                  </div>
                  <div className="bg-white border border-[#E8E0D8] rounded-xl p-3.5">
                    <p className="font-semibold text-[#1C1410] mb-1">방법 B: 외부 AI 코딩 툴(Lovable, v0 등) 활용하기</p>
                    <p className="text-[10px] leading-relaxed">Lovable(lovable.dev)이나 v0(v0.dev) 사이트에 가입하여 접속한 뒤, 채팅창에 복사한 프롬프트를 붙여넣고 엔터를 치면 화면 우측에 실시간으로 완성되는 작동형 웹사이트 빌드를 지켜볼 수 있습니다.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E8E0D8]/60" />

              {/* 3단계 */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-semibold text-[#1C1410] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#C8A97E] text-white text-[10px] font-bold flex items-center justify-center">3</span>
                  로컬 코드 관리 및 에디터 수정
                </h3>
                <div className="pl-7 space-y-2 text-[#5C4A3A] text-[11px]">
                  <p><strong>오프라인 더블클릭</strong>: 생성된 폴더 내의 index.html 파일을 마우스 더블클릭하는 것만으로 인터넷 연결 없이 즉시 화면 확인이 가능합니다.</p>
                  <p><strong>에디터 수정</strong>: Visual Studio Code 등의 에디터로 해당 폴더를 열어 텍스트와 레이아웃 세부 수치를 원하는 대로 타이핑해 수정합니다.</p>
                  <p><strong>무료 배포</strong>: Netlify에 가입한 뒤 빌드 폴더를 마우스 드래그앤드롭으로 업로드하기만 하면 실시간 도메인 주소가 발급됩니다.</p>
                </div>
              </div>

              {/* ── 구글 애드센스(AdSense) 광고 슬롯 미리 구성 ── */}
              <div className="pt-4 border-t border-[#E8E0D8]/60">
                <div className="bg-white border-2 border-dashed border-[#C8A97E]/30 rounded-xl p-5 text-center transition-colors hover:border-[#C8A97E]/60">
                  <span className="text-[10px] tracking-widest text-[#C8A97E] font-bold uppercase block mb-1">Google AdSense Space</span>
                  <p className="text-[10px] text-[#A09080] font-pretendard">
                    추후 애드센스 승인 완료 시 광고 코드가 삽입될 전용 슬롯입니다.
                  </p>
                  {/* 애드센스 승인 후 여기에 <ins class="adsbygoogle" ...> 코드를 주입합니다 */}
                </div>
              </div>

            </div>

            {/* 푸터 */}
            <div className="shrink-0 bg-white border-t border-[#E8E0D8] px-6 py-3 flex items-center justify-between text-[9px] text-[#A09080] font-pretendard">
              <span>© 2026 2GOSOO AI LAB. All rights reserved.</span>
              <span>Photos by Unsplash</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
