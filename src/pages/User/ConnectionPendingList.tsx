import React from "react";

export interface ConnectionDto {
  connectionId: number;
  userId: number; // other user id
  userName: string;
  status: string;
  createdAt: string;
}

interface Props {
  pendingConnections: ConnectionDto[];
  actionLoading: number | null;
  onAccept: (connectionId: number) => void;
  onReject: (connectionId: number) => void;
}

export default function ConnectionsPendingList({
  pendingConnections,
  actionLoading,
  onAccept,
  onReject,
}: Props) {
  if (pendingConnections.length === 0) {
    return <p className="text-gray-500">No pending connection requests.</p>;
  }

  return (
    <div className="space-y-4">
      {pendingConnections.map((conn) => (
        <div
          key={conn.connectionId}
          className="flex items-center justify-between border rounded-lg p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="font-medium">{conn.userName}</div>
          <div className="flex gap-3">
            <button
              disabled={actionLoading === conn.connectionId}
              onClick={() => onAccept(conn.connectionId)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {actionLoading === conn.connectionId ? "Accepting..." : "Accept"}
            </button>
            <button
              disabled={actionLoading === conn.connectionId}
              onClick={() => onReject(conn.connectionId)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {actionLoading === conn.connectionId ? "Rejecting..." : "Reject"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
