import { create } from "zustand";

export type SectionKey =
  | "portfolio"
  | "bonus"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "open-source"
  | "certifications"
  | "recommendations";

type UIState = {
  section: SectionKey;
  setSection: (s: SectionKey) => void;
};

export const useUI = create<UIState>((set) => ({
  section: "portfolio",          // default selection
  setSection: (section) => set({ section }),
}));