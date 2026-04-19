import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

const Axios = axios.create({
    baseURL: `${API_URL}/`,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

Axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("AppID");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Catch 401 errors globally
Axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // if (error.response && error.response.status === 401) {
        //     const errorMessage = error.response.data.message;
        //     if (errorMessage === "Token Unauthorized") {
        //         localStorage.removeItem("AppID");
        //         window.location.href = process.env.NODE_ENV === "production" ? "http://localhost:5173/login" : "http://localhost:5173/login";
        //     }
        // }

        return Promise.reject(error);
    }
);

export default Axios;