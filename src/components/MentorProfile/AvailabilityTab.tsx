import React from "react";

const daysOfWeek = [
  "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
];

export default function AvailabilityTab({ availabilities }: { availabilities: any[] }) {
  if (!availabilities.length) {
    return <div className="text-gray-400">No available slots set.</div>;
  }

  return (
    <div>
      {/* <div className="font-semibold text-lg mb-3">Mentor's Available Slots</div> */}
      <ul className="list-none p-0 m-0">
        {availabilities.map((slot: any, idx: number) => (
          <li key={idx} className="mb-3 p-3 rounded bg-green-50 border border-green-200">
            <span className="font-semibold">{daysOfWeek[slot.dayOfWeek]}</span>
            &nbsp;&ndash;&nbsp;
            <span className="inline-block px-2 py-1 bg-white rounded border">{slot.startTime}</span>
             ‐ 
            <span className="inline-block px-2 py-1 bg-white rounded border">{slot.endTime}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
