"use client";

import type { Poll } from "@/lib/types";
import { seedPolls } from "@/lib/seed-community";
import { usePersistentState } from "@/lib/store";
import { useT } from "../LangProvider";

export default function Polls() {
  const t = useT();
  const [polls, setPolls] = usePersistentState<Poll[]>("polls", seedPolls);
  const [voted, setVoted] = usePersistentState<Record<string, string>>("poll-votes", {});

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
  };

  return (
    <div className="mt-3 space-y-3 px-4">
      <p className="text-xs text-muted">
        {t(
          "City voice — weekly polls on local issues. Results show after you vote.",
          "शहर की आवाज़ — स्थानीय मुद्दों पर साप्ताहिक मतदान। वोट के बाद नतीजे दिखेंगे।",
        )}
      </p>
      {polls.map((p) => {
        const hasVoted = !!voted[p.id];
        const total = p.options.reduce((sum, o) => sum + o.votes, 0);
        return (
          <article key={p.id} className="card p-4">
            <h3 className="text-sm font-semibold text-ink">{p.question}</h3>
            <p className="mt-0.5 text-xs text-muted">
              {total} {t("votes", "वोट")} · {p.closes_in_days}{" "}
              {t("days remaining", "दिन शेष")}
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
        <p className="text-sm text-muted">
          {t("Have a poll idea?", "कोई पोल का विचार है?")}
        </p>
        <button className="mt-1 text-sm font-semibold text-primary">
          {t("Propose a poll (admin approves)", "पोल सुझाएँ (एडमिन मंज़ूरी)")}
        </button>
      </div>
    </div>
  );
}
