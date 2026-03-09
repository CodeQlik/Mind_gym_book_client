import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import Cookies from "js-cookie";

// Async thunk for login
export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post("/users/login", credentials);
            return response.data.data;
        } catch (error) {
            // Robust error capture: check for nested message, then top-level, then fallback
            const message = error.response?.data?.message || error.response?.data || error.message || "Something went wrong";
            return rejectWithValue(message);
        }
    }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post("/users/register", userData);
            return response.data.data; // Return the user data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);

// Async thunk to fetch profile
export const fetchProfile = createAsyncThunk(
    "auth/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/users/profile");
            return response.data; // The middleware usually adds .data, check backend response structure
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
        }
    }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await api.post("/users/logout");
            dispatch(logout()); // Clear local state after successful API logout
        } catch (error) {
            dispatch(logout()); // Still clear local state even if API fails
            return rejectWithValue(error.response?.data?.message || "Logout failed");
        }
    }
);

const getInitialData = (key) => {
    if (typeof window === "undefined") return null;

    // Try localStorage first
    const localData = localStorage.getItem(key);
    if (localData && localData !== "undefined") {
        try {
            return key === "user" ? JSON.parse(localData) : localData;
        } catch (e) {
            return null;
        }
    }

    // Fallback to Cookies (check both 'accessToken' and 'token' for legacy)
    const cookieKey = key === "token" ? "accessToken" : key;
    const cookieData = Cookies.get(cookieKey) || Cookies.get("token");
    if (cookieData) {
        try {
            return key === "user" ? JSON.parse(cookieData) : cookieData;
        } catch (e) {
            return cookieData;
        }
    }

    return null;
};

const initialState = {
    user: getInitialData("user"),
    token: getInitialData("token"),
    refreshToken: getInitialData("refreshToken"),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                Cookies.remove("user");
                Cookies.remove("accessToken");
                Cookies.remove("token"); // Cleanup legacy
                Cookies.remove("refreshToken");
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                // Extract user data excluding tokens if they are at top level
                const { token, accessToken, refreshToken, ...userData } = action.payload.user ? action.payload : { ...action.payload };
                const actualUser = action.payload.user || userData;
                // Backend returns 'accessToken'
                const validToken = token || accessToken || state.token;

                state.user = actualUser;
                state.token = validToken;
                state.refreshToken = action.payload.refreshToken || state.refreshToken;

                // Persist to local storage & Cookies
                if (typeof window !== "undefined") {
                    const userString = JSON.stringify(actualUser);
                    localStorage.setItem("user", userString);

                    if (validToken) {
                        localStorage.setItem("token", validToken);
                        Cookies.set("accessToken", validToken, { expires: 7 });
                    }

                    if (action.payload.refreshToken) {
                        localStorage.setItem("refreshToken", action.payload.refreshToken);
                        Cookies.set("refreshToken", action.payload.refreshToken, { expires: 7 });
                    }

                    Cookies.set("user", userString, { expires: 7 });
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Registration
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;

                if (action.payload && typeof window !== "undefined") {
                    const userData = JSON.stringify(action.payload);
                    localStorage.setItem("user", userData);
                    if (action.payload.token) {
                        localStorage.setItem("token", action.payload.token);
                        Cookies.set("accessToken", action.payload.token, { expires: 7 });
                    }

                    Cookies.set("user", userData, { expires: 7 });

                    if (action.payload.refreshToken) {
                        localStorage.setItem("refreshToken", action.payload.refreshToken);
                        Cookies.set("refreshToken", action.payload.refreshToken, { expires: 7 });
                    }
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Profile
            .addCase(fetchProfile.fulfilled, (state, action) => {
                // Backend might wrap data in 'data' field
                const userData = action.payload.data || action.payload;
                state.user = userData;
                if (typeof window !== "undefined") {
                    localStorage.setItem("user", JSON.stringify(userData));
                    Cookies.set("user", JSON.stringify(userData), { expires: 7 });
                }
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
