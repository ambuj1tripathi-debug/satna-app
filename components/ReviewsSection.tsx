"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Review } from "@/lib/types";
import { useAuth, isUuid } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { Stars } from "./ui";
import { useT } from "./LangProvider";

export default function ReviewsSection({
  subjectId,
  initial,
}: {
  subjectId: string;
  initial: Review[];
}) {
  const t = useT();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initial);
  const [writing, setWriting] = useState(false);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !isUuid(subjectId)) return;
    sb.from("reviews")
      .select("*, profiles(username)")
      .eq("subject_type", "restaurant")
      .eq("subject_id", subjectId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data?.length) {
          setReviews(
            data.map((r) => ({
              ...r,
              username:
                (r.profiles as { username?: string })?.username ?? "Satna Resident",
            })) as Review[],
          );
        }
      });
  }, [subjectId]);

  const submit = async () => {
    const sb = getSupabase();
    if (!sb || !user || rating === 0) return;
    const { error } = await sb.from("reviews").insert({
      subject_type: "restaurant",
      subject_id: subjectId,
      user_id: user.id,
      rating,
      body: body.trim() || null,
    });
    if (!error) {
      setReviews([
        {
          id: `local-${Date.now()}`,
          subject_type: "restaurant",
          subject_id: subjectId,
          username: t("You", "आप"),
          rating,
          body: body.trim() || null,
          created_at: new Date().toISOString(),
        },
        ...reviews,
      ]);
      setWriting(false);
      setPosted(true);
      setRating(0);
      setBody("");
    }
  };

  return (
    <section className="px-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-ink">
          {t("Reviews", "समीक्षाएँ")}
        </h2>
        {!writing && (
          <button
            onClick={() => setWriting(true)}
            className="text-sm font-medium text-primary"
          >
            {t("Write a review", "समीक्षा लिखें")}
          </button>
        )}
      </div>

      {writing && (
        <div className="card mt-3 space-y-3 p-4">
          {user ? (
            <>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    aria-label={`${n} stars`}
                    className={`text-2xl ${n <= rating ? "" : "opacity-25 grayscale"}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder={t("How was the food?", "खाना कैसा था?")}
                className="w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setWriting(false)}
                  className="flex-1 rounded-full border border-cardline py-2.5 text-sm font-medium text-muted"
                >
                  {t("Cancel", "रद्द करें")}
                </button>
                <button
                  onClick={submit}
                  disabled={rating === 0}
                  className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  {t("Post review", "समीक्षा भेजें")}
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-muted">
              {t("Sign in to write a review →", "समीक्षा लिखने हेतु साइन इन करें →")}{" "}
              <Link href="/more/profile" className="font-semibold text-primary">
                {t("Profile", "प्रोफाइल")}
              </Link>
            </p>
          )}
        </div>
      )}
      {posted && (
        <p className="mt-2 text-xs font-medium text-positive">
          ✓ {t("Review posted — dhanyavaad!", "समीक्षा पोस्ट हुई — धन्यवाद!")}
        </p>
      )}

      <div className="mt-3 space-y-3">
        {reviews.slice(0, 5).map((v) => (
          <div key={v.id} className="card p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{v.username}</p>
              <Stars rating={v.rating} />
            </div>
            {v.body && <p className="mt-1.5 text-sm text-muted">{v.body}</p>}
          </div>
        ))}
        {reviews.length === 0 && !writing && (
          <p className="text-sm text-muted">
            {t(
              "No reviews yet — be the first to share your experience!",
              "अभी कोई समीक्षा नहीं — पहला अनुभव आप साझा करें!",
            )}
          </p>
        )}
      </div>
    </section>
  );
}
