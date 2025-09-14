"use client";

import { ScrollWheel } from "@/components/ScrollWheel";

/* GitHub Logo */
function IconGitHub(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.85 9.7.5.1.68-.22.68-.49 0-.24-.01-.86-.01-1.68-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.92-.64.07-.63.07-.63 1.02.07 1.55 1.07 1.55 1.07.9 1.58 2.37 1.12 2.95.85.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.04-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.05.8-.23 1.65-.34 2.5-.34s1.7.11 2.5.34c1.9-1.32 2.75-1.05 2.75-1.05.55 1.43.2 2.49.1 2.75.65.72 1.04 1.63 1.04 2.75 0 3.94-2.33 4.81-4.55 5.07.35.32.67.95.67 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.68.49A10.01 10.01 0 0022 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

/* LinkedIn Logo */
function IconLinkedIn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
      {...props}
    >
      <path d="M19 0h-14C2.23 0 0 2.23 0 5v14c0 2.77 2.23 5 5 5h14c2.77 0 5-2.23 5-5V5c0-2.77-2.23-5-5-5zm-11 19H5V9h3v10zM6.5 7.5C5.12 7.5 4 6.38 4 5s1.12-2.5 2.5-2.5S9 3.62 9 5 7.88 7.5 6.5 7.5zM20 19h-3v-5.5c0-1.1-.9-2-2-2s-2 .9-2 2V19h-3V9h3v1.4c.6-.9 1.6-1.4 2.7-1.4 2 0 3.3 1.6 3.3 3.6V19z" />
    </svg>
  );
}

export default function LeftPanel() {
  return (
    <div className="grid h-full place-content-center">
      <div>
        {/* Header */}
        <header>
          <h1
            className="
              text-7xl md:text-7xl font-extrabold 
              bg-gradient-to-r from-indigo-200 via-indigo-500 to-indigo-300
              bg-clip-text text-transparent 
              animate-gradient 
              bg-[length:200%_200%]
            "
          >
            Gaurav Divecha
          </h1>
          <p className="text-2xl text-highlights font-thin">
            Software Engineer ◦ Artist ◦ Content Creator
          </p>
          <p className="text-xl text-portfolioDescription font-thin">
            I design and build efficient, user-focused solutions across web,
            cloud, and software systems, creating impactful digital experiences.
          </p>
        </header>

        {/* Dial */}
        <div className="my-6">
          <ScrollWheel />
        </div>

        {/* Contact Buttons */}
        <div className="mt-6 flex gap-4">
          {/* GitHub */}
          <a
            href="https://github.com/gdivecha"
            target="_blank"
            rel="noreferrer"
            className="grid h-12 w-12 place-items-center rounded-full bg-[#575696] text-black hover:opacity-80 transition"
          >
            <IconGitHub className="h-8 w-8" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/gauravcdivecha"
            target="_blank"
            rel="noreferrer"
            className="grid h-12 w-12 place-items-center rounded-full bg-[#575696] text-black hover:opacity-80 transition"
          >
            <IconLinkedIn />
          </a>
        </div>
      </div>
    </div>
  );
}