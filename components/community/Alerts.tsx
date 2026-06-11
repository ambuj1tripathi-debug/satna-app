"use client";

import { seedAlerts } from "@/lib/seed-community";
import { usePersistentState } from "@/lib/store";
import { useT } from "../LangProvider";

const severityStyles: Record<
  string,
  { emoji: string; en: string; hi: string; border: string; chip: string }
> = {
  emergency: { emoji: "🔴", en: "Emergency", hi: "आपातकाल", border: "border-l-danger", chip: "bg-danger/10 text-danger" },
  civic: { emoji: "🟠", en: "Civic issue", hi: "नागरिक समस्या", border: "border-l-primary", chip: "bg-primary-50 text-primary-700" },
  disruption: { emoji: "🟡", en: "Disruption", hi: "व्यवधान", border: "border-l-sand", chip: "bg-sand/15 text-sand" },
  good_news: { emoji: "🟢", en: "Good news", hi: "अच्छी खबर", border: "border-l-positive", chip: "bg-positive-50 text-positive" },
};

function timeAgo(iso: string, t: (en: string, hi?: string | null) => string) {
  const hrs = Math.round((Date.now() - new Date(iso).getTime()) / 3600_000);
  if (hrs < 24) return `${hrs} ${t("hrs ago", "घंटे पहले")}`;
  return `${Math.round(hrs / 24)} ${t("days ago", "दिन पहले")}`;
}

export default function Alerts() {
  const t = useT();
  const [responses, setResponses] = usePersistentState<
    Record<string, "active" | "resolved">
  >("alert-responses", {});

  return (
    <div className="mt-3 space-y-3 px-4">
      {seedAlerts.map((a) => {
        const s = severityStyles[a.severity];
        const response = responses[a.id];
        return (
          <article key={a.id} className={`card border-l-4 p-4 ${s.border}`}>
            <div className="flex items-start justify-between gap-2">
              <span className={`pill ${s.chip}`}>
                {s.emoji} {t(s.en, s.hi)}
              </span>
              <span
                className={`pill shrink-0 ${
                  a.source_verified
                    ? "bg-positive-50 text-positive"
                    : "bg-canvas text-muted"
                }`}
              >
                {a.source_verified
                  ? `✓ ${t("Admin Verified", "एडमिन सत्यापित")}`
                  : t("Community Report", "सामुदायिक रिपोर्ट")}
              </span>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-ink">{a.headline}</h3>
            <p className="mt-1 text-sm text-muted">{a.description}</p>
            <p className="mt-2 text-xs text-muted">
              📍 {a.affected_area} · {timeAgo(a.created_at, t)}
            </p>
            <div className="mt-3 flex gap-2 border-t border-cardline pt-3">
              {response ? (
                <p className="text-xs font-medium text-positive">
                  ✓{" "}
                  {response === "active"
                    ? t("Marked as still active — thanks!", "अभी भी सक्रिय — धन्यवाद!")
                    : t("Marked as resolved — admin will verify", "हल हो गया — एडमिन सत्यापित करेगा")}
                </p>
              ) : (
                <>
                  <button
                    onClick={() => setResponses({ ...responses, [a.id]: "active" })}
                    className="flex-1 rounded-full border border-cardline py-2 text-xs font-medium text-muted"
                  >
                    {t("Still active", "अभी भी सक्रिय")}
                  </button>
                  <button
                    onClick={() => setResponses({ ...responses, [a.id]: "resolved" })}
                    className="flex-1 rounded-full border border-positive/40 py-2 text-xs font-medium text-positive"
                  >
                    {t("Mark as resolved", "हल हो गया")}
                  </button>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
