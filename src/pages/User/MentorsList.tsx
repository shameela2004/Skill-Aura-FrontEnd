import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

interface Skill {
  id: number;
  name: string;
}

interface MentorCard {
  id: number;
  name: string;
  mentorProfilePictureUrl: string;
  location: string;
  bio?: string;
  userId:number,
//   rating: number;
  skills: Skill[]; // should also be array of objects as shown for skills
  badges?: string[];
  isAvailable?: boolean;
}

export default function MentorsList() {
  const [mentors, setMentors] = useState<MentorCard[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/skill").then((res) => {
      // If API response as sent: { data: { $values: [...] } }
      setSkills(res.data.data.$values);
    });
  }, []);

//   useEffect(() => {
//     axiosInstance.post("/mentor/search", {
//       skills: selectedSkill ? [selectedSkill.name] : [],
//       searchTerm
//     }).then((res) => setMentors(res.data.data.$values));
//   }, [selectedSkill, searchTerm]);
useEffect(() => {
  const body = {
    skills: selectedSkill ? [selectedSkill.name] : [],
    location,       // Or bind this to a state/filter
    searchTerm, 
    pageNumber: 1,      // Optional: add pagination later
    pageSize: 12        // Adjust how many mentors show per page
  };
  axiosInstance.post("/mentor/search", body)
    .then((res) => setMentors(res.data.data.$values))
    .catch((err) => {
      console.error(err.response?.data?.message || err.message);
    });
}, [selectedSkill, searchTerm,location]);


  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e3ea" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Content */}
      <div className="relative z-10 py-8 px-4 max-w-7xl mx-auto">
        <span className="text-indigo-600 text-3xl font-bold mb-6 block">SkillAura</span>
        <h2 className="text-2xl font-extrabold mb-6">Find Mentors</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {skills.map(skill => (
            <button
              key={skill.id}
              className={`px-4 py-2 rounded-full border ${selectedSkill?.id === skill.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
              onClick={() => setSelectedSkill(skill)}
            >
              {skill.name}
            </button>
          ))}
          <button
            className="px-4 py-2 rounded-full border bg-gray-100 text-gray-600"
            onClick={() => setSelectedSkill(null)}
          >
            All Skills
          </button>
        </div>
        <input
          type="text"
          placeholder="Search mentors, skills, location..."
          className="w-full mb-6 px-4 py-2 rounded-lg bg-gray-100 border border-gray-200"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <input
  type="text"
  placeholder="Filter by location..."
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  className="w-full mb-6 px-4 py-2 rounded-lg bg-gray-100 border border-gray-200"
/>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         {mentors.map(mentor => (
  <div key={mentor.userId} className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center relative">
    <img src={`https://localhost:7027${mentor.mentorProfilePictureUrl}`|| "/default-avatar.png"} alt="Profile" className="w-16 h-16 rounded-full mb-2 object-cover" />
    <div className="text-lg font-bold">{mentor.name ?? "Unknown"}</div>
    <div className="text-sm text-gray-500 mb-1">{mentor.location ?? ""}</div>
    {/* Skills and Badges are probably no44t directly present, show only if available*/}
    {mentor.skills && (
      <div className="flex flex-wrap gap-1 mb-2">
        {mentor.skills.map((skill: any) => (
          <span key={skill.id} className="px-2 py-1 bg-gray-100 rounded-full text-xs">{skill.name}</span>
        ))}
      </div>
    )}
    {mentor.badges && (
      <div className="flex flex-wrap gap-1 mb-2">
        {mentor.badges.map((badge: string) => (
          <span key={badge} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">{badge}</span>
        ))}
      </div>
    )}
    <button
      className="mt-3 px-4 py-2 rounded bg-indigo-600 text-white font-bold"
      onClick={() => navigate(`/mentors/${mentor.userId}`)}
    >
      View Profile
    </button>
  </div>
))}

        </div>
      </div>
    </div>
  );
}
