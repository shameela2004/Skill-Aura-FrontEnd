// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../services/axiosInstance";
// import { FaRupeeSign } from "react-icons/fa";

// const TABS = ["Upcoming", "Past"] as const;
// type Tab = typeof TABS[number];

// export default function MyBookingsPage() {
//     const [activeTab, setActiveTab] = useState<Tab>("Upcoming");
//     const [pastBookings, setPastBookings] = useState<any[]>([]);
//         const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);


//     // useEffect(() => {
//     //     if (!user?.id) return;

//     //     async function fetchBookings() {
//     //         try {
//     //             const res = await axiosInstance.get(`/booking/user/${user?.id}`);
//     //             setBookings(res.data.data?.$values ?? []);
//     //             console.log(bookings)
//     //         } catch (error) {
//     //             console.error("Failed to fetch bookings", error);
//     //         }
//     //     }

//     //     fetchBookings();
//     // }, [user]);
//     useEffect(() => {
//   async function fetchUpcomingBookings() {
//     try {
//       const res = await axiosInstance.get(`Booking/past`);
//       setUpcomingBookings(res.data.data.$values ?? []);
//       console.log(upcomingBookings); 
//     } catch (error) {
//       console.error("Failed to load bookings", error);
//     }
//   }
//       fetchUpcomingBookings();
// }, [activeTab]);
//  useEffect(() => {
//   async function fetchPastBookings() {
//     try {
//       const res = await axiosInstance.get(`Booking/Upcoming`);
//       setPastBookings(res.data.data.$values ?? []);
//       console.log(upcomingBookings); 
//     } catch (error) {
//       console.error("Failed to load bookings", error);
//     }
//   }
//       fetchPastBookings();
// }, [activeTab]);

//     async function handleCancel(bookingId: number) {
//         if (!window.confirm("Confirm cancellation?")) return;
//         try {
//             await axiosInstance.post(`/booking/${bookingId}/cancel`, { reason: "User requested cancellation" });
//             setUpcomingBookings(prev => prev.filter(b => b.id !== bookingId));
//         } catch (error) {
//             console.error("Failed to cancel booking", error);
//         }
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">
//             <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
//             <div className="flex gap-4 mb-6">
//                 {TABS.map(tab => (
//                     <button
//                         key={tab}
//                         onClick={() => setActiveTab(tab)}
//                         className={`px-6 py-2 rounded-full font-semibold ${
//                             activeTab === tab ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow" : "bg-gray-100 text-gray-700"
//                         }`}
//                     >
//                         {tab}
//                     </button>
//                 ))}
//             </div>

//             {activeTab === "Upcoming" && (
//                 <>
//                     {upcomingBookings.length === 0 && <p className="text-gray-500">No upcoming bookings.</p>}
//                     {upcomingBookings.map(booking => (
//                         <div key={booking.id} className="bg-white rounded-2xl shadow p-6 mb-5 flex justify-between items-center">
//                             <div>
//                                 <h2 className="font-semibold text-lg">{booking.session?.skill?.name}</h2>
//                                 <p>
//                                     Scheduled at: {new Date(booking.session?.scheduledAt).toLocaleDateString()} @{" "}
//                                     {new Date(booking.session?.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                                 </p>
//                                 <p className="flex items-center">
//                                     <FaRupeeSign className="inline mr-1" /> {booking.session?.price} - {booking.session?.mode}
//                                 </p>
//                                 <p>Status: {booking.status}</p>
//                                 <p>Payment: {booking.paymentStatus}</p>
//                             </div>
//                             <button
//                                 onClick={() => handleCancel(booking.id)}
//                                 className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     ))}
//                 </>
//             )}

//             {activeTab === "Past" && (
//                 <>
//                     {pastBookings.length === 0 && <p className="text-gray-500">No past bookings.</p>}
//                     {pastBookings.map(booking => (
//                         <div key={booking.id} className="bg-white rounded-2xl shadow p-6 mb-5">
//                             <h2 className="font-semibold text-lg">{booking.session?.skill?.name}</h2>
//                             <p>
//                                 Scheduled at: {new Date(booking.session?.scheduledAt).toLocaleDateString()} @{" "}
//                                 {new Date(booking.session?.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                             </p>
//                             <p className="flex items-center">
//                                 <FaRupeeSign className="inline mr-1" /> {booking.session?.price} - {booking.session?.mode}
//                             </p>
//                             <p>Status: {booking.status}</p>
//                             <p>Payment: {booking.paymentStatus}</p>
//                         </div>
//                     ))}
//                 </>
//             )}
//         </div>
//     );
// }

import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { FaRupeeSign } from "react-icons/fa";

const TABS = ["Upcoming", "Past"] as const;
type Tab = typeof TABS[number];

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Upcoming");
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUpcomingBookings() {
      try {
        const res = await axiosInstance.get("booking/Upcoming");
        setUpcomingBookings(res.data.data?.$values ?? []);
      } catch (error) {
        console.error("Failed to load upcoming bookings", error);
      }
    }

    async function fetchPastBookings() {
      try {
        const res = await axiosInstance.get("booking/past");
        setPastBookings(res.data.data?.$values ?? []);
        console.log(pastBookings)
      } catch (error) {
        console.error("Failed to load past bookings", error);
      }
    }

    if (activeTab === "Upcoming") fetchUpcomingBookings();
    else if (activeTab === "Past") fetchPastBookings();
  }, [activeTab]);

  async function handleCancel(bookingId: number) {
    if (!window.confirm("Confirm cancellation?")) return;
    try {
      await axiosInstance.post(`/booking/${bookingId}/cancel`, { reason: "User requested cancellation" });
      setUpcomingBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (error) {
      console.error("Failed to cancel booking", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="flex gap-4 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-semibold ${
              activeTab === tab
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Upcoming" && (
        <>
          {upcomingBookings.length === 0 ? (
            <p className="text-gray-500">No upcoming bookings.</p>
          ) : (
            upcomingBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl shadow p-6 mb-5 flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  {booking.mentorProfilePictureUrl ? (
                    <img
                        src={`https://localhost:7027${booking.mentorProfilePictureUrl}`}
                      alt={booking.mentorName}
                      className="rounded-full w-16 h-16 object-cover border"
                    />
                  ) : (
                    <div className="rounded-full w-16 h-16 bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xl">
                      {booking.mentorName?.[0] || "M"}
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold text-lg">{booking.skillName}</h2>
                    <p className="text-sm text-gray-600">{booking.mentorName}</p>
                    <p className="text-gray-700">
                      Scheduled at:{" "}
                      {new Date(booking.sessionDate).toLocaleDateString()} @{" "}
                      {new Date(booking.sessionDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="flex items-center gap-1">
                      <FaRupeeSign /> {booking.paymentAmount} - {booking.mode}
                    </p>
                    <p>Status: {booking.status}</p>
                    <p>Payment: {booking.paymentStatus}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            ))
          )}
        </>
      )}

      {activeTab === "Past" && (
        <>
          {pastBookings.length === 0 ? (
            <p className="text-gray-500">No past bookings.</p>
          ) : (
            pastBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl shadow p-6 mb-5 flex items-center gap-4">
                {booking.mentorProfilePictureUrl ? (
                  <img
                    src={`https://localhost:7027${booking.mentorProfilePictureUrl}`}
                    alt={booking.mentorName}
                    className="rounded-full w-16 h-16 object-cover border"
                  />
                ) : (
                  <div className="rounded-full w-16 h-16 bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xl">
                    {booking.mentor?.name?.[0] || "M"}
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-lg">{booking.skill}</h2>
                  <p className="text-sm text-gray-600">{booking.mentorName}</p>
                  <p>
                    Scheduled at:{" "}
                    {new Date(booking.sessionDate).toLocaleDateString()} @{" "}
                    {new Date(booking.sessionDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="flex items-center gap-1">
                    <FaRupeeSign /> {booking.paymentAmount} - {booking.mode}
                  </p>
                  <p>Status: {booking.status}</p>
                  <p>Payment: {booking.paymentStatus}</p>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
