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
    const [reviews, setReviews] = useState([]);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [reviewName, setReviewName] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const res = await api.get('/book/all?limit=5');
                if (res.data?.success) {
                    const data = res.data.data || {};
                    let allBooks = [];
                    const booksSource = data.books || data;

                    if (Array.isArray(booksSource)) {
                        allBooks = booksSource;
                    } else if (booksSource && typeof booksSource === 'object') {
                        allBooks = Object.values(booksSource).flat().filter(book => book !== null && typeof book === 'object');
                    }

                    setRelatedBooks(allBooks.slice(0, 5));
                }
            } catch (err) {
                console.error("Error fetching related books", err);
            }
        };
        fetchRelated();
    }, []);

    useEffect(() => {
        if (book?.id) {
            const fetchReviews = async () => {
                try {
                    const res = await api.get(`/review/book/${book.id}`);
                    if (res.data?.success) {
                        setReviews(res.data.data || []);
                    }
                } catch (err) {
                    console.error("Error fetching reviews", err);
                }
            };
            fetchReviews();
        }
    }, [book?.id]);

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
                author: book.author || book.author_name || "Unknown Author",
                tax_applicable: book.tax_applicable,
                tax_type: book.tax_type,
                tax_rate: book.tax_rate
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
    else if (typeof book.highlights === 'string') computedHighlights.push(...book.highlights.split(',').map(s => s.trim()).filter(Boolean));

    if (computedHighlights.length === 0) {
        if (book.seo_keywords) computedHighlights.push(...book.seo_keywords.split(',').map(s => s.trim()).filter(Boolean));
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

                        <style dangerouslySetInnerHTML={{
                            __html: `
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
                            <span className="text-[#1A1A1A] font-bold">
                                {book.author || "Evelyn M. Steele"}
                            </span>
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                            {/* Stars */}
                            <div className="flex items-center gap-1.5">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((i) => {
                                        const bookRating = Number(book.average_rating || book.rating || 0);
                                        const reviewsAvg = reviews.length > 0 ? reviews.reduce((acc, rev) => acc + Number(rev.rating), 0) / reviews.length : 0;
                                        const finalRating = bookRating > 0 ? bookRating : reviewsAvg;

                                        return (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i <= Math.round(finalRating) ? "fill-[#FFC107] text-[#FFC107]" : "text-[#FFC107] stroke-[2px] opacity-20"}
                                            />
                                        );
                                    })}
                                </div>
                                <span className="text-sm font-black text-[#1A1A1A] ml-1">
                                    {(() => {
                                        const bookRating = Number(book.average_rating || book.rating || 0);
                                        const reviewsAvg = reviews.length > 0 ? reviews.reduce((acc, rev) => acc + Number(rev.rating), 0) / reviews.length : 0;
                                        return (bookRating > 0 ? bookRating : reviewsAvg).toFixed(1);
                                    })()}
                                </span>
                                <span className="text-[13px] font-bold text-[#888888]">
                                    ({Math.max(Number(book.reviews_count || 0), reviews.length)} {Math.max(Number(book.reviews_count || 0), reviews.length) === 1 ? 'Review' : 'Reviews'})
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-black text-[#1A1A1A]">
                                    ₹{(parseFloat(book.price || 0)).toLocaleString()}
                                </span>
                                {(() => {
                                    const original = parseFloat(book.original_price);
                                    const current = parseFloat(book.price || 0);
                                    const displayMrp = (original && original > 0 && original > current) ? original : (current > 0 ? current * 1.25 : 0);
                                    
                                    if (displayMrp > current) {
                                        return (
                                            <span className="text-base text-yellow-500 line-through font-bold">
                                                ₹{Math.round(displayMrp).toLocaleString()}
                                            </span>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>

                        <p className="text-[#666666] text-[15px] leading-relaxed mb-8 line-clamp-4">
                            {book.description || "Experience a captivating narrative that will keep you engaged from the very first page to the last. This highly recommended edition is perfect for your personal library or as a thoughtful gift for any book lover."}
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
                                    { icon: <Hash size={16} />, label: "ISBN", value: book.isbn || "N/A" },
                                    { icon: <Globe size={16} />, label: "Language", value: book.language || "N/A" },
                                    { icon: <FileText size={16} />, label: "Price", value: `₹${parseFloat(book.price || 0).toFixed(2)}` },
                                    { icon: <Layers size={16} />, label: "Weight", value: book.weight ? `${book.weight}g` : "N/A" },
                                    { icon: <Building2 size={16} />, label: "Dimensions", value: book.dimensions || "N/A" },
                                    { icon: <BookOpen size={16} />, label: "Condition", value: book.condition || "New" },
                                    { icon: <Truck size={16} />, label: "Stock", value: book.stock !== undefined ? book.stock : "N/A" },
                                    { icon: <FileText size={16} />, label: "Tax", value: (() => {
                                        const taxRate = parseFloat(book.tax_rate) || 0;
                                        return `${taxRate}%`;
                                    })() },
                                    { icon: <FileText size={16} />, label: "Release", value: book.published_date || (book.createdAt || book.created_at ? new Date(book.createdAt || book.created_at).toLocaleDateString() : "N/A") }
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
                                <a
                                    href={`https://play.google.com/store/search?q=${encodeURIComponent(`${book.title} ${book.author}`)}&c=books`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[13px] font-black tracking-widest uppercase text-[#FFC107] hover:text-[#1A1A1A] transition-colors inline-flex items-center gap-1"
                                >
                                    Read a Sample Chapter <ChevronRight size={14} />
                                </a>
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
                        <button onClick={() => setIsReviewOpen(true)} className="bg-white border text-sm border-gray-200 hover:border-black text-[#1A1A1A] px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2">
                            Write a Review
                        </button>
                    </div>

                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes slide-marquee {
                            from { transform: translateX(0); }
                            to { transform: translateX(-50%); }
                        }
                        .marquee-container {
                            display: flex;
                            width: max-content;
                            animation: slide-marquee 20s linear infinite;
                        }
                        .marquee-container:hover {
                            animation-play-state: paused;
                        }
                    `}} />

                    {reviews && reviews.length > 0 ? (
                        <div className="relative overflow-hidden w-full before:absolute before:left-0 before:top-0 before:h-full before:w-16 before:bg-gradient-to-r before:from-[#FAFAFA] before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:h-full after:w-16 after:bg-gradient-to-l after:from-[#FAFAFA] after:to-transparent after:z-10 py-4">
                            <div className={`gap-6 ${reviews.length > 3 ? "marquee-container" : "flex w-full"}`}>
                                {/* We duplicate the array to create a seamless infinite scroll effect ONLY if more than 3 reviews */}
                                {(reviews.length > 3 ? [...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews] : reviews).map((review, idx) => (
                                    <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shrink-0 w-[300px] md:w-[400px] whitespace-normal flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-[16px] font-black text-[#1A1A1A]">{review.user?.name || "Anonymous Reader"}</h4>
                                                <div className="flex gap-1 shrink-0">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} className={i < review.rating ? "fill-[#FFC107] text-[#FFC107]" : "text-gray-200 fill-gray-100"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-[#666666] text-[14px] leading-relaxed font-medium line-clamp-4">"{review.comment}"</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
                            <h3 className="text-xl font-black text-[#1A1A1A] mb-2">No Reviews Yet</h3>
                            <p className="text-[#666666] font-medium mb-6">Be the first to share your thoughts about this book!</p>
                            <button onClick={() => setIsReviewOpen(true)} className="bg-white border text-sm border-gray-200 hover:border-black text-[#1A1A1A] px-6 py-3 rounded-full font-bold transition-all inline-flex items-center gap-2">
                                Write the First Review
                            </button>
                        </div>
                    )}

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

            {/* Review Modal */}
            {isReviewOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Dark Overlay */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsReviewOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl z-10 animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setIsReviewOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <h3 className="text-2xl font-black text-[#1A1A1A] mb-2">Write a Review</h3>
                        <p className="text-[#666666] text-sm mb-6">Share your thoughts about this book with the community.</p>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            if (reviewRating === 0) {
                                toast.error("Please select a rating.");
                                return;
                            }
                            try {
                                const res = await api.post("/review/add", {
                                    bookId: book.id,
                                    rating: reviewRating,
                                    comment: reviewText
                                });
                                if (res.data?.success) {
                                    toast.success("Review submitted successfully!");
                                    // Optionally fetch reviews again or just push to local
                                    const newReview = res.data.data;
                                    setReviews([newReview, ...reviews]);
                                    setIsReviewOpen(false);
                                    setReviewText("");
                                    setReviewName("");
                                    setReviewRating(0);
                                } else {
                                    toast.error(res.data?.message || "Failed to submit review");
                                }
                            } catch (err) {
                                console.error("Error submitting review:", err);
                                const errMessage = err.response?.data?.message?.toLowerCase();
                                if (err.response?.status === 401 || (errMessage && errMessage.includes("jwt expired"))) {
                                    toast.error("Your session has expired. Please login again to write a review.");
                                    setIsReviewOpen(false);
                                    router.push("/login?redirect=/books/" + book.id);
                                } else {
                                    toast.error(err.response?.data?.message || "Please login to submit a review");
                                }
                            }
                        }}>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Rating</label>
                                <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onClick={() => setReviewRating(star)}
                                        >
                                            <Star
                                                size={32}
                                                className={(hoverRating || reviewRating) >= star ? "fill-[#FFC107] text-[#FFC107]" : "text-gray-200 fill-gray-100 transition-colors"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Note: The backend uses the logged-in user's name, so this field is just for display or we can remove it. Keeping it disabled if logged in or we can pass it if the backend supports it. For now, it's just visually here. */}
                            <div className="mb-6 hidden">
                                <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Name</label>
                                <input
                                    type="text"
                                    value={reviewName}
                                    onChange={(e) => setReviewName(e.target.value)}
                                    placeholder="Your Name (Optional)"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200"
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Your Review</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="What did you think about the book?"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#FFC107] text-[#1A1A1A] px-6 py-4 rounded-xl font-bold text-[15px] hover:bg-black hover:text-white transition-all shadow-[0_4px_14px_0_rgba(255,193,7,0.39)] transform hover:-translate-y-0.5 active:scale-95"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
