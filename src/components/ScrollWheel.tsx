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
  // add "contact" here if/when you include it in SectionKey + SectionRenderer
  { key: "about",           label: "ABOUT" },
  { key: "skills",          label: "SKILLS" },
  { key: "experience",      label: "EXPERIENCE" },
];

const WINDOW = 9;                // odd -> single center
const HALF = Math.floor(WINDOW / 2);
const ROW_H = 32;                // px per row

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

  // Build 9 visible rows centered on current
  const items = useMemo(() => {
    const out: { key: SectionKey; label: string; offset: number }[] = [];
    for (let off = -HALF; off <= HALF; off++) {
      const idx = wrap(baseIndex + off);
      out.push({ key: BASE[idx].key, label: BASE[idx].label, offset: off });
    }
    return out;
  }, [baseIndex]);

  // Distance-based styling (center brightest)
  const styleForOffset = (offset: number) => {
    const d = Math.abs(offset);
    const opacity = Math.max(0.3, 1 - d * 0.18);  // softer fade
    const scale   = Math.max(0.96, 1 - d * 0.015);
    return { opacity, scale };
  };

  // Debounced wheel (one step per gesture)
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
    if (e.key === "ArrowUp") { e.preventDefault(); stepBy(-1); }
    if (e.key === "ArrowDown") { e.preventDefault(); stepBy(1); }
  };

  return (
    <div className="relative" aria-label="Section wheel">
      {/* Left rail with dashed slots */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[22px]"
        style={{
            background: `
            linear-gradient(
                to bottom,
                #15171B 0%,      /* dark top */
                #25263C 25%,     /* softer dark */
                #303151 50%,     /* highlight middle */
                #25263C 75%,     /* softer dark */
                #15171B 100%     /* dark bottom */
            ),
            repeating-linear-gradient(
                180deg,
                transparent 0 10px,
                transparent 10px,
                rgba(255,255,255,0.08) 12px,
                transparent 26px
            )
            `,
            boxShadow: "inset 0 0 0 0px rgba(99,102,241,.08)",
        }}
      />      
     {/* Center tick */}
      <div
        aria-hidden
        className="absolute left-0 right-0 pointer-events-none"
        style={{ top: HALF * ROW_H, height: ROW_H }}
      >
        <div className="absolute left-[4px] w-[14px] h-[4px] rounded-full bg-[#C4C9FF] translate-y-[12px]" />
      </div>

      {/* List */}
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
          // top/bottom vignette
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
                // ACTIVE row: Jost (or your sans), extra bold, accent color
                ? "[font-family:var(--font-sans)] font-extrabold text-[#C4C9FF]"
                // INACTIVE rows: mono (or alt), lighter weight, dimmer color
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