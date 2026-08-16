"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBriefStore } from "@/store/briefStore";
import TemplateCard from "./TemplateCard";
import templatesData from "@/data/templates.json";
import type { TemplatesData, Template } from "@/lib/types";

const data = templatesData as TemplatesData;

export default function TemplateGrid() {
  const templates = useMemo(() => {
    return Object.entries(data).flatMap(([catId, templatesList]) =>
      templatesList.map((t: Template) => ({ ...t, categoryId: catId }))
    );
  }, []);

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key="all-templates"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
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
