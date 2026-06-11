"use client";

import { useMemo, useState } from "react";
import { seedLostFound } from "@/lib/seed-community";
import { useT } from "../LangProvider";

const filters = [
  { key: "all", en: "All", hi: "सभी" },
  { key: "lost", en: "Lost", hi: "खोया" },
  { key: "found", en: "Found", hi: "मिला" },
  { key: "resolved", en: "Resolved", hi: "हल हुआ" },
];

const categoryEmoji: Record<string, string> = {
  documents: "📄",
  valuables: "💍",
  pets: "🐕",
  other: "📦",
};

export default function LostFound() {
  const t = useT();
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return seedLostFound;
    if (filter === "resolved") return seedLostFound.filter((i) => i.status === "resolved");
    return seedLostFound.filter((i) => i.type === filter && i.status === "open");
  }, [filter]);

  return (
    <div className="px-4">
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`pill shrink-0 border ${
              filter === f.key
                ? "border-primary bg-primary-50 text-primary-700"
                : "border-cardline bg-white text-muted"
            }`}
          >
            {t(f.en, f.hi)}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {filtered.map((item) => (
          <article key={item.id} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <span
                className={`pill ${
                  item.status === "resolved"
                    ? "bg-canvas text-muted"
                    : item.type === "lost"
                      ? "bg-danger/10 text-danger"
                      : "bg-positive-50 text-positive"
                }`}
              >
                {item.status === "resolved"
                  ? `✓ ${t("Resolved", "हल हुआ")}`
                  : item.type === "lost"
                    ? t("Lost", "खोया")
                    : t("Found", "मिला")}
              </span>
              <span className="text-lg">{categoryEmoji[item.category]}</span>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-ink">{item.title}</h3>
            <p className="mt-1 text-sm text-muted">{item.description}</p>
            <p className="mt-2 text-xs text-muted">📍 {item.location}</p>
            {item.status === "open" && (
              <button className="mt-3 w-full rounded-full border border-primary py-2 text-xs font-semibold text-primary">
                {t("Contact (masked for privacy)", "संपर्क करें (गोपनीयता हेतु छुपा)")}
              </button>
            )}
          </article>
        ))}
      </div>

      <button className="mt-4 w-full rounded-full border-2 border-dashed border-primary/50 py-3 text-sm font-semibold text-primary">
        + {t("Report lost or found item", "खोई/मिली वस्तु दर्ज करें")}
      </button>
      <p className="mt-2 text-center text-[10px] text-muted">
        {t("Posts auto-archive after 30 days", "पोस्ट 30 दिन बाद स्वतः आर्काइव")}
      </p>
    </div>
  );
}
