"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import { 
    Plus, 
    MessageSquare, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    ChevronRight,
    Search
} from "lucide-react";
import LinkNext from "next/link";

export default function SupportClient() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.get("/support/tickets/my");
                if (response.data.success) {
                    setTickets(response.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching tickets:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "open":
                return "bg-blue-50 text-blue-600 border-blue-100";
            case "in_progress":
                return "bg-amber-50 text-amber-600 border-amber-100";
            case "resolved":
                return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "closed":
                return "bg-gray-50 text-gray-600 border-gray-100";
            default:
                return "bg-gray-50 text-gray-500 border-gray-100";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "open": return <AlertCircle size={14} />;
            case "in_progress": return <Clock size={14} />;
            case "resolved": return <CheckCircle2 size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const filteredTickets = tickets.filter(ticket => 
        ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticket_id?.toString().includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-black tracking-tight mb-2">
                            Support Tickets
                        </h1>
                        <p className="text-gray-500 font-medium text-sm">
                            Manage your enquiries and support requests.
                        </p>
                    </div>
                    <LinkNext 
                        href="/support/new"
                        className="flex items-center justify-center gap-2 bg-[#F7941E] hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-500/10 hover:shadow-black/10"
                    >
                        <Plus size={16} />
                        New Ticket
                    </LinkNext>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Total", value: tickets.length, color: "bg-black" },
                        { label: "Open", value: tickets.filter(t => t.status === "open").length, color: "bg-blue-500" },
                        { label: "Resolved", value: tickets.filter(t => t.status === "resolved").length, color: "bg-emerald-500" },
                        { label: "Closed", value: tickets.filter(t => t.status === "closed").length, color: "bg-gray-500" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-black">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Search & List */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search by subject or ticket ID..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {loading ? (
                            <div className="p-20 text-center">
                                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-400 font-bold text-sm animate-pulse uppercase tracking-widest">Loading Tickets...</p>
                            </div>
                        ) : filteredTickets.length > 0 ? (
                            filteredTickets.map((ticket) => (
                                <LinkNext 
                                    href={`/support/${ticket.id}`} 
                                    key={ticket.id}
                                    className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                                            <MessageSquare size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-black text-[15px] mb-1 group-hover:text-orange-500 transition-colors">
                                                {ticket.subject}
                                            </h3>
                                            <div className="flex items-center gap-3 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                                                <span>#{ticket.ticket_no || ticket.ticket_id || ticket.id}</span>
                                                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(ticket.status)}`}>
                                            {getStatusIcon(ticket.status)}
                                            {ticket.status?.replace("_", " ")}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300 group-hover:text-orange-500 transition-all">
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Chat</span>
                                            <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </LinkNext>
                            ))
                        ) : (
                            <div className="p-20 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MessageSquare size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-lg font-black text-black mb-2">No tickets found</h3>
                                <p className="text-gray-400 text-sm font-medium mb-8">
                                    {searchTerm ? "Try adjusting your search terms." : "You haven't created any support tickets yet."}
                                </p>
                                {!searchTerm && (
                                    <LinkNext 
                                        href="/support/new"
                                        className="inline-flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-widest hover:text-black transition-colors"
                                    >
                                        Create your first ticket <ChevronRight size={14} />
                                    </LinkNext>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
