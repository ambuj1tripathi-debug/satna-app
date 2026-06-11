"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { heroBanners } from "@/lib/seed-data";
import { useT } from "../LangProvider";

const tones = {
  primary: "from-primary to-[#6D89AC] text-white",
  heritage: "from-sand to-[#A98F60] text-white",
  danger: "from-danger to-[#CC8189] text-white",
};

export default function HeroBanner() {
  const t = useT();
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // auto-play every 4s
  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % heroBanners.length),
      4000,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, [index]);

  return (
    <section aria-label="Highlights" className="pt-3">
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4"
      >
        {heroBanners.map((b) => (
          <Link
            key={b.id}
            href={b.href}
            className={`flex min-h-[96px] w-[85%] shrink-0 snap-start flex-col justify-between rounded-card bg-gradient-to-br p-4 shadow-card ${tones[b.tone]}`}
          >
            <p className="font-heading text-base font-semibold leading-snug">
              {t(b.title_en, b.title_hi)}
            </p>
            <span className="text-xs font-medium opacity-90">
              {t("Tap to open", "खोलने के लिए टैप करें")} →
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {heroBanners.map((b, i) => (
          <span
            key={b.id}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-4 bg-primary" : "w-1.5 bg-cardline"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
