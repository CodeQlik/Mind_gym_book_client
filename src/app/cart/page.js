"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCartQuantitySync, removeFromCartSync, clearCartSync, fetchCart, mergeGuestCart } from "@/redux/slices/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react";

export default function CartPage() {
    const { items, totalAmount, totalQuantity } = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(mergeGuestCart());
        }
    }, [token, dispatch]);

    const handleIncrease = (item) => {
        dispatch(updateCartQuantitySync({
            bookId: item.id,
            cartItemId: item.cartItemId,
            quantity: item.quantity + 1
        }));
    };

    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            dispatch(updateCartQuantitySync({
                bookId: item.id,
                cartItemId: item.cartItemId,
                quantity: item.quantity - 1
            }));
        }
    };

    const handleRemove = (item) => {
        dispatch(removeFromCartSync({
            bookId: item.id,
            cartItemId: item.cartItemId
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            <main className="flex-grow pt-28 pb-20 px-4 md:px-12">
                <div className="max-w-6xl mx-auto">
                    {/* Page Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/books" className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all shadow-sm">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-secondary">My Shopping Bag</h1>
                            <p className="text-gray-500 text-sm">{totalQuantity} items in your cart</p>
                        </div>
                    </div>

                    {items.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-black/5 flex flex-col items-center">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                                <ShoppingBag size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary mb-2">Your cart is empty</h2>
                            <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added any books to your collection yet. Start exploring our premium library!</p>
                            <Link href="/books" className="bg-primary text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-secondary transition-all transform hover:-translate-y-1 shadow-lg">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items List */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-black/5 flex items-center gap-4 md:gap-6 hover:shadow-md transition-shadow">
                                        <div className="relative w-20 h-28 md:w-24 md:h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                                            <Image
                                                src={item.coverImage}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-md md:text-lg font-bold text-secondary line-clamp-1 pr-4">{item.title}</h3>
                                                <button
                                                    onClick={() => handleRemove(item)}
                                                    className="text-black-00 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <p className="text-gray-400 text-xs mb-4 uppercase tracking-wider font-bold">{item.author}</p>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center bg-gray-50 rounded-full p-1 border border-black/5">
                                                    <button
                                                        onClick={() => handleDecrease(item)}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-white hover:text-primary transition-all shadow-sm disabled:opacity-30"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-10 text-center font-bold text-secondary">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleIncrease(item)}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-white hover:text-primary transition-all shadow-sm"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <p className="font-black text-primary text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => dispatch(clearCartSync())}
                                    className="text-gray-400 hover:text-secondary text-sm font-bold flex items-center gap-2 mt-4 ml-2 transition-colors"
                                >
                                    <Trash2 size={16} />
                                    Clear Cart
                                </button>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl p-8 shadow-xl border border-black/5">
                                    <h2 className="text-xl font-black text-secondary mb-6 border-b border-gray-100 pb-4">Order Summary</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Subtotal</span>
                                            <span className="font-bold text-secondary">₹{totalAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Shipping</span>
                                            <span className="text-green-500 font-bold">FREE</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Tax</span>
                                            <span className="font-bold text-secondary">₹0.00</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 mb-8">
                                        <div className="flex justify-between items-end">
                                            <span className="text-gray-500 font-bold">Total</span>
                                            <span className="text-3xl font-black text-secondary">₹{totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button className="w-full bg-secondary text-white py-5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-primary transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-3">
                                        <CreditCard size={20} />
                                        Checkout Now
                                    </button>

                                    <div className="mt-6 flex flex-col gap-4">
                                        <p className="text-[10px] text-gray-400 text-center uppercase font-black tracking-widest">Secure Payments Guaranteed</p>
                                        <div className="flex justify-center gap-4 opacity-30 grayscale">
                                            <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={40} height={20} className="h-6 w-auto object-contain" />
                                            <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={40} height={20} className="h-6 w-auto object-contain" />
                                            <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" width={40} height={20} className="h-6 w-auto object-contain" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
