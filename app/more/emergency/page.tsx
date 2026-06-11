import TopBar from "@/components/TopBar";

const contacts = [
  { en: "Police Control Room", hi: "पुलिस कंट्रोल रूम", phone: "100", dot: "#2B5AA7" },
  { en: "Fire Brigade", hi: "दमकल", phone: "101", dot: "#D63B2F" },
  { en: "Ambulance", hi: "एम्बुलेंस", phone: "102", dot: "#1E6B3C" },
  { en: "District Hospital Satna", hi: "जिला अस्पताल", phone: "07672-223333", dot: "#1E6B3C" },
  { en: "Women Helpline", hi: "महिला हेल्पलाइन", phone: "1091", dot: "#C4922A" },
  { en: "Child Helpline", hi: "चाइल्ड हेल्पलाइन", phone: "1098", dot: "#C4922A" },
  { en: "Satna Nagar Nigam", hi: "नगर निगम", phone: "07672-222301", dot: "#6B6460" },
  { en: "MPEZ Electricity Complaint", hi: "बिजली शिकायत", phone: "1912", dot: "#6B6460" },
  { en: "Water Supply Complaint", hi: "जल आपूर्ति शिकायत", phone: "07672-222555", dot: "#6B6460" },
  { en: "Anti-Corruption Helpline", hi: "भ्रष्टाचार विरोधी हेल्पलाइन", phone: "1064", dot: "#C4922A" },
];

export default function EmergencyPage() {
  return (
    <main>
      <TopBar />
      <div className="bg-danger/5 px-4 pb-6 pt-4">
        <h1 className="font-heading text-xl font-semibold text-danger">
          Emergency Contacts
        </h1>
        <p className="text-sm text-muted">आपातकालीन संपर्क — tap to call</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {contacts.map((c) => (
            <a
              key={c.en}
              href={`tel:${c.phone}`}
              className="card flex min-h-[100px] flex-col justify-between border-danger/20 p-3"
            >
              <div className="flex items-start gap-1.5">
                <span
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: c.dot }}
                />
                <div>
                  <p className="text-sm font-semibold leading-tight text-ink">{c.en}</p>
                  <p className="text-xs text-muted">{c.hi}</p>
                </div>
              </div>
              <p className="font-heading text-lg font-semibold text-danger">
                {c.phone}
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
