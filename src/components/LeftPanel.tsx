"use client";

import { ScrollWheel } from "@/components/ScrollWheel";

export default function LeftPanel() {
  return (
    <div className="grid h-full place-content-center">
      <div>
        {/* Header */}
        <header>
          <h1>Gaurav Divecha</h1>
          <p>Software Engineer ◦ Artist ◦ Content Creator</p>
          <p>
            I design and build efficient, user-focused solutions across web,
            cloud, and software systems, creating impactful digital experiences.
          </p>
        </header>

        {/* Dial */}
        <div>
          <ScrollWheel />
        </div>
      </div>
    </div>
  );
}