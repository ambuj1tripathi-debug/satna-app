// Sample Dine Together plans and Cab Share posts (spec: 2-3 each at launch,
// posted by admin test accounts to demonstrate the format).
// Dates are generated relative to "now" so the demo content never goes stale.
import type { DiningPlan, CabRide } from "./types";

function at(daysFromNow: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const seedDiningPlans: DiningPlan[] = [
  {
    id: "dp1",
    restaurant_slug: "krishna-dhaba",
    restaurant_name: "Krishna Dhaba",
    cuisine: "North Indian · Dhabha",
    meal_type: "lunch",
    scheduled_at: at(0, 13, 30),
    host_name: "Rahul",
    host_neighborhood: "Civil Lines",
    max_people: 3,
    joined_count: 1,
    vibe: "casual_chat",
    note: "Looking for someone to try the new thali — first time going here!",
  },
  {
    id: "dp2",
    restaurant_slug: "madhuram-thali",
    restaurant_name: "Madhuram Pure Veg Thali",
    cuisine: "North Indian",
    meal_type: "dinner",
    scheduled_at: at(1, 20, 0),
    host_name: "Sneha",
    host_neighborhood: "Dhawari",
    max_people: 4,
    joined_count: 2,
    vibe: "family_friendly",
    note: "Sunday dal-baati night — families welcome.",
  },
  {
    id: "dp3",
    restaurant_slug: "bus-stand-chaat-corner",
    restaurant_name: "Famous Chaat Corner",
    cuisine: "Chaat",
    meal_type: "chai",
    scheduled_at: at(2, 17, 30),
    host_name: "Vikas",
    host_neighborhood: "Mukhtiyarganj",
    max_people: 5,
    joined_count: 1,
    vibe: "students_only",
    note: "Evening chaat + chai before coaching. Students only please.",
  },
];

export const seedCabRides: CabRide[] = [
  {
    id: "cr1",
    origin: "Satna",
    destination: "Rewa",
    drop_point: "Near Medical College",
    departs_at: at(1, 9, 0),
    total_fare: 600,
    total_seats: 4,
    seats_taken: 2,
    poster_name: "Priya",
    member_since: "Jan 2026",
    note: "Cab booked, leaving from Satna Junction area.",
  },
  {
    id: "cr2",
    origin: "Satna",
    destination: "Jabalpur",
    drop_point: "Wright Town",
    departs_at: at(2, 6, 30),
    total_fare: 2000,
    total_seats: 4,
    seats_taken: 1,
    poster_name: "Amit",
    member_since: "Mar 2025",
    note: "Early start — airport drop possible on the way.",
  },
  {
    id: "cr3",
    origin: "Satna",
    destination: "Prayagraj",
    drop_point: "Near Collector Office",
    departs_at: at(3, 8, 0),
    total_fare: 2400,
    total_seats: 3,
    seats_taken: 0,
    poster_name: "Farhan",
    member_since: "Aug 2025",
  },
];

export const cabRoutes = [
  "All routes",
  "Satna→Rewa",
  "Satna→Jabalpur",
  "Satna→Prayagraj",
  "Satna→Bhopal",
  "Other",
];

export const vibeLabels: Record<
  string,
  { en: string; hi: string; cls: string }
> = {
  casual_chat: { en: "casual chat", hi: "हल्की-फुल्की बातचीत", cls: "bg-primary-50 text-primary-700" },
  professional_networking: { en: "professional networking", hi: "प्रोफेशनल नेटवर्किंग", cls: "bg-positive-50 text-positive" },
  family_friendly: { en: "family-friendly", hi: "परिवार के साथ", cls: "bg-sand/15 text-sand" },
  students_only: { en: "students only", hi: "केवल छात्र", cls: "bg-canvas text-muted" },
};
