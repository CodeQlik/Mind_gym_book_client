"use client";
import Hero from "@/component/Hero";
import AuthorSection from "@/component/AuthorSection";
import CategorySection from "@/component/CategorySection";
import CategoryShowcase from "@/component/CategoryShowcase";
import BookGrid from "@/component/BookGrid";
import TestimonialSection from "@/component/TestimonialSection";
import FeaturedSlider from "@/component/FeaturedSlider";
import CategorySelection from "@/component/CategorySelection";
import Features from "@/component/Features";
import ServiceBar from "@/component/ServiceBar";
import TrendingBooks from "@/component/TrendingBooks";

import BlogSection from "@/component/BlogSection";

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

        </>
    );
}
