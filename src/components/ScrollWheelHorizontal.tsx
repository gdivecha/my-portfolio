"use client";

import { useEffect, useMemo, useRef } from "react";
import { useUI, SectionKey } from "@/store/ui";

const ITEMS: { key: SectionKey; label: string }[] = [
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

export function ScrollWheelHorizontal({
  fixed = true,
  itemWidth = 140,
}: {
  fixed?: boolean;
  itemWidth?: number;
}) {
  const section = useUI((s) => s.section);
  const setSection = useUI((s) => s.setSection);

  const ref = useRef<HTMLDivElement>(null);
  const pad = useMemo(() => `calc(50vw - ${itemWidth / 2}px)`, [itemWidth]);

  // center the bar on the current section
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const idx = Math.max(0, ITEMS.findIndex((i) => i.key === section));
    const x = idx * itemWidth;
    el.scrollTo({ left: x, behavior: "auto" });
  }, [section, itemWidth]);

  // choose the centered section after scroll
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let t: number | undefined;
    const pickCenter = () => {
      const { left, width } = el.getBoundingClientRect();
      const centerX = left + width / 2;

      let bestIdx = 0;
      let bestDist = Infinity;

      el.querySelectorAll<HTMLDivElement>('[data-wheel-item="1"]').forEach((node, i) => {
        const r = node.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const d = Math.abs(cx - centerX);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      });

      const chosen = ITEMS[bestIdx]?.key;
      if (chosen) setSection(chosen);
    };

    const onScroll = () => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(pickCenter, 80);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (t) window.clearTimeout(t);
    };
  }, [setSection]);

  return (
    <div
      className={`${
        fixed ? "fixed" : "static"
      } bottom-0 left-0 right-0 z-50 bg-neutral-950/90 backdrop-blur`}
    >
      <div
        ref={ref}
        className="flex overflow-x-auto overflow-y-hidden no-scrollbar"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
          paddingLeft: pad,
          paddingRight: pad,
        }}
      >
        {ITEMS.map((it) => (
          <div
            key={it.key}
            data-wheel-item="1"
            style={{ flex: `0 0 ${itemWidth}px`, scrollSnapAlign: "center" }}
            className={`text-center uppercase whitespace-nowrap ${
              section === it.key
                ? "text-indigo-300 font-extrabold text-sm"
                : "text-neutral-400/70 font-semibold text-xs"
            }`}
          >
            {it.label}
          </div>
        ))}
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}