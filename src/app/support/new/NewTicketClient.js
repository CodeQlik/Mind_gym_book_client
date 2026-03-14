"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { 
    ArrowLeft, 
    Send, 
    AlertCircle,
    CheckCircle2,
    MessageSquare,
    Package,
    HelpCircle
} from "lucide-react";
import Link from "next/link";

export default function NewTicketClient() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        order_id: "",
        priority: "medium"
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/orders/my-orders");
                if (response.data.success) {
                    setOrders(response.data.data.orders || []);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const response = await api.post("/support/tickets", formData);
            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/support");
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create ticket. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <div className="text-center animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-black mb-3">Ticket Created Successfully!</h2>
                    <p className="text-gray-500 font-medium mb-8">Redirecting you to your tickets list...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-6 font-sans">
            <div className="max-w-2xl mx-auto">
                <Link 
                    href="/support" 
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 font-bold text-[11px] uppercase tracking-widest mb-10 transition-colors group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Tickets
                </Link>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
                    <div className="p-10 border-b border-gray-50 flex items-center gap-6">
                        <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl">
                            <PlusIcon size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-black tracking-tight">New Support Ticket</h1>
                            <p className="text-gray-400 font-medium text-sm">Tell us how we can help you.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Subject</label>
                            <input 
                                type="text" 
                                name="subject"
                                required
                                placeholder="E.g., Payment issue, Delivery delay..."
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all"
                                value={formData.subject}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Relates to Order (Optional)</label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <select 
                                        name="order_id"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                        value={formData.order_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">None / General Inquiry</option>
                                        {orders.map(order => (
                                            <option key={order.id} value={order.id}>
                                                Order #{order.order_id || order.id}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Priority Level</label>
                                <div className="relative">
                                    <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <select 
                                        name="priority"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                        value={formData.priority}
                                        onChange={handleChange}
                                    >
                                        <option value="low">Low - General Question</option>
                                        <option value="medium">Medium - Something isn't working</option>
                                        <option value="high">High - Urgent Issue</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Description</label>
                            <textarea 
                                name="description"
                                required
                                rows={5}
                                placeholder="Describe your issue in detail so we can help you better..."
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all resize-none"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={submitting}
                            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all ${
                                submitting 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-black hover:bg-orange-500 text-white shadow-xl hover:shadow-orange-500/20'
                            }`}
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Submit Ticket
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function PlusIcon({ size }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}
