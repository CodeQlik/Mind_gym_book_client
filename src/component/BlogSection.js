"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

const blogPosts = [
    {
        id: 1,
        date: "March 5, 2026",
        category: "Book Lists",
        title: "10 Must-Read Books for Spring 2026",
        description: "Discover the perfect reads for the season.",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        date: "March 1, 2026",
        category: "Tips",
        title: "Building Your Personal Library",
        description: "Tips for curating a meaningful collection.",
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        date: "February 28, 2026",
        category: "Interview",
        title: "Interview with Emma Richardson",
        description: "Inside the creative process of our featured author.",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop"
    }
];

const BlogSection = () => {
    return (
        <section className="py-24 bg-gray-100">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="bg-[#FFF8E7] px-6 py-1.5 rounded-full mb-6">
                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C48C3D]">
                            From Our Blog
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-5 tracking-tight">
                        Latest Articles
                    </h2>
                    <p className="max-w-2xl text-gray-400 font-medium leading-relaxed text-base">
                        Stay updated with book recommendations, author interviews, and reading tips.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-100 hover:-translate-y-2 group border border-gray-50 shadow-sm"
                        >
                            {/* Blog Image Container */}
                            <div className="relative aspect-[16/10] w-full overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Category Badge */}
                                <div className="absolute top-4 left-4 bg-[#F7941E] px-4 py-1 rounded-full shadow-lg">
                                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-8 space-y-4">
                                {/* Meta */}
                                <div className="flex items-center gap-2 text-gray-300 font-bold text-[11px]">
                                    <Calendar size={14} className="text-gray-300" />
                                    <span>{post.date}</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-secondary leading-tight min-h-[3.5rem] group-hover:text-[#F7941E] transition-colors">
                                    {post.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 text-[14px] leading-relaxed font-medium line-clamp-2">
                                    {post.description}
                                </p>

                                {/* Action */}
                                <div className="pt-2">
                                    <Link
                                        href={`/blog/${post.id}`}
                                        className="inline-flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest hover:text-[#F7941E] transition-all group/link"
                                    >
                                        Read More
                                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-20 flex justify-center">
                    <button className="bg-black hover:bg-[#F7941E] text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-black/10 active:scale-95">
                        View All Posts
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
