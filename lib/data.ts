// Data access layer: reads from Supabase when configured,
// otherwise serves the bundled seed data.
import { getSupabase } from "./supabase";
import {
  seedPlaces,
  seedRestaurants,
  seedMenuItems,
  seedEvents,
  seedReviews,
} from "./seed-data";
import type { Place, Restaurant, MenuItem, CityEvent, Review } from "./types";

export async function getPlaces(): Promise<Place[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("places")
      .select("*")
      .eq("status", "published")
      .order("is_featured", { ascending: false });
    if (!error && data?.length) return data as Place[];
  }
  return seedPlaces;
}

export async function getFeaturedPlaces(): Promise<Place[]> {
  return (await getPlaces()).filter((p) => p.is_featured);
}

export async function getRestaurants(): Promise<Restaurant[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("restaurants")
      .select("*")
      .eq("status", "published")
      .order("avg_rating", { ascending: false });
    if (!error && data?.length) return data as Restaurant[];
  }
  return seedRestaurants;
}

export async function getRestaurantBySlug(
  slug: string,
): Promise<Restaurant | null> {
  const all = await getRestaurants();
  return all.find((r) => r.slug === slug) ?? null;
}

export async function getMenuItems(restaurantId: string): Promise<MenuItem[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("status", "approved");
    if (!error && data?.length) return data as MenuItem[];
  }
  return seedMenuItems.filter((m) => m.restaurant_id === restaurantId);
}

export async function getUpcomingEvents(limit = 3): Promise<CityEvent[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("events")
      .select("*")
      .eq("status", "published")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at")
      .limit(limit);
    if (!error && data?.length) return data as CityEvent[];
  }
  return seedEvents
    .filter((e) => new Date(e.ends_at ?? e.starts_at) >= new Date())
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    .slice(0, limit);
}

export async function getReviews(
  subjectType: "place" | "restaurant",
  subjectId: string,
): Promise<Review[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("reviews")
      .select("*, profiles(username)")
      .eq("subject_type", subjectType)
      .eq("subject_id", subjectId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (!error && data?.length) {
      return data.map((r) => ({
        ...r,
        username: (r.profiles as { username?: string })?.username ?? "Satna Resident",
      })) as Review[];
    }
  }
  return seedReviews.filter(
    (r) => r.subject_type === subjectType && r.subject_id === subjectId,
  );
}
