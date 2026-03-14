'use client';

import React, { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import api from "@/lib/axios";

const TestimonialSection = ({ bgColor = "bg-white" }) => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await api.get("/testimonials");
                if (response.data.success) {
                    setTestimonials(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching testimonials:", error);
            }
        };

        fetchTestimonials();
    }, []);

    if (testimonials.length === 0) return null;

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
                                            <img src={item.image || `https://ui-avatars.com/api/?name=${item.name}&background=F7941E&color=fff`} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-[#2d0a0a] group-hover/card:text-[#F7941E] transition-colors">{item.name}</h4>
                                            <p className="text-[10px] text-[#2d0a0a]/40 font-bold uppercase tracking-widest">
                                                {item.designation || "Reader"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(Number(item.rating) || 5)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-[#F7941E] text-[#F7941E]" />
                                        ))}
                                    </div>
                                </div>
                                <div className="relative mb-6 min-h-[60px]">
                                    <Quote className="absolute -top-3 -left-2 w-10 h-10 text-[#F7941E]/5 -z-0" />
                                    <p className="text-sm text-[#2d0a0a]/70 leading-relaxed italic relative z-10 line-clamp-3">
                                        "{item.content}"
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#F7941E] animate-pulse"></span>
                                        <span className="text-[10px] font-bold text-[#F7941E] uppercase tracking-[0.2em]">
                                            {item.designation || "Verified Purchase"}
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
                    animation: scroll 15s linear infinite;
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
