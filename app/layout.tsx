import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI 웹사이트 브리프 생성기 | 바이브 코딩 프롬프트 자동 생성",
  description:
    "업종별 검증된 웹사이트 템플릿을 선택하면, Lovable·v0·Claude Code에 바로 붙여넣을 수 있는 복제+수정 프롬프트를 자동으로 생성합니다.",
  keywords: [
    "웹사이트 브리프",
    "바이브 코딩",
    "AI 프롬프트",
    "Lovable",
    "v0",
    "Claude Code",
    "웹사이트 제작",
  ],
  openGraph: {
    title: "AI 웹사이트 브리프 생성기",
    description: "업종별 템플릿으로 바이브 코딩 프롬프트를 자동 생성",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSerifKR.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Pretendard:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-pretendard bg-[#FAFAF7] text-[#1C1410]">
        {children}
      </body>
    </html>
  );
}
