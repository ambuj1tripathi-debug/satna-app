"use client";

import { useState } from "react";
import { seedTrails } from "@/lib/seed-more";
import { usePersistentState } from "@/lib/store";
import { useT } from "../LangProvider";

export default function Trails() {
  const t = useT();
  const [open, setOpen] = useState<string | null>(null);
  const [active, setActive] = usePersistentState<string | null>("active-trail", null);
  const [doneStops, setDoneStops] = usePersistentState<string[]>("trail-stops-done", []);

  return (
    <div className="mt-3 space-y-3 px-4">
      <p className="text-xs text-muted">
        {t(
          "Guided, sequential heritage walks — culturally rich, at your own pace.",
          "क्रमबद्ध धरोहर यात्राएँ — अपनी गति से, संस्कृति में डूबकर।",
        )}
      </p>
      {seedTrails.map((trail) => {
        const isOpen = open === trail.slug;
        const isActive = active === trail.slug;
        const completed = trail.stops.filter((s) =>
          doneStops.includes(`${trail.slug}:${s.name}`),
        ).length;
        return (
          <article key={trail.slug} className="card overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : trail.slug)}
              className="w-full text-left"
            >
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 text-5xl">
                {trail.emoji}
              </div>
              <div className="p-4">
                <h3 className="font-heading text-base font-semibold text-ink">
                  {trail.name_en}
                </h3>
                <p className="text-sm text-muted">{trail.name_hi}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="pill bg-primary-50 text-primary-700">⏱ {trail.duration}</span>
                  <span className="pill bg-canvas text-muted">{trail.difficulty}</span>
                  <span className="pill bg-canvas text-muted">
                    {trail.stops.length} {t("stops", "पड़ाव")}
                  </span>
                  {isActive && (
                    <span className="pill bg-positive-50 text-positive">
                      ● {t("In progress", "जारी")} {completed}/{trail.stops.length}
                    </span>
                  )}
                </div>
              </div>
            </button>
            {isOpen && (
              <div className="border-t border-cardline p-4">
                <p className="text-sm leading-relaxed text-muted">{trail.intro}</p>
                <ol className="mt-3 space-y-3">
                  {trail.stops.map((stop, i) => {
                    const key = `${trail.slug}:${stop.name}`;
                    const done = doneStops.includes(key);
                    return (
                      <li key={stop.name} className="flex gap-3">
                        <button
                          onClick={() =>
                            isActive &&
                            setDoneStops(
                              done
                                ? doneStops.filter((s) => s !== key)
                                : [...doneStops, key],
                            )
                          }
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                            done
                              ? "bg-positive text-white"
                              : "bg-primary-50 text-primary-700"
                          }`}
                        >
                          {done ? "✓" : i + 1}
                        </button>
                        <div>
                          <p className="text-sm font-medium text-ink">{stop.name}</p>
                          <p className="text-xs text-muted">{stop.description}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <button
                  onClick={() => setActive(isActive ? null : trail.slug)}
                  className={`mt-4 w-full rounded-full py-2.5 text-sm font-semibold ${
                    isActive
                      ? "border border-cardline text-muted"
                      : "bg-primary text-white"
                  }`}
                >
                  {isActive
                    ? t("End trail", "ट्रेल समाप्त करें")
                    : t("Start Trail — tick stops as you go", "ट्रेल शुरू करें")}
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
