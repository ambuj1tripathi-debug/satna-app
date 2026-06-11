"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import { usePersistentState } from "@/lib/store";
import { useAuth, dbInsert } from "@/lib/auth";
import { useT } from "@/components/LangProvider";

export default function FeedbackPage() {
  const t = useT();
  const [sent, setSent] = usePersistentState<{ type: string; body: string }[]>(
    "feedback-sent",
    [],
  );
  const [type, setType] = useState<"feedback" | "bug">("feedback");
  const [body, setBody] = useState("");
  const [done, setDone] = useState(false);

  const { user } = useAuth();

  const submit = () => {
    if (!body.trim()) return;
    setSent([{ type, body: body.trim() }, ...sent]);
    // feedback table accepts anonymous rows too
    void dbInsert("feedback", { user_id: user?.id ?? null, type, body: body.trim() });
    setBody("");
    setDone(true);
  };

  return (
    <main>
      <TopBar />
      <div className="px-4 pt-4">
        <h1 className="font-heading text-xl font-semibold text-ink">
          {t("Feedback & Bug Report", "फीडबैक व बग रिपोर्ट")}
        </h1>
        <div className="card mt-4 space-y-3 p-4">
          <div className="flex gap-2">
            {(["feedback", "bug"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setType(k)}
                className={`pill flex-1 justify-center border ${
                  type === k
                    ? "border-primary bg-primary-50 text-primary-700"
                    : "border-cardline bg-white text-muted"
                }`}
              >
                {k === "feedback" ? t("💡 Suggestion", "💡 सुझाव") : t("🐞 Bug", "🐞 बग")}
              </button>
            ))}
          </div>
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              setDone(false);
            }}
            rows={4}
            placeholder={t(
              "Tell us what to improve…",
              "बताएँ क्या बेहतर करें…",
            )}
            className="w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink"
          />
          <button
            onClick={submit}
            disabled={!body.trim()}
            className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            {t("Send", "भेजें")}
          </button>
          {done && (
            <p className="text-center text-xs font-medium text-positive">
              ✓ {t("Dhanyavaad! Your note is saved.", "धन्यवाद! आपका संदेश सहेजा गया।")}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
