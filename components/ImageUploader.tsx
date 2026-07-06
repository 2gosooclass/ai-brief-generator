"use client";

import { useCallback, useState } from "react";
import { useBriefStore } from "@/store/briefStore";

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

async function uploadToCloudinary(
  file: File,
  cloudName: string,
  uploadPreset: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    throw new Error("Cloudinary 업로드 실패");
  }

  const data: CloudinaryUploadResponse = await res.json();
  return data.secure_url;
}

export default function ImageUploader() {
  const { setUploadedImage, clearUploadedImage, uploadedImageUrl } = useBriefStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const hasCloudinary =
    cloudName &&
    uploadPreset &&
    cloudName !== "your_cloudinary_cloud_name_here";

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setUploadError("이미지 파일만 업로드할 수 있습니다.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setUploadError("파일 크기는 10MB 이하여야 합니다.");
        return;
      }

      setUploadError(null);
      setIsUploading(true);

      try {
        let imageUrl: string;

        if (hasCloudinary) {
          imageUrl = await uploadToCloudinary(file, cloudName!, uploadPreset!);
        } else {
          // 로컬 Object URL 폴백
          imageUrl = URL.createObjectURL(file);
        }

        setUploadedImage(imageUrl, file);
      } catch (err) {
        console.error("Upload error:", err);
        // Cloudinary 실패 시 로컬 URL 폴백
        const localUrl = URL.createObjectURL(file);
        setUploadedImage(localUrl, file);
        setUploadError(
          "클라우드 업로드 실패 — 로컬 미리보기로 대체됩니다. 프롬프트에 이미지를 직접 추가해주세요."
        );
      } finally {
        setIsUploading(false);
      }
    },
    [hasCloudinary, cloudName, uploadPreset, setUploadedImage]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  if (uploadedImageUrl) {
    return (
      <div className="space-y-2">
        <div className="relative rounded-xl overflow-hidden border-2 border-[#C8A97E] bg-[#F5F0EA]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={uploadedImageUrl}
            alt="업로드된 이미지"
            className="w-full h-36 object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={clearUploadedImage}
              className="px-4 py-2 bg-white/90 text-[#1C1410] rounded-lg text-xs font-pretendard font-medium hover:bg-white transition-colors"
            >
              이미지 교체하기
            </button>
          </div>
        </div>
        {!hasCloudinary && (
          <p className="text-[10px] text-amber-600 font-pretendard bg-amber-50 px-3 py-1.5 rounded-lg">
            Cloudinary 미설정 — 이미지 URL이 프롬프트에 직접 삽입되지 않습니다. 직접 붙여넣기 하세요.
          </p>
        )}
        {uploadError && (
          <p className="text-[10px] text-amber-600 font-pretendard">{uploadError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={`flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-[#C8A97E] bg-[#FDF8F3]"
            : "border-[#D5CAC0] bg-[#FAF7F4] hover:border-[#C8A97E]/70 hover:bg-[#FDF8F3]"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onInputChange}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#C8A97E] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#8C7A6A] font-pretendard">업로드 중...</p>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-[#F0E8DC] flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-xs text-[#5C4A3A] font-pretendard font-medium">
              클릭하거나 파일을 드래그하세요
            </p>
            <p className="text-[10px] text-[#A09080] font-pretendard mt-0.5">
              JPG, PNG, WebP · 최대 10MB
            </p>
          </>
        )}
      </label>

      {uploadError && (
        <p className="text-[10px] text-amber-600 font-pretendard bg-amber-50 px-3 py-1.5 rounded-lg">
          {uploadError}
        </p>
      )}
    </div>
  );
}
