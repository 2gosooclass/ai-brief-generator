"use client";

import { useState, useEffect, useCallback } from "react";
import type { UnsplashPhoto } from "@/lib/types";

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

  const fetchPhotos = useCallback(async () => {
    if (!keyword) return;

    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

    if (!accessKey || accessKey === "your_unsplash_access_key_here") {
      setError("Unsplash API 키가 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_UNSPLASH_ACCESS_KEY를 추가해주세요.");
      setPhotos([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL("https://api.unsplash.com/search/photos");
      url.searchParams.set("query", keyword);
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
        setPhotos([]);
        setError("관련 이미지를 찾지 못했습니다.");
      }
    } catch (err) {
      console.error("Unsplash fetch error:", err);
      setError("이미지를 불러오는 중 오류가 발생했습니다.");
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return { photos, isLoading, error, refetch: fetchPhotos };
}
