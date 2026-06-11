"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useT } from "./LangProvider";

/** Email + password sign-in / sign-up (works instantly, no email delivery
 *  needed), with magic-link as a secondary option. */
export default function AuthForm() {
  const t = useT();
  const sb = getSupabase();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);

  if (!sb) return null;

  const submit = async () => {
    setErr(null);
    setBusy(true);
    const creds = { email: email.trim(), password };
    const { error } =
      mode === "signup"
        ? await sb.auth.signUp(creds)
        : await sb.auth.signInWithPassword(creds);
    setBusy(false);
    if (error) {
      // friendlier message for the common case
      if (error.message.includes("Invalid login credentials")) {
        setErr(
          t(
            "Wrong email or password — or use “Create account” if you're new.",
            "ईमेल या पासवर्ड गलत है — नए हैं तो “अकाउंट बनाएँ” चुनें।",
          ),
        );
      } else {
        setErr(error.message);
      }
    }
  };

  const sendMagicLink = async () => {
    setErr(null);
    const { error } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.href },
    });
    if (error) setErr(error.message);
    else setLinkSent(true);
  };

  const inputCls =
    "w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink";
  const valid = email.includes("@") && password.length >= 8;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("signin")}
          className={`pill flex-1 justify-center border ${
            mode === "signin"
              ? "border-primary bg-primary-50 text-primary-700"
              : "border-cardline bg-white text-muted"
          }`}
        >
          {t("Sign in", "साइन इन")}
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`pill flex-1 justify-center border ${
            mode === "signup"
              ? "border-primary bg-primary-50 text-primary-700"
              : "border-cardline bg-white text-muted"
          }`}
        >
          {t("Create account", "अकाउंट बनाएँ")}
        </button>
      </div>
      <input
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("you@email.com", "aapka@email.com")}
        className={inputCls}
      />
      <input
        type="password"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t("Password (min 8 characters)", "पासवर्ड (कम से कम 8 अक्षर)")}
        className={inputCls}
      />
      <button
        onClick={submit}
        disabled={!valid || busy}
        className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-40"
      >
        {busy
          ? "…"
          : mode === "signup"
            ? t("Create account & sign in", "अकाउंट बनाएँ व साइन इन करें")
            : t("Sign in", "साइन इन करें")}
      </button>
      {err && <p className="text-xs text-danger">{err}</p>}
      {linkSent ? (
        <p className="rounded-lg bg-positive-50 px-3 py-2 text-xs font-medium text-positive">
          ✓ {t("Magic link sent — check your email.", "मैजिक लिंक भेजा गया — ईमेल देखें।")}
        </p>
      ) : (
        <button
          onClick={sendMagicLink}
          disabled={!email.includes("@")}
          className="w-full text-center text-xs font-medium text-muted underline underline-offset-2 disabled:opacity-40"
        >
          {t("or email me a sign-in link instead", "या ईमेल से साइन-इन लिंक भेजें")}
        </button>
      )}
    </div>
  );
}
