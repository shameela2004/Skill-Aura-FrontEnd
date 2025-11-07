import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-x-hidden">
      {/* Minimal grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e3ea" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Login card */}
      <form
        className="relative z-10 bg-white border border-gray-200 shadow-lg rounded-2xl max-w-md w-full p-10 flex flex-col items-center"
        onSubmit={handleLogin}
      >
        <span className="text-indigo-600 text-3xl mb-2 font-bold">SkillAura</span>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome Back!</h2>
        <div className="text-gray-500 mb-8 text-center">Sign in to continue your learning journey</div>
        <div className="w-full flex flex-col gap-4 mb-2">
          <div className="relative">
            <FiMail className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <FiLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="w-full text-right text-xs mb-4">
        <button
  className="text-indigo-600 underline hover:text-indigo-700"
  type="button"
  onClick={() => navigate("/forgot-password")}
>
  Forgot Password?
</button>

        </div>
        {error && <div className="w-full text-center text-red-500 mb-3 text-sm">{error}</div>}
        <button
          className="w-full py-2 rounded-lg bg-indigo-600 text-white text-lg font-bold shadow-sm mb-3 transition hover:bg-indigo-700"
          type="submit"
        >
          Sign In
        </button>
        <div className="text-gray-600 mt-2 text-sm">
          Don&apos;t have an account?{" "}
          <button
            className="text-indigo-600 font-semibold underline"
            onClick={() => navigate("/signup")}
            type="button"
          >
            Sign up for free
          </button>
        </div>
      </form>
    </div>
  );
};

