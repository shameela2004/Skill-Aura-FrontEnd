// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../services/axiosInstance";
// import { FaRupeeSign } from "react-icons/fa";
// // import { DatePicker } from "your-datepicker-lib"; // plug in if needed

// const TABS = ["Upcoming", "Past", "Book New"] as const;
// type Tab = typeof TABS[number];

// export default function SessionsManagement() {
//   const [tab, setTab] = useState<Tab>("Upcoming");
//   const [sessions, setSessions] = useState<any[]>([]);
//   const [mentors, setMentors] = useState<any[]>([]);
//   const [form, setForm] = useState({
//     mentorId: "",
//     date: "",
//     time: "",
//     mode: "Online",
//     notes: "",
//   });
  
//   useEffect(() => {
//     // Fetch session list per tab
//     async function fetchSessions() {
//       const role = "Learner"; // Or useContext/auth
//     //   const res = await axiosInstance.get(`/sessions/me?role=${role}`);
//           const res = await axiosInstance.get(`/sessions/me`);
//          console.log("sess"+res)
//       setSessions(res.data.data?.$values ?? []);
//             console.log("sessions"+sessions)

//     }
//     if (tab !== "Book New") fetchSessions();

//     // Fetch mentors for booking
//     async function fetchMentors() {
//       const res = await axiosInstance.get("/user?role=Mentor");
//         //   const res = await axiosInstance.get("/adminMentor?status=Approved");

//       setMentors(res.data.data?.$values ?? []);
//     }
//     if (tab === "Book New") fetchMentors();

//   }, [tab]);

//   async function handleBookSession() {
//     // Validate form inputs
//     // Post to /sessions to create
//     await axiosInstance.post("/sessions", {
//       mentorId: form.mentorId,
//       scheduledAt: `${form.date}T${form.time}`,
//       mode: form.mode,
//       notes: form.notes,
//       skillId: "requiredSkillId" // Get from mentor/skill selection
//     });
//     // Reset or move to Upcoming tab
//     setTab("Upcoming");
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <header className="bg-white shadow px-8 py-6">
//         <h1 className="text-2xl font-bold text-gray-900">My Sessions</h1>
//         <div className="text-gray-500">Book, manage, and review your learning sessions</div>
//       </header>
//       <div className="px-8 py-6 w-full max-w-4xl mx-auto">
//         <div className="flex gap-5 mb-8">
//           {TABS.map(t => (
//             <button
//               key={t}
//               onClick={() => setTab(t)}
//               className={`px-6 py-2 rounded-full font-semibold ${
//                 tab === t
//                   ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow"
//                   : "bg-gray-100 text-gray-700"
//               }`}
//             >
//               {t}
//             </button>
//           ))}
//         </div>

//         {/* Book New Session */}
//         {tab === "Book New" && (
//           <div className="bg-white rounded-2xl p-6 shadow">
//             <h2 className="text-lg font-semibold mb-3">Book a New Session</h2>
//             <div className="mb-4">
//               <label className="block font-medium mb-1">Select Mentor</label>
//               <select
//                 className="w-full border rounded px-3 py-2"
//                 value={form.mentorId}
//                 onChange={e => setForm(f => ({ ...f, mentorId: e.target.value }))}
//               >
//                 <option value="">Choose a mentor</option>
//                 {mentors.map(m => (
//                   <option key={m.id} value={m.id}>
//                     <img src={`https://localhost:7027${m.profilePictureUrl}`} alt="profilePicture" className="w-10 h-10 rounded-full border object-cover" />{m.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* Date Picker */}
//             <div className="mb-4">
//               <label className="block font-medium mb-1">Select Date</label>
//               <input
//                 type="date"
//                 className="border rounded px-3 py-2 w-full"
//                 value={form.date}
//                 onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block font-medium mb-1">Select Time Slot</label>
//               <input
//                 type="time"
//                 className="border rounded px-3 py-2 w-full"
//                 value={form.time}
//                 onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
//               />
//             </div>
//             <div className="mb-4 flex gap-3">
//               <button
//                 className={`px-6 py-2 rounded-lg font-semibold ${
//                   form.mode === "Online"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-gray-100 text-gray-800"
//                 }`}
//                 onClick={() => setForm(f => ({ ...f, mode: "Online" }))}
//                 type="button"
//               >
//                 Online
//               </button>
//               <button
//                 className={`px-6 py-2 rounded-lg font-semibold ${
//                   form.mode === "Offline"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-gray-100 text-gray-800"
//                 }`}
//                 onClick={() => setForm(f => ({ ...f, mode: "Offline" }))}
//                 type="button"
//               >
//                 Offline
//               </button>
//             </div>
//             <div className="mb-4">
//               <label className="block font-medium mb-1">Notes / Documents</label>
//               <textarea
//                 className="border rounded px-3 py-2 w-full"
//                 value={form.notes}
//                 onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
//               />
//             </div>
//             <button
//               className="w-full py-2 mt-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg"
//               onClick={handleBookSession}
//             >
//               Book Session
//             </button>
//           </div>
//         )}

//         {/* Upcoming Sessions */}
//         {tab === "Upcoming" && (
//           <div>
//             {sessions
//               .filter(s => !s.isCompleted && new Date(s.scheduledAt) > new Date())
//               .map(session => (
//                 <div key={session.id} className="bg-white shadow rounded-2xl p-5 mb-6 flex items-center justify-between">
//                   <div>
//                     <div className="font-bold text-xl">{session.skill?.name || "Session"}</div>
//                     <div className="text-gray-700">
//                       with {session.mentor?.name}
//                     </div>
//                     <div className="text-gray-500 my-1">
//                       {new Date(session.scheduledAt).toLocaleDateString()} &bull; {new Date(session.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                     </div>
//                     <div className="text-xs mt-1 text-gray-500">
//                       {session.mode}
//                     </div>
//                   </div>
//                   <div>
//                     <button className="bg-indigo-600 text-white px-6 py-2 rounded font-bold mr-2">
//                       Join Session
//                     </button>
//                     <button className="bg-gray-100 text-gray-700 px-5 py-2 rounded mr-2">Reschedule</button>
//                     <button className="bg-red-100 text-red-600 px-5 py-2 rounded">Cancel</button>
//                   </div>
//                   <span className="px-4 py-1 rounded-full text-sm bg-green-100 text-green-700 font-semibold">Confirmed</span>
//                 </div>
//               ))}
//           </div>
//         )}

//         {/* Past Sessions */}
//         {tab === "Past" && (
//           <div>
//             {sessions
//               .filter(s => s.isCompleted || new Date(s.scheduledAt) < new Date())
//               .map(session => (
//                 <div key={session.id} className="bg-white shadow rounded-2xl p-5 mb-6 flex items-center justify-between">
//                   <div>
//                     <div className="font-bold text-xl">{session.skill || "Session"}</div>
//                     <div className="text-gray-700">
//                       with {session.mentor}
//                     </div>
//                      <div className="text-gray-700 flex items-center">
//                       <FaRupeeSign></FaRupeeSign> <p>{session.price}</p> - {session.mode.toUpperCase()}
//                     </div>
//                     <div className="text-gray-500 my-1">
//                       {new Date(session.scheduledAt).toLocaleDateString()} &bull; {new Date(session.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                     </div>
//                   </div>
//                   <div>
//                     <button className="bg-indigo-600 text-white px-6 py-2 rounded font-bold mr-2">
//                       View Feedback
//                     </button>
//                     {/* <button className="bg-gray-100 text-gray-700 px-5 py-2 rounded">Book Again</button> */}
//                   </div>
//                   <span className="px-4 py-1 rounded-full text-sm bg-gray-200 text-gray-700 font-semibold">{session.isCompleted?"Completed":"Not Completed"}</span>
//                 </div>
//               ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { FaRupeeSign } from "react-icons/fa";

const TABS = ["Upcoming Sessions","My Sessions", "Pending Bookings", "Add New Session"] as const;
type Tab = typeof TABS[number];

export default function MentorSessionsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Upcoming Sessions");
  const [sessions, setSessions] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);

  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [form, setForm] = useState({
    skillId: "",
    date: "",
    time: "",
    mode: "Online",
    notes: "",
    price: "",
  });

  // Fetch sessions whenever activeTab is My Sessions
  useEffect(() => {
    if (activeTab === "Upcoming Sessions" || activeTab==="My Sessions") {
      axiosInstance
        .get("/sessions/me")
        .then(res => setSessions(res.data.data?.$values ?? []))
        .catch(err => console.error("Failed to load sessions", err));
    }
  }, [activeTab]);
    const upcomingSessions = sessions.filter(session => !session.isCompleted && new Date(session.scheduledAt) >= new Date);

  // Fetch pending bookings whenever activeTab is Pending Bookings
  useEffect(() => {
    if (activeTab === "Pending Bookings") {
      axiosInstance
        .get("/booking/pending")
        .then(res => setPendingBookings(res.data.data.$values ?? []))
        .catch(err => console.error("Failed to load pending bookings", err));
        console.log(pendingBookings)
    }
  }, [activeTab]);

    useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await axiosInstance.get("Skill/my/teaching-skills");
        setSkills(res.data.data.$values ?? []);
      } catch (error) {
        console.error("Failed to fetch skills", error);
      }
    }

    if (activeTab === "Add New Session") {
      fetchSkills();
    }
    }, [activeTab]);

  // Approve a booking by ID
  const approveBooking = async (bookingId: number) => {
    try {
      await axiosInstance.post(`/booking/${bookingId}/approve`);
      setPendingBookings(p => p.filter(b => b.id !== bookingId));
    } catch (error) {
      console.error("Failed to approve booking", error);
    }
  };

  // Reject a booking by ID
  const rejectBooking = async (bookingId: number) => {
    try {
      await axiosInstance.post(`/booking/${bookingId}/reject`,  { reason: "Rejected by mentor" });
      setPendingBookings(p => p.filter(b => b.id !== bookingId));
    } catch (error) {
      console.error("Failed to reject booking", error);
    }
  };
   
  // Handle adding a new session with form submission
  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(form.skillId && form.date && form.time && form.price !== "")) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await axiosInstance.post("/sessions", {
        skillId: form.skillId,
        scheduledAt: `${form.date}T${form.time}`,
        mode: form.mode,
        notes: form.notes,
        price: Number(form.price),
      });
      setForm({ skillId: "", date: "", time: "", mode: "Online", notes: "", price: "" });
      setActiveTab("My Sessions");
      // Refresh sessions after adding
      const res = await axiosInstance.get("/sessions/me");
      setSessions(res.data.data?.$values ?? []);
    } catch (error) {
      console.error("Failed to create session", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mentor Sessions</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-full font-semibold ${
              activeTab === tab ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}

           {activeTab === "Upcoming Sessions" && (
        <div>
          {upcomingSessions.length === 0 ? (
            <p>No upcoming sessions.</p>
          ) : (
            upcomingSessions.map(session => (
              <div key={session.id} className="bg-white rounded-2xl shadow p-6 mb-5">
                <h3 className="text-xl font-semibold">{session.skill?.name}</h3>
                <p>
                  Scheduled for: {new Date(session.scheduledAt).toLocaleDateString()} at{" "}
                  {new Date(session.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p>
                  Mode: {session.mode} | Price: <FaRupeeSign className="inline" /> {session.price}
                </p>
              </div>
            ))
          )}
        </div>
      )}
     


      {activeTab === "My Sessions" && (
        <div>
          {sessions.length === 0 ? (
            <p className="text-gray-500">You have not created any sessions yet.</p>
          ) : (
            <ul className="space-y-4">
              {sessions.map(session => (
                <li key={session.id} className="bg-white rounded-2xl shadow p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold">{session.skill?.name || "Session"}</h2>
                      <div className="text-gray-600">
                        {new Date(session.scheduledAt).toLocaleDateString()} @{" "}
                        {new Date(session.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="text-gray-600">
                        <FaRupeeSign className="inline" /> {session.price} - {session.mode}
                      </div>
                      <div className="mt-2 text-gray-500">{session.notes}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "Pending Bookings" && (
        <div>
          {pendingBookings.length === 0 ? (
            <p className="text-gray-500">No pending bookings.</p>
          ) : (
            <ul>
              {pendingBookings.map(booking => (
                <li key={booking.id} className="bg-white rounded shadow p-4 mb-4 flex justify-between items-center">
                  <div>
                    <p><strong>Learner:</strong> {booking.learnerName}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                    <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={() => approveBooking(booking.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      onClick={() => rejectBooking(booking.id)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "Add New Session" && (
        <form onSubmit={handleAddSession} className="bg-white rounded-2xl shadow p-6 max-w-xl">
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Skill</label>
            <select
    required
    className="border rounded px-3 py-2 w-full"
    value={form.skillId}
    onChange={e => setForm(f => ({ ...f, skillId: e.target.value }))}
  >
    <option value="">Choose skill</option>
    {skills.map(skill => (
      <option key={skill.id} value={skill.id}>
        {skill.name}
      </option>
    ))}
  </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Date</label>
            <input
              type="date"
              className="border rounded p-2 w-full"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Time</label>
            <input
              type="time"
              className="border rounded p-2 w-full"
              value={form.time}
              onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              required
            />
          </div>
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              className={`w-1/2 rounded p-2 font-semibold ${form.mode === "Online" ? "bg-indigo-700 text-white" : "bg-gray-300"}`}
              onClick={() => setForm(f => ({ ...f, mode: "Online" }))}
            >
              Online
            </button>
            <button
              type="button"
              className={`w-1/2 rounded p-2 font-semibold ${form.mode === "Offline" ? "bg-indigo-700 text-white" : "bg-gray-300"}`}
              onClick={() => setForm(f => ({ ...f, mode: "Offline" }))}
            >
              Offline
            </button>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Notes</label>
            <textarea
              className="border rounded p-2 w-full"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold">Price (₹)</label>
            <input
              type="number"
              min={0}
              className="border rounded p-2 w-full"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              required
            />
          </div>
          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded font-semibold hover:from-indigo-700 hover:to-purple-700">
            Add Session
          </button>
        </form>
      )}
    </div>
  );
}

