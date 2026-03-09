"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/axios";
import {
    ShoppingCart,
    Heart,
    ArrowLeft,
    Loader2,
    Star,
    Plus,
    Minus,
    Check,
    Sparkles,
    BookOpen,
    Globe,
    FileText,
    Hash,
    User,
    Building2,
    Truck,
    ChevronRight,
    ChevronLeft,
    MessageSquare,
    Layers
} from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { syncAddToCart } from "@/redux/slices/cartSlice";

export default function BookDetailClient({ initialBook }) {
    const params = useParams();
    const router = useRouter();
    const [book, setBook] = useState(initialBook);
    const [loading, setLoading] = useState(!initialBook);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [relatedBooks, setRelatedBooks] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDirection, setFlipDirection] = useState('next');
    const [nextIndex, setNextIndex] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const res = await api.get('/book/all?limit=5');
                if (res.data?.success) {
                    setRelatedBooks(res.data.data?.books?.slice(0, 5) || []);
                }
            } catch (err) {
                console.error("Error fetching related books", err);
            }
        };
        fetchRelated();
    }, []);

    useEffect(() => {
        if (!initialBook && params.id) {
            fetchBookDetails();
        }
    }, [params.id, initialBook]);

    const fetchBookDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/book/${params.id}`);
            if (response.data.success) {
                setBook(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching book details:", err);
            setError("Failed to load book details");
            toast.error("Failed to load book details");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            dispatch(syncAddToCart({
                id: book.id,
                title: book.title,
                price: book.price || 25,
                coverImage: book.thumbnail?.url || book.image || "/placeholder-book.jpg",
                author: book.author || book.author_name || "Unknown Author"
            }));
        }
    };

    const incrementQuantity = () => {
        if (quantity < (book.stock || 100)) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleToggleWishlist = async () => {
        try {
            await api.post("/book/bookmark/toggle", { book_id: book.id });
            setBook(prev => ({ ...prev, isBookmarked: !prev.isBookmarked }));
            toast.success("Wishlist updated!");
        } catch (err) {
            console.error("Error toggling wishlist:", err);
            toast.error(err.response?.data?.message || "Please login to add to wishlist");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center">
                    <Loader2 size={48} className="animate-spin text-secondary mb-4" />
                    <p className="text-secondary/60 font-medium">Loading book details...</p>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h3 className="text-2xl font-black text-secondary mb-2">Book Not Found</h3>
                    <p className="text-secondary/60 mb-6">{error}</p>
                    <button
                        onClick={() => router.push("/books")}
                        className="bg-secondary text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-secondary/90 transition-all"
                    >
                        Back to Books
                    </button>
                </div>
            </div>
        );
    }

    const thumbnailUrl = book.thumbnail?.url || book.thumbnail || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop";
    const hasDiscount = book.original_price && parseFloat(book.original_price) > parseFloat(book.price);
    const discountPercent = hasDiscount
        ? Math.round(((parseFloat(book.original_price) - parseFloat(book.price)) / parseFloat(book.original_price)) * 100)
        : 0;

    const allImages = [
        book.thumbnail?.url || book.thumbnail || "/placeholder-book.jpg",
        ...(book.images ? (Array.isArray(book.images) ? book.images : [book.images]).map(img => img?.url || img) : [])
    ].filter(Boolean);

    // Provide some nice mock images if the book doesn't have multiple gallery images yet, so the user can see the effect
    if (allImages.length === 1) {
        allImages.push("https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop");
        allImages.push("https://images.unsplash.com/photo-1629196914227-2b73bc3e0a0d?w=400&h=600&fit=crop");
    }

    const handleNextImage = () => {
        if (isFlipping || allImages.length <= 1) return;
        const n = (currentImageIndex + 1) % allImages.length;
        setNextIndex(n);
        setFlipDirection('next');
        setIsFlipping(true);
        setTimeout(() => {
            setCurrentImageIndex(n);
            setIsFlipping(false);
        }, 800);
    };

    const handlePrevImage = () => {
        if (isFlipping || allImages.length <= 1) return;
        const n = currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
        setNextIndex(n);
        setFlipDirection('prev');
        setIsFlipping(true);
        setTimeout(() => {
            setCurrentImageIndex(n);
            setIsFlipping(false);
        }, 800);
    };

    const computedHighlights = [];
    if (book.highlights && Array.isArray(book.highlights)) computedHighlights.push(...book.highlights);
    else if (typeof book.highlights === 'string') computedHighlights.push(...book.highlights.split(',').map(s=>s.trim()).filter(Boolean));
    
    if (computedHighlights.length === 0) {
        if (book.seo_keywords) computedHighlights.push(...book.seo_keywords.split(',').map(s=>s.trim()).filter(Boolean));
        if (book.short_description) computedHighlights.push(book.short_description);
    }

    if (computedHighlights.length === 0) {
        computedHighlights.push(`Exceptional writing by ${book.author || 'the author'}`);
        computedHighlights.push(`Published beautifully in ${book.language || 'English'}`);
        computedHighlights.push("Highly recommended for your personal collection");
        computedHighlights.push("Perfect pacing and unforgettable themes");
    }

    return (
        <div className="min-h-screen bg-[#FFFFFE] font-['Inter',sans-serif] overflow-hidden">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-8">
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#888888] uppercase tracking-widest">
                    <button onClick={() => router.push("/")} className="hover:text-[#1A1A1A] transition-colors">Home</button>
                    <ChevronRight size={12} />
                    <button onClick={() => router.push("/books")} className="hover:text-[#1A1A1A] transition-colors">Fiction</button>
                    <ChevronRight size={12} />
                    <span className="text-[#1A1A1A]">{book.title}</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
                
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start mb-24">
                    {/* Left: Book Cover gallery */}
                    <div className="w-full lg:w-5/12 shrink-0 relative group">
                        
                        <style dangerouslySetInnerHTML={{__html: `
                            .perspective-container {
                                perspective: 2000px;
                                transform-style: preserve-3d;
                            }
                            @keyframes pageFlipNextAnim {
                                0% { transform: rotateY(0deg) scale(1); }
                                50% { transform: rotateY(-90deg) scale(1.05); }
                                100% { transform: rotateY(-180deg) scale(1); }
                            }
                            @keyframes pageFlipPrevAnim {
                                0% { transform: rotateY(-180deg) scale(1); }
                                50% { transform: rotateY(-90deg) scale(1.05); }
                                100% { transform: rotateY(0deg) scale(1); }
                            }
                            .flip-layer {
                                transform-origin: left center;
                                backface-visibility: hidden;
                                will-change: transform;
                            }
                            .animate-next { animation: pageFlipNextAnim 0.8s ease-in-out forwards; }
                            .animate-prev { animation: pageFlipPrevAnim 0.8s ease-in-out forwards; }
                        `}} />

                        <div className="relative w-[70%] mx-auto lg:w-[85%] aspect-[3/4] rounded-2xl bg-gray-100 shadow-[inset_0_-20px_40px_rgba(0,0,0,0.02)] perspective-container">
                            
                            {!isFlipping && (
                                <div className="absolute top-0 left-0 w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden z-10 transition-all">
                                    <Image src={allImages[currentImageIndex]} alt={book.title} fill quality={100} priority className="object-cover" />
                                </div>
                            )}

                            {isFlipping && flipDirection === 'next' && (
                                <>
                                    {/* Base layer: The incoming next image, waiting underneath */}
                                    <div className="absolute top-0 left-0 w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden z-0">
                                        <Image src={allImages[nextIndex]} alt={book.title} fill quality={100} priority className="object-cover" />
                                    </div>
                                    {/* Flip layer: The current image actively turning away to the left */}
                                    <div className="absolute top-0 left-0 w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden flip-layer animate-next z-20">
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/5 to-black/25 z-30 pointer-events-none mix-blend-multiply opacity-50"></div>
                                        <Image src={allImages[currentImageIndex]} alt={book.title} fill quality={100} priority className="object-cover" />
                                    </div>
                                </>
                            )}

                            {isFlipping && flipDirection === 'prev' && (
                                <>
                                    {/* Base layer: The current image staying put in background */}
                                    <div className="absolute top-0 left-0 w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden z-0">
                                        <Image src={allImages[currentImageIndex]} alt={book.title} fill quality={100} priority className="object-cover" />
                                    </div>
                                    {/* Flip layer: The previous image sweeping in from the left */}
                                    <div className="absolute top-0 left-0 w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden flip-layer animate-prev z-20">
                                        <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-black/5 to-black/0 z-30 pointer-events-none mix-blend-multiply opacity-50"></div>
                                        <Image src={allImages[nextIndex]} alt={book.title} fill quality={100} priority className="object-cover" />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Navigation controls underneath */}
                        {allImages.length > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-8 w-[70%] mx-auto lg:w-[85%]">
                                <button onClick={handlePrevImage} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md">
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="text-[12px] font-black tracking-widest text-gray-400">
                                    {currentImageIndex + 1} / {allImages.length}
                                </div>
                                <button onClick={handleNextImage} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Book Details */}
                    <div className="w-full lg:w-7/12 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 bg-[#FFFDF9] px-3 py-1.5 rounded-full border border-[#FFC107]/20 shadow-sm w-max mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC107]">
                                Editor's Choice
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1A1A1A] leading-[1.1] tracking-tight mb-4">
                            {book.title}
                        </h1>

                        <p className="text-[#666666] text-lg font-medium mb-8 flex items-center gap-2">
                            By
                            <span className="text-[#1A1A1A] font-bold pb-0.5 border-b-[2px] border-black hover:text-[#FFC107] hover:border-[#FFC107] transition-colors cursor-pointer">
                                {book.author || "Evelyn M. Steele"}
                            </span>
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                            {/* Stars */}
                            <div className="flex items-center gap-1.5">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4].map((i) => <Star key={i} size={16} className="fill-[#FFC107] text-[#FFC107]" />)}
                                    <Star size={16} className="text-[#FFC107] stroke-[2px] opacity-70" />
                                </div>
                                <span className="text-sm font-bold text-[#1A1A1A] ml-1">4.5</span>
                                <span className="text-[13px] font-medium text-[#888888]">(120 Reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-[#1A1A1A]">
                                    ${parseFloat(book.price || 24.99).toFixed(2)}
                                </span>
                                {hasDiscount && (
                                    <span className="text-sm text-[#888888] line-through font-medium">
                                        ${parseFloat(book.original_price).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-[#666666] text-[15px] leading-relaxed mb-8">
                            Experience a captivating narrative that will keep you engaged from the very first page to the last. This highly recommended edition is perfect for your personal library or as a thoughtful gift for any book lover.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full h-14 p-1 shadow-inner max-w-[140px]">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-full rounded-l-full flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:shadow-sm transition-all text-xl"
                                >
                                    -
                                </button>
                                <div className="flex-1 flex items-center justify-center font-bold text-[#1A1A1A] text-lg select-none">
                                    {quantity}
                                </div>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    disabled={quantity >= book.stock}
                                    className="w-12 h-full rounded-r-full flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:shadow-sm transition-all text-xl disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={book.stock < 1}
                                className="flex-1 sm:flex-none bg-[#FFC107] text-[#1A1A1A] px-10 py-4 rounded-full font-bold text-[14px] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 shadow-[0_10px_20px_-10px_rgba(255,193,7,0.5)] transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                            >
                                <ShoppingCart size={18} />
                                {book.stock < 1 ? "Out of Stock" : "Add to Cart"}
                            </button>

                            <button
                                onClick={handleToggleWishlist}
                                className="flex-1 w-full sm:flex-none sm:w-auto bg-white text-[#1A1A1A] px-10 py-4 rounded-full font-bold text-[14px] border border-gray-200 hover:border-black transition-all flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                <Heart size={18} className={book.isBookmarked ? "fill-red-500 text-red-500" : "text-[#1A1A1A] group-hover:fill-red-50 text-red-500"} />
                                Add to Wishlist
                            </button>
                        </div>

                        {/* Stock & Shipping */}
                        <div className="flex flex-wrap items-center gap-6 text-[13px] font-bold text-[#1A1A1A]">
                            <span className="flex items-center gap-2">
                                <Check size={16} className="text-green-500" /> In Stock
                            </span>
                            <span className="flex items-center gap-2 text-[#666666]">
                                <Truck size={16} /> Free Worldwide Shipping
                            </span>
                        </div>

                    </div>
                </div>

                {/* Divider Line */}
                <div className="w-full h-[1px] bg-gray-100 mb-20"></div>

                {/* Middle Section: Description & Product Details */}
                <div className="grid lg:grid-cols-3 gap-16 lg:gap-24 mb-24">
                    
                    {/* Left: Long Description & Highlights */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Heading */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-4 h-4 rounded-sm bg-[#FFC107] shadow-sm transform rotate-45" />
                            <h2 className="text-2xl font-black text-[#1A1A1A]">Book Description</h2>
                        </div>

                        {/* Description Text */}
                        <div className="prose prose-sm max-w-none text-[#444] leading-[1.8] text-[15px] space-y-6">
                            <div dangerouslySetInnerHTML={{ __html: book.description || "<p>No detailed description available.</p>" }} />
                        </div>

                        {/* Highlights Box */}
                        {computedHighlights.length > 0 && (
                            <div className="bg-[#FFF8E7] rounded-3xl p-8 md:p-12 border border-[#FFC107]/10">
                                <h3 className="text-lg font-black text-[#1A1A1A] mb-8 flex items-center gap-2">
                                    <span>💡</span> Key Highlights
                                </h3>
                                
                                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                                    {computedHighlights.map((highlightItem, idx) => (
                                        <div key={idx} className="flex items-start gap-3 col-span-1">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FFC107] shrink-0" />
                                            <span className="text-[14px] font-bold text-[#444] leading-snug">{highlightItem}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right: Product Details Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50/80 rounded-3xl p-8 border border-gray-100">
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-8">Product Details</h3>
                            
                            <div className="space-y-5">
                                {[
                                    { icon: <Hash size={16}/>, label: "ISBN", value: book.isbn || "N/A" },
                                    { icon: <Globe size={16}/>, label: "Language", value: book.language || "N/A" },
                                    { icon: <FileText size={16}/>, label: "Price", value: `₹${parseFloat(book.price || 0).toFixed(2)}` },
                                    { icon: <FileText size={16}/>, label: "MRP", value: book.original_price ? `₹${parseFloat(book.original_price).toFixed(2)}` : "N/A" },
                                    { icon: <Layers size={16}/>, label: "Weight", value: book.weight ? `${book.weight}g` : "N/A" },
                                    { icon: <Building2 size={16}/>, label: "Dimensions", value: book.dimensions || "N/A" },
                                    { icon: <BookOpen size={16}/>, label: "Condition", value: book.condition || "New" },
                                    { icon: <Truck size={16}/>, label: "Stock", value: book.stock !== undefined ? book.stock : "N/A" },
                                    { icon: <FileText size={16}/>, label: "Release", value: book.release_date || (book.created_at ? new Date(book.created_at).toLocaleDateString() : "N/A") }
                                ].map((detail, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-200/60 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3 text-[#888888]">
                                            {detail.icon}
                                            <span className="text-[13px] font-bold uppercase tracking-wider">{detail.label}</span>
                                        </div>
                                        <span className="text-[14px] font-bold text-[#1A1A1A] text-right max-w-[50%]">{detail.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-200 text-center">
                                <button className="text-[13px] font-black tracking-widest uppercase text-[#FFC107] hover:text-[#1A1A1A] transition-colors inline-flex items-center gap-1">
                                    Read a Sample Chapter <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="w-full h-[1px] bg-gray-100 mb-20"></div>

                {/* Reader Reviews Section */}
                <div className="mb-24">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-3xl font-black text-[#1A1A1A] mb-2">Reader Reviews</h2>
                            <p className="text-[#666666] text-sm font-medium">Verified purchases from our community</p>
                        </div>
                        <button className="bg-white border text-sm border-gray-200 hover:border-black text-[#1A1A1A] px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2">
                            Write a Review
                        </button>
                    </div>

                    <style dangerouslySetInnerHTML={{__html: `
                        @keyframes slide-marquee {
                            from { transform: translateX(0); }
                            to { transform: translateX(-50%); }
                        }
                        .marquee-container {
                            display: flex;
                            width: max-content;
                            animation: slide-marquee 15s linear infinite;
                        }
                        .marquee-container:hover {
                            animation-play-state: paused;
                        }
                    `}} />

                    <div className="relative overflow-hidden w-full before:absolute before:left-0 before:top-0 before:h-full before:w-16 before:bg-gradient-to-r before:from-[#FAFAFA] before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:h-full after:w-16 after:bg-gradient-to-l after:from-[#FAFAFA] after:to-transparent after:z-10 py-4">
                        <div className="marquee-container gap-6">
                        {/* We duplicate the array to create a seamless infinite scroll effect */}
                        {[...[
                            { name: "Sarah Jenkins", text: "I couldn't put this book down. The way Evelyn describes the setting makes you feel like you're standing right there in the rain. Absolutely stunning debut!", stars: 5 },
                            { name: "Michael Ross", text: "Read every of its 348 pages in a single sitting! Every chapter is worth every page. The emotional depth is unlike anything I've read this year.", stars: 4 },
                            { name: "Elena Rodriguez", text: "The author has a gift for the written word. I ended up reading it together in a book club. Truly a masterpiece of modern fiction.", stars: 5 },
                            { name: "Kevin Chen", text: "The narrative pace is slow, but the writing is just so beautiful. A thoughtful meditation on what we leave behind.", stars: 4 }
                        ], ...[
                            { name: "Sarah Jenkins", text: "I couldn't put this book down. The way Evelyn describes the setting makes you feel like you're standing right there in the rain. Absolutely stunning debut!", stars: 5 },
                            { name: "Michael Ross", text: "Read every of its 348 pages in a single sitting! Every chapter is worth every page. The emotional depth is unlike anything I've read this year.", stars: 4 },
                            { name: "Elena Rodriguez", text: "The author has a gift for the written word. I ended up reading it together in a book club. Truly a masterpiece of modern fiction.", stars: 5 },
                            { name: "Kevin Chen", text: "The narrative pace is slow, but the writing is just so beautiful. A thoughtful meditation on what we leave behind.", stars: 4 }
                        ]].map((review, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shrink-0 w-[300px] md:w-[400px] whitespace-normal flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[16px] font-black text-[#1A1A1A]">{review.name}</h4>
                                        <div className="flex gap-1 shrink-0">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={i < review.stars ? "fill-[#FFC107] text-[#FFC107]" : "text-gray-200 fill-gray-100"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[#666666] text-[14px] leading-relaxed font-medium line-clamp-4">"{review.text}"</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>

                </div>

                {/* Related Books Section */}
                <div className="mb-24">
                    <h2 className="text-2xl font-black text-[#1A1A1A] mb-10">Related Books You Might Like</h2>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                        {relatedBooks.length > 0 ? relatedBooks.map((related, idx) => (
                            <div key={related.id || idx} className="group cursor-pointer" onClick={() => router.push(`/books/${related.id}`)}>
                                <div className="relative w-full aspect-[3/4] rounded-xl bg-gray-100 mb-4 overflow-hidden border border-gray-200/60 shadow-sm">
                                     <Image 
                                        src={related.thumbnail?.url || related.thumbnail || related.image || "/placeholder-book.jpg"} 
                                        alt={related.title} 
                                        fill 
                                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                     />
                                     <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Optional: Handle wishlist toggle here if desired
                                        }}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                                    >
                                        <Heart size={14} />
                                     </button>
                                </div>
                                <h4 className="text-[14px] font-black text-[#1A1A1A] mb-1 leading-tight line-clamp-1">{related.title}</h4>
                                <p className="text-[12px] font-bold text-[#888888] mb-2">{related.author || "Global Author"}</p>
                                <span className="text-[13px] font-black text-[#FFC107]">₹{(parseFloat(related.price) || 0).toLocaleString()}</span>
                            </div>
                        )) : (
                            // Loading Skeleton placeholder
                            [...Array(5)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="w-full aspect-[3/4] rounded-xl bg-gray-200 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Bottom CTA Banner */}
                <div className="bg-[#FFF8E7] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden flex flex-col items-center max-w-5xl mx-auto">
                    {/* Decorative Blurs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 blur-3xl rounded-full mix-blend-overlay"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFC107]/20 blur-3xl rounded-full mix-blend-overlay"></div>
                    
                    <h2 className="text-3xl md:text-5xl font-black text-[#1A1A1A] mb-6 relative z-10 leading-[1.15] tracking-tight">
                        Discover Your Next Great Adventure
                    </h2>
                    
                    <p className="text-[#666666] text-[15px] font-medium max-w-xl mx-auto mb-10 relative z-10">
                        Explore our curated collections of award-winning fiction, insightful non-fiction, and timeless classics.
                    </p>
                    
                    <button onClick={() => router.push("/books")} className="bg-[#1A1A1A] text-white px-10 py-5 rounded-full font-bold text-[14px] hover:bg-[#FFC107] hover:text-[#1A1A1A] transition-all transform hover:-translate-y-1 shadow-lg relative z-10 active:scale-95">
                        Browse All Books
                    </button>
                </div>

            </main>
        </div>
    );
}
