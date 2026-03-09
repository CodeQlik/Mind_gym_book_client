"use client";
import React from "react";
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
    Send
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-black text-white">

            {/* 1. Newsletter & Book Club Section */}
            <div className="py-12 px-6 md:px-12 border-b border-white/5 relative overflow-hidden">
                {/* Subtle Glow Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#F7941E]/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
                    {/* Newsletter Icon */}
                    <div className="w-14 h-14 bg-[#F7941E] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-[#F7941E]/20">
                        <Mail size={24} className="text-secondary" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Join Our Book Club
                    </h2>

                    <p className="text-gray-400 font-medium leading-relaxed text-base max-w-2xl mb-10">
                        Subscribe to our newsletter and get exclusive offers, new arrivals, and book recommendations delivered to your inbox.
                    </p>

                    {/* Subscription Form */}
                    <form className="w-full max-w-xl flex flex-col sm:flex-row gap-4 mb-4">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#F7941E]/50 transition-all placeholder:text-gray-600"
                        />
                        <button className="bg-[#F7941E] hover:bg-[#E67E22] text-secondary px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 whitespace-nowrap">
                            Subscribe <Send size={16} />
                        </button>
                    </form>

                    <p className="text-gray-600 text-[11px] font-medium tracking-wide uppercase">
                        No spam, unsubscribe anytime. We respect your privacy.
                    </p>

                    {/* Newsletter Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-24 mt-10">
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-3xl font-bold text-[#F7941E]">10K+</span>
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Subscribers</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-3xl font-bold text-[#F7941E]">Weekly</span>
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Updates</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-3xl font-bold text-[#F7941E]">20%</span>
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Exclusive Offers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Footer Links Area */}
            <div className="py-10 px-6 md:px-12 bg-[#050505]">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">

                    {/* Brand Column */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">
                                MIND<span className="text-[#F7941E]">GYM</span>BOOK
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed font-medium max-w-xs">
                                Your destination for premium books and exclusive literature. Curating excellence since 2020.
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#F7941E] hover:text-secondary hover:border-[#F7941E] transition-all"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h4 className="text-[13px] font-bold text-white uppercase tracking-[0.2em] mb-8">
                            Quick Links
                        </h4>
                        <ul className="space-y-4">
                            {["About Us", "Contact", "Blog", "Careers", "Press"].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-gray-500 hover:text-[#F7941E] text-sm font-medium transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories Column */}
                    <div>
                        <h4 className="text-[13px] font-bold text-white uppercase tracking-[0.2em] mb-8">
                            Categories
                        </h4>
                        <ul className="space-y-4">
                            {["Fiction", "Non-Fiction", "Kids", "Educational", "Mystery"].map((cat) => (
                                <li key={cat}>
                                    <Link href="#" className="text-gray-500 hover:text-[#F7941E] text-sm font-medium transition-colors">
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-[13px] font-bold text-white uppercase tracking-[0.2em] mb-8">
                            Contact Us
                        </h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 text-gray-500 group">
                                <MapPin size={18} className="text-[#F7941E] mt-0.5 shrink-0" />
                                <span className="text-sm font-medium leading-relaxed group-hover:text-white transition-colors">
                                    123 Book Street, Reading City,<br />RC 12345
                                </span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-500 group">
                                <Phone size={18} className="text-[#F7941E] shrink-0" />
                                <span className="text-sm font-medium group-hover:text-white transition-colors">
                                    +1 (555) 123-4567
                                </span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-500 group">
                                <Mail size={18} className="text-[#F7941E] shrink-0" />
                                <span className="text-sm font-medium group-hover:text-white transition-colors">
                                    hello@mindgymbook.com
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 3. Bottom Bar */}
            <div className="py-10 px-6 md:px-12 bg-black border-t border-white/5">
                <div className="max-w-[1440px] mx-auto flex flex-col sm:row justify-between items-center gap-6">
                    <p className="text-gray-600 text-[12px] font-medium tracking-wide">
                        © 2026 MindGymBook. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className="text-gray-600 hover:text-[#F7941E] text-[12px] font-medium transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
