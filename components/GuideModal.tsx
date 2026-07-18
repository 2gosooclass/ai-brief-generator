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
            className="fixed inset-x-4 top-6 bottom-6 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:h-[85vh] bg-[#FAFAF7] border border-[#E8E0D8] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* 헤더 */}
            <div className="shrink-0 bg-white border-b border-[#E8E0D8] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📖</span>
                <div>
                  <h2 className="font-serif-kr text-base font-semibold text-[#1C1410]">
                    AI 웹사이트 브리프 생성기 &amp; 바이브 코딩 사용 설명서
                  </h2>
                  <p className="text-[10px] text-[#8C7A6A] font-pretendard">2GOSOO 클래스 대표님 전용 프리미엄 매뉴얼 원본</p>
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
            <div className="flex-1 overflow-y-auto px-8 py-7 space-y-7 font-pretendard text-xs text-[#2C2118] leading-relaxed">
              
              {/* 인사말 */}
              <div className="bg-[#FDF8F0] border border-[#E8D5B7] rounded-xl p-5 shadow-sm">
                <p className="text-sm font-semibold text-[#5C4A3A] mb-1.5">안녕하세요 대표님!</p>
                <p className="text-[#6C5A4A] text-[11px] leading-relaxed">
                  초보자도 마우스 클릭 몇 번으로 세련된 웹사이트 기획안을 만들고, AI를 통해 5분 만에 완성형 사이트를 뽑아낼 수 있는 마법 같은 파이프라인의 통합 사용 설명서입니다. 
                  김비서가 가장 친절하고 상세하게 정리해 두었으니, 이 가이드대로만 따라 해보세요!
                </p>
              </div>

              {/* 1단계 */}
              <div className="space-y-3">
                <h3 className="text-sm font-serif-kr font-bold text-[#1C1410] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C8A97E] text-[#1C1410] text-xs font-bold flex items-center justify-center">1</span>
                  1단계: 브리프 생성기로 나만의 기획안 만들기
                </h3>
                <div className="bg-white border border-[#E8E0D8] rounded-xl p-5 space-y-4 text-[11px] text-[#5C4A3A] shadow-sm">
                  <p className="font-semibold text-xs text-[#1C1410] border-b border-[#F0EAE2] pb-1">
                    배포된 웹앱 주소: <a href="https://2gosooweb.netlify.app" target="_blank" rel="noopener noreferrer" className="text-[#C8A97E] underline">https://2gosooweb.netlify.app</a>
                  </p>
                  <ul className="space-y-3.5 list-none pl-1">
                    <li className="flex gap-2">
                      <span className="text-[#C8A97E] font-bold">1.</span>
                      <div>
                        <strong className="text-[#1C1410]">업종 카테고리 선택</strong>
                        <p className="text-[10px] text-[#8C7A6A] mt-0.5">화면 상단에서 만들고자 하는 업종(카페·레스토랑, 학원·강좌, 개인 브랜드) 중 하나를 선택합니다.</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#C8A97E] font-bold">2.</span>
                      <div>
                        <strong className="text-[#1C1410]">마음에 드는 템플릿 선택</strong>
                        <p className="text-[10px] text-[#8C7A6A] mt-0.5">각 업종별로 구조와 색상이 완전히 다르게 설계된 3가지 카드 예시가 나타납니다. 마음에 드는 템플릿 카드를 클릭하면 우측에서 상세 설정 패널이 부드럽게 열립니다.</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#C8A97E] font-bold">3.</span>
                      <div>
                        <strong className="text-[#1C1410]">상세 옵션 커스터마이징 (우측 패널)</strong>
                        <p className="text-[10px] text-[#8C7A6A] mt-0.5">텍스트 변경(체크박스를 켜고 내 업체명과 한 줄 소개 문구를 입력), 컬러 변경(체크박스를 켜고 변경하고 싶은 테마 색상을 기입), 섹션 순서 변경 기능을 활용해 입맛에 맞게 재배열합니다.</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#C8A97E] font-bold">4.</span>
                      <div>
                        <strong className="text-[#1C1410]">추천 이미지 콕 찝어 선택하기</strong>
                        <p className="text-[10px] text-[#8C7A6A] mt-0.5">스톡 이미지 자동 탭 아래에 Unsplash에서 실시간으로 불러온 추천 사진 3장이 뜹니다. 마음에 드는 사진을 마우스로 클릭하면 골드 체크마크가 활성화되며, 이 이미지의 실제 URL 주소가 프롬프트에 자동으로 포함됩니다. 이미지의 상세 정보나 고화질 다운로드가 필요할 때는 우측 상단의 작은 새창링크 아이콘을 누릅니다. (로그인 팝업은 가볍게 무시하셔도 됩니다.)</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#C8A97E] font-bold">5.</span>
                      <div>
                        <strong className="text-[#1C1410]">프롬프트 복사</strong>
                        <p className="text-[10px] text-[#8C7A6A] mt-0.5">패널 상단 영역에 실시간으로 완성된 프롬프트가 보입니다. 하단의 복사하기 버튼을 누르면 클립보드에 안전하게 복사됩니다.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 2단계 */}
              <div className="space-y-3">
                <h3 className="text-sm font-serif-kr font-bold text-[#1C1410] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C8A97E] text-[#1C1410] text-xs font-bold flex items-center justify-center">2</span>
                  2단계: 복사한 프롬프트로 웹사이트 완성하기
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 방법 A */}
                  <div className="bg-[#EBF3FB] border border-[#D3E2F2] rounded-xl p-5 space-y-2 shadow-sm">
                    <p className="font-semibold text-xs text-[#1A3A5C] flex items-center gap-1.5">
                      <span>💻</span> 방법 A: 지금 대화 중인 안티그레피티(김비서)에게 던지기
                    </p>
                    <p className="text-[10.5px] text-[#2C6BAD] font-semibold">가장 권장하는 로컬 빌드 방법입니다. 내 컴퓨터 폴더에 소스 코드를 온전하게 영구 소장할 수 있습니다.</p>
                    <ol className="list-decimal pl-4 text-[10px] text-[#4A607A] space-y-1.5 mt-2">
                      <li>복사한 프롬프트를 현재 안티그레피티 채팅창에 그대로 붙여넣습니다.</li>
                      <li>"이 프롬프트대로 내 컴퓨터 폴더에 사이트 코드 다 만들어줘"라고 전송합니다.</li>
                      <li>김비서가 직접 대표님 컴퓨터의 academy-website 같은 폴더를 새로 개설하고, index.html, style.css, app.js 등의 정교한 소스 코드 파일들을 만들어 냅니다.</li>
                      <li>생성이 끝나면 로컬 정적 서버를 구동하여 눈앞에서 즉시 사이트를 조작해 보실 수 있게 세팅해 드립니다.</li>
                    </ol>
                  </div>

                  {/* 방법 B */}
                  <div className="bg-white border border-[#E8E0D8] rounded-xl p-5 space-y-2 shadow-sm">
                    <p className="font-semibold text-xs text-[#1C1410] flex items-center gap-1.5">
                      <span>🌐</span> 방법 B: 외부 AI 코딩 툴(Lovable, v0 등) 활용하기
                    </p>
                    <p className="text-[10.5px] text-[#8C7A6A] font-semibold">서버 설정이나 코딩에 대해 일절 신경 쓰지 않고 웹상에서 바로 띄워보고 싶을 때 유용합니다.</p>
                    <ol className="list-decimal pl-4 text-[10px] text-[#6C5A4A] space-y-1.5 mt-2">
                      <li>Lovable(lovable.dev) 또는 v0(v0.dev) 사이트에 가입하여 접속합니다.</li>
                      <li>메인 채팅창에 복사한 프롬프트를 붙여넣고 전송(엔터)을 누릅니다.</li>
                      <li>화면 오른쪽에 대표님이 선택한 색상, 폰트, 선택한 이미지가 그대로 반영된 모던한 웹사이트가 실시간으로 조립되는 모습을 지켜봅니다.</li>
                      <li>완성이 마음에 들면 상단의 Publish 버튼을 눌러 세상에 바로 공개할 수도 있습니다.</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* 3단계 */}
              <div className="space-y-3">
                <h3 className="text-sm font-serif-kr font-bold text-[#1C1410] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C8A97E] text-[#1C1410] text-xs font-bold flex items-center justify-center">3</span>
                  3단계: 로컬에 완성된 코드 관리 및 편집하기 (개발자 모드)
                </h3>
                <div className="bg-white border border-[#E8E0D8] rounded-xl p-5 space-y-3.5 text-[11px] text-[#5C4A3A] shadow-sm">
                  <p className="text-[10.5px] font-semibold text-[#1C1410]">제가 대표님 폴더에 직접 만들어 드린 웹사이트 코드(예: 신뢰 학원 페이지)를 추후 관리하는 방법입니다.</p>
                  <ul className="space-y-3 list-none pl-1">
                    <li className="flex gap-2">
                      <span className="text-[#C8A97E]">✔</span>
                      <div>
                        <strong className="text-[#1C1410]">오프라인으로 열기</strong>
                        <p className="text-[10px] text-[#8C7A6A] mt-0.5">생성된 폴더 내의 index.html 파일을 마우스 더블클릭하는 것만으로도 인터넷 연결 없이 내 브라우저에서 화면이 바로 열립니다.</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#C8A97E]">✔</span>
                      <div>
                        <strong className="text-[#1C1410]">코드 직접 수정하기</strong>
                        <p className="text-[10px] text-[#8C7A6A] mt-0.5">텍스트나 상세한 내용을 직접 손보고 싶으시다면, Visual Studio Code 같은 에디터로 해당 폴더를 열어 html 내부의 한글 텍스트를 원하는 대로 타이핑해 수정하시면 됩니다.</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#C8A97E]">✔</span>
                      <div>
                        <strong className="text-[#1C1410]">Netlify로 세상에 공개하기</strong>
                        <p className="text-[10px] text-[#8C7A6A] mt-0.5">나중에 이 학원 사이트를 전 세계 사람들이 들어올 수 있게 배포하고 싶다면, Netlify(netlify.com) 로그인 후 해당 폴더를 마우스 드래그앤드롭으로 업로드하기만 하면 실시간 도메인 주소가 3초 만에 발급됩니다.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 📐 12가지 웹사이트 구조 패턴 라이브러리 안내 */}
              <div className="space-y-4 pt-6 border-t border-[#E8E0D8]/60">
                <h3 className="text-sm font-serif-kr font-bold text-[#1C1410] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C8A97E] text-[#1C1410] text-xs font-bold flex items-center justify-center">📐</span>
                  12가지 프리미엄 구조적 아키텍처 라이브러리
                </h3>
                <p className="text-[10px] text-[#8C7A6A] leading-normal">
                  저희 브리프 생성기가 실시간 미리보기에서 다채롭게 구현하고 있는 12가지 명작 레이아웃 명세입니다. 사용자가 조율 및 선택 시 이 명세가 프롬프트 내에 메타데이터로 정확히 마운트됩니다.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { num: "01", title: "그리드 레이아웃 (Grid Layout)", desc: "모듈형 그리드(상품/포트폴리오 이미지를 바둑판 정렬)와 단일 열 그리드(긴 글로 이루어진 철학/블로그 정렬)를 선택적으로 적용해 정보의 구획을 단정하게 나눕니다." },
                    { num: "02", title: "분할 화면 레이아웃 (Split Screen Layout)", desc: "화면을 정확히 50:50으로 양분하여 한쪽에는 압도적인 브랜드 비주얼을, 반대쪽에는 텍스트 가입 양식이나 핵심 스펙 대조표를 밀도 높게 매칭합니다." },
                    { num: "03", title: "비대칭 레이아웃 (Asymmetrical Layout)", desc: "좌우 비율을 의도적으로 70:30 등으로 다르게 조율하여, 70% 영역의 거대 비주얼로 시선을 강제 흡수한 뒤 30% 영역의 어두운 카드에 핵심 CTA 단추를 심어 전환율을 높입니다." },
                    { num: "04", title: "전체 화면 레이아웃 (Full Screen Layout)", desc: "화면 전체를 하나의 거대하고 화사한 배경 이미지나 영상으로 빈틈없이 채우고, 미니멀한 명작 타이포그래피만 단독 배치하여 브랜드 감성을 저격합니다." },
                    { num: "05", title: "사이드 스크롤 레이아웃 (Side Scroll Layout)", desc: "상하가 아닌 좌우로 미끄러지듯 넘기는 넷플릭스 스타일 가로 롤입니다. 카테고리나 화보 갤러리를 시각적 피로감 없이 부드럽게 나열할 때 적격입니다." },
                    { num: "06", title: "카드 레이아웃 (Card Layout)", desc: "직사각형의 콤팩트한 입체 카드 상자 안에 이미지, 굵은 표제, 가격(₩) 및 한 줄 설명을 정돈해 빠른 탐색을 유도합니다. (※ 사이트 남발을 막기 위해 1개 섹션에만 한정)" },
                    { num: "07", title: "잡지 레이아웃 (Magazine Layout)", desc: "인쇄 매거진의 지면처럼 가장 큰 메인 영역에는 영웅 비주얼 이미지를 대담하게 할당하고, 나머지 서브 요소들은 주변에 작게 붙여 정보의 시각적 강약을 조율합니다." },
                    { num: "08", title: "갤러리 레이아웃 (Gallery Layout)", desc: "텍스트 설명을 극도로 소거하고 오직 3~4개의 고해상도 비주얼 화보 이미지의 힘으로만 승부하는 감각적인 포트폴리오 쇼케이스 구조입니다." },
                    { num: "09", title: "지그재그 레이아웃 (Zig-Zag Layout)", desc: "[좌 이미지 / 우 텍스트]에서 [좌 텍스트 / 우 이미지] 형태로 정밀하게 Z자 동선을 그리며 엇갈려 배치하여, 읽는 재미와 체류 시간을 극적으로 늘립니다." },
                    { num: "10", title: "F-패턴 레이아웃 (F-Pattern Layout)", desc: "인간이 좌측 상단 위주로 장문을 훑는 습성에 입각하여, 가장 중요한 헤드라인 타이틀, 1순위 핵심 요약문, 그리고 메인 CTA 버튼을 좌측 상단 흐름에 수직 밀집 배치합니다." },
                    { num: "11", title: "인터랙티브 레이아웃 (Interactive Layout)", desc: "사용자의 클릭이나 슬라이더 값 변경에 따라 화면이 동적으로 반응하거나 가상 예산 매칭 시뮬레이션을 제공하는 몰입형 구조입니다." },
                    { num: "12", title: "애니메이션 레이아웃 (Animation Layout)", desc: "요소들이 스르륵 나타나는 페이드인 효과를 가미하고, 내부에서 기어가 맞물려 돌거나 파동 그래프가 치는 듯한 작동 펄스 모션을 CSS 키프레임 그래픽으로 직관적으로 렌더링합니다." }
                  ].map((item) => (
                    <div key={item.num} className="bg-white border border-[#E8E0D8] p-4 rounded-xl shadow-sm space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-white bg-[#C8A97E] px-1.5 py-0.5 rounded-md">{item.num}</span>
                        <strong className="text-xs font-pretendard text-[#1C1410]">{item.title}</strong>
                      </div>
                      <p className="text-[10px] text-[#8C7A6A] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
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
