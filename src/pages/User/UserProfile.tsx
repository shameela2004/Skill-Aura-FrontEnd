import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import AboutTab from "../../components/MentorProfile/AboutTab";
import SkillsTab from "../../components/MentorProfile/SkillsTab";
import PortfolioTab from "../../components/MentorProfile/PostsTab";
import ReviewsTab from "../../components/MentorProfile/ReviewsTab";
import MentorSessionsTab from "../../components/MentorProfile/SessionsTab"; // optionally
import { useAuth } from "../../context/AuthContext";

const TABS = ["About", "Skills", "Portfolio", "Session", "Reviews"];

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [profileUser, setProfileUser] = useState<any>(null);
  const [profilePosts, setProfilePosts] = useState([]);
  const [activeTab, setActiveTab] = useState("About");
  const [isMentor, setIsMentor] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"none" | "pending" | "connected">("none");
  const [loadingConnectionStatus, setLoadingConnectionStatus] = useState(false);
  const navigate=useNavigate();

  useEffect(() => {
    if (!id) return;
    axiosInstance.get(`/user/${id}`).then((res) => {
      setProfileUser(res.data.data);
      setIsMentor(res.data.data.role === "Mentor");
    });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    axiosInstance
      .get(`/post/user/${id}`, { params: { page: 1, pageSize: 20 } })
      .then((res) => setProfilePosts(res.data.data?.$values ?? res.data.data ?? []));
  }, [id]);
  
   // NEW: Fetch connection status between logged-in user and profile user
  useEffect(() => {
    if (!user?.id || !profileUser?.id) return;

    const fetchConnectionStatus = async () => {
      setLoadingConnectionStatus(true);
      try {
        const res = await axiosInstance.get("/connection/connections");
        const connections = res.data.data?.$values ?? res.data.data ?? [];
        const isConnected = connections.some((c: any) => c.userId === profileUser.id);

        const pendingReceivedRes = await axiosInstance.get("/connection/connections/pending");
        const pendingReceived = pendingReceivedRes.data.data?.$values ?? [];

        const pendingSentRes = await axiosInstance.get("/connection/connections/pendingRequests");
        const pendingSent = pendingSentRes.data.data?.$values ?? [];

        const isPending =
          pendingReceived.some((p: any) => p.userId === profileUser.id) ||
          pendingSent.some((p: any) => p.userId === profileUser.id);

        if (isConnected) setConnectionStatus("connected");
        else if (isPending) setConnectionStatus("pending");
        else setConnectionStatus("none");
      } catch {
        setConnectionStatus("none");
      }
      setLoadingConnectionStatus(false);
    };

    fetchConnectionStatus();
  }, [user?.id, profileUser?.id]);
  if (!profileUser) return <div>Loading...</div>;

  // Filter tabs for non-mentors if desired
  const filteredTabs = isMentor ? TABS : TABS.filter(t => t !== "Session");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <img
            src={`https://localhost:7027${profileUser.profilePictureUrl}` || "/default-avatar.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover mr-4"
          />
          <div className="flex-1">
            <div className="text-2xl font-bold">{profileUser.name}</div>
            <div className="text-sm text-gray-500">{profileUser.location}</div>
            <div className="text-xs text-indigo-500">{profileUser.role}</div>
          </div>
           {/* NEW: Show buttons conditionally */}
          {user?.id !== profileUser.id && (
            <div className="ml-4 flex items-center gap-4">
              {connectionStatus === "none" && (
                <button
                  disabled={loadingConnectionStatus}
                  onClick={async () => {
                    try {
                      await axiosInstance.post(`/connection/connect/${profileUser.id}`);
                      setConnectionStatus("pending");
                    } catch {
                      alert("Failed to send connection request");
                    }
                  }}
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Connect
                </button>
              )}
              {connectionStatus === "pending" && (
                <button
                  disabled
                  className="px-4 py-2 rounded bg-yellow-400 text-white cursor-not-allowed"
                >
                  Request Sent
                </button>
              )}
              {connectionStatus === "connected" && (
                <>
                  <button
                    disabled
                    className="px-4 py-2 rounded bg-green-600 text-white cursor-not-allowed"
                  >
                    Connected
                  </button>

                  <button
                    onClick={() => navigate(`/chat/${profileUser.id}`)}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Message
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          {filteredTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-6 font-medium ${
                activeTab === tab
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "About" && <AboutTab mentor={profileUser} />}
        {activeTab === "Skills" && <SkillsTab skills={profileUser.skills?.$values ?? []} />}
        {activeTab === "Portfolio" && (
          <PortfolioTab posts={profilePosts} loggedInUserId={user?.id} />
        )}
        {activeTab === "Session" && isMentor && (
          <MentorSessionsTab mentorId={profileUser.id} userId={user?.id} />
        )}
        {activeTab === "Reviews" && <ReviewsTab mentorId={profileUser.id} />}
      </div>
    </div>
  );
}
