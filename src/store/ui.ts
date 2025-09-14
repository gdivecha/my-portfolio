import { create } from "zustand";

/** Keep the canonical order in one place so wheels can reuse it */
export const SECTIONS = [
  "portfolio",
  "bonus",
  "about",
  "skills",
  "experience",
  "projects",
  "open-source",
  "certifications",
  "recommendations",
] as const;

export type SectionKey = (typeof SECTIONS)[number];

type UIState = {
  section: SectionKey;
  setSection: (s: SectionKey) => void;

  /** Optional helpers for wrap-around navigation */
  nextSection: () => void;
  prevSection: () => void;
};

export const useUI = create<UIState>((set, get) => ({
  section: "portfolio",

  setSection: (section) => set({ section }),

  nextSection: () => {
    const cur = get().section;
    const i = SECTIONS.indexOf(cur);
    const next = SECTIONS[(i + 1) % SECTIONS.length];
    set({ section: next });
  },

  prevSection: () => {
    const cur = get().section;
    const i = SECTIONS.indexOf(cur);
    const prev = SECTIONS[(i - 1 + SECTIONS.length) % SECTIONS.length];
    set({ section: prev });
  },
}));