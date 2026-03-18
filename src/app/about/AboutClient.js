"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    Star,
    Sparkles,
    Award
} from "lucide-react";
import TestimonialSection from "@/component/TestimonialSection";

import AboutBookShowcase from "@/component/AboutBookShowcase";

const AboutClient = () => {
    return (
        <div className="bg-[#FFFFFF] min-h-screen font-['Inter',sans-serif]">
            {/* Custom Styles for Squiggle and Serif Font */}
            <style jsx>{`
                .about-title {
                    font-size: clamp(3.5rem, 9vw, 5.5rem);
                    line-height: 1;
                }
                .squiggle-container {
                    position: relative;
                    display: inline-block;
                }
                .squiggle-container::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 0;
                    width: 100%;
                    height: 12px;
                    background-image: url("data:image/svg+xml,%3Csvg width='200' height='20' viewBox='0 0 200 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 15C20 15 30 5 50 5C70 5 80 15 100 15C120 15 130 5 150 5C170 5 180 15 198 15' stroke='%23000000' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E");
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                .serif-font {
                    font-family: 'Cormorant Garamond', serif;
                }
            `}</style>

            <main>
                {/* Hero Section Container */}
                <div className="pt-30 pb-12 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative">
                        {/* Background Decorative Blobs */}
                        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#F7941E]/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 -translate-y-1/2 opacity-60" />

                        {/* Left Content Side */}
                        <div className="flex-1 space-y-6 z-10 animate-slide-down">
                            <div className="inline-block px-4 py-1.5 rounded-full border border-black/10 bg-black/5 text-[9px] font-black uppercase tracking-[0.2em] text-[#000000]">
                                Our Heritage
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-[#000000] tracking-tight leading-tight">
                                About Our <br />
                                <span className="squiggle-container">Bookstore</span>
                            </h1>

                            <p className="text-base md:text-lg text-[#666666] leading-relaxed max-w-xl font-medium">
                                Where every spine tells a story and every page holds a dream. We are curators of imagination, providing a sanctuary for the curious mind.
                            </p>
                        </div>

                        {/* Right Image Side */}
                        <div className="flex-1 relative animate-slide-down" style={{ animationDelay: '0.2s' }}>
                            <div className="relative aspect-square md:aspect-[5/4] w-full rounded-[32px] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)]">
                                <Image
                                    src="/images/about_hero.png"
                                    alt="Modern Bookstore Interior"
                                    fill
                                    className="object-cover transition-transform duration-1000 hover:scale-105"
                                    priority
                                />
                            </div>

                            {/* Top Accent Bloom */}
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#F7941E]/15 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                </div>

                {/* How It All Started Section - Redesigned for Mobile & Desktop */}
                <section className="bg-gray-50 py-16 md:py-24 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-20">
                        
                        {/* 1. History Text Section */}
                        <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                            <div className="space-y-4">
                                <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                    Our Legacy
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black text-secondary tracking-tight leading-tight">
                                    How It <span className="text-primary italic serif-font">All Started</span>
                                </h2>
                                <div className="w-20 h-1.5 bg-primary rounded-full mx-auto lg:mx-0" />
                            </div>

                            <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed font-medium">
                                <p>
                                    Mind Gym Book began as a humble initiative with a simple yet powerful mission: to bring the joy of reading to every curious mind. Our journey started with a carefully curated selection of books, driven by the belief that a great book is more than just paper and ink—it's a gateway to new perspectives and endless wisdom.
                                </p>
                                <p>
                                    Today, we have evolved into a premier destination for book lovers worldwide. While our reach has grown, our heart remains the same: we are dedicated to connecting readers with the stories and knowledge that inspire, educate, and transform lives. At Mind Gym, we don't just provide books; we nurture the intellectual and emotional growth of our community.
                                </p>
                            </div>
                        </div>

                        {/* 2. Overlapping Images Section - Fixed for Mobile */}
                        <div className="w-full lg:w-1/2 relative h-[450px] md:h-[550px] mt-12 lg:mt-0 flex items-center justify-center lg:block">
                            {/* Decorative Blur Background */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[100px] -z-10" />

                            {/* Image 1: Back Image */}
                            <div className="absolute top-0 left-4 md:left-10 w-[60%] lg:w-[65%] aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl z-10 transform -rotate-6 hover:rotate-0 transition-all duration-700 border-4 border-white/50">
                                <Image
                                    src="/images/about_history_1.png"
                                    alt="Vintage Stacked Books"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Image 2: Front Image */}
                            <div className="absolute bottom-4 right-4 md:right-10 w-[60%] lg:w-[65%] aspect-[3/4] rounded-[40px] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] z-20 transform translate-y-6 rotate-3 hover:rotate-0 transition-all duration-700 border-[8px] md:border-[12px] border-white">
                                <Image
                                    src="/images/about_history_2.png"
                                    alt="Open Book on Table"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* What You'll Find Here Section - White Background */}
                <section className="bg-white py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                        <div className="max-w-3xl mx-auto mb-8 space-y-2">
                            <h2 className="serif-font text-[36px] md:text-[48px] font-bold text-[#000000] leading-tight">
                                What You'll Find Here
                            </h2>
                            <p className="text-[#666666] text-base font-medium leading-relaxed">
                                From timeless classics to modern masterpieces, explore a world of literature tailored for your taste.
                            </p>
                            <div className="w-14 h-1 bg-[#F7941E] mx-auto rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    title: "Popular Picks",
                                    desc: "Top trending stories and global bestsellers curated for you.",
                                    icon: <Star />,
                                    delay: "0.1s"
                                },
                                {
                                    title: "Fresh Arrivals",
                                    desc: "Explore the latest additions to our ever-growing library.",
                                    icon: <Sparkles />,
                                    delay: "0.2s"
                                },
                                {
                                    title: "Diverse Genres",
                                    desc: "From fiction to business, find books for every curiosity.",
                                    icon: <BookOpen />,
                                    delay: "0.3s"
                                },
                                {
                                    title: "Highest Rated",
                                    desc: "Exceptional titles highly recommended by our readers.",
                                    icon: <Award />,
                                    delay: "0.4s"
                                }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-white p-8 md:p-10 rounded-[32px] border border-black/5 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 group animate-slide-down text-center"
                                    style={{ animationDelay: item.delay }}
                                >
                                    <div className="w-16 h-16 bg-[#F7941E]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#F7941E] group-hover:rotate-6 transition-all duration-500">
                                        {React.cloneElement(item.icon, {
                                            className: "text-[#F7941E] group-hover:text-white transition-colors duration-500",
                                            size: 28
                                        })}
                                    </div>
                                    <h3 className="text-xl font-black text-[#000000] mb-3 tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-[14px] text-[#666666] leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <AboutBookShowcase />
                <TestimonialSection bgColor="bg-gray-100" />


                {/* Final CTA Section */}
                <section className="py-12 px-6 md:px-12 bg-white">
                    <div className="max-w-7xl mx-auto bg-[#1A1A1A] rounded-[32px] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F7941E]/10 rounded-full -ml-16 -mb-16 blur-3xl" />

                        <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-slide-down">
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                                Ready to Start Your Next <br />
                                <span className="text-[#F7941E] italic serif-font">Literary Journey?</span>
                            </h2>

                            <p className="text-gray-400 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
                                Join our newsletter to get exclusive access to new releases, author interviews, and monthly reading lists curated by our experts.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <Link href="/books" className="w-full sm:w-auto px-8 py-4 bg-[#F7941E] text-black rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-xl shadow-[#F7941E]/20">
                                    Explore Books
                                </Link>
                                <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#F7941E] transition-all transform hover:-translate-y-1 shadow-xl shadow-black/10">
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AboutClient;
