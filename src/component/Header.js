import { Feather, ChevronDown, Lock, Phone, LogOut, User as UserIcon, ShoppingCart, Heart, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, fetchProfile } from "@/redux/slices/authSlice";
import { clearLastAddedItem, fetchCart, mergeGuestCart } from "@/redux/slices/cartSlice";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
    const { user, token } = useSelector((state) => state.auth);
    const { items, totalQuantity, lastAddedItem } = useSelector((state) => state.cart);
    const [showCartPopup, setShowCartPopup] = useState(false);
    const dispatch = useDispatch();
    const pathname = usePathname();

    useEffect(() => {
        if (token) {
            if (!user || !user.name) {
                dispatch(fetchProfile());
            }
            // If we have local items, merge them. mergeGuestCart will call fetchCart.
            // If no local items, mergeGuestCart will just call fetchCart.
            dispatch(mergeGuestCart());
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


    return (
        <header className="fixed top-0 left-0 w-full z-50 transition-all duration-500 py-1 px-6 md:px-12 bg-white shadow-sm border-b border-black/5">
            <div className="w-full flex items-center justify-between mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center group cursor-pointer">
                    <div className="relative w-28 h-14 overflow-hidden">
                        <Image
                            src="/logo.jpeg"
                            alt="Mind Gym Book Logo"
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                    </div>
                </Link>

                {/* Navigation */}
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


                {/* Actions */}
                <div className="flex items-center gap-5 relative">
                    {/* Cart Icon & Popup */}
                    <div className="relative group">
                        <Link href="/cart" className="relative w-9 h-9 flex items-center justify-center text-black border border-black/10 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all transform hover:-translate-y-1 active:scale-95 shadow-sm">
                            <ShoppingCart size={18} />
                            {totalQuantity > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>

                        {/* Cart Success Popup */}
                        {showCartPopup && lastAddedItem && (
                            <div className="absolute top-12 right-0 w-72 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-black/5 p-4 z-[100] animate-slide-down">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/5">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle2 size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Added to Cart!</span>
                                    </div>
                                    <button
                                        onClick={() => setShowCartPopup(false)}
                                        className="text-black/20 hover:text-black transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <div className="flex gap-3">
                                    <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                                        <img
                                            src={lastAddedItem.coverImage}
                                            alt={lastAddedItem.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center overflow-hidden">
                                        <h4 className="text-[12px] font-black text-secondary line-clamp-1 mb-0.5">{lastAddedItem.title}</h4>
                                        <p className="text-[10px] text-black/40 font-bold uppercase tracking-tight mb-2">{lastAddedItem.author}</p>
                                        <span className="text-sm font-black text-primary">₹{lastAddedItem.price}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/cart"
                                    onClick={() => setShowCartPopup(false)}
                                    className="mt-4 w-full bg-secondary text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-lg shadow-secondary/10"
                                >
                                    View My Cart
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="relative group">
                        <Link href="/wishlist" className="relative w-9 h-9 flex items-center justify-center text-black border border-black/10 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all transform hover:-translate-y-1 active:scale-95 shadow-sm">
                            <Heart size={18} />
                        </Link>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/profile" className="group relative">
                                <div className="w-10 h-10 rounded-full border border-black/10 p-0.5 group-hover:border-primary transition-all cursor-pointer overflow-hidden">
                                    {(() => {
                                        const profileUrl =
                                            user.profile?.url ||
                                            user.profile_image ||
                                            user.avatar ||
                                            (typeof user.profile === 'string' ? user.profile : null) ||
                                            user.user?.profile?.url ||
                                            user.user?.profile_image;

                                        if (profileUrl && profileUrl.startsWith('http')) {
                                            return (
                                                <img
                                                    src={profileUrl}
                                                    alt={user.name || "User"}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            );
                                        }

                                        const initials = user.profile?.initials || user.initials ||
                                            (user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : "");

                                        return (
                                            <div className="w-full h-full bg-black/5 rounded-full flex items-center justify-center text-black font-bold text-xs uppercase">
                                                {initials || <UserIcon size={18} />}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="bg-primary text-white px-8 py-3 rounded-full font-black text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-md flex items-center gap-2">
                            <Lock size={14} />
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </header>

    );
}

