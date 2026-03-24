import { Feather, ChevronDown, Lock, Phone, LogOut, User as UserIcon, ShoppingCart, Heart, X, CheckCircle2, Search, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, fetchProfile } from "@/redux/slices/authSlice";
import { clearLastAddedItem, fetchCart, mergeGuestCart } from "@/redux/slices/cartSlice";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
    const { user, token } = useSelector((state) => state.auth);
    const { items, totalQuantity, lastAddedItem } = useSelector((state) => state.cart);
    const { totalQuantity: wishlistCount } = useSelector((state) => state.wishlist);
    const [showCartPopup, setShowCartPopup] = useState(false);
    const dispatch = useDispatch();
    const pathname = usePathname();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (token) {
            if (!user || !user.name) {
                dispatch(fetchProfile());
            }
            // If we have local items, merge them. mergeGuestCart will call fetchCart.
            // If no local items, mergeGuestCart will just call fetchCart.
            dispatch(mergeGuestCart());
            dispatch(fetchWishlist());
        }
    }, [token, user, dispatch]);

    useEffect(() => {
        if (lastAddedItem) {
            setShowCartPopup(true);
            const timer = setTimeout(() => {
                setShowCartPopup(false);
                dispatch(clearLastAddedItem());
            }, 4000); // Popup visible for 4 seconds
            return () => clearTimeout(timer);
        }
    }, [lastAddedItem, dispatch]);

    const navItems = [
        { name: "Home", href: "/", dropdown: false },
        { name: "About Us", href: "/about", dropdown: false },
        { name: "Book", href: "/books", dropdown: false },
        { name: "Blog", href: "/blog", dropdown: false },
        { name: "Contact Us", href: "/contact", dropdown: false },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/books?query=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
        }
    };


    return (
        <header className="fixed top-0 left-0 w-full z-50 transition-all duration-500 py-1 px-4 md:px-12 bg-white shadow-sm border-b border-black/5">
            <div className="max-w-[1440px] w-full flex items-center justify-between mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center group cursor-pointer lg:pl-0">
                    <div className="relative w-24 md:w-28 h-12 md:h-14 overflow-hidden">
                        <Image
                            src="/logo.jpeg"
                            alt="Mind Gym Book Logo"
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                    </div>
                </Link>

                {/* Mobile Menu Button - Moved to Right */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="lg:hidden p-2 text-black/70 hover:text-primary transition-colors ml-auto"
                >
                    <Menu size={24} />
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group relative flex items-center gap-1.5 font-sans font-black text-[10px] uppercase tracking-[0.2em] transition-all py-2 px-3 ${isActive
                                    ? "text-primary"
                                    : "text-black/70 hover:text-primary"
                                    }`}
                            >
                                <span className="relative z-10">{item.name}</span>
                                {item.dropdown && (
                                    <ChevronDown size={14} className={`relative z-10 transition-transform ${isActive ? "text-primary" : "text-black/20 group-hover:translate-y-0.5 group-hover:text-primary"}`} />
                                )}

                                {isActive && (
                                    <div className="absolute bottom-[-2px] left-3 right-3 h-0.5 bg-primary shadow-[0_0_10px_rgba(247,148,30,0.8)]"></div>
                                )}

                                <div className={`absolute bottom-[-2px] left-3 right-3 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center ${isActive ? 'hidden' : ''}`}></div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop Search Bar */}
                <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4 xl:mx-10">
                    <form onSubmit={handleSearch} className="w-full relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-black/30 group-focus-within:text-primary transition-colors">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Find your next read..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/5 border border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-full py-2.5 pl-12 pr-4 text-[13px] font-medium placeholder:text-black/30 outline-none transition-all"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full hover:bg-primary transition-colors opacity-0 group-focus-within:opacity-100"
                        >
                            Search
                        </button>
                    </form>
                </div>


                {/* Actions - Hidden on mobile, shown in sidebar drawer */}
                <div className="hidden lg:flex items-center gap-5 relative text-black">
                    {/* Cart Icon & Popup */}
                    <div className="relative group">
                        <Link href="/cart" className="relative w-9 h-9 flex items-center justify-center border border-black/10 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all transform hover:-translate-y-1 active:scale-95 shadow-sm">
                            <ShoppingCart size={18} />
                            {totalQuantity > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>
                        {/* Cart Success Popup content remains here but only triggers on desktop actions */}
                        {showCartPopup && lastAddedItem && (
                            <div className="absolute top-12 right-0 w-72 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-black/5 p-4 z-[100] animate-slide-down">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/5 text-black">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle2 size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Added to Cart!</span>
                                    </div>
                                    <button onClick={() => setShowCartPopup(false)} className="text-black/20 hover:text-black transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                                <div className="flex gap-3 text-black">
                                    <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                                        <img src={lastAddedItem.coverImage} alt={lastAddedItem.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col justify-center overflow-hidden">
                                        <h4 className="text-[12px] font-black text-secondary line-clamp-1 mb-0.5">{lastAddedItem.title}</h4>
                                        <p className="text-[10px] text-black/40 font-bold uppercase tracking-tight mb-2">{lastAddedItem.author}</p>
                                        <span className="text-sm font-black text-primary">₹{lastAddedItem.price}</span>
                                    </div>
                                </div>
                                <Link href="/cart" onClick={() => setShowCartPopup(false)} className="mt-4 w-full bg-secondary text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-lg shadow-secondary/10">
                                    View My Cart
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="relative group">
                        <Link href="/wishlist" className="relative w-9 h-9 flex items-center justify-center border border-black/10 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all transform hover:-translate-y-1 active:scale-95 shadow-sm">
                            <Heart size={18} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {user ? (
                        <Link href="/profile" className="group relative">
                            <div className="w-10 h-10 rounded-full border border-black/10 p-0.5 group-hover:border-primary transition-all cursor-pointer overflow-hidden">
                                {(() => {
                                    const profileUrl = user.profile?.url || user.profile_image || user.avatar || (typeof user.profile === 'string' ? user.profile : null) || user.user?.profile?.url || user.user?.profile_image;
                                    if (profileUrl && profileUrl.startsWith('http')) {
                                        return <img src={profileUrl} alt={user.name || "User"} className="w-full h-full object-cover rounded-full" />;
                                    }
                                    const initials = user.profile?.initials || user.initials || (user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : "");
                                    return (
                                        <div className="w-full h-full bg-black/5 rounded-full flex items-center justify-center text-black font-bold text-xs uppercase">
                                            {initials || <UserIcon size={16} />}
                                        </div>
                                    );
                                })()}
                            </div>
                        </Link>
                    ) : (
                        <Link href="/login" className="bg-primary text-white px-8 py-3 rounded-full font-black text-[10px] tracking-widest uppercase hover:bg-black hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-sm flex items-center gap-2">
                            <Lock size={12} />
                            Log In
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar Navigation */}
            <div className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 lg:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className={`absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="flex flex-col h-full">
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-black/5 flex items-center justify-between">
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className="relative w-20 h-10">
                                <Image src="/logo.jpeg" alt="Logo" fill className="object-contain" />
                            </Link>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-black/30 hover:text-primary">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Search in Mobile Menu */}
                        <div className="p-4 border-b border-black/5">
                            <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }} className="relative">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
                                <input
                                    type="text"
                                    placeholder="Search books..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/5 rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none border border-transparent focus:border-primary/20"
                                />
                            </form>
                        </div>

                        {/* Mobile Drawer Quick Actions */}
                        <div className="grid grid-cols-3 gap-2 px-4 py-6 border-b border-black/5 bg-gray-50/50">
                            <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-black/5">
                                <div className="relative">
                                    <ShoppingCart size={20} className="text-secondary" />
                                    {totalQuantity > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                            {totalQuantity}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-black/50">Cart</span>
                            </Link>
                            <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-black/5">
                                <div className="relative">
                                    <Heart size={20} className="text-secondary" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-black/50">Wishlist</span>
                            </Link>
                            <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-black/5">
                                {user ? (
                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-black/10">
                                        {(() => {
                                            const profileUrl = user.profile?.url || user.profile_image || user.avatar || (typeof user.profile === 'string' ? user.profile : null);
                                            return profileUrl && profileUrl.startsWith('http') ?
                                                <img src={profileUrl} className="w-full h-full object-cover" alt="Profile" /> :
                                                <UserIcon size={14} className="m-auto mt-1 text-secondary" />;
                                        })()}
                                    </div>
                                ) : (
                                    <UserIcon size={20} className="text-secondary" />
                                )}
                                <span className="text-[9px] font-black uppercase tracking-widest text-black/50">{user ? "Profile" : "Account"}</span>
                            </Link>
                        </div>

                        {/* Drawer Links */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="flex flex-col gap-2">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center justify-between p-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all ${isActive ? "bg-primary/10 text-primary" : "text-black/70 hover:bg-black/5"
                                                }`}
                                        >
                                            {item.name}
                                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(247,148,30,0.8)]"></div>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-6 border-t border-black/5 mt-auto">
                            {!user && (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                                >
                                    <Lock size={16} />
                                    Account Login
                                </Link>
                            )}
                            {user && (
                                <button
                                    onClick={() => { dispatch(logoutUser()); setIsMenuOpen(false); }}
                                    className="w-full bg-black/5 text-black/70 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout Session
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>

    );
}

