"use client";
import React from "react";
import { Gift, Truck, Shield, Headset, CheckCircle } from "lucide-react";
import Link from "next/link";

const services = [
    {
        icon: Gift,
        title: "Best Prices",
        subtitle: "Unbeatable book deals",
    },
    {
        icon: Truck,
        title: "Fast Delivery",
        subtitle: "Express worldwide shipping",
    },
    {
        icon: Shield,
        title: "Secure Payment",
        subtitle: "100% protected checkout",
    },
    {
        icon: CheckCircle,
        title: "Quality Books",
        subtitle: "Handpicked curated copies",
    },
];

const ServiceBar = () => {
    return (
        <section className="py-12 bg-white hidden md:block">
            <div className="max-w-[1500px] mx-auto px-6">
                <div className="flex flex-wrap justify-center items-stretch gap-6 lg:gap-10">
                    {services.map((service, index) => {
                        const isSupport = service.title === "24/7 Support";
                        return (
                            <Link 
                                href={isSupport ? "/support" : "#"} 
                                key={index} 
                                className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md h-full"
                            >
                                {/* Icon Container */}
                                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-105 shadow-lg shadow-primary/15">
                                    <service.icon className="text-white" size={24} strokeWidth={1.5} />
                                </div>

                                {/* Text Content */}
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-black text-secondary leading-tight mb-0.5">
                                        {service.title}
                                    </h3>
                                    <p className="text-[11px] text-gray-400 font-bold font-sans">
                                        {service.subtitle}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ServiceBar;
