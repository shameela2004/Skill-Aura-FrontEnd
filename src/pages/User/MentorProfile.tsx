// import React, { useState, useEffect } from "react";
// import axiosInstance from "../../services/axiosInstance";
// import { getId } from "../../components/Utils/GetId";

// export default function MentorProfile({ profile }: { profile: any }) {
//   const {
//     skillsToLearn = [],
//     skillsToTeach = [],
//     mentorAvailabilities = [],
//     badges = [],
//     languages = [],
//     name,
//     bio,
//     location,
//     profilePictureUrl,
//   } = profile;

//   const [skillInput, setSkillInput] = useState("");
//   const [newDay, setNewDay] = useState("");
//   const [newStart, setNewStart] = useState("");
//   const [newEnd, setNewEnd] = useState("");
//   const [refreshSkills, setRefreshSkills] = useState(false);
//   const [refreshAvail, setRefreshAvail] = useState(false);

//   useEffect(() => {
//     if (refreshSkills) {
//       axiosInstance.get("/user/me").then(res => {
//         // Assuming profile is updated outside this component;
//         setRefreshSkills(false);
//       });
//     }
//   }, [refreshSkills]);

//   useEffect(() => {
//     if (refreshAvail) {
//       axiosInstance.get("/user/me").then(res => {
//         setRefreshAvail(false);
//       });
//     }
//   }, [refreshAvail]);

//   async function handleAddSkill(type: string) {
//     if (!skillInput.trim()) return;
//     await axiosInstance.post("/skill/user/", { name: skillInput.trim(), type });
//     setSkillInput("");
//     setRefreshSkills(true);
//   }
//   async function handleRemoveSkill(skill: any) {
//     const id = getId(skill);
//     if (!id) return;
//     await axiosInstance.delete(`/skill/user/${id}`);
//     setRefreshSkills(true);
//   }
//   async function handleAddAvailability() {
//     if (!newDay || !newStart || !newEnd) return;
//     await axiosInstance.post("/mentor/add", [{ day: newDay, startTime: newStart, endTime: newEnd }]);
//     setNewDay(""); setNewStart(""); setNewEnd("");
//     setRefreshAvail(true);
//   }
//   async function handleDeleteAvailability(avail: any) {
//     const id = getId(avail);
//     if (!id) return;
//     await axiosInstance.delete(`/mentor/delete/${id}`);
//     setRefreshAvail(true);
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 max-w-5xl mx-auto p-6">
//       <div className="bg-white rounded-2xl shadow px-8 py-7 flex items-center gap-8 mb-6">
//         <img src={profilePictureUrl ?? "/defaultprofile.png"} alt="Profile"
//           className="w-24 h-24 rounded-full object-cover border-2 border-indigo-200" />
//         <div>
//           <div className="text-lg font-semibold text-gray-800">Full Name</div>
//           <div className="text-2xl font-bold text-gray-900">{name}</div>

//           <div className="mt-3 mb-1 text-lg font-semibold text-gray-800">Bio</div>
//           <div className="bg-gray-100 rounded px-3 py-2">{bio || <span className="text-gray-400">No bio provided</span>}</div>

//           <div className="mt-3 mb-1 text-lg font-semibold text-gray-800">Location</div>
//           <div className="bg-gray-100 rounded px-3 py-2 flex items-center gap-2">
//             <span className="material-icons text-indigo-500">location_on</span>
//             {location || <span className="text-gray-400">No location set</span>}
//           </div>
//         </div>

//       </div>

//       {/* Skills to Learn */}
//       <section className="mb-6">
//         <h2 className="text-xl font-bold mb-2 text-indigo-800">Skills to Learn</h2>
//         <div className="flex flex-wrap gap-2 mb-4">
//           {skillsToLearn.length ? skillsToLearn.map(s => (
//             <span key={getId(s)} className="bg-gray-100 border px-3 py-1 rounded-2xl text-indigo-700 font-medium flex items-center gap-2">
//               {s.skillName ?? s.name}
//               <button className="text-red-400 font-bold ml-1" onClick={() => handleRemoveSkill(s)}>×</button>
//             </span>
//           )) : <span className="text-gray-400">None</span>}
//         </div>
//         <div className="flex items-center gap-2 mb-6">
//           <input type="text" placeholder="Add a skill..." className="flex-1 pl-3 py-2 rounded-lg bg-gray-100 border border-gray-200 shadow-inner" value={skillInput} onChange={e => setSkillInput(e.target.value)} />
//           <button className="bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 font-bold" onClick={() => handleAddSkill("Learning")}>+</button>
//         </div>

//         {/* Skills to Teach */}
//         <h2 className="text-xl font-bold mb-2 text-purple-700">Skills to Teach</h2>
//         <div className="flex flex-wrap gap-2 mb-4">
//           {skillsToTeach.length ? skillsToTeach.map(s => (
//             <span key={getId(s)} className="bg-purple-500 text-white px-3 py-1 rounded-2xl font-medium flex items-center gap-2">
//               {s.skillName ?? s.name}
//               <button className="text-white font-extrabold ml-1" onClick={() => handleRemoveSkill(s)}>×</button>
//             </span>
//           )) : <span className="text-gray-400">None</span>}
//         </div>
//         <div className="flex items-center gap-2 mb-6">
//           <input type="text" placeholder="Add a skill to teach..." className="flex-1 pl-3 py-2 rounded-lg bg-gray-100 border border-gray-200 shadow-inner" value={skillInput} onChange={e => setSkillInput(e.target.value)} />
//           <button className="bg-purple-600 hover:bg-purple-800 text-white rounded-lg px-4 py-2 font-bold" onClick={() => handleAddSkill("Teaching")}>+</button>
//         </div>
//       </section>

//       {/* Mentor Availabilities */}
//       <section className="mb-6">
//         <h2 className="text-xl font-bold mb-2 text-indigo-600">Mentor Availabilities</h2>
//         <div className="flex flex-col gap-3 mb-4">
//           {mentorAvailabilities.length ? mentorAvailabilities.map(a => (
//             <div key={getId(a)} className="bg-indigo-100 border border-indigo-200 rounded-lg p-3 flex flex-col md:flex-row md:items-center gap-4">
//               <span className="font-semibold text-indigo-800">{a.day}</span>
//               <span className="text-gray-700">{a.startTime} - {a.endTime}</span>
//               <button className="ml-auto text-red-600 px-2 py-1 rounded hover:bg-red-200" onClick={() => handleDeleteAvailability(a)}>Delete</button>
//             </div>
//           )) : <span className="text-gray-400">No availabilities set.</span>}
//         </div>
//         <div className="flex items-center gap-2">
//           <input type="text" placeholder="Day (e.g. Monday)" value={newDay} onChange={e => setNewDay(e.target.value)} className="px-3 py-2 border rounded" />
//           <input type="time" placeholder="Start Time" value={newStart} onChange={e => setNewStart(e.target.value)} className="px-3 py-2 border rounded" />
//           <input type="time" placeholder="End Time" value={newEnd} onChange={e => setNewEnd(e.target.value)} className="px-3 py-2 border rounded" />
//           <button className="bg-indigo-700 text-white rounded px-4 py-2 font-bold" onClick={handleAddAvailability}>Add</button>
//         </div>
//       </section>

//       {/* Badges Section */}
//       <section>
//         <h2 className="text-xl font-bold mb-2 text-indigo-600">Badges</h2>
//         <div className="flex gap-2 flex-wrap">
//           {badges.length ? badges.map(badge => (
//             <span key={getId(badge)} className="bg-yellow-100 text-yellow-800 rounded-xl px-3 py-1 border border-yellow-200 shadow">{badge.name}</span>
//           )) : <span className="text-gray-400">None</span>}
//         </div>
//       </section>
//     </div>
//   );
// }
