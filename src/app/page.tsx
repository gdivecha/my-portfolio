"use client";
import { ScrollWheel } from "@/components/ScrollWheel";
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

        {/* Scroll wheel (dial replacement) */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-xs">
            <ScrollWheel />
          </div>
        </div>
      </aside>

      {/* Mobile: top bar */}
      <div className="md:hidden sticky top-0 z-10 bg-neutral-950/80 backdrop-blur">
        <div className="p-3">
          {/* You could render a compact ScrollWheel or a simple dropdown here */}
          <div className="text-sm text-neutral-400">Menu</div>
        </div>
      </div>

      {/* Right: dynamic content (60%) */}
      <section className="h-[calc(100dvh-0px)] overflow-y-auto p-6 md:p-10">
        <div className="max-w-3xl">
          <SectionRenderer />
        </div>
      </section>
    </main>
  );
}