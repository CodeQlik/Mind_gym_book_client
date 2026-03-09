"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function BlogClient() {
    const categories = ["All", "News", "Reviews", "Guides"];
    const latestStories = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1593359556822-7cd096238682?q=80&w=800&auto=format&fit=crop",
            category: "RECOMMENDATIONS",
            date: "Oct 20, 2023",
            title: "10 Must-Read Classics for Your Winter Library",
            excerpt: "As the temperature drops, find comfort in these timeless tales that have shaped literature for generations."
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1497005367839-6e852de72767?q=80&w=800&auto=format&fit=crop",
            category: "INSPIRATION",
            date: "Oct 18, 2023",
            title: "The Art of Building a Minimalist Home Office Library",
            excerpt: "How to organize your space to maximize focus and display your favorite reads without the clutter."
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
            category: "INTERVIEWS",
            date: "Oct 15, 2023",
            title: "Interview: Exploring the World of Independent Publishing",
            excerpt: "We sit down with Sarah Jenkins to discuss the challenges and triumphs of modern self-publishing."
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=800&auto=format&fit=crop",
            category: "GUIDES",
            date: "Oct 12, 2023",
            title: "How to Keep a Reading Journal Effectively",
            excerpt: "Track your thoughts, favorite quotes, and reading goals with these simple journaling techniques."
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
            category: "REVIEWS",
            date: "Oct 10, 2023",
            title: "The Beauty of Traditional Bookbinding",
            excerpt: "A look into the art and history of bookbinding, and why physical books feel so special."
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
            category: "NEWS",
            date: "Oct 08, 2023",
            title: "Mind Gym Extends Store Hours for the Holidays",
            excerpt: "We're giving you more time to explore our shelves and find the perfect gifts for the book lovers in your life."
        }
    ];

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
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFC107]" />
                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#FFC107]">
                                THE READING JOURNAL
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-[4.5rem] sm:text-[5.5rem] lg:text-[6.5rem] leading-[1.0] font-black text-[#1A1A1A] tracking-tighter">
                            Our <span className="text-[#FFC107]">Blog</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[#666666] text-lg sm:text-xl font-medium leading-relaxed max-w-md">
                            Explore stories, expert book recommendations, and daily reading inspiration curated for the modern bibliophile.
                        </p>

                        {/* CTA Row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-4">
                            <Link
                                href="#posts"
                                className="inline-flex items-center justify-center bg-[#FFC107] text-[#1A1A1A] px-8 py-4 rounded-[14px] font-bold text-[14px] hover:bg-[#1A1A1A] hover:text-white transition-all transform hover:-translate-y-1 shadow-[0_15px_30px_-10px_rgba(255,193,7,0.4)]"
                            >
                                Start Reading
                            </Link>

                            {/* Users Info */}
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-[2.5px] border-white overflow-hidden shadow-sm relative z-20">
                                            <Image
                                                src={`https://randomuser.me/api/portraits/women/${60 + i}.jpg`}
                                                alt={`Reader ${i}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-[2.5px] border-white bg-gray-50 flex items-center justify-center shadow-sm z-10 text-[9px] font-black text-[#1A1A1A]">
                                        +2k
                                    </div>
                                </div>
                                <span className="text-[13px] font-bold text-[#888888]">
                                    Joined by 2,000+ readers
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content / Image Area */}
                    <div className="flex-[1.2] relative animate-slide-down w-full max-w-2xl mt-12 lg:mt-0" style={{ animationDelay: '0.2s' }}>

                        {/* Top Right Decorative Ring */}
                        <div className="absolute -top-6 -right-6 md:-top-10 md:-right-8 w-16 h-16 md:w-24 md:h-24 rounded-full border-[3px] border-[#FFC107] z-0"
                            style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)' }} />

                        {/* Bottom Left Decorative Block */}
                        <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 w-32 h-32 md:w-40 md:h-40 bg-[#FFF8E7] rounded-3xl -z-10" />

                        {/* Main Image Frame (White Polaroid style container) */}
                        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] relative z-10">
                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50">
                                <Image
                                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1600&auto=format&fit=crop"
                                    alt="Book lover reading"
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-white/5 pointer-events-none mix-blend-overlay" />
                            </div>
                        </div>

                    </div>

                </section>

                {/* Featured Story Section */}
                <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto" id="posts">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-[#1A1A1A] inline-block relative">
                            Featured Story
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#FFC107]"></span>
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)]">
                        {/* Left Image */}
                        <div className="md:w-3/5 relative min-h-[300px] md:min-h-[400px]">
                            <Image
                                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1600&auto=format&fit=crop"
                                alt="Open book and coffee"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Right Content */}
                        <div className="md:w-2/5 p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                            <div className="text-[11px] font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                                <span className="text-[#FFC107]">Editor's Choice</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="text-[#888888]">Oct 24, 2023</span>
                            </div>

                            <h3 className="text-3xl lg:text-4xl font-black text-[#1A1A1A] mb-5 leading-[1.15] tracking-tight">
                                Why Physical Books Still Dominate the Digital Age
                            </h3>

                            <p className="text-[#666666] font-medium leading-relaxed mb-8 text-[15px]">
                                Despite the rise of e-readers and audiobooks, the tactile experience of a physical book remains unparalleled. We explore the science behind it.
                            </p>

                            <div>
                                <Link
                                    href="/blog/1"
                                    className="inline-flex items-center gap-2 bg-[#FFC107] text-[#1A1A1A] px-6 py-3.5 rounded-xl font-bold text-[13px] hover:bg-black hover:text-white transition-all transform hover:-translate-y-0.5 shadow-sm group"
                                >
                                    Read Full Article
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Latest Stories Section */}
                <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                        <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tight">
                            Latest Stories
                        </h2>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            {categories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${idx === 0 ? "bg-[#FFC107] text-[#1A1A1A] hover:bg-black hover:text-[#FFC107]" : "bg-gray-100/80 text-[#666666] hover:bg-gray-200"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {latestStories.map((story) => (
                            <Link href={`/blog/${story.id}`} key={story.id} className="group bg-white rounded-3xl border border-black/5 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-1">
                                {/* Image Box */}
                                <div className="p-4 md:p-5 pb-0">
                                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-black/5">
                                        <Image
                                            src={story.image}
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
                                            {story.category}
                                        </span>
                                        <span className="text-[11px] font-bold text-[#888888]">
                                            {story.date}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black text-[#1A1A1A] mb-3 leading-tight group-hover:text-[#FFC107] transition-colors">
                                        {story.title}
                                    </h3>

                                    <p className="text-[#666666] text-[14px] leading-relaxed mb-6 font-medium flex-grow line-clamp-3">
                                        {story.excerpt}
                                    </p>

                                    <div className="flex items-center gap-2 text-[#1A1A1A] font-black text-[13px] relative mt-auto group-hover:text-[#FFC107] transition-colors">
                                        <span>Read More</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
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
