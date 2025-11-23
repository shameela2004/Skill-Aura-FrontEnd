import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

interface UserListItem {
  id: string;
  name: string;
  role: string;
  profilePictureUrl?: string;
}

export default function UserList() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axiosInstance.get("/user");
        setUsers(res.data.data?.$values ?? res.data.data ?? []);
      } catch {
        setUsers([]);
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  // Optional: Filter for search
  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <input
        type="search"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full rounded border px-3 py-2"
      />
      {loading ? (
        <p>Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="space-y-3">
          {filteredUsers.map((user) => (
            <li key={user.id} className="flex items-center gap-3 border p-3 rounded hover:bg-gray-50 transition">
              <img
                src={user.profilePictureUrl ? `https://localhost:7027${user.profilePictureUrl}` : "/default-avatar.png"}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <Link to={`/users/${user.id}`} className="font-semibold text-indigo-600 hover:underline">
                  {user.name}
                </Link>
                <div className="text-sm text-gray-500">{user.role}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
