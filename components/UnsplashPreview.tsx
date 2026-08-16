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
      className={`relative rounded-xl overflow-hidden bg-[#F3F4F6] aspect-video group cursor-pointer border-2 transition-all duration-200 ${
        isSelected ? "border-[#111827] ring-2 ring-black/20 scale-[0.98] shadow-md" : "border-transparent hover:border-[#111827]/40"
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-70 group-hover:opacity-85 transition-opacity duration-300" />

      {/* 선택 상태 체크마크 */}
      <div className="absolute top-2 left-2 flex items-center justify-center">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isSelected
              ? "bg-[#111827] border-white text-white shadow"
              : "bg-black/40 border-white/80 text-transparent"
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* 원본 링크 아이콘 */}
      <a
        href={`${photo.links.html}?utm_source=ai-brief-generator&utm_medium=referral`}
        target="_blank"
        rel="noopener noreferrer"
        title="원본 이미지 보기"
        className="absolute top-2 right-2 w-5 h-5 rounded-md bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>

      {/* 작가 정보 */}
      <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9.5px] font-bold text-white">
        <span className="truncate max-w-[75%] font-pretendard leading-tight drop-shadow">
          {photo.user.name}
        </span>
        <span className="opacity-80 font-pretendard shrink-0 scale-90">Unsplash</span>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#E5E7EB] aspect-video animate-pulse">
      <div className="w-full h-full bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse" />
    </div>
  );
}

export default function UnsplashPreview({ keyword }: UnsplashPreviewProps) {
  const { photos, isLoading, error, refetch } = useUnsplash(keyword);
  const { selectedStockImages, toggleStockImage } = useBriefStore();

  return (
    <div className="font-pretendard text-left">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs sm:text-[13px] font-bold text-[#111827]">
          추천 스톡 이미지 미리보기
        </p>
        {!isLoading && !error && photos.length > 0 && (
          <button
            onClick={refetch}
            className="text-xs font-bold text-[#111827] hover:text-[#4B5563] transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            새로고침
          </button>
        )}
      </div>

      <p className="text-xs text-[#4B5563] font-medium mb-3 leading-relaxed">
        💡 이미지를 클릭해 선택하면 생성될 프롬프트에 이미지 URL이 자동 지정됩니다.
      </p>

      {/* 에러 표시 */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl px-3.5 py-2.5 mb-2.5">
          <p className="text-xs font-bold text-red-700 font-pretendard">{error}</p>
        </div>
      )}

      {/* 이미지 그리드 */}
      <div className="grid grid-cols-3 gap-2.5">
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
          <div className="col-span-3 flex items-center justify-center h-24 rounded-2xl bg-[#F3F4F6]">
            <p className="text-xs font-bold text-[#6B7280]">이미지 없음</p>
          </div>
        )}
      </div>

      {/* Unsplash 귀속 표시 */}
      {!isLoading && photos.length > 0 && (
        <p className="text-[10px] font-bold text-[#6B7280] mt-2.5 leading-none">
          Photos by{" "}
          <a
            href="https://unsplash.com?utm_source=ai-brief-generator&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#111827] transition-colors"
          >
            Unsplash
          </a>
        </p>
      )}
    </div>
  );
}
