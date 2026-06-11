"use client";

// Featured places, restaurants and events on Home — fetched live from
// Supabase so admin-added content appears without a redeploy.
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Place, Restaurant, CityEvent } from "@/lib/types";
import { getSupabase } from "@/lib/supabase";
import { seedPlaces, seedRestaurants, seedEvents } from "@/lib/seed-data";
import { formatEventDate } from "@/lib/format";
import { FeaturedPlaceCard } from "../PlaceCard";
import { RestaurantScrollCard } from "../RestaurantCard";
import { SectionHeader } from "../ui";
import { useT } from "../LangProvider";

const eventPillColors: Record<string, string> = {
  religious: "bg-primary-50 text-primary-700",
  cultural: "bg-sand/15 text-sand",
  sports: "bg-positive-50 text-positive",
  trade: "bg-canvas text-muted",
  civic: "bg-canvas text-muted",
};

export default function HomeLive() {
  const t = useT();
  const sb = getSupabase();
  const [places, setPlaces] = useState<Place[]>(sb ? [] : seedPlaces);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(
    sb ? [] : seedRestaurants,
  );
  const [events, setEvents] = useState<CityEvent[]>(sb ? [] : seedEvents);

  useEffect(() => {
    const client = getSupabase();
    if (!client) return;
    client
      .from("places")
      .select("*")
      .eq("status", "published")
      .eq("is_featured", true)
      .then(({ data }) => data && setPlaces(data as Place[]));
    client
      .from("restaurants")
      .select("*")
      .eq("status", "published")
      .order("avg_rating", { ascending: false })
      .limit(6)
      .then(({ data }) => data && setRestaurants(data as Restaurant[]));
    client
      .from("events")
      .select("*")
      .eq("status", "published")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at")
      .limit(3)
      .then(({ data }) => data && setEvents(data as CityEvent[]));
  }, []);

  return (
    <>
      {places.length > 0 && (
        <section className="mt-7">
          <SectionHeader
            title={t("Featured Places", "प्रमुख स्थान")}
            href="/discover?tab=places"
          />
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
            {places.map((p) => (
              <FeaturedPlaceCard key={p.id} place={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-7">
        <SectionHeader
          title={t("Restaurants", "रेस्टोरेंट")}
          href="/discover?tab=restaurants"
        />
        {restaurants.length > 0 ? (
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
            {restaurants.map((r) => (
              <RestaurantScrollCard key={r.id} r={r} />
            ))}
          </div>
        ) : (
          <div className="card mx-4 p-5 text-center">
            <p className="text-sm text-muted">
              {t(
                "Restaurant listings are being added by the Satna team.",
                "रेस्टोरेंट सूची सतना टीम द्वारा जोड़ी जा रही है।",
              )}
            </p>
            <Link
              href="/more/feedback"
              className="mt-1 inline-block text-xs font-semibold text-primary"
            >
              {t("Suggest a restaurant →", "रेस्टोरेंट सुझाएँ →")}
            </Link>
          </div>
        )}
      </section>

      {events.length > 0 && (
        <section className="mt-7">
          <SectionHeader
            title={t("Upcoming events", "आगामी कार्यक्रम")}
            href="/events"
            linkLabel={t("See all events", "सभी देखें")}
          />
          <div className="space-y-3 px-4">
            {events.map((e) => (
              <Link key={e.id} href="/events" className="card flex items-center gap-3 p-3">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary-50 font-heading">
                  <span className="text-sm font-semibold leading-none text-primary">
                    {formatEventDate(e.starts_at).split(" ")[0]}
                  </span>
                  <span className="text-[10px] font-medium text-primary-700">
                    {formatEventDate(e.starts_at).split(" ")[1]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{e.title_en}</p>
                  <p className="truncate text-xs text-muted">{e.venue}</p>
                </div>
                <span className={`pill capitalize ${eventPillColors[e.category]}`}>
                  {e.category}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
