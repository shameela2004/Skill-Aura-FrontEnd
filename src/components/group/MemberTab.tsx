import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";

// UserDto based on your API response
type UserDto = {
  id: number; // ensure backend gives this field!
  name: string;
  profilePictureUrl?: string | null;
  role: string;
};
// GroupMemberDto based on your group member response
type GroupMemberDto = {
  groupId: number;
  userId: number;
  userName: string;
  profilePictureUrl?: string | null;
  role: string;
};

export default function MembersTab({ groupId, isMentorOrAdmin }: { groupId: number, isMentorOrAdmin: boolean }) {
  const [members, setMembers] = useState<GroupMemberDto[]>([]);
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    async function fetchMembers() {
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

  async function fetchActiveUsers() {
    // Your endpoint, assuming all are active
    const res = await axiosInstance.get(`/user`);
    // If only certain users have isActive, filter here
    setAllUsers(res.data?.data?.$values || []);
  }

  async function handleAddMember(userId: number) {
    setAddError("");
    try {
      await axiosInstance.post(`/Group/${groupId}/members`, { userId });
      setShowAddModal(false);
      // Refresh members
      const res = await axiosInstance.get(`/Group/${groupId}/members`);
      setMembers(res.data?.data?.$values || []);
    } catch (err: any) {
      setAddError(err.response?.data?.message || "Failed to add member.");
    }
  }

  // Filter only users not in current group
  const possibleMembers = allUsers.filter(
    (u) => !members.some((m) => m.userId === u.id)
  );

  async function handleRemoveMember(userId: number) {
    try {
      await axiosInstance.delete(`/Group/${groupId}/members/${userId}`);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch {}
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-lg text-gray-700">Members</span>
        {isMentorOrAdmin && (
          <button
            onClick={() => {
              fetchActiveUsers();
              setShowAddModal(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Add Member
          </button>
        )}
      </div>

      {/* Add Member Modal */}
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
            {addError && (
              <div className="text-red-500 text-sm mb-2">{addError}</div>
            )}
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
                            src={usr.profilePictureUrl}
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

      {/* Members Table */}
      {addError && <div className="text-red-500 text-sm mb-2">{addError}</div>}
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
            {members.map((m) => (
              <tr key={m.userId} className="border-b last:border-b-0">
                <td className="px-4 py-3">
                  {m.profilePictureUrl && (
                    <img
                      src={m.profilePictureUrl}
                      alt=""
                      className="w-7 h-7 rounded-full border bg-gray-100 object-cover"
                    />
                  )}
                </td>
                <td className="px-4 py-3">{m.userName}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      m.role === "Admin"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {m.role}
                  </span>
                </td>
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
