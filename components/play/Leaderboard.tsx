"use client";

import { useState } from "react";
import { seedLeaderboard } from "@/lib/seed-more";
import { usePersistentState } from "@/lib/store";
import { initialStats } from "./Quiz";
import { useT } from "../LangProvider";

const periods = [
  { key: "today", en: "Today", hi: "आज" },
  { key: "week", en: "This Week", hi: "इस सप्ताह" },
  { key: "all", en: "All Time", hi: "सर्वकालिक" },
];

// seed users' scores scaled down for shorter periods
const periodFactor: Record<string, number> = { today: 0.05, week: 0.3, all: 1 };

export default function Leaderboard() {
  const t = useT();
  const [period, setPeriod] = useState("all");
  const [stats] = usePersistentState("player-stats", initialStats);

  const rows = seedLeaderboard
    .map((u) => ({ ...u, xp: Math.round(u.xp * periodFactor[period]) }))
    .concat([
      {
        name: t("You", "आप"),
        neighborhood: "Satna",
        xp: stats.xp,
        badges: stats.correctTotal >= 50 ? ["🎓"] : [],
      },
    ])
    .sort((a, b) => b.xp - a.xp);

  const youIndex = rows.findIndex((r) => r.name === t("You", "आप"));

  return (
    <div className="px-4">
      <div className="mt-3 flex gap-2">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`pill flex-1 justify-center border ${
              period === p.key
                ? "border-primary bg-primary-50 text-primary-700"
                : "border-cardline bg-white text-muted"
            }`}
          >
            {t(p.en, p.hi)}
          </button>
        ))}
      </div>

      <div className="card mt-3 divide-y divide-cardline">
        {rows.slice(0, 10).map((u, i) => {
          const isYou = i === youIndex;
          return (
            <div
              key={u.name}
              className={`flex items-center gap-3 px-4 py-3 ${isYou ? "bg-primary-50/60" : ""}`}
            >
              <span className={`w-7 text-center font-heading text-sm font-semibold ${i < 3 ? "text-primary" : "text-muted"}`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary">
                {u.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {u.name} {u.badges.join(" ")}
                </p>
                <p className="text-[10px] text-muted">{u.neighborhood}</p>
              </div>
              <span className="text-sm font-semibold text-ink">{u.xp}</span>
            </div>
          );
        })}
      </div>

      {youIndex >= 10 && (
        <div className="card mt-2 flex items-center gap-3 border-primary/40 px-4 py-3">
          <span className="w-7 text-center text-sm font-semibold text-muted">
            #{youIndex + 1}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary">
            {t("Y", "आ")}
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">{t("You", "आप")}</p>
            <p className="text-[10px] text-muted">
              {t("Play quiz rounds to climb!", "ऊपर चढ़ने के लिए क्विज़ खेलें!")}
            </p>
          </div>
          <span className="text-sm font-semibold text-ink">{stats.xp}</span>
        </div>
      )}
    </div>
  );
}
