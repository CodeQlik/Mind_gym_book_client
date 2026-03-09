import AboutClient from "./AboutClient";

export const metadata = {
    title: "About Us | Mind Gym Book - Elevate Your Read",
    description: "Learn more about our heritage and our mission to curate the best books for your personal growth. Since our inception, we've provided a sanctuary for the curious mind.",
    openGraph: {
        title: "About Our Bookstore | Mind Gym Book",
        description: "Where every spine tells a story and every page holds a dream.",
    },
};

export default function AboutPage() {
    return <AboutClient />;
}
