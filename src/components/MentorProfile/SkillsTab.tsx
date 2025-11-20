import React from "react";

export default function SkillsTab({ skills }: { skills: any[] }) {
  const teaching = skills.filter(skill => skill.type === "Teaching");
  const learning = skills.filter(skill => skill.type === "Learning");

  return (
    <div>
      <div className="font-semibold text-lg mb-2">Teaching Skills</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {teaching.length > 0 ? teaching.map(skill => (
          <span key={skill.skillId} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">{skill.skillName}</span>
        )) : <span className="text-gray-400">No teaching skills listed.</span>}
      </div>
      <div className="font-semibold text-lg mb-2">Learning Skills</div>
      <div className="flex flex-wrap gap-2">
        {learning.length > 0 ? learning.map(skill => (
          <span key={skill.skillId} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">{skill.skillName}</span>
        )) : <span className="text-gray-400">No learning skills listed.</span>}
      </div>
    </div>
  );
}
