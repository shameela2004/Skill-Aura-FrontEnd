import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import MembersTab from "../../components/group/MemberTab";
import SessionsTab from "../../components/group/SessionsTab";
import GroupChatTab from "../../components/group/GroupChatTab";

// Group DTO, adapt as needed for fields
type GroupDto = {
  id: number;
  name: string;
  skillId: number;
  mentorId: number;
  maxMembers: number;
   memberCount: number; 
};

type GroupSummary = GroupDto; // For side list

const TAB_LIST = ["Chat", "Members", "Sessions", "Files"] as const;
type TabType = typeof TAB_LIST[number];

export default function GroupDetails() {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<GroupDto | null>(null);
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<TabType>("Chat");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
  async function fetchMemberCount() {
    try {
      const res = await axiosInstance.get(`/Group/${id}/members`);
      const members = res.data?.data?.$values || [];
      setMemberCount(members.length);
    } catch {
      setMemberCount(0);
    }
  }
  if (id) fetchMemberCount();
}, [id]);
  useEffect(() => {
    async function fetchGroups() {
      try {
        // Fetch all user's groups for sidebar; adapt endpoint if needed!
        const resSide = await axiosInstance.get("/Group/my-groups");
        setGroups(resSide.data?.data?.$values || []);
      } catch {}
    }
    async function fetchGroup() {
      try {
        const res = await axiosInstance.get(`/group/${id}`);
        console.log(id);
        setGroup(res.data?.data || null);
        console.log(group)
      } catch {
        setGroup(null);
        console.log("nooooo")
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
    fetchGroup();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 p-0 relative flex">
      {/* SVG grid background (like login) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e3ea" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Sidebar: Groups List (sticky for navigation) */}
      <aside className="relative z-10 w-72 bg-white border-r border-gray-200 shadow-lg p-4 flex flex-col">
        <span className="font-bold text-indigo-600 text-xl mb-4">Your Groups</span>
        <div className="flex flex-col gap-2">
          {groups.map((g) => (
            <button
              key={g.id}
              className={`w-full text-left rounded-lg p-3 transition ${
                g.id === Number(id)
                  ? "bg-indigo-50 border border-indigo-600 text-indigo-700"
                  : "hover:bg-gray-50 text-gray-700 border"
              }`}
              onClick={() => navigate(`/groups/${g.id}`)}
            >
              <div className="font-semibold">{g.name}</div>
              <div className="text-xs text-gray-500 mt-1">{g.maxMembers} members</div>
<span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
  {memberCount} members
</span>
            </button>
            
          ))}
        </div>
      </aside>

      {/* Details Card: Main Content */}
      <main className="relative z-10 flex-1 px-10 py-10 flex">
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading group details...</div>
          ) : !group ? (
            <div className="text-center py-10 text-red-500">Group not found or error.</div>
          ) : (
            <>
              {/* Top Area: Group Info */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <span className="text-2xl font-bold text-gray-900">{group.name}</span>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-indigo-100 text-indigo-500 px-2 py-1 rounded text-xs">{`Skill: ${group.skillId}`}</span>
                    <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">{`Max: ${group.maxMembers}`}</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
  Members: {memberCount} 
</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(-1)}
                  className="mt-6 md:mt-0 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-semibold hover:bg-indigo-100 border border-indigo-100 transition"
                >
                  Back
                </button>
              </div>
              {/* TAB HEADERS */}
              <div className="flex gap-8 border-b mb-3">
                {TAB_LIST.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-1 text-lg font-semibold transition ${
                      activeTab === tab
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {/* TAB CONTENT */}
              <div className="mt-6 min-h-[250px]">
                {activeTab === "Chat" && (
                  <GroupChatTab groupId={group.id} userId={Number(user?.id)} />
                )}
                {activeTab === "Members" && (
                  <MembersTab groupId={group.id} isMentorOrAdmin={Number(user?.id) === group.mentorId || user?.role === "Admin"} />

                )}
                {activeTab === "Sessions" && (
                  <SessionsTab groupId={group.id} isMentor={Number(user?.id) === group.mentorId} userId={Number(user?.id)}  />
                )}
                {activeTab === "Files" && (
                  <div className="text-gray-500 mb-3">Files module not implemented yet.</div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
