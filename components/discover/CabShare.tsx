"use client";

import { useEffect, useMemo, useState } from "react";
import type { CabRide } from "@/lib/types";
import { seedCabRides, cabRoutes } from "@/lib/seed-social";
import { usePersistentState } from "@/lib/store";
import { useT } from "../LangProvider";

function rideTime(iso: string, t: (en: string, hi?: string | null) => string) {
  const d = new Date(iso);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return `${t("Today", "आज")} ${time}`;
  if (d.toDateString() === tomorrow.toDateString()) return `${t("Tomorrow", "कल")} ${time}`;
  return `${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} ${time}`;
}

export default function CabShare() {
  const t = useT();
  const [route, setRoute] = useState("All routes");
  const [rides, setRides] = usePersistentState<CabRide[]>("cab-rides", seedCabRides);
  const [requested, setRequested] = usePersistentState<string[]>("cab-requested", []);
  const [showForm, setShowForm] = useState(false);
  const [showEtiquette, setShowEtiquette] = useState(false);

  // etiquette note on first use
  useEffect(() => {
    if (!localStorage.getItem("satna-cab-etiquette-seen")) setShowEtiquette(true);
  }, []);
  const dismissEtiquette = () => {
    localStorage.setItem("satna-cab-etiquette-seen", "1");
    setShowEtiquette(false);
  };

  const filtered = useMemo(() => {
    if (route === "All routes") return rides;
    if (route === "Other")
      return rides.filter(
        (r) => !["Rewa", "Jabalpur", "Prayagraj", "Bhopal"].includes(r.destination),
      );
    const dest = route.split("→")[1];
    return rides.filter((r) => r.destination === dest);
  }, [rides, route]);

  return (
    <div className="px-4">
      {showEtiquette && (
        <div className="card mt-3 border-positive/30 bg-positive-50/60 p-4">
          <p className="text-sm font-semibold text-positive">
            🚖 {t("Ride etiquette", "सफ़र के नियम")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink">
            {t(
              "Satna Cab Share is a cost-splitting tool, not a taxi service. Always confirm details directly with your travel companion. Stay safe — share rides only with people you're comfortable with.",
              "सतना कैब शेयर खर्च बाँटने का साधन है, टैक्सी सेवा नहीं। यात्रा साथी से सीधे विवरण पक्का करें। सुरक्षित रहें — सिर्फ उन्हीं के साथ सफ़र साझा करें जिनके साथ आप सहज हों।",
            )}
          </p>
          <button
            onClick={dismissEtiquette}
            className="mt-2 rounded-full bg-positive px-4 py-1.5 text-xs font-semibold text-white"
          >
            {t("Got it", "समझ गया")}
          </button>
        </div>
      )}

      {/* route filter */}
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {cabRoutes.map((r) => (
          <button
            key={r}
            onClick={() => setRoute(r)}
            className={`pill shrink-0 border ${
              route === r
                ? "border-positive bg-positive-50 text-positive"
                : "border-cardline bg-white text-muted"
            }`}
          >
            {r === "All routes" ? t("All routes", "सभी रूट") : r}
          </button>
        ))}
      </div>

      {/* ride cards */}
      <div className="mt-3 space-y-3">
        {filtered.map((r) => {
          const seatsLeft = r.total_seats - r.seats_taken;
          const perPerson = Math.round(r.total_fare / r.total_seats);
          const isRequested = requested.includes(r.id);
          return (
            <article key={r.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-ink">
                  {r.origin} → {r.destination}
                  {r.drop_point && (
                    <span className="font-normal text-muted"> — {t("dropping", "ड्रॉप")} {r.drop_point}</span>
                  )}
                </p>
                <span className="shrink-0 rounded-lg bg-positive-50 px-2 py-1 text-right">
                  <span className="block font-heading text-sm font-semibold text-positive">
                    ₹{perPerson}
                  </span>
                  <span className="block text-[9px] text-positive">
                    /{t("person", "व्यक्ति")}
                  </span>
                </span>
              </div>
              <p className="mt-2 text-sm text-ink">🕐 {rideTime(r.departs_at, t)}</p>
              <p className="mt-0.5 text-xs text-muted">
                {seatsLeft} {t(seatsLeft === 1 ? "seat left" : "seats left", "सीट बाकी")} ·{" "}
                {t("Posted by", "पोस्ट किया")} {r.poster_name} ·{" "}
                {t("member since", "सदस्य")} {r.member_since}
              </p>
              {r.note && (
                <p className="mt-2 rounded-lg bg-canvas px-3 py-2 text-xs italic text-muted">
                  “{r.note}”
                </p>
              )}
              <button
                onClick={() => {
                  if (!isRequested && seatsLeft > 0)
                    setRequested([...requested, r.id]);
                }}
                disabled={isRequested || seatsLeft === 0}
                className={`mt-3 w-full rounded-full py-2.5 text-sm font-semibold ${
                  isRequested
                    ? "bg-positive-50 text-positive"
                    : seatsLeft === 0
                      ? "bg-canvas text-muted"
                      : "bg-positive text-white"
                }`}
              >
                {isRequested
                  ? t("Requested ✓ — numbers shared after confirm", "अनुरोध भेजा ✓ — कन्फर्म पर नंबर साझा होंगे")
                  : seatsLeft === 0
                    ? t("Full", "फुल")
                    : t("Request to join", "जुड़ने का अनुरोध")}
              </button>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <div className="card p-8 text-center text-sm text-muted">
            {t(
              "No rides posted yet for this route — post yours and split the cost with someone headed the same way",
              "इस रूट पर अभी कोई राइड नहीं — अपनी पोस्ट करें और उसी दिशा में जाने वाले के साथ खर्च बाँटें",
            )}
          </div>
        )}
      </div>

      {/* post a ride */}
      {showForm ? (
        <PostRideForm
          onCancel={() => setShowForm(false)}
          onCreate={(ride) => {
            setRides([ride, ...rides]);
            setShowForm(false);
          }}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full rounded-full border-2 border-dashed border-positive/50 py-3 text-sm font-semibold text-positive"
        >
          + {t("Post a ride", "राइड पोस्ट करें")}
        </button>
      )}
    </div>
  );
}

function PostRideForm({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (r: CabRide) => void;
}) {
  const t = useT();
  const [destination, setDestination] = useState("Rewa");
  const [otherDest, setOtherDest] = useState("");
  const [when, setWhen] = useState("");
  const [fare, setFare] = useState("");
  const [seats, setSeats] = useState(3);
  const [dropPoint, setDropPoint] = useState("");
  const [note, setNote] = useState("");

  const dest = destination === "Other" ? otherDest : destination;
  const fareNum = Number(fare);
  const perPerson = fareNum > 0 ? Math.round(fareNum / seats) : null;
  const valid = dest.trim() && when && fareNum > 0;

  const submit = () => {
    if (!valid) return;
    onCreate({
      id: `cr-${Date.now()}`,
      origin: "Satna",
      destination: dest.trim(),
      drop_point: dropPoint.trim() || null,
      departs_at: new Date(when).toISOString(),
      total_fare: fareNum,
      total_seats: seats,
      seats_taken: 0,
      poster_name: t("You", "आप"),
      member_since: "Jun 2026",
      note: note || undefined,
    });
  };

  const inputCls =
    "mt-1 w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink";

  return (
    <div className="card mt-4 space-y-3 p-4">
      <p className="font-heading text-base font-semibold text-ink">
        {t("Post a ride", "राइड पोस्ट करें")}
      </p>

      <label className="block text-xs font-medium text-muted">
        1. {t("From", "कहाँ से")}
        <input value="Satna" disabled className={`${inputCls} bg-canvas`} />
      </label>

      <label className="block text-xs font-medium text-muted">
        2. {t("To", "कहाँ तक")}
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className={inputCls}
        >
          {["Rewa", "Jabalpur", "Prayagraj", "Bhopal", "Other"].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </label>
      {destination === "Other" && (
        <input
          value={otherDest}
          onChange={(e) => setOtherDest(e.target.value)}
          placeholder={t("Destination city", "गंतव्य शहर")}
          className={inputCls}
        />
      )}

      <label className="block text-xs font-medium text-muted">
        3. {t("Departure date + time", "प्रस्थान तिथि व समय")}
        <input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          className={inputCls}
        />
      </label>

      <label className="block text-xs font-medium text-muted">
        4. {t("Total cab fare (₹)", "कुल किराया (₹)")}
        <input
          type="number"
          inputMode="numeric"
          value={fare}
          onChange={(e) => setFare(e.target.value)}
          placeholder="600"
          className={inputCls}
        />
      </label>

      <div className="text-xs font-medium text-muted">
        5. {t("Total seats to share", "कुल सीटें")}
        <div className="mt-1 flex gap-2">
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setSeats(n)}
              className={`h-11 w-11 rounded-xl border text-sm font-semibold ${
                seats === n
                  ? "border-positive bg-positive-50 text-positive"
                  : "border-cardline bg-white text-muted"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <label className="block text-xs font-medium text-muted">
        6. {t("Drop point", "ड्रॉप पॉइंट")}
        <input
          value={dropPoint}
          onChange={(e) => setDropPoint(e.target.value)}
          placeholder={t("Near collector office Rewa", "कलेक्टर ऑफिस रीवा के पास")}
          className={inputCls}
        />
      </label>

      <label className="block text-xs font-medium text-muted">
        {t("Optional note", "वैकल्पिक नोट")}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder={t(
            "Cab booked, leaving from Satna Junction area",
            "कैब बुक है, सतना जंक्शन से निकलेंगे",
          )}
          className={inputCls}
        />
      </label>

      {perPerson && (
        <p className="rounded-lg bg-positive-50 px-3 py-2 text-center text-sm font-semibold text-positive">
          {t("Cost per person", "प्रति व्यक्ति खर्च")}: ₹{perPerson}
          <span className="font-normal"> (₹{fareNum} ÷ {seats})</span>
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 rounded-full border border-cardline py-2.5 text-sm font-medium text-muted"
        >
          {t("Cancel", "रद्द करें")}
        </button>
        <button
          onClick={submit}
          disabled={!valid}
          className="flex-1 rounded-full bg-positive py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          {t("Post ride", "राइड पोस्ट करें")}
        </button>
      </div>
    </div>
  );
}
