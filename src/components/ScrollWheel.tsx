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

const WINDOW = 9;                 // odd -> single center
const HALF = Math.floor(WINDOW / 2);
const ROW_H = 32;                 // px per row

// Tick colors
const ACTIVE_TICK   = "#C4C9FF";  // active section
const INACTIVE_TICK = "#15151B";  // all other sections

// Tick geometry + fine tuning
const TICK_W = 14;
const TICK_H = 3;
const TICK_X = 4;        // left offset (px)
const TICK_NUDGE = -1;   // -1 moves up 1px, 0 none, +1 moves down 1px

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

  // Build the 9 visible rows centered on current
  const items = useMemo(() => {
    const out: { key: SectionKey; label: string; offset: number }[] = [];
    for (let off = -HALF; off <= HALF; off++) {
      const idx = wrap(baseIndex + off);
      out.push({ key: BASE[idx].key, label: BASE[idx].label, offset: off });
    }
    return out;
  }, [baseIndex]);

  // Distance-based styling for labels
  const styleForOffset = (offset: number) => {
    const d = Math.abs(offset);
    const opacity = Math.max(0.3, 1 - d * 0.18);  // softer fade
    const scale   = Math.max(0.96, 1 - d * 0.015);
    return { opacity, scale };
  };

  // Wheel: one step per gesture
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
      {/* Rail with vertical gradient */}
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
        {/* One tick per row, centered with translateY(-50%) */}
        {items.map(({ key, offset }, i) => {
          const isCenter = offset === 0;
          const color  = isCenter ? ACTIVE_TICK : INACTIVE_TICK;

          // Middle of the row: add 0.5 row, then translateY(-50%) for perfect centering
          const rowMid = (HALF + offset + 0.5) * ROW_H;

          return (
            <div
              key={`tick-${key}-${i}`}
              aria-hidden
              style={{
                position: "absolute",
                left: TICK_X,
                top: rowMid + TICK_NUDGE,
                width: TICK_W,
                height: TICK_H,
                borderRadius: 9999,
                backgroundColor: color,
                transform: "translateY(-50%)",
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