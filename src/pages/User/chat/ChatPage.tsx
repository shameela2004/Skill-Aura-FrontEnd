import React, { useEffect, useState } from "react";
import { startConnection, sendMessage, onReceiveMessage } from "../../../services/ChatService";
import axiosInstance from "../../../services/axiosInstance";

interface ChatPageProps {
  otherUserId: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ otherUserId }) => {
  const [messages, setMessages] = useState<{ sender: string, content: string }[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function init() {
      startConnection();

      // fetch initial messages with REST API call
      const res = await axiosInstance.get(`/message/${otherUserId}`);
      setMessages(res.data);

      onReceiveMessage((senderUserId, message) => {
        setMessages(prev => [...prev, { sender: senderUserId, content: message }]);
      });
    }
    init();
  }, [otherUserId]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(otherUserId, input);
    setInput("");
  };

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            textAlign: msg.sender === otherUserId ? 'left' : 'right',
            margin: '5px 0'
          }}>
            <b>{msg.sender}:</b> {msg.content}
          </div>
        ))}
      </div>
      <input type="text" value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatPage;
