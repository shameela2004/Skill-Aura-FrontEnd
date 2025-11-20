// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../../services/axiosInstance";

// // Tab labels for navigation
// const TABS = ["About", "Skills", "Portfolio", "Reviews"];

// export default function MentorProfile() {
//   const { id } = useParams<{ id: string }>();
//   const [mentor, setMentor] = useState<any>(null);
//   const [activeTab, setActiveTab] = useState("About");

//   useEffect(() => {
//     axiosInstance.get(`/user/${id}`).then(res =>
//       setMentor(res.data.data)
//     );
//   }, [id]);

//   if (!mentor) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

//   return (
//     <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
//       <div style={{
//         maxWidth: 800, margin: "40px auto", background: "#fff", borderRadius: 18, boxShadow: "0 0 16px #eee",
//         padding: "32px 32px 0 32px"
//       }}>
//         {/* Header */}
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <img src={mentor.profilePictureUrl || "/default-user.png"} alt="Profile"
//             style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", marginRight: 30 }}
//           />
//           <div style={{ flex: 1 }}>
//             <div style={{ fontWeight: 600, fontSize: 22 }}>{mentor.name}</div>
//             <div style={{ fontSize: 16, color: "#777" }}>{mentor.bio}</div>
//             <div style={{ marginTop: 8, fontSize: 14, color: "#555" }}>
//               {mentor.location &&
//                 <span>
//                   <span style={{ marginRight: 16 }}>
//                     <i className="fa fa-map-marker" aria-hidden="true" /> {mentor.location}
//                   </span>
//                 </span>
//               }
//               <span style={{ marginRight: 16 }}>{mentor.role}</span>
//               <span style={{
//                 display: "inline-block", background: "#ffd700", color: "#222", borderRadius: 5, fontWeight: 500,
//                 padding: "2px 8px", fontSize: 13, marginRight: 12
//               }}>{mentor.mentorStatus}</span>
//             </div>
//           </div>
//           {mentor.badges?.$values?.length > 0 && (
//             <div>
//               {mentor.badges.$values.map((badge: any, idx: number) => (
//                 <span key={idx} style={{
//                   background: "#ffecb3", color: "#b78c00", borderRadius: 5, padding: "4px 12px", fontSize: 13, marginLeft: 8
//                 }}>
//                   {badge}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Stats Row */}
//         <div style={{ margin: "24px 0 18px 0", display: "flex", gap: 30, color: "#444", fontSize: 15 }}>
//           {mentor.posts?.$values &&
//             <span>{mentor.posts.$values.length} Posts</span>
//           }
//           {mentor.skills?.$values &&
//             <span>{mentor.skills.$values.length} Skills</span>
//           }
//           {mentor.languages?.$values &&
//             <span>
//               Languages: {mentor.languages.$values.map((l: any) => l.languageName).join(', ')}
//             </span>
//           }
//         </div>
        
//         {/* Tabs */}
//         <div style={{
//           display: "flex", gap: 12, borderBottom: "2px solid #eaeaea", marginBottom: 30, paddingBottom: 4
//         }}>
//           {TABS.map(tab => (
//             <button key={tab}
//               onClick={() => setActiveTab(tab)}
//               style={{
//                 fontWeight: activeTab === tab ? 700 : 500,
//                 color: activeTab === tab ? "#222" : "#888",
//                 border: "none", background: "none", padding: "8px 24px", fontSize: 16,
//                 borderBottom: activeTab === tab ? "2px solid #222" : "2px solid transparent", cursor: "pointer"
//               }}>
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Tab content */}
//         <div>
//           {activeTab === "About" && (
//             <div>
//               <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>About Me</div>
//               <div style={{ color: "#444", marginBottom: 12 }}>{mentor.bio}</div>
//               <div style={{ marginBottom: 12 }}>Location: <strong>{mentor.location}</strong></div>
//               <div style={{ marginBottom: 12 }}>
//                 Languages:&nbsp;
//                 {(mentor.languages?.$values ?? []).map((l: any) =>
//                   <span key={l.languageId} style={{ marginRight: 10 }}>
//                     {l.languageName} <span style={{ color: "#666" }}>({l.proficiency})</span>
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}
//           {activeTab === "Skills" && (
//             <div>
//               <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Skills</div>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
//                 {(mentor.skills?.$values ?? []).map((skill: any) =>
//                   <span key={skill.skillId}
//                     style={{
//                       background: "#f1f5fb", borderRadius: 8, padding: "6px 18px",
//                       fontSize: 15, color: "#333", marginBottom: 6
//                     }}>
//                     {skill.skillName} <span style={{ marginLeft: 8, color: "#558cf6" }}>({skill.type})</span>
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}
//           {activeTab === "Portfolio" && (
//             <div>
//               <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Posts</div>
//               {(mentor.posts?.$values ?? []).length === 0 ? (
//                 <span style={{ color: "#888" }}>No posts to show.</span>
//               ) : (
//                 mentor.posts.$values.map((post: any) => (
//                   <div key={post.postId}
//                        style={{ border: "1px solid #eee", borderRadius: 8, padding: "14px 18px", marginBottom: 10, background: "#fafafa" }}>
//                     <div style={{ fontWeight: 500 }}>{post.content}</div>
//                     {post.mediaUrl && (
//                       <div style={{ marginTop: 7 }}>
//                         <a href={post.mediaUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#4586d6", textDecoration: "underline" }}>
//                           View Media
//                         </a>
//                       </div>
//                     )}
//                     <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
//                       Likes: {post.likeCount} &middot; Comments: {post.commentCount}
//                       <span style={{ float: "right" }}>{new Date(post.createdAt).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//           {activeTab === "Reviews" && (
//             <div>
//               <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Reviews</div>
//               <span style={{ color: "#888" }}>No reviews available.</span>
//             </div>
//           )}
//         </div>

//         {/* Availability */}
//         <div style={{ marginTop: 30 }}>
//           <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Availability</div>
//           {(mentor.mentorAvailabilities?.$values ?? []).length === 0 ? (
//             <span style={{ color: "#888" }}>No available slots set.</span>
//           ) : (
//             <ul style={{ paddingLeft: 0, marginBottom: 5, listStyle: "none" }}>
//               {mentor.mentorAvailabilities.$values.map((slot: any, idx: number) => (
//                 <li key={idx} style={{ marginBottom: 4, fontSize: 15 }}>
//                   {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][slot.dayOfWeek]}
//                   &nbsp;&mdash;&nbsp;
//                   {slot.startTime} – {slot.endTime}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import AboutTab from "../../components/MentorProfile/AboutTab";
import SkillsTab from "../../components/MentorProfile/SkillsTab";
import PortfolioTab from "../../components/MentorProfile/PostsTab";
import ReviewsTab from "../../components/MentorProfile/ReviewsTab";
import MentorSessionsTab from "../../components/MentorProfile/SessionsTab";
import { useAuth } from "../../context/AuthContext";


const TABS = ["About", "Skills", "Portfolio","Session","Reviews"];

export default function MentorProfile() {
  const { id } = useParams<{ id: string }>();
  const {user}=useAuth();
  const [mentor, setMentor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("About");

  useEffect(() => {
    axiosInstance.get(`/user/${id}`).then(res =>
      setMentor(res.data.data)
    );
  }, [id]);
  if (!mentor) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <img    src={`https://localhost:7027${mentor.profilePictureUrl}`|| "/default-avatar.png"} alt="Profile" className="w-20 h-20 rounded-full object-cover mr-4" />
          <div>
            <div className="text-2xl font-bold">{mentor.name}</div>
            <div className="text-sm text-gray-500">{mentor.location}</div>
            <div className="text-xs text-indigo-500">{mentor.role} &middot; {mentor.mentorStatus}</div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex border-b mb-6">
          {TABS.map(tab => (
            <button key={tab}
              className={`py-2 px-6 font-medium ${activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
              onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        {activeTab === "About" && <AboutTab mentor={mentor} />}
        {activeTab === "Skills" && <SkillsTab skills={mentor.skills?.$values ?? []} />}
        {activeTab === "Portfolio" && <PortfolioTab posts={mentor.posts?.$values ?? []} loggedInUserId={user?.id} />}
        {/* {activeTab === "Availability" && <AvailabilityTab availabilities={mentor.mentorAvailabilities?.$values ?? []} />} */}
         {activeTab === "Session" && <MentorSessionsTab mentorId={mentor.id} userId={user?.id}/>}

        {activeTab === "Reviews" && <ReviewsTab mentorId={mentor.id} />}
      </div>
    </div>
  );
}
