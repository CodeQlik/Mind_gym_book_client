"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { syncAddToCart } from "@/redux/slices/cartSlice";
import api from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingBag } from "lucide-react";

const getBookImageUrl = (book) => {
    const fallback = "https://images.unsplash.com/photo-1543005128-d39eef080c98?q=80&w=400&auto=format&fit=crop";
    if (!book) return fallback;

    // Handle various field formats (thumbnail object, image string, cover_image object)
    let url = "";
    if (book.cover_image?.url) url = book.cover_image.url; // Prefer high-res cover image
    else if (book.thumbnail?.url) url = book.thumbnail.url;
    else if (typeof book.image === 'string') url = book.image;
    else if (typeof book.thumbnail === 'string') url = book.thumbnail;

    if (!url || typeof url !== 'string') return fallback;
    if (url.startsWith('http')) return url;

    // Prefix relative path
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').split('/api/v1')[0] || '';
    if (baseUrl && url.startsWith('/')) return `${baseUrl}${url}`;

    return url;
};

export default function BookGrid() {
    const dispatch = useDispatch();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    const booksData = response.data.data;
                    let allBooks = [];

                    if (Array.isArray(booksData)) {
                        allBooks = booksData;
                    } else if (booksData?.books) {
                        if (Array.isArray(booksData.books)) {
                            allBooks = booksData.books;
                        } else if (typeof booksData.books === 'object') {
                            allBooks = Object.values(booksData.books).flat();
                        }
                    } else if (booksData?.categories && Array.isArray(booksData.categories)) {
                        allBooks = booksData.categories.flatMap(cat => cat.books || []);
                    }

                    // CRITICAL: Filter out any objects that are not valid books (must have id and title)
                    allBooks = allBooks.filter(item =>
                        item &&
                        typeof item === 'object' &&
                        (item.id || item._id) &&
                        item.title &&
                        item.title.trim().length > 0
                    );

                    let premiumBooks = allBooks.filter(book =>
                        book.is_premium === true ||
                        book.is_premium === 1 ||
                        book.is_premium === "1"
                    );

                    if (premiumBooks.length === 0) {
                        premiumBooks = allBooks.slice(0, 4);
                    }

                    setBooks(premiumBooks);
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
        <div className="py-20 text-center bg-white">
            <div className="w-12 h-12 border-4 border-[#F7941E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold animate-pulse">Loading Books...</p>
        </div>
    );

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gray-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-[#F7941E]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
                {/* Header Section - Centered matched to Screenshot */}
                <div className="flex flex-col items-center text-center mb-10 md:mb-16 px-4">
                    <div className="inline-flex items-center gap-2 bg-[#F7941E]/10 px-5 py-1.5 rounded-full mb-4 md:mb-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#F7941E]">Premium Selection</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-secondary mb-4 leading-tight max-w-4xl">
                        Exclusive Premium Books
                    </h2>
                    <p className="max-w-2xl text-gray-500 font-medium text-sm md:text-base leading-relaxed">
                        Handpicked rare editions and exclusive releases from the world's most celebrated authors.
                    </p>
                </div>

                {/* Centered Cards Container */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-8 px-4">
                    {books.map((book, index) => {
                        // Badge logic to match screenshot diversity
                        const badges = ["LIMITED EDITION", "EXCLUSIVE", "PREMIUM", "NEW ARRIVAL"];
                        const badgeText = badges[index % badges.length];

                        return (
                            <div
                                key={book.id || `grid-${index}`}
                                className="group bg-white rounded-2xl shadow-[0_20px_50px_rgba(18,18,18,0.05)] border border-gray-100/50 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(18,18,18,0.08)] hover:-translate-y-2 flex flex-col w-full max-w-[320px] sm:max-w-[220px] md:max-w-[270px] overflow-hidden"
                            >
                                {/* Image Container - Fixed Dimensions */}
                                <div className="relative h-[280px] sm:h-[240px] md:h-[320px] w-full bg-gray-50 overflow-hidden shrink-0">
                                    <Image
                                        src={getBookImageUrl(book)}
                                        alt={book.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-fill transform transition-transform duration-1000 ease-out"
                                        priority={index < 4}
                                    />

                                    <button
                                        onClick={() => handleToggleWishlist(book.id)}
                                        className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 z-10 shadow-md"
                                    >
                                        <Heart size={12} className={book.isBookmarked ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-red-500"} />
                                    </button>

                                    <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20">
                                        {(book.is_bestseller || book.is_bestselling) && (
                                            <span className="bg-[#F7941E] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-md shadow-md">Bestseller</span>
                                        )}
                                        {book.is_premium && (
                                            <span className="bg-[#1A1A1A] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-md shadow-md">Premium</span>
                                        )}
                                    </div>
                                </div>

                                {/* Content Section - Padded */}
                                <div className="p-4 md:p-5 flex flex-col flex-1 text-left items-start">
                                    <div className="flex items-center gap-1.5 mb-2 md:mb-3">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => {
                                                const rating = Number(book.average_rating || book.rating || 0);
                                                return (
                                                    <Star
                                                        key={i}
                                                        size={10}
                                                        fill={i < Math.floor(rating) ? "#F7941E" : "none"}
                                                        stroke={i < Math.floor(rating) ? "#F7941E" : "#E5E7EB"}
                                                        className={i >= Math.floor(rating) ? "opacity-30" : "text-[#F7941E]"}
                                                    />
                                                );
                                            })}
                                        </div>
                                        {(book.average_rating || book.rating) && (
                                            <span className="text-[9px] font-bold text-gray-300 mt-0.5">
                                                ({Number(book.average_rating || book.rating).toFixed(1)})
                                            </span>
                                        )}
                                    </div>

                                    {/* Title & Author */}
                                    <h3 className="text-xs md:text-base font-bold text-secondary mb-0.5 line-clamp-1 leading-tight group-hover:text-[#F7941E] transition-colors duration-300">
                                        {book.title}
                                    </h3>
                                    <p className="text-[9px] md:text-[12px] font-medium text-gray-400 mb-4 md:mb-6 line-clamp-1">
                                        by <span className="text-gray-500">{book.author_name || book.author || "Mind Gym Author"}</span>
                                    </p>

                                    {/* Price and Details Row */}
                                    <div className="flex items-center justify-between mt-auto w-full">
                                        <p className="text-base md:text-xl font-bold text-secondary">
                                            ₹{(parseFloat(book.price) || 0).toLocaleString()}
                                        </p>
                                        <Link
                                            href={`/books/${book.slug || book.id}`}
                                            className="text-[9px] md:text-[11px] font-bold text-[#C48C3D] hover:text-[#9A6D2F] transition-all"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
