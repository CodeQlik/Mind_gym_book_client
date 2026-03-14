"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Loader2 } from "lucide-react";
import api from "@/lib/axios";

export default function BlogClient() {
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [blogsRes, catsRes] = await Promise.all([
                    api.get("/blogs"),
                    api.get("/category/all")
                ]);

                if (blogsRes.data.success) {
                    setBlogs(blogsRes.data.data || []);
                }

                if (catsRes.data.success) {
                    const fetchedCats = catsRes.data.data.categories || catsRes.data.data || [];
                    const catNames = ["All", ...fetchedCats.map(c => c.name)];
                    setCategories(catNames);
                }
            } catch (error) {
                console.error("Error fetching blog data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    };

    const filteredBlogs = selectedCategory === "All" 
        ? blogs 
        : blogs.filter(b => b.category?.name === selectedCategory);

    const featuredPost = blogs[0]; // Latest blog as featured
    const otherPosts = filteredBlogs.filter(b => b.id !== featuredPost?.id);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 animate-spin text-[#FFC107]" />
            </div>
        );
    }

    return (
        <div className="bg-[#FFFFFE] min-h-screen font-['Inter',sans-serif] overflow-hidden">
            <main>
                <section className="relative pt-32 md:pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">

                    {/* Background Soft Glow */}
                    <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#FFF8E7]/60 rounded-full blur-[120px] -z-10 -translate-x-1/4 -translate-y-1/2" />

                    {/* Left Content */}
                    <div className="flex-[1] space-y-8 animate-slide-down relative z-10 w-full max-w-xl">

                        {/* Topic Badge */}
                        <div className="inline-flex items-center gap-2 bg-[#FFFDF9] px-4 py-2 rounded-full border border-[#FFC107]/20 shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FFC107]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC107]">
                                THE READING JOURNAL
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-[4rem] sm:text-[5rem] lg:text-[6rem] leading-[1.05] font-black text-[#1A1A1A] tracking-tighter">
                            Our <span className="text-yellow-500">Blog</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[#666666] text-lg font-medium leading-relaxed max-w-sm">
                            Explore stories, expert book recommendations, and daily reading inspiration curated for the modern bibliophile.
                        </p>

                        {/* CTA Row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
                            <button
                                onClick={() => document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' })}
                                className="inline-flex items-center justify-center bg-yellow-500 text-white px-10 py-4 rounded-xl font-black text-[14px] hover:bg-[#1A1A1A] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#CA8A04]/20 active:scale-95 whitespace-nowrap"
                            >
                                Start Reading
                            </button>
                        </div>
                    </div>

                    {/* Right Content / Image Area */}
                    <div className="flex-[1.2] relative animate-slide-down w-full max-w-2xl mt-12 lg:mt-0" style={{ animationDelay: '0.2s' }}>

                        {/* Top Right Decorative Ring */}
                        <div className="absolute -top-10 -right-4 w-20 h-20 rounded-full border-[3px] border-[#CA8A04] border-t-transparent border-l-transparent rotate-[15deg] z-0 opacity-80" />

                        {/* Bottom Left Decorative Block */}
                        <div className="absolute -bottom-8 -left-8 md:-bottom-10 md:-left-10 w-32 h-32 md:w-36 md:h-36 bg-[#FFF8E7] rounded-[2rem] -z-10" />

                        {/* Main Image Frame (White Polaroid style container) */}
                        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] relative z-10 border border-black/5">
                            <div className="relative w-full aspect-[4/3] rounded-[1.8rem] overflow-hidden bg-gray-50">
                                <Image
                                    src="/blog_hero.png"
                                    alt="Our Blog Reading Community"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-white/5 pointer-events-none mix-blend-overlay" />
                            </div>
                        </div>
                    </div>

                </section>

                {/* Featured Story Section */}
                {featuredPost && (
                    <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto" id="posts">
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="text-3xl font-black text-[#1A1A1A] inline-block relative">
                                Featured Story
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#FFC107]"></span>
                            </h2>
                        </div>

                        <div className="bg-white rounded-3xl border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)]">
                            {/* Left Image */}
                            <div className="md:w-3/5 relative min-h-[300px] md:min-h-[400px]">
                                <Image
                                    src={featuredPost.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1600&auto=format&fit=crop"}
                                    alt={featuredPost.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Right Content */}
                            <div className="md:w-2/5 p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                                <div className="text-[11px] font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                                    <span className="text-[#FFC107]">{featuredPost.category?.name || "Editor's Choice"}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="text-[#888888]">{formatDate(featuredPost.created_at)}</span>
                                </div>

                                <h3 className="text-3xl lg:text-4xl font-black text-[#1A1A1A] mb-5 leading-[1.15] tracking-tight">
                                    {featuredPost.title}
                                </h3>

                                <p className="text-[#666666] font-medium leading-relaxed mb-8 text-[15px] line-clamp-3">
                                    {featuredPost.excerpt || featuredPost.content?.substring(0, 150).replace(/<[^>]*>?/gm, '') + "..."}
                                </p>

                                <div>
                                    <Link
                                        href={`/blog/${featuredPost.slug || featuredPost.id}`}
                                        className="inline-flex items-center gap-2 bg-[#FFC107] text-[#1A1A1A] px-6 py-3.5 rounded-xl font-bold text-[13px] hover:bg-black hover:text-white transition-all transform hover:-translate-y-0.5 shadow-sm group"
                                    >
                                        Read Full Article
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                        <div className="space-y-1">
                            <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tight">
                                {selectedCategory === "All" ? "Latest Stories" : `${selectedCategory} Collection`}
                            </h2>
                            <p className="text-[#888888] font-bold text-[11px] uppercase tracking-widest">
                                Discover our latest writings
                            </p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            {categories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? "bg-[#FFC107] text-[#1A1A1A] hover:bg-black hover:text-[#FFC107]" : "bg-gray-100/80 text-[#666666] hover:bg-gray-200"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    {otherPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {otherPosts.map((story) => (
                                <Link href={`/blog/${story.slug || story.id}`} key={story.id} className="group bg-white rounded-3xl border border-black/5 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-1">
                                    {/* Image Box */}
                                    <div className="p-4 md:p-5 pb-0">
                                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-black/5">
                                            <Image
                                                src={story.image || "https://images.unsplash.com/photo-1593359556822-7cd096238682?q=80&w=800&auto=format&fit=crop"}
                                                alt={story.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    </div>

                                    {/* Content Box */}
                                    <div className="p-6 md:p-8 pt-6 flex flex-col flex-grow">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#FFC107]">
                                                {story.category?.name || "General"}
                                            </span>
                                            <span className="text-[11px] font-bold text-[#888888]">
                                                {story.created_at ? formatDate(story.created_at) : "Recent"}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-black text-[#1A1A1A] mb-3 leading-tight group-hover:text-[#FFC107] transition-colors line-clamp-2">
                                            {story.title}
                                        </h3>

                                        <p className="text-[#666666] text-[14px] leading-relaxed mb-6 font-medium flex-grow line-clamp-3">
                                            {story.excerpt || story.content?.substring(0, 100).replace(/<[^>]*>?/gm, '') + "..."}
                                        </p>

                                        <div className="flex items-center gap-2 text-[#1A1A1A] font-black text-[13px] relative mt-auto  transition-colors">
                                            <span>Read More</span>
                                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No stories found in this category yet</p>
                        </div>
                    )}
                </section>

                {/* Bottom CTA Section */}
                <section className="py-24 px-6 md:px-12 text-center max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black tracking-tight text-[#1A1A1A] mb-6 leading-[1.1]">
                        Find Your Next <span className="text-[#FFC107] relative inline-block">
                            Favorite Book
                            <span className="absolute -bottom-1 left-0 w-full h-1.5 md:h-2 bg-[#FFC107]"></span>
                        </span>
                    </h2>

                    <p className="text-[#666666] text-lg font-medium mb-10">
                        Browse our curated collection of over 50,000 titles and start your next adventure today.
                    </p>

                    <Link
                        href="/books"
                        className="inline-block bg-[#FFC107] text-[#1A1A1A] font-black text-[15px] px-10 py-5 rounded-[14px] hover:bg-black hover:text-white transition-all transform hover:-translate-y-1 shadow-[0_15px_30px_-10px_rgba(255,193,7,0.4)]"
                    >
                        Explore Books Online
                    </Link>
                </section>
            </main>
        </div>
    );
}
