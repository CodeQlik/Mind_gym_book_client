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
    Feather
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="bg-black text-white font-sans">

            {/* Main Footer Links Area */}
            <div className="py-20 px-6 md:px-12 bg-[#050505] border-t border-white/5">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">

                    {/* Company Column */}
                    <div className="space-y-8">
                        <div>
                            <Link href="/" className="flex items-center group mb-6">
                                <div className="relative w-28 h-12 overflow-hidden">
                                    <Image
                                        src="/logo.jpeg"
                                        alt="Mind Gym Book Logo"
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out brightness-0 invert"
                                    />
                                </div>
                            </Link>
                            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-4 opacity-50">
                                Company
                            </h4>
                            <ul className="space-y-3">
                                {[
                                    { name: "About Us", path: "/about" },
                                    { name: "Our Story", path: "/about" },
                                    { name: "Blog", path: "/blog" },
                                    { name: "Careers", path: "/careers" },
                                    { name: "Contact Us", path: "/contact" }
                                ].map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.path} className="text-white/60 hover:text-[#F7941E] text-xs font-medium transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Customer Service Column */}
                    <div>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-8 opacity-50">
                            Customer Service
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { name: "FAQ", path: "/faq" },
                                { name: "Help Center", path: "/support" },
                                { name: "Support Tickets", path: "/support" },
                                { name: "Shipping Information", path: "/shipping-policy" },
                                { name: "Refund Policy", path: "/refund-policy" },
                                { name: "Return Policy", path: "/return-policy" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.path} className="text-white/60 hover:text-[#F7941E] text-xs font-medium transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>



                    {/* My Account Column */}
                    <div>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-8 opacity-50">
                            My Account
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { name: "Login / Register", path: "/login" },
                                { name: "My Profile", path: "/profile" },
                                { name: "My Orders", path: "/profile" },
                                { name: "My Wishlist", path: "/wishlist" },
                                { name: "Order History", path: "/profile" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.path} className="text-white/60 hover:text-[#F7941E] text-xs font-medium transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Policies Column */}
                    <div>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-8 opacity-50">
                            Policies
                        </h4>
                        <ul className="space-y-4 mb-8">
                            {[
                                { name: "Privacy Policy", path: "/privacy-policy" },
                                { name: "Terms & Conditions", path: "/terms-conditions" },
                                { name: "Cookie Policy", path: "/cookie-policy" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.path} className="text-white/60 hover:text-[#F7941E] text-xs font-medium transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Social Links merged here */}
                        <div className="flex items-center gap-3">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#F7941E] hover:text-black hover:border-[#F7941E] transition-all duration-300"
                                >
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="py-8 px-6 md:px-12 bg-black border-t border-white/5 text-center sm:text-left">
                <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-white/30 text-[9px] font-medium tracking-[0.2em] uppercase">
                        © 2026 Mind Gym Book. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <MapPin size={12} className="text-[#F7941E]" />
                        <span className="text-white/30 text-[9px] font-medium uppercase tracking-widest">
                            123 Book Street, Reading City, RC 12345
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
