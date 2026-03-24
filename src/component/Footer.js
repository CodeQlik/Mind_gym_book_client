"use client";
import React, { useState } from "react";
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
    Globe,
    ChevronDown
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const footerLinks = {
        company: [
            { name: "About Us", path: "/about" },
            { name: "Books", path: "/books" },
            { name: "Blog", path: "/blog" },
            { name: "Contact Us", path: "/contact" }
        ],
        customerService: [
            { name: "Help Center", path: "/support" },
            { name: "Support Tickets", path: "/support" },
            { name: "Shipping Info", path: "/shipping-policy" },
            { name: "Refund Policy", path: "/refund-policy" },
            { name: "Return Policy", path: "/return-policy" },
        ],
        account: [
            { name: "Login / Register", path: "/login" },
            { name: "My Profile", path: "/profile" },
            { name: "My Orders", path: "/profile" },
            { name: "My Wishlist", path: "/wishlist" },
            { name: "Order History", path: "/profile" }
        ]
    };

    return (
        <footer className="bg-[#0A0A0A] text-white font-sans overflow-hidden border-t border-white/5">
            {/* Main Content Area */}
            <div className="pt-10 pb-6 px-6 md:px-12 max-w-[1440px] mx-auto text-left">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-8 md:gap-y-10 lg:gap-4">
                    
                    {/* Company Links Section */}
                    <div className="md:col-span-1 lg:col-span-3 border-b border-white/5 md:border-none">
                        <button 
                            onClick={() => toggleSection('company')}
                            className="w-full flex items-center justify-between md:cursor-default md:pointer-events-none group"
                        >
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] py-4 md:py-0 md:mb-8">
                                Company
                            </h4>
                            <ChevronDown 
                                size={14} 
                                className={`md:hidden transition-transform duration-300 ${openSection === 'company' ? 'rotate-180 text-primary' : 'text-white/30'}`} 
                            />
                        </button>
                        <ul className={`space-y-4 overflow-hidden transition-all duration-300 ease-in-out md:max-h-none ${openSection === 'company' ? 'max-h-60 mb-8' : 'max-h-0 md:max-h-none mb-0 md:mb-0'}`}>
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.path} className="text-white font-bold text-[13px] hover:text-primary transition-colors duration-200">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service Links Section */}
                    <div className="md:col-span-1 lg:col-span-3 border-b border-white/5 md:border-none">
                        <button 
                            onClick={() => toggleSection('customerService')}
                            className="w-full flex items-center justify-between md:cursor-default md:pointer-events-none group"
                        >
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] py-4 md:py-0 md:mb-8">
                                Customer Service
                            </h4>
                            <ChevronDown 
                                size={14} 
                                className={`md:hidden transition-transform duration-300 ${openSection === 'customerService' ? 'rotate-180 text-primary' : 'text-white/30'}`} 
                            />
                        </button>
                        <ul className={`space-y-4 overflow-hidden transition-all duration-300 ease-in-out md:max-h-none ${openSection === 'customerService' ? 'max-h-60 mb-8' : 'max-h-0 md:max-h-none mb-0 md:mb-0'}`}>
                            {footerLinks.customerService.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.path} className="text-white font-bold text-[13px] hover:text-primary transition-colors duration-200">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* My Account Links Section */}
                    <div className="md:col-span-1 lg:col-span-3 border-b border-white/5 md:border-none">
                        <button 
                            onClick={() => toggleSection('account')}
                            className="w-full flex items-center justify-between md:cursor-default md:pointer-events-none group"
                        >
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] py-4 md:py-0 md:mb-8">
                                My Account
                            </h4>
                            <ChevronDown 
                                size={14} 
                                className={`md:hidden transition-transform duration-300 ${openSection === 'account' ? 'rotate-180 text-primary' : 'text-white/30'}`} 
                            />
                        </button>
                        <ul className={`space-y-4 overflow-hidden transition-all duration-300 ease-in-out md:max-h-none ${openSection === 'account' ? 'max-h-60 mb-8' : 'max-h-0 md:max-h-none mb-0 md:mb-0'}`}>
                            {footerLinks.account.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.path} className="text-white font-bold text-[13px] hover:text-primary transition-colors duration-200">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="md:col-span-3 lg:col-span-3 flex flex-col items-center md:items-start gap-6">
                        <div className="bg-[#121212] border border-white/5 rounded-[1.5rem] p-6 w-full space-y-6 max-w-md md:max-w-xl lg:max-w-none">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                Get In Touch
                            </h4>
                            
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                                        <MapPin size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">Location</p>
                                        <p className="text-[14px] font-bold text-white whitespace-nowrap">Reading City, RC 12345</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                                        <Phone size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">Phone</p>
                                        <p className="text-[14px] font-bold text-white whitespace-nowrap">+91 98765 43210</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                                        <Mail size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">Email</p>
                                        <p className="text-[14px] font-bold text-white lowercase whitespace-nowrap">support@mindgym.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 pr-2">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                                <a 
                                    key={idx} 
                                    href="#" 
                                    className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-primary hover:text-black hover:border-primary transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <Icon size={18} className="group-hover:text-black text-white" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 py-6 px-6 md:px-12 bg-black">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">
                        © 2026 Mind Gym Book. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-white">
                        <div className="flex items-center gap-2">
                             <Globe size={14} className="opacity-50" />
                             <span>Global Shipping Available</span>
                        </div>
                        <Link href="mailto:contact@mindgym.com" className="flex items-center gap-2 hover:text-white transition-colors">
                            <Mail size={14} className="opacity-50" />
                            <span>contact@mindgym.com</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

