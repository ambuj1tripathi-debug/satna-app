"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import Feed from "@/components/community/Feed";
import Forums from "@/components/community/Forums";
import Alerts from "@/components/community/Alerts";
import Polls from "@/components/community/Polls";
import LostFound from "@/components/community/LostFound";
import Memories from "@/components/community/Memories";
import { useT } from "@/components/LangProvider";

const subTabs = [
  { key: "feed", en: "Feed", hi: "फ़ीड" },
  { key: "forums", en: "Forums", hi: "मंच" },
  { key: "alerts", en: "Alerts", hi: "अलर्ट" },
  { key: "polls", en: "Polls", hi: "मतदान" },
  { key: "lostfound", en: "Lost & Found", hi: "खोया-पाया" },
  { key: "memories", en: "Memories", hi: "यादें" },
];

export default function CommunityPage() {
  const t = useT();
  const [tab, setTab] = useState("feed");

  return (
    <main>
      <TopBar />
      <div className="no-scrollbar sticky top-[61px] z-30 flex gap-2 overflow-x-auto border-b border-cardline bg-canvas px-4 py-2.5">
        {subTabs.map((s) => (
          <button
            key={s.key}
            onClick={() => setTab(s.key)}
            className={`pill shrink-0 ${
              tab === s.key
                ? "bg-primary font-semibold text-white"
                : "border border-cardline bg-white text-muted"
            }`}
          >
            {t(s.en, s.hi)}
          </button>
        ))}
      </div>

      {tab === "feed" && <Feed />}
      {tab === "forums" && <Forums />}
      {tab === "alerts" && <Alerts />}
      {tab === "polls" && <Polls />}
      {tab === "lostfound" && <LostFound />}
      {tab === "memories" && <Memories />}

      <div className="h-6" />
    </main>
  );
}
