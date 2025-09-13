"use client";

import { useMemo } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useUI, SectionKey } from "@/store/ui";

const BASE: { key: SectionKey; label: string }[] = [
  { key: "portfolio", label: "PORTFOLIO" },
  { key: "bonus", label: "BONUS" },
  { key: "about", label: "ABOUT" },
  { key: "skills", label: "SKILLS" },
  { key: "experience", label: "EXPERIENCE" },
  { key: "projects", label: "PROJECTS" },
  { key: "open-source", label: "OPEN SOURCE" },
  { key: "certifications", label: "CERTIFICATIONS" },
  { key: "recommendations", label: "RECOMMENDATIONS" },
];

const ROW_H = 40;           // px per row
const WINDOW = 9;           // must be odd
const HALF = Math.floor(WINDOW / 2); // 4

export function ScrollWheel() {
  const section = useUI((s) => s.section);
  const setSection = useUI((s) => s.setSection);

  const y = useMotionValue(0);

  const baseIndex = useMemo(
    () => Math.max(0, BASE.findIndex((i) => i.key === section)),
    [section]
  );

  // move selection by N steps (wraps)
  const stepBy = (steps: number) => {
    const len = BASE.length;
    const next = ((baseIndex + steps) % len + len) % len;
    setSection(BASE[next].key);
    // recenter the virtual list (y -> 0)
    animate(y, 0, { duration: 0.12 });
  };

  // Snap to nearest whole row after drag
  const onDragEnd = () => {
    const moved = -Math.round(y.get() / ROW_H); // positive when dragged up
    if (moved !== 0) stepBy(moved);
    else animate(y, 0, { duration: 0.12 });
  };

  // Wheel: one row per tick
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const dir = Math.sign(e.deltaY);
    if (dir !== 0) stepBy(dir);
  };

  // build the 9 visible items (current centered)
  const items = Array.from({ length: WINDOW }, (_, i) => {
    const offset = i - HALF; // -4..0..+4
    const len = BASE.length;
    const idx = ((baseIndex + offset) % len + len) % len;
    return { key: BASE[idx].key, label: BASE[idx].label, offset };
  });

  return (
    <div
      onWheel={onWheel}
      style={{
        height: ROW_H * WINDOW,
        width: "100%",
        overflow: "hidden",
        userSelect: "none",
        fontFamily: "inherit",
        lineHeight: `${ROW_H}px`,
      }}
    >
      <motion.div
        drag="y"
        dragConstraints={{ top: -HALF * ROW_H, bottom: HALF * ROW_H }}
        style={{ y }}
        onDragEnd={onDragEnd}
      >
        {items.map(({ key, label, offset }) => {
          const isCenter = offset === 0;
          return (
            <div key={`${key}-${offset}`} style={{ height: ROW_H }}>
              {isCenter ? `> ${label}` : label}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}