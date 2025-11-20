// import React, { useEffect, useRef, useState } from "react";
// import axiosInstance from "../../services/axiosInstance";
// import CommonModal, { type ModalType } from "../CommonModal";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// interface Session {
//   id: number;
//   skill?: { skillName: string };
//   notes?: string;
//   scheduledAt: string;
//   price?: number;
//   isCompleted?: boolean;
// }

// export default function MentorSessionsTab({
//   mentorId,
//   userId // pass logged in user's id as prop
// }: { mentorId: number; userId: any }) {
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const [bookedSessionIds, setBookedSessionIds] = useState<Set<number>>(new Set());
//   const [loading, setLoading] = useState(true);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState<ModalType>("confirm");
//   const [modalTitle, setModalTitle] = useState<string>("");
//   const [modalMessage, setModalMessage] = useState<string>("");
//   const [onModalConfirm, setOnModalConfirm] = useState<(() => void) | undefined>(undefined);

//   const currentPaymentId = useRef<number | null>(null);
//   const [pendingSession, setPendingSession] = useState<Session | null>(null);

//   useEffect(() => {
//     fetchSessions();
//     fetchUserBookings();
//     // eslint-disable-next-line
//   }, [mentorId]);

//   async function fetchSessions() {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get(`/sessions/mentor/${mentorId}`);
//       setSessions(res.data.data.$values ?? []);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function fetchUserBookings() {
//     try {
//       const res = await axiosInstance.get(`/booking/user/${userId}`);
//       if (res.data?.success) {
//         const bookedIds: number[] = (res.data?.data?.$values ?? [])
//           .filter((b: any) => !b.isCancelled)
//           .map((b: any) => b.sessionId)
//           .filter((id: number | null) => id !== null) as number[];
//         setBookedSessionIds(new Set(bookedIds));
//       }
//     } catch {
//       setBookedSessionIds(new Set());
//     }
//   }

//   function showModal(type: ModalType, title: string, message: string, onConfirm?: () => void) {
//     setModalType(type);
//     setModalTitle(title);
//     setModalMessage(message);
//     setOnModalConfirm(onConfirm);
//     setModalOpen(true);
//   }

//   function closeModal() {
//     setModalOpen(false);
//     setOnModalConfirm(undefined);
//     setPendingSession(null);
//   }

//   // function bookSessionHandler(session: Session) {
//   //   setPendingSession(session);
//   //   showModal(
//   //     "confirm",
//   //     "Book session?",
//   //     session.price && session.price > 0
//   //       ? `This session costs ₹${session.price}. Do you want to proceed?`
//   //       : "This session is free. Do you want to book it?",
//   //     () => handleBook(session)
//   //   );
//   // }
//   function bookSessionHandler(session: Session) {
//   setPendingSession(session);
//   showModal(
//     "confirm",
//     "Book session?",
//     session.price && session.price > 0
//       ? `This session costs ₹${session.price}. Do you want to proceed?`
//       : "This session is free. Do you want to book it?",
//     () => handleBook(session)
//   );
// }

//   async function handleBook(session: Session) {
//     // setModalOpen(false);
//     try {
//           const res = await axiosInstance.post("/booking", { sessionId: session.id });
//       // If session is paid, get frontend payment info
//       const paymentIdFromBackend = res.data?.data?.paymentId;
//       currentPaymentId.current = paymentIdFromBackend;

//       if (session.price && session.price > 0 && res.data?.data?.razorpayOrderId) {
//         // Paid session – open Razorpay
//         if (!window.Razorpay) {
//           showModal("error", "Error", "Payment system unavailable.");
//           return;
//         }
//         const options = {
//           key: "rzp_test_RJOPcKkNT9WFC7",
//           amount: session.price * 100,
//           currency: "INR",
//           name: "SkillAura",
//           description: "Session Booking Payment",
//           order_id: res.data.data.razorpayOrderId,
//           handler: async function (response: any) {
//             try {
//               await axiosInstance.post("/payment/verify", {
//                 PaymentId: currentPaymentId.current,
//                 RazorpayPaymentId: response.razorpay_payment_id,
//                 RazorpayOrderId: response.razorpay_order_id,
//                 RazorpaySignature: response.razorpay_signature
//               });
//                showModal(
//       "success",
//       "Booked Successfully",
//       "Your booking was successful.",
//       () => {
//         fetchUserBookings();
//         closeModal();
//       }
//     );
//   } catch (err: any) {
//     showModal(
//       "error",
//       "Booking Failed",
//       err.response?.data?.message || "Booking failed.",
//       closeModal
//     );
//             }
//           },
//           modal: {
//             ondismiss: () => {
//               showModal(
//                 "error",
//                 "Payment Cancelled",
//                 "Payment was cancelled.",
//                 closeModal
//               );
//             }
//           }
//         };
//         const rzp = new window.Razorpay(options);
//         rzp.open();
//       } else {
//         // Free session booked
//         showModal(
//           "success",
//           "Booked Successfully",
//           "Your booking was successful.",
//           () => {
//             fetchUserBookings();
//             closeModal();
//           }
//         );
//       }
//     } catch (err: any) {
//       showModal(
//         "error",
//         "Booking Failed",
//         err.response?.data?.message || "Booking failed.",
//         closeModal
//       );
//     }
//   }

//   if (loading) {
//     return <div className="text-center">Loading sessions...</div>;
//   }

//   const now = new Date();
//   const upcoming = sessions.filter(session => !session.isCompleted && new Date(session.scheduledAt) > now);

//   return (
//     <div>
//       <div className="font-semibold text-lg mb-5">Upcoming Sessions</div>
//       <div className="flex flex-col gap-4">
//         {upcoming.length === 0 && (
//           <div className="text-gray-400 text-center py-6">No upcoming sessions available.</div>
//         )}
//         {upcoming.map(session => (
//           <div
//             key={session.id}
//             className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
//           >
//             <div>
//               <div className="text-indigo-700 font-bold text-base mb-1">
//                 {session.skill?.skillName || "Untitled Session"}
//               </div>
//               <div className="text-gray-600 text-sm mb-1">{session.notes}</div>
//               <div className="text-gray-500 text-xs mt-1">
//                 {new Date(session.scheduledAt).toLocaleString()}
//               </div>
//               {session.price != null && (
//                 <div className="text-green-600 font-semibold mt-1 text-sm">
//                   Price: ₹{session.price}
//                 </div>
//               )}
//             </div>
//             {bookedSessionIds.has(session.id) ? (
//               <span className="ml-6 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-bold border border-green-400 cursor-not-allowed">
//                 Booked
//               </span>
//             ) : (
//               <button
//                 onClick={() => bookSessionHandler(session)}
//                 className="ml-6 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
//               >
//                 Book
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//       <CommonModal
//         isOpen={modalOpen}
//         type={modalType}
//         title={modalTitle}
//         message={modalMessage}
//         onConfirm={onModalConfirm}
//         onCancel={closeModal}
//         confirmText={modalType === "confirm" ? "Book" : "OK"}
//         cancelText="Cancel"
//       />
//     </div>
//   );
// }


import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import CommonModal, { type ModalType } from "../CommonModal";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Session {
  id: number;
  skill?: { skillName: string };
  notes?: string;
  scheduledAt: string;
  price?: number;
  isCompleted?: boolean;
}

export default function MentorSessionsTab({
  mentorId,
  userId // pass logged in user's id as prop
}: { mentorId: number; userId: any }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [bookedSessionIds, setBookedSessionIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("confirm");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [onModalConfirm, setOnModalConfirm] = useState<(() => void) | undefined>(undefined);

  const currentPaymentId = useRef<number | null>(null);

  useEffect(() => {
    fetchSessions();
    fetchUserBookings();
    // eslint-disable-next-line
  }, [mentorId]);

  async function fetchSessions() {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/sessions/mentor/${mentorId}`);
      setSessions(res.data.data.$values ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserBookings() {
    try {
      const res = await axiosInstance.get(`/booking/user/${userId}`);
      if (res.data?.success) {
        const bookedIds: number[] = (res.data?.data?.$values ?? [])
          .filter((b: any) => !b.isCancelled)
          .map((b: any) => b.sessionId)
          .filter((id: number | null) => id !== null) as number[];
        setBookedSessionIds(new Set(bookedIds));
      }
    } catch {
      setBookedSessionIds(new Set());
    }
  }

  function showModal(
    type: ModalType,
    title: string,
    message: string,
    onConfirm?: () => void
  ) {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setOnModalConfirm(() => onConfirm); // important: wrap in function
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setOnModalConfirm(undefined);
  }

  function bookSessionHandler(session: Session) {
    showModal(
      "confirm",
      "Book session?",
      session.price && session.price > 0
        ? `This session costs ₹${session.price}. Do you want to proceed?`
        : "This session is free. Do you want to book it?",
      () => handleBook(session)
    );
  }

  async function handleBook(session: Session) {
    setModalOpen(false); // Close confirm modal immediately after clicking "Book"
    try {
      const res = await axiosInstance.post("/booking", { sessionId: session.id });
      const paymentIdFromBackend = res.data?.data?.paymentId;
      currentPaymentId.current = paymentIdFromBackend;
        console.log(res)
      if (session.price && session.price > 0 && res.data?.data?.razorpayOrderId) {
        // Paid session – open Razorpay
        if (!window.Razorpay) {
          showModal("error", "Error", "Payment system unavailable.");
          return;
        }
        const options = {
          key: "rzp_test_RJOPcKkNT9WFC7",
          amount: session.price * 100,
          currency: "INR",
          name: "SkillAura",
          description: "Session Booking Payment",
          order_id: res.data.data.razorpayOrderId,
          handler: async function (response: any) {
            try {
              await axiosInstance.post("/payment/verify", {
                PaymentId: currentPaymentId.current,
                RazorpayPaymentId: response.razorpay_payment_id,
                RazorpayOrderId: response.razorpay_order_id,
                RazorpaySignature: response.razorpay_signature
              });
              showModal(
                "success",
                "Booked Successfully",
                "Your booking was successful.",
                () => {
                  fetchUserBookings();
                  closeModal();
                }
              );
            } catch (err: any) {
              showModal(
                "error",
                "Payment Failed",
                err.response?.data?.message || "Payment verification failed.",
                closeModal
              );
            }
          },
          modal: {
            ondismiss: () => {
              showModal(
                "error",
                "Payment Cancelled",
                "Payment was cancelled.",
                closeModal
              );
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Free session booked
        showModal(
          "success",
          "Booked Successfully",
          "Your booking was successful.",
          () => {
            fetchUserBookings();
            closeModal();
          }
        );
      }
    } catch (err: any) {
      showModal(
        "error",
        "Booking Failed",
        err.response?.data?.message || "Booking failed.",
        closeModal
      );
    }
  }

  if (loading) {
    return <div className="text-center">Loading sessions...</div>;
  }

  const now = new Date();
  const upcoming = sessions.filter(
    session => !session.isCompleted && new Date(session.scheduledAt) > now
  );

  return (
    <div>
      <div className="font-semibold text-lg mb-5">Upcoming Sessions</div>
      <div className="flex flex-col gap-4">
        {upcoming.length === 0 && (
          <div className="text-gray-400 text-center py-6">No upcoming sessions available.</div>
        )}
        {upcoming.map(session => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
          >
            <div>
              <div className="text-indigo-700 font-bold text-base mb-1">
                {session.skill?.skillName || "Untitled Session"}
              </div>
              <div className="text-gray-600 text-sm mb-1">{session.notes}</div>
              <div className="text-gray-500 text-xs mt-1">
                {new Date(session.scheduledAt).toLocaleString()}
              </div>
              {session.price != null && (
                <div className="text-green-600 font-semibold mt-1 text-sm">
                  Price: ₹{session.price}
                </div>
              )}
            </div>
            {bookedSessionIds.has(session.id) ? (
              <span className="ml-6 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-bold border border-green-400 cursor-not-allowed">
                Booked
              </span>
            ) : (
              <button
                onClick={() => bookSessionHandler(session)}
                className="ml-6 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
              >
                Book
              </button>
            )}
          </div>
        ))}
      </div>
      <CommonModal
        isOpen={modalOpen}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        onConfirm={onModalConfirm ? () => onModalConfirm() : undefined}
        onCancel={() => closeModal()}
        confirmText={modalType === "confirm" ? "Book" : "OK"}
        cancelText="Cancel"
      />
    </div>
  );
}

