import React, { useState, useEffect } from "react";
import CommonModal from "../../components/CommonModal";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function BecomeMentorPage() {
  const { user, applyForMentor, fetchMentorStatus } = useAuth();
  const [form, setForm] = useState({
    phoneNumber: user?.phoneNumber || "",
    aadhaarImageUrl: user?.aadhaarImageUrl || "",
    socialProfileUrl: user?.socialProfileUrl || "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");

  // Refresh mentor status on mount
  useEffect(() => {
    if (user) fetchMentorStatus();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await applyForMentor(form);
      setModalType("success");
      setShowModal(true);
    } catch {
      setModalType("error");
      setShowModal(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Become a Mentor</h2>

      {/* Case 1: Approved */}
      {user?.mentorStatus === "Approved" && (
        <div className="text-green-600 font-semibold">
          ✅ Your mentor application is approved!
        </div>
      )}

      {/* Case 2: Pending */}
      {user?.mentorStatus === "Pending" && (
        <div className="text-yellow-600 font-semibold">
          ⏳ Your mentor application is under review.
        </div>
      )}

      {/* Case 3: No application yet */}
      {user?.mentorStatus === "None" && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Phone Number"
            className="border rounded p-2"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Aadhaar Image URL"
            className="border rounded p-2"
            value={form.aadhaarImageUrl}
            onChange={(e) => setForm({ ...form, aadhaarImageUrl: e.target.value })}
          />
          <input
            type="text"
            placeholder="Social Profile URL"
            className="border rounded p-2"
            value={form.socialProfileUrl}
            onChange={(e) => setForm({ ...form, socialProfileUrl: e.target.value })}
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white rounded-lg py-2 hover:bg-indigo-600"
          >
            Apply
          </button>
        </form>
      )}

      <CommonModal
        isOpen={showModal}
        type={modalType}
        title={modalType === "success" ? "Application Submitted" : "Error"}
        message={
          modalType === "success"
            ? "Your mentor application has been submitted successfully!"
            : "Something went wrong. Please try again."
        }
        onConfirm={() => {
          setShowModal(false);
          fetchMentorStatus();
        }}
      />
    </div>
  );
}
