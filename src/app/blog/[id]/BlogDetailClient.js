"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
    ArrowLeft, Share2, Bookmark, CheckCircle2, ChevronRight, 
    Facebook, Twitter, Linkedin, Loader2, Clock, Calendar, 
    User, MessageSquare, Tag, BookmarkPlus, ArrowRight
} from 'lucide-react';
import api from "@/lib/axios";
import { toast } from 'react-toastify';

export default function BlogDetailClient({ id }) {
    const [story, setStory] = useState(null);
    const [readNext, setReadNext] = useState([]);
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const response = await api.get(`/blogs/${id}`);
                if (response.data.success) {
                    setStory(response.data.data);
                    setLoading(false);
                    
                    try {
                        const allBlogsRes = await api.get("/blogs");
                        if (allBlogsRes.data.success) {
                            setAllBlogs(allBlogsRes.data.data);
                            const others = allBlogsRes.data.data
                                .filter(b => b.id !== response.data.data.id)
                                .slice(0, 3);
                            setReadNext(others);
                        }
                    } catch (err) {
                        console.error("Error fetching related blogs:", err);
                    }
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching blog detail:", error);
                setLoading(false);
            }
        };

        fetchBlogDetail();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const calculateReadTime = (content) => {
        if (!content) return "1 MIN READ";
        const wordsPerMinute = 200;
        const noOfWords = content.split(/\s/g).length;
        const minutes = noOfWords / wordsPerMinute;
        return `${Math.ceil(minutes)} MIN READ`;
    };

    // Calculate Prev/Next
    const currentIdx = allBlogs.findIndex(b => (b.slug || b.id.toString()) === id.toString() || b.id === story?.id);
    const prevStory = currentIdx > 0 ? allBlogs[currentIdx - 1] : null;
    const nextStory = currentIdx !== -1 && currentIdx < allBlogs.length - 1 ? allBlogs[currentIdx + 1] : null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#FFC107]" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400 font-sans">Curating Story...</span>
                </div>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center font-sans">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-8">
                    <MessageSquare size={48} />
                </div>
                <h2 className="text-4xl font-black text-[#1A1A1A] mb-4 tracking-tight">Story Not Found</h2>
                <Link href="/blog" className="px-8 py-4 bg-[#FFC107] text-[#1A1A1A] font-black text-sm rounded-xl hover:bg-black hover:text-white transition-all shadow-lg active:scale-95 uppercase tracking-widest">
                    Back to Blog Home
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#FFFFFE] min-h-screen selection:bg-[#FFC107] selection:text-[#1A1A1A] font-sans overflow-x-hidden">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
                
                .editorial-content {
                    font-family: 'Inter', sans-serif;
                }
                .editorial-content p {
                    color: #4B5563;
                    font-size: 1.125rem;
                    line-height: 1.8;
                    margin-bottom: 2rem;
                    font-weight: 400;
                }
                .editorial-content h2 {
                    color: #1A1A1A;
                    font-size: 2rem;
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    margin-top: 3.5rem;
                    margin-bottom: 1.25rem;
                    line-height: 1.2;
                    position: relative;
                }
                .editorial-content h2::after {
                    content: '';
                    position: absolute;
                    bottom: -8px;
                    left: 0;
                    width: 40px;
                    height: 3px;
                    background-color: #FFC107;
                }
                .editorial-content blockquote {
                    background-color: #FFFDF8;
                    border-left: 4px solid #FFC107;
                    padding: 2.5rem 3rem;
                    font-style: italic;
                    font-size: 1.25rem;
                    color: #1A1A1A;
                    margin: 3.5rem 0;
                    line-height: 1.7;
                    font-weight: 500;
                }
                .editorial-content img {
                    border-radius: 1rem;
                    margin: 3.5rem 0;
                    width: 100%;
                }
                .expert-quote {
                    background-color: #F8F9FA;
                    border-radius: 1rem;
                    padding: 2.5rem;
                    margin: 3.5rem 0;
                }
                .expert-quote-label {
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    color: #FFC107;
                    margin-bottom: 1rem;
                    display: block;
                }
                .expert-quote p {
                    font-size: 15px;
                    font-style: italic;
                    font-weight: 600;
                    color: #1A1A1A;
                    margin: 0;
                    line-height: 1.6;
                }
            `}</style>

            <main className="pt-24 pb-32">
                {/* Back Navigation */}
                <div className="max-w-[900px] mx-auto px-6 mb-12">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-[#999999] hover:text-[#FFC107] font-black text-[12px] uppercase tracking-widest transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to articles
                    </Link>
                </div>

                {/* Hero Image Block First */}
                <div className="max-w-[1100px] mx-auto px-6 mb-16 relative">
                    <div className="relative aspect-[16/9] rounded-[1.5rem] overflow-hidden shadow-2xl shadow-black/5 bg-gray-50 border border-gray-100">
                        <Image
                            src={story.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2600&auto=format&fit=crop"}
                            alt={story.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Article Header Now Below Image */}
                <header className="max-w-[900px] mx-auto px-6 text-left mb-16">
                    <div className="flex flex-col items-start">
                        <span className="text-[#FFC107] text-[10px] font-black uppercase tracking-[0.25em] mb-6 inline-block border-b-2 border-[#FFC107]/20 pb-1">
                            {story.category?.name || "INSIGHTS"}
                        </span>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-[4.2rem] font-bold text-[#1A1A1A] leading-[1.1] tracking-tighter mb-10 font-['Playfair_Display',serif]">
                            {story.title}
                        </h1>

                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-start w-full">
                            {/* Author Box */}
                            <div className="flex items-center gap-3">
                                <div className="relative w-9 h-9 rounded-full overflow-hidden grayscale contrast-125">
                                    <Image 
                                        src={`https://ui-avatars.com/api/?name=${story.author || "Admin"}&background=1A1A1A&color=FFFFFF&bold=true`} 
                                        fill 
                                        className="object-cover" 
                                        alt={story.author || "Admin"} 
                                    />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-[13px] font-black text-[#1A1A1A]">{story.author || "Global Admin"}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Story Author</p>
                                </div>
                            </div>
                            
                            <div className="h-6 w-px bg-gray-100 hidden sm:block"></div>
                            
                            {/* Meta Metrics */}
                            <div className="flex items-center gap-4 text-[13px] font-bold text-gray-400">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-gray-300" />
                                    <span>{formatDate(story.created_at)}</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} className="text-gray-300" />
                                    <span className="text-[#FFC107]">{calculateReadTime(story.content)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Article Content Layout */}
                <div className="max-w-[850px] mx-auto px-6 editorial-content">
                    
                    {/* Initial Quote Block (Dynamic Excerpt) */}
                    {story.excerpt && (
                        <blockquote>
                            &ldquo;{story.excerpt}&rdquo;
                        </blockquote>
                    )}

                    {/* Main Content Body */}
                    <div 
                        className="blog-body mb-20 excerpt-p-only" 
                        dangerouslySetInnerHTML={{ __html: story.content }} 
                    />
                </div>

            </main>
        </div>
    );
}
