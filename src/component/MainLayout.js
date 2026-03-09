"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({ children }) {
    const pathname = usePathname();

    // Pages where we don't want Header and Footer
    const excludedPages = ["/login", "/register"];
    const shouldShowLayout = !excludedPages.includes(pathname);

    if (!shouldShowLayout) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
