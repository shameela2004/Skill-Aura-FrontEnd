import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { FiTrash2, FiPlus } from "react-icons/fi";

interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const MentorAvailabilitySection = ({ userId }: { userId: number }) => {
  const [availability, setAvailability] = useState<Availability[]>([]);

  useEffect(() => {
    const fetchAvail = async () => {
      try {
        const res = await axiosInstance.get(`/mentor/${userId}/availability`);
        setAvailability(res.data.data || []);
      } catch (err) {
        console.error("Error fetching availability", err);
      }
    };
    fetchAvail();
  }, [userId]);

  const addSlot = () => {
    setAvailability([...availability, { dayOfWeek: 1, startTime: "09:00", endTime: "10:00" }]);
  };

  const removeSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Availability, value: any) => {
    const newSlots = [...availability];
    (newSlots[index] as any)[field] = value;
    setAvailability(newSlots);
  };

  const saveAvailability = async () => {
    try {
      await axiosInstance.put(`/mentor/${userId}/availability`, availability);
      alert("Availability updated!");
    } catch (err) {
      console.error("Failed to save availability", err);
    }
  };

  return (
    <div className="bg-white/[0.05] p-5 rounded-2xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Mentor Availability</h3>
        <button
          onClick={addSlot}
          className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
        >
          <FiPlus size={16} /> Add Slot
        </button>
      </div>

      <div className="space-y-3">
        {availability.map((slot, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-white/[0.04] p-3 rounded-xl border border-white/10"
          >
            <select
              value={slot.dayOfWeek}
              onChange={(e) => handleChange(index, "dayOfWeek", parseInt(e.target.value))}
              className="bg-white/[0.08] text-gray-200 rounded-lg px-2 py-1"
            >
              {days.map((day, i) => (
                <option key={i} value={i}>{day}</option>
              ))}
            </select>

            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => handleChange(index, "startTime", e.target.value)}
              className="bg-white/[0.08] text-gray-200 rounded-lg px-2 py-1"
            />

            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => handleChange(index, "endTime", e.target.value)}
              className="bg-white/[0.08] text-gray-200 rounded-lg px-2 py-1"
            />

            <button
              onClick={() => removeSlot(index)}
              className="text-red-400 hover:text-red-500"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={saveAvailability}
        className="mt-4 w-full bg-indigo-600 text-white rounded-xl py-2 hover:bg-indigo-500"
      >
        Save Availability
      </button>
    </div>
  );
};

export default MentorAvailabilitySection;
