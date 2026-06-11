import TopBar from "@/components/TopBar";
import { getUpcomingEvents } from "@/lib/data";
import { formatEventDate } from "@/lib/format";

const pillColors: Record<string, string> = {
  religious: "bg-primary-50 text-primary-700",
  cultural: "bg-sand/15 text-sand",
  sports: "bg-positive-50 text-positive",
  trade: "bg-canvas text-muted",
  civic: "bg-canvas text-muted",
};

export default async function EventsPage() {
  const events = await getUpcomingEvents(20);

  return (
    <main>
      <TopBar />
      <div className="px-4 pt-4">
        <h1 className="font-heading text-xl font-semibold text-ink">
          Upcoming Events
        </h1>
        <p className="text-sm text-muted">आगामी कार्यक्रम</p>
        <div className="mt-4 space-y-3">
          {events.map((e) => (
            <article key={e.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-heading text-base font-semibold text-ink">
                    {e.title_en}
                  </h2>
                  <p className="text-sm text-muted">{e.title_hi}</p>
                </div>
                <span className={`pill capitalize ${pillColors[e.category]}`}>
                  {e.category}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">
                📅 {formatEventDate(e.starts_at)}
                {e.ends_at && ` – ${formatEventDate(e.ends_at)}`}
                {e.venue && <> · 📍 {e.venue}</>}
              </p>
              {e.description && (
                <p className="mt-2 text-sm text-ink">{e.description}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
