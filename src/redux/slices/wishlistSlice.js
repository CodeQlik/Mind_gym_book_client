import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { toast } from "react-toastify";

const initialState = {
    items: [], // Array of book objects
    totalQuantity: 0,
    loading: false,
    error: null
};

// Async thunk to fetch wishlist from backend
export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlist",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (!auth.token) return [];

            const response = await api.get("/book/bookmark/all");
            if (response.data.success) {
                const data = response.data.data || [];
                // Extract the book object from each bookmark record
                return Array.isArray(data) ? data.map(item => item.book).filter(b => b) : [];
            }
            return [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
        }
    }
);

// Async thunk to toggle wishlist sync
export const toggleWishlistSync = createAsyncThunk(
    "wishlist/toggleSync",
    async (bookId, { getState, dispatch, rejectWithValue }) => {
        const { auth } = getState();

        if (!auth.token) {
            toast.error("Please login to manage wishlist");
            return rejectWithValue("Authentication required");
        }

        try {
            const response = await api.post("/book/bookmark/toggle", { book_id: bookId });
            if (response.data.success) {
                // Determine if it was added or removed from response if possible, 
                // or just refetch to be sure. Refetching is safer.
                dispatch(fetchWishlist());
                return bookId;
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to update wishlist";
            toast.error(errorMsg);
            return rejectWithValue(errorMsg);
        }
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        clearWishlist(state) {
            state.items = [];
            state.totalQuantity = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.totalQuantity = action.payload.length;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addMatcher(
                (action) => action.type === "auth/logout",
                (state) => {
                    state.items = [];
                    state.totalQuantity = 0;
                    state.error = null;
                }
            );
    }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
