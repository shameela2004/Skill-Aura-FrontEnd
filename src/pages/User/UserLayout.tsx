import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FiAward, FiUsers, FiMessageCircle, FiGrid, FiLogOut, FiUser } from "react-icons/fi";
import { MdGroups } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import CommonModal from "../../components/CommonModal";

export default function UserLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
    const [showModal, setShowModal] = useState(false);


  const handleLogout = async () => {
    try {
      await logout();
       setShowModal(false);
      navigate("/login"); // Redirect to login after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* --- Sidebar --- */}
      <aside className="w-72 bg-white shadow-md border-r border-gray-200 flex flex-col px-4 py-6">
        {/* --- Logo Section --- */}
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-full bg-gradient-to-r from-indigo-400 to-purple-600 p-3 shadow">
            <FiAward size={28} className="text-white" />
          </span>
          <div>
            <div className="font-bold text-lg text-indigo-800">SkillAura</div>
            <div className="text-xs text-gray-400">Learn & Grow</div>
          </div>
        </div>

        {/* --- Navigation --- */}
        <nav className="flex flex-col gap-1 font-semibold">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `py-2 px-4 rounded-xl flex items-center gap-2 mb-3 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow"
                  : "hover:bg-gray-50"
              }`
            }
          >
            <FiGrid /> Home
          </NavLink>
          <NavLink
            to="/mentors"
            className="py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <FiUsers /> Find Mentors
          </NavLink>
          <NavLink
            to="/sessions"
            className="py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <FiAward /> Sessions
          </NavLink>
          <NavLink
            to="/messages"
            className="py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <FiMessageCircle /> Messages
          </NavLink>
          <NavLink
            to="/groups"
            className="py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <MdGroups /> Groups
          </NavLink>
          <NavLink
            to="/me"
            className="py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <FiUser /> Profile
          </NavLink>
          {user?.role === "Learner" && (
    <button
      onClick={() => navigate("/apply-mentor")}
      className="py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-50"
    >
      <FiAward /> Become a Mentor
    </button>
  )}

        </nav>

        <div className="flex-1" />

        {/* --- User Info Section --- */}
        {user ? (
          <div className="mt-6 mb-2 flex items-center gap-3">
            <img
              src={user.profilePictureUrl || "/default-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full border object-cover"
            />
            <div>
              <div className="font-semibold text-base text-gray-800">
                {user.name}
              </div>
              <div className="text-xs text-gray-400">{user.email}</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-400 mt-6">Loading user...</div>
        )}

        {/* --- Logout --- */}
     {/* --- Logout --- */}
<button
  onClick={() => setShowModal(true)}   // ✅ open modal only
  className="w-full py-2 text-xs bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 flex items-center gap-2 justify-center mt-2"
>
  <FiLogOut /> Logout
</button>

{/* --- Logout Confirmation Modal --- */}
<CommonModal
  isOpen={showModal}
  type="confirm"
  title="Logout"
  message="Are you sure you want to logout?"
  confirmText="Logout"
  cancelText="Cancel"
  onConfirm={handleLogout}          // ✅ perform logout here
  onCancel={() => setShowModal(false)} // ✅ close modal
/>

      </aside>

      {/* --- Main Content --- */}
      <div className="flex-1 p-8 max-w-full">
        <Outlet /> {/* Render the child user pages here */}
      </div>

      {/* --- Notification Bell --- */}
      <div className="absolute top-7 right-10 flex items-center gap-2">
        <span className="relative">
          <span className="inline-block p-3 rounded-full bg-gray-100">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-500"
            >
              <path d="M12 19c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2zm0-18c6.627 0 12 5.373 12 12v1c0 2.209-1.791 4-4 4H4c-2.209 0-4-1.791-4-4v-1C0 5.373 5.373 0 12 0z" />
            </svg>
          </span>
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
            5
          </span>
        </span>
      </div>
      
    </div>
    
  );
}
