import React from "react";
import { FiUsers, FiAward, FiClock, FiTrendingUp } from "react-icons/fi";
import { MdCalendarToday } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const dashboardStats = [
  {
    label: "Skills Learning",
    value: 3,
    icon: <FiUsers size={28} />,
    className: "bg-gradient-to-br from-indigo-400 to-purple-400 text-white",
  },
  {
    label: "Sessions Done",
    value: 24,
    icon: <MdCalendarToday size={28} />,
    className: "bg-gradient-to-br from-green-400 to-teal-400 text-white",
  },
  {
    label: "Learning Time",
    value: "48h",
    icon: <FiClock size={28} />,
    className: "bg-gradient-to-br from-orange-400 to-red-400 text-white",
  },
  {
    label: "Current Streak",
    value: "7 days",
    icon: <FiTrendingUp size={28} />,
    className: "bg-gradient-to-br from-yellow-400 to-orange-400 text-white",
  },
];

const recentActivity = [
  {
    desc: "Completed Python session with Michael Chen",
    since: "2 hours ago",
    color: "text-blue-500",
  },
  {
    desc: "Earned Gold Mentor badge",
    since: "1 day ago",
    color: "text-yellow-600",
  },
  {
    desc: "Joined UI/UX Designers group",
    since: "2 days ago",
    color: "text-teal-500",
  },
];

// -----
export default function UserDashboard() {
    const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
    
      {/* Main content */}
      <div className="flex-1 p-8">
        {/* Welcome Row */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold flex items-center gap-2">Welcome back! <span className="text-2xl">👋</span></h1>
          <div className="text-gray-500 font-medium">Continue your learning journey</div>
        </div>
        {/* Stats Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((s, idx) => (
            <div key={idx} className={`rounded-2xl shadow ${s.className} px-6 py-4 flex flex-col items-start relative`}>
              <div className="absolute top-4 right-6 opacity-40">{s.icon}</div>
              <div className="font-bold text-2xl mb-1">{s.value}</div>
              <div className="text-base font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
        {/* Main Row: Next Session + Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Next Session */}
          <div className="col-span-1 bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
            <div className="text-lg font-semibold mb-2">Next Session</div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Mentor"
                className="w-10 h-10 rounded-full border" />
              <div>
                <div className="font-semibold">React Development</div>
                <div className="text-sm text-gray-400">with Sarah Johnson</div>
                <div className="text-xs text-gray-400">Today • 2:00 PM</div>
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              <button className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-4 py-2 font-bold rounded-lg">
                Join Now
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 font-bold rounded-lg border hover:bg-gray-200">
                View Details
              </button>
            </div>
          </div>
          {/* Recent Activity */}
          <div className="col-span-2 bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold">Recent Activity</div>
              <button className="text-xs text-blue-500 font-bold">View All</button>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              {recentActivity.map((a, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <FaHandshake className={`${a.color}`} size={20} />
                  <div>
                    <div className="text-sm font-semibold">{a.desc}</div>
                    <div className="text-xs text-gray-400">{a.since}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Notification bell */}
      <div className="absolute top-7 right-10 flex items-center gap-2">
        <span className="relative">
          <span className="inline-block p-3 rounded-full bg-gray-100">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
              <path d="M12 19c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2zm0-18c6.627 0 12 5.373 12 12v1c0 2.209-1.791 4-4 4H4c-2.209 0-4-1.791-4-4v-1C0 5.373 5.373 0 12 0z"/>
            </svg>
          </span>
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">5</span>
        </span>
      </div>
    </div>
  );
}
