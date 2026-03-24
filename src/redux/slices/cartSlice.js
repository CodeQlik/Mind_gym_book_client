import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { toast } from "react-toastify";

const loadCartFromStorage = () => {
    if (typeof window === "undefined") return null;
    try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            return JSON.parse(savedCart);
        }
    } catch (err) {
        console.error("Failed to load cart from storage", err);
    }
    return null;
};

const saveCartToStorage = (state) => {
    if (typeof window === "undefined") return;
    try {
        const cartToSave = {
            items: state.items,
            totalAmount: state.totalAmount,
            totalQuantity: state.totalQuantity
        };
        localStorage.setItem("cart", JSON.stringify(cartToSave));
    } catch (err) {
        console.error("Failed to save cart to storage", err);
    }
};

const persistedState = loadCartFromStorage();

const initialState = persistedState ? {
    ...persistedState,
    lastAddedItem: null,
    loading: false
} : {
    items: [], // [{ id (book_id), cartItemId, title, price, quantity, coverImage, author }]
    totalAmount: 0,
    totalQuantity: 0,
    lastAddedItem: null,
    loading: false
};

// Async thunk to fetch cart from backend
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (!auth.token) return [];

            const response = await api.get("/cart");
            if (response.data.success) {
                // Map backend structure to frontend structure
                return (response.data.data || []).map(item => ({
                    id: item.book_id,
                    cartItemId: item.id,
                    title: item.title,
                    price: parseFloat(item.price || 0),
                    quantity: item.quantity,
                    coverImage: item.thumbnail?.url || item.thumbnail || "/placeholder-book.jpg",
                    author: item.author || "Global Author",
                    tax_applicable: item.tax_applicable,
                    tax_type: item.tax_type,
                    tax_rate: parseFloat(item.tax_rate || 0),
                }));
            }
            return [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
        }
    }
);

// Async thunk to sync with backend if user is logged in
export const syncAddToCart = createAsyncThunk(
    "cart/syncAdd",
    async (bookData, { getState, dispatch, rejectWithValue }) => {
        const { auth } = getState();

        // Always update local state for immediate feedback
        dispatch(cartSlice.actions.addToCart(bookData));

        if (auth.token) {
            try {
                const response = await api.post("/cart/add", {
                    book_id: bookData.id,
                    quantity: 1
                });
                if (response.data.success) {
                    toast.success("Added to database cart!");
                }
                // Refetch to get correct cartItemIds from backend
                dispatch(fetchCart());
            } catch (error) {
                const errorMsg = error.response?.data?.message || "DB sync failed";
                toast.error(`DB Sync Error: ${errorMsg}`);
                console.error("Backend cart sync failed:", error);
            }
        }
        return bookData;
    }
);

// Async thunk to update quantity
export const updateCartQuantitySync = createAsyncThunk(
    "cart/updateQuantity",
    async ({ bookId, cartItemId, quantity }, { getState, dispatch }) => {
        const { auth } = getState();

        // Update local first
        dispatch(cartSlice.actions.updateLocalQuantity({ bookId, quantity }));

        if (auth.token && cartItemId) {
            try {
                await api.put(`/cart/update/${cartItemId}`, { quantity });
            } catch (error) {
                console.error("Backend quantity update failed:", error);
            }
        }
    }
);

// Async thunk to remove item
export const removeFromCartSync = createAsyncThunk(
    "cart/removeItem",
    async ({ bookId, cartItemId }, { getState, dispatch }) => {
        const { auth } = getState();

        // Remove local first
        dispatch(cartSlice.actions.removeItemFromCart(bookId));

        if (auth.token && cartItemId) {
            try {
                await api.delete(`/cart/remove/${cartItemId}`);
            } catch (error) {
                console.error("Backend item removal failed:", error);
            }
        }
    }
);

// Async thunk to merge guest cart into DB after login
export const mergeGuestCart = createAsyncThunk(
    "cart/mergeGuest",
    async (_, { getState, dispatch }) => {
        const { auth, cart } = getState();

        if (!auth.token) return;

        // If no guest items, just fetch the existing cart from DB
        if (cart.items.length === 0) {
            dispatch(fetchCart());
            return;
        }

        // If there are guest items, merge them first
        let mergedCount = 0;
        let failedItems = [];

        for (const item of cart.items) {
            if (!item.cartItemId) {
                try {
                    await api.post("/cart/add", {
                        book_id: item.id,
                        quantity: item.quantity
                    });
                    mergedCount++;
                } catch (error) {
                    console.error(`Failed to merge item ${item.id}:`, error);
                    failedItems.push(item);
                }
            }
        }

        if (mergedCount > 0) {
            toast.success(`${mergedCount} guest items saved to your account!`);
        }
        
        if (failedItems.length > 0) {
            console.warn(`${failedItems.length} items failed to sync with DB.`);
        }

        // Finally, fetch the consolidated cart from the database
        dispatch(fetchCart());
    }
);

// Async thunk to clear cart
export const clearCartSync = createAsyncThunk(
    "cart/clearCart",
    async (_, { getState, dispatch }) => {
        const { auth } = getState();

        // Clear local first
        dispatch(cartSlice.actions.clearCart());

        if (auth.token) {
            try {
                await api.delete("/cart/clear");
            } catch (error) {
                console.error("Backend clear cart failed:", error);
            }
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);
            state.totalQuantity++;
            state.lastAddedItem = newItem;
            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    cartItemId: newItem.cartItemId || null,
                    title: newItem.title,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                    coverImage: newItem.coverImage,
                    author: newItem.author,
                    tax_applicable: newItem.tax_applicable,
                    tax_type: newItem.tax_type,
                    tax_rate: parseFloat(newItem.tax_rate || 0),
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.totalPrice + newItem.price;
            }
            state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
            saveCartToStorage(state);
        },
        updateLocalQuantity(state, action) {
            const { bookId, quantity } = action.payload;
            const item = state.items.find(i => i.id === bookId);
            if (item) {
                const diff = quantity - item.quantity;
                item.quantity = quantity;
                item.totalPrice = item.price * quantity;
                state.totalQuantity += diff;
                state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
                saveCartToStorage(state);
            }
        },
        removeItemFromCart(state, action) {
            const id = action.payload; // bookId
            const existingItem = state.items.find((item) => item.id === id);
            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.items = state.items.filter((item) => item.id !== id);
                state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
                saveCartToStorage(state);
            }
        },
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            saveCartToStorage(state);
        },
        clearLastAddedItem(state) {
            state.lastAddedItem = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.totalQuantity = action.payload.reduce((total, item) => total + item.quantity, 0);
                state.totalAmount = action.payload.reduce((total, item) => total + (item.price * item.quantity), 0);
                saveCartToStorage(state);
            })
            .addCase(fetchCart.rejected, (state) => {
                state.loading = false;
            })
            // Fetch cart automatically when user logs in or registers
            .addMatcher(
                (action) => action.type === "auth/login/fulfilled" || action.type === "auth/register/fulfilled" || action.type === "auth/fetchProfile/fulfilled",
                (state, action) => {
                    // This will be handled by Header/CartPage dispatches, but we could also 
                    // trigger it here if fetchCart were an action creator.
                    // Instead, we just ensure items are cleared on logout if needed.
                }
            )
            .addMatcher(
                (action) => action.type === "auth/logout",
                (state) => {
                    state.items = [];
                    state.totalQuantity = 0;
                    state.totalAmount = 0;
                    state.lastAddedItem = null;
                    saveCartToStorage(state);
                }
            );
    }
});

export const { clearLastAddedItem } = cartSlice.actions;

export default cartSlice.reducer;
