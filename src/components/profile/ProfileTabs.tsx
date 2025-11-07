import React, { useState } from "react";
import SkillsSection from "./SKillSection";
import LanguagesSection from "./LanguagesSection";
import PostsSection from "./PostsSection";
import MentorAvailabilitySection from "./AvailabilitySection";
import ConnectionsSection from "./ConnectionsSection";


interface Props {
  user: any;
}

// const tabs = ["Skills", "Languages", "Posts", "Availability", "Badges"];
const tabs = ["Skills", "Languages", "Posts", "Availability"];

const ProfileTabs: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState("Skills");

  return (
    <div>
      <div className="flex justify-around bg-white/[0.05] rounded-xl border border-white/10 overflow-hidden mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center font-semibold transition ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
       <ConnectionsSection />

      {activeTab === "Skills" && <SkillsSection user={user} />}
      {activeTab === "Languages" && <LanguagesSection user={user} />}
        {activeTab === "Posts" && <PostsSection user={user} />}
      {/* {activeTab === "Availability" && user.mentorAvailabilities && (
        <MentorAvailabilitySection user={user} /> */}
      {/* {activeTab === "Badges" && <BadgesSection user={user} />} */}
    </div>
  );
};

export default ProfileTabs;
