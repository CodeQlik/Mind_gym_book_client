"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send, ChevronRight, HelpCircle, ArrowRight } from "lucide-react";

const ContactClient = () => {
    const contactInfo = [
        {
            icon: <Mail className="text-[#F7941E]" size={20} />,
            title: "Email Support",
            main: "support@mindgym.com",
            sub: "24/7 TICKETING SYSTEM"
        },
        {
            icon: <Phone className="text-[#F7941E]" size={20} />,
            title: "Phone Support",
            main: "+91 98765 43210",
            sub: "TOLL-FREE NUMBERS"
        },
        {
            icon: <MapPin className="text-[#F7941E]" size={20} />,
            title: "Office Location",
            main: "Bengaluru, India",
            sub: "HQ & LOGISTICS HUB"
        },
        {
            icon: <Clock className="text-[#F7941E]" size={20} />,
            title: "Support Hours",
            main: "Mon – Sat | 9 AM – 6 PM",
            sub: "IST TIMEZONE"
        }
    ];

    return (
        <div className="bg-[#FFFFFF] min-h-screen font-['Inter',sans-serif]">
            {/* Custom Styles */}
            <style jsx>{`
                .contact-title {
                    font-size: clamp(3rem, 7vw, 5rem);
                    line-height: 1.1;
                }
                .serif-font {
                    font-family: 'Cormorant Garamond', serif;
                }
            `}</style>

            <main>
                {/* Hero Section */}
                <section className="pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative">

                        {/* Left Side Content */}
                        <div className="flex-1 space-y-8 z-10 animate-slide-down">
                            <h1 className="contact-title font-black text-[#1A1A1A] tracking-tighter">
                                Contact <span className="text-[#F7941E] relative">Us
                                    <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#F7941E]/30 rounded-full" />
                                </span>
                            </h1>

                            <p className="text-[#666666] text-lg md:text-xl leading-relaxed max-w-xl font-medium">
                                Have a question about books or your order? We're here to help you find your next great read and resolve any issues.
                            </p>

                        </div>

                        {/* Right Side Image */}
                        <div className="flex-1 relative animate-slide-down" style={{ animationDelay: '0.2s' }}>
                            <div className="relative aspect-[4/3] md:aspect-[5/4] w-full rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group">
                                <Image
                                    src="/images/contact_hero.png"
                                    alt="Modern Library Interior"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />
                                {/* Soft Glow Overlay Effect */}
                                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#F7941E]/5 blur-[80px] -z-10 translate-x-1/4 -translate-y-1/4" />
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#F7941E]/5 to-transparent rounded-full blur-[100px] -z-10 opacity-30 pointer-events-none" />
                        </div>
                    </div>
                </section>

                {/* Contact Cards Info Grid */}
                <section className="py-20 px-6 md:px-12 bg-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {contactInfo.map((info, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-xl border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center group"
                                >
                                    <div className="w-14 h-14 rounded-full bg-[#F7941E]/10 flex items-center justify-center mb-6 transition-colors duration-500 group-hover:bg-[#F7941E]/20">
                                        {info.icon}
                                    </div>
                                    <h3 className="text-[15px] font-black text-[#1A1A1A] mb-2 uppercase tracking-wide">
                                        {info.title}
                                    </h3>
                                    <p className="text-[#1A1A1A] font-bold text-base mb-1">
                                        {info.main}
                                    </p>
                                    <p className="text-[#888888] font-black text-[10px] tracking-[0.15em] uppercase">
                                        {info.sub}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Form and Quick Help Grid */}
                <section className="py-20 px-6 md:px-12 bg-white">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">

                        {/* Left: Contact Form Column */}
                        <div className="flex-1 space-y-8 animate-slide-down">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] tracking-tight">
                                    Send us a message
                                </h2>
                                <p className="text-[#666666] text-base font-medium leading-relaxed max-w-xl">
                                    Fill out the form below and our team will get back to you within <span className="text-[#1A1A1A] font-bold">24 hours.</span>
                                </p>
                            </div>

                            <form className="bg-white p-6 md:p-10 rounded-xl border border-black/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]/50 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-gray-50/30 border border-black/10 focus:border-[#F7941E]/30 focus:bg-white p-4 rounded-xl text-sm font-bold transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]/50 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full bg-gray-50/30 border border-black/10 focus:border-[#F7941E]/30 focus:bg-white p-4 rounded-xl text-sm font-bold transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]/50 ml-1">Mobile Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        className="w-full bg-gray-50/30 border border-black/10 focus:border-[#F7941E]/30 focus:bg-white p-4 rounded-xl text-sm font-bold transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]/50 ml-1">Message</label>
                                    <textarea
                                        placeholder="How can we help you today?"
                                        rows={5}
                                        className="w-full bg-gray-50/30 border border-black/10 focus:border-[#F7941E]/30 focus:bg-white p-4 rounded-xl text-sm font-bold transition-all outline-none resize-none"
                                    />
                                </div>

                                <button type="button" className="w-full bg-[#F7941E] text-black py-5 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all transform hover:-translate-y-1 shadow-xl shadow-[#F7941E]/20 flex items-center justify-center gap-3 group">
                                    Send Message
                                    <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>

                        {/* Right: Quick Help Column */}
                        <div className="flex-1 space-y-10 animate-slide-down" style={{ animationDelay: '0.2s' }}>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">
                                    Quick Help
                                </h2>
                                <p className="text-[#666666] text-base font-medium leading-relaxed">
                                    Find immediate answers to common concerns without the wait.
                                </p>
                            </div>

                            <div className="space-y-2">
                                {[
                                    "How can I track my order?",
                                    "How do I contact support?",
                                    "How can I return a book?",
                                    "Do you offer international shipping?",
                                    "How do I use a promo code?",
                                    "Can I cancel my pre-order?"
                                ].map((q, i) => (
                                    <button
                                        key={i}
                                        className="w-full group flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all text-left border"
                                    >
                                        <span className="text-[15px] font-bold text-[#1A1A1A]/80 group-hover:text-black transition-colors">{q}</span>
                                        <ChevronRight size={18} className="text-[#888888] group-hover:text-[#1A1A1A] group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>

                        </div>

                    </div>
                </section>

                {/* Final CTA Banner */}
                <section className="py-20 px-6 md:px-12 bg-white">
                    <div className="max-w-7xl mx-auto bg-yellow-100 rounded-[32px] p-12 md:p-20 text-center flex flex-col items-center justify-center space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-[#1A1A1A] tracking-tight leading-tight">
                            Explore Our Collection of Books
                        </h2>
                        <p className="text-[#666666] text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
                            Discover curated lists from award-winning authors and indie favorites. Free
                            shipping on orders over ₹499.
                        </p>
                        <div className="pt-4">
                            <Link href="/books" className="inline-block px-10 py-5 bg-[#F7941E] text-black rounded-full font-black text-[12px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-xl shadow-[#F7941E]/20">
                                Browse Books
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ContactClient;
