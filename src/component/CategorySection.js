"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import {
    Shapes,
    Mountain,
    Heart,
    Atom,
    Rocket,
    Ghost,
    BookOpen,
    Quote,
    Star,
    ShoppingCart,
    Eye
} from "lucide-react";
import { useDispatch } from "react-redux";
import { syncAddToCart } from "@/redux/slices/cartSlice";

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategoryId, setActiveCategoryId] = useState("all");
    const [books, setBooks] = useState([]);
    const [booksLoading, setBooksLoading] = useState(false);
    const dispatch = useDispatch();

    // Icon mapping based on category names
    const getIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("all")) return <Shapes size={24} />;
        if (lowerName.includes("adventure")) return <Mountain size={24} />;
        if (lowerName.includes("romance")) return <Heart size={24} />;
        if (lowerName.includes("science") || lowerName.includes("since")) return <Atom size={24} />;
        if (lowerName.includes("fiction")) return <Rocket size={24} />;
        if (lowerName.includes("thriller") || lowerName.includes("horror")) return <Ghost size={24} />;
        return <BookOpen size={24} />;
    };

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/category/all");
                if (response.data.success) {
                    let fetchedCats = response.data.data.categories || response.data.data || [];
                    fetchedCats = [...fetchedCats].sort(() => Math.random() - 0.5);
                    setCategories([{ id: "all", name: "Show All" }, ...fetchedCats]);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([{ id: "all", name: "Show All" }]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Books when activeCategoryId changes
    useEffect(() => {
        const fetchBooks = async () => {
            setBooksLoading(true);
            try {
                const endpoint = activeCategoryId === "all" ? "/book/all" : `/book/category/${activeCategoryId}`;
                const response = await api.get(endpoint);
                if (response.data.success) {
                    setBooks(response.data.data.books || response.data.data || []);
                }
            } catch (err) {
                console.error("Error fetching books:", err);
                setBooks([]);
            } finally {
                setBooksLoading(false);
            }
        };
        fetchBooks();
    }, [activeCategoryId]);

    const handleAddToCart = (book) => {
        dispatch(syncAddToCart({
            id: book.id,
            title: book.title,
            price: book.price || 25,
            coverImage: book.thumbnail?.url || book.image || "/placeholder-book.jpg",
            author: book.author || book.author_name || "Unknown Author"
        }));
    };

    if (loading) {
        return (
            <div className="py-20 bg-white flex justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <section className="py-24 bg-primary relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Quote className="text-black rotate-180" size={20} fill="currentColor" />
                        <span className="text-black font-bold uppercase tracking-[0.4em] text-[10px]">Categories</span>
                        <Quote className="text-black" size={20} fill="currentColor" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-sans font-black uppercase tracking-tight text-secondary">
                        Explore by <span className="text-white italic">category</span>
                    </h2>
                </div>

                {/* Category Cards Grid */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full mb-24 px-4 mt-6">
                    {categories.map((category) => {
                        const isActive = activeCategoryId === category.id;
                        const categoryImage = category.image?.url || category.thumbnail?.url || category.image;

                        return (
                            <div
                                key={category.id}
                                onClick={() => setActiveCategoryId(category.id)}
                                className={`
                                    group cursor-pointer w-[110px] h-[130px] md:w-[125px] md:h-[145px] rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-500 p-4 shadow-sm
                                    ${isActive
                                        ? "bg-black text-white shadow-2xl shadow-black/20 -translate-y-2"
                                        : "bg-primary text-white hover:shadow-xl hover:-translate-y-1 border-1 border-black"
                                    }
                                `}
                            >
                                <div className={`
                                    transition-all duration-500 relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center
                                    ${isActive ? "text-white" : "text-[#bc7470]"}
                                `}>
                                    {categoryImage && category.id !== "all" ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={categoryImage}
                                                alt={category.name}
                                                fill
                                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    ) : (
                                        <div className="scale-[1.8] group-hover:scale-[2] transition-transform duration-500">
                                            {getIcon(category.name)}
                                        </div>
                                    )}
                                </div>
                                <span className={`
                                    font-sans font-black text-[12px] md:text-[14px] text-center leading-tight transition-colors duration-300
                                    ${isActive ? "text-white" : "text-secondary"}
                                `}>
                                    {category.name}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Filtered Books Grid */}
                <div className="w-full">
                    {booksLoading ? (
                        <div className="py-20 flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                            <p className="text-secondary/40 font-sans italic">Filtering collections...</p>
                        </div>
                    ) : books.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
                            {books.map((book) => {
                                const discount = book.original_price > book.price
                                    ? Math.round(((book.original_price - book.price) / book.original_price) * 100)
                                    : 0;

                                return (
                                    <div key={book.id} className="group bg-white rounded-[2rem] p-4 border-2 border-black/5 hover:border-black transition-all duration-500 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:-translate-y-2 cursor-pointer">
                                        {/* Book Image Container */}
                                        <div className="relative aspect-[3/4.2] w-full rounded-[1.5rem] overflow-hidden shadow-md">
                                            <Image
                                                src={book.thumbnail?.url || book.image || "/placeholder-book.jpg"}
                                                alt={book.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Book Info Section */}
                                        <div className="flex flex-col gap-1 px-2 pb-2 text-left">
                                            <span className="text-[10px] md:text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                                                {book.author_name || book.author || "Unknown Author"}
                                            </span>
                                            <h3 className="text-sm md:text-base font-black text-secondary leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                                {book.title}
                                            </h3>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex flex-col">
                                                    <span className="text-base md:text-lg font-black text-secondary">₹{book.price}</span>
                                                    {book.original_price > book.price && (
                                                        <span className="text-[10px] text-gray-300 line-through font-bold">₹{book.original_price}</span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToCart(book);
                                                    }}
                                                    className="bg-black text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary transition-all active:scale-95 shadow-lg shadow-black/10"
                                                >
                                                    <ShoppingCart size={14} />
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-secondary/40 font-sans italic">No books currently available in this category.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-[100px]" />
            </div>
        </section>
    );
};

export default CategorySection;
