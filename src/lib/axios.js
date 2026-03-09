import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    // Important: Calling the live backend directly from the browser throws "Network Error" (CORS).
    // So for client-side requests, we call our Next.js /proxy/api/v1 which is configured in next.config.ts
    // to forward the request to the live backend URL from your .env file.
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
    // Check 'accessToken' first (new), then 'token' (legacy), then localStorage
    const token = Cookies.get("accessToken") || Cookies.get("token") || (typeof window !== "undefined" && localStorage.getItem("token"));
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear local storage and cookies on 401
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("refreshToken");
                Cookies.remove("token");
                Cookies.remove("user");
                Cookies.remove("refreshToken");

                // Optional: Redirect to login or reload
                // window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
