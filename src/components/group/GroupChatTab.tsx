import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../services/axiosInstance";

// Types
type GroupMember = {
  userId: number;
  name: string;
  avatarUrl?: string;
};

type GroupMessage = {
  id: number;
  groupId: number;
  fromUserId: number;
  content: string;
  filePath?: string;
  createdAt: string;
  fromUser?: { name: string; avatarUrl?: string }; // for ease
};

export default function GroupChatTab({ groupId, userId }: { groupId: number; userId: number }) {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [membersMap, setMembersMap] = useState<Record<number, GroupMember>>({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch members and build map userId -> GroupMember
  useEffect(() => {
    async function fetchMembers() {
      const res = await axiosInstance.get(`/Group/${groupId}/members`);
      const list: any[] = res.data.data.$values?? [];
      const map: Record<number, GroupMember> = {};
      list.forEach((m) => {
        map[m.userId] = {
          userId: m.userId,
         name: m.userName, 
          avatarUrl: m.profilePictureUrl,
        };
      });
      setMembersMap(map);
    }
    fetchMembers();
  }, [groupId]);

  // Fetch messages (polling or on interval; in production use WebSocket/signalR)
  useEffect(() => {
let timer: ReturnType<typeof setInterval>;
    async function fetchMsgs() {
      const res = await axiosInstance.get(`/Group/${groupId}/messages`);
      // .data.data may have $values in EF: check that
      const payload = res.data?.data?.$values ?? res.data?.data ?? [];
      setMessages(payload);
      setLoading(false);
      scrollToBottom();
    }
    fetchMsgs();
    // Poll every 10s
    timer = setInterval(fetchMsgs, 10000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [groupId]);
  // Scroll to bottom on messages change
  function scrollToBottom() {
    setTimeout(() =>
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Send message
  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!newMsg.trim()) return;
    setSending(true);
    try {
      await axiosInstance.post(`/Group/${groupId}/messages`, { content: newMsg });
      setNewMsg("");
      // Optimistically reload
      const res = await axiosInstance.get(`/Group/${groupId}/messages`);
      setMessages(res.data?.data?.$values ?? res.data?.data ?? []);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="flex-1 overflow-y-auto p-4" style={{ background: "#fcfcfc" }}>
        {loading ? (
          <div>Loading messages...</div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-gray-500">No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.fromUserId === userId
                      ? "flex justify-end mb-3"
                      : "flex justify-start mb-3"
                  }
                >
                  <div
                    className={
                      msg.fromUserId === userId
                        ? "bg-indigo-500 text-white px-4 py-2 rounded-lg max-w-lg"
                        : "bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-lg"
                    }
                  >
                    <div className="flex items-center mb-1">
                      {membersMap[msg.fromUserId]?.avatarUrl && (
                        <img
                          src={membersMap[msg.fromUserId].avatarUrl}
                          alt="avatar"
                          className="w-6 h-6 rounded-full mr-2"
                        />
                      )}
                      <span className="text-xs opacity-80">
                        {membersMap[msg.fromUserId]?.name ?? "User #" + msg.fromUserId}
                      </span>
                    </div>
                    <div>{msg.content}</div>
                    <div className="text-xs text-right opacity-50 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef}></div>
          </>
        )}
      </div>
      {/* Message input box */}
      <form onSubmit={handleSend} className="p-4 flex border-t bg-white">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border px-4 py-2 rounded-lg mr-2"
          disabled={sending}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
          disabled={sending || !newMsg.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
