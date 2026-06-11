import TopBar from "@/components/TopBar";
import DiscoverTabs from "@/components/discover/DiscoverTabs";
import { getPlaces, getRestaurants } from "@/lib/data";

export default async function DiscoverPage() {
  const [places, restaurants] = await Promise.all([getPlaces(), getRestaurants()]);

  return (
    <main>
      <TopBar />
      <DiscoverTabs places={places} restaurants={restaurants} />
      <div className="h-6" />
    </main>
  );
}
