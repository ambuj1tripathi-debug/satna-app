"use client";

import { useMemo, useState } from "react";
import { seedGovtServices } from "@/lib/seed-more";
import { useT } from "../LangProvider";

export default function GovtServices() {
  const t = useT();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return seedGovtServices;
    return seedGovtServices.filter(
      (s) =>
        s.dept_en.toLowerCase().includes(q) ||
        s.dept_hi.includes(q) ||
        s.services.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="px-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t(
          "Search department or service…",
          "विभाग या सेवा खोजें…",
        )}
        className="mt-3 w-full rounded-full border border-cardline bg-white px-4 py-2.5 text-sm text-ink"
      />
      <div className="mt-3 space-y-2.5">
        {filtered.map((s) => (
          <article key={s.dept_en} className="card p-4">
            <h3 className="text-sm font-semibold text-ink">{s.dept_en}</h3>
            <p className="text-xs text-muted">{s.dept_hi}</p>
            <p className="mt-2 text-xs text-muted">📍 {s.address}</p>
            <p className="mt-0.5 text-xs text-muted">🕐 {s.timings}</p>
            <p className="mt-1.5 text-sm text-ink">{s.services}</p>
            <div className="mt-3 flex gap-2 border-t border-cardline pt-3">
              {s.phone && (
                <a
                  href={`tel:${s.phone}`}
                  className="flex-1 rounded-full bg-primary py-2 text-center text-xs font-semibold text-white"
                >
                  📞 {s.phone}
                </a>
              )}
              <button className="flex-1 rounded-full border border-cardline py-2 text-xs font-medium text-muted">
                {t("Update info", "जानकारी सुधारें")}
              </button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="card p-8 text-center text-sm text-muted">
            {t("No department matches your search.", "कोई विभाग नहीं मिला।")}
          </div>
        )}
      </div>
    </div>
  );
}
