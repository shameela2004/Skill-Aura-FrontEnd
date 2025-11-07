// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { FiUsers } from "react-icons/fi";
// import { BiBookBookmark } from "react-icons/bi";
// import { MdGroups } from "react-icons/md";
// import { GiAchievement } from "react-icons/gi";
// import { MdShowChart } from "react-icons/md";
// import { FaChalkboardTeacher } from "react-icons/fa";

// const features = [
//   {
//     icon: <FiUsers className="text-3xl text-white mb-2" />,
//     title: "Find Mentors",
//     desc: "Connect with expert mentors in any field",
//   },
//   {
//     icon: <BiBookBookmark className="text-3xl text-white mb-2" />,
//     title: "Learn Skills",
//     desc: "Master new skills through 1-on-1 sessions",
//   },
//   {
//     icon: <MdGroups className="text-3xl text-white mb-2" />,
//     title: "Join Groups",
//     desc: "Collaborate in learning communities",
//   },
//   {
//     icon: <GiAchievement className="text-3xl text-white mb-2" />,
//     title: "Earn Badges",
//     desc: "Get recognized for your achievements",
//   },
//   {
//     icon: <MdShowChart className="text-3xl text-white mb-2" />,
//     title: "Track Progress",
//     desc: "Monitor your learning journey",
//   },
//   {
//     icon: <FaChalkboardTeacher className="text-3xl text-white mb-2" />,
//     title: "Share Knowledge",
//     desc: "Become a mentor and teach others",
//   },
// ];


// const IntroPage: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500 px-4">
//       <div className="text-center mb-8">
//         <div className="flex items-center justify-center mb-4">
//           {/* Replace with logo SVG */}
//           <div className="bg-white p-4 rounded-full shadow">
//             <span className="text-orange-500 text-4xl">🎓</span>
//           </div>
//         </div>
//         <div className="text-4xl font-bold text-white mb-2">SkillAura</div>
//         <div className="text-xl text-white font-medium mb-4">
//           Connect. Learn. Teach. Grow.
//         </div>
//         <div className="text-white mb-10">
//           Join thousands of learners and mentors sharing knowledge
//         </div>
//       </div>
//       <div className="w-full max-w-5xl mb-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           {features.map((f) => (
//             <div
//               key={f.title}
//               className="bg-white/20 backdrop-blur-xl rounded-lg shadow-xl p-6 flex flex-col items-center"
//             >
//               {f.icon}
//               <div className="font-semibold text-white text-lg mb-1">{f.title}</div>
//               <div className="text-white text-sm text-center">{f.desc}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <button
//         className="bg-white rounded-full text-pink-500 px-8 py-3 font-bold text-lg shadow hover:bg-pink-100"
//         onClick={() => navigate("/signup")}
//       >
//         Get Started Free
//       </button>
//       <div className="mt-4 text-white text-sm opacity-80">
//         No credit card required • Free forever • Join 10,000+ users
//       </div>
//     </div>
//   );
// };

// export default IntroPage;

import React from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers } from "react-icons/fi";
import { BiBookBookmark } from "react-icons/bi";
import { MdGroups } from "react-icons/md";
import { GiAchievement } from "react-icons/gi";
import { MdShowChart } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";

const features = [
  {
    icon: <FiUsers className="text-4xl text-indigo-400 mb-3" />,
    title: "Find Mentors",
    desc: "Connect with expert mentors in any field",
  },
  {
    icon: <BiBookBookmark className="text-4xl text-indigo-400 mb-3" />,
    title: "Learn Skills",
    desc: "Master new skills through 1-on-1 sessions",
  },
  {
    icon: <MdGroups className="text-4xl text-indigo-400 mb-3" />,
    title: "Join Groups",
    desc: "Collaborate in learning communities",
  },
  {
    icon: <GiAchievement className="text-4xl text-indigo-400 mb-3" />,
    title: "Earn Badges",
    desc: "Get recognized for your achievements",
  },
  {
    icon: <MdShowChart className="text-4xl text-indigo-400 mb-3" />,
    title: "Track Progress",
    desc: "Monitor your learning journey",
  },
  {
    icon: <FaChalkboardTeacher className="text-4xl text-indigo-400 mb-3" />,
    title: "Share Knowledge",
    desc: "Become a mentor and teach others",
  },
];

const IntroPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-[#101017] relative overflow-x-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#28293e" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Sphere/shape backdrop */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-0 opacity-40">
        <div className="rounded-full bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-500 w-[420px] h-[420px] blur-3xl"></div>
      </div>
      {/* Header section */}
      <header className="w-full flex justify-between items-center px-10 py-6 relative z-10">
        <div className="flex items-center">
          <span className="text-white text-3xl font-bold">SkillAura</span>
        </div>
        <div className="gap-4 flex">
          <button 
            onClick={() => navigate("/login")}
            className="bg-transparent hover:bg-indigo-600 transition px-6 py-2 rounded-xl text-indigo-300 border border-indigo-400 font-semibold"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-xl ml-2 transition shadow"
          >
            Get Started Free
          </button>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center max-w-2xl mx-auto pt-20 pb-6 text-center">
        <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
          Find the skills you need. <br /> Share the skills you have.
        </h1>
        <h2 className="text-3xl font-bold mb-2 tracking-tight text-indigo-400">
          For students, mentors, and creators.
        </h2>
        <p className="text-gray-300 text-lg mb-6 px-6">
          Connect with thousands to learn, teach, and share valuable skills on your campus and beyond.
        </p>
      </section>
      {/* Features Section */}
      <section className="z-10 w-full max-w-6xl px-3 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white/[0.09] backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center border border-white/5 transition hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="rounded-full bg-indigo-900 bg-opacity-30 p-4 mb-2">
                {f.icon}
              </div>
              <div className="font-semibold text-white text-xl mb-1 text-center">{f.title}</div>
              <div className="text-indigo-200 text-base text-center">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default IntroPage;
