// import React from "react";
// import FeedsPage from "./FeedsPage";    // Adjust import based on your file structure
// import UserList from "./UserList";      // Adjust import accordingly

// export default function HomePage() {
//   return (
//     <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto mt-8 px-4">
//       {/* Main Feed */}
//       <section className="flex-1 min-w-[350px]">
//         <div className="bg-white rounded-xl shadow p-6 mb-8">
//           <h1 className="text-3xl font-bold mb-4">Welcome to SkillAura</h1>
//           {/* Optionally put summary/dashboard info here */}
//           {/* <DashboardInfo /> */}
//         </div>
//         <FeedsPage />
//       </section>

//       {/* Sidebar: Find Users */}
//       <aside className="w-full md:w-[340px]">
//         <div className="bg-white rounded-xl shadow p-6">
//           <h2 className="text-xl font-semibold mb-2">Find Users</h2>
//           <UserList />
//         </div>
//       </aside>
//     </div>
//   );
// }




// import React from "react";
// import FeedsPage from "./FeedsPage";
// import UserList from "./UserList";

// export default function HomePage() {
//   return (
//     <div className="bg-gradient-to-b from-indigo-100 via-white to-white min-h-screen py-10">
//       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4">
        
//         {/* Main Feed Area */}
//         <section className="flex-1">
//           {/* Welcome Card */}
//           <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-xl mb-8 p-7 flex items-center gap-6 animate-fadeIn">
//             <img
//               src="/dashboard-welcome.png"
//               alt="Welcome"
//               className="w-24 h-24 rounded-xl bg-white border shadow"
//             />
//             <div>
//               <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">Welcome to SkillAura!</h1>
//               <div className="text-indigo-100 text-lg">Start learning, sharing, and connecting 🚀</div>
//             </div>
//           </div>

//           {/* Quick Stats (static sample) */}
//           <div className="flex gap-4 mb-8">
//             <div className="bg-white rounded-2xl shadow flex-1 p-5 flex flex-col items-center hover:scale-[1.03] transition">
//               <div className="text-4xl font-bold text-indigo-500 mb-1">3</div>
//               <div className="text-sm text-gray-600">Pending Requests</div>
//             </div>
//             <div className="bg-white rounded-2xl shadow flex-1 p-5 flex flex-col items-center hover:scale-[1.03] transition">
//               <div className="text-4xl font-bold text-purple-500 mb-1">18</div>
//               <div className="text-sm text-gray-600">Connections</div>
//             </div>
//           </div>

//           {/* Feed Posts */}
//           <div className="bg-white rounded-2xl shadow p-6">
//             <h2 className="text-xl font-bold mb-3 text-indigo-700">Your Feed</h2>
//             <FeedsPage />
//           </div>
//         </section>
        
//         {/* Sidebar: Find Users */}
//         <aside className="w-full lg:w-[350px] flex-shrink-0">
//           <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 sticky top-8 animate-slideInRight">
//             <h2 className="text-lg font-semibold text-indigo-700 mb-2 flex items-center gap-2">
//               <span className="bg-indigo-100 p-2 rounded-full">
//                 <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 17.036A9 9 0 1118 12.085" />
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M22 22l-5-5" />
//                 </svg>
//               </span>
//               Find Users
//             </h2>
//             <UserList />
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }




import React, { useState } from "react";
import FeedsPage from "./FeedsPage";
import UserList from "./UserList";

export default function HomePage() {
  const [showUserList, setShowUserList] = useState(false);

  return (
    <div className="bg-gradient-to-b from-indigo-100 via-white to-white min-h-screen py-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-8 px-4">
        {/* Welcome + Find Users Button */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-7 rounded-3xl shadow-xl flex items-center justify-between gap-6 mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">
              Welcome to SkillAura!
            </h1>
            <div className="text-indigo-100 text-lg">
              Connect, learn, and grow with your community 🚀
            </div>
          </div>
          <button
            onClick={() => setShowUserList((v) => !v)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/80 hover:bg-white text-indigo-700 font-bold text-lg shadow transition duration-150"
            style={{ minWidth: 160 }}
          >
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 17.036A9 9 0 1118 12.085"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 22l-5-5"
              />
            </svg>
            {showUserList ? "Hide Users" : "Find Users"}
          </button>
        </div>

        {/* UserList section (only shown when button is toggled) */}
        {showUserList && (
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">
              Platform Users
            </h2>
            <UserList />
          </div>
        )}

        {/* Feed Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-3 text-indigo-700">Your Feed</h2>
          <FeedsPage />
        </div>
      </div>
    </div>
  );
}
