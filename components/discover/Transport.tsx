"use client";

import { useState } from "react";
import {
  seedTrains,
  seedBuses,
  seedFares,
  seedIntercity,
} from "@/lib/seed-more";
import { useT } from "../LangProvider";

const modes = [
  { key: "trains", en: "Trains", hi: "ट्रेनें", emoji: "🚆" },
  { key: "buses", en: "Buses", hi: "बसें", emoji: "🚌" },
  { key: "autos", en: "Autos", hi: "ऑटो", emoji: "🛺" },
  { key: "intercity", en: "Intercity", hi: "अंतरनगरीय", emoji: "🛣️" },
];

export default function Transport() {
  const t = useT();
  const [mode, setMode] = useState("trains");

  return (
    <div className="px-4">
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`pill shrink-0 border ${
              mode === m.key
                ? "border-primary bg-primary-50 text-primary-700"
                : "border-cardline bg-white text-muted"
            }`}
          >
            {m.emoji} {t(m.en, m.hi)}
          </button>
        ))}
      </div>

      {mode === "trains" && (
        <div className="mt-3 space-y-2.5">
          <p className="text-xs text-muted">
            {t("Key departures from Satna Junction", "सतना जंक्शन से प्रमुख प्रस्थान")}
          </p>
          {seedTrains.map((r) => (
            <div key={r.name} className="card p-3.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-ink">{r.name}</p>
                <span className="shrink-0 text-xs font-medium text-primary">{r.timing}</span>
              </div>
              <p className="mt-0.5 text-sm text-muted">→ {r.destination}</p>
              <p className="mt-1 text-xs text-muted">{r.frequency} · {r.extra}</p>
            </div>
          ))}
          <a
            href="https://www.irctc.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-white"
          >
            {t("Book on IRCTC ↗", "IRCTC पर बुक करें ↗")}
          </a>
        </div>
      )}

      {mode === "buses" && (
        <div className="mt-3 space-y-2.5">
          <p className="text-xs text-muted">
            {t("From Satna Bus Stand — community-updated timings", "सतना बस स्टैंड से — समुदाय द्वारा अद्यतन")}
          </p>
          {seedBuses.map((r) => (
            <div key={r.name + r.destination} className="card p-3.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-ink">→ {r.destination}</p>
                <span className="pill shrink-0 bg-primary-50 text-primary-700">{r.frequency}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{r.name} · {r.timing}</p>
              <p className="mt-0.5 text-xs text-muted">{r.extra}</p>
            </div>
          ))}
        </div>
      )}

      {mode === "autos" && (
        <div className="mt-3">
          <p className="text-xs text-muted">
            {t(
              "Approximate fares, community-maintained. Always confirm with the driver.",
              "अनुमानित किराया, समुदाय द्वारा। ड्राइवर से ज़रूर पक्का करें।",
            )}
          </p>
          <div className="card mt-2.5 divide-y divide-cardline">
            {seedFares.map((f) => (
              <div key={f.from + f.to} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm text-ink">{f.from} → {f.to}</p>
                  {f.verified && (
                    <p className="text-[10px] text-positive">✓ {t("community verified", "समुदाय सत्यापित")}</p>
                  )}
                </div>
                <span className="text-sm font-semibold text-ink">{f.fare}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === "intercity" && (
        <div className="mt-3 space-y-2.5">
          {seedIntercity.map((r) => (
            <div key={r.to} className="card p-3.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">Satna → {r.to}</p>
                <span className="text-xs text-muted">{r.km} km · {r.time}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{r.options}</p>
            </div>
          ))}
          <a
            href="/discover?tab=cab"
            className="block w-full rounded-full border border-primary py-2.5 text-center text-sm font-semibold text-primary"
          >
            🚖 {t("Or share a cab and split the cost", "या कैब शेयर कर खर्च बाँटें")}
          </a>
        </div>
      )}
    </div>
  );
}
