"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, KeyRound, ArrowRight, ArrowLeft, Feather, CheckCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { forgotPassword, verifyForgotPasswordOTP, resetPassword, clearError } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [passwords, setPasswords] = useState({ new_password: "", confirm_password: "" });
    const [resetToken, setResetToken] = useState("");

    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        const result = await dispatch(forgotPassword(email));
        if (forgotPassword.fulfilled.match(result)) {
            toast.success("OTP sent to your email!");
            setStep(2);
        } else {
            toast.error(result.payload || "Failed to send OTP");
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        const result = await dispatch(verifyForgotPasswordOTP({ email, otp }));
        if (verifyForgotPasswordOTP.fulfilled.match(result)) {
            toast.success("OTP Verified!");
            setResetToken(result.payload.resetToken);
            setStep(3);
        } else {
            toast.error(result.payload || "Invalid OTP");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.confirm_password) {
            toast.error("Passwords do not match");
            return;
        }
        if (passwords.new_password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        const result = await dispatch(resetPassword({
            token: resetToken,
            new_password: passwords.new_password,
            confirm_password: passwords.confirm_password
        }));

        if (resetPassword.fulfilled.match(result)) {
            toast.success("Password reset successful!");
            setStep(4);
        } else {
            toast.error(result.payload || "Failed to reset password");
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
                <div className="flex flex-col mb-8 items-center">


                    <p className="text-secondary/40 text-[11px] font-black uppercase tracking-[0.2em] border-y border-secondary/5 py-3 w-full text-center">
                        {step === 4 ? "Success" : "Reset your password"}
                    </p>
                </div>

                {step === 1 && (
                    <form className="space-y-6" onSubmit={handleSendOTP}>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[#2D3E50] uppercase tracking-widest pl-1">Email Address</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 transition-colors group-focus-within:text-[#D76B52]">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    placeholder="name@gmail.com"
                                    className="w-full h-14 bg-[#FDFBF7] border border-secondary/10 rounded-2xl pl-14 pr-6 font-sans font-bold text-secondary text-sm outline-none transition-all focus:border-[#D76B52]/40"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[#F7941E] text-white rounded-2xl font-sans font-black uppercase tracking-widest shadow-xl shadow-[#F7941E]/20 hover:bg-black transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-70"
                        >
                            {loading ? "Sending..." : "Send OTP"} <ArrowRight size={18} />
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form className="space-y-6" onSubmit={handleVerifyOTP}>
                        <div className="space-y-1.5 text-center">
                            <p className="text-xs font-bold text-secondary/60 mb-4">We've sent a 6-digit code to <span className="text-secondary">{email}</span></p>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30">
                                    <KeyRound size={18} />
                                </span>
                                <input
                                    type="text"
                                    value={otp}
                                    maxLength={6}
                                    placeholder="000000"
                                    className="w-full h-14 bg-[#FDFBF7] border border-secondary/10 rounded-2xl pl-14 pr-6 font-sans font-bold text-secondary text-2xl tracking-[0.5em] outline-none transition-all focus:border-[#D76B52]/40 text-center"
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[#F7941E] text-white rounded-2xl font-sans font-black uppercase tracking-widest shadow-xl shadow-[#F7941E]/20 hover:bg-black transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-70"
                        >
                            {loading ? "Verifying..." : "Verify OTP"} <ArrowRight size={18} />
                        </button>
                        <button type="button" onClick={() => setStep(1)} className="w-full text-center text-[10px] font-black text-secondary/40 uppercase tracking-widest hover:text-[#F7941E]">Change Email</button>
                    </form>
                )}

                {step === 3 && (
                    <form className="space-y-5" onSubmit={handleResetPassword}>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[#2D3E50] uppercase tracking-widest pl-1">New Password</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 transition-colors group-focus-within:text-[#D76B52]">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    value={passwords.new_password}
                                    placeholder="••••••••••••"
                                    className="w-full h-14 bg-[#FDFBF7] border border-secondary/10 rounded-2xl pl-14 pr-6 font-sans font-bold text-secondary text-sm outline-none transition-all focus:border-[#D76B52]/40"
                                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[#2D3E50] uppercase tracking-widest pl-1">Confirm Password</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 transition-colors group-focus-within:text-[#D76B52]">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    value={passwords.confirm_password}
                                    placeholder="••••••••••••"
                                    className="w-full h-14 bg-[#FDFBF7] border border-secondary/10 rounded-2xl pl-14 pr-6 font-sans font-bold text-secondary text-sm outline-none transition-all focus:border-[#D76B52]/40"
                                    onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[#F7941E] text-white rounded-2xl font-sans font-black uppercase tracking-widest shadow-xl shadow-[#F7941E]/20 hover:bg-black transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-70"
                        >
                            {loading ? "Updating..." : "Reset Password"} <ArrowRight size={18} />
                        </button>
                    </form>
                )}

                {step === 4 && (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} className="text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-secondary mb-2">All Set!</h2>
                        <p className="text-sm text-secondary/60 mb-8">Your password has been successfully updated. You can now sign in with your new password.</p>
                        <Link
                            href="/login"
                            className="w-full h-14 bg-[#F7941E] text-white rounded-2xl font-sans font-black uppercase tracking-widest inline-flex items-center justify-center gap-3 hover:bg-black transition-all duration-500"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                )}

                {step < 4 && (
                    <div className="mt-8 text-center border-t border-secondary/5 pt-6">
                        <Link href="/login" className="inline-flex items-center gap-2 text-secondary/40 text-xs font-sans font-bold hover:text-[#D76B52] transition-colors">
                            <ArrowLeft size={14} /> Back to Sign In
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
