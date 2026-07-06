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
  toggleStockImage: (url: string) => void; // 스톡 이미지 선택/해제 토글
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
};

export const useBriefStore = create<BriefState>((set) => ({
  selectedCategory: "cafe",
  selectedTemplate: null,
  isPanelOpen: false,

  imageMode: "stock",
  uploadedImageUrl: null,
  uploadedImageFile: null,
  selectedStockImages: [],

  modifyOptions: defaultModifyOptions,
  userInputs: defaultUserInputs,

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
    set({
      uploadedImageUrl: url,
      uploadedImageFile: file,
    }),

  clearUploadedImage: () =>
    set({
      uploadedImageUrl: null,
      uploadedImageFile: null,
    }),

  toggleStockImage: (url) =>
    set((state) => {
      const exists = state.selectedStockImages.includes(url);
      const next = exists
        ? state.selectedStockImages.filter((x) => x !== url)
        : [...state.selectedStockImages, url];
      return { selectedStockImages: next };
    }),

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
      modifyOptions: defaultModifyOptions,
      userInputs: defaultUserInputs,
    }),
}));
