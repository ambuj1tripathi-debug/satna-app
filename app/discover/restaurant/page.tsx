"use client";

// Client-rendered restaurant detail (?slug=…) so restaurants added by the
// admin appear immediately on the static site without a rebuild.
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Restaurant, MenuItem } from "@/lib/types";
import { getSupabase } from "@/lib/supabase";
import { seedRestaurants, seedMenuItems } from "@/lib/seed-data";
import { formatTime12, isOpenNow, priceSymbol } from "@/lib/format";
import { CardImage, Stars, VegMark } from "@/components/ui";
import ReviewsSection from "@/components/ReviewsSection";
import { useT } from "@/components/LangProvider";

const menuOrder = ["Starters", "Main", "Breads", "Drinks", "Sweets"];

function RestaurantDetail() {
  const t = useT();
  const slug = useSearchParams().get("slug");
  const [r, setR] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    if (!slug) {
      setState("missing");
      return;
    }
    const sb = getSupabase();
    if (!sb) {
      const seed = seedRestaurants.find((x) => x.slug === slug) ?? null;
      setR(seed);
      if (seed) setMenu(seedMenuItems.filter((m) => m.restaurant_id === seed.id));
      setState(seed ? "ready" : "missing");
      return;
    }
    sb.from("restaurants")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!data) {
          setState("missing");
          return;
        }
        setR(data as Restaurant);
        setState("ready");
        const { data: items } = await sb
          .from("menu_items")
          .select("*")
          .eq("restaurant_id", data.id)
          .eq("status", "approved");
        setMenu((items ?? []) as MenuItem[]);
      });
  }, [slug]);

  if (state === "loading") {
    return <div className="p-10 text-center text-sm text-muted">…</div>;
  }
  if (state === "missing" || !r) {
    return (
      <div className="px-4 pt-12 text-center">
        <p className="text-3xl">🍽️</p>
        <p className="mt-2 text-sm text-muted">
          {t("Restaurant not found.", "रेस्टोरेंट नहीं मिला।")}
        </p>
        <Link href="/discover?tab=restaurants" className="mt-2 inline-block text-sm font-semibold text-primary">
          ← {t("All restaurants", "सभी रेस्टोरेंट")}
        </Link>
      </div>
    );
  }

  const open = isOpenNow(r);
  const categories = menuOrder.filter((c) => menu.some((m) => m.category === c));

  return (
    <>
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

      <div className="border-b border-cardline bg-white px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <VegMark type={r.veg_type} />
              <h1 className="font-heading text-xl font-semibold text-ink">{r.name_en}</h1>
            </div>
            {r.name_hi && <p className="text-sm text-muted">{r.name_hi}</p>}
            <p className="mt-1 text-sm text-muted">
              {r.cuisines.join(" · ")}
              {r.cuisines.length > 0 && " · "}
              {priceSymbol(r.price_range)}
            </p>
          </div>
          {r.review_count > 0 && (
            <div className="text-right">
              <Stars rating={r.avg_rating} />
              <p className="mt-1 text-xs text-muted">
                {r.review_count} {t("reviews", "समीक्षाएँ")}
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 space-y-1.5 text-sm">
          {r.open_time && r.close_time && (
            <p>
              {open ? (
                <span className="font-semibold text-positive">{t("Open now", "अभी खुला")}</span>
              ) : (
                <span className="font-semibold text-danger">{t("Closed", "बंद")}</span>
              )}{" "}
              <span className="text-muted">
                · {formatTime12(r.open_time)} – {formatTime12(r.close_time)}
              </span>
            </p>
          )}
          {r.address && <p className="text-muted">📍 {r.address}</p>}
          {r.phone && <p className="text-muted">📞 {r.phone}</p>}
        </div>

        {r.phone && (
          <a
            href={`tel:${r.phone}`}
            className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-full bg-primary font-heading text-sm font-semibold text-white"
          >
            {t("Call now", "अभी कॉल करें")}
          </a>
        )}
      </div>

      <Link
        href="/discover?tab=dine"
        className="mx-4 mt-4 flex items-center justify-between rounded-card border border-primary/30 bg-primary-50/60 px-4 py-3"
      >
        <span className="text-sm font-medium text-primary-700">
          🤝 {t("Going here? Take someone along", "यहाँ जा रहे हैं? किसी को साथ लें")}
        </span>
        <span className="text-primary">→</span>
      </Link>

      {categories.length > 0 && (
        <section className="px-4 pt-5">
          <h2 className="font-heading text-lg font-semibold text-ink">{t("Menu", "मेन्यू")}</h2>
          {categories.map((cat) => (
            <div key={cat} className="mt-4">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{cat}</h3>
              <div className="space-y-2">
                {menu
                  .filter((m) => m.category === cat)
                  .map((m) => (
                    <div key={m.id} className="card flex items-start justify-between gap-3 p-3">
                      <div className="flex min-w-0 gap-2">
                        <VegMark type={m.is_veg} />
                        <div>
                          <p className="text-sm font-medium text-ink">{m.name}</p>
                          {m.description && <p className="text-xs text-muted">{m.description}</p>}
                        </div>
                      </div>
                      {m.price != null && (
                        <span className="shrink-0 text-sm font-semibold text-ink">₹{m.price}</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </section>
      )}

      <ReviewsSection subjectId={r.id} initial={[]} />

      <section className="px-4 pb-4 pt-6">
        <div className="card border-dashed p-4 text-center">
          <p className="text-sm font-medium text-ink">
            {t("Is this your restaurant?", "क्या यह आपका रेस्टोरेंट है?")}
          </p>
          <Link
            href="/more/feedback"
            className="mt-2 inline-block rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary"
          >
            {t("Claim it", "क्लेम करें")}
          </Link>
        </div>
      </section>
    </>
  );
}

export default function RestaurantPage() {
  return (
    <main>
      <Suspense fallback={<div className="p-10 text-center text-sm text-muted">…</div>}>
        <RestaurantDetail />
      </Suspense>
    </main>
  );
}
