import React from "react";
import AvailabilityTab from "./AvailabilityTab";

export default function AboutTab({mentor}: {mentor: any}) {
  return (
    <div>
      <div className="font-semibold">Bio</div>
      <div className="mb-4">{mentor.bio}</div>
      <div className="font-semibold">Location</div>
      <div className="mb-4">{mentor.location}</div>
      <div className="font-semibold">Languages</div>
      <div className="mb-4">
        {(mentor.languages?.$values ?? []).map((lang: any) =>
          <span key={lang.languageId} className="mr-2">
            {lang.languageName} <span className="text-gray-500">({lang.proficiency})</span>
          </span>
        )}
      </div>
      <div className="font-semibold">Availability</div>
      <div>
        {/* {(mentor.mentorAvailabilities?.$values ?? []).map((slot: any, idx: number) => (
          <div key={idx}>Day {slot.dayOfWeek}: {slot.startTime} - {slot.endTime}</div>
        ))} */}
     <AvailabilityTab availabilities={mentor.mentorAvailabilities?.$values ?? []} />
        
       
      </div>
    </div>
  );
}
