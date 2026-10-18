# 🌐 AI Website Brief Generator (AI 웹사이트 브리프 생성기)

<p align="center">
  <b>Architect production-grade website structures & prompts for AI coding agents in under 5 minutes.</b><br/>
  초보자도 5분 만에 업종별로 검증된 웹사이트 레이아웃을 구성하고 최신 AI 코딩 에이전트용 고도화 프롬프트를 자동 생성하는 웹 도구
</p>

<p align="center">
  <a href="https://2gosooweb.netlify.app">
    <img src="https://img.shields.io/badge/Live_Demo-2gosooweb.netlify.app-blue?style=for-the-badge&logo=netlify" alt="Live Demo"/>
  </a>
  <img src="https://img.shields.io/badge/Next.js_14-App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js 14"/>
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
</p>

---

## 🌟 English Overview

AI Website Brief Generator is an interactive visual builder designed to bridge the gap between human business intent and AI code synthesis. Instead of writing vague prompts that generate generic layouts, this tool lets you visually select industry-proven design frameworks, section hierarchies, Unsplash imagery, and live color themes, exporting a hyper-detailed architectural prompt ready for tools like Antigravity, Cursor, Claude 3.7 Sonnet, Lovable, or v0.

### Key Capabilities
* **Industry Frameworks**: Specialized structural templates for Cafes & Restaurants, Educational Academies, and Personal Consulting Brands.
* **3 Distinct Layout Archetypes**: Classic Hero (Full-width impact), Split-Sidebar (Modern SaaS layout), and Editorial Magazine (Chip-based narrative).
* **Live Interactive Prompt Engine**: Real-time right-panel synchronization as you toggle colors, section orders, and headings.
* **Unsplash Stock Binding**: Instant live photo search with high-resolution image URLs directly embedded into the generated agent prompt.
* **1-Click Clipboard Export**: Copy ready-to-run prompts with zero friction.

---

## 🇰🇷 한국어 소개 (Korean Guide)

초보자도 5분 만에 업종별로 검증된 웹사이트 레이아웃 구조와 스타일을 선택하고, 최신 AI 코딩 에이전트에 그대로 입력할 수 있는 고도화된 프롬프트를 자동으로 생성해 주는 웹 애플리케이션입니다.

- 공식 배포 주소: https://2gosooweb.netlify.app
- 개발 및 기획: 2GOSOO AI LAB

### 주요 핵심 기능
1. **업종별 카테고리 필터링**: 카페/레스토랑, 학원/강좌, 1인 브랜드 등 검증된 9종의 템플릿 제공.
2. **3종 CSS 미니 목업 레이아웃**:
   - Classic: 상단 네비게이션과 전체폭 히어로 영역, 세로형 리스트 섹션 구조
   - Sidebar: 좌우 분할식 히어로 영역(이미지 플레이스홀더 포함)과 2열 카드 그리드 구조
   - Magazine: 네비게이션 일체형 그라디언트 헤더와 가로형 섹션 칩 구조
3. **실시간 프롬프트 빌더**: 텍스트, 색상, 섹션 순서를 변경하면 우측 패널 프롬프트 뷰어에 실시간 자동 동기화.
4. **Unsplash API 실시간 이미지 연동**: 업종 무드에 맞는 고화질 스톡 이미지를 실시간 검색 및 URL 바인딩.
5. **원클릭 클립보드 복사**: 클릭 한 번으로 생성된 프롬프트를 복사하여 AI 에이전트에 즉시 입력.

---

## 🛠️ Tech Stack
* Framework: Next.js 14 (App Router)
* Styling: Tailwind CSS
* State Management: Zustand
* Motion: Framer Motion
* Stock API: Unsplash API
* Deployment: Netlify (Static Export)

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (.env.local)
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# 3. Start local development server
npm run dev

# 4. Build static export
npm run build
```

---

## 📄 License
MIT License. Created by [2GOSOO AI LAB](https://2gosooailab.com).
