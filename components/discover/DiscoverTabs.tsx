"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RestaurantsExplorer from "./RestaurantsExplorer";
import PlacesExplorer from "./PlacesExplorer";
import DineTogether from "./DineTogether";
import CabShare from "./CabShare";
import Trails from "./Trails";
import Transport from "./Transport";
import GovtServices from "./GovtServices";
import type { Place, Restaurant } from "@/lib/types";

const subTabs = [
  { key: "places", label: "Places" },
  { key: "restaurants", label: "Restaurants" },
  { key: "dine", label: "Dine Together" },
  { key: "cab", label: "Share a Cab" },
  { key: "trails", label: "Heritage Trails" },
  { key: "transport", label: "Transport" },
  { key: "govt", label: "Govt Services" },
];

function Tabs({
  places,
  restaurants,
}: {
  places: Place[];
  restaurants: Restaurant[];
}) {
  const params = useSearchParams();
  const tab = params.get("tab") ?? "places";
  const filter = params.get("filter") ?? undefined;

  return (
    <>
      <div className="no-scrollbar sticky top-[61px] z-30 flex gap-2 overflow-x-auto border-b border-cardline bg-canvas px-4 py-2.5">
        {subTabs.map((s) => (
          <Link
            key={s.key}
            href={`/discover?tab=${s.key}`}
            className={`pill shrink-0 ${
              tab === s.key || (tab === "heritage" && s.key === "trails")
                ? "bg-primary font-semibold text-white"
                : "border border-cardline bg-white text-muted"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {tab === "restaurants" && <RestaurantsExplorer restaurants={restaurants} />}
      {tab === "places" && <PlacesExplorer places={places} initialFilter={filter} key={filter} />}
      {tab === "dine" && <DineTogether restaurants={restaurants} />}
      {tab === "cab" && <CabShare />}
      {(tab === "trails" || tab === "heritage") && <Trails />}
      {tab === "transport" && <Transport />}
      {tab === "govt" && <GovtServices />}
    </>
  );
}

export default function DiscoverTabs(props: {
  places: Place[];
  restaurants: Restaurant[];
}) {
  // useSearchParams requires a Suspense boundary for static export
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted">…</div>}>
      <Tabs {...props} />
    </Suspense>
  );
}
