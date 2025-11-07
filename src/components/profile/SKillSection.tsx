import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import axiosInstance from "../../services/axiosInstance";

interface Skill {
  skillId: number;
  skillName: string;
  type: "Learning" | "Teaching";
}

interface Props {
  user: any;
}

const SkillsSection: React.FC<Props> = ({ user }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeType, setActiveType] = useState<"Learning" | "Teaching">("Learning");
  const [allSkills, setAllSkills] = useState<any[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");

  // Determine available tabs dynamically
  const availableTabs: ("Learning" | "Teaching")[] = ["Learning"];
  if (user?.role === "Mentor") availableTabs.push("Teaching");

  // Normalize backend responses
  const normalizeSkills = (data: any[], type: "Learning" | "Teaching"): Skill[] => {
    return (
      data?.map((s) => ({
        skillId: s.skillId ?? s.id,
        skillName: s.skillName ?? s.name,
        type: type,
      })) ?? []
    );
  };

  // Fetch user skills
  const fetchUserSkills = async () => {
    try {
      const learnRes = await axiosInstance.get("/skill/user"); // Learning skills
      let combined = normalizeSkills(learnRes.data?.data?.$values ?? [], "Learning");

      // Only fetch teaching skills if user is mentor
      if (user?.role === "Mentor") {
        const teachRes = await axiosInstance.get("/skill/my/teaching-skills");
        const teachValues = teachRes.data?.data?.$values ?? [];
        combined = [...combined, ...normalizeSkills(teachValues, "Teaching")];
      }

      setSkills(combined);
    } catch (err) {
      console.error("Error loading user skills", err);
    }
  };

  // Fetch all available skills
  const fetchAllSkills = async () => {
    try {
      const res = await axiosInstance.get("/skill");
      const values = res.data?.data?.$values ?? [];
      setAllSkills(values);
    } catch (err) {
      console.error("Error loading skills", err);
    }
  };

  useEffect(() => {
    fetchUserSkills();
    fetchAllSkills();
  }, [user]);

  // Add a skill
  const handleAddSkill = async () => {
    if (!selectedSkill) return;
    try {
      const res = await axiosInstance.post("/skill/user", {
        skillId: parseInt(selectedSkill),
        type: activeType,
      });

      if (res.data?.success) {
        await fetchUserSkills();
      }

      setSelectedSkill("");
    } catch (err) {
      console.error("Failed to add skill", err);
    }
  };

  // Delete a skill
  const handleDeleteSkill = async (skillId: number) => {
    try {
      await axiosInstance.delete(`/skill/user/${skillId}`);
      setSkills((prev) => prev.filter((s) => s.skillId !== skillId));
    } catch (err) {
      console.error("Failed to delete skill", err);
    }
  };

  const filteredSkills = skills.filter(
    (s) => s.type?.toLowerCase() === activeType.toLowerCase()
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl border border-white/10 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold tracking-wide">Your Skills</h2>

        {/* Tab Buttons */}
        <div className="flex gap-2 bg-white/10 p-1 rounded-xl border border-white/10">
          {availableTabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeType === t
                  ? "bg-indigo-600 shadow-md text-white"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Cards */}
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.skillId}
              className="group bg-white/[0.05] p-5 rounded-xl border border-white/10 hover:border-indigo-500/50 hover:scale-[1.03] transition-all duration-300 flex justify-between items-center"
            >
              <p className="font-medium text-lg">{skill.skillName}</p>
              <button
                onClick={() => handleDeleteSkill(skill.skillId)}
                className="text-red-400 hover:text-red-500 opacity-70 group-hover:opacity-100 transition"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic text-center py-6">
          No {activeType} skills added yet.
        </p>
      )}

      {/* Add Skill Section */}
      {activeType === "Learning" || user?.role === "Mentor" ? (
        <div className="mt-10 border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold mb-3">
            Add a {activeType} Skill
          </h3>
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-white/[0.08] border border-white/20 rounded-lg px-4 py-2 text-white outline-none"
            >
              <option value="">Select a Skill</option>
              {allSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAddSkill}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg font-medium transition-all"
            >
              <FiPlus size={18} /> Add
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SkillsSection;
