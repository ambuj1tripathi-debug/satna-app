import Link from "next/link";
import TopBar from "@/components/TopBar";
import HeroBanner from "@/components/home/HeroBanner";
import QuickActions from "@/components/home/QuickActions";
import TodayInSatna from "@/components/home/TodayInSatna";
import ActiveNow from "@/components/home/ActiveNow";
import { FeaturedPlaceCard } from "@/components/PlaceCard";
import { RestaurantScrollCard } from "@/components/RestaurantCard";
import { SectionHeader } from "@/components/ui";
import { getFeaturedPlaces, getRestaurants, getUpcomingEvents } from "@/lib/data";
import { formatEventDate } from "@/lib/format";

const eventPillColors: Record<string, string> = {
  religious: "bg-primary-50 text-primary-700",
  cultural: "bg-sand/15 text-sand",
  sports: "bg-positive-50 text-positive",
  trade: "bg-canvas text-muted",
  civic: "bg-canvas text-muted",
};

export default async function HomePage() {
  const [places, restaurants, events] = await Promise.all([
    getFeaturedPlaces(),
    getRestaurants(),
    getUpcomingEvents(3),
  ]);
  const popular = restaurants
    .slice()
    .sort((a, b) => b.avg_rating - a.avg_rating)
    .slice(0, 6);

  return (
    <main>
      <TopBar />
      <HeroBanner />
      <QuickActions />
      <TodayInSatna />

      <section className="mt-7">
        <SectionHeader
          title="Featured Places"
          hindi="प्रमुख स्थान"
          href="/discover?tab=places"
        />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
          {places.map((p) => (
            <FeaturedPlaceCard key={p.id} place={p} />
          ))}
        </div>
      </section>

      <section className="mt-7">
        <SectionHeader
          title="Popular Restaurants right now"
          hindi="लोकप्रिय रेस्टोरेंट"
          href="/discover?tab=restaurants"
        />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
          {popular.map((r) => (
            <RestaurantScrollCard key={r.id} r={r} />
          ))}
        </div>
      </section>

      <section className="mt-7">
        <SectionHeader
          title="Upcoming events"
          hindi="आगामी कार्यक्रम"
          href="/events"
          linkLabel="See all events"
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

      <ActiveNow />
      <div className="h-6" />
    </main>
  );
}
