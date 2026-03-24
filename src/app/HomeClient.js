"use client";
import Hero from "@/component/Hero";
import AuthorSection from "@/component/AuthorSection";
import BookGrid from "@/component/BookGrid";
import TestimonialSection from "@/component/TestimonialSection";
import Features from "@/component/Features";
import ServiceBar from "@/component/ServiceBar";
import TrendingBooks from "@/component/TrendingBooks";

import BlogSection from "@/component/BlogSection";
import FAQSection from "@/component/FAQSection";

export default function HomeClient() {
    return (
        <>
            <Hero />
            <ServiceBar />
            <BookGrid />
            <TrendingBooks />
            <AuthorSection />
            <Features />
            <BlogSection />
            <TestimonialSection />
            <FAQSection />

        </>
    );
}
