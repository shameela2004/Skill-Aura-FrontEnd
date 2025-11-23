import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import AboutTab from "../../components/MentorProfile/AboutTab";
import SkillsTab from "../../components/MentorProfile/SkillsTab";
import PortfolioTab from "../../components/MentorProfile/PostsTab";
import ReviewsTab from "../../components/MentorProfile/ReviewsTab";
import MentorSessionsTab from "../../components/MentorProfile/SessionsTab";
import { useAuth } from "../../context/AuthContext";

const TABS = ["About", "Skills", "Portfolio", "Session", "Reviews"];

interface Post {
  postId: number;
  userId: number;
  userName: string;
  userProfilePictureUrl:string;
  content: string;
  mediaUrl?: string;
  likeCount: number;
  commentCount: number;
  hasLiked: boolean;
  createdAt: string;
}

export default function MentorProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [mentor, setMentor] = useState<any>(null);
  const [mentorPosts, setMentorPosts] = useState<Post[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "none" | "pending" | "connected"
  >("none");
  const [connectionCount, setConnectionCount] = useState<number>(0);
  const [pendingConnectionCount, setPendingConnectionCount] = useState<number>(0);
  const [loadingConnectionStatus, setLoadingConnectionStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("About");
  const navigate=useNavigate();

  // Fetch mentor base info
  useEffect(() => {
    if (!id) return;
    axiosInstance.get(`/user/${id}`).then((res) => setMentor(res.data.data));
  }, [id]);

  // Fetch mentor posts with hasLiked info
  useEffect(() => {
    if (!id) return;
    axiosInstance
      .get(`/post/user/${id}`, {
        params: { page: 1, pageSize: 20 },
      })
      .then((res) => {
        setMentorPosts(res.data.data?.$values ?? res.data.data ?? []);
      });
  }, [id]);

  // Fetch connections count and pending count
  useEffect(() => {
    if (!user?.id) return;

    const fetchCounts = async () => {
      try {
        const connRes = await axiosInstance.get("/connection/connections/count");
        const pendRes = await axiosInstance.get("/connection/connections/pending/count");
        setConnectionCount(connRes.data.data ?? 0);
        setPendingConnectionCount(pendRes.data.data ?? 0);
      } catch {
        setConnectionCount(0);
        setPendingConnectionCount(0);
      }
    };

    fetchCounts();
  }, [user?.id]);

  // Fetch connection status (accepted or pending sent/received)
  useEffect(() => {
    if (!user?.id || !mentor?.id) return;

    const fetchConnectionStatus = async () => {
      setLoadingConnectionStatus(true);
      try {
        // Accepted connections
        const res = await axiosInstance.get("/connection/connections");
        const connections = res.data.data?.$values ?? res.data.data ?? [];
        const isConnected = connections.some((c: any) => c.userId === mentor.id);

        // Pending requests received and sent
        const pendingReceivedRes = await axiosInstance.get("/connection/connections/pending");
        const pendingReceived = pendingReceivedRes.data.data?.$values ?? [];

        const pendingSentRes = await axiosInstance.get("/connection/connections/pendingRequests");
        const pendingSent = pendingSentRes.data.data?.$values ?? [];

        const isPending =
          pendingReceived.some((p: any) => p.userId === mentor.id) ||
          pendingSent.some((p: any) => p.userId === mentor.id);

        if (isConnected) setConnectionStatus("connected");
        else if (isPending) setConnectionStatus("pending");
        else setConnectionStatus("none");
      } catch {
        setConnectionStatus("none");
      }
      setLoadingConnectionStatus(false);
    };

    fetchConnectionStatus();
  }, [user?.id, mentor?.id]);

  if (!mentor)
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <img
            src={`https://localhost:7027${mentor.profilePictureUrl}` || "/default-avatar.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover mr-4"
          />
          <div className="flex-1">
            <div className="text-2xl font-bold">{mentor.name}</div>
            <div className="text-sm text-gray-500">{mentor.location}</div>
            <div className="text-xs text-indigo-500">
              {mentor.role} &middot; {mentor.mentorStatus}
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
              <div>{connectionCount} Connections</div>
              {/* {pendingConnectionCount > 0 && (
                <div className="text-yellow-600 font-semibold">
                  {pendingConnectionCount} Pending
                </div>
              )} */}
            </div>
          </div>

          {user?.id !== mentor?.id && (
            <div className="mt-4 ml-4">
              {connectionStatus === "none" && (
                <button
                  disabled={loadingConnectionStatus}
                  onClick={async () => {
                    try {
                      await axiosInstance.post(`/connection/connect/${mentor.id}`);
                      // Re-fetch status after sending request
                      // Could show a toast/notification here
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
          onClick={() => navigate(`/chat/${mentor.id}`)}
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
          {TABS.map((tab) => (
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

        {/* Tab Content */}
        {activeTab === "About" && <AboutTab mentor={mentor} />}
        {activeTab === "Skills" && <SkillsTab skills={mentor.skills?.$values ?? []} />}
        {activeTab === "Portfolio" && (
          <PortfolioTab posts={mentorPosts} loggedInUserId={user?.id} />
        )}
        {activeTab === "Session" && (
          <MentorSessionsTab mentorId={mentor.id} userId={user?.id} />
        )}
        {activeTab === "Reviews" && <ReviewsTab mentorId={mentor.id} />}
      </div>
    </div>
  );
}
