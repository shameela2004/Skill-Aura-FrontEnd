

// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://localhost:7027/api",
//   withCredentials: true,
// });

// // Add response interceptor:
// axiosInstance.interceptors.response.use(
//   res => res,
//   async error => {
//     const origReq = error.config;

//     // Prevent infinite loop and only handle 401 once
//     if (error.response && error.response.status === 401 && !origReq._retry) {
//       origReq._retry = true;
//       try {
//         await axiosInstance.post("/auth/refresh");
//         // After refreshing, retry the original request
//         return axiosInstance(origReq);
//       } catch (refreshErr) {
//         // If refresh fails, redirect to login or handle logout
//         localStorage.removeItem("user");
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;




import axios, { AxiosError, type AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7027/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const origReq = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response && error.response.status === 401 && !origReq._retry) {
      origReq._retry = true;
      if (origReq?.url?.includes("/hubs/")) {
      return Promise.reject(error);
    }

      try {
        await axiosInstance.post("/auth/refresh");
        return axiosInstance(origReq);
      } catch (refreshErr) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
