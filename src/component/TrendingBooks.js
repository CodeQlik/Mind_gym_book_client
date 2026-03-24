"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { syncAddToCart } from "@/redux/slices/cartSlice";
import api from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingCart } from "lucide-react";

const getBookImageUrl = (book) => {
    const fallback = "https://images.unsplash.com/photo-1543005128-d39eef080c98?q=80&w=400&auto=format&fit=crop";
    if (!book) return fallback;

    // Handle various field formats (thumbnail object, image string, cover_image object)
    let url = "";
    if (book.thumbnail?.url) url = book.thumbnail.url;
    else if (book.cover_image?.url) url = book.cover_image.url;
    else if (typeof book.image === 'string') url = book.image;
    else if (typeof book.thumbnail === 'string') url = book.thumbnail;

    if (!url || typeof url !== 'string') return fallback;
    if (url.startsWith('http')) return url;

    // Prefix relative path
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').split('/api/v1')[0] || '';
    if (baseUrl && url.startsWith('/')) return `${baseUrl}${url}`;

    return url;
};

const TrendingBooks = () => {
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
                    const booksData = response.data.data || {};
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

                    // CRITICAL: Filter out any objects that are not valid books
                    allBooks = allBooks.filter(item =>
                        item &&
                        typeof item === 'object' &&
                        (item.id || item._id) &&
                        item.title &&
                        item.title.trim().length > 0
                    );

                    let trendingBooks = allBooks
                        .filter(book => book.is_trending === true || book.is_trending === 1 || book.is_trending === "1");

                    // Fallback: If no books are marked as trending, just show the first few
                    if (trendingBooks.length === 0) {
                        trendingBooks = allBooks.slice(0, 12);
                    }

                    setBooks(trendingBooks);
                }
            } catch (error) {
                console.error("Error fetching trending books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    if (loading) return (
        <div className="py-20 text-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-[#F7941E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold animate-pulse">Loading Trending Books...</p>
        </div>
    );

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">

                {/* Header Section from Mockup */}
                <div className="flex flex-col items-center text-center mb-10 md:mb-16">
                    <div className="hidden sm:flex bg-black px-4 py-1.5 rounded-full mb-6 items-center gap-2">
                        <svg className="w-3 h-3 text-[#F7941E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M23 6l-9.5 9.5-5-5L1 18" />
                            <path d="M17 6h6v6" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                            Trending Now
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary mb-4 md:mb-6 px-4">
                        Bestselling Books
                    </h2>
                    <p className="max-w-xl text-gray-500 font-medium text-sm md:text-base px-6">
                        The most loved books by thousands of readers this month.
                    </p>
                </div>

                {/* Grid - 3 Columns like mockup */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {books.map((book, index) => (
                        <div
                            key={book.id}
                            className="bg-white border border-gray-100 rounded-[1.5rem] p-4 shadow-md shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/70 transition-all duration-500 flex gap-4 md:gap-5 group"
                        >
                            {/* Left Side: Only Image (Rectangular aspect for books) */}
                            <Link href={`/books/${book.id}`} className="relative w-28 aspect-[2/3] flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden shadow-md cursor-pointer block">
                                <Image
                                    src={getBookImageUrl(book)}
                                    alt={book.title}
                                    fill
                                    className="object-fill transform transition-transform duration-1000 ease-out"
                                />
                                <button
                                    onClick={() => handleToggleWishlist(book.id)}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-secondary hover:text-red-500 transition-all z-10 opacity-0 group-hover:opacity-100 shadow-sm"
                                >
                                    <Heart size={14} className={book.isBookmarked ? "fill-red-500 text-red-500" : ""} />
                                </button>

                                <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
                                    {(book.is_bestseller || book.is_bestselling) && (
                                        <span className="bg-[#F7941E] text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm">Bestseller</span>
                                    )}
                                    {book.is_premium && (
                                        <span className="bg-black text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm">Premium</span>
                                    )}
                                </div>
                            </Link>

                            {/* Right Side: Everything else (Info + Button) */}
                            <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                                <div>
                                    <Link href={`/books/${book.id}`}>
                                        <h3 className="text-base font-bold text-secondary leading-tight line-clamp-2 mb-1 group-hover:text-[#F7941E] transition-colors cursor-pointer">
                                            {book.title}
                                        </h3>
                                    </Link>
                                    <p className="text-[13px] font-medium text-gray-400 mb-2 truncate">
                                        by {book.author_name || book.author || "Mind Gym Author"}
                                    </p>



                                    {/* Price & Sold Count */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-lg font-bold text-secondary">
                                            ₹{(parseFloat(book.price) || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Add to Cart Button on the Right */}
                                <button
                                    onClick={() => dispatch(syncAddToCart({
                                        id: book.id,
                                        title: book.title,
                                        price: parseFloat(book.price),
                                        coverImage: getBookImageUrl(book),
                                        author: book.author_name || book.author || "Global Author"
                                    }))}
                                    className="w-full bg-black hover:bg-zinc-800 text-white font-black text-[10px] py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn whitespace-nowrap"
                                >
                                    <ShoppingCart size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingBooks;
