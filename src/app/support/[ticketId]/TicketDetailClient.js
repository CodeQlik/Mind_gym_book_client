"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { 
    ArrowLeft, 
    Send, 
    Paperclip, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    MessageCircle,
    Package,
    MoreVertical,
    User,
    Shield
} from "lucide-react";
import Link from "next/link";

export default function TicketDetailClient({ ticketId }) {
    const router = useRouter();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const fetchTicketDetails = async () => {
        try {
            const response = await api.get(`/support/tickets/${ticketId}`);
            if (response.data.success) {
                setTicket(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching ticket details:", error);
            if (error.response?.status === 404) {
                router.push("/support");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicketDetails();
        // Poll for new messages every 30 seconds
        const interval = setInterval(fetchTicketDetails, 30000);
        return () => clearInterval(interval);
    }, [ticketId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticket?.messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || sending) return;

        setSending(true);
        try {
            const response = await api.post(`/support/tickets/${ticketId}/messages`, {
                message: message.trim()
            });
            if (response.data.success) {
                setMessage("");
                await fetchTicketDetails();
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "open": return "bg-blue-50 text-blue-600 border-blue-100";
            case "in_progress": return "bg-amber-50 text-amber-600 border-amber-100";
            case "resolved": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "closed": return "bg-gray-50 text-gray-600 border-gray-100";
            default: return "bg-gray-50 text-gray-400 border-gray-100";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!ticket) return null;

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-10 px-6 font-sans">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
                
                {/* Left Side: Ticket List / Info (Mobile Header) */}
                <div className="lg:w-1/3 flex flex-col gap-6">
                    <Link 
                        href="/support" 
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 font-bold text-[11px] uppercase tracking-widest transition-colors group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to My Tickets
                    </Link>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 divide-y divide-gray-50 h-fit">
                        {/* Header */}
                        <div className="p-8">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest mb-6 ${getStatusStyle(ticket.status)}`}>
                                {ticket.status?.replace("_", " ")}
                            </div>
                            <h1 className="text-xl font-black text-black tracking-tight mb-2 leading-tight">
                                {ticket.subject}
                            </h1>
                            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                                Ticket ID: #{ticket.ticket_no || ticket.ticket_id || ticket.id}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Created On</p>
                                    <p className="text-sm font-bold text-black">{new Date(ticket.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            {ticket.order_id && (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                        <Package size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Related Order</p>
                                        <p className="text-sm font-bold text-orange-500 underline">Order #{ticket.order_id}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                    <AlertCircle size={18} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Priority</p>
                                    <p className="text-sm font-bold text-black capitalize">{ticket.priority}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="p-8">
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">Initial Description</p>
                            <p className="text-sm font-medium text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl whitespace-pre-wrap">
                                {ticket.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Chat Interface */}
                <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col h-full overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                                <MessageCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-black text-sm tracking-tight">Conversation</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active Support</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-10 h-10 text-gray-300 hover:text-black transition-colors rounded-full flex items-center justify-center">
                            <MoreVertical size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth customs-scrollbar">
                        {ticket.messages && ticket.messages.length > 0 ? (
                            ticket.messages.map((msg, i) => {
                                const isUser = msg.sender_id === ticket.user_id;
                                return (
                                    <div key={i} className={`flex items-start gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isUser ? "bg-orange-100 text-orange-600" : "bg-black text-white"}`}>
                                            {isUser ? <User size={16} /> : <Shield size={16} />}
                                        </div>
                                        <div className={`max-w-[80%] ${isUser ? "text-right" : ""}`}>
                                            <div className={`inline-block p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                                                isUser ? "bg-[#F7941E] text-white rounded-tr-none" : "bg-gray-100 text-black rounded-tl-none whitespace-pre-wrap text-left"
                                            }`}>
                                                {msg.message}
                                            </div>
                                            <p className="mt-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                                {isUser ? "You" : "Support Team"} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                <MessageCircle size={48} className="mb-4" />
                                <p className="font-black uppercase tracking-widest text-xs">No replies yet. Our team will get back to you shortly.</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-6 border-t border-gray-50">
                        {["resolved", "closed"].includes(ticket.status?.toLowerCase()) ? (
                            <div className="p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                                    This ticket is marked as <span className="text-black">{ticket.status}</span>. You can no longer send messages.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSendMessage} className="relative group">
                                <textarea 
                                    placeholder="Type your reply here..."
                                    rows={1}
                                    className="w-full pl-6 pr-16 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all resize-none max-h-32"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                />
                                <button 
                                    type="submit"
                                    disabled={!message.trim() || sending}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                        !message.trim() || sending 
                                        ? "text-gray-200 cursor-not-allowed" 
                                        : "bg-black text-white hover:bg-orange-500 shadow-lg shadow-black/10"
                                    }`}
                                >
                                    {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} />}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .customs-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .customs-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .customs-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }
                .customs-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D5DB;
                }
            `}</style>
        </div>
    );
}

