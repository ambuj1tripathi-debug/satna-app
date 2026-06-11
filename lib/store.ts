"use client";

import { useEffect, useRef, useState } from "react";

// One-time migration: earlier builds cached bundled demo content in
// localStorage. Purge those keys so removed placeholders don't linger on
// devices that visited before the cleanup. Runs at module load, before any
// component reads state.
const DATA_VERSION = "2";
if (typeof window !== "undefined") {
  try {
    if (localStorage.getItem("satna:data-version") !== DATA_VERSION) {
      ["feed-posts", "feed-liked", "dine-plans", "cab-rides", "memories", "polls"].forEach(
        (k) => localStorage.removeItem(`satna:${k}`),
      );
      localStorage.setItem("satna:data-version", DATA_VERSION);
    }
  } catch {
    // private mode — nothing cached anyway
  }
}

/** useState that persists to localStorage (client-only, SSR-safe).
 *  Used for all interactive state until Supabase auth lands — then these
 *  writes move to the database and this becomes the offline cache. */
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`satna:${key}`);
      if (raw != null) setValue(JSON.parse(raw));
    } catch {
      // corrupted entry — fall back to initial
    }
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(`satna:${key}`, JSON.stringify(value));
    } catch {
      // storage full / private mode — state stays in memory
    }
  }, [key, value]);

  return [value, setValue];
}
