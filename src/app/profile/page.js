"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
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
    ChevronLeft,
    CreditCard,
    Bell,
    X,
    Key,
    Plus,
    Lock,
    Eye,
    EyeOff,
    Search,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    Activity,
    Crown,
    ArrowRight,
    HelpCircle,
    Truck,
    RefreshCw,
    MessageSquare,
    Headset,
    Paperclip,
    Send
} from "lucide-react";
import { logoutUser, fetchProfile } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import { syncAddToCart } from "@/redux/slices/cartSlice";

const ProfilePage = () => {
    const { user, token } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState("profile");
    const [view, setView] = useState("menu"); // New state to track 'menu' or 'content' on mobile
    const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
    const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [isChanging, setIsChanging] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const ordersPerPage = 10;
    const [isEditing, setIsEditing] = useState(false);
    
    // Email update OTP state
    const [isEmailOtpModalOpen, setIsEmailOtpModalOpen] = useState(false);
    const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
    const emailOtpRefs = React.useRef([]);
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        additional_phone: ""
    });
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressFormData, setAddressFormData] = useState({
        address_line1: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        addresstype: "home",
        name: "",
        phone: "",
        is_default: false
    });
    const [supportTickets, setSupportTickets] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [polledTicket, setPolledTicket] = useState(null);
    const [loadingTickets, setLoadingTickets] = useState(false);
    const [supportFormData, setSupportFormData] = useState({
        issue_type: "",
        subject: "",
        message: ""
    });
    const [supportMessage, setSupportMessage] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && navItems.some(item => item.id === tab)) {
            setActiveTab(tab);
            setView("content"); // Ensure we show the content if a tab is linked/refreshed
        }
    }, [searchParams]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setView("content"); // Switch to content view on mobile
        router.push(`/profile?tab=${tabId}`, { scroll: false });
    };

    useEffect(() => {
        if (!token) {
            router.push("/login");
        } else if (!user || !user.name) {
            dispatch(fetchProfile());
        }
    }, [token, user, router, dispatch]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                additional_phone: user.additional_phone || ""
            });
            setAddressFormData(prev => ({
                ...prev,
                name: "",
                phone: ""
            }));
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === "orders" && token) {
            fetchOrders(currentPage);
        }
        if (activeTab === "wishlist" && token) {
            fetchWishlist();
        }
        if (activeTab === "profile" && token) {
            fetchAddresses();
        }
        if (activeTab === "support" && token) {
            fetchSupportTickets();
        }
    }, [activeTab, token, currentPage]);

    // Live Polling for Selected Ticket
    useEffect(() => {
        let interval;
        if (activeTab === "support" && selectedTicketId && token) {
            const fetchDetail = async () => {
                try {
                    const res = await api.get(`/support/tickets/${selectedTicketId}`);
                    if (res.data?.success) {
                        setPolledTicket(res.data.data);
                    }
                } catch (e) {
                    console.error("Polling error", e);
                }
            };

            fetchDetail(); // Initial fetch
            interval = setInterval(fetchDetail, 3000); // 3 seconds for snappy live chat
        } else {
            setPolledTicket(null);
        }
        return () => clearInterval(interval);
    }, [activeTab, selectedTicketId, token]);

    // Auto-scroll chat to bottom
    const messagesEndRef = React.useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [polledTicket?.messages?.length, selectedTicketId]);

    const fetchOrders = async (page = 1) => {
        try {
            setLoadingOrders(true);
            const res = await api.get(`/orders/my-orders?page=${page}&limit=${ordersPerPage}`);
            if (res.data?.success) {
                setOrders(res.data.data.orders || []);
                setTotalPages(res.data.data.totalPages || 1);
                setTotalOrders(res.data.data.totalItems || 0);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast.error("Failed to load your orders");
        } finally {
            setLoadingOrders(false);
        }
    };

    const fetchWishlist = async () => {
        try {
            setLoadingWishlist(true);
            const res = await api.get("/book/bookmark/all");
            if (res.data?.success) {
                setWishlist(res.data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
        } finally {
            setLoadingWishlist(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            setLoadingAddresses(true);
            const res = await api.get("/user/addresses/my-addresses");
            if (res.data?.success) {
                setAddresses(res.data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const fetchSupportTickets = async () => {
        try {
            setLoadingTickets(true);
            const res = await api.get("/support/tickets/my");
            if (res.data?.success) {
                setSupportTickets(res.data.data || []);
                if (res.data.data?.length > 0 && !selectedTicket) {
                    // Don't auto-select if we already have one
                }
            }
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setLoadingTickets(false);
        }
    };

    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [refundOrderId, setRefundOrderId] = useState(null);
    const [refundReason, setRefundReason] = useState("");
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [isProcessingAction, setIsProcessingAction] = useState(false);

    const handleCancelOrder = (orderId) => {
        setCancelOrderId(orderId);
        setIsCancelModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        try {
            setIsProcessingAction(true);
            const res = await api.post(`/orders/cancel/${cancelOrderId}`);
            if (res.data?.success) {
                const updatedOrder = res.data.data;
                setIsCancelModalOpen(false);
                setCancelOrderId(null);
                
                // Update local state immediately for "instant" feel
                setOrders(prevOrders => prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
                
                // If it was a prepaid order, inform user that refund is initiated
                const isPrepaid = String(updatedOrder.payment_method || '').toLowerCase() !== 'cod' || updatedOrder.payment_status === 'paid';
                
                if (isPrepaid) {
                    toast.success("Order cancelled. Refund has been automatically initiated.");
                    // Still open the modal so they can provide a specific reason if they wish
                    setRefundOrderId(updatedOrder.id);
                    setIsRefundModalOpen(true);
                } else {
                    toast.success("Order cancelled successfully");
                }
                
                fetchOrders();
            }
        } catch (error) {
            console.error("Cancellation failed:", error);
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setIsProcessingAction(false);
        }
    };

    const handleRefundRequest = async (e) => {
        e.preventDefault();
        if (!refundReason.trim()) return toast.error("Please provide a reason for refund");

        try {
            setIsProcessingAction(true);
            const res = await api.post(`/orders/refund/${refundOrderId}`, { reason: refundReason });
            if (res.data?.success) {
                toast.success("Refund request submitted successfully");
                setIsRefundModalOpen(false);
                setRefundReason("");
                fetchOrders();
            }
        } catch (error) {
            console.error("Refund request failed:", error);
            const errorMsg = error.response?.data?.message || "";
            if (errorMsg.toLowerCase().includes("already requested")) {
                toast.success("Refund request is already registered.");
                setIsRefundModalOpen(false);
                setRefundReason("");
                fetchOrders();
            } else {
                toast.error(errorMsg || "Failed to submit refund request");
            }
        } finally {
            setIsProcessingAction(false);
        }
    };

    const handleSubmitSupportTicket = async (e) => {
        e.preventDefault();
        if (!supportFormData.issue_type || !supportFormData.subject || !supportFormData.message) {
            return toast.error("Please fill all required fields");
        }
        setIsChanging(true);
        try {
            const res = await api.post("/support/tickets", {
                subject: supportFormData.subject,
                description: supportFormData.message,
                category: supportFormData.issue_type,
                priority: "medium" // Default
            });
            if (res.data?.success) {
                toast.success("Ticket created successfully!");
                setSupportFormData({ issue_type: "", subject: "", message: "" });
                fetchSupportTickets();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create ticket");
        } finally {
            setIsChanging(false);
        }
    };

    const handleSendSupportMessage = async (e) => {
        e.preventDefault();
        if (!supportMessage.trim() || sendingMessage || !selectedTicketId) return;

        setSendingMessage(true);
        try {
            const res = await api.post(`/support/tickets/${selectedTicketId}/messages`, {
                message: supportMessage.trim()
            });
            if (res.data?.success) {
                setSupportMessage("");
                // Immediate fetch after sending
                const ticketRes = await api.get(`/support/tickets/${selectedTicketId}`);
                if (ticketRes.data?.success) {
                    setPolledTicket(ticketRes.data.data);
                }
            }
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setSendingMessage(false);
        }
    };

    const handleSelectTicket = (ticket) => {
        if (selectedTicketId === ticket.id) {
            setSelectedTicketId(null);
            setPolledTicket(null);
        } else {
            setSelectedTicketId(ticket.id);
            setPolledTicket(null); // Clear previous while loading
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        router.push("/");
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setIsChanging(true);
        try {
            const payload = {
                ...addressFormData,
                addresstype: addressFormData.addresstype.toLowerCase()
            };
            if (editingAddress) {
                await api.put(`/user/addresses/update/${editingAddress.id}`, payload);
                toast.success("Registry sequence updated!");
            } else {
                await api.post("/user/addresses/add", payload);
                toast.success("New registry initialized!");
            }

            setIsAddressModalOpen(false);
            setEditingAddress(null);
            setAddressFormData({
                address_line1: "",
                city: "",
                state: "",
                pincode: "",
                country: "India",
                addresstype: "home",
                name: "",
                phone: "",
                is_default: false
            });

            // Re-fetch all data to ensure sync
            await fetchAddresses();
            await dispatch(fetchProfile());
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save address");
        } finally {
            setIsChanging(false);
        }
    };

    const deleteAddress = async (id) => {
        if (!confirm("Are you sure you want to remove this address?")) return;
        try {
            await api.delete(`/user/addresses/delete/${id}`);
            toast.success("Address removed");
            fetchAddresses();
        } catch (error) {
            toast.error("Failed to delete address");
        }
    };

    const handleEditAddress = (addr) => {
        setEditingAddress(addr);
        setAddressFormData({
            address_line1: addr.address_line1,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            country: addr.country,
            addresstype: addr.addresstype,
            name: addr.name || "",
            phone: addr.phone || "",
            is_default: addr.is_default
        });
        setIsAddressModalOpen(true);
    };

    const handleProfileUpdate = async (e) => {
        if (e) e.preventDefault();
        
        // Request OTP if email is being changed
        if (formData.email !== user?.email) {
            setIsChanging(true);
            try {
                const res = await api.post("/users/send-registration-otp", { email: formData.email });
                if (res.data?.success) {
                    toast.success(`Verification code sent to ${formData.email}`);
                    setIsEmailOtpModalOpen(true);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to send verification code. Email might be in use.");
            } finally {
                setIsChanging(false);
            }
            return;
        }

        setIsChanging(true);
        try {
            const payload = {
                name: formData.name,
                email: formData.email, // At this point email is either unchanged or already verified
                phone: formData.phone,
                additional_phone: formData.additional_phone
            };

            const res = await api.put("/users/update-profile", payload);
            if (res.data?.success) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
                dispatch(fetchProfile());
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsChanging(false);
        }
    };

    const handleEmailOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(value.length - 1);
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...emailOtp];
        newOtp[index] = value;
        setEmailOtp(newOtp);

        if (value !== "" && index < 5) {
            emailOtpRefs.current[index + 1]?.focus();
        }
    };

    const handleEmailOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !emailOtp[index] && index > 0) {
            emailOtpRefs.current[index - 1]?.focus();
        }
    };

    const submitEmailOtp = async (e) => {
        e.preventDefault();
        const otpValue = emailOtp.join("");
        if (otpValue.length !== 6) {
            return toast.error("Please enter a valid 6-digit OTP");
        }
        
        setIsChanging(true);
        try {
            // First, verify the OTP using backend's existing verified route
            const verifyRes = await api.post("/users/verify-registration-otp", { 
                email: formData.email, 
                otp: otpValue 
            });

            if (verifyRes.data?.success) {
                // Once verified, proceed to update the profile Normally
                const payload = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    additional_phone: formData.additional_phone
                };
                const updateRes = await api.put("/users/update-profile", payload);

                if (updateRes.data?.success) {
                    toast.success("Profile updated seamlessly with new verified email!");
                    setIsEditing(false);
                    setIsEmailOtpModalOpen(false);
                    setEmailOtp(["", "", "", "", "", ""]);
                    dispatch(fetchProfile());
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP or failed to verify.");
        } finally {
            setIsChanging(false);
        }
    };

    const handleProfileImageUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append("profile_image", file);

        setIsChanging(true);
        try {
            const res = await api.put("/users/update-profile", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data?.success) {
                toast.success("Profile picture updated!");
                dispatch(fetchProfile());
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile image");
        } finally {
            setIsChanging(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        setIsChanging(true);
        try {
            await api.post("/users/change-password", {
                old_password: passwordData.oldPassword,
                new_password: passwordData.newPassword,
                confirm_password: passwordData.confirmPassword
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

    const handleRemoveFromWishlist = async (bookId) => {
        try {
            await api.post("/book/bookmark/toggle", { book_id: bookId });
            setWishlist(prev => prev.filter(item => item.book_id !== bookId));
            toast.success("Removed from wishlist");
        } catch (error) {
            toast.error("Failed to update wishlist");
        }
    };

    const handleAddToCart = (book) => {
        dispatch(syncAddToCart({
            id: book.id,
            title: book.title,
            price: book.price || 25,
            coverImage: book.thumbnail?.url || book.thumbnail || "/placeholder-book.jpg",
            author: book.author || "Global Author"
        }));
        toast.success("Added to cart!");
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-[#FFC107]/20 border-t-[#FFC107] rounded-full animate-spin mb-4"></div>
                    <span className="text-[#1A1A1A]/40 font-black uppercase tracking-widest text-[10px]">Preparing Dashboard</span>
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
        { id: "profile", label: "My Profile", icon: UserIcon },
        { id: "orders", label: "My Orders", icon: ShoppingBag },
        { id: "wishlist", label: "My Wishlist", icon: Heart },
        { id: "password", label: "Change Password", icon: Lock },
        { id: "support", label: "Customer Support", icon: Headset },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans text-[#1A1A1A]">

            {/* Sidebar Navigation */}
            <div className={`${view === "menu" ? "flex" : "hidden"} lg:flex lg:w-[300px] flex-shrink-0 bg-white lg:rounded-r-[20px] shadow-[10px_0_30px_rgb(0,0,0,0.03)] flex flex-col pt-8 z-20 sticky top-0 h-[100dvh] overflow-y-auto no-scrollbar`}>
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    <Activity size={20} className="text-[#FFC107]" />
                    <span className="font-black text-lg tracking-tight text-[#1A1A1A]">ZENITH</span>
                </div>

                {/* Profile Card */}
                <div className="flex flex-col items-center px-6 mb-8">
                    <div className="relative mb-4">
                        <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-2 border-white shadow-lg bg-[#F8F9FA] flex items-center justify-center">
                            {profileUrl ? (
                                <img src={profileUrl} alt={user.name || user.user?.name} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={28} className="text-gray-300" />
                            )}
                        </div>
                        <input
                            type="file"
                            id="sidebar_profile_image"
                            className="hidden"
                            accept="image/*"
                            onChange={handleProfileImageUpdate}
                        />
                        <label
                            htmlFor="sidebar_profile_image"
                            className="absolute bottom-0 right-0 bg-[#FFC107] text-[#1A1A1A] p-1.5 rounded-full shadow border-2 border-white hover:scale-110 transition-transform cursor-pointer"
                        >
                            <Camera size={12} className="stroke-[3] pointer-events-none" />
                        </label>
                    </div>
                    <h3 className="font-black text-[15px] text-[#1A1A1A] uppercase text-center leading-tight">
                        {user.name || user.user?.name || "User"}
                    </h3>
                </div>

                {/* Nav Links */}
                <nav className="w-full px-6 flex flex-col gap-2 flex-1 pb-10 mt-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center justify-between group p-4 rounded-xl transition-all duration-300 ${activeTab === item.id
                                ? "bg-[#FFC107] text-[#1A1A1A] shadow-md shadow-[#FFC107]/20"
                                : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1A]"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={18} className={`${activeTab === item.id ? "text-[#1A1A1A] stroke-[2.5]" : "stroke-[2] text-gray-400 group-hover:text-[#1A1A1A]"}`} />
                                <span className={`text-[11px] font-black uppercase tracking-widest ${activeTab === item.id ? "text-[#1A1A1A]" : ""}`}>{item.label}</span>
                            </div>
                            <ChevronRight size={14} className={`stroke-[3] transition-all duration-300 ${activeTab === item.id ? "translate-x-1 opacity-100" : "opacity-0 group-hover:opacity-40 group-hover:translate-x-0.5"}`} />
                        </button>
                    ))}

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-4 rounded-xl text-red-500 hover:bg-red-50 transition-all font-black text-[11px] uppercase tracking-widest group"
                        >
                            <LogOut size={18} className="stroke-[2.5] text-red-500/50 group-hover:text-red-500 shrink-0" />
                            Logout
                        </button>
                    </div>
                </nav>
            </div>

            {/* Right Content Area */}
            <main className={`${view === "content" ? "block" : "hidden"} lg:block flex-1 w-full px-6 md:px-12 lg:px-28 pt-24 lg:pt-20 pb-20 relative z-10 overflow-x-hidden`}>
                
                {/* Mobile Back Button */}
                <div className="lg:hidden mb-8">
                    <button 
                        onClick={() => setView("menu")}
                        className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-xl"
                    >
                        <ChevronRight className="rotate-180" size={14} /> Back to Dashboard
                    </button>
                </div>



                {/* PROFILE TAB */}
                {activeTab === "profile" && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto xl:mx-0">

                        {/* Account Overview Header */}
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-5 h-5 rounded-full bg-[#FFF8E7] flex items-center justify-center text-[#FFC107]">
                                        <UserIcon size={12} className="stroke-[3]" />
                                    </div>
                                    <h3 className="font-black text-[15px] uppercase tracking-tight text-[#1A1A1A]">PERSONAL PROFILE</h3>
                                </div>
                                <p className="text-[11px] text-gray-600 font-medium ml-7">Manage your primary contact and security information</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${isEditing ? "bg-[#1A1A1A] text-white" : "bg-white border border-gray-100 text-[#1A1A1A] hover:bg-gray-50"
                                    }`}
                            >
                                {isEditing ? <CheckCircle2 size={12} /> : <Edit3 size={12} className="stroke-[3]" />}
                                {isEditing ? "Cancel Editing" : "Manage Profile"}
                            </button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleProfileUpdate} className="bg-white rounded-[32px] p-8 md:p-12 border border-gray-100/60 shadow-xl mb-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Primary Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Contact Number</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Additional Phone</label>
                                        <input
                                            type="text"
                                            value={formData.additional_phone}
                                            onChange={(e) => setFormData({ ...formData, additional_phone: e.target.value })}
                                            className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5 transition-all"
                                            placeholder="Emergency contact or secondary line"
                                        />
                                    </div>
                                </div>
                                <div className="mt-12 flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest text-[#1A1A1A] hover:bg-gray-50 transition-all"
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isChanging}
                                        className="bg-[#1A1A1A] text-white px-10 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#FFC107] hover:text-[#1A1A1A] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                    >
                                        {isChanging ? "Syncing..." : "Update Excellence"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
                                {/* Name Card */}
                                <div className="bg-white rounded-2xl p-6 border border-gray-100/60 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                                    <div className="w-10 h-10 bg-[#FFF8E7] rounded-xl flex items-center justify-center text-[#FFC107] shrink-0">
                                        <UserIcon size={18} className="stroke-[2.5]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Full Legal Name</p>
                                        <p className="font-black text-[#1A1A1A] text-[15px] truncate mb-0.5">{user.name || user.user?.name || "User"}</p>
                                        <p className="text-[10px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-full inline-block">Verified Identity</p>
                                    </div>
                                </div>

                                {/* Email Card */}
                                <div className="bg-white rounded-2xl p-6 border border-gray-100/60 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                                    <div className="w-10 h-10 bg-[#FFF8E7] rounded-xl flex items-center justify-center text-[#FFC107] shrink-0">
                                        <Mail size={18} className="stroke-[2.5]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Primary Email</p>
                                        <p className="font-black text-[#1A1A1A] text-[14px] truncate mb-0.5">{user.email || user.user?.email || "user@example.com"}</p>
                                        <p className="text-[10px] text-gray-500 font-medium italic">Verified Primary Inbox</p>
                                    </div>
                                </div>

                                {/* Phone Card */}
                                <div className="bg-white rounded-2xl p-6 border border-gray-100/60 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                                    <div className="w-10 h-10 bg-[#FFF8E7] rounded-xl flex items-center justify-center text-[#FFC107] shrink-0">
                                        <Phone size={18} className="stroke-[2.5]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Contact Number</p>
                                        <p className="font-black text-[#1A1A1A] text-[14px] mb-0.5">{user.phone || user.user?.phone || "Not provided"}</p>
                                        <p className="text-[10px] text-gray-600 font-medium">Primary Mobile Axis</p>
                                    </div>
                                </div>

                                {/* Additional Phone Card */}
                                <div className="bg-white rounded-2xl p-6 border border-gray-100/60 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                                    <div className="w-10 h-10 bg-[#FFF8E7] rounded-xl flex items-center justify-center text-[#FFC107] shrink-0">
                                        <Edit3 size={18} className="stroke-[2.5]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Additional Phone</p>
                                        <p className="font-black text-[#1A1A1A] text-[14px] mb-0.5">{user.additional_phone || "No secondary line"}</p>
                                        <p className="text-[10px] text-gray-600 font-medium">Secondary Backup Contact</p>
                                    </div>
                                </div>

                                {/* Primary Address Card */}
                                <div className="bg-white rounded-2xl p-6 border border-gray-100/60 shadow-sm flex items-start gap-4 hover:shadow-md transition-all md:col-span-2">
                                    <div className="w-10 h-10 bg-[#FFF8E7] rounded-xl flex items-center justify-center text-[#FFC107] shrink-0">
                                        <MapPin size={18} className="stroke-[2.5]" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Primary Fulfillment Registry</p>
                                        {addresses.find(a => a.is_default) ? (
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-black text-[#1A1A1A] text-[15px] mb-0.5">{addresses.find(a => a.is_default).address_line1}</p>
                                                    <p className="text-[11px] text-gray-600 font-medium">
                                                        {addresses.find(a => a.is_default).city}, {addresses.find(a => a.is_default).state} {addresses.find(a => a.is_default).pincode}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleEditAddress(addresses.find(a => a.is_default))}
                                                    className="text-[9px] font-black text-[#FFC107] uppercase tracking-widest hover:underline"
                                                >
                                                    Modify Registry
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="font-black text-gray-300 text-[14px] italic">No primary registry deployed</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Addresses Section */}
                        <div className="mb-10 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-[#FFC107]" />
                                <h3 className="font-black text-[15px] uppercase tracking-tight text-[#1A1A1A]">Manage Addresses</h3>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingAddress(null);
                                    setAddressFormData({
                                        address_line1: "",
                                        city: "",
                                        state: "",
                                        pincode: "",
                                        country: "India",
                                        addresstype: "home",
                                        name: "",
                                        phone: "",
                                        is_default: false
                                    });
                                    setIsAddressModalOpen(true);
                                }}
                                className="flex items-center gap-2 border border-[#FFC107] px-4 py-2 rounded-xl text-[10px] font-black text-[#1A1A1A] hover:bg-[#FFF8E7] transition-all bg-white shadow-sm"
                            >
                                <Plus size={14} className="stroke-[3]" /> Add New Registry
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-20">
                            {addresses.length === 0 ? (
                                <div className="md:col-span-2 bg-gray-50/50 border border-dashed border-gray-200 rounded-[32px] p-16 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#1A1A1A] mb-6 shadow-sm">
                                        <MapPin size={24} />
                                    </div>
                                    <h4 className="font-black text-[#1A1A1A] tracking-tight uppercase text-sm mb-2">No Address Registry Found</h4>
                                    <p className="text-[#1A1A1A] text-[11px] font-medium leading-relaxed max-w-[280px]">Add your shipping destinations for a seamless fulfillment experience.</p>
                                </div>
                            ) : (
                                addresses.map((addr) => (
                                    <div key={addr.id} className="bg-white rounded-[24px] p-7 border border-[#1A1A1A] shadow-sm flex flex-col hover:shadow-lg hover:border-[#FFC107] transition-all group overflow-hidden relative">
                                        {!!addr.is_default && (
                                            <div className="absolute top-0 right-0 bg-[#FFC107] px-4 py-1.5 rounded-bl-2xl">
                                                <span className="text-[8px] font-black text-[#1A1A1A] uppercase tracking-widest">Primary Address</span>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-5 mb-5">
                                            <div className="w-12 h-12 bg-[#FFF8E7] rounded-2xl flex items-center justify-center text-[#FFC107] shrink-0">
                                                <MapPin size={22} className="stroke-[2.5]" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-black text-[#1A1A1A] uppercase tracking-[0.2em] mb-1.5">{addr.addresstype || "Registry"}</p>
                                                <h4 className="font-black text-[#1A1A1A] text-lg leading-tight mb-1">{addr.name || user.name}</h4>
                                                <p className="font-black text-[#1A1A1A] text-[15px] mb-1">{addr.address_line1}</p>
                                                <p className="text-[12px] text-[#1A1A1A] font-medium leading-relaxed">
                                                    {addr.city}, {addr.state} {addr.pincode}<br />
                                                    {addr.country}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-[#1A1A1A] group-hover:text-black transition-colors">
                                                <Phone size={12} className="stroke-[2.5]" />
                                                <span className="text-[11px] font-black tracking-widest">{addr.phone || "No contact"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditAddress(addr)}
                                                    className="p-2.5 rounded-xl border border-[#1A1A1A] text-[#1A1A1A] hover:text-black hover:bg-gray-50 transition-all shadow-sm"
                                                >
                                                    <Edit3 size={14} className="stroke-[2.5]" />
                                                </button>
                                                {!addr.is_default && (
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                await api.put(`/user/addresses/set-default/${addr.id}`);
                                                                toast.success("Primary registry updated!");
                                                                fetchAddresses();
                                                            } catch (error) {
                                                                toast.error("Failed to update primary registry");
                                                            }
                                                        }}
                                                        className="p-2.5 rounded-xl border border-[#1A1A1A] text-[#1A1A1A] hover:text-[#FFC107] hover:bg-[#FFF8E7] transition-all shadow-sm group/btn"
                                                        title="Set as Primary"
                                                    >
                                                        <Crown size={14} className="stroke-[2.5]" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteAddress(addr.id)}
                                                    className="p-2.5 rounded-xl border border-[#1A1A1A] text-[#1A1A1A] hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                                                    title="Delete"
                                                >
                                                    <X size={14} className="stroke-[3]" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}


                {/* ADDRESS MODAL */}
                {isAddressModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm" onClick={() => setIsAddressModalOpen(false)}></div>
                        <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
                            <div className="flex justify-between items-center p-8 border-b border-gray-100">
                                <div>
                                    <h3 className="font-black text-xl text-[#1A1A1A] flex items-center gap-3">
                                        <MapPin className="text-[#FFC107]" /> {editingAddress ? "Modify Registry" : "New Address Registry"}
                                    </h3>
                                    <p className="text-[11px] text-gray-400 font-medium tracking-tight mt-1">Provide precise location for seamless fulfillment</p>
                                </div>
                                <button onClick={() => setIsAddressModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-full transition-all">
                                    <X size={20} className="text-gray-300" />
                                </button>
                            </div>

                            <form onSubmit={handleAddressSubmit} className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest pl-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={addressFormData.name}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest pl-1">Contact Number</label>
                                        <input
                                            type="text"
                                            value={addressFormData.phone}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest pl-1">Street Address</label>
                                        <input
                                            type="text"
                                            value={addressFormData.address_line1}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, address_line1: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5 transition-all"
                                            placeholder="House No, Street, Landmark"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest pl-1">City</label>
                                        <input
                                            type="text"
                                            value={addressFormData.city}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest pl-1">State</label>
                                        <input
                                            type="text"
                                            value={addressFormData.state}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest pl-1">Pincode</label>
                                        <input
                                            type="text"
                                            value={addressFormData.pincode}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, pincode: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest pl-1">Registry Type (e.g. Home, Work, Other)</label>
                                        <select
                                            value={addressFormData.addresstype}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, addresstype: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5 transition-all appearance-none"
                                            required
                                        >
                                            <option value="home">Home</option>
                                            <option value="work">Work</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-3 pt-2">
                                        <input
                                            type="checkbox"
                                            id="is_default"
                                            checked={addressFormData.is_default}
                                            onChange={(e) => setAddressFormData({ ...addressFormData, is_default: e.target.checked })}
                                            className="w-5 h-5 accent-[#FFC107] rounded border-gray-300"
                                        />
                                        <label htmlFor="is_default" className="text-[11px] font-black text-[#1A1A1A] uppercase tracking-widest cursor-pointer">Set as Primary Fulfillment Axis</label>
                                    </div>
                                </div>
                                <div className="mt-10 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddressModalOpen(false)}
                                        className="flex-1 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-[#1A1A1A] border border-gray-100 hover:bg-gray-50 transition-all"
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isChanging}
                                        className="flex-[2] bg-[#1A1A1A] text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#FFC107] hover:text-[#1A1A1A] transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                    >
                                        {isChanging ? "Deploying..." : (editingAddress ? "Update Registry" : "Initialize Registry")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* CHANGE PASSWORD TAB */}
                {activeTab === "password" && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-2xl mx-auto">
                        <div className="mb-12 flex flex-col items-center text-center">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1 h-5 bg-[#FFC107] rounded-full"></div>
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Security Center</span>
                            </div>
                            <h3 className="text-3xl font-black text-[#1A1A1A] uppercase tracking-tight">Access Control</h3>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest pl-1">Current Password</label>
                                    <div className="relative group">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#FFC107]">
                                            <Lock size={18} className="stroke-[2.5]" />
                                        </span>
                                        <input
                                            type={showPassword.old ? "text" : "password"}
                                            placeholder="••••••••••••"
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                            className="w-full h-14 bg-white border border-gray-300 rounded-2xl pl-16 pr-14 font-bold text-[#1A1A1A] text-sm outline-none transition-all focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1A1A1A] transition-colors"
                                        >
                                            {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">New Password</label>
                                    <div className="relative group">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#FFC107]">
                                            <Key size={18} className="stroke-[2.5]" />
                                        </span>
                                        <input
                                            type={showPassword.new ? "text" : "password"}
                                            placeholder="Minimum 6 characters"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full h-14 bg-white border border-gray-300 rounded-2xl pl-16 pr-14 font-bold text-[#1A1A1A] text-sm outline-none transition-all focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1A1A1A] transition-colors"
                                        >
                                            {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Confirm New Password</label>
                                    <div className="relative group">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#FFC107]">
                                            <ShieldCheck size={18} className="stroke-[2.5]" />
                                        </span>
                                        <input
                                            type={showPassword.confirm ? "text" : "password"}
                                            placeholder="Repeat new password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full h-14 bg-white border border-gray-300 rounded-2xl pl-16 pr-14 font-bold text-[#1A1A1A] text-sm outline-none transition-all focus:border-[#FFC107] focus:ring-4 focus:ring-[#FFC107]/5"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1A1A1A] transition-colors"
                                        >
                                            {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-4">
                                <button
                                    type="submit"
                                    disabled={isChanging}
                                    className="h-16 px-12 bg-[#FFC107] text-[#1A1A1A] rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#FFC107]/20 hover:bg-[#FFB300] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
                                >
                                    {isChanging ? "Updating Security..." : "Change Passowrd"}
                                    {!isChanging && <ArrowRight size={18} className="stroke-[3]" />}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* WISHLIST TAB */}
                {activeTab === "wishlist" && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 w-full">
                        <div className="mb-10 flex flex-col items-center text-center">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1 h-5 bg-[#FFC107] rounded-full"></div>
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Personal Collection</span>
                            </div>
                            <h3 className="text-3xl font-black text-[#1A1A1A] uppercase tracking-tight">Your Wishlist</h3>
                        </div>

                        {loadingWishlist ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-12 h-12 border-4 border-[#FFC107]/20 border-t-[#FFC107] rounded-full animate-spin mb-4"></div>
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Gathering your heart's desires...</span>
                            </div>
                        ) : wishlist.length === 0 ? (
                            <div className="min-h-[400px] flex flex-col justify-center items-center text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center text-[#FFC107] mb-6 relative">
                                    <Heart size={32} className="stroke-[2.5]" />
                                </div>
                                <h3 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tight mb-2">Your Library Whispers</h3>
                                <p className="text-[12px] text-gray-400 font-medium max-w-[280px] leading-relaxed mb-8">Your curated collection of future reads will appear here once they find their way to your heart.</p>
                                <button onClick={() => router.push("/books")} className="bg-[#1A1A1A] text-white px-10 py-3.5 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-[#FFC107] hover:text-[#1A1A1A] transition-all shadow-lg active:scale-95">
                                    Browse Library
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {wishlist.map((item) => {
                                    const book = item.book || {};
                                    const bookId = book.id;
                                    const title = book.title || "Untitled";
                                    const price = book.price || 0;
                                    const author = book.author || "Unknown Author";
                                    const thumbnailUrl = book.thumbnail?.url || book.thumbnail || "/placeholder-book.jpg";

                                    if (!bookId) return null;

                                    return (
                                        <div key={item.id} className="group bg-white rounded-[24px] border border-gray-100 hover:border-[#FFC107]/40 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden relative">
                                            {/* Product Image Area */}
                                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                                <img
                                                    src={thumbnailUrl}
                                                    alt={title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => router.push(`/books/${bookId}`)}
                                                        className="w-10 h-10 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center hover:bg-[#FFC107] transition-colors"
                                                        title="View Details"
                                                    >
                                                        <BookOpen size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAddToCart({ id: bookId, title, price, thumbnail: book.thumbnail, author })}
                                                        className="w-10 h-10 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center hover:bg-[#FFC107] transition-colors"
                                                        title="Add to Cart"
                                                    >
                                                        <ShoppingBag size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveFromWishlist(bookId)}
                                                        className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors"
                                                        title="Remove from Wishlist"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4 flex flex-col flex-1">
                                                <div className="mb-2">
                                                    <h4 className="font-bold text-[#1A1A1A] text-[13px] leading-tight line-clamp-1 mb-0.5">{title}</h4>
                                                    <p className="text-gray-400 font-medium text-[11px]">{author}</p>
                                                </div>

                                                <div className="mt-auto flex justify-between items-center">
                                                    <span className="text-base font-black text-[#1A1A1A]">₹{price}</span>
                                                    <button
                                                        onClick={() => router.push(`/books/${bookId}`)}
                                                        className="text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#FFC107] transition-colors"
                                                    >
                                                        Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === "orders" && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 w-full mx-auto xl:mx-0">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-5 h-5 rounded-full bg-[#FFF8E7] flex items-center justify-center text-[#FFC107]">
                                        <ShoppingBag size={12} className="stroke-[3]" />
                                    </div>
                                    <h3 className="font-black text-[15px] uppercase tracking-tight text-[#1A1A1A]">ORDER HISTORY</h3>
                                </div>
                                <p className="text-[11px] text-gray-400 font-medium ml-7">Manage and details of your previous book purchases</p>
                            </div>

                        </div>

                        <div className="flex justify-between items-center mt-6 mb-5 pb-3">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b-2 border-[#FFC107] pb-1">
                                Recent Purchases ({totalOrders})
                            </span>

                        </div>

                        {loadingOrders ? (
                            <div className="flex flex-col items-center justify-center flex-1 py-20">
                                <div className="w-12 h-12 border-4 border-[#FFC107]/20 border-t-[#FFC107] rounded-full animate-spin mb-4"></div>
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Loading Records...</span>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="flex flex-col justify-center items-center text-center py-20 flex-1">
                                <div className="w-24 h-24 bg-gray-50 rounded-[30px] shadow-sm flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
                                    <ShoppingBag size={36} />
                                </div>
                                <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight mb-2">No Journey Found</h3>
                                <p className="text-[12px] text-gray-500 max-w-[320px] leading-relaxed">You haven't purchased any books yet. Start exploring our collection!</p>
                                <button onClick={() => router.push("/books")} className="mt-8 bg-[#1A1A1A] text-white px-8 py-3.5 rounded-full font-bold text-[13px] hover:bg-opacity-90 transition-all active:scale-95 shadow-lg">
                                    Back to Store
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 pb-8">
                                {orders.map((order) => {
                                    const firstItem = order.items?.[0]?.book || {};
                                    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
                                    const orderNo = order.order_no || `ORD-${order.id.toString().padStart(5, '0')}`;

                                    return (
                                        <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 relative overflow-hidden group">

                                            <div className="flex gap-4 items-center w-full md:w-auto h-full">
                                                <div className="w-[65px] h-[90px] rounded-lg overflow-hidden shadow-md border border-gray-200 relative shrink-0">
                                                    <img
                                                        src={
                                                            firstItem.thumbnail?.url ||
                                                            (typeof firstItem.thumbnail === 'string' ? (firstItem.thumbnail.startsWith('http') ? firstItem.thumbnail : `${process.env.NEXT_PUBLIC_API_URL}${firstItem.thumbnail}`) :
                                                                (firstItem.image || "/placeholder.png"))
                                                        }
                                                        alt={firstItem.title || "Book"}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    />
                                                </div>

                                                <div className="flex flex-col justify-center h-full py-1">
                                                    <h4 className="text-[15px] font-black text-[#1A1A1A] leading-snug line-clamp-1">{firstItem.title || "Unnamed Book"}</h4>
                                                    <div className="flex items-center gap-1 mt-1 text-gray-400">
                                                        <BookOpen size={11} className="stroke-[2.5]" />
                                                        <span className="text-[12px] font-medium">by {firstItem.author || "Unknown"}</span>
                                                    </div>

                                                    <div className="flex gap-x-6 gap-y-2 mt-3">
                                                        <div>
                                                            <p className="text-[7px] font-black text-gray-300 uppercase tracking-[0.15em] mb-0.5">Order ID</p>
                                                            <p className="text-[11px] font-bold text-[#1A1A1A]">
                                                                #{orderNo}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[7px] font-black text-gray-300 uppercase tracking-[0.15em] mb-0.5">Order Date</p>
                                                            <p className="text-[11px] font-bold text-[#1A1A1A] flex items-center gap-1">
                                                                <Calendar size={10} className="text-gray-400 stroke-[2.5]" /> {orderDate}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-start md:items-end w-full md:w-auto pt-4 md:pt-0 border-t border-gray-100 md:border-none mt-2 md:mt-0">
                                                <div className="flex items-center justify-between md:flex-col md:items-end w-full md:w-auto gap-2">
                                                    <span className="text-lg font-black text-[#1A1A1A]">₹{parseFloat(order.total_amount).toLocaleString()}</span>

                                                    <div>
                                                        {order.delivery_status === 'delivered' ? (
                                                            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100/50">
                                                                <CheckCircle2 size={10} className="stroke-[2.5]" />
                                                                <span className="text-[9px] font-bold uppercase">Delivered</span>
                                                            </div>
                                                        ) : order.delivery_status === 'shipped' ? (
                                                            <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100/50">
                                                                <Truck size={10} className="stroke-[2.5]" />
                                                                <span className="text-[9px] font-bold uppercase">Shipped</span>
                                                            </div>
                                                        ) : order.delivery_status === 'cancelled' ? (
                                                            <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100/50">
                                                                <XCircle size={10} className="stroke-[2.5]" />
                                                                <span className="text-[9px] font-bold uppercase">Cancelled</span>
                                                            </div>
                                                        ) : ['returned', 'refunded'].includes(order.delivery_status) ? (
                                                            <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100/50">
                                                                <RefreshCw size={10} className="stroke-[2.5]" />
                                                                <span className="text-[9px] font-bold uppercase">{order.delivery_status}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1 text-[#A67C00] bg-[#FFFbf0] px-2 py-0.5 rounded-full border border-[#FFECB3]/50">
                                                                <Clock size={10} className="stroke-[2.5] text-[#FFC107]" />
                                                                <span className="text-[9px] font-bold uppercase">{order.delivery_status || 'Processing'}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mt-4 md:mt-2.5 w-full justify-start md:justify-end">
                                                    <button
                                                        onClick={() => router.push(`/order/${orderNo}`)}
                                                        className="bg-[#F8F9FA] text-[#1A1A1A] font-bold text-[10px] md:text-[11px] px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-all active:scale-95 whitespace-nowrap"
                                                    >
                                                        Details
                                                    </button>

                                                    {['delivered', 'cancelled'].includes(String(order.delivery_status || '').toLowerCase()) && (
                                                        order.refund_requested ? (
                                                            <div className="bg-purple-100 text-purple-700 font-bold text-[10px] md:text-[11px] px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 whitespace-nowrap">
                                                                <Clock size={12} /> Refunded
                                                            </div>
                                                        ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        setRefundOrderId(order.id);
                                                                        setIsRefundModalOpen(true);
                                                                    }}
                                                                    className="bg-purple-50 text-purple-600 font-bold text-[10px] md:text-[11px] px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-purple-100 transition-all active:scale-95 whitespace-nowrap"
                                                                >
                                                                    <RefreshCw size={12} /> {String(order.delivery_status).toLowerCase() === 'delivered' ? 'Return' : 'Refund'}
                                                                </button>
                                                        )
                                                    )}

                                                    {order.delivery_status === 'processing' && (
                                                        <button
                                                            disabled={isProcessingAction}
                                                            onClick={() => handleCancelOrder(order.id)}
                                                            className="bg-red-50 text-red-600 font-bold text-[10px] md:text-[11px] px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-100 transition-all active:scale-95 whitespace-nowrap"
                                                        >
                                                            {isProcessingAction ? "..." : "Cancel"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-8">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-[#1A1A1A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        >
                                            <ChevronLeft size={18} className="stroke-[2.5]" />
                                        </button>

                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black transition-all ${currentPage === i + 1
                                                    ? "bg-[#FFC107] text-[#1A1A1A] shadow-lg shadow-[#FFC107]/20"
                                                    : "bg-white border border-gray-100 text-gray-400 hover:border-gray-300"
                                                    }`}
                                            >
                                                {String(i + 1).padStart(2, '0')}
                                            </button>
                                        ))}

                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-[#1A1A1A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        >
                                            <ChevronRight size={18} className="stroke-[2.5]" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* CUSTOMER SUPPORT TAB */}
                {activeTab === "support" && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 w-full flex flex-col lg:flex-row gap-8">

                        {/* Left: New Support Ticket Form */}
                        <div className="lg:w-1/2 flex flex-col">
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8 md:p-10 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-6 h-6 rounded-full border-2 border-[#FFC107] flex items-center justify-center text-[#FFC107]">
                                        <Plus size={14} className="stroke-[3]" />
                                    </div>
                                    <h3 className="font-black text-lg text-[#1A1A1A] uppercase tracking-tight">New Support Ticket</h3>
                                </div>

                                <form onSubmit={handleSubmitSupportTicket} className="space-y-6 flex-1">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Issue Type *</label>
                                        <select
                                            value={supportFormData.issue_type}
                                            onChange={(e) => setSupportFormData({ ...supportFormData, issue_type: e.target.value })}
                                            className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] transition-all appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="">Select the type of issue...</option>
                                            <option value="billing">Billing & Payment</option>
                                            <option value="order">Order & Delivery</option>
                                            <option value="account">Account Access</option>
                                            <option value="technical">Technical Support</option>
                                            <option value="other">Other Inquiry</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Subject *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Broken frame hinges..."
                                            value={supportFormData.subject}
                                            onChange={(e) => setSupportFormData({ ...supportFormData, subject: e.target.value })}
                                            className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 relative">
                                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Message</label>
                                        <div className="relative">
                                            <textarea
                                                placeholder="Describe your issue in detail..."
                                                rows={6}
                                                value={supportFormData.message}
                                                onChange={(e) => setSupportFormData({ ...supportFormData, message: e.target.value })}
                                                className="w-full bg-white border border-blue-400 rounded-3xl px-6 py-4 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-[#FFC107] transition-all resize-none shadow-sm"
                                                required
                                            />
                                            <div className="absolute bottom-4 right-4 text-emerald-500">
                                                <div className="w-5 h-5 bg-[#F8F9FA] rounded-md border border-gray-100 flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    <button
                                        type="submit"
                                        disabled={isChanging}
                                        className="w-full py-5 bg-[#0A0D14] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#1A1A1A] transition-all shadow-xl disabled:opacity-50 mt-4"
                                    >
                                        {isChanging ? "Submitting..." : "Submit Ticket"}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right: My Tickets & Live Chat Style */}
                        <div className="lg:w-1/2 flex flex-col gap-6">
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden flex flex-col h-full">
                                {/* My Tickets List */}
                                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        <h3 className="font-black text-lg text-[#1A1A1A] uppercase tracking-tight">My Tickets</h3>
                                    </div>
                                    <span className="bg-blue-50 text-blue-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {supportTickets.length} Total
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto no-scrollbar max-h-[600px] divide-y divide-gray-50">
                                    {loadingTickets ? (
                                        <div className="p-10 text-center">
                                            <div className="w-8 h-8 border-2 border-[#FFC107] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Syncing Records...</p>
                                        </div>
                                    ) : supportTickets.length === 0 ? (
                                        <div className="p-20 text-center opacity-40">
                                            <MessageSquare size={48} className="mx-auto mb-4" />
                                            <p className="font-black uppercase tracking-widest text-[10px]">No History Deployed</p>
                                        </div>
                                    ) : (
                                        supportTickets.map((ticket) => (
                                            <div key={ticket.id} className="p-0">
                                                {/* Ticket Header in List */}
                                                <div
                                                    onClick={() => handleSelectTicket(ticket)}
                                                    className={`p-6 cursor-pointer transition-all hover:bg-gray-50 ${selectedTicketId === ticket.id ? "bg-gray-50/50" : ""}`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">#{ticket.ticket_id || ticket.id.toString().slice(-6).toUpperCase()}</span>
                                                        <div className={`px-3 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest ${ticket.status === 'open' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                                                                ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                                                    'bg-gray-50 text-gray-400 border-gray-100'
                                                            }`}>
                                                            {ticket.status}
                                                        </div>
                                                    </div>
                                                    <h4 className="font-bold text-[#1A1A1A] text-sm mb-1">{ticket.subject}</h4>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-gray-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest">
                                                            {ticket.category || "General"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* If selected, show chat inside list (as per image style) */}
                                                {selectedTicketId === ticket.id && polledTicket && (
                                                    <div className="bg-white border-t border-gray-100 px-6 py-6 animate-in slide-in-from-top-2">
                                                        <div className="flex items-center justify-between mb-6">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 py-1 border-l-2 border-gray-200">Chat History</span>
                                                            <div className="bg-red-500 text-white px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">
                                                                High Priority
                                                            </div>
                                                        </div>

                                                        {/* Live Chat Style Area */}
                                                        <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto customs-scrollbar px-1 flex flex-col pt-4">
                                                            {/* Initial Message (Always User) */}
                                                            <div className="flex flex-col items-end ml-auto max-w-[85%]">
                                                                <div className="bg-[#FFC107] text-[#1A1A1A] rounded-2xl rounded-tr-none font-medium text-sm leading-relaxed shadow-sm p-4">
                                                                    {polledTicket.description}
                                                                </div>
                                                                <span className="text-[9px] font-bold text-gray-400 mt-2 mr-1">
                                                                    Opened • {new Date(polledTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>

                                                            {/* Message History */}
                                                            {polledTicket.messages?.map((msg, idx) => {
                                                                // Compare sender_id with ticket owner ID
                                                                const isSelf = String(msg.sender_id) === String(polledTicket.user_id);
                                                                return (
                                                                    <div key={idx} className={`flex flex-col ${isSelf ? "items-end ml-auto" : "items-start"} max-w-[85%]`}>
                                                                        <div className={`${isSelf ? "bg-[#FFC107] text-[#1A1A1A] rounded-tr-none shadow-[#FFC107]/10" : "bg-white border border-gray-100 text-[#1A1A1A] rounded-tl-none shadow-sm"} p-4 rounded-2xl font-medium text-sm leading-relaxed`}>
                                                                            {msg.message}
                                                                        </div>
                                                                        <span className="text-[9px] font-bold text-gray-400 mt-2 px-1">
                                                                            {isSelf ? "You" : "Support"} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                            <div ref={messagesEndRef} />
                                                        </div>

                                                        {/* Input Field */}
                                                        <form onSubmit={handleSendSupportMessage} className="relative">
                                                            <input
                                                                type="text"
                                                                placeholder="Type a message..."
                                                                value={supportMessage}
                                                                onChange={(e) => setSupportMessage(e.target.value)}
                                                                className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 pr-16 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-blue-400 shadow-sm transition-all"
                                                            />
                                                            <button
                                                                type="submit"
                                                                disabled={!supportMessage.trim() || sendingMessage}
                                                                className="absolute right-3 top-1/2 -track-y-1/2 -translate-y-1/2 w-10 h-10 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                                            >
                                                                <Send size={18} />
                                                            </button>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* OTHER TABS PLACEHOLDER */}
                {["payments", "notifications"].includes(activeTab) && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 min-h-[500px] flex flex-col justify-center items-center text-center">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-200 mb-8 overflow-hidden relative">
                            <Activity size={40} className="animate-pulse" />
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-[#FFC107]"></div>
                        </div>
                        <h3 className="text-2xl font-black text-[#1A1A1A] uppercase tracking-tight mb-3">Refining Experience</h3>
                        <p className="text-[13px] text-gray-400 font-medium tracking-tight">This section is currently being curated for your excellence.</p>
                    </div>
                )}
            </main>
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .customs-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .customs-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .customs-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }
                .customs-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #FFC107;
                }
            `}</style>
            {/* CANCEL MODAL */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm" onClick={() => setIsCancelModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <XCircle size={32} className="text-red-500" />
                            </div>
                            <h3 className="font-black text-xl text-[#1A1A1A] mb-2">Cancel Order?</h3>
                            <p className="text-[12px] text-gray-400 font-medium leading-relaxed">Are you sure you want to cancel this order? This action cannot be undone and your items will be returned to stock.</p>
                        </div>

                        <div className="p-8 pt-0 flex gap-3">
                            <button
                                onClick={() => setIsCancelModalOpen(false)}
                                className="flex-1 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest text-[#1A1A1A] border border-gray-100 hover:bg-gray-50 transition-all"
                            >
                                No, Keep it
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                disabled={isProcessingAction}
                                className="flex-1 bg-red-500 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                            >
                                {isProcessingAction ? "..." : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* REFUND MODAL */}
            {isRefundModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm" onClick={() => setIsRefundModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="font-black text-xl text-[#1A1A1A] flex items-center gap-3">
                                <RefreshCw className="text-purple-500" /> {
                                    orders.find(o => o.id === refundOrderId)?.delivery_status?.toLowerCase() === 'delivered' 
                                    ? 'Return Order' 
                                    : 'Request Refund'
                                }
                            </h3>
                            <p className="text-[11px] text-gray-400 font-medium tracking-tight mt-1">Please provide a valid reason for your {
                                orders.find(o => o.id === refundOrderId)?.delivery_status?.toLowerCase() === 'delivered' 
                                ? 'return' 
                                : 'refund'
                            } request.</p>
                        </div>

                        <form onSubmit={handleRefundRequest} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest pl-1">Refund Reason</label>
                                <textarea
                                    rows={4}
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-purple-500 transition-all resize-none"
                                    placeholder="Explain why you want a refund (e.g. Damaged product, Wrong item sent)"
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsRefundModalOpen(false)}
                                    className="flex-1 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest text-[#1A1A1A] border border-gray-100 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isProcessingAction}
                                    className="flex-[2] bg-[#1A1A1A] text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-purple-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                >
                                    {isProcessingAction ? "Submitting..." : "Submit Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isEmailOtpModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        {/* Header Image pattern or simple color curve */}
                        <div className="h-32 bg-[#FFC107] relative flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center relative z-10 shadow-lg">
                                <Mail size={32} className="text-[#1A1A1A] stroke-[2]" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 md:p-10 pt-8 text-center bg-white relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsEmailOtpModalOpen(false)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={16} className="stroke-[3]" />
                            </button>

                            <h2 className="text-2xl font-black text-[#1A1A1A] mb-3">Verify New Email</h2>
                            <p className="text-[13px] text-gray-500 mb-8 font-medium">
                                We've sent a 6-digit verification code to<br />
                                <strong className="text-[#1A1A1A]">{formData.email}</strong>
                            </p>

                            <form onSubmit={submitEmailOtp} className="space-y-8">
                                <div className="flex justify-center gap-2 md:gap-3">
                                    {emailOtp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (emailOtpRefs.current[index] = el)}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleEmailOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleEmailOtpKeyDown(index, e)}
                                            className="w-10 h-12 md:w-12 md:h-14 text-center text-xl md:text-2xl font-black rounded-xl bg-gray-50 border border-gray-200 text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFC107]/20 focus:border-[#FFC107] transition-all"
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isChanging}
                                    className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-[#FFC107] hover:text-[#1A1A1A] hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {isChanging ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            VERIFYING...
                                        </>
                                    ) : (
                                        <>
                                            VERIFY AND SAVE
                                            <ArrowRight size={16} className="stroke-[3]" />
                                        </>
                                    )}
                                </button>
                            </form>
                            
                            <div className="mt-6 text-[11px] font-bold text-gray-400">
                                Didn't receive the code? 
                                <button 
                                    onClick={(e) => { e.preventDefault(); handleProfileUpdate(null, null); }}
                                    disabled={isChanging}
                                    className="text-[#1A1A1A] ml-1 hover:underline disabled:opacity-50"
                                >
                                    Resend
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProfilePageWrapper = () => (
    <Suspense fallback={
        <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#FFC107]/20 border-t-[#FFC107] rounded-full animate-spin"></div>
        </div>
    }>
        <ProfilePage />
    </Suspense>
);

export default ProfilePageWrapper;
