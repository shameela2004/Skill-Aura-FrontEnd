import React, { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import EditProfileSection from "./EditProfileSection";
import {  FaLocationDot } from "react-icons/fa6";

interface Props {
  user: any;
  onProfileUpdated: () => void;
}

const ProfileHeader: React.FC<Props> = ({ user, onProfileUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 sm:p-8 transition-all">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <img
            src={user.profilePictureUrl || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover"
          />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-red-600 text-sm capitalize">{user.role}</p>
            <p className="text-gray-500 mt-1 flex items-center gap-1"><FaLocationDot/>{user.location}</p>
            <p className="text-gray-500 mt-1">{user.bio || "No bio yet."}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-sm"
        >
          <FiEdit3 /> Edit Profile
        </button>
      </div>

      {/* Show edit section */}
      {isEditing && (
        <EditProfileSection
  user={user}
  onProfileUpdated={() => {
    setIsEditing(false);
    onProfileUpdated();
  }}
  onClose={() => setIsEditing(false)}
/>

      )}
    </div>
  );
};

export default ProfileHeader;
