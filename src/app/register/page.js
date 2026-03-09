"use client";
import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Feather, Phone, Camera, ShieldCheck, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { registerUser, clearError } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import api from "@/lib/axios";

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        additional_phone: "",
        password: "",
        profile_image: null
    });

    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [verificationToken, setVerificationToken] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        if (e.target.name === "profile_image") {
            const file = e.target.files[0];
            if (file) {
                setFormData({ ...formData, profile_image: file });
                setPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
        if (error) dispatch(clearError());
    };

    const handleSendOtp = async () => {
        if (!formData.email) {
            toast.error("Please enter your email first");
            return;
        }
        setOtpLoading(true);
        try {
            const response = await api.post("/users/send-registration-otp", { email: formData.email });
            if (response.data.success) {
                setOtpSent(true);
                toast.success("OTP sent to your email!");
            } else {
                toast.error(response.data.message || "Failed to send OTP");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error sending OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!otp) {
            toast.error("Please enter the OTP");
            return;
        }
        setVerifyLoading(true);
        try {
            const response = await api.post("/users/verify-registration-otp", {
                email: formData.email,
                otp: otp
            });
            if (response.data.success) {
                setEmailVerified(true);
                if (response.data.data?.verificationToken) {
                    setVerificationToken(response.data.data.verificationToken);
                }
                toast.success("Email verified successfully!");
            } else {
                toast.error(response.data.message || "Invalid OTP");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Verification failed");
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!emailVerified) {
            toast.error("Please verify your email first");
            return;
        }

        // Use FormData for multipart/form-data (required for file uploads)
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("phone", formData.phone); // Always append as required by backend

        if (formData.additional_phone) {
            data.append("additional_phone", formData.additional_phone);
        }

        if (formData.profile_image instanceof File) {
            // Must match field name 'profile_image' in backend route
            data.append("profile_image", formData.profile_image);
        }

        if (verificationToken) {
            data.append("verificationToken", verificationToken);
        }

        const result = await dispatch(registerUser(data));

        if (registerUser.fulfilled.match(result)) {
            toast.success("Account created successfully! Please sign in.");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } else if (registerUser.rejected.match(result)) {
            const errorMsg = typeof result.payload === 'string' ? result.payload : result.payload?.message || "Registration failed";
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

            <div className="max-w-[500px] w-full bg-white rounded-[40px] shadow-2xl shadow-[#2D3E50]/10 pt-8 pb-10 px-10 md:pt-10 md:pb-14 md:px-14 relative z-10 border border-white/20 backdrop-blur-sm">
                {/* Brand Logo - Top Left & Compact */}
                <div className="flex flex-col mb-6">
                    <Link href="/" className="flex items-center gap-2 group mb-4 self-start">
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
                            Create a new account
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                        <p className="text-red-600 text-xs font-bold text-center uppercase tracking-wider">
                            {typeof error === 'string' ? error : error.message || 'Registration failed'}
                        </p>
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleRegister}>
                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full border-4 border-[#FDFBF7] shadow-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} className="text-secondary/20" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-[#D76B52] p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                                <Camera size={16} className="text-white" />
                                <input type="file" name="profile_image" className="hidden" accept="image/*" onChange={handleChange} />
                            </label>
                        </div>
                        <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mt-2">Upload Profile</span>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#2D3E50] uppercase tracking-widest pl-1">Full Name</label>
                        <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 transition-colors group-focus-within:text-[#D76B52]">
                                <User size={18} />
                            </span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                placeholder="John Doe"
                                className="w-full h-12 bg-[#FDFBF7] border border-secondary/10 rounded-2xl pl-14 pr-6 font-sans font-bold text-secondary text-sm outline-none transition-all focus:border-[#D76B52]/40 focus:bg-white focus:shadow-xl focus:shadow-[#D76B52]/5"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#2D3E50] uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative group flex gap-3">
                            <div className="relative flex-1">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 transition-colors group-focus-within:text-[#D76B52]">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    placeholder="name@domain.com"
                                    className={`w-full h-12 bg-[#FDFBF7] border border-secondary/10 rounded-2xl pl-14 pr-6 font-sans font-bold text-secondary text-sm outline-none transition-all focus:border-[#D76B52]/40 focus:bg-white focus:shadow-xl focus:shadow-[#D76B52]/5 ${emailVerified ? "border-green-500/50 bg-green-50/10" : ""}`}
                                    onChange={handleChange}
                                    disabled={otpSent || emailVerified}
                                    required
                                />
                                {emailVerified && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 flex items-center gap-1.5">
                                        <ShieldCheck size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Verified</span>
                                    </span>
                                )}
                            </div>

                            {!emailVerified && !otpSent && (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={otpLoading || !formData.email}
                                    className="h-12 px-6 bg-[#2D3E50] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {otpLoading ? <Loader2 size={16} className="animate-spin" /> : "Send OTP"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* OTP Input - Visible after OTP is sent */}
                    {otpSent && !emailVerified && (
                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-500">
                            <label className="text-[10px] font-black text-[#D76B52] uppercase tracking-widest pl-1">Enter Verification Code</label>
                            <div className="relative group flex gap-3">
                                <div className="relative flex-1">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 transition-colors group-focus-within:text-[#D76B52]">
                                        <ShieldCheck size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="••••••"
                                        maxLength={6}
                                        className="w-full h-12 bg-[#FDFBF7] border border-secondary/10 rounded-2xl pl-14 pr-6 font-sans font-bold text-secondary text-lg tracking-[0.5em] outline-none transition-all focus:border-[#D76B52]/40 focus:bg-white focus:shadow-xl focus:shadow-[#D76B52]/5"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleVerifyEmail}
                                    disabled={verifyLoading || otp.length < 4}
                                    className="h-12 px-8 bg-[#D76B52] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-950 transition-all shadow-lg shadow-[#D76B52]/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {verifyLoading ? <Loader2 size={16} className="animate-spin" /> : "Verify"}
                                </button>
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <p className="text-[9px] text-secondary/40 font-bold uppercase tracking-widest">Didn't receive code?</p>
                                <button type="button" onClick={handleSendOtp} className="text-[9px] text-[#D76B52] font-black uppercase tracking-widest hover:underline">Resend OTP</button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Phone */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[#2D3E50] uppercase tracking-widest pl-1">Phone</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 transition-colors group-focus-within:text-[#D76B52]">
                                    <Phone size={18} />
                                </span>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    placeholder="Phone"
                                    className="w-full h-12 bg-[#FDFBF7] border border-secondary/10 rounded-2xl pl-14 pr-4 font-sans font-bold text-secondary text-xs outline-none transition-all focus:border-[#D76B52]/40 focus:bg-white focus:shadow-xl focus:shadow-[#D76B52]/5"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Additional Phone */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[#2D3E50] uppercase tracking-widest pl-1">Alt Phone</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 transition-colors group-focus-within:text-[#D76B52]">
                                    <Phone size={18} />
                                </span>
                                <input
                                    type="tel"
                                    name="additional_phone"
                                    value={formData.additional_phone}
                                    placeholder="Optional"
                                    className="w-full h-12 bg-[#FDFBF7] border border-secondary/10 rounded-2xl pl-14 pr-4 font-sans font-bold text-secondary text-xs outline-none transition-all focus:border-[#D76B52]/40 focus:bg-white focus:shadow-xl focus:shadow-[#D76B52]/5"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#2D3E50] uppercase tracking-widest pl-1">Password</label>
                        <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 transition-colors group-focus-within:text-[#D76B52]">
                                <Lock size={18} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                placeholder="••••••••••••"
                                className="w-full h-12 bg-[#FDFBF7] border border-secondary/10 rounded-2xl pl-14 pr-14 font-sans font-bold text-secondary text-sm outline-none transition-all focus:border-[#D76B52]/40 focus:bg-white focus:shadow-xl focus:shadow-[#D76B52]/5"
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
                        disabled={loading || !emailVerified}
                        className="w-full h-14 bg-[#D76B52] text-white rounded-2xl font-sans font-black uppercase tracking-widest shadow-xl shadow-[#D76B52]/20 hover:bg-red-950 transition-all duration-500 flex items-center justify-center gap-3 group mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-50"
                    >
                        {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-secondary/5 pt-6">
                    <p className="text-secondary/40 text-xs font-sans font-bold">
                        Already have an account?
                        <Link href="/login" className="ml-2 text-[#D76B52] font-black uppercase tracking-widest hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
