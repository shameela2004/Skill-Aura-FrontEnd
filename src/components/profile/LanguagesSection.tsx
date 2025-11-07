import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import axiosInstance from "../../services/axiosInstance";

interface Language {
  languageId: number;
  languageName: string;
  proficiency: string;
}

interface Props {
  user: any;
}

const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Fluent", "Native"];

const LanguagesSection: React.FC<Props> = ({ user }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [allLanguages, setAllLanguages] = useState<{ id: number; name: string }[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [selectedProf, setSelectedProf] = useState<string>("");

  // Fetch user languages
  const fetchUserLanguages = async () => {
    if (!user?.id) return;

    try {
      const res = await axiosInstance.get(`/language/user/${user.id}`);
      // normalize backend $values
      const data = res.data?.data?.$values ?? [];
      const normalized: Language[] = data.map((l: any) => ({
        languageId: l.languageId ?? l.id,
        languageName: l.languageName ?? l.name,
        proficiency: l.proficiency ?? "",
      }));
      setLanguages(normalized);
    } catch (err) {
      console.error("Failed to fetch user languages", err);
    }
  };

  // Fetch all languages for dropdown
  const fetchAllLanguages = async () => {
    try {
      const res = await axiosInstance.get("/language");
      const data = res.data?.data?.$values ?? [];
      const normalized = data.map((l: any) => ({
        id: l.id,
        name: l.name,
      }));
      setAllLanguages(normalized);
    } catch (err) {
      console.error("Failed to fetch all languages", err);
    }
  };

  useEffect(() => {
    fetchUserLanguages();
    fetchAllLanguages();
  }, [user]);

  // Add language
  const handleAddLanguage = async () => {
    if (!selectedLang || !selectedProf) return;

    try {
      const res = await axiosInstance.post("/language/user", {
        languageId: parseInt(selectedLang),
        proficiency: selectedProf,
      });

      const addedLang = allLanguages.find((l) => l.id === parseInt(selectedLang));
      if (addedLang) {
        setLanguages((prev) => [
          ...prev,
          {
            languageId: addedLang.id,
            languageName: addedLang.name,
            proficiency: selectedProf,
          },
        ]);
      }

      setSelectedLang("");
      setSelectedProf("");
    } catch (err) {
      console.error("Failed to add language", err);
    }
  };

  // Delete language
  const handleDeleteLanguage = async (languageId: number) => {
    try {
      await axiosInstance.delete(`/language/user/${languageId}`);
      setLanguages((prev) => prev.filter((l) => l.languageId !== languageId));
    } catch (err) {
      console.error("Failed to delete language", err);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 p-8 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">Languages</h2>

      {/* Language List */}
      <div className="space-y-4">
        {languages.length > 0 ? (
          languages.map((lang) => (
            <div
              key={lang.languageId}
              className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <div>
                <p className="text-lg font-semibold">{lang.languageName}</p>
                <p className="text-sm text-gray-500">{lang.proficiency}</p>
              </div>
              <button
                onClick={() => handleDeleteLanguage(lang.languageId)}
                className="text-red-500 hover:text-red-600"
              >
                <FiTrash2 />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic text-center py-6">
            No languages added yet.
          </p>
        )}
      </div>

      {/* Add New Language */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold mb-2">Add New Language</h3>
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-white px-3 py-2 rounded-md border border-gray-200 outline-none"
          >
            <option value="">Select Language</option>
            {allLanguages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <select
            value={selectedProf}
            onChange={(e) => setSelectedProf(e.target.value)}
            className="bg-white px-3 py-2 rounded-md border border-gray-200 outline-none"
          >
            <option value="">Select Proficiency</option>
            {proficiencyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddLanguage}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-white font-medium transition-all"
          >
            <FiPlus /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagesSection;
