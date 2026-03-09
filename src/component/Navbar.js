import { ChevronDown, ShoppingBasket, User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";
import Link from "next/link";

export default function Navbar() {
    const navItems = ['Home', 'Shop', 'Vendor', 'Pages', 'Blog', 'Contact'];
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <nav className="w-full bg-primary text-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center h-full">
                    {/* Categories Dropdown */}
                    <button className="bg-secondary px-8 py-5 flex items-center gap-4 font-black text-sm tracking-widest hover:opacity-90 transition-all uppercase">
                        <div className="flex flex-col gap-1.5">
                            <span className="block w-5 h-0.5 bg-white rounded-full"></span>
                            <span className="block w-5 h-0.5 bg-white rounded-full"></span>
                            <span className="block w-3 h-0.5 bg-white rounded-full"></span>
                        </div>
                        Categories
                        <ChevronDown size={14} className="mt-0.5" />
                    </button>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center ml-10 gap-10">
                        {navItems.map((item) => (
                            <Link
                                key={item}
                                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="font-black text-xs uppercase tracking-[0.2em] hover:text-white/70 transition-all py-5 border-b-4 border-transparent hover:border-white shadow-rose-300"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-6 pr-8">
                    {/* User Profile / Auth Action */}
                    <div className="flex items-center gap-4 border-r border-white/10 pr-6">
                        {user ? (
                            <div className="flex items-center gap-3 group relative cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-white/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-secondary">
                                    {user.profile?.url ? (
                                        <img src={user.profile.url} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} className="text-secondary" />
                                    )}
                                </div>
                                <div className="hidden lg:flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none text-white/50 mb-1">Welcome</span>
                                    <span className="text-xs font-black uppercase tracking-wider leading-none truncate max-w-[80px]">{user.name.split(' ')[0]}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="ml-2 p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-secondary transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-white text-primary px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-secondary hover:text-white transition-all shadow-lg"
                                >
                                    Join
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Cart Action */}
                    <div className="relative group cursor-pointer bg-secondary/20 p-2.5 rounded-xl border border-white/20 transform transition-all hover:scale-110 hover:bg-white hover:text-primary active:scale-95 shadow-lg">
                        <ShoppingBasket size={24} className="group-hover:animate-bounce" />
                        <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-primary shadow-md">0</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}

