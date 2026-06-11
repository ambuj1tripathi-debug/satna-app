"use client";

import { useEffect, useMemo, useState } from "react";
import { quizCategories, quizQuestions, type QuizQuestion } from "@/lib/seed-more";
import { usePersistentState } from "@/lib/store";
import { useT } from "../LangProvider";

interface PlayerStats {
  xp: number;
  correctTotal: number;
  streak: number;
  lastPlayed: string | null; // date string
}

export const initialStats: PlayerStats = {
  xp: 0,
  correctTotal: 0,
  streak: 0,
  lastPlayed: null,
};

export default function Quiz() {
  const t = useT();
  const [stats, setStats] = usePersistentState<PlayerStats>("player-stats", initialStats);
  const [category, setCategory] = useState<string | null>(null);

  // daily question = rotates by day of year
  const daily = useMemo(() => {
    const day = Math.floor(Date.now() / 86_400_000);
    return quizQuestions[day % quizQuestions.length];
  }, []);

  if (category) {
    return (
      <QuizGame
        category={category}
        onExit={(earned, correct) => {
          const today = new Date().toDateString();
          const yesterday = new Date(Date.now() - 86_400_000).toDateString();
          setStats((s) => ({
            xp: s.xp + earned,
            correctTotal: s.correctTotal + correct,
            streak:
              s.lastPlayed === today
                ? s.streak
                : s.lastPlayed === yesterday
                  ? s.streak + 1
                  : 1,
            lastPlayed: today,
          }));
          setCategory(null);
        }}
      />
    );
  }

  return (
    <div className="px-4">
      {/* stats strip */}
      <div className="card mt-3 flex divide-x divide-cardline">
        <div className="flex-1 p-3 text-center">
          <p className="font-heading text-lg font-semibold text-primary">{stats.xp}</p>
          <p className="text-[10px] text-muted">XP</p>
        </div>
        <div className="flex-1 p-3 text-center">
          <p className="font-heading text-lg font-semibold text-primary">
            {stats.streak} 🔥
          </p>
          <p className="text-[10px] text-muted">{t("day streak", "दिन की लय")}</p>
        </div>
        <div className="flex-1 p-3 text-center">
          <p className="font-heading text-lg font-semibold text-primary">
            {stats.correctTotal}
          </p>
          <p className="text-[10px] text-muted">{t("correct", "सही")}</p>
        </div>
      </div>

      {/* daily question teaser */}
      <button
        onClick={() => setCategory("daily")}
        className="card mt-3 w-full border-primary/30 bg-primary-50/50 p-4 text-left"
      >
        <p className="text-xs font-semibold text-primary">
          ☀️ {t("Aaj ka Sawaal", "आज का सवाल")}
        </p>
        <p className="mt-1 text-sm font-medium text-ink">{daily.q}</p>
        <p className="mt-1 text-xs text-muted">
          {t("One new question every day — tap to answer", "हर दिन एक नया सवाल — जवाब दें")}
        </p>
      </button>

      {/* categories */}
      <p className="mt-4 font-heading text-base font-semibold text-ink">
        {t("Satna Ka Gyaan — pick a category", "सतना का ज्ञान — श्रेणी चुनें")}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2.5">
        {quizCategories.map((c) => {
          const count = quizQuestions.filter((q) => q.category === c.key).length;
          return (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className="card p-4 text-left"
            >
              <span className="text-2xl">{c.emoji}</span>
              <p className="mt-1.5 text-sm font-semibold text-ink">{t(c.en, c.hi)}</p>
              <p className="text-[10px] text-muted">
                {count} {t("questions", "प्रश्न")}
              </p>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[10px] text-muted">
        {t(
          "+10 XP per correct answer · no penalty for wrong ones",
          "हर सही जवाब पर +10 XP · गलत पर कोई दंड नहीं",
        )}
      </p>
    </div>
  );
}

function QuizGame({
  category,
  onExit,
}: {
  category: string;
  onExit: (earnedXp: number, correctCount: number) => void;
}) {
  const t = useT();
  const questions = useMemo(() => {
    if (category === "daily") {
      const day = Math.floor(Date.now() / 86_400_000);
      return [quizQuestions[day % quizQuestions.length]];
    }
    return quizQuestions
      .filter((q) => q.category === category)
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
  }, [category]);

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [finished, setFinished] = useState(false);

  const q: QuizQuestion | undefined = questions[index];

  useEffect(() => {
    if (picked !== null || finished) return;
    if (timeLeft <= 0) {
      setPicked(-1); // timed out
      return;
    }
    const id = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, picked, finished]);

  if (!q || finished) {
    const earned = correctCount * 10;
    return (
      <div className="px-4 pt-8 text-center">
        <p className="text-4xl">{correctCount >= questions.length * 0.7 ? "🏆" : "💪"}</p>
        <h2 className="mt-3 font-heading text-xl font-semibold text-ink">
          {correctCount}/{questions.length} {t("correct", "सही")}
        </h2>
        <p className="mt-1 text-sm text-muted">+{earned} XP</p>
        <button
          onClick={() => onExit(earned, correctCount)}
          className="mt-5 rounded-full bg-primary px-8 py-2.5 text-sm font-semibold text-white"
        >
          {t("Done", "ठीक है")}
        </button>
      </div>
    );
  }

  const next = () => {
    if (picked !== null && picked === q.correct) setCorrectCount((c) => c + 1);
    if (index + 1 >= questions.length) {
      // count last answer before finishing
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setPicked(null);
    setTimeLeft(30);
  };

  return (
    <div className="px-4">
      <div className="mt-3 flex items-center justify-between text-xs font-medium text-muted">
        <span>
          {t("Question", "प्रश्न")} {index + 1}/{questions.length}
        </span>
        <span className={timeLeft <= 5 ? "text-danger" : ""}>⏱ {timeLeft}s</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-cardline">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="card mt-3 p-4">
        <p className="text-sm font-semibold leading-relaxed text-ink">{q.q}</p>
      </div>

      <div className="mt-3 space-y-2">
        {q.options.map((opt, i) => {
          let cls = "border-cardline bg-white text-ink";
          if (picked !== null) {
            if (i === q.correct) cls = "border-positive bg-positive-50 text-positive";
            else if (i === picked) cls = "border-danger bg-danger/10 text-danger";
            else cls = "border-cardline bg-white text-muted";
          }
          return (
            <button
              key={opt}
              disabled={picked !== null}
              onClick={() => setPicked(i)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-medium ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <>
          {picked !== q.correct && (
            <div className="card mt-3 border-primary/30 bg-primary-50/50 p-3">
              <p className="text-xs font-semibold text-primary">
                {picked === -1 ? t("Time's up!", "समय समाप्त!") : t("Not quite —", "सही नहीं —")}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink">{q.explanation}</p>
            </div>
          )}
          <button
            onClick={next}
            className="mt-3 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white"
          >
            {index + 1 >= questions.length
              ? t("See result", "नतीजा देखें")
              : t("Next question", "अगला प्रश्न")}
          </button>
        </>
      )}
    </div>
  );
}
