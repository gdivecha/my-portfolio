"use client";
import { ScrollWheel } from "@/components/ScrollWheel";                   // vertical (desktop)
import { ScrollWheelHorizontal } from "@/components/ScrollWheelHorizontal"; // horizontal (mobile)
import { SectionRenderer } from "@/components/SectionRenderer";

export default function Home() {
  return (
    <main className="min-h-screen md:grid md:grid-cols-[40%_60%] md:overflow-hidden bg-neutral-950 text-white">
      {/* Desktop: static left (40%) */}
      <aside className="hidden md:flex flex-col gap-6 p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Gaurav</h1>
          <p className="text-sm text-neutral-400">Software Engineer</p>
        </header>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-xs">
            <ScrollWheel />
          </div>
        </div>
      </aside>

      {/* Mobile: top bar = what used to be on the left */}
      <div className="md:hidden sticky top-0 z-20 bg-neutral-950/90 backdrop-blur px-4 py-3">
        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold leading-none">Gaurav</h1>
          <p className="text-xs text-neutral-400">
            Software Engineer • Artist • Content Creator
          </p>
        </div>
      </div>

      {/* Right: dynamic content (desktop) / main content (mobile) */}
      <section className="min-h-[100dvh] md:h-[100dvh] overflow-y-auto px-4 py-6 md:p-10 pb-32 md:pb-10">
        {/* ^ pb-32 ensures content isn't hidden behind the bottom wheel on mobile */}
        <div className="max-w-3xl">
          <SectionRenderer />
        </div>
      </section>

      {/* Mobile: bottom horizontal scroll wheel */}
      <div className="md:hidden fixed left-0 right-0 bottom-0 z-30">
        <ScrollWheelHorizontal />
      </div>
    </main>
  );
}