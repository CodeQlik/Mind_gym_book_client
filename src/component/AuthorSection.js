"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BookOpen, Trophy, Star, Medal, ArrowRight } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";

const getBookImageUrl = (book) => {
    const fallback = "https://images.unsplash.com/photo-1543005128-d39eef080c98?q=80&w=400&auto=format&fit=crop";
    if (!book) return fallback;
    
    let url = "";
    if (book.thumbnail?.url) url = book.thumbnail.url;
    else if (book.cover_image?.url) url = book.cover_image.url;
    else if (typeof book.image === 'string') url = book.image;
    else if (typeof book.thumbnail === 'string') url = book.thumbnail;
    
    if (!url || typeof url !== 'string') return fallback;
    if (url.startsWith('http')) return url;
    
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').split('/api/v1')[0] || '';
    if (baseUrl && url.startsWith('/')) return `${baseUrl}${url}`;
    
    return url;
};

const AuthorSection = () => {
    const [topBook, setTopBook] = useState(null);
    const [stats, setStats] = useState({ salesCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopBook = async () => {
            try {
                // Fetch top selling book of the week
                let response = await api.get("/analytics/top-selling-books-week?limit=1");
                
                if (response.data.success && response.data.data && response.data.data.length > 0) {
                    const topEntry = response.data.data[0];
                    setTopBook(topEntry.book);
                    setStats({ salesCount: topEntry.sales_count || 0 });
                } else {
                    const anyBookRes = await api.get("/book/all");
                    if (anyBookRes.data.success) {
                        const data = anyBookRes.data.data;
                        let allBooks = [];
                        if (Array.isArray(data)) allBooks = data;
                        else if (data?.books) {
                            if (Array.isArray(data.books)) allBooks = data.books;
                            else if (typeof data.books === 'object') allBooks = Object.values(data.books).flat();
                        }
                        const validBooks = allBooks.filter(b => b && (b.id || b._id));
                        if (validBooks.length > 0) setTopBook(validBooks[0]);
                    }
                }
            } catch (error) {
                console.error("Error in AuthorSection:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopBook();
    }, []);

    const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    if (loading) return null;
    if (!topBook) return null;

    return (
        <section className="py-24 bg-[#FCF9F0] flex items-center justify-center px-6 md:px-12">
            <div className="max-w-6xl w-full bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.06)] flex flex-col md:flex-row min-h-[500px]">

                {/* Left Side: Dynamic Book/Author Image */}
                <div className="relative w-full md:w-1/2 min-h-[400px] md:min-h-[500px]">
                    <Image
                        src={getBookImageUrl(topBook)}
                        alt={topBook.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Yellow Badge */}
                    <div className="absolute top-8 left-8 bg-[#FFC107] px-6 py-2 rounded-full flex items-center gap-2 shadow-sm z-10 transition-transform hover:scale-105">
                        <Medal size={16} className="text-black" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-black">
                            {stats.salesCount > 0 ? "Bestseller of the Week" : "Book of the Month"}
                        </span>
                    </div>
                </div>

                {/* Right Side: Content Section */}
                <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white">
                    {/* Date Badge */}
                    <div className="self-start bg-black px-6 py-1.5 rounded-full mb-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFC107]">
                            {currentMonthYear}
                        </span>
                    </div>

                    {/* Dynamic Author Name & Title */}
                    <div className="mb-6">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-3 tracking-tight">
                            {topBook.author_name || topBook.author || "Global Author"}
                        </h2>
                        <p className="text-[#FFBA00] font-bold text-lg tracking-wide">
                            Featured Book: {topBook.title}
                        </p>
                    </div>

                    {/* Description Paragraph - Fully Dynamic */}
                    <p className="text-gray-500 font-medium leading-[1.8] text-[15px] mb-12 max-w-lg line-clamp-4">
                        {topBook.description || "Discover our top-rated selection, carefully curated based on reader popularity and critical acclaim worldwide. A masterpiece that demands a place on every bookshelf."}
                    </p>

                    {/* Statistics Section - FULLY BACKEND DRIVEN */}
                    <div className="flex items-center gap-10 md:gap-14 mb-12">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <Trophy size={18} className="text-[#FFC107]" />
                                <span className="text-2xl font-bold text-secondary">{stats.salesCount || "0"}</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                                Copies Sold
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl font-bold text-secondary">
                                    {Number(topBook.average_rating || topBook.rating || 0).toFixed(1)}
                                </span>
                                <div className="flex items-center gap-0.5 ml-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={14} 
                                            className={i < Math.floor(topBook.average_rating || topBook.rating || 0) 
                                                ? "text-[#FFC107] fill-[#FFC107]" 
                                                : "text-gray-200 fill-gray-200"} 
                                        />
                                    ))}
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                                Avg Rating
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Link
                        href={`/books/${topBook.id}`}
                        className="self-start bg-black hover:bg-zinc-800 text-white px-12 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl active:scale-95"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AuthorSection;
