// import React from "react";

// export default function LearnerProfile({ profile }: { profile: any }) {
//   const {
//     skillsToLearn = [],
//     languages = [],
//     name,
//     bio,
//     location,
//     profilePictureUrl,
//   } = profile;

//   return (
//     <div className="min-h-screen bg-gray-50 max-w-4xl mx-auto p-6">
//       <div className="bg-white rounded-2xl shadow px-8 py-7 flex items-center gap-8 mb-6">
//         <img src={profilePictureUrl || "/defaultprofile.png"} alt="pfp"
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

//       <section>
//         <h2 className="text-xl font-bold mb-2 text-indigo-800">Skills to Learn</h2>
//         <div className="flex flex-wrap gap-2 mb-6">
//           {skillsToLearn.length ? skillsToLearn.map(s => (
//             <span key={s.skillId ?? s.id ?? Math.random()} className="bg-gray-100 border px-3 py-1 rounded-2xl text-indigo-700 font-medium">
//               {s.skillName ?? s.name}
//             </span>
//           )) : <span className="text-gray-400">None</span>}
//         </div>
//       </section>

//       <section>
//         <h2 className="text-xl font-bold mb-2 text-indigo-600">Languages</h2>
//         <ul className="list-disc ml-6">
//           {languages.length ? languages.map(l => (
//             <li key={l.languageId ?? l.id ?? Math.random()} className="text-gray-700">
//               {l.languageName} <span className="font-medium text-indigo-400">- {l.proficiency}</span>
//             </li>
//           )) : <li className="text-gray-400">None</li>}
//         </ul>
//       </section>
//     </div>
//   );
// }
