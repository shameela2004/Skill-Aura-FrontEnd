import React, { useEffect, useState } from "react";
import { ConnectionService } from "../../services/ConnectionService";
import Button from "../Ui/Button";

interface Connection {
  connectionId: number;
  userId: number;
  userName: string;
  status: string;
  createdAt: string;
}

const ConnectionsSection: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingConnections, setPendingConnections] = useState<Connection[]>([]);
  const [showList, setShowList] = useState(false);

  const fetchConnections = async () => {
    const res = await ConnectionService.getConnections();
    setConnections(res);
  };

  const fetchPending = async () => {
    const res = await ConnectionService.getPendingConnections();
    setPendingConnections(res);
  };

  useEffect(() => {
    fetchConnections();
    fetchPending();
  }, []);

  const handleAccept = async (id: number) => {
    await ConnectionService.acceptRequest(id);
    fetchConnections();
    fetchPending();
  };

  const handleReject = async (id: number) => {
    await ConnectionService.rejectRequest(id);
    fetchPending();
  };

  const handleDelete = async (id: number) => {
    await ConnectionService.deleteConnection(id);
    fetchConnections();
  };

  return (
    <div className="mt-6 bg-white shadow p-4 rounded-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Connections</h2>
        <button onClick={() => setShowList(!showList)} className="text-blue-600 hover:underline">
          {connections.length} Connections
        </button>
      </div>

      {showList && (
        <div className="mt-4 space-y-3">
          {connections.map((conn) => (
            <div key={conn.connectionId} className="flex justify-between items-center border-b pb-2">
              <span>{conn.userName}</span>
              <Button   onClick={() => handleDelete(conn.connectionId)}>
                Remove
              </Button>
            </div>
          ))}

          {pendingConnections.length > 0 && (
            <>
              <h3 className="text-md font-medium mt-4">Pending Requests</h3>
              {pendingConnections.map((conn) => (
                <div key={conn.connectionId} className="flex justify-between items-center border-b pb-2">
                  <span>{conn.userName}</span>
                  <div className="space-x-2">
                    <Button  onClick={() => handleAccept(conn.connectionId)}>Accept</Button>
                    <Button  onClick={() => handleReject(conn.connectionId)}>Reject</Button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionsSection;
