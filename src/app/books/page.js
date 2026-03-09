import BooksClient from "./BooksClient";

export const metadata = {
    title: "Books | All Premium Titles for Mind & Soul",
    description: "Browse our extensive collection of books on mental health, personal growth, psychology, and more. Use our filters to find the perfect book for your next journey.",
    openGraph: {
        title: "Browse Books | Mind Gym Book",
        description: "Explore our collection of premium mental health and personal growth books.",
    },
};

export default function BooksPage() {
    return <BooksClient />;
}
