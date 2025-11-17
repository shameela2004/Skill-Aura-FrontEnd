// src/pages/chat/ChatList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";

interface User {
  id: string;
  name: string;
  profilePictureUrl?: string;
}

const ChatList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axiosInstance.get("/user");
        console.log(res); 
              const result = res.data.data;
setUsers(result && Array.isArray(result.$values) ? result.$values : []);
   console.log('Array..')
  
      } catch (err) {
        console.error("Error fetching users", err);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Chats</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => navigate(`/chat/${user.id}`)}
            className="cursor-pointer p-3 border rounded mb-2 flex items-center gap-3 hover:bg-gray-100"
          >
            <img
              src={`https://localhost:7027${user.profilePictureUrl}`}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span>{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
