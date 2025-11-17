// // import React, { useState } from "react";
// // import { FiEdit3 } from "react-icons/fi";
// // import EditProfileSection from "./EditProfileSection";
// // import {  FaLocationDot } from "react-icons/fa6";

// // interface Props {
// //   user: any;
// //   onProfileUpdated: () => void;
// // }

// // const ProfileHeader: React.FC<Props> = ({ user, onProfileUpdated }) => {
// //   const [isEditing, setIsEditing] = useState(false);

// //   return (
// //     <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 sm:p-8 transition-all">
// //       <div className="flex items-center justify-between flex-wrap gap-4">
// //         <div className="flex items-center gap-6">
// //           <img
// //             src={user.profilePictureUrl || "/default-avatar.png"}
// //             alt="Profile"
// //             className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover"
// //           />
// //           <div>
// //             <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
// //             <p className="text-red-600 text-sm capitalize">{user.role}</p>
// //             <p className="text-gray-500 mt-1 flex items-center gap-1"><FaLocationDot/>{user.location}</p>
// //             <p className="text-gray-500 mt-1">{user.bio || "No bio yet."}</p>
// //           </div>
// //         </div>

// //         <button
// //           onClick={() => setIsEditing(true)}
// //           className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-sm"
// //         >
// //           <FiEdit3 /> Edit Profile
// //         </button>
// //       </div>

// //       {/* Show edit section */}
// //       {isEditing && (
// //         <EditProfileSection
// //   user={user}
// //   onProfileUpdated={() => {
// //     setIsEditing(false);
// //     onProfileUpdated();
// //   }}
// //   onClose={() => setIsEditing(false)}
// // />

// //       )}
// //     </div>
// //   );
// // };

// // export default ProfileHeader;

// import React, { useState, useRef } from "react";
// import { FiEdit3 } from "react-icons/fi";
// import EditProfileSection from "./EditProfileSection";
// import { FaLocationDot } from "react-icons/fa6";
// import axiosInstance from "../../services/axiosInstance";

// interface Props {
//   user: any;
//   onProfileUpdated: () => void;
// }

// const ProfileHeader: React.FC<Props> = ({ user, onProfileUpdated }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const hiddenFileInput = useRef<HTMLInputElement>(null);

//   const handleImageClick = () => {
//     hiddenFileInput.current?.click();
//   };

//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const file = event.target.files[0];
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("referenceType", "UserProfile");
//       formData.append("referenceId", user.id);

//       try {
//         await axiosInstance.post("/media/upload", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         onProfileUpdated(); // Refresh profile after upload
//       } catch (error) {
//         console.error("Failed to upload profile picture", error);
//       }
//     }
//   };

//   return (
//     <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 sm:p-8 transition-all">
//       <div className="flex items-center justify-between flex-wrap gap-4">
//         <div className="flex items-center gap-6">
//       {/* <img
//   src={`${user.profilePictureUrl}?t=${Date.now()}`}
//   alt="Profile"
//   className="..."
//   onClick={handleImageClick}
// /> */}
// <img src={`https://localhost:7027${user.profilePictureUrl}`} alt="Profile"    className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover cursor-pointer"
//  onClick={handleImageClick} />


//           <input
//             type="file"
//             accept="image/*"
//             ref={hiddenFileInput}
//             onChange={handleFileChange}
//             style={{ display: "none" }}
//           />
//           <div>
//             <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
//             <p className="text-red-600 text-sm capitalize">{user.role}</p>
//             <p className="text-gray-500 mt-1 flex items-center gap-1">
//               <FaLocationDot />
//               {user.location}
//             </p>
//             <p className="text-gray-500 mt-1">{user.bio || "No bio yet."}</p>
//           </div>
//         </div>

//         <button
//           onClick={() => setIsEditing(true)}
//           className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-sm"
//         >
//           <FiEdit3 /> Edit Profile
//         </button>
//       </div>

//       {/* Show edit section */}
//       {isEditing && (
//         <EditProfileSection
//           user={user}
//           onProfileUpdated={() => {
//             setIsEditing(false);
//             onProfileUpdated();
//           }}
//           onClose={() => setIsEditing(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default ProfileHeader;

import React, { useState, useRef } from "react";
import { FiEdit3 } from "react-icons/fi";
import EditProfileSection from "./EditProfileSection";
import { FaLocationDot } from "react-icons/fa6";
import axiosInstance from "../../services/axiosInstance";
import CommonModal from "../CommonModal";

interface Props {
  user: any;
  onProfileUpdated: () => void;
}

const ProfileHeader: React.FC<Props> = ({ user, onProfileUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("referenceType", "UserProfile");
      formData.append("referenceId", user.id);

      try {
        await axiosInstance.post("/media/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onProfileUpdated(); // Refresh profile after upload
      } catch (error) {
        console.error("Failed to upload profile picture", error);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 sm:p-8 transition-all">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28">
            <img
              src={`https://localhost:7027${user.profilePictureUrl}`|| "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover"
            />
            <button
              className="absolute bottom-3 right-3 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-indigo-700 border-2 border-white"
              title="Update Profile Photo"
              onClick={handleImageButtonClick}
              style={{ zIndex: 2 }}
            >
              +
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-red-600 text-sm capitalize">{user.role}</p>
            <p className="text-gray-500 mt-1 flex items-center gap-1">
              <FaLocationDot />
              {user.location}
            </p>
            <p className="text-gray-500 mt-1">{user.bio || "No bio yet."}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-sm"
        >
          <FiEdit3 /> Edit Profile
        </button>
      </div>

      {/* Show confirmation modal */}
      <CommonModal
        isOpen={showModal}
        type="confirm"
        title="Change Profile Photo?"
        message="Would you like to update your profile image?"
        confirmText="Yes, update"
        cancelText="Cancel"
        onConfirm={() => {
          setShowModal(false);
          if (hiddenFileInput.current) hiddenFileInput.current.click();
        }}
        onCancel={() => setShowModal(false)}
      />

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={hiddenFileInput}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Show edit section */}
      {isEditing && (
        <EditProfileSection
          user={user}
          onProfileUpdated={() => {
            setIsEditing(false);
            onProfileUpdated();
          }}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default ProfileHeader;
