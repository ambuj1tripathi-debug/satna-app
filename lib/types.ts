export type PriceRange = "budget" | "mid" | "premium";
export type VegType = "veg" | "non_veg" | "pure_veg" | "jain" | "mixed";
export type PlaceCategory =
  | "religious"
  | "nature"
  | "infrastructure"
  | "shopping"
  | "education"
  | "heritage"
  | "other";

export interface Place {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string | null;
  category: PlaceCategory;
  description_en: string | null;
  hero_image_url: string | null;
  tags: string[];
  timing: string | null;
  entry_fee: string | null;
  best_time: string | null;
  distance_km: number | null;
  is_featured: boolean;
  avg_rating: number;
  review_count: number;
}

export interface Restaurant {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string | null;
  cuisines: string[];
  veg_type: VegType;
  price_range: PriceRange;
  description: string | null;
  hero_image_url: string | null;
  address: string | null;
  phone: string | null;
  distance_km: number | null;
  open_time: string | null; // 'HH:MM'
  close_time: string | null;
  is_featured: boolean;
  avg_rating: number;
  review_count: number;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category: string;
  name: string;
  description: string | null;
  price: number | null;
  is_veg: boolean;
}

export interface CityEvent {
  id: string;
  title_en: string;
  title_hi: string | null;
  category: "religious" | "cultural" | "sports" | "trade" | "civic";
  venue: string | null;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  is_featured: boolean;
}

export interface Review {
  id: string;
  subject_type: "place" | "restaurant";
  subject_id: string;
  username: string;
  rating: number;
  body: string | null;
  created_at: string;
}

export type PlanVibe =
  | "casual_chat"
  | "professional_networking"
  | "family_friendly"
  | "students_only";

export interface DiningPlan {
  id: string;
  restaurant_slug: string;
  restaurant_name: string;
  cuisine: string;
  meal_type: "lunch" | "dinner" | "chai";
  scheduled_at: string;
  host_name: string;
  host_neighborhood: string;
  max_people: number;
  joined_count: number;
  vibe: PlanVibe;
  note?: string;
}

export interface CabRide {
  id: string;
  origin: string;
  destination: string;
  drop_point: string | null;
  departs_at: string;
  total_fare: number;
  total_seats: number;
  seats_taken: number;
  poster_name: string;
  member_since: string; // 'Mar 2025'
  note?: string;
}

export interface CommunityPost {
  id: string;
  type: "question" | "tip" | "photo" | "issue" | "appreciation";
  category: string;
  title: string;
  body: string;
  author: string;
  neighborhood: string;
  is_anonymous: boolean;
  like_count: number;
  comment_count: number;
  created_at: string;
}

export interface ForumThread {
  id: string;
  board_slug: string;
  title: string;
  author: string;
  reply_count: number;
  last_active: string;
  is_pinned: boolean;
}

export interface CityAlert {
  id: string;
  severity: "emergency" | "civic" | "disruption" | "good_news";
  headline: string;
  description: string;
  affected_area: string;
  source_verified: boolean;
  created_at: string;
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; label: string; votes: number }[];
  closes_in_days: number;
}

export interface LostFoundItem {
  id: string;
  type: "lost" | "found";
  category: "documents" | "valuables" | "pets" | "other";
  title: string;
  description: string;
  location: string;
  status: "open" | "resolved";
  created_at: string;
}

export interface Memory {
  id: string;
  type: "photo" | "story" | "then_vs_now";
  era: "pre_1947" | "era_1950s_70s" | "era_1980s_90s" | "era_2000s" | "recent";
  caption: string;
  story?: string;
  year_estimate?: number;
  location_tag: string;
  contributor: string;
  like_count: number;
  remember_count: number;
  comment_count: number;
  is_featured: boolean;
}

export interface LivePulseItem {
  id: string;
  kind: "dining" | "cab" | "photo";
  text_en: string;
  text_hi: string;
  meta: string;
  href: string;
}
