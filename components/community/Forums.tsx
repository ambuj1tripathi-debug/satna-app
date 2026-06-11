"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { forumBoards } from "@/lib/seed-community";
import { useAuth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { useT } from "../LangProvider";

interface DbThread {
  id: string;
  board_slug: string;
  title: string;
  author: string;
  reply_count: number;
  is_pinned: boolean;
  last_active_at: string;
}

export default function Forums() {
  const t = useT();
  const { user } = useAuth();
  const [openBoard, setOpenBoard] = useState<string | null>(null);
  const [threads, setThreads] = useState<DbThread[]>([]);
  const [boardIds, setBoardIds] = useState<Record<string, string>>({});
  const [composing, setComposing] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  const load = () => {
    const sb = getSupabase();
    if (!sb) return;
    sb.from("forum_threads")
      .select("*, forum_boards(slug), profiles(username)")
      .order("is_pinned", { ascending: false })
      .order("last_active_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        setThreads(
          data.map((th) => ({
            id: th.id,
            board_slug: (th.forum_boards as { slug?: string })?.slug ?? "",
            title: th.title,
            author: (th.profiles as { username?: string })?.username ?? "Satna Resident",
            reply_count: th.reply_count,
            is_pinned: th.is_pinned,
            last_active_at: th.last_active_at,
          })),
        );
      });
    sb.from("forum_boards")
      .select("id, slug")
      .then(({ data }) => {
        if (data)
          setBoardIds(Object.fromEntries(data.map((b) => [b.slug, b.id])));
      });
  };
  useEffect(load, []);

  const createThread = async (slug: string) => {
    const sb = getSupabase();
    if (!sb || !user || !title.trim() || !boardIds[slug]) return;
    const { error } = await sb.from("forum_threads").insert({
      board_id: boardIds[slug],
      user_id: user.id,
      title: title.trim(),
    });
    if (!error) {
      setTitle("");
      setComposing(null);
      load();
    }
  };

  return (
    <div className="mt-3 space-y-2.5 px-4">
      {forumBoards.map((b) => {
        const boardThreads = threads.filter((th) => th.board_slug === b.slug);
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
                {boardThreads.length || "–"} {t("threads", "चर्चाएँ")}
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
                {boardThreads.length === 0 && (
                  <p className="px-4 pt-4 text-sm text-muted">
                    {t(
                      "No threads yet — start the first discussion!",
                      "अभी कोई चर्चा नहीं — पहली चर्चा आप शुरू करें!",
                    )}
                  </p>
                )}
                {boardThreads.map((th) => (
                  <div key={th.id} className="border-b border-cardline px-4 py-3 last:border-b-0">
                    <p className="text-sm font-medium text-ink">
                      {th.is_pinned && (
                        <span className="mr-1.5 rounded bg-sand/15 px-1.5 py-0.5 text-[10px] font-semibold text-sand">
                          📌 {t("Pinned", "पिन की गई")}
                        </span>
                      )}
                      {th.title}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {th.author} · {th.reply_count} {t("replies", "जवाब")}
                    </p>
                  </div>
                ))}
                {composing === b.slug ? (
                  <div className="space-y-2 p-4">
                    {user ? (
                      <>
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder={t("Thread title…", "चर्चा का शीर्षक…")}
                          className="w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setComposing(null)}
                            className="flex-1 rounded-full border border-cardline py-2 text-xs font-medium text-muted"
                          >
                            {t("Cancel", "रद्द करें")}
                          </button>
                          <button
                            onClick={() => createThread(b.slug)}
                            disabled={!title.trim()}
                            className="flex-1 rounded-full bg-primary py-2 text-xs font-semibold text-white disabled:opacity-40"
                          >
                            {t("Post thread", "चर्चा पोस्ट करें")}
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-xs text-muted">
                        {t("Sign in to start a thread →", "चर्चा शुरू करने हेतु साइन इन करें →")}{" "}
                        <Link href="/more/profile" className="font-semibold text-primary">
                          {t("Profile", "प्रोफाइल")}
                        </Link>
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setComposing(b.slug)}
                    className="w-full py-3 text-center text-sm font-semibold text-primary"
                  >
                    + {t("New thread", "नई चर्चा")}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
