"use client";
import { useState, useEffect } from "react";
import { Search, Filter, Star, ShoppingCart, Heart, BookOpen, TrendingUp, Award, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { syncAddToCart, fetchCart } from "@/redux/slices/cartSlice";

export default function BooksClient() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("popular");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 20;
    const dispatch = useDispatch();

    // Fetch books and categories on mount
    useEffect(() => {
        fetchData();
        dispatch(fetchCart());
    }, [dispatch]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [booksResponse, categoriesResponse] = await Promise.all([
                api.get("/book/all"),
                api.get("/category/all")
            ]);

            const booksResult = booksResponse.data?.data || {};
            const categoriesData = categoriesResponse.data?.data || [];
            const booksArray = booksResult.books || [];

            setBooks(Array.isArray(booksArray) ? booksArray : []);
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
            const matchesCategory = selectedCategory === "all" || book.category_id === parseInt(selectedCategory);
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                book.title?.toLowerCase().includes(searchLower) ||
                book.author?.toLowerCase().includes(searchLower) ||
                book.description?.toLowerCase().includes(searchLower);

            return matchesCategory && matchesSearch && book.is_active;
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
        try {
            await api.post("/book/bookmark/toggle", { book_id: bookId });
            setBooks(prevBooks =>
                prevBooks.map(book =>
                    book.id === bookId ? { ...book, isBookmarked: !book.isBookmarked } : book
                )
            );
            toast.success("Wishlist updated!");
        } catch (err) {
            console.error("Error toggling wishlist:", err);
            toast.error(err.response?.data?.message || "Please login to add to wishlist");
        }
    };

    const [priceRange, setPriceRange] = useState(100);
    const [selectedRatings, setSelectedRatings] = useState([]);

    return (
        <div className="bg-[#F7F6F3] min-h-screen font-['Outfit',sans-serif]">
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

                input[type=range].gold-range {
                    -webkit-appearance: none;
                    background: #EBEBEB;
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
                }
            `}</style>

            {/* Hero Section - PRESERVED */}
            <section
                className="relative py-60 px-4 md:px-8 bg-cover bg-center bg-no-repeat"
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

            <div className="flex p-8">
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
                        <span className="text-xs">₹0</span><span className="text-xs">₹500+</span>
                        <input
                            type="range"
                            min="0"
                            max="500"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="gold-range w-full h-[3px] rounded-full outline-none cursor-pointer"
                            style={{ background: `linear-gradient(90deg, #E8B84B ${(priceRange / 500) * 100}%, #EBEBEB ${(priceRange / 500) * 100}%)` }}
                        />
                        <div className="text-[15px] font-semibold text-[#0C0C0C] mt-2">Up to ₹{priceRange}</div>
                    </div>

                    <div className="gold-gradient-divider"></div>

                    <div className="space-y-4">
                        <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#999690] mb-4">Customer Rating</div>
                        <div className="flex flex-col gap-2">
                            {[4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F7F6F3] cursor-pointer group transition-colors">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-xs ${i < rating ? "text-[#E8B84B]" : "text-[#DDD]"}`}>★</span>
                                        ))}
                                    </div>
                                    <span className="text-sm text-[#999690]">& up</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="gold-gradient-divider"></div>

                    <div className="space-y-4">
                        <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#999690] mb-4">Sort By</div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full p-2.5 rounded-xl border-1.5 border-[#EBEBEB] bg-white text-[15px] font-medium text-[#0C0C0C] outline-none appearance-none cursor-pointer focus:border-[#E8B84B] transition-all"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                        >
                            <option value="popular">Most Popular</option>
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 p-9 flex flex-col gap-7 min-w-0">
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

                        <div className="flex items-center gap-4">
                            {!loading && (
                                <div className="text-[12px] font-medium text-[#999690] bg-white border-1.5 border-[#EBEBEB] px-4 py-2.5 rounded-xl whitespace-nowrap">
                                    Showing <b className="text-[#0C0C0C]">{startIndex + 1}–{Math.min(endIndex, totalBooks)}</b> of <b className="text-[#0C0C0C]">{totalBooks}</b> titles
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    setSelectedCategory("all");
                                    setSearchQuery("");
                                    setPriceRange(100);
                                    setSelectedRatings([]);
                                }}
                                className="text-[11.5px] font-medium text-[#999690] hover:text-[#E8B84B] tracking-wide transition-colors"
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
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                            {paginatedBooks.map((book) => {
                                const thumbnailUrl = book.thumbnail?.url || book.thumbnail || "/placeholder-book.jpg";
                                return (
                                    <div key={book.id} className="book-card bg-white rounded-[14px] border border-[#EBEBEB] flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:border-[#E8B84B]/40 group">
                                        <div className="relative aspect-[4/5] bg-[#F5F5F5] overflow-hidden group/img">
                                            {/* Wraps only image in link */}
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
                                                <Heart size={12} className={`${book.isBookmarked ? "fill-red-500 text-red-500" : "text-[#666] group-hover:text-red-500"}`} />
                                            </button>
                                        </div>

                                        <div className="p-3 flex flex-col gap-1.5 flex-1 relative z-10">
                                            <div className="min-h-[38px] mb-1">
                                                <Link href={`/books/${book.id}`}>
                                                    <h3 className="text-[12px] font-bold text-[#0C0C0C] line-clamp-1 mb-0.5 leading-tight hover:text-[#E8B84B] transition-colors">{book.title}</h3>
                                                </Link>
                                                <p className="text-[10.5px] text-[#999690] leading-tight">{book.author || "Unknown Author"}</p>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={`text-[10px] ${i < 4 ? "text-[#E8B84B]" : "text-[#DDD]"}`}>★</span>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-[#C0BDB7]">(1.7k)</span>
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
                            })}
                        </div>
                    )}

                    {!loading && totalPages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => {
                                        setCurrentPage(i + 1);
                                        window.scrollTo({ top: 300, behavior: "smooth" });
                                    }}
                                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${currentPage === i + 1 ? "bg-[#E8B84B] text-[#0C0C0C]" : "bg-white border-1.5 border-[#EBEBEB] text-[#999690] hover:border-[#E8B84B]"}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </main>
            </div >
        </div >
    );
}
