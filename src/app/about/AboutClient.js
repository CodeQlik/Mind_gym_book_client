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
import FAQSection from "@/component/FAQSection";

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

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                                <Link href="/books" className="w-full sm:w-auto px-8 py-4 bg-[#000000] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#F7941E] transition-all transform hover:-translate-y-1 shadow-2xl shadow-black/20 flex items-center justify-center gap-3">
                                    Explore Collection
                                    <ArrowRight size={14} />
                                </Link>
                                <Link href="/method" className="w-full sm:w-auto px-8 py-4 bg-white border border-black/10 text-[#000000] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black/5 transition-all flex items-center justify-center">
                                    Learn Our Method
                                </Link>
                            </div>
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

                            {/* Stats Floating Card */}
                            <div className="absolute -bottom-4 -left-4 md:-left-8 bg-white p-4 md:p-6 rounded-[24px] shadow-2xl border border-black/5 z-20 transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex flex-col space-y-0.5">
                                    <span className="text-2xl md:text-3xl font-black text-[#000000] tracking-tighter">15,000+</span>
                                    <span className="text-[9px] md:text-[10px] font-black text-[#666666] uppercase tracking-[0.2em]">Curated Titles</span>
                                </div>
                            </div>

                            {/* Top Accent Bloom */}
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#F7941E]/15 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                </div>

                {/* How It All Started Section - Full Width Background */}
                <section className="bg-gray-100 py-20 md:py-24">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Left: Overlapping Images */}
                        <div className="flex-1 relative w-full h-[350px] md:h-[420px] mt-10">
                            {/* Image 1: Stacked Books (Back) */}
                            <div className="absolute top-0 left-0 w-3/5 md:w-2/3 aspect-[3/4] rounded-[24px] overflow-hidden shadow-2xl z-10 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                <Image
                                    src="/images/about_history_1.png"
                                    alt="Vintage Stacked Books"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Image 2: Open Book (Front) */}
                            <div className="absolute bottom-0 right-0 w-3/5 md:w-2/3 aspect-[3/4] rounded-[24px] overflow-hidden shadow-2xl z-20 transform translate-y-6 md:translate-y-8 rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white">
                                <Image
                                    src="/images/about_history_2.png"
                                    alt="Open Book on Table"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Right: History Text */}
                        <div className="flex-1 space-y-6">
                            <div className="space-y-3">
                                <h2 className="text-3xl md:text-4xl font-black text-[#000000] tracking-tight">
                                    How It All Started
                                </h2>
                                <div className="w-16 h-1.5 bg-[#000000] rounded-full" />
                            </div>

                            <div className="space-y-4 text-[#666666] text-base leading-relaxed font-medium">
                                <p>
                                    Lumina Books began in 2012 as a small corner shop with a single shelf of hand-picked classics. Our founder, Eleanor Vance, believed that in a world turning increasingly digital, the physical touch of paper and the smell of ink held a magic that could never be replaced.
                                </p>
                                <p>
                                    Over a decade later, we've grown into a digital destination for bibliophiles worldwide, but our core philosophy remains unchanged: every book we sell is a gateway to a new world. We don't just sell books; we connect souls with the wisdom of the ages.
                                </p>
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
                                    title: "Popular Books",
                                    desc: "Explore the trending and bestselling titles that are capturing the world's imagination today.",
                                    icon: <Star />,
                                    delay: "0.1s"
                                },
                                {
                                    title: "New Arrivals",
                                    desc: "Stay ahead of the curve with our latest books, added regularly across all major genres.",
                                    icon: <Sparkles />,
                                    delay: "0.2s"
                                },
                                {
                                    title: "Different Genres",
                                    desc: "Fiction, business, self-help, kids, and more. A diverse library curated for every curiosity.",
                                    icon: <BookOpen />,
                                    delay: "0.3s"
                                },
                                {
                                    title: "Top Rated Books",
                                    desc: "Discover titles loved and highly recommended by our passionate community of readers.",
                                    icon: <Award />,
                                    delay: "0.4s"
                                }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-white p-8 md:p-10 rounded-[32px] border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group animate-slide-down text-center"
                                    style={{ animationDelay: item.delay }}
                                >
                                    <div className="w-14 h-14 bg-[#F7941E]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#F7941E] group-hover:text-white transition-colors duration-500">
                                        {React.cloneElement(item.icon, {
                                            className: "text-[#F7941E] group-hover:text-white transition-colors duration-500",
                                            size: 26
                                        })}
                                    </div>
                                    <h3 className="text-xl font-black text-[#000000] mb-4 tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-[#666666] leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <TestimonialSection bgColor="bg-gray-100" />
                <FAQSection />

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
