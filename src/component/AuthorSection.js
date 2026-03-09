"use client";
import React from "react";
import Image from "next/image";
import { BookOpen, Trophy, Star, Medal } from "lucide-react";

const AuthorSection = () => {
    return (
        <section className="py-24 bg-[#FEFBF0] flex items-center justify-center px-6 md:px-12">
            <div className="max-w-6xl w-full bg-white rounded-[1.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.08)] flex flex-col md:row lg:flex-row min-h-[500px]">

                {/* Left Side: Image with Overlay Badge */}
                <div className="relative w-full lg:w-1/2 min-h-[400px]">
                    <Image
                        src="/author_of_month.png"
                        alt="Author of the Month"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Author of the Month Badge */}
                    <div className="absolute top-8 left-8 bg-[#F7941E] px-5 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-[#F7941E]/30">
                        <Medal size={16} className="text-secondary" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-secondary">
                            Author of the Month
                        </span>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                    {/* Date Badge */}
                    <div className="self-start bg-black px-4 py-1.5 rounded-full mb-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F7941E]">
                            March 2026
                        </span>
                    </div>

                    {/* Author Name & Title */}
                    <div className="mb-8">
                        <h2 className="text-5xl md:text-6xl font-bold text-secondary mb-4 tracking-tight">
                            Emma Richardson
                        </h2>
                        <p className="text-[#F7941E] font-bold text-lg italic">
                            Contemporary Fiction Writer
                        </p>
                    </div>

                    {/* Bio Paragraph */}
                    <p className="text-gray-500 font-medium leading-loose text-[15px] mb-10 max-w-lg">
                        Award-winning author of 24 novels, Emma Richardson has captivated millions of readers worldwide with her compelling narratives and unforgettable characters. Her latest work "Midnight Chronicles" has topped bestseller lists globally.
                    </p>

                    {/* Statistics Section */}
                    <div className="grid grid-cols-3 gap-8 mb-12">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <BookOpen size={20} className="text-[#F7941E]" />
                                <span className="text-3xl font-bold text-secondary">24</span>
                            </div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                Books Published
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <Trophy size={20} className="text-[#F7941E]" />
                                <span className="text-3xl font-black text-secondary">12</span>
                            </div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                Awards Won
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <Star size={20} className="text-[#F7941E]" fill="currentColor" />
                                <span className="text-3xl font-black text-secondary">4.9</span>
                            </div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                Avg Rating
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button className="self-start bg-black hover:bg-[#F7941E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-black/10 active:scale-95">
                        View All Books
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AuthorSection;
