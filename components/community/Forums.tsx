"use client";

import { useState } from "react";
import { forumBoards, seedThreads } from "@/lib/seed-community";
import { useT } from "../LangProvider";

export default function Forums() {
  const t = useT();
  const [openBoard, setOpenBoard] = useState<string | null>(null);

  return (
    <div className="mt-3 space-y-2.5 px-4">
      {forumBoards.map((b) => {
        const threads = seedThreads.filter((th) => th.board_slug === b.slug);
        const isOpen = openBoard === b.slug;
        return (
          <div key={b.slug} className="card overflow-hidden">
            <button
              onClick={() => setOpenBoard(isOpen ? null : b.slug)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="text-xl">{b.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{t(b.name, b.hi)}</p>
                <p className="truncate text-xs text-muted">{b.desc}</p>
              </div>
              <span className="shrink-0 text-xs font-medium text-muted">
                {threads.length || "–"} {t("threads", "चर्चाएँ")}
              </span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {isOpen && (
              <div className="border-t border-cardline">
                {threads.length === 0 && (
                  <p className="p-4 text-sm text-muted">
                    {t(
                      "No threads yet — start the first discussion!",
                      "अभी कोई चर्चा नहीं — पहली चर्चा आप शुरू करें!",
                    )}
                  </p>
                )}
                {threads
                  .slice()
                  .sort((a, b2) => Number(b2.is_pinned) - Number(a.is_pinned))
                  .map((th) => (
                    <div
                      key={th.id}
                      className="border-b border-cardline px-4 py-3 last:border-b-0"
                    >
                      <p className="text-sm font-medium text-ink">
                        {th.is_pinned && (
                          <span className="mr-1.5 rounded bg-sand/15 px-1.5 py-0.5 text-[10px] font-semibold text-sand">
                            📌 {t("Pinned", "पिन की गई")}
                          </span>
                        )}
                        {th.title}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {th.author} · {th.reply_count} {t("replies", "जवाब")} ·{" "}
                        {t("active", "सक्रिय")} {th.last_active}
                      </p>
                    </div>
                  ))}
                <button className="w-full py-3 text-center text-sm font-semibold text-primary">
                  + {t("New thread", "नई चर्चा")}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
