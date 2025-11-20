import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../services/axiosInstance";
import groupChatConnection from "../../services/GroupChatService";

type GroupMember = {
  userId: number;
  name: string;
  avatarUrl?: string;
};

type GroupMessage = {
  id?: number;
  groupId: number;
  fromUserId: number;
  content: string;
  filePath?: string;
  createdAt: string;
};

export default function GroupChatTab({ groupId, userId }: { groupId: number; userId: number }) {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [membersMap, setMembersMap] = useState<Record<number, GroupMember>>({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch group members and build map with avatars
  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await axiosInstance.get(`/Group/${groupId}/members`);
        const list: any[] = res.data.data?.$values ?? [];
        const map: Record<number, GroupMember> = {};
        list.forEach((m) => {
          map[m.userId] = {
            userId: m.userId,
            name: m.userName,
            avatarUrl: m.profilePictureUrl,
          };
        });
        setMembersMap(map);
      } catch (error) {
        console.error("Failed to fetch group members", error);
      }
    }
    fetchMembers();
  }, [groupId]);

  // Load chat history once on mount or group change
  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/Group/${groupId}/messages`);
        const payload = res.data?.data?.$values ?? res.data?.data ?? [];
        setMessages(payload);
      } catch (error) {
        console.error("Failed to load group messages", error);
        setMessages([]);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    }
    fetchMessages();
  }, [groupId]);

  // Setup SignalR group joining and message listening
  useEffect(() => {
    async function initConnection() {
       try {
    if (groupChatConnection.state === "Disconnected") {
      await groupChatConnection.start();
    }
    if (groupChatConnection.state === "Connected") {
      await groupChatConnection.invoke("JoinGroup", groupId);
    } else {
      groupChatConnection.onreconnected(() => groupChatConnection.invoke("JoinGroup", groupId));
    }
  } catch (error) {
    console.error("SignalR group join failed", error);
  }

    }
    initConnection();

    function onReceive(senderUserId: string, content: string, msgGroupId: number, sentAt: string) {
      if (msgGroupId !== groupId) return;
      setMessages((prev) => [
        ...prev,
        {
          fromUserId: parseInt(senderUserId),
          content,
          groupId: msgGroupId,
          createdAt: sentAt,
        },
      ]);
    }
    groupChatConnection.on("ReceiveGroupMessage", onReceive);

    return () => {
      if (groupChatConnection.state === "Connected") {
        groupChatConnection.invoke("LeaveGroup", groupId).catch(console.error);
      }
      groupChatConnection.off("ReceiveGroupMessage", onReceive);
    };
  }, [groupId]);

  // Scroll to bottom helper
  function scrollToBottom() {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message through SignalR
  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!newMsg.trim()) return;
    setSending(true);
    try {
      await groupChatConnection.invoke("SendMessageToGroup", groupId, newMsg);
      setNewMsg("");
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="flex-1 overflow-y-auto p-4" style={{ background: "#fcfcfc" }}>
        {loading ? (
          <div>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-500">No messages yet.</div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.fromUserId === userId;
            const member = membersMap[msg.fromUserId];
            return (
              <div key={i} className={isMe ? "flex justify-end mb-3" : "flex justify-start mb-3"}>
                
                {!isMe && member?.avatarUrl && (
                  <img
                        src={`https://localhost:7027${member.avatarUrl}`}

                    alt={`${member.name} avatar`}
                    className="w-6 h-6 rounded-full mr-2 self-end"
                  />

                )}
                <div
                  className={
                    isMe
                      ? "bg-indigo-500 text-white px-4 py-2 rounded-lg max-w-lg"
                      : "bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-lg"
                  }
                >
                  <div className="flex items-center mb-1">
                    {!isMe && <span className="text-xs opacity-80">{member?.name ?? "User #" + msg.fromUserId}</span>}
                  </div>
                  <div>{msg.content}</div>
                  <div className="text-xs text-right opacity-50 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                {isMe && member?.avatarUrl && (
                  <img
                     src={`https://localhost:7027${member.avatarUrl}`|| "/default-avatar.png"}
                    alt="Your avatar"
                    className="w-6 h-6 rounded-full ml-2 self-end"
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
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
