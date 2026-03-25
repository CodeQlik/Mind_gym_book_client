"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import {
    ChevronLeft,
    ChevronRight,
    Download,
    MapPin,
    CreditCard,
    CheckCircle2,
    Clock,
    XCircle,
    Package,
    Truck,
    RefreshCw,
    Headset,
    User as UserIcon,
    Phone,
    ShoppingBag,
    ArrowRight,
    Star
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchProfile } from "@/redux/slices/authSlice";
import { syncAddToCart } from "@/redux/slices/cartSlice";

export default function OrderDetailsPage({ params }) {
    const { id } = React.use(params);
    const { token, user: authUser } = useSelector((state) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [refundReason, setRefundReason] = useState("");
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const fetchId = id.toString().replace('ORD-', '');
            const res = await api.get(`/orders/my-orders/${parseInt(fetchId)}`);
            if (res.data?.success) {
                setOrder(res.data.data);
            } else {
                toast.error("Failed to load order details");
                router.push("/profile");
            }
        } catch (error) {
            console.error("Error fetching order:", error);
            toast.error("Order not found or access denied");
            router.push("/profile");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = () => {
        setCancelReason("");
        setIsCancelModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!cancelReason.trim() || cancelReason.trim().length < 5) {
            return toast.error("Please provide a reason (at least 5 characters)");
        }
        try {
            setIsProcessingAction(true);
            const res = await api.post(`/orders/cancel/${order.id}`, { reason: cancelReason });
            if (res.data?.success) {
                const updatedOrder = res.data.data;
                setIsCancelModalOpen(false);
                setOrder(updatedOrder);

                // If it was a prepaid order, inform user that refund is initiated
                const isPrepaid = String(updatedOrder.payment_method || '').toLowerCase() !== 'cod' || updatedOrder.payment_status === 'paid';

                if (isPrepaid) {
                    toast.success("Order cancelled. Refund has been automatically initiated.");
                } else {
                    toast.success("Order cancelled successfully");
                }

                fetchOrderDetails();
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
            const res = await api.post(`/orders/refund/${order.id}`, { reason: refundReason });
            if (res.data?.success) {
                toast.success("Refund request submitted successfully");
                setIsRefundModalOpen(false);
                setRefundReason("");
                fetchOrderDetails();
            }
        } catch (error) {
            console.error("Refund request failed:", error);
            const errorMsg = error.response?.data?.message || "";
            if (errorMsg.toLowerCase().includes("already requested")) {
                toast.success("Refund request is already registered.");
                setIsRefundModalOpen(false);
                setRefundReason("");
                fetchOrderDetails();
            } else {
                toast.error(errorMsg || "Failed to submit refund request");
            }
        } finally {
            setIsProcessingAction(false);
        }
    };

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        if (!authUser) {
            dispatch(fetchProfile());
        }

        const fetchRecommendations = async () => {
            try {
                const res = await api.get('/book/all?limit=5');
                if (res.data?.success) {
                    const data = res.data.data || {};
                    const booksSource = data.books || data;
                    let allBooks = [];

                    if (Array.isArray(booksSource)) {
                        allBooks = booksSource;
                    } else if (booksSource && typeof booksSource === 'object') {
                        allBooks = Object.values(booksSource).flat().filter(book => book !== null && typeof book === 'object');
                    }

                    setRelatedBooks(allBooks.slice(0, 5));
                }
            } catch (err) {
                console.error("Error fetching related books", err);
            }
        };

        fetchOrderDetails();
        fetchRecommendations();
    }, [id, token, router, authUser, dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#FFC107]/20 border-t-[#FFC107] rounded-full animate-spin mb-4"></div>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Synchronizing Details...</span>
            </div>
        );
    }

    if (!order) return null;

    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
    const orderNo = order.order_no || `ORD-${order.id.toString().padStart(5, '0')}`;

    let addressObj = {};
    try {
        addressObj = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address;
    } catch (e) {
        addressObj = {};
    }

    let subtotal = 0;
    order.items?.forEach(item => {
        subtotal += parseFloat(item.unit_price || item.price || 0) * parseInt(item.quantity);
    });

    const shippingFee = 0;
    const handleDownloadInvoice = async () => {
        try {
            const fetchId = id.toString().replace('ORD-', '');
            const response = await api.get(`/orders/invoice/${parseInt(fetchId)}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice_${orderNo}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Invoice error:", error);
            toast.error("Failed to download invoice");
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

    const orderTotal = parseFloat(order.total_amount);

    return (
        <div className="min-h-screen bg-white font-sans pb-20 pt-28">
            <div className="max-w-6xl mx-auto px-4 md:px-8">

                {/* Header Section */}
                <div className="mb-12">
                    <nav className="flex items-center gap-2 text-[#999999] text-[13px] font-medium mb-8">
                        <button onClick={() => router.push("/profile?tab=orders")} className="hover:text-[#1A1A1A] flex items-center gap-1 transition-colors">
                            <ChevronLeft size={16} /> Back to Orders
                        </button>
                        <span>/</span>
                        <span className="text-[#1A1A1A]">Order {orderNo}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-4 flex-wrap">
                                <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tighter">Order #{orderNo}</h1>
                                <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${order.delivery_status === 'delivered' ? 'bg-green-50 border-green-100 text-green-600' :
                                    order.delivery_status === 'shipped' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                        order.delivery_status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-600' :
                                            ['returned', 'refunded'].includes(order.delivery_status) ? 'bg-purple-50 border-purple-100 text-purple-600' :
                                                'bg-[#FFFbf0] border-[#FFECB3] text-[#A67C00]'
                                    }`}>
                                    {order.delivery_status}
                                </span>
                            </div>
                            <p className="text-[#999999] text-[14px] font-medium mt-3 flex items-center gap-2">
                                <Clock size={16} className="text-[#CCCCCC]" />
                                Placed on {orderDate}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDownloadInvoice}
                                className="flex items-center gap-2 px-6 py-3 border border-gray-100 rounded-xl text-[13px] font-black text-[#1A1A1A] hover:bg-gray-50 transition-all uppercase tracking-widest shadow-sm shadow-[#000000]/5 active:scale-95"
                            >
                                <Download size={16} /> Invoice
                            </button>

                            {order.delivery_status === 'processing' && (
                                <button
                                    disabled={isProcessingAction}
                                    onClick={handleCancelOrder}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl text-[13px] font-black hover:bg-red-100 transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50"
                                >
                                    {isProcessingAction ? "..." : "Cancel Order"}
                                </button>
                            )}

                            {['delivered', 'cancelled'].includes(String(order.delivery_status || '').toLowerCase()) && (
                                order.refund_requested ? (
                                    <div className="flex items-center gap-2 px-6 py-3 bg-purple-100 text-purple-700 rounded-xl text-[13px] font-black uppercase tracking-widest shadow-sm">
                                        <Clock size={16} /> Refund Requested
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsRefundModalOpen(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-purple-50 text-purple-600 border border-purple-100 rounded-xl text-[13px] font-black hover:bg-purple-100 transition-all uppercase tracking-widest active:scale-95 shadow-sm shadow-purple-100/50"
                                    >
                                        <RefreshCw size={16} /> {String(order.delivery_status || '').toLowerCase() === 'delivered' ? 'Return Order' : 'Request Refund'}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Progress & Items */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* Status Progress Tracker */}
                        <div className="bg-white rounded-xl p-8 md:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.1)] border-t-0 relative border border-gray-50">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-[#FFC107] rounded-b-full"></div>

                            <div className="relative flex justify-between items-start w-full">
                                <div className="absolute left-[5%] right-[5%] top-7 h-[1px] bg-gray-100 -z-0"></div>
                                <div
                                    className="absolute left-[5%] top-7 h-[1px] bg-[#FFC107] -z-0 transition-all duration-1000"
                                    style={{
                                        width: order.delivery_status === 'delivered' ? '90%' :
                                            order.delivery_status === 'shipped' ? '60%' :
                                                order.delivery_status === 'processing' ? '30%' : '0%'
                                    }}
                                ></div>

                                {/* Step 1: Placed */}
                                <div className="flex flex-col items-center gap-4 relative z-10 w-1/4">
                                    <div className="w-14 h-14 rounded-full bg-[#FFC107] flex items-center justify-center border-[6px] border-white shadow-lg text-[#1A1A1A] transition-transform hover:scale-110">
                                        <Clock size={20} className="stroke-[2.5]" />
                                    </div>
                                    <div className="text-center px-1">
                                        <p className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-tighter">Order Placed</p>
                                        <p className="text-[10px] text-[#999999] font-bold mt-1 uppercase tracking-widest">{orderDate}</p>
                                    </div>
                                </div>

                                {/* Step 2: Processing */}
                                <div className="flex flex-col items-center gap-4 relative z-10 w-1/4">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-[6px] border-white shadow-lg transition-all duration-500 ${order.delivery_status !== 'pending' ? 'bg-[#FFC107] text-[#1A1A1A]' : 'bg-gray-100 text-gray-300'}`}>
                                        <Package size={20} className="stroke-[2.5]" />
                                    </div>
                                    <div className="text-center px-1">
                                        <p className={`text-[12px] font-black uppercase tracking-tighter ${order.delivery_status !== 'pending' ? 'text-[#1A1A1A]' : 'text-[#CCCCCC]'}`}>Processing</p>
                                    </div>
                                </div>

                                {/* Step 3: Shipped */}
                                <div className="flex flex-col items-center gap-4 relative z-10 w-1/4">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-[6px] border-white shadow-lg transition-all duration-500 ${['shipped', 'delivered'].includes(order.delivery_status) ? 'bg-[#FFC107] text-[#1A1A1A]' : 'bg-gray-100 text-gray-300'}`}>
                                        <Truck size={20} className="stroke-[2.5]" />
                                    </div>
                                    <div className="text-center px-1">
                                        <p className={`text-[12px] font-black uppercase tracking-tighter ${['shipped', 'delivered'].includes(order.delivery_status) ? 'text-[#1A1A1A]' : 'text-[#CCCCCC]'}`}>Shipped</p>
                                    </div>
                                </div>

                                {/* Step 4: Delivered */}
                                <div className="flex flex-col items-center gap-4 relative z-10 w-1/4">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-[6px] border-white shadow-lg transition-all duration-500 ${order.delivery_status === 'delivered' ? 'bg-[#FFC107] text-[#1A1A1A]' : 'bg-gray-100 text-gray-300'}`}>
                                        <CheckCircle2 size={20} className="stroke-[2.5]" />
                                    </div>
                                    <div className="text-center px-1">
                                        <p className={`text-[12px] font-black uppercase tracking-tighter ${order.delivery_status === 'delivered' ? 'text-[#1A1A1A]' : 'text-[#CCCCCC]'}`}>Delivered</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-6">
                            <h2 className="text-[18px] font-black text-[#1A1A1A] uppercase tracking-wider">Items in your order</h2>

                            <div className="bg-white rounded-xl border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                                {order.items?.map((item, idx) => {
                                    const book = item.book || {};
                                    const thumb = book.thumbnail?.url || (typeof book.thumbnail === 'string' ? (book.thumbnail.startsWith('http') ? book.thumbnail : `${process.env.NEXT_PUBLIC_API_URL}${book.thumbnail}`) : book.image);

                                    return (
                                        <div key={idx} className={`p-8 flex flex-col sm:flex-row gap-8 items-center ${idx !== 0 ? 'border-t border-gray-50' : ''}`}>
                                            <div className="w-[100px] h-[140px] rounded-2xl overflow-hidden shadow-xl border border-gray-50 shrink-0">
                                                <img src={thumb || "/placeholder.png"} alt={book.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 text-center sm:text-left">
                                                <h4 className="text-[16px] font-black text-[#1A1A1A] leading-tight mb-1">{book.title || "Unnamed Book"}</h4>
                                                <p className="text-[14px] text-[#999999] font-medium mb-6 uppercase tracking-widest">{book.author || "Unknown Artist"}</p>

                                                <div className="flex items-center justify-center sm:justify-start gap-4">
                                                    <div className="bg-gray-50 px-4 py-2 rounded-xl text-[12px] font-black text-[#1A1A1A] border border-gray-100">
                                                        Qty: {item.quantity}
                                                    </div>
                                                    <span className="text-[14px] font-bold text-[#999999]">₹{parseFloat(item.unit_price || item.price || 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="text-center sm:text-right sm:pl-8">
                                                <span className="text-2xl font-black text-[#1A1A1A] tracking-tighter">₹{(parseFloat(item.unit_price || item.price || 0) * parseInt(item.quantity)).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-[#FFF8E7] rounded-xl p-8 border border-[#FFECB3]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-[#FFC107]/5 mt-12">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg text-[#FFC107]">
                                    <Package size={28} className="stroke-[2.5]" />
                                </div>
                                <div>
                                    <h5 className="font-black text-[#1A1A1A] text-[16px] tracking-tight">Need help with this order?</h5>
                                    <p className="text-[#999999] text-[14px] font-medium mt-1">Request a return, exchange, or report a missing item.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/profile?tab=support')}
                                className="px-6 py-3 bg-[#1A1A1A] text-white rounded-xl text-[13px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 group whitespace-nowrap"
                            >
                                Customer Support <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Summaries */}
                    <div className="lg:col-span-4 space-y-8">

                        <div className="bg-white rounded-xl p-8 border border-gray-50 shadow-[0_8px_30px_rgba(0,0,0,0.03)] h-fit relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFC107]/5 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-700"></div>

                            <h3 className="font-black text-[#1A1A1A] text-[16px] tracking-tight flex items-center gap-3 mb-8">
                                <MapPin size={22} className="text-[#FFC107] stroke-[2.5]" />
                                Delivery Information
                            </h3>

                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em] mb-4">Shipping Address</p>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#999999] shrink-0">
                                            <UserIcon size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black text-[#1A1A1A] text-[16px] leading-tight">{order.user?.name || "Customer"}</p>
                                            <p className="text-[#999999] text-[14px] font-medium mt-2 leading-relaxed">
                                                {order.shipping_address}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em] mb-4 border-t border-gray-50 pt-6">Contact Details</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#999999] shrink-0">
                                            <Phone size={18} />
                                        </div>
                                        <p className="font-black text-[#1A1A1A] text-[15px]">
                                            {addressObj.phone || order.user?.phone || "No Contact Available"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-8 border border-gray-50 shadow-[0_8px_30px_rgba(0,0,0,0.03)] h-fit">
                            <h3 className="font-black text-[#1A1A1A] text-[16px] tracking-tight flex items-center gap-3 mb-8">
                                <CreditCard size={22} className="text-[#FFC107] stroke-[2.5]" />
                                Payment Summary
                            </h3>

                            <div className="mb-10">
                                <p className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em] mb-4">Payment Method</p>
                                <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-6 bg-white rounded border border-gray-100 flex items-center justify-center overflow-hidden">
                                            <span className="text-[8px] font-black text-[#CCCCCC]">
                                                {order.payment_method?.toUpperCase() || 'PAY'}
                                            </span>
                                        </div>
                                        <span className="text-[13px] font-black text-[#1A1A1A] uppercase tracking-wider">
                                            {order.payment_method === 'cod' ? 'Cash on Delivery' :
                                                order.payment_method === 'prepaid' ? 'Paid Online' :
                                                    order.payment_method?.toUpperCase() + ' Payment'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 text-[14px] font-medium pb-8 border-b border-gray-50">
                                <div className="flex justify-between text-[#1A1A1A]">
                                    <span className="font-bold text-[#999999]">Subtotal</span>
                                    <span className="text-[#1A1A1A] font-black tracking-tight">₹{parseFloat(order.subtotal_amount || subtotal).toLocaleString()}</span>
                                </div>
                                {parseFloat(order.discount_amount) > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount Applied</span>
                                        <span className="font-black tracking-tight">-₹{parseFloat(order.discount_amount).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-end mt-8">
                                <span className="text-[16px] font-black text-[#1A1A1A] uppercase tracking-tight">Order Total</span>
                                <span className="text-3xl font-black text-[#1A1A1A] tracking-tighter">₹{orderTotal.toLocaleString()}</span>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Similar Products Section */}
                <div className="mt-32 pt-20 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-[24px] font-black text-[#1A1A1A] tracking-tighter">You Might Also Like</h2>
                            <p className="text-[#999999] text-[15px] font-medium mt-2">Specially curated selections for your bookshelf</p>
                        </div>
                        <Link href="/books" className="text-[13px] font-black uppercase tracking-widest text-[#1A1A1A] hover:text-[#FFC107] transition-colors flex items-center gap-2 group">
                            Explore All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                        {Array.isArray(relatedBooks) && relatedBooks.map((book) => {
                            const thumb = book.thumbnail?.url || (typeof book.thumbnail === 'string' ? (book.thumbnail.startsWith('http') ? book.thumbnail : `${process.env.NEXT_PUBLIC_API_URL}${book.thumbnail}`) : book.image);
                            return (
                                <div key={book.id} className="group">
                                    <div className="relative aspect-[3/4] rounded-lg bg-gray-50 overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-2xl group-hover:shadow-[#FFC107]/5 transition-all duration-500">
                                        <Image
                                            src={thumb || "/placeholder-book.jpg"}
                                            alt={book.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/20 to-transparent">
                                            <button
                                                onClick={() => handleAddToCart(book)}
                                                className="w-full py-3 bg-white text-[#1A1A1A] rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-[#FFC107] transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <Link href={`/books/${book.id}`}>
                                            <h4 className="text-[14px] font-black text-[#1A1A1A] line-clamp-1 hover:text-[#FFC107] transition-colors">{book.title}</h4>
                                        </Link>
                                        <p className="text-[13px] text-[#999999] font-medium mt-1 uppercase tracking-widest text-[10px]">{book.author || "Global Author"}</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-[17px] font-black text-[#1A1A1A]">₹{(parseFloat(book.price) || 0).toLocaleString()}</span>
                                            <div className="flex gap-0.5">
                                                {[...Array(1)].map((_, i) => (
                                                    <Star key={i} size={12} className="fill-[#FFC107] text-[#FFC107]" />
                                                ))}
                                                <span className="text-[11px] font-black text-[#1A1A1A] ml-1">4.8</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CANCEL MODAL */}
                {isCancelModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm" onClick={() => setIsCancelModalOpen(false)}></div>
                        <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
                            <div className="p-8 text-center pb-0">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <XCircle size={32} className="text-red-500" />
                                </div>
                                <h3 className="font-black text-xl text-[#1A1A1A] mb-2">Cancel Order?</h3>
                                <p className="text-[12px] text-gray-400 font-medium leading-relaxed mb-6">Are you sure you want to cancel this order? This action cannot be undone and your items will be returned to stock.</p>
                            </div>

                            <div className="px-8 pb-8 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest pl-1">Reason for Cancellation</label>
                                    <textarea
                                        rows={3}
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-[#1A1A1A] text-sm focus:outline-none focus:border-red-500 transition-all resize-none"
                                        placeholder="Tell us why you're cancelling (e.g., Changed my mind, found a better price)"
                                        required
                                    />
                                    <p className="text-[10px] text-gray-400 italic">Min. 5 characters required</p>
                                </div>

                                <div className="flex gap-3">
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
                    </div>
                )}
                {/* REFUND MODAL */}
                {isRefundModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm" onClick={() => setIsRefundModalOpen(false)}></div>
                        <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
                            <div className="p-8 border-b border-gray-100">
                                <h3 className="font-black text-xl text-[#1A1A1A] flex items-center gap-3">
                                    <RefreshCw className="text-purple-500" /> {String(order.delivery_status || '').toLowerCase() === 'delivered' ? 'Return Order' : 'Request Refund'}
                                </h3>
                                <p className="text-[11px] text-gray-400 font-medium tracking-tight mt-1">Please provide a valid reason for your {String(order.delivery_status || '').toLowerCase() === 'delivered' ? 'return' : 'refund'} request for Order {orderNo}.</p>
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
            </div>
        </div>
    );
}

