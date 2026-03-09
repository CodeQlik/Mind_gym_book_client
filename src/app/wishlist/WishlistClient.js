"use client";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Loader2, Trash2, ArrowLeft, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { syncAddToCart } from "@/redux/slices/cartSlice";

export default function WishlistClient() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await api.get("/book/bookmark/all");
            const data = response.data?.data || [];
            // Extract the book object from each bookmark record
            const books = Array.isArray(data) ? data.map(item => item.book).filter(b => b) : [];
            setWishlist(books);
        } catch (err) {
            console.error("Error fetching wishlist:", err);
            toast.error("Please login to view your wishlist");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (bookId) => {
        try {
            await api.post("/book/bookmark/toggle", { book_id: bookId });
            setWishlist(prev => prev.filter(item => item.id !== bookId));
            toast.success("Removed from wishlist");
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    const handleAddToCart = (book) => {
        dispatch(syncAddToCart({
            id: book.id,
            title: book.title,
            price: book.price || 25,
            coverImage: book.thumbnail?.url || book.thumbnail || "/placeholder-book.jpg",
            author: book.author || "Global Author"
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F6F3] flex flex-col items-center justify-center p-8">
                <Loader2 size={40} className="animate-spin text-[#E8B84B] mb-4" />
                <p className="text-[#999690] font-bold uppercase tracking-widest text-[10px]">Loading Your Wishlist...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#F7F6F3] min-h-screen font-['Outfit',sans-serif] pt-32 pb-20">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap');
                
                .text-outlined {
                    -webkit-text-stroke: 1.5px #0C0C0C;
                    color: transparent;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div>
                        <Link href="/books" className="flex items-center gap-2 text-[#999690] hover:text-[#E8B84B] transition-colors mb-4 group text-sm font-bold uppercase tracking-widest">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Bookstore
                        </Link>
                        <h1 className="font-['Cormorant_Garamond',serif] text-[48px] font-bold text-[#0C0C0C] leading-none">
                            My <span className="text-outlined">Wishlist</span>
                        </h1>
                        <p className="text-[#999690] mt-2 font-medium">You have {wishlist.length} items in your curated collection</p>
                    </div>

                </div>

                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-[32px] border border-[#EBEBEB] p-20 text-center shadow-sm">
                        <div className="w-24 h-24 bg-[#F7F6F3] rounded-full flex items-center justify-center mx-auto mb-8 text-[#CCC]">
                            <Heart size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0C0C0C] mb-4">Your wishlist is empty</h2>
                        <p className="text-[#999690] max-w-md mx-auto mb-10">Start exploring our collection and save your favorite books to read them later!</p>
                        <Link href="/books" className="inline-flex items-center justify-center px-10 py-4 bg-[#0C0C0C] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#E8B84B] hover:text-[#0C0C0C] transition-all transform hover:-translate-y-1 shadow-xl">
                            Browse Books
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {wishlist.map((book) => {
                            const thumbnailUrl = book.thumbnail?.url || book.thumbnail || "/placeholder-book.jpg";
                            return (
                                <div key={book.id} className="bg-white rounded-[20px] border border-[#EBEBEB] flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group">
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <Image
                                            src={thumbnailUrl}
                                            alt={book.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <button
                                            onClick={() => handleRemoveFromWishlist(book.id)}
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-black/5"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                                            <button
                                                onClick={() => handleAddToCart(book)}
                                                className="w-full bg-[#E8B84B] text-[#0C0C0C] py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-colors"
                                            >
                                                <ShoppingCart size={14} />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="text-sm font-bold text-[#0C0C0C] line-clamp-1 mb-1 leading-tight">{book.title}</h3>
                                        <p className="text-[11px] text-[#999690] mb-3 line-clamp-1">{book.author || "Global Author"}</p>

                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="text-lg font-black text-[#0C0C0C]">
                                                <span className="text-[11px] font-medium mr-0.5">₹</span>
                                                {(parseFloat(book.price) || 0).toLocaleString()}
                                            </div>
                                            <Link href={`/books/${book.slug || book.id}`} className="text-[10px] font-bold text-[#999690] hover:text-[#E8B84B] uppercase tracking-widest transition-colors">
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
