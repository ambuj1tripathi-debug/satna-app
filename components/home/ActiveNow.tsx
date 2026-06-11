"use client";

import Link from "next/link";
import { seedLivePulse } from "@/lib/seed-data";
import { useT } from "../LangProvider";

const kindStyle = {
  dining: { emoji: "🤝", label_en: "Dine Together", label_hi: "साथ खाएँ", cls: "text-primary bg-primary-50" },
  cab: { emoji: "🚖", label_en: "Cab Share", label_hi: "कैब शेयर", cls: "text-positive bg-positive-50" },
  photo: { emoji: "📷", label_en: "New Photo", label_hi: "नई फोटो", cls: "text-sand bg-sand/10" },
};

export default function ActiveNow() {
  const t = useT();
  return (
    <section aria-label="Active right now" className="mt-7">
      <div className="mb-3 flex items-center gap-2 px-4">
        <h2 className="font-heading text-lg font-semibold text-ink">
          {t("Active right now", "अभी सक्रिय")}
        </h2>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
        </span>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
        {seedLivePulse.map((item) => {
          const k = kindStyle[item.kind];
          return (
            <Link
              key={item.id}
              href={item.href}
              className="card flex w-64 shrink-0 flex-col justify-between p-4"
            >
              <span className={`pill self-start ${k.cls}`}>
                {k.emoji} {t(k.label_en, k.label_hi)}
              </span>
              <p className="mt-2 text-sm font-medium leading-snug text-ink">
                {t(item.text_en, item.text_hi)}
              </p>
              <p className="mt-1.5 text-xs text-muted">{item.meta}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
