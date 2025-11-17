import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";
import { useAuth } from "../../../context/AuthContext";

import connection, { onReceiveMessage, startConnection } from "../../../services/ChatService";

interface User {
  id: string;
  name: string;
  profilePictureUrl?: string;
}

interface Message {
  sender: string;
  content: string;
  createdAt?: string;
}

const ChatApp: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { user } = useAuth();
  const loggedInUserId = user?.id?.toString() || "";

  const navigate = useNavigate();
  const { otherUserId } = useParams<{ otherUserId: string }>();

  // ------------------------
  // 1️⃣ Start SignalR
  // ------------------------
  useEffect(() => {
    startConnection().then(() => setConnectionStatus("Connected"));

    connection.onreconnecting(() => setConnectionStatus("Reconnecting..."));
    connection.onreconnected(() => setConnectionStatus("Connected"));
    connection.onclose(() => setConnectionStatus("Disconnected"));
  }, []);

  // ------------------------
  // 2️⃣ Load Users
  // ------------------------
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axiosInstance.get("/user");
        setUsers(res.data.data?.$values || []);
      } catch (err) {
        console.error("Error loading users", err);
      }
    }
    fetchUsers();
  }, []);

  // ------------------------
  // 3️⃣ Select User
  // ------------------------
  useEffect(() => {
    if (!otherUserId || users.length === 0) return;

    const found = users.find((u) => u.id.toString() === otherUserId);
    setSelectedUser(found || null);

    if (!found) setMessages([]);
  }, [otherUserId, users]);

  // ------------------------
  // 4️⃣ Load chat history
  // ------------------------
  useEffect(() => {
    async function loadMessages() {
      if (!selectedUser?.id) {
        setMessages([]);
        return;
      }

      try {
        const res = await axiosInstance.get(`/message/${selectedUser.id}`);
        const formatted = res.data.$values.map((m: any) => ({
          sender: m.fromUserId.toString(),
           content: m.voiceFilePath ?? m.content,   // 👈 FIX: prefer filePath for voice
          createdAt: m.createdAt,
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Error loading messages", err);
      }
    }

    loadMessages();
  }, [selectedUser]);

  // ------------------------
  // 5️⃣ Listen for incoming messages
  // ------------------------
useEffect(() => {

  // TEXT MESSAGES
  const handleText = (senderId: string, text: string) => {
    setMessages(prev => [
      ...prev,
      {
        sender: senderId,
        content: text,
        createdAt: new Date().toISOString()
      }
    ]);
  };

  // VOICE MESSAGES
  const handleVoice = (senderId: string, voiceUrl: string) => {
    setMessages(prev => [
      ...prev,
      {
        sender: senderId,
        content: voiceUrl,         // 👈 same key for text & voice
        createdAt: new Date().toISOString()
      }
    ]);
  };

  connection.on("ReceiveMessage", handleText);
  connection.on("ReceiveVoiceMessage", handleVoice);

  return () => {
    connection.off("ReceiveMessage", handleText);
    connection.off("ReceiveVoiceMessage", handleVoice);
  };

}, []);


  // ------------------------
  // 6️⃣ Auto-scroll
  // ------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ------------------------
  // 7️⃣ Voice Recording
  // ------------------------
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const options = { mimeType: "audio/webm;codecs=opus" };

//       const mediaRecorder = new MediaRecorder(stream, options);
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

//       mediaRecorder.onstop = async () => {
//         mediaRecorder.stream.getTracks().forEach((t) => t.stop());

//         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

//         const formData = new FormData();
//         formData.append("VoiceFile", audioBlob, "recording.webm");

//         const res = await axiosInstance.post("/message/upload-voice", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });

//         const voiceUrl = res.data.filePath; // "/voices/xxx.webm"

//         await connection.invoke("SendMessageToUser", selectedUser?.id, voiceUrl);
//       };

//       mediaRecorderRef.current = mediaRecorder;
//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (err) {
//       console.error("Recording error:", err);
//     }
//   };
const startRecording = async () => {
  console.log("Recording starting...");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Microphone stream:", stream);

    const options = { mimeType: "audio/webm; codecs=opus" };
    const mediaRecorder = new MediaRecorder(stream, options);

    console.log("MediaRecorder created:", mediaRecorder);

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      console.log("Chunk received:", e.data);
      audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      console.log("Recording stopped");

      mediaRecorder.stream.getTracks().forEach((t) => t.stop());

      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      console.log("Final Blob:", audioBlob);

      if (audioBlob.size === 0) {
        console.error("❌ ERROR: Empty audio blob!");
        return;
      }

      const formData = new FormData();
      formData.append("VoiceFile", audioBlob, "recording.webm");

      console.log("Uploading...");

      const res = await axiosInstance.post("/message/upload-voice", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload Result:", res.data);

      const voiceUrl = res.data.filePath;

    //   await connection.invoke("SendVoiceMessage", selectedUser?.id, voiceUrl);
    await connection.invoke(
  "SendVoiceMessage",
  selectedUser?.id,
  voiceUrl 
);

      console.log("Voice message sent:", voiceUrl);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    console.log("Recording started");

    setIsRecording(true);
  } catch (err) {
    console.error("Recording error:", err);
  }
};
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log("MIC OK"))
  .catch(e => console.error("MIC ERROR", e));


  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // ------------------------
  // 8️⃣ Send Text Message
  // ------------------------
  const handleSend = () => {
    if (!input.trim() || !selectedUser?.id) return;

    connection.invoke("SendMessageToUser", selectedUser.id, input);
    setInput("");
  };

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------

  return (
    <div className="flex h-screen">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="w-72 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>

        <ul>
          {users.map((u) => (
            <li
              key={u.id}
              className={`p-2 rounded cursor-pointer flex gap-3 items-center ${
                selectedUser?.id === u.id ? "bg-gray-300" : "hover:bg-gray-200"
              }`}
              onClick={() => navigate(`/chat/${u.id}`)}
            >
              <img
                className="w-10 h-10 rounded-full"
                src={
                  u.profilePictureUrl
                    ? `https://localhost:7027${u.profilePictureUrl}`
                    : "/default-avatar.png"
                }
              />
              {u.name}
            </li>
          ))}
        </ul>

        <div className="mt-4 text-sm">
          Connection:{" "}
          <span
            className={
              connectionStatus === "Connected" ? "text-green-600" : "text-red-500"
            }
          >
            {connectionStatus}
          </span>
        </div>
      </aside>

      {/* ---------------- Chat Window ---------------- */}
      <section className="flex flex-col flex-grow">
        {!selectedUser ? (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        ) : (
          <>
            <header className="p-4 border-b bg-gray-100 font-bold">
              Chatting with {selectedUser.name}
            </header>

            {/* Messages */}
            <main className="flex-grow overflow-y-auto p-4 bg-white space-y-2">
              {messages.map((m, i) => {
                const isMe = m.sender === loggedInUserId;
                const isVoice = m.content.includes("/voices/");

                return (
                  <div
                    key={i}
                    className={`max-w-xs p-2 rounded-lg ${
                      isMe ? "bg-blue-500 text-white ml-auto" : "bg-gray-200"
                    }`}
                  >
                 {isVoice ? (
  <audio controls preload="auto">
    <source src={`https://localhost:7027${m.content}`} type="audio/webm" />
    Your browser does not support the audio element.
  </audio>
) : (
  m.content
)}


                    <small className="text-xs block opacity-70 mt-1">
                      {new Date(m.createdAt!).toLocaleTimeString()}
                    </small>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </main>

            {/* ---------------- Footer ---------------- */}
            <footer className="p-4 border-t bg-gray-100 flex gap-2 items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-grow border rounded px-3 py-2"
                placeholder="Type a message..."
              />

              {!isRecording ? (
                <button
                  className="bg-red-600 text-white px-3 py-2 rounded"
                  onClick={startRecording}
                >
                  🎤
                </button>
              ) : (
                <button
                  className="bg-gray-700 text-white px-3 py-2 rounded animate-pulse"
                  onClick={stopRecording}
                >
                  ⏹
                </button>
              )}

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSend}
              >
                Send
              </button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
};

export default ChatApp;
