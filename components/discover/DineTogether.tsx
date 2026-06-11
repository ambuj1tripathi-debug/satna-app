"use client";

import { useMemo, useState } from "react";
import type { DiningPlan, PlanVibe, Restaurant } from "@/lib/types";
import { seedDiningPlans, vibeLabels } from "@/lib/seed-social";
import { usePersistentState } from "@/lib/store";
import { useAuth, dbInsert, isUuid } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useT } from "../LangProvider";

const timeFilters = [
  { key: "now", en: "Right now", hi: "अभी" },
  { key: "today", en: "Today", hi: "आज" },
  { key: "weekend", en: "This weekend", hi: "इस वीकेंड" },
  { key: "lunch", en: "Lunch", hi: "लंच" },
  { key: "dinner", en: "Dinner", hi: "डिनर" },
  { key: "any", en: "Any time", hi: "कभी भी" },
] as const;

const mealEmoji = { lunch: "🍛", dinner: "🌙", chai: "☕" };

function planTime(iso: string, t: (en: string, hi?: string | null) => string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `${t("Today", "आज")}, ${time}`;
  if (d.toDateString() === tomorrow.toDateString())
    return `${t("Tomorrow", "कल")}, ${time}`;
  return `${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}, ${time}`;
}

export default function DineTogether({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const t = useT();
  const { user } = useAuth();
  const [filter, setFilter] = useState<(typeof timeFilters)[number]["key"]>("any");
  const [plans, setPlans] = usePersistentState<DiningPlan[]>("dine-plans", seedDiningPlans);
  const [dbPlans, setDbPlans] = useState<DiningPlan[]>([]);
  const [joined, setJoined] = usePersistentState<string[]>("dine-joined", []);
  const [showForm, setShowForm] = useState(false);

  // live plans from Supabase
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.from("dining_plans")
      .select(
        "*, restaurants(slug, name_en, cuisines), profiles(username, neighborhood), dining_plan_members(count)",
      )
      .eq("status", "open")
      .gte("scheduled_at", new Date().toISOString())
      .then(({ data }) => {
        if (!data) return;
        setDbPlans(
          data.map((p) => {
            const r = p.restaurants as { slug: string; name_en: string; cuisines: string[] };
            const host = p.profiles as { username?: string; neighborhood?: string };
            const members =
              (p.dining_plan_members as { count: number }[])?.[0]?.count ?? 0;
            return {
              id: p.id,
              restaurant_slug: r?.slug ?? "",
              restaurant_name: r?.name_en ?? "Restaurant",
              cuisine: r?.cuisines?.join(" · ") ?? "",
              meal_type: p.meal_type,
              scheduled_at: p.scheduled_at,
              host_name: host?.username ?? "Satna member",
              host_neighborhood: host?.neighborhood ?? "Satna",
              max_people: p.max_people,
              joined_count: 1 + members,
              vibe: p.vibe,
              note: p.note ?? undefined,
            };
          }),
        );
      });
  }, []);

  const visiblePlans = useMemo(() => {
    const dbIds = new Set(dbPlans.map((p) => p.id));
    return [...dbPlans, ...plans.filter((p) => !dbIds.has(p.id))];
  }, [dbPlans, plans]);

  const filtered = useMemo(() => {
    const now = new Date();
    return visiblePlans.filter((p) => {
      const d = new Date(p.scheduled_at);
      if (d < now) return false;
      if (filter === "now") return d.getTime() - now.getTime() < 3 * 3600_000;
      if (filter === "today") return d.toDateString() === now.toDateString();
      if (filter === "weekend") {
        const day = d.getDay();
        return day === 0 || day === 6;
      }
      if (filter === "lunch") return p.meal_type === "lunch";
      if (filter === "dinner") return p.meal_type === "dinner";
      return true;
    });
  }, [visiblePlans, filter]);

  const join = (id: string) => {
    if (joined.includes(id)) return;
    setJoined([...joined, id]);
    const bump = (p: DiningPlan) =>
      p.id === id ? { ...p, joined_count: p.joined_count + 1 } : p;
    setPlans((prev) => prev.map(bump));
    setDbPlans((prev) => prev.map(bump));
    if (user && isUuid(id)) {
      void dbInsert("dining_plan_members", { plan_id: id, user_id: user.id });
    }
  };

  return (
    <div className="px-4">
      <div className="card mt-3 border-primary/30 bg-primary-50/50 p-3 text-xs text-primary-700">
        🤝{" "}
        {t(
          "Want company for a meal? Post a plan or join one — public places only, first name + neighborhood shared, chat unlocks after joining.",
          "खाने के लिए साथ चाहिए? प्लान पोस्ट करें या जुड़ें — केवल सार्वजनिक जगहें, सिर्फ पहला नाम व मोहल्ला साझा होता है।",
        )}
      </div>

      {/* filter pills */}
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {timeFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`pill shrink-0 border ${
              filter === f.key
                ? "border-primary bg-primary-50 text-primary-700"
                : "border-cardline bg-white text-muted"
            }`}
          >
            {t(f.en, f.hi)}
          </button>
        ))}
      </div>

      {/* plan cards */}
      <div className="mt-3 space-y-3">
        {filtered.map((p) => {
          const spotsLeft = p.max_people - p.joined_count;
          const isJoined = joined.includes(p.id);
          const vibe = vibeLabels[p.vibe];
          return (
            <article key={p.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {mealEmoji[p.meal_type]} {p.restaurant_name}
                  </p>
                  <p className="text-xs text-muted">{p.cuisine}</p>
                </div>
                <span className={`pill shrink-0 ${vibe.cls}`}>{t(vibe.en, vibe.hi)}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-ink">
                {planTime(p.scheduled_at, t)}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {t(
                  `${p.host_name} from ${p.host_neighborhood}`,
                  `${p.host_neighborhood} के ${p.host_name}`,
                )}{" "}
                · {spotsLeft} {t("of", "में से")} {p.max_people - 1}{" "}
                {t("spots open", "जगह खाली")}
              </p>
              {p.note && (
                <p className="mt-2 rounded-lg bg-canvas px-3 py-2 text-xs italic text-muted">
                  “{p.note}”
                </p>
              )}
              <button
                onClick={() => join(p.id)}
                disabled={isJoined || spotsLeft === 0}
                className={`mt-3 w-full rounded-full py-2.5 text-sm font-semibold ${
                  isJoined
                    ? "bg-positive-50 text-positive"
                    : spotsLeft === 0
                      ? "bg-canvas text-muted"
                      : "bg-primary text-white"
                }`}
              >
                {isJoined
                  ? t("Joined ✓ — chat unlocks on host confirm", "जुड़ गए ✓ — होस्ट कन्फर्म पर चैट खुलेगी")
                  : spotsLeft === 0
                    ? t("Full", "फुल")
                    : t("Join", "जुड़ें")}
              </button>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <div className="card p-8 text-center text-sm text-muted">
            {t(
              "No plans right now — be the first to suggest a meal! 🍽",
              "अभी कोई प्लान नहीं — पहला प्लान आप बनाइए! 🍽",
            )}
          </div>
        )}
      </div>

      {/* create plan */}
      {showForm ? (
        <CreatePlanForm
          restaurants={restaurants}
          onCancel={() => setShowForm(false)}
          onCreate={(plan) => {
            setPlans([plan, ...plans]);
            setShowForm(false);
            const r = restaurants.find((x) => x.slug === plan.restaurant_slug);
            if (user && r && isUuid(r.id)) {
              void dbInsert("dining_plans", {
                host_id: user.id,
                restaurant_id: r.id,
                meal_type: plan.meal_type,
                scheduled_at: plan.scheduled_at,
                max_people: plan.max_people,
                vibe: plan.vibe,
                note: plan.note ?? null,
              });
            }
          }}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full rounded-full border-2 border-dashed border-primary/50 py-3 text-sm font-semibold text-primary"
        >
          + {t("Create a plan", "प्लान बनाएँ")}
        </button>
      )}
    </div>
  );
}

function CreatePlanForm({
  restaurants,
  onCancel,
  onCreate,
}: {
  restaurants: Restaurant[];
  onCancel: () => void;
  onCreate: (p: DiningPlan) => void;
}) {
  const t = useT();
  const [restaurantSlug, setRestaurantSlug] = useState("");
  const [when, setWhen] = useState("");
  const [people, setPeople] = useState(3);
  const [vibe, setVibe] = useState<PlanVibe>("casual_chat");
  const [note, setNote] = useState("");

  const submit = () => {
    const r = restaurants.find((x) => x.slug === restaurantSlug);
    if (!r || !when) return;
    onCreate({
      id: `dp-${Date.now()}`,
      restaurant_slug: r.slug,
      restaurant_name: r.name_en,
      cuisine: r.cuisines.join(" · "),
      meal_type: new Date(when).getHours() < 16 ? "lunch" : "dinner",
      scheduled_at: new Date(when).toISOString(),
      host_name: t("You", "आप"),
      host_neighborhood: "Satna",
      max_people: people,
      joined_count: 0,
      vibe,
      note: note || undefined,
    });
  };

  return (
    <div className="card mt-4 space-y-3 p-4">
      <p className="font-heading text-base font-semibold text-ink">
        {t("Create a plan", "प्लान बनाएँ")}
      </p>

      <label className="block text-xs font-medium text-muted">
        1. {t("Pick a restaurant", "रेस्टोरेंट चुनें")}
        <select
          value={restaurantSlug}
          onChange={(e) => setRestaurantSlug(e.target.value)}
          className="mt-1 w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink"
        >
          <option value="">{t("Select…", "चुनें…")}</option>
          {restaurants.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name_en}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-xs font-medium text-muted">
        2. {t("When?", "कब?")}
        <input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          className="mt-1 w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink"
        />
      </label>

      <div className="text-xs font-medium text-muted">
        3. {t("How many people?", "कितने लोग?")}
        <div className="mt-1 flex gap-2">
          {[2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              onClick={() => setPeople(n)}
              className={`h-11 w-11 rounded-xl border text-sm font-semibold ${
                people === n
                  ? "border-primary bg-primary-50 text-primary-700"
                  : "border-cardline bg-white text-muted"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs font-medium text-muted">
        4. {t("Vibe", "माहौल")}
        <div className="mt-1 flex flex-wrap gap-2">
          {(Object.keys(vibeLabels) as PlanVibe[]).map((v) => (
            <button
              key={v}
              onClick={() => setVibe(v)}
              className={`pill border ${
                vibe === v
                  ? "border-primary bg-primary-50 text-primary-700"
                  : "border-cardline bg-white text-muted"
              }`}
            >
              {t(vibeLabels[v].en, vibeLabels[v].hi)}
            </button>
          ))}
        </div>
      </div>

      <label className="block text-xs font-medium text-muted">
        {t("Optional note", "वैकल्पिक नोट")}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder={t(
            "Looking for someone to try the new thali…",
            "नई थाली ट्राय करने के लिए साथ चाहिए…",
          )}
          className="mt-1 w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink"
        />
      </label>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 rounded-full border border-cardline py-2.5 text-sm font-medium text-muted"
        >
          {t("Cancel", "रद्द करें")}
        </button>
        <button
          onClick={submit}
          disabled={!restaurantSlug || !when}
          className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          {t("Post plan", "प्लान पोस्ट करें")}
        </button>
      </div>
      <p className="text-center text-[10px] text-muted">
        {t(
          "Phone-OTP verification will be required once accounts go live.",
          "अकाउंट लाइव होने पर फोन-OTP सत्यापन आवश्यक होगा।",
        )}
      </p>
    </div>
  );
}
