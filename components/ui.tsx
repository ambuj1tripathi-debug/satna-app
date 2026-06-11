// Small shared presentational pieces (server-safe).
import type { PlaceCategory, VegType } from "@/lib/types";

const categoryEmoji: Record<string, string> = {
  religious: "🛕",
  nature: "🌿",
  infrastructure: "🏛️",
  shopping: "🛍️",
  education: "📚",
  heritage: "🪷",
  other: "📍",
};

const cuisineEmoji: Record<string, string> = {
  Sweets: "🍮",
  Chaat: "🥘",
  Dhabha: "🍛",
  "North Indian": "🍛",
  "South Indian": "🥞",
  Chinese: "🍜",
};

/** Image-first card visual: gradient block with a category emoji.
 *  Swaps to a real <img> automatically when an image URL exists. */
export function CardImage({
  src,
  alt,
  emojiKey,
  className = "",
}: {
  src?: string | null;
  alt: string;
  emojiKey: string;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
  }
  const emoji = categoryEmoji[emojiKey] ?? cuisineEmoji[emojiKey] ?? "📍";
  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 text-4xl ${className}`}
    >
      {emoji}
    </div>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-xs font-semibold text-white">
      {rating.toFixed(1)}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5 14.9 8.6l6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z" />
      </svg>
    </span>
  );
}

/** Indian-standard veg / non-veg mark. */
export function VegMark({ type }: { type: VegType | boolean }) {
  const isVeg = typeof type === "boolean" ? type : type !== "non_veg" && type !== "mixed";
  const color = isVeg ? "#1E6B3C" : "#D63B2F";
  return (
    <span
      aria-label={isVeg ? "Veg" : "Non-veg"}
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center border"
      style={{ borderColor: color }}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
    </span>
  );
}

export function CategoryBadge({ category }: { category: PlaceCategory }) {
  const isHeritage = category === "heritage";
  return (
    <span
      className={`pill capitalize ${
        isHeritage ? "bg-sand/15 text-sand" : "bg-primary-50 text-primary-700"
      }`}
    >
      {categoryEmoji[category]} {category}
    </span>
  );
}

export function SectionHeader({
  title,
  hindi,
  href,
  linkLabel,
}: {
  title: string;
  hindi?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between px-4">
      <div>
        <h2 className="font-heading text-lg font-semibold text-ink">{title}</h2>
        {hindi && <p className="text-xs text-muted">{hindi}</p>}
      </div>
      {href && (
        <a href={href} className="pb-0.5 text-sm font-medium text-primary">
          {linkLabel ?? "See all"} →
        </a>
      )}
    </div>
  );
}
