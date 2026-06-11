"use client";

import Link from "next/link";
import { useState } from "react";
import TopBar from "@/components/TopBar";
import { useLang, useT } from "@/components/LangProvider";

export default function MorePage() {
  const t = useT();
  const { lang, toggle } = useLang();
  const [shared, setShared] = useState(false);
  const [showContribute, setShowContribute] = useState(false);

  const share = async () => {
    const data = {
      title: "Satna — अपना शहर, अपनी पहचान",
      text: t(
        "Satna's own city app — places, food, transport, community.",
        "सतना का अपना सिटी ऐप — जगहें, खाना, परिवहन, समुदाय।",
      ),
      url: typeof window !== "undefined" ? window.location.origin : "",
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        setShared(true);
      }
    } catch {
      /* user cancelled */
    }
  };

  const rowCls = "card flex min-h-[56px] w-full items-center gap-3 px-4 text-left";

  return (
    <main>
      <TopBar />
      <div className="space-y-2.5 px-4 pt-4">
        <Link href="/more/emergency" className={rowCls + " border-danger/30"}>
          <span className="text-xl">🆘</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">{t("Emergency Contacts", "आपातकालीन संपर्क")}</p>
            <p className="text-xs text-muted">{t("One-tap call", "एक टैप में कॉल")}</p>
          </div>
        </Link>

        <Link href="/more/profile" className={rowCls}>
          <span className="text-xl">👤</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">{t("My Profile", "मेरी प्रोफाइल")}</p>
            <p className="text-xs text-muted">{t("Badges, XP, contributions", "बैज, XP, योगदान")}</p>
          </div>
        </Link>

        <Link href="/more/about" className={rowCls}>
          <span className="text-xl">🏙️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">{t("About Satna", "सतना के बारे में")}</p>
            <p className="text-xs text-muted">{t("City overview, stats, history", "शहर परिचय, आँकड़े, इतिहास")}</p>
          </div>
        </Link>

        {/* settings inline */}
        <div className={rowCls}>
          <span className="text-xl">⚙️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">{t("Language", "भाषा")}</p>
            <p className="text-xs text-muted">
              {t("Applies everywhere, saved on this device", "हर जगह लागू, इसी डिवाइस पर सहेजी गई")}
            </p>
          </div>
          <button
            onClick={toggle}
            className="rounded-full border border-primary px-4 py-1.5 text-xs font-semibold text-primary"
          >
            {lang === "en" ? "हिंदी में" : "English"}
          </button>
        </div>

        <button onClick={() => setShowContribute(!showContribute)} className={rowCls}>
          <span className="text-xl">✍️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">{t("Contribute", "योगदान करें")}</p>
            <p className="text-xs text-muted">{t("How to add or edit content", "सामग्री कैसे जोड़ें")}</p>
          </div>
        </button>
        {showContribute && (
          <div className="card space-y-1.5 p-4 text-sm text-muted">
            <p>• {t("Every place, restaurant and govt office has an “Update info” button — edits go to a moderation queue.", "हर जगह व दफ्तर पर “जानकारी सुधारें” बटन है — बदलाव समीक्षा के बाद लाइव होते हैं।")}</p>
            <p>• {t("Share old photos in Community → Memories.", "पुरानी तस्वीरें समुदाय → यादें में साझा करें।")}</p>
            <p>• {t("Write quiz questions in Play → Trivia Submit (+50 XP when approved).", "खेलें → प्रश्न भेजें में क्विज़ प्रश्न लिखें (+50 XP)।")}</p>
            <p>• {t("Trusted regulars get the Verified Contributor badge.", "भरोसेमंद योगदानकर्ताओं को सत्यापित बैज मिलता है।")}</p>
          </div>
        )}

        <Link href="/more/feedback" className={rowCls}>
          <span className="text-xl">🐞</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">{t("Feedback & Bug Report", "फीडबैक व बग")}</p>
            <p className="text-xs text-muted">{t("Kuch gadbad? Batayiye.", "कुछ गड़बड़? बताइए।")}</p>
          </div>
        </Link>

        <button onClick={share} className={rowCls}>
          <span className="text-xl">📲</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">{t("Share the app", "ऐप शेयर करें")}</p>
            <p className="text-xs text-muted">
              {shared ? t("Link copied ✓", "लिंक कॉपी हुआ ✓") : t("WhatsApp, anywhere", "व्हाट्सऐप, कहीं भी")}
            </p>
          </div>
        </button>
      </div>
      <p className="mt-6 text-center text-[10px] text-muted">
        Satna v1.0 · {t("Made with", "बनाया गया")} ❤️ {t("for Baghelkhand", "बघेलखंड के लिए")}
      </p>
    </main>
  );
}
