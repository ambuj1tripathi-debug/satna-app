"use client";

import { useEffect, useMemo, useState } from "react";
import type { Memory } from "@/lib/types";
import { seedMemories, eraLabels } from "@/lib/seed-community";
import { usePersistentState } from "@/lib/store";
import { useAuth, dbInsert } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { useT } from "../LangProvider";

const typeBadge: Record<string, { emoji: string; en: string; hi: string }> = {
  photo: { emoji: "📷", en: "Old photo", hi: "पुरानी फोटो" },
  story: { emoji: "✍️", en: "Memory", hi: "याद" },
  then_vs_now: { emoji: "🔁", en: "Then vs Now", hi: "तब बनाम अब" },
};

export default function Memories() {
  const t = useT();
  const [era, setEra] = useState("all");
  const [memories, setMemories] = usePersistentState<Memory[]>("memories", seedMemories);
  const [remembered, setRemembered] = usePersistentState<string[]>("memories-remembered", []);

  // approved memories from the moderation queue
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.from("memories")
      .select("*, profiles(username)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        setMemories(
          data.map((m) => ({
            id: m.id,
            type: m.type,
            era: m.era ?? "recent",
            caption: m.caption ?? "",
            story: m.story ?? undefined,
            year_estimate: m.year_estimate ?? undefined,
            location_tag: m.location_tag ?? "Satna",
            contributor:
              (m.profiles as { username?: string })?.username ?? "Satna Resident",
            like_count: m.like_count,
            remember_count: m.remember_count,
            comment_count: 0,
            is_featured: m.is_featured,
          })),
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () => (era === "all" ? memories : memories.filter((m) => m.era === era)),
    [memories, era],
  );
  const featured = memories.find((m) => m.is_featured);

  const remember = (id: string) => {
    if (remembered.includes(id)) return;
    setRemembered([...remembered, id]);
    setMemories((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, remember_count: m.remember_count + 1 } : m,
      ),
    );
  };

  return (
    <div className="px-4">
      <div className="mt-3 rounded-card bg-gradient-to-br from-sand/15 to-primary-50 p-4">
        <p className="font-heading text-base font-semibold text-sand">
          सतना यादें · Satna Yaadein
        </p>
        <p className="mt-1 text-xs text-ink">
          {t(
            "A living, crowd-sourced memory book of our city — old photos, stories, and then-vs-now moments.",
            "हमारे शहर की जीवित, सामुदायिक यादों की किताब — पुरानी तस्वीरें, किस्से, और तब-बनाम-अब के पल।",
          )}
        </p>
      </div>

      {featured && (
        <div className="card mt-3 border-sand/40 p-4">
          <span className="pill bg-sand/15 text-sand">
            📖 {t("Satna Ka Ek Safha", "सतना का एक सफ़हा")} ·{" "}
            {t("This week's featured memory", "इस हफ्ते की खास याद")}
          </span>
          <p className="mt-2 text-sm font-medium text-ink">{featured.caption}</p>
          <p className="mt-1 text-xs text-muted">
            {featured.contributor} · {featured.location_tag} · {featured.year_estimate}
          </p>
        </div>
      )}

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {Object.entries(eraLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setEra(key)}
            className={`pill shrink-0 border ${
              era === key
                ? "border-sand bg-sand/15 text-sand"
                : "border-cardline bg-white text-muted"
            }`}
          >
            {t(label.en, label.hi)}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {filtered.map((m) => {
          const badge = typeBadge[m.type];
          return (
            <article key={m.id} className="card overflow-hidden">
              {m.type !== "story" && (
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-sand/10 to-canvas text-4xl grayscale">
                  {m.type === "then_vs_now" ? "🔁" : "🖼️"}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="pill bg-canvas text-muted">
                    {badge.emoji} {t(badge.en, badge.hi)}
                  </span>
                  <span className="text-xs font-semibold text-sand">
                    {m.year_estimate}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-ink">{m.caption}</p>
                {m.story && (
                  <p className="mt-2 rounded-lg bg-canvas px-3 py-2 text-sm leading-relaxed text-muted">
                    {m.story}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted">
                  {m.contributor} · 📍 {m.location_tag}
                </p>
                <div className="mt-3 flex items-center gap-3 border-t border-cardline pt-2.5 text-xs font-medium text-muted">
                  <span>❤️ {m.like_count}</span>
                  <button
                    onClick={() => remember(m.id)}
                    className={`rounded-full border px-2.5 py-1 ${
                      remembered.includes(m.id)
                        ? "border-sand bg-sand/15 text-sand"
                        : "border-cardline"
                    }`}
                  >
                    🙋 {t("I remember this too", "मुझे भी याद है")} · {m.remember_count}
                  </button>
                  <span className="ml-auto">💬 {m.comment_count}</span>
                </div>
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <div className="card p-8 text-center text-sm text-muted">
            {t(
              "This era has no memories yet — do you have an old photo or story to share?",
              "इस दौर की कोई याद नहीं — क्या आपके पास कोई पुरानी फोटो या किस्सा है?",
            )}
          </div>
        )}
      </div>

      <ShareMemory />
      <p className="mt-2 text-center text-[10px] text-muted">
        {t(
          "All submissions are reviewed by admins before going live",
          "सभी योगदान लाइव होने से पहले एडमिन द्वारा जाँचे जाते हैं",
        )}
      </p>
    </div>
  );
}

function ShareMemory() {
  const t = useT();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [story, setStory] = useState("");
  const [era, setEra] = useState("era_1980s_90s");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="mt-4 rounded-card bg-positive-50 p-3 text-center text-xs font-medium text-positive">
        ✓ {t("Memory submitted for review — dhanyavaad!", "याद समीक्षा हेतु भेजी गई — धन्यवाद!")}
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full rounded-full border-2 border-dashed border-sand/50 py-3 text-sm font-semibold text-sand"
      >
        + {t("Share a memory", "याद साझा करें")}
      </button>
    );
  }

  const submit = () => {
    if (!caption.trim()) return;
    if (user) {
      void dbInsert("memories", {
        user_id: user.id,
        type: "story",
        era,
        caption: caption.trim(),
        story: story.trim().split(/\s+/).slice(0, 300).join(" ") || null,
        location_tag: "Satna",
      });
    }
    setSent(true);
  };

  const inputCls =
    "w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink";

  return (
    <div className="card mt-4 space-y-3 p-4">
      <p className="font-heading text-base font-semibold text-ink">
        {t("Share a memory", "याद साझा करें")}
      </p>
      {!user && (
        <p className="rounded-lg bg-canvas px-3 py-2 text-xs text-muted">
          {t(
            "Sign in (More → Profile) so your memory reaches the review queue.",
            "साइन इन करें (और → प्रोफाइल) ताकि आपकी याद समीक्षा कतार तक पहुँचे।",
          )}
        </p>
      )}
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder={t("One-line caption", "एक पंक्ति का शीर्षक")}
        className={inputCls}
      />
      <textarea
        value={story}
        onChange={(e) => setStory(e.target.value)}
        rows={4}
        placeholder={t("Your story (max 300 words)", "आपका किस्सा (अधिकतम 300 शब्द)")}
        className={inputCls}
      />
      <select value={era} onChange={(e) => setEra(e.target.value)} className={inputCls}>
        {Object.entries(eraLabels)
          .filter(([k]) => k !== "all")
          .map(([k, v]) => (
            <option key={k} value={k}>
              {t(v.en, v.hi)}
            </option>
          ))}
      </select>
      <div className="flex gap-2">
        <button
          onClick={() => setOpen(false)}
          className="flex-1 rounded-full border border-cardline py-2.5 text-sm font-medium text-muted"
        >
          {t("Cancel", "रद्द करें")}
        </button>
        <button
          onClick={submit}
          disabled={!caption.trim()}
          className="flex-1 rounded-full bg-sand py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          {t("Submit", "भेजें")}
        </button>
      </div>
    </div>
  );
}
