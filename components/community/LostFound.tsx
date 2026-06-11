"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LostFoundItem } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { useT } from "../LangProvider";

const filters = [
  { key: "all", en: "All", hi: "सभी" },
  { key: "lost", en: "Lost", hi: "खोया" },
  { key: "found", en: "Found", hi: "मिला" },
  { key: "resolved", en: "Resolved", hi: "हल हुआ" },
];

const categoryEmoji: Record<string, string> = {
  documents: "📄",
  valuables: "💍",
  pets: "🐕",
  other: "📦",
};

export default function LostFound() {
  const t = useT();
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    const sb = getSupabase();
    if (!sb) return;
    sb.from("lost_found")
      .select("*")
      .neq("status", "archived")
      .order("created_at", { ascending: false })
      .then(({ data }) => data && setItems(data as LostFoundItem[]));
  };
  useEffect(load, []);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "resolved") return items.filter((i) => i.status === "resolved");
    return items.filter((i) => i.type === filter && i.status === "open");
  }, [items, filter]);

  return (
    <div className="px-4">
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {filters.map((f) => (
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

      <div className="mt-3 space-y-3">
        {filtered.map((item) => (
          <article key={item.id} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <span
                className={`pill ${
                  item.status === "resolved"
                    ? "bg-canvas text-muted"
                    : item.type === "lost"
                      ? "bg-danger/10 text-danger"
                      : "bg-positive-50 text-positive"
                }`}
              >
                {item.status === "resolved"
                  ? `✓ ${t("Resolved", "हल हुआ")}`
                  : item.type === "lost"
                    ? t("Lost", "खोया")
                    : t("Found", "मिला")}
              </span>
              <span className="text-lg">{categoryEmoji[item.category] ?? "📦"}</span>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-ink">{item.title}</h3>
            {item.description && <p className="mt-1 text-sm text-muted">{item.description}</p>}
            {item.location && <p className="mt-2 text-xs text-muted">📍 {item.location}</p>}
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-2xl">🔍</p>
            <p className="mt-2 text-sm text-muted">
              {t(
                "Nothing reported right now — lost or found something? Post it below.",
                "अभी कोई रिपोर्ट नहीं — कुछ खोया या मिला? नीचे दर्ज करें।",
              )}
            </p>
          </div>
        )}
      </div>

      {showForm ? (
        <PostItemForm
          onDone={() => {
            setShowForm(false);
            load();
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full rounded-full border-2 border-dashed border-primary/50 py-3 text-sm font-semibold text-primary"
        >
          + {t("Report lost or found item", "खोई/मिली वस्तु दर्ज करें")}
        </button>
      )}
      {!user && showForm && (
        <p className="mt-2 text-center text-xs text-muted">
          {t("Sign in first →", "पहले साइन इन करें →")}{" "}
          <Link href="/more/profile" className="font-semibold text-primary">
            {t("Profile", "प्रोफाइल")}
          </Link>
        </p>
      )}
      <p className="mt-2 text-center text-[10px] text-muted">
        {t("Posts auto-archive after 30 days", "पोस्ट 30 दिन बाद स्वतः आर्काइव")}
      </p>
    </div>
  );
}

function PostItemForm({
  onDone,
  onCancel,
}: {
  onDone: () => void;
  onCancel: () => void;
}) {
  const t = useT();
  const { user } = useAuth();
  const [type, setType] = useState<"lost" | "found">("lost");
  const [category, setCategory] = useState("other");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const submit = async () => {
    const sb = getSupabase();
    if (!sb || !user || !title.trim()) return;
    const { error } = await sb.from("lost_found").insert({
      user_id: user.id,
      type,
      category,
      title: title.trim(),
      description: description.trim() || null,
      location: location.trim() || null,
    });
    if (!error) onDone();
  };

  const inputCls =
    "w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink";

  return (
    <div className="card mt-4 space-y-3 p-4">
      <div className="flex gap-2">
        {(["lost", "found"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setType(k)}
            className={`pill flex-1 justify-center border ${
              type === k
                ? "border-primary bg-primary-50 text-primary-700"
                : "border-cardline bg-white text-muted"
            }`}
          >
            {k === "lost" ? t("I lost something", "मैंने कुछ खोया") : t("I found something", "मुझे कुछ मिला")}
          </button>
        ))}
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("What is it?", "क्या है?")} className={inputCls} />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder={t("Description", "विवरण")} className={inputCls} />
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t("Where?", "कहाँ?")} className={inputCls} />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
        <option value="documents">{t("Documents", "दस्तावेज़")}</option>
        <option value="valuables">{t("Valuables", "कीमती सामान")}</option>
        <option value="pets">{t("Pets", "पालतू")}</option>
        <option value="other">{t("Other", "अन्य")}</option>
      </select>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 rounded-full border border-cardline py-2.5 text-sm font-medium text-muted">
          {t("Cancel", "रद्द करें")}
        </button>
        <button
          onClick={submit}
          disabled={!title.trim() || !user}
          className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          {t("Post", "पोस्ट करें")}
        </button>
      </div>
    </div>
  );
}
