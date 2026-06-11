"use client";

import { useState } from "react";
import { usePersistentState } from "@/lib/store";
import { seedMemories } from "@/lib/seed-community";

// Demo admin panel. Real role-based access (Super Admin / Moderator /
// Local Contributor) is enforced by Supabase RLS once auth is connected —
// see profiles.role and current_role_at_least() in the schema.
export default function AdminPage() {
  const [unlocked, setUnlocked] = usePersistentState("admin-unlocked", false);
  const [pw, setPw] = useState("");
  const [trivia] = usePersistentState<{ q: string }[]>("trivia-submissions", []);
  const [feedback] = usePersistentState<{ type: string; body: string }[]>("feedback-sent", []);

  if (!unlocked) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6">
        <div className="card w-full max-w-sm p-6">
          <h1 className="font-heading text-lg font-semibold text-ink">Satna Admin</h1>
          <p className="mt-1 text-xs text-muted">
            Demo gate — enter <code className="rounded bg-canvas px-1">satna-admin</code>.
            Real login (email + password + OTP) ships with Supabase auth.
          </p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className="mt-3 w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm"
          />
          <button
            onClick={() => pw === "satna-admin" && setUnlocked(true)}
            className="mt-3 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white"
          >
            Sign in
          </button>
        </div>
      </main>
    );
  }

  const pendingMemories = seedMemories.length ? 2 : 0; // demo queue
  const widgets = [
    { label: "Pending edits", value: 3, hint: "places & restaurants" },
    { label: "Trivia to review", value: trivia.length, hint: "user-submitted questions" },
    { label: "Memories queue", value: pendingMemories, hint: "photos awaiting approval" },
    { label: "Feedback received", value: feedback.length, hint: "suggestions & bugs" },
    { label: "Active alerts", value: 2, hint: "1 civic · 1 disruption" },
    { label: "New users (7d)", value: 48, hint: "demo metric" },
  ];

  const modules = [
    "Content Management", "Moderation Queue", "Events Manager", "Alerts Manager",
    "Polls Manager", "Quiz Manager", "User Management", "Dine & Cab Manager",
    "Memories Manager", "Bingo Manager", "Analytics",
  ];

  return (
    <main className="px-4 pb-10 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold text-ink">Admin Dashboard</h1>
          <p className="text-xs text-muted">Super Admin · demo mode</p>
        </div>
        <button
          onClick={() => setUnlocked(false)}
          className="rounded-full border border-cardline px-3 py-1.5 text-xs text-muted"
        >
          Sign out
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {widgets.map((w) => (
          <div key={w.label} className="card p-3.5">
            <p className="font-heading text-2xl font-semibold text-primary">{w.value}</p>
            <p className="text-xs font-medium text-ink">{w.label}</p>
            <p className="text-[10px] text-muted">{w.hint}</p>
          </div>
        ))}
      </div>

      {trivia.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-muted">TRIVIA REVIEW QUEUE</p>
          <div className="mt-2 space-y-2">
            {trivia.map((s, i) => (
              <div key={i} className="card flex items-center justify-between gap-2 p-3">
                <p className="min-w-0 flex-1 truncate text-sm text-ink">{s.q}</p>
                <div className="flex shrink-0 gap-1.5">
                  <button className="rounded-full bg-positive px-3 py-1 text-xs font-semibold text-white">✓</button>
                  <button className="rounded-full bg-danger px-3 py-1 text-xs font-semibold text-white">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs font-semibold text-muted">MODULES</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {modules.map((m) => (
            <div key={m} className="card p-3 text-sm font-medium text-ink opacity-70">
              {m}
              <p className="text-[10px] font-normal text-muted">connects with Supabase</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
