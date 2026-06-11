import type { PriceRange, Restaurant } from "./types";

export function priceSymbol(p: PriceRange): string {
  return p === "budget" ? "₹" : p === "mid" ? "₹₹" : "₹₹₹";
}

/** Open-now check in IST, handles past-midnight closing (e.g. 11:00–01:00). */
export function isOpenNow(r: Restaurant, now = new Date()): boolean {
  if (!r.open_time || !r.close_time) return true;
  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );
  const mins = ist.getHours() * 60 + ist.getMinutes();
  const [oh, om] = r.open_time.split(":").map(Number);
  const [ch, cm] = r.close_time.split(":").map(Number);
  const open = oh * 60 + om;
  const close = ch * 60 + cm;
  if (close < open) return mins >= open || mins < close; // crosses midnight
  return mins >= open && mins < close;
}

export function formatTime12(t: string | null): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const am = h < 12;
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${am ? "AM" : "PM"}`;
}

export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
}
