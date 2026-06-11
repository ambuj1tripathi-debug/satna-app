"use client";

import { useEffect, useMemo, useState } from "react";
import type { Place, PlaceCategory } from "@/lib/types";
import { PlaceListCard } from "../PlaceCard";
import { getSupabase } from "@/lib/supabase";
import { useT } from "../LangProvider";

const filters: { key: PlaceCategory | "all"; en: string; hi: string }[] = [
  { key: "all", en: "All", hi: "सभी" },
  { key: "religious", en: "Religious", hi: "धार्मिक" },
  { key: "nature", en: "Nature", hi: "प्रकृति" },
  { key: "heritage", en: "Heritage", hi: "धरोहर" },
  { key: "infrastructure", en: "Infrastructure", hi: "अवसंरचना" },
  { key: "shopping", en: "Shopping", hi: "खरीदारी" },
  { key: "education", en: "Education", hi: "शिक्षा" },
];

export default function PlacesExplorer({
  places,
  initialFilter,
}: {
  places: Place[];
  initialFilter?: string;
}) {
  const t = useT();
  const [filter, setFilter] = useState<PlaceCategory | "all">(
    filters.some((f) => f.key === initialFilter)
      ? (initialFilter as PlaceCategory)
      : "all",
  );

  const [live, setLive] = useState<Place[] | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.from("places")
      .select("*")
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .then(({ data }) => data && setLive(data as Place[]));
  }, []);

  const source = live ?? places;
  const filtered = useMemo(
    () => (filter === "all" ? source : source.filter((p) => p.category === filter)),
    [source, filter],
  );

  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-3">
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
      <div className="mt-3 space-y-4 px-4">
        {filtered.map((p) => (
          <PlaceListCard key={p.id} place={p} />
        ))}
      </div>
    </div>
  );
}
