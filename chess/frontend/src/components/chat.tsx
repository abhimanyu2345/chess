import React, { useEffect, useState } from 'react';
import { CHAT } from '../constants/Constants';

interface ChatProps {
  socket: WebSocket | null;
  messages: string[];
  setMessages:React.Dispatch<React.SetStateAction<string[]>>;

}

const Chat: React.FC<ChatProps> = ({ socket ,messages,setMessages}) => {
  const [chatMessage, setChatMessage] = useState('');

  


  const sendMessage = () => {
    if (!chatMessage || !socket) return;
    const playerId=localStorage.getItem('playerId');

    // Send message to the server
    const message = JSON.stringify({ type:'chat', ChatContent: chatMessage, playerId:playerId });
    socket.send(message);
    setMessages([...messages, `You: ${chatMessage}`]);
    setChatMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container bg-gray-800 p-4 h-full rounded-md">
      <div className="chat-messages overflow-y-auto max-h-80 mb-2">
        {messages.map((msg, index) => (
          <div key={index} className="message text-white">{msg}</div>
        ))}
      </div>
      <div className="chat-input flex">
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-grow p-2 rounded-md"
          placeholder="Type a message"
        />
        <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white p-2 rounded-md">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
