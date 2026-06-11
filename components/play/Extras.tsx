"use client";

// Trivia Submit, City Challenge and Bingo — grouped here to keep the Play tab compact.
import { useState } from "react";
import { quizCategories, currentChallenge, bingoCard } from "@/lib/seed-more";
import { usePersistentState } from "@/lib/store";
import { useAuth, dbInsert } from "@/lib/auth";
import { useT } from "../LangProvider";

const dbCategory: Record<string, string> = {
  history: "history_heritage",
  geography: "geography",
  culture: "culture_festivals",
  people: "famous_people",
  mp: "mp_general",
};

// ---------- Trivia Submit ----------
interface Submission {
  q: string;
  category: string;
  status: "pending";
}

export function TriviaSubmit() {
  const t = useT();
  const { user } = useAuth();
  const [subs, setSubs] = usePersistentState<Submission[]>("trivia-submissions", []);
  const [q, setQ] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [category, setCategory] = useState(quizCategories[0].key);

  const valid = q.trim() && options.every((o) => o.trim());
  const inputCls =
    "mt-1 w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink";

  const submit = () => {
    if (!valid) return;
    setSubs([{ q: q.trim(), category, status: "pending" }, ...subs]);
    if (user) {
      void dbInsert("quiz_questions", {
        category: dbCategory[category] ?? "mp_general",
        question_en: q.trim(),
        options: options.map((o) => o.trim()),
        correct_index: correct,
        submitted_by: user.id,
        status: "pending",
      });
    }
    setQ("");
    setOptions(["", "", "", ""]);
  };

  return (
    <div className="px-4">
      <div className="card mt-3 space-y-3 p-4">
        <p className="font-heading text-base font-semibold text-ink">
          {t("Submit a quiz question", "क्विज़ प्रश्न भेजें")}
        </p>
        <p className="text-xs text-muted">
          {t(
            "Approved questions go live with your name + 50 XP credit.",
            "मंज़ूर प्रश्न आपके नाम के साथ लाइव होंगे + 50 XP।",
          )}
        </p>
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          rows={2}
          placeholder={t("Question (Hindi or English)", "प्रश्न (हिंदी या अंग्रेज़ी)")}
          className={inputCls}
        />
        {options.map((o, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={o}
              onChange={(e) => {
                const next = options.slice();
                next[i] = e.target.value;
                setOptions(next);
              }}
              placeholder={`${t("Option", "विकल्प")} ${i + 1}`}
              className={inputCls + " mt-0 flex-1"}
            />
            <button
              onClick={() => setCorrect(i)}
              aria-label={t("Mark correct", "सही चिह्नित करें")}
              className={`h-9 w-9 shrink-0 rounded-full border text-sm ${
                correct === i
                  ? "border-positive bg-positive-50 text-positive"
                  : "border-cardline text-muted"
              }`}
            >
              ✓
            </button>
          </div>
        ))}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputCls}
        >
          {quizCategories.map((c) => (
            <option key={c.key} value={c.key}>
              {t(c.en, c.hi)}
            </option>
          ))}
        </select>
        <button
          onClick={submit}
          disabled={!valid}
          className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          {t("Submit for review", "समीक्षा हेतु भेजें")}
        </button>
      </div>

      {subs.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-muted">
            {t("Your submissions", "आपके प्रश्न")}
          </p>
          <div className="mt-2 space-y-2">
            {subs.map((s, i) => (
              <div key={i} className="card flex items-center justify-between gap-2 p-3">
                <p className="min-w-0 flex-1 truncate text-sm text-ink">{s.q}</p>
                <span className="pill shrink-0 bg-sand/15 text-sand">
                  {t("Pending Review", "समीक्षाधीन")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- City Challenge ----------
export function CityChallenge() {
  const t = useT();
  const [upvoted, setUpvoted] = usePersistentState<string[]>("challenge-upvotes", []);
  const [submitted, setSubmitted] = usePersistentState<boolean>("challenge-submitted", false);

  return (
    <div className="px-4">
      <div className="card mt-3 border-primary/30 bg-primary-50/40 p-4">
        <p className="pill bg-primary text-white">
          📸 {t("This week's challenge", "इस सप्ताह की चुनौती")}
        </p>
        <h3 className="mt-2 font-heading text-base font-semibold text-ink">
          {currentChallenge.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{currentChallenge.description}</p>
        <button
          onClick={() => setSubmitted(true)}
          disabled={submitted}
          className="mt-3 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitted
            ? t("Entry submitted ✓ — good luck!", "प्रविष्टि भेजी ✓ — शुभकामनाएँ!")
            : t("Submit photo + answer", "फोटो + जवाब भेजें")}
        </button>
      </div>

      <p className="mt-4 text-xs font-semibold text-muted">
        {t("Entries — community upvotes pick the top 3", "प्रविष्टियाँ — टॉप 3 समुदाय चुनेगा")}
      </p>
      <div className="mt-2 space-y-2">
        {currentChallenge.entries.map((e) => {
          const isUp = upvoted.includes(e.id);
          return (
            <div key={e.id} className="card flex items-center gap-3 p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-xl">
                📷
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{e.user}</p>
                <p className="text-xs text-muted">
                  {t("Answer", "जवाब")}: {e.answer}
                </p>
              </div>
              <button
                onClick={() => !isUp && setUpvoted([...upvoted, e.id])}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  isUp
                    ? "border-primary bg-primary-50 text-primary"
                    : "border-cardline text-muted"
                }`}
              >
                ▲ {e.upvotes + (isUp ? 1 : 0)}
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[10px] text-muted">
        {t(
          'Top 3 win the "City Champion" badge for the week 🏆',
          'टॉप 3 को "सिटी चैंपियन" बैज मिलेगा 🏆',
        )}
      </p>
    </div>
  );
}

// ---------- Bingo ----------
export function Bingo() {
  const t = useT();
  const [done, setDone] = usePersistentState<number[]>("bingo-done", []);

  const toggle = (i: number) =>
    setDone(done.includes(i) ? done.filter((x) => x !== i) : [...done, i]);

  // line detection: rows, columns, diagonals
  const lines: number[][] = [];
  for (let r = 0; r < 5; r++) lines.push([0, 1, 2, 3, 4].map((c) => r * 5 + c));
  for (let c = 0; c < 5; c++) lines.push([0, 1, 2, 3, 4].map((r) => r * 5 + c));
  lines.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]);
  const completedLines = lines.filter((line) => line.every((i) => done.includes(i)));
  const fullCard = done.length === 25;

  return (
    <div className="px-4">
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="font-heading text-base font-semibold text-ink">
            {t("Satna Bingo", "सतना बिंगो")} — {bingoCard.theme}
          </p>
          <p className="text-xs text-muted">
            {bingoCard.month} · {done.length}/25 {t("done", "पूर्ण")}
          </p>
        </div>
        {completedLines.length > 0 && (
          <span className="pill bg-positive-50 text-positive">
            🧭 {fullCard ? t("Full card!", "पूरा कार्ड!") : `${completedLines.length} ${t("line", "लाइन")}${completedLines.length > 1 ? "s" : ""}!`}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {bingoCard.squares.map((sq, i) => {
          const isDone = done.includes(i);
          const inLine = completedLines.some((line) => line.includes(i));
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              title={sq}
              className={`aspect-square rounded-lg border p-1 text-[7px] font-medium leading-tight transition ${
                inLine
                  ? "border-positive bg-positive text-white"
                  : isDone
                    ? "border-primary bg-primary text-white"
                    : "border-cardline bg-white text-muted"
              }`}
            >
              {isDone ? "✓" : sq.split(" ").slice(0, 3).join(" ")}
            </button>
          );
        })}
      </div>

      <div className="card mt-3 p-3">
        <p className="text-xs font-semibold text-muted">
          {t("Tap a square after you do it. Current squares:", "करने के बाद वर्ग दबाएँ। इस माह के वर्ग:")}
        </p>
        <ol className="mt-1.5 grid grid-cols-1 gap-0.5 text-[11px] text-muted">
          {bingoCard.squares.map((sq, i) => (
            <li key={i} className={done.includes(i) ? "text-positive line-through" : ""}>
              {i + 1}. {sq}
            </li>
          ))}
        </ol>
      </div>
      {completedLines.length > 0 && (
        <p className="mt-3 text-center text-xs font-semibold text-positive">
          🧭 {t('"Satna Explorer" badge earned — share your board!', '"सतना खोजी" बैज मिला — अपना बोर्ड साझा करें!')}
        </p>
      )}
    </div>
  );
}
