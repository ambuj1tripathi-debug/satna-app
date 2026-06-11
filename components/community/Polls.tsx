"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Poll } from "@/lib/types";
import { usePersistentState } from "@/lib/store";
import { useAuth, dbInsert } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { useT } from "../LangProvider";

export default function Polls() {
  const t = useT();
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [voted, setVoted] = usePersistentState<Record<string, string>>("poll-votes", {});

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.from("polls")
      .select("id, question, closes_at, poll_options(id, label, sort_order, poll_votes(count))")
      .eq("status", "approved")
      .eq("is_archived", false)
      .gte("closes_at", new Date().toISOString())
      .then(({ data }) => {
        if (!data) return;
        setPolls(
          data.map((p) => ({
            id: p.id,
            question: p.question,
            closes_in_days: Math.max(
              0,
              Math.ceil((new Date(p.closes_at).getTime() - Date.now()) / 86_400_000),
            ),
            options: (p.poll_options as {
              id: string;
              label: string;
              sort_order: number;
              poll_votes: { count: number }[];
            }[])
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((o) => ({
                id: o.id,
                label: o.label,
                votes: o.poll_votes?.[0]?.count ?? 0,
              })),
          })),
        );
      });
  }, []);

  const vote = (pollId: string, optionId: string) => {
    if (voted[pollId]) return;
    setVoted({ ...voted, [pollId]: optionId });
    setPolls((prev) =>
      prev.map((p) =>
        p.id === pollId
          ? {
              ...p,
              options: p.options.map((o) =>
                o.id === optionId ? { ...o, votes: o.votes + 1 } : o,
              ),
            }
          : p,
      ),
    );
    if (user) {
      void dbInsert("poll_votes", {
        poll_id: pollId,
        option_id: optionId,
        user_id: user.id,
      });
    }
  };

  if (polls.length === 0) {
    return (
      <div className="card mx-4 mt-4 p-8 text-center">
        <p className="text-2xl">🗳️</p>
        <p className="mt-2 text-sm font-medium text-ink">
          {t("No active polls right now", "अभी कोई सक्रिय मतदान नहीं")}
        </p>
        <p className="mt-1 text-xs text-muted">
          {t(
            "Weekly city polls appear here — which road to fix, when to hold the mela…",
            "साप्ताहिक शहर मतदान यहाँ दिखेंगे — कौन सी सड़क पहले बने, मेला कब हो…",
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3 px-4">
      {!user && (
        <p className="text-xs text-muted">
          {t("Sign in (More → Profile) for your vote to count citywide.", "वोट गिनने के लिए साइन इन करें (और → प्रोफाइल)।")}
        </p>
      )}
      {polls.map((p) => {
        const hasVoted = !!voted[p.id];
        const total = p.options.reduce((sum, o) => sum + o.votes, 0);
        return (
          <article key={p.id} className="card p-4">
            <h3 className="text-sm font-semibold text-ink">{p.question}</h3>
            <p className="mt-0.5 text-xs text-muted">
              {total} {t("votes", "वोट")} · {p.closes_in_days} {t("days remaining", "दिन शेष")}
            </p>
            <div className="mt-3 space-y-2">
              {p.options.map((o) => {
                const pct = total ? Math.round((o.votes / total) * 100) : 0;
                const isChoice = voted[p.id] === o.id;
                return hasVoted ? (
                  <div key={o.id} className="relative overflow-hidden rounded-lg border border-cardline">
                    <div
                      className={`absolute inset-y-0 left-0 ${isChoice ? "bg-primary-100" : "bg-canvas"}`}
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative flex items-center justify-between px-3 py-2.5">
                      <span className="text-sm text-ink">
                        {o.label} {isChoice && "✓"}
                      </span>
                      <span className="text-xs font-semibold text-muted">{pct}%</span>
                    </div>
                  </div>
                ) : (
                  <button
                    key={o.id}
                    onClick={() => vote(p.id, o.id)}
                    className="w-full rounded-lg border border-cardline px-3 py-2.5 text-left text-sm text-ink hover:border-primary"
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </article>
        );
      })}
      <div className="card border-dashed p-4 text-center">
        <p className="text-sm text-muted">{t("Have a poll idea?", "कोई पोल का विचार है?")}</p>
        <Link href="/more/feedback" className="mt-1 inline-block text-sm font-semibold text-primary">
          {t("Suggest it →", "सुझाएँ →")}
        </Link>
      </div>
    </div>
  );
}
