import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import ProfileTabs from "../../components/profile/ProfileTabs";
import ProfileHeader from "../../components/profile/ProfileHeader";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user/me");
        setUser(res.data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchUser();
  }, []);

  if (!user)
    return (
      <div className="text-center mt-20 text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 relative overflow-hidden">
      {/* Optional faint grid pattern for subtle modern touch */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Optional top-side blur accent (light indigo) */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 opacity-20 blur-[100px] bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-200 w-[420px] h-[420px] rounded-full"></div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <ProfileHeader
          user={user}
          onProfileUpdated={async() => {
           const response = await axiosInstance.get("/user/me");
  const updatedUser = response.data.data;
  
  localStorage.setItem("user", JSON.stringify(updatedUser));
  setUser(updatedUser); 
            
          }}
        />
        <div className="mt-10">
          <ProfileTabs user={user} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
