"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Share2, Bookmark, CheckCircle2, ChevronRight, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function BlogDetailClient({ id }) {

    // Dummy data simulating a real blog post payload based on the requested ID
    const story = {
        title: "Why Physical Books Still Dominate the Digital Age",
        category: "EDITOR'S CHOICE",
        date: "Oct 24, 2023",
        readTime: "6 min read",
        heroImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2000&auto=format&fit=crop",
        author: {
            name: "Sarah Jenkins",
            role: "Senior Literature Editor",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        content: `
            <p>Despite the meteoric rise of e-readers, tablets, and audiobooks over the last decade, the tactile experience of a physical book remains unparalleled. There's a certain magic to the smell of fresh ink, the texture of the paper, and the physical weight of a story resting in your hands.</p>
            
            <p>In this article, we'll dive deep into the psychological and sensory reasons why print media continues to hold its ground against its digital counterparts, proving that convenience isn't always king when it comes to the reading experience.</p>
            
            <h2>The Sensory Connection to Reading</h2>
            <p>Recent psychological studies suggest that the physical act of turning a page creates a "mental map" of the narrative. Unlike scrolling down an endless digital screen, readers of physical books can visually and tangibly track their progress. This spatial mapping not only aids in memory retention but also provides a deeply satisfying sense of accomplishment as the unread pages grow thinner.</p>
            
            <blockquote class="my-8 pl-6 border-l-4 border-[#FFC107] italic text-2xl text-[#1A1A1A] font-medium leading-relaxed bg-[#FFF8E7]/50 p-6 rounded-r-xl">
                "A book is a physical artifact. It has a spine, it has pages, it has a scent. It's a three-dimensional object that demands to be interacted with."
            </blockquote>

            <h2>Escaping the Screen</h2>
            <p>In an era where our lives are dominated by glowing rectangles, picking up a physical book offers a much-needed respite for our eyes and our minds. Digital screens emit blue light, which can disrupt sleep patterns and cause eye strain. Moreover, reading on a multi-purpose device constantly tempts us with notifications, emails, and social media updates.</p>

            <p>A physical book serves a single, dedicated purpose. When you open it, you are making a conscious decision to disconnect from the digital noise and immerse yourself entirely in another world. This focused attention is becoming increasingly rare and valuable.</p>
            
            <div class="my-10 w-full relative aspect-[16/9] rounded-2xl overflow-hidden shadow-sm">
                <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1600&auto=format&fit=crop" class="w-full h-full object-cover" alt="Vintage bookbinding tools" />
            </div>

            <h2>The Aesthetic and Collector's Value</h2>
            <p>Physical books are more than just vessels for text; they are design objects. Beautiful cover art, stylized typography, and high-quality paper all contribute to the aesthetic pleasure of owning a book.</p>

            <p>A well-curated library is a reflection of a person's journey, interests, and identity. Displaying books in our homes serves as a conversation starter and a personal gallery. The spine of a favorite novel on a shelf is like a trusted friend waiting to be revisited, something an invisible file on an e-reader can never replicate.</p>
        `
    };

    return (
        <div className="bg-[#FFFFFE] min-h-screen font-['Inter',sans-serif]">
            {/* Custom Prose Styles for the HTML body */}
            <style jsx global>{`
                .blog-content p {
                    color: #444444;
                    font-size: 1.125rem;
                    line-height: 1.8;
                    margin-bottom: 2rem;
                }
                .blog-content h2 {
                    color: #1A1A1A;
                    font-size: 2rem;
                    font-weight: 900;
                    letter-spacing: -0.02em;
                    margin-top: 4rem;
                    margin-bottom: 1.5rem;
                }
            `}</style>

            <main className="pt-28 pb-20">
                {/* Back Link */}
                <div className="max-w-[800px] mx-auto px-6 mb-8 mt-12">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-[#888888] hover:text-[#FFC107] font-bold text-sm transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to all stories
                    </Link>
                </div>

                {/* Hero Header Article Info */}
                <header className="max-w-[800px] mx-auto px-6 text-center animate-slide-down">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#FFC107]">
                            {story.category}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="text-[13px] font-bold text-[#888888]">
                            {story.date}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="text-[13px] font-bold text-[#888888]">
                            {story.readTime}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-black text-[#1A1A1A] leading-[1.1] tracking-tighter mb-10">
                        {story.title}
                    </h1>

                    {/* Author Meta */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                            <Image src={story.author.avatar} fill className="object-cover" alt={story.author.name} />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[15px] font-black justify-start text-[#1A1A1A] flex items-center gap-1.5">
                                {story.author.name}
                                <CheckCircle2 size={16} className="text-[#10B981]" />
                            </h4>
                            <p className="text-[13px] font-medium text-[#888888]">{story.author.role}</p>
                        </div>
                    </div>
                </header>

                {/* Main Hero Default Image */}
                <div className="w-full max-w-[1200px] mx-auto px-6 mb-16 animate-slide-down" style={{ animationDelay: '0.1s' }}>
                    <div className="relative w-full aspect-[21/9] md:aspect-[2.5/1] rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
                        <Image
                            src={story.heroImage}
                            alt={story.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Content Layout */}
                <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row gap-16 relative">
                    
                    {/* Sticky Sidebar Share Tools */}
                    <div className="hidden lg:block w-16 relative">
                        <div className="sticky top-32 flex flex-col gap-4">
                            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 bg-white">
                                <Facebook size={20} />
                            </button>
                            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400 transition-all hover:-translate-y-1 bg-white">
                                <Twitter size={20} />
                            </button>
                            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-700 hover:border-blue-700 transition-all hover:-translate-y-1 bg-white">
                                <Linkedin size={20} />
                            </button>
                            <div className="w-12 h-[1px] bg-gray-200 my-2 mx-auto"></div>
                            <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#1A1A1A] hover:bg-[#FFC107] transition-all hover:-translate-y-1">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Article HTML Body Area */}
                    <article className="flex-1 max-w-[760px] mx-auto lg:mx-0 w-full animate-slide-down" style={{ animationDelay: '0.2s' }}>
                        
                        <div 
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: story.content }}
                        />

                        {/* Article Footer Tags & Actions */}
                        <div className="mt-16 pt-10 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex gap-3">
                                <span className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-bold text-[#666666]">#Literature</span>
                                <span className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-bold text-[#666666]">#Design</span>
                                <span className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-bold text-[#666666]">#Lifestyle</span>
                            </div>
                            
                            <button className="flex items-center gap-2 text-sm font-black text-[#1A1A1A] hover:text-[#FFC107] transition-colors">
                                <Bookmark size={18} />
                                Save Story
                            </button>
                        </div>
                    </article>
                    
                    {/* Empty Right Column for balance */}
                    <div className="hidden lg:block w-32 xl:w-64"></div>
                </div>

                {/* Read Next Section */}
                <section className="max-w-[1200px] mx-auto px-6 mt-32">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-3xl font-black text-[#1A1A1A]">Read Next</h3>
                        <Link href="/blog" className="text-sm font-bold text-[#FFC107] hover:text-black transition-colors flex items-center gap-1">
                            View all articles <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                id: 2,
                                image: "https://images.unsplash.com/photo-1497005367839-6e852de72767?q=80&w=800&auto=format&fit=crop",
                                category: "INSPIRATION",
                                title: "The Art of Building a Minimalist Home Office Library"
                            },
                            {
                                id: 4,
                                image: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=800&auto=format&fit=crop",
                                category: "GUIDES",
                                title: "How to Keep a Reading Journal Effectively"
                            },
                            {
                                id: 5,
                                image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
                                category: "REVIEWS",
                                title: "The Beauty of Traditional Bookbinding"
                            }
                        ].map((item) => (
                            <Link href={`/blog/${item.id}`} key={item.id} className="group flex flex-col cursor-pointer mt-8">
                                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-gray-50 border border-black/5">
                                    <Image 
                                        src={item.image} 
                                        alt={item.title} 
                                        fill 
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#FFC107] mb-2">{item.category}</span>
                                <h4 className="text-xl font-black text-[#1A1A1A] leading-tight group-hover:text-[#FFC107] transition-colors line-clamp-2">
                                    {item.title}
                                </h4>
                            </Link>
                        ))}
                    </div>
                </section>
                
            </main>
        </div>
    );
}
