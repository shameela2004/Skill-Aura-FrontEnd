import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import type { ModalType } from "../CommonModal";
import CommonModal from "../CommonModal";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type GroupSessionDto = {
  id: number;
  groupId: number;
  scheduledAt: string; // ISO format
  mode: string;
  notes?: string;
  price?: number;
  videoLink?: string;
  isCompleted: boolean;
};

type CreateOrEditSessionDto = {
  scheduledAt: string;
  mode: string;
  notes?: string;
  price?: number;
};

export default function SessionsTab({
  groupId,
  isMentor,
  userId
}: {
  groupId: number;
  isMentor: boolean;
  userId: number;
}) {
  const [sessions, setSessions] = useState<GroupSessionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const currentPaymentId = useRef<number | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bookedSessionIds, setBookedSessionIds] = useState<Set<number>>(new Set());

  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
  const [sessionForm, setSessionForm] = useState<CreateOrEditSessionDto>({
    scheduledAt: "",
    mode: "Online",
    notes: "",
    price: 0,
  });

  // Modals for create/edit/delete/complete/booking events
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("confirm");
  const [modalConfig, setModalConfig] = useState<{
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }>({});

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await axiosInstance.get(`/GroupSession/group/${groupId}`);
        setSessions(res.data?.data?.$values || []);
              fetchUserBookings()

      } catch {
        setSessions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, [groupId]);
  async function fetchUserBookings() {
  try {
    const res = await axiosInstance.get(`/Booking/user/${userId}`);
    if (res.data?.success) {
      // Extract GroupSessionId from bookings that are not cancelled.
   const bookedIds = res.data?.data?.$values
  ?.filter((b: any) => !b.isCancelled)
  ?.map((b: any) => b.groupSessionId)
  ?.filter((id: number | null) => id !== null) as number[];

setBookedSessionIds(new Set(bookedIds));

    }
  } catch (error) {
    // Optionally handle errors
    setBookedSessionIds(new Set());
  }
}


  function openSessionModal(isEdit: boolean, existing?: GroupSessionDto) {
    setIsEditing(isEdit);
    setEditingSessionId(isEdit && existing ? existing.id : null);
    setSessionForm(
      isEdit && existing
        ? {
            scheduledAt: existing.scheduledAt.slice(0, 16),
            mode: existing.mode,
            notes: existing.notes ?? "",
            price: existing.price ?? 0,
          }
        : { scheduledAt: "", mode: "Online", notes: "", price: 0 }
    );
    setShowSessionModal(true);
  }
  
  async function handleSessionFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEditing && editingSessionId) {
      try {
        await axiosInstance.put(`/GroupSession/${editingSessionId}`, sessionForm);
        setShowSessionModal(false);
        showModal("success", "Session updated", "Session updated successfully.");
        reloadSessions();
      } catch (err: any) {
        setShowSessionModal(false);
        showModal("error", "Error", err.response?.data?.message || "Update failed.");
      }
    } else {
      try {
        await axiosInstance.post("/GroupSession", { groupId, ...sessionForm });
        setShowSessionModal(false);
        showModal("success", "Session created", "Group session created successfully.");
        reloadSessions();
      } catch (err: any) {
        setShowSessionModal(false);
        showModal("error", "Error", err.response?.data?.message || "Creation failed.");
      }
    }
  }

  function showModal(type: ModalType, title: string, message: string, onConfirm?: () => void, confirmText?: string, cancelText?: string) {
    setModalType(type);
    setModalConfig({ title, message, onConfirm, confirmText, cancelText });
    setModalOpen(true);
  }

  async function reloadSessions() {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/GroupSession/group/${groupId}`);
      setSessions(res.data?.data?.$values || []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  function openDeleteModal(sessionId: number) {
    showModal(
      "confirm",
      "Delete session?",
      "Are you sure you want to delete this session? This cannot be undone.",
      async () => {
        setModalOpen(false);
        try {
          await axiosInstance.delete(`/GroupSession/${sessionId}`);
          showModal("success", "Deleted", "Session deleted.", () => setModalOpen(false));
          reloadSessions();
        } catch (err: any) {
          showModal("error", "Error", err.response?.data?.message || "Delete failed.", () => setModalOpen(false));
        }
      },
      "Delete",
      "Cancel"
    );
  }

  function openCompleteModal(sessionId: number) {
    showModal(
      "confirm",
      "Mark session completed?",
      "Are you sure you want to mark this session as completed?",
      async () => {
        setModalOpen(false);
        try {
          await axiosInstance.post(`/GroupSession/${sessionId}/complete`);
          showModal("success", "Completed", "Session marked as completed.", () => setModalOpen(false));
          reloadSessions();
        } catch (err: any) {
          showModal("error", "Error", err.response?.data?.message || "Failed to complete.", () => setModalOpen(false));
        }
      },
      "Complete",
      "Cancel"
    );
  }

async function openBookingModal(session: GroupSessionDto) {
  showModal(
    "confirm",
    "Book session?",
    session.price && session.price > 0
      ? `This session costs ₹${session.price}. Do you want to proceed?`
      : "This session is free. Do you want to book it?",
    async () => {
      setModalOpen(false);
      try {
        const res = await axiosInstance.post("/GroupSessionBooking/group-session", {
          sessionId: session.id
        });

        // Store paymentId in mutable ref for closure correctness
        const paymentIdFromBackend = res.data?.data?.paymentId;
        currentPaymentId.current = paymentIdFromBackend;

        if (session.price && session.price > 0) {
          const razorpayOrderId = res.data?.data?.razorpayOrderId;

          if (!window.Razorpay) {
            showModal("error", "Error", "Razorpay script not loaded.", () => setModalOpen(false));
            return;
          }

          const options = {
            key: "rzp_test_RJOPcKkNT9WFC7",
            amount: session.price * 100,
            currency: "INR",
            name: "SkillAura",
            description: "Session Booking Payment",
            order_id: razorpayOrderId,
            handler: async function (response: any) {
              try {
                await axiosInstance.post("/Payment/verify", {
                  PaymentId: currentPaymentId.current,
                  RazorpayPaymentId: response.razorpay_payment_id,
                  RazorpayOrderId: response.razorpay_order_id,
                  RazorpaySignature: response.razorpay_signature
                });
                showModal("success", "Payment Successful", "Your booking is confirmed.", () => setModalOpen(false));
              } catch {
                showModal("error", "Verification Failed", "Payment verification failed.", () => setModalOpen(false));
              }
            },
            modal: {
              ondismiss: () => {
                showModal("error", "Payment Cancelled", "Payment was cancelled.", () => setModalOpen(false));
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();

        } else {
          showModal("success", "Booked Successfully", "Your booking was successful.", () => setModalOpen(false));
        }
      } catch (err: any) {
        showModal("error", "Booking Failed", err.response?.data?.message || "Booking failed.", () => setModalOpen(false));
      }
    },
    "Book",
    "Cancel"
  );
}
//   // Modified booking to integrate Razorpay payment
//   async function openBookingModal(session: GroupSessionDto) {
//     showModal(
//       "confirm",
//       "Book session?",
//       session.price && session.price > 0
//         ? `This session costs ₹${session.price}. Do you want to proceed?`
//         : "This session is free. Do you want to book it?",
//       async () => {
//         setModalOpen(false);
//         try {
//           // Call backend booking api
//           const res = await axiosInstance.post("/GroupSessionBooking/group-session", {
//             sessionId: session.id
//           });
//           console.log(res)
//           // If price > 0, trigger Razorpay
//           if (session.price && session.price > 0) {
//             // Fetch Razorpay order id for this booking from backend API (you might need to add this)
//             const razorpayOrderId = res.data?.razorpayOrderId; // Adjust based on API

//             if (!window.Razorpay) {
//               showModal("error", "Error", "Razorpay script not loaded.", () => setModalOpen(false));
//               return;
//             }

//             const options = {
//               key: "rzp_test_RJOPcKkNT9WFC7", 
//               amount: session.price * 100, // in paise
//               currency: "INR",
//               name: "SkillAura",
//               description: "Session Booking Payment",
//               order_id: razorpayOrderId,
//               handler: async function (response: any) {
//                 try {
//                   // Verify payment with backend
//                   console.log({
//   PaymentId: currentPaymentId,
//   RazorpayPaymentId: response.razorpay_payment_id,
//   RazorpayOrderId: response.razorpay_order_id,
//   RazorpaySignature: response.razorpay_signature})
//                   await axiosInstance.post("/Payment/verify", {
//                      PaymentId: currentPaymentId,
//                     RazorpayPaymentId: response.razorpay_payment_id,
//                     RazorpayOrderId: response.razorpay_order_id,
//                     RazorpaySignature: response.razorpay_signature
//                   });
//                   showModal("success", "Payment Successful", "Your booking is confirmed.", () => setModalOpen(false));
//                 } catch {
//                   showModal("error", "Verification Failed", "Payment verification failed.", () => setModalOpen(false));
//                 }
//               },
//               modal: {
//                 ondismiss: () => {
//                   showModal("error", "Payment Cancelled", "Payment was cancelled.", () => setModalOpen(false));
//                 }
//               }
//             };

//             const rzp = new window.Razorpay(options);
//             rzp.open();
//           } else {
//             // Free session booked successfully
//             showModal("success", "Booked Successfully", "Your booking was successful.", () => setModalOpen(false));
//           }
//         } catch (err: any) {
//           showModal("error", "Booking Failed", err.response?.data?.message || "Booking failed.", () => setModalOpen(false));
//         }
//       },
//       "Book",
//       "Cancel"
//     );
//   }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-lg text-gray-700">Group Sessions</span>
        {isMentor && (
          <button
            onClick={() => openSessionModal(false)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Create Session
          </button>
        )}
      </div>

      {/* Create/Edit Session Modal */}
      {showSessionModal && (
        <div className="fixed z-20 inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg relative">
            <button onClick={() => setShowSessionModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 text-xl">×</button>
            <div className="text-lg font-semibold mb-4">{isEditing ? "Edit Group Session" : "Create Group Session"}</div>
            <form className="space-y-4" onSubmit={handleSessionFormSubmit}>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Scheduled At</label>
                <input
                  type="datetime-local"
                  value={sessionForm.scheduledAt}
                  onChange={e => setSessionForm({ ...sessionForm, scheduledAt: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Mode</label>
                <select
                  value={sessionForm.mode}
                  onChange={e => setSessionForm({ ...sessionForm, mode: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Notes</label>
                <input
                  type="text"
                  value={sessionForm.notes}
                  onChange={e => setSessionForm({ ...sessionForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price</label>
                <input
                  type="number"
                  value={sessionForm.price}
                  min={0}
                  onChange={e => setSessionForm({ ...sessionForm, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div className="flex justify-end mt-2">
                <button type="button" onClick={() => setShowSessionModal(false)} className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 mr-2">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">{isEditing ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Modal for confirm/success/error */}
      <CommonModal
        isOpen={modalOpen}
        type={modalType}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalOpen(false)}
      />

      {/* Sessions List Table */}
      {loading ? (
        <div className="text-gray-500">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="text-gray-500">No sessions found.</div>
      ) : (
        <table className="w-full border rounded-xl shadow-sm">
          <thead className="bg-indigo-50">
            <tr>
              <th className="text-left px-4 py-2 font-semibold text-gray-600">Date & Time</th>
              <th className="text-left px-4 py-2 font-semibold text-gray-600">Mode</th>
              <th className="text-left px-4 py-2 font-semibold text-gray-600">Notes</th>
              <th className="text-left px-4 py-2 font-semibold text-gray-600">Price</th>
              <th className="text-left px-4 py-2 font-semibold text-gray-600">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(ses => (
              <tr key={ses.id} className="border-b last:border-b-0">
                <td className="px-4 py-3">{new Date(ses.scheduledAt).toLocaleString()}</td>
                <td className="px-4 py-3">{ses.mode}</td>
                <td className="px-4 py-3">{ses.notes || "-"}</td>
                <td className="px-4 py-3">{ses.price ? `₹${ses.price}` : "Free"}</td>
                <td className="px-4 py-3">{ses.isCompleted ? "Completed" : "Upcoming"}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {isMentor && !ses.isCompleted && (
                    <>
                      <button onClick={() => openSessionModal(true, ses)} className="text-blue-600 hover:underline mr-2">Edit</button>
                      <button onClick={() => openDeleteModal(ses.id)} className="text-red-600 hover:underline mr-2">Delete</button>
                      <button onClick={() => openCompleteModal(ses.id)} className="text-green-600 hover:underline">Complete</button>
                    </>
                  )}
                 {!isMentor && !ses.isCompleted && (
    bookedSessionIds.has(ses.id)
    ? <span className="text-green-600 font-semibold">Booked</span>
    : <button onClick={() => openBookingModal(ses)} className="text-indigo-600 font-semibold hover:underline">Book</button>
  )}
  {ses.isCompleted && (
    <span className="text-gray-400 text-xs">Completed</span>
  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
