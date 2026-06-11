"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import Quiz from "@/components/play/Quiz";
import Leaderboard from "@/components/play/Leaderboard";
import { TriviaSubmit, CityChallenge, Bingo } from "@/components/play/Extras";
import { useT } from "@/components/LangProvider";

const subTabs = [
  { key: "quiz", en: "Quiz", hi: "क्विज़" },
  { key: "leaderboard", en: "Leaderboard", hi: "लीडरबोर्ड" },
  { key: "submit", en: "Trivia Submit", hi: "प्रश्न भेजें" },
  { key: "challenge", en: "City Challenge", hi: "सिटी चैलेंज" },
  { key: "bingo", en: "Bingo", hi: "बिंगो" },
];

export default function PlayPage() {
  const t = useT();
  const [tab, setTab] = useState("quiz");

  return (
    <main>
      <TopBar />
      <div className="no-scrollbar sticky top-[61px] z-30 flex gap-2 overflow-x-auto border-b border-cardline bg-canvas px-4 py-2.5">
        {subTabs.map((s) => (
          <button
            key={s.key}
            onClick={() => setTab(s.key)}
            className={`pill shrink-0 ${
              tab === s.key
                ? "bg-primary font-semibold text-white"
                : "border border-cardline bg-white text-muted"
            }`}
          >
            {t(s.en, s.hi)}
          </button>
        ))}
      </div>

      {tab === "quiz" && <Quiz />}
      {tab === "leaderboard" && <Leaderboard />}
      {tab === "submit" && <TriviaSubmit />}
      {tab === "challenge" && <CityChallenge />}
      {tab === "bingo" && <Bingo />}

      <div className="h-6" />
    </main>
  );
}
