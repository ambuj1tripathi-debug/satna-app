"use client";

// Real admin panel — gated by profiles.role (RLS enforces every write).
// The FIRST account to sign up becomes admin automatically.
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

type Row = Record<string, unknown> & { id: string };

const inputCls =
  "w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink";
const labelCls = "block text-xs font-medium text-muted";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function AdminPage() {
  const { user, ready } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [tab, setTab] = useState("restaurants");

  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !user) {
      setRole(null);
      return;
    }
    sb.from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setRole(data?.role ?? "user"));
  }, [user]);

  if (!ready) return <main className="p-10 text-center text-sm text-muted">…</main>;

  if (!user) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6">
        <div className="card w-full max-w-sm p-6 text-center">
          <h1 className="font-heading text-lg font-semibold text-ink">Satna Admin</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in with your email first — the <b>first account ever created
            becomes the admin</b> automatically.
          </p>
          <Link
            href="/more/profile"
            className="mt-4 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white"
          >
            Go to sign in →
          </Link>
        </div>
      </main>
    );
  }

  if (role && !["admin", "super_admin", "moderator"].includes(role)) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6">
        <div className="card w-full max-w-sm p-6 text-center">
          <p className="text-2xl">🔒</p>
          <p className="mt-2 text-sm text-muted">
            This account ({user.email}) doesn&apos;t have admin access.
          </p>
        </div>
      </main>
    );
  }

  const tabs = [
    { key: "restaurants", label: "🍽️ Restaurants" },
    { key: "places", label: "📍 Places" },
    { key: "events", label: "🎉 Events" },
    { key: "alerts", label: "🚨 Alerts" },
    { key: "home", label: "🏠 Home content" },
    { key: "govt", label: "🏛️ Govt directory" },
    { key: "moderation", label: "✅ Moderation" },
  ];

  return (
    <main className="pb-10">
      <div className="border-b border-cardline bg-white px-4 py-4">
        <h1 className="font-heading text-xl font-semibold text-ink">Admin</h1>
        <p className="text-xs text-muted">
          {user.email} · {role ?? "…"} · changes go live instantly
        </p>
      </div>
      <div className="no-scrollbar sticky top-0 z-30 flex gap-2 overflow-x-auto border-b border-cardline bg-canvas px-4 py-2.5">
        {tabs.map((s) => (
          <button
            key={s.key}
            onClick={() => setTab(s.key)}
            className={`pill shrink-0 ${
              tab === s.key
                ? "bg-primary font-semibold text-white"
                : "border border-cardline bg-white text-muted"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {tab === "restaurants" && <RestaurantsAdmin />}
      {tab === "places" && <PlacesAdmin />}
      {tab === "events" && <EventsAdmin userId={user.id} />}
      {tab === "alerts" && <AlertsAdmin userId={user.id} />}
      {tab === "home" && <HomeContentAdmin userId={user.id} />}
      {tab === "govt" && <GovtAdmin />}
      {tab === "moderation" && <ModerationAdmin />}
    </main>
  );
}

/* ---------- Restaurants ---------- */
function RestaurantsAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    getSupabase()
      ?.from("restaurants")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => data && setRows(data as Row[]));
  }, []);
  useEffect(load, [load]);

  const remove = async (id: string) => {
    if (!confirm("Delete this restaurant (and its menu)?")) return;
    await getSupabase()?.from("restaurants").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-3 px-4 pt-4">
      <p className="text-xs text-muted">
        Only the name is required — add phone, timing, cuisine whenever you have
        them. New entries show in the app immediately.
      </p>
      {(adding || editing) && (
        <RestaurantForm
          initial={editing}
          onDone={(saved) => {
            setAdding(false);
            setEditing(null);
            if (saved) {
              setMsg("Saved ✓");
              setTimeout(() => setMsg(""), 2500);
            }
            load();
          }}
        />
      )}
      {!adding && !editing && (
        <button
          onClick={() => setAdding(true)}
          className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white"
        >
          + Add restaurant
        </button>
      )}
      {msg && <p className="text-center text-xs font-medium text-positive">{msg}</p>}
      {rows.map((r) => (
        <div key={r.id} className="card flex items-center gap-3 p-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">{String(r.name_en)}</p>
            <p className="text-xs text-muted">
              {String(r.phone ?? "no phone")} · {String(r.status)}
            </p>
          </div>
          <button
            onClick={() => setEditing(r)}
            className="rounded-full border border-cardline px-3 py-1.5 text-xs text-muted"
          >
            Edit
          </button>
          <button
            onClick={() => remove(r.id)}
            className="rounded-full border border-danger/40 px-3 py-1.5 text-xs text-danger"
          >
            Delete
          </button>
        </div>
      ))}
      {rows.length === 0 && (
        <p className="py-6 text-center text-sm text-muted">
          No restaurants yet — add the first one above.
        </p>
      )}
    </div>
  );
}

function RestaurantForm({
  initial,
  onDone,
}: {
  initial: Row | null;
  onDone: (saved: boolean) => void;
}) {
  const [f, setF] = useState({
    name_en: String(initial?.name_en ?? ""),
    name_hi: String(initial?.name_hi ?? ""),
    phone: String(initial?.phone ?? ""),
    address: String(initial?.address ?? ""),
    cuisines: Array.isArray(initial?.cuisines) ? (initial?.cuisines as string[]).join(", ") : "",
    veg_type: String(initial?.veg_type ?? "veg"),
    price_range: String(initial?.price_range ?? "budget"),
    open_time: String(initial?.open_time ?? ""),
    close_time: String(initial?.close_time ?? ""),
    description: String(initial?.description ?? ""),
  });
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setF({ ...f, [k]: v });

  const save = async () => {
    const sb = getSupabase();
    if (!sb || !f.name_en.trim()) return;
    const row = {
      name_en: f.name_en.trim(),
      name_hi: f.name_hi.trim() || null,
      phone: f.phone.trim() || null,
      address: f.address.trim() || null,
      cuisines: f.cuisines.split(",").map((c) => c.trim()).filter(Boolean),
      veg_type: f.veg_type,
      price_range: f.price_range,
      open_time: f.open_time || null,
      close_time: f.close_time || null,
      description: f.description.trim() || null,
      status: "published",
    };
    const { error } = initial
      ? await sb.from("restaurants").update(row).eq("id", initial.id)
      : await sb.from("restaurants").insert({ ...row, slug: `${slugify(f.name_en)}-${Date.now().toString(36)}` });
    if (error) setErr(error.message);
    else onDone(true);
  };

  return (
    <div className="card space-y-3 p-4">
      <p className="font-heading text-base font-semibold text-ink">
        {initial ? "Edit restaurant" : "Add restaurant"}
      </p>
      <label className={labelCls}>
        Name (English) *
        <input value={f.name_en} onChange={(e) => set("name_en", e.target.value)} className={inputCls} />
      </label>
      <label className={labelCls}>
        Name (Hindi)
        <input value={f.name_hi} onChange={(e) => set("name_hi", e.target.value)} className={inputCls} />
      </label>
      <label className={labelCls}>
        Phone
        <input value={f.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
      </label>
      <label className={labelCls}>
        Address
        <input value={f.address} onChange={(e) => set("address", e.target.value)} className={inputCls} />
      </label>
      <label className={labelCls}>
        Cuisines (comma separated)
        <input value={f.cuisines} onChange={(e) => set("cuisines", e.target.value)} placeholder="North Indian, Sweets" className={inputCls} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className={labelCls}>
          Veg type
          <select value={f.veg_type} onChange={(e) => set("veg_type", e.target.value)} className={inputCls}>
            {["veg", "pure_veg", "jain", "non_veg", "mixed"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          Price
          <select value={f.price_range} onChange={(e) => set("price_range", e.target.value)} className={inputCls}>
            <option value="budget">₹ budget</option>
            <option value="mid">₹₹ mid</option>
            <option value="premium">₹₹₹ premium</option>
          </select>
        </label>
        <label className={labelCls}>
          Opens
          <input type="time" value={f.open_time} onChange={(e) => set("open_time", e.target.value)} className={inputCls} />
        </label>
        <label className={labelCls}>
          Closes
          <input type="time" value={f.close_time} onChange={(e) => set("close_time", e.target.value)} className={inputCls} />
        </label>
      </div>
      <label className={labelCls}>
        Description
        <textarea value={f.description} onChange={(e) => set("description", e.target.value)} rows={2} className={inputCls} />
      </label>
      {err && <p className="text-xs text-danger">{err}</p>}
      <div className="flex gap-2">
        <button onClick={() => onDone(false)} className="flex-1 rounded-full border border-cardline py-2.5 text-sm text-muted">
          Cancel
        </button>
        <button
          onClick={save}
          disabled={!f.name_en.trim()}
          className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  );
}

/* ---------- Places ---------- */
function PlacesAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(() => {
    getSupabase()
      ?.from("places")
      .select("*")
      .order("name_en")
      .then(({ data }) => data && setRows(data as Row[]));
  }, []);
  useEffect(load, [load]);

  const remove = async (id: string) => {
    if (!confirm("Delete this place?")) return;
    await getSupabase()?.from("places").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-3 px-4 pt-4">
      {(adding || editing) && (
        <PlaceForm
          initial={editing}
          onDone={() => {
            setAdding(false);
            setEditing(null);
            load();
          }}
        />
      )}
      {!adding && !editing && (
        <button onClick={() => setAdding(true)} className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white">
          + Add place
        </button>
      )}
      {rows.map((r) => (
        <div key={r.id} className="card flex items-center gap-3 p-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">
              {String(r.name_en)} {r.is_featured ? "⭐" : ""}
            </p>
            <p className="text-xs capitalize text-muted">{String(r.category)}</p>
          </div>
          <button onClick={() => setEditing(r)} className="rounded-full border border-cardline px-3 py-1.5 text-xs text-muted">
            Edit
          </button>
          <button onClick={() => remove(r.id)} className="rounded-full border border-danger/40 px-3 py-1.5 text-xs text-danger">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

function PlaceForm({ initial, onDone }: { initial: Row | null; onDone: () => void }) {
  const [f, setF] = useState({
    name_en: String(initial?.name_en ?? ""),
    name_hi: String(initial?.name_hi ?? ""),
    category: String(initial?.category ?? "religious"),
    description_en: String(initial?.description_en ?? ""),
    timing: String(initial?.timing ?? ""),
    entry_fee: String(initial?.entry_fee ?? ""),
    distance_km: String(initial?.distance_km ?? ""),
    is_featured: Boolean(initial?.is_featured ?? false),
  });
  const [err, setErr] = useState("");

  const save = async () => {
    const sb = getSupabase();
    if (!sb || !f.name_en.trim()) return;
    const row = {
      name_en: f.name_en.trim(),
      name_hi: f.name_hi.trim() || null,
      category: f.category,
      description_en: f.description_en.trim() || null,
      timing: f.timing.trim() || null,
      entry_fee: f.entry_fee.trim() || null,
      distance_km: f.distance_km ? Number(f.distance_km) : null,
      is_featured: f.is_featured,
      status: "published",
    };
    const { error } = initial
      ? await sb.from("places").update(row).eq("id", initial.id)
      : await sb.from("places").insert({ ...row, slug: `${slugify(f.name_en)}-${Date.now().toString(36)}` });
    if (error) setErr(error.message);
    else onDone();
  };

  return (
    <div className="card space-y-3 p-4">
      <p className="font-heading text-base font-semibold text-ink">
        {initial ? "Edit place" : "Add place"}
      </p>
      <label className={labelCls}>
        Name (English) *
        <input value={f.name_en} onChange={(e) => setF({ ...f, name_en: e.target.value })} className={inputCls} />
      </label>
      <label className={labelCls}>
        Name (Hindi)
        <input value={f.name_hi} onChange={(e) => setF({ ...f, name_hi: e.target.value })} className={inputCls} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className={labelCls}>
          Category
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className={inputCls}>
            {["religious", "nature", "heritage", "infrastructure", "shopping", "education", "other"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          Distance from center (km)
          <input type="number" value={f.distance_km} onChange={(e) => setF({ ...f, distance_km: e.target.value })} className={inputCls} />
        </label>
        <label className={labelCls}>
          Timing
          <input value={f.timing} onChange={(e) => setF({ ...f, timing: e.target.value })} className={inputCls} />
        </label>
        <label className={labelCls}>
          Entry fee
          <input value={f.entry_fee} onChange={(e) => setF({ ...f, entry_fee: e.target.value })} className={inputCls} />
        </label>
      </div>
      <label className={labelCls}>
        Description
        <textarea value={f.description_en} onChange={(e) => setF({ ...f, description_en: e.target.value })} rows={2} className={inputCls} />
      </label>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={f.is_featured} onChange={(e) => setF({ ...f, is_featured: e.target.checked })} className="h-4 w-4 accent-primary" />
        Featured on Home
      </label>
      {err && <p className="text-xs text-danger">{err}</p>}
      <div className="flex gap-2">
        <button onClick={onDone} className="flex-1 rounded-full border border-cardline py-2.5 text-sm text-muted">Cancel</button>
        <button onClick={save} disabled={!f.name_en.trim()} className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-40">
          Save
        </button>
      </div>
    </div>
  );
}

/* ---------- Events ---------- */
function EventsAdmin({ userId }: { userId: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [f, setF] = useState({ title_en: "", title_hi: "", category: "cultural", venue: "", starts_at: "", ends_at: "", description: "", is_featured: false });
  const [err, setErr] = useState("");

  const load = useCallback(() => {
    getSupabase()
      ?.from("events")
      .select("*")
      .order("starts_at")
      .then(({ data }) => data && setRows(data as Row[]));
  }, []);
  useEffect(load, [load]);

  const save = async () => {
    const sb = getSupabase();
    if (!sb || !f.title_en.trim() || !f.starts_at) return;
    const { error } = await sb.from("events").insert({
      title_en: f.title_en.trim(),
      title_hi: f.title_hi.trim() || null,
      category: f.category,
      venue: f.venue.trim() || null,
      description: f.description.trim() || null,
      starts_at: new Date(f.starts_at).toISOString(),
      ends_at: f.ends_at ? new Date(f.ends_at).toISOString() : null,
      is_featured: f.is_featured,
      status: "published",
      created_by: userId,
    });
    if (error) setErr(error.message);
    else {
      setF({ title_en: "", title_hi: "", category: "cultural", venue: "", starts_at: "", ends_at: "", description: "", is_featured: false });
      load();
    }
  };

  const remove = async (id: string) => {
    await getSupabase()?.from("events").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-3 px-4 pt-4">
      <div className="card space-y-3 p-4">
        <p className="font-heading text-base font-semibold text-ink">Add event</p>
        <label className={labelCls}>Title (English) *<input value={f.title_en} onChange={(e) => setF({ ...f, title_en: e.target.value })} className={inputCls} /></label>
        <label className={labelCls}>Title (Hindi)<input value={f.title_hi} onChange={(e) => setF({ ...f, title_hi: e.target.value })} className={inputCls} /></label>
        <div className="grid grid-cols-2 gap-2">
          <label className={labelCls}>Category
            <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className={inputCls}>
              {["religious", "cultural", "sports", "trade", "civic"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className={labelCls}>Venue<input value={f.venue} onChange={(e) => setF({ ...f, venue: e.target.value })} className={inputCls} /></label>
          <label className={labelCls}>Starts *<input type="datetime-local" value={f.starts_at} onChange={(e) => setF({ ...f, starts_at: e.target.value })} className={inputCls} /></label>
          <label className={labelCls}>Ends<input type="datetime-local" value={f.ends_at} onChange={(e) => setF({ ...f, ends_at: e.target.value })} className={inputCls} /></label>
        </div>
        <label className={labelCls}>Description<textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} rows={2} className={inputCls} /></label>
        {err && <p className="text-xs text-danger">{err}</p>}
        <button onClick={save} disabled={!f.title_en.trim() || !f.starts_at} className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-40">
          Publish event
        </button>
      </div>
      {rows.map((r) => (
        <div key={r.id} className="card flex items-center gap-3 p-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">{String(r.title_en)}</p>
            <p className="text-xs text-muted">
              {new Date(String(r.starts_at)).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
          <button onClick={() => remove(r.id)} className="rounded-full border border-danger/40 px-3 py-1.5 text-xs text-danger">Delete</button>
        </div>
      ))}
    </div>
  );
}

/* ---------- Alerts ---------- */
function AlertsAdmin({ userId }: { userId: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [f, setF] = useState({ severity: "civic", headline: "", description: "", affected_area: "" });
  const [err, setErr] = useState("");

  const load = useCallback(() => {
    getSupabase()
      ?.from("alerts")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .then(({ data }) => data && setRows(data as Row[]));
  }, []);
  useEffect(load, [load]);

  const post = async () => {
    const sb = getSupabase();
    if (!sb || !f.headline.trim()) return;
    const { error } = await sb.from("alerts").insert({
      severity: f.severity,
      headline: f.headline.trim(),
      description: f.description.trim() || null,
      affected_area: f.affected_area.trim() || null,
      source_verified: true,
      created_by: userId,
    });
    if (error) setErr(error.message);
    else {
      setF({ severity: "civic", headline: "", description: "", affected_area: "" });
      load();
    }
  };

  const resolve = async (id: string) => {
    await getSupabase()?.from("alerts").update({ status: "resolved" }).eq("id", id);
    load();
  };

  return (
    <div className="space-y-3 px-4 pt-4">
      <div className="card space-y-3 p-4">
        <p className="font-heading text-base font-semibold text-ink">Post alert</p>
        <select value={f.severity} onChange={(e) => setF({ ...f, severity: e.target.value })} className={inputCls}>
          <option value="emergency">🔴 Emergency</option>
          <option value="civic">🟠 Civic issue</option>
          <option value="disruption">🟡 Disruption</option>
          <option value="good_news">🟢 Good news</option>
        </select>
        <input value={f.headline} onChange={(e) => setF({ ...f, headline: e.target.value })} placeholder="Headline *" className={inputCls} />
        <textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} rows={2} placeholder="Details" className={inputCls} />
        <input value={f.affected_area} onChange={(e) => setF({ ...f, affected_area: e.target.value })} placeholder="Affected area (Ward 12, Rewa Road…)" className={inputCls} />
        {err && <p className="text-xs text-danger">{err}</p>}
        <button onClick={post} disabled={!f.headline.trim()} className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-40">
          Publish alert
        </button>
      </div>
      {rows.map((r) => (
        <div key={r.id} className="card flex items-center gap-3 p-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">{String(r.headline)}</p>
            <p className="text-xs capitalize text-muted">{String(r.severity)} · {String(r.affected_area ?? "")}</p>
          </div>
          <button onClick={() => resolve(r.id)} className="rounded-full border border-positive/40 px-3 py-1.5 text-xs text-positive">
            Resolve
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------- Home content ---------- */
function HomeContentAdmin({ userId }: { userId: string }) {
  const [thoughtEn, setThoughtEn] = useState("");
  const [thoughtHi, setThoughtHi] = useState("");
  const [fact, setFact] = useState("");
  const [msg, setMsg] = useState("");

  const saveThought = async () => {
    const sb = getSupabase();
    if (!sb || (!thoughtEn.trim() && !thoughtHi.trim())) return;
    const { error } = await sb.from("daily_thoughts").upsert(
      {
        body_en: thoughtEn.trim() || null,
        body_hi: thoughtHi.trim() || null,
        submitted_by: userId,
        status: "approved",
        shown_on: new Date().toISOString().slice(0, 10),
      },
      { onConflict: "shown_on" },
    );
    setMsg(error ? error.message : "Thought updated ✓");
  };

  const saveFact = async () => {
    const sb = getSupabase();
    if (!sb || !fact.trim()) return;
    const { error } = await sb.from("history_facts").insert({
      fact: fact.trim(),
      week_start: new Date().toISOString().slice(0, 10),
    });
    setMsg(error ? error.message : "History fact updated ✓");
    if (!error) setFact("");
  };

  return (
    <div className="space-y-3 px-4 pt-4">
      <div className="card space-y-3 p-4">
        <p className="font-heading text-base font-semibold text-ink">Aaj ka vichar (thought of the day)</p>
        <input value={thoughtHi} onChange={(e) => setThoughtHi(e.target.value)} placeholder="हिंदी में" className={inputCls} />
        <input value={thoughtEn} onChange={(e) => setThoughtEn(e.target.value)} placeholder="In English" className={inputCls} />
        <button onClick={saveThought} className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white">
          Set today&apos;s thought
        </button>
      </div>
      <div className="card space-y-3 p-4">
        <p className="font-heading text-base font-semibold text-ink">This week in Satna history</p>
        <textarea value={fact} onChange={(e) => setFact(e.target.value)} rows={3} placeholder="A verified historical fact about Satna…" className={inputCls} />
        <button onClick={saveFact} className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white">
          Publish fact
        </button>
      </div>
      {msg && <p className="text-center text-xs font-medium text-positive">{msg}</p>}
    </div>
  );
}

/* ---------- Govt directory ---------- */
function GovtAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    getSupabase()
      ?.from("govt_services")
      .select("*")
      .order("department_en")
      .then(({ data }) => data && setRows(data as Row[]));
  }, []);
  useEffect(load, [load]);

  const savePhone = async (id: string, phone: string) => {
    await getSupabase()
      ?.from("govt_services")
      .update({ phone: phone.trim() || null })
      .eq("id", id);
    setMsg("Saved ✓");
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="space-y-3 px-4 pt-4">
      <p className="text-xs text-muted">
        Add verified phone numbers for each office — they become tap-to-call in
        the app. {msg && <span className="font-medium text-positive">{msg}</span>}
      </p>
      {rows.map((r) => (
        <div key={r.id} className="card p-3">
          <p className="text-sm font-semibold text-ink">{String(r.department_en)}</p>
          <div className="mt-2 flex gap-2">
            <input
              defaultValue={String(r.phone ?? "")}
              placeholder="Phone number"
              className={inputCls + " flex-1"}
              onBlur={(e) => {
                if (e.target.value !== String(r.phone ?? "")) savePhone(r.id, e.target.value);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Moderation ---------- */
function ModerationAdmin() {
  const [memories, setMemories] = useState<Row[]>([]);
  const [trivia, setTrivia] = useState<Row[]>([]);

  const load = useCallback(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.from("memories").select("*").eq("status", "pending").then(({ data }) => data && setMemories(data as Row[]));
    sb.from("quiz_questions").select("*").eq("status", "pending").then(({ data }) => data && setTrivia(data as Row[]));
  }, []);
  useEffect(load, [load]);

  const decide = async (table: string, id: string, status: "approved" | "rejected") => {
    await getSupabase()?.from(table).update({ status }).eq("id", id);
    load();
  };

  return (
    <div className="space-y-4 px-4 pt-4">
      <div>
        <p className="text-xs font-semibold text-muted">MEMORIES ({memories.length} pending)</p>
        <div className="mt-2 space-y-2">
          {memories.map((m) => (
            <div key={m.id} className="card p-3">
              <p className="text-sm font-medium text-ink">{String(m.caption)}</p>
              {Boolean(m.story) && <p className="mt-1 text-xs text-muted">{String(m.story)}</p>}
              <div className="mt-2 flex gap-2">
                <button onClick={() => decide("memories", m.id, "approved")} className="flex-1 rounded-full bg-positive py-1.5 text-xs font-semibold text-white">Approve</button>
                <button onClick={() => decide("memories", m.id, "rejected")} className="flex-1 rounded-full bg-danger py-1.5 text-xs font-semibold text-white">Reject</button>
              </div>
            </div>
          ))}
          {memories.length === 0 && <p className="text-sm text-muted">Queue empty.</p>}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted">QUIZ SUBMISSIONS ({trivia.length} pending)</p>
        <div className="mt-2 space-y-2">
          {trivia.map((q) => (
            <div key={q.id} className="card p-3">
              <p className="text-sm font-medium text-ink">{String(q.question_en)}</p>
              <p className="mt-1 text-xs text-muted">
                {(q.options as string[])?.join(" · ")} (✓ {(q.options as string[])?.[Number(q.correct_index)]})
              </p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => decide("quiz_questions", q.id, "approved")} className="flex-1 rounded-full bg-positive py-1.5 text-xs font-semibold text-white">Approve</button>
                <button onClick={() => decide("quiz_questions", q.id, "rejected")} className="flex-1 rounded-full bg-danger py-1.5 text-xs font-semibold text-white">Reject</button>
              </div>
            </div>
          ))}
          {trivia.length === 0 && <p className="text-sm text-muted">Queue empty.</p>}
        </div>
      </div>
    </div>
  );
}
