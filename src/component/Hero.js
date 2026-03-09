import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative w-full aspect-video min-h-[400px] max-h-[600px] overflow-hidden bg-black mt-[64px]">
            {/* Background Video Banner */}
            {/* Background Video Banner */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/hero-banner.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Premium Black Overlay */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/40 to-transparent" />




            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full h-full flex items-center">
                <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
                    {/* Content Column */}
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-sans font-black text-white leading-[1.2] tracking-tight mb-6 drop-shadow-2xl">
                            The Art of <br />
                            <span className="text-primary">Mindful Reading</span>
                        </h1>

                        <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl mb-10 leading-relaxed">
                            A curated selection of books designed to sharpen your intellect and inspire your daily growth.
                        </p>

                    </div>
                </div>
            </div>
        </section>
    );
}
