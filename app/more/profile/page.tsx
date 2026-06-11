"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import { usePersistentState } from "@/lib/store";
import { initialStats } from "@/components/play/Quiz";
import { useT } from "@/components/LangProvider";

interface Profile {
  name: string;
  neighborhood: string;
  persona: "resident" | "visitor" | "pilgrim";
}

const personas = [
  { key: "resident", en: "Resident", hi: "निवासी", emoji: "🏠" },
  { key: "visitor", en: "Visitor", hi: "आगंतुक", emoji: "🧳" },
  { key: "pilgrim", en: "Pilgrim", hi: "तीर्थयात्री", emoji: "🛕" },
] as const;

export default function ProfilePage() {
  const t = useT();
  const [profile, setProfile] = usePersistentState<Profile | null>("profile", null);
  const [stats] = usePersistentState("player-stats", initialStats);
  const [bingoDone] = usePersistentState<number[]>("bingo-done", []);
  const [editing, setEditing] = useState(false);

  const badges: string[] = [];
  if (stats.correctTotal >= 50) badges.push("🎓 Satna Scholar");
  if (bingoDone.length >= 5) badges.push("🧭 Satna Explorer");
  if (stats.streak >= 7) badges.push("🔥 7-day streak");

  if (!profile || editing) {
    return (
      <main>
        <TopBar />
        <ProfileForm
          initial={profile}
          onSave={(p) => {
            setProfile(p);
            setEditing(false);
          }}
        />
      </main>
    );
  }

  return (
    <main>
      <TopBar />
      <div className="px-4 pt-4">
        <div className="card flex items-center gap-4 p-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 font-heading text-2xl font-semibold text-primary">
            {profile.name[0]?.toUpperCase()}
          </span>
          <div className="flex-1">
            <h1 className="font-heading text-lg font-semibold text-ink">{profile.name}</h1>
            <p className="text-xs text-muted">
              {profile.neighborhood} ·{" "}
              {t(
                personas.find((p) => p.key === profile.persona)?.en ?? "",
                personas.find((p) => p.key === profile.persona)?.hi,
              )}
            </p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="rounded-full border border-cardline px-3 py-1.5 text-xs font-medium text-muted"
          >
            {t("Edit", "बदलें")}
          </button>
        </div>

        <div className="card mt-3 grid grid-cols-3 divide-x divide-cardline">
          <div className="p-3 text-center">
            <p className="font-heading text-lg font-semibold text-primary">{stats.xp}</p>
            <p className="text-[10px] text-muted">{t("Quiz XP", "क्विज़ XP")}</p>
          </div>
          <div className="p-3 text-center">
            <p className="font-heading text-lg font-semibold text-primary">
              {stats.streak}
            </p>
            <p className="text-[10px] text-muted">{t("Day streak", "दिन की लय")}</p>
          </div>
          <div className="p-3 text-center">
            <p className="font-heading text-lg font-semibold text-primary">
              {bingoDone.length}
            </p>
            <p className="text-[10px] text-muted">{t("Bingo squares", "बिंगो वर्ग")}</p>
          </div>
        </div>

        <p className="mt-4 text-xs font-semibold text-muted">
          {t("Badges", "बैज")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {badges.length > 0 ? (
            badges.map((b) => (
              <span key={b} className="pill bg-primary-50 text-primary-700">
                {b}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted">
              {t(
                "No badges yet — play quiz and bingo to earn them!",
                "अभी कोई बैज नहीं — क्विज़ और बिंगो खेलें!",
              )}
            </p>
          )}
        </div>

        <p className="mt-5 rounded-card border border-dashed border-cardline p-3 text-center text-[11px] text-muted">
          {t(
            "Phone-OTP accounts arrive with the Supabase hookup — your local progress will carry over.",
            "फोन-OTP अकाउंट Supabase के साथ आएँगे — आपकी प्रगति सुरक्षित रहेगी।",
          )}
        </p>
      </div>
    </main>
  );
}

function ProfileForm({
  initial,
  onSave,
}: {
  initial: Profile | null;
  onSave: (p: Profile) => void;
}) {
  const t = useT();
  const [name, setName] = useState(initial?.name ?? "");
  const [neighborhood, setNeighborhood] = useState(initial?.neighborhood ?? "");
  const [persona, setPersona] = useState<Profile["persona"]>(initial?.persona ?? "resident");

  return (
    <div className="px-4 pt-4">
      <h1 className="font-heading text-xl font-semibold text-ink">
        {t("Welcome to Satna", "सतना में स्वागत है")} 👋
      </h1>
      <p className="mt-1 text-sm text-muted">
        {t("Set up your local profile — 30 seconds.", "अपनी प्रोफाइल बनाएँ — बस 30 सेकंड।")}
      </p>
      <div className="card mt-4 space-y-3 p-4">
        <label className="block text-xs font-medium text-muted">
          {t("First name", "पहला नाम")}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink"
          />
        </label>
        <label className="block text-xs font-medium text-muted">
          {t("Neighborhood / ward", "मोहल्ला / वार्ड")}
          <input
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="Civil Lines, Dhawari…"
            className="mt-1 w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink"
          />
        </label>
        <div className="text-xs font-medium text-muted">
          {t("What brings you here?", "आप यहाँ किस नाते हैं?")}
          <div className="mt-1.5 flex gap-2">
            {personas.map((p) => (
              <button
                key={p.key}
                onClick={() => setPersona(p.key)}
                className={`flex-1 rounded-xl border p-2.5 text-center ${
                  persona === p.key
                    ? "border-primary bg-primary-50"
                    : "border-cardline bg-white"
                }`}
              >
                <span className="text-lg">{p.emoji}</span>
                <p className="mt-0.5 text-[10px] font-medium text-ink">{t(p.en, p.hi)}</p>
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() =>
            name.trim() &&
            onSave({ name: name.trim(), neighborhood: neighborhood.trim() || "Satna", persona })
          }
          disabled={!name.trim()}
          className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          {t("Save profile", "प्रोफाइल सहेजें")}
        </button>
      </div>
    </div>
  );
}
