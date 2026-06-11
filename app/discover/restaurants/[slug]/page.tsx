import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getMenuItems,
  getRestaurantBySlug,
  getRestaurants,
  getReviews,
} from "@/lib/data";
import { formatTime12, isOpenNow, priceSymbol } from "@/lib/format";
import { CardImage, Stars, VegMark } from "@/components/ui";

const menuOrder = ["Starters", "Main", "Breads", "Drinks", "Sweets"];

export async function generateStaticParams() {
  const all = await getRestaurants();
  return all.map((r) => ({ slug: r.slug }));
}

export default async function RestaurantDetail({
  params,
}: {
  params: { slug: string };
}) {
  const r = await getRestaurantBySlug(params.slug);
  if (!r) notFound();

  const [menu, reviews] = await Promise.all([
    getMenuItems(r.id),
    getReviews("restaurant", r.id),
  ]);
  const open = isOpenNow(r);
  const categories = menuOrder.filter((c) => menu.some((m) => m.category === c));

  return (
    <main>
      {/* hero */}
      <div className="relative">
        <CardImage
          src={r.hero_image_url}
          alt={r.name_en}
          emojiKey={r.cuisines[0]}
          className="h-52 w-full"
        />
        <Link
          href="/discover?tab=restaurants"
          aria-label="Back"
          className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-card"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>
      </div>

      {/* header */}
      <div className="border-b border-cardline bg-white px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <VegMark type={r.veg_type} />
              <h1 className="font-heading text-xl font-semibold text-ink">
                {r.name_en}
              </h1>
            </div>
            <p className="text-sm text-muted">{r.name_hi}</p>
            <p className="mt-1 text-sm text-muted">
              {r.cuisines.join(" · ")} · {priceSymbol(r.price_range)}
            </p>
          </div>
          <div className="text-right">
            <Stars rating={r.avg_rating} />
            <p className="mt-1 text-xs text-muted">{r.review_count} reviews</p>
          </div>
        </div>

        {/* info row */}
        <div className="mt-3 space-y-1.5 text-sm">
          <p>
            {open ? (
              <span className="font-semibold text-positive">Open now</span>
            ) : (
              <span className="font-semibold text-danger">Closed</span>
            )}{" "}
            <span className="text-muted">
              · {formatTime12(r.open_time)} – {formatTime12(r.close_time)}
            </span>
          </p>
          {r.address && <p className="text-muted">📍 {r.address}</p>}
          {r.phone && <p className="text-muted">📞 {r.phone}</p>}
        </div>

        {r.phone && (
          <a
            href={`tel:${r.phone}`}
            className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-full bg-primary font-heading text-sm font-semibold text-white"
          >
            Call now
          </a>
        )}
      </div>

      {/* dine together shortcut */}
      <Link
        href="/discover?tab=dine"
        className="mx-4 mt-4 flex items-center justify-between rounded-card border border-primary/30 bg-primary-50/60 px-4 py-3"
      >
        <span className="text-sm font-medium text-primary-700">
          🤝 Going here? Take someone along
        </span>
        <span className="text-primary">→</span>
      </Link>

      {/* menu */}
      {categories.length > 0 && (
        <section className="px-4 pt-5">
          <h2 className="font-heading text-lg font-semibold text-ink">Menu</h2>
          {categories.map((cat) => (
            <div key={cat} className="mt-4">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                {cat}
              </h3>
              <div className="space-y-2">
                {menu
                  .filter((m) => m.category === cat)
                  .map((m) => (
                    <div key={m.id} className="card flex items-start justify-between gap-3 p-3">
                      <div className="flex min-w-0 gap-2">
                        <VegMark type={m.is_veg} />
                        <div>
                          <p className="text-sm font-medium text-ink">{m.name}</p>
                          {m.description && (
                            <p className="text-xs text-muted">{m.description}</p>
                          )}
                        </div>
                      </div>
                      {m.price != null && (
                        <span className="shrink-0 text-sm font-semibold text-ink">
                          ₹{m.price}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
          <div className="mt-3 flex gap-2">
            <button className="flex-1 rounded-full border border-cardline bg-white py-2.5 text-xs font-medium text-muted">
              Suggest edit
            </button>
            <button className="flex-1 rounded-full border border-cardline bg-white py-2.5 text-xs font-medium text-muted">
              Add menu item
            </button>
          </div>
        </section>
      )}

      {/* reviews */}
      <section className="px-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-ink">Reviews</h2>
          <button className="text-sm font-medium text-primary">Write a review</button>
        </div>
        <div className="mt-3 space-y-3">
          {reviews.slice(0, 5).map((v) => (
            <div key={v.id} className="card p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">{v.username}</p>
                <Stars rating={v.rating} />
              </div>
              {v.body && <p className="mt-1.5 text-sm text-muted">{v.body}</p>}
            </div>
          ))}
          {reviews.length === 0 && (
            <p className="text-sm text-muted">
              No reviews yet — be the first to share your experience!
            </p>
          )}
        </div>
      </section>

      {/* owner claim */}
      <section className="px-4 pb-4 pt-6">
        <div className="card border-dashed p-4 text-center">
          <p className="text-sm font-medium text-ink">Is this your restaurant?</p>
          <button className="mt-2 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary">
            Claim it
          </button>
        </div>
      </section>
    </main>
  );
}
