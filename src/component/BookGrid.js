"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";

export default function BookGrid() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleToggleWishlist = async (bookId) => {
        try {
            await api.post("/book/bookmark/toggle", { book_id: bookId });
            setBooks(prevBooks =>
                prevBooks.map(book =>
                    book.id === bookId ? { ...book, isBookmarked: !book.isBookmarked } : book
                )
            );
        } catch (err) {
            console.error("Error toggling wishlist:", err);
        }
    };

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await api.get("/book/all");
                if (response.data.success) {
                    const allBooks = response.data.data.books || [];
                    const premiumBooks = allBooks
                        .filter(book => book.is_premium === true)
                        .slice(0, 4); // Display exactly 4 books
                    setBooks(premiumBooks);
                }
            } catch (err) {
                console.error("Error fetching books:", err);
                setError("Failed to load books. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const getFormattedBadge = (index) => {
        const badges = ["Limited Edition", "Exclusive", "Premium", "New Arrival"];
        return badges[index % badges.length];
    };

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="w-12 h-12 border-4 border-[#F7941E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold animate-pulse">Loading Exclusive Collection...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6 md:px-12">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="bg-[#FFF8E7] px-6 py-1.5 rounded-full mb-6">
                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C48C3D]">
                            Premium Selection
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-black text-secondary mb-5 tracking-tight">
                        Exclusive Premium Books
                    </h2>
                    <p className="max-w-2xl text-gray-400 font-medium leading-relaxed text-base">
                        Handpicked rare editions and exclusive releases from the world's most celebrated authors.
                    </p>
                </div>

                {/* Grid Section - 4 Columns matching the image precisely */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {books.map((book, index) => (
                        <div
                            key={book.id}
                            className="bg-white rounded-[1rem] border border-gray-100 shadow-md transition-all duration-700 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-3 group overflow-hidden"
                        >
                            {/* Image Container - Square Aspect */}
                            <div className="relative aspect-square w-full overflow-hidden">
                                <Image
                                    src={book.thumbnail?.url || book.image || "/placeholder-book.jpg"}
                                    alt={book.title}
                                    fill
                                    className="object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                                />
                                <button
                                    onClick={() => handleToggleWishlist(book.id)}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 z-10 shadow-sm"
                                >
                                    <Heart size={14} className={book.isBookmarked ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-red-500"} />
                                </button>
                            </div>

                            {/* Content Section - Balanced Padding */}
                            <div className="p-5 md:p-2">
                                {/* Rating and Score */}
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={11}
                                                fill={i < 4 ? "#F7941E" : "none"}
                                                stroke="#F7941E"
                                                className={i === 4 ? "opacity-30" : ""}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-300 font-sans tracking-tight mt-0.5">(4.{9 - index})</span>
                                </div>

                                {/* Title & Author */}
                                <h3 className="text-[17px] font-black text-secondary mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                                    {book.title}
                                </h3>
                                <p className="text-[12px] font-semibold text-gray-400 mb-4 line-clamp-1">
                                    by <span className="text-gray-500">{book.author_name || book.author || "Global Author"}</span>
                                </p>

                                {/* Price and Action link */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <p className="text-xl font-black text-secondary">
                                        ₹{(parseFloat(book.price) || 0).toLocaleString()}
                                    </p>
                                    <Link
                                        href={`/books/${book.slug || book.id}`}
                                        className="text-[12px] font-bold text-[#C48C3D] hover:text-[#9A6D2F] transition-colors tracking-tight"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
