"use client";

import { create } from "zustand";
import type {
  Template,
  CategoryId,
  ImageMode,
  ModifyOptions,
  UserInputs,
} from "@/lib/types";

interface BriefState {
  // 선택 상태
  selectedCategory: CategoryId;
  selectedTemplate: Template | null;
  isPanelOpen: boolean;

  // 이미지 방식
  imageMode: ImageMode;
  uploadedImageUrl: string | null;
  uploadedImageFile: File | null;
  selectedStockImages: string[]; // 선택된 Unsplash 이미지 URL 목록
  sectionImages: Record<string, string>; // 섹션별 개별 이미지 설정
  activeEditingSection: string | null; // 현재 편집 중인 섹션 키
  logoUrl: string | null; // 사용자 업로드 로고 URL

  // 수정 항목 체크박스
  modifyOptions: ModifyOptions;

  // 사용자 입력값
  userInputs: UserInputs;

  // 액션
  setCategory: (category: CategoryId) => void;
  selectTemplate: (template: Template) => void;
  openPanel: () => void;
  closePanel: () => void;
  setImageMode: (mode: ImageMode) => void;
  setUploadedImage: (url: string, file: File) => void;
  clearUploadedImage: () => void;
  setLogoUrl: (url: string | null) => void; // 로고 등록 액션
  toggleStockImage: (url: string) => void; // 스톡 이미지 선택/해제 토글
  setEditingSection: (section: string | null) => void;
  setSectionImage: (section: string, url: string) => void;
  toggleModifyOption: (option: keyof ModifyOptions) => void;
  setUserInput: (key: keyof UserInputs, value: string) => void;
  toggleMultiPage: () => void;
  resetPanel: () => void;
}

const defaultModifyOptions: ModifyOptions = {
  colorChange: false,
  textChange: true,
  sectionReorder: false,
  isMultiPage: false,
};

const defaultUserInputs: UserInputs = {
  businessName: "",
  description: "",
  customColor: "",
  sectionOrder: "",
  pickedColor: "",
  contact: "",
};

export const useBriefStore = create<BriefState>((set) => ({
  selectedCategory: "cafe",
  selectedTemplate: null,
  isPanelOpen: false,

  imageMode: "stock",
  uploadedImageUrl: null,
  uploadedImageFile: null,
  selectedStockImages: [],
  sectionImages: {},
  activeEditingSection: null,

  modifyOptions: defaultModifyOptions,
  userInputs: defaultUserInputs,

  logoUrl: null,

  setCategory: (category) =>
    set({
      selectedCategory: category,
      selectedTemplate: null,
      isPanelOpen: false,
      selectedStockImages: [],
    }),

  selectTemplate: (template) =>
    set({
      selectedTemplate: template,
      isPanelOpen: true,
      selectedStockImages: [],
    }),

  openPanel: () =>
    set({
      isPanelOpen: true,
    }),

  closePanel: () =>
    set({
      isPanelOpen: false,
      // selectedTemplate 유지 → 히어로 배너에서 계속 표시
    }),

  setImageMode: (mode) =>
    set({
      imageMode: mode,
      uploadedImageUrl: null,
      uploadedImageFile: null,
      selectedStockImages: [],
    }),

  setUploadedImage: (url, file) =>
    set((state) => {
      if (state.activeEditingSection) {
        return {
          uploadedImageUrl: url,
          uploadedImageFile: file,
          sectionImages: {
            ...state.sectionImages,
            [state.activeEditingSection]: url
          },
          activeEditingSection: null // 편집창 닫기
        };
      }
      return {
        uploadedImageUrl: url,
        uploadedImageFile: file,
      };
    }),

  clearUploadedImage: () =>
    set({
      uploadedImageUrl: null,
      uploadedImageFile: null,
    }),

  setLogoUrl: (url) =>
    set({
      logoUrl: url
    }),

  toggleStockImage: (url) =>
    set((state) => {
      const exists = state.selectedStockImages.includes(url);
      const next = exists
        ? state.selectedStockImages.filter((x) => x !== url)
        : [...state.selectedStockImages, url];
      
      // 만약 개별 섹션 편집 중이라면, 해당 섹션 이미지로도 즉시 설정
      if (state.activeEditingSection) {
        return {
          selectedStockImages: next,
          sectionImages: {
            ...state.sectionImages,
            [state.activeEditingSection]: url
          },
          activeEditingSection: null // 편집창 닫기
        };
      }

      return { selectedStockImages: next };
    }),

  setEditingSection: (section) =>
    set({
      activeEditingSection: section
    }),

  setSectionImage: (section, url) =>
    set((state) => ({
      sectionImages: {
        ...state.sectionImages,
        [section]: url
      },
      activeEditingSection: null // 편집창 닫기
    })),

  toggleModifyOption: (option) =>
    set((state) => ({
      modifyOptions: {
        ...state.modifyOptions,
        [option]: !state.modifyOptions[option],
      },
    })),

  setUserInput: (key, value) =>
    set((state) => ({
      userInputs: {
        ...state.userInputs,
        [key]: value,
      },
    })),

  toggleMultiPage: () =>
    set((state) => ({
      modifyOptions: {
        ...state.modifyOptions,
        isMultiPage: !state.modifyOptions.isMultiPage,
      },
    })),

  resetPanel: () =>
    set({
      selectedTemplate: null,
      isPanelOpen: false,
      imageMode: "stock",
      uploadedImageUrl: null,
      uploadedImageFile: null,
      selectedStockImages: [],
      sectionImages: {},
      activeEditingSection: null,
      logoUrl: null,
      modifyOptions: defaultModifyOptions,
      userInputs: defaultUserInputs,
    }),
}));
