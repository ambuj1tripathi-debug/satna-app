"use client";

import { useMemo, useState } from "react";
import type { Memory } from "@/lib/types";
import { seedMemories, eraLabels } from "@/lib/seed-community";
import { usePersistentState } from "@/lib/store";
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

      <button className="mt-4 w-full rounded-full border-2 border-dashed border-sand/50 py-3 text-sm font-semibold text-sand">
        + {t("Share a memory", "याद साझा करें")}
      </button>
      <p className="mt-2 text-center text-[10px] text-muted">
        {t(
          "All submissions are reviewed by admins before going live",
          "सभी योगदान लाइव होने से पहले एडमिन द्वारा जाँचे जाते हैं",
        )}
      </p>
    </div>
  );
}
