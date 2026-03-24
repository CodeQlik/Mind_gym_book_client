"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { clearCartSync } from "@/redux/slices/cartSlice";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { 
    ArrowLeft, 
    MapPin, 
    CreditCard, 
    Banknote, 
    CheckCircle2, 
    Plus, 
    Home, 
    Briefcase, 
    Map 
} from "lucide-react";

function CheckoutPage() {
    const { items, totalAmount, totalQuantity } = useSelector((state) => state.cart);
    const { token, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' or 'prepaid'
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Coupon States
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);

    // Order Preview State (includes shipping, taxes, etc. from backend)
    const [orderPreview, setOrderPreview] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    
    const [newAddress, setNewAddress] = useState({
        name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        addresstype: "home",
        is_default: false
    });

    useEffect(() => {
        if (!token) {
            toast.error("Please login to proceed with checkout.");
            router.push("/login?redirect=/checkout");
            return;
        }
        if (items.length === 0) {
            router.push("/cart");
            return;
        }
        fetchAddresses(true); // Initial fetch
    }, [token, items, router]);

    // Removed auto-fill of user details to keep name and phone fields empty as requested
    useEffect(() => {
        if (user && !newAddress.name) {
            // No longer auto-filling name and phone from user
        }
    }, [user]);

    // Handle Coupon from URL
    useEffect(() => {
        const couponFromUrl = searchParams.get("coupon");
        if (couponFromUrl && totalAmount > 0) {
            validateCoupon(couponFromUrl);
        }
    }, [searchParams, totalAmount]);

    const validateCoupon = async (code) => {
        setCouponLoading(true);
        try {
            const res = await api.post("/coupons/validate", {
                code: code,
                amount: totalAmount
            });
            if (res.data?.success) {
                setAppliedCoupon(res.data.data);
            }
        } catch (error) {
            console.error("Coupon validation failed", error);
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    // Fetch Order Preview (Shipping, Tax, Total) from Backend
    useEffect(() => {
        const fetchOrderPreview = async () => {
            if (!token || items.length === 0) return;
            
            setPreviewLoading(true);
            try {
                const res = await api.post("/orders/preview", {
                    address_id: selectedAddressId ? parseInt(selectedAddressId) : null,
                    payment_method: paymentMethod,
                    coupon_code: appliedCoupon ? appliedCoupon.code : null
                });

                if (res.data?.success) {
                    setOrderPreview(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch order preview:", error);
            } finally {
                setPreviewLoading(false);
            }
        };

        const timer = setTimeout(fetchOrderPreview, 500); // Debounce
        return () => clearTimeout(timer);
    }, [selectedAddressId, paymentMethod, appliedCoupon, items, token]);

    let computedSubtotal = 0;
    let computedTax = 0;

    items.forEach((item) => {
        const unitPrice = parseFloat(item.price) || 0;
        const taxRate = parseFloat(item.tax_rate) || 0;
        const taxType = item.tax_type || "none";
        const isTaxApplicable = item.tax_applicable === true || item.tax_applicable === 1 || item.tax_applicable === "1" || item.tax_applicable === "true";

        let basePrice, taxAmountPerUnit;

        const effectiveTaxApplicable = isTaxApplicable || taxRate > 0;
        const effectiveTaxType = (taxType === "none" && taxRate > 0) ? "exclusive" : taxType;

        if (!effectiveTaxApplicable || effectiveTaxType === "none" || taxRate === 0) {
            basePrice = unitPrice;
            taxAmountPerUnit = 0;
        } else if (effectiveTaxType === "exclusive") {
            basePrice = unitPrice;
            taxAmountPerUnit = (unitPrice * taxRate) / 100;
        } else if (effectiveTaxType === "inclusive") {
            basePrice = unitPrice / (1 + taxRate / 100);
            taxAmountPerUnit = unitPrice - basePrice;
        }

        computedSubtotal += basePrice * item.quantity;
        computedTax += taxAmountPerUnit * item.quantity;
    });

    const computedTotalAmount = computedSubtotal + computedTax;
    
    // Final values driven by orderPreview (backend) with local fallback
    const displaySubtotal = orderPreview ? parseFloat(orderPreview.subtotal_amount) : computedSubtotal;
    const displayTax = orderPreview ? parseFloat(orderPreview.total_tax) : computedTax;
    const displayShipping = orderPreview ? parseFloat(orderPreview.shipping_charge) : 0;
    const displayDiscount = orderPreview ? parseFloat(orderPreview.discount_amount) : (appliedCoupon ? appliedCoupon.discount_amount : 0);
    const displayTotal = orderPreview ? parseFloat(orderPreview.total_amount) : (appliedCoupon ? (appliedCoupon.total_amount || computedTotalAmount - appliedCoupon.discount_amount) : computedTotalAmount);

    const taxLabel = "Tax";

    const fetchAddresses = async (isInitial = false) => {
        try {
            const res = await api.get("/user/addresses/my-addresses");
            if (res.data?.success) {
                const fetchedAddresses = res.data.data || [];
                setAddresses(fetchedAddresses);
                
                if (fetchedAddresses.length > 0) {
                    const defaultAddr = fetchedAddresses.find(a => a.is_default);
                    if (defaultAddr) {
                        setSelectedAddressId(defaultAddr.id);
                    } else if (!selectedAddressId) {
                        setSelectedAddressId(fetchedAddresses[0].id);
                    }
                    setIsAddingAddress(false);
                } else if (isInitial) {
                    setIsAddingAddress(true);
                }
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast.error("Failed to load your addresses");
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await api.post("/user/addresses/add", newAddress);
            if (res.data?.success) {
                toast.success("Address added successfully!");
                
                // 1. Close the form mode immediately
                setIsAddingAddress(false);

                // 2. Clear the form data
                const resetData = {
                    name: "", 
                    phone: "", 
                    address_line1: "", 
                    address_line2: "",
                    city: "", state: "", pincode: "", country: "India", addresstype: "home", is_default: false
                };
                setNewAddress(resetData);

                // 3. Refresh the actual list from server
                await fetchAddresses(); 
                
                // 4. Select the newly added address from the response
                if (res.data.data?.id) {
                    setSelectedAddressId(res.data.data.id);
                }
            }
        } catch (error) {
            console.error("Error adding address:", error);
            toast.error(error.response?.data?.message || "Failed to add address");
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.error("Please select or add a delivery address.");
            return;
        }

        try {
            setLoading(true);

            // 1. Create the base order from the cart
            const orderRes = await api.post("/orders/checkout", {
                address_id: parseInt(selectedAddressId),
                payment_method: paymentMethod,
                coupon_code: appliedCoupon ? appliedCoupon.code : null
            });

            const responseBody = orderRes.data;
            const resData = responseBody?.data;
            
            console.log("--- ORDER DEBUG ---");
            console.log("Full Response:", responseBody);

            // 2. Handle Payment Flow
            if (paymentMethod === "cod") {
                const orderId = resData?.id;
                if (!orderId) throw new Error("COD Order ID missing in response");
                
                // Confirm COD payment record
                await api.post("/payment/confirm-cod", { order_id: orderId });
                finishOrderSuccess();
            } else if (paymentMethod === "prepaid") {
                // For prepaid, the backend returns Razorpay order details directly in resData
                const rzpOrder = resData?.razorpay_order;
                
                if (!rzpOrder) {
                    console.error("Razorpay order details missing:", resData);
                    throw new Error("Payment initialization failed. Server did not return payment details.");
                }

                // Load Razorpay step
                const isLoaded = await loadRazorpayScript();
                if (!isLoaded) {
                    toast.error("Razorpay SDK failed to load. Are you online?");
                    setLoading(false);
                    return;
                }

                // Open Razorpay Popup
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_S43PsmGCoBeV8c", // Fallback for dev
                    amount: rzpOrder.amount,
                    currency: rzpOrder.currency,
                    name: "Mind Gym Book",
                    description: "Book Purchase",
                    order_id: rzpOrder.id, // Razorpay order ID
                    handler: async function (response) {
                        try {
                            // Verify payment in backend
                            const verifyRes = await api.post("/payment/verify", {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });

                            if (verifyRes.data?.success) {
                                finishOrderSuccess();
                            } else {
                                toast.error("Payment verification failed.");
                            }
                        } catch (err) {
                            console.error("Verification failed", err);
                            toast.error("Payment verification failed");
                        }
                    },
                    prefill: {
                        name: addresses.find(a => a.id === selectedAddressId)?.name || user?.name || "Customer",
                        email: user?.email || "customer@domain.com",
                        contact: addresses.find(a => a.id === selectedAddressId)?.phone || user?.phone || "9999999999"
                    },
                    theme: {
                        color: "#FFC107"
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.on("payment.failed", function (response) {
                    toast.error(response.error.description);
                });
                paymentObject.open();
                setLoading(false); // Enable button once popup opens
            }
        } catch (error) {
            console.error("Order process error:", error);
            if (error.response) {
                console.error("Backend Error Data:", error.response.data);
            }
            const errorMessage = error.response?.data?.message || error.message || "Failed to place order.";
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    const finishOrderSuccess = () => {
        toast.success("Order placed successfully!");
        dispatch(clearCartSync());
        // Delay redirect slightly
        setTimeout(() => {
            router.push("/books"); // You can redirect to an orders page instead if you have one
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-['Inter',sans-serif]">
            <main className="flex-grow pt-28 pb-20 px-4 md:px-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/cart" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#1A1A1A] hover:bg-black hover:text-white transition-all shadow-sm">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-[#1A1A1A]">Secure Checkout</h1>
                            <p className="text-[#666666] text-sm">Almost there! Complete your order.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Column: Shipping & Payment */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Shipping Address Section */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-2 h-full bg-[#1A1A1A]"></div>
                                <h2 className="text-xl font-black text-[#1A1A1A] mb-6 flex items-center gap-3">
                                    <MapPin size={22} className="text-[#FFC107]" />
                                    Shipping Address
                                </h2>

                                {isAddingAddress ? (
                                    <form onSubmit={handleAddAddress} className="space-y-4 animate-in fade-in duration-300" autoComplete="off">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[13px] font-bold text-[#1A1A1A] mb-1">Full Name</label>
                                                <input type="text" required value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black" placeholder="John Doe"/>
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-bold text-[#1A1A1A] mb-1">Phone Number</label>
                                                <input type="tel" required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black" placeholder="9876543210"/>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-[13px] font-bold text-[#1A1A1A] mb-1">Address Line 1</label>
                                                <input type="text" required value={newAddress.address_line1} onChange={e => setNewAddress({...newAddress, address_line1: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black" placeholder="House/Flat No, Building Name, Street"/>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-[13px] font-bold text-[#1A1A1A] mb-1">Address Line 2 (Optional)</label>
                                                <input type="text" value={newAddress.address_line2} onChange={e => setNewAddress({...newAddress, address_line2: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black" placeholder="Landmark or Area mapping"/>
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-bold text-[#1A1A1A] mb-1">City</label>
                                                <input type="text" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black" placeholder="Mumbai"/>
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-bold text-[#1A1A1A] mb-1">State</label>
                                                <input type="text" required value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black" placeholder="Maharashtra"/>
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-bold text-[#1A1A1A] mb-1">Pincode</label>
                                                <input type="text" required value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black" placeholder="400001"/>
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-bold text-[#1A1A1A] mb-1">Type</label>
                                                <select value={newAddress.addresstype} onChange={e => setNewAddress({...newAddress, addresstype: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black bg-white">
                                                    <option value="home">Home</option>
                                                    <option value="work">Work</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 mt-6">
                                            <button type="button" onClick={() => addresses.length > 0 && setIsAddingAddress(false)} className="flex-1 py-3.5 border border-gray-200 text-[#1A1A1A] font-bold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                                            <button type="submit" disabled={loading} className="flex-1 py-3.5 bg-[#FFC107] text-[#1A1A1A] font-bold rounded-xl hover:bg-black hover:text-white transition-colors disabled:opacity-50">Save & Use Address</button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {addresses.map((addr) => (
                                                <div 
                                                    key={addr.id}
                                                    onClick={() => setSelectedAddressId(addr.id)}
                                                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${
                                                        selectedAddressId === addr.id 
                                                        ? "border-[#1A1A1A] bg-[#FFF8E7] shadow-sm uppercase"
                                                        : "border-[#1A1A1A] hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            {addr.addresstype === 'home' ? <Home size={14} className="text-[#1A1A1A]"/> : <Briefcase size={14} className="text-[#1A1A1A]"/>}
                                                            <span className="text-[11px] font-black uppercase tracking-wider text-[#1A1A1A]">{addr.addresstype}</span>
                                                        </div>
                                                        {selectedAddressId === addr.id && <CheckCircle2 size={18} className="text-[#1A1A1A] fill-[#FFC107]" />}
                                                    </div>
                                                    <h3 className="font-bold text-[#1A1A1A] mb-1">{addr.name}</h3>
                                                    <p className="text-[#1A1A1A] text-[13px] leading-relaxed mb-2">
                                                        {addr.address_line1}, {addr.address_line2 && `${addr.address_line2}, `}
                                                        {addr.city}, {addr.state} - {addr.pincode}
                                                    </p>
                                                    <p className="text-[#1A1A1A] text-[13px] font-medium font-mono">📱 {addr.phone}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => setIsAddingAddress(true)}
                                            className="mt-6 text-[13px] font-bold text-[#1A1A1A] flex items-center gap-2 hover:text-[#FFC107] transition-colors"
                                        >
                                            <Plus size={16} /> Add a New Address
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Payment Method Section */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-2 h-full bg-[#FFC107]"></div>
                                <h2 className="text-xl font-black text-[#1A1A1A] mb-6 flex items-center gap-3">
                                    <CreditCard size={22} className="text-[#1A1A1A]" />
                                    Payment Method
                                </h2>

                                <div className="space-y-4">
                                    <label 
                                        className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                                            paymentMethod === 'cod' 
                                            ? "border-[#1A1A1A] bg-gray-50"
                                            : "border-gray-100 hover:border-gray-200"
                                        }`}
                                    >
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="cod" 
                                            checked={paymentMethod === 'cod'} 
                                            onChange={() => setPaymentMethod('cod')}
                                            className="w-5 h-5 accent-[#1A1A1A] text-[#1A1A1A]"
                                        />
                                        <div className="ml-4 flex-grow">
                                            <h4 className="font-bold text-[#1A1A1A] flex items-center gap-2">
                                                <Banknote size={16}/> Cash on Delivery
                                            </h4>
                                            <p className="text-[#666666] text-[13px] mt-1">Pay with cash when your book arrives.</p>
                                        </div>
                                    </label>

                                    <label 
                                        className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                                            paymentMethod === 'prepaid' 
                                            ? "border-[#1A1A1A] bg-gray-50"
                                            : "border-gray-100 hover:border-gray-200"
                                        }`}
                                    >
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="prepaid" 
                                            checked={paymentMethod === 'prepaid'} 
                                            onChange={() => setPaymentMethod('prepaid')}
                                            className="w-5 h-5 accent-[#1A1A1A] text-[#1A1A1A]"
                                        />
                                        <div className="ml-4 flex-grow">
                                            <h4 className="font-bold text-[#1A1A1A] flex items-center gap-2">
                                                <CreditCard size={16}/> Online Payment
                                            </h4>
                                            <p className="text-[#666666] text-[13px] mt-1">Pay instantly via UPI, Credit/Debit Card, or Netbanking.</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#FFF8E7] rounded-3xl p-8 border border-[#FFC107]/20 shadow-sm sticky top-32">
                                <h2 className="text-xl font-black text-[#1A1A1A] mb-6 border-b border-[#FFC107]/20 pb-4">Order Summary</h2>

                                {/* Compact Items List */}
                                <div className="space-y-4 mb-6 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-14 h-20 rounded-md overflow-hidden shrink-0 border border-gray-200">
                                                <Image src={item.coverImage} fill className="object-cover" alt={item.title}/>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-[13px] font-bold text-[#1A1A1A] line-clamp-2 leading-snug">{item.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-[12px] text-[#888888] font-medium">Qty: {item.quantity}</p>
                                                    {parseFloat(item.tax_rate) > 0 && (
                                                        <span className="px-1.5 py-0.5 bg-[#FFC107]/20 text-[#1A1A1A] rounded text-[9px] font-bold">
                                                            {parseFloat(item.tax_rate)}% Tax
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[14px] font-black text-[#1A1A1A] mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 mb-6 border-t border-[#FFC107]/20 pt-4">
                                    <div className="flex justify-between text-[#666666] text-sm font-medium">
                                        <span>Subtotal ({totalQuantity} items)</span>
                                        <span className="font-bold text-[#1A1A1A]">₹{displaySubtotal.toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between text-[#666666] text-sm font-medium">
                                        <span>{taxLabel}</span>
                                        <span className="font-bold text-[#1A1A1A]">₹{displayTax.toFixed(2)}</span>
                                    </div>

                                    {displayDiscount > 0 && (
                                        <div className="flex justify-between text-emerald-600 text-sm font-bold animate-in slide-in-from-right-2">
                                            <div className="flex items-center gap-1">
                                                <span>Coupon Discount</span>
                                                <span className="text-[9px] bg-emerald-100 px-1.5 py-0.5 rounded uppercase">{appliedCoupon?.code}</span>
                                            </div>
                                            <span>- ₹{displayDiscount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-[#666666] text-sm font-medium">
                                        <span>Shipping</span>
                                        {displayShipping > 0 ? (
                                            <span className="font-bold text-[#1A1A1A]">₹{displayShipping.toFixed(2)}</span>
                                        ) : (
                                            <span className="font-bold text-green-600">FREE</span>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-[#FFC107]/20 pt-4 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[#666666] font-bold uppercase tracking-wider text-sm">Total to Pay</span>
                                        <div className="text-right">
                                            {previewLoading && <span className="text-[10px] text-[#FFC107] animate-pulse block">Calculating...</span>}
                                            <span className={`text-3xl font-black text-[#1A1A1A] ${previewLoading ? 'opacity-50' : ''}`}>₹{displayTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handlePlaceOrder}
                                    disabled={loading || items.length === 0}
                                    className="w-full bg-[#1A1A1A] text-white py-5 rounded-full font-black uppercase tracking-widest text-[13px] hover:bg-[#FFC107] hover:text-[#1A1A1A] transition-all transform hover:-translate-y-1 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] disabled:opacity-50 disabled:hover:bg-[#1A1A1A] disabled:hover:text-white disabled:hover:translate-y-0"
                                >
                                    {loading ? "Processing..." : (paymentMethod === "prepaid" ? "Pay & Complete Order" : "Place Order")}
                                </button>
                                
                                <p className="text-[11px] font-bold text-[#888888] text-center mt-5">By placing the order, you agree to our Terms & Conditions.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

const CheckoutWrapper = () => (
    <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#FFC107]/20 border-t-[#FFC107] rounded-full animate-spin"></div>
        </div>
    }>
        <CheckoutPage />
    </Suspense>
);

export default CheckoutWrapper;
