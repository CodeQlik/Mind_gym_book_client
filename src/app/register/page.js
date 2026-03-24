"use client";
import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Feather, Phone, Camera, ShieldCheck, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { registerUser, clearError, googleLoginAction } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const RegisterContent = () => {
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

    const handleAuthResult = (result) => {
        if (registerUser.fulfilled.match(result) || googleLoginAction.fulfilled.match(result)) {
            const loggedInUser = result.payload;
            toast.success(registerUser.fulfilled.match(result) ? "Account created successfully!" : "Successfully Logged In!");

            setTimeout(() => {
                const userType = loggedInUser?.user_type || loggedInUser?.user?.user_type;
                if (userType === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/");
                }
            }, 1000);
        } else if (registerUser.rejected.match(result) || googleLoginAction.rejected.match(result)) {
            const errorMsg = typeof result.payload === 'string' ? result.payload : result.payload?.message || "Authentication failed";
            toast.error(errorMsg);
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
        handleAuthResult(result);
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        if (credentialResponse.credential) {
            const result = await dispatch(googleLoginAction(credentialResponse.credential));
            handleAuthResult(result);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 relative font-sans">
            <div className="max-w-[480px] w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12 relative z-10 transition-all duration-300">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Create Account</h1>
                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">Join Mind Gym Book Community</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                        <p className="text-red-600 text-xs font-bold text-center uppercase tracking-wider">
                            {typeof error === 'string' ? error : error.message || 'Registration failed'}
                        </p>
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleRegister}>
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={36} className="text-gray-200" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-[#F7941E] p-2.5 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-all border-2 border-white">
                                <Camera size={14} className="text-white" />
                                <input type="file" name="profile_image" className="hidden" accept="image/*" onChange={handleChange} />
                            </label>
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-3">Upload Profile</span>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-900 uppercase tracking-[0.15em] pl-1">Full Name</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#F7941E]">
                                <User size={16} className="text-[#F7941E]" />
                            </span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                placeholder="Full Name"
                                className="w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl pl-12 pr-6 font-sans font-bold text-gray-900 text-sm outline-none transition-all focus:border-[#F7941E]/40 focus:bg-white focus:shadow-lg focus:shadow-[#F7941E]/5"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-900 uppercase tracking-[0.15em] pl-1">Email Address</label>
                        <div className="relative group flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#F7941E]">
                                    <Mail size={16} className="text-[#F7941E]" />
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    placeholder="Email Address"
                                    className={`w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl pl-12 pr-6 font-sans font-bold text-gray-900 text-sm outline-none transition-all focus:border-[#F7941E]/40 focus:bg-white focus:shadow-lg focus:shadow-[#F7941E]/5 ${emailVerified ? "border-green-500/50 bg-green-50/10" : ""}`}
                                    onChange={handleChange}
                                    disabled={otpSent || emailVerified}
                                    required
                                />
                                {emailVerified && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 flex items-center gap-1.5">
                                        <ShieldCheck size={16} />
                                        <span className="text-[9px] font-bold uppercase">Verified</span>
                                    </span>
                                )}
                            </div>

                            {!emailVerified && !otpSent && (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={otpLoading || !formData.email}
                                    className="h-12 px-6 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#F7941E] transition-all disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {otpLoading ? <Loader2 size={16} className="animate-spin" /> : "Send OTP"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* OTP Input - Visible after OTP is sent */}
                    {otpSent && !emailVerified && (
                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-500">
                            <label className="text-[10px] font-black text-[#F7941E] uppercase tracking-[0.15em] pl-1">Verification Code</label>
                            <div className="relative group flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#F7941E]">
                                        <ShieldCheck size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="OTP"
                                        maxLength={6}
                                        className="w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl pl-12 pr-6 font-sans font-bold text-gray-900 text-sm tracking-[0.3em] outline-none transition-all focus:border-[#F7941E]/40 focus:bg-white focus:shadow-lg focus:shadow-[#F7941E]/5"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleVerifyEmail}
                                    disabled={verifyLoading || otp.length < 4}
                                    className="h-12 px-6 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#F7941E] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {verifyLoading ? <Loader2 size={16} className="animate-spin" /> : "Verify"}
                                </button>
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Didn't receive code?</p>
                                <button type="button" onClick={handleSendOtp} className="text-[9px] text-[#F7941E] font-black uppercase tracking-widest hover:underline">Resend OTP</button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Phone */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-900 uppercase tracking-[0.15em] pl-1">Phone</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#F7941E]">
                                    <Phone size={16} className="text-[#F7941E]" />
                                </span>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    placeholder="Phone"
                                    className="w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl pl-12 pr-4 font-sans font-bold text-gray-900 text-xs outline-none transition-all focus:border-[#F7941E]/40 focus:bg-white focus:shadow-lg focus:shadow-[#F7941E]/5"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Additional Phone */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-900 uppercase tracking-[0.15em] pl-1">Alt Phone</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#F7941E]">
                                    <Phone size={16} className="text-[#F7941E]" />
                                </span>
                                <input
                                    type="tel"
                                    name="additional_phone"
                                    value={formData.additional_phone}
                                    placeholder="Optional"
                                    className="w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl pl-12 pr-4 font-sans font-bold text-gray-900 text-xs outline-none transition-all focus:border-[#F7941E]/40 focus:bg-white focus:shadow-lg focus:shadow-[#F7941E]/5"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-900 uppercase tracking-[0.15em] pl-1">Password</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#F7941E]">
                                <Lock size={16} className="text-[#F7941E]" />
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
                        disabled={loading || !emailVerified}
                        className="w-full h-12 bg-gray-900 text-white rounded-xl font-sans font-black uppercase tracking-widest shadow-lg shadow-gray-200 hover:bg-[#F7941E] hover:text-black transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Account..." : "Create Account"} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8">
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
                </div>

                <div className="mt-8 text-center border-t border-gray-50 pt-6">
                    <p className="text-gray-400 text-xs font-sans font-bold">
                        Already have an account?
                        <Link href="/login" className="ml-1 text-[#F7941E] font-black uppercase tracking-widest hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const RegisterPage = () => {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <RegisterContent />
        </GoogleOAuthProvider>
    );
};

export default RegisterPage;
