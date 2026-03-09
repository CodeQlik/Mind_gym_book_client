"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, Feather } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser, clearError } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) dispatch(clearError());
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Please enter both email and password");
            return;
        }

        const result = await dispatch(loginUser(formData));

        if (loginUser.fulfilled.match(result)) {
            const loggedInUser = result.payload;
            toast.success("Successfully Logged In!");

            setTimeout(() => {
                const userType = loggedInUser?.user_type || loggedInUser?.user?.user_type;
                if (userType === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/");
                }
            }, 1500);
        } else if (loginUser.rejected.match(result)) {
            const errorMsg = typeof result.payload === 'string' ? result.payload : result.payload?.message || "Login failed";
            toast.error(errorMsg);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 relative">
            {/* Background Decorative Blurs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#D76B52]/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#2D3E50]/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[450px] w-full bg-white rounded-[40px] shadow-2xl shadow-[#2D3E50]/10 pt-8 pb-10 px-10 md:pt-10 md:pb-14 md:px-14 relative z-10 border border-white/20 backdrop-blur-sm">
                {/* Brand Logo - Top Left & Compact */}
                <div className="flex flex-col mb-8">
                    <Link href="/" className="flex items-center gap-2 group mb-6 self-start">
                        <div className="relative">
                            <Feather className="text-secondary w-8 h-8 transform -rotate-12 group-hover:rotate-0 transition-all duration-500 ease-out" />
                        </div>
                        <div className="flex flex-col items-start pt-0.5">
                            <h1 className="text-base font-bold text-secondary tracking-widest leading-none uppercase">
                                Mind Gym Book
                            </h1>
                            <p className="text-[8px] tracking-[0.4em] text-secondary/50 font-black uppercase mt-1">Mental Excellence</p>
                        </div>
                    </Link>

                    <div className="text-center w-full">
                        <p className="text-secondary/40 text-[11px] font-black uppercase tracking-[0.2em] border-y border-secondary/5 py-3">
                            Sign in to your account
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                        <p className="text-red-600 text-xs font-bold text-center uppercase tracking-wider">
                            {typeof error === 'string' ? error : error.message || 'Login failed'}
                        </p>
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleLogin}>
                    {/* Email Identification */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#2D3E50] uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 transition-colors group-focus-within:text-[#D76B52]">
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                placeholder="name@domain.com"
                                className="w-full h-14 bg-[#FDFBF7] border border-secondary/10 rounded-2xl pl-14 pr-6 font-sans font-bold text-secondary text-sm outline-none transition-all focus:border-[#D76B52]/40 focus:bg-white focus:shadow-xl focus:shadow-[#D76B52]/5"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Access */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between px-1">
                            <label className="text-[10px] font-black text-[#2D3E50] uppercase tracking-widest">Password</label>
                            <Link href="/forgot-password" size="sm" className="text-[10px] font-black text-[#D76B52] uppercase tracking-widest hover:underline">Forgot?</Link>
                        </div>
                        <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 transition-colors group-focus-within:text-[#D76B52]">
                                <Lock size={18} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                placeholder="••••••••••••"
                                className="w-full h-14 bg-[#FDFBF7] border border-secondary/10 rounded-2xl pl-14 pr-14 font-sans font-bold text-secondary text-sm outline-none transition-all focus:border-[#D76B52]/40 focus:bg-white focus:shadow-xl focus:shadow-[#D76B52]/5"
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-secondary/30 hover:text-secondary transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Action */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-[#D76B52] text-white rounded-2xl font-sans font-black uppercase tracking-widest shadow-xl shadow-[#D76B52]/20 hover:bg-red-950 transition-all duration-500 flex items-center justify-center gap-3 group mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing In..." : "Sign In"} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                    </button>
                </form>

                {/* Social Option */}
                <div className="mt-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-[1px] flex-1 bg-secondary/10" />
                        <span className="text-[9px] font-black text-secondary/20 uppercase tracking-[0.2em]">or continue with</span>
                        <div className="h-[1px] flex-1 bg-secondary/10" />
                    </div>

                    <button className="w-full h-14 bg-white border border-secondary/10 rounded-2xl flex items-center justify-center gap-3 font-sans font-bold text-sm text-[#2D3E50] hover:bg-[#FDFBF7] hover:border-[#D76B52]/30 transition-all duration-300 shadow-sm hover:shadow-lg">
                        <Chrome size={20} className="text-[#D34836]" /> Sign in with Google
                    </button>
                </div>

                <div className="mt-8 text-center border-t border-secondary/5 pt-6">
                    <p className="text-secondary/40 text-xs font-sans font-bold">
                        Don't have an account?
                        <Link href="/register" className="ml-2 text-[#D76B52] font-black uppercase tracking-widest hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
