// Seed content for the Community tab.
import type {
  CommunityPost,
  ForumThread,
  CityAlert,
  Poll,
  LostFoundItem,
  Memory,
} from "./types";


export const seedPosts: CommunityPost[] = [];

export const postCategories = [
  { key: "all", en: "All", hi: "सभी" },
  { key: "roads", en: "Roads", hi: "सड़कें" },
  { key: "water", en: "Water", hi: "पानी" },
  { key: "electricity", en: "Electricity", hi: "बिजली" },
  { key: "events", en: "Events", hi: "कार्यक्रम" },
  { key: "business", en: "Business", hi: "व्यापार" },
  { key: "general", en: "General", hi: "सामान्य" },
  { key: "help", en: "Help needed", hi: "मदद चाहिए" },
];

export const forumBoards = [
  { slug: "city-development", name: "City Development Ideas", hi: "शहर विकास के विचार", emoji: "🏗️", desc: "Suggest improvements to Satna" },
  { slug: "tourism-heritage", name: "Tourism & Heritage", hi: "पर्यटन व धरोहर", emoji: "🪷", desc: "Trails, places, preservation" },
  { slug: "business-jobs", name: "Business & Jobs", hi: "व्यापार व नौकरियाँ", emoji: "💼", desc: "Local opportunities, classifieds" },
  { slug: "education", name: "Education", hi: "शिक्षा", emoji: "📚", desc: "Schools, coaching, results" },
  { slug: "festivals-events", name: "Festivals & Events", hi: "त्योहार व कार्यक्रम", emoji: "🎉", desc: "Planning, volunteer coordination" },
  { slug: "sports-youth", name: "Sports & Youth", hi: "खेल व युवा", emoji: "🏏", desc: "Cricket, kabaddi, local leagues" },
  { slug: "ask-a-local", name: "Ask a Local", hi: "स्थानीय से पूछें", emoji: "🙋", desc: "Outsiders asking residents anything" },
  { slug: "dine-together-stories", name: "Dine Together Stories", hi: "साथ खाने के किस्से", emoji: "🍽️", desc: "Share how a dining meetup went" },
  { slug: "cab-share-coordination", name: "Cab Share Coordination", hi: "कैब शेयर समन्वय", emoji: "🚖", desc: "Routes, timing, trusted companions" },
];

export const seedThreads: ForumThread[] = [];

export const seedAlerts: CityAlert[] = [];

export const seedPolls: Poll[] = [];

export const seedLostFound: LostFoundItem[] = [];

export const seedMemories: Memory[] = [];

export const eraLabels: Record<string, { en: string; hi: string }> = {
  all: { en: "All eras", hi: "सभी दौर" },
  pre_1947: { en: "Pre-1947", hi: "1947 से पहले" },
  era_1950s_70s: { en: "1950s–70s", hi: "1950–70 का दशक" },
  era_1980s_90s: { en: "1980s–90s", hi: "1980–90 का दशक" },
  era_2000s: { en: "2000s", hi: "2000 का दशक" },
  recent: { en: "Recent", hi: "हाल के" },
};
