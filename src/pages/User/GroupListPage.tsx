// src/pages/GroupsList.tsx
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";

// GroupDto type, adapt if you need more fields
type GroupDto = {
  id: number;
  name: string;
  skillId: number;
  maxMembers: number;
  mentorId: number;
  // ...any additional fields
};

export default function GroupsList() {
  const [groups, setGroups] = useState<GroupDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Assuming mentor check via user.role
  const navigate = useNavigate();

useEffect(() => {
  async function fetchGroups() {
    try {
      const res = await axiosInstance.get("/Group/my-groups");
      // If the backend attaches $values inside data
      setGroups(res.data?.data?.$values || []);
    } catch (err) {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }
  fetchGroups();
}, []);


  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* SVG grid for bg */}
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e3ea" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <span className="text-indigo-600 font-bold text-2xl">Learning Groups</span>
          {user?.role === "Mentor" && (
            <button
              onClick={() => navigate("/groups/create")}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
            >
              Create Group
            </button>
          )}
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading groups...</div>
        ) : groups.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No groups found.</div>
        ) : (
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl shadow border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/groups/${group.id}`)}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-bold text-lg text-gray-900">{group.name}</span>
                  <span className="bg-indigo-100 text-indigo-500 px-2 py-1 rounded text-xs">{`Skill: ${group.skillId}`}</span>
                </div>
                <div className="text-gray-600 text-sm">Max Members: {group.maxMembers}</div>
                {/* Add member count when available, or add group badges/tags */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
