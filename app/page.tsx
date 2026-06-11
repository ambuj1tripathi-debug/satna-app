import TopBar from "@/components/TopBar";
import HeroBanner from "@/components/home/HeroBanner";
import QuickActions from "@/components/home/QuickActions";
import TodayInSatna from "@/components/home/TodayInSatna";
import ActiveNow from "@/components/home/ActiveNow";
import HomeLive from "@/components/home/HomeLive";

export default function HomePage() {
  return (
    <main>
      <TopBar />
      <HeroBanner />
      <QuickActions />
      <TodayInSatna />
      <HomeLive />
      <ActiveNow />
      <div className="h-6" />
    </main>
  );
}
