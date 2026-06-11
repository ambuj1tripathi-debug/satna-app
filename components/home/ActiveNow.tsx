"use client";

// Live social pulse — real open dining plans and cab rides from the
// database. Renders nothing when the city is quiet.
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useT } from "../LangProvider";

interface PulseItem {
  id: string;
  kind: "dining" | "cab";
  text: string;
  meta: string;
  href: string;
}

const kindStyle = {
  dining: { emoji: "🤝", label_en: "Dine Together", label_hi: "साथ खाएँ", cls: "text-primary bg-primary-50" },
  cab: { emoji: "🚖", label_en: "Cab Share", label_hi: "कैब शेयर", cls: "text-positive bg-positive-50" },
};

export default function ActiveNow() {
  const t = useT();
  const [items, setItems] = useState<PulseItem[]>([]);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    const now = new Date().toISOString();
    Promise.all([
      sb.from("dining_plans")
        .select("id, scheduled_at, max_people, restaurants(name_en), profiles(username, neighborhood), dining_plan_members(count)")
        .eq("status", "open")
        .gte("scheduled_at", now)
        .limit(3),
      sb.from("cab_rides")
        .select("id, destination, departs_at, total_fare, total_seats, seats_taken, profiles(username)")
        .eq("status", "open")
        .gte("departs_at", now)
        .limit(3),
    ]).then(([plans, rides]) => {
      const out: PulseItem[] = [];
      for (const p of plans.data ?? []) {
        const host = p.profiles as { username?: string; neighborhood?: string } | null;
        const r = p.restaurants as { name_en?: string } | null;
        const members = (p.dining_plan_members as { count: number }[])?.[0]?.count ?? 0;
        const spots = p.max_people - 1 - members;
        out.push({
          id: `dp-${p.id}`,
          kind: "dining",
          text: t(
            `${host?.username ?? "Someone"} from ${host?.neighborhood ?? "Satna"} is looking for company at ${r?.name_en ?? "a restaurant"}`,
            `${host?.neighborhood ?? "सतना"} के ${host?.username ?? "कोई"} ${r?.name_en ?? "रेस्टोरेंट"} पर साथी ढूंढ रहे हैं`,
          ),
          meta: `${new Date(p.scheduled_at).toLocaleString("en-IN", { weekday: "short", hour: "numeric", minute: "2-digit" })} · ${spots} ${t("spots", "जगह")}`,
          href: "/discover?tab=dine",
        });
      }
      for (const r of rides.data ?? []) {
        const poster = r.profiles as { username?: string } | null;
        out.push({
          id: `cr-${r.id}`,
          kind: "cab",
          text: t(
            `${poster?.username ?? "Someone"} posted a cab share: Satna → ${r.destination}`,
            `${poster?.username ?? "किसी"} ने कैब शेयर पोस्ट की: सतना → ${r.destination}`,
          ),
          meta: `${r.total_seats - r.seats_taken} ${t("seats", "सीटें")} · ₹${Math.round(Number(r.total_fare) / r.total_seats)}/${t("person", "व्यक्ति")}`,
          href: "/discover?tab=cab",
        });
      }
      setItems(out);
    });
  }, [t]);

  if (items.length === 0) return null;

  return (
    <section aria-label="Active right now" className="mt-7">
      <div className="mb-3 flex items-center gap-2 px-4">
        <h2 className="font-heading text-lg font-semibold text-ink">
          {t("Active right now", "अभी सक्रिय")}
        </h2>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
        </span>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
        {items.map((item) => {
          const k = kindStyle[item.kind];
          return (
            <Link key={item.id} href={item.href} className="card flex w-64 shrink-0 flex-col justify-between p-4">
              <span className={`pill self-start ${k.cls}`}>
                {k.emoji} {t(k.label_en, k.label_hi)}
              </span>
              <p className="mt-2 text-sm font-medium leading-snug text-ink">{item.text}</p>
              <p className="mt-1.5 text-xs text-muted">{item.meta}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
