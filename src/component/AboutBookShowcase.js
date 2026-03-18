"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { syncAddToCart } from "@/redux/slices/cartSlice";
import api from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";

const getBookImageUrl = (book) => {
    const fallback = "https://images.unsplash.com/photo-1543005128-d39eef080c98?q=80&w=400&auto=format&fit=crop";
    if (!book) return fallback;
    
    // Handle various field formats (thumbnail object, image string, cover_image object)
    let url = "";
    if (book.thumbnail?.url) url = book.thumbnail.url;
    else if (book.cover_image?.url) url = book.cover_image.url;
    else if (typeof book.image === 'string') url = book.image;
    else if (typeof book.thumbnail === 'string') url = book.thumbnail;
    
    if (!url || typeof url !== 'string') return fallback;
    if (url.startsWith('http')) return url;
    
    // Prefix relative path
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').split('/api/v1')[0] || '';
    if (baseUrl && url.startsWith('/')) return `${baseUrl}${url}`;
    
    return url;
};

const AboutBookShowcase = () => {
    const dispatch = useDispatch();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await api.get("/book/all");
                if (response.data.success) {
                    const booksData = response.data.data;
                    let allBooks = [];
                    
                    if (Array.isArray(booksData)) {
                        allBooks = booksData;
                    } else if (booksData?.books) {
                        if (Array.isArray(booksData.books)) {
                            allBooks = booksData.books;
                        } else if (typeof booksData.books === 'object') {
                            // Extract all books from all category keys
                            allBooks = Object.values(booksData.books).flat();
                        }
                    } else if (booksData?.categories && Array.isArray(booksData.categories)) {
                        allBooks = booksData.categories.flatMap(cat => cat.books || []);
                    }
                    
                    // CRITICAL: Filter out any objects that are not valid books (must have id and title)
                    allBooks = allBooks.filter(item => 
                        item && 
                        typeof item === 'object' && 
                        (item.id || item._id) && 
                        item.title && 
                        item.title.trim().length > 0
                    );
                    
                    let trendingBooks = allBooks.filter(book => 
                        book.is_trending === true || 
                        book.is_trending === 1 || 
                        book.is_trending === "1"
                    );

                    // If no trending books found, fallback to showing latest books so the section doesn't appear empty
                    if (trendingBooks.length === 0) {
                        trendingBooks = allBooks.slice(0, 12);
                    }

                    setBooks(trendingBooks);
                }
            } catch (error) {
                console.error("Error fetching books for about page:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleToggleWishlist = async (bookId) => {
        try {
            await api.post("/book/bookmark/toggle", { book_id: bookId });
            setBooks(prevBooks =>
                prevBooks.map(book =>
                    book.id === bookId ? { ...book, isBookmarked: !book.isBookmarked } : book
                )
            );
        } catch (err) {
            console.error("Error toggling wishlist:", err);
        }
    };

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="flex flex-col items-center text-center mb-10 md:mb-16 px-4">
                    <div className="hidden sm:flex bg-black px-4 py-1.5 rounded-full mb-6 items-center gap-2">
                        <svg className="w-3 h-3 text-[#F7941E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M23 6l-9.5 9.5-5-5L1 18" />
                            <path d="M17 6h6v6" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                            Staff Recommendations
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary mb-4 md:mb-6 px-4 leading-tight">
                        Popular <span className="text-[#F7941E] italic">Collections</span>
                    </h2>
                    <p className="max-w-xl text-gray-500 font-medium text-sm md:text-base px-6">
                        Handpicked stories that have moved us and shaped our perspective on the world.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#F7941E] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : books.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {books.map((book, index) => (
                            <div
                                key={book.id || `book-${index}`}
                                className="bg-white border border-gray-100 rounded-[1.5rem] p-4 shadow-md shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/70 transition-all duration-500 flex gap-4 md:gap-5 group"
                            >
                                {/* Left Side: Image */}
                                <Link
                                    href={`/books/${book.slug || book.id}`}
                                    className="relative w-28 aspect-[2/3] flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden shadow-md cursor-pointer block"
                                >
                                    <Image
                                        src={getBookImageUrl(book)}
                                        alt={book.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleToggleWishlist(book.id);
                                        }}
                                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#1A1A1A] hover:text-red-500 transition-all z-10 opacity-0 group-hover:opacity-100 shadow-sm"
                                    >
                                        <Heart size={14} className={book.isBookmarked ? "fill-red-500 text-red-500" : ""} />
                                    </button>
                                </Link>

                                {/* Right Side: Info */}
                                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                                    <div>
                                        <Link href={`/books/${book.slug || book.id}`}>
                                            <h3 className="text-base font-bold text-[#1A1A1A] leading-tight line-clamp-2 mb-1 group-hover:text-[#F7941E] transition-colors cursor-pointer">
                                                {book.title}
                                            </h3>
                                        </Link>
                                        <p className="text-[13px] font-medium text-gray-400 mb-2 truncate">
                                            by {book.author_name || book.author || "Global Author"}
                                        </p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => {
                                                    const rating = book.average_rating || book.rating || 5;
                                                    return (
                                                        <svg key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "text-[#F7941E]" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    );
                                                })}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 mt-0.5">({book.reviews_count || book.total_reviews || 0})</span>
                                        </div>

                                        {/* Price & Sold Count */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-lg font-bold text-[#1A1A1A]">
                                                ₹{(parseFloat(book.price) || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => dispatch(syncAddToCart({
                                            id: book.id,
                                            title: book.title,
                                            price: parseFloat(book.price),
                                            coverImage: getBookImageUrl(book),
                                            author: book.author_name || book.author || "Global Author"
                                        }))}
                                        className="w-full bg-black hover:bg-zinc-800 text-white font-black text-[10px] py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn whitespace-nowrap"
                                    >
                                        <ShoppingCart size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-gray-400 font-medium">No trending collections available at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AboutBookShowcase;
