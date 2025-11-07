// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'https://localhost:7027/api', // Replace with your backend base URL
//   withCredentials: true, // Ensures cookies are sent with every request
// });

// export default axiosInstance;



import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7027/api",
  withCredentials: true,
});

// Add response interceptor:
axiosInstance.interceptors.response.use(
  res => res,
  async error => {
    const origReq = error.config;

    // Prevent infinite loop and only handle 401 once
    if (error.response && error.response.status === 401 && !origReq._retry) {
      origReq._retry = true;
      try {
        await axiosInstance.post("/auth/refresh-token");
        // After refreshing, retry the original request
        return axiosInstance(origReq);
      } catch (refreshErr) {
        // If refresh fails, redirect to login or handle logout
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
