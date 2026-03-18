"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Star, ShoppingCart, Heart, BookOpen, TrendingUp, Award, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { syncAddToCart, fetchCart } from "@/redux/slices/cartSlice";
import { toggleWishlistSync } from "@/redux/slices/wishlistSlice";
import { useSelector, useDispatch } from "react-redux";

export default function BooksClient() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BooksContent />
        </Suspense>
    );
}

function BooksContent() {
    const searchParams = useSearchParams();
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("popular");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const booksPerPage = 12; // Shows 2 rows of 4 or 4 rows of 2 depending on screen size
    const dispatch = useDispatch();
    const { items: wishlistItems } = useSelector(state => state.wishlist);
    const [priceRange, setPriceRange] = useState(2000);

    // Fetch books and categories on mount
    useEffect(() => {
        fetchData();
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        const query = searchParams.get("query");
        if (query) {
            setSearchQuery(query);
        }
    }, [searchParams]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [booksResponse, categoriesResponse] = await Promise.all([
                api.get("/book/all?limit=100"),
                api.get("/category/all")
            ]);

            const data = booksResponse.data?.data || {};
            const categoriesData = categoriesResponse.data?.data || [];

            let booksArray = [];
            // Target data.books specifically
            const booksSource = data.books || data;

            if (Array.isArray(booksSource)) {
                booksArray = booksSource;
            } else if (booksSource && typeof booksSource === 'object') {
                // If it's an object (categorized by English, Hindi, etc.), flatten its values
                booksArray = Object.values(booksSource).flat().filter(book => book !== null && typeof book === 'object');
            }

            setBooks(booksArray);
            setCategories([
                { id: "all", name: "All Books", slug: "all" },
                ...(Array.isArray(categoriesData) ? categoriesData : [])
            ]);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load books. Please try again later.");
            toast.error("Failed to load books");
        } finally {
            setLoading(false);
        }
    };

    const filteredBooks = books
        .filter(book => {
            const bookCategoryId = (book.category?.id || book.category_id)?.toString();
            const matchesCategory = selectedCategory === "all" || bookCategoryId === selectedCategory.toString();
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                book.title?.toLowerCase().includes(searchLower) ||
                book.author?.toLowerCase().includes(searchLower) ||
                book.description?.toLowerCase().includes(searchLower);

            const bookPrice = parseFloat(book.price) || 0;
            const matchesPrice = bookPrice <= priceRange;

            // Disable is_active check as it's missing from API
            return matchesCategory && matchesSearch && matchesPrice;
        })
        .sort((a, b) => {
            if (sortBy === "price-low") return parseFloat(a.price) - parseFloat(b.price);
            if (sortBy === "price-high") return parseFloat(b.price) - parseFloat(a.price);
            if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
            return b.id - a.id;
        });

    const totalBooks = filteredBooks.length;
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const handleAddToCart = (book) => {
        dispatch(syncAddToCart({
            id: book.id,
            title: book.title,
            price: book.price || 25,
            coverImage: book.thumbnail?.url || book.thumbnail || "/placeholder-book.jpg",
            author: book.author || "Global Author"
        }));
    };

    const handleToggleWishlist = async (bookId) => {
        dispatch(toggleWishlistSync(bookId));
    };



    return (
        <div className={`bg-[#F7F6F3] min-h-screen font-['Outfit',sans-serif] ${showMobileFilters ? 'overflow-hidden h-screen' : ''}`}>
            {/* Custom Styles for Specific Aesthetics */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap');
                
                .text-outlined {
                    -webkit-text-stroke: 1.5px #0C0C0C;
                    color: transparent;
                }
                
                .gold-gradient-divider {
                    height: 1px;
                    background: linear-gradient(90deg, #E8B84B, transparent);
                    opacity: 0.3;
                }

                aside::-webkit-scrollbar {
                    display: none;
                }
                aside {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .gold-gradient-divider {
                    height: 1.5px;
                    background: linear-gradient(90deg, #EBEBEB 0%, #E8B84B 50%, #EBEBEB 100%);
                    opacity: 0.5;
                }

                input[type=range].gold-range {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 4px;
                    background: #EBEBEB;
                    border-radius: 999px;
                    outline: none;
                }
                input[type=range].gold-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #0C0C0C;
                    border: 2.5px solid #E8B84B;
                    box-shadow: 0 2px 8px rgba(232,184,75,0.3);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                input[type=range].gold-range::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 3px 12px rgba(232,184,75,0.5);
                }
            `}</style>

            {/* Hero Section - PRESERVED */}
            <section
                className="relative py-28 md:py-60 px-4 md:px-8 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/book-banner.png')" }}
            >
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-red-950 mb-4 uppercase tracking-tight drop-shadow-2xl">
                        Explore Our Collection
                    </h1>
                    <p className="text-red-950 font-medium text-lg max-w-2xl mx-auto drop-shadow-xl">
                        Curated books to transform your mind, elevate your thinking, and inspire your journey
                    </p>
                </div>
            </section>

            <div className="flex p-4 md:p-8">
                {/* SIDEBAR */}
                <aside className="w-[300px] min-h-screen bg-white border-r border-[#EBEBEB] p-10 px-12 flex flex-col gap-8 flex-shrink-0 sticky top-0 h-screen overflow-y-auto hidden lg:flex">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#E8B84B] rounded-xl flex items-center justify-center text-[#0C0C0C]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                        </div>
                        <div className="font-['Cormorant_Garamond',serif] text-2xl font-bold tracking-wider text-[#0C0C0C]">Librāre</div>
                    </div>

                    <div className="gold-gradient-divider"></div>

                    <div className="space-y-4">
                        <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#999690] mb-4">Categories</div>
                        <div className="flex flex-col gap-1">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id.toString())}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-[16px] transition-all duration-200 ${selectedCategory === cat.id.toString() ? "bg-[#E8B84B] text-[#0C0C0C] font-semibold" : "text-[#999690] hover:bg-[#F7F6F3] hover:text-[#0C0C0C]"}`}
                                >
                                    <div className={`w-4 h-4 rounded-md border-1.5 flex items-center justify-center transition-all ${selectedCategory === cat.id.toString() ? "bg-[#0C0C0C] border-[#0C0C0C]" : "border-current"}`}>
                                        {selectedCategory === cat.id.toString() && <svg className="w-2.5 h-2.5 text-[#E8B84B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>}
                                    </div>
                                    {cat.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="gold-gradient-divider"></div>

                    <div className="space-y-4">
                        <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#999690] mb-4">Price Range</div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-[#999690]">₹0</span>
                            <span className="text-xs font-bold text-[#999690]">₹2000+</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="2000"
                            step="50"
                            value={priceRange}
                            onChange={(e) => setPriceRange(parseInt(e.target.value))}
                            className="gold-range"
                            style={{ background: `linear-gradient(90deg, #E8B84B ${(priceRange / 2000) * 100}%, #EBEBEB ${(priceRange / 2000) * 100}%)` }}
                        />
                        <div className="flex items-center justify-between mt-2">
                            <div className="text-[15px] font-bold text-[#0C0C0C]">Up to ₹{priceRange}</div>
                            <div className="w-2 h-2 rounded-full bg-[#E8B84B] animate-pulse"></div>
                        </div>
                    </div>

                    <div className="gold-gradient-divider"></div>

                    <div className="space-y-4">
                        <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#999690] mb-4">Sort By</div>
                        <div className="flex flex-col gap-1">
                            {[
                                { id: "popular", name: "Most Popular" },
                                { id: "newest", name: "Newest First" },
                                { id: "price-low", name: "Price: Low to High" },
                                { id: "price-high", name: "Price: High to Low" }
                            ].map((opt) => (
                                <div
                                    key={opt.id}
                                    onClick={() => setSortBy(opt.id)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-[15px] transition-all duration-200 ${sortBy === opt.id ? "bg-[#E8B84B] text-[#0C0C0C] font-semibold" : "text-[#999690] hover:bg-[#F7F6F3] hover:text-[#0C0C0C]"}`}
                                >
                                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${sortBy === opt.id ? "border-[#0C0C0C]" : "border-current opacity-40"}`}>
                                        {sortBy === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-[#0C0C0C]" />}
                                    </div>
                                    {opt.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* MOBILE FILTERS DRAWER */}
                <div className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 lg:hidden ${showMobileFilters ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setShowMobileFilters(false)}>
                    <div
                        className={`absolute right-0 top-0 w-[300px] h-full bg-white transition-transform duration-300 flex flex-col p-8 gap-6 overflow-y-auto ${showMobileFilters ? "translate-x-0" : "translate-x-full"}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="gold-gradient-divider"></div>

                        {/* Repeat Sidebar Sections for Mobile */}
                        <div className="space-y-4">
                            <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#999690] mb-4">Categories</div>
                            <div className="flex flex-col gap-1">
                                {categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        onClick={() => {
                                            setSelectedCategory(cat.id.toString());
                                            setShowMobileFilters(false);
                                        }}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-[16px] transition-all duration-200 ${selectedCategory === cat.id.toString() ? "bg-[#E8B84B] text-[#0C0C0C] font-semibold" : "text-[#999690] hover:bg-[#F7F6F3] hover:text-[#0C0C0C]"}`}
                                    >
                                        <div className={`w-4 h-4 rounded-md border-1.5 flex items-center justify-center ${selectedCategory === cat.id.toString() ? "bg-[#0C0C0C] border-[#0C0C0C]" : "border-current"}`}>
                                            {selectedCategory === cat.id.toString() && <svg className="w-2.5 h-2.5 text-[#E8B84B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>}
                                        </div>
                                        {cat.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="gold-gradient-divider"></div>

                        <div className="space-y-4">
                            <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#999690] mb-4">Price Range</div>
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                step="50"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="gold-range"
                                style={{ background: `linear-gradient(90deg, #E8B84B ${(priceRange / 2000) * 100}%, #EBEBEB ${(priceRange / 2000) * 100}%)` }}
                            />
                            <div className="text-[14px] font-bold mt-2 text-[#0C0C0C]">Up to ₹{priceRange}</div>
                        </div>

                        <div className="gold-gradient-divider"></div>

                        <div className="space-y-4">
                            <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#999690] mb-4">Sort By</div>
                            <div className="flex flex-col gap-1">
                                {[
                                    { id: "popular", name: "Most Popular" },
                                    { id: "newest", name: "Newest First" },
                                    { id: "price-low", name: "Price: Low to High" },
                                    { id: "price-high", name: "Price: High to Low" }
                                ].map((opt) => (
                                    <div
                                        key={opt.id}
                                        onClick={() => setSortBy(opt.id)}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-[14px] transition-all duration-200 ${sortBy === opt.id ? "bg-[#E8B84B] text-[#0C0C0C] font-semibold" : "text-[#999690] hover:bg-[#F7F6F3] hover:text-[#0C0C0C]"}`}
                                    >
                                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${sortBy === opt.id ? "border-[#0C0C0C]" : "border-current opacity-40"}`}>
                                            {sortBy === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-[#0C0C0C]" />}
                                        </div>
                                        {opt.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="gold-gradient-divider"></div>

                        <button
                            onClick={() => {
                                setSelectedCategory("all");
                                setSearchQuery("");
                                setPriceRange(2000);
                                setShowMobileFilters(false);
                            }}
                            className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase tracking-widest text-xs"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <main className="flex-1 p-0 md:p-9 flex flex-col gap-7 min-w-0">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="font-['Cormorant_Garamond',serif] text-[32px] font-bold text-[#0C0C0C]">
                            Explore <span className="text-outlined">Books</span>
                        </div>

                        <div className="flex-1 max-w-[460px] relative w-full">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999690] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by title, author…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-3 pl-11 pr-4 rounded-xl border-1.5 border-[#EBEBEB] bg-white text-[13.5px] outline-none focus:border-[#E8B84B] focus:ring-3 focus:ring-[#E8B84B]/10 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => setShowMobileFilters(true)}
                                className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#EBEBEB] rounded-xl text-[13px] font-bold text-secondary hover:border-primary transition-all whitespace-nowrap"
                            >
                                <Filter size={16} /> Filters
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedCategory("all");
                                    setSearchQuery("");
                                    setPriceRange(500);
                                }}
                                className="text-[11.5px] font-bold text-[#999690] hover:text-[#E8B84B] tracking-widest uppercase transition-colors whitespace-nowrap"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40">
                            <Loader2 size={40} className="animate-spin text-[#E8B84B] mb-4" />
                            <p className="text-[#999690] font-bold uppercase tracking-widest text-[10px]">Updating Collection...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                            {paginatedBooks.length > 0 ? (
                                paginatedBooks.map((book) => {
                                    const thumbnailUrl = book.thumbnail?.url || book.thumbnail || "/placeholder-book.jpg";
                                    return (
                                        <div key={book.id} className="book-card bg-white rounded-[14px] border border-[#EBEBEB] flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:border-[#E8B84B]/40 group">
                                            <div className="relative aspect-[4/5] bg-[#F5F5F5] overflow-hidden group/img">
                                                <Link href={`/books/${book.id}`} className="block w-full h-full">
                                                    <Image
                                                        src={thumbnailUrl}
                                                        alt={book.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </Link>

                                                <button
                                                    onClick={() => handleToggleWishlist(book.id)}
                                                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-[#E8B84B] hover:scale-110 z-20 shadow-sm"
                                                >
                                                    <Heart size={12} className={`${wishlistItems.some(item => item.id === book.id) ? "fill-red-500 text-red-500" : "text-[#666] group-hover:text-red-500"}`} />
                                                </button>

                                                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20">
                                                    {(book.is_bestseller || book.is_bestselling) && (
                                                        <span className="bg-[#E8B84B] text-[#0C0C0C] text-[8px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">Bestseller</span>
                                                    )}
                                                    {book.is_premium && (
                                                        <span className="bg-[#0C0C0C] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">Premium</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-3 flex flex-col gap-1.5 flex-1 relative z-10">
                                                <div className="min-h-[38px] mb-1">
                                                    <Link href={`/books/${book.id}`}>
                                                        <h3 className="text-[12px] font-bold text-[#0C0C0C] line-clamp-1 mb-0.5 leading-tight hover:text-[#E8B84B] transition-colors">{book.title}</h3>
                                                    </Link>
                                                    <p className="text-[10.5px] text-[#999690] leading-tight">{book.author_name || book.author || "Mind Gym Author"}</p>
                                                </div>



                                                <div className="flex items-center justify-between mt-auto pt-1">
                                                    <div className="text-[20px] font-black text-[#0C0C0C]">
                                                        <span className="text-[12px] font-medium mr-0.5">₹</span>
                                                        {(parseFloat(book.price) || 0).toLocaleString()}
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddToCart(book)}
                                                        className="px-2.5 py-1.5 rounded-lg bg-[#E8B84B] text-[#0C0C0C] font-bold text-[9.5px] uppercase tracking-wider transition-all duration-200 hover:bg-[#0C0C0C] hover:text-white hover:-translate-y-0.5"
                                                    >
                                                        + Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-white shadow-xl rounded-[24px] border border-[#EBEBEB] flex items-center justify-center mb-6 relative">
                                        <div className="absolute inset-0 bg-[#E8B84B]/5 rounded-[24px] animate-ping opacity-20"></div>
                                        <Search size={32} className="text-[#E8B84B]" />
                                    </div>
                                    <h3 className="text-2xl font-['Cormorant_Garamond',serif] font-bold text-[#0C0C0C] mb-3">No matching treasures found</h3>
                                    <p className="text-[#999690] max-w-sm mx-auto text-[15px] leading-relaxed">
                                        We couldn't find any books matching your current filters. Try broadening your search or clearing the filters to explore our full collection.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory("all");
                                            setSearchQuery("");
                                            setPriceRange(500);
                                        }}
                                        className="mt-8 px-8 py-3 bg-[#0C0C0C] text-white rounded-xl font-bold text-[14px] hover:bg-[#E8B84B] hover:text-[#0C0C0C] transition-all duration-300"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {!loading && totalPages > 1 && (
                        <div className="mt-16 mb-12 flex flex-col items-center gap-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(prev - 1, 1));
                                        window.scrollTo({ top: 400, behavior: "smooth" });
                                    }}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 rounded-xl border-1.5 border-[#EBEBEB] bg-white flex items-center justify-center text-[#999690] hover:border-[#E8B84B] hover:text-[#0C0C0C] disabled:opacity-30 disabled:hover:border-[#EBEBEB] transition-all"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                                </button>

                                <div className="flex items-center gap-1 sm:gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => {
                                        const pageNum = i + 1;
                                        // On mobile, show only current page, first, last, and 1 sibling
                                        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                                        const shouldShow = !isMobile ||
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            Math.abs(pageNum - currentPage) <= 1;

                                        if (!shouldShow) {
                                            if (pageNum === 2 || pageNum === totalPages - 1) {
                                                return <span key={pageNum} className="text-[#999690]">.</span>;
                                            }
                                            return null;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => {
                                                    setCurrentPage(pageNum);
                                                    window.scrollTo({ top: 400, behavior: "smooth" });
                                                }}
                                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-[13px] transition-all duration-300 ${currentPage === pageNum ? "bg-[#E8B84B] text-[#0C0C0C] shadow-lg shadow-[#E8B84B]/20 scale-110" : "bg-white border-1.5 border-[#EBEBEB] text-[#999690] hover:border-[#E8B84B] hover:text-[#0C0C0C]"}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                        window.scrollTo({ top: 400, behavior: "smooth" });
                                    }}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 rounded-xl border-1.5 border-[#EBEBEB] bg-white flex items-center justify-center text-[#999690] hover:border-[#E8B84B] hover:text-[#0C0C0C] disabled:opacity-30 disabled:hover:border-[#EBEBEB] transition-all"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                                </button>
                            </div>

                            <p className="text-[11px] font-bold text-[#999690] uppercase tracking-[0.2em]">
                                Page {currentPage} of {totalPages}
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
