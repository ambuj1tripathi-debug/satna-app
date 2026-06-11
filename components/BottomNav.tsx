"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "./LangProvider";

const tabs = [
  { href: "/", en: "Home", hi: "होम", icon: HomeIcon },
  { href: "/discover", en: "Discover", hi: "खोजें", icon: CompassIcon },
  { href: "/community", en: "Community", hi: "समुदाय", icon: UsersIcon },
  { href: "/play", en: "Play", hi: "खेलें", icon: GameIcon },
  { href: "/more", en: "More", hi: "और", icon: DotsIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  const t = useT();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-cardline bg-white">
      <div className="mx-auto flex max-w-lg items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex min-h-[56px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 py-1.5"
            >
              <span
                className={`flex items-center justify-center rounded-full px-4 py-1 transition-colors ${
                  active ? "bg-primary-50 text-primary" : "text-muted"
                }`}
              >
                <Icon />
              </span>
              <span
                className={`text-[11px] font-medium ${
                  active ? "text-primary" : "text-muted"
                }`}
              >
                {t(tab.en, tab.hi)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" />
    </svg>
  );
}
function CompassIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5" /><circle cx="17" cy="9" r="2.5" /><path d="M17.5 14.5c2.5.4 4 2.1 4 4.5" />
    </svg>
  );
}
function GameIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="7" width="19" height="11" rx="4" /><path d="M7.5 11v3M6 12.5h3" /><circle cx="16" cy="11.5" r="0.5" fill="currentColor" /><circle cx="18.5" cy="13.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
function DotsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
