"use client";

import { useUnsplash } from "@/hooks/useUnsplash";
import { useBriefStore } from "@/store/briefStore";
import type { UnsplashPhoto } from "@/lib/types";
import Image from "next/image";

interface UnsplashPreviewProps {
  keyword: string;
}

function PhotoCard({
  photo,
  keyword,
  isSelected,
  onToggle,
}: {
  photo: UnsplashPhoto;
  keyword: string;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={`relative rounded-lg overflow-hidden bg-[#F0EAE2] aspect-video group cursor-pointer border-2 transition-all duration-200 ${
        isSelected ? "border-[#C8A97E] ring-2 ring-[#C8A97E]/30 scale-[0.98]" : "border-transparent hover:border-[#C8A97E]/50"
      }`}
    >
      <Image
        src={photo.urls.small}
        alt={photo.alt_description ?? keyword}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 33vw, 160px"
        unoptimized
      />

      {/* 그라디언트 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

      {/* 선택 상태 체크마크 */}
      <div className="absolute top-1.5 left-1.5 flex items-center justify-center">
        <div
          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
            isSelected
              ? "bg-[#C8A97E] border-[#C8A97E] text-white"
              : "bg-black/30 border-white/60 text-transparent"
          }`}
        >
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* 원본 링크 아이콘 (카드 우측 상단 조그마한 위치) */}
      <a
        href={`${photo.links.html}?utm_source=ai-brief-generator&utm_medium=referral`}
        target="_blank"
        rel="noopener noreferrer"
        title="원본 이미지 보기"
        className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded bg-black/40 hover:bg-black/70 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        onClick={(e) => e.stopPropagation()} // 카드 토글 클릭 방지
      >
        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>

      {/* 작가 정보 */}
      <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[8px] text-white/90">
        <span className="truncate max-w-[70%] font-pretendard leading-tight">
          {photo.user.name}
        </span>
        <span className="opacity-60 font-pretendard shrink-0 scale-90">Unsplash</span>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-lg overflow-hidden bg-[#E8E0D8] aspect-video animate-pulse">
      <div className="w-full h-full bg-gradient-to-r from-[#E8E0D8] via-[#F0EAE2] to-[#E8E0D8] animate-pulse" />
    </div>
  );
}

export default function UnsplashPreview({ keyword }: UnsplashPreviewProps) {
  const { photos, isLoading, error, refetch } = useUnsplash(keyword);
  const { selectedStockImages, toggleStockImage } = useBriefStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-pretendard text-[#5C4A3A] font-semibold">
          추천 스톡 이미지 미리보기
        </p>
        {!isLoading && !error && photos.length > 0 && (
          <button
            onClick={refetch}
            className="text-[10px] font-pretendard text-[#C8A97E] hover:text-[#A08060] transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            새로고침
          </button>
        )}
      </div>

      <p className="text-[10px] text-[#A09080] font-pretendard mb-2.5 leading-tight">
        💡 이미지를 클릭해 선택하면 생성될 프롬프트에 이미지 URL이 자동 지정됩니다.
      </p>

      {/* 에러 표시 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-2">
          <p className="text-xs text-red-600 font-pretendard">{error}</p>
        </div>
      )}

      {/* 이미지 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : photos.map((photo) => {
              const isSelected = selectedStockImages.includes(photo.urls.regular);
              return (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  keyword={keyword}
                  isSelected={isSelected}
                  onToggle={() => toggleStockImage(photo.urls.regular)}
                />
              );
            })}
        {!isLoading && !error && photos.length === 0 && (
          <div className="col-span-3 flex items-center justify-center h-20 rounded-xl bg-[#F5F0EA]">
            <p className="text-xs text-[#A09080] font-pretendard">이미지 없음</p>
          </div>
        )}
      </div>

      {/* Unsplash 귀속 표시 */}
      {!isLoading && photos.length > 0 && (
        <p className="text-[9px] text-[#A09080] font-pretendard mt-2 leading-none">
          Photos by{" "}
          <a
            href="https://unsplash.com?utm_source=ai-brief-generator&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#5C4A3A] transition-colors"
          >
            Unsplash
          </a>
        </p>
      )}
    </div>
  );
}
