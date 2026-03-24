import BookDetailClient from "./BookDetailClient";

export async function generateMetadata({ params }) {
    const { id } = await params;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${id}`, {
            cache: 'no-store'
        });
        const result = await res.json();

        if (result.success && result.data) {
            const book = result.data;
            return {
                title: `${book.title} | Mind Gym Book`,
                description: book.description || `Read ${book.title} by ${book.author} at Mind Gym Book. Explore premium mental growth titles.`,
                openGraph: {
                    title: book.title,
                    description: book.description,
                    images: [{ url: book.thumbnail?.url || book.thumbnail || "/book-banner.png" }],
                },
            };
        }
    } catch (error) {
        console.error("Metadata generation error:", error);
    }

    return {
        title: "Book Detail | Mind Gym Book",
        description: "Discover our premium selection of books for personal and mental growth.",
    };
}

export default async function BookDetailPage({ params }) {
    const { id } = await params;
    let initialBook = null;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${id}`, {
            cache: 'no-store'
        });
        const result = await res.json();
        if (result.success) {
            initialBook = result.data;
        }
    } catch (error) {
        console.error("Book detail fetch error:", error);
    }

    const jsonLd = initialBook ? {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": initialBook.title,
        "description": initialBook.description,
        "image": initialBook.thumbnail?.url || initialBook.thumbnail,
        "author": {
            "@type": "Person",
            "name": initialBook.author,
        },
        "offers": {
            "@type": "Offer",
            "price": initialBook.price,
            "priceCurrency": "INR",
            "availability": initialBook.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        }
    } : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <BookDetailClient initialBook={initialBook} />
        </>
    );
}
