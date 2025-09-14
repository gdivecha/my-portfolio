"use client";

import { useMemo, useRef } from "react";
import { useUI, type SectionKey } from "@/store/ui";

const BASE: { key: SectionKey; label: string }[] = [
  { key: "projects",        label: "PROJECTS" },
  { key: "open-source",     label: "OPEN SOURCE" },
  { key: "certifications",  label: "CERTIFICATIONS" },
  { key: "recommendations", label: "RECOMMENDATIONS" },
  { key: "portfolio",       label: "PORTFOLIO" },
  { key: "bonus",           label: "BONUS" },
  { key: "about",           label: "ABOUT" },
  { key: "skills",          label: "SKILLS" },
  { key: "experience",      label: "EXPERIENCE" },
];

const WINDOW = 9;                 
const HALF = Math.floor(WINDOW / 2);
const ROW_H = 32;                 

// Tick colors
const ACTIVE_TICK   = "#C4C9FF";  // active section
const INACTIVE_TICK = "#15151B";  // all other sections

export function ScrollWheel() {
  const section = useUI((s) => s.section);
  const setSection = useUI((s) => s.setSection);

  const wrap = (i: number) => {
    const n = BASE.length;
    return ((i % n) + n) % n;
  };

  const baseIndex = useMemo(
    () => Math.max(0, BASE.findIndex((i) => i.key === section)),
    [section]
  );

  const items = useMemo(() => {
    const out: { key: SectionKey; label: string; offset: number }[] = [];
    for (let off = -HALF; off <= HALF; off++) {
      const idx = wrap(baseIndex + off);
      out.push({ key: BASE[idx].key, label: BASE[idx].label, offset: off });
    }
    return out;
  }, [baseIndex]);

  const styleForOffset = (offset: number) => {
    const d = Math.abs(offset);
    const opacity = Math.max(0.3, 1 - d * 0.18);
    const scale   = Math.max(0.96, 1 - d * 0.015);
    return { opacity, scale };
  };

  const accumRef = useRef(0);
  const lockedRef = useRef(false);
  const WHEEL_THRESHOLD = 40;
  const COOLDOWN_MS = 120;

  const lockFor = (ms: number) => {
    lockedRef.current = true;
    window.setTimeout(() => (lockedRef.current = false), ms);
  };

  const stepBy = (steps: number) => {
    const next = wrap(baseIndex + steps);
    setSection(BASE[next].key);
  };

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (lockedRef.current) return;
    accumRef.current += e.deltaY;
    if (Math.abs(accumRef.current) >= WHEEL_THRESHOLD) {
      const dir = Math.sign(accumRef.current);
      accumRef.current = 0;
      stepBy(dir);
      lockFor(COOLDOWN_MS);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowUp")   { e.preventDefault(); stepBy(-1); }
    if (e.key === "ArrowDown") { e.preventDefault(); stepBy(1); }
  };

  return (
    <div className="relative" aria-label="Section wheel">
      {/* Rail */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[22px] rounded-md"
        style={{
          background: `
            linear-gradient(
              to bottom,
              #15171B 0%,
              #25263C 25%,
              #303151 50%,
              #25263C 75%,
              #15171B 100%
            )
          `,
        }}
      >
        {/* One tick per row */}
        {items.map(({ key, offset }) => {
          const isCenter = offset === 0;

          const width  = 14;
          const height = 3;
          const color  = isCenter ? ACTIVE_TICK : INACTIVE_TICK;

          const top = (HALF + offset) * ROW_H + (ROW_H - height) / 2;

          return (
            <div
              key={`tick-${key}-${offset}`}
              aria-hidden
              style={{
                position: "absolute",
                left: 4,
                top,
                width,
                height,
                borderRadius: 9999,
                backgroundColor: color,
              }}
            />
          );
        })}
      </div>

      {/* List of section labels */}
      <div
        role="listbox"
        aria-activedescendant={`wheel-${section}`}
        tabIndex={0}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        className="pl-10 pr-4"
        style={{
          height: ROW_H * WINDOW,
          overflow: "hidden",
          userSelect: "none",
          lineHeight: `${ROW_H}px`,
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      >
        {items.map(({ key, label, offset }) => {
          const isCenter = offset === 0;
          const { opacity, scale } = styleForOffset(offset);
          return (
            <div
              key={`${key}-${offset}`}
              id={`wheel-${key}`}
              role="option"
              aria-selected={isCenter}
              onClick={() => !isCenter && stepBy(offset)}
              className={[
                "uppercase",
                isCenter
                  ? "[font-family:var(--font-sans)] font-extrabold text-[#C4C9FF]"
                  : "[font-family:var(--font-mono)] font-light text-portfolioDescription",
              ].join(" ")}
              style={{
                height: ROW_H,
                transformOrigin: "left center",
                transform: `scale(${scale})`,
                opacity,
                cursor: isCenter ? "default" : "pointer",
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}