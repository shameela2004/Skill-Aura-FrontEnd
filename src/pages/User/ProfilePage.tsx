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

  if (!user) return <div className="text-center mt-20 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#101017] text-white relative overflow-hidden">
      {/* background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#28293e" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* gradient glow */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 opacity-40 blur-[100px] bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600 w-[500px] h-[500px] rounded-full"></div>

      {/* content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <ProfileHeader user={user} 
         onProfileUpdated={() => {
window.location.reload();  
}}/>
        <div className="mt-10">
          <ProfileTabs user={user} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
