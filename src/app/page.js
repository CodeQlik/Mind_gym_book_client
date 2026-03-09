import HomeClient from "./HomeClient";

export const metadata = {
  title: "Home | Unlimited Books for Personal & Mental Growth",
  description: "Explore the best-selling books at Mind Gym Book. From mindfulness to cognitive development, find your next life-changing read here.",
  openGraph: {
    title: "Mind Gym Book - Elevate Your Read",
    description: "Discover a world of curated books for intellectual and mental growth.",
  },
};

export default function Home() {
  return <HomeClient />;
}
