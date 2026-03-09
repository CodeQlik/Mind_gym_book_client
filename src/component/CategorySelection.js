"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import {
    Book,
    Sparkles,
    Baby,
    GraduationCap,
    Search,
    Sword,
    Heart,
    Ghost,
    History,
    Zap
} from "lucide-react";
import Link from "next/link";

const CategorySelection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const hoverColors = [
        "hover:bg-[#F7941E]",
        "hover:bg-[#1a2332]",
        "hover:bg-[#C48C3D]",
        "hover:bg-[#E67E22]",
        "hover:bg-[#2C3E50]",
        "hover:bg-[#D35400]",
        "hover:bg-[#2980B9]",
        "hover:bg-[#8E44AD]",
        "hover:bg-[#27AE60]"
    ];

    const iconMap = {
        "fiction": <Book size={24} className="text-[#C48C3D] group-hover:text-white transition-colors" />,
        "non-fiction": <Sparkles size={24} className="text-[#C48C3D] group-hover:text-white transition-colors" />,
        "kids": <Baby size={24} className="text-[#C48C3D] group-hover:text-white transition-colors" />,
        "educational": <GraduationCap size={24} className="text-[#C48C3D] group-hover:text-white transition-colors" />,
        "mystery": <Search size={24} className="text-[#C48C3D] group-hover:text-white transition-colors" />,
        "romance": <Heart size={24} className="text-[#C48C3D] group-hover:text-white transition-colors" />,
        "action": <Sword size={24} className="text-[#C48C3D] group-hover:text-white transition-colors" />,
        "horror": <Ghost size={24} className="text-[#C48C3D] group-hover:text-white transition-colors" />,
        "history": <History size={24} className="text-[#C48C3D] group-hover:text-white transition-colors" />,
        "scifi": <Zap size={24} className="text-[#C48C3D] group-hover:text-white transition-colors" />
    };

    const getIcon = (category) => {
        const image = category.image?.url || category.image;
        if (image) {
            return (
                <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-300">
                    <Image
                        src={image}
                        alt={category.name}
                        fill
                        className="object-contain"
                    />
                </div>
            );
        }

        const lowerName = category.name.toLowerCase();
        for (const key in iconMap) {
            if (lowerName.includes(key)) return iconMap[key];
        }
        return <Book size={24} className="text-[#C48C3D] group-hover:text-white transition-colors" />;
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/category/all");
                if (response.data.success) {
                    const fetched = response.data.data.categories || response.data.data || [];
                    setCategories(fetched);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return (
        <div className="py-20 text-center bg-white flex justify-center">
            <div className="w-10 h-10 border-4 border-[#F7941E]/20 border-t-[#F7941E] rounded-full animate-spin" />
        </div>
    );

    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="bg-[#FFF8E7] px-6 py-1.5 rounded-full mb-6">
                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C48C3D]">
                            Our Collection
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-5 tracking-tight uppercase">
                        Browse by Category
                    </h2>
                    <p className="max-w-2xl text-gray-400 font-medium leading-relaxed text-base">
                        Explore our diverse collection across multiple genres and categories.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug || category.id}`}
                            className={`bg-white border border-gray-100/50 rounded-[1.5rem] p-8 flex flex-col items-start gap-4 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-3 group ${hoverColors[index % hoverColors.length]}`}
                        >
                            {/* Icon Wrapper */}
                            <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] p-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                                {getIcon(category)}
                            </div>

                            {/* Info */}
                            <div>
                                <h3 className="text-xl font-bold text-secondary mb-1 group-hover:text-white transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-[13px] font-bold text-gray-400 group-hover:text-white/70 transition-colors">
                                    {(Math.floor(Math.random() * 800) + 200)}+ Books
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySelection;
