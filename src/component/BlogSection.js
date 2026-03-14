"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Loader2 } from "lucide-react";
import api from "@/lib/axios";

const BlogSection = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.get("/blogs");
                if (response.data.success) {
                    setBlogs(response.data.data.slice(0, 3) || []);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) return null;
    if (blogs.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16">
                   
                    <h2 className="text-[42px] md:text-[52px] font-bold text-[#1A1A1A] mb-4 tracking-tight leading-tight italic">
                        Latest Articles
                    </h2>
                    <p className="max-w-2xl text-gray-400 font-medium text-base">
                        Stay updated with book recommendations, author interviews, and reading tips.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogs.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-[1.8rem] overflow-hidden shadow-[0_15px_50px_-20px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col h-full"
                        >
                            {/* Image Container with Padding like Screenshot */}
                            <div className="p-3 pb-0">
                                <div className="relative aspect-[16/10] w-full rounded-[1.2rem] overflow-hidden bg-gray-50">
                                    <Image
                                        src={post.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Yellow Badge exactly like Screenshot */}
                                    <div className="absolute top-4 left-4 bg-[#FFC107] px-3.5 py-1.5 rounded-lg shadow-sm">
                                        <span className="text-[9px] font-black text-[#1A1A1A] uppercase tracking-wider">
                                            {post.category?.name || "Book Lists"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-8 pt-6 flex flex-col flex-1">
                                {/* Date Section - Grey as per Screenshot */}
                                <div className="flex items-center gap-2 text-yellow-600 font-bold text-[11px] mb-4">
                                    <Calendar size={13} className="text-yellow-600" />
                                    <span>{formatDate(post.created_at)}</span>
                                </div>

                                <h3 className="text-[19px] font-bold text-[#1A1A1A] leading-tight mb-3">
                                    {post.title}
                                </h3>

                                <p className="text-black text-[14px] leading-relaxed font-medium mb-6 line-clamp-2">
                                    {post.excerpt || post.content?.substring(0, 100).replace(/<[^>]*>?/gm, '') + "..."}
                                </p>

                                <div className="mt-auto">
                                    <Link
                                        href={`/blog/${post.slug || post.id}`}
                                        className="inline-flex items-center gap-2 text-yellow-600 font-black text-[13px] hover:text-[#FFC107] transition-all group"
                                    >
                                        Read More
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
