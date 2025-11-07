// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../../stores/useAuthStore";
// import axiosInstance from "../../services/axiosInstance";
// import { FiMail, FiUser, FiLock } from "react-icons/fi";

// const Signup: React.FC = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const setUser = useAuthStore((state) => state.setUser);
//   const setToken = useAuthStore((state) => state.setToken); // If you want
//   const navigate = useNavigate();

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const response = await axiosInstance.post('/auth/register', {
//         name,
//         email,
//         password,
//       });

//       console.log("Register response:", response);

//       if ((response.status === 201 || response.status === 200) && response.data.success) {
//         setUser(response.data.data.user);
//         setToken(response.data.data.tokenResponse.token); // If Zustand needs token

//         navigate("/dashboard");
//       } else {
//         setError(response.data.message || "Signup failed");
//       }
//     } catch (err: any) {
//       console.error("Register error:", err);
//       setError(
//         err.response?.data?.message ||
//         err.message ||
//         "Something went wrong"
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         className="bg-white border border-gray-200 shadow-lg rounded-2xl max-w-md w-full p-10 flex flex-col items-center"
//         onSubmit={handleSignup}
//       >
//         <span className="text-indigo-600 text-3xl mb-2 font-bold">SkillAura</span>
//         <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Create Account</h2>
//         <div className="text-gray-500 mb-8 text-center">Join SkillAura and start learning today</div>
//         <div className="w-full flex flex-col gap-4 mb-2">
//           <div className="relative">
//             <FiUser className="absolute top-3 left-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Full Name"
//               className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="relative">
//             <FiMail className="absolute top-3 left-3 text-gray-400" />
//             <input
//               type="email"
//               placeholder="your@email.com"
//               className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="relative">
//             <FiLock className="absolute top-3 left-3 text-gray-400" />
//             <input
//               type="password"
//               placeholder="Create a strong password"
//               className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//         </div>
//         {error && <div className="w-full text-center text-red-500 mb-3 text-sm">{error}</div>}
//         <button className="w-full py-2 rounded-lg bg-indigo-600 text-white text-lg font-bold shadow-sm mb-3 transition hover:bg-indigo-700" type="submit">
//           Create Account
//         </button>
//         <div className="text-gray-600 mt-2 text-sm">
//           Already have an account?{" "}
//           <button
//             className="text-indigo-600 font-semibold underline"
//             onClick={() => navigate("/login")}
//             type="button"
//           >
//             Sign In
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { FiMail, FiUser, FiLock, FiKey } from "react-icons/fi";

const Signup: React.FC = () => {
  const [userId,setUserId]=useState(0);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<"register" | "verify">("register");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // 1. Register User
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await axiosInstance.post('/auth/register', { email, password ,name});
      if (res.status === 201 || res.status === 200) {
        setSuccess("Account created. Please verify your email.");
        setUserId(res.data.data.id);  
        await handleRequestOtp();
        // setStage("verify");
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    }
  };
  // 2. Explicitly call request OTP endpoint
  const handleRequestOtp = async () => {
    try {
      setOtp("");
      const response = await axiosInstance.post('/auth/request-otp', {
        email:email,
        purpose: "Signup"
      });
      if (response.status === 200 || response.status === 201) {
        setSuccess("Check your email for the verification code.");
        setStage("verify");
      } else {
        setError(response.data.message || "Could not send verification code.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    }
  };
  // 2. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      // Assuming you have user id from response or just use email (as most APIs require email+otp)
      const res = await axiosInstance.post('/auth/verify-otp', {
        userId:userId,
        otpCode: otp,
        purpose: "Signup"
      });
      if (res.status === 200 && res.data.success) {
        setSuccess("Email verified! You can now login.");
        setTimeout(() => navigate("/login"), 1800);
      } else {
        setError(res.data.message || "OTP verification failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {/* (Grid svg, same as previous) */}
      </div>
      <div className="relative z-10 bg-white border border-gray-200 shadow-lg rounded-2xl max-w-md w-full p-10 flex flex-col items-center">
        <span className="text-indigo-600 text-3xl mb-2 font-bold">SkillAura</span>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          {stage === "register" ? "Create Account" : "Verify your Email"}
        </h2>
        {stage === "register" && (
          <>
            <form className="w-full flex flex-col gap-4 mb-2" onSubmit={handleSignup}>
              <div className="relative">
                <FiUser className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400"
                  value={username}
                  onChange={e => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <FiMail className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <FiLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">{success}</div>}
              <button type="submit" className="w-full py-2 rounded-lg bg-indigo-600 text-white font-bold">
                Create Account
              </button>
            </form>
          </>
        )}
      {stage === "verify" && (
        <>
          <form className="w-full flex flex-col gap-4 mb-2" onSubmit={handleVerifyOtp}>
            <div className="text-gray-500 mb-1 text-center">
              Enter the OTP sent to your email for verification.
            </div>
            <div className="relative">
              <FiKey className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Enter OTP"
                maxLength={6}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <button type="submit" className="w-full py-2 rounded-lg bg-indigo-600 text-white font-bold">
              Verify Email
            </button>
          </form>
           <div className="mt-3 text-gray-500 text-xs text-center" onClick={handleRequestOtp}>
              Didn't get code? <span className="text-indigo-600 underline cursor-pointer">Resend OTP</span>
            </div>
            </>
        )}
      </div>
    </div>
  );
};

export default Signup;

