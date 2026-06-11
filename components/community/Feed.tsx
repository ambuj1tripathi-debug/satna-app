"use client";

import { useMemo, useState } from "react";
import type { CommunityPost } from "@/lib/types";
import { seedPosts, postCategories } from "@/lib/seed-community";
import { usePersistentState } from "@/lib/store";
import { useT } from "../LangProvider";

const typeLabels: Record<string, { emoji: string; en: string; hi: string }> = {
  question: { emoji: "❓", en: "Question", hi: "सवाल" },
  tip: { emoji: "💡", en: "Tip", hi: "सुझाव" },
  photo: { emoji: "📷", en: "Photo", hi: "फोटो" },
  issue: { emoji: "⚠️", en: "Issue", hi: "समस्या" },
  appreciation: { emoji: "👏", en: "Appreciation", hi: "सराहना" },
};

function timeAgo(iso: string, t: (en: string, hi?: string | null) => string) {
  const hrs = Math.round((Date.now() - new Date(iso).getTime()) / 3600_000);
  if (hrs < 1) return t("just now", "अभी");
  if (hrs < 24) return `${hrs} ${t("hrs ago", "घंटे पहले")}`;
  return `${Math.round(hrs / 24)} ${t("days ago", "दिन पहले")}`;
}

export default function Feed() {
  const t = useT();
  const [category, setCategory] = useState("all");
  const [posts, setPosts] = usePersistentState<CommunityPost[]>("feed-posts", seedPosts);
  const [liked, setLiked] = usePersistentState<string[]>("feed-liked", []);
  const [showCompose, setShowCompose] = useState(false);

  const filtered = useMemo(
    () => (category === "all" ? posts : posts.filter((p) => p.category === category)),
    [posts, category],
  );

  const toggleLike = (id: string) => {
    const isLiked = liked.includes(id);
    setLiked(isLiked ? liked.filter((x) => x !== id) : [...liked, id]);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, like_count: p.like_count + (isLiked ? -1 : 1) } : p,
      ),
    );
  };

  return (
    <div className="px-4">
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {postCategories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`pill shrink-0 border ${
              category === c.key
                ? "border-primary bg-primary-50 text-primary-700"
                : "border-cardline bg-white text-muted"
            }`}
          >
            {t(c.en, c.hi)}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {filtered.map((p) => {
          const type = typeLabels[p.type];
          return (
            <article key={p.id} className="card p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary">
                  {p.is_anonymous ? "🙈" : p.author[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{p.author}</p>
                  <p className="text-[11px] text-muted">
                    {p.neighborhood} · {timeAgo(p.created_at, t)}
                  </p>
                </div>
                <span className="pill shrink-0 bg-canvas text-muted">
                  {type.emoji} {t(type.en, type.hi)}
                </span>
              </div>
              <h3 className="mt-2.5 text-sm font-semibold text-ink">{p.title}</h3>
              <p className="mt-1 text-sm text-muted">{p.body}</p>
              <div className="mt-3 flex items-center gap-4 border-t border-cardline pt-2.5 text-xs font-medium text-muted">
                <button
                  onClick={() => toggleLike(p.id)}
                  className={`flex min-h-[32px] items-center gap-1 ${liked.includes(p.id) ? "text-primary" : ""}`}
                >
                  {liked.includes(p.id) ? "❤️" : "🤍"} {p.like_count}
                </button>
                <span className="flex items-center gap-1">💬 {p.comment_count}</span>
                <span className="ml-auto">{t("Share", "शेयर")} ↗</span>
              </div>
            </article>
          );
        })}
      </div>

      {showCompose ? (
        <ComposeForm
          onCancel={() => setShowCompose(false)}
          onCreate={(post) => {
            setPosts([post, ...posts]);
            setShowCompose(false);
          }}
        />
      ) : (
        <button
          onClick={() => setShowCompose(true)}
          aria-label={t("New post", "नई पोस्ट")}
          className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-white shadow-lg"
        >
          +
        </button>
      )}
    </div>
  );
}

function ComposeForm({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (p: CommunityPost) => void;
}) {
  const t = useT();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [anonymous, setAnonymous] = useState(false);

  const submit = () => {
    if (!title.trim()) return;
    onCreate({
      id: `po-${Date.now()}`,
      type: "question",
      category,
      title: title.trim(),
      body: body.trim(),
      author: anonymous ? t("Satna Resident", "सतना निवासी") : t("You", "आप"),
      neighborhood: "Satna",
      is_anonymous: anonymous,
      like_count: 0,
      comment_count: 0,
      created_at: new Date().toISOString(),
    });
  };

  const inputCls =
    "mt-1 w-full rounded-lg border border-cardline bg-white px-3 py-2.5 text-sm text-ink";

  return (
    <div className="card mt-4 space-y-3 p-4">
      <p className="font-heading text-base font-semibold text-ink">
        {t("New post", "नई पोस्ट")}
      </p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("Title", "शीर्षक")}
        className={inputCls}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder={t("What's happening in your area?", "आपके इलाके में क्या चल रहा है?")}
        className={inputCls}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={inputCls}
      >
        {postCategories
          .filter((c) => c.key !== "all")
          .map((c) => (
            <option key={c.key} value={c.key}>
              {t(c.en, c.hi)}
            </option>
          ))}
      </select>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        {t('Post anonymously (shows "Satna Resident")', 'गुमनाम पोस्ट ("सतना निवासी" दिखेगा)')}
      </label>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 rounded-full border border-cardline py-2.5 text-sm font-medium text-muted"
        >
          {t("Cancel", "रद्द करें")}
        </button>
        <button
          onClick={submit}
          disabled={!title.trim()}
          className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          {t("Post", "पोस्ट करें")}
        </button>
      </div>
    </div>
  );
}
