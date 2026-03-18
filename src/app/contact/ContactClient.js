"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send, ChevronRight, HelpCircle, ArrowRight } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

const ContactClient = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.message) {
            return toast.error("Please fill in all required fields.");
        }

        setIsSubmitting(true);
        try {
            const response = await api.post("/contact/submit", formData);
            if (response.data?.status === "success") {
                toast.success(response.data?.message || "Message sent successfully! We will get back to you soon.");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "General Inquiry",
                    message: ""
                });
            }
        } catch (error) {
            console.error("Contact Form Error:", error);
            toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const faqs = [
        {
            q: "How can I track my order?",
            a: "You can track your order by clicking on the Profile icon and visiting the 'My Orders' section. We also send real-time tracking updates to your registered email."
        },
        {
            q: "How do I contact support?",
            a: "You can reach us through the contact form on this page, email us at support@mindgym.com, or visit our Help Center for instant documentation."
        },
        {
            q: "How can I return a book?",
            a: "We offer a 7-day return policy for most books. To initiate a return, go to your 'Order History', select the item, and click on 'Request Return'."
        },
        {
            q: "Do you offer international shipping?",
            a: "Currently, we only ship within India. We are working on expanding our services to international readers soon!"
        },
        {
            q: "How do I use a promo code?",
            a: "You can apply your promo code on the 'Checkout' page in the 'Discount Code' field before proceeding to payment."
        },
        {
            q: "Can I cancel my pre-order?",
            a: "Yes, pre-orders can be cancelled anytime before the book is shipped. Visit 'My Orders' to see cancellation options for your specific order."
        }
    ];

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
                    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative">

                        {/* Left Side Content */}
                        <div className="flex-1 space-y-8 z-10 animate-slide-down text-center md:text-left">
                            <h1 className="contact-title font-black text-[#1A1A1A] tracking-tighter">
                                Contact <span className="text-primary relative">Us
                                    <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-primary/30 rounded-full" />
                                </span>
                            </h1>

                            <p className="text-[#666666] text-lg md:text-xl leading-relaxed max-w-xl font-medium mx-auto md:mx-0">
                                Have a question about books or your order? We're here to help you find your next great read and resolve any issues.
                            </p>

                        </div>

                        {/* Right Side Image */}
                        <div className="flex-1 relative animate-slide-down w-full md:w-auto" style={{ animationDelay: '0.2s' }}>
                            <div className="relative aspect-[4/3] md:aspect-[5/4] w-full rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group border border-black/5">
                                <Image
                                    src="/images/contact_hero.png"
                                    alt="Modern Library Interior"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />
                                {/* Soft Glow Overlay Effect */}
                                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[80px] -z-10 translate-x-1/4 -translate-y-1/4" />
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-[100px] -z-10 opacity-30 pointer-events-none" />
                        </div>
                    </div>
                </section>

                {/* Contact Cards Info Grid */}
                <section className="py-20 px-6 md:px-12 bg-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
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

                            <form 
                                onSubmit={handleSubmit}
                                className="bg-white p-6 md:p-10 rounded-xl border border-black/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]/50 ml-1">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full bg-gray-50/30 border border-black/10 focus:border-[#F7941E]/30 focus:bg-white p-4 rounded-xl text-sm font-bold transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]/50 ml-1">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="w-full bg-gray-50/30 border border-black/10 focus:border-[#F7941E]/30 focus:bg-white p-4 rounded-xl text-sm font-bold transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]/50 ml-1">Mobile Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                            className="w-full bg-gray-50/30 border border-black/10 focus:border-[#F7941E]/30 focus:bg-white p-4 rounded-xl text-sm font-bold transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]/50 ml-1">Inquiry Subject</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50/30 border border-black/10 focus:border-[#F7941E]/30 focus:bg-white p-4 rounded-xl text-sm font-bold transition-all outline-none appearance-none"
                                        >
                                            <option value="General Inquiry">General Inquiry</option>
                                            <option value="Order Issue">Order Issue</option>
                                            <option value="Bulk Order">Bulk Order</option>
                                            <option value="Partnership">Partnership</option>
                                            <option value="Technical Support">Technical Support</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]/50 ml-1">Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="How can we help you today?"
                                        rows={5}
                                        className="w-full bg-gray-50/30 border border-black/10 focus:border-[#F7941E]/30 focus:bg-white p-4 rounded-xl text-sm font-bold transition-all outline-none resize-none"
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full bg-[#F7941E] text-black py-5 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all transform hover:-translate-y-1 shadow-xl shadow-[#F7941E]/20 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                    {!isSubmitting && <Send size={16} className="group-hover:translate-x-1 transition-transform" />}
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

                            <div className="space-y-4">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="border rounded-xl overflow-hidden bg-white transition-all duration-300">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className={`w-full group flex items-center justify-between p-4 px-5 text-left transition-all ${openFaq === i ? "bg-gray-50" : "hover:bg-gray-50/50"}`}
                                        >
                                            <span className={`text-[15px] font-bold transition-colors ${openFaq === i ? "text-[#F7941E]" : "text-[#1A1A1A]/80 group-hover:text-black"}`}>{faq.q}</span>
                                            <ChevronRight size={18} className={`text-[#888888] transition-all duration-300 ${openFaq === i ? "rotate-90 text-[#F7941E]" : "group-hover:translate-x-1"}`} />
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                                            <div className="p-5 pt-0 text-[14px] leading-relaxed text-[#666] font-medium border-t border-gray-100/50">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-dashed">
                                <Link 
                                    href="/support" 
                                    className="inline-flex items-center gap-2 text-[13px] font-black text-[#F7941E] uppercase tracking-widest hover:text-black transition-colors group"
                                >
                                    Still need help? Visit our Help Center
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
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
