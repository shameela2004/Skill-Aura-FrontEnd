import React, { useState } from "react";
import { FiMail, FiKey, FiLock } from "react-icons/fi";

const ForgotPassword: React.FC = () => {
  const [stage, setStage] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Fetch logic to send OTP to email
    try {
      // Replace with your endpoint
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email}),
      });
      const data = await res.json();
      if (res.ok) {
        setStage("otp");
        setSuccess("OTP sent to your email.");
      } else {
        setError(data.message || "Error sending OTP.");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      // Replace with your endpoint
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset successful! You can now sign in.");
      } else {
        setError(data.message || "Incorrect OTP or error resetting password");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-x-hidden">
      {/* Minimal grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e3ea" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid2)" />
        </svg>
      </div>
      <div className="relative z-10 bg-white border border-gray-200 shadow-lg rounded-2xl max-w-md w-full p-10 flex flex-col items-center">
        <span className="text-indigo-600 text-3xl mb-2 font-bold">SkillAura</span>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Forgot Password</h2>
        {stage === "email" && (
          <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-5 mt-3">
            <div className="text-gray-500 text-base mb-1">Enter your registered email to receive an OTP.</div>
            <div className="relative">
              <FiMail className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 w-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-indigo-600 text-sm">{success}</div>}
            <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">
              Send OTP
            </button>
          </form>
        )}
        {stage === "otp" && (
          <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-5 mt-3">
            <div className="text-gray-500 text-base mb-1">Enter the OTP sent to <span className="font-medium text-indigo-600">{email}</span> and set a new password.</div>
            <div className="relative">
              <FiKey className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                required
                maxLength={6}
                placeholder="Enter OTP"
                className="pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 w-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="relative">
              <FiLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type="password"
                required
                placeholder="New password"
                className="pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 w-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-indigo-600 text-sm">{success}</div>}
            <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
