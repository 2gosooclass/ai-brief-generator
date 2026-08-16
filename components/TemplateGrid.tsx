"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useBriefStore } from "@/store/briefStore";
import TemplateCard from "./TemplateCard";
import CategoryTabs from "./CategoryTabs";
import templatesData from "@/data/templates.json";
import type { TemplatesData } from "@/lib/types";

const data = templatesData as TemplatesData;

export default function TemplateGrid() {
  const { selectedCategory } = useBriefStore();
  const templates = (data[selectedCategory] || []).map((t) => ({ ...t, categoryId: selectedCategory }));

  return (
    <div className="space-y-6 text-left">
      {/* 5대 카테고리 탭 복원 */}
      <CategoryTabs />

      {/* 선택된 카테고리의 템플릿 카드 그리드 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {templates.map((template, i) => (
            <TemplateCard key={template.id} template={template} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
