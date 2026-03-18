"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Minus } from "lucide-react";

/**
 * FAQ Section Component
 * Refined design with darker borders, wider layout, smaller font sizes, and sleek transitions.
 */
const FAQSection = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await api.get("/faqs");
                if (response.data.success) {
                    setFaqs(response.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const toggleFaq = (id) => {
        setActiveId(activeId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="py-24 bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#F7941E]/20 border-t-[#F7941E] rounded-full animate-spin" />
            </div>
        );
    }

    if (!faqs || faqs.length === 0) return null;

    return (
        <section className="py-24 bg-white font-sans overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                
                {/* FAQ Badge */}
                <div className="flex justify-center mb-6">
                    <div className="bg-[#FFF8EE] px-5 py-1 rounded-full border border-[#FFE8CC]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#D99A4E]">
                            FAQ
                        </span>
                    </div>
                </div>

                {/* Heading */}
                <div className="text-center mb-16">
                    <h2 
                        className="text-3xl md:text-5xl font-bold text-black tracking-tight mb-4" 
                        style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
                    >
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-400 font-medium max-w-lg mx-auto leading-relaxed text-sm">
                        Find answers to common questions about our books, shipping, and services.
                    </p>
                </div>

                {/* Accordion List */}
                <div className="space-y-3">
                    {faqs.map((faq) => {
                        const isOpen = activeId === faq.id;
                        return (
                            <div 
                                key={faq.id} 
                                className={`border transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-2xl bg-white ${
                                    isOpen 
                                    ? "border-gray-400 shadow-xl shadow-gray-100/40" 
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full flex items-center justify-between p-4 md:p-5 text-left outline-none"
                                >
                                    <span className={`text-sm md:text-base font-bold transition-colors duration-300 pr-10 ${
                                        isOpen ? "text-black" : "text-gray-800"
                                    }`}>
                                        {faq.question}
                                    </span>
                                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                                        isOpen ? "bg-[#F7941E] rotate-180" : "bg-[#F7941E]"
                                    }`}>
                                        {isOpen ? (
                                            <Minus size={14} className="text-white" strokeWidth={3} />
                                        ) : (
                                            <Plus size={14} className="text-white" strokeWidth={3} />
                                        )}
                                    </div>
                                </button>
                                
                                <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                                    isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                                }`}>
                                    <div className="p-4 md:p-5 pt-0 border-t border-gray-50/50">
                                        <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
