import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function NotAuthorizedPage() {
  const { user } = useAuth();

  const isMentorApplied = user?.mentorStatus === "Pending" || user?.mentorStatus === "Approved";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-indigo-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg text-center">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">🚫 Access Denied</h1>
        <p className="text-gray-700 mb-6">
          {user
            ? "You need to be an approved mentor to access this page."
            : "You need to be logged in to access this page."}
        </p>

        {/* If user is logged in but not yet applied */}
        {user && !isMentorApplied && (
          <Link
            to="/become-mentor"
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Apply to Become a Mentor
          </Link>
        )}

        {/* If user has applied but pending */}
        {user?.mentorStatus === "Pending" && (
          <p className="text-yellow-600 font-semibold mt-4">
            ⏳ Your mentor application is under review.
          </p>
        )}

        {/* If user is completely unauthorized / not logged in */}
        {!user && (
          <Link
            to="/login"
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Login to Apply
          </Link>
        )}
      </div>
    </div>
  );
}
