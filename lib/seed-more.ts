// Seed content for Trails, Transport, Govt Services, and the Play tab.

export interface Trail {
  slug: string;
  name_en: string;
  name_hi: string;
  intro: string;
  duration: string;
  difficulty: "Easy" | "Easy-Moderate" | "Moderate";
  emoji: string;
  stops: { name: string; description: string }[];
}

export const seedTrails: Trail[] = [
  {
    slug: "bharhut-stupa-circuit",
    name_en: "Bharhut Stupa Circuit",
    name_hi: "भरहुत स्तूप परिक्रमा",
    intro:
      "Walk through 2,200 years of Buddhist history — from the excavation site where Alexander Cunningham found the stupa in 1873, to the museum galleries that hold the famous carved railings.",
    duration: "2 hrs",
    difficulty: "Easy",
    emoji: "🪷",
    stops: [
      { name: "Bharhut Excavation Site", description: "Where Alexander Cunningham discovered the stupa in 1873." },
      { name: "Archaeological Museum Galleries", description: "Railing fragments, Yakshi carvings, Jataka panels." },
      { name: "Interpretation Centre", description: "Replica of the original gateway (torana)." },
    ],
  },
  {
    slug: "maihar-pilgrimage-walk",
    name_en: "Maihar Pilgrimage Walk",
    name_hi: "मैहर तीर्थ यात्रा",
    intro:
      "The classic pilgrim route — Alha-Udal akhada, the 1063 steps (or ropeway), Sharda Devi darshan, and Baba Allauddin Khan's musical legacy.",
    duration: "Half day",
    difficulty: "Easy-Moderate",
    emoji: "🛕",
    stops: [
      { name: "Alha-Udal Akhada", description: "Legendary warriors said to still worship Sharda Devi daily." },
      { name: "Ropeway Base / 1063 Steps", description: "Choose your ascent." },
      { name: "Sharda Devi Darshan", description: "The main shrine atop Trikuta hill." },
      { name: "Baba Allauddin Khan Samadhi", description: "Resting place of the founder of the Maihar gharana." },
    ],
  },
  {
    slug: "vindhya-nature-edge",
    name_en: "Vindhya Nature Edge",
    name_hi: "विंध्य प्रकृति किनारा",
    intro:
      "Forest edges and viewpoints of the Vindhya range around Satna — birdlife and sunset points.",
    duration: "3 hrs",
    difficulty: "Moderate",
    emoji: "🌄",
    stops: [
      { name: "Forest Watchtower", description: "Panoramic view of the Vindhya foothills." },
      { name: "Sunset Point", description: "Best photographed October–February." },
    ],
  },
];

export interface TransportRoute {
  name: string;
  destination: string;
  timing: string | null;
  frequency: string | null;
  extra: string | null;
}

export const seedTrains: TransportRoute[] = [
  { name: "Rewa Express", destination: "Delhi (via Katni)", timing: null, frequency: null, extra: "Check IRCTC for live timings" },
  { name: "Sarnath Express", destination: "Prayagraj / Varanasi", timing: null, frequency: null, extra: "Check IRCTC for live timings" },
  { name: "Mahanagari Express", destination: "Mumbai CSMT", timing: null, frequency: null, extra: "Check IRCTC for live timings" },
  { name: "Vindhyachal Express", destination: "Bhopal (via Katni)", timing: null, frequency: null, extra: "Check IRCTC for live timings" },
];

export const seedBuses: TransportRoute[] = [
  { name: "MP Roadways / Private", destination: "Rewa", timing: null, frequency: null, extra: "From Satna Bus Stand" },
  { name: "MP Roadways / Private", destination: "Jabalpur", timing: null, frequency: null, extra: "From Satna Bus Stand" },
  { name: "Private operators", destination: "Prayagraj", timing: null, frequency: null, extra: "From Satna Bus Stand" },
  { name: "Local shuttle", destination: "Maihar", timing: null, frequency: null, extra: "Frequent during Navratri" },
];

export const seedFares: { from: string; to: string; fare: string; verified: boolean }[] = [];

export const seedIntercity = [
  { to: "Rewa", km: 60, time: "1–1.5 hrs", options: "Bus, shared cab, train" },
  { to: "Jabalpur", km: 120, time: "2.5–3 hrs", options: "Train (best), bus" },
  { to: "Prayagraj", km: 130, time: "3–3.5 hrs", options: "Train, bus, shared cab" },
  { to: "Bhopal", km: 350, time: "7–8 hrs", options: "Overnight train recommended" },
];

export interface GovtService {
  dept_en: string;
  dept_hi: string;
  address: string;
  timings: string;
  phone: string | null;
  services: string;
}

export const seedGovtServices: GovtService[] = [
  { dept_en: "District Collectorate", dept_hi: "जिला कलेक्ट्रेट", address: "Collectorate Campus, Satna", timings: "Mon–Fri 10:30–17:30", phone: null, services: "Revenue matters, Jan Sunwai (Tue), certificates, RTI" },
  { dept_en: "Satna Municipal Corporation", dept_hi: "नगर निगम सतना", address: "City Office, Satna", timings: "Mon–Sat 10:30–17:30", phone: null, services: "Property tax, birth/death certificates, sanitation" },
  { dept_en: "SDM Office", dept_hi: "एसडीएम कार्यालय", address: "Collectorate Campus", timings: "Mon–Fri 10:30–17:30", phone: null, services: "Land records, magistrate matters" },
  { dept_en: "Civil Hospital Satna", dept_hi: "जिला चिकित्सालय", address: "Hospital Road, Satna", timings: "OPD 9–16 · Emergency 24x7", phone: null, services: "OPD, emergency, maternity, pathology" },
  { dept_en: "District Court", dept_hi: "जिला न्यायालय", address: "Court Campus, Satna", timings: "Mon–Sat 10:30–17:00", phone: null, services: "District judiciary, legal aid (DLSA)" },
  { dept_en: "Police HQ (SP Office)", dept_hi: "पुलिस अधीक्षक कार्यालय", address: "SP Office, Satna", timings: "Control room 24x7", phone: "100", services: "FIR, verification, thana contacts" },
  { dept_en: "Passport Seva Kendra", dept_hi: "पासपोर्ट सेवा केंद्र", address: "Head Post Office, Satna", timings: "Mon–Fri 9–16 (appointment)", phone: null, services: "Passports — book via passportindia.gov.in" },
  { dept_en: "Aadhaar Enrollment Center", dept_hi: "आधार केंद्र", address: "Head Post Office & lok seva kendras", timings: "Mon–Sat 10–17", phone: null, services: "New Aadhaar, updates, biometrics" },
  { dept_en: "MPEZ Electricity Board", dept_hi: "विद्युत मंडल", address: "Power House Road, Satna", timings: "Complaints 24x7", phone: "1912", services: "Connections, billing, outage complaints" },
  { dept_en: "Jal Nigam / PHE", dept_hi: "जल निगम", address: "PHE Office, Satna", timings: "Mon–Sat 10:30–17:30", phone: null, services: "Water supply complaints, new connections" },
  { dept_en: "RTO Office", dept_hi: "परिवहन कार्यालय", address: "RTO Campus, Rewa Road", timings: "Mon–Fri 10:30–17:30", phone: null, services: "Driving licence, registration, permits" },
  { dept_en: "Employment Exchange", dept_hi: "रोजगार कार्यालय", address: "Collectorate Campus", timings: "Mon–Fri 10:30–17:30", phone: null, services: "Job registration, career counselling" },
  { dept_en: "Krishi Vigyan Kendra", dept_hi: "कृषि विज्ञान केंद्र", address: "Majhgawan, Satna", timings: "Mon–Sat 10–17", phone: null, services: "Farmer training, soil testing, advisories" },
];

// ---------- Play: quiz ----------
export interface QuizQuestion {
  id: string;
  category: string;
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const quizCategories = [
  { key: "history", en: "History & Heritage", hi: "इतिहास व धरोहर", emoji: "🏛️" },
  { key: "geography", en: "Geography", hi: "भूगोल", emoji: "🗺️" },
  { key: "culture", en: "Culture & Festivals", hi: "संस्कृति व त्योहार", emoji: "🎭" },
  { key: "people", en: "Famous People", hi: "प्रसिद्ध लोग", emoji: "🌟" },
  { key: "mp", en: "MP General Knowledge", hi: "मप्र सामान्य ज्ञान", emoji: "📖" },
];

export const quizQuestions: QuizQuestion[] = [
  // History & Heritage
  { id: "q1", category: "history", q: "In which year was the Bharhut Stupa discovered by Alexander Cunningham?", options: ["1857", "1873", "1901", "1922"], correct: 1, explanation: "Cunningham discovered the stupa remains in 1873; many carvings went to the Indian Museum, Kolkata." },
  { id: "q2", category: "history", q: "The Bharhut Stupa dates to which period?", options: ["Mauryan-Shunga (2nd century BCE)", "Gupta period", "Chandela period", "Mughal period"], correct: 0, explanation: "Its railings and gateway are among the earliest surviving Buddhist art in India." },
  { id: "q3", category: "history", q: "Which dynasty's coins and inscriptions are found across the Satna region?", options: ["Chola", "Kalachuri", "Pallava", "Maratha only"], correct: 1, explanation: "The Kalachuris ruled large parts of the Baghelkhand region." },
  { id: "q4", category: "history", q: "Satna district was historically part of which cultural region?", options: ["Malwa", "Baghelkhand", "Bundelkhand", "Nimar"], correct: 1, explanation: "Satna and Rewa form the heart of Baghelkhand." },
  { id: "q5", category: "history", q: "The famous carved railings of Bharhut depict what?", options: ["Ramayana scenes", "Jataka tales", "Mughal court", "Maratha battles"], correct: 1, explanation: "The medallions narrate Jataka tales — previous lives of the Buddha." },
  { id: "q6", category: "history", q: "Which fort town near Satna was the seat of the Baghel kings?", options: ["Gwalior", "Rewa", "Orchha", "Mandu"], correct: 1, explanation: "Rewa State, 60 km away, ruled much of the region including Satna." },
  // Geography
  { id: "q7", category: "geography", q: "Satna city is named after which river?", options: ["Tamas", "Sutna (Satna)", "Son", "Ken"], correct: 1, explanation: "The Satna (Sutna) river is a tributary of the Tamas (Tons)." },
  { id: "q8", category: "geography", q: "Which hill range surrounds the Satna region?", options: ["Aravalli", "Satpura", "Vindhya", "Western Ghats"], correct: 2, explanation: "Satna sits on the Vindhya plateau." },
  { id: "q9", category: "geography", q: "Satna shares a border with which state?", options: ["Maharashtra", "Uttar Pradesh", "Chhattisgarh", "Rajasthan"], correct: 1, explanation: "The district borders UP to the north." },
  { id: "q10", category: "geography", q: "What is the approximate distance from Satna to Rewa?", options: ["25 km", "60 km", "120 km", "200 km"], correct: 1, explanation: "Rewa is about 60 km away — the most common shared-cab route." },
  { id: "q11", category: "geography", q: "Satna is one of India's biggest producers of what?", options: ["Cotton", "Cement", "Tea", "Silk"], correct: 1, explanation: "Limestone-rich Satna hosts major cement plants and is called the cement hub of MP." },
  { id: "q12", category: "geography", q: "Chitrakoot, the pilgrimage town, lies on which river?", options: ["Mandakini", "Narmada", "Betwa", "Chambal"], correct: 0, explanation: "Ramghat on the Mandakini is Chitrakoot's heart." },
  // Culture & Festivals
  { id: "q13", category: "culture", q: "Maihar Devi temple is dedicated to which goddess?", options: ["Durga", "Sharda Devi", "Kali", "Lakshmi"], correct: 1, explanation: "Maa Sharda's shrine sits atop Trikuta hill in Maihar." },
  { id: "q14", category: "culture", q: "How many steps lead up to the Maihar Devi temple?", options: ["501", "786", "1063", "2000"], correct: 2, explanation: "1063 steps — or take the ropeway." },
  { id: "q15", category: "culture", q: "Which legendary warriors are said to still worship at Maihar daily?", options: ["Alha and Udal", "Rama and Lakshmana", "Bhima and Arjuna", "Prithviraj and Sanyogita"], correct: 0, explanation: "Folklore says the immortal Alha visits the shrine before dawn." },
  { id: "q16", category: "culture", q: "When does the biggest mela happen at Maihar?", options: ["Holi", "Navratri", "Diwali", "Makar Sankranti"], correct: 1, explanation: "Lakhs of pilgrims visit during both Navratris." },
  { id: "q17", category: "culture", q: "Deepdaan Mela at Chitrakoot happens during which festival?", options: ["Diwali", "Dussehra", "Janmashtami", "Shivratri"], correct: 0, explanation: "Thousands of diyas float on the Mandakini at Diwali." },
  { id: "q18", category: "culture", q: "Which classical music gharana was founded in this region?", options: ["Gwalior gharana", "Maihar gharana", "Kirana gharana", "Patiala gharana"], correct: 1, explanation: "Baba Allauddin Khan founded the Maihar gharana." },
  // Famous People
  { id: "q19", category: "people", q: "Which sarod maestro made Maihar his home?", options: ["Ravi Shankar", "Baba Allauddin Khan", "Bismillah Khan", "Zakir Hussain"], correct: 1, explanation: "He served as court musician of Maihar State and taught there for decades." },
  { id: "q20", category: "people", q: "Pt. Ravi Shankar and Ustad Ali Akbar Khan both trained under whom at Maihar?", options: ["Baba Allauddin Khan", "Tansen", "Vishnu Digambar", "Amir Khusro"], correct: 0, explanation: "Both were disciples of Baba at Maihar." },
  { id: "q21", category: "people", q: "Alha-Udal, the folk heroes of Baghelkhand ballads, served which king?", options: ["Raja Parmal of Mahoba", "Akbar", "Prithviraj Chauhan", "Rana Pratap"], correct: 0, explanation: "The Alha-Khand ballads celebrate their service to Raja Parmal." },
  { id: "q22", category: "people", q: "Which cricketer from the Rewa-Satna belt played for India?", options: ["Ishan Kishan", "Venkatesh Iyer", "Punam Raut", "None yet — your chance!"], correct: 3, explanation: "Baghelkhand is still waiting for its first India cap — maybe someone reading this." },
  // MP GK
  { id: "q23", category: "mp", q: "What is the capital of Madhya Pradesh?", options: ["Indore", "Bhopal", "Jabalpur", "Gwalior"], correct: 1, explanation: "Bhopal, the city of lakes." },
  { id: "q24", category: "mp", q: "Which is the largest city of MP by population?", options: ["Bhopal", "Indore", "Jabalpur", "Ujjain"], correct: 1, explanation: "Indore — also rated India's cleanest city for years running." },
  { id: "q25", category: "mp", q: "Khajuraho, the temple town, lies in which neighbouring district?", options: ["Panna", "Chhatarpur", "Damoh", "Sagar"], correct: 1, explanation: "Khajuraho is in Chhatarpur district, a few hours from Satna." },
  { id: "q26", category: "mp", q: "Which national park near Satna is famous for white tigers' legacy?", options: ["Kanha", "Bandhavgarh", "Pench", "Panna"], correct: 1, explanation: "The white tiger Mohan was found in the Bandhavgarh-Rewa forests." },
  { id: "q27", category: "mp", q: "The Tropic of Cancer passes through MP. True for Satna district?", options: ["Yes, right through it", "No, it passes south of Satna", "No, it passes north of Satna", "MP is below the Tropic"], correct: 1, explanation: "It crosses central MP, south of Satna." },
  { id: "q28", category: "mp", q: "Which river, central to MP, is worshipped with 'Narmade Har'?", options: ["Betwa", "Narmada", "Shipra", "Son"], correct: 1, explanation: "The Narmada parikrama is MP's great pilgrimage." },
  { id: "q29", category: "mp", q: "MP's famous wheat variety exported worldwide is?", options: ["Sona Moti", "Sharbati", "Basmati", "Durum only"], correct: 1, explanation: "Sharbati wheat from the Sehore belt is prized across India." },
  { id: "q30", category: "mp", q: "Which MP city hosts the Simhastha Kumbh?", options: ["Omkareshwar", "Ujjain", "Maheshwar", "Amarkantak"], correct: 1, explanation: "Ujjain hosts the Simhastha every 12 years on the Shipra." },
];

// ---------- Play: leaderboard (seed users; current user merged in at runtime) ----------
export const seedLeaderboard: { name: string; neighborhood: string; xp: number; badges: string[] }[] = [];

// ---------- Play: city challenge ----------
export const currentChallenge = {
  title: "Find and photograph the Bharhut lion pillar carving",
  description:
    "This week's challenge: visit the Bharhut Archaeological Museum and photograph the lion capital fragment. Bonus: name the century it was carved.",
  entries: [] as { id: string; user: string; answer: string; upvotes: number }[],
};

// ---------- Play: bingo ----------
export const bingoCard = {
  theme: "Satna Explorer",
  month: "June 2026",
  squares: [
    "Eat chaat near bus stand", "Visit Maihar at sunrise", "Spot a langur near the ghats", "Find the Bharhut lion carving", "Share a cab to another city",
    "Post a memory from the 90s", "Try dal-baati on a Sunday", "Walk the river ghats at aarti", "Photograph Satna Junction", "Attend a local cricket match",
    "Buy khoya peda from Dhawari", "Visit the Central Library", "Take the Maihar ropeway", "Join a Dine Together plan", "Vote in a city poll",
    "Climb all 1063 Maihar steps", "Visit Chitrakoot Ramghat", "Try jalebi-poha breakfast", "Spot a heritage building", "Post in Ask a Local",
    "Watch sunset from Vindhya edge", "Answer Aaj ka Sawaal 7 days", "Report a civic issue", "Visit Bharhut museum", "Complete a heritage trail",
  ],
};
