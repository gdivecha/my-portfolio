"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useUI, SectionKey } from "@/store/ui";

const ITEMS: { key: SectionKey; label: string }[] = [
  { key: "portfolio",       label: "PORTFOLIO" },
  { key: "bonus",           label: "BONUS" },
  { key: "about",           label: "ABOUT" },
  { key: "skills",          label: "SKILLS" },
  { key: "experience",      label: "EXPERIENCE" },
  { key: "projects",        label: "PROJECTS" },
  { key: "open-source",     label: "OPEN SOURCE" },
  { key: "certifications",  label: "CERTIFICATIONS" },
  { key: "recommendations", label: "RECOMMENDATIONS" },
];

const ROW_H = 48;            // px per row
const VISIBLE_ROWS = 7;      // odd number so there is a single center
const CENTER_INDEX = Math.floor(VISIBLE_ROWS / 2);

export function ScrollWheel() {
  const section = useUI((s) => s.section);
  const setSection = useUI((s) => s.setSection);

  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const snapTimer = useRef<number | null>(null);

  // bounds
  const MIN_Y = -(ITEMS.length - 1 - CENTER_INDEX) * ROW_H;
  const MAX_Y = CENTER_INDEX * ROW_H;

  // center the current section on mount/external changes
  const initialIndex = useMemo(
    () => Math.max(0, ITEMS.findIndex((i) => i.key === section)),
    [section]
  );
  useEffect(() => {
    const target = -(initialIndex - CENTER_INDEX) * ROW_H;
    animate(y, target, { duration: 0.2, ease: "easeOut" });
  }, [initialIndex, y]);

  const snapToNearest = () => {
    const current = y.get();
    const rawIndex = CENTER_INDEX - Math.round(current / ROW_H);
    const clampedIndex = Math.max(0, Math.min(ITEMS.length - 1, rawIndex));
    const targetY = -(clampedIndex - CENTER_INDEX) * ROW_H;
    animate(y, targetY, { duration: 0.18, ease: "easeOut" });
    setSection(ITEMS[clampedIndex].key);
  };

  const scheduleSnap = () => {
    if (snapTimer.current) cancelAnimationFrame(snapTimer.current);
    snapTimer.current = requestAnimationFrame(() => {
      // wait a tiny bit more to detect “stop”
      setTimeout(snapToNearest, 60);
    }) as unknown as number;
  };

  // wheel (mouse/trackpad)
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const deltaRows = Math.sign(e.deltaY); // -1 up, 1 down
    const next = y.get() - deltaRows * ROW_H;
    y.set(Math.max(MIN_Y, Math.min(MAX_Y, next)));
    scheduleSnap();
  };

  return (
    <div
      ref={containerRef}
      onWheel={onWheel}
      className="relative select-none"
      style={{
        height: ROW_H * VISIBLE_ROWS,
        width: "100%",
        maskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
      }}
    >
      {/* rail + center tick */}
      <div className="absolute left-0 top-0 bottom-0 w-2 rounded-md bg-gradient-to-b from-[#202234] via-[#1b1d2a] to-[#161827]" />
      <div
        aria-hidden
        className="absolute left-0 right-0"
        style={{ top: CENTER_INDEX * ROW_H, height: ROW_H }}
      >
        <div className="absolute left-0 w-2 h-2 rounded-full bg-indigo-300/90 translate-y-3" />
      </div>

      {/* draggable list */}
      <motion.div
        drag="y"
        dragConstraints={{ top: MIN_Y, bottom: MAX_Y }}
        style={{ y }}
        onDragEnd={snapToNearest}
        className="pl-6 pr-4"
      >
        {ITEMS.map((item) => {
          const isActive = section === item.key;
          return (
            <div
              key={item.key}
              style={{ height: ROW_H }}
              className={`flex items-center uppercase select-none ${
                isActive
                  ? "text-indigo-300 font-extrabold text-lg"
                  : "text-neutral-500 font-semibold text-base opacity-50"
              }`}
              // no onClick — wheel/drag only
            >
              {item.label}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}