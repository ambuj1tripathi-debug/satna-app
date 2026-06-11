"use client";

import { useMemo, useState } from "react";
import type { Restaurant, VegType, PriceRange } from "@/lib/types";
import { RestaurantListCard } from "../RestaurantCard";
import { useT } from "../LangProvider";

const vegFilters: { key: VegType | "all"; en: string; hi: string }[] = [
  { key: "all", en: "All", hi: "सभी" },
  { key: "veg", en: "Veg only", hi: "केवल शाकाहारी" },
  { key: "non_veg", en: "Non-veg", hi: "मांसाहारी" },
  { key: "pure_veg", en: "Pure veg", hi: "शुद्ध शाकाहारी" },
  { key: "jain", en: "Jain", hi: "जैन" },
];

const cuisines = ["North Indian", "South Indian", "Chinese", "Chaat", "Sweets", "Dhabha"];
const prices: { key: PriceRange; label: string }[] = [
  { key: "budget", label: "₹" },
  { key: "mid", label: "₹₹" },
  { key: "premium", label: "₹₹₹" },
];
const sorts = [
  { key: "rating", en: "Rating", hi: "रेटिंग" },
  { key: "distance", en: "Distance", hi: "दूरी" },
  { key: "newest", en: "Newest", hi: "नवीनतम" },
] as const;

export default function RestaurantsExplorer({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const t = useT();
  const [veg, setVeg] = useState<VegType | "all">("all");
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [price, setPrice] = useState<PriceRange | null>(null);
  const [sort, setSort] = useState<(typeof sorts)[number]["key"]>("rating");

  const filtered = useMemo(() => {
    let list = restaurants.filter((r) => {
      if (veg === "veg" && !["veg", "pure_veg", "jain"].includes(r.veg_type)) return false;
      if (veg === "non_veg" && !["non_veg", "mixed"].includes(r.veg_type)) return false;
      if (veg === "pure_veg" && r.veg_type !== "pure_veg") return false;
      if (veg === "jain" && r.veg_type !== "jain") return false;
      if (cuisine && !r.cuisines.includes(cuisine)) return false;
      if (price && r.price_range !== price) return false;
      return true;
    });
    list = list.slice().sort((a, b) => {
      if (sort === "rating") return b.avg_rating - a.avg_rating;
      if (sort === "distance") return (a.distance_km ?? 99) - (b.distance_km ?? 99);
      return 0; // newest: seed order
    });
    return list;
  }, [restaurants, veg, cuisine, price, sort]);

  return (
    <div>
      {/* veg filter row */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-3">
        {vegFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setVeg(f.key)}
            className={`pill shrink-0 border ${
              veg === f.key
                ? "border-positive bg-positive-50 text-positive"
                : "border-cardline bg-white text-muted"
            }`}
          >
            {t(f.en, f.hi)}
          </button>
        ))}
      </div>

      {/* cuisine + price row */}
      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto px-4">
        {cuisines.map((c) => (
          <button
            key={c}
            onClick={() => setCuisine(cuisine === c ? null : c)}
            className={`pill shrink-0 border ${
              cuisine === c
                ? "border-primary bg-primary-50 text-primary-700"
                : "border-cardline bg-white text-muted"
            }`}
          >
            {c}
          </button>
        ))}
        <span className="mx-1 w-px shrink-0 bg-cardline" />
        {prices.map((p) => (
          <button
            key={p.key}
            onClick={() => setPrice(price === p.key ? null : p.key)}
            className={`pill shrink-0 border ${
              price === p.key
                ? "border-primary bg-primary-50 text-primary-700"
                : "border-cardline bg-white text-muted"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* sort row */}
      <div className="mt-3 flex items-center gap-2 px-4">
        <span className="text-xs font-medium text-muted">{t("Sort:", "क्रम:")}</span>
        {sorts.map((s) => (
          <button
            key={s.key}
            onClick={() => setSort(s.key)}
            className={`text-xs font-medium ${
              sort === s.key ? "text-primary underline underline-offset-4" : "text-muted"
            }`}
          >
            {t(s.en, s.hi)}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted">
          {filtered.length} {t("results", "परिणाम")}
        </span>
      </div>

      <div className="mt-3 space-y-3 px-4">
        {filtered.map((r) => (
          <RestaurantListCard key={r.id} r={r} />
        ))}
        {filtered.length === 0 && (
          <div className="card p-8 text-center text-sm text-muted">
            {t(
              "No restaurants match these filters — try removing one.",
              "इन फ़िल्टर से कोई रेस्टोरेंट नहीं मिला — एक हटाकर देखें।",
            )}
          </div>
        )}
      </div>
    </div>
  );
}
