import Link from "next/link";
import type { Restaurant } from "@/lib/types";
import { isOpenNow, priceSymbol, formatTime12 } from "@/lib/format";
import { CardImage, Stars, VegMark } from "./ui";

export function RestaurantScrollCard({ r }: { r: Restaurant }) {
  const open = isOpenNow(r);
  return (
    <Link
      href={`/discover/restaurants/${r.slug}`}
      className="card w-52 shrink-0 overflow-hidden"
    >
      <div className="relative">
        <CardImage
          src={r.hero_image_url}
          alt={r.name_en}
          emojiKey={r.cuisines[0]}
          className="h-28 w-full"
        />
        {open && (
          <span className="absolute left-2 top-2 rounded bg-positive px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Open now
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5">
          <VegMark type={r.veg_type} />
          <p className="truncate text-sm font-semibold text-ink">{r.name_en}</p>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted">
          {r.cuisines.join(" · ")}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <Stars rating={r.avg_rating} />
          <span className="text-xs font-medium text-muted">
            {priceSymbol(r.price_range)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function RestaurantListCard({ r }: { r: Restaurant }) {
  const open = isOpenNow(r);
  return (
    <Link href={`/discover/restaurants/${r.slug}`} className="card flex gap-3 p-3">
      <CardImage
        src={r.hero_image_url}
        alt={r.name_en}
        emojiKey={r.cuisines[0]}
        className="h-24 w-24 shrink-0 rounded-lg"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <VegMark type={r.veg_type} />
            <h3 className="truncate text-sm font-semibold text-ink">{r.name_en}</h3>
          </div>
          <button
            aria-label="Bookmark"
            className="shrink-0 text-muted"
            // bookmark persistence lands with auth
            onClick={(e) => e.preventDefault()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M6 3.5h12V21l-6-3.5L6 21z" />
            </svg>
          </button>
        </div>
        <p className="truncate text-xs text-muted">{r.cuisines.join(" · ")}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <Stars rating={r.avg_rating} />
          <span className="text-xs text-muted">({r.review_count})</span>
          <span className="text-xs font-medium text-muted">
            {priceSymbol(r.price_range)}
          </span>
        </div>
        <p className="mt-1.5 text-xs">
          {open ? (
            <span className="font-medium text-positive">Open now</span>
          ) : (
            <span className="font-medium text-danger">Closed</span>
          )}{" "}
          <span className="text-muted">
            · {formatTime12(r.open_time)} – {formatTime12(r.close_time)}
          </span>
        </p>
      </div>
    </Link>
  );
}
