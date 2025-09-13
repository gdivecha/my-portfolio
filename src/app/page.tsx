"use client";

import { useEffect, useRef } from "react";
import { useUI } from "@/store/ui";
import LeftPanel from "@/components/LeftPanel";
import { ScrollWheelHorizontal } from "@/components/ScrollWheelHorizontal";
import { SectionRenderer } from "@/components/SectionRenderer";

export default function Home() {
  const section = useUI((s) => s.section);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [section]);

  return (
    <main className="min-h-screen md:grid md:grid-cols-[40%_60%] md:overflow-hidden bg-neutral-950 text-white">
      {/* Desktop left panel */}
      <aside className="hidden md:block p-6">
        <LeftPanel />
      </aside>

      {/* Mobile top bar (what used to be left) */}
      <div className="md:hidden sticky top-0 z-20 bg-neutral-950/90 backdrop-blur px-4 py-3">
        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold leading-none">Gaurav</h1>
          <p className="text-xs text-neutral-400">
            Software Engineer • Artist • Content Creator
          </p>
        </div>
      </div>

      {/* Right content */}
      <section
        ref={contentRef}
        className="min-h-[100dvh] md:h-[100dvh] overflow-y-auto px-4 py-6 md:p-10 pb-32 md:pb-10"
      >
        <div className="max-w-3xl">
          <SectionRenderer key={section} />
        </div>
      </section>

      {/* Mobile bottom wheel */}
      <div className="md:hidden fixed left-0 right-0 bottom-0 z-30">
        <ScrollWheelHorizontal />
      </div>
    </main>
  );
}