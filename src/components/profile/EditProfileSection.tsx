import React, { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { FiX } from "react-icons/fi";

interface Props {
  user: any;
  onClose: () => void;
  onProfileUpdated: () => void;
}

const EditProfileSection: React.FC<Props> = ({ user, onClose, onProfileUpdated }) => {
  const [form, setForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    profilePictureUrl: user.profilePictureUrl || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axiosInstance.put("/user/me", form);
      onProfileUpdated();
      onClose();
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-inner">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Edit Profile</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <FiX size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-gray-600">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-gray-600">Profile Picture URL</label>
          <input
            type="text"
            name="profilePictureUrl"
            value={form.profilePictureUrl}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditProfileSection;
