"use client";

import { useLang } from "./LangProvider";

export default function TopBar() {
  const { lang, toggle } = useLang();

  return (
    <header className="sticky top-0 z-40 border-b border-cardline bg-canvas/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <span className="font-heading text-2xl font-semibold text-primary">
            Satna
          </span>
          <span className="ml-2 hidden text-xs text-muted sm:inline">
            अपना शहर, अपनी पहचान
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-primary-50"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
          </button>
          <button
            aria-label="Notifications"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-primary-50"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9" /><path d="M10 19.5a2.2 2.2 0 0 0 4 0" />
            </svg>
          </button>
          <button
            onClick={toggle}
            aria-label="Toggle language"
            className="flex h-9 min-w-[44px] items-center justify-center rounded-full border border-cardline bg-white px-2 text-xs font-semibold text-ink"
          >
            {lang === "en" ? "हिं" : "EN"}
          </button>
        </div>
      </div>
    </header>
  );
}
