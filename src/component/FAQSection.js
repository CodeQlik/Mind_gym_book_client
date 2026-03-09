"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqData = [
    {
        question: "How long does shipping take?",
        answer: "Most orders are delivered within 3-5 business days. Once your order is shipped, you will receive a tracking ID via email to monitor your delivery status in real-time."
    },
    {
        question: "What is your return policy?",
        answer: "We have a 7-day return policy for books that are damaged or significantly different from the description. Please ensure the book is in its original condition for a hassle-free return."
    },
    {
        question: "Do you offer international shipping?",
        answer: "Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary by location and will be calculated at checkout."
    },
    {
        question: "Are the books new or used?",
        answer: "We primarily sell brand new, high-quality editions. Occasionally, we offer certified pre-owned collectibles which will be clearly marked in the product description."
    },
    {
        question: "Do you offer gift wrapping?",
        answer: "Absolutely! You can choose our premium gift wrapping service at checkout to add a special touch to your purchase, including a personalized message."
    }
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="bg-[#FFF8E7] px-5 py-1.5 rounded-full mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C48C3D]">
                            FAQ
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-5 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="max-w-2xl text-gray-400 font-medium leading-relaxed text-base">
                        Find answers to common questions about our books, shipping, and services.
                    </p>
                </div>

                {/* Accordion List */}
                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white border transition-all duration-500 rounded-[1.5rem] overflow-hidden ${openIndex === index
                                    ? "border-[#F7941E]/30 shadow-xl shadow-[#F7941E]/5"
                                    : "border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
                                }`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left group"
                            >
                                <span className={`text-[17px] font-bold transition-colors duration-300 pr-8 ${openIndex === index ? "text-secondary" : "text-secondary"
                                    }`}>
                                    {faq.question}
                                </span>

                                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === index
                                        ? "bg-[#F7941E] text-white rotate-180"
                                        : "bg-[#F7941E] text-white group-hover:scale-110"
                                    }`}>
                                    {openIndex === index ? (
                                        <Minus size={18} strokeWidth={3} />
                                    ) : (
                                        <Plus size={18} strokeWidth={3} />
                                    )}
                                </div>
                            </button>

                            <div
                                className={`transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="px-8 pb-8 text-[15px] text-gray-400 leading-relaxed font-medium">
                                    <div className="h-px w-full bg-gray-50 mb-6" />
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FAQSection;
