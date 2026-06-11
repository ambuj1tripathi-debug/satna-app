"use client";

import { useEffect, useState } from "react";
import { todayThought, historyFact } from "@/lib/seed-data";
import { useT } from "../LangProvider";

interface Weather {
  temp: number;
  feelsLike: number;
  humidity: number;
}

const moods = [
  { key: "chill", emoji: "🌤", en: "Chill", hi: "शांत" },
  { key: "festive", emoji: "🎉", en: "Festive", hi: "उत्सवी" },
  { key: "quiet", emoji: "🌧", en: "Quiet", hi: "खामोश" },
  { key: "busy", emoji: "🔥", en: "Busy", hi: "व्यस्त" },
];

export default function TodayInSatna() {
  const t = useT();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [mood, setMood] = useState<string | null>(null);

  useEffect(() => {
    // Open-Meteo, no API key — Satna coordinates
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=24.58&longitude=80.83&current=temperature_2m,relative_humidity_2m,apparent_temperature",
    )
      .then((r) => r.json())
      .then((d) =>
        setWeather({
          temp: Math.round(d.current.temperature_2m),
          feelsLike: Math.round(d.current.apparent_temperature),
          humidity: d.current.relative_humidity_2m,
        }),
      )
      .catch(() => {});

    // mood vote persists for the day, resets at midnight
    const saved = localStorage.getItem("satna-mood");
    if (saved) {
      const { day, value } = JSON.parse(saved);
      if (day === new Date().toDateString()) setMood(value);
    }
  }, []);

  const voteMood = (key: string) => {
    setMood(key);
    localStorage.setItem(
      "satna-mood",
      JSON.stringify({ day: new Date().toDateString(), value: key }),
    );
  };

  return (
    <section aria-label="Today in Satna" className="mt-6">
      <div className="mb-3 px-4">
        <h2 className="font-heading text-lg font-semibold text-ink">
          {t("Today in Satna", "आज सतना में")}
        </h2>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
        {/* Weather */}
        <div className="card flex w-44 shrink-0 flex-col justify-between p-4">
          <p className="text-xs font-medium text-muted">{t("Weather", "मौसम")}</p>
          {weather ? (
            <>
              <p className="font-heading text-3xl font-semibold text-ink">
                {weather.temp}°C
              </p>
              <p className="text-xs text-muted">
                {t("Feels like", "महसूस")} {weather.feelsLike}° · {weather.humidity}%{" "}
                {t("humidity", "नमी")}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">…</p>
          )}
        </div>

        {/* Thought of the day */}
        <div className="card flex w-56 shrink-0 flex-col justify-between p-4">
          <p className="text-xs font-medium text-muted">
            {t("Aaj ka vichar", "आज का विचार")}
          </p>
          <p className="text-sm font-medium leading-snug text-ink">
            “{t(todayThought.en, todayThought.hi)}”
          </p>
          <p className="text-[10px] text-muted">{t("Community submitted", "समुदाय द्वारा")}</p>
        </div>

        {/* This week in history */}
        <div className="card flex w-64 shrink-0 flex-col justify-between border-sand/40 p-4">
          <p className="text-xs font-medium text-sand">
            {t("This week in Satna history", "इस सप्ताह इतिहास में")}
          </p>
          <p className="text-sm leading-snug text-ink">{historyFact}</p>
        </div>

        {/* Mood of the city */}
        <div className="card w-52 shrink-0 p-4">
          <p className="mb-2 text-xs font-medium text-muted">
            {t("Mood of the city", "शहर का मिज़ाज")}
          </p>
          <div className="flex gap-1.5">
            {moods.map((m) => (
              <button
                key={m.key}
                onClick={() => voteMood(m.key)}
                aria-pressed={mood === m.key}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg transition ${
                  mood === m.key
                    ? "border-primary bg-primary-50"
                    : "border-cardline bg-white"
                }`}
              >
                {m.emoji}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-muted">
            {mood
              ? t("Thanks for voting!", "वोट के लिए धन्यवाद!")
              : t("Vote — resets at midnight", "वोट करें — आधी रात को रीसेट")}
          </p>
        </div>
      </div>
    </section>
  );
}
