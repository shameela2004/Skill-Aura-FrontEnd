// import React, { createContext, useState, useContext, type ReactNode, useEffect,  } from "react";
// import axiosInstance from "../services/axiosInstance";

// export interface UserType {
//   id: string;
//   name: string;
//   email: string;
//   profilePictureUrl: string;
//   role: string;
//   mentorStatus ?: string | null
//   phoneNumber?: string;
//   aadhaarImageUrl?: string;
//   socialProfileUrl?: string;
// }

// interface AuthContextType {
//   user: UserType | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshToken: () => Promise<void>;
//   applyForMentor: (data: {
//     phoneNumber: string;
//     aadhaarImageUrl?: string;
//     socialProfileUrl?: string;
//   }) => Promise<void>;
//   fetchMentorStatus: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<UserType | null>(null);

//   const login = async (email: string, password: string) => {
//     const response = await axiosInstance.post("/auth/login", { email, password });
//     if (response.data.success) {
//       setUser(response.data.data.user);
//       localStorage.setItem("user", JSON.stringify(user));
//     } else {
//       throw new Error(response.data.message || "Login failed");
//     }
//   };

//   const logout = async () => {
//     await axiosInstance.post("/auth/logout");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   const refreshToken = async () => {
//     const response = await axiosInstance.post("/auth/refresh");
//     if (response.data.success) {
//       setUser(response.data.data.user);
//     } else {
//       setUser(null);
//       throw new Error("Refresh token failed");
//     }
//   };

//   const applyForMentor = async (data: {
//     phoneNumber: string;
//     aadhaarImageUrl?: string;
//     socialProfileUrl?: string;
//   }) => {
//     const response = await axiosInstance.post("/mentor/apply-mentor", data);
//     if (response.data.success) {
//       // update mentor status locally
//       setUser((prev) => (prev ? { ...prev, mentorStatus: "Pending" } : prev));
//     } else {
//       throw new Error(response.data.message || "Mentor application failed");
//     }
//   };

//   const fetchMentorStatus = async () => {
//     const response = await axiosInstance.get("/mentor/mentor-status");
//     if (response.data.success) {
//       setUser((prev) =>
//         prev ? { ...prev, mentorStatus: response.data.data } : prev
//       );
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//         refreshToken,
//         applyForMentor,
//         fetchMentorStatus,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };
import React, { createContext, useState, useContext, type ReactNode, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

export interface UserType {
  id: number;
  name: string;
  email: string;
  profilePictureUrl: string;
  role: string;
  mentorStatus?: string | null;
  phoneNumber?: string;
  aadhaarImageUrl?: string;
  socialProfileUrl?: string;
}

interface AuthContextType {
  user: UserType | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  applyForMentor: (data: {
    phoneNumber: string;
    aadhaarImageUrl?: string;
    socialProfileUrl?: string;
  }) => Promise<void>;
  fetchMentorStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(() => {
    // Load user from localStorage on initial render
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Keep localStorage in sync
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (email: string, password: string) => {
    const response = await axiosInstance.post("/auth/login", { email, password });
    if (response.data.success) {
      const loggedInUser = response.data.data.user;
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  };

  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    setUser(null);
    localStorage.removeItem("user");
  };

  const refreshToken = async () => {
    try {
      const response = await axiosInstance.post("/auth/refresh");
      if (response.data.success) {
        setUser(response.data.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null); // fail silently if no token
    }
  };

  const applyForMentor = async (data: {
    phoneNumber: string;
    aadhaarImageUrl?: string;
    socialProfileUrl?: string;
  }) => {
    const response = await axiosInstance.post("/mentor/apply-mentor", data);
    if (response.data.success) {
      setUser((prev) => (prev ? { ...prev, mentorStatus: "Pending" } : prev));
    } else {
      throw new Error(response.data.message || "Mentor application failed");
    }
  };

  const fetchMentorStatus = async () => {
    try {
      const response = await axiosInstance.get("/mentor/mentor-status");
      if (response.data.success) {
        setUser((prev) =>
          prev ? { ...prev, mentorStatus: response.data.data } : prev
        );
      }
    } catch {
      // optional: silently fail
    }
  };

  // Optional: automatically refresh token on mount if user is not loaded
  useEffect(() => {
    if (!user) {
      refreshToken();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshToken,
        applyForMentor,
        fetchMentorStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
