import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";

interface ConnectionDto {
  connectionId: number;
  userId: number;       // The other user's ID
  userName: string;
  status: string;       // "Accepted", "Pending"
  createdAt: string;
}

const TABS = ["Pending Requests", "Connected Users"];

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);
  const [connections, setConnections] = useState<ConnectionDto[]>([]);
  const [pendingConnections, setPendingConnections] = useState<ConnectionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Fetch both accepted and pending connections
  const fetchConnections = async () => {
    setLoading(true);
    try {
      const connRes = await axiosInstance.get("/connection/connections");
      const pendRes = await axiosInstance.get("/connection/connections/pending");
      setConnections(connRes.data.data?.$values ?? connRes.data.data ?? []);
      setPendingConnections(pendRes.data.data?.$values ?? pendRes.data.data ?? []);
    } catch {
      setConnections([]);
      setPendingConnections([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleAccept = async (connectionId: number) => {
    setActionLoading(connectionId);
    try {
      await axiosInstance.post(`/connection/connect/accept/${connectionId}`);
      await fetchConnections();
    } catch {
      alert("Failed to accept connection");
    }
    setActionLoading(null);
  };

  const handleReject = async (connectionId: number) => {
    setActionLoading(connectionId);
    try {
      await axiosInstance.post(`/connection/connect/reject/${connectionId}`);
      await fetchConnections();
    } catch {
      alert("Failed to reject connection");
    }
    setActionLoading(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">My Connections</h1>

      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`py-2 px-6 border-b-2 ${
              activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-600"
            } font-semibold`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {loading ? (
        <div>Loading connections...</div>
      ) : (
        <>
          {activeTab === "Pending Requests" && (
            <>
              {pendingConnections.length === 0 ? (
                <p className="text-gray-500">No pending connection requests.</p>
              ) : (
                <div className="space-y-4">
                  {pendingConnections.map((conn) => (
                    <div
                      key={conn.connectionId}
                      className="flex items-center justify-between border p-3 rounded mb-3 shadow-sm hover:shadow-md transition"
                    >
                      <span className="font-medium">{conn.userName}</span>
                      <div className="flex gap-3">
                        <button
                          disabled={actionLoading === conn.connectionId}
                          onClick={() => handleAccept(conn.connectionId)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                        >
                          {actionLoading === conn.connectionId ? "Accepting..." : "Accept"}
                        </button>
                        <button
                          disabled={actionLoading === conn.connectionId}
                          onClick={() => handleReject(conn.connectionId)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                        >
                          {actionLoading === conn.connectionId ? "Rejecting..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "Connected Users" && (
            <>
              {connections.length === 0 ? (
                <p className="text-gray-500">No connections found.</p>
              ) : (
                <ul className="space-y-3">
                  {connections.map((conn) => (
                    <li
                      key={conn.connectionId}
                      className="flex justify-between items-center border p-3 rounded shadow-sm"
                    >
                      <span>{conn.userName}</span>
                      <span className="text-sm text-gray-400">
                        Connected since {new Date(conn.createdAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
