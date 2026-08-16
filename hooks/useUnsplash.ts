"use client";

import { useState, useEffect, useCallback } from "react";
import type { UnsplashPhoto } from "@/lib/types";

// 🌐 키워드/업종별 고화질 언스플래시 셔플 풀 (API 키 없을 때도 무한 새로고침 지원)
const STATIC_PHOTO_POOLS: Record<string, string[]> = {
  cafe: [
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=800&q=80",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80"
  ],
  general: [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"
  ]
};

function generateFallbackPhotos(keyword: string, offset: number): UnsplashPhoto[] {
  const pool = keyword.toLowerCase().includes("cafe") || keyword.toLowerCase().includes("brunch") || keyword.toLowerCase().includes("coffee")
    ? STATIC_PHOTO_POOLS.cafe
    : STATIC_PHOTO_POOLS.general;

  const total = pool.length;
  const startIdx = (offset * 3) % total;

  return [0, 1, 2].map((i) => {
    const idx = (startIdx + i) % total;
    const url = pool[idx];
    return {
      id: `fallback-${keyword}-${offset}-${i}`,
      urls: {
        regular: url,
        small: url,
        thumb: url,
      },
      alt_description: `${keyword} visual ${idx + 1}`,
      user: {
        name: "Curated Unsplash Creator",
        links: { html: "https://unsplash.com" },
      },
      links: { html: "https://unsplash.com" },
    };
  });
}

interface UseUnsplashReturn {
  photos: UnsplashPhoto[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUnsplash(keyword: string): UseUnsplashReturn {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchPhotos = useCallback(async (targetPage: number) => {
    if (!keyword) return;

    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

    // API 키가 없거나 기본 플레이스홀더인 경우, 내부 고화질 사진 풀에서 셔플
    if (!accessKey || accessKey === "your_unsplash_access_key_here") {
      setIsLoading(true);
      setTimeout(() => {
        const fallbacks = generateFallbackPhotos(keyword, targetPage);
        setPhotos(fallbacks);
        setError(null);
        setIsLoading(false);
      }, 150);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL("https://api.unsplash.com/search/photos");
      url.searchParams.set("query", keyword);
      url.searchParams.set("page", String(targetPage));
      url.searchParams.set("per_page", "3");
      url.searchParams.set("orientation", "landscape");
      url.searchParams.set("content_filter", "high");

      const res = await globalThis.fetch(url.toString(), {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Unsplash API 오류: ${res.status}`);
      }

      const data = await res.json();

      if (data.results && data.results.length > 0) {
        setPhotos(data.results.slice(0, 3));
      } else {
        // 검색 결과 없을 시 fallback
        setPhotos(generateFallbackPhotos(keyword, targetPage));
      }
    } catch (err) {
      console.warn("Unsplash API fetch fallback trigger:", err);
      // 에러 발생 시 fallback 풀에서 즉각 공급
      setPhotos(generateFallbackPhotos(keyword, targetPage));
    } finally {
      setIsLoading(false);
    }
  }, [keyword]);

  const handleRefetch = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPhotos(nextPage);
  };

  useEffect(() => {
    setPage(1);
    fetchPhotos(1);
  }, [fetchPhotos]);

  return { photos, isLoading, error, refetch: handleRefetch };
}
