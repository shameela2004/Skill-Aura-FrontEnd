import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../services/axiosInstance";

type UserDto = {
  id: number;
  name: string;
  profilePictureUrl?: string | null;
  role: string;
};

type GroupMemberDto = {
  groupId: number;
  userId: number;
  userName: string;
  profilePictureUrl?: string | null;
  role: string;
};

export default function MembersTab({ groupId, isMentorOrAdmin }: { groupId: number; isMentorOrAdmin: boolean }) {
  const [members, setMembers] = useState<GroupMemberDto[]>([]);
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [addError, setAddError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/Group/${groupId}/members`);
        setMembers(res.data?.data?.$values || []);
      } catch {
        setMembers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, [groupId]);

  async function fetchAllUsers() {
    try {
      const res = await axiosInstance.get("/user");
      setAllUsers(res.data?.data?.$values || []);
    } catch {
      setAllUsers([]);
    }
  }

  async function handleAddMember(userId: number) {
    setAddError("");
    try {
      await axiosInstance.post(`/Group/${groupId}/members`, { userId });
      setShowAddModal(false);
      // Reload members after adding
      const res = await axiosInstance.get(`/Group/${groupId}/members`);
      setMembers(res.data?.data?.$values || []);
    } catch (err: any) {
      setAddError(err.response?.data?.message || "Failed to add member.");
    }
  }

  async function handleRemoveMember(userId: number) {
    try {
      await axiosInstance.delete(`/Group/${groupId}/members/${userId}`);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch {
      // Handle error silently or show a message
    }
  }

  // Build a map from userId to full user info for profile pictures & names
  const userMap = useMemo(() => {
    const map: Record<number, UserDto> = {};
    allUsers.forEach((u) => {
      map[u.id] = u;
    });
    return map;
  }, [allUsers]);

  // User list for add modal filtered by not in group members
  const possibleMembers = allUsers.filter((u) => !members.some((m) => m.userId === u.id));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-lg text-gray-700">Members</span>
        {isMentorOrAdmin && (
          <button
            onClick={() => {
              fetchAllUsers();
              setShowAddModal(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Add Member
          </button>
        )}
      </div>

      {showAddModal && (
        <div className="fixed z-20 inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-lg relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <div className="text-lg font-semibold mb-4">Add user to group</div>
            {addError && <div className="text-red-500 text-sm mb-2">{addError}</div>}
            <table className="w-full border rounded-xl shadow-sm">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Role</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {possibleMembers.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3" colSpan={3}>
                      No users available to add.
                    </td>
                  </tr>
                ) : (
                  possibleMembers.map((usr) => (
                    <tr key={usr.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 flex items-center gap-2">
                        {usr.profilePictureUrl && (
                          <img
                            src={`https://localhost:7027${usr.profilePictureUrl}`}
                            alt=""
                            className="w-7 h-7 rounded-full border bg-gray-100 object-cover"
                          />
                        )}
                        {usr.name}
                      </td>
                      <td className="px-4 py-3">{usr.role}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleAddMember(usr.id)}
                          className="text-indigo-600 hover:underline text-sm px-3 py-1"
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading members...</div>
      ) : (
        <table className="w-full border rounded-xl shadow-sm">
          <thead className="bg-indigo-50">
            <tr>
              <th className="text-left px-4 py-2 font-semibold text-gray-600">Profile</th>
              <th className="text-left px-4 py-2 font-semibold text-gray-600">Name</th>
              <th className="text-left px-4 py-2 font-semibold text-gray-600">Role</th>
              {isMentorOrAdmin && <th className="text-left px-4 py-2"></th>}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              // const user = userMap[m.userId];
              return (
                <tr key={m.userId} className="border-b last:border-b-0">
                  <td className="px-4 py-3">
                    {m?.profilePictureUrl ? (
                      <img
                        src={`https://localhost:7027${m.profilePictureUrl}`}
                        alt={m.userName}
                        className="w-10 h-10 rounded-full border object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-200" />
                    )}
                  </td>
                  <td className="px-4 py-3">{m?.userName ?? m.userName}</td>
                  <td className="px-4 py-3">{m.role}</td>
                  {isMentorOrAdmin && (
                    <td className="px-4 py-3">
                      {m.role !== "Admin" && (
                        <button
                          onClick={() => handleRemoveMember(m.userId)}
                          className="text-red-500 hover:underline text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
