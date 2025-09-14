"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUI, type SectionKey } from "@/store/ui";

/**
 * IMPORTANT: The imports below MUST match how each section file exports.
 * - If your section files use `export default`, import without braces.
 * - If they use `export const Name`, import with braces.
 */
import { Portfolio } from "@/components/sections/Portfolio";
import { Bonus } from "@/components/sections/Bonus";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { OpenSource } from "@/components/sections/OpenSource";
import { Certifications } from "@/components/sections/Certifications";
import { Recommendations } from "@/components/sections/Recommendations";

/** Simple fallback so we never render `undefined` */
const Fallback = () => null;

/** Exhaustive, type-safe registry */
const REGISTRY = {
  portfolio:       Portfolio,
  bonus:           Bonus,
  about:           About,
  skills:          Skills,
  experience:      Experience,
  projects:        Projects,
  "open-source":   OpenSource,
  certifications:  Certifications,
  recommendations: Recommendations,
} satisfies Record<SectionKey, React.ComponentType>;

export function SectionRenderer() {
  const section = useUI((s) => s.section);
  const Comp = REGISTRY[section] ?? Fallback;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={section}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22 }}
      >
        <Comp />
      </motion.div>
    </AnimatePresence>
  );
}