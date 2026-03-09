"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import {
    Star,
    ShoppingCart,
    Heart,
    Eye,
    ChevronRight,
    ArrowRight
} from "lucide-react";
import { useDispatch } from "react-redux";
import { syncAddToCart } from "@/redux/slices/cartSlice";

const CategoryShowcase = () => {
    const [category, setCategory] = useState(null);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const handleAddToCart = (book) => {
        dispatch(syncAddToCart({
            id: book.id,
            title: book.title,
            price: book.price || 25,
            coverImage: book.thumbnail?.url || book.image || "/placeholder-book.jpg",
            author: book.author || book.author_name || "Global Author"
        }));
    };

    useEffect(() => {
        const fetchRandomCategory = async () => {
            try {
                // 1. Fetch all categories
                const catRes = await api.get("/category/all");
                if (catRes.data.success) {
                    const cats = catRes.data.data.categories || catRes.data.data || [];
                    if (cats.length > 0) {
                        // 2. Pick a random category
                        const randomCat = cats[Math.floor(Math.random() * cats.length)];
                        setCategory(randomCat);

                        // 3. Fetch books for this category
                        const bookRes = await api.get(`/book/category/${randomCat.id}`);
                        if (bookRes.data.success) {
                            // Take top 6 books
                            setBooks((bookRes.data.data.books || bookRes.data.data || []).slice(0, 6));
                        }
                    }
                }
            } catch (error) {
                console.error("Error in showcase:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRandomCategory();
    }, []);

    if (loading || !category || books.length === 0) return null;

    return (
        <section className="py-24 px-6 md:px-12 bg-white transition-all duration-1000 animate-in fade-in">
            <div className="max-w-[1400px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-2">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="h-1.5 w-12 bg-primary rounded-full"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Discover Best Sellers</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-black  tracking-tight">
                            Best Selling <span className="text-primary italic">{category.name}</span> Books
                        </h2>
                    </div>

                    <button className="px-10 py-4 bg-primary text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-secondary transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-primary/20 flex items-center gap-3 w-fit">
                        View More <ArrowRight size={16} />
                    </button>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-10">
                    {books.map((book) => {
                        const discount = book.original_price > book.price
                            ? Math.round(((book.original_price - book.price) / book.original_price) * 100)
                            : 0;

                        return (
                            <div key={book.id} className="group flex flex-col items-start cursor-pointer animate-in fade-in zoom-in-95 duration-700">
                                {/* Book Cover Container */}
                                <div className="relative w-full aspect-[4/5.5] mb-5 rounded-[0.5rem] overflow-hidden bg-white shadow-lg transition-all duration-700">
                                    <Image
                                        src={book.thumbnail?.url || book.image || "/placeholder-book.jpg"}
                                        alt={book.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Subtle Overlay on Hover */}
                                    <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

                                    {/* Action Buttons Overlay - Sliding from right */}
                                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Wishlist logic would go here
                                            }}
                                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary hover:bg-primary hover:text-white shadow-xl transition-all duration-500 transform translate-x-16 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 delay-[0ms]"
                                        >
                                            <Heart size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(book);
                                            }}
                                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary hover:bg-primary hover:text-white shadow-xl transition-all duration-500 transform translate-x-16 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 delay-[80ms]"
                                        >
                                            <ShoppingCart size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // View logic would go here (e.g., navigation to details)
                                            }}
                                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary hover:bg-primary hover:text-white shadow-xl transition-all duration-500 transform translate-x-16 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 delay-[160ms]"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </div>

                                    {/* Discount Badge */}
                                    {discount > 0 && (
                                        <div className="absolute top-4 left-4 bg-[#D76B52] text-white text-[9px] font-black px-2.5 py-1.5 rounded-[5px] shadow-lg uppercase tracking-widest z-10">
                                            -{discount}%
                                        </div>
                                    )}
                                </div>

                                {/* Content matched perfectly to reference */}
                                <div className="space-y-1.5 w-full flex flex-col items-start px-1">
                                    <h3 className="text-[13px] font-black text-secondary leading-tight uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                                        {book.title}
                                    </h3>

                                    <div className="flex items-center gap-3">
                                        <span className="text-[17px] font-black text-secondary leading-none">₹{book.price}</span>
                                        {book.original_price > book.price && (
                                            <span className="text-[11px] text-secondary/20 line-through font-bold">₹{book.original_price}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;
