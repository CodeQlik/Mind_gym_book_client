"use client";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { syncAddToCart } from "@/redux/slices/cartSlice";
import api from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart } from "lucide-react";

const FeaturedSlider = () => {
    const dispatch = useDispatch();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchFeaturedBooks = async () => {
            try {
                const response = await api.get("/book/all?limit=10");
                if (response.data.success) {
                    const data = response.data.data || {};
                    let allBooks = [];
                    const booksSource = data.books || data;
                    
                    if (Array.isArray(booksSource)) {
                        allBooks = booksSource;
                    } else if (booksSource && typeof booksSource === 'object') {
                        allBooks = Object.values(booksSource).flat().filter(book => book !== null && typeof book === 'object');
                    }
                    
                    setBooks(allBooks);
                }
            } catch (error) {
                console.error("Error fetching featured books:", error);
            } finally {
                setLoading(false);
            }
        };
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

        fetchFeaturedBooks();
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.7;
            scrollRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading || books.length === 0) return null;

    return (
        <section className="py-24 bg-[#fafafc] relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-0 -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-[1500px] mx-auto px-6 relative z-10">
                {/* Refined Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-[2px] bg-primary rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Special Offers</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-secondary tracking-tight">
                            Featured <span className="font-serif italic text-primary font-medium">Collections</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-4">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Explore More</p>
                            <Link href="/books" className="text-sm font-black text-secondary hover:text-primary transition-colors">
                                View Full Catalog →
                            </Link>
                        </div>
                        <div className="flex gap-2.5">
                            <button
                                onClick={() => scroll('left')}
                                className="w-12 h-12 rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 group"
                            >
                                <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-12 h-12 rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 group"
                            >
                                <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Nice Slider Track */}
                <div
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto pb-16 pt-4 px-4 no-scrollbar snap-x snap-mandatory"
                >
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="min-w-[180px] md:min-w-[220px] snap-center group/card"
                        >
                            <div className="relative">
                                {/* Book Cover with Professional Depth */}
                                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.12)] transition-all duration-700 group-hover/card:-translate-y-3 group-hover/card:shadow-primary/25 border border-white/20">
                                    <Image
                                        src={book.thumbnail?.url || book.image || "/placeholder-book.jpg"}
                                        alt={book.title}
                                        fill
                                        className="object-fill transition-transform duration-1000 group-hover/card:scale-110"
                                    />

                                    {/* Glassmorphic Quick Actions */}
                                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4">
                                        <div className="flex gap-2 translate-y-10 group-hover/card:translate-y-0 transition-transform duration-500 delay-75">
                                            <button 
                                                onClick={() => dispatch(syncAddToCart({
                                                    id: book.id,
                                                    title: book.title,
                                                    price: parseFloat(book.price),
                                                    coverImage: book.thumbnail?.url || book.image || "/placeholder-book.jpg",
                                                    author: book.author_name || book.author || "Global Author"
                                                }))}
                                                className="w-10 h-10 rounded-full bg-white text-secondary hover:bg-primary hover:text-white transition-all shadow-xl flex items-center justify-center"
                                            >
                                                <ShoppingCart size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleWishlist(book.id)}
                                                className="w-10 h-10 rounded-full bg-white text-secondary hover:text-red-500 transition-all shadow-xl flex items-center justify-center"
                                            >
                                                <Heart size={18} className={book.isBookmarked ? "fill-red-500 text-red-500" : ""} />
                                            </button>
                                        </div>
                                        <Link
                                            href={`/books/${book.id}`}
                                            className="bg-primary text-white px-5 py-1.5 rounded-full font-bold text-[10px] hover:bg-white hover:text-primary transition-all shadow-lg translate-y-10 group-hover/card:translate-y-0 transition-transform duration-500 delay-150"
                                        >
                                            View Book
                                        </Link>
                                    </div>
                                </div>

                                {/* Floating Badge if applicable, or generic badge */}
                                <div className="absolute -top-2 -right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform rotate-12 z-20 border-2 border-white">
                                    <Star size={14} fill="currentColor" />
                                </div>
                            </div>

                            {/* Refined Details */}
                            <div className="mt-8 px-1 text-left">
                                <div className="flex items-center justify-between mb-1.5">
                                    <p className="font-bold text-gray-400 text-[9px] uppercase tracking-[0.2em]">
                                        {book.author_name || book.author || "Mind Gym Author"}
                                    </p>
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => {
                                            const rating = book.average_rating || book.rating || 5;
                                            return (
                                                <Star key={i} size={8} fill={i < Math.floor(rating) ? "#F7941E" : "none"} stroke="#F7941E" strokeWidth={2} />
                                            );
                                        })}
                                    </div>
                                </div>

                                <h3 className="font-black text-secondary text-base md:text-lg mb-1.5 line-clamp-1 group-hover/card:text-primary transition-colors cursor-pointer">
                                    {book.title}
                                </h3>

                                <div className="flex items-center justify-between">
                                    <p className="font-black text-primary text-lg">
                                        ₹{(parseFloat(book.price) || 0).toLocaleString()}
                                    </p>
                                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                                        In Stock
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
};

export default FeaturedSlider;
