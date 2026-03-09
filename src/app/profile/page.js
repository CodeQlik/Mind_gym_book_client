"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    Camera,
    Edit3,
    LogOut,
    ShieldCheck,
    BookOpen,
    Heart,
    ShoppingBag,
    Settings,
    ChevronRight,
    CreditCard,
    Bell,
    Key,
    Plus,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";
import { logoutUser, fetchProfile } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import api from "@/lib/axios";

const ProfilePage = () => {
    const { user, token } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState("profile");
    const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
    const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [isChanging, setIsChanging] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push("/login");
        } else if (!user || !user.name) {
            dispatch(fetchProfile());
        }
    }, [token, user, router, dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
        router.push("/login");
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        setIsChanging(true);
        try {
            await api.post("/users/change-password", {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Password updated successfully!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setActiveTab("profile");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setIsChanging(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-[#D76B52]/20 border-t-[#D76B52] rounded-full animate-spin mb-4"></div>
                    <span className="text-secondary/40 font-black uppercase tracking-widest text-[10px]">Preparing Dashboard</span>
                </div>
            </div>
        );
    }

    const profileUrl =
        user.profile?.url ||
        user.profile_image ||
        user.avatar ||
        (typeof user.profile === 'string' ? user.profile : null) ||
        user.user?.profile?.url ||
        user.user?.profile_image;

    const navItems = [
        { id: "profile", label: "Dashboard", icon: UserIcon },
        { id: "wishlist", label: "My Library", icon: Heart },
        { id: "orders", label: "Orders", icon: ShoppingBag },
        { id: "password", label: "Security", icon: Key },
        { id: "payments", label: "Wallet", icon: CreditCard },
        { id: "notifications", label: "Updates", icon: Bell },
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-secondary relative overflow-hidden p-20">
            {/* Background Decorative Blurs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#D76B52]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-[#2D3E50]/5 rounded-full blur-[120px]" />
            </div>


            <main className="flex-1 w-full max-w-7xl mx-auto py-12 px-6 lg:px-12 relative z-10">
                {/* Greeting Section */}
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl font-black text-secondary tracking-tight mb-2 uppercase">
                        Welcome back, <span className="text-[#D76B52]">{user.name?.split(" ")[0] || "Friend"}</span>.
                    </h1>
                    <p className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.4em] mb-1">Your Personal Sanctuary for Mental Excellence</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-72 flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                        <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-secondary/5 border border-white/40 overflow-hidden sticky top-28 p-6">
                            {/* Profile Preview Card */}
                            <div className="mb-8 p-6 bg-[#FDFBF7] rounded-[32px] border border-secondary/5 flex flex-col items-center text-center">
                                <div className="relative mb-4 group cursor-pointer">
                                    <div className="w-24 h-24 rounded-[32px] border-4 border-white shadow-xl overflow-hidden bg-white transition-all duration-500 group-hover:scale-105 group-hover:shadow-[#D76B52]/20">
                                        {profileUrl ? (
                                            <img src={profileUrl} alt={user.name || user.user?.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#2D3E50]/5 flex items-center justify-center text-[#2D3E50]/20 font-black text-2xl uppercase">
                                                {user.name?.[0] || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <button className="absolute -bottom-1 -right-1 bg-[#D76B52] text-white p-2.5 rounded-2xl shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-all">
                                        <Camera size={14} />
                                    </button>
                                </div>
                                <h3 className="text-sm font-black text-secondary tracking-tight uppercase leading-tight">
                                    {user.name || user.user?.name || "User"}
                                </h3>
                                <p className="text-[9px] font-bold text-secondary/30 uppercase tracking-widest mt-1">ID: #{user.id?.toString().slice(-4) || "0000"}</p>
                            </div>

                            {/* Nav Links */}
                            <nav className="space-y-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center justify-between group p-4 rounded-2xl transition-all duration-300 ${activeTab === item.id
                                            ? "bg-[#D76B52] text-white shadow-xl shadow-[#D76B52]/20"
                                            : "text-secondary/60 hover:bg-[#D76B52]/5 hover:text-[#D76B52]"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={18} className={activeTab === item.id ? "text-white" : "opacity-40 group-hover:opacity-100 transition-opacity"} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                        </div>
                                        <ChevronRight size={14} className={`transition-all duration-300 ${activeTab === item.id ? "translate-x-1 opacity-100" : "opacity-0 group-hover:opacity-40 group-hover:translate-x-0.5"}`} />
                                    </button>
                                ))}

                                <div className="mt-6 pt-4 border-t border-secondary/5">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest group"
                                    >
                                        <LogOut size={18} className="text-red-500/30 group-hover:text-red-500 transition-colors" />
                                        Logout
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                        <div className="bg-white/90 backdrop-blur-2xl rounded-[40px] p-8 md:p-14 shadow-2xl shadow-secondary/5 border border-white/50 min-h-[680px] transition-all duration-500 relative overflow-hidden">

                            {/* Decorative Blur Inside Content */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D76B52]/5 rounded-full blur-3xl pointer-events-none" />

                            {/* PROFILE TAB */}
                            {activeTab === "profile" && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div className="flex items-start justify-between mb-16">
                                        <div>
                                            <span className="text-[10px] font-black text-[#D76B52] uppercase tracking-[0.5em] mb-2 block">Dashboard</span>
                                            <h3 className="text-3xl font-black text-secondary uppercase tracking-tight">Account Overview</h3>
                                        </div>
                                        <button className="bg-[#D76B52]/10 text-[#D76B52] p-4 rounded-[20px] hover:bg-[#D76B52] hover:text-white transition-all shadow-lg shadow-[#D76B52]/10 active:scale-95 group">
                                            <Edit3 size={20} className="group-hover:rotate-12 transition-transform" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Card: Email */}
                                        <div className="p-8 rounded-[32px] bg-[#FDFBF7] border border-secondary/5 group hover:shadow-2xl hover:shadow-secondary/5 hover:border-[#D76B52]/20 transition-all duration-500">
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#D76B52] group-hover:scale-110 transition-transform duration-500">
                                                    <Mail size={20} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/30">Email Address</span>
                                            </div>
                                            <span className="text-base font-bold text-secondary block pl-1 truncate">
                                                {user.email || user.user?.email || "No email provided"}
                                            </span>
                                        </div>

                                        {/* Card: Phone */}
                                        <div className="p-8 rounded-[32px] bg-[#FDFBF7] border border-secondary/5 group hover:shadow-2xl hover:shadow-secondary/5 hover:border-[#D76B52]/20 transition-all duration-500">
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#D76B52] group-hover:scale-110 transition-transform duration-500">
                                                    <Phone size={20} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/30">Contact No.</span>
                                            </div>
                                            <span className="text-base font-bold text-secondary block pl-1">
                                                {user.phone || user.user?.phone || "Not linked"}
                                            </span>
                                        </div>

                                        {/* Card: Subscription */}
                                        <div className="p-8 rounded-[32px] bg-secondary text-white group hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-500 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                                <BookOpen size={80} className="rotate-12" />
                                            </div>
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                                    <ShieldCheck size={20} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Membership Status</span>
                                            </div>
                                            <span className="text-xl font-black uppercase tracking-widest block pl-1">
                                                {user.subscription_status || "Free Plan"}
                                            </span>
                                            <button className="mt-6 text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors flex items-center gap-2">
                                                Upgrade Now <ChevronRight size={12} />
                                            </button>
                                        </div>

                                        {/* Card: Address */}
                                        <div className="p-8 rounded-[32px] bg-[#FDFBF7] border border-secondary/5 group hover:shadow-2xl hover:shadow-secondary/5 hover:border-[#D76B52]/20 transition-all duration-500">
                                            <div className="flex items-center justify-between mb-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#D76B52] group-hover:scale-110 transition-transform duration-500">
                                                        <MapPin size={20} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/30">Shipping Address</span>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-secondary/60 italic leading-relaxed pl-1 line-clamp-2">
                                                {user.address || user.user?.address || "No primary address set. Add one for faster checkouts."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CHANGE PASSWORD TAB */}
                            {activeTab === "password" && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div className="mb-16">
                                        <span className="text-[10px] font-black text-[#D76B52] uppercase tracking-[0.5em] mb-2 block">Security Center</span>
                                        <h3 className="text-3xl font-black text-secondary uppercase tracking-tight">Access Control</h3>
                                    </div>

                                    <form onSubmit={handlePasswordChange} className="max-w-md space-y-8">
                                        {/* Inputs with the same style as Login/Register */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest pl-1">Current Password</label>
                                            <div className="relative group">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/20 transition-colors group-focus-within:text-[#D76B52]">
                                                    <Lock size={18} />
                                                </span>
                                                <input
                                                    type={showPassword.old ? "text" : "password"}
                                                    placeholder="••••••••••••"
                                                    value={passwordData.oldPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                                    className="w-full h-14 bg-[#FDFBF7] border border-secondary/10 rounded-[20px] pl-16 pr-14 font-bold text-secondary text-sm outline-none transition-all focus:border-[#D76B52]/40 focus:bg-white focus:shadow-xl focus:shadow-[#D76B52]/5"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary/20 hover:text-secondary transition-colors"
                                                >
                                                    {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest pl-1">New Password</label>
                                            <div className="relative group">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/20 transition-colors group-focus-within:text-[#D76B52]">
                                                    <Key size={18} />
                                                </span>
                                                <input
                                                    type={showPassword.new ? "text" : "password"}
                                                    placeholder="Minimum 8 characters"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="w-full h-14 bg-[#FDFBF7] border border-secondary/10 rounded-[20px] pl-16 pr-14 font-bold text-secondary text-sm outline-none transition-all focus:border-[#D76B52]/40 focus:bg-white focus:shadow-xl focus:shadow-[#D76B52]/5"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary/20 hover:text-secondary transition-colors"
                                                >
                                                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest pl-1">Confirm New Password</label>
                                            <div className="relative group">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/20 transition-colors group-focus-within:text-[#D76B52]">
                                                    <ShieldCheck size={18} />
                                                </span>
                                                <input
                                                    type={showPassword.confirm ? "text" : "password"}
                                                    placeholder="Repeat new password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="w-full h-14 bg-[#FDFBF7] border border-secondary/10 rounded-[20px] pl-16 pr-14 font-bold text-secondary text-sm outline-none transition-all focus:border-[#D76B52]/40 focus:bg-white focus:shadow-xl focus:shadow-[#D76B52]/5"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary/20 hover:text-secondary transition-colors"
                                                >
                                                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isChanging}
                                            className="w-full h-16 bg-[#D76B52] text-white rounded-[20px] font-black uppercase tracking-widest shadow-2xl shadow-[#D76B52]/20 hover:bg-opacity-90 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 mt-4"
                                        >
                                            {isChanging ? "Updating Security..." : "Apply Changes"}
                                            {!isChanging && <ArrowRight size={18} />}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* WISHLIST TAB */}
                            {activeTab === "wishlist" && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 h-full flex flex-col justify-center items-center text-center py-20">
                                    <div className="w-28 h-28 bg-[#FDFBF7] rounded-[40px] shadow-inner flex items-center justify-center text-[#D76B52]/20 mb-8 border border-secondary/5">
                                        <Heart size={44} />
                                    </div>
                                    <h3 className="text-2xl font-black text-secondary uppercase tracking-tight mb-4">Your Library Whispers</h3>
                                    <p className="text-[10px] text-secondary/30 font-black uppercase tracking-[0.4em] max-w-[320px] leading-relaxed">Your curated collection of future reads will appear here.</p>
                                    <button className="mt-12 bg-secondary text-white px-12 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#D76B52] shadow-2xl shadow-secondary/10 transition-all active:scale-95">
                                        Browse Library
                                    </button>
                                </div>
                            )}

                            {/* ORDERS TAB */}
                            {activeTab === "orders" && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 h-full flex flex-col justify-center items-center text-center py-20">
                                    <div className="w-28 h-28 bg-[#FDFBF7] rounded-[40px] shadow-inner flex items-center justify-center text-[#2D3E50]/10 mb-8 border border-secondary/5">
                                        <ShoppingBag size={44} />
                                    </div>
                                    <h3 className="text-2xl font-black text-secondary uppercase tracking-tight mb-4">Journey History</h3>
                                    <p className="text-[10px] text-secondary/30 font-black uppercase tracking-[0.4em] max-w-[320px] leading-relaxed">Every story you've started or finished is recorded here for eternity.</p>
                                    <button className="mt-12 border-2 border-secondary/5 text-secondary/60 px-12 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-secondary/5 hover:text-secondary transition-all active:scale-95">
                                        Back to Store
                                    </button>
                                </div>
                            )}

                            {/* OTHER TABS PLACEHOLDER */}
                            {["payments", "notifications"].includes(activeTab) && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 h-full flex flex-col justify-center items-center text-center py-20">
                                    <div className="w-28 h-28 bg-[#FDFBF7] rounded-[40px] shadow-inner flex items-center justify-center text-[#2D3E50]/10 mb-8 border border-secondary/5">
                                        <Settings size={44} className="animate-spin-slow" />
                                    </div>
                                    <h3 className="text-2xl font-black text-secondary uppercase tracking-tight mb-4">Refining Experience</h3>
                                    <p className="text-[10px] text-secondary/30 font-black uppercase tracking-[0.4em]">This section is currently under curation.</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>


            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;
