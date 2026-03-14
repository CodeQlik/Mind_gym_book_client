"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

/**
 * Features Section
 * Redesigned to match the premium 6-column book grid mockup.
 * Includes star ratings, price highlights, and clean typography.
 */
const Features = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await api.get("/book/all");
                if (response.data.success) {
                    const data = response.data.data || {};
                    let allBooks = [];
                    const booksSource = data.books || data;
                    
                    if (Array.isArray(booksSource)) {
                        allBooks = booksSource;
                    } else if (booksSource && typeof booksSource === 'object') {
                        allBooks = Object.values(booksSource).flat().filter(book => book !== null && typeof book === 'object');
                    }

                    setBooks(allBooks.slice(0, 24));
                }
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    if (loading) return (
        <div className="py-24 text-center bg-white flex justify-center flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#F7941E]/20 border-t-[#F7941E] rounded-full animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">
                Curating Best Picks...
            </p>
        </div>
    );

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F7941E]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">

                {/* Premium Header Section */}
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-8 h-[1px] bg-[#F7941E]/40" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#F7941E]">
                            Trending Now
                        </span>
                        <span className="w-8 h-[1px] bg-[#F7941E]/40" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6 tracking-tight">
                        Our Most Loved <span className="text-[#F7941E] italic font-medium">PICKS</span>
                    </h2>

                    {/* Premium Description */}
                    <p className="max-w-2xl text-gray-400 font-medium leading-relaxed text-base mb-8">
                        Explore our hand-selected literary masterpieces that have captured the hearts and minds of readers worldwide.
                    </p>

                    {/* Visual Divider */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-[1px] bg-secondary opacity-10" />
                        <div className="w-2.5 h-2.5 border border-[#F7941E] transform rotate-45" />
                        <div className="w-12 h-[1px] bg-secondary opacity-10" />
                    </div>
                </div>

                {/* Grid - 6 Columns as requested */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 lg:gap-8">
                    {books.map((book, index) => (
                        <div
                            key={book.id || index}
                            className="bg-white rounded-[1rem] p-4 flex flex-col transition-all duration-700 hover:shadow-2xl hover:shadow-[#F7941E]/10 hover:-translate-y-3 group border border-gray-100 shadow-sm hover:border-[#F7941E]/20"
                        >
                            {/* Book Cover Image */}
                            <div className="relative aspect-[4/5] w-full rounded-[1rem] overflow-hidden mb-5 box-shadow-premium">
                                <Image
                                    src={book.thumbnail?.url || book.image || "/placeholder-book.jpg"}
                                    alt={book.title}
                                    fill
                                    className="object-cover transform group-hover:scale-110 transition-transform duration-1000"
                                />
                                {/* Bottom Inner Shadow for text contrast if needed */}
                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Book Details Container */}
                            <div className="px-1 flex-1 flex flex-col">
                                {/* Rating Stars (Randomized for mockup fidelity) */}
                                <div className="flex items-center gap-1 mb-3">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => {
                                            const rating = book.average_rating || book.rating || 5;
                                            return (
                                                <Star
                                                    key={i}
                                                    size={10}
                                                    className={`${i < Math.floor(rating) ? "fill-[#F7941E] text-[#F7941E]" : "fill-gray-200 text-gray-200"}`}
                                                />
                                            );
                                        })}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 mt-0.5">
                                        ({book.reviews_count || book.total_reviews || 0})
                                    </span>
                                </div>

                                {/* Title & Author */}
                                <h3 className="text-[15px] font-bold text-secondary leading-tight line-clamp-2 mb-2 group-hover:text-[#F7941E] transition-colors">
                                    {book.title}
                                </h3>
                                <p className="text-[11px] font-medium text-gray-400 mb-5">
                                    by <span className="hover:text-secondary transition-colors cursor-pointer">{book.author_name || book.author || "Mind Gym Author"}</span>
                                </p>

                                {/* Bottom Row: Price & Link */}
                                <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-1 ">
                                    <span className="text-lg font-bold text-secondary">
                                        ${book.price || "299.00"}
                                    </span>
                                    <Link
                                        href={`/books/${book.id}`}
                                        className="text-[10px] font-bold text-[#F7941E] uppercase tracking-wider hover:underline underline-offset-4"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .box-shadow-premium {
                    box-shadow: 0 10px 30px -5px rgba(0,0,0,0.1), 0 4px 10px -4px rgba(0,0,0,0.05);
                }
            `}</style>
        </section>
    );
};

export default Features;
