"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser, clearError, googleLoginAction } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "391302444219-88q5i1h8ju8b097e4277frteiis9abiq.apps.googleusercontent.com";

const LoginContent = () => {
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
        handleAuthResult(result);
    };

    const handleAuthResult = (result) => {
        if (loginUser.fulfilled.match(result) || googleLoginAction.fulfilled.match(result)) {
            const loggedInUser = result.payload;
            toast.success("Successfully Logged In!");

            setTimeout(() => {
                const userType = loggedInUser?.user_type || loggedInUser?.user?.user_type;
                if (userType === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/");
                }
            }, 1000);
        } else if (loginUser.rejected.match(result) || googleLoginAction.rejected.match(result)) {
            const errorMsg = typeof result.payload === 'string' ? result.payload : result.payload?.message || "Authentication failed";
            toast.error(errorMsg);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        if (credentialResponse.credential) {
            const result = await dispatch(googleLoginAction(credentialResponse.credential));
            handleAuthResult(result);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 relative font-sans">
            <div className="max-w-[440px] w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12 relative z-10 transition-all duration-300">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Sign In</h1>
                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">Welcome back to Mind Gym Book</p>
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
                        <label className="text-[10px] font-black text-gray-900 uppercase tracking-[0.15em] pl-1">Email Address</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#F7941E]">
                                <Mail size={16} />
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                placeholder="Email Address"
                                className="w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl pl-12 pr-6 font-sans font-bold text-gray-900 text-sm outline-none transition-all focus:border-[#F7941E]/40 focus:bg-white focus:shadow-lg focus:shadow-[#F7941E]/5"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Access */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between px-1">
                            <label className="text-[10px] font-black text-gray-900 uppercase tracking-[0.15em]">Password</label>
                            <Link href="/forgot-password" size="sm" className="text-[10px] font-black text-[#F7941E] uppercase tracking-widest hover:underline">Forgot?</Link>
                        </div>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#F7941E]">
                                <Lock size={16} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                placeholder="••••••••"
                                className="w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl pl-12 pr-14 font-sans font-bold text-gray-900 text-sm outline-none transition-all focus:border-[#F7941E]/40 focus:bg-white focus:shadow-lg focus:shadow-[#F7941E]/5"
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Action */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-[#F7941E] text-black rounded-xl font-sans font-black uppercase tracking-widest shadow-lg shadow-[#F7941E]/20 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing In..." : "Sign In"} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                {/* <div className="mt-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-[1px] flex-1 bg-gray-100" />
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">or continue with</span>
                        <div className="h-[1px] flex-1 bg-gray-100" />
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google Login Failed")}
                            useOneTap
                            theme="outline"
                            shape="pill"
                            width="100%"
                        />
                    </div>
                </div> */}

                <div className="mt-8 text-center border-t border-gray-50 pt-6">
                    <p className="text-gray-400 text-xs font-sans font-bold">
                        Don't have an account?
                        <Link href="/register" className="ml-1 text-[#F7941E] font-black uppercase tracking-widest hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const LoginPage = () => {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <LoginContent />
        </GoogleOAuthProvider>
    );
};

export default LoginPage;
