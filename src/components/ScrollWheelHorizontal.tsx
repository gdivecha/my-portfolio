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

  // center the bar on the current section when it changes
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = Math.max(0, ITEMS.findIndex((i) => i.key === section));
    el.scrollTo({ left: idx * itemWidth, behavior: "auto" });
  }, [section, itemWidth]);

  // detect which section is in the middle after scroll
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
      style={{
        position: fixed ? "fixed" : "static",
        bottom: 0,
        left: 0,
        right: 0,
        overflow: "hidden",
      }}
    >
      <div
        ref={ref}
        style={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
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
            style={{
              flex: `0 0 ${itemWidth}px`,
              scrollSnapAlign: "center",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {section === it.key ? `> ${it.label}` : it.label}
          </div>
        ))}
      </div>
    </div>
  );
}