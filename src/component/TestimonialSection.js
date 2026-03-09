'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Rajesh Kumar",
        location: "Delhi",
        text: "The selection of books on Mind Gym is incredible. I found exactly what I needed to improve my focus and productivity. Highly recommended!",
        rating: 5,
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        service: "Personal Growth"
    },
    {
        id: 2,
        name: "Priya Sharma",
        location: "Mumbai",
        text: "I was looking for a specific management book for weeks. Mind Gym Book delivered it in perfect condition. Great customer service!",
        rating: 5,
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        service: "Management"
    },
    {
        id: 3,
        name: "Amit Patel",
        location: "Ahmedabad",
        text: "The premium collection is truly one of a kind. The quality of books and the curated categories make it my go-to online bookstore.",
        rating: 5,
        image: "https://randomuser.me/api/portraits/men/85.jpg",
        service: "Premium Books"
    },
    {
        id: 4,
        name: "Anjali Singh",
        location: "Bangalore",
        text: "Navigating the website is so easy. I love the 'Mind Gym' concept. It's more than just a bookstore; it's a mental fitness hub.",
        rating: 5,
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        service: "Website Experience"
    },
    {
        id: 25,
        name: "Vikram Mehta",
        location: "Pune",
        text: "Authentic titles and fast delivery. I've ordered multiple times and the experience has been consistently excellent.",
        rating: 5,
        image: "https://randomuser.me/api/portraits/men/22.jpg",
        service: "Delivery"
    },
    {
        id: 6,
        name: "Sonal Gupta",
        location: "Jaipur",
        text: "The books recommended under the 'Trending' section are spot on. It has helped me stay updated with the best reads in the industry.",
        rating: 5,
        image: "https://randomuser.me/api/portraits/women/33.jpg",
        service: "Curated Content"
    }
];

const TestimonialSection = ({ bgColor = "bg-white" }) => {
    return (
        <section className={`py-24 relative overflow-hidden ${bgColor}`}>

            <div className="max-w-[1440px] mx-auto relative px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16 px-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#2d0a0a]">
                        Testimonials
                    </h2>
                    <div className="w-20 h-1 bg-[#F7941E] mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Infinite CSS Marquee Slider */}
                <div className="relative pt-4 pb-12 overflow-hidden flex marquee-container">
                    <div className="flex gap-8 marquee-content group">
                        {/* Duplicate content to ensure seamless looping */}
                        {[...testimonials, ...testimonials, ...testimonials].map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className="w-[380px] bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex-shrink-0 transition-all duration-500 hover:border-[#F7941E]/20 group/card cursor-default"
                                style={{ whiteSpace: 'normal' }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#F7941E]/10 shadow-inner">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-[#2d0a0a] group-hover/card:text-[#F7941E] transition-colors">{item.name}</h4>
                                            <p className="text-[10px] text-[#2d0a0a]/40 font-bold uppercase tracking-widest">
                                                {item.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-[#F7941E] text-[#F7941E]" />
                                        ))}
                                    </div>
                                </div>
                                <div className="relative mb-6 min-h-[60px]">
                                    <Quote className="absolute -top-3 -left-2 w-10 h-10 text-[#F7941E]/5 -z-0" />
                                    <p className="text-sm text-[#2d0a0a]/70 leading-relaxed italic relative z-10 line-clamp-3">
                                        "{item.text}"
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#F7941E] animate-pulse"></span>
                                        <span className="text-[10px] font-bold text-[#F7941E] uppercase tracking-[0.2em]">
                                            {item.service}
                                        </span>
                                    </div>
                                    <div className="text-[9px] font-bold text-[#2d0a0a]/20 uppercase tracking-widest">
                                        Verified Reader
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Edge Shadow Overlays */}
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

            <style jsx>{`
                .marquee-container {
                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                }
                .marquee-content {
                    animation: scroll 40s linear infinite;
                    width: max-content;
                }
                .marquee-content:hover {
                    animation-play-state: paused;
                }
                @keyframes scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(calc(-33.333% - 2.66rem)); } /* Accounts for item width + gap */
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </section>
    );
};

export default TestimonialSection;
