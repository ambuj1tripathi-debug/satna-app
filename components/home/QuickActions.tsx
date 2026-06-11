"use client";

import Link from "next/link";
import { useT } from "../LangProvider";

const actions = [
  { en: "Temples & Ghats", hi: "मंदिर व घाट", emoji: "🛕", href: "/discover?tab=places&filter=religious" },
  { en: "Restaurants", hi: "रेस्टोरेंट", emoji: "🍽️", href: "/discover?tab=restaurants" },
  { en: "Transport", hi: "परिवहन", emoji: "🚌", href: "/discover?tab=transport" },
  { en: "Emergency", hi: "आपातकाल", emoji: "🆘", href: "/more/emergency" },
  { en: "Govt Services", hi: "सरकारी सेवाएँ", emoji: "🏛️", href: "/discover?tab=govt" },
  { en: "Events", hi: "कार्यक्रम", emoji: "🎉", href: "/events" },
  { en: "Heritage Trail", hi: "धरोहर ट्रेल", emoji: "🪷", href: "/discover?tab=trails" },
  { en: "Community Board", hi: "समुदाय बोर्ड", emoji: "💬", href: "/community" },
  { en: "Dine Together", hi: "साथ खाएँ", emoji: "🤝", href: "/discover?tab=dine" },
  { en: "Share a Cab", hi: "कैब शेयर", emoji: "🚖", href: "/discover?tab=cab" },
];

export default function QuickActions() {
  const t = useT();
  return (
    <section aria-label="Quick actions" className="mt-5 px-4">
      <div className="grid grid-cols-5 gap-x-2 gap-y-4">
        {actions.map((a) => (
          <Link key={a.en} href={a.href} className="flex flex-col items-center gap-1.5">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cardline bg-white text-xl shadow-card">
              {a.emoji}
            </span>
            <span className="text-center text-[10px] font-medium leading-tight text-ink">
              {t(a.en, a.hi)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
