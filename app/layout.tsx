import type { Metadata, Viewport } from "next";
import { Poppins, Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { LangProvider } from "@/components/LangProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-devanagari",
});

export const metadata: Metadata = {
  title: "Satna — अपना शहर, अपनी पहचान",
  description:
    "The city app for Satna, Madhya Pradesh — places, food, transport, community and more.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#4C6A92",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi">
      <body
        className={`${poppins.variable} ${inter.variable} ${devanagari.variable} antialiased`}
      >
        <LangProvider>
          <div className="mx-auto min-h-dvh max-w-lg pb-24">{children}</div>
          <BottomNav />
        </LangProvider>
      </body>
    </html>
  );
}
