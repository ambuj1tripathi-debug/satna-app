import Link from "next/link";
import type { Place } from "@/lib/types";
import { CardImage, CategoryBadge, Stars } from "./ui";

export function FeaturedPlaceCard({ place }: { place: Place }) {
  return (
    <Link
      href={`/discover?tab=places#${place.slug}`}
      className="card w-44 shrink-0 overflow-hidden"
    >
      <CardImage
        src={place.hero_image_url}
        alt={place.name_en}
        emojiKey={place.category}
        className="h-28 w-full"
      />
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-ink">{place.name_en}</p>
        <p className="truncate text-xs text-muted">{place.name_hi}</p>
        <div className="mt-2 flex items-center justify-between">
          {place.review_count > 0 ? (
            <Stars rating={place.avg_rating} />
          ) : (
            <span className="text-[11px] text-muted">—</span>
          )}
          <span className="text-[11px] text-muted">{place.distance_km} km</span>
        </div>
      </div>
    </Link>
  );
}

export function PlaceListCard({ place }: { place: Place }) {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    place.name_en + " Satna Madhya Pradesh",
  )}`;
  return (
    <article id={place.slug} className="card overflow-hidden">
      <CardImage
        src={place.hero_image_url}
        alt={place.name_en}
        emojiKey={place.category}
        className="h-40 w-full"
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-heading text-base font-semibold text-ink">
              {place.name_en}
            </h3>
            <p className="text-sm text-muted">{place.name_hi}</p>
          </div>
          {place.review_count > 0 && <Stars rating={place.avg_rating} />}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <CategoryBadge category={place.category} />
          {place.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="pill bg-canvas text-muted">{tag}</span>
          ))}
        </div>
        {place.description_en && (
          <p className="mt-2 line-clamp-2 text-sm text-muted">
            {place.description_en}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-cardline pt-3">
          <span className="text-xs text-muted">
            {place.distance_km} km from city center
          </span>
          <div className="flex gap-2">
            <button className="rounded-full border border-cardline px-3 py-1.5 text-xs font-medium text-muted">
              Update info
            </button>
            <a
              href={maps}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white"
            >
              Get directions
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
