import TopBar from "@/components/TopBar";

const stats = [
  { label: "District population", value: "~22.8 lakh" },
  { label: "City elevation", value: "317 m" },
  { label: "Famous for", value: "Cement, Bharhut, Maihar" },
  { label: "Region", value: "Baghelkhand, Vindhya plateau" },
];

export default function AboutPage() {
  return (
    <main>
      <TopBar />
      <div className="px-4 pt-4">
        <h1 className="font-heading text-xl font-semibold text-ink">About Satna</h1>
        <p className="text-sm text-muted">सतना के बारे में</p>

        <div className="card mt-4 grid grid-cols-2 divide-x divide-cardline">
          {stats.map((s, i) => (
            <div key={s.label} className={`p-3 ${i > 1 ? "border-t border-cardline" : ""}`}>
              <p className="text-sm font-semibold text-ink">{s.value}</p>
              <p className="text-[10px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="card mt-3 space-y-3 p-4 text-sm leading-relaxed text-ink">
          <p>
            Satna sits on the Vindhya plateau in the heart of Baghelkhand, named
            after the Sutna river. For most of India it is the cement capital —
            limestone country feeding some of the nation&apos;s largest plants.
          </p>
          <p>
            For history, it is Bharhut: the 2nd-century BCE stupa whose carved
            railings are among the earliest Buddhist art anywhere. For faith, it
            is the gateway to Maihar&apos;s Sharda Devi shrine and the sacred
            town of Chitrakoot.
          </p>
          <p>
            And for music lovers, the Maihar gharana of Baba Allauddin Khan —
            teacher of Pt. Ravi Shankar and Ustad Ali Akbar Khan — began in this
            district.
          </p>
          <p className="font-medium text-primary">
            अपना शहर, अपनी पहचान — this app is built by and for the people of
            Satna.
          </p>
        </div>
      </div>
    </main>
  );
}
