// Sample Dine Together plans and Cab Share posts (spec: 2-3 each at launch,
// posted by admin test accounts to demonstrate the format).
// Dates are generated relative to "now" so the demo content never goes stale.
import type { DiningPlan, CabRide } from "./types";


export const seedDiningPlans: DiningPlan[] = [];

export const seedCabRides: CabRide[] = [];

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
